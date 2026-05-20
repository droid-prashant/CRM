using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260520110000_OpportunityManualCreate")]
    public partial class OpportunityManualCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey("FK_Opportunities_Leads_LeadId", "Opportunities", schema: "leads");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey("FK_Opportunities_Leads_LeadId", "Opportunities", schema: "leads");

            migrationBuilder.AlterColumn<Guid>(
                name: "LeadId",
                schema: "leads",
                table: "Opportunities",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.Empty,
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
                onDelete: ReferentialAction.Cascade);
        }
    }
}
