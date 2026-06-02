using ERP.Identity.Constants;
using Leads.Application.Services;
using Leads.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Leads
{
    [Route("api/leads/clients")]
    public class ClientsController : BaseApiController
    {
        private readonly ILeadService _leadService;

        public ClientsController(ILeadService leadService)
        {
            _leadService = leadService;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<ClientLookupViewModel>>> GetClientLookups(CancellationToken cancellationToken)
        {
            return await _leadService.GetClientLookupsAsync(cancellationToken);
        }

        [HttpGet("contacts")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<ContactLookupViewModel>>> GetAllClientContacts(CancellationToken cancellationToken)
        {
            return await _leadService.GetAllClientContactsAsync(cancellationToken);
        }

        [HttpGet("{id:guid}/contacts")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<ContactLookupViewModel>>> GetClientContacts(Guid id, CancellationToken cancellationToken)
        {
            var contacts = await _leadService.GetClientContactsAsync(id, cancellationToken);
            return contacts == null ? NotFound() : contacts;
        }
    }
}
