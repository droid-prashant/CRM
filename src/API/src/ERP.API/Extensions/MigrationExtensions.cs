using Clients.Infrastructure.Persistence.Data;
using Leads.Infrastructure.Persistence.Data;
using Lookups.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Notifications.Infrastructure.Persistence.Data;
using Opportunities.Infrastructure.Persistence.Data;
using Partners.Infrastructure.Persistence.Data;
using Products.Infrastructure.Persistence.Data;

namespace ERP.API.Extensions
{
    public static class MigrationExtensions
    {
        public static async Task ApplyModuleMigrationsAsync(this WebApplication app)
        {
            if (!app.Environment.IsDevelopment())
            {
                return;
            }

            using var scope = app.Services.CreateScope();
            var lookupsDbContext = scope.ServiceProvider.GetRequiredService<LookupsDbContext>();
            await lookupsDbContext.Database.MigrateAsync();

            var clientsDbContext = scope.ServiceProvider.GetRequiredService<ClientsDbContext>();
            await clientsDbContext.Database.MigrateAsync();

            var leadsDbContext = scope.ServiceProvider.GetRequiredService<LeadsDbContext>();
            await leadsDbContext.Database.MigrateAsync();

            var productsDbContext = scope.ServiceProvider.GetRequiredService<ProductsDbContext>();
            await productsDbContext.Database.MigrateAsync();

            var partnersDbContext = scope.ServiceProvider.GetRequiredService<PartnersDbContext>();
            await partnersDbContext.Database.MigrateAsync();

            var opportunitiesDbContext = scope.ServiceProvider.GetRequiredService<OpportunitiesDbContext>();
            await opportunitiesDbContext.Database.MigrateAsync();

            var notificationsDbContext = scope.ServiceProvider.GetRequiredService<NotificationsDbContext>();
            await notificationsDbContext.Database.MigrateAsync();
        }
    }
}
