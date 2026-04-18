using ERP.Identity.Model.Requests;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Roles
{
    [Authorize(Roles = "SuperAdmin")]
    public class RolesController : BaseApiController
    {
        private readonly IIdentityService _identityService;

        public RolesController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleListItemViewModel>>> GetRoles(CancellationToken cancellationToken)
        {
            var roles = await _identityService.GetRolesAsync(cancellationToken);
            return Ok(roles);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RoleDetailViewModel>> GetRoleById(Guid id, CancellationToken cancellationToken)
        {
            var role = await _identityService.GetRoleByIdAsync(id, cancellationToken);
            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDetailViewModel>> CreateRole(
            [FromBody] CreateRoleRequest request, CancellationToken cancellationToken)
        {
            var role = await _identityService.CreateRoleAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetRoleById), new { id = role.Id }, role);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<RoleDetailViewModel>> UpdateRole(
            Guid id, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
        {
            var role = await _identityService.UpdateRoleAsync(id, request, cancellationToken);
            return Ok(role);
        }

        [HttpPatch("{id:guid}/activate")]
        public async Task<IActionResult> ActivateRole(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.ActivateRoleAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPatch("{id:guid}/deactivate")]
        public async Task<IActionResult> DeactivateRole(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.DeactivateRoleAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpGet("{id:guid}/users")]
        public async Task<ActionResult<List<RoleUserListItemViewModel>>> GetRoleUsers(Guid id, CancellationToken cancellationToken)
        {
            var users = await _identityService.GetRoleUsersAsync(id, cancellationToken);
            return Ok(users);
        }
    }
}
