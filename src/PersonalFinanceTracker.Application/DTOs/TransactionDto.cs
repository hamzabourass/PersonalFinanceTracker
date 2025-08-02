using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}