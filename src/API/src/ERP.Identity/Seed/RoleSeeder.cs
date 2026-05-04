using ERP.Identity.Constants;
using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Seed
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager)
        {
            var roles = new List<ApplicationRole>
            {
                new ApplicationRole { Name = DefaultRoles.SuperAdmin, Description = "Software owner and production support administrator", IsSystemRole = true },
                new ApplicationRole { Name = DefaultRoles.Admin, Description = "Client administrator with user management access", IsSystemRole = true },
                new ApplicationRole { Name = DefaultRoles.Manager, Description = "Manager with limited access", IsSystemRole = true },
                new ApplicationRole { Name = DefaultRoles.User, Description = "Regular user with basic access", IsSystemRole = true }
            };
            foreach (var role in roles)
            {
                if (!string.IsNullOrWhiteSpace(role.Name) && !await roleManager.RoleExistsAsync(role.Name))
                {
                    await roleManager.CreateAsync(role);
                }
            }
        }
    }
}
