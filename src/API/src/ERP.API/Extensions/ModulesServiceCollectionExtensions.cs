using Clients.Infrastructure.Extensions;
using Dashboard.Infrastructure.Extensions;
using Leads.Infrastructure.Extensions;
using Notifications.Infrastructure.Extensions;
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
            services.AddDashboardModule(configuration);
            services.AddPartnersModule(configuration);
            services.AddLeadsModule(configuration);
            services.AddProductsModule(configuration);
            services.AddOpportunitiesModule(configuration);
            services.AddNotificationsModule(configuration);

            return services;
        }
    }
}
