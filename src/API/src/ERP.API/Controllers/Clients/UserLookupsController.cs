using Clients.Application.ViewModels;
using ERP.Identity.Constants;
using ERP.Identity.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ERP.API.Controllers.Clients
{
    [Route("api/users/lookups")]
    public class UserLookupsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserLookupsController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.ClientsView)]
        public Task<List<ClientUserLookupViewModel>> GetUserLookups(CancellationToken cancellationToken)
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
    }
}
