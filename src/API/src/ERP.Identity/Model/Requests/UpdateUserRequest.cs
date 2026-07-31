using System.ComponentModel.DataAnnotations;

namespace ERP.Identity.Model.Requests
{
    public class UpdateUserRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public Guid? DepartmentId { get; set; }

        public Guid? ManagerId { get; set; }

        [Required, MinLength(1)]
        public List<Guid> RoleIds { get; set; } = new();

        public bool IsActive { get; set; }
    }
}
