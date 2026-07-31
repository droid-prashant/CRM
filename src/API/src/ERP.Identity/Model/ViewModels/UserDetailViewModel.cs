namespace ERP.Identity.Model.ViewModels
{
    public class UserDetailViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? ManagerId { get; set; }
        public List<string> Roles { get; set; } = new();
        public List<Guid> RoleIds { get; set; } = new();
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
