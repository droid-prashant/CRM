using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Extensions
{
    public static class AuthorizationPolicyExtensions
    {
        public static AuthorizationOptions AddCustomPolicies(this AuthorizationOptions options)
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole("Manager", "Admin"));

            return options;
        }
    }
}
