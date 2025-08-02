using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Infrastructure.Data;

namespace PersonalFinanceTracker.Infrastructure.Repositories;

public class TransactionRepository : BaseRepository<Transaction>, ITransactionRepository
{
    public TransactionRepository(FinanceDbContext context) : base(context)
    {
    }

    public override async Task<Transaction?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public override async Task<IEnumerable<Transaction>> GetAllAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Category)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Category)
            .Where(t => t.CategoryId == categoryId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Category)
            .Where(t => t.Date >= startDate && t.Date <= endDate)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByTypeAsync(TransactionType type)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Category)
            .Where(t => t.Type == type)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetRecentAsync(int count = 10)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(t => t.Category)
            .OrderByDescending(t => t.Date)
            .Take(count)
            .ToListAsync();
    }
}