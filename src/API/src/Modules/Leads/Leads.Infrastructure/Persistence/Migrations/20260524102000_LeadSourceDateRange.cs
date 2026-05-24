using System;
using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260524102000_LeadSourceDateRange")]
    public partial class LeadSourceDateRange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SourceStartDate",
                schema: "leads",
                table: "Leads",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SourceEndDate",
                schema: "leads",
                table: "Leads",
                type: "timestamp with time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("SourceStartDate", "Leads", schema: "leads");
            migrationBuilder.DropColumn("SourceEndDate", "Leads", schema: "leads");
        }
    }
}
