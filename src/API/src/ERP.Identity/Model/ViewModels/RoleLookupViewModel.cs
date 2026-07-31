namespace ERP.Identity.Model.ViewModels
{
    public class RoleLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
    }
}
