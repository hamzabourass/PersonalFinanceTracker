using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Tests;

public class TransactionTests
{
    [Fact]
    public void CreateTransaction_WithValidData_ShouldCreateSuccessfully()
    {
        // Arrange
        var description = "Test transaction";
        var amount = new Money(100.00m, "USD");
        var type = TransactionType.Expense;
        var date = DateTime.UtcNow.AddDays(-1);
        var categoryId = Guid.NewGuid();

        // Act
        var transaction = new Transaction(description, amount, type, date, categoryId);

        // Assert
        Assert.Equal(description, transaction.Description);
        Assert.Equal(amount, transaction.Amount);
        Assert.Equal(type, transaction.Type);
        Assert.Equal(date, transaction.Date);
        Assert.Equal(categoryId, transaction.CategoryId);
        Assert.True(transaction.Id != Guid.Empty);
        Assert.True(transaction.CreatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void CreateTransaction_WithEmptyDescription_ShouldThrowException()
    {
        // Arrange
        var amount = new Money(100.00m, "USD");
        var type = TransactionType.Expense;
        var date = DateTime.UtcNow.AddDays(-1);
        var categoryId = Guid.NewGuid();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => 
            new Transaction("", amount, type, date, categoryId));
    }

    [Fact]
    public void CreateTransaction_WithNegativeAmount_ShouldThrowException()
    {
        // Arrange
        var description = "Test transaction";
        var amount = new Money(-100.00m, "USD");
        var type = TransactionType.Expense;
        var date = DateTime.UtcNow.AddDays(-1);
        var categoryId = Guid.NewGuid();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => 
            new Transaction(description, amount, type, date, categoryId));
    }

    [Fact]
    public void CreateTransaction_WithFutureDate_ShouldThrowException()
    {
        // Arrange
        var description = "Test transaction";
        var amount = new Money(100.00m, "USD");
        var type = TransactionType.Expense;
        var date = DateTime.UtcNow.AddDays(1); // Future date
        var categoryId = Guid.NewGuid();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => 
            new Transaction(description, amount, type, date, categoryId));
    }

    [Fact]
    public void UpdateTransaction_WithValidData_ShouldUpdateSuccessfully()
    {
        // Arrange
        var transaction = new Transaction(
            "Original description",
            new Money(100.00m, "USD"),
            TransactionType.Expense,
            DateTime.UtcNow.AddDays(-1),
            Guid.NewGuid());

        var newDescription = "Updated description";
        var newAmount = new Money(200.00m, "USD");
        var newDate = DateTime.UtcNow.AddDays(-2);

        // Act
        transaction.UpdateDetails(newDescription, newAmount, newDate, "Updated notes");

        // Assert
        Assert.Equal(newDescription, transaction.Description);
        Assert.Equal(newAmount, transaction.Amount);
        Assert.Equal(newDate, transaction.Date);
        Assert.Equal("Updated notes", transaction.Notes);
        Assert.NotNull(transaction.UpdatedAt);
    }
}