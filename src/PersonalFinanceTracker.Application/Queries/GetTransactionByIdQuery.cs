using MediatR;
using PersonalFinanceTracker.Application.DTOs;

namespace PersonalFinanceTracker.Application.Queries;

public class GetTransactionByIdQuery : IRequest<TransactionDto?>
{
    public Guid Id { get; set; }

    public GetTransactionByIdQuery(Guid id)
    {
        Id = id;
    }
}