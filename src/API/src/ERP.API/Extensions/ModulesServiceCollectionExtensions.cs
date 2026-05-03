using Microsoft.Extensions.Configuration;

namespace ERP.API.Extensions
{
    public static class ModulesServiceCollectionExtensions
    {
        public static IServiceCollection RegisterAllModules(this IServiceCollection services, IConfiguration configuration)
        {
            // Register CRM modules here as they are introduced.
            // Example: services.AddLeadsModule(configuration);
            return services;
        }
    }
}
