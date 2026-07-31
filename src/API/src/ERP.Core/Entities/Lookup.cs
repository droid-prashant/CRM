using ERP.Core.Constants;
using System.ComponentModel.DataAnnotations;

namespace ERP.Core.Entities
{
    public class Lookup : BaseEntity
    {
        [Required]
        public LookUpTypeEnum Type { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string Value { get; set; } = string.Empty;
    }
}
