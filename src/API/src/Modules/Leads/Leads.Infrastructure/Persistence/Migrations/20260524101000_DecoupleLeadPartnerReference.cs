using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260524101000_DecoupleLeadPartnerReference")]
    public partial class DecoupleLeadPartnerReference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_Partners_PartnerId",
                schema: "leads",
                table: "Leads");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Partners_PartnerId",
                schema: "leads",
                table: "Leads",
                column: "PartnerId",
                principalSchema: "leads",
                principalTable: "Partners",
                principalColumn: "Id");
        }
    }
}
