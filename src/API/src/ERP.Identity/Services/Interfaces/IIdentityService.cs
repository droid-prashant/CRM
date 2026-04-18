using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.Requests;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Model.VIewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Services.Interfaces
{
    public interface IIdentityService
    {
        Task CreateRoleAsync(UserRoleDto userRoleDto, CancellationToken cancellationToken);
        Task CreateUserAsync(RegisterUserDto userDto, CancellationToken cancellationToken);
        Task<LoginResponseViewModel> LoginUserAsync(LoginRequestDto loginUserDto, CancellationToken cancellationToken);

        Task<List<UserListItemViewModel>> GetUsersAsync(CancellationToken cancellationToken);
        Task<UserDetailViewModel> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<UserDetailViewModel> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken);
        Task<UserDetailViewModel> UpdateUserAsync(Guid userId, UpdateUserRequest request, CancellationToken cancellationToken);
        Task ActivateUserAsync(Guid userId, CancellationToken cancellationToken);
        Task DeactivateUserAsync(Guid userId, CancellationToken cancellationToken);

        Task<List<RoleListItemViewModel>> GetRolesAsync(CancellationToken cancellationToken);
        Task<RoleDetailViewModel> GetRoleByIdAsync(Guid roleId, CancellationToken cancellationToken);
        Task<RoleDetailViewModel> CreateRoleAsync(CreateRoleRequest request, CancellationToken cancellationToken);
        Task<RoleDetailViewModel> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request, CancellationToken cancellationToken);
        Task ActivateRoleAsync(Guid roleId, CancellationToken cancellationToken);
        Task DeactivateRoleAsync(Guid roleId, CancellationToken cancellationToken);
        Task<List<RoleUserListItemViewModel>> GetRoleUsersAsync(Guid roleId, CancellationToken cancellationToken);
    }
}
