namespace Clients.Application.ViewModels
{
    public class ClientContactResult
    {
        public bool Succeeded => Errors.Count == 0 && !NotFound;
        public bool NotFound { get; set; }
        public List<string> Errors { get; set; } = new();
        public ClientContactViewModel? Contact { get; set; }
    }
}
