using ERP.Identity.Constants;
using ERP.Identity.Entities;
using ERP.Identity.Persistance.Data;
using ERP.Identity.Services.Implementations;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace ERP.Identity.Extensions
{
    public static class IdentityServiceCollectionExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<IdentityDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddEntityFrameworkStores<IdentityDbContext>()
            .AddDefaultTokenProviders();

            var jwtKey = configuration["Tokens:JwtKey"];
            var jwtIssuer = configuration["Tokens:JwtIssuer"];
            var jwtAudience = configuration["Tokens:JwtAudience"];

            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException("JWT key is not configured.");
            }

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    NameClaimType = ClaimTypes.NameIdentifier,
                    RoleClaimType = IdentityClaimTypes.Role
                };
            });

            services.AddScoped<ITokenService, TokenService>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddScoped<IIdentityService, IdentityService>();

            return services;
        }
    }
}
