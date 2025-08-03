using MediatR;
using PersonalFinanceTracker.Application.Commands;
using PersonalFinanceTracker.Application.Interfaces;

namespace PersonalFinanceTracker.Application.Handlers;

public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ITransactionRepository _transactionRepository;

    public DeleteCategoryHandler(
        ICategoryRepository categoryRepository,
        ITransactionRepository transactionRepository)
    {
        _categoryRepository = categoryRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.Id} not found");

        var transactions = await _transactionRepository.GetByCategoryIdAsync(request.Id);
        if (transactions.Any())
            throw new InvalidOperationException($"Cannot delete category '{category.Name}' because it has associated transactions. Please reassign or delete the transactions first.");

        await _categoryRepository.DeleteAsync(category);
        return true;
    }
}