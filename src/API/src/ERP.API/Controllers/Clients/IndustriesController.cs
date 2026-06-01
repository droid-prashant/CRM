using Clients.Application.Services;
using Clients.Application.ViewModels;
using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Clients
{
    public class IndustriesController : BaseApiController
    {
        private readonly IClientService _clientService;

        public IndustriesController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<List<LookupViewModel>>> GetIndustryLookups(CancellationToken cancellationToken)
        {
            var lookups = await _clientService.GetLookupsAsync(cancellationToken);
            return lookups.Industries;
        }
    }
}
