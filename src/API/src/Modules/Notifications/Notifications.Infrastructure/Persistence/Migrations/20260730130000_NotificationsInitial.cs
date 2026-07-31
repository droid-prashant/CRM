using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Notifications.Infrastructure.Persistence.Migrations
{
    public partial class NotificationsInitial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "notifications");

            migrationBuilder.Sql(@"
CREATE TABLE IF NOT EXISTS ""notifications"".""NotificationConfigurations"" (
    ""Id"" uuid NOT NULL,
    ""EventType"" character varying(80) NOT NULL,
    ""DisplayName"" character varying(150) NOT NULL,
    ""IsEnabled"" boolean NOT NULL,
    ""InitialLeadTimeDays"" integer NOT NULL,
    ""OverdueIntervalDays"" integer NOT NULL,
    ""InAppEnabled"" boolean NOT NULL,
    ""EmailEnabled"" boolean NOT NULL,
    ""SubjectTemplate"" character varying(500) NOT NULL,
    ""BodyTemplate"" text NOT NULL,
    ""CreatedBy"" uuid NOT NULL,
    ""CreatedOn"" timestamp with time zone NOT NULL,
    ""UpdatedBy"" uuid NULL,
    ""UpdatedOn"" timestamp with time zone NULL,
    ""IsActive"" boolean NOT NULL,
    CONSTRAINT ""PK_NotificationConfigurations"" PRIMARY KEY (""Id"")
);

CREATE TABLE IF NOT EXISTS ""notifications"".""NotificationReminderIntervals"" (
    ""Id"" uuid NOT NULL,
    ""ConfigurationId"" uuid NOT NULL,
    ""DaysBeforeDue"" integer NOT NULL,
    ""CreatedBy"" uuid NOT NULL,
    ""CreatedOn"" timestamp with time zone NOT NULL,
    ""UpdatedBy"" uuid NULL,
    ""UpdatedOn"" timestamp with time zone NULL,
    ""IsActive"" boolean NOT NULL,
    CONSTRAINT ""PK_NotificationReminderIntervals"" PRIMARY KEY (""Id"")
);

CREATE TABLE IF NOT EXISTS ""notifications"".""InAppNotifications"" (
    ""Id"" uuid NOT NULL,
    ""RecipientUserId"" uuid NOT NULL,
    ""Title"" character varying(300) NOT NULL,
    ""Message"" text NOT NULL,
    ""EventType"" character varying(80) NOT NULL,
    ""SourceRecordType"" character varying(80) NOT NULL,
    ""SourceRecordId"" uuid NOT NULL,
    ""SourceDueDate"" timestamp with time zone NOT NULL,
    ""RelatedUrl"" character varying(500) NULL,
    ""IsRead"" boolean NOT NULL,
    ""ReadOn"" timestamp with time zone NULL,
    ""CreatedBy"" uuid NOT NULL,
    ""CreatedOn"" timestamp with time zone NOT NULL,
    ""UpdatedBy"" uuid NULL,
    ""UpdatedOn"" timestamp with time zone NULL,
    ""IsActive"" boolean NOT NULL,
    CONSTRAINT ""PK_InAppNotifications"" PRIMARY KEY (""Id"")
);

CREATE TABLE IF NOT EXISTS ""notifications"".""NotificationDeliveryLogs"" (
    ""Id"" uuid NOT NULL,
    ""EventType"" character varying(80) NOT NULL,
    ""SourceRecordType"" character varying(80) NOT NULL,
    ""SourceRecordId"" uuid NOT NULL,
    ""SourceDueDate"" timestamp with time zone NOT NULL,
    ""ReminderKey"" character varying(80) NOT NULL,
    ""Channel"" character varying(30) NOT NULL,
    ""RecipientUserId"" uuid NOT NULL,
    ""RecipientEmail"" character varying(320) NULL,
    ""Status"" character varying(30) NOT NULL,
    ""ErrorMessage"" character varying(2000) NULL,
    ""SentOn"" timestamp with time zone NULL,
    ""AttemptCount"" integer NOT NULL,
    ""CreatedBy"" uuid NOT NULL,
    ""CreatedOn"" timestamp with time zone NOT NULL,
    ""UpdatedBy"" uuid NULL,
    ""UpdatedOn"" timestamp with time zone NULL,
    ""IsActive"" boolean NOT NULL,
    CONSTRAINT ""PK_NotificationDeliveryLogs"" PRIMARY KEY (""Id"")
);

CREATE TABLE IF NOT EXISTS ""notifications"".""NotificationResolutions"" (
    ""Id"" uuid NOT NULL,
    ""EventType"" character varying(80) NOT NULL,
    ""SourceRecordType"" character varying(80) NOT NULL,
    ""SourceRecordId"" uuid NOT NULL,
    ""SourceDueDate"" timestamp with time zone NOT NULL,
    ""IsResolved"" boolean NOT NULL,
    ""ResolvedOn"" timestamp with time zone NULL,
    ""ResolvedByUserId"" uuid NULL,
    ""ResolutionRemarks"" character varying(1000) NULL,
    ""CreatedBy"" uuid NOT NULL,
    ""CreatedOn"" timestamp with time zone NOT NULL,
    ""UpdatedBy"" uuid NULL,
    ""UpdatedOn"" timestamp with time zone NULL,
    ""IsActive"" boolean NOT NULL,
    CONSTRAINT ""PK_NotificationResolutions"" PRIMARY KEY (""Id"")
);

CREATE UNIQUE INDEX IF NOT EXISTS ""IX_NotificationConfigurations_EventType""
    ON ""notifications"".""NotificationConfigurations"" (""EventType"");
CREATE UNIQUE INDEX IF NOT EXISTS ""IX_NotificationReminderIntervals_Config_DaysBefore""
    ON ""notifications"".""NotificationReminderIntervals"" (""ConfigurationId"", ""DaysBeforeDue"");
CREATE INDEX IF NOT EXISTS ""IX_InAppNotifications_RecipientUserId_IsRead_CreatedOn""
    ON ""notifications"".""InAppNotifications"" (""RecipientUserId"", ""IsRead"", ""CreatedOn"");
CREATE INDEX IF NOT EXISTS ""IX_InAppNotifications_Event_Source""
    ON ""notifications"".""InAppNotifications"" (""EventType"", ""SourceRecordType"", ""SourceRecordId"", ""SourceDueDate"");

WITH ranked_delivery_logs AS (
    SELECT
        ""Id"",
        row_number() OVER (
            PARTITION BY ""EventType"", ""SourceRecordType"", ""SourceRecordId"", ""SourceDueDate"", ""ReminderKey"", ""Channel"", ""RecipientUserId""
            ORDER BY
                CASE WHEN ""Status"" IN ('Sent', 'AcceptedBySmtp') THEN 0 ELSE 1 END,
                COALESCE(""SentOn"", ""UpdatedOn"", ""CreatedOn"") DESC,
                ""Id""
        ) AS duplicate_rank
    FROM ""notifications"".""NotificationDeliveryLogs""
    WHERE ""IsActive"" = true
)
UPDATE ""notifications"".""NotificationDeliveryLogs"" logs
SET ""IsActive"" = false,
    ""UpdatedOn"" = now(),
    ""UpdatedBy"" = '00000000-0000-0000-0000-000000000000'
FROM ranked_delivery_logs ranked
WHERE logs.""Id"" = ranked.""Id""
    AND ranked.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS ""UX_NotificationDeliveryLogs_DeliveryKey""
    ON ""notifications"".""NotificationDeliveryLogs"" (""EventType"", ""SourceRecordType"", ""SourceRecordId"", ""SourceDueDate"", ""ReminderKey"", ""Channel"", ""RecipientUserId"")
    WHERE ""IsActive"" = true;
CREATE INDEX IF NOT EXISTS ""IX_NotificationDeliveryLogs_Channel_Status_CreatedOn""
    ON ""notifications"".""NotificationDeliveryLogs"" (""Channel"", ""Status"", ""CreatedOn"");
CREATE INDEX IF NOT EXISTS ""IX_NotificationResolutions_Event_Source_Resolved""
    ON ""notifications"".""NotificationResolutions"" (""EventType"", ""SourceRecordType"", ""SourceRecordId"", ""SourceDueDate"", ""IsResolved"");

IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_NotificationReminderIntervals_NotificationConfigurations_ConfigurationId') THEN
    ALTER TABLE ""notifications"".""NotificationReminderIntervals""
    ADD CONSTRAINT ""FK_NotificationReminderIntervals_NotificationConfigurations_ConfigurationId""
    FOREIGN KEY (""ConfigurationId"") REFERENCES ""notifications"".""NotificationConfigurations"" (""Id"") ON DELETE CASCADE;
END IF;

DO $seed$
DECLARE
    created_on timestamp with time zone := TIMESTAMPTZ '2026-07-30 00:00:00+00';
BEGIN
    INSERT INTO ""notifications"".""NotificationConfigurations""
        (""Id"", ""EventType"", ""DisplayName"", ""IsEnabled"", ""InitialLeadTimeDays"", ""OverdueIntervalDays"", ""InAppEnabled"", ""EmailEnabled"", ""SubjectTemplate"", ""BodyTemplate"", ""CreatedBy"", ""CreatedOn"", ""IsActive"")
    VALUES
        ('00000000-0000-0000-0001-000000000001', 'AgreementExpiry', 'Agreement Expiry', false, 90, 7, true, false, 'Agreement for {CustomerName} expires on {DueDate}.', 'Agreement for {CustomerName} linked to opportunity {OpportunityNumber} expires on {DueDate}. Please complete renewal or mark it resolved.', '00000000-0000-0000-0000-000000000000', created_on, true),
        ('00000000-0000-0000-0001-000000000002', 'AmcRenewal', 'AMC Renewal', false, 90, 7, true, false, 'AMC renewal for {CustomerName} is due on {DueDate}.', 'AMC renewal for {CustomerName} linked to opportunity {OpportunityNumber} is due on {DueDate}. Amount: {Amount}.', '00000000-0000-0000-0000-000000000000', created_on, true),
        ('00000000-0000-0000-0001-000000000003', 'AmcExpiry', 'AMC Expiry', false, 90, 7, true, false, 'AMC for {CustomerName} expires on {DueDate}.', 'AMC for {CustomerName} linked to opportunity {OpportunityNumber} expires on {DueDate}. Please complete renewal or mark it resolved.', '00000000-0000-0000-0000-000000000000', created_on, true),
        ('00000000-0000-0000-0001-000000000004', 'SubscriptionBilling', 'Subscription Billing', false, 90, 7, true, false, 'Subscription billing for {CustomerName} is due on {DueDate}.', 'Subscription billing for {CustomerName} linked to opportunity {OpportunityNumber} is due on {DueDate}. Amount: {Amount}.', '00000000-0000-0000-0000-000000000000', created_on, true),
        ('00000000-0000-0000-0001-000000000005', 'LeadFollowUp', 'Lead Follow-up', false, 90, 7, true, false, 'Lead follow-up for {CustomerName} is due on {DueDate}.', 'Lead {LeadNumber} follow-up for {CustomerName} is due on {DueDate}. Last note: {Notes}.', '00000000-0000-0000-0000-000000000000', created_on, true),
        ('00000000-0000-0000-0001-000000000006', 'OpportunityFollowUp', 'Opportunity Follow-up', false, 90, 7, true, false, 'Opportunity follow-up for {CustomerName} is due on {DueDate}.', 'Opportunity {OpportunityNumber} follow-up for {CustomerName} is due on {DueDate}. Last note: {Notes}.', '00000000-0000-0000-0000-000000000000', created_on, true)
    ON CONFLICT (""EventType"") DO NOTHING;

    INSERT INTO ""notifications"".""NotificationReminderIntervals""
        (""Id"", ""ConfigurationId"", ""DaysBeforeDue"", ""CreatedBy"", ""CreatedOn"", ""IsActive"")
    SELECT ('00000000-0000-0000-0002-' || lpad(((cfg.""SeedOrdinal"" * 1000) + d.""DaysBeforeDue"")::text, 12, '0'))::uuid, c.""Id"", d.""DaysBeforeDue"", '00000000-0000-0000-0000-000000000000', created_on, true
    FROM ""notifications"".""NotificationConfigurations"" c
    INNER JOIN (
        VALUES
            ('AgreementExpiry', 1),
            ('AmcRenewal', 2),
            ('AmcExpiry', 3),
            ('SubscriptionBilling', 4),
            ('LeadFollowUp', 5),
            ('OpportunityFollowUp', 6)
    ) AS cfg(""EventType"", ""SeedOrdinal"") ON cfg.""EventType"" = c.""EventType""
    CROSS JOIN (VALUES (90), (60), (30), (7)) AS d(""DaysBeforeDue"")
    ON CONFLICT (""ConfigurationId"", ""DaysBeforeDue"") DO NOTHING;
END
$seed$;
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "InAppNotifications", schema: "notifications");
            migrationBuilder.DropTable(name: "NotificationDeliveryLogs", schema: "notifications");
            migrationBuilder.DropTable(name: "NotificationReminderIntervals", schema: "notifications");
            migrationBuilder.DropTable(name: "NotificationResolutions", schema: "notifications");
            migrationBuilder.DropTable(name: "NotificationConfigurations", schema: "notifications");
        }
    }
}
