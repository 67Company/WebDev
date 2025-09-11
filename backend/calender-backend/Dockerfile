# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file, restore with caching
COPY calender-backend.csproj ./
RUN dotnet restore ./calender-backend.csproj

# Copy the rest and publish
COPY . .
RUN dotnet publish ./calender-backend.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
COPY --from=build /app/publish .
# IMPORTANT: replace calender-backend.dll if your project name differs
ENTRYPOINT ["dotnet", "calender-backend.dll"]