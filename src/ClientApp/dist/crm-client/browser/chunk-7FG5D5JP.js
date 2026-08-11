import {
  Tag,
  TagModule
} from "./chunk-QWMZLFPI.js";
import {
  Crud
} from "./chunk-QQ453JL3.js";
import "./chunk-UZR2OOOC.js";
import {
  Permissions
} from "./chunk-COJCLJYA.js";
import {
  Dialog,
  DialogModule,
  Table,
  TableModule
} from "./chunk-ZBJQJW6L.js";
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
  Button,
  ButtonModule,
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
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ACBHL573.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/roles/config/role-columns.config.ts
var RoleColumns = [
  { field: "name", header: "Role", type: "text", width: "200px", sortable: true },
  { field: "code", header: "Code", type: "text", width: "140px", sortable: true },
  { field: "description", header: "Description", type: "text", width: "320px", sortable: false },
  { field: "userCount", header: "Users", type: "number", width: "110px", sortable: true },
  { field: "isSystemRole", header: "System", type: "checkbox", width: "110px", sortable: true },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: true }
];

// src/app/pages/roles/config/role-fields.config.ts
var RoleFields = [
  { key: "name", label: "Role Name", type: "text", required: true, colSpan: 6, section: "Role", placeholder: "Sales Manager" },
  { key: "code", label: "Code", type: "text", colSpan: 6, section: "Role", placeholder: "SALES_MANAGER" },
  { key: "description", label: "Description", type: "textarea", required: true, colSpan: 12, section: "Role", placeholder: "Describe the role responsibility" },
  { key: "isActive", label: "Active", type: "checkbox", colSpan: 12, section: "Status", defaultValue: true, visibleOn: "update" }
];

// src/app/pages/roles/services/role-api.service.ts
var RoleApiService = class _RoleApiService {
  http;
  rolesUrl = apiUrl("/roles");
  constructor(http) {
    this.http = http;
  }
  getRoles() {
    return this.http.get(this.rolesUrl);
  }
  getRole(id) {
    return this.http.get(`${this.rolesUrl}/${id}`);
  }
  createRole(request) {
    return this.http.post(this.rolesUrl, request);
  }
  updateRole(id, request) {
    return this.http.put(`${this.rolesUrl}/${id}`, request);
  }
  activateRole(id) {
    return this.http.patch(`${this.rolesUrl}/${id}/activate`, {});
  }
  deactivateRole(id) {
    return this.http.patch(`${this.rolesUrl}/${id}/deactivate`, {});
  }
  getRoleUsers(id) {
    return this.http.get(`${this.rolesUrl}/${id}/users`);
  }
  getRolePermissions(id) {
    return this.http.get(`${this.rolesUrl}/${id}/permissions`);
  }
  updateRolePermissions(id, request) {
    return this.http.put(`${this.rolesUrl}/${id}/permissions`, request);
  }
  static \u0275fac = function RoleApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoleApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoleApiService, factory: _RoleApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoleApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/roles/components/role-list/role-list.ts
var _c0 = () => ({ width: "min(900px, 95vw)" });
var _c1 = () => ({ width: "min(1100px, 96vw)" });
var _c2 = () => ({ "min-width": "42rem" });
var _c3 = () => ({ "min-width": "64rem" });
function RoleList_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 8);
    \u0275\u0275listener("save", function RoleList_Conditional_1_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveRole($event));
    })("delete", function RoleList_Conditional_1_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleRoleStatus($event));
    })("bulkDelete", function RoleList_Conditional_1_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deactivateRoles($event));
    })("view", function RoleList_Conditional_1_Template_app_crud_view_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openRoleDetail($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r2.columns)("data", ctx_r2.data)("fields", ctx_r2.fields)("title", ctx_r2.title)("dataNotFound", ctx_r2.dataNotFound)("errorMessage", ctx_r2.errorMessage)("bulkActionLabel", "Deactivate")("rowActionLabel", ctx_r2.rowActionLabel)("rowActionIcon", ctx_r2.rowActionIcon)("rowActionLabelResolver", ctx_r2.rowActionLabelResolver)("rowActionIconResolver", ctx_r2.rowActionIconResolver)("enableViewAction", true)("canCreate", ctx_r2.canCreate)("canEdit", ctx_r2.canEdit)("canRowAction", ctx_r2.canDelete)("canBulkAction", ctx_r2.canDelete)("canExport", ctx_r2.canExport);
  }
}
function RoleList_Conditional_3_ng_template_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Status");
    \u0275\u0275elementEnd()();
  }
}
function RoleList_Conditional_3_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275element(6, "p-tag", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r4.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r4.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("severity", user_r4.isActive ? "success" : "danger")("value", user_r4.isActive ? "Active" : "Inactive");
  }
}
function RoleList_Conditional_3_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2, "No users are linked to this role.");
    \u0275\u0275elementEnd()();
  }
}
function RoleList_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "div", 11);
    \u0275\u0275text(3, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 12);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 10)(7, "div", 11);
    \u0275\u0275text(8, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 12);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 13)(12, "div", 11);
    \u0275\u0275text(13, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 14)(17, "div", 11);
    \u0275\u0275text(18, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "p-tag", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 14)(21, "div", 11);
    \u0275\u0275text(22, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "p-tag", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 14)(25, "div", 11);
    \u0275\u0275text(26, "Linked Users");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 12);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "h4", 16);
    \u0275\u0275text(30, "Linked Users");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "p-table", 17);
    \u0275\u0275template(32, RoleList_Conditional_3_ng_template_32_Template, 7, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(34, RoleList_Conditional_3_ng_template_34_Template, 7, 4, "ng-template", null, 2, \u0275\u0275templateRefExtractor)(36, RoleList_Conditional_3_ng_template_36_Template, 3, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedRole.name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedRole.code || "Not set");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedRole.description);
    \u0275\u0275advance(4);
    \u0275\u0275property("severity", ctx_r2.selectedRole.isActive ? "success" : "danger")("value", ctx_r2.selectedRole.isActive ? "Active" : "Inactive");
    \u0275\u0275advance(4);
    \u0275\u0275property("severity", ctx_r2.selectedRole.isSystemRole ? "info" : "secondary")("value", ctx_r2.selectedRole.isSystemRole ? "System" : "Custom");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedRole.userCount);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r2.selectedRole.linkedUsers)("rows", 5)("paginator", ctx_r2.selectedRole.linkedUsers.length > 5)("tableStyle", \u0275\u0275pureFunction0(12, _c2));
  }
}
function RoleList_ng_template_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 21);
    \u0275\u0275listener("onClick", function RoleList_ng_template_4_Conditional_0_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openPermissionMatrixById(ctx_r2.selectedRole.id));
    });
    \u0275\u0275elementEnd();
  }
}
function RoleList_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, RoleList_ng_template_4_Conditional_0_Template, 1, 0, "p-button", 19);
    \u0275\u0275elementStart(1, "p-button", 20);
    \u0275\u0275listener("onClick", function RoleList_ng_template_4_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.detailDialog = false);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.selectedRole && ctx_r2.canViewPermissions ? 0 : -1);
  }
}
function RoleList_Conditional_7_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Module");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 25);
    \u0275\u0275text(4, "View");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 25);
    \u0275\u0275text(6, "Create");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 25);
    \u0275\u0275text(8, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 25);
    \u0275\u0275text(10, "Delete");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 25);
    \u0275\u0275text(12, "Approve");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 25);
    \u0275\u0275text(14, "Export");
    \u0275\u0275elementEnd()();
  }
}
function RoleList_Conditional_7_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 11);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 25)(7, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_7_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canView", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 25)(9, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_9_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canCreate", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 25)(11, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_11_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canEdit", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 25)(13, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_13_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canDelete", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 25)(15, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_15_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canApprove", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 25)(17, "input", 26);
    \u0275\u0275listener("change", function RoleList_Conditional_7_ng_template_8_Template_input_change_17_listener($event) {
      const module_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePermission(module_r8, "canExport", $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const module_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(module_r8.moduleName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(module_r8.moduleCode);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canView)("disabled", !ctx_r2.canManagePermissions);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canCreate)("disabled", !ctx_r2.canManagePermissions);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canEdit)("disabled", !ctx_r2.canManagePermissions);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canDelete)("disabled", !ctx_r2.canManagePermissions);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canApprove)("disabled", !ctx_r2.canManagePermissions);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", module_r8.canExport)("disabled", !ctx_r2.canManagePermissions);
  }
}
function RoleList_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 11);
    \u0275\u0275text(2, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 23);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p-table", 24);
    \u0275\u0275template(6, RoleList_Conditional_7_ng_template_6_Template, 15, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(8, RoleList_Conditional_7_ng_template_8_Template, 18, 14, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.selectedPermissionRole.roleName);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r2.selectedPermissionRole.modules)("tableStyle", \u0275\u0275pureFunction0(3, _c3));
  }
}
function RoleList_ng_template_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 28);
    \u0275\u0275listener("onClick", function RoleList_ng_template_8_Conditional_1_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.savePermissions());
    });
    \u0275\u0275elementEnd();
  }
}
function RoleList_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 20);
    \u0275\u0275listener("onClick", function RoleList_ng_template_8_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.permissionDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, RoleList_ng_template_8_Conditional_1_Template, 1, 0, "p-button", 27);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canManagePermissions ? 1 : -1);
  }
}
var RoleList = class _RoleList {
  roleApiService;
  messageService;
  authService;
  title = "Role";
  columns = RoleColumns;
  fields = RoleFields;
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No roles found.";
  detailDialog = false;
  permissionDialog = false;
  selectedRole;
  selectedPermissionRole;
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  canManagePermissions = false;
  canViewPermissions = false;
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  constructor(roleApiService, messageService, authService) {
    this.roleApiService = roleApiService;
    this.messageService = messageService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.roles.create);
    this.canEdit = this.authService.hasPermission(Permissions.roles.edit);
    this.canDelete = this.authService.hasPermission(Permissions.roles.delete);
    this.canExport = this.authService.hasPermission(Permissions.roles.export);
    this.canManagePermissions = this.authService.hasPermission(Permissions.permissions.edit);
    this.canViewPermissions = this.authService.hasPermission(Permissions.permissions.view);
    this.loadRoles();
  }
  saveRole(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.roleApiService.createRole(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Role created", detail: "The role was created successfully.", life: 3e3 });
          this.loadRoles();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Role id is missing.", life: 4e3 });
      return;
    }
    this.roleApiService.updateRole(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Role updated", detail: "The role was updated successfully.", life: 3e3 });
        this.loadRoles();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  toggleRoleStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "Role id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.roleApiService.deactivateRole(id) : this.roleApiService.activateRole(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Role ${action}`, detail: `The role was ${action} successfully.`, life: 3e3 });
        this.loadRoles();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivateRoles(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active roles", detail: "The selected roles are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.roleApiService.deactivateRole(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Roles deactivated", detail: `${activeIds.length} role(s) were deactivated.`, life: 3e3 });
        this.loadRoles();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  openRoleDetail(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Detail failed", detail: "Role id is missing.", life: 4e3 });
      return;
    }
    this.roleApiService.getRole(id).subscribe({
      next: (role) => {
        this.selectedRole = role;
        this.detailDialog = true;
      },
      error: (error) => this.showError(error, "Detail failed")
    });
  }
  openPermissionMatrix(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Permissions failed", detail: "Role id is missing.", life: 4e3 });
      return;
    }
    this.openPermissionMatrixById(id);
  }
  openPermissionMatrixById(id) {
    this.roleApiService.getRolePermissions(id).subscribe({
      next: (permissions) => {
        this.selectedPermissionRole = permissions;
        this.permissionDialog = true;
      },
      error: (error) => this.showError(error, "Permissions failed")
    });
  }
  savePermissions() {
    if (!this.selectedPermissionRole) {
      return;
    }
    this.roleApiService.updateRolePermissions(this.selectedPermissionRole.roleId, {
      roleId: this.selectedPermissionRole.roleId,
      permissions: this.selectedPermissionRole.modules
    }).subscribe({
      next: (permissions) => {
        this.selectedPermissionRole = permissions;
        this.messageService.add({ severity: "success", summary: "Permissions saved", detail: "Role permissions were updated successfully.", life: 3e3 });
        this.permissionDialog = false;
      },
      error: (error) => this.showError(error, "Save permissions failed")
    });
  }
  togglePermission(item, field, event) {
    item[field] = event.target.checked;
  }
  loadRoles() {
    this.isLoading = true;
    this.roleApiService.getRoles().subscribe({
      next: (roles) => {
        this.data = roles.map((role) => this.toGridRow(role));
        this.dataNotFound = roles.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage roles." : "Unable to load roles.";
      }
    });
  }
  toGridRow(role) {
    return __spreadProps(__spreadValues({}, role), {
      isSystemRole: role.isSystemRole === true,
      isActive: role.isActive === true
    });
  }
  toCreateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      code: this.optionalString(value["code"]),
      description: String(value["description"] ?? ""),
      isSystemRole: false,
      isActive: value["isActive"] === true
    };
  }
  toUpdateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      code: this.optionalString(value["code"]),
      description: String(value["description"] ?? ""),
      isActive: value["isActive"] === true
    };
  }
  getRowId(row) {
    return typeof row?.["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function RoleList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoleList)(\u0275\u0275directiveInject(RoleApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoleList, selectors: [["app-role-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 10, vars: 13, consts: [["footer", ""], ["header", ""], ["body", ""], ["emptymessage", ""], ["position", "bottom-right"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "enableViewAction", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"], ["header", "Role Detail", 3, "visibleChange", "visible", "modal"], ["header", "Permission Matrix", 3, "visibleChange", "visible", "modal"], [3, "save", "delete", "bulkDelete", "view", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "enableViewAction", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "md:col-span-6"], [1, "text-sm", "text-surface-500"], [1, "font-semibold"], [1, "col-span-12"], [1, "col-span-12", "md:col-span-4"], [3, "severity", "value"], [1, "mt-6", "mb-3"], [3, "value", "rows", "paginator", "tableStyle"], ["colspan", "3"], ["label", "Permissions", "icon", "pi pi-key"], ["label", "Close", "icon", "pi pi-times", "text", "", 3, "onClick"], ["label", "Permissions", "icon", "pi pi-key", 3, "onClick"], [1, "mb-4"], [1, "text-lg", "font-semibold"], [3, "value", "tableStyle"], [1, "text-center"], ["type", "checkbox", 3, "change", "checked", "disabled"], ["label", "Save Permissions", "icon", "pi pi-check"], ["label", "Save Permissions", "icon", "pi pi-check", 3, "onClick"]], template: function RoleList_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275element(0, "p-toast", 4);
      \u0275\u0275conditionalCreate(1, RoleList_Conditional_1_Template, 1, 17, "app-crud", 5);
      \u0275\u0275elementStart(2, "p-dialog", 6);
      \u0275\u0275twoWayListener("visibleChange", function RoleList_Template_p_dialog_visibleChange_2_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.detailDialog, $event) || (ctx.detailDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275conditionalCreate(3, RoleList_Conditional_3_Template, 38, 13);
      \u0275\u0275template(4, RoleList_ng_template_4_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p-dialog", 7);
      \u0275\u0275twoWayListener("visibleChange", function RoleList_Template_p_dialog_visibleChange_6_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.permissionDialog, $event) || (ctx.permissionDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275conditionalCreate(7, RoleList_Conditional_7_Template, 10, 4);
      \u0275\u0275template(8, RoleList_ng_template_8_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(11, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.detailDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.selectedRole ? 3 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(12, _c1));
      \u0275\u0275twoWayProperty("visible", ctx.permissionDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.selectedPermissionRole ? 7 : -1);
    }
  }, dependencies: [ButtonModule, Button, Crud, DialogModule, Dialog, TableModule, Table, TagModule, Tag, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoleList, [{
    type: Component,
    args: [{ selector: "app-role-list", standalone: true, imports: [ButtonModule, Crud, DialogModule, TableModule, TagModule, ToastModule], providers: [MessageService], template: `<p-toast position="bottom-right"></p-toast>\r
\r
@if (!isLoading) {\r
    <app-crud\r
        [columns]="columns"\r
        [data]="data"\r
        [fields]="fields"\r
        [title]="title"\r
        [dataNotFound]="dataNotFound"\r
        [errorMessage]="errorMessage"\r
        [bulkActionLabel]="'Deactivate'"\r
        [rowActionLabel]="rowActionLabel"\r
        [rowActionIcon]="rowActionIcon"\r
        [rowActionLabelResolver]="rowActionLabelResolver"\r
        [rowActionIconResolver]="rowActionIconResolver"\r
        [enableViewAction]="true"\r
        [canCreate]="canCreate"\r
        [canEdit]="canEdit"\r
        [canRowAction]="canDelete"\r
        [canBulkAction]="canDelete"\r
        [canExport]="canExport"\r
        (save)="saveRole($event)"\r
        (delete)="toggleRoleStatus($event)"\r
        (bulkDelete)="deactivateRoles($event)"\r
        (view)="openRoleDetail($event)"\r
    />\r
}\r
\r
<p-dialog [(visible)]="detailDialog" [style]="{ width: 'min(900px, 95vw)' }" [modal]="true" header="Role Detail">\r
    @if (selectedRole) {\r
        <div class="grid grid-cols-12 gap-4">\r
            <div class="col-span-12 md:col-span-6">\r
                <div class="text-sm text-surface-500">Role</div>\r
                <div class="font-semibold">{{ selectedRole.name }}</div>\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <div class="text-sm text-surface-500">Code</div>\r
                <div class="font-semibold">{{ selectedRole.code || 'Not set' }}</div>\r
            </div>\r
            <div class="col-span-12">\r
                <div class="text-sm text-surface-500">Description</div>\r
                <div>{{ selectedRole.description }}</div>\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <div class="text-sm text-surface-500">Status</div>\r
                <p-tag [severity]="selectedRole.isActive ? 'success' : 'danger'" [value]="selectedRole.isActive ? 'Active' : 'Inactive'" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <div class="text-sm text-surface-500">Type</div>\r
                <p-tag [severity]="selectedRole.isSystemRole ? 'info' : 'secondary'" [value]="selectedRole.isSystemRole ? 'System' : 'Custom'" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <div class="text-sm text-surface-500">Linked Users</div>\r
                <div class="font-semibold">{{ selectedRole.userCount }}</div>\r
            </div>\r
        </div>\r
\r
        <h4 class="mt-6 mb-3">Linked Users</h4>\r
        <p-table [value]="selectedRole.linkedUsers" [rows]="5" [paginator]="selectedRole.linkedUsers.length > 5" [tableStyle]="{ 'min-width': '42rem' }">\r
            <ng-template #header>\r
                <tr>\r
                    <th>Name</th>\r
                    <th>Email</th>\r
                    <th>Status</th>\r
                </tr>\r
            </ng-template>\r
            <ng-template #body let-user>\r
                <tr>\r
                    <td>{{ user.fullName }}</td>\r
                    <td>{{ user.email }}</td>\r
                    <td>\r
                        <p-tag [severity]="user.isActive ? 'success' : 'danger'" [value]="user.isActive ? 'Active' : 'Inactive'" />\r
                    </td>\r
                </tr>\r
            </ng-template>\r
            <ng-template #emptymessage>\r
                <tr>\r
                    <td colspan="3">No users are linked to this role.</td>\r
                </tr>\r
            </ng-template>\r
        </p-table>\r
    }\r
\r
    <ng-template #footer>\r
        @if (selectedRole && canViewPermissions) {\r
            <p-button label="Permissions" icon="pi pi-key" (onClick)="openPermissionMatrixById(selectedRole.id)" />\r
        }\r
        <p-button label="Close" icon="pi pi-times" text (onClick)="detailDialog = false" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="permissionDialog" [style]="{ width: 'min(1100px, 96vw)' }" [modal]="true" header="Permission Matrix">\r
    @if (selectedPermissionRole) {\r
        <div class="mb-4">\r
            <div class="text-sm text-surface-500">Role</div>\r
            <div class="text-lg font-semibold">{{ selectedPermissionRole.roleName }}</div>\r
        </div>\r
\r
        <p-table [value]="selectedPermissionRole.modules" [tableStyle]="{ 'min-width': '64rem' }">\r
            <ng-template #header>\r
                <tr>\r
                    <th>Module</th>\r
                    <th class="text-center">View</th>\r
                    <th class="text-center">Create</th>\r
                    <th class="text-center">Edit</th>\r
                    <th class="text-center">Delete</th>\r
                    <th class="text-center">Approve</th>\r
                    <th class="text-center">Export</th>\r
                </tr>\r
            </ng-template>\r
            <ng-template #body let-module>\r
                <tr>\r
                    <td>\r
                        <div class="font-semibold">{{ module.moduleName }}</div>\r
                        <div class="text-sm text-surface-500">{{ module.moduleCode }}</div>\r
                    </td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canView" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canView', $event)" /></td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canCreate" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canCreate', $event)" /></td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canEdit" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canEdit', $event)" /></td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canDelete" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canDelete', $event)" /></td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canApprove" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canApprove', $event)" /></td>\r
                    <td class="text-center"><input type="checkbox" [checked]="module.canExport" [disabled]="!canManagePermissions" (change)="togglePermission(module, 'canExport', $event)" /></td>\r
                </tr>\r
            </ng-template>\r
        </p-table>\r
    }\r
\r
    <ng-template #footer>\r
        <p-button label="Close" icon="pi pi-times" text (onClick)="permissionDialog = false" />\r
        @if (canManagePermissions) {\r
            <p-button label="Save Permissions" icon="pi pi-check" (onClick)="savePermissions()" />\r
        }\r
    </ng-template>\r
</p-dialog>\r
` }]
  }], () => [{ type: RoleApiService }, { type: MessageService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoleList, { className: "RoleList", filePath: "src/app/pages/roles/components/role-list/role-list.ts", lineNumber: 32 });
})();

// src/app/pages/roles/roles.routes.ts
var roles_routes_default = [{ path: "", component: RoleList, canActivate: [permissionGuard(Permissions.roles.view)] }];
export {
  roles_routes_default as default
};
//# sourceMappingURL=chunk-7FG5D5JP.js.map
