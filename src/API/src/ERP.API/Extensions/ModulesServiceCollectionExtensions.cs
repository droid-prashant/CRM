using Leads.Infrastructure.Extensions;
using Microsoft.Extensions.Configuration;

namespace ERP.API.Extensions
{
    public static class ModulesServiceCollectionExtensions
    {
        public static IServiceCollection RegisterAllModules(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddLeadsModule(configuration);

            return services;
        }
    }
}
