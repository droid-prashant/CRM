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
        public const string ClientsView = "Permission:clients:view";
        public const string ClientsCreate = "Permission:clients:create";
        public const string ClientsEdit = "Permission:clients:edit";
        public const string ClientsDelete = "Permission:clients:delete";
        public const string ClientsApprove = "Permission:clients:approve";
        public const string ClientsExport = "Permission:clients:export";
        public const string LeadsView = "Permission:leads:view";
        public const string LeadsCreate = "Permission:leads:create";
        public const string LeadsEdit = "Permission:leads:edit";
        public const string LeadsDelete = "Permission:leads:delete";
        public const string LeadsApprove = "Permission:leads:approve";
        public const string LeadsExport = "Permission:leads:export";
        public const string OpportunitiesView = "Permission:opportunities:view";
        public const string OpportunitiesCreate = "Permission:opportunities:create";
        public const string OpportunitiesEdit = "Permission:opportunities:edit";
        public const string OpportunitiesDelete = "Permission:opportunities:delete";
        public const string OpportunitiesApprove = "Permission:opportunities:approve";
        public const string OpportunitiesExport = "Permission:opportunities:export";
        public const string NotificationsView = "Permission:notifications:view";
        public const string NotificationsCreate = "Permission:notifications:create";
        public const string NotificationsEdit = "Permission:notifications:edit";
        public const string NotificationsDelete = "Permission:notifications:delete";
        public const string NotificationsApprove = "Permission:notifications:approve";
        public const string NotificationsExport = "Permission:notifications:export";
        public const string PartnersView = "Permission:partners:view";
        public const string PartnersCreate = "Permission:partners:create";
        public const string PartnersEdit = "Permission:partners:edit";
        public const string PartnersDelete = "Permission:partners:delete";
        public const string PartnersApprove = "Permission:partners:approve";
        public const string PartnersExport = "Permission:partners:export";
        public const string ProductsView = "Permission:products:view";
        public const string ProductsCreate = "Permission:products:create";
        public const string ProductsEdit = "Permission:products:edit";
        public const string ProductsDelete = "Permission:products:delete";
        public const string ProductsApprove = "Permission:products:approve";
        public const string ProductsExport = "Permission:products:export";

        public static string For(string moduleCode, string actionCode) => $"Permission:{moduleCode}:{actionCode}";
    }
}
