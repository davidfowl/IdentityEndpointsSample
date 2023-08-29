FROM mcr.microsoft.com/dotnet/sdk:8.0.100-preview.7-alpine3.18 AS build

WORKDIR /app
COPY . ./

RUN dotnet restore

RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/nightly/aspnet:8.0.0-preview.7-alpine3.18

WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "IdentityEndpointsSample.dll"]
