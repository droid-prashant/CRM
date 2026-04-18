using ERP.Identity.Constants;
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
            options.AddPolicy("AdminOnly", policy => policy.RequireRole(DefaultRoles.Admin));
            options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole(DefaultRoles.Manager, DefaultRoles.Admin));

            return options;
        }
    }
}
