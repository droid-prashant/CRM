using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Repositories
{
    public interface IClientContactRepository
    {
        Task<List<ClientContactViewModel>?> GetContactsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<ClientContactViewModel?> GetContactAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientContactViewModel> CreateContactAsync(CreateClientContactRequest request, CancellationToken cancellationToken);
        Task<ClientContactViewModel?> UpdateContactAsync(Guid id, UpdateClientContactRequest request, CancellationToken cancellationToken);
        Task<ClientContactViewModel?> SetContactStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken);
        Task<PrimaryContactViewModel?> SetPrimaryContactAsync(Guid id, CancellationToken cancellationToken);
        Task<Guid?> GetContactClientIdAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> DuplicateEmailExistsAsync(Guid clientId, string normalizedEmail, Guid? excludingContactId, CancellationToken cancellationToken);
    }
}
