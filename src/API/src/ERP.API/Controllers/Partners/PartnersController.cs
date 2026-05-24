using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Partners.Application.DTOs;
using Partners.Application.Services;
using Partners.Application.ViewModels;

namespace ERP.API.Controllers.Partners
{
    public class PartnersController : BaseApiController
    {
        private readonly IPartnerService _partnerService;

        public PartnersController(IPartnerService partnerService)
        {
            _partnerService = partnerService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.PartnersView)]
        public async Task<ActionResult<List<PartnerListItemViewModel>>> GetPartners(CancellationToken cancellationToken)
        {
            return await _partnerService.GetPartnersAsync(cancellationToken);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.PartnersView)]
        public async Task<ActionResult<PartnerDetailViewModel>> GetPartner(Guid id, CancellationToken cancellationToken)
        {
            var partner = await _partnerService.GetPartnerAsync(id, cancellationToken);
            return partner == null ? NotFound() : partner;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.PartnersView)]
        public async Task<ActionResult<PartnerLookupBundleViewModel>> GetLookups(CancellationToken cancellationToken)
        {
            return await _partnerService.GetLookupsAsync(cancellationToken);
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.PartnersCreate)]
        public async Task<ActionResult<PartnerDetailViewModel>> CreatePartner([FromBody] CreatePartnerRequest request, CancellationToken cancellationToken)
        {
            var result = await _partnerService.CreatePartnerAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetPartner), new { id = result.Partner!.Id }, result.Partner);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.PartnersEdit)]
        public async Task<ActionResult<PartnerDetailViewModel>> UpdatePartner(Guid id, [FromBody] UpdatePartnerRequest request, CancellationToken cancellationToken)
        {
            var result = await _partnerService.UpdatePartnerAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Partner!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/activate")]
        [Authorize(Policy = PermissionPolicyNames.PartnersEdit)]
        public async Task<IActionResult> ActivatePartner(Guid id, CancellationToken cancellationToken)
        {
            return await _partnerService.ActivatePartnerAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpPatch("{id:guid}/deactivate")]
        [Authorize(Policy = PermissionPolicyNames.PartnersDelete)]
        public async Task<IActionResult> DeactivatePartner(Guid id, CancellationToken cancellationToken)
        {
            return await _partnerService.DeactivatePartnerAsync(id, cancellationToken) ? NoContent() : NotFound();
        }
    }
}
