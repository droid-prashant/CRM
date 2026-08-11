namespace Lookups.Application.ViewModels
{
    public class LookupListItemViewModel
    {
        public Guid Id { get; set; }
        public int LookupId { get; set; }
        public string LookupName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public string? DialingCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
