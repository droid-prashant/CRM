using ERP.Identity.Constants;
using Leads.Application.Services;
using Leads.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Leads
{
    [ApiController]
    [Authorize(Policy = PermissionPolicyNames.LeadsView)]
    [Produces("application/json")]
    [Route("api/leads/lookups")]
    public class LeadLookupsController : ControllerBase
    {
        private readonly ILeadLookupService _leadLookupService;

        public LeadLookupsController(ILeadLookupService leadLookupService)
        {
            _leadLookupService = leadLookupService;
        }

        [HttpGet("sources")]
        public async Task<ActionResult<List<LookupViewModel>>> GetSourceLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetSourcesAsync(cancellationToken);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<List<LookupViewModel>>> GetCategoryLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetCategoriesAsync(cancellationToken);
        }

        [HttpGet("products")]
        public async Task<ActionResult<List<LookupViewModel>>> GetProductLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetProductsAsync(cancellationToken);
        }

        [HttpGet("partners")]
        public async Task<ActionResult<List<LookupViewModel>>> GetPartnerLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetPartnersAsync(cancellationToken);
        }

        [HttpGet("countries")]
        public async Task<ActionResult<List<LookupViewModel>>> GetCountryLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetCountriesAsync(cancellationToken);
        }

        [HttpGet("industries")]
        public async Task<ActionResult<List<LookupViewModel>>> GetIndustryLookups(CancellationToken cancellationToken)
        {
            return await _leadLookupService.GetIndustriesAsync(cancellationToken);
        }
    }
}
