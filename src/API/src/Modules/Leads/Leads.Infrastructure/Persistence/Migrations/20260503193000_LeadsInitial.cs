using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260503193000_LeadsInitial")]
    public partial class LeadsInitial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "leads");

            CreateLookupTable(migrationBuilder, "Countries");
            CreateLookupTable(migrationBuilder, "Industries");
            CreateLookupTable(migrationBuilder, "LeadCategories");
            CreateLookupTable(migrationBuilder, "Partners");

            migrationBuilder.CreateTable(
                name: "LeadSources",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    RequiresPartner = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table => table.PrimaryKey("PK_LeadSources", x => x.Id));

            migrationBuilder.CreateTable(
                name: "Products",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CategoryName = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table => table.PrimaryKey("PK_Products", x => x.Id));

            migrationBuilder.CreateTable(
                name: "Leads",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LeadNumber = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    SourceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    PartnerId = table.Column<Guid>(type: "uuid", nullable: true),
                    CampaignName = table.Column<string>(type: "text", nullable: true),
                    CompanyName = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Website = table.Column<string>(type: "text", nullable: true),
                    ContactPersonName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    JobTitle = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    AlternatePhone = table.Column<string>(type: "text", nullable: true),
                    CountryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    IndustryId = table.Column<Guid>(type: "uuid", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    LeadScore = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AssignedToUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    QualificationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisqualificationReason = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leads", x => x.Id);
                    table.ForeignKey("FK_Leads_Countries_CountryId", x => x.CountryId, "Countries", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Leads_Industries_IndustryId", x => x.IndustryId, "Industries", "Id", principalSchema: "leads");
                    table.ForeignKey("FK_Leads_LeadCategories_CategoryId", x => x.CategoryId, "LeadCategories", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Leads_LeadSources_SourceId", x => x.SourceId, "LeadSources", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Leads_Partners_PartnerId", x => x.PartnerId, "Partners", "Id", principalSchema: "leads");
                });

            migrationBuilder.CreateTable(
                name: "LeadProductInterests",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadProductInterests", x => x.Id);
                    table.ForeignKey("FK_LeadProductInterests_Leads_LeadId", x => x.LeadId, "Leads", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_LeadProductInterests_Products_ProductId", x => x.ProductId, "Products", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LeadTimelineEntries",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadTimelineEntries", x => x.Id);
                    table.ForeignKey("FK_LeadTimelineEntries_Leads_LeadId", x => x.LeadId, "Leads", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            CreateLookupIndexes(migrationBuilder);
            migrationBuilder.CreateIndex("IX_Leads_CategoryId", "Leads", "CategoryId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Leads_CountryId", "Leads", "CountryId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Leads_IndustryId", "Leads", "IndustryId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Leads_LeadNumber", "Leads", "LeadNumber", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_Leads_PartnerId", "Leads", "PartnerId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Leads_SourceId", "Leads", "SourceId", schema: "leads");
            migrationBuilder.CreateIndex("IX_LeadProductInterests_LeadId_ProductId", "LeadProductInterests", new[] { "LeadId", "ProductId" }, schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_LeadProductInterests_ProductId", "LeadProductInterests", "ProductId", schema: "leads");
            migrationBuilder.CreateIndex("IX_LeadTimelineEntries_LeadId", "LeadTimelineEntries", "LeadId", schema: "leads");

            SeedLookups(migrationBuilder);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("LeadProductInterests", schema: "leads");
            migrationBuilder.DropTable("LeadTimelineEntries", schema: "leads");
            migrationBuilder.DropTable("Products", schema: "leads");
            migrationBuilder.DropTable("Leads", schema: "leads");
            migrationBuilder.DropTable("Countries", schema: "leads");
            migrationBuilder.DropTable("Industries", schema: "leads");
            migrationBuilder.DropTable("LeadCategories", schema: "leads");
            migrationBuilder.DropTable("LeadSources", schema: "leads");
            migrationBuilder.DropTable("Partners", schema: "leads");
        }

        private static void CreateLookupTable(MigrationBuilder migrationBuilder, string tableName)
        {
            migrationBuilder.CreateTable(
                name: tableName,
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table => table.PrimaryKey($"PK_{tableName}", x => x.Id));
        }

        private static void CreateLookupIndexes(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex("IX_Countries_Code", "Countries", "Code", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_Industries_Code", "Industries", "Code", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_LeadCategories_Code", "LeadCategories", "Code", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_LeadSources_Code", "LeadSources", "Code", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_Partners_Code", "Partners", "Code", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_Products_Code", "Products", "Code", schema: "leads", unique: true);
        }

        private static void SeedLookups(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "leads"."LeadSources" ("Id", "Code", "Name", "RequiresPartner", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('10000000-0000-0000-0000-000000000001', 'DIRECT', 'Direct', false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('10000000-0000-0000-0000-000000000002', 'PARTNER', 'Partner', true, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('10000000-0000-0000-0000-000000000003', 'CAMPAIGN', 'Campaign', false, '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);

                INSERT INTO "leads"."LeadCategories" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('20000000-0000-0000-0000-000000000001', 'HOT', 'Hot', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('20000000-0000-0000-0000-000000000002', 'WARM', 'Warm', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('20000000-0000-0000-0000-000000000003', 'COLD', 'Cold', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);

                INSERT INTO "leads"."Products" ("Id", "Code", "Name", "CategoryName", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('30000000-0000-0000-0000-000000000001', 'CRM-CORE', 'CRM Core', 'Software', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('30000000-0000-0000-0000-000000000002', 'CRM-SALES', 'Sales Automation', 'Software', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('30000000-0000-0000-0000-000000000003', 'CRM-SUPPORT', 'Customer Support', 'Software', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);

                INSERT INTO "leads"."Partners" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('40000000-0000-0000-0000-000000000001', 'PARTNER-A', 'Partner A', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('40000000-0000-0000-0000-000000000002', 'PARTNER-B', 'Partner B', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);

                INSERT INTO "leads"."Countries" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('50000000-0000-0000-0000-000000000001', 'NP', 'Nepal', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('50000000-0000-0000-0000-000000000002', 'US', 'United States', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('50000000-0000-0000-0000-000000000003', 'IN', 'India', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);

                INSERT INTO "leads"."Industries" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('60000000-0000-0000-0000-000000000001', 'IT', 'Information Technology', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('60000000-0000-0000-0000-000000000002', 'FIN', 'Financial Services', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('60000000-0000-0000-0000-000000000003', 'MFG', 'Manufacturing', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true);
                """);
        }
    }
}
