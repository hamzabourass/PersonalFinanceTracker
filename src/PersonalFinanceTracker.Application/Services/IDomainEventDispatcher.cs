using PersonalFinanceTracker.Domain.Events;

namespace PersonalFinanceTracker.Application.Services;

public interface IDomainEventDispatcher
{
    Task DispatchEventsAsync(IEnumerable<IDomainEvent> events, CancellationToken cancellationToken = default);
}