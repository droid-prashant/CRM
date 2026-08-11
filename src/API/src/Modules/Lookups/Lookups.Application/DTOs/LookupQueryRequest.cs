using ERP.Core.Constants;

namespace Lookups.Application.DTOs
{
    public class LookupQueryRequest
    {
        public LookUpTypeEnum LookupId { get; set; }
        public bool IncludeInactive { get; set; }
    }
}
