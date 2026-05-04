using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Identity.Model.VIewModel
{
    public class LoginResponseViewModel
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
        public string? Error { get; set; }
        public int StatusCode { get; set; }
        public bool Succeded { get; set; }
    }
}
