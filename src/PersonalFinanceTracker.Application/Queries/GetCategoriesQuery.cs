using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Domain.Enums;

namespace PersonalFinanceTracker.Application.Queries;

public class GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
    public TransactionType? Type { get; set; }
}