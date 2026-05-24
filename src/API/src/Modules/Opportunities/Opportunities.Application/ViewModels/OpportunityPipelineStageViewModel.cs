namespace Opportunities.Application.ViewModels
{
    public class OpportunityPipelineStageViewModel
    {
        public Guid StageId { get; set; }
        public string StageName { get; set; } = string.Empty;
        public int Sequence { get; set; }
        public bool IsFinal { get; set; }
        public bool IsWonStage { get; set; }
        public bool IsLostStage { get; set; }
        public List<OpportunityListItemViewModel> Opportunities { get; set; } = new();
    }
}
