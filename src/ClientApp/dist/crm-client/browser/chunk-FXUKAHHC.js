import {
  NotificationApiService
} from "./chunk-T27D5LDS.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-UZR2OOOC.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-DBLRL2R3.js";
import {
  InputText,
  InputTextModule,
  Toast,
  ToastModule
} from "./chunk-MIABMXFE.js";
import {
  Button,
  ButtonModule,
  CheckboxControlValueAccessor,
  CommonModule,
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MessageService,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  forkJoin,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ACBHL573.js";
import "./chunk-WDMUDEB6.js";

// src/app/pages/notifications/components/notification-configuration/notification-configuration.ts
var _c0 = () => ({ standalone: true });
var _c1 = () => [];
var _forTrack0 = ($index, $item) => $item.eventType;
var _forTrack1 = ($index, $item) => $item.value;
function NotificationConfiguration_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1, "Loading notification settings...");
    \u0275\u0275elementEnd();
  }
}
function NotificationConfiguration_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 4)(1, "div", 9)(2, "span", 10);
    \u0275\u0275text(3, "Processor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 11)(9, "div")(10, "span");
    \u0275\u0275text(11, "Current");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "small");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "span");
    \u0275\u0275text(18, "Last Started");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "small");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "span");
    \u0275\u0275text(25, "Last Completed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "strong");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "small");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 12)(31, "span");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p-button", 13);
    \u0275\u0275listener("onClick", function NotificationConfiguration_Conditional_10_Conditional_0_Template_p_button_onClick_33_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.refreshProcessorStatus());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("processor-status-active", ctx_r1.processorStatus.processorEnabled)("processor-status-disabled", !ctx_r1.processorStatus.processorEnabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.processorStatus.processorEnabled ? "Automatic" : "Disabled", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.processorStatus.processorEnabled ? "Runs every " + ctx_r1.processorStatus.processorIntervalMinutes + " minutes" : "Automatic processing is off");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.processorStatus.isRunning ? "Running" : "Idle");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.processorStatus.currentTrigger || "No active run");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatTimestamp(ctx_r1.processorStatus.lastStartedOn));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.processorStatus.lastTrigger || "No run recorded");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatTimestamp(ctx_r1.processorStatus.lastCompletedOn));
    \u0275\u0275advance();
    \u0275\u0275classProp("processor-status-active", ctx_r1.processorStatus.lastSucceeded === true)("processor-status-disabled", ctx_r1.processorStatus.lastSucceeded === false);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.processorStatus.lastSucceeded === null || ctx_r1.processorStatus.lastSucceeded === void 0 ? "No result" : ctx_r1.processorStatus.lastSucceeded ? "Success" : "Failed", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.processorStatus.lastMessage || "Waiting for the first processor run after API startup.");
  }
}
function NotificationConfiguration_Conditional_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function NotificationConfiguration_Conditional_10_For_4_Template_button_click_0_listener() {
      const configuration_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectConfiguration(configuration_r4.eventType));
    });
    \u0275\u0275elementStart(1, "span", 15);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const configuration_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("event-button-active", configuration_r4.eventType === ctx_r1.selectedEventType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(configuration_r4.displayName);
    \u0275\u0275advance();
    \u0275\u0275classProp("event-status-enabled", configuration_r4.isEnabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(configuration_r4.isEnabled ? "Enabled" : "Disabled");
  }
}
function NotificationConfiguration_Conditional_10_Conditional_5_For_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 43);
    \u0275\u0275listener("click", function NotificationConfiguration_Conditional_10_Conditional_5_For_40_Template_button_click_2_listener() {
      const \u0275$index_161_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeInterval(\u0275$index_161_r7));
    });
    \u0275\u0275element(3, "i", 44);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const interval_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", interval_r8.value, " days before ");
  }
}
function NotificationConfiguration_Conditional_10_Conditional_5_For_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate("{" + field_r9 + "}");
  }
}
function NotificationConfiguration_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 17);
    \u0275\u0275listener("ngSubmit", function NotificationConfiguration_Conditional_10_Conditional_5_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(1, "div", 18)(2, "div")(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "label", 19);
    \u0275\u0275element(8, "input", 20);
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Enabled");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 21)(12, "label", 22)(13, "span");
    \u0275\u0275text(14, "Initial Lead Time");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "p-inputnumber", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "label", 22)(17, "span");
    \u0275\u0275text(18, "Overdue Interval");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "p-inputnumber", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "fieldset", 25)(21, "legend");
    \u0275\u0275text(22, "Delivery Channels");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "label", 26);
    \u0275\u0275element(24, "input", 27);
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "In-app notification");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "label", 26);
    \u0275\u0275element(28, "input", 28);
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "Email notification");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "section", 29)(32, "div", 30)(33, "h3");
    \u0275\u0275text(34, "Reminder Offsets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 31)(36, "p-inputnumber", 32);
    \u0275\u0275twoWayListener("ngModelChange", function NotificationConfiguration_Conditional_10_Conditional_5_Template_p_inputnumber_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.intervalToAdd, $event) || (ctx_r1.intervalToAdd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "p-button", 33);
    \u0275\u0275listener("onClick", function NotificationConfiguration_Conditional_10_Conditional_5_Template_p_button_onClick_37_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addInterval());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 34);
    \u0275\u0275repeaterCreate(39, NotificationConfiguration_Conditional_10_Conditional_5_For_40_Template, 4, 1, "span", 35, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "label", 22)(42, "span");
    \u0275\u0275text(43, "Subject Template");
    \u0275\u0275elementEnd();
    \u0275\u0275element(44, "input", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "label", 22)(46, "span");
    \u0275\u0275text(47, "Body Template");
    \u0275\u0275elementEnd();
    \u0275\u0275element(48, "textarea", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "section", 38)(50, "h3");
    \u0275\u0275text(51, "Merge Fields");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 39);
    \u0275\u0275repeaterCreate(53, NotificationConfiguration_Conditional_10_Conditional_5_For_54_Template, 2, 1, "span", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "footer", 40)(56, "p-button", 41);
    \u0275\u0275listener("onClick", function NotificationConfiguration_Conditional_10_Conditional_5_Template_p_button_onClick_56_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(57, "p-button", 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedConfiguration.displayName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.selectedEventMetadata == null ? null : ctx_r1.selectedEventMetadata.description);
    \u0275\u0275advance(9);
    \u0275\u0275property("min", 0);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0);
    \u0275\u0275advance(17);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.intervalToAdd);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(10, _c0))("min", 0);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.reminderIntervals.controls);
    \u0275\u0275advance(14);
    \u0275\u0275repeater((ctx_r1.selectedEventMetadata == null ? null : ctx_r1.selectedEventMetadata.mergeFields) ?? \u0275\u0275pureFunction0(11, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.saving);
  }
}
function NotificationConfiguration_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, NotificationConfiguration_Conditional_10_Conditional_0_Template, 34, 17, "section", 4);
    \u0275\u0275elementStart(1, "div", 5)(2, "aside", 6);
    \u0275\u0275repeaterCreate(3, NotificationConfiguration_Conditional_10_For_4_Template, 5, 6, "button", 7, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, NotificationConfiguration_Conditional_10_Conditional_5_Template, 58, 12, "form", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.processorStatus ? 0 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.configurations);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.selectedConfiguration ? 5 : -1);
  }
}
var NotificationConfiguration = class _NotificationConfiguration {
  notificationApiService;
  messageService;
  fb = inject(FormBuilder);
  configurations = [];
  eventTypes = [];
  processorStatus;
  selectedEventType = "";
  loading = false;
  saving = false;
  processing = false;
  intervalToAdd = null;
  form = this.fb.group({
    isEnabled: [false],
    initialLeadTimeDays: [90, [Validators.required, Validators.min(0)]],
    overdueIntervalDays: [7, [Validators.required, Validators.min(0)]],
    inAppEnabled: [true],
    emailEnabled: [false],
    subjectTemplate: ["", [Validators.required, Validators.maxLength(500)]],
    bodyTemplate: ["", [Validators.required]],
    reminderIntervals: this.fb.array([])
  });
  constructor(notificationApiService, messageService) {
    this.notificationApiService = notificationApiService;
    this.messageService = messageService;
  }
  ngOnInit() {
    this.load();
  }
  get selectedConfiguration() {
    return this.configurations.find((configuration) => configuration.eventType === this.selectedEventType);
  }
  get selectedEventMetadata() {
    return this.eventTypes.find((eventType) => eventType.eventType === this.selectedEventType);
  }
  get reminderIntervals() {
    return this.form.controls.reminderIntervals;
  }
  load() {
    this.loading = true;
    forkJoin({
      configurations: this.notificationApiService.getConfigurations(),
      eventTypes: this.notificationApiService.getEventTypes(),
      processorStatus: this.notificationApiService.getProcessorStatus()
    }).subscribe({
      next: ({ configurations, eventTypes, processorStatus }) => {
        this.configurations = configurations;
        this.eventTypes = eventTypes;
        this.processorStatus = processorStatus;
        this.selectConfiguration(configurations[0]?.eventType ?? "");
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: "error", summary: "Notifications", detail: "Unable to load notification settings." });
      }
    });
  }
  selectConfiguration(eventType) {
    this.selectedEventType = eventType;
    const configuration = this.selectedConfiguration;
    if (!configuration) {
      return;
    }
    this.reminderIntervals.clear();
    for (const interval of configuration.reminderIntervals) {
      this.reminderIntervals.push(new FormControl(interval, { nonNullable: true }));
    }
    this.form.patchValue({
      isEnabled: configuration.isEnabled,
      initialLeadTimeDays: configuration.initialLeadTimeDays,
      overdueIntervalDays: configuration.overdueIntervalDays,
      inAppEnabled: configuration.inAppEnabled,
      emailEnabled: configuration.emailEnabled,
      subjectTemplate: configuration.subjectTemplate,
      bodyTemplate: configuration.bodyTemplate
    });
  }
  addInterval() {
    const value = Number(this.intervalToAdd);
    const leadTime = Number(this.form.controls.initialLeadTimeDays.value ?? 0);
    if (!Number.isInteger(value) || value < 0 || value > leadTime) {
      this.messageService.add({ severity: "warn", summary: "Reminder interval", detail: "Enter a whole number within the lead time." });
      return;
    }
    if (this.reminderIntervals.controls.some((control) => control.value === value)) {
      this.intervalToAdd = null;
      return;
    }
    this.reminderIntervals.push(new FormControl(value, { nonNullable: true }));
    this.sortIntervals();
    this.intervalToAdd = null;
  }
  removeInterval(index) {
    this.reminderIntervals.removeAt(index);
  }
  save() {
    if (this.form.invalid || !this.selectedEventType) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: "warn", summary: "Notifications", detail: "Please complete the required fields." });
      return;
    }
    const values = this.form.getRawValue();
    if (!values.inAppEnabled && !values.emailEnabled) {
      this.messageService.add({ severity: "warn", summary: "Delivery channel", detail: "Select at least one delivery channel." });
      return;
    }
    if (!values.reminderIntervals.length) {
      this.messageService.add({ severity: "warn", summary: "Reminder interval", detail: "Add at least one reminder interval." });
      return;
    }
    const request = {
      isEnabled: values.isEnabled ?? false,
      initialLeadTimeDays: Number(values.initialLeadTimeDays ?? 0),
      overdueIntervalDays: Number(values.overdueIntervalDays ?? 0),
      inAppEnabled: values.inAppEnabled ?? false,
      emailEnabled: values.emailEnabled ?? false,
      subjectTemplate: values.subjectTemplate ?? "",
      bodyTemplate: values.bodyTemplate ?? "",
      reminderIntervals: [...values.reminderIntervals].sort((a, b) => b - a)
    };
    this.saving = true;
    this.notificationApiService.updateConfiguration(this.selectedEventType, request).subscribe({
      next: (updated) => {
        this.configurations = this.configurations.map((configuration) => configuration.eventType === updated.eventType ? updated : configuration);
        this.selectConfiguration(updated.eventType);
        this.saving = false;
        this.messageService.add({ severity: "success", summary: "Notifications", detail: "Notification settings saved." });
      },
      error: () => {
        this.saving = false;
        this.messageService.add({ severity: "error", summary: "Notifications", detail: "Unable to save notification settings." });
      }
    });
  }
  processNow() {
    this.processing = true;
    this.notificationApiService.processDueNotifications().subscribe({
      next: () => {
        this.processing = false;
        this.refreshProcessorStatus();
        this.messageService.add({ severity: "success", summary: "Notifications", detail: "Due notification processing completed." });
      },
      error: () => {
        this.processing = false;
        this.refreshProcessorStatus();
        this.messageService.add({ severity: "error", summary: "Notifications", detail: "Unable to process notifications." });
      }
    });
  }
  refreshProcessorStatus() {
    this.notificationApiService.getProcessorStatus().subscribe({
      next: (status) => {
        this.processorStatus = status;
      }
    });
  }
  formatTimestamp(value) {
    if (!value) {
      return "Not yet";
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }
  sortIntervals() {
    const sorted = this.reminderIntervals.controls.map((control) => control.value).sort((a, b) => b - a);
    this.reminderIntervals.clear();
    for (const interval of sorted) {
      this.reminderIntervals.push(new FormControl(interval, { nonNullable: true }));
    }
  }
  static \u0275fac = function NotificationConfiguration_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationConfiguration)(\u0275\u0275directiveInject(NotificationApiService), \u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotificationConfiguration, selectors: [["app-notification-configuration"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 11, vars: 2, consts: [[1, "notification-page"], [1, "notification-header"], ["label", "Process Now", "icon", "pi pi-send", "severity", "secondary", 3, "onClick", "loading"], [1, "loading-state"], ["aria-label", "Notification processor status", 1, "processor-status"], [1, "notification-layout"], ["aria-label", "Notification events", 1, "event-list"], ["type", "button", 1, "event-button", 3, "event-button-active"], [1, "settings-panel", 3, "formGroup"], [1, "processor-status-main"], [1, "processor-status-label"], [1, "processor-status-grid"], [1, "processor-status-message"], ["icon", "pi pi-refresh", "ariaLabel", "Refresh processor status", "text", "", "severity", "secondary", 3, "onClick"], ["type", "button", 1, "event-button", 3, "click"], [1, "event-title"], [1, "event-status"], [1, "settings-panel", 3, "ngSubmit", "formGroup"], [1, "panel-heading"], [1, "switch-row"], ["type", "checkbox", "formControlName", "isEnabled"], [1, "settings-grid"], [1, "field"], ["formControlName", "initialLeadTimeDays", "suffix", " days", 3, "min"], ["formControlName", "overdueIntervalDays", "suffix", " days", 3, "min"], [1, "channel-group"], [1, "checkbox-row"], ["type", "checkbox", "formControlName", "inAppEnabled"], ["type", "checkbox", "formControlName", "emailEnabled"], [1, "interval-section"], [1, "section-heading"], [1, "interval-input"], ["placeholder", "Days before", 3, "ngModelChange", "ngModel", "ngModelOptions", "min"], ["icon", "pi pi-plus", "ariaLabel", "Add reminder interval", 3, "onClick"], [1, "interval-list"], [1, "interval-chip"], ["pInputText", "", "formControlName", "subjectTemplate"], ["pTextarea", "", "rows", "8", "formControlName", "bodyTemplate"], [1, "merge-fields"], [1, "merge-field-list"], [1, "form-actions"], ["label", "Reload", "icon", "pi pi-refresh", "severity", "secondary", "text", "", "type", "button", 3, "onClick", "disabled"], ["label", "Save Settings", "icon", "pi pi-check", "type", "submit", 3, "loading"], ["type", "button", "aria-label", "Remove reminder interval", 3, "click"], [1, "pi", "pi-times"]], template: function NotificationConfiguration_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "section", 0)(2, "header", 1)(3, "div")(4, "h1");
      \u0275\u0275text(5, "Notification Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p");
      \u0275\u0275text(7, "Configure reminder offsets, delivery channels, and templates for commercial and follow-up events.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "p-button", 2);
      \u0275\u0275listener("onClick", function NotificationConfiguration_Template_p_button_onClick_8_listener() {
        return ctx.processNow();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(9, NotificationConfiguration_Conditional_9_Template, 2, 0, "div", 3)(10, NotificationConfiguration_Conditional_10_Template, 6, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("loading", ctx.processing);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 9 : 10);
    }
  }, dependencies: [ButtonModule, Button, CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, InputNumberModule, InputNumber, InputTextModule, InputText, ReactiveFormsModule, FormGroupDirective, FormControlName, TextareaModule, Textarea, ToastModule, Toast], styles: ["\n\n.notification-page[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.notification-header[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  display: flex;\n  gap: 1rem;\n  justify-content: space-between;\n}\n.notification-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin: 0;\n}\n.notification-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0.35rem 0 0;\n}\n.loading-state[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  padding: 1.5rem;\n}\n.processor-status[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr);\n  padding: 1rem;\n}\n.processor-status-main[_ngcontent-%COMP%], \n.processor-status-grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.processor-status-message[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.processor-status-label[_ngcontent-%COMP%], \n.processor-status-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.78rem;\n  font-weight: 650;\n  text-transform: uppercase;\n}\n.processor-status-main[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.processor-status-grid[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.processor-status-main[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child, \n.processor-status-grid[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.processor-status-message[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n}\n.processor-status-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.processor-status-message[_ngcontent-%COMP%] {\n  align-items: center;\n  border-top: 1px solid var(--surface-border);\n  flex-direction: row;\n  grid-column: 1/-1;\n  justify-content: space-between;\n  padding-top: 0.75rem;\n}\n.processor-status-active[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.processor-status-disabled[_ngcontent-%COMP%] {\n  color: var(--red-500, #ef4444);\n}\n.notification-layout[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);\n}\n.event-list[_ngcontent-%COMP%], \n.settings-panel[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n}\n.event-list[_ngcontent-%COMP%] {\n  align-self: start;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.5rem;\n}\n.event-button[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  background: transparent;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  color: var(--text-color);\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.75rem;\n  text-align: left;\n}\n.event-button[_ngcontent-%COMP%]:hover, \n.event-button-active[_ngcontent-%COMP%] {\n  background: var(--surface-hover);\n  border-color: var(--primary-color);\n}\n.event-title[_ngcontent-%COMP%] {\n  font-weight: 650;\n}\n.event-status[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.8rem;\n}\n.event-status-enabled[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.settings-panel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n}\n.panel-heading[_ngcontent-%COMP%], \n.section-heading[_ngcontent-%COMP%], \n.form-actions[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  display: flex;\n  gap: 1rem;\n  justify-content: space-between;\n}\n.panel-heading[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--surface-border);\n  padding-bottom: 1rem;\n}\n.panel-heading[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin: 0;\n}\n.panel-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0.25rem 0 0;\n}\n.settings-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n}\n.field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  font-weight: 650;\n}\n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   p-inputnumber[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.switch-row[_ngcontent-%COMP%], \n.checkbox-row[_ngcontent-%COMP%] {\n  align-items: center;\n  cursor: pointer;\n  display: inline-flex;\n  gap: 0.5rem;\n  min-height: 2rem;\n}\n.channel-group[_ngcontent-%COMP%] {\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin: 0;\n  padding: 0.75rem 1rem 1rem;\n}\n.channel-group[_ngcontent-%COMP%]   legend[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  font-weight: 650;\n  padding: 0 0.35rem;\n}\n.interval-section[_ngcontent-%COMP%], \n.merge-fields[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.interval-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.merge-fields[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  margin: 0;\n}\n.interval-input[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 0.5rem;\n}\n.interval-list[_ngcontent-%COMP%], \n.merge-field-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.interval-chip[_ngcontent-%COMP%], \n.merge-field-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  align-items: center;\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  display: inline-flex;\n  font-size: 0.85rem;\n  gap: 0.45rem;\n  min-height: 2rem;\n  padding: 0.25rem 0.55rem;\n}\n.interval-chip[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  color: var(--text-color-secondary);\n  cursor: pointer;\n  display: inline-flex;\n  height: 1.5rem;\n  justify-content: center;\n  padding: 0;\n  width: 1.5rem;\n}\n.form-actions[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--surface-border);\n  padding-top: 1rem;\n}\n@media (max-width: 900px) {\n  .notification-header[_ngcontent-%COMP%], \n   .panel-heading[_ngcontent-%COMP%], \n   .section-heading[_ngcontent-%COMP%], \n   .form-actions[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .notification-layout[_ngcontent-%COMP%], \n   .processor-status[_ngcontent-%COMP%], \n   .settings-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .processor-status-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .processor-status-message[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=notification-configuration.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationConfiguration, [{
    type: Component,
    args: [{ selector: "app-notification-configuration", standalone: true, imports: [ButtonModule, CommonModule, FormsModule, InputNumberModule, InputTextModule, ReactiveFormsModule, TextareaModule, ToastModule], providers: [MessageService], template: `<p-toast />\r
\r
<section class="notification-page">\r
    <header class="notification-header">\r
        <div>\r
            <h1>Notification Settings</h1>\r
            <p>Configure reminder offsets, delivery channels, and templates for commercial and follow-up events.</p>\r
        </div>\r
        <p-button label="Process Now" icon="pi pi-send" severity="secondary" [loading]="processing" (onClick)="processNow()" />\r
    </header>\r
\r
    @if (loading) {\r
        <div class="loading-state">Loading notification settings...</div>\r
    } @else {\r
        @if (processorStatus) {\r
            <section class="processor-status" aria-label="Notification processor status">\r
                <div class="processor-status-main">\r
                    <span class="processor-status-label">Processor</span>\r
                    <strong [class.processor-status-active]="processorStatus.processorEnabled" [class.processor-status-disabled]="!processorStatus.processorEnabled">\r
                        {{ processorStatus.processorEnabled ? 'Automatic' : 'Disabled' }}\r
                    </strong>\r
                    <span>{{ processorStatus.processorEnabled ? 'Runs every ' + processorStatus.processorIntervalMinutes + ' minutes' : 'Automatic processing is off' }}</span>\r
                </div>\r
\r
                <div class="processor-status-grid">\r
                    <div>\r
                        <span>Current</span>\r
                        <strong>{{ processorStatus.isRunning ? 'Running' : 'Idle' }}</strong>\r
                        <small>{{ processorStatus.currentTrigger || 'No active run' }}</small>\r
                    </div>\r
                    <div>\r
                        <span>Last Started</span>\r
                        <strong>{{ formatTimestamp(processorStatus.lastStartedOn) }}</strong>\r
                        <small>{{ processorStatus.lastTrigger || 'No run recorded' }}</small>\r
                    </div>\r
                    <div>\r
                        <span>Last Completed</span>\r
                        <strong>{{ formatTimestamp(processorStatus.lastCompletedOn) }}</strong>\r
                        <small [class.processor-status-active]="processorStatus.lastSucceeded === true" [class.processor-status-disabled]="processorStatus.lastSucceeded === false">\r
                            {{ processorStatus.lastSucceeded === null || processorStatus.lastSucceeded === undefined ? 'No result' : processorStatus.lastSucceeded ? 'Success' : 'Failed' }}\r
                        </small>\r
                    </div>\r
                </div>\r
\r
                <div class="processor-status-message">\r
                    <span>{{ processorStatus.lastMessage || 'Waiting for the first processor run after API startup.' }}</span>\r
                    <p-button icon="pi pi-refresh" ariaLabel="Refresh processor status" text severity="secondary" (onClick)="refreshProcessorStatus()" />\r
                </div>\r
            </section>\r
        }\r
\r
        <div class="notification-layout">\r
            <aside class="event-list" aria-label="Notification events">\r
                @for (configuration of configurations; track configuration.eventType) {\r
                    <button type="button" class="event-button" [class.event-button-active]="configuration.eventType === selectedEventType" (click)="selectConfiguration(configuration.eventType)">\r
                        <span class="event-title">{{ configuration.displayName }}</span>\r
                        <span class="event-status" [class.event-status-enabled]="configuration.isEnabled">{{ configuration.isEnabled ? 'Enabled' : 'Disabled' }}</span>\r
                    </button>\r
                }\r
            </aside>\r
\r
            @if (selectedConfiguration) {\r
                <form class="settings-panel" [formGroup]="form" (ngSubmit)="save()">\r
                    <div class="panel-heading">\r
                        <div>\r
                            <h2>{{ selectedConfiguration.displayName }}</h2>\r
                            <p>{{ selectedEventMetadata?.description }}</p>\r
                        </div>\r
                        <label class="switch-row">\r
                            <input type="checkbox" formControlName="isEnabled" />\r
                            <span>Enabled</span>\r
                        </label>\r
                    </div>\r
\r
                    <div class="settings-grid">\r
                        <label class="field">\r
                            <span>Initial Lead Time</span>\r
                            <p-inputnumber formControlName="initialLeadTimeDays" [min]="0" suffix=" days" />\r
                        </label>\r
\r
                        <label class="field">\r
                            <span>Overdue Interval</span>\r
                            <p-inputnumber formControlName="overdueIntervalDays" [min]="0" suffix=" days" />\r
                        </label>\r
                    </div>\r
\r
                    <fieldset class="channel-group">\r
                        <legend>Delivery Channels</legend>\r
                        <label class="checkbox-row">\r
                            <input type="checkbox" formControlName="inAppEnabled" />\r
                            <span>In-app notification</span>\r
                        </label>\r
                        <label class="checkbox-row">\r
                            <input type="checkbox" formControlName="emailEnabled" />\r
                            <span>Email notification</span>\r
                        </label>\r
                    </fieldset>\r
\r
                    <section class="interval-section">\r
                        <div class="section-heading">\r
                            <h3>Reminder Offsets</h3>\r
                            <div class="interval-input">\r
                                <p-inputnumber [(ngModel)]="intervalToAdd" [ngModelOptions]="{ standalone: true }" [min]="0" placeholder="Days before" />\r
                                <p-button icon="pi pi-plus" ariaLabel="Add reminder interval" (onClick)="addInterval()" />\r
                            </div>\r
                        </div>\r
\r
                        <div class="interval-list">\r
                            @for (interval of reminderIntervals.controls; track interval.value; let index = $index) {\r
                                <span class="interval-chip">\r
                                    {{ interval.value }} days before\r
                                    <button type="button" aria-label="Remove reminder interval" (click)="removeInterval(index)">\r
                                        <i class="pi pi-times"></i>\r
                                    </button>\r
                                </span>\r
                            }\r
                        </div>\r
                    </section>\r
\r
                    <label class="field">\r
                        <span>Subject Template</span>\r
                        <input pInputText formControlName="subjectTemplate" />\r
                    </label>\r
\r
                    <label class="field">\r
                        <span>Body Template</span>\r
                        <textarea pTextarea rows="8" formControlName="bodyTemplate"></textarea>\r
                    </label>\r
\r
                    <section class="merge-fields">\r
                        <h3>Merge Fields</h3>\r
                        <div class="merge-field-list">\r
                            @for (field of selectedEventMetadata?.mergeFields ?? []; track field) {\r
                                <span>{{ '{' + field + '}' }}</span>\r
                            }\r
                        </div>\r
                    </section>\r
\r
                    <footer class="form-actions">\r
                        <p-button label="Reload" icon="pi pi-refresh" severity="secondary" text type="button" [disabled]="saving" (onClick)="load()" />\r
                        <p-button label="Save Settings" icon="pi pi-check" type="submit" [loading]="saving" />\r
                    </footer>\r
                </form>\r
            }\r
        </div>\r
    }\r
</section>\r
`, styles: ["/* src/app/pages/notifications/components/notification-configuration/notification-configuration.scss */\n.notification-page {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.notification-header {\n  align-items: flex-start;\n  display: flex;\n  gap: 1rem;\n  justify-content: space-between;\n}\n.notification-header h1 {\n  font-size: 1.5rem;\n  font-weight: 700;\n  margin: 0;\n}\n.notification-header p {\n  color: var(--text-color-secondary);\n  margin: 0.35rem 0 0;\n}\n.loading-state {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  padding: 1.5rem;\n}\n.processor-status {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr);\n  padding: 1rem;\n}\n.processor-status-main,\n.processor-status-grid > div,\n.processor-status-message {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.processor-status-label,\n.processor-status-grid span {\n  color: var(--text-color-secondary);\n  font-size: 0.78rem;\n  font-weight: 650;\n  text-transform: uppercase;\n}\n.processor-status-main strong,\n.processor-status-grid strong {\n  font-size: 0.95rem;\n}\n.processor-status-main > span:last-child,\n.processor-status-grid small,\n.processor-status-message span {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n}\n.processor-status-grid {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.processor-status-message {\n  align-items: center;\n  border-top: 1px solid var(--surface-border);\n  flex-direction: row;\n  grid-column: 1/-1;\n  justify-content: space-between;\n  padding-top: 0.75rem;\n}\n.processor-status-active {\n  color: var(--green-600);\n}\n.processor-status-disabled {\n  color: var(--red-500, #ef4444);\n}\n.notification-layout {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);\n}\n.event-list,\n.settings-panel {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n}\n.event-list {\n  align-self: start;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.5rem;\n}\n.event-button {\n  align-items: flex-start;\n  background: transparent;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  color: var(--text-color);\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.75rem;\n  text-align: left;\n}\n.event-button:hover,\n.event-button-active {\n  background: var(--surface-hover);\n  border-color: var(--primary-color);\n}\n.event-title {\n  font-weight: 650;\n}\n.event-status {\n  color: var(--text-color-secondary);\n  font-size: 0.8rem;\n}\n.event-status-enabled {\n  color: var(--green-600);\n}\n.settings-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n}\n.panel-heading,\n.section-heading,\n.form-actions {\n  align-items: flex-start;\n  display: flex;\n  gap: 1rem;\n  justify-content: space-between;\n}\n.panel-heading {\n  border-bottom: 1px solid var(--surface-border);\n  padding-bottom: 1rem;\n}\n.panel-heading h2 {\n  font-size: 1.2rem;\n  margin: 0;\n}\n.panel-heading p {\n  color: var(--text-color-secondary);\n  margin: 0.25rem 0 0;\n}\n.settings-grid {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n}\n.field > span {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  font-weight: 650;\n}\n.field textarea,\n.field input,\n.field p-inputnumber {\n  width: 100%;\n}\n.switch-row,\n.checkbox-row {\n  align-items: center;\n  cursor: pointer;\n  display: inline-flex;\n  gap: 0.5rem;\n  min-height: 2rem;\n}\n.channel-group {\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin: 0;\n  padding: 0.75rem 1rem 1rem;\n}\n.channel-group legend {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  font-weight: 650;\n  padding: 0 0.35rem;\n}\n.interval-section,\n.merge-fields {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.interval-section h3,\n.merge-fields h3 {\n  font-size: 1rem;\n  margin: 0;\n}\n.interval-input {\n  align-items: center;\n  display: flex;\n  gap: 0.5rem;\n}\n.interval-list,\n.merge-field-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.interval-chip,\n.merge-field-list span {\n  align-items: center;\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  display: inline-flex;\n  font-size: 0.85rem;\n  gap: 0.45rem;\n  min-height: 2rem;\n  padding: 0.25rem 0.55rem;\n}\n.interval-chip button {\n  align-items: center;\n  background: transparent;\n  border: 0;\n  color: var(--text-color-secondary);\n  cursor: pointer;\n  display: inline-flex;\n  height: 1.5rem;\n  justify-content: center;\n  padding: 0;\n  width: 1.5rem;\n}\n.form-actions {\n  border-top: 1px solid var(--surface-border);\n  padding-top: 1rem;\n}\n@media (max-width: 900px) {\n  .notification-header,\n  .panel-heading,\n  .section-heading,\n  .form-actions {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .notification-layout,\n  .processor-status,\n  .settings-grid {\n    grid-template-columns: 1fr;\n  }\n  .processor-status-grid {\n    grid-template-columns: 1fr;\n  }\n  .processor-status-message {\n    align-items: stretch;\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=notification-configuration.css.map */\n"] }]
  }], () => [{ type: NotificationApiService }, { type: MessageService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationConfiguration, { className: "NotificationConfiguration", filePath: "src/app/pages/notifications/components/notification-configuration/notification-configuration.ts", lineNumber: 24 });
})();

// src/app/pages/notifications/notifications.routes.ts
var notifications_routes_default = [
  {
    path: "",
    component: NotificationConfiguration
  }
];
export {
  notifications_routes_default as default
};
//# sourceMappingURL=chunk-FXUKAHHC.js.map
