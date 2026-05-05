namespace Leads.Application.DTOs
{
    public class ConvertLeadRequest
    {
        public Guid ProductId { get; set; }
        public Guid? ClientId { get; set; }
        public NewClientRequest? NewClient { get; set; }
        public Guid? ContactId { get; set; }
        public NewContactRequest? NewContact { get; set; }
        public string OpportunityTitle { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public Guid CurrencyId { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public Guid OwnerUserId { get; set; }
    }

    public class NewClientRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid CountryId { get; set; }
        public Guid? IndustryId { get; set; }
    }

    public class NewContactRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
