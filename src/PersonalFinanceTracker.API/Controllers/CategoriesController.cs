using MediatR;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.Queries;

namespace PersonalFinanceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories([FromQuery] GetCategoriesQuery query)
    {
        var categories = await _mediator.Send(query);
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var query = new GetCategoryByIdQuery(id);
        var category = await _mediator.Send(query);
        
        if (category == null)
            return NotFound($"Category with ID {id} not found");
            
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryCommand command)
    {
        var category = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
    }
}