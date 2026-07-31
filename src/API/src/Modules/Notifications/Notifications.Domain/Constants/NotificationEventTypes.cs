namespace Notifications.Domain.Constants
{
    public static class NotificationEventTypes
    {
        public const string AgreementExpiry = "AgreementExpiry";
        public const string AmcRenewal = "AmcRenewal";
        public const string AmcExpiry = "AmcExpiry";
        public const string SubscriptionBilling = "SubscriptionBilling";
        public const string LeadFollowUp = "LeadFollowUp";
        public const string OpportunityFollowUp = "OpportunityFollowUp";

        public static readonly string[] All =
        [
            AgreementExpiry,
            AmcRenewal,
            AmcExpiry,
            SubscriptionBilling,
            LeadFollowUp,
            OpportunityFollowUp
        ];
    }
}
