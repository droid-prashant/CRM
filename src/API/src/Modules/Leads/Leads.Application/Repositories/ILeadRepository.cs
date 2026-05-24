using Leads.Application.DTOs;
using Leads.Application.ViewModels;
using Leads.Domain.Entities;
using Leads.Domain.Enums;

namespace Leads.Application.Repositories
{
    public interface ILeadRepository
    {
        Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken);
        Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken);
        Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetLeadSourceLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetLeadCategoryLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetProductLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetCountryLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetIndustryLookupsAsync(CancellationToken cancellationToken);
        Task<bool> SourceRequiresPartnerAsync(Guid sourceId, CancellationToken cancellationToken);
        Task<string?> GetLeadSourceCodeAsync(Guid sourceId, CancellationToken cancellationToken);
        Task<bool> LeadExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadStatus?> GetLeadStatusAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> SourceExistsAsync(Guid sourceId, CancellationToken cancellationToken);
        Task<bool> CategoryExistsAsync(Guid categoryId, CancellationToken cancellationToken);
        Task<bool> CountryExistsAsync(Guid countryId, CancellationToken cancellationToken);
        Task<bool> IndustryExistsAsync(Guid industryId, CancellationToken cancellationToken);
        Task<List<Guid>> GetActiveProductIdsAsync(IEnumerable<Guid> productIds, CancellationToken cancellationToken);
        Task<bool> DuplicateCompanyEmailExistsAsync(string companyName, string email, CancellationToken cancellationToken);
        Task<string> GenerateNextLeadNumberAsync(CancellationToken cancellationToken);
        Task<LeadDetailViewModel> CreateLeadAsync(CreateLeadRequest request, string leadNumber, bool hasDuplicateWarning, CancellationToken cancellationToken);
        Task<LeadDetailViewModel?> UpdateLeadAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadQualificationResultViewModel?> UpdateLeadStatusAsync(Guid id, string status, string? disqualificationReason, string? remarks, CancellationToken cancellationToken);
        Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityCreatedViewModel?> ConvertLeadAsync(Guid id, ConvertLeadRequest request, string opportunityNumber, CancellationToken cancellationToken);
        Task<LeadAssignmentResultViewModel?> AssignLeadAsync(Guid id, AssignLeadRequest request, CancellationToken cancellationToken);
        Task<List<LeadInteractionViewModel>?> GetLeadInteractionsAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadInteractionViewModel?> CreateLeadInteractionAsync(Guid id, CreateLeadInteractionRequest request, CancellationToken cancellationToken);
        Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken);
        Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken);
        Task<bool> UserExistsAsync(Guid userId);
        Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken);
    }
}
