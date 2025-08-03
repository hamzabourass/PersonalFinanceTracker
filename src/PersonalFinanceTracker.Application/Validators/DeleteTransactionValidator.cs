using FluentValidation;
using PersonalFinanceTracker.Application.Commands;

namespace PersonalFinanceTracker.Application.Validators;

public class DeleteTransactionValidator : AbstractValidator<DeleteTransactionCommand>
{
    public DeleteTransactionValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Transaction ID is required");
    }
}