namespace Clients.Application.ViewModels
{
    public class ClientListResult
    {
        public bool Succeeded => Errors.Count == 0;
        public List<string> Errors { get; set; } = new();
        public ClientListResponseViewModel? Response { get; set; }
    }
}
