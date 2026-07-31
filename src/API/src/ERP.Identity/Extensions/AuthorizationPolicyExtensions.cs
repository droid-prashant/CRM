using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;

namespace ERP.Identity.Extensions
{
    public static class AuthorizationPolicyExtensions
    {
        public static AuthorizationOptions AddCustomPolicies(this AuthorizationOptions options)
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole(DefaultRoles.Admin, DefaultRoles.SuperAdmin));
            options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole(DefaultRoles.Manager, DefaultRoles.Admin, DefaultRoles.SuperAdmin));

            foreach (var module in PermissionCatalog.GetModules())
            {
                foreach (var action in PermissionActions.All)
                {
                    var permission = PermissionCatalog.ToClaimValue(module.ModuleCode, action);
                    options.AddPolicy(PermissionPolicyNames.For(module.ModuleCode, action), policy =>
                    {
                        policy.RequireAuthenticatedUser();
                        policy.RequireAssertion(context =>
                            context.User.IsInRole(DefaultRoles.Admin)
                            || context.User.IsInRole(DefaultRoles.SuperAdmin)
                            || context.User.HasClaim(IdentityClaimTypes.Permission, permission));
                    });
                }
            }

            return options;
        }
    }
}
