using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260802120000_UniqueOpportunityLeadClient")]
    public partial class UniqueOpportunityLeadClient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM "leads"."Opportunities"
                        WHERE "IsActive" = true
                        GROUP BY "LeadId", "ClientId"
                        HAVING COUNT(*) > 1
                    ) THEN
                        RAISE EXCEPTION 'Cannot add unique LeadId + ClientId rule while duplicate active opportunities exist. Clean up duplicate opportunities before applying 20260802120000_UniqueOpportunityLeadClient.';
                    END IF;
                END
                $$;
                """);

            migrationBuilder.CreateIndex(
                name: "UX_Opportunities_LeadId_ClientId",
                schema: "leads",
                table: "Opportunities",
                columns: new[] { "LeadId", "ClientId" },
                unique: true,
                filter: "\"IsActive\" = true");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UX_Opportunities_LeadId_ClientId",
                schema: "leads",
                table: "Opportunities");
        }
    }
}
