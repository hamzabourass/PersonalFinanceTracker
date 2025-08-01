using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Domain.Events;

public record BudgetCreatedEvent(
    Guid BudgetId,
    Guid CategoryId,
    Money Limit,
    int Year,
    int Month) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record BudgetLimitUpdatedEvent(
    Guid BudgetId,
    Money OldLimit,
    Money NewLimit) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record BudgetExceededEvent(
    Guid BudgetId,
    Guid CategoryId,
    Money Limit,
    Money Spent,
    int Year,
    int Month) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record BudgetNearLimitEvent(
    Guid BudgetId,
    Guid CategoryId,
    Money Limit,
    Money Spent,
    int Year,
    int Month) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}