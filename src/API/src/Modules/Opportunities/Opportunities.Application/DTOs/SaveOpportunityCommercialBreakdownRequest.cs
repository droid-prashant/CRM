namespace Opportunities.Application.DTOs
{
    public class SaveOpportunityCommercialBreakdownRequest
    {
        public Guid CurrencyId { get; set; }
        public decimal FinalPayableAmount { get; set; }
        public Guid? AgreementDocumentId { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? AgreementExpiryDate { get; set; }
        public Guid? PurchaseOrderDocumentId { get; set; }
        public DateTime? PurchaseOrderDate { get; set; }
        public bool AmcApplicable { get; set; }
        public decimal? AmcAmount { get; set; }
        public DateTime? AmcStartDate { get; set; }
        public DateTime? AmcRenewalDate { get; set; }
        public DateTime? AmcExpiryDate { get; set; }
        public bool SubscriptionApplicable { get; set; }
        public decimal? SubscriptionAmount { get; set; }
        public string? SubscriptionBillingFrequency { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? NextSubscriptionBillingDate { get; set; }
        public string? Remarks { get; set; }
    }
}
