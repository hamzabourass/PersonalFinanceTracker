using MediatR;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;

namespace PersonalFinanceTracker.Application.Handlers;

public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.Id} not found");

        var existingCategory = await _categoryRepository.GetByNameAsync(request.Name);
        if (existingCategory != null && existingCategory.Id != request.Id)
            throw new ArgumentException($"Category with name '{request.Name}' already exists");

        category.UpdateDetails(request.Name, request.Description, request.Color);
        
        await _categoryRepository.UpdateAsync(category);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Type = category.Type,
            Color = category.Color,
            CreatedAt = category.CreatedAt
        };
    }
}