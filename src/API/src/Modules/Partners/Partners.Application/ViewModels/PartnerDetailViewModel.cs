namespace Partners.Application.ViewModels
{
    public class PartnerDetailViewModel : PartnerListItemViewModel
    {
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
