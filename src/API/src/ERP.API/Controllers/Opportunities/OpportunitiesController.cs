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
        private const long MaxProposalDocumentBytes = 10 * 1024 * 1024;

        private readonly IOpportunityService _opportunityService;
        private readonly IWebHostEnvironment _environment;

        public OpportunitiesController(IOpportunityService opportunityService, IWebHostEnvironment environment)
        {
            _opportunityService = opportunityService;
            _environment = environment;
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
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaxProposalDocumentBytes + 1024 * 1024)]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityListItemViewModel>> ChangeStage(Guid id, [FromForm] ChangeOpportunityStageFormRequest form, CancellationToken cancellationToken)
        {
            var savedFilePath = string.Empty;
            var request = new ChangeOpportunityStageRequest
            {
                StageId = form.StageId,
                Remarks = form.Remarks
            };

            if (form.ProposalDocument != null)
            {
                var savedFile = await SaveProposalDocumentAsync(id, form.ProposalDocument, cancellationToken);
                savedFilePath = savedFile.FilePath;
                request.ProposalDocumentFileName = form.ProposalDocument.FileName;
                request.ProposalDocumentStoredFileName = savedFile.StoredFileName;
                request.ProposalDocumentPath = savedFile.FilePath;
                request.ProposalDocumentContentType = form.ProposalDocument.ContentType;
                request.ProposalDocumentSize = form.ProposalDocument.Length;
            }

            var result = await _opportunityService.ChangeStageAsync(id, request, cancellationToken);
            if (!result.Succeeded && !string.IsNullOrWhiteSpace(savedFilePath))
            {
                DeleteSavedFile(savedFilePath);
            }

            return ToOpportunityActionResult(result);
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

        [HttpGet("{id:guid}/proposal-document")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<IActionResult> DownloadProposalDocument(Guid id, CancellationToken cancellationToken)
        {
            var document = await _opportunityService.GetProposalDocumentAsync(id, cancellationToken);
            if (document == null)
            {
                return NotFound();
            }

            var path = ResolveUploadPath(document.FilePath);
            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            return PhysicalFile(path, document.ContentType, document.FileName);
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

        private async Task<(string StoredFileName, string FilePath)> SaveProposalDocumentAsync(Guid opportunityId, IFormFile file, CancellationToken cancellationToken)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var storedFileName = $"{opportunityId:N}-{Guid.NewGuid():N}{extension}";
            var relativePath = Path.Combine("uploads", "opportunity-proposals", storedFileName).Replace('\\', '/');
            var fullPath = ResolveUploadPath(relativePath);
            var directory = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            await using var stream = System.IO.File.Create(fullPath);
            await file.CopyToAsync(stream, cancellationToken);
            return (storedFileName, relativePath);
        }

        private string ResolveUploadPath(string relativePath)
        {
            var root = Path.GetFullPath(_environment.ContentRootPath);
            var fullPath = Path.GetFullPath(Path.Combine(root, relativePath));
            var normalizedRoot = Path.TrimEndingDirectorySeparator(root) + Path.DirectorySeparatorChar;
            if (!fullPath.StartsWith(normalizedRoot, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Invalid proposal document path.");
            }

            return fullPath;
        }

        private void DeleteSavedFile(string relativePath)
        {
            var path = ResolveUploadPath(relativePath);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }
    }

    public class ChangeOpportunityStageFormRequest
    {
        public Guid StageId { get; set; }
        public string? Remarks { get; set; }
        public IFormFile? ProposalDocument { get; set; }
    }
}
