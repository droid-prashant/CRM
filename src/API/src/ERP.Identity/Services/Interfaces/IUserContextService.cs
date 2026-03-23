using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Services.Interfaces
{
    public interface IUserContextService
    {
        public Guid? GetUserId();
        public string? GetUserName();
        public string? GetUserEmail();
        public IList<string> GetUserRoles();
        public IList<string> GetUserPermissions();
    }
}
