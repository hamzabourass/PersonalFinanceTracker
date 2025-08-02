using MediatR;
using PersonalFinanceTracker.Application.DTOs;

namespace PersonalFinanceTracker.Application.Queries;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public Guid Id { get; set; }

    public GetCategoryByIdQuery(Guid id)
    {
        Id = id;
    }
}