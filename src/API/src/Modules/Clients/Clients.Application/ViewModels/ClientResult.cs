namespace Clients.Application.ViewModels
{
    public class ClientResult
    {
        public bool Succeeded => Errors.Count == 0 && !NotFound;
        public bool NotFound { get; set; }
        public List<string> Errors { get; set; } = new();
        public ClientCreatedViewModel? Client { get; set; }
    }
}
