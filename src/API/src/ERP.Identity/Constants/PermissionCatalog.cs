namespace ERP.Identity.Constants
{
    public sealed record PermissionModuleDefinition(string ModuleCode, string ModuleName);

    public static class PermissionCatalog
    {
        private static readonly List<PermissionModuleDefinition> Modules =
        [
            new(PermissionModules.Users, "Users"),
            new(PermissionModules.Roles, "Roles"),
            new(PermissionModules.Permissions, "Permissions"),
            new(PermissionModules.Leads, "Leads")
        ];

        public static IReadOnlyList<PermissionModuleDefinition> GetModules() => Modules;

        public static bool IsValidModule(string moduleCode)
        {
            return Modules.Any(module => string.Equals(module.ModuleCode, moduleCode, StringComparison.OrdinalIgnoreCase));
        }

        public static string ToClaimValue(string moduleCode, string actionCode)
        {
            return $"{moduleCode.Trim().ToLowerInvariant()}:{actionCode.Trim().ToLowerInvariant()}";
        }

        public static IReadOnlySet<string> GetAllClaimValues()
        {
            return Modules
                .SelectMany(module => PermissionActions.All.Select(action => ToClaimValue(module.ModuleCode, action)))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        public static IReadOnlySet<string> GetFullAccessClaimValues() => GetAllClaimValues();
    }
}
