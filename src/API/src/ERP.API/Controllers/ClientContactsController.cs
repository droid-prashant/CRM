using Clients.Application.DTOs;
using Clients.Application.Services;
using Clients.Application.ViewModels;
using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Route("api/client-contacts")]
    public class ClientContactsController : BaseApiController
    {
        private readonly IClientContactService _contactService;

        public ClientContactsController(IClientContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientContactViewModel>> CreateContact([FromBody] CreateClientContactRequest request, CancellationToken cancellationToken)
        {
            var result = await _contactService.CreateContactAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return Created($"/api/clients/{result.Contact!.ClientId}/contacts", result.Contact);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientContactViewModel>> UpdateContact(Guid id, [FromBody] UpdateClientContactRequest request, CancellationToken cancellationToken)
        {
            var result = await _contactService.UpdateContactAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Contact!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/status")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientContactViewModel>> UpdateStatus(Guid id, [FromBody] UpdateClientContactStatusRequest request, CancellationToken cancellationToken)
        {
            var result = await _contactService.SetContactStatusAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Contact!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/set-primary")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<PrimaryContactViewModel>> SetPrimaryContact(Guid id, CancellationToken cancellationToken)
        {
            var result = await _contactService.SetPrimaryContactAsync(id, cancellationToken);
            if (result.Succeeded)
            {
                return result.PrimaryContact!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }
    }
}
