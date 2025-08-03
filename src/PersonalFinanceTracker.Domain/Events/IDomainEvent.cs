namespace PersonalFinanceTracker.Domain.Events;
using MediatR;

public interface IDomainEvent : INotification
{
    Guid Id { get; }
    DateTime OccurredAt { get; }
}