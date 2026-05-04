using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
