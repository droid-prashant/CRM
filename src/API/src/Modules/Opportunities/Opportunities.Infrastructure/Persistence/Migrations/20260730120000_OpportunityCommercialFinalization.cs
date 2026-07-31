using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Opportunities.Infrastructure.Persistence.Data;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(OpportunitiesDbContext))]
    [Migration("20260730120000_OpportunityCommercialFinalization")]
    public partial class OpportunityCommercialFinalization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OpportunityCommercialDocuments",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OpportunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    DocumentType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    StoredFileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    Remarks = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpportunityCommercialDocuments", x => x.Id);
                    table.ForeignKey("FK_OpportunityCommercialDocuments_Opportunities_OpportunityId", x => x.OpportunityId, "Opportunities", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OpportunityCommercialBreakdowns",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OpportunityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CurrencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    FinalPayableAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    AgreementDocumentId = table.Column<Guid>(type: "uuid", nullable: true),
                    AgreementDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AgreementExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PurchaseOrderDocumentId = table.Column<Guid>(type: "uuid", nullable: true),
                    PurchaseOrderDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AmcApplicable = table.Column<bool>(type: "boolean", nullable: false),
                    AmcAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    AmcStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AmcRenewalDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AmcExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SubscriptionApplicable = table.Column<bool>(type: "boolean", nullable: false),
                    SubscriptionAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    SubscriptionBillingFrequency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SubscriptionStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NextSubscriptionBillingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Remarks = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpportunityCommercialBreakdowns", x => x.Id);
                    table.ForeignKey("FK_OpportunityCommercialBreakdowns_Opportunities_OpportunityId", x => x.OpportunityId, "Opportunities", "Id", principalSchema: "leads", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_OpportunityCommercialBreakdowns_OpportunityCommercialDocuments_AgreementDocumentId", x => x.AgreementDocumentId, "OpportunityCommercialDocuments", "Id", principalSchema: "leads");
                    table.ForeignKey("FK_OpportunityCommercialBreakdowns_OpportunityCommercialDocuments_PurchaseOrderDocumentId", x => x.PurchaseOrderDocumentId, "OpportunityCommercialDocuments", "Id", principalSchema: "leads");
                });

            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_AgreementDocumentId", "OpportunityCommercialBreakdowns", "AgreementDocumentId", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_AgreementExpiryDate", "OpportunityCommercialBreakdowns", "AgreementExpiryDate", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_AmcExpiryDate", "OpportunityCommercialBreakdowns", "AmcExpiryDate", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_AmcRenewalDate", "OpportunityCommercialBreakdowns", "AmcRenewalDate", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_NextSubscriptionBillingDate", "OpportunityCommercialBreakdowns", "NextSubscriptionBillingDate", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_OpportunityId", "OpportunityCommercialBreakdowns", "OpportunityId", schema: "leads", unique: true);
            migrationBuilder.CreateIndex("IX_OpportunityCommercialBreakdowns_PurchaseOrderDocumentId", "OpportunityCommercialBreakdowns", "PurchaseOrderDocumentId", schema: "leads");
            migrationBuilder.CreateIndex("IX_OpportunityCommercialDocuments_OpportunityId_DocumentType_IsActive", "OpportunityCommercialDocuments", new[] { "OpportunityId", "DocumentType", "IsActive" }, schema: "leads");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("OpportunityCommercialBreakdowns", schema: "leads");
            migrationBuilder.DropTable("OpportunityCommercialDocuments", schema: "leads");
        }
    }
}
