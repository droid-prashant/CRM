import {
  NEPAL_CONTACT_NUMBER_MESSAGE,
  NEPAL_CONTACT_NUMBER_PATTERN
} from "./chunk-DH3WPG22.js";
import {
  Crud
} from "./chunk-QQ453JL3.js";
import "./chunk-UZR2OOOC.js";
import {
  Permissions
} from "./chunk-COJCLJYA.js";
import "./chunk-ZBJQJW6L.js";
import {
  AuthService,
  permissionGuard
} from "./chunk-CPXJEDC2.js";
import "./chunk-DBLRL2R3.js";
import {
  Toast,
  ToastModule
} from "./chunk-MIABMXFE.js";
import {
  HttpClient,
  MessageService,
  apiUrl
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  Injectable,
  forkJoin,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView
} from "./chunk-ACBHL573.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/partners/config/partner-columns.config.ts
var PartnerColumns = [
  { field: "name", header: "Partner", type: "text", width: "220px", sortable: true },
  { field: "partnerTypeName", header: "Type", type: "text", width: "160px", sortable: true },
  { field: "countryName", header: "Country", type: "text", width: "160px", sortable: true },
  { field: "contactPerson", header: "Contact", type: "text", width: "180px", sortable: true },
  { field: "phoneNumber", header: "Phone", type: "text", width: "160px", sortable: false },
  { field: "email", header: "Email", type: "email", width: "220px", sortable: true },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: true }
];

// src/app/pages/partners/config/partner-fields.config.ts
var partnerTypeCapabilities = {
  RESELLER: { canOwnProducts: false, canSellInHouseProducts: true },
  VENDOR: { canOwnProducts: true, canSellInHouseProducts: false },
  SUPPLIER: { canOwnProducts: true, canSellInHouseProducts: false },
  AFFILIATE: { canOwnProducts: false, canSellInHouseProducts: false },
  SALES_AGENT: { canOwnProducts: false, canSellInHouseProducts: true },
  CONSULTANT: { canOwnProducts: false, canSellInHouseProducts: false },
  TECHNOLOGY_PARTNER: { canOwnProducts: true, canSellInHouseProducts: false },
  IMPLEMENTATION_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
  SERVICE_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
  STRATEGIC_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
  OTHER: { canOwnProducts: false, canSellInHouseProducts: false }
};
var normalizePartnerTypeCode = (value) => String(value ?? "").trim().replace(/-/g, "_").toUpperCase();
function buildPartnerFields(options) {
  const canOwnProducts = (formValue) => {
    const partnerType = options.partnerTypes.find((item) => item.value === formValue["partnerTypeId"]);
    const code = normalizePartnerTypeCode(partnerType?.code ?? partnerType?.label);
    return partnerType?.canOwnProducts === true || partnerTypeCapabilities[code]?.canOwnProducts === true;
  };
  return [
    { key: "name", label: "Partner Name", type: "text", required: true, colSpan: 4, section: "Partner", placeholder: "Partner organization or individual" },
    { key: "partnerTypeId", label: "Partner Type", type: "select", required: true, options: options.partnerTypes, colSpan: 4, section: "Partner", placeholder: "Select partner type" },
    { key: "countryId", label: "Country", type: "select", required: true, options: options.countries, colSpan: 4, section: "Partner", placeholder: "Select country" },
    { key: "productIds", label: "Owned Products", type: "multiSelect", options: options.products, colSpan: 12, section: "Products", placeholder: "Select partner-owned products", visibleWhen: canOwnProducts, clearWhenHidden: true },
    { key: "contactPerson", label: "Contact Person", type: "text", colSpan: 4, section: "Contact", placeholder: "Primary contact" },
    {
      key: "phoneNumber",
      label: "Phone Number",
      type: "text",
      colSpan: 4,
      section: "Contact",
      placeholder: "10 digit contact number",
      pattern: NEPAL_CONTACT_NUMBER_PATTERN,
      patternMessage: NEPAL_CONTACT_NUMBER_MESSAGE,
      digitsOnly: true,
      maxLength: 10,
      inputMode: "numeric"
    },
    { key: "email", label: "Email", type: "email", colSpan: 4, section: "Contact", placeholder: "name@example.com" },
    { key: "address", label: "Address", type: "textarea", colSpan: 6, section: "Additional Details" },
    { key: "remarks", label: "Remarks", type: "textarea", colSpan: 6, section: "Additional Details" },
    { key: "isActive", label: "Active", type: "checkbox", colSpan: 12, section: "Status", defaultValue: true, visibleOn: "update" }
  ];
}

// src/app/pages/partners/services/partner-api.service.ts
var PartnerApiService = class _PartnerApiService {
  http;
  partnersUrl = apiUrl("/partners");
  constructor(http) {
    this.http = http;
  }
  getPartners() {
    return this.http.get(this.partnersUrl);
  }
  getPartner(id) {
    return this.http.get(`${this.partnersUrl}/${id}`);
  }
  getLookups() {
    return this.http.get(`${this.partnersUrl}/lookups`);
  }
  createPartner(request) {
    return this.http.post(this.partnersUrl, request);
  }
  updatePartner(id, request) {
    return this.http.put(`${this.partnersUrl}/${id}`, request);
  }
  activatePartner(id) {
    return this.http.patch(`${this.partnersUrl}/${id}/activate`, {});
  }
  deactivatePartner(id) {
    return this.http.patch(`${this.partnersUrl}/${id}/deactivate`, {});
  }
  static \u0275fac = function PartnerApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PartnerApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PartnerApiService, factory: _PartnerApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PartnerApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/partners/components/partner-list/partner-list.ts
function PartnerList_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 2);
    \u0275\u0275listener("save", function PartnerList_Conditional_1_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.savePartner($event));
    })("delete", function PartnerList_Conditional_1_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePartnerStatus($event));
    })("bulkDelete", function PartnerList_Conditional_1_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deactivatePartners($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r1.columns)("data", ctx_r1.data)("fields", ctx_r1.fields)("title", ctx_r1.title)("dataNotFound", ctx_r1.dataNotFound)("errorMessage", ctx_r1.errorMessage)("bulkActionLabel", ctx_r1.bulkActionLabel)("rowActionLabel", ctx_r1.rowActionLabel)("rowActionIcon", ctx_r1.rowActionIcon)("rowActionLabelResolver", ctx_r1.rowActionLabelResolver)("rowActionIconResolver", ctx_r1.rowActionIconResolver)("canCreate", ctx_r1.canCreate)("canEdit", ctx_r1.canEdit)("canRowAction", ctx_r1.canDelete || ctx_r1.canEdit)("canBulkAction", ctx_r1.canDelete)("canExport", ctx_r1.canExport)("enableViewAction", false);
  }
}
var partnerTypeOrder = /* @__PURE__ */ new Map([
  ["RESELLER", 10],
  ["VENDOR", 20],
  ["SUPPLIER", 30],
  ["SALES_AGENT", 40],
  ["AFFILIATE", 50],
  ["CONSULTANT", 60],
  ["TECHNOLOGY_PARTNER", 70],
  ["IMPLEMENTATION_PARTNER", 80],
  ["SERVICE_PARTNER", 90],
  ["STRATEGIC_PARTNER", 100],
  ["OTHER", 110]
]);
var PartnerList = class _PartnerList {
  partnerApiService;
  messageService;
  authService;
  title = "Partner";
  columns = PartnerColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No partners found.";
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  bulkActionLabel = "Deactivate";
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  constructor(partnerApiService, messageService, authService) {
    this.partnerApiService = partnerApiService;
    this.messageService = messageService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.partners.create);
    this.canEdit = this.authService.hasPermission(Permissions.partners.edit);
    this.canDelete = this.authService.hasPermission(Permissions.partners.delete);
    this.canExport = this.authService.hasPermission(Permissions.partners.export);
    this.loadPage();
  }
  savePartner(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.partnerApiService.createPartner(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Partner created", detail: "The partner was created successfully.", life: 3e3 });
          this.loadPartners();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Partner id is missing.", life: 4e3 });
      return;
    }
    this.partnerApiService.updatePartner(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Partner updated", detail: "The partner was updated successfully.", life: 3e3 });
        this.loadPartners();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  togglePartnerStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "Partner id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.partnerApiService.deactivatePartner(id) : this.partnerApiService.activatePartner(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Partner ${action}`, detail: `The partner was ${action} successfully.`, life: 3e3 });
        this.loadPartners();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivatePartners(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active partners", detail: "The selected partners are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.partnerApiService.deactivatePartner(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Partners deactivated", detail: `${activeIds.length} partner(s) were deactivated.`, life: 3e3 });
        this.loadPartners();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  loadPage() {
    this.isLoading = true;
    this.partnerApiService.getLookups().subscribe({
      next: (lookups) => {
        this.fields = buildPartnerFields({
          partnerTypes: this.toPartnerTypeOptions(lookups.partnerTypes),
          countries: this.toOptions(lookups.countries),
          products: this.toOptions(lookups.products)
        });
        this.loadPartners();
      },
      error: () => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = "Unable to load partner lookups.";
      }
    });
  }
  loadPartners() {
    this.partnerApiService.getPartners().subscribe({
      next: (partners) => {
        this.data = partners.map((partner) => this.toGridRow(partner));
        this.dataNotFound = partners.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage partners." : "Unable to load partners.";
      }
    });
  }
  toGridRow(partner) {
    return __spreadProps(__spreadValues({}, partner), {
      productIds: partner.productIds ?? [],
      isActive: partner.isActive === true
    });
  }
  toCreateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      partnerTypeId: String(value["partnerTypeId"] ?? ""),
      countryId: String(value["countryId"] ?? ""),
      contactPerson: this.optionalString(value["contactPerson"]),
      phoneNumber: this.optionalString(value["phoneNumber"]),
      email: this.optionalString(value["email"]),
      address: this.optionalString(value["address"]),
      remarks: this.optionalString(value["remarks"]),
      productIds: this.stringArray(value["productIds"]),
      isActive: true
    };
  }
  toUpdateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      partnerTypeId: String(value["partnerTypeId"] ?? ""),
      countryId: String(value["countryId"] ?? ""),
      contactPerson: this.optionalString(value["contactPerson"]),
      phoneNumber: this.optionalString(value["phoneNumber"]),
      email: this.optionalString(value["email"]),
      address: this.optionalString(value["address"]),
      remarks: this.optionalString(value["remarks"]),
      productIds: this.stringArray(value["productIds"]),
      isActive: value["isActive"] === true
    };
  }
  toOptions(values) {
    return values.map((value) => ({
      label: value.name,
      value: value.id,
      code: value.code,
      partnerTypeCode: value.partnerTypeCode,
      canOwnProducts: value.canOwnProducts,
      canSellInHouseProducts: value.canSellInHouseProducts
    }));
  }
  toPartnerTypeOptions(values) {
    const optionsByCode = /* @__PURE__ */ new Map();
    this.toOptions(values).forEach((option) => {
      const code = this.normalizePartnerTypeCode(option.code ?? option.label);
      if (!optionsByCode.has(code)) {
        optionsByCode.set(code, __spreadProps(__spreadValues({}, option), { code }));
      }
    });
    return Array.from(optionsByCode.values()).sort((left, right) => {
      const leftOrder = partnerTypeOrder.get(this.normalizePartnerTypeCode(left.code)) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = partnerTypeOrder.get(this.normalizePartnerTypeCode(right.code)) ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder || left.label.localeCompare(right.label);
    });
  }
  normalizePartnerTypeCode(value) {
    return String(value ?? "").trim().replace(/-/g, "_").toUpperCase();
  }
  getRowId(row) {
    return typeof row?.["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
  stringArray(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === "string" && !!item.trim()) : [];
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function PartnerList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PartnerList)(\u0275\u0275directiveInject(PartnerApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PartnerList, selectors: [["app-partner-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 2, vars: 1, consts: [["position", "bottom-right"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction"], [3, "save", "delete", "bulkDelete", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction"]], template: function PartnerList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275conditionalCreate(1, PartnerList_Conditional_1_Template, 1, 17, "app-crud", 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 1 : -1);
    }
  }, dependencies: [Crud, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PartnerList, [{
    type: Component,
    args: [{ selector: "app-partner-list", standalone: true, imports: [Crud, ToastModule], providers: [MessageService], template: '<p-toast position="bottom-right"></p-toast>\r\n\r\n@if (!isLoading) {\r\n    <app-crud\r\n        [columns]="columns"\r\n        [data]="data"\r\n        [fields]="fields"\r\n        [title]="title"\r\n        [dataNotFound]="dataNotFound"\r\n        [errorMessage]="errorMessage"\r\n        [bulkActionLabel]="bulkActionLabel"\r\n        [rowActionLabel]="rowActionLabel"\r\n        [rowActionIcon]="rowActionIcon"\r\n        [rowActionLabelResolver]="rowActionLabelResolver"\r\n        [rowActionIconResolver]="rowActionIconResolver"\r\n        [canCreate]="canCreate"\r\n        [canEdit]="canEdit"\r\n        [canRowAction]="canDelete || canEdit"\r\n        [canBulkAction]="canDelete"\r\n        [canExport]="canExport"\r\n        [enableViewAction]="false"\r\n        (save)="savePartner($event)"\r\n        (delete)="togglePartnerStatus($event)"\r\n        (bulkDelete)="deactivatePartners($event)"\r\n    />\r\n}\r\n' }]
  }], () => [{ type: PartnerApiService }, { type: MessageService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PartnerList, { className: "PartnerList", filePath: "src/app/pages/partners/components/partner-list/partner-list.ts", lineNumber: 38 });
})();

// src/app/pages/partners/partners.routes.ts
var partners_routes_default = [{ path: "", component: PartnerList, canActivate: [permissionGuard(Permissions.partners.view)] }];
export {
  partners_routes_default as default
};
//# sourceMappingURL=chunk-XKC67HYK.js.map
