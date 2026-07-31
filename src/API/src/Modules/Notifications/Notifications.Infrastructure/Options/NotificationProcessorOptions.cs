namespace Notifications.Infrastructure.Options
{
    public class NotificationProcessorOptions
    {
        public bool Enabled { get; set; } = true;
        public int ProcessorIntervalMinutes { get; set; } = 60;
        public string BusinessTimeZone { get; set; } = "Asia/Kathmandu";
    }
}
