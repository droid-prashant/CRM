using System.ComponentModel;

namespace ERP.Core.Constants
{
    public enum LookUpTypeEnum
    {
        [Description("Industry")] Industry = 1,
        [Description("Country")] Country = 2,
        [Description("Currency")] Currency = 3,
        [Description("Client Type")] ClientType = 4,
        [Description("Partner Type")] PartnerType = 5,
        [Description("Lead Source")] LeadSource = 6,
        [Description("Lead Category")] LeadCategory = 7,
        [Description("Product Type")] ProductType = 8,
        [Description("Deployment Type")] DeploymentType = 9,
        [Description("Ownership Type")] OwnershipType = 10
    }
}
