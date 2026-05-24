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
        public async Task<ActionResult<PagedResultViewModel<OpportunityListItemViewModel>>> GetOpportunities([FromQuery] OpportunityListQuery query, CancellationToken cancellationToken)
        {
            return await _opportunityService.GetOpportunityListAsync(query, cancellationToken);
        }

        [HttpGet("pipeline")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<OpportunityPipelineStageViewModel>>> GetPipeline([FromQuery] OpportunityListQuery query, CancellationToken cancellationToken)
        {
            return await _opportunityService.GetPipelineAsync(query, cancellationToken);
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

            if (result.Forbidden)
            {
                return Forbid();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityListItemViewModel>> UpdateOpportunity(Guid id, [FromBody] UpdateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.UpdateOpportunityAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Opportunity!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            if (result.Forbidden)
            {
                return Forbid();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/stage")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityListItemViewModel>> ChangeStage(Guid id, [FromBody] ChangeOpportunityStageRequest request, CancellationToken cancellationToken)
        {
            return ToOpportunityActionResult(await _opportunityService.ChangeStageAsync(id, request, cancellationToken));
        }

        [HttpPatch("{id:guid}/won")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesApprove)]
        public async Task<ActionResult<OpportunityListItemViewModel>> CloseAsWon(Guid id, [FromBody] CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return ToOpportunityActionResult(await _opportunityService.CloseAsWonAsync(id, request, cancellationToken));
        }

        [HttpPatch("{id:guid}/lost")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesApprove)]
        public async Task<ActionResult<OpportunityListItemViewModel>> CloseAsLost(Guid id, [FromBody] CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return ToOpportunityActionResult(await _opportunityService.CloseAsLostAsync(id, request, cancellationToken));
        }

        [HttpGet("{id:guid}/stage-history")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<OpportunityStageHistoryViewModel>>> GetStageHistory(Guid id, CancellationToken cancellationToken)
        {
            var history = await _opportunityService.GetStageHistoryAsync(id, cancellationToken);
            return history == null ? NotFound() : history;
        }

        [HttpGet("{id:guid}/activities")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<OpportunityActivityViewModel>>> GetActivities(Guid id, CancellationToken cancellationToken)
        {
            var activities = await _opportunityService.GetActivitiesAsync(id, cancellationToken);
            return activities == null ? NotFound() : activities;
        }

        [HttpPost("{id:guid}/activities")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityActivityViewModel>> CreateActivity(Guid id, [FromBody] CreateOpportunityActivityRequest request, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.CreateActivityAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetActivities), new { id }, result.Activity);
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            if (result.Forbidden)
            {
                return Forbid();
            }

            return BadRequest(new { errors = result.Errors });
        }

        private ActionResult<OpportunityListItemViewModel> ToOpportunityActionResult(OpportunityResult result)
        {
            if (result.Succeeded)
            {
                return result.Opportunity!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            if (result.Forbidden)
            {
                return Forbid();
            }

            return BadRequest(new { errors = result.Errors });
        }
    }
}
