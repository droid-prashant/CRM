using ERP.Identity.Constants;
using ERP.Identity.Entities;
using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.VIewModel;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace ERP.Identity.Services.Implementations
{
    internal class IdentityService : IIdentityService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public IdentityService(
            RoleManager<ApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IConfiguration configuration)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenService = tokenService;
        }
        public async Task CreateRoleAsync(UserRoleDto userRoleDto, CancellationToken cancellationToken)
        {
            try
            {

                IdentityResult finalResult = new IdentityResult();
                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    ApplicationRole appRole = new ApplicationRole
                    {
                        Name = userRoleDto.RoleName,
                        Description = userRoleDto.Description
                    };
                    IdentityResult result = await _roleManager.CreateAsync(appRole);
                    if (result.Succeeded)
                    {
                        ApplicationRole? role = await _roleManager.FindByNameAsync(userRoleDto.RoleName);
                        if (role != null)
                        {
                            foreach (var permission in userRoleDto.UserPermissions)
                            {
                                if (Enum.IsDefined(typeof(Permission), permission.PermissionValue))
                                {
                                    Claim claim = new Claim(IdentityClaimTypes.Permission, permission.PermissionValue.ToString());
                                    finalResult = await _roleManager.AddClaimAsync(role, claim);
                                }
                            }
                        }
                    }
                    scope.Complete();
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task CreateUserAsync(RegisterUserDto userDto, CancellationToken cancellationToken)
        {
            IdentityResult finalResult = new IdentityResult();
            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))

            {
                ApplicationUser appUser = new ApplicationUser
                {
                    FullName = userDto.FullName,
                    UserName = userDto.UserName,
                    Address = userDto.Address,
                    Email = userDto.Email,
                    IsActive = true
                };
                IdentityResult user = await _userManager.CreateAsync(appUser);
                if (user.Succeeded)
                {
                    IdentityResult addPasswordHash = await _userManager.AddPasswordAsync(appUser, userDto.Password);
                    if (addPasswordHash.Succeeded)
                    {
                        finalResult = await _userManager.AddToRolesAsync(appUser, userDto.Roles);
                    }
                }
                scope.Complete();
            }
        }

        public async Task<LoginResponseViewModel> LoginUserAsync(LoginRequestDto loginUserDto, CancellationToken cancellationToken)
        {
            var identityUser = await _userManager.FindByNameAsync(loginUserDto.UserName);
            if (identityUser == null)
            {
                return new LoginResponseViewModel { Error = "User does not exist", StatusCode = 401, Succeded = false };
            }
            else if (identityUser.IsActive == false)
            {
                return new LoginResponseViewModel { Error = "User is deactivated", StatusCode = 401, Succeded = false };
            }
            else
            {
                var result = await _signInManager.CheckPasswordSignInAsync(identityUser, loginUserDto.Password, true);
                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        identityUser.IsActive = false;
                        return new LoginResponseViewModel { Error = "Your account has been locked, please contact the admin", StatusCode = 401, Succeded = false };
                    }
                    identityUser.AccessFailedCount++;
                    return new LoginResponseViewModel { Error = "Credential is invalid", StatusCode = 401, Succeded = false };
                }
                else
                {
                    List<Claim> claims = await ConstructUserClaimAsync(identityUser);
                    var tokenResult =  _tokenService.GenerateToken(identityUser, claims);
                    LoginResponseViewModel tokenResultViewModel = new LoginResponseViewModel
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(tokenResult),
                        Expiration = tokenResult.ValidTo,
                        StatusCode = 200,
                        Succeded = true
                    };
                    return tokenResultViewModel;
                }
            }
        }

        private async Task<List<Claim>> ConstructUserClaimAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            List<Claim> assignedRoles = roles.Select(role => new Claim(IdentityClaimTypes.Role, role)).ToList();
            List<Claim> userClaims = (await _userManager.GetClaimsAsync(user)).ToList();
            List<Claim> claims = userClaims.Union(assignedRoles).ToList();

            foreach (var role in roles)
            {
                ApplicationRole? appRole = await _roleManager.FindByNameAsync(role);
                if (appRole != null)
                {
                    IList<Claim> roleClaims = await _roleManager.GetClaimsAsync(appRole);
                    claims = claims.Union(roleClaims).ToList();
                }
            }

            claims = new List<Claim>(claims)
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name,user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "")
            };
            return claims;
        }
    }
}
