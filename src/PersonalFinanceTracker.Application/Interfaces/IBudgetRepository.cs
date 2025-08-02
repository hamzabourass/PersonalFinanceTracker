using PersonalFinanceTracker.Domain.Entities;

namespace PersonalFinanceTracker.Application.Interfaces;

public interface IBudgetRepository : IBaseRepository<Budget>
{
    Task<Budget?> GetByCategoryAndPeriodAsync(Guid categoryId, int year, int month);
    Task<IEnumerable<Budget>> GetByPeriodAsync(int year, int month);
    Task<IEnumerable<Budget>> GetByCategoryIdAsync(Guid categoryId);
}
