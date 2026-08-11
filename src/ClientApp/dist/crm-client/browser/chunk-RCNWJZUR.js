import {
  Crud
} from "./chunk-QQ453JL3.js";
import "./chunk-UZR2OOOC.js";
import {
  Select,
  SelectModule
} from "./chunk-ZBJQJW6L.js";
import {
  AuthService,
  roleGuard
} from "./chunk-CPXJEDC2.js";
import "./chunk-DBLRL2R3.js";
import {
  Toast,
  ToastModule
} from "./chunk-MIABMXFE.js";
import {
  FormsModule,
  HttpClient,
  MessageService,
  NgControlStatus,
  NgModel,
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
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ACBHL573.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/lookups/config/lookup-columns.config.ts
var LookupColumns = [
  { field: "lookupName", header: "Type", type: "text", width: "180px", sortable: true },
  { field: "name", header: "Name", type: "text", width: "220px", sortable: true },
  { field: "description", header: "Description", type: "text", width: "320px", sortable: false },
  { field: "order", header: "Order", type: "number", width: "110px", sortable: true },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: true }
];

// src/app/pages/lookups/config/lookup-fields.config.ts
function buildLookupFields(lookupTypes, defaultLookupId) {
  return [
    { key: "lookupId", label: "Lookup Type", type: "select", required: true, options: lookupTypes, colSpan: 12, section: "Lookup", placeholder: "Select lookup type", visibleOn: "create", defaultValue: defaultLookupId ?? void 0 },
    { key: "name", label: "Name", type: "text", required: true, colSpan: 6, section: "Lookup", placeholder: "Enter name" },
    { key: "order", label: "Order", type: "number", colSpan: 6, section: "Lookup", placeholder: "0" },
    { key: "description", label: "Description", type: "textarea", colSpan: 12, section: "Lookup", placeholder: "Optional description" },
    { key: "isActive", label: "Active", type: "checkbox", colSpan: 12, section: "Status", defaultValue: true, visibleOn: "update" }
  ];
}

// src/app/pages/lookups/services/lookup-api.service.ts
var LookupApiService = class _LookupApiService {
  http;
  lookupsUrl = apiUrl("/lookups");
  constructor(http) {
    this.http = http;
  }
  getLookupTypes() {
    return this.http.get(`${this.lookupsUrl}/types`);
  }
  getLookups(lookupId) {
    return this.http.get(this.lookupsUrl, { params: { lookupId, includeInactive: true } });
  }
  getLookup(id) {
    return this.http.get(`${this.lookupsUrl}/${id}`);
  }
  createLookup(request) {
    return this.http.post(this.lookupsUrl, request);
  }
  updateLookup(id, request) {
    return this.http.put(`${this.lookupsUrl}/${id}`, request);
  }
  activateLookup(id) {
    return this.http.patch(`${this.lookupsUrl}/${id}/activate`, {});
  }
  deactivateLookup(id) {
    return this.http.patch(`${this.lookupsUrl}/${id}/deactivate`, {});
  }
  static \u0275fac = function LookupApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LookupApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LookupApiService, factory: _LookupApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LookupApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/lookups/components/lookup-list/lookup-list.ts
var _c0 = () => ({ "min-width": "220px" });
function LookupList_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 5);
    \u0275\u0275listener("save", function LookupList_Conditional_5_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveLookup($event));
    })("delete", function LookupList_Conditional_5_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleLookupStatus($event));
    })("bulkDelete", function LookupList_Conditional_5_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deactivateLookups($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r1.columns)("data", ctx_r1.data)("fields", ctx_r1.fields)("title", ctx_r1.title)("dataNotFound", ctx_r1.dataNotFound)("errorMessage", ctx_r1.errorMessage)("bulkActionLabel", "Deactivate")("rowActionLabel", ctx_r1.rowActionLabel)("rowActionIcon", ctx_r1.rowActionIcon)("rowActionLabelResolver", ctx_r1.rowActionLabelResolver)("rowActionIconResolver", ctx_r1.rowActionIconResolver)("canCreate", ctx_r1.canManage)("canEdit", ctx_r1.canManage)("canRowAction", ctx_r1.canManage)("canBulkAction", ctx_r1.canManage)("canExport", ctx_r1.canManage);
  }
}
var LookupList = class _LookupList {
  lookupApiService;
  messageService;
  authService;
  title = "Lookup";
  columns = LookupColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No lookups found.";
  canManage = false;
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  lookupTypeOptions = [];
  selectedLookupId = null;
  constructor(lookupApiService, messageService, authService) {
    this.lookupApiService = lookupApiService;
    this.messageService = messageService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canManage = this.authService.hasAnyRole(["Admin", "SuperAdmin"]);
    this.lookupApiService.getLookupTypes().subscribe({
      next: (types) => {
        this.lookupTypeOptions = this.toOptions(types);
        this.selectedLookupId = types[0]?.value ?? null;
        this.rebuildFields();
        this.loadLookups();
      },
      error: () => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = "Unable to load lookup types.";
      }
    });
  }
  onLookupTypeChange() {
    this.rebuildFields();
    this.loadLookups();
  }
  saveLookup(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.lookupApiService.createLookup(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Lookup created", detail: "The lookup was created successfully.", life: 3e3 });
          this.loadLookups();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Lookup id is missing.", life: 4e3 });
      return;
    }
    this.lookupApiService.updateLookup(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Lookup updated", detail: "The lookup was updated successfully.", life: 3e3 });
        this.loadLookups();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  toggleLookupStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "Lookup id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.lookupApiService.deactivateLookup(id) : this.lookupApiService.activateLookup(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Lookup ${action}`, detail: `The lookup was ${action} successfully.`, life: 3e3 });
        this.loadLookups();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivateLookups(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active lookups", detail: "The selected lookups are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.lookupApiService.deactivateLookup(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Lookups deactivated", detail: `${activeIds.length} lookup(s) were deactivated.`, life: 3e3 });
        this.loadLookups();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  rebuildFields() {
    this.fields = buildLookupFields(this.lookupTypeOptions, this.selectedLookupId);
  }
  loadLookups() {
    if (this.selectedLookupId == null) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.lookupApiService.getLookups(this.selectedLookupId).subscribe({
      next: (lookups) => {
        this.data = lookups.map((lookup) => this.toGridRow(lookup));
        this.dataNotFound = lookups.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage lookups." : "Unable to load lookups.";
      }
    });
  }
  toGridRow(lookup) {
    return __spreadProps(__spreadValues({}, lookup), {
      isActive: lookup.isActive === true
    });
  }
  toCreateRequest(value) {
    return {
      lookupId: this.toNumber(value["lookupId"]),
      name: String(value["name"] ?? ""),
      description: this.optionalString(value["description"]),
      order: value["order"] != null && value["order"] !== "" ? this.toNumber(value["order"]) : null
    };
  }
  toUpdateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      description: this.optionalString(value["description"]),
      order: this.toNumber(value["order"]),
      isActive: value["isActive"] === true
    };
  }
  toOptions(values) {
    return values.map((value) => ({ label: value.name, value: value.value, code: value.code }));
  }
  getRowId(row) {
    return typeof row?.["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
  toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function LookupList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LookupList)(\u0275\u0275directiveInject(LookupApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LookupList, selectors: [["app-lookup-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 6, vars: 6, consts: [["position", "bottom-right"], [1, "mb-4", "flex", "items-center", "gap-3"], ["for", "lookupTypeFilter", 1, "font-semibold", "text-sm"], ["id", "lookupTypeFilter", "optionLabel", "label", "optionValue", "value", "placeholder", "Select lookup type", 3, "ngModelChange", "onChange", "options", "ngModel"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"], [3, "save", "delete", "bulkDelete", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"]], template: function LookupList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275elementStart(1, "div", 1)(2, "label", 2);
      \u0275\u0275text(3, "Lookup Type");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p-select", 3);
      \u0275\u0275twoWayListener("ngModelChange", function LookupList_Template_p_select_ngModelChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedLookupId, $event) || (ctx.selectedLookupId = $event);
        return $event;
      });
      \u0275\u0275listener("onChange", function LookupList_Template_p_select_onChange_4_listener() {
        return ctx.onLookupTypeChange();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(5, LookupList_Conditional_5_Template, 1, 16, "app-crud", 4);
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275property("options", ctx.lookupTypeOptions);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedLookupId);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 5 : -1);
    }
  }, dependencies: [Crud, FormsModule, NgControlStatus, NgModel, SelectModule, Select, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LookupList, [{
    type: Component,
    args: [{ selector: "app-lookup-list", standalone: true, imports: [Crud, FormsModule, SelectModule, ToastModule], providers: [MessageService], template: `<p-toast position="bottom-right"></p-toast>

<div class="mb-4 flex items-center gap-3">
    <label for="lookupTypeFilter" class="font-semibold text-sm">Lookup Type</label>
    <p-select
        id="lookupTypeFilter"
        [options]="lookupTypeOptions"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="selectedLookupId"
        (onChange)="onLookupTypeChange()"
        placeholder="Select lookup type"
        [style]="{ 'min-width': '220px' }"
    />
</div>

@if (!isLoading) {
    <app-crud
        [columns]="columns"
        [data]="data"
        [fields]="fields"
        [title]="title"
        [dataNotFound]="dataNotFound"
        [errorMessage]="errorMessage"
        [bulkActionLabel]="'Deactivate'"
        [rowActionLabel]="rowActionLabel"
        [rowActionIcon]="rowActionIcon"
        [rowActionLabelResolver]="rowActionLabelResolver"
        [rowActionIconResolver]="rowActionIconResolver"
        [canCreate]="canManage"
        [canEdit]="canManage"
        [canRowAction]="canManage"
        [canBulkAction]="canManage"
        [canExport]="canManage"
        (save)="saveLookup($event)"
        (delete)="toggleLookupStatus($event)"
        (bulkDelete)="deactivateLookups($event)"
    />
}
` }]
  }], () => [{ type: LookupApiService }, { type: MessageService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LookupList, { className: "LookupList", filePath: "src/app/pages/lookups/components/lookup-list/lookup-list.ts", lineNumber: 25 });
})();

// src/app/pages/lookups/lookups.routes.ts
var lookups_routes_default = [{ path: "", component: LookupList, canActivate: [roleGuard(["Admin", "SuperAdmin"])] }];
export {
  lookups_routes_default as default
};
//# sourceMappingURL=chunk-RCNWJZUR.js.map
