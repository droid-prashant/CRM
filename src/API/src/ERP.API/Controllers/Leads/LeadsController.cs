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

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.LeadsEdit)]
        public async Task<ActionResult<LeadDetailViewModel>> UpdateLead(Guid id, [FromBody] UpdateLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.UpdateLeadAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Lead!;
            }

            if (result.Errors.Any(x => x.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
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

        [HttpGet("{id:guid}/qualification")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<LeadQualificationViewModel>> GetLeadQualification(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _leadService.GetLeadQualificationAsync(id, cancellationToken);
            return lead == null ? NotFound() : lead;
        }

        [HttpPatch("{id:guid}/qualify")]
        [Authorize(Policy = PermissionPolicyNames.LeadsEdit)]
        public async Task<ActionResult<LeadQualificationResultViewModel>> QualifyLead(Guid id, [FromBody] QualifyLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.QualifyLeadAsync(id, request, cancellationToken);
            return ToQualificationActionResult(result);
        }

        [HttpPatch("{id:guid}/disqualify")]
        [Authorize(Policy = PermissionPolicyNames.LeadsEdit)]
        public async Task<ActionResult<LeadQualificationResultViewModel>> DisqualifyLead(Guid id, [FromBody] DisqualifyLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.DisqualifyLeadAsync(id, request, cancellationToken);
            return ToQualificationActionResult(result);
        }

        [HttpPatch("{id:guid}/status")]
        [Authorize(Policy = PermissionPolicyNames.LeadsEdit)]
        public async Task<ActionResult<LeadQualificationResultViewModel>> UpdateLeadStatus(Guid id, [FromBody] UpdateLeadStatusRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.UpdateLeadStatusAsync(id, request, cancellationToken);
            return ToQualificationActionResult(result);
        }

        [HttpGet("{id:guid}/status-history")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<LeadStatusHistoryItemViewModel>>> GetLeadStatusHistory(Guid id, CancellationToken cancellationToken)
        {
            var history = await _leadService.GetLeadStatusHistoryAsync(id, cancellationToken);
            return history == null ? NotFound() : history;
        }

        [HttpGet("{id:guid}/conversion")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<LeadConversionViewModel>> GetLeadConversion(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _leadService.GetLeadConversionAsync(id, cancellationToken);
            return lead == null ? NotFound() : lead;
        }

        [HttpPost("{id:guid}/convert")]
        [Authorize(Policy = PermissionPolicyNames.LeadsApprove)]
        public async Task<ActionResult<OpportunityCreatedViewModel>> ConvertLead(Guid id, [FromBody] ConvertLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.ConvertLeadAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Opportunity!;
            }

            if (result.Errors.Any(x => x.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/assign")]
        [Authorize(Policy = PermissionPolicyNames.LeadsEdit)]
        public async Task<ActionResult<LeadAssignmentResultViewModel>> AssignLead(Guid id, [FromBody] AssignLeadRequest request, CancellationToken cancellationToken)
        {
            var result = await _leadService.AssignLeadAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Assignment!;
            }

            if (result.Errors.Any(x => x.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.LeadsView)]
        public async Task<ActionResult<List<LeadLookupViewModel>>> GetLeadLookups(CancellationToken cancellationToken)
        {
            return await _leadService.GetLeadLookupsAsync(cancellationToken);
        }

        private ActionResult<LeadQualificationResultViewModel> ToQualificationActionResult(LeadQualificationResult result)
        {
            if (result.Succeeded)
            {
                return result.Qualification!;
            }

            if (result.Errors.Any(x => x.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }
    }
}
