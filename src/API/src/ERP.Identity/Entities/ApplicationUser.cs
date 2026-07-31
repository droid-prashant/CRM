using Microsoft.AspNetCore.Identity;

namespace ERP.Identity.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public required string FullName { get; set; }
        public required string Address { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? ManagerId { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;
        public bool ForcePasswordChange { get; set; } = false;
        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
