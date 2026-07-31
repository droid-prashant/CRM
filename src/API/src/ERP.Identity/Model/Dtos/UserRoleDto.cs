namespace ERP.Identity.Model.Dtos
{
    public class UserRoleDto
    {
        public required string RoleName { get; set; }
        public required string Description { get; set; }
        public List<UserPermissionDto> UserPermissions { get; set; } = new List<UserPermissionDto>();
    }
}
