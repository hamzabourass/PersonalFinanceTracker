using MediatR;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.DTOs;
using PersonalFinanceTracker.Application.Interfaces;
using PersonalFinanceTracker.Domain.Entities;

namespace PersonalFinanceTracker.Application.Handlers;

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCategoryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var existingCategory = await _categoryRepository.GetByNameAsync(request.Name);
        if (existingCategory != null)
            throw new ArgumentException($"Category with name '{request.Name}' already exists");

        var category = new Category(
            request.Name,
            request.Type,
            request.Description,
            request.Color);

        var createdCategory = await _categoryRepository.AddAsync(category);

        return new CategoryDto
        {
            Id = createdCategory.Id,
            Name = createdCategory.Name,
            Description = createdCategory.Description,
            Type = createdCategory.Type,
            Color = createdCategory.Color,
            CreatedAt = createdCategory.CreatedAt
        };
    }
}