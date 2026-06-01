using Clients.Infrastructure.Extensions;
using Leads.Infrastructure.Extensions;
using Microsoft.Extensions.Configuration;
using Opportunities.Infrastructure.Extensions;
using Partners.Infrastructure.Extensions;
using Products.Infrastructure.Extensions;

namespace ERP.API.Extensions
{
    public static class ModulesServiceCollectionExtensions
    {
        public static IServiceCollection RegisterAllModules(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddClientsModule(configuration);
            services.AddPartnersModule(configuration);
            services.AddLeadsModule(configuration);
            services.AddProductsModule(configuration);
            services.AddOpportunitiesModule(configuration);

            return services;
        }
    }
}
