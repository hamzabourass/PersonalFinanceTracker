using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Commands;

public class UpdateTransactionCommand : IRequest<TransactionDto>
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime Date { get; set; }
    public Guid CategoryId { get; set; }
    public string? Notes { get; set; }
}