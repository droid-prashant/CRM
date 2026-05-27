namespace Products.Application.ViewModels
{
    public class ProductLookupBundleViewModel
    {
        public List<ProductOptionViewModel> ProductTypes { get; set; } = new();
        public List<ProductOptionViewModel> DeploymentTypes { get; set; } = new();
        public List<ProductOptionViewModel> OwnershipTypes { get; set; } = new();
        public List<ProductOwnerPartnerLookupViewModel> OwnerPartners { get; set; } = new();
    }
}
