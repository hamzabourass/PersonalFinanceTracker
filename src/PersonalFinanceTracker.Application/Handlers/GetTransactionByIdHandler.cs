using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Application.Queries;

namespace PersonalFinanceTracker.Application.Handlers;

public class GetTransactionByIdHandler : IRequestHandler<GetTransactionByIdQuery, TransactionDto?>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionByIdHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<TransactionDto?> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id);

        if (transaction == null)
            return null;

        return new TransactionDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount.Amount,
            Currency = transaction.Amount.Currency,
            Type = transaction.Type,
            Date = transaction.Date,
            Notes = transaction.Notes,
            CreatedAt = transaction.CreatedAt,
            Category = new CategoryDto
            {
                Id = transaction.Category.Id,
                Name = transaction.Category.Name,
                Description = transaction.Category.Description,
                Type = transaction.Category.Type,
                Color = transaction.Category.Color,
                CreatedAt = transaction.Category.CreatedAt
            }
        };
    }
}