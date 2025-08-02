using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Data;

namespace PersonalFinanceTracker.Infrastructure.Repositories;

public class BudgetRepository : BaseRepository<Budget>, IBudgetRepository
{
    public BudgetRepository(FinanceDbContext context) : base(context)
    {
    }

    public override async Task<Budget?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public override async Task<IEnumerable<Budget>> GetAllAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .Include(b => b.Category)
            .OrderByDescending(b => b.Year)
            .ThenByDescending(b => b.Month)
            .ToListAsync();
    }

    public async Task<Budget?> GetByCategoryAndPeriodAsync(Guid categoryId, int year, int month)
    {
        return await _dbSet
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Year == year && b.Month == month);
    }

    public async Task<IEnumerable<Budget>> GetByPeriodAsync(int year, int month)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(b => b.Category)
            .Where(b => b.Year == year && b.Month == month)
            .OrderBy(b => b.Category.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Budget>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(b => b.Category)
            .Where(b => b.CategoryId == categoryId)
            .OrderByDescending(b => b.Year)
            .ThenByDescending(b => b.Month)
            .ToListAsync();
    }
}