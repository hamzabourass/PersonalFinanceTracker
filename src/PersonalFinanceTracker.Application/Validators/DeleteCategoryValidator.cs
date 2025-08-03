using FluentValidation;
using PersonalFinanceTracker.Application.Commands;

namespace PersonalFinanceTracker.Application.Validators;

public class DeleteCategoryValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Category ID is required");
    }
}