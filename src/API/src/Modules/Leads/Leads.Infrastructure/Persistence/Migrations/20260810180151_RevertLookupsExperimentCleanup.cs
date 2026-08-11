using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RevertLookupsExperimentCleanup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Cleanup after a reverted experiment: restore the FK constraints that an earlier,
            // since-reverted change had dropped, and remove the scratch "lookups" schema it created.
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_Leads_Countries_CountryId') THEN
                        ALTER TABLE "leads"."Leads" ADD CONSTRAINT "FK_Leads_Countries_CountryId"
                            FOREIGN KEY ("CountryId") REFERENCES "leads"."Countries" ("Id") ON DELETE CASCADE;
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_Leads_Industries_IndustryId') THEN
                        ALTER TABLE "leads"."Leads" ADD CONSTRAINT "FK_Leads_Industries_IndustryId"
                            FOREIGN KEY ("IndustryId") REFERENCES "leads"."Industries" ("Id");
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_Clients_Countries_CountryId') THEN
                        ALTER TABLE "leads"."Clients" ADD CONSTRAINT "FK_Clients_Countries_CountryId"
                            FOREIGN KEY ("CountryId") REFERENCES "leads"."Countries" ("Id") ON DELETE CASCADE;
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_Clients_Industries_IndustryId') THEN
                        ALTER TABLE "leads"."Clients" ADD CONSTRAINT "FK_Clients_Industries_IndustryId"
                            FOREIGN KEY ("IndustryId") REFERENCES "leads"."Industries" ("Id");
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""DROP SCHEMA IF EXISTS "lookups" CASCADE;""");

            migrationBuilder.Sql("""
                DELETE FROM "__EFMigrationsHistory"
                WHERE "MigrationId" IN (
                    '20260809163137_LookupsInitial',
                    '20260809165435_LookupsCountryIndustryViews',
                    '20260809170704_RepointCountryIndustryLookup',
                    '20260809171007_RepointCountryIndustryLookup',
                    '20260809171144_RepointCountryLookup',
                    '20260809171611_RepointCountryLookup'
                );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
