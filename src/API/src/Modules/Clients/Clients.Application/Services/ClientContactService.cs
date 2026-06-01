using System.Net.Mail;
using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;
using Clients.Domain.Enums;

namespace Clients.Application.Services
{
    public class ClientContactService : IClientContactService
    {
        private readonly IClientContactRepository _contactRepository;

        public ClientContactService(IClientContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        public Task<List<ClientContactViewModel>?> GetContactsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _contactRepository.GetContactsAsync(clientId, cancellationToken);
        }

        public async Task<ClientContactResult> CreateContactAsync(CreateClientContactRequest request, CancellationToken cancellationToken)
        {
            Clean(request);
            var errors = await ValidateContactAsync(request.ClientId, request.FullName, request.Email, request.Phone, request.Mobile, null, cancellationToken);
            if (errors.Count > 0)
            {
                return new ClientContactResult { Errors = errors };
            }

            return new ClientContactResult
            {
                Contact = await _contactRepository.CreateContactAsync(request, cancellationToken)
            };
        }

        public async Task<ClientContactResult> UpdateContactAsync(Guid id, UpdateClientContactRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new ClientContactResult { Errors = new List<string> { "Contact id is required." } };
            }

            request.ContactId = id;
            Clean(request);

            var existingContact = await _contactRepository.GetContactAsync(id, cancellationToken);
            if (existingContact == null)
            {
                return new ClientContactResult { NotFound = true };
            }

            var errors = await ValidateContactAsync(null, request.FullName, request.Email, request.Phone, request.Mobile, id, cancellationToken);

            if (!Enum.IsDefined(request.Status) || request.Status == 0)
            {
                errors.Add("Contact status is invalid.");
            }
            else if (request.Status != ClientContactStatus.Active && existingContact.IsPrimary)
            {
                errors.Add("Set another active contact as primary before deactivating this contact.");
            }

            if (errors.Count > 0)
            {
                return new ClientContactResult { Errors = errors };
            }

            var contact = await _contactRepository.UpdateContactAsync(id, request, cancellationToken);
            return contact == null
                ? new ClientContactResult { NotFound = true }
                : new ClientContactResult { Contact = contact };
        }

        public async Task<ClientContactResult> SetContactStatusAsync(Guid id, UpdateClientContactStatusRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new ClientContactResult { Errors = new List<string> { "Contact id is required." } };
            }

            var existingContact = await _contactRepository.GetContactAsync(id, cancellationToken);
            if (existingContact == null)
            {
                return new ClientContactResult { NotFound = true };
            }

            if (!request.IsActive && existingContact.IsPrimary)
            {
                return new ClientContactResult { Errors = new List<string> { "Set another active contact as primary before deactivating this contact." } };
            }

            var contact = await _contactRepository.SetContactStatusAsync(id, request.IsActive, cancellationToken);
            return contact == null
                ? new ClientContactResult { NotFound = true }
                : new ClientContactResult { Contact = contact };
        }

        public async Task<PrimaryContactResult> SetPrimaryContactAsync(Guid id, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new PrimaryContactResult { Errors = new List<string> { "Contact id is required." } };
            }

            var contact = await _contactRepository.GetContactAsync(id, cancellationToken);
            if (contact == null)
            {
                return new PrimaryContactResult { NotFound = true };
            }

            if (!contact.IsActive || contact.Status != ClientContactStatus.Active)
            {
                return new PrimaryContactResult { Errors = new List<string> { "Only active contacts can be set as primary." } };
            }

            var primaryContact = await _contactRepository.SetPrimaryContactAsync(id, cancellationToken);
            return primaryContact == null
                ? new PrimaryContactResult { NotFound = true }
                : new PrimaryContactResult { PrimaryContact = primaryContact };
        }

        private async Task<List<string>> ValidateContactAsync(
            Guid? clientId,
            string fullName,
            string? email,
            string? phone,
            string? mobile,
            Guid? excludingContactId,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (clientId.HasValue && clientId.Value == Guid.Empty)
            {
                errors.Add("ClientId is required.");
            }

            if (string.IsNullOrWhiteSpace(fullName))
            {
                errors.Add("Full name is required.");
            }

            if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phone) && string.IsNullOrWhiteSpace(mobile))
            {
                errors.Add("Email or phone is required.");
            }

            if (!string.IsNullOrWhiteSpace(email) && !IsValidEmail(email))
            {
                errors.Add("Email must be a valid email address.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (clientId.HasValue && !await _contactRepository.ClientExistsAsync(clientId.Value, cancellationToken))
            {
                errors.Add("ClientId is invalid.");
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                var normalizedEmail = NormalizeEmail(email);
                var lookupClientId = clientId;
                if (!lookupClientId.HasValue && excludingContactId.HasValue)
                {
                    lookupClientId = await _contactRepository.GetContactClientIdAsync(excludingContactId.Value, cancellationToken);
                    if (!lookupClientId.HasValue)
                    {
                        return errors;
                    }
                }

                if (lookupClientId.HasValue && await _contactRepository.DuplicateEmailExistsAsync(lookupClientId.Value, normalizedEmail, excludingContactId, cancellationToken))
                {
                    errors.Add("A contact with the same email already exists for this client.");
                }
            }

            return errors;
        }

        private static void Clean(CreateClientContactRequest request)
        {
            request.FirstName = CleanRequired(request.FirstName);
            request.LastName = CleanRequired(request.LastName);
            request.FullName = CleanRequired(request.FullName);
            request.Designation = CleanOptional(request.Designation);
            request.Department = CleanOptional(request.Department);
            request.Email = CleanOptional(request.Email);
            request.Phone = CleanOptional(request.Phone);
            request.Mobile = CleanOptional(request.Mobile);
            request.Notes = CleanOptional(request.Notes);
        }

        private static void Clean(UpdateClientContactRequest request)
        {
            request.FirstName = CleanRequired(request.FirstName);
            request.LastName = CleanRequired(request.LastName);
            request.FullName = CleanRequired(request.FullName);
            request.Designation = CleanOptional(request.Designation);
            request.Department = CleanOptional(request.Department);
            request.Email = CleanOptional(request.Email);
            request.Phone = CleanOptional(request.Phone);
            request.Mobile = CleanOptional(request.Mobile);
            request.Notes = CleanOptional(request.Notes);
        }

        private static bool IsValidEmail(string value)
        {
            try
            {
                var address = new MailAddress(value);
                return string.Equals(address.Address, value, StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        private static string NormalizeEmail(string value) => value.Trim().ToUpperInvariant();
        private static string CleanRequired(string value) => (value ?? string.Empty).Trim();
        private static string? CleanOptional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
