namespace ERP.Identity.Model.ViewModels
{
    public class RolePermissionViewModel
    {
        public Guid RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public List<PermissionMatrixItemViewModel> Modules { get; set; } = new();
    }
}
