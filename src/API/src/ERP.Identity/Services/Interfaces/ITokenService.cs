using ERP.Identity.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ERP.Identity.Services.Interfaces
{
    public interface ITokenService
    {
        public JwtSecurityToken GenerateToken(ApplicationUser user, List<Claim> claims);
    }
}
