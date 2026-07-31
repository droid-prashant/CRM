using Microsoft.AspNetCore.Identity;

namespace ERP.Identity.Entities
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public required string Description { get; set; }
        public string? Code { get; set; }
        public bool IsSystemRole { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
