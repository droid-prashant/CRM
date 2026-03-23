using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Entities
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public required string Description { get; set; } 
        public bool IsSystemRole { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }
}
