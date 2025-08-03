using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PersonalFinanceTracker.Application.Behaviors;
using PersonalFinanceTracker.Application.Services;
using System.Reflection;

namespace PersonalFinanceTracker.Application;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => 
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(assembly);

        services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();
        return services;
    }
}