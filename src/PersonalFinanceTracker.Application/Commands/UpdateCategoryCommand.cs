using MediatR;
using PersonalFinanceTracker.Application.DTOs;

namespace PersonalFinanceTracker.Application.Commands;

public class UpdateCategoryCommand : IRequest<CategoryDto>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Color { get; set; } = "#6366f1";
}