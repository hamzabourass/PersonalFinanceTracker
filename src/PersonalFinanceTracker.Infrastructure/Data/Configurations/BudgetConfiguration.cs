using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Infrastructure.Data.Configurations;

public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.ToTable("Budgets");
        
        builder.HasKey(b => b.Id);
        
        builder.Property(b => b.CategoryId)
            .IsRequired();
        
        builder.OwnsOne(b => b.Limit, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("LimitAmount")
                .IsRequired()
                .HasPrecision(18, 2);
            
            money.Property(m => m.Currency)
                .HasColumnName("LimitCurrency")
                .IsRequired()
                .HasMaxLength(3);
        });
        
        builder.OwnsOne(b => b.Spent, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("SpentAmount")
                .IsRequired()
                .HasPrecision(18, 2);
            
            money.Property(m => m.Currency)
                .HasColumnName("SpentCurrency")
                .IsRequired()
                .HasMaxLength(3);
        });
        
        builder.Property(b => b.Year)
            .IsRequired();
        
        builder.Property(b => b.Month)
            .IsRequired();
        
        builder.Property(b => b.CreatedAt)
            .IsRequired();
        
        builder.Property(b => b.UpdatedAt);
        
        builder.HasOne(b => b.Category)
            .WithMany()
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(b => new { b.CategoryId, b.Year, b.Month })
            .IsUnique();
    }
}