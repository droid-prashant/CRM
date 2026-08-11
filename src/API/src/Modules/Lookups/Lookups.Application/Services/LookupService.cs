using System.ComponentModel;
using ERP.Core.Constants;
using Lookups.Application.DTOs;
using Lookups.Application.Repositories;
using Lookups.Application.ViewModels;

namespace Lookups.Application.Services
{
    public class LookupService : ILookupService
    {
        private readonly ILookupRepository _lookupRepository;

        public LookupService(ILookupRepository lookupRepository)
        {
            _lookupRepository = lookupRepository;
        }

        public Task<List<LookupTypeOptionViewModel>> GetLookupTypesAsync(CancellationToken cancellationToken)
        {
            var types = Enum.GetValues<LookUpTypeEnum>()
                .Select(type => new LookupTypeOptionViewModel
                {
                    Value = (int)type,
                    Code = type.ToString(),
                    Name = GetDescription(type)
                })
                .ToList();

            return Task.FromResult(types);
        }

        public Task<List<LookupListItemViewModel>> GetLookupsAsync(LookupQueryRequest request, CancellationToken cancellationToken)
        {
            return _lookupRepository.GetLookupsAsync(request, cancellationToken);
        }

        public Task<LookupListItemViewModel?> GetLookupAsync(Guid id, CancellationToken cancellationToken)
        {
            return _lookupRepository.GetLookupAsync(id, cancellationToken);
        }

        public Task<bool> ActivateLookupAsync(Guid id, CancellationToken cancellationToken) => _lookupRepository.ActivateLookupAsync(id, cancellationToken);
        public Task<bool> DeactivateLookupAsync(Guid id, CancellationToken cancellationToken) => _lookupRepository.DeactivateLookupAsync(id, cancellationToken);

        public async Task<LookupResult> CreateLookupAsync(CreateLookupRequest request, CancellationToken cancellationToken)
        {
            Clean(request);
            var errors = await ValidateAsync(request.LookupId, request.Name, null, cancellationToken);
            if (errors.Count > 0)
            {
                return new LookupResult { Errors = errors };
            }

            if (!request.Order.HasValue)
            {
                request.Order = await _lookupRepository.GetNextOrderAsync(request.LookupId, cancellationToken);
            }

            var lookup = await _lookupRepository.CreateLookupAsync(request, cancellationToken);
            return new LookupResult { Lookup = lookup };
        }

        public async Task<LookupResult> UpdateLookupAsync(Guid id, UpdateLookupRequest request, CancellationToken cancellationToken)
        {
            var existing = await _lookupRepository.GetLookupAsync(id, cancellationToken);
            if (existing == null)
            {
                return new LookupResult { NotFound = true };
            }

            Clean(request);
            var errors = await ValidateAsync((LookUpTypeEnum)existing.LookupId, request.Name, id, cancellationToken);
            if (errors.Count > 0)
            {
                return new LookupResult { Errors = errors };
            }

            var lookup = await _lookupRepository.UpdateLookupAsync(id, request, cancellationToken);
            if (lookup == null)
            {
                return new LookupResult { NotFound = true };
            }

            return new LookupResult { Lookup = lookup };
        }

        private async Task<List<string>> ValidateAsync(LookUpTypeEnum lookupId, string name, Guid? excludingId, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (!Enum.IsDefined(lookupId))
            {
                errors.Add("Lookup type is invalid.");
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add("Name is required.");
            }
            else if (name.Length > 150)
            {
                errors.Add("Name must be 150 characters or fewer.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (await _lookupRepository.NameExistsAsync(lookupId, name, excludingId, cancellationToken))
            {
                errors.Add("A lookup with the same name already exists for this lookup type.");
            }

            return errors;
        }

        private static void Clean(CreateLookupRequest request)
        {
            request.Name = CleanRequired(request.Name);
            request.Description = CleanOptional(request.Description);
        }

        private static void Clean(UpdateLookupRequest request)
        {
            request.Name = CleanRequired(request.Name);
            request.Description = CleanOptional(request.Description);
        }

        private static string CleanRequired(string value) => (value ?? string.Empty).Trim();
        private static string? CleanOptional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

        private static string GetDescription(LookUpTypeEnum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = (DescriptionAttribute?)Attribute.GetCustomAttribute(field!, typeof(DescriptionAttribute));
            return attribute?.Description ?? value.ToString();
        }
    }
}
