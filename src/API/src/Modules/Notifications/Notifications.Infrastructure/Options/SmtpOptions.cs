namespace Notifications.Infrastructure.Options
{
    public class SmtpOptions
    {
        public bool Enabled { get; set; }
        public string ProviderName { get; set; } = "SMTP";
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public bool UseSsl { get; set; } = true;
        public string SecurityMode { get; set; } = "StartTls";
        public bool RequiresAuthentication { get; set; } = true;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "IntelliSync CRM";
    }
}
