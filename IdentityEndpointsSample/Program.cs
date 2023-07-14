using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication().AddIdentityBearerToken<MyUser>();
builder.Services.AddAuthorizationBuilder();

builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("AppDb"));

builder.Services.AddIdentityCore<MyUser>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddApiEndpoints();

var app = builder.Build();

// Adds /register, /login and /refresh endpoints
app.MapIdentityApi<MyUser>();

app.MapGet("/", (ClaimsPrincipal user) => $"Hello {user.Identity!.Name}").RequireAuthorization();

app.Run();

class MyUser : IdentityUser { }

class AppDbContext : IdentityDbContext<MyUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
