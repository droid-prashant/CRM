using System.ComponentModel;

namespace ERP.Core.Constants
{
    public enum LookUpTypeEnum
    {
        [Description("LeadStatus")] LeadStatus = 1,
        [Description("LeadSource")] LeadSource = 2,
        [Description("ActivityType")] ActivityType = 3,
        [Description("OpportunityStage")] OpportunityStage = 4
    }
}
