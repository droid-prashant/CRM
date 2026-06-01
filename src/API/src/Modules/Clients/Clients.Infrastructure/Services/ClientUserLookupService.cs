using Clients.Application.Services;
using Clients.Application.ViewModels;
using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Clients.Infrastructure.Services
{
    public class ClientUserLookupService : IClientUserLookupService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ClientUserLookupService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public Task<bool> ActiveUserExistsAsync(Guid userId, CancellationToken cancellationToken)
        {
            return _userManager.Users.AnyAsync(user => user.Id == userId && user.IsActive, cancellationToken);
        }

        public Task<List<ClientUserLookupViewModel>> GetActiveUserLookupsAsync(CancellationToken cancellationToken)
        {
            return _userManager.Users
                .AsNoTracking()
                .Where(user => user.IsActive)
                .OrderBy(user => user.FullName)
                .Select(user => new ClientUserLookupViewModel
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyDictionary<Guid, string>> GetUserNamesAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken)
        {
            var ids = userIds.Distinct().ToList();
            if (ids.Count == 0)
            {
                return new Dictionary<Guid, string>();
            }

            return await _userManager.Users
                .AsNoTracking()
                .Where(user => ids.Contains(user.Id))
                .ToDictionaryAsync(user => user.Id, user => user.FullName, cancellationToken);
        }
    }
}
