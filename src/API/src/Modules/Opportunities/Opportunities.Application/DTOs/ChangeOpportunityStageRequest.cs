namespace Opportunities.Application.DTOs
{
    public class ChangeOpportunityStageRequest
    {
        public Guid StageId { get; set; }
        public string? Remarks { get; set; }
    }
}
