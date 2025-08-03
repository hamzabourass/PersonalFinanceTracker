using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(FinanceDbContext context)
    {
        if (context.Categories.Any() || context.Transactions.Any())
        {
            return;
        }

        var salaryCategory = new Category("Salary", TransactionType.Income, "Monthly salary and bonuses", "#10b981");
        var freelanceCategory = new Category("Freelance", TransactionType.Income, "Freelance work and consulting", "#059669");
        var investmentCategory = new Category("Investments", TransactionType.Income, "Dividends and investment returns", "#047857");

        var groceriesCategory = new Category("Groceries", TransactionType.Expense, "Food and household items", "#ef4444");
        var transportCategory = new Category("Transport", TransactionType.Expense, "Gas, public transport, parking", "#dc2626");
        var utilitiesCategory = new Category("Utilities", TransactionType.Expense, "Electricity, water, internet", "#b91c1c");
        var entertainmentCategory = new Category("Entertainment", TransactionType.Expense, "Movies, dining out, hobbies", "#991b1b");
        var healthcareCategory = new Category("Healthcare", TransactionType.Expense, "Medical expenses and insurance", "#7f1d1d");
        var shoppingCategory = new Category("Shopping", TransactionType.Expense, "Clothes, electronics, misc items", "#450a0a");

        var categories = new[] 
        { 
            salaryCategory, freelanceCategory, investmentCategory,
            groceriesCategory, transportCategory, utilitiesCategory, 
            entertainmentCategory, healthcareCategory, shoppingCategory 
        };

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();

        var transactions = new List<Transaction>();
        var random = new Random(42); 

        var incomeTransactions = new[]
        {
            new Transaction("Monthly Salary - January", new Money(5500.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-65), salaryCategory.Id, "Regular monthly salary payment"),
            new Transaction("Monthly Salary - February", new Money(5500.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-35), salaryCategory.Id, "Regular monthly salary payment"),
            new Transaction("Monthly Salary - March", new Money(5500.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-5), salaryCategory.Id, "Regular monthly salary payment"),
            new Transaction("Website Development Project", new Money(1200.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-45), freelanceCategory.Id, "Completed e-commerce website for client"),
            new Transaction("Mobile App Consulting", new Money(800.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-25), freelanceCategory.Id, "iOS app consultation and code review"),
            new Transaction("Stock Dividends - Q1", new Money(320.00m, "USD"), TransactionType.Income, DateTime.UtcNow.AddDays(-15), investmentCategory.Id, "Quarterly dividend payment"),
        };

        var expenseTransactions = new[]
        {
            new Transaction("Weekly Groceries", new Money(127.45m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-2), groceriesCategory.Id, "Whole Foods weekly shopping"),
            new Transaction("Grocery Shopping", new Money(89.32m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-9), groceriesCategory.Id, "Trader Joe's and local market"),
            new Transaction("Costco Bulk Shopping", new Money(245.67m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-16), groceriesCategory.Id, "Monthly bulk shopping at Costco"),
            new Transaction("Farmers Market", new Money(42.50m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-23), groceriesCategory.Id, "Fresh vegetables and fruits"),

            new Transaction("Gas Station Fill-up", new Money(65.40m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-1), transportCategory.Id, "Shell gas station"),
            new Transaction("Monthly Parking Pass", new Money(120.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-8), transportCategory.Id, "Downtown parking garage monthly pass"),
            new Transaction("Uber Rides", new Money(28.75m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-12), transportCategory.Id, "Airport ride and city trips"),
            new Transaction("Car Maintenance", new Money(285.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-20), transportCategory.Id, "Oil change and tire rotation"),

            new Transaction("Electricity Bill - March", new Money(142.30m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-3), utilitiesCategory.Id, "Monthly electricity bill"),
            new Transaction("Internet & Cable", new Money(89.99m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-5), utilitiesCategory.Id, "Comcast monthly service"),
            new Transaction("Water & Sewer", new Money(67.45m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-10), utilitiesCategory.Id, "Municipal water service"),
            new Transaction("Phone Bill", new Money(55.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-7), utilitiesCategory.Id, "Verizon wireless plan"),

            new Transaction("Netflix Subscription", new Money(15.99m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-4), entertainmentCategory.Id, "Monthly streaming subscription"),
            new Transaction("Dinner at Italian Restaurant", new Money(78.50m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-6), entertainmentCategory.Id, "Date night at Mario's"),
            new Transaction("Movie Theater", new Money(32.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-11), entertainmentCategory.Id, "Two tickets for latest Marvel movie"),
            new Transaction("Concert Tickets", new Money(165.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-18), entertainmentCategory.Id, "Rock concert at Madison Square Garden"),

            new Transaction("Dental Cleaning", new Money(180.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-14), healthcareCategory.Id, "Routine dental checkup and cleaning"),
            new Transaction("Prescription Medication", new Money(45.20m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-21), healthcareCategory.Id, "Monthly prescription refill"),
            new Transaction("Health Insurance Premium", new Money(320.00m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-30), healthcareCategory.Id, "Monthly health insurance payment"),

            new Transaction("New Winter Jacket", new Money(129.99m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-17), shoppingCategory.Id, "North Face jacket from REI"),
            new Transaction("Amazon Prime Order", new Money(67.85m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-13), shoppingCategory.Id, "Books, cables, and household items"),
            new Transaction("Target Shopping", new Money(94.32m, "USD"), TransactionType.Expense, DateTime.UtcNow.AddDays(-19), shoppingCategory.Id, "Clothing and home goods"),
        };

        transactions.AddRange(incomeTransactions);
        transactions.AddRange(expenseTransactions);

        context.Transactions.AddRange(transactions);
        await context.SaveChangesAsync();
    }
}