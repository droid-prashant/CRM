namespace ERP.Identity.Model.ViewModels
{
    public class UserPermissionViewModel
    {
        public Guid UserId { get; set; }
        public List<string> Roles { get; set; } = new();
        public List<PermissionMatrixItemViewModel> Permissions { get; set; } = new();
    }
}
