using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Commands;

public class CreateCategoryCommand : IRequest<CategoryDto>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TransactionType Type { get; set; }
    public string Color { get; set; } = "#6366f1";
}