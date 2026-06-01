using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;
using Clients.Domain.Enums;

namespace Clients.Application.Services
{
    public class ClientService : IClientService
    {
        private static readonly IReadOnlyDictionary<string, string> SortColumns = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["clientCode"] = "clientCode",
            ["name"] = "name",
            ["countryName"] = "countryName",
            ["industryName"] = "industryName",
            ["status"] = "status",
            ["accountOwnerUserName"] = "accountOwnerUserName",
            ["createdAt"] = "createdAt"
        };

        private readonly IClientRepository _clientRepository;
        private readonly IClientUserLookupService _userLookupService;

        public ClientService(IClientRepository clientRepository, IClientUserLookupService userLookupService)
        {
            _clientRepository = clientRepository;
            _userLookupService = userLookupService;
        }

        public async Task<ClientListResult> GetClientsAsync(ClientQueryRequest request, CancellationToken cancellationToken)
        {
            var errors = await ValidateListRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new ClientListResult { Errors = errors };
            }

            Clean(request);
            var response = await _clientRepository.GetClientsAsync(request, cancellationToken);
            await PopulateOwnerNamesAsync(response.Items, cancellationToken);
            if (IsAccountOwnerSort(request.SortBy))
            {
                SortPageByAccountOwner(response.Items, request.SortDirection);
            }

            return new ClientListResult { Response = response };
        }

        public async Task<ClientCreatedViewModel?> GetClientAsync(Guid id, CancellationToken cancellationToken)
        {
            var client = await _clientRepository.GetClientAsync(id, cancellationToken);
            if (client != null)
            {
                await PopulateOwnerNamesAsync([client], cancellationToken);
            }

            return client;
        }

        public async Task<ClientDetailViewModel?> GetClientDetailAsync(Guid id, CancellationToken cancellationToken)
        {
            var client = await _clientRepository.GetClientDetailAsync(id, cancellationToken);
            if (client != null)
            {
                await PopulateOwnerNamesAsync([client], cancellationToken);
            }

            return client;
        }

        public Task<ClientEditViewModel?> GetClientEditAsync(Guid id, CancellationToken cancellationToken)
        {
            return _clientRepository.GetClientEditAsync(id, cancellationToken);
        }

        public async Task<ClientLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken)
        {
            var lookups = await _clientRepository.GetLookupsAsync(cancellationToken);
            lookups.AccountOwners = await _userLookupService.GetActiveUserLookupsAsync(cancellationToken);
            return lookups;
        }

        public async Task<ClientFilterLookupViewModel> GetFilterLookupsAsync(CancellationToken cancellationToken)
        {
            var lookups = await _clientRepository.GetFilterLookupsAsync(cancellationToken);
            lookups.AccountOwners = await _userLookupService.GetActiveUserLookupsAsync(cancellationToken);
            return lookups;
        }

        public Task<List<ClientLookupViewModel>> GetActiveClientsAsync(CancellationToken cancellationToken) => _clientRepository.GetActiveClientLookupsAsync(cancellationToken);
        public Task<bool> ActivateClientAsync(Guid id, CancellationToken cancellationToken) => _clientRepository.ActivateClientAsync(id, cancellationToken);
        public Task<bool> DeactivateClientAsync(Guid id, CancellationToken cancellationToken) => _clientRepository.DeactivateClientAsync(id, cancellationToken);
        public Task<bool> DeleteClientAsync(Guid id, CancellationToken cancellationToken) => _clientRepository.SoftDeleteClientAsync(id, cancellationToken);

        public async Task<ClientResult> CreateClientAsync(CreateClientRequest request, CancellationToken cancellationToken)
        {
            Clean(request);
            var errors = await ValidateClientAsync(
                request.Name,
                request.CountryId,
                request.IndustryId,
                request.ClientTypeId,
                request.Website,
                request.AccountOwnerUserId,
                null,
                cancellationToken);

            if (errors.Count > 0)
            {
                return new ClientResult { Errors = errors };
            }

            var code = await GenerateUniqueClientCodeAsync(cancellationToken);
            var client = await _clientRepository.CreateClientAsync(request, code, cancellationToken);
            await PopulateOwnerNamesAsync([client], cancellationToken);
            return new ClientResult { Client = client };
        }

        public async Task<ClientUpdateResult> UpdateClientAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new ClientUpdateResult { Errors = new List<string> { "Client id is required." } };
            }

            Clean(request);
            var errors = await ValidateClientAsync(
                request.Name,
                request.CountryId,
                request.IndustryId,
                request.ClientTypeId,
                request.Website,
                request.AccountOwnerUserId,
                id,
                cancellationToken);

            if (!Enum.IsDefined(request.Status) || request.Status == 0)
            {
                errors.Add("Client status is invalid.");
            }

            if (errors.Count > 0)
            {
                return new ClientUpdateResult { Errors = errors };
            }

            var client = await _clientRepository.UpdateClientAsync(id, request, cancellationToken);
            if (client == null)
            {
                return new ClientUpdateResult { NotFound = true };
            }

            await PopulateOwnerNamesAsync([client], cancellationToken);
            return new ClientUpdateResult
            {
                Client = new ClientUpdatedViewModel
                {
                    Id = client.Id,
                    ClientCode = client.ClientCode,
                    Name = client.Name,
                    CountryName = client.CountryName,
                    IndustryName = client.IndustryName,
                    Status = client.Status,
                    StatusName = client.StatusName,
                    AccountOwnerUserName = client.AccountOwnerUserName,
                    UpdatedAt = client.UpdatedAt
                }
            };
        }

        private async Task<List<string>> ValidateClientAsync(
            string name,
            Guid countryId,
            Guid? industryId,
            Guid? clientTypeId,
            string? website,
            Guid? accountOwnerUserId,
            Guid? excludingId,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add("Client name is required.");
            }

            if (countryId == Guid.Empty)
            {
                errors.Add("Country is required.");
            }

            if (!string.IsNullOrWhiteSpace(website) && !IsValidWebsite(website))
            {
                errors.Add("Website must be a valid URL.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _clientRepository.CountryExistsAsync(countryId, cancellationToken))
            {
                errors.Add("Country is invalid.");
            }

            if (industryId.HasValue && industryId.Value != Guid.Empty && !await _clientRepository.IndustryExistsAsync(industryId.Value, cancellationToken))
            {
                errors.Add("Industry is invalid.");
            }

            if (clientTypeId.HasValue && clientTypeId.Value != Guid.Empty && !await _clientRepository.ClientTypeExistsAsync(clientTypeId.Value, cancellationToken))
            {
                errors.Add("Client type is invalid.");
            }

            if (accountOwnerUserId.HasValue && accountOwnerUserId.Value != Guid.Empty && !await _userLookupService.ActiveUserExistsAsync(accountOwnerUserId.Value, cancellationToken))
            {
                errors.Add("Account owner must be an active user.");
            }

            if (await _clientRepository.DuplicateClientExistsAsync(NormalizeName(name), countryId, excludingId, cancellationToken))
            {
                errors.Add("A client with the same name already exists in this country.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateListRequestAsync(ClientQueryRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (request.PageNumber < 1)
            {
                errors.Add("PageNumber must be greater than or equal to 1.");
            }

            if (request.PageSize < 1 || request.PageSize > 200)
            {
                errors.Add("PageSize must be between 1 and 200.");
            }

            if (!string.IsNullOrWhiteSpace(request.SortBy) && !SortColumns.ContainsKey(request.SortBy.Trim()))
            {
                errors.Add("SortBy is invalid.");
            }

            var sortDirection = request.SortDirection?.Trim();
            if (!string.IsNullOrWhiteSpace(sortDirection)
                && !string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("SortDirection must be 'asc' or 'desc'.");
            }

            if (request.CountryId.HasValue && request.CountryId.Value != Guid.Empty && !await _clientRepository.CountryExistsAsync(request.CountryId.Value, cancellationToken))
            {
                errors.Add("Country filter is invalid.");
            }

            if (request.IndustryId.HasValue && request.IndustryId.Value != Guid.Empty && !await _clientRepository.IndustryExistsAsync(request.IndustryId.Value, cancellationToken))
            {
                errors.Add("Industry filter is invalid.");
            }

            if (request.AccountOwnerUserId.HasValue && request.AccountOwnerUserId.Value != Guid.Empty && !await _userLookupService.ActiveUserExistsAsync(request.AccountOwnerUserId.Value, cancellationToken))
            {
                errors.Add("Account owner filter is invalid.");
            }

            if (request.Status.HasValue && (!Enum.IsDefined(request.Status.Value) || request.Status.Value == 0))
            {
                errors.Add("Status filter is invalid.");
            }

            return errors;
        }

        private async Task<string> GenerateUniqueClientCodeAsync(CancellationToken cancellationToken)
        {
            for (var attempt = 0; attempt < 10; attempt++)
            {
                var code = await _clientRepository.GenerateNextClientCodeAsync(cancellationToken);
                if (!await _clientRepository.CodeExistsAsync(code, cancellationToken))
                {
                    return code;
                }
            }

            throw new InvalidOperationException("Unable to generate a unique client code.");
        }

        private async Task PopulateOwnerNamesAsync(IReadOnlyCollection<ClientListItemViewModel> clients, CancellationToken cancellationToken)
        {
            var userIds = clients
                .Select(client => client.AccountOwnerUserId)
                .Where(id => id.HasValue && id.Value != Guid.Empty)
                .Select(id => id!.Value)
                .Distinct()
                .ToList();

            var names = await _userLookupService.GetUserNamesAsync(userIds, cancellationToken);

            foreach (var client in clients)
            {
                client.StatusName = client.Status.ToString();
                client.AccountOwnerUserName = client.AccountOwnerUserId.HasValue
                    ? names.GetValueOrDefault(client.AccountOwnerUserId.Value)
                    : null;
            }
        }

        private static void Clean(CreateClientRequest request)
        {
            request.Name = CleanRequired(request.Name);
            request.ShortName = CleanOptional(request.ShortName);
            request.Address = CleanOptional(request.Address);
            request.Website = CleanOptional(request.Website);
            request.TaxNumber = CleanOptional(request.TaxNumber);
            request.RegistrationNumber = CleanOptional(request.RegistrationNumber);
            request.Notes = CleanOptional(request.Notes);
            if (request.ClientTypeId == Guid.Empty) request.ClientTypeId = null;
            if (request.IndustryId == Guid.Empty) request.IndustryId = null;
            if (request.AccountOwnerUserId == Guid.Empty) request.AccountOwnerUserId = null;
        }

        private static void Clean(ClientQueryRequest request)
        {
            request.SearchTerm = CleanOptional(request.SearchTerm);
            request.SortBy = CleanOptional(request.SortBy);
            request.SortDirection = CleanOptional(request.SortDirection)?.ToLowerInvariant();
            if (request.CountryId == Guid.Empty) request.CountryId = null;
            if (request.IndustryId == Guid.Empty) request.IndustryId = null;
            if (request.AccountOwnerUserId == Guid.Empty) request.AccountOwnerUserId = null;
        }

        private static bool IsAccountOwnerSort(string? sortBy) => string.Equals(sortBy?.Trim(), "accountOwnerUserName", StringComparison.OrdinalIgnoreCase);

        private static void SortPageByAccountOwner(List<ClientListItemViewModel> clients, string? sortDirection)
        {
            var ordered = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                ? clients.OrderBy(client => client.AccountOwnerUserName ?? string.Empty, StringComparer.OrdinalIgnoreCase)
                : clients.OrderByDescending(client => client.AccountOwnerUserName ?? string.Empty, StringComparer.OrdinalIgnoreCase);

            var sorted = ordered.ToList();
            clients.Clear();
            clients.AddRange(sorted);
        }

        private static void Clean(UpdateClientRequest request)
        {
            request.Name = CleanRequired(request.Name);
            request.ShortName = CleanOptional(request.ShortName);
            request.Address = CleanOptional(request.Address);
            request.Website = CleanOptional(request.Website);
            request.TaxNumber = CleanOptional(request.TaxNumber);
            request.RegistrationNumber = CleanOptional(request.RegistrationNumber);
            request.Notes = CleanOptional(request.Notes);
            if (request.ClientTypeId == Guid.Empty) request.ClientTypeId = null;
            if (request.IndustryId == Guid.Empty) request.IndustryId = null;
            if (request.AccountOwnerUserId == Guid.Empty) request.AccountOwnerUserId = null;
        }

        public static string NormalizeName(string value) => string.Join(' ', (value ?? string.Empty).Trim().ToUpperInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries));
        private static string CleanRequired(string value) => (value ?? string.Empty).Trim();
        private static string? CleanOptional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

        private static bool IsValidWebsite(string value)
        {
            return Uri.TryCreate(value, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }
    }
}
