using Clients.Application.DTOs;
using Clients.Application.Services;
using Clients.Application.ViewModels;
using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Clients
{
    public class ClientsController : BaseApiController
    {
        private readonly IClientService _clientService;
        private readonly IClientContactService _contactService;
        private readonly IClientProductService _productService;

        public ClientsController(IClientService clientService, IClientContactService contactService, IClientProductService productService)
        {
            _clientService = clientService;
            _contactService = contactService;
            _productService = productService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientListResponseViewModel>> GetClients([FromQuery] ClientQueryRequest request, CancellationToken cancellationToken)
        {
            var result = await _clientService.GetClientsAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Response!;
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpGet("filters")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientFilterLookupViewModel>> GetFilters(CancellationToken cancellationToken)
        {
            return await _clientService.GetFilterLookupsAsync(cancellationToken);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientDetailViewModel>> GetClient(Guid id, CancellationToken cancellationToken)
            {
            var client = await _clientService.GetClientDetailAsync(id, cancellationToken);
            return client == null ? NotFound() : client;
        }

        [HttpGet("{id:guid}/contacts")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<List<ClientContactViewModel>>> GetClientContacts(Guid id, CancellationToken cancellationToken)
        {
            var contacts = await _contactService.GetContactsAsync(id, cancellationToken);
            return contacts == null ? NotFound() : contacts;
        }

        [HttpGet("{id:guid}/timeline")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientTimelineResponseViewModel>> GetClientTimeline(Guid id, [FromQuery] ClientTimelineQueryRequest request, CancellationToken cancellationToken)
        {
            var timeline = await _clientService.GetClientTimelineAsync(id, request, cancellationToken);
            return timeline == null ? NotFound() : timeline;
        }

        [HttpGet("{id:guid}/related-summary")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientRelatedRecordsSummaryViewModel>> GetClientRelatedSummary(Guid id, CancellationToken cancellationToken)
        {
            var summary = await _clientService.GetRelatedRecordsSummaryAsync(id, cancellationToken);
            return summary == null ? NotFound() : summary;
        }

        [HttpGet("{id:guid}/products")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<List<ClientProductViewModel>>> GetClientProducts(Guid id, CancellationToken cancellationToken)
        {
            var products = await _productService.GetProductsAsync(id, cancellationToken);
            return products == null ? NotFound() : products;
        }

        [HttpGet("{id:guid}/products/lookups")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientProductLookupBundleViewModel>> GetClientProductLookups(Guid id, CancellationToken cancellationToken)
        {
            var lookups = await _productService.GetLookupsAsync(id, cancellationToken);
            return lookups == null ? NotFound() : lookups;
        }

        [HttpGet("{id:guid}/edit")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientEditViewModel>> GetClientForEdit(Guid id, CancellationToken cancellationToken)
        {
            var client = await _clientService.GetClientEditAsync(id, cancellationToken);
            return client == null ? NotFound() : client;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<ClientLookupBundleViewModel>> GetLookups(CancellationToken cancellationToken)
        {
            return await _clientService.GetLookupsAsync(cancellationToken);
        }

        [HttpGet("active")]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public async Task<ActionResult<List<ClientLookupViewModel>>> GetActiveClients(CancellationToken cancellationToken)
        {
            return await _clientService.GetActiveClientsAsync(cancellationToken);
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.ClientsCreate)]
        public async Task<ActionResult<ClientCreatedViewModel>> CreateClient([FromBody] CreateClientRequest request, CancellationToken cancellationToken)
        {
            var result = await _clientService.CreateClientAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetClient), new { id = result.Client!.Id }, result.Client);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientUpdatedViewModel>> UpdateClient(Guid id, [FromBody] UpdateClientRequest request, CancellationToken cancellationToken)
        {
            var result = await _clientService.UpdateClientAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Client!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/activate")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<IActionResult> ActivateClient(Guid id, CancellationToken cancellationToken)
        {
            return await _clientService.ActivateClientAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpPatch("{id:guid}/deactivate")]
        [Authorize(Policy = PermissionPolicyNames.ClientsDelete)]
        public async Task<IActionResult> DeactivateClient(Guid id, CancellationToken cancellationToken)
        {
            return await _clientService.DeactivateClientAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ClientsDelete)]
        public async Task<IActionResult> DeleteClient(Guid id, CancellationToken cancellationToken)
        {
            return await _clientService.DeleteClientAsync(id, cancellationToken) ? NoContent() : NotFound();
        }
    }
}
