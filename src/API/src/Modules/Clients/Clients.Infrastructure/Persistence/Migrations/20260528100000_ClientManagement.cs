using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ClientsDbContext))]
    [Migration("20260528100000_ClientManagement")]
    public partial class ClientManagement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "clients");

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS "clients"."ClientTypes" (
                    "Id" uuid NOT NULL,
                    "Code" character varying(50) NOT NULL,
                    "Name" character varying(150) NOT NULL,
                    "CreatedBy" uuid NOT NULL,
                    "CreatedOn" timestamp with time zone NOT NULL,
                    "UpdatedBy" uuid NULL,
                    "UpdatedOn" timestamp with time zone NULL,
                    "IsActive" boolean NOT NULL DEFAULT true,
                    CONSTRAINT "PK_ClientTypes" PRIMARY KEY ("Id")
                );

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_ClientTypes_Code"
                    ON "clients"."ClientTypes" ("Code");

                INSERT INTO "clients"."ClientTypes" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('81000000-0000-0000-0000-000000000001', 'ENTERPRISE', 'Enterprise', '00000000-0000-0000-0000-000000000000', NOW(), true),
                    ('81000000-0000-0000-0000-000000000002', 'SMB', 'Small and Medium Business', '00000000-0000-0000-0000-000000000000', NOW(), true),
                    ('81000000-0000-0000-0000-000000000003', 'GOVERNMENT', 'Government', '00000000-0000-0000-0000-000000000000', NOW(), true),
                    ('81000000-0000-0000-0000-000000000004', 'NON_PROFIT', 'Non Profit', '00000000-0000-0000-0000-000000000000', NOW(), true),
                    ('81000000-0000-0000-0000-000000000005', 'OTHER', 'Other', '00000000-0000-0000-0000-000000000000', NOW(), true)
                ON CONFLICT ("Id") DO NOTHING;

                CREATE TABLE IF NOT EXISTS "clients"."Clients" (
                    "Id" uuid NOT NULL,
                    "ClientCode" character varying(50) NOT NULL,
                    "Name" character varying(250) NOT NULL,
                    "NormalizedName" character varying(250) NOT NULL,
                    "ShortName" character varying(100) NULL,
                    "ClientTypeId" uuid NULL,
                    "IndustryId" uuid NULL,
                    "CountryId" uuid NOT NULL,
                    "Address" character varying(500) NULL,
                    "Website" character varying(250) NULL,
                    "TaxNumber" character varying(100) NULL,
                    "RegistrationNumber" character varying(100) NULL,
                    "AccountOwnerUserId" uuid NULL,
                    "Notes" character varying(2000) NULL,
                    "Status" integer NOT NULL DEFAULT 1,
                    "IsDeleted" boolean NOT NULL DEFAULT false,
                    "CreatedBy" uuid NOT NULL,
                    "CreatedOn" timestamp with time zone NOT NULL,
                    "UpdatedBy" uuid NULL,
                    "UpdatedOn" timestamp with time zone NULL,
                    "IsActive" boolean NOT NULL DEFAULT true,
                    CONSTRAINT "PK_Clients" PRIMARY KEY ("Id"),
                    CONSTRAINT "FK_Clients_ClientTypes_ClientTypeId" FOREIGN KEY ("ClientTypeId") REFERENCES "clients"."ClientTypes" ("Id") ON DELETE RESTRICT
                );

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Clients_ClientCode"
                    ON "clients"."Clients" ("ClientCode");

                CREATE INDEX IF NOT EXISTS "IX_Clients_NormalizedName_CountryId"
                    ON "clients"."Clients" ("NormalizedName", "CountryId");

                CREATE INDEX IF NOT EXISTS "IX_Clients_AccountOwnerUserId"
                    ON "clients"."Clients" ("AccountOwnerUserId");

                CREATE INDEX IF NOT EXISTS "IX_Clients_IsActive_IsDeleted"
                    ON "clients"."Clients" ("IsActive", "IsDeleted");

                CREATE TABLE IF NOT EXISTS "clients"."ClientTimelineEntries" (
                    "Id" uuid NOT NULL,
                    "ClientId" uuid NOT NULL,
                    "EventType" character varying(100) NOT NULL,
                    "Description" character varying(1000) NOT NULL,
                    "CreatedBy" uuid NOT NULL,
                    "CreatedOn" timestamp with time zone NOT NULL,
                    "UpdatedBy" uuid NULL,
                    "UpdatedOn" timestamp with time zone NULL,
                    "IsActive" boolean NOT NULL DEFAULT true,
                    CONSTRAINT "PK_ClientTimelineEntries" PRIMARY KEY ("Id"),
                    CONSTRAINT "FK_ClientTimelineEntries_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "clients"."Clients" ("Id") ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS "IX_ClientTimelineEntries_ClientId_CreatedOn"
                    ON "clients"."ClientTimelineEntries" ("ClientId", "CreatedOn");
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP TABLE IF EXISTS "clients"."ClientTimelineEntries";
                DROP TABLE IF EXISTS "clients"."Clients";
                DROP TABLE IF EXISTS "clients"."ClientTypes";
                DROP SCHEMA IF EXISTS "clients";
                """);
        }
    }
}
