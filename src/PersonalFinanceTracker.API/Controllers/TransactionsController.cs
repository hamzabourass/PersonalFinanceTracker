using MediatR;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.Queries;

namespace PersonalFinanceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions([FromQuery] GetTransactionsQuery query)
    {
        var transactions = await _mediator.Send(query);
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransactionById(Guid id)
    {
        var query = new GetTransactionByIdQuery(id);
        var transaction = await _mediator.Send(query);
        
        if (transaction == null)
            return NotFound($"Transaction with ID {id} not found");
            
        return Ok(transaction);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionCommand command)
    {
        try
        {
            var transaction = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] UpdateTransactionCommand command)
    {
        if (id != command.Id)
            return BadRequest("Route ID does not match command ID");

        try
        {
            var transaction = await _mediator.Send(command);
            return Ok(transaction);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        try
        {
            var command = new DeleteTransactionCommand(id);
            var result = await _mediator.Send(command);
            
            if (result)
                return NoContent();
            
            return NotFound($"Transaction with ID {id} not found");
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}