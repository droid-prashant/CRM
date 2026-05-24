namespace Partners.Application.ViewModels
{
    public class PartnerLookupBundleViewModel
    {
        public List<LookupViewModel> PartnerTypes { get; set; } = new();
        public List<LookupViewModel> Countries { get; set; } = new();
    }
}
