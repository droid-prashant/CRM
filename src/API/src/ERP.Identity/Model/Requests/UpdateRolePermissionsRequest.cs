using System.ComponentModel.DataAnnotations;

namespace ERP.Identity.Model.Requests
{
    public class UpdateRolePermissionsRequest
    {
        [Required]
        public Guid RoleId { get; set; }

        [MinLength(1)]
        public List<RolePermissionRequestItem> Permissions { get; set; } = new();
    }
}
