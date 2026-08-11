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

// src/app/pages/products/config/product-columns.config.ts
var ProductColumns = [
  { field: "code", header: "Code", type: "text", width: "150px", sortable: true },
  { field: "name", header: "Product", type: "text", width: "240px", sortable: true },
  { field: "productTypeName", header: "Type", type: "text", width: "160px", sortable: true },
  { field: "deploymentTypeName", header: "Deployment", type: "text", width: "170px", sortable: true },
  { field: "ownershipTypeName", header: "Ownership", type: "text", width: "150px", sortable: true },
  { field: "ownerPartnerName", header: "Partner", type: "text", width: "220px", sortable: true },
  { field: "isSubscriptionBased", header: "Subscription", type: "checkbox", width: "130px", sortable: true },
  { field: "isLicenseBased", header: "License", type: "checkbox", width: "110px", sortable: true },
  { field: "description", header: "Description", type: "text", width: "320px", sortable: false },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: true }
];

// src/app/pages/products/config/product-fields.config.ts
function buildProductFields(options) {
  const isPartnerOwned = (formValue) => {
    const selected = options.ownershipTypes.find((option) => option.value === formValue["ownershipTypeId"]);
    return selected?.code === "PartnerOwned";
  };
  const defaultOwnershipTypeId = options.ownershipTypes.find((option) => option.code === "InHouse")?.value;
  return [
    { key: "code", label: "Product Code", type: "text", required: true, colSpan: 4, section: "Product", placeholder: "CRM-CORE" },
    { key: "name", label: "Product Name", type: "text", required: true, colSpan: 4, section: "Product", placeholder: "Product or service name" },
    { key: "productTypeId", label: "Product Type", type: "select", required: true, options: options.productTypes, colSpan: 4, section: "Product", placeholder: "Select type" },
    { key: "deploymentTypeId", label: "Deployment Type", type: "select", required: true, options: options.deploymentTypes, colSpan: 4, section: "Delivery", placeholder: "Select deployment" },
    { key: "ownershipTypeId", label: "Ownership", type: "select", required: true, options: options.ownershipTypes, colSpan: 4, section: "Ownership", placeholder: "Select ownership", defaultValue: defaultOwnershipTypeId },
    { key: "ownerPartnerId", label: "Owner Partner", type: "select", options: options.ownerPartners, colSpan: 4, section: "Ownership", placeholder: "Select owner partner", visibleWhen: isPartnerOwned, requiredWhen: isPartnerOwned },
    { key: "description", label: "Description", type: "textarea", colSpan: 8, section: "Delivery", placeholder: "Short product description" },
    {
      key: "businessModel",
      label: "Business Model",
      type: "radio",
      required: true,
      colSpan: 12,
      section: "Business Model",
      options: [
        { label: "Subscription-based", value: "subscription" },
        { label: "License-based", value: "license" }
      ]
    },
    { key: "isActive", label: "Active", type: "checkbox", colSpan: 12, section: "Status", defaultValue: true, visibleOn: "update" }
  ];
}

// src/app/pages/products/services/product-api.service.ts
var ProductApiService = class _ProductApiService {
  http;
  productsUrl = apiUrl("/products");
  constructor(http) {
    this.http = http;
  }
  getProducts() {
    return this.http.get(this.productsUrl);
  }
  getProduct(id) {
    return this.http.get(`${this.productsUrl}/${id}`);
  }
  getLookups() {
    return this.http.get(`${this.productsUrl}/lookups`);
  }
  createProduct(request) {
    return this.http.post(this.productsUrl, request);
  }
  updateProduct(id, request) {
    return this.http.put(`${this.productsUrl}/${id}`, request);
  }
  activateProduct(id) {
    return this.http.patch(`${this.productsUrl}/${id}/activate`, {});
  }
  deactivateProduct(id) {
    return this.http.patch(`${this.productsUrl}/${id}/deactivate`, {});
  }
  static \u0275fac = function ProductApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProductApiService, factory: _ProductApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/products/components/product-list/product-list.ts
function ProductList_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 2);
    \u0275\u0275listener("save", function ProductList_Conditional_1_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveProduct($event));
    })("delete", function ProductList_Conditional_1_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleProductStatus($event));
    })("bulkDelete", function ProductList_Conditional_1_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deactivateProducts($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r1.columns)("data", ctx_r1.data)("fields", ctx_r1.fields)("title", ctx_r1.title)("dataNotFound", ctx_r1.dataNotFound)("errorMessage", ctx_r1.errorMessage)("bulkActionLabel", ctx_r1.bulkActionLabel)("rowActionLabel", ctx_r1.rowActionLabel)("rowActionIcon", ctx_r1.rowActionIcon)("rowActionLabelResolver", ctx_r1.rowActionLabelResolver)("rowActionIconResolver", ctx_r1.rowActionIconResolver)("canCreate", ctx_r1.canCreate)("canEdit", ctx_r1.canEdit)("canRowAction", ctx_r1.canDelete || ctx_r1.canEdit)("canBulkAction", ctx_r1.canDelete)("canExport", ctx_r1.canExport)("enableViewAction", false);
  }
}
var ProductList = class _ProductList {
  productApiService;
  messageService;
  authService;
  title = "Product";
  columns = ProductColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No products found.";
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  bulkActionLabel = "Deactivate";
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  subscriptionBusinessModel = "subscription";
  licenseBusinessModel = "license";
  ownershipTypeCodeById = /* @__PURE__ */ new Map();
  constructor(productApiService, messageService, authService) {
    this.productApiService = productApiService;
    this.messageService = messageService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.products.create);
    this.canEdit = this.authService.hasPermission(Permissions.products.edit);
    this.canDelete = this.authService.hasPermission(Permissions.products.delete);
    this.canExport = this.authService.hasPermission(Permissions.products.export);
    this.loadPage();
  }
  saveProduct(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.productApiService.createProduct(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Product created", detail: "The product was created successfully.", life: 3e3 });
          this.loadProducts();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Product id is missing.", life: 4e3 });
      return;
    }
    this.productApiService.updateProduct(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Product updated", detail: "The product was updated successfully.", life: 3e3 });
        this.loadProducts();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  toggleProductStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "Product id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.productApiService.deactivateProduct(id) : this.productApiService.activateProduct(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Product ${action}`, detail: `The product was ${action} successfully.`, life: 3e3 });
        this.loadProducts();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivateProducts(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active products", detail: "The selected products are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.productApiService.deactivateProduct(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Products deactivated", detail: `${activeIds.length} product(s) were deactivated.`, life: 3e3 });
        this.loadProducts();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  loadPage() {
    this.isLoading = true;
    this.productApiService.getLookups().subscribe({
      next: (lookups) => {
        this.ownershipTypeCodeById = new Map(lookups.ownershipTypes.map((type) => [type.value, type.code]));
        this.fields = buildProductFields({
          productTypes: this.toOptions(lookups.productTypes),
          deploymentTypes: this.toOptions(lookups.deploymentTypes),
          ownershipTypes: this.toOptions(lookups.ownershipTypes),
          ownerPartners: lookups.ownerPartners.map((partner) => ({ label: partner.name, value: partner.id, code: partner.code ?? void 0, partnerTypeCode: partner.partnerTypeCode ?? void 0 }))
        });
        this.loadProducts();
      },
      error: () => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = "Unable to load product lookups.";
      }
    });
  }
  loadProducts() {
    this.productApiService.getProducts().subscribe({
      next: (products) => {
        this.data = products.map((product) => this.toGridRow(product));
        this.dataNotFound = products.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage products." : "Unable to load products.";
      }
    });
  }
  toGridRow(product) {
    return __spreadProps(__spreadValues({}, product), {
      ownerPartnerName: product.ownerPartnerName ?? "",
      businessModel: this.toBusinessModel(product.isSubscriptionBased, product.isLicenseBased),
      isActive: product.isActive === true
    });
  }
  toCreateRequest(value) {
    const ownershipTypeId = String(value["ownershipTypeId"] ?? "");
    return {
      code: String(value["code"] ?? ""),
      name: String(value["name"] ?? ""),
      productTypeId: String(value["productTypeId"] ?? ""),
      deploymentTypeId: String(value["deploymentTypeId"] ?? ""),
      ownershipTypeId,
      ownerPartnerId: this.isPartnerOwned(ownershipTypeId) ? this.optionalString(value["ownerPartnerId"]) : null,
      description: this.optionalString(value["description"]),
      isSubscriptionBased: value["businessModel"] === this.subscriptionBusinessModel,
      isLicenseBased: value["businessModel"] === this.licenseBusinessModel,
      isActive: true
    };
  }
  toUpdateRequest(value) {
    const ownershipTypeId = String(value["ownershipTypeId"] ?? "");
    return {
      code: String(value["code"] ?? ""),
      name: String(value["name"] ?? ""),
      productTypeId: String(value["productTypeId"] ?? ""),
      deploymentTypeId: String(value["deploymentTypeId"] ?? ""),
      ownershipTypeId,
      ownerPartnerId: this.isPartnerOwned(ownershipTypeId) ? this.optionalString(value["ownerPartnerId"]) : null,
      description: this.optionalString(value["description"]),
      isSubscriptionBased: value["businessModel"] === this.subscriptionBusinessModel,
      isLicenseBased: value["businessModel"] === this.licenseBusinessModel,
      isActive: value["isActive"] === true
    };
  }
  toOptions(values) {
    return values.map((value) => ({ label: value.name, value: value.value, code: value.code }));
  }
  isPartnerOwned(ownershipTypeId) {
    return this.ownershipTypeCodeById.get(ownershipTypeId) === "PartnerOwned";
  }
  getRowId(row) {
    return typeof row?.["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
  toBusinessModel(isSubscriptionBased, isLicenseBased) {
    if (isSubscriptionBased === true && isLicenseBased !== true) {
      return this.subscriptionBusinessModel;
    }
    if (isLicenseBased === true && isSubscriptionBased !== true) {
      return this.licenseBusinessModel;
    }
    return "";
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function ProductList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductList)(\u0275\u0275directiveInject(ProductApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductList, selectors: [["app-product-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 2, vars: 1, consts: [["position", "bottom-right"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction"], [3, "save", "delete", "bulkDelete", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction"]], template: function ProductList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275conditionalCreate(1, ProductList_Conditional_1_Template, 1, 17, "app-crud", 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 1 : -1);
    }
  }, dependencies: [Crud, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductList, [{
    type: Component,
    args: [{ selector: "app-product-list", standalone: true, imports: [Crud, ToastModule], providers: [MessageService], template: '<p-toast position="bottom-right"></p-toast>\r\n\r\n@if (!isLoading) {\r\n    <app-crud\r\n        [columns]="columns"\r\n        [data]="data"\r\n        [fields]="fields"\r\n        [title]="title"\r\n        [dataNotFound]="dataNotFound"\r\n        [errorMessage]="errorMessage"\r\n        [bulkActionLabel]="bulkActionLabel"\r\n        [rowActionLabel]="rowActionLabel"\r\n        [rowActionIcon]="rowActionIcon"\r\n        [rowActionLabelResolver]="rowActionLabelResolver"\r\n        [rowActionIconResolver]="rowActionIconResolver"\r\n        [canCreate]="canCreate"\r\n        [canEdit]="canEdit"\r\n        [canRowAction]="canDelete || canEdit"\r\n        [canBulkAction]="canDelete"\r\n        [canExport]="canExport"\r\n        [enableViewAction]="false"\r\n        (save)="saveProduct($event)"\r\n        (delete)="toggleProductStatus($event)"\r\n        (bulkDelete)="deactivateProducts($event)"\r\n    />\r\n}\r\n' }]
  }], () => [{ type: ProductApiService }, { type: MessageService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductList, { className: "ProductList", filePath: "src/app/pages/products/components/product-list/product-list.ts", lineNumber: 24 });
})();

// src/app/pages/products/products.routes.ts
var products_routes_default = [{ path: "", component: ProductList, canActivate: [permissionGuard(Permissions.products.view)] }];
export {
  products_routes_default as default
};
//# sourceMappingURL=chunk-NLZCG62G.js.map
