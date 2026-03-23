using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Model.Dtos
{
    public class UserRoleDto
    {
        public required string RoleName { get; set; } 
        public required string Description { get; set; }
        public List<UserPermissionDto> UserPermissions { get; set; } = new List<UserPermissionDto>();
    }
}
