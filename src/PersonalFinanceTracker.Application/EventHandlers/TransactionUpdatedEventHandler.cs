using MediatR;
using Microsoft.Extensions.Logging;
using PersonalFinanceTracker.Domain.Events;

namespace PersonalFinanceTracker.Application.EventHandlers;

public class TransactionUpdatedEventHandler : INotificationHandler<TransactionUpdatedEvent>
{
    private readonly ILogger<TransactionUpdatedEventHandler> _logger;

    public TransactionUpdatedEventHandler(ILogger<TransactionUpdatedEventHandler> logger)
    {
        _logger = logger;
    }

    public async Task Handle(TransactionUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Transaction updated: {TransactionId} - {Description} for {Amount} {Currency}",
            notification.TransactionId,
            notification.Description,
            notification.Amount.Amount,
            notification.Amount.Currency);

        await Task.CompletedTask;
    }
}