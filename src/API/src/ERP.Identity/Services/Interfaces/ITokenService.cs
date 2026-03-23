using ERP.Identity.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Services.Interfaces
{
    public interface ITokenService
    {
        public JwtSecurityToken GenerateToken(ApplicationUser user, List<Claim> claims);
    }
}
