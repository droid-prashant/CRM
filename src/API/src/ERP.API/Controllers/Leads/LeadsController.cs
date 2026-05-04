using ERP.Identity.Constants;
using Leads.Application.DTOs;
using Leads.Application.Services;
using Leads.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Leads
{
    public class LeadsController : BaseApiController
    {
        private readonly ILeadService _leadService;

        public LeadsController(ILeadService leadService)
        {
            _leadService = leadService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<LeadListItemViewModel>>> GetLeads(CancellationToken cancellationToken)
        {
            return await _leadService.GetLeadListAsync(cancellationToken);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<LeadDetailViewModel>> GetLead(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _leadService.GetLeadDetailAsync(id, cancellationToken);
            return lead == null ? NotFound() : lead;
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.LeadsCreate)]
        public async Task<ActionResult<LeadDetailViewModel>> CreateLead([FromBody] CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.CreateLeadAsync(request, cancellationToken);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors });
            }

            return CreatedAtAction(nameof(GetLead), new { id = result.Lead!.Id }, result.Lead);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.LeadsDelete)]
        public async Task<IActionResult> DeleteLead(Guid id, CancellationToken cancellationToken)
        {
            var deleted = await _leadService.DeleteLeadAsync(id, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }

        [HttpGet("{id:guid}/edit")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<LeadEditViewModel>> GetLeadForEdit(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _leadService.GetLeadEditAsync(id, cancellationToken);
            return lead == null ? NotFound() : lead;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<LeadLookupViewModel>>> GetLeadLookups(CancellationToken cancellationToken)
        {
            return await _leadService.GetLeadLookupsAsync(cancellationToken);
        }

    }
}
