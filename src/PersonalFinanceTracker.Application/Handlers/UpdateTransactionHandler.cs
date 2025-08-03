using MediatR;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Application.Handlers;

public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand, TransactionDto>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public UpdateTransactionHandler(
        ITransactionRepository transactionRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<TransactionDto> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id);
        if (transaction == null)
            throw new ArgumentException($"Transaction with ID {request.Id} not found");

        // Validate category exists and type matches if category is being changed
        if (request.CategoryId != transaction.CategoryId)
        {
            var newCategory = await _categoryRepository.GetByIdAsync(request.CategoryId);
            if (newCategory == null)
                throw new ArgumentException($"Category with ID {request.CategoryId} not found");

            if (newCategory.Type != transaction.Type)
                throw new ArgumentException($"New category type {newCategory.Type} does not match transaction type {transaction.Type}");

            transaction.ChangeCategory(request.CategoryId);
        }

        var money = new Money(request.Amount, request.Currency);
        transaction.UpdateDetails(request.Description, money, request.Date, request.Notes);

        await _transactionRepository.UpdateAsync(transaction);

        var updatedTransaction = await _transactionRepository.GetByIdAsync(request.Id);

        return new TransactionDto
        {
            Id = updatedTransaction!.Id,
            Description = updatedTransaction.Description,
            Amount = updatedTransaction.Amount.Amount,
            Currency = updatedTransaction.Amount.Currency,
            Type = updatedTransaction.Type,
            Date = updatedTransaction.Date,
            Notes = updatedTransaction.Notes,
            CreatedAt = updatedTransaction.CreatedAt,
            Category = new CategoryDto
            {
                Id = updatedTransaction.Category.Id,
                Name = updatedTransaction.Category.Name,
                Description = updatedTransaction.Category.Description,
                Type = updatedTransaction.Category.Type,
                Color = updatedTransaction.Category.Color,
                CreatedAt = updatedTransaction.Category.CreatedAt
            }
        };
    }
}
