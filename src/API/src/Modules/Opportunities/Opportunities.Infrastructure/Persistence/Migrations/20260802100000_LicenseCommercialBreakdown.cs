using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260802100000_LicenseCommercialBreakdown")]
    public partial class LicenseCommercialBreakdown : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AmcApplicable",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                newName: "LicenseApplicable");

            migrationBuilder.AddColumn<decimal>(
                name: "LicenseAmount",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFinal",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFinal",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns");

            migrationBuilder.DropColumn(
                name: "LicenseAmount",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns");

            migrationBuilder.RenameColumn(
                name: "LicenseApplicable",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                newName: "AmcApplicable");
        }
    }
}
