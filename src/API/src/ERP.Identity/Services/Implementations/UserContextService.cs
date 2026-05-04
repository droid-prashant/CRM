using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Services.Implementations
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public string? GetUserEmail()
        {
            var userEmail = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            return userEmail;
        }

        public Guid? GetUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            if (Guid.TryParse(userIdClaim, out Guid userId))
                return userId;

            return null;
        }

        public string? GetUserName()
        {
            var userName = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
            return userName;
        }

        public IList<string> GetUserPermissions()
        {
            var permissions = _httpContextAccessor.HttpContext?.User?.Claims.Where(c => c.Type == IdentityClaimTypes.Permission).Select(c => c.Value).ToList();
            return permissions ?? new List<string>();
        }

        public IList<string> GetUserRoles()
        {
           var roles = _httpContextAccessor.HttpContext?.User?.Claims.Where(c => c.Type == IdentityClaimTypes.Role).Select(c => c.Value).ToList();
            return roles ?? new List<string>();
        }
    }
}
