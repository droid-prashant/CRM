using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(LeadsDbContext))]
    [Migration("20260505100000_LeadConversion")]
    public partial class LeadConversion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ConvertedOpportunityId",
                schema: "leads",
                table: "Leads",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Clients",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    CountryId = table.Column<Guid>(type: "uuid", nullable: false),
                    IndustryId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                    table.ForeignKey("FK_Clients_Countries_CountryId", x => x.CountryId, "Countries", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Clients_Industries_IndustryId", x => x.IndustryId, "Industries", "Id", principalSchema: "leads");
                });

            migrationBuilder.CreateTable(
                name: "ClientContacts",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientContacts", x => x.Id);
                    table.ForeignKey("FK_ClientContacts_Clients_ClientId", x => x.ClientId, "Clients", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Opportunities",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OpportunityNumber = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    LeadId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    EstimatedValue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CurrencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExpectedCloseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OwnerUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Stage = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Opportunities", x => x.Id);
                    table.ForeignKey("FK_Opportunities_ClientContacts_ContactId", x => x.ContactId, "ClientContacts", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Opportunities_Clients_ClientId", x => x.ClientId, "Clients", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Opportunities_Leads_LeadId", x => x.LeadId, "Leads", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Opportunities_Products_ProductId", x => x.ProductId, "Products", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_Leads_ConvertedOpportunityId", "Leads", "ConvertedOpportunityId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Clients_CountryId", "Clients", "CountryId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Clients_IndustryId", "Clients", "IndustryId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Clients_Name", "Clients", "Name", schema: "leads");
            migrationBuilder.CreateIndex("IX_ClientContacts_ClientId_Email", "ClientContacts", new[] { "ClientId", "Email" }, schema: "leads");
            migrationBuilder.CreateIndex("IX_Opportunities_ClientId", "Opportunities", "ClientId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Opportunities_ContactId", "Opportunities", "ContactId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Opportunities_LeadId", "Opportunities", "LeadId", schema: "leads");
            migrationBuilder.CreateIndex("IX_Opportunities_OpportunityNumber", "Opportunities", "OpportunityNumber", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_Opportunities_ProductId", "Opportunities", "ProductId", schema: "leads");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Opportunities_ConvertedOpportunityId",
                schema: "leads",
                table: "Leads",
                column: "ConvertedOpportunityId",
                principalSchema: "leads",
                principalTable: "Opportunities",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey("FK_Leads_Opportunities_ConvertedOpportunityId", "Leads", schema: "leads");
            migrationBuilder.DropTable("Opportunities", schema: "leads");
            migrationBuilder.DropTable("ClientContacts", schema: "leads");
            migrationBuilder.DropTable("Clients", schema: "leads");
            migrationBuilder.DropIndex("IX_Leads_ConvertedOpportunityId", "Leads", schema: "leads");
            migrationBuilder.DropColumn("ConvertedOpportunityId", "Leads", schema: "leads");
        }
    }
}
