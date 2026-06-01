namespace Clients.Application.ViewModels
{
    public class PrimaryContactResult
    {
        public bool Succeeded => Errors.Count == 0 && !NotFound;
        public bool NotFound { get; set; }
        public List<string> Errors { get; set; } = new();
        public PrimaryContactViewModel? PrimaryContact { get; set; }
    }
}
