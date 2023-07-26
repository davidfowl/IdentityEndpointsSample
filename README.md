# Background

https://devblogs.microsoft.com/dotnet/improvements-auth-identity-aspnetcore-8/

In .NET 8 preview 6, we've added new APIs to allow exposing endpoints to register, login and refresh bearer tokens. This is a simple API
that returns tokens (or sets cookies) that is optimized usage with 1st party applications (no delegated authentication). The tokens are self contained, and generated using the 
same technique as cookie authentication. **These are NOT JWTs**, they are self-contained tokens. To make issued tokens work across servers, [data protection](https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/overview?view=aspnetcore-7.0) needs to be configured
with shared storage.

## New APIs

There are 2 new concepts being introduced:

1. A new [bearer token authentication handler](https://github.com/dotnet/aspnetcore/blob/bad855959a99257bc6f194dd19ecd6c9aeb03acb/src/Security/Authentication/BearerToken/src/BearerTokenExtensions.cs#L24). This authentication handler supports token validation and issuing and integrates
with the normal ASP.NET Core authentication system. It can be used standalone without identity.
    - ASP.NET Core Identity builds on top of this authentication handler and exposes an [AddIdentityBearerToken](https://github.com/dotnet/aspnetcore/blob/579d547d708eb19f8b05b00f5386649d6dac7b6a/src/Identity/Core/src/IdentityAuthenticationBuilderExtensions.cs#L20).
2. [A set of HTTP endpoints](https://github.com/dotnet/aspnetcore/blob/bad855959a99257bc6f194dd19ecd6c9aeb03acb/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs#L32) for registering a new user, exchanging credentials for a token/cookie and refreshing tokens using the identity APIs.

These new building blocks make it easier to build authenticated 1st party applications (applications that don't delegate authentication).
