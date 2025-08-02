using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Application.Queries;

namespace PersonalFinanceTracker.Application.Handlers;

public class GetTransactionsHandler : IRequestHandler<GetTransactionsQuery, IEnumerable<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionsHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<IEnumerable<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<Domain.Entities.Transaction> transactions;

        if (request.CategoryId.HasValue)
        {
            transactions = await _transactionRepository.GetByCategoryIdAsync(request.CategoryId.Value);
        }
        else if (request.StartDate.HasValue && request.EndDate.HasValue)
        {
            transactions = await _transactionRepository.GetByDateRangeAsync(request.StartDate.Value, request.EndDate.Value);
        }
        else if (request.Take.HasValue)
        {
            transactions = await _transactionRepository.GetRecentAsync(request.Take.Value);
        }
        else
        {
            transactions = await _transactionRepository.GetAllAsync();
        }

        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Description = t.Description,
            Amount = t.Amount.Amount,
            Currency = t.Amount.Currency,
            Type = t.Type,
            Date = t.Date,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt,
            Category = new CategoryDto
            {
                Id = t.Category.Id,
                Name = t.Category.Name,
                Description = t.Category.Description,
                Type = t.Category.Type,
                Color = t.Category.Color,
                CreatedAt = t.Category.CreatedAt
            }
        });
    }
}