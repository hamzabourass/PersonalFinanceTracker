using PersonalFinanceTracker.Domain.Common;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.Events;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Entities;

public class Transaction : BaseEntity
{
    public string Description { get; private set; }
    public Money Amount { get; private set; }
    public TransactionType Type { get; private set; }
    public DateTime Date { get; private set; }
    public Guid CategoryId { get; private set; }
    public string? Notes { get; private set; }
    
    public Category Category { get; private set; }
    
    private Transaction() { }
    
    public Transaction(string description, Money amount, TransactionType type, DateTime date, Guid categoryId, string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Transaction description cannot be empty", nameof(description));
        
        if (description.Length > 200)
            throw new ArgumentException("Transaction description cannot exceed 200 characters", nameof(description));
        
        if (amount.Amount <= 0)
            throw new ArgumentException("Transaction amount must be positive", nameof(amount));
        
        if (date > DateTime.UtcNow)
            throw new ArgumentException("Transaction date cannot be in the future", nameof(date));
        
        if (categoryId == Guid.Empty)
            throw new ArgumentException("Transaction must have a valid category", nameof(categoryId));
        
        Description = description.Trim();
        Amount = amount;
        Type = type;
        Date = date;
        CategoryId = categoryId;
        Notes = notes?.Trim();
        
        AddDomainEvent(new TransactionCreatedEvent(Id, Description, Amount, Type, Date));
    }
    
    public void UpdateDetails(string description, Money amount, DateTime date, string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Transaction description cannot be empty", nameof(description));
        
        if (description.Length > 200)
            throw new ArgumentException("Transaction description cannot exceed 200 characters", nameof(description));
        
        if (amount.Amount <= 0)
            throw new ArgumentException("Transaction amount must be positive", nameof(amount));
        
        if (date > DateTime.UtcNow)
            throw new ArgumentException("Transaction date cannot be in the future", nameof(date));
        
        Description = description.Trim();
        Amount = amount;
        Date = date;
        Notes = notes?.Trim();
        
        MarkAsUpdated();
        AddDomainEvent(new TransactionUpdatedEvent(Id, Description, Amount, Type, Date));
    }
    
    public void ChangeCategory(Guid newCategoryId)
    {
        if (newCategoryId == Guid.Empty)
            throw new ArgumentException("Transaction must have a valid category", nameof(newCategoryId));
        
        var oldCategoryId = CategoryId;
        CategoryId = newCategoryId;
        
        MarkAsUpdated();
        AddDomainEvent(new TransactionCategoryChangedEvent(Id, oldCategoryId, newCategoryId));
    }
}