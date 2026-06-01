using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ClientsDbContext))]
    [Migration("20260528120000_ClientContacts")]
    public partial class ClientContacts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS "clients"."ClientContacts" (
                    "Id" uuid NOT NULL,
                    "ClientId" uuid NOT NULL,
                    "FirstName" character varying(100) NOT NULL,
                    "LastName" character varying(100) NOT NULL,
                    "FullName" character varying(250) NOT NULL,
                    "Designation" character varying(150) NULL,
                    "Department" character varying(150) NULL,
                    "Email" character varying(320) NULL,
                    "NormalizedEmail" character varying(320) NULL,
                    "Phone" character varying(50) NULL,
                    "Mobile" character varying(50) NULL,
                    "IsPrimary" boolean NOT NULL DEFAULT false,
                    "Status" integer NOT NULL DEFAULT 1,
                    "Notes" character varying(1000) NULL,
                    "IsDeleted" boolean NOT NULL DEFAULT false,
                    "CreatedBy" uuid NOT NULL,
                    "CreatedOn" timestamp with time zone NOT NULL,
                    "UpdatedBy" uuid NULL,
                    "UpdatedOn" timestamp with time zone NULL,
                    "IsActive" boolean NOT NULL DEFAULT true,
                    CONSTRAINT "PK_ClientContacts" PRIMARY KEY ("Id"),
                    CONSTRAINT "FK_ClientContacts_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "clients"."Clients" ("Id") ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS "IX_ClientContacts_ClientId"
                    ON "clients"."ClientContacts" ("ClientId");

                CREATE INDEX IF NOT EXISTS "IX_ClientContacts_ClientId_IsActive_IsDeleted"
                    ON "clients"."ClientContacts" ("ClientId", "IsActive", "IsDeleted");

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_ClientContacts_ClientId_NormalizedEmail"
                    ON "clients"."ClientContacts" ("ClientId", "NormalizedEmail")
                    WHERE "NormalizedEmail" IS NOT NULL AND "IsDeleted" = false;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP TABLE IF EXISTS "clients"."ClientContacts";
                """);
        }
    }
}
