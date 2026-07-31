using System.ComponentModel.DataAnnotations;

namespace ERP.Identity.Model.Dtos
{
    public class LoginRequestDto
    {
        [Required]
        public required string UsernameOrEmail { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
