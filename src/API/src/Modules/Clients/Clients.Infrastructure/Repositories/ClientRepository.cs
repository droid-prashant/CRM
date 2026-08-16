using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;
using Clients.Domain.Entities;
using Clients.Domain.Enums;
using Clients.Infrastructure.Persistence.Data;
using ERP.Core.Constants;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Clients.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ClientsDbContext _dbContext;

        public ClientRepository(ClientsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ClientListResponseViewModel> GetClientsAsync(ClientQueryRequest request, CancellationToken cancellationToken)
        {
            var query = BaseQuery();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var search = request.SearchTerm.Trim().ToLower();
                query = query.Where(client => client.ClientCode.ToLower().Contains(search)
                    || client.Name.ToLower().Contains(search)
                    || (client.ShortName != null && client.ShortName.ToLower().Contains(search))
                    || (client.Website != null && client.Website.ToLower().Contains(search))
                    || (client.TaxNumber != null && client.TaxNumber.ToLower().Contains(search)));
            }

            if (request.CountryId.HasValue)
            {
                query = query.Where(client => client.CountryId == request.CountryId.Value);
            }

            if (request.IndustryId.HasValue)
            {
                query = query.Where(client => client.IndustryId == request.IndustryId.Value);
            }

            if (request.AccountOwnerUserId.HasValue)
            {
                query = query.Where(client => client.AccountOwnerUserId == request.AccountOwnerUserId.Value);
            }

            if (request.Status.HasValue)
            {
                query = query.Where(client => client.Status == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);
            var page = Math.Max(request.PageNumber, 1);
            var pageSize = Math.Clamp(request.PageSize, 1, 200);
            var clients = await query
                .ApplySort(request.SortBy, request.SortDirection, _dbContext)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new ClientListResponseViewModel
            {
                Items = await MapListAsync(clients, cancellationToken),
                PageNumber = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<ClientCreatedViewModel?> GetClientAsync(Guid id, CancellationToken cancellationToken)
        {
            var client = await BaseQuery()
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            return client == null ? null : await MapDetailAsync(client, cancellationToken);
        }

        public async Task<ClientDetailViewModel?> GetClientDetailAsync(Guid id, CancellationToken cancellationToken)
        {
            var client = await BaseQuery()
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            return client == null ? null : await MapClientDetailAsync(client, cancellationToken);
        }

        public async Task<ClientTimelineResponseViewModel?> GetClientTimelineAsync(Guid id, ClientTimelineQueryRequest request, CancellationToken cancellationToken)
        {
            if (!await ClientExistsAsync(id, cancellationToken))
            {
                return null;
            }

            var items = await BuildTimelineAsync(id, cancellationToken);
            var activityTypes = items
                .Select(item => item.ActivityType)
                .Where(type => !string.IsNullOrWhiteSpace(type))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(type => type)
                .ToList();

            if (!string.IsNullOrWhiteSpace(request.ActivityType))
            {
                items = items
                    .Where(item => string.Equals(item.ActivityType, request.ActivityType, StringComparison.OrdinalIgnoreCase)
                        || string.Equals(item.EntityType, request.ActivityType, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            var totalCount = items.Count;
            var page = Math.Max(request.PageNumber, 1);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            return new ClientTimelineResponseViewModel
            {
                Items = items
                    .OrderByDescending(item => item.ActivityDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList(),
                PageNumber = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize),
                ActivityTypes = activityTypes
            };
        }

        public async Task<ClientRelatedRecordsSummaryViewModel?> GetRelatedRecordsSummaryAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await ClientExistsAsync(id, cancellationToken))
            {
                return null;
            }

            var opportunityIds = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunity.ClientId == id && opportunity.IsActive)
                .Select(opportunity => opportunity.Id)
                .ToListAsync(cancellationToken);

            var leadIds = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunity.ClientId == id && opportunity.IsActive)
                .Select(opportunity => opportunity.LeadId)
                .Distinct()
                .ToListAsync(cancellationToken);

            var opportunityInteractions = await _dbContext.OpportunityActivities
                .AsNoTracking()
                .Where(activity => opportunityIds.Contains(activity.OpportunityId) && activity.IsActive)
                .CountAsync(cancellationToken);

            var leadInteractions = await _dbContext.LeadInteractions
                .AsNoTracking()
                .Where(interaction => leadIds.Contains(interaction.LeadId) && interaction.IsActive)
                .CountAsync(cancellationToken);

            return new ClientRelatedRecordsSummaryViewModel
            {
                TotalOpportunities = opportunityIds.Count,
                TotalRfps = 0,
                TotalTasks = 0,
                TotalDocuments = 0,
                TotalInteractions = opportunityInteractions + leadInteractions
            };
        }

        public Task<ClientEditViewModel?> GetClientEditAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.Clients
                .AsNoTracking()
                .Where(client => client.Id == id && !client.IsDeleted)
                .Select(client => new ClientEditViewModel
                {
                    Id = client.Id,
                    ClientCode = client.ClientCode,
                    Name = client.Name,
                    ShortName = client.ShortName,
                    ClientTypeId = client.ClientTypeId,
                    IndustryId = client.IndustryId,
                    CountryId = client.CountryId,
                    Address = client.Address,
                    Website = client.Website,
                    TaxNumber = client.TaxNumber,
                    RegistrationNumber = client.RegistrationNumber,
                    Status = client.Status,
                    AccountOwnerUserId = client.AccountOwnerUserId,
                    Notes = client.Notes,
                    IsActive = client.IsActive
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<ClientCreatedViewModel> CreateClientAsync(CreateClientRequest request, string clientCode, CancellationToken cancellationToken)
        {
            var client = new Client
            {
                ClientCode = clientCode,
                Name = request.Name.Trim(),
                NormalizedName = NormalizeName(request.Name),
                ShortName = Clean(request.ShortName),
                ClientTypeId = request.ClientTypeId,
                IndustryId = request.IndustryId,
                CountryId = request.CountryId,
                Address = Clean(request.Address),
                Website = Clean(request.Website),
                TaxNumber = Clean(request.TaxNumber),
                RegistrationNumber = Clean(request.RegistrationNumber),
                AccountOwnerUserId = request.AccountOwnerUserId,
                Notes = Clean(request.Notes),
                Status = ClientStatus.Active,
                IsActive = true,
                TimelineEntries = new List<ClientTimelineEntry>
                {
                    new()
                    {
                        EventType = "ClientCreated",
                        Description = "Client profile was created."
                    }
                }
            };

            _dbContext.Clients.Add(client);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return (await GetClientAsync(client.Id, cancellationToken))!;
        }

        public async Task<ClientCreatedViewModel?> UpdateClientAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken)
        {
            var client = await _dbContext.Clients
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

            if (client == null)
            {
                return null;
            }

            client.Name = request.Name.Trim();
            client.NormalizedName = NormalizeName(request.Name);
            client.ShortName = Clean(request.ShortName);
            client.ClientTypeId = request.ClientTypeId;
            client.IndustryId = request.IndustryId;
            client.CountryId = request.CountryId;
            client.Address = Clean(request.Address);
            client.Website = Clean(request.Website);
            client.TaxNumber = Clean(request.TaxNumber);
            client.RegistrationNumber = Clean(request.RegistrationNumber);
            client.AccountOwnerUserId = request.AccountOwnerUserId;
            client.Notes = Clean(request.Notes);
            client.Status = request.Status;
            client.IsActive = request.IsActive;
            client.TimelineEntries.Add(new ClientTimelineEntry
            {
                EventType = "ClientUpdated",
                Description = "Client profile was updated."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await GetClientAsync(client.Id, cancellationToken);
        }

        public Task<bool> ActivateClientAsync(Guid id, CancellationToken cancellationToken) => SetClientStatusAsync(id, true, ClientStatus.Active, cancellationToken);
        public Task<bool> DeactivateClientAsync(Guid id, CancellationToken cancellationToken) => SetClientStatusAsync(id, false, ClientStatus.Inactive, cancellationToken);

        public async Task<bool> SoftDeleteClientAsync(Guid id, CancellationToken cancellationToken)
        {
            var client = await _dbContext.Clients
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

            if (client == null)
            {
                return false;
            }

            client.IsActive = false;
            client.IsDeleted = true;
            client.Status = ClientStatus.Inactive;
            client.TimelineEntries.Add(new ClientTimelineEntry
            {
                EventType = "ClientDeleted",
                Description = "Client profile was deleted."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<List<ClientLookupViewModel>> GetActiveClientLookupsAsync(CancellationToken cancellationToken)
        {
            var clients = await _dbContext.Clients
                .AsNoTracking()
                .Where(client => client.IsActive && !client.IsDeleted)
                .OrderBy(client => client.Name)
                .Select(client => new ClientLookupViewModel
                {
                    Id = client.Id,
                    ClientCode = client.ClientCode,
                    Name = client.Name,
                    CountryName = string.Empty
                })
                .ToListAsync(cancellationToken);

            var countryIds = clients.Select(client => client.Id).Distinct().ToList();
            var clientCountries = await _dbContext.Clients
                .AsNoTracking()
                .Where(client => countryIds.Contains(client.Id))
                .Select(client => new { client.Id, client.CountryId })
                .ToDictionaryAsync(client => client.Id, client => client.CountryId, cancellationToken);

            var countries = await _dbContext.LookupDetails
                .AsNoTracking()
                .Where(country => country.LookupId == LookUpTypeEnum.Country && clientCountries.Values.Contains(country.Id))
                .ToDictionaryAsync(country => country.Id, country => country.Name, cancellationToken);

            foreach (var client in clients)
            {
                if (clientCountries.TryGetValue(client.Id, out var countryId))
                {
                    client.CountryName = countries.GetValueOrDefault(countryId) ?? string.Empty;
                }
            }

            return clients;
        }

        public async Task<ClientLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken)
        {
            return new ClientLookupBundleViewModel
            {
                ClientTypes = await GetLookupDetailsAsync(LookUpTypeEnum.ClientType, cancellationToken),
                Countries = await GetLookupDetailsAsync(LookUpTypeEnum.Country, cancellationToken),
                Industries = await GetLookupDetailsAsync(LookUpTypeEnum.Industry, cancellationToken)
            };
        }

        public async Task<ClientFilterLookupViewModel> GetFilterLookupsAsync(CancellationToken cancellationToken)
        {
            return new ClientFilterLookupViewModel
            {
                Countries = await GetLookupDetailsAsync(LookUpTypeEnum.Country, cancellationToken),
                Industries = await GetLookupDetailsAsync(LookUpTypeEnum.Industry, cancellationToken),
                Statuses =
                [
                    new LookupViewModel { Id = Guid.Parse("82000000-0000-0000-0000-000000000001"), Code = ClientStatus.Active.ToString(), Name = "Active" },
                    new LookupViewModel { Id = Guid.Parse("82000000-0000-0000-0000-000000000002"), Code = ClientStatus.Inactive.ToString(), Name = "Inactive" }
                ]
            };
        }

        public Task<bool> CountryExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(country => country.LookupId == LookUpTypeEnum.Country && country.Id == id && country.IsActive, cancellationToken);
        public Task<bool> IndustryExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(industry => industry.LookupId == LookUpTypeEnum.Industry && industry.Id == id && industry.IsActive, cancellationToken);
        public Task<bool> ClientTypeExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(type => type.LookupId == LookUpTypeEnum.ClientType && type.Id == id && type.IsActive, cancellationToken);

        public Task<bool> DuplicateClientExistsAsync(string normalizedName, Guid countryId, Guid? excludingId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(
                client => !client.IsDeleted
                    && client.NormalizedName == normalizedName
                    && client.CountryId == countryId
                    && (!excludingId.HasValue || client.Id != excludingId.Value),
                cancellationToken);
        }

        private Task<bool> ClientExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(client => client.Id == id && !client.IsDeleted, cancellationToken);
        }

        public Task<bool> CodeExistsAsync(string clientCode, CancellationToken cancellationToken)
        {
            var normalizedCode = clientCode.Trim().ToUpperInvariant();
            return _dbContext.Clients.AnyAsync(client => client.ClientCode.ToUpper() == normalizedCode, cancellationToken);
        }

        public async Task<string> GenerateNextClientCodeAsync(CancellationToken cancellationToken)
        {
            const string prefix = "CL-";
            var lastCode = await _dbContext.Clients
                .AsNoTracking()
                .Where(client => client.ClientCode.StartsWith(prefix))
                .OrderByDescending(client => client.ClientCode)
                .Select(client => client.ClientCode)
                .FirstOrDefaultAsync(cancellationToken);

            var nextNumber = 1;
            if (!string.IsNullOrWhiteSpace(lastCode) && int.TryParse(lastCode[prefix.Length..], out var number))
            {
                nextNumber = number + 1;
            }

            return $"{prefix}{nextNumber:000000}";
        }

        private async Task<bool> SetClientStatusAsync(Guid id, bool isActive, ClientStatus status, CancellationToken cancellationToken)
        {
            var client = await _dbContext.Clients
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);

            if (client == null)
            {
                return false;
            }

            client.IsActive = isActive;
            client.Status = status;
            client.TimelineEntries.Add(new ClientTimelineEntry
            {
                EventType = isActive ? "ClientActivated" : "ClientDeactivated",
                Description = isActive ? "Client profile was activated." : "Client profile was deactivated."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private IQueryable<Client> BaseQuery()
        {
            return _dbContext.Clients
                .AsNoTracking()
                .Where(x => !x.IsDeleted);
        }

        private async Task<List<ClientListItemViewModel>> MapListAsync(List<Client> clients, CancellationToken cancellationToken)
        {
            var countryIds = clients.Select(client => client.CountryId).Distinct().ToList();
            var industryIds = clients.Select(client => client.IndustryId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var clientIds = clients.Select(client => client.Id).Distinct().ToList();

            var countries = await _dbContext.LookupDetails
                .AsNoTracking()
                .Where(country => country.LookupId == LookUpTypeEnum.Country && countryIds.Contains(country.Id))
                .ToDictionaryAsync(country => country.Id, country => country.Name, cancellationToken);

            var industries = await _dbContext.LookupDetails
                .AsNoTracking()
                .Where(industry => industry.LookupId == LookUpTypeEnum.Industry && industryIds.Contains(industry.Id))
                .ToDictionaryAsync(industry => industry.Id, industry => industry.Name, cancellationToken);

            var clientTypeIds = clients.Select(client => client.ClientTypeId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var clientTypes = await _dbContext.LookupDetails
                .AsNoTracking()
                .Where(clientType => clientType.LookupId == LookUpTypeEnum.ClientType && clientTypeIds.Contains(clientType.Id))
                .ToDictionaryAsync(clientType => clientType.Id, clientType => clientType.Name, cancellationToken);

            var contactCounts = await _dbContext.ClientContacts
                .AsNoTracking()
                .Where(contact => clientIds.Contains(contact.ClientId) && !contact.IsDeleted)
                .GroupBy(contact => contact.ClientId)
                .Select(group => new { ClientId = group.Key, Count = group.Count() })
                .ToDictionaryAsync(item => item.ClientId, item => item.Count, cancellationToken);

            var productCounts = await GetProductCountsAsync(clientIds, cancellationToken);

            return clients.Select(client => MapList(client, countries, industries, clientTypes, contactCounts, productCounts)).ToList();
        }

        private async Task<ClientCreatedViewModel> MapDetailAsync(Client client, CancellationToken cancellationToken)
        {
            var item = (await MapListAsync([client], cancellationToken)).Single();
            return new ClientCreatedViewModel
            {
                Id = item.Id,
                ClientCode = item.ClientCode,
                Name = item.Name,
                ShortName = item.ShortName,
                ClientTypeId = item.ClientTypeId,
                ClientTypeName = item.ClientTypeName,
                IndustryId = item.IndustryId,
                IndustryName = item.IndustryName,
                CountryId = item.CountryId,
                CountryName = item.CountryName,
                Address = item.Address,
                Website = item.Website,
                TaxNumber = item.TaxNumber,
                RegistrationNumber = item.RegistrationNumber,
                AccountOwnerUserId = item.AccountOwnerUserId,
                AccountOwnerUserName = item.AccountOwnerUserName,
                Notes = item.Notes,
                Status = item.Status,
                StatusName = item.StatusName,
                IsActive = item.IsActive,
                CreatedAt = item.CreatedAt,
                CreatedBy = client.CreatedBy,
                UpdatedBy = client.UpdatedBy,
                UpdatedAt = client.UpdatedOn,
                TimelineEntries = client.TimelineEntries
                    .Where(entry => entry.IsActive)
                    .OrderByDescending(entry => entry.CreatedOn)
                    .Select(entry => new ClientTimelineEntryViewModel
                    {
                        Id = entry.Id,
                        EventType = entry.EventType,
                        Description = entry.Description,
                        CreatedAt = entry.CreatedOn
                    })
                    .ToList()
            };
        }

        private async Task<ClientDetailViewModel> MapClientDetailAsync(Client client, CancellationToken cancellationToken)
        {
            var detail = await MapDetailAsync(client, cancellationToken);

            return new ClientDetailViewModel
            {
                Id = detail.Id,
                ClientCode = detail.ClientCode,
                Name = detail.Name,
                ShortName = detail.ShortName,
                ClientTypeId = detail.ClientTypeId,
                ClientTypeName = detail.ClientTypeName,
                IndustryId = detail.IndustryId,
                IndustryName = detail.IndustryName,
                CountryId = detail.CountryId,
                CountryName = detail.CountryName,
                Address = detail.Address,
                Website = detail.Website,
                TaxNumber = detail.TaxNumber,
                RegistrationNumber = detail.RegistrationNumber,
                AccountOwnerUserId = detail.AccountOwnerUserId,
                AccountOwnerUserName = detail.AccountOwnerUserName,
                Notes = detail.Notes,
                Status = detail.Status,
                StatusName = detail.StatusName,
                ContactCount = detail.ContactCount,
                ProductCount = detail.ProductCount,
                IsActive = detail.IsActive,
                CreatedAt = detail.CreatedAt,
                CreatedBy = detail.CreatedBy,
                UpdatedBy = detail.UpdatedBy,
                UpdatedAt = detail.UpdatedAt,
                TimelineEntries = detail.TimelineEntries,
                Timeline = detail.TimelineEntries,
                Contacts = await GetContactSummariesAsync(client.Id, cancellationToken),
                Products = await GetProductSummariesAsync(client.Id, cancellationToken),
                Opportunities = await GetOpportunitySummariesAsync(client.Id, cancellationToken),
                Rfps = new List<ClientRelatedRfpViewModel>(),
                Documents = new List<ClientDocumentSummaryViewModel>()
            };
        }

        private async Task<List<ClientTimelineViewModel>> BuildTimelineAsync(Guid clientId, CancellationToken cancellationToken)
        {
            var timeline = new List<ClientTimelineViewModel>();

            var opportunityRows = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunity.ClientId == clientId && opportunity.IsActive)
                .Select(opportunity => new
                {
                    opportunity.Id,
                    opportunity.OpportunityNumber,
                    opportunity.Title,
                    opportunity.Status,
                    opportunity.CreatedOn,
                    opportunity.CreatedBy,
                    opportunity.LeadId
                })
                .ToListAsync(cancellationToken);

            var opportunityIds = opportunityRows.Select(opportunity => opportunity.Id).ToList();
            var leadIds = opportunityRows
                .Select(opportunity => opportunity.LeadId)
                .Distinct()
                .ToList();

            timeline.AddRange((await _dbContext.ClientTimelineEntries
                .AsNoTracking()
                .Where(entry => entry.ClientId == clientId && entry.IsActive)
                .ToListAsync(cancellationToken))
                .Select(entry => new ClientTimelineViewModel
                {
                    EntityType = "Client",
                    EntityId = entry.Id,
                    ActivityType = entry.EventType,
                    Title = entry.EventType,
                    Description = entry.Description,
                    ActivityDate = entry.CreatedOn,
                    CreatedByUserName = null,
                    IsSystemGenerated = true,
                    ReferenceEntity = "ClientTimelineEntry"
                }));

            timeline.AddRange(opportunityRows.Select(opportunity => new ClientTimelineViewModel
            {
                EntityType = "Opportunity",
                EntityId = opportunity.Id,
                ActivityType = "Opportunity",
                Title = $"{opportunity.OpportunityNumber} - {opportunity.Title}",
                Description = $"Opportunity created with status {opportunity.Status}.",
                ActivityDate = opportunity.CreatedOn,
                CreatedByUserName = null,
                IsSystemGenerated = true,
                ReferenceEntity = "Opportunity"
            }));

            timeline.AddRange((await _dbContext.OpportunityActivities
                .AsNoTracking()
                .Where(activity => opportunityIds.Contains(activity.OpportunityId) && activity.IsActive)
                .ToListAsync(cancellationToken))
                .Select(activity => new ClientTimelineViewModel
                {
                    EntityType = "OpportunityActivity",
                    EntityId = activity.Id,
                    ActivityType = activity.ActivityType,
                    Title = string.IsNullOrWhiteSpace(activity.Subject) ? activity.ActivityType : activity.Subject,
                    Description = activity.Notes,
                    ActivityDate = activity.ActivityDate,
                    CreatedByUserName = null,
                    IsSystemGenerated = false,
                    ReferenceEntity = "OpportunityActivity"
                }));

            var stages = await _dbContext.OpportunityStages
                .AsNoTracking()
                .Where(stage => stage.IsActive && !stage.IsDeleted)
                .Select(stage => new { stage.Id, stage.Name })
                .ToDictionaryAsync(stage => stage.Id, stage => stage.Name, cancellationToken);

            timeline.AddRange((await _dbContext.OpportunityStageHistories
                .AsNoTracking()
                .Where(history => opportunityIds.Contains(history.OpportunityId) && history.IsActive)
                .ToListAsync(cancellationToken))
                .Select(history =>
                {
                    stages.TryGetValue(history.ToStageId, out var toStageName);
                    return new ClientTimelineViewModel
                    {
                        EntityType = "OpportunityStage",
                        EntityId = history.Id,
                        ActivityType = "OpportunityStage",
                        Title = $"Stage changed to {toStageName ?? "another stage"}",
                        Description = history.Remarks,
                        ActivityDate = history.CreatedOn,
                        CreatedByUserName = null,
                        IsSystemGenerated = true,
                        ReferenceEntity = "OpportunityStageHistory"
                    };
                }));

            timeline.AddRange((await _dbContext.LeadTimelineEntries
                .AsNoTracking()
                .Where(entry => leadIds.Contains(entry.LeadId) && entry.IsActive)
                .ToListAsync(cancellationToken))
                .Select(entry => new ClientTimelineViewModel
                {
                    EntityType = "Lead",
                    EntityId = entry.Id,
                    ActivityType = entry.EventType,
                    Title = entry.EventType,
                    Description = entry.Description,
                    ActivityDate = entry.CreatedOn,
                    CreatedByUserName = null,
                    IsSystemGenerated = true,
                    ReferenceEntity = "LeadTimelineEntry"
                }));

            timeline.AddRange((await _dbContext.LeadInteractions
                .AsNoTracking()
                .Where(interaction => leadIds.Contains(interaction.LeadId) && interaction.IsActive)
                .ToListAsync(cancellationToken))
                .Select(interaction => new ClientTimelineViewModel
                {
                    EntityType = "LeadInteraction",
                    EntityId = interaction.Id,
                    ActivityType = interaction.InteractionType.ToString(),
                    Title = string.IsNullOrWhiteSpace(interaction.Subject) ? interaction.InteractionType.ToString() : interaction.Subject,
                    Description = interaction.Notes,
                    ActivityDate = interaction.InteractionDate,
                    CreatedByUserName = null,
                    IsSystemGenerated = false,
                    ReferenceEntity = "LeadInteraction"
                }));

            await PopulateTimelineUserNamesAsync(timeline, cancellationToken);
            return timeline.OrderByDescending(item => item.ActivityDate).ToList();
        }

        private async Task PopulateTimelineUserNamesAsync(List<ClientTimelineViewModel> timeline, CancellationToken cancellationToken)
        {
            if (timeline.Count == 0)
            {
                return;
            }

            var timelineIds = timeline
                .Select(item => item.EntityId)
                .Distinct()
                .ToList();
            var createdByByTimelineId = new Dictionary<Guid, Guid>();

            foreach (var entry in await _dbContext.ClientTimelineEntries.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            foreach (var entry in await _dbContext.LeadTimelineEntries.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            foreach (var entry in await _dbContext.OpportunityActivities.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            foreach (var entry in await _dbContext.OpportunityStageHistories.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            foreach (var entry in await _dbContext.LeadInteractions.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            foreach (var entry in await _dbContext.Opportunities.AsNoTracking().Where(entry => timelineIds.Contains(entry.Id)).Select(entry => new { entry.Id, entry.CreatedBy }).ToListAsync(cancellationToken))
            {
                createdByByTimelineId[entry.Id] = entry.CreatedBy;
            }

            var userIds = createdByByTimelineId.Values.Where(id => id != Guid.Empty).Distinct().ToList();
            var users = await _dbContext.Users
                .AsNoTracking()
                .Where(user => userIds.Contains(user.Id))
                .Select(user => new { user.Id, user.FullName })
                .ToDictionaryAsync(user => user.Id, user => user.FullName, cancellationToken);

            foreach (var item in timeline)
            {
                if (createdByByTimelineId.TryGetValue(item.EntityId, out var userId))
                {
                    item.CreatedByUserName = users.GetValueOrDefault(userId);
                }
            }
        }

        private async Task<List<ClientContactSummaryViewModel>> GetContactSummariesAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return await _dbContext.ClientContacts
                .AsNoTracking()
                .Where(contact => contact.ClientId == clientId && !contact.IsDeleted)
                .OrderByDescending(contact => contact.IsPrimary)
                .ThenBy(contact => contact.FirstName)
                .ThenBy(contact => contact.LastName)
                .Select(contact => new ClientContactSummaryViewModel
                {
                    Id = contact.Id,
                    FullName = contact.FirstName + " " + contact.LastName,
                    Designation = contact.Designation,
                    Department = contact.Department,
                    Email = contact.Email,
                    Phone = contact.Phone,
                    Mobile = contact.Mobile,
                    IsPrimary = contact.IsPrimary,
                    Status = contact.Status.ToString()
                })
                .ToListAsync(cancellationToken);
        }

        private async Task<List<ClientRelatedOpportunityViewModel>> GetOpportunitySummariesAsync(Guid clientId, CancellationToken cancellationToken)
        {
            var opportunities = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunity.ClientId == clientId && opportunity.IsActive)
                .OrderByDescending(opportunity => opportunity.CreatedOn)
                .Select(opportunity => new
                {
                    opportunity.Id,
                    opportunity.OpportunityNumber,
                    opportunity.Title,
                    opportunity.ProductId,
                    opportunity.StageId,
                    opportunity.EstimatedValue,
                    opportunity.Status
                })
                .ToListAsync(cancellationToken);

            var productIds = opportunities.Select(opportunity => opportunity.ProductId).Distinct().ToList();
            var stageIds = opportunities.Select(opportunity => opportunity.StageId).Distinct().ToList();

            var products = await _dbContext.Products
                .AsNoTracking()
                .Where(product => productIds.Contains(product.Id))
                .Select(product => new { product.Id, product.Name })
                .ToDictionaryAsync(product => product.Id, product => product.Name, cancellationToken);

            var stages = await _dbContext.OpportunityStages
                .AsNoTracking()
                .Where(stage => stageIds.Contains(stage.Id))
                .Select(stage => new { stage.Id, stage.Name })
                .ToDictionaryAsync(stage => stage.Id, stage => stage.Name, cancellationToken);

            return opportunities.Select(opportunity => new ClientRelatedOpportunityViewModel
            {
                Id = opportunity.Id,
                OpportunityNumber = opportunity.OpportunityNumber,
                Title = opportunity.Title,
                ProductName = products.GetValueOrDefault(opportunity.ProductId),
                StageName = stages.GetValueOrDefault(opportunity.StageId) ?? string.Empty,
                EstimatedValue = opportunity.EstimatedValue,
                Status = opportunity.Status
            }).ToList();
        }

        private async Task<List<ClientProductSummaryViewModel>> GetProductSummariesAsync(Guid clientId, CancellationToken cancellationToken)
        {
            List<ClientProduct> mappings;
            try
            {
                mappings = await _dbContext.ClientProducts
                    .AsNoTracking()
                    .Where(product => product.ClientId == clientId && !product.IsDeleted)
                    .OrderBy(product => product.RelationshipStatus)
                    .ThenBy(product => product.CreatedOn)
                    .ToListAsync(cancellationToken);
            }
            catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UndefinedTable)
            {
                return new List<ClientProductSummaryViewModel>();
            }

            var productIds = mappings.Select(mapping => mapping.ProductId).Distinct().ToList();
            var ownerIds = mappings.Select(mapping => mapping.OwnerUserId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var opportunityIds = mappings.Select(mapping => mapping.OpportunityId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();

            var products = await _dbContext.Products
                .AsNoTracking()
                .Where(product => productIds.Contains(product.Id))
                .Select(product => new { product.Id, product.Code, product.Name })
                .ToDictionaryAsync(product => product.Id, cancellationToken);

            var owners = await _dbContext.Users
                .AsNoTracking()
                .Where(user => ownerIds.Contains(user.Id))
                .Select(user => new { user.Id, user.FullName })
                .ToDictionaryAsync(user => user.Id, user => user.FullName, cancellationToken);

            var opportunities = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunityIds.Contains(opportunity.Id))
                .Select(opportunity => new { opportunity.Id, opportunity.OpportunityNumber, opportunity.Title })
                .ToDictionaryAsync(opportunity => opportunity.Id, cancellationToken);

            return mappings.Select(mapping =>
            {
                products.TryGetValue(mapping.ProductId, out var product);
                var opportunity = mapping.OpportunityId.HasValue ? opportunities.GetValueOrDefault(mapping.OpportunityId.Value) : null;

                return new ClientProductSummaryViewModel
                {
                    Id = mapping.Id,
                    ProductId = mapping.ProductId,
                    ProductCode = product?.Code ?? string.Empty,
                    ProductName = product?.Name ?? string.Empty,
                    RelationshipStatus = mapping.RelationshipStatus,
                    OpportunityId = mapping.OpportunityId,
                    OpportunityNumber = opportunity?.OpportunityNumber,
                    OpportunityTitle = opportunity?.Title,
                    OwnerUserId = mapping.OwnerUserId,
                    OwnerUserName = mapping.OwnerUserId.HasValue ? owners.GetValueOrDefault(mapping.OwnerUserId.Value) : null,
                    StartDate = mapping.StartDate,
                    EndDate = mapping.EndDate,
                    Notes = mapping.Notes
                };
            }).ToList();
        }

        private async Task<Dictionary<Guid, int>> GetProductCountsAsync(List<Guid> clientIds, CancellationToken cancellationToken)
        {
            try
            {
                return await _dbContext.ClientProducts
                    .AsNoTracking()
                    .Where(product => clientIds.Contains(product.ClientId) && !product.IsDeleted)
                    .GroupBy(product => product.ClientId)
                    .Select(group => new { ClientId = group.Key, Count = group.Count() })
                    .ToDictionaryAsync(item => item.ClientId, item => item.Count, cancellationToken);
            }
            catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UndefinedTable)
            {
                return new Dictionary<Guid, int>();
            }
        }

        private static ClientListItemViewModel MapList(Client client, IReadOnlyDictionary<Guid, string> countries, IReadOnlyDictionary<Guid, string> industries, IReadOnlyDictionary<Guid, string> clientTypes, IReadOnlyDictionary<Guid, int> contactCounts, IReadOnlyDictionary<Guid, int> productCounts)
        {
            return new ClientListItemViewModel
            {
                Id = client.Id,
                ClientCode = client.ClientCode,
                Name = client.Name,
                ShortName = client.ShortName,
                ClientTypeId = client.ClientTypeId,
                ClientTypeName = client.ClientTypeId.HasValue ? clientTypes.GetValueOrDefault(client.ClientTypeId.Value) : null,
                IndustryId = client.IndustryId,
                IndustryName = client.IndustryId.HasValue ? industries.GetValueOrDefault(client.IndustryId.Value) : null,
                CountryId = client.CountryId,
                CountryName = countries.GetValueOrDefault(client.CountryId) ?? string.Empty,
                Address = client.Address,
                Website = client.Website,
                TaxNumber = client.TaxNumber,
                RegistrationNumber = client.RegistrationNumber,
                AccountOwnerUserId = client.AccountOwnerUserId,
                Notes = client.Notes,
                Status = client.Status,
                StatusName = client.Status.ToString(),
                ContactCount = contactCounts.GetValueOrDefault(client.Id),
                ProductCount = productCounts.GetValueOrDefault(client.Id),
                IsActive = client.IsActive,
                CreatedAt = client.CreatedOn
            };
        }

        private static Task<List<LookupViewModel>> ToLookupsAsync<T>(DbSet<T> dbSet, CancellationToken cancellationToken) where T : ERP.Core.Entities.BaseEntity
        {
            return dbSet
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => EF.Property<string>(x, "Name"))
                .Select(x => new LookupViewModel
                {
                    Id = x.Id,
                    Name = EF.Property<string>(x, "Name"),
                    Code = EF.Property<string>(x, "Code")
                })
                .ToListAsync(cancellationToken);
        }

        private Task<List<LookupViewModel>> GetLookupDetailsAsync(LookUpTypeEnum lookupId, CancellationToken cancellationToken)
        {
            return _dbContext.LookupDetails
                .AsNoTracking()
                .Where(x => x.LookupId == lookupId && x.IsActive)
                .OrderBy(x => x.Order).ThenBy(x => x.Name)
                .Select(x => new LookupViewModel { Id = x.Id, Name = x.Name, Code = x.Code, DialingCode = x.DialingCode })
                .ToListAsync(cancellationToken);
        }

        private static string NormalizeName(string value) => string.Join(' ', (value ?? string.Empty).Trim().ToUpperInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries));
        private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    internal static class ClientQuerySortExtensions
    {
        public static IQueryable<Client> ApplySort(this IQueryable<Client> query, string? sortBy, string? sortDirection, ClientsDbContext dbContext)
        {
            var ascending = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase);
            return sortBy?.Trim().ToLowerInvariant() switch
            {
                "clientcode" => ascending ? query.OrderBy(client => client.ClientCode) : query.OrderByDescending(client => client.ClientCode),
                "name" => ascending ? query.OrderBy(client => client.Name) : query.OrderByDescending(client => client.Name),
                "countryname" => ascending
                    ? query.OrderBy(client => dbContext.LookupDetails.Where(country => country.LookupId == LookUpTypeEnum.Country && country.Id == client.CountryId).Select(country => country.Name).FirstOrDefault())
                    : query.OrderByDescending(client => dbContext.LookupDetails.Where(country => country.LookupId == LookUpTypeEnum.Country && country.Id == client.CountryId).Select(country => country.Name).FirstOrDefault()),
                "industryname" => ascending
                    ? query.OrderBy(client => dbContext.LookupDetails.Where(industry => industry.LookupId == LookUpTypeEnum.Industry && industry.Id == client.IndustryId).Select(industry => industry.Name).FirstOrDefault())
                    : query.OrderByDescending(client => dbContext.LookupDetails.Where(industry => industry.LookupId == LookUpTypeEnum.Industry && industry.Id == client.IndustryId).Select(industry => industry.Name).FirstOrDefault()),
                "status" => ascending ? query.OrderBy(client => client.Status) : query.OrderByDescending(client => client.Status),
                "accountownerusername" => ascending
                    ? query.OrderBy(client => dbContext.Users.Where(user => user.Id == client.AccountOwnerUserId).Select(user => user.FullName).FirstOrDefault())
                    : query.OrderByDescending(client => dbContext.Users.Where(user => user.Id == client.AccountOwnerUserId).Select(user => user.FullName).FirstOrDefault()),
                "createdat" or "createdon" => ascending ? query.OrderBy(client => client.CreatedOn) : query.OrderByDescending(client => client.CreatedOn),
                _ => query.OrderByDescending(client => client.CreatedOn)
            };
        }
    }
}
