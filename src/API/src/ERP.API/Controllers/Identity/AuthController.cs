using ERP.Identity.Model.Dtos;
using ERP.Identity.Model.VIewModel;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Identity
{
    public class AuthController : BaseApiController
    {
        private readonly IIdentityService _identityService;

        public AuthController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseViewModel>> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
        {
            var result = await _identityService.LoginUserAsync(request, cancellationToken);
            return result.Succeded ? Ok(result) : Unauthorized(result);
        }
    }
}
