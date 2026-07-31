using ERP.Identity.Constants;
using ERP.Identity.Entities;
using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.Requests;
using ERP.Identity.Model.VIewModel;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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
            var usernameOrEmail = loginUserDto.UsernameOrEmail.Trim();
            var identityUser = await _userManager.FindByNameAsync(usernameOrEmail)
                ?? await _userManager.FindByEmailAsync(usernameOrEmail);

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
                    var roles = (await _userManager.GetRolesAsync(identityUser)).ToList();
                    List<Claim> claims = await ConstructUserClaimAsync(identityUser);
                    var tokenResult = _tokenService.GenerateToken(identityUser, claims);
                    identityUser.LastLoginAt = DateTime.UtcNow;
                    await _userManager.UpdateAsync(identityUser);

                    LoginResponseViewModel tokenResultViewModel = new LoginResponseViewModel
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(tokenResult),
                        Expiration = tokenResult.ValidTo,
                        UserId = identityUser.Id,
                        FullName = identityUser.FullName,
                        Roles = roles,
                        Permissions = claims
                            .Where(claim => claim.Type == IdentityClaimTypes.Permission)
                            .Select(claim => claim.Value)
                            .Distinct(StringComparer.OrdinalIgnoreCase)
                            .ToList(),
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
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
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
                    Username = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Roles = roles.ToList(),
                    RoleIds = await GetRoleIdsAsync(roles),
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
                RoleIds = await GetRoleIdsAsync(roles),
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

            var roleNames = await GetActiveRoleNamesAsync(request.RoleIds);

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
                RoleIds = request.RoleIds,
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

            var roleNames = await GetActiveRoleNamesAsync(request.RoleIds);

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

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToRemove = currentRoles.Except(roleNames).ToList();
            var rolesToAdd = roleNames.Except(currentRoles).ToList();

            if (rolesToRemove.Count > 0)
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                    throw new InvalidOperationException($"Failed to remove roles: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}");
            }

            if (rolesToAdd.Count > 0)
            {
                var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                    throw new InvalidOperationException($"Failed to assign roles: {string.Join(", ", addResult.Errors.Select(e => e.Description))}");
            }

            return new UserDetailViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Username = user.UserName ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                DepartmentId = user.DepartmentId,
                ManagerId = user.ManagerId,
                Roles = roleNames,
                RoleIds = request.RoleIds,
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

            var protectedRoles = new[] { DefaultRoles.Admin, DefaultRoles.SuperAdmin };
            foreach (var protectedRole in protectedRoles)
            {
                var isInProtectedRole = await _userManager.IsInRoleAsync(user, protectedRole);
                if (!isInProtectedRole)
                {
                    continue;
                }

                var roleUsers = await _userManager.GetUsersInRoleAsync(protectedRole);
                var activeUserCount = roleUsers.Count(u => u.IsActive);

                if (activeUserCount <= 1)
                {
                    throw new InvalidOperationException($"Cannot deactivate the last active {protectedRole}. Assign another {protectedRole} before deactivating this account.");
                }
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

        private async Task<List<string>> GetActiveRoleNamesAsync(List<Guid> roleIds)
        {
            if (!roleIds.Any())
                throw new ArgumentException("At least one role is required.");

            var roleNames = new List<string>();
            foreach (var roleId in roleIds.Distinct())
            {
                var role = await _roleManager.FindByIdAsync(roleId.ToString());
                if (role == null)
                    throw new KeyNotFoundException($"Role with ID '{roleId}' does not exist.");
                if (!role.IsActive)
                    throw new InvalidOperationException($"Role '{role.Name}' is not active and cannot be assigned.");
                roleNames.Add(role.Name!);
            }

            return roleNames;
        }

        private async Task<List<Guid>> GetRoleIdsAsync(IEnumerable<string> roleNames)
        {
            var roleIds = new List<Guid>();

            foreach (var roleName in roleNames)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    roleIds.Add(role.Id);
                }
            }

            return roleIds;
        }

        public async Task<List<RoleListItemViewModel>> GetRolesAsync(CancellationToken cancellationToken)
        {
            var roles = await _roleManager.Roles
                .OrderByDescending(role => role.IsActive)
                .ThenBy(role => role.Name)
                .ToListAsync(cancellationToken);
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
            var name = CleanRequired(request.Name, "Role name");
            var code = CleanOptional(request.Code);
            var description = CleanRequired(request.Description, "Description");

            if (request.IsSystemRole && !_userContextService.GetUserRoles().Contains(DefaultRoles.SuperAdmin))
                throw new UnauthorizedAccessException("Only SuperAdmin can create system roles.");

            var existingByName = await _roleManager.FindByNameAsync(name);
            if (existingByName != null)
                throw new InvalidOperationException($"Role name '{name}' already exists.");

            if (!string.IsNullOrEmpty(code))
            {
                var existingByCode = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Code != null && r.Code.ToLower() == code.ToLower(), cancellationToken);
                if (existingByCode != null)
                    throw new InvalidOperationException($"Role code '{code}' already exists.");
            }

            var currentUserId = _userContextService.GetUserId() ?? Guid.Empty;

            var role = new ApplicationRole
            {
                Name = name,
                Code = code,
                Description = description,
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

            var name = CleanRequired(request.Name, "Role name");
            var code = CleanOptional(request.Code);
            var description = CleanRequired(request.Description, "Description");

            if (role.IsSystemRole && !string.Equals(role.Name, name, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("System role names cannot be changed.");

            if (!string.Equals(role.Name, name, StringComparison.OrdinalIgnoreCase))
            {
                var existingByName = await _roleManager.FindByNameAsync(name);
                if (existingByName != null)
                    throw new InvalidOperationException($"Role name '{name}' already exists.");
            }

            if (!string.IsNullOrEmpty(code) && !string.Equals(role.Code, code, StringComparison.OrdinalIgnoreCase))
            {
                var existingByCode = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Code != null && r.Code.ToLower() == code.ToLower() && r.Id != roleId, cancellationToken);
                if (existingByCode != null)
                    throw new InvalidOperationException($"Role code '{code}' already exists.");
            }

            if (role.IsActive && !request.IsActive)
            {
                await ValidateRoleCanBeDeactivatedAsync(role, cancellationToken);
            }

            role.Name = name;
            role.Code = code;
            role.Description = description;
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

            await ValidateRoleCanBeDeactivatedAsync(role, cancellationToken);

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

        public async Task<RolePermissionViewModel> GetRolePermissionsAsync(Guid roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            var permissionClaims = await GetRolePermissionClaimsAsync(role);
            return new RolePermissionViewModel
            {
                RoleId = role.Id,
                RoleName = role.Name ?? string.Empty,
                Modules = BuildPermissionMatrix(permissionClaims)
            };
        }

        public async Task<RolePermissionViewModel> UpdateRolePermissionsAsync(Guid roleId, UpdateRolePermissionsRequest request, CancellationToken cancellationToken)
        {
            if (request.RoleId != Guid.Empty && request.RoleId != roleId)
                throw new ArgumentException("Route role id and request role id do not match.");

            if (request.Permissions.Count == 0)
                throw new ArgumentException("At least one permission set is required.");

            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
                throw new KeyNotFoundException($"Role with ID '{roleId}' not found.");

            if (role.IsSystemRole)
                throw new InvalidOperationException("System role permissions are protected.");

            var duplicateModule = request.Permissions
                .GroupBy(permission => permission.ModuleCode.Trim().ToLowerInvariant())
                .FirstOrDefault(group => group.Count() > 1);

            if (duplicateModule != null)
                throw new ArgumentException($"Duplicate permission entry for module '{duplicateModule.Key}'.");

            var requestedClaimValues = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var permission in request.Permissions)
            {
                var moduleCode = permission.ModuleCode.Trim().ToLowerInvariant();
                if (!PermissionCatalog.IsValidModule(moduleCode))
                    throw new ArgumentException($"Module code '{permission.ModuleCode}' is not valid.");

                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.View, permission.CanView);
                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.Create, permission.CanCreate);
                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.Edit, permission.CanEdit);
                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.Delete, permission.CanDelete);
                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.Approve, permission.CanApprove);
                AddPermissionIfAllowed(requestedClaimValues, moduleCode, PermissionActions.Export, permission.CanExport);
            }

            var existingPermissionClaims = (await _roleManager.GetClaimsAsync(role))
                .Where(claim => claim.Type == IdentityClaimTypes.Permission)
                .ToList();

            foreach (var claim in existingPermissionClaims)
            {
                var removeResult = await _roleManager.RemoveClaimAsync(role, claim);
                if (!removeResult.Succeeded)
                    throw new InvalidOperationException($"Failed to remove permission: {string.Join(", ", removeResult.Errors.Select(error => error.Description))}");
            }

            foreach (var claimValue in requestedClaimValues.OrderBy(value => value))
            {
                var addResult = await _roleManager.AddClaimAsync(role, new Claim(IdentityClaimTypes.Permission, claimValue));
                if (!addResult.Succeeded)
                    throw new InvalidOperationException($"Failed to add permission: {string.Join(", ", addResult.Errors.Select(error => error.Description))}");
            }

            role.UpdatedOn = DateTime.UtcNow;
            role.UpdatedBy = _userContextService.GetUserId() ?? Guid.Empty;
            var updateResult = await _roleManager.UpdateAsync(role);
            if (!updateResult.Succeeded)
                throw new InvalidOperationException($"Failed to update role audit data: {string.Join(", ", updateResult.Errors.Select(error => error.Description))}");

            return new RolePermissionViewModel
            {
                RoleId = role.Id,
                RoleName = role.Name ?? string.Empty,
                Modules = BuildPermissionMatrix(requestedClaimValues)
            };
        }

        public async Task<UserPermissionViewModel> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");

            var roles = (await _userManager.GetRolesAsync(user)).ToList();
            var permissionClaims = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null || !role.IsActive)
                {
                    continue;
                }

                foreach (var permission in await GetRolePermissionClaimsAsync(role))
                {
                    permissionClaims.Add(permission);
                }
            }

            return new UserPermissionViewModel
            {
                UserId = user.Id,
                Roles = roles,
                Permissions = BuildPermissionMatrix(permissionClaims)
            };
        }

        private async Task ValidateRoleCanBeDeactivatedAsync(ApplicationRole role, CancellationToken cancellationToken)
        {
            if (role.IsSystemRole)
                throw new InvalidOperationException("Cannot deactivate a protected system role.");

            if (IsAdminCapableRole(role.Name))
            {
                var activeAdminRoleCount = await _roleManager.Roles.CountAsync(
                    candidate => candidate.IsActive
                        && candidate.Id != role.Id
                        && candidate.Name != null
                        && (candidate.Name == DefaultRoles.Admin || candidate.Name == DefaultRoles.SuperAdmin),
                    cancellationToken);

                if (activeAdminRoleCount == 0)
                {
                    throw new InvalidOperationException("Cannot deactivate the last active admin-capable role.");
                }
            }

            var users = await _userManager.GetUsersInRoleAsync(role.Name ?? string.Empty);
            if (users.Any(user => user.IsActive))
            {
                throw new InvalidOperationException("Cannot deactivate a role that is assigned to active users.");
            }
        }

        private static bool IsAdminCapableRole(string? roleName)
        {
            return string.Equals(roleName, DefaultRoles.Admin, StringComparison.OrdinalIgnoreCase)
                || string.Equals(roleName, DefaultRoles.SuperAdmin, StringComparison.OrdinalIgnoreCase);
        }

        private static string CleanRequired(string value, string fieldName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException($"{fieldName} is required.");
            }

            return value.Trim();
        }

        private static string? CleanOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private async Task<HashSet<string>> GetRolePermissionClaimsAsync(ApplicationRole role)
        {
            return (await _roleManager.GetClaimsAsync(role))
                .Where(claim => claim.Type == IdentityClaimTypes.Permission)
                .Select(claim => claim.Value)
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        private static List<PermissionMatrixItemViewModel> BuildPermissionMatrix(IReadOnlySet<string> permissionClaims)
        {
            return PermissionCatalog.GetModules()
                .Select(module => new PermissionMatrixItemViewModel
                {
                    ModuleCode = module.ModuleCode,
                    ModuleName = module.ModuleName,
                    CanView = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.View)),
                    CanCreate = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.Create)),
                    CanEdit = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.Edit)),
                    CanDelete = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.Delete)),
                    CanApprove = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.Approve)),
                    CanExport = permissionClaims.Contains(PermissionCatalog.ToClaimValue(module.ModuleCode, PermissionActions.Export))
                })
                .ToList();
        }

        private static void AddPermissionIfAllowed(HashSet<string> permissions, string moduleCode, string actionCode, bool isAllowed)
        {
            if (isAllowed)
            {
                permissions.Add(PermissionCatalog.ToClaimValue(moduleCode, actionCode));
            }
        }
    }
}
