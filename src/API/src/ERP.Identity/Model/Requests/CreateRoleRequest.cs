using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Model.Requests
{
    public class CreateRoleRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Code { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsSystemRole { get; set; } = false;

        public bool IsActive { get; set; } = true;
    }
}
