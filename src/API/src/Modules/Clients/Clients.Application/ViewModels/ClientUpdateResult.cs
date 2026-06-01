namespace Clients.Application.ViewModels
{
    public class ClientUpdateResult
    {
        public bool Succeeded => Errors.Count == 0 && !NotFound;
        public bool NotFound { get; set; }
        public List<string> Errors { get; set; } = new();
        public ClientUpdatedViewModel? Client { get; set; }
    }
}
