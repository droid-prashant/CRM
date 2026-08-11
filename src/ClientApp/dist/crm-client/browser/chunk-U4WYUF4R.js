import {
  UserApiService
} from "./chunk-QS27J5HP.js";
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
  MessageService,
  Validators
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  forkJoin,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
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
  ɵɵresetView,
  ɵɵrestoreView
} from "./chunk-ACBHL573.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/users/config/user-columns.config.ts
var UserColumns = [
  { field: "fullName", header: "Name", type: "text", width: "220px", sortable: true },
  { field: "username", header: "Username", type: "text", width: "180px", sortable: true },
  { field: "email", header: "Email", type: "email", width: "240px", sortable: true },
  { field: "rolesDisplay", header: "Roles", type: "text", width: "240px", sortable: false },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: true }
];

// src/app/pages/users/config/user-fields.config.ts
var passwordValidators = [
  Validators.minLength(8),
  Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)
];
var passwordValidationMessages = {
  required: "Password is required",
  minlength: "Password must be at least 8 characters",
  pattern: "Password must contain at least one uppercase letter, one digit, and one special character"
};
function buildUserFields(roles) {
  return [
    { key: "firstName", label: "First Name", type: "text", required: true, colSpan: 6, section: "Profile", placeholder: "First name" },
    { key: "lastName", label: "Last Name", type: "text", required: true, colSpan: 6, section: "Profile", placeholder: "Last name" },
    { key: "email", label: "Email", type: "email", required: true, colSpan: 6, section: "Account", placeholder: "name@company.com" },
    { key: "username", label: "Username", type: "text", required: true, colSpan: 6, section: "Account", placeholder: "Username" },
    { key: "password", label: "Temporary Password", type: "text", required: true, validators: passwordValidators, validationMessages: passwordValidationMessages, colSpan: 12, section: "Account", placeholder: "Temporary password" },
    { key: "roleIds", label: "Roles", type: "multiSelect", required: true, options: roles, colSpan: 12, section: "Access", placeholder: "Select roles" },
    { key: "phoneNumber", label: "Phone Number", type: "text", colSpan: 4, section: "Organization", placeholder: "Phone number" },
    { key: "departmentId", label: "Department Id", type: "text", colSpan: 4, section: "Organization", placeholder: "Optional department id" },
    { key: "managerId", label: "Manager Id", type: "text", colSpan: 4, section: "Organization", placeholder: "Optional manager user id" },
    { key: "isActive", label: "Active", type: "checkbox", colSpan: 12, section: "Status", defaultValue: true, visibleOn: "update" }
  ];
}

// src/app/pages/users/components/user-list/user-list.ts
function UserList_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 2);
    \u0275\u0275listener("save", function UserList_Conditional_1_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveUser($event));
    })("delete", function UserList_Conditional_1_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleUserStatus($event));
    })("bulkDelete", function UserList_Conditional_1_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deactivateUsers($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r1.columns)("data", ctx_r1.data)("fields", ctx_r1.fields)("title", ctx_r1.title)("dataNotFound", ctx_r1.dataNotFound)("errorMessage", ctx_r1.errorMessage)("bulkActionLabel", "Deactivate")("rowActionLabel", ctx_r1.rowActionLabel)("rowActionIcon", ctx_r1.rowActionIcon)("rowActionLabelResolver", ctx_r1.rowActionLabelResolver)("rowActionIconResolver", ctx_r1.rowActionIconResolver)("canCreate", ctx_r1.canCreate)("canEdit", ctx_r1.canEdit)("canRowAction", ctx_r1.canDelete)("canBulkAction", ctx_r1.canDelete)("canExport", ctx_r1.canExport);
  }
}
var UserList = class _UserList {
  userApiService;
  messageService;
  authService;
  title = "User";
  columns = UserColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No users found.";
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  constructor(userApiService, messageService, authService) {
    this.userApiService = userApiService;
    this.messageService = messageService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.users.create);
    this.canEdit = this.authService.hasPermission(Permissions.users.edit);
    this.canDelete = this.authService.hasPermission(Permissions.users.delete);
    this.canExport = this.authService.hasPermission(Permissions.users.export);
    this.loadPage();
  }
  saveUser(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.userApiService.createUser(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "User created", detail: "The user was created successfully.", life: 3e3 });
          this.loadUsers();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "User id is missing.", life: 4e3 });
      return;
    }
    this.userApiService.updateUser(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "User updated", detail: "The user was updated successfully.", life: 3e3 });
        this.loadUsers();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  toggleUserStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "User id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.userApiService.deactivateUser(id) : this.userApiService.activateUser(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `User ${action}`, detail: `The user was ${action} successfully.`, life: 3e3 });
        this.loadUsers();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivateUsers(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active users", detail: "The selected users are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.userApiService.deactivateUser(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Users deactivated", detail: `${activeIds.length} user(s) were deactivated.`, life: 3e3 });
        this.loadUsers();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  loadPage() {
    this.isLoading = true;
    forkJoin({
      roles: this.userApiService.getRoles(),
      users: this.userApiService.getUsers()
    }).subscribe({
      next: ({ roles, users }) => {
        this.fields = buildUserFields(this.toRoleOptions(roles));
        this.setUsers(users);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage users." : "Unable to load users.";
      }
    });
  }
  loadUsers() {
    this.userApiService.getUsers().subscribe({
      next: (users) => this.setUsers(users),
      error: () => {
        this.dataNotFound = true;
        this.errorMessage = "Unable to load users.";
      }
    });
  }
  setUsers(users) {
    this.data = users.map((user) => this.toGridRow(user));
    this.dataNotFound = users.length === 0;
  }
  toGridRow(user) {
    const { firstName, lastName } = this.splitFullName(user.fullName);
    return __spreadProps(__spreadValues({}, user), {
      firstName,
      lastName,
      roleIds: user.roleIds ?? [],
      rolesDisplay: user.roles?.join(", ") ?? "",
      password: ""
    });
  }
  toCreateRequest(value) {
    return {
      firstName: String(value["firstName"] ?? ""),
      lastName: String(value["lastName"] ?? ""),
      email: String(value["email"] ?? ""),
      username: String(value["username"] ?? ""),
      roleIds: this.toStringArray(value["roleIds"]),
      password: String(value["password"] ?? ""),
      generatePassword: false
    };
  }
  toUpdateRequest(value) {
    return {
      firstName: String(value["firstName"] ?? ""),
      lastName: String(value["lastName"] ?? ""),
      phoneNumber: this.optionalString(value["phoneNumber"]),
      departmentId: this.optionalString(value["departmentId"]),
      managerId: this.optionalString(value["managerId"]),
      roleIds: this.toStringArray(value["roleIds"]),
      isActive: value["isActive"] === true
    };
  }
  toRoleOptions(roles) {
    return roles.filter((role) => role.isActive).map((role) => ({ label: role.name, value: role.id }));
  }
  splitFullName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" ")
    };
  }
  getRowId(row) {
    return typeof row?.["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  toStringArray(value) {
    return Array.isArray(value) ? value.map(String) : [];
  }
  optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function UserList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserList)(\u0275\u0275directiveInject(UserApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserList, selectors: [["app-user-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 2, vars: 1, consts: [["position", "bottom-right"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"], [3, "save", "delete", "bulkDelete", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport"]], template: function UserList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275conditionalCreate(1, UserList_Conditional_1_Template, 1, 16, "app-crud", 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 1 : -1);
    }
  }, dependencies: [Crud, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserList, [{
    type: Component,
    args: [{ selector: "app-user-list", standalone: true, imports: [Crud, ToastModule], providers: [MessageService], template: `<p-toast position="bottom-right"></p-toast>\r
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
        [canCreate]="canCreate"\r
        [canEdit]="canEdit"\r
        [canRowAction]="canDelete"\r
        [canBulkAction]="canDelete"\r
        [canExport]="canExport"\r
        (save)="saveUser($event)"\r
        (delete)="toggleUserStatus($event)"\r
        (bulkDelete)="deactivateUsers($event)"\r
    />\r
}\r
` }]
  }], () => [{ type: UserApiService }, { type: MessageService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserList, { className: "UserList", filePath: "src/app/pages/users/components/user-list/user-list.ts", lineNumber: 24 });
})();

// src/app/pages/users/users.routes.ts
var users_routes_default = [{ path: "", component: UserList, canActivate: [permissionGuard(Permissions.users.view)] }];
export {
  users_routes_default as default
};
//# sourceMappingURL=chunk-U4WYUF4R.js.map
