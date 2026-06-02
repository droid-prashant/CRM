namespace Clients.Application.ViewModels
{
    public class ClientTimelineViewModel
    {
        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime ActivityDate { get; set; }
        public string? CreatedByUserName { get; set; }
        public bool IsSystemGenerated { get; set; }
        public string? ReferenceEntity { get; set; }
    }
}
