namespace Partners.Domain.Constants
{
    public static class PartnerTypeCodes
    {
        public const string Reseller = "RESELLER";
        public const string Vendor = "VENDOR";
        public const string Supplier = "SUPPLIER";
        public const string Affiliate = "AFFILIATE";
        public const string SalesAgent = "SALES_AGENT";
        public const string Consultant = "CONSULTANT";
        public const string TechnologyPartner = "TECHNOLOGY_PARTNER";
        public const string ImplementationPartner = "IMPLEMENTATION_PARTNER";
        public const string ServicePartner = "SERVICE_PARTNER";
        public const string StrategicPartner = "STRATEGIC_PARTNER";
        public const string Other = "OTHER";

        private static readonly HashSet<string> ProductOwnerCodes = new(StringComparer.OrdinalIgnoreCase)
        {
            Vendor,
            Supplier,
            TechnologyPartner
        };

        private static readonly HashSet<string> InHouseSellerCodes = new(StringComparer.OrdinalIgnoreCase)
        {
            Reseller,
            SalesAgent
        };

        private static readonly Dictionary<string, int> SortOrders = new(StringComparer.OrdinalIgnoreCase)
        {
            [Reseller] = 10,
            [Vendor] = 20,
            [Supplier] = 30,
            [SalesAgent] = 40,
            [Affiliate] = 50,
            [Consultant] = 60,
            [TechnologyPartner] = 70,
            [ImplementationPartner] = 80,
            [ServicePartner] = 90,
            [StrategicPartner] = 100,
            [Other] = 110
        };

        public static bool CanOwnProducts(string? code) => ProductOwnerCodes.Contains(Normalize(code));

        public static bool CanSellInHouseProducts(string? code) => InHouseSellerCodes.Contains(Normalize(code));

        public static int GetSortOrder(string? code)
        {
            return SortOrders.TryGetValue(Normalize(code), out var order) ? order : int.MaxValue;
        }

        public static string Normalize(string? code)
        {
            return (code ?? string.Empty).Trim().Replace('-', '_').ToUpperInvariant();
        }
    }
}
