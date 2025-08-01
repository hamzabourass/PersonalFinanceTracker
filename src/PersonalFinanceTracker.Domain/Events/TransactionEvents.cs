using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Events;

public record TransactionCreatedEvent(
    Guid TransactionId,
    string Description,
    Money Amount,
    TransactionType Type,
    DateTime Date) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record TransactionUpdatedEvent(
    Guid TransactionId,
    string Description,
    Money Amount,
    TransactionType Type,
    DateTime Date) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record TransactionCategoryChangedEvent(
    Guid TransactionId,
    Guid OldCategoryId,
    Guid NewCategoryId) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}