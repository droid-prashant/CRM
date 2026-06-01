using Clients.Infrastructure.Persistence.Data;
using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
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
        }
    }
}
