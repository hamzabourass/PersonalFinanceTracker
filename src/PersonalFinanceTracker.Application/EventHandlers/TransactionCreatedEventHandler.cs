using MediatR;
using Microsoft.Extensions.Logging;
using PersonalFinanceTracker.Domain.Events;

namespace PersonalFinanceTracker.Application.EventHandlers;

public class TransactionCreatedEventHandler : INotificationHandler<TransactionCreatedEvent>
{
    private readonly ILogger<TransactionCreatedEventHandler> _logger;

    public TransactionCreatedEventHandler(ILogger<TransactionCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public async Task Handle(TransactionCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Transaction created: {TransactionId} - {Description} for {Amount} {Currency} ({Type})",
            notification.TransactionId,
            notification.Description,
            notification.Amount.Amount,
            notification.Amount.Currency,
            notification.Type);
            
        await Task.CompletedTask;
    }
}