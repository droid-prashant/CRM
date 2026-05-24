using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Opportunities.Application.DTOs;
using Opportunities.Application.Repositories;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityService : IOpportunityService
    {
        private static readonly HashSet<Guid> SupportedCurrencyIds =
        [
            Guid.Parse("70000000-0000-0000-0000-000000000001"),
            Guid.Parse("70000000-0000-0000-0000-000000000002"),
            Guid.Parse("70000000-0000-0000-0000-000000000003")
        ];

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

            var errors = await ValidateStageChangeRequestAsync(request, cancellationToken);
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
            if (request.LeadId.HasValue && !await _opportunityRepository.LeadExistsAsync(request.LeadId.Value, cancellationToken)) errors.Add("LeadId is invalid.");

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

        private async Task<List<string>> ValidateStageChangeRequestAsync(ChangeOpportunityStageRequest request, CancellationToken cancellationToken)
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
    }
}
