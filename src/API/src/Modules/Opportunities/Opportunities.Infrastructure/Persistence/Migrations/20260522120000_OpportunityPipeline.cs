using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260522120000_OpportunityPipeline")]
    public partial class OpportunityPipeline : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OpportunityStages",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Sequence = table.Column<int>(type: "integer", nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    IsFinal = table.Column<bool>(type: "boolean", nullable: false),
                    IsWonStage = table.Column<bool>(type: "boolean", nullable: false),
                    IsLostStage = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_OpportunityStages", x => x.Id));

            migrationBuilder.CreateIndex("IX_OpportunityStages_Name", "OpportunityStages", "Name", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_OpportunityStages_Sequence", "OpportunityStages", "Sequence", schema: "leads", unique: true);

            migrationBuilder.Sql("""
                INSERT INTO "leads"."OpportunityStages" ("Id", "Name", "Sequence", "IsDefault", "IsFinal", "IsWonStage", "IsLostStage", "IsDeleted", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('80000000-0000-0000-0000-000000000001', 'New Opportunity', 1, true, false, false, false, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('80000000-0000-0000-0000-000000000002', 'Discovery', 2, false, false, false, false, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('80000000-0000-0000-0000-000000000003', 'Proposal Sent', 3, false, false, false, false, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('80000000-0000-0000-0000-000000000004', 'Negotiation', 4, false, false, false, false, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('80000000-0000-0000-0000-000000000005', 'Won', 5, false, true, true, false, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('80000000-0000-0000-0000-000000000006', 'Lost', 6, false, true, false, true, false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true)
                ON CONFLICT ("Id") DO NOTHING;
                """);

            migrationBuilder.AddColumn<Guid>(
                name: "StageId",
                schema: "leads",
                table: "Opportunities",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "leads",
                table: "Opportunities",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "Open");

            migrationBuilder.AddColumn<decimal>(
                name: "FinalAmount",
                schema: "leads",
                table: "Opportunities",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedDate",
                schema: "leads",
                table: "Opportunities",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClosingNote",
                schema: "leads",
                table: "Opportunities",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LostReason",
                schema: "leads",
                table: "Opportunities",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "leads"."Opportunities"
                SET "StageId" = CASE
                    WHEN LOWER("Stage") = 'discovery' THEN '80000000-0000-0000-0000-000000000002'::uuid
                    WHEN LOWER("Stage") = 'proposal sent' THEN '80000000-0000-0000-0000-000000000003'::uuid
                    WHEN LOWER("Stage") = 'negotiation' THEN '80000000-0000-0000-0000-000000000004'::uuid
                    WHEN LOWER("Stage") = 'won' THEN '80000000-0000-0000-0000-000000000005'::uuid
                    WHEN LOWER("Stage") = 'lost' THEN '80000000-0000-0000-0000-000000000006'::uuid
                    ELSE '80000000-0000-0000-0000-000000000001'::uuid
                END,
                "Stage" = CASE
                    WHEN LOWER("Stage") = 'new' THEN 'New Opportunity'
                    ELSE "Stage"
                END;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "StageId",
                schema: "leads",
                table: "Opportunities",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex("IX_Opportunities_StageId", "Opportunities", "StageId", schema: "leads");
            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_OpportunityStages_StageId",
                schema: "leads",
                table: "Opportunities",
                column: "StageId",
                principalSchema: "leads",
                principalTable: "OpportunityStages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.CreateTable(
                name: "OpportunityActivities",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OpportunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Subject = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    ActivityDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FollowUpDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpportunityActivities", x => x.Id);
                    table.ForeignKey("FK_OpportunityActivities_Opportunities_OpportunityId", x => x.OpportunityId, "Opportunities", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OpportunityStageHistories",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OpportunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    FromStageId = table.Column<Guid>(type: "uuid", nullable: true),
                    ToStageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Remarks = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpportunityStageHistories", x => x.Id);
                    table.ForeignKey("FK_OpportunityStageHistories_Opportunities_OpportunityId", x => x.OpportunityId, "Opportunities", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_OpportunityStageHistories_OpportunityStages_FromStageId", x => x.FromStageId, "OpportunityStages", "Id", principalSchema: "leads");
                    table.ForeignKey("FK_OpportunityStageHistories_OpportunityStages_ToStageId", x => x.ToStageId, "OpportunityStages", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_OpportunityActivities_OpportunityId_ActivityDate", "OpportunityActivities", new[] { "OpportunityId", "ActivityDate" }, schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityStageHistories_FromStageId", "OpportunityStageHistories", "FromStageId", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityStageHistories_OpportunityId_CreatedOn", "OpportunityStageHistories", new[] { "OpportunityId", "CreatedOn" }, schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityStageHistories_ToStageId", "OpportunityStageHistories", "ToStageId", schema: "leads");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("OpportunityActivities", schema: "leads");
            migrationBuilder.DropTable("OpportunityStageHistories", schema: "leads");
            migrationBuilder.DropForeignKey("FK_Opportunities_OpportunityStages_StageId", "Opportunities", schema: "leads");
            migrationBuilder.DropIndex("IX_Opportunities_StageId", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("StageId", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("Status", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("FinalAmount", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("ClosedDate", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("ClosingNote", "Opportunities", schema: "leads");
            migrationBuilder.DropColumn("LostReason", "Opportunities", schema: "leads");
            migrationBuilder.DropTable("OpportunityStages", schema: "leads");
        }
    }
}
