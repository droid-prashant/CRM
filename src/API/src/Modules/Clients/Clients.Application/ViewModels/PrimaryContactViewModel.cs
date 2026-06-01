namespace Clients.Application.ViewModels
{
    public class PrimaryContactViewModel
    {
        public Guid ContactId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool IsPrimary { get; set; }
    }
}
