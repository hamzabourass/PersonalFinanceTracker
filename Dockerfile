FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY src/PersonalFinanceTracker.Domain/PersonalFinanceTracker.Domain.csproj src/PersonalFinanceTracker.Domain/
COPY src/PersonalFinanceTracker.Application/PersonalFinanceTracker.Application.csproj src/PersonalFinanceTracker.Application/
COPY src/PersonalFinanceTracker.Infrastructure/PersonalFinanceTracker.Infrastructure.csproj src/PersonalFinanceTracker.Infrastructure/
COPY src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj src/PersonalFinanceTracker.API/

# Restore dependencies for API project only
RUN dotnet restore src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj

# Copy the source code (excluding tests)
COPY src/ src/

# Build the application
RUN dotnet build src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj -c Release --no-restore

# Publish the application
RUN dotnet publish src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj -c Release -o /app/publish --no-restore

# Use the official .NET 9 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy the published application
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["dotnet", "PersonalFinanceTracker.API.dll"]