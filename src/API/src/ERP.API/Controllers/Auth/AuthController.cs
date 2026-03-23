using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.VIewModel;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Auth
{
    public class AuthController : BaseApiController
    {
        private readonly IIdentityService _identityService;
        public AuthController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpPost("CreateRole")]
        public async Task CreateRole([FromBody] UserRoleDto userRoleDto, CancellationToken cancellationToken)
        {
            await _identityService.CreateRoleAsync(userRoleDto, cancellationToken);
        }
        [HttpPost("CreateUser")]
        public async Task CreateUser([FromBody] RegisterUserDto userDto, CancellationToken cancellationToken)
        {
            await _identityService.CreateUserAsync(userDto, cancellationToken);
        }
        [HttpPost("Login")]
        public async Task<LoginResponseViewModel> Login([FromBody] LoginRequestDto loginRequestDto, CancellationToken cancellationToken)
        {
            var result = await _identityService.LoginUserAsync(loginRequestDto, cancellationToken);
            return result;
        }
    }
}
