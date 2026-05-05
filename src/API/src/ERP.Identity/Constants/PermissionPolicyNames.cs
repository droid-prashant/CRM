namespace ERP.Identity.Constants
{
    public static class PermissionPolicyNames
    {
        public const string UsersView = "Permission:users:view";
        public const string UsersCreate = "Permission:users:create";
        public const string UsersEdit = "Permission:users:edit";
        public const string UsersDelete = "Permission:users:delete";
        public const string RolesView = "Permission:roles:view";
        public const string RolesCreate = "Permission:roles:create";
        public const string RolesEdit = "Permission:roles:edit";
        public const string RolesDelete = "Permission:roles:delete";
        public const string PermissionsView = "Permission:permissions:view";
        public const string PermissionsEdit = "Permission:permissions:edit";
        public const string LeadsView = "Permission:leads:view";
        public const string LeadsCreate = "Permission:leads:create";
        public const string LeadsEdit = "Permission:leads:edit";
        public const string LeadsDelete = "Permission:leads:delete";
        public const string LeadsApprove = "Permission:leads:approve";
        public const string LeadsExport = "Permission:leads:export";

        public static string For(string moduleCode, string actionCode) => $"Permission:{moduleCode}:{actionCode}";
    }
}
