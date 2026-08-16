namespace Lookups.Application.DTOs
{
    public class UpdateLookupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; } = true;
        public string? DialingCode { get; set; }
        public Guid? DefaultCurrencyId { get; set; }
    }
}
