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

    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionCommand command)
    {
        var transaction = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
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
}