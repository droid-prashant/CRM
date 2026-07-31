using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ERP.Identity.Seed
{
    public class SeedData
    {
        public static async Task InitializeDefaultData(IHost host)
        {
            var scopeFactory = host.Services.GetService<IServiceScopeFactory>();
            if (scopeFactory != null)
            {
                using (var scope = scopeFactory.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    try
                    {
                        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
                        await RoleSeeder.SeedRolesAsync(roleManager);
                        await IdentitySeeder.SeedIdentityAsync(roleManager, userManager);
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }
    }
}
