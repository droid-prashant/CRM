using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Core.Constants
{
    public enum LookUpTypeEnum
    {
        [Description("ProductCategory")] ProductCategory = 1,
        [Description("Status")] Status = 2,
        [Description("Source")] Source = 3,
        [Description("TransactionType")] TransactionType = 4,
        [Description("AdjustmentType")] AdjustmentType = 5,
    }
}
