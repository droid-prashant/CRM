using ERP.Identity.Constants;
using ERP.Identity.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Services.Implementations
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }
        public JwtSecurityToken GenerateToken(ApplicationUser user, List<Claim> claims)
        {
            var jwtKey = _config["Tokens:JwtKey"];
            var jwtIssuer = _config["Tokens:JwtIssuer"];
            var jwtAudience = _config["Tokens:JwtAudience"];
            var jwtValidMinutes = _config["Tokens:JwtValidMinutes"];
            var token = new JwtSecurityToken();
            if (jwtKey != null && jwtIssuer != null && jwtAudience != null && jwtValidMinutes != null)
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var signingCred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtValidMinutes)),
                signingCredentials: signingCred
                );
            }
            return token;
        }


    }
}
