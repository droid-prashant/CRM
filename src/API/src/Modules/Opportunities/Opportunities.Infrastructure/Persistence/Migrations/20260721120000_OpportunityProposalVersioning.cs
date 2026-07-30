using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260721120000_OpportunityProposalVersioning")]
    public partial class OpportunityProposalVersioning : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_IsActive",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.AddColumn<int>(
                name: "VersionNumber",
                schema: "leads",
                table: "OpportunityDocuments",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "leads",
                table: "OpportunityDocuments",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsLastCommunicated",
                schema: "leads",
                table: "OpportunityDocuments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // Set IsLastCommunicated = true for active proposals, false for inactive
            migrationBuilder.Sql(@"
                UPDATE leads.""OpportunityDocuments""
                SET ""IsLastCommunicated"" = ""IsActive"",
                    ""VersionNumber"" = 1
                WHERE ""DocumentType"" = 'Proposal'
            ");

            // Set IsLastCommunicated = true for documents without DocumentType = 'Proposal' (non-proposal docs)
            // but they don't need IsLastCommunicated tracking
            migrationBuilder.Sql(@"
                UPDATE leads.""OpportunityDocuments""
                SET ""IsLastCommunicated"" = false,
                    ""VersionNumber"" = 1
                WHERE ""DocumentType"" != 'Proposal'
            ");

            migrationBuilder.CreateIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_IsLastCommunicated",
                schema: "leads",
                table: "OpportunityDocuments",
                columns: new[] { "OpportunityId", "DocumentType", "IsLastCommunicated" });

            migrationBuilder.CreateIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_VersionNumber",
                schema: "leads",
                table: "OpportunityDocuments",
                columns: new[] { "OpportunityId", "DocumentType", "VersionNumber" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_IsLastCommunicated",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.DropIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_VersionNumber",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.DropColumn(
                name: "VersionNumber",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.DropColumn(
                name: "IsLastCommunicated",
                schema: "leads",
                table: "OpportunityDocuments");

            migrationBuilder.CreateIndex(
                name: "IX_OpportunityDocuments_OpportunityId_DocumentType_IsActive",
                schema: "leads",
                table: "OpportunityDocuments",
                columns: new[] { "OpportunityId", "DocumentType", "IsActive" });
        }
    }
}
