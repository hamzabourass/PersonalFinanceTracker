using MediatR;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Application.Queries;

namespace PersonalFinanceTracker.Application.Handlers;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategoriesHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<Domain.Entities.Category> categories;

        if (request.Type.HasValue)
        {
            categories = await _categoryRepository.GetByTypeAsync(request.Type.Value);
        }
        else
        {
            categories = await _categoryRepository.GetAllAsync();
        }

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Type = c.Type,
            Color = c.Color,
            CreatedAt = c.CreatedAt
        });
    }
}