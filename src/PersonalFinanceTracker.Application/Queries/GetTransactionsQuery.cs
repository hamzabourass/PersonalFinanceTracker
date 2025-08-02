using MediatR;
using PersonalFinanceTracker.Application.DTOs;

namespace PersonalFinanceTracker.Application.Queries;

public class GetTransactionsQuery : IRequest<IEnumerable<TransactionDto>>
{
    public int? Take { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? CategoryId { get; set; }
}