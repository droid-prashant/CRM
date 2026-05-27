namespace Products.Application.ViewModels
{
    public class ProductDetailViewModel : ProductListItemViewModel
    {
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
