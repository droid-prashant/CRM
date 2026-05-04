using ERP.Identity.Model.Requests;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Identity
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class UsersController : BaseApiController
    {
        private readonly IIdentityService _identityService;

        public UsersController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserListItemViewModel>>> GetUsers(CancellationToken cancellationToken)
        {
            var users = await _identityService.GetUsersAsync(cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UserDetailViewModel>> GetUserById(Guid id, CancellationToken cancellationToken)
        {
            var user = await _identityService.GetUserByIdAsync(id, cancellationToken);
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserDetailViewModel>> CreateUser(
            [FromBody] CreateUserRequest request, CancellationToken cancellationToken)
        {
            var user = await _identityService.CreateUserAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<UserDetailViewModel>> UpdateUser(
            Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
        {
            var user = await _identityService.UpdateUserAsync(id, request, cancellationToken);
            return Ok(user);
        }

        [HttpPatch("{id:guid}/activate")]
        public async Task<IActionResult> ActivateUser(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.ActivateUserAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPatch("{id:guid}/deactivate")]
        public async Task<IActionResult> DeactivateUser(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.DeactivateUserAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
