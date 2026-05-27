using Microsoft.EntityFrameworkCore;
using Products.Application.Services;
using Products.Application.ViewModels;
using Products.Infrastructure.Persistence.Data;

namespace Products.Infrastructure.Services
{
    public class ProductOwnerPartnerLookupService : IProductOwnerPartnerLookupService
    {
        private readonly ProductsDbContext _dbContext;

        public ProductOwnerPartnerLookupService(ProductsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<ProductOwnerPartnerLookupViewModel>> GetActiveProductOwnerPartnersAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Database
                .SqlQueryRaw<ProductOwnerPartnerLookupViewModel>("""
                    SELECT p."Id", p."Name", p."Code", pt."Code" AS "PartnerTypeCode"
                    FROM "partners"."Partners" p
                    INNER JOIN "partners"."PartnerTypes" pt ON pt."Id" = p."PartnerTypeId"
                    WHERE p."IsActive" = true
                      AND pt."IsActive" = true
                      AND REPLACE(UPPER(pt."Code"), '-', '_') IN ('VENDOR', 'SUPPLIER', 'TECHNOLOGY_PARTNER')
                    ORDER BY p."Name"
                    """)
                .ToListAsync(cancellationToken);
        }

        public Task<ProductOwnerPartnerLookupViewModel?> GetActiveProductOwnerPartnerAsync(Guid partnerId, CancellationToken cancellationToken)
        {
            return _dbContext.Database
                .SqlQueryRaw<ProductOwnerPartnerLookupViewModel>("""
                    SELECT p."Id", p."Name", p."Code", pt."Code" AS "PartnerTypeCode"
                    FROM "partners"."Partners" p
                    INNER JOIN "partners"."PartnerTypes" pt ON pt."Id" = p."PartnerTypeId"
                    WHERE p."Id" = {0}
                      AND p."IsActive" = true
                      AND pt."IsActive" = true
                      AND REPLACE(UPPER(pt."Code"), '-', '_') IN ('VENDOR', 'SUPPLIER', 'TECHNOLOGY_PARTNER')
                    """, partnerId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<List<ProductOwnerPartnerLookupViewModel>> GetPartnersByIdsAsync(IEnumerable<Guid> partnerIds, CancellationToken cancellationToken)
        {
            var ids = partnerIds.Where(id => id != Guid.Empty).Distinct().ToArray();
            if (ids.Length == 0)
            {
                return Task.FromResult(new List<ProductOwnerPartnerLookupViewModel>());
            }

            return _dbContext.Database
                .SqlQueryRaw<ProductOwnerPartnerLookupViewModel>("""
                    SELECT p."Id", p."Name", p."Code", pt."Code" AS "PartnerTypeCode"
                    FROM "partners"."Partners" p
                    LEFT JOIN "partners"."PartnerTypes" pt ON pt."Id" = p."PartnerTypeId"
                    WHERE p."Id" = ANY({0})
                    ORDER BY p."Name"
                    """, ids)
                .ToListAsync(cancellationToken);
        }
    }
}
