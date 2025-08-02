using MediatR;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Application.Handlers;

public class CreateTransactionHandler : IRequestHandler<CreateTransactionCommand, TransactionDto>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public CreateTransactionHandler(
        ITransactionRepository transactionRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<TransactionDto> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.CategoryId} not found");

        if (category.Type != request.Type)
            throw new ArgumentException($"Transaction type {request.Type} does not match category type {category.Type}");

        var money = new Money(request.Amount, request.Currency);
        
        var transaction = new Transaction(
            request.Description,
            money,
            request.Type,
            request.Date,
            request.CategoryId,
            request.Notes);

        var createdTransaction = await _transactionRepository.AddAsync(transaction);

        return new TransactionDto
        {
            Id = createdTransaction.Id,
            Description = createdTransaction.Description,
            Amount = createdTransaction.Amount.Amount,
            Currency = createdTransaction.Amount.Currency,
            Type = createdTransaction.Type,
            Date = createdTransaction.Date,
            Notes = createdTransaction.Notes,
            CreatedAt = createdTransaction.CreatedAt,
            Category = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Type = category.Type,
                Color = category.Color,
                CreatedAt = category.CreatedAt
            }
        };
    }
}