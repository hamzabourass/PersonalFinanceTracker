using Moq;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.Handlers;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Tests;

public class CreateCategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> _mockCategoryRepo;
    private readonly CreateCategoryHandler _handler;

    public CreateCategoryHandlerTests()
    {
        _mockCategoryRepo = new Mock<ICategoryRepository>();
        _handler = new CreateCategoryHandler(_mockCategoryRepo.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateCategory()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Groceries",
            Description = "Food and household items",
            Type = TransactionType.Expense,
            Color = "#4ade80"
        };

        _mockCategoryRepo.Setup(x => x.GetByNameAsync(command.Name))
            .ReturnsAsync((Category?)null);
        
        _mockCategoryRepo.Setup(x => x.AddAsync(It.IsAny<Category>()))
            .ReturnsAsync((Category c) => c);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(command.Name, result.Name);
        Assert.Equal(command.Description, result.Description);
        Assert.Equal(command.Type, result.Type);
        Assert.Equal(command.Color, result.Color);
        Assert.True(result.Id != Guid.Empty);
        
        _mockCategoryRepo.Verify(x => x.GetByNameAsync(command.Name), Times.Once);
        _mockCategoryRepo.Verify(x => x.AddAsync(It.IsAny<Category>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithDuplicateName_ShouldThrowException()
    {
        // Arrange
        var existingCategory = new Category("Groceries", TransactionType.Expense);
        
        var command = new CreateCategoryCommand
        {
            Name = "Groceries",
            Type = TransactionType.Expense
        };

        _mockCategoryRepo.Setup(x => x.GetByNameAsync(command.Name))
            .ReturnsAsync(existingCategory);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            _handler.Handle(command, CancellationToken.None));
            
        Assert.Contains("already exists", exception.Message);
        
        _mockCategoryRepo.Verify(x => x.GetByNameAsync(command.Name), Times.Once);
        _mockCategoryRepo.Verify(x => x.AddAsync(It.IsAny<Category>()), Times.Never);
    }
}