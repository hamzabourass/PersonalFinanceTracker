using PersonalFinanceTracker.Domain.Common;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.Events;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Entities;

public class Budget : BaseEntity
{
    public Guid CategoryId { get; private set; }
    public Money Limit { get; private set; }
    public int Year { get; private set; }
    public int Month { get; private set; }
    public Money Spent { get; private set; }
    
    public Category Category { get; private set; }
    
    private Budget() { }
    
    public Budget(Guid categoryId, Money limit, int year, int month)
    {
        if (categoryId == Guid.Empty)
            throw new ArgumentException("Budget must have a valid category", nameof(categoryId));
        
        if (limit.Amount <= 0)
            throw new ArgumentException("Budget limit must be positive", nameof(limit));
        
        if (year < 2000 || year > 2100)
            throw new ArgumentException("Year must be between 2000 and 2100", nameof(year));
        
        if (month < 1 || month > 12)
            throw new ArgumentException("Month must be between 1 and 12", nameof(month));
        
        CategoryId = categoryId;
        Limit = limit;
        Year = year;
        Month = month;
        Spent = Money.Zero;
        
        AddDomainEvent(new BudgetCreatedEvent(Id, CategoryId, Limit, Year, Month));
    }
    
    public void UpdateLimit(Money newLimit)
    {
        if (newLimit.Amount <= 0)
            throw new ArgumentException("Budget limit must be positive", nameof(newLimit));
        
        if (newLimit.Currency != Limit.Currency)
            throw new ArgumentException("Cannot change budget currency", nameof(newLimit));
        
        var oldLimit = Limit;
        Limit = newLimit;
        
        MarkAsUpdated();
        AddDomainEvent(new BudgetLimitUpdatedEvent(Id, oldLimit, newLimit));
        
        CheckBudgetStatus();
    }
    
    public void AddExpense(Money amount)
    {
        if (amount.Currency != Spent.Currency)
            throw new ArgumentException("Expense currency must match budget currency", nameof(amount));
        
        Spent += amount;
        MarkAsUpdated();
        
        CheckBudgetStatus();
    }
    
    public void SubtractExpense(Money amount)
    {
        if (amount.Currency != Spent.Currency)
            throw new ArgumentException("Expense currency must match budget currency", nameof(amount));
        
        Spent -= amount;
        
        if (Spent.Amount < 0)
            Spent = Money.Zero;
        
        MarkAsUpdated();
    }
    
    public Money Remaining => Limit - Spent;
    public decimal PercentageUsed => Limit.Amount == 0 ? 0 : (Spent.Amount / Limit.Amount) * 100;
    public bool IsOverBudget => Spent.Amount > Limit.Amount;
    public bool IsNearLimit => PercentageUsed >= 80 && !IsOverBudget;
    
    private void CheckBudgetStatus()
    {
        if (IsOverBudget)
        {
            AddDomainEvent(new BudgetExceededEvent(Id, CategoryId, Limit, Spent, Year, Month));
        }
        else if (IsNearLimit)
        {
            AddDomainEvent(new BudgetNearLimitEvent(Id, CategoryId, Limit, Spent, Year, Month));
        }
    }
}