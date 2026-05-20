using System;
using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260520100000_LeadInteractions")]
    public partial class LeadInteractions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeadInteractions",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    InteractionType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Subject = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    InteractionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NextFollowUpDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadInteractions", x => x.Id);
                    table.ForeignKey("FK_LeadInteractions_Leads_LeadId", x => x.LeadId, "Leads", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_LeadInteractions_LeadId_InteractionDate", "LeadInteractions", new[] { "LeadId", "InteractionDate" }, schema: "leads");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("LeadInteractions", schema: "leads");
        }
    }
}
