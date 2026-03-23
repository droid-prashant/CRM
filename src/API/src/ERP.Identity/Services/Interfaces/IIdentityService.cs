using ERP.Identity.Model.Dtos;
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
    }
}
