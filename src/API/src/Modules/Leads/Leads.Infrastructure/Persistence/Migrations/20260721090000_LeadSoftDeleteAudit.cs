using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260721090000_LeadSoftDeleteAudit")]
    public partial class LeadSoftDeleteAudit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "leads",
                table: "Leads",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                schema: "leads",
                table: "Leads",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedOn",
                schema: "leads",
                table: "Leads",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE ""leads"".""Leads"" SET ""IsDeleted"" = TRUE WHERE ""IsActive"" = FALSE;");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_IsDeleted_DeletedOn",
                schema: "leads",
                table: "Leads",
                columns: new[] { "IsDeleted", "DeletedOn" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Leads_IsDeleted_DeletedOn",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "DeletedOn",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "leads",
                table: "Leads");
        }
    }
}
