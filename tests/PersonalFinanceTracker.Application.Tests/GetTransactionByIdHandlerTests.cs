using Moq;
using PersonalFinanceTracker.Application.Handlers;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Application.Queries;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Application.Tests;

public class GetTransactionByIdHandlerTests
{
    private readonly Mock<ITransactionRepository> _mockTransactionRepo;
    private readonly GetTransactionByIdHandler _handler;

    public GetTransactionByIdHandlerTests()
    {
        _mockTransactionRepo = new Mock<ITransactionRepository>();
        _handler = new GetTransactionByIdHandler(_mockTransactionRepo.Object);
    }

    [Fact]
    public async Task Handle_WithExistingTransaction_ShouldReturnTransactionDto()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        
        var category = new Category("Food", TransactionType.Expense, "Food expenses");
        typeof(Category).GetProperty("Id")!.SetValue(category, categoryId);

        var transaction = new Transaction(
            "Lunch at restaurant",
            new Money(25.50m, "USD"),
            TransactionType.Expense,
            DateTime.UtcNow.AddHours(-1),
            categoryId,
            "Great meal");
            
        typeof(Transaction).GetProperty("Id")!.SetValue(transaction, transactionId);
        typeof(Transaction).GetProperty("Category")!.SetValue(transaction, category);

        var query = new GetTransactionByIdQuery(transactionId);

        _mockTransactionRepo.Setup(x => x.GetByIdAsync(transactionId))
            .ReturnsAsync(transaction);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(transactionId, result.Id);
        Assert.Equal("Lunch at restaurant", result.Description);
        Assert.Equal(25.50m, result.Amount);
        Assert.Equal("USD", result.Currency);
        Assert.Equal(TransactionType.Expense, result.Type);
        Assert.Equal("Great meal", result.Notes);
        Assert.NotNull(result.Category);
        Assert.Equal("Food", result.Category.Name);
        
        _mockTransactionRepo.Verify(x => x.GetByIdAsync(transactionId), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentTransaction_ShouldReturnNull()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var query = new GetTransactionByIdQuery(transactionId);

        _mockTransactionRepo.Setup(x => x.GetByIdAsync(transactionId))
            .ReturnsAsync((Transaction?)null);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(result);
        
        _mockTransactionRepo.Verify(x => x.GetByIdAsync(transactionId), Times.Once);
    }
}