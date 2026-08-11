using Lookups.Application.DTOs;
using Lookups.Application.Services;
using Lookups.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Lookups
{
    [Authorize(Policy = "AdminOnly")]
    public class LookupsController : BaseApiController
    {
        private readonly ILookupService _lookupService;

        public LookupsController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<LookupTypeOptionViewModel>>> GetLookupTypes(CancellationToken cancellationToken)
        {
            return await _lookupService.GetLookupTypesAsync(cancellationToken);
        }

        [HttpGet]
        public async Task<ActionResult<List<LookupListItemViewModel>>> GetLookups([FromQuery] LookupQueryRequest request, CancellationToken cancellationToken)
        {
            return await _lookupService.GetLookupsAsync(request, cancellationToken);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LookupListItemViewModel>> GetLookup(Guid id, CancellationToken cancellationToken)
        {
            var lookup = await _lookupService.GetLookupAsync(id, cancellationToken);
            return lookup == null ? NotFound() : lookup;
        }

        [HttpPost]
        public async Task<ActionResult<LookupListItemViewModel>> CreateLookup([FromBody] CreateLookupRequest request, CancellationToken cancellationToken)
        {
            var result = await _lookupService.CreateLookupAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetLookup), new { id = result.Lookup!.Id }, result.Lookup);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<LookupListItemViewModel>> UpdateLookup(Guid id, [FromBody] UpdateLookupRequest request, CancellationToken cancellationToken)
        {
            var result = await _lookupService.UpdateLookupAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Lookup!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/activate")]
        public async Task<IActionResult> ActivateLookup(Guid id, CancellationToken cancellationToken)
        {
            return await _lookupService.ActivateLookupAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpPatch("{id:guid}/deactivate")]
        public async Task<IActionResult> DeactivateLookup(Guid id, CancellationToken cancellationToken)
        {
            return await _lookupService.DeactivateLookupAsync(id, cancellationToken) ? NoContent() : NotFound();
        }
    }
}
