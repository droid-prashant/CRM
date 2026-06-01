using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;
using Clients.Domain.Entities;
using Clients.Domain.Enums;
using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Clients.Infrastructure.Repositories
{
    public class ClientContactRepository : IClientContactRepository
    {
        private readonly ClientsDbContext _dbContext;

        public ClientContactRepository(ClientsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ClientContactViewModel>?> GetContactsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            if (!await ClientExistsAsync(clientId, cancellationToken))
            {
                return null;
            }

            var contacts = await _dbContext.ClientContacts
                .AsNoTracking()
                .Where(contact => contact.ClientId == clientId && !contact.IsDeleted)
                .OrderByDescending(contact => contact.IsPrimary)
                .ThenBy(contact => contact.FullName)
                .ToListAsync(cancellationToken);

            return contacts.Select(Map).ToList();
        }

        public async Task<ClientContactViewModel?> GetContactAsync(Guid id, CancellationToken cancellationToken)
        {
            var contact = await _dbContext.ClientContacts
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            return contact == null ? null : Map(contact);
        }

        public async Task<ClientContactViewModel> CreateContactAsync(CreateClientContactRequest request, CancellationToken cancellationToken)
        {
            if (request.IsPrimary)
            {
                await ClearPrimaryContactsAsync(request.ClientId, null, cancellationToken);
            }

            var contact = new ClientContact
            {
                ClientId = request.ClientId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                FullName = request.FullName,
                Designation = request.Designation,
                Department = request.Department,
                Email = request.Email,
                NormalizedEmail = NormalizeEmail(request.Email),
                Phone = request.Phone,
                Mobile = request.Mobile,
                IsPrimary = request.IsPrimary,
                Status = ClientContactStatus.Active,
                IsActive = true,
                Notes = request.Notes
            };

            _dbContext.ClientContacts.Add(contact);
            await AddTimelineEntryAsync(request.ClientId, "ClientContactCreated", $"Contact {request.FullName} was added.", cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Map(contact);
        }

        public async Task<ClientContactViewModel?> UpdateContactAsync(Guid id, UpdateClientContactRequest request, CancellationToken cancellationToken)
        {
            var contact = await _dbContext.ClientContacts
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            if (contact == null)
            {
                return null;
            }

            contact.FirstName = request.FirstName;
            contact.LastName = request.LastName;
            contact.FullName = request.FullName;
            contact.Designation = request.Designation;
            contact.Department = request.Department;
            contact.Email = request.Email;
            contact.NormalizedEmail = NormalizeEmail(request.Email);
            contact.Phone = request.Phone;
            contact.Mobile = request.Mobile;
            contact.Status = request.Status;
            contact.IsActive = request.Status == ClientContactStatus.Active;
            contact.Notes = request.Notes;

            await AddTimelineEntryAsync(contact.ClientId, "ClientContactUpdated", $"Contact {contact.FullName} was updated.", cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Map(contact);
        }

        public async Task<ClientContactViewModel?> SetContactStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken)
        {
            var contact = await _dbContext.ClientContacts
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            if (contact == null)
            {
                return null;
            }

            contact.IsActive = isActive;
            contact.Status = isActive ? ClientContactStatus.Active : ClientContactStatus.Inactive;

            var eventType = isActive ? "ClientContactActivated" : "ClientContactDeactivated";
            var description = isActive ? $"Contact {contact.FullName} was activated." : $"Contact {contact.FullName} was deactivated.";
            await AddTimelineEntryAsync(contact.ClientId, eventType, description, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Map(contact);
        }

        public async Task<PrimaryContactViewModel?> SetPrimaryContactAsync(Guid id, CancellationToken cancellationToken)
        {
            var contact = await _dbContext.ClientContacts
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            if (contact == null || !contact.IsActive || contact.Status != ClientContactStatus.Active)
            {
                return null;
            }

            await ClearPrimaryContactsAsync(contact.ClientId, contact.Id, cancellationToken);
            contact.IsPrimary = true;
            await AddTimelineEntryAsync(contact.ClientId, "ClientPrimaryContactChanged", $"Contact {contact.FullName} was set as the primary contact.", cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new PrimaryContactViewModel
            {
                ContactId = contact.Id,
                FullName = contact.FullName,
                Email = contact.Email,
                Phone = contact.Phone ?? contact.Mobile,
                IsPrimary = contact.IsPrimary
            };
        }

        public Task<Guid?> GetContactClientIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.ClientContacts
                .AsNoTracking()
                .Where(contact => contact.Id == id && !contact.IsDeleted)
                .Select(contact => (Guid?)contact.ClientId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(client => client.Id == clientId && !client.IsDeleted, cancellationToken);
        }

        public Task<bool> DuplicateEmailExistsAsync(Guid clientId, string normalizedEmail, Guid? excludingContactId, CancellationToken cancellationToken)
        {
            return _dbContext.ClientContacts.AnyAsync(
                contact => contact.ClientId == clientId
                    && !contact.IsDeleted
                    && contact.NormalizedEmail == normalizedEmail
                    && (!excludingContactId.HasValue || contact.Id != excludingContactId.Value),
                cancellationToken);
        }

        private async Task AddTimelineEntryAsync(Guid clientId, string eventType, string description, CancellationToken cancellationToken)
        {
            var client = await _dbContext.Clients
                .Include(item => item.TimelineEntries)
                .FirstAsync(item => item.Id == clientId && !item.IsDeleted, cancellationToken);

            client.TimelineEntries.Add(new ClientTimelineEntry
            {
                EventType = eventType,
                Description = description
            });
        }

        private async Task ClearPrimaryContactsAsync(Guid clientId, Guid? excludingContactId, CancellationToken cancellationToken)
        {
            var primaryContacts = await _dbContext.ClientContacts
                .Where(contact => contact.ClientId == clientId
                    && !contact.IsDeleted
                    && contact.IsPrimary
                    && (!excludingContactId.HasValue || contact.Id != excludingContactId.Value))
                .ToListAsync(cancellationToken);

            foreach (var contact in primaryContacts)
            {
                contact.IsPrimary = false;
            }
        }

        private static ClientContactViewModel Map(ClientContact contact)
        {
            return new ClientContactViewModel
            {
                Id = contact.Id,
                ClientId = contact.ClientId,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                FullName = contact.FullName,
                Designation = contact.Designation,
                Department = contact.Department,
                Email = contact.Email,
                Phone = contact.Phone,
                Mobile = contact.Mobile,
                IsPrimary = contact.IsPrimary,
                Status = contact.Status,
                StatusName = contact.Status.ToString(),
                Notes = contact.Notes,
                IsActive = contact.IsActive,
                CreatedAt = contact.CreatedOn,
                UpdatedAt = contact.UpdatedOn
            };
        }

        private static string? NormalizeEmail(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim().ToUpperInvariant();
    }
}
