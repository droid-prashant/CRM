using ERP.Identity.Constants;
using ERP.Identity.Model.Requests;
using ERP.Identity.Model.ViewModels;
using ERP.Identity.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Identity
{
    [Authorize]
    public class RolesController : BaseApiController
    {
        private readonly IIdentityService _identityService;

        public RolesController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.RolesView)]
        public async Task<ActionResult<List<RoleListItemViewModel>>> GetRoles(CancellationToken cancellationToken)
        {
            var roles = await _identityService.GetRolesAsync(cancellationToken);
            return Ok(roles);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.RolesView)]
        public async Task<ActionResult<RoleDetailViewModel>> GetRoleById(Guid id, CancellationToken cancellationToken)
        {
            var role = await _identityService.GetRoleByIdAsync(id, cancellationToken);
            return Ok(role);
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.RolesCreate)]
        public async Task<ActionResult<RoleDetailViewModel>> CreateRole(
            [FromBody] CreateRoleRequest request, CancellationToken cancellationToken)
        {
            var role = await _identityService.CreateRoleAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetRoleById), new { id = role.Id }, role);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.RolesEdit)]
        public async Task<ActionResult<RoleDetailViewModel>> UpdateRole(
            Guid id, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
        {
            var role = await _identityService.UpdateRoleAsync(id, request, cancellationToken);
            return Ok(role);
        }

        [HttpPatch("{id:guid}/activate")]
        [Authorize(Policy = PermissionPolicyNames.RolesEdit)]
        public async Task<IActionResult> ActivateRole(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.ActivateRoleAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPatch("{id:guid}/deactivate")]
        [Authorize(Policy = PermissionPolicyNames.RolesDelete)]
        public async Task<IActionResult> DeactivateRole(Guid id, CancellationToken cancellationToken)
        {
            await _identityService.DeactivateRoleAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpGet("{id:guid}/users")]
        [Authorize(Policy = PermissionPolicyNames.RolesView)]
        public async Task<ActionResult<List<RoleUserListItemViewModel>>> GetRoleUsers(Guid id, CancellationToken cancellationToken)
        {
            var users = await _identityService.GetRoleUsersAsync(id, cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id:guid}/permissions")]
        [Authorize(Policy = PermissionPolicyNames.PermissionsView)]
        public async Task<ActionResult<RolePermissionViewModel>> GetRolePermissions(Guid id, CancellationToken cancellationToken)
        {
            var permissions = await _identityService.GetRolePermissionsAsync(id, cancellationToken);
            return Ok(permissions);
        }

        [HttpPut("{id:guid}/permissions")]
        [Authorize(Policy = PermissionPolicyNames.PermissionsEdit)]
        public async Task<ActionResult<RolePermissionViewModel>> UpdateRolePermissions(
            Guid id, [FromBody] UpdateRolePermissionsRequest request, CancellationToken cancellationToken)
        {
            var permissions = await _identityService.UpdateRolePermissionsAsync(id, request, cancellationToken);
            return Ok(permissions);
        }
    }
}
