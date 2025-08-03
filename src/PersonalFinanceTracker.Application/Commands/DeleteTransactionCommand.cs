using MediatR;

namespace PersonalFinanceTracker.Application.Commands;

public class DeleteTransactionCommand : IRequest<bool>
{
    public Guid Id { get; set; }

    public DeleteTransactionCommand(Guid id)
    {
        Id = id;
    }
}