using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Domain.Enums;
using PersonalFinanceTracker.Domain.ValueObjects;

namespace PersonalFinanceTracker.Infrastructure.Data.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");
        
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.OwnsOne(t => t.Amount, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("Amount")
                .IsRequired()
                .HasPrecision(18, 2);
            
            money.Property(m => m.Currency)
                .HasColumnName("Currency")
                .IsRequired()
                .HasMaxLength(3);
        });
        
        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<int>();
        
        builder.Property(t => t.Date)
            .IsRequired();
        
        builder.Property(t => t.CategoryId)
            .IsRequired();
        
        builder.Property(t => t.Notes)
            .HasMaxLength(500);
        
        builder.Property(t => t.CreatedAt)
            .IsRequired();
        
        builder.Property(t => t.UpdatedAt);
        
        builder.HasOne(t => t.Category)
            .WithMany()
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(t => t.Date);
        builder.HasIndex(t => t.CategoryId);
    }
}