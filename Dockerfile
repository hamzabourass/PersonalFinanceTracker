FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY src/PersonalFinanceTracker.Domain/PersonalFinanceTracker.Domain.csproj src/PersonalFinanceTracker.Domain/
COPY src/PersonalFinanceTracker.Application/PersonalFinanceTracker.Application.csproj src/PersonalFinanceTracker.Application/
COPY src/PersonalFinanceTracker.Infrastructure/PersonalFinanceTracker.Infrastructure.csproj src/PersonalFinanceTracker.Infrastructure/
COPY src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj src/PersonalFinanceTracker.API/

RUN dotnet restore src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj

COPY src/ src/

RUN dotnet build src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj -c Release --no-restore

RUN dotnet publish src/PersonalFinanceTracker.API/PersonalFinanceTracker.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "PersonalFinanceTracker.API.dll"]