namespace Notifications.Domain.Constants
{
    public static class NotificationDeliveryStatuses
    {
        public const string Processing = "Processing";
        public const string Sent = "Sent";
        public const string AcceptedBySmtp = "AcceptedBySmtp";
        public const string Failed = "Failed";
        public const string Skipped = "Skipped";

        public static bool IsSuccessful(string status)
        {
            return status == Sent || status == AcceptedBySmtp;
        }
    }
}
