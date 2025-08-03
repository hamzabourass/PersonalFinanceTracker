// Replace src/PersonalFinanceTracker.Infrastructure/FinanceDbContext.cs
using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Application.Services;
using PersonalFinanceTracker.Domain.Common;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Data.Configurations;

namespace PersonalFinanceTracker.Infrastructure.Data;

public class FinanceDbContext : DbContext
{
    private readonly IDomainEventDispatcher? _domainEventDispatcher;

    public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
    {
    }

    public FinanceDbContext(
        DbContextOptions<FinanceDbContext> options, 
        IDomainEventDispatcher domainEventDispatcher) : base(options)
    {
        _domainEventDispatcher = domainEventDispatcher;
    }
    
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Budget> Budgets { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new TransactionConfiguration());
        modelBuilder.ApplyConfiguration(new BudgetConfiguration());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entitiesWithEvents = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = entitiesWithEvents
            .SelectMany(e => e.DomainEvents)
            .ToList();

        foreach (var entity in entitiesWithEvents)
        {
            entity.ClearDomainEvents();
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        if (_domainEventDispatcher != null && domainEvents.Any())
        {
            await _domainEventDispatcher.DispatchEventsAsync(domainEvents, cancellationToken);
        }

        return result;
    }
}