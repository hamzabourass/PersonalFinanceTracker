using Moq;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.Handlers;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Tests;

public class CreateTransactionHandlerTests
{
    private readonly Mock<ITransactionRepository> _mockTransactionRepo;
    private readonly Mock<ICategoryRepository> _mockCategoryRepo;
    private readonly CreateTransactionHandler _handler;

    public CreateTransactionHandlerTests()
    {
        _mockTransactionRepo = new Mock<ITransactionRepository>();
        _mockCategoryRepo = new Mock<ICategoryRepository>();
        _handler = new CreateTransactionHandler(_mockTransactionRepo.Object, _mockCategoryRepo.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateTransaction()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new Category("Food", TransactionType.Expense, "Food expenses");
        typeof(Category).GetProperty("Id")!.SetValue(category, categoryId);

        var command = new CreateTransactionCommand
        {
            Description = "Lunch",
            Amount = 25.50m,
            Currency = "USD",
            Type = TransactionType.Expense,
            Date = DateTime.UtcNow.AddHours(-1),
            CategoryId = categoryId,
            Notes = "Great meal"
        };

        _mockCategoryRepo.Setup(x => x.GetByIdAsync(categoryId))
            .ReturnsAsync(category);
        
        _mockTransactionRepo.Setup(x => x.AddAsync(It.IsAny<Transaction>()))
            .ReturnsAsync((Transaction t) => t);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(command.Description, result.Description);
        Assert.Equal(command.Amount, result.Amount);
        Assert.Equal(command.Currency, result.Currency);
        Assert.Equal(command.Type, result.Type);
        
        _mockCategoryRepo.Verify(x => x.GetByIdAsync(categoryId), Times.Once);
        _mockTransactionRepo.Verify(x => x.AddAsync(It.IsAny<Transaction>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentCategory_ShouldThrowException()
    {
        // Arrange
        var command = new CreateTransactionCommand
        {
            Description = "Lunch",
            Amount = 25.50m,
            Currency = "USD",
            Type = TransactionType.Expense,
            Date = DateTime.UtcNow.AddHours(-1),
            CategoryId = Guid.NewGuid()
        };

        _mockCategoryRepo.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _handler.Handle(command, CancellationToken.None));
    }
}