namespace Products.Application.ViewModels
{
    public class ProductResult
    {
        public ProductDetailViewModel? Product { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool NotFound { get; set; }
        public bool Succeeded => Product != null && Errors.Count == 0 && !NotFound;
    }
}
