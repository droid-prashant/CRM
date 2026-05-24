using ERP.Identity.Constants;
using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

            foreach (var roleName in new[] { DefaultRoles.SuperAdmin, DefaultRoles.Admin })
            {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    continue;
                }

                var existingPermissions = (await roleManager.GetClaimsAsync(role))
                    .Where(claim => claim.Type == IdentityClaimTypes.Permission)
                    .Select(claim => claim.Value)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                foreach (var permission in PermissionCatalog.GetFullAccessClaimValues())
                {
                    if (!existingPermissions.Contains(permission))
                    {
                        await roleManager.AddClaimAsync(role, new Claim(IdentityClaimTypes.Permission, permission));
                    }
                }
            }

            var manager = await roleManager.FindByNameAsync(DefaultRoles.Manager);
            if (manager != null)
            {
                var existingPermissions = (await roleManager.GetClaimsAsync(manager))
                    .Where(claim => claim.Type == IdentityClaimTypes.Permission)
                    .Select(claim => claim.Value)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                foreach (var action in new[] { PermissionActions.View, PermissionActions.Create, PermissionActions.Edit, PermissionActions.Delete, PermissionActions.Export })
                {
                    var permission = PermissionCatalog.ToClaimValue(PermissionModules.Partners, action);
                    if (!existingPermissions.Contains(permission))
                    {
                        await roleManager.AddClaimAsync(manager, new Claim(IdentityClaimTypes.Permission, permission));
                    }
                }
            }
        }
    }
}
