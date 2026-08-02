using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Opportunities.Application.DTOs;
using Opportunities.Application.Repositories;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityService : IOpportunityService
    {
        private const long MaxProposalDocumentBytes = 10 * 1024 * 1024;
        private const long MaxCommercialDocumentBytes = 10 * 1024 * 1024;
        private const string AgreementDocumentType = "Agreement";
        private const string PurchaseOrderDocumentType = "PurchaseOrder";

        private static readonly HashSet<Guid> SupportedCurrencyIds =
        [
            Guid.Parse("70000000-0000-0000-0000-000000000001"),
            Guid.Parse("70000000-0000-0000-0000-000000000002"),
            Guid.Parse("70000000-0000-0000-0000-000000000003")
        ];
        private static readonly HashSet<string> AllowedProposalDocumentExtensions = new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".doc", ".docx" };
        private static readonly HashSet<string> AllowedCommercialDocumentExtensions = new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".doc", ".docx" };
        private static readonly HashSet<string> AllowedProposalDocumentContentTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
        private static readonly HashSet<string> AllowedCommercialDocumentContentTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
        private static readonly HashSet<string> AllowedSubscriptionBillingFrequencies = new(StringComparer.OrdinalIgnoreCase)
        {
            "Monthly",
            "Quarterly",
            "SemiAnnual",
            "Annual"
        };

        private readonly IOpportunityRepository _opportunityRepository;
        private readonly IUserContextService _userContextService;

        public OpportunityService(IOpportunityRepository opportunityRepository, IUserContextService userContextService)
        {
            _opportunityRepository = opportunityRepository;
            _userContextService = userContextService;
        }

        public Task<PagedResultViewModel<OpportunityListItemViewModel>> GetOpportunityListAsync(OpportunityListQuery query, CancellationToken cancellationToken)
        {
            NormalizeQuery(query);
            ApplyOwnerScope(query);
            return _opportunityRepository.GetOpportunityListAsync(query, cancellationToken);
        }

        public Task<List<OpportunityPipelineStageViewModel>> GetPipelineAsync(OpportunityListQuery query, CancellationToken cancellationToken)
        {
            NormalizeQuery(query);
            ApplyOwnerScope(query);
            return _opportunityRepository.GetPipelineAsync(query, cancellationToken);
        }

        public Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken)
        {
            return _opportunityRepository.GetOpportunityLookupsAsync(cancellationToken);
        }

        public async Task<OpportunityResult> CreateOpportunityAsync(CreateOpportunityRequest request, CancellationToken cancellationToken)
        {
            if (!CanAssignOwner(request.OwnerUserId))
            {
                return new OpportunityResult { Forbidden = true };
            }

            var errors = await ValidateCreateRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new OpportunityResult { Errors = errors };
            }

            var opportunityNumber = await GenerateNextOpportunityNumberAsync(cancellationToken);
            var opportunity = await _opportunityRepository.CreateOpportunityAsync(request, opportunityNumber, cancellationToken);

            return new OpportunityResult { Opportunity = opportunity };
        }

        public async Task<OpportunityResult> UpdateOpportunityAsync(Guid id, UpdateOpportunityRequest request, CancellationToken cancellationToken)
        {
            request.Id = id;
            if (!await CanModifyOpportunityAsync(id, cancellationToken) || !CanAssignOwner(request.OwnerUserId))
            {
                return new OpportunityResult { Forbidden = true };
            }

            var errors = await ValidateUpdateRequestAsync(request);
            if (errors.Count > 0)
            {
                return new OpportunityResult { Errors = errors };
            }

            var opportunity = await _opportunityRepository.UpdateOpportunityAsync(request, cancellationToken);
            if (opportunity == null)
            {
                return new OpportunityResult { NotFound = true };
            }

            return new OpportunityResult { Opportunity = opportunity };
        }

        public async Task<OpportunityResult> ChangeStageAsync(Guid id, ChangeOpportunityStageRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityResult { Forbidden = true };
            }

            var errors = await ValidateStageChangeRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new OpportunityResult { Errors = errors };
            }

            var opportunity = await _opportunityRepository.ChangeStageAsync(id, request, cancellationToken);
            return opportunity == null
                ? new OpportunityResult { NotFound = true }
                : new OpportunityResult { Opportunity = opportunity };
        }

        public Task<OpportunityResult> CloseAsWonAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, request, true, cancellationToken);
        }

        public Task<OpportunityResult> CloseAsLostAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, request, false, cancellationToken);
        }

        public async Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetStageHistoryAsync(id, cancellationToken);
        }

        public async Task<OpportunityDocumentViewModel?> GetProposalDocumentAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetProposalDocumentAsync(id, cancellationToken);
        }

        public async Task<List<ProposalVersionViewModel>?> GetProposalHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetProposalHistoryAsync(id, cancellationToken);
        }

        public async Task<OpportunityDocumentViewModel?> GetProposalDocumentVersionAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetProposalDocumentVersionAsync(id, documentId, cancellationToken);
        }

        public async Task<OpportunityProposalDocumentResult> ValidateProposalVersionUploadAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityProposalDocumentResult { Forbidden = true };
            }

            var errors = ValidateProposalDocument(request);
            return new OpportunityProposalDocumentResult { Errors = errors };
        }

        public async Task<OpportunityProposalDocumentResult> UploadProposalVersionAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityProposalDocumentResult { Forbidden = true };
            }

            var errors = ValidateProposalDocument(request);
            if (errors.Count > 0)
            {
                return new OpportunityProposalDocumentResult { Errors = errors };
            }

            var document = await _opportunityRepository.UploadProposalVersionAsync(id, request, cancellationToken);
            return document == null
                ? new OpportunityProposalDocumentResult { NotFound = true }
                : new OpportunityProposalDocumentResult { Document = document };
        }

        public async Task<List<OpportunityCommercialDocumentViewModel>?> GetCommercialDocumentsAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetCommercialDocumentsAsync(id, cancellationToken);
        }

        public async Task<OpportunityCommercialDocumentViewModel?> GetCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetCommercialDocumentAsync(id, documentId, cancellationToken);
        }

        public async Task<OpportunityCommercialDocumentResult> ValidateCommercialDocumentUploadAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityCommercialDocumentResult { Forbidden = true };
            }

            var errors = await ValidateCommercialDocumentUploadRequestAsync(id, request, cancellationToken);
            return new OpportunityCommercialDocumentResult { Errors = errors };
        }

        public async Task<OpportunityCommercialDocumentResult> UploadCommercialDocumentAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityCommercialDocumentResult { Forbidden = true };
            }

            var errors = await ValidateCommercialDocumentUploadRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new OpportunityCommercialDocumentResult { Errors = errors };
            }

            request.DocumentType = NormalizeCommercialDocumentType(request.DocumentType);
            var document = await _opportunityRepository.UploadCommercialDocumentAsync(id, request, cancellationToken);
            return document == null
                ? new OpportunityCommercialDocumentResult { NotFound = true }
                : new OpportunityCommercialDocumentResult { Document = document };
        }

        public async Task<OpportunityCommercialDocumentResult> DeleteCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityCommercialDocumentResult { Forbidden = true };
            }

            var errors = new List<string>();
            if (documentId == Guid.Empty)
            {
                errors.Add("Commercial document id is required.");
            }

            if (!await _opportunityRepository.OpportunityIsWonAsync(id, cancellationToken))
            {
                errors.Add("Agreement or PO documents can be deleted only for Won opportunities.");
            }

            if (errors.Count > 0)
            {
                return new OpportunityCommercialDocumentResult { Errors = errors };
            }

            var existingDocument = await _opportunityRepository.GetCommercialDocumentAsync(id, documentId, cancellationToken);
            if (existingDocument == null)
            {
                return new OpportunityCommercialDocumentResult { NotFound = true };
            }

            if (await _opportunityRepository.CommercialDocumentIsReferencedByBreakdownAsync(id, documentId, cancellationToken))
            {
                return new OpportunityCommercialDocumentResult
                {
                    Errors =
                    [
                        "This document is already referenced in the saved commercial breakdown. Upload the corrected document of the same type first; the reference will be replaced automatically."
                    ]
                };
            }

            var document = await _opportunityRepository.DeleteCommercialDocumentAsync(id, documentId, cancellationToken);
            return document == null
                ? new OpportunityCommercialDocumentResult { NotFound = true }
                : new OpportunityCommercialDocumentResult { Document = document, Deleted = true };
        }

        public async Task<OpportunityCommercialBreakdownQueryResult> GetCommercialBreakdownAsync(Guid id, CancellationToken cancellationToken)
        {
            var currentUserId = _userContextService.GetUserId();
            if (!currentUserId.HasValue)
            {
                return new OpportunityCommercialBreakdownQueryResult { Forbidden = true };
            }

            var canAccess = await _opportunityRepository.UserCanAccessOpportunityAsync(id, currentUserId.Value, HasOverrideAccess(), cancellationToken);
            if (!canAccess)
            {
                return await _opportunityRepository.OpportunityExistsAsync(id, cancellationToken)
                    ? new OpportunityCommercialBreakdownQueryResult { Forbidden = true }
                    : new OpportunityCommercialBreakdownQueryResult { NotFound = true };
            }

            return new OpportunityCommercialBreakdownQueryResult
            {
                Breakdown = await _opportunityRepository.GetCommercialBreakdownAsync(id, cancellationToken)
            };
        }

        public async Task<OpportunityCommercialBreakdownResult> SaveCommercialBreakdownAsync(Guid id, SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityCommercialBreakdownResult { Forbidden = true };
            }

            ApplyCommercialBreakdownDefaults(request);
            var errors = await ValidateCommercialBreakdownRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new OpportunityCommercialBreakdownResult { Errors = errors };
            }

            var breakdown = await _opportunityRepository.SaveCommercialBreakdownAsync(id, request, cancellationToken);
            return breakdown == null
                ? new OpportunityCommercialBreakdownResult { NotFound = true }
                : new OpportunityCommercialBreakdownResult { Breakdown = breakdown };
        }

        public async Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await CanAccessOpportunityAsync(id, cancellationToken))
            {
                return null;
            }

            return await _opportunityRepository.GetActivitiesAsync(id, cancellationToken);
        }

        public async Task<OpportunityActivityResult> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityActivityResult { Forbidden = true };
            }

            var errors = ValidateActivityRequest(request);
            if (errors.Count > 0)
            {
                return new OpportunityActivityResult { Errors = errors };
            }

            var activity = await _opportunityRepository.CreateActivityAsync(id, request, cancellationToken);
            return activity == null
                ? new OpportunityActivityResult { NotFound = true }
                : new OpportunityActivityResult { Activity = activity };
        }

        private async Task<OpportunityResult> CloseOpportunityAsync(Guid id, CloseOpportunityRequest request, bool won, CancellationToken cancellationToken)
        {
            if (!await CanModifyOpportunityAsync(id, cancellationToken))
            {
                return new OpportunityResult { Forbidden = true };
            }

            var errors = ValidateCloseRequest(request, won);
            if (errors.Count > 0)
            {
                return new OpportunityResult { Errors = errors };
            }

            var opportunity = won
                ? await _opportunityRepository.CloseAsWonAsync(id, request, cancellationToken)
                : await _opportunityRepository.CloseAsLostAsync(id, request, cancellationToken);

            return opportunity == null
                ? new OpportunityResult { NotFound = true }
                : new OpportunityResult { Opportunity = opportunity };
        }

        private async Task<List<string>> ValidateCreateRequestAsync(CreateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (request.ClientId == Guid.Empty) errors.Add("ClientId is required.");
            if (request.LeadId == Guid.Empty) errors.Add("Lead is required.");
            if (request.ProductId == Guid.Empty) errors.Add("ProductId is required.");
            if (request.ContactId == Guid.Empty) errors.Add("ContactId is required.");
            if (request.OwnerUserId == Guid.Empty) errors.Add("OwnerUserId is required.");
            if (request.CurrencyId == Guid.Empty) errors.Add("CurrencyId is required.");
            if (string.IsNullOrWhiteSpace(request.Title)) errors.Add("Title is required.");
            if (request.EstimatedValue < 0) errors.Add("EstimatedValue must be greater than or equal to 0.");

            if (request.Title?.Length > 250)
            {
                errors.Add("Title must be 250 characters or fewer.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _opportunityRepository.ClientExistsAsync(request.ClientId, cancellationToken)) errors.Add("ClientId is invalid.");
            if (!await _opportunityRepository.ProductExistsAsync(request.ProductId, cancellationToken)) errors.Add("ProductId is invalid.");
            if (!await _opportunityRepository.ContactBelongsToClientAsync(request.ContactId, request.ClientId, cancellationToken)) errors.Add("ContactId does not belong to the selected client.");
            if (!await _opportunityRepository.UserExistsAsync(request.OwnerUserId)) errors.Add("OwnerUserId is invalid.");
            if (!SupportedCurrencyIds.Contains(request.CurrencyId)) errors.Add("CurrencyId is invalid.");
            if (!await _opportunityRepository.LeadExistsAsync(request.LeadId, cancellationToken)) errors.Add("LeadId is invalid.");

            return errors;
        }

        private async Task<List<string>> ValidateUpdateRequestAsync(UpdateOpportunityRequest request)
        {
            var errors = new List<string>();

            if (request.Id == Guid.Empty) errors.Add("Id is required.");
            if (request.OwnerUserId == Guid.Empty) errors.Add("OwnerUserId is required.");
            if (string.IsNullOrWhiteSpace(request.Title)) errors.Add("Title is required.");
            if (request.EstimatedValue < 0) errors.Add("EstimatedValue must be greater than or equal to 0.");

            if (request.Title?.Length > 250)
            {
                errors.Add("Title must be 250 characters or fewer.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _opportunityRepository.UserExistsAsync(request.OwnerUserId)) errors.Add("OwnerUserId must be an active user.");

            return errors;
        }

        private async Task<List<string>> ValidateStageChangeRequestAsync(Guid opportunityId, ChangeOpportunityStageRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (request.StageId == Guid.Empty)
            {
                errors.Add("StageId is required.");
            }

            if (request.Remarks?.Length > 1000)
            {
                errors.Add("Remarks must be 1000 characters or fewer.");
            }

            if (errors.Count == 0 && !await _opportunityRepository.StageExistsAsync(request.StageId, cancellationToken))
            {
                errors.Add("StageId is invalid.");
            }

            if (HasProposalDocument(request))
            {
                errors.AddRange(ValidateProposalDocument(request));
            }

            if (errors.Count == 0
                && await _opportunityRepository.StageIsProposalSentAsync(request.StageId, cancellationToken)
                && !HasProposalDocument(request)
                && !await _opportunityRepository.OpportunityHasProposalDocumentAsync(opportunityId, cancellationToken))
            {
                errors.Add("Final proposal document is required when moving an opportunity to Proposal Sent.");
            }

            return errors;
        }

        private static bool HasProposalDocument(ChangeOpportunityStageRequest request)
        {
            return !string.IsNullOrWhiteSpace(request.ProposalDocumentPath);
        }

        private static List<string> ValidateProposalDocument(ChangeOpportunityStageRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.ProposalDocumentFileName))
            {
                errors.Add("Proposal document file name is required.");
                return errors;
            }

            var extension = Path.GetExtension(request.ProposalDocumentFileName);
            if (!AllowedProposalDocumentExtensions.Contains(extension))
            {
                errors.Add("Proposal document must be a PDF, DOC, or DOCX file.");
            }

            if (!string.IsNullOrWhiteSpace(request.ProposalDocumentContentType)
                && !AllowedProposalDocumentContentTypes.Contains(request.ProposalDocumentContentType)
                && !string.Equals(request.ProposalDocumentContentType, "application/octet-stream", StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("Proposal document content type is invalid.");
            }

            if (!request.ProposalDocumentSize.HasValue || request.ProposalDocumentSize <= 0)
            {
                errors.Add("Proposal document is required.");
            }
            else if (request.ProposalDocumentSize > MaxProposalDocumentBytes)
            {
                errors.Add("Proposal document must be 10 MB or smaller.");
            }

            return errors;
        }

        private static List<string> ValidateProposalDocument(UploadProposalVersionRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.ProposalDocumentFileName))
            {
                errors.Add("Proposal document file name is required.");
                return errors;
            }

            var extension = Path.GetExtension(request.ProposalDocumentFileName);
            if (!AllowedProposalDocumentExtensions.Contains(extension))
            {
                errors.Add("Proposal document must be a PDF, DOC, or DOCX file.");
            }

            if (!string.IsNullOrWhiteSpace(request.ProposalDocumentContentType)
                && !AllowedProposalDocumentContentTypes.Contains(request.ProposalDocumentContentType)
                && !string.Equals(request.ProposalDocumentContentType, "application/octet-stream", StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("Proposal document content type is invalid.");
            }

            if (!request.ProposalDocumentSize.HasValue || request.ProposalDocumentSize <= 0)
            {
                errors.Add("Proposal document is required.");
            }
            else if (request.ProposalDocumentSize > MaxProposalDocumentBytes)
            {
                errors.Add("Proposal document must be 10 MB or smaller.");
            }

            if (request.Description?.Length > 500)
            {
                errors.Add("Description must be 500 characters or fewer.");
            }

            return errors;
        }

        private static List<string> ValidateCloseRequest(CloseOpportunityRequest request, bool won)
        {
            var errors = new List<string>();

            if (request.ClosedDate == default)
            {
                errors.Add("ClosedDate is required.");
            }

            if (won)
            {
                if (!request.FinalAmount.HasValue)
                {
                    errors.Add("FinalAmount is required.");
                }
                else if (request.FinalAmount < 0)
                {
                    errors.Add("FinalAmount must be greater than or equal to 0.");
                }
            }
            else if (string.IsNullOrWhiteSpace(request.LostReason))
            {
                errors.Add("LostReason is required.");
            }

            if (request.Note?.Length > 1000)
            {
                errors.Add("Note must be 1000 characters or fewer.");
            }

            if (request.LostReason?.Length > 500)
            {
                errors.Add("LostReason must be 500 characters or fewer.");
            }

            return errors;
        }

        private static List<string> ValidateActivityRequest(CreateOpportunityActivityRequest request)
        {
            var errors = new List<string>();
            var allowedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Note", "Call", "Meeting", "FollowUp" };

            if (string.IsNullOrWhiteSpace(request.ActivityType))
            {
                errors.Add("ActivityType is required.");
            }
            else if (!allowedTypes.Contains(request.ActivityType.Trim()))
            {
                errors.Add("ActivityType must be Note, Call, Meeting, or FollowUp.");
            }

            if (string.IsNullOrWhiteSpace(request.Notes))
            {
                errors.Add("Notes is required.");
            }

            if (request.Subject?.Length > 250)
            {
                errors.Add("Subject must be 250 characters or fewer.");
            }

            if (request.Notes?.Length > 2000)
            {
                errors.Add("Notes must be 2000 characters or fewer.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateCommercialDocumentUploadRequestAsync(Guid opportunityId, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (!await _opportunityRepository.OpportunityIsWonAsync(opportunityId, cancellationToken))
            {
                errors.Add("Agreement or PO documents can be uploaded only for Won opportunities.");
                return errors;
            }

            var normalizedType = NormalizeCommercialDocumentType(request.DocumentType);
            if (string.IsNullOrWhiteSpace(request.DocumentType)
                || (normalizedType != AgreementDocumentType && normalizedType != PurchaseOrderDocumentType))
            {
                errors.Add("DocumentType must be Agreement or PurchaseOrder.");
            }

            if (string.IsNullOrWhiteSpace(request.FileName))
            {
                errors.Add("Document file name is required.");
                return errors;
            }

            if (request.Remarks?.Length > 1000)
            {
                errors.Add("Remarks must be 1000 characters or fewer.");
            }

            var extension = Path.GetExtension(request.FileName);
            if (!AllowedCommercialDocumentExtensions.Contains(extension))
            {
                errors.Add("Agreement or PO document must be a PDF, DOC, or DOCX file.");
            }

            if (!string.IsNullOrWhiteSpace(request.ContentType)
                && !AllowedCommercialDocumentContentTypes.Contains(request.ContentType)
                && !string.Equals(request.ContentType, "application/octet-stream", StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("Agreement or PO document content type is invalid.");
            }

            if (request.FileSize <= 0)
            {
                errors.Add("Agreement or PO document is required.");
            }
            else if (request.FileSize > MaxCommercialDocumentBytes)
            {
                errors.Add("Agreement or PO document must be 10 MB or smaller.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateCommercialBreakdownRequestAsync(Guid opportunityId, SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (!await _opportunityRepository.OpportunityIsWonAsync(opportunityId, cancellationToken))
            {
                errors.Add("Commercial breakdown can be saved only for Won opportunities.");
                return errors;
            }

            if (!await _opportunityRepository.OpportunityHasCommercialDocumentAsync(opportunityId, cancellationToken))
            {
                errors.Add("Agreement or PO document is required before saving commercial breakdown.");
            }

            if (!request.AgreementDocumentId.HasValue && !request.PurchaseOrderDocumentId.HasValue)
            {
                errors.Add("Select at least one Agreement or PO document reference.");
            }

            if (!request.AgreementDocumentId.HasValue && (request.AgreementDate.HasValue || request.AgreementExpiryDate.HasValue))
            {
                errors.Add("Agreement dates can be saved only when an Agreement document is referenced.");
            }

            if (!request.PurchaseOrderDocumentId.HasValue && request.PurchaseOrderDate.HasValue)
            {
                errors.Add("PurchaseOrderDate can be saved only when a PO document is referenced.");
            }

            if (request.CurrencyId == Guid.Empty)
            {
                errors.Add("CurrencyId is required.");
            }
            else if (!SupportedCurrencyIds.Contains(request.CurrencyId))
            {
                errors.Add("CurrencyId is invalid.");
            }

            var finalPayableAmount = RoundMoney(request.FinalPayableAmount);
            var licenseAmount = RoundMoney(request.LicenseAmount);
            var amcAmount = RoundMoney(request.AmcAmount);
            var subscriptionAmount = RoundMoney(request.SubscriptionAmount);

            if (finalPayableAmount < 0) errors.Add("FinalPayableAmount must be greater than or equal to 0.");
            if (licenseAmount < 0) errors.Add("License Amount must be greater than or equal to 0.");
            if (amcAmount < 0) errors.Add("AMC Amount must be greater than or equal to 0.");
            if (subscriptionAmount < 0) errors.Add("Subscription Amount must be greater than or equal to 0.");

            if (request.AgreementDocumentId.HasValue)
            {
                if (!await _opportunityRepository.CommercialDocumentBelongsToOpportunityAsync(opportunityId, request.AgreementDocumentId.Value, AgreementDocumentType, cancellationToken))
                {
                    errors.Add("Agreement document reference is invalid.");
                }

                if (!request.AgreementDate.HasValue)
                {
                    errors.Add("AgreementDate is required when an Agreement document is referenced.");
                }

                if (!request.AgreementExpiryDate.HasValue)
                {
                    errors.Add("AgreementExpiryDate is required when an Agreement document is referenced.");
                }
                else if (request.AgreementDate.HasValue && request.AgreementExpiryDate.Value < request.AgreementDate.Value)
                {
                    errors.Add("AgreementExpiryDate must be on or after AgreementDate.");
                }
            }

            if (request.PurchaseOrderDocumentId.HasValue)
            {
                if (!await _opportunityRepository.CommercialDocumentBelongsToOpportunityAsync(opportunityId, request.PurchaseOrderDocumentId.Value, PurchaseOrderDocumentType, cancellationToken))
                {
                    errors.Add("PO document reference is invalid.");
                }

                if (!request.PurchaseOrderDate.HasValue)
                {
                    errors.Add("PurchaseOrderDate is required when a PO document is referenced.");
                }
            }

            if (request.LicenseApplicable && request.SubscriptionApplicable)
            {
                errors.Add("Select either License Applicable or Subscription Applicable, not both.");
            }

            if (!request.LicenseApplicable && !request.SubscriptionApplicable)
            {
                errors.Add("Select License Applicable or Subscription Applicable.");
            }

            if (request.LicenseApplicable)
            {
                if (!licenseAmount.HasValue || licenseAmount <= 0) errors.Add("License Amount is required and must be greater than 0.");
                if (!amcAmount.HasValue || amcAmount <= 0) errors.Add("AMC Amount is required and must be greater than 0.");
                if (!request.AmcStartDate.HasValue) errors.Add("AMC Start Date is required.");
                if (!request.AmcRenewalDate.HasValue) errors.Add("AMC Renewal Date is required.");
                if (!request.AmcExpiryDate.HasValue) errors.Add("AMC Expiry Date is required.");
                if (request.AmcStartDate.HasValue && request.AmcExpiryDate.HasValue && request.AmcExpiryDate.Value < request.AmcStartDate.Value) errors.Add("AMC Expiry Date must be on or after AMC Start Date.");
                if (request.IsFinal && licenseAmount.HasValue && amcAmount.HasValue && finalPayableAmount != RoundMoney(licenseAmount.Value + amcAmount.Value))
                {
                    errors.Add("FinalPayableAmount must equal License Amount plus AMC Amount.");
                }
            }

            if (request.SubscriptionApplicable)
            {
                if (!subscriptionAmount.HasValue || subscriptionAmount <= 0) errors.Add("Subscription Amount is required and must be greater than 0.");
                if (string.IsNullOrWhiteSpace(request.SubscriptionBillingFrequency)) errors.Add("Subscription Billing Frequency is required.");
                else if (!AllowedSubscriptionBillingFrequencies.Contains(request.SubscriptionBillingFrequency.Trim())) errors.Add("Subscription Billing Frequency is invalid.");
                if (!request.SubscriptionStartDate.HasValue) errors.Add("Subscription Start Date is required.");
                if (!request.NextSubscriptionBillingDate.HasValue) errors.Add("Next Subscription Billing Date is required.");
                if (request.SubscriptionStartDate.HasValue && request.NextSubscriptionBillingDate.HasValue && request.NextSubscriptionBillingDate.Value < request.SubscriptionStartDate.Value) errors.Add("Next Subscription Billing Date must be on or after Subscription Start Date.");
                if (request.IsFinal && subscriptionAmount.HasValue && finalPayableAmount != subscriptionAmount.Value)
                {
                    errors.Add("FinalPayableAmount must equal Subscription Amount.");
                }
            }

            if (request.Remarks?.Length > 1000)
            {
                errors.Add("Remarks must be 1000 characters or fewer.");
            }

            return errors;
        }

        private static void ApplyCommercialBreakdownDefaults(SaveOpportunityCommercialBreakdownRequest request)
        {
            request.FinalPayableAmount = RoundMoney(request.FinalPayableAmount);
            request.LicenseAmount = RoundMoney(request.LicenseAmount);
            request.AmcAmount = RoundMoney(request.AmcAmount);
            request.SubscriptionAmount = RoundMoney(request.SubscriptionAmount);

            if (request.LicenseApplicable)
            {
                request.SubscriptionAmount = null;
                request.SubscriptionBillingFrequency = null;
                request.SubscriptionStartDate = null;
                request.NextSubscriptionBillingDate = null;

                if (!request.IsFinal && request.LicenseAmount.HasValue && request.AmcAmount.HasValue)
                {
                    request.FinalPayableAmount = RoundMoney(request.LicenseAmount.Value + request.AmcAmount.Value);
                }
            }

            if (request.SubscriptionApplicable)
            {
                request.LicenseAmount = null;
                request.AmcAmount = null;
                request.AmcStartDate = null;
                request.AmcRenewalDate = null;
                request.AmcExpiryDate = null;

                if (!request.IsFinal && request.SubscriptionAmount.HasValue)
                {
                    request.FinalPayableAmount = request.SubscriptionAmount.Value;
                }
            }

            if (!request.SubscriptionApplicable)
            {
                request.NextSubscriptionBillingDate = null;
                return;
            }

            if (!request.SubscriptionStartDate.HasValue || string.IsNullOrWhiteSpace(request.SubscriptionBillingFrequency))
            {
                return;
            }

            request.NextSubscriptionBillingDate = CalculateNextSubscriptionBillingDate(
                request.SubscriptionStartDate.Value,
                request.SubscriptionBillingFrequency.Trim());
        }

        private static decimal RoundMoney(decimal value)
        {
            return Math.Round(value, 2, MidpointRounding.AwayFromZero);
        }

        private static decimal? RoundMoney(decimal? value)
        {
            return value.HasValue ? RoundMoney(value.Value) : null;
        }

        private static DateTime CalculateNextSubscriptionBillingDate(DateTime startDate, string frequency)
        {
            var months = frequency.Trim().ToLowerInvariant() switch
            {
                "monthly" => 1,
                "quarterly" => 3,
                "semiannual" => 6,
                "annual" => 12,
                _ => 0
            };

            return months == 0 ? startDate : startDate.AddMonths(months);
        }

        private async Task<string> GenerateNextOpportunityNumberAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            return $"OPP-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
        }

        private static void NormalizeQuery(OpportunityListQuery query)
        {
            query.PageNumber = Math.Max(1, query.PageNumber);
            query.PageSize = Math.Clamp(query.PageSize, 1, 100);
        }

        private void ApplyOwnerScope(OpportunityListQuery query)
        {
            if (HasOverrideAccess())
            {
                return;
            }

            var currentUserId = _userContextService.GetUserId();
            if (currentUserId.HasValue)
            {
                query.OwnerUserId = currentUserId.Value;
            }
        }

        private bool CanAssignOwner(Guid ownerUserId)
        {
            return HasOverrideAccess() || _userContextService.GetUserId() == ownerUserId;
        }

        private Task<bool> CanAccessOpportunityAsync(Guid id, CancellationToken cancellationToken)
        {
            var currentUserId = _userContextService.GetUserId();
            return currentUserId.HasValue
                ? _opportunityRepository.UserCanAccessOpportunityAsync(id, currentUserId.Value, HasOverrideAccess(), cancellationToken)
                : Task.FromResult(false);
        }

        private Task<bool> CanModifyOpportunityAsync(Guid id, CancellationToken cancellationToken)
        {
            var currentUserId = _userContextService.GetUserId();
            return currentUserId.HasValue
                ? _opportunityRepository.UserCanModifyOpportunityAsync(id, currentUserId.Value, HasOverrideAccess(), cancellationToken)
                : Task.FromResult(false);
        }

        private bool HasOverrideAccess()
        {
            var roles = _userContextService.GetUserRoles();
            return roles.Any(role =>
                string.Equals(role, DefaultRoles.SuperAdmin, StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, DefaultRoles.Admin, StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, DefaultRoles.Manager, StringComparison.OrdinalIgnoreCase));
        }

        private static string NormalizeCommercialDocumentType(string documentType)
        {
            if (string.Equals(documentType, PurchaseOrderDocumentType, StringComparison.OrdinalIgnoreCase)
                || string.Equals(documentType, "PO", StringComparison.OrdinalIgnoreCase)
                || string.Equals(documentType, "Purchase Order", StringComparison.OrdinalIgnoreCase))
            {
                return PurchaseOrderDocumentType;
            }

            if (string.Equals(documentType, AgreementDocumentType, StringComparison.OrdinalIgnoreCase))
            {
                return AgreementDocumentType;
            }

            return string.Empty;
        }
    }
}
