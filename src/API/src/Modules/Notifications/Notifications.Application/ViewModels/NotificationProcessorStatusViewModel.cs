namespace Notifications.Application.ViewModels
{
    public class NotificationProcessorStatusViewModel
    {
        public bool ProcessorEnabled { get; set; }
        public int ProcessorIntervalMinutes { get; set; }
        public bool IsRunning { get; set; }
        public string? CurrentTrigger { get; set; }
        public DateTime? LastStartedOn { get; set; }
        public DateTime? LastCompletedOn { get; set; }
        public string? LastTrigger { get; set; }
        public bool? LastSucceeded { get; set; }
        public string? LastMessage { get; set; }
    }
}
