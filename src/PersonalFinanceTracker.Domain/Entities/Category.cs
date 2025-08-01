using PersonalFinanceTracker.Domain.Common;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public TransactionType Type { get; private set; }
    public string Color { get; private set; }
    
    private Category() { }
    
    public Category(string name, TransactionType type, string? description = null, string color = "#6366f1")
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty", nameof(name));
        
        if (name.Length > 50)
            throw new ArgumentException("Category name cannot exceed 50 characters", nameof(name));
        
        Name = name.Trim();
        Type = type;
        Description = description?.Trim();
        Color = color;
    }
    
    public void UpdateDetails(string name, string? description = null, string? color = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty", nameof(name));
        
        if (name.Length > 50)
            throw new ArgumentException("Category name cannot exceed 50 characters", nameof(name));
        
        Name = name.Trim();
        Description = description?.Trim();
        
        if (!string.IsNullOrWhiteSpace(color))
            Color = color;
        
        MarkAsUpdated();
    }
}