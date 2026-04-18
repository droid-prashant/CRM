using ERP.Identity.Constants;
using ERP.Identity.Entities;
using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.Requests;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Model.VIewModel;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace ERP.Identity.Services.Implementations
{
    public class IdentityService : IIdentityService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly IUserContextService _userContextService;

        public IdentityService(
            RoleManager<ApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IConfiguration configuration,
            IUserContextService userContextService)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenService = tokenService;
            _userContextService = userContextService;
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

        public async Task<List<UserListItemViewModel>> GetUsersAsync(CancellationToken cancellationToken)
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserListItemViewModel>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserListItemViewModel
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    Roles = roles.ToList(),
                    IsActive = user.IsActive
                });
            }

            return result;
        }

        public async Task<UserDetailViewModel> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDetailViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Username = user.UserName ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                DepartmentId = user.DepartmentId,
                ManagerId = user.ManagerId,
                Roles = roles.ToList(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedOn
            };
        }

        public async Task<UserDetailViewModel> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken)
        {
            if (!request.GeneratePassword && string.IsNullOrEmpty(request.Password))
                throw new ArgumentException("Password is required when GeneratePassword is false.");

            var existingByEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingByEmail != null)
                throw new InvalidOperationException($"Email '{request.Email}' is already in use.");

            var existingByUsername = await _userManager.FindByNameAsync(request.Username);
            if (existingByUsername != null)
                throw new InvalidOperationException($"Username '{request.Username}' is already in use.");

            if (!request.RoleIds.Any())
                throw new ArgumentException("At least one role is required.");

            var roleNames = new List<string>();
            foreach (var roleId in request.RoleIds)
            {
                var role = await _roleManager.FindByIdAsync(roleId.ToString());
                if (role == null)
                    throw new KeyNotFoundException($"Role with ID '{roleId}' does not exist.");
                if (!role.IsActive)
                    throw new InvalidOperationException($"Role '{role.Name}' is not active and cannot be assigned.");
                roleNames.Add(role.Name!);
            }

            var password = request.GeneratePassword ? GenerateSecurePassword() : request.Password!;

            var currentUserId = _userContextService.GetUserId() ?? Guid.Empty;

            var appUser = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                FullName = $"{request.FirstName} {request.LastName}",
                Address = string.Empty,
                IsActive = true,
                ForcePasswordChange = request.GeneratePassword,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = currentUserId
            };

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var createResult = await _userManager.CreateAsync(appUser, password);
                if (!createResult.Succeeded)
                    throw new InvalidOperationException($"Failed to create user: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");

                var rolesResult = await _userManager.AddToRolesAsync(appUser, roleNames);
                if (!rolesResult.Succeeded)
                    throw new InvalidOperationException($"Failed to assign roles: {string.Join(", ", rolesResult.Errors.Select(e => e.Description))}");

                scope.Complete();
            }

            return new UserDetailViewModel
            {
                Id = appUser.Id,
                FullName = appUser.FullName,
                Email = appUser.Email ?? string.Empty,
                Username = appUser.UserName ?? string.Empty,
                Roles = roleNames,
                IsActive = appUser.IsActive,
                CreatedAt = appUser.CreatedOn
            };
        }

        public async Task<UserDetailViewModel> UpdateUserAsync(Guid userId, UpdateUserRequest request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");

            if (request.ManagerId.HasValue)
            {
                var manager = await _userManager.FindByIdAsync(request.ManagerId.Value.ToString());
                if (manager == null)
                    throw new KeyNotFoundException($"Manager user with ID '{request.ManagerId}' does not exist.");
            }

            user.FullName = $"{request.FirstName} {request.LastName}";
            user.PhoneNumber = request.PhoneNumber;
            user.DepartmentId = request.DepartmentId;
            user.ManagerId = request.ManagerId;
            user.IsActive = request.IsActive;
            user.UpdatedOn = DateTime.UtcNow;
            user.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDetailViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Username = user.UserName ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                DepartmentId = user.DepartmentId,
                ManagerId = user.ManagerId,
                Roles = roles.ToList(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedOn
            };
        }

        public async Task ActivateUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");

            if (user.IsActive)
                return;

            user.IsActive = true;
            user.UpdatedOn = DateTime.UtcNow;
            user.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to activate user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        public async Task DeactivateUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");

            if (!user.IsActive)
                return;

            var isAdmin = await _userManager.IsInRoleAsync(user, DefaultRoles.Admin);
            if (isAdmin)
            {
                var allAdmins = await _userManager.GetUsersInRoleAsync(DefaultRoles.Admin);
                var activeAdminCount = allAdmins.Count(u => u.IsActive);

                if (activeAdminCount <= 1)
                    throw new InvalidOperationException("Cannot deactivate the last active administrator. Assign another administrator before deactivating this account.");
            }

            user.IsActive = false;
            user.UpdatedOn = DateTime.UtcNow;
            user.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to deactivate user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        private static string GenerateSecurePassword()
        {
            const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            const string lower = "abcdefghijkmnopqrstuvwxyz";
            const string digits = "23456789";
            const string all = upper + lower + digits;

            using (var rng = RandomNumberGenerator.Create())
            {
                var bytes = new byte[12];
                rng.GetBytes(bytes);
                var chars = bytes.Select(b => all[b % all.Length]).ToArray();

                chars[0] = upper[bytes[0] % upper.Length];
                chars[1] = lower[bytes[1] % lower.Length];
                chars[2] = digits[bytes[2] % digits.Length];

                return new string(chars);
            }
        }

        public async Task<List<RoleListItemViewModel>> GetRolesAsync(CancellationToken cancellationToken)
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var result = new List<RoleListItemViewModel>();

            foreach (var role in roles)
            {
                var users = await _userManager.GetUsersInRoleAsync(role.Name ?? string.Empty);
                result.Add(new RoleListItemViewModel
                {
                    Id = role.Id,
                    Name = role.Name ?? string.Empty,
                    Code = role.Code,
                    Description = role.Description,
                    IsSystemRole = role.IsSystemRole,
                    IsActive = role.IsActive,
                    UserCount = users.Count,
                    CreatedAt = role.CreatedOn
                });
            }

            return result;
        }

        public async Task<RoleDetailViewModel> GetRoleByIdAsync(Guid roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            var users = await _userManager.GetUsersInRoleAsync(role.Name ?? string.Empty);
            var linkedUsers = users.Select(u => new RoleUserListItemViewModel
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email ?? string.Empty,
                IsActive = u.IsActive
            }).ToList();

            return new RoleDetailViewModel
            {
                Id = role.Id,
                Name = role.Name ?? string.Empty,
                Code = role.Code,
                Description = role.Description,
                IsSystemRole = role.IsSystemRole,
                IsActive = role.IsActive,
                UserCount = users.Count,
                LinkedUsers = linkedUsers,
                CreatedAt = role.CreatedOn,
                CreatedBy = role.CreatedBy,
                UpdatedAt = role.UpdatedOn,
                UpdatedBy = role.UpdatedBy
            };
        }

        public async Task<RoleDetailViewModel> CreateRoleAsync(CreateRoleRequest request, CancellationToken cancellationToken)
        {
            var existingByName = await _roleManager.FindByNameAsync(request.Name);
            if (existingByName != null)
                throw new InvalidOperationException($"Role name '{request.Name}' already exists.");

            if (!string.IsNullOrEmpty(request.Code))
            {
                var existingByCode = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Code == request.Code);
                if (existingByCode != null)
                    throw new InvalidOperationException($"Role code '{request.Code}' already exists.");
            }

            var currentUserId = _userContextService.GetUserId() ?? Guid.Empty;

            var role = new ApplicationRole
            {
                Name = request.Name,
                Code = request.Code,
                Description = request.Description,
                IsSystemRole = request.IsSystemRole,
                IsActive = request.IsActive,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = currentUserId
            };

            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to create role: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            return new RoleDetailViewModel
            {
                Id = role.Id,
                Name = role.Name ?? string.Empty,
                Code = role.Code,
                Description = role.Description,
                IsSystemRole = role.IsSystemRole,
                IsActive = role.IsActive,
                UserCount = 0,
                CreatedAt = role.CreatedOn,
                CreatedBy = role.CreatedBy
            };
        }

        public async Task<RoleDetailViewModel> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            if (role.Name != request.Name)
            {
                var existingByName = await _roleManager.FindByNameAsync(request.Name);
                if (existingByName != null)
                    throw new InvalidOperationException($"Role name '{request.Name}' already exists.");
            }

            if (!string.IsNullOrEmpty(request.Code) && role.Code != request.Code)
            {
                var existingByCode = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Code == request.Code && r.Id != roleId);
                if (existingByCode != null)
                    throw new InvalidOperationException($"Role code '{request.Code}' already exists.");
            }

            role.Name = request.Name;
            role.Code = request.Code;
            role.Description = request.Description;
            role.IsActive = request.IsActive;
            role.UpdatedOn = DateTime.UtcNow;
            role.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to update role: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            var users = await _userManager.GetUsersInRoleAsync(role.Name ?? string.Empty);
            var linkedUsers = users.Select(u => new RoleUserListItemViewModel
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email ?? string.Empty,
                IsActive = u.IsActive
            }).ToList();

            return new RoleDetailViewModel
            {
                Id = role.Id,
                Name = role.Name ?? string.Empty,
                Code = role.Code,
                Description = role.Description,
                IsSystemRole = role.IsSystemRole,
                IsActive = role.IsActive,
                UserCount = users.Count,
                LinkedUsers = linkedUsers,
                CreatedAt = role.CreatedOn,
                CreatedBy = role.CreatedBy,
                UpdatedAt = role.UpdatedOn,
                UpdatedBy = role.UpdatedBy
            };
        }

        public async Task ActivateRoleAsync(Guid roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            if (role.IsActive)
                return;

            role.IsActive = true;
            role.UpdatedOn = DateTime.UtcNow;
            role.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to activate role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        public async Task DeactivateRoleAsync(Guid roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            if (!role.IsActive)
                return;

            if (role.IsSystemRole)
                throw new InvalidOperationException("Cannot deactivate a system role.");

            role.IsActive = false;
            role.UpdatedOn = DateTime.UtcNow;
            role.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to deactivate role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        public async Task<List<RoleUserListItemViewModel>> GetRoleUsersAsync(Guid roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            var users = await _userManager.GetUsersInRoleAsync(role.Name ?? string.Empty);
            return users.Select(u => new RoleUserListItemViewModel
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email ?? string.Empty,
                IsActive = u.IsActive
            }).ToList();
        }
    }
}
