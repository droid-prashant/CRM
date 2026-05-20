using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Opportunities.Application.Repositories;
using Opportunities.Application.Services;
using Opportunities.Infrastructure.Persistence.Data;
using Opportunities.Infrastructure.Repositories;

namespace Opportunities.Infrastructure.Extensions
{
    public static class OpportunitiesServiceCollectionExtensions
    {
        public static IServiceCollection AddOpportunitiesModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<OpportunitiesDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IOpportunityService, OpportunityService>();
            services.AddScoped<IOpportunityRepository, OpportunityRepository>();

            return services;
        }
    }
}
