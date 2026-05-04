using ERP.Identity.Constants;
using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity;

namespace ERP.Identity.Seed
{
    public static class IdentitySeeder
    {
        public static async Task SeedIdentityAsync(RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            var userName = "IntelliSyncAdmin";
            var adminEmail = "intellisync@gmail.com";

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = userName,
                    Email = adminEmail,
                    Address = "Headquater",
                    FullName = "Intellisync Super Admin",
                    IsActive = true,
                    ForcePasswordChange = false,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = Guid.Empty
                };

                var result = await userManager.CreateAsync(adminUser, "IntelliSyncAdmin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, DefaultRoles.SuperAdmin);
                }
            }
        }
    }
}
