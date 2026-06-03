using Dashboard.Application.Services;
using Dashboard.Infrastructure.Persistence;
using Dashboard.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Dashboard.Infrastructure.Extensions
{
    public static class DashboardServiceCollectionExtensions
    {
        public static IServiceCollection AddDashboardModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DashboardDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IDashboardService, DashboardService>();
            return services;
        }
    }
}
