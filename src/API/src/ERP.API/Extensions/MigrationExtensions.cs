using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

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
            var leadsDbContext = scope.ServiceProvider.GetRequiredService<LeadsDbContext>();
            await leadsDbContext.Database.MigrateAsync();
        }
    }
}
