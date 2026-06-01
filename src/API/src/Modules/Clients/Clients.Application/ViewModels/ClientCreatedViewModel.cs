using Clients.Domain.Enums;

namespace Clients.Application.ViewModels
{
    public class ClientCreatedViewModel : ClientListItemViewModel
    {
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<ClientTimelineEntryViewModel> TimelineEntries { get; set; } = new();
    }

    public class ClientTimelineEntryViewModel
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
