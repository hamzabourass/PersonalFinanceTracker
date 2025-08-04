using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.Events;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Tests;

public class TransactionDomainEventsTests
{
    [Fact]
    public void CreateTransaction_ShouldRaiseTransactionCreatedEvent()
    {
        // Arrange
        var description = "Grocery shopping";
        var amount = new Money(150.75m, "USD");
        var type = TransactionType.Expense;
        var date = DateTime.UtcNow.AddDays(-1);
        var categoryId = Guid.NewGuid();
        var notes = "Weekly groceries";

        // Act
        var transaction = new Transaction(description, amount, type, date, categoryId, notes);

        // Assert
        Assert.Single(transaction.DomainEvents);
        
        var domainEvent = transaction.DomainEvents.First();
        Assert.IsType<TransactionCreatedEvent>(domainEvent);
        
        var createdEvent = (TransactionCreatedEvent)domainEvent;
        Assert.Equal(transaction.Id, createdEvent.TransactionId);
        Assert.Equal(description, createdEvent.Description);
        Assert.Equal(amount, createdEvent.Amount);
        Assert.Equal(type, createdEvent.Type);
        Assert.Equal(date, createdEvent.Date);
        Assert.NotEqual(Guid.Empty, createdEvent.Id);
        Assert.True(createdEvent.OccurredAt <= DateTime.UtcNow);
    }

    [Fact]
    public void UpdateTransactionDetails_ShouldRaiseTransactionUpdatedEvent()
    {
        // Arrange
        var transaction = new Transaction(
            "Original description",
            new Money(100.00m, "USD"),
            TransactionType.Expense,
            DateTime.UtcNow.AddDays(-2),
            Guid.NewGuid(),
            "Original notes");

        transaction.ClearDomainEvents();

        var updatedDescription = "Updated description";
        var updatedAmount = new Money(175.50m, "USD");
        var updatedDate = DateTime.UtcNow.AddDays(-1);
        var updatedNotes = "Updated notes";

        // Act
        transaction.UpdateDetails(updatedDescription, updatedAmount, updatedDate, updatedNotes);

        // Assert
        Assert.Single(transaction.DomainEvents);
        
        var domainEvent = transaction.DomainEvents.First();
        Assert.IsType<TransactionUpdatedEvent>(domainEvent);
        
        var updatedEvent = (TransactionUpdatedEvent)domainEvent;
        Assert.Equal(transaction.Id, updatedEvent.TransactionId);
        Assert.Equal(updatedDescription, updatedEvent.Description);
        Assert.Equal(updatedAmount, updatedEvent.Amount);
        Assert.Equal(TransactionType.Expense, updatedEvent.Type);
        Assert.Equal(updatedDate, updatedEvent.Date);
        Assert.NotEqual(Guid.Empty, updatedEvent.Id);
        Assert.True(updatedEvent.OccurredAt <= DateTime.UtcNow);
    }

    [Fact]
    public void ChangeCategory_ShouldRaiseTransactionCategoryChangedEvent()
    {
        // Arrange
        var originalCategoryId = Guid.NewGuid();
        var newCategoryId = Guid.NewGuid();
        
        var transaction = new Transaction(
            "Test transaction",
            new Money(100.00m, "USD"),
            TransactionType.Expense,
            DateTime.UtcNow.AddDays(-1),
            originalCategoryId,
            "Test notes");

        transaction.ClearDomainEvents();

        // Act
        transaction.ChangeCategory(newCategoryId);

        // Assert
        Assert.Single(transaction.DomainEvents);
        
        var domainEvent = transaction.DomainEvents.First();
        Assert.IsType<TransactionCategoryChangedEvent>(domainEvent);
        
        var categoryChangedEvent = (TransactionCategoryChangedEvent)domainEvent;
        Assert.Equal(transaction.Id, categoryChangedEvent.TransactionId);
        Assert.Equal(originalCategoryId, categoryChangedEvent.OldCategoryId);
        Assert.Equal(newCategoryId, categoryChangedEvent.NewCategoryId);
        Assert.NotEqual(Guid.Empty, categoryChangedEvent.Id);
        Assert.True(categoryChangedEvent.OccurredAt <= DateTime.UtcNow);
    }


}