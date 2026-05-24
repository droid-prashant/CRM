using Partners.Application.ViewModels;

namespace Partners.Application.Services
{
    public class PartnerResult
    {
        public PartnerDetailViewModel? Partner { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool NotFound { get; set; }
        public bool Succeeded => Partner != null && Errors.Count == 0 && !NotFound;
    }
}
