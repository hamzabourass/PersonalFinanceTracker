using MediatR;
using Microsoft.Extensions.Logging;
using PersonalFinanceTracker.Domain.Events;

namespace PersonalFinanceTracker.Application.EventHandlers;

public class TransactionCategoryChangedEventHandler : INotificationHandler<TransactionCategoryChangedEvent>
{
    private readonly ILogger<TransactionCategoryChangedEventHandler> _logger;

    public TransactionCategoryChangedEventHandler(ILogger<TransactionCategoryChangedEventHandler> logger)
    {
        _logger = logger;
    }

    public async Task Handle(TransactionCategoryChangedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Transaction category changed: {TransactionId} moved from category {OldCategoryId} to {NewCategoryId}",
            notification.TransactionId,
            notification.OldCategoryId,
            notification.NewCategoryId);
            
        await Task.CompletedTask;
    }
}