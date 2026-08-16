using ERP.Core.Constants;

namespace Lookups.Application.DTOs
{
    public class CreateLookupRequest
    {
        public LookUpTypeEnum LookupId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? Order { get; set; }
        public string? DialingCode { get; set; }
        public Guid? DefaultCurrencyId { get; set; }
    }
}
