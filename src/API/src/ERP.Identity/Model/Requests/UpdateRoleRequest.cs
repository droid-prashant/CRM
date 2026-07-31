using System.ComponentModel.DataAnnotations;

namespace ERP.Identity.Model.Requests
{
    public class UpdateRoleRequest
    {
        [Required]
        [StringLength(256)]
        public string Name { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Code { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
