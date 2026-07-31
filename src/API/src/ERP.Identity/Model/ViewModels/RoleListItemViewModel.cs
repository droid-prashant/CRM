namespace ERP.Identity.Model.ViewModels
{
    public class RoleListItemViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsSystemRole { get; set; }
        public bool IsActive { get; set; }
        public int UserCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
