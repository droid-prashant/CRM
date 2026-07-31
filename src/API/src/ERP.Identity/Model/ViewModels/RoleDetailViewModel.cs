namespace ERP.Identity.Model.ViewModels
{
    public class RoleDetailViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsSystemRole { get; set; }
        public bool IsActive { get; set; }
        public int UserCount { get; set; }
        public List<RoleUserListItemViewModel> LinkedUsers { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
