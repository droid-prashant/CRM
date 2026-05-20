using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opportunities.Application.DTOs;
using Opportunities.Application.Services;
using Opportunities.Application.ViewModels;

namespace ERP.API.Controllers.Opportunities
{
    public class OpportunitiesController : BaseApiController
    {
        private readonly IOpportunityService _opportunityService;

        public OpportunitiesController(IOpportunityService opportunityService)
        {
            _opportunityService = opportunityService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<OpportunityListItemViewModel>>> GetOpportunities(CancellationToken cancellationToken)
        {
            return await _opportunityService.GetOpportunityListAsync(cancellationToken);
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<OpportunityLookupViewModel>> GetOpportunityLookups(CancellationToken cancellationToken)
        {
            return await _opportunityService.GetOpportunityLookupsAsync(cancellationToken);
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesCreate)]
        public async Task<ActionResult<OpportunityListItemViewModel>> CreateOpportunity([FromBody] CreateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.CreateOpportunityAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetOpportunities), new { id = result.Opportunity!.Id }, result.Opportunity);
            }

            return BadRequest(new { errors = result.Errors });
        }
    }
}
