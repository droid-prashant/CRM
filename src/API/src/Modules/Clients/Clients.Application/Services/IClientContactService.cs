using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Services
{
    public interface IClientContactService
    {
        Task<List<ClientContactViewModel>?> GetContactsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<ClientContactResult> CreateContactAsync(CreateClientContactRequest request, CancellationToken cancellationToken);
        Task<ClientContactResult> UpdateContactAsync(Guid id, UpdateClientContactRequest request, CancellationToken cancellationToken);
        Task<ClientContactResult> SetContactStatusAsync(Guid id, UpdateClientContactStatusRequest request, CancellationToken cancellationToken);
        Task<PrimaryContactResult> SetPrimaryContactAsync(Guid id, CancellationToken cancellationToken);
    }
}
