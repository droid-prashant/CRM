using Lookups.Application.Repositories;
using Lookups.Application.Services;
using Lookups.Infrastructure.Persistence.Data;
using Lookups.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Lookups.Infrastructure.Extensions
{
    public static class LookupsServiceCollectionExtensions
    {
        public static IServiceCollection AddLookupsModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<LookupsDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ILookupService, LookupService>();
            services.AddScoped<ILookupRepository, LookupRepository>();

            return services;
        }
    }
}
