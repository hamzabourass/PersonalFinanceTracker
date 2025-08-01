namespace PersonalFinanceTracker.Domain.ValueObjects;

public record Money(decimal Amount, string Currency = "USD")
{
    public static Money Zero => new(0);
    
    public static Money operator +(Money left, Money right)
    {
        if (left.Currency != right.Currency)
            throw new InvalidOperationException("Cannot add money with different currencies");
        
        return new Money(left.Amount + right.Amount, left.Currency);
    }
    
    public static Money operator -(Money left, Money right)
    {
        if (left.Currency != right.Currency)
            throw new InvalidOperationException("Cannot subtract money with different currencies");
        
        return new Money(left.Amount - right.Amount, left.Currency);
    }
    
    public bool IsPositive => Amount > 0;
    public bool IsNegative => Amount < 0;
    public bool IsZero => Amount == 0;
}