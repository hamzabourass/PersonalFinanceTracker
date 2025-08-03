using FluentValidation;
using PersonalFinanceTracker.Application.Commands;

namespace PersonalFinanceTracker.Application.Validators;

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Category name is required")
            .MaximumLength(50)
            .WithMessage("Category name cannot exceed 50 characters");

        RuleFor(x => x.Description)
            .MaximumLength(200)
            .WithMessage("Description cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Color)
            .NotEmpty()
            .WithMessage("Color is required")
            .Matches("^#[0-9A-Fa-f]{6}$")
            .WithMessage("Color must be a valid hex color (e.g., #ff6b6b)");
    }
}
