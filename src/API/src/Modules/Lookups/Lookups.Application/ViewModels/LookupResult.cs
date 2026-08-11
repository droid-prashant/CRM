namespace Lookups.Application.ViewModels
{
    public class LookupResult
    {
        public LookupListItemViewModel? Lookup { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool NotFound { get; set; }
        public bool Succeeded => Lookup != null && Errors.Count == 0 && !NotFound;
    }
}
