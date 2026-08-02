using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260802110000_RequireOpportunityLead")]
    public partial class RequireOpportunityLead : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opportunities_Leads_LeadId",
                schema: "leads",
                table: "Opportunities");

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM "leads"."Opportunities" WHERE "LeadId" IS NULL) THEN
                        RAISE EXCEPTION 'Cannot require Opportunities.LeadId while opportunities with null LeadId exist. Clean up or backfill those rows before applying 20260802110000_RequireOpportunityLead.';
                    END IF;
                END
                $$;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "LeadId",
                schema: "leads",
                table: "Opportunities",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_Leads_LeadId",
                schema: "leads",
                table: "Opportunities",
                column: "LeadId",
                principalSchema: "leads",
                principalTable: "Leads",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opportunities_Leads_LeadId",
                schema: "leads",
                table: "Opportunities");

            migrationBuilder.AlterColumn<Guid>(
                name: "LeadId",
                schema: "leads",
                table: "Opportunities",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_Leads_LeadId",
                schema: "leads",
                table: "Opportunities",
                column: "LeadId",
                principalSchema: "leads",
                principalTable: "Leads",
                principalColumn: "Id");
        }
    }
}
