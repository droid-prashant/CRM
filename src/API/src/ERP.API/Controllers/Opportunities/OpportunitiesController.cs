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
        private const long MaxCommercialDocumentBytes = 10 * 1024 * 1024;

        private readonly IOpportunityService _opportunityService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<OpportunitiesController> _logger;

        public OpportunitiesController(IOpportunityService opportunityService, IWebHostEnvironment environment, ILogger<OpportunitiesController> logger)
        {
            _opportunityService = opportunityService;
            _environment = environment;
            _logger = logger;
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
                TryDeleteSavedFile(savedFilePath);
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

        [HttpGet("{id:guid}/proposal-versions")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<ProposalVersionViewModel>>> GetProposalHistory(Guid id, CancellationToken cancellationToken)
        {
            var history = await _opportunityService.GetProposalHistoryAsync(id, cancellationToken);
            return history == null ? NotFound() : history;
        }

        [HttpPost("{id:guid}/proposal-versions")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaxProposalDocumentBytes + 1024 * 1024)]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityDocumentViewModel>> UploadProposalVersion(Guid id, [FromForm] UploadProposalVersionFormRequest form, CancellationToken cancellationToken)
        {
            if (form.ProposalDocument == null)
            {
                return BadRequest(new { errors = new[] { "Proposal document is required." } });
            }

            var request = new UploadProposalVersionRequest
            {
                Description = form.Description,
                ProposalDocumentFileName = form.ProposalDocument.FileName,
                ProposalDocumentContentType = form.ProposalDocument.ContentType,
                ProposalDocumentSize = form.ProposalDocument.Length
            };

            var preflight = await _opportunityService.ValidateProposalVersionUploadAsync(id, request, cancellationToken);
            if (preflight.Forbidden)
            {
                return Forbid();
            }

            if (preflight.NotFound)
            {
                return NotFound();
            }

            if (preflight.Errors.Count > 0)
            {
                return BadRequest(new { errors = preflight.Errors });
            }

            var savedFile = await SaveProposalDocumentAsync(id, form.ProposalDocument, cancellationToken);
            request.ProposalDocumentStoredFileName = savedFile.StoredFileName;
            request.ProposalDocumentPath = savedFile.FilePath;

            var result = await _opportunityService.UploadProposalVersionAsync(id, request, cancellationToken);
            if (!result.Succeeded)
            {
                TryDeleteSavedFile(savedFile.FilePath);
            }

            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetProposalHistory), new { id }, result.Document);
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

        [HttpGet("{id:guid}/proposal-versions/{documentId:guid}/download")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<IActionResult> DownloadProposalDocumentVersion(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _opportunityService.GetProposalDocumentVersionAsync(id, documentId, cancellationToken);
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

        [HttpGet("{id:guid}/proposal-versions/{documentId:guid}/preview")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<IActionResult> PreviewProposalDocumentVersion(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _opportunityService.GetProposalDocumentVersionAsync(id, documentId, cancellationToken);
            if (document == null)
            {
                return NotFound();
            }

            var path = ResolveUploadPath(document.FilePath);
            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            return PhysicalFile(path, document.ContentType, enableRangeProcessing: true);
        }

        [HttpGet("{id:guid}/commercial-documents")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<List<OpportunityCommercialDocumentViewModel>>> GetCommercialDocuments(Guid id, CancellationToken cancellationToken)
        {
            var documents = await _opportunityService.GetCommercialDocumentsAsync(id, cancellationToken);
            return documents == null ? NotFound() : documents;
        }

        [HttpPost("{id:guid}/commercial-documents")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaxCommercialDocumentBytes + 1024 * 1024)]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityCommercialDocumentViewModel>> UploadCommercialDocument(Guid id, [FromForm] UploadCommercialDocumentFormRequest form, CancellationToken cancellationToken)
        {
            if (form.CommercialDocument == null)
            {
                return BadRequest(new { errors = new[] { "Agreement or PO document is required." } });
            }

            var request = new UploadOpportunityCommercialDocumentRequest
            {
                DocumentType = form.DocumentType,
                FileName = form.CommercialDocument.FileName,
                ContentType = form.CommercialDocument.ContentType,
                FileSize = form.CommercialDocument.Length,
                Remarks = form.Remarks
            };

            var preflight = await _opportunityService.ValidateCommercialDocumentUploadAsync(id, request, cancellationToken);
            if (preflight.Forbidden)
            {
                return Forbid();
            }

            if (preflight.NotFound)
            {
                return NotFound();
            }

            if (preflight.Errors.Count > 0)
            {
                return BadRequest(new { errors = preflight.Errors });
            }

            var savedFile = await SaveCommercialDocumentAsync(id, form.CommercialDocument, cancellationToken);
            request.StoredFileName = savedFile.StoredFileName;
            request.FilePath = savedFile.FilePath;

            var result = await _opportunityService.UploadCommercialDocumentAsync(id, request, cancellationToken);
            if (!result.Succeeded)
            {
                TryDeleteSavedFile(savedFile.FilePath);
            }

            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetCommercialDocuments), new { id }, result.Document);
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

        [HttpGet("{id:guid}/commercial-documents/{documentId:guid}/preview")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<IActionResult> PreviewCommercialDocument(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _opportunityService.GetCommercialDocumentAsync(id, documentId, cancellationToken);
            if (document == null)
            {
                return NotFound();
            }

            var path = ResolveUploadPath(document.FilePath);
            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            return PhysicalFile(path, document.ContentType, enableRangeProcessing: true);
        }

        [HttpGet("{id:guid}/commercial-documents/{documentId:guid}/download")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<IActionResult> DownloadCommercialDocument(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _opportunityService.GetCommercialDocumentAsync(id, documentId, cancellationToken);
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

        [HttpDelete("{id:guid}/commercial-documents/{documentId:guid}")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<IActionResult> DeleteCommercialDocument(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.DeleteCommercialDocumentAsync(id, documentId, cancellationToken);
            if (result.Succeeded)
            {
                if (!string.IsNullOrWhiteSpace(result.Document?.FilePath))
                {
                    TryDeleteSavedFile(result.Document.FilePath);
                }

                return NoContent();
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

        [HttpGet("{id:guid}/commercial-breakdown")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesView)]
        public async Task<ActionResult<OpportunityCommercialBreakdownViewModel?>> GetCommercialBreakdown(Guid id, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.GetCommercialBreakdownAsync(id, cancellationToken);
            if (result.NotFound)
            {
                return NotFound();
            }

            if (result.Forbidden)
            {
                return Forbid();
            }

            return result.Breakdown;
        }

        [HttpPut("{id:guid}/commercial-breakdown")]
        [Authorize(Policy = PermissionPolicyNames.OpportunitiesEdit)]
        public async Task<ActionResult<OpportunityCommercialBreakdownViewModel>> SaveCommercialBreakdown(Guid id, [FromBody] SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken)
        {
            var result = await _opportunityService.SaveCommercialBreakdownAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Breakdown!;
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

        private async Task<(string StoredFileName, string FilePath)> SaveCommercialDocumentAsync(Guid opportunityId, IFormFile file, CancellationToken cancellationToken)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var storedFileName = $"{opportunityId:N}-{Guid.NewGuid():N}{extension}";
            var relativePath = Path.Combine("uploads", "opportunity-commercial-documents", storedFileName).Replace('\\', '/');
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

        private bool TryDeleteSavedFile(string relativePath)
        {
            try
            {
                var path = ResolveUploadPath(relativePath);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete opportunity upload file {RelativePath}.", relativePath);
                return false;
            }
        }
    }

    public class ChangeOpportunityStageFormRequest
    {
        public Guid StageId { get; set; }
        public string? Remarks { get; set; }
        public IFormFile? ProposalDocument { get; set; }
    }

    public class UploadProposalVersionFormRequest
    {
        public string? Description { get; set; }
        public IFormFile? ProposalDocument { get; set; }
    }

    public class UploadCommercialDocumentFormRequest
    {
        public string DocumentType { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public IFormFile? CommercialDocument { get; set; }
    }
}
