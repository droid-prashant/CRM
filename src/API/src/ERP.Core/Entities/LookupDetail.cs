using ERP.Core.Constants;
using System.ComponentModel.DataAnnotations;

namespace ERP.Core.Entities
{
    public class LookupDetail : BaseEntity
    {
        [Required]
        public LookUpTypeEnum LookupId { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public int Order { get; set; }

        [StringLength(50)]
        public string? Code { get; set; }

        [StringLength(10)]
        public string? DialingCode { get; set; }
    }
}
