using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Commands;

public class CreateTransactionCommand : IRequest<TransactionDto>
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; }
    public Guid CategoryId { get; set; }
    public string? Notes { get; set; }
}