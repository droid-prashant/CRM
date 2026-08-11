import {
  Tag,
  TagModule
} from "./chunk-QWMZLFPI.js";
import {
  NEPAL_CONTACT_NUMBER_MESSAGE,
  NEPAL_CONTACT_NUMBER_PATTERN
} from "./chunk-DH3WPG22.js";
import {
  Crud
} from "./chunk-QQ453JL3.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-UZR2OOOC.js";
import {
  Permissions
} from "./chunk-COJCLJYA.js";
import {
  DatePicker,
  DatePickerModule,
  Dialog,
  DialogModule,
  Select,
  SelectModule,
  Table,
  TableModule
} from "./chunk-ZBJQJW6L.js";
import {
  ActivatedRoute,
  AuthService,
  Router,
  permissionGuard
} from "./chunk-CPXJEDC2.js";
import "./chunk-DBLRL2R3.js";
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
  FormControlName,
  FormGroupDirective,
  FormsModule,
  HttpClient,
  MaxLengthValidator,
  MessageService,
  NgClass,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
  apiUrl,
  ɵNgNoValidate
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  Injectable,
  catchError,
  forkJoin,
  inject,
  of,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ACBHL573.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/clients/services/client-api.service.ts
var ClientApiService = class _ClientApiService {
  http;
  clientsUrl = apiUrl("/clients");
  clientContactsUrl = apiUrl("/client-contacts");
  clientProductsUrl = apiUrl("/client-products");
  constructor(http) {
    this.http = http;
  }
  getClients(query) {
    const params = Object.entries(query).reduce((accumulator, [key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        accumulator[key] = String(value);
      }
      return accumulator;
    }, {});
    return this.http.get(this.clientsUrl, { params });
  }
  getClient(id) {
    return this.http.get(`${this.clientsUrl}/${id}`);
  }
  getClientForEdit(id) {
    return this.http.get(`${this.clientsUrl}/${id}/edit`);
  }
  getClientContacts(clientId) {
    return this.http.get(`${this.clientsUrl}/${clientId}/contacts`);
  }
  getClientTimeline(clientId, query = {}) {
    const params = Object.entries(query).reduce((accumulator, [key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        accumulator[key] = String(value);
      }
      return accumulator;
    }, {});
    return this.http.get(`${this.clientsUrl}/${clientId}/timeline`, { params });
  }
  getClientRelatedSummary(clientId) {
    return this.http.get(`${this.clientsUrl}/${clientId}/related-summary`);
  }
  getClientProducts(clientId) {
    return this.http.get(`${this.clientsUrl}/${clientId}/products`);
  }
  getClientProductLookups(clientId) {
    return this.http.get(`${this.clientsUrl}/${clientId}/products/lookups`);
  }
  getLookups() {
    return this.http.get(`${this.clientsUrl}/lookups`);
  }
  getFilters() {
    return this.http.get(`${this.clientsUrl}/filters`);
  }
  createClient(request) {
    return this.http.post(this.clientsUrl, request);
  }
  updateClient(id, request) {
    return this.http.put(`${this.clientsUrl}/${id}`, request);
  }
  createClientContact(request) {
    return this.http.post(this.clientContactsUrl, request);
  }
  updateClientContact(id, request) {
    return this.http.put(`${this.clientContactsUrl}/${id}`, request);
  }
  updateClientContactStatus(id, request) {
    return this.http.patch(`${this.clientContactsUrl}/${id}/status`, request);
  }
  setPrimaryContact(id) {
    return this.http.patch(`${this.clientContactsUrl}/${id}/set-primary`, {});
  }
  createClientProduct(request) {
    return this.http.post(this.clientProductsUrl, request);
  }
  updateClientProduct(id, request) {
    return this.http.put(`${this.clientProductsUrl}/${id}`, request);
  }
  activateClient(id) {
    return this.http.patch(`${this.clientsUrl}/${id}/activate`, {});
  }
  deactivateClient(id) {
    return this.http.patch(`${this.clientsUrl}/${id}/deactivate`, {});
  }
  static \u0275fac = function ClientApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ClientApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ClientApiService, factory: _ClientApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClientApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/clients/components/client-detail/client-detail.ts
var _c0 = () => ({ "min-width": "62rem" });
var _c1 = () => ({ "min-width": "68rem" });
var _c2 = () => ({ "min-width": "58rem" });
var _c3 = () => ({ width: "min(1080px, 96vw)" });
var _c4 = () => ({ "max-height": "calc(100vh - 12rem)", overflow: "auto" });
var _c5 = () => ({ width: "min(920px, 96vw)" });
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.entityId;
function ClientDetail_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "div", 6);
    \u0275\u0275text(2, "Loading client...");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "div", 7)(2, "p", 8);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-button", 9);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_1_Template_p_button_onClick_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.backToList());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function ClientDetail_Conditional_2_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 96);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_Conditional_23_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEditDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("loading", ctx_r1.isLoadingEdit);
  }
}
function ClientDetail_Conditional_2_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 97);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_Conditional_24_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleStatus());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("label", ctx_r1.statusActionLabel)("icon", ctx_r1.statusActionIcon)("severity", ctx_r1.statusActionSeverity)("loading", ctx_r1.isSavingStatus);
  }
}
function ClientDetail_Conditional_2_Conditional_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", ctx_r1.client.website, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.client.website);
  }
}
function ClientDetail_Conditional_2_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275text(1, "Not set");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_107_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 98);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_Conditional_107_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAddContactDialog());
    });
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_109_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 99);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Designation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, ClientDetail_Conditional_2_ng_template_109_Conditional_11_Template, 2, 0, "th", 99);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(ctx_r1.canEditClient ? 11 : -1);
  }
}
function ClientDetail_Conditional_2_ng_template_111_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 101);
    \u0275\u0275text(1, "Primary contact");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_111_Conditional_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 106);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_111_Conditional_13_Conditional_3_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r9);
      const contact_r8 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPrimaryContact(contact_r8));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contact_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("disabled", !contact_r8.isActive);
  }
}
function ClientDetail_Conditional_2_ng_template_111_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td")(1, "div", 102)(2, "p-button", 103);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_111_Conditional_13_Template_p_button_onClick_2_listener() {
      \u0275\u0275restoreView(_r7);
      const contact_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEditContactDialog(contact_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ClientDetail_Conditional_2_ng_template_111_Conditional_13_Conditional_3_Template, 1, 1, "p-button", 104);
    \u0275\u0275elementStart(4, "p-button", 105);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_111_Conditional_13_Template_p_button_onClick_4_listener() {
      \u0275\u0275restoreView(_r7);
      const contact_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleContactStatus(contact_r8));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const contact_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!contact_r8.isPrimary ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("icon", contact_r8.isActive ? "pi pi-ban" : "pi pi-check-circle")("severity", contact_r8.isActive ? "danger" : "success")("disabled", contact_r8.isPrimary && contact_r8.isActive);
  }
}
function ClientDetail_Conditional_2_ng_template_111_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 100);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ClientDetail_Conditional_2_ng_template_111_Conditional_4_Template, 2, 0, "div", 101);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "p-tag", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, ClientDetail_Conditional_2_ng_template_111_Conditional_13_Template, 5, 4, "td");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contact_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-primary-50", contact_r8.isPrimary);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(contact_r8.fullName);
    \u0275\u0275advance();
    \u0275\u0275conditional(contact_r8.isPrimary ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(contact_r8.designation || contact_r8.department));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(contact_r8.email));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(contact_r8.mobile || contact_r8.phone));
    \u0275\u0275advance(2);
    \u0275\u0275property("severity", contact_r8.isActive ? "success" : "secondary")("value", contact_r8.statusName || (contact_r8.isActive ? "Active" : "Inactive"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canEditClient ? 13 : -1);
  }
}
function ClientDetail_Conditional_2_ng_template_113_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2, "No contacts recorded for this client.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r1.canEditClient ? 6 : 5);
  }
}
function ClientDetail_Conditional_2_Conditional_122_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 107);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_Conditional_122_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAddProductDialog());
    });
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_124_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 108);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Product");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Relationship");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Opportunity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Dates");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, ClientDetail_Conditional_2_ng_template_124_Conditional_13_Template, 2, 0, "th", 108);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(13);
    \u0275\u0275conditional(ctx_r1.canEditClient ? 13 : -1);
  }
}
function ClientDetail_Conditional_2_ng_template_126_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.formatDateOnly(product_r11.startDate), " - ", ctx_r1.formatDateOnly(product_r11.endDate));
  }
}
function ClientDetail_Conditional_2_ng_template_126_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Not set");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_126_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td")(1, "p-button", 103);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_126_Conditional_14_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r12);
      const product_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEditProductDialog(product_r11));
    });
    \u0275\u0275elementEnd()();
  }
}
function ClientDetail_Conditional_2_ng_template_126_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 100);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275conditionalCreate(12, ClientDetail_Conditional_2_ng_template_126_Conditional_12_Template, 2, 2, "span")(13, ClientDetail_Conditional_2_ng_template_126_Conditional_13_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, ClientDetail_Conditional_2_ng_template_126_Conditional_14_Template, 2, 0, "td");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r11.productCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r11.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(product_r11.relationshipStatus));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(product_r11.opportunityNumber || product_r11.opportunityTitle));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(product_r11.ownerUserName));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(product_r11.startDate || product_r11.endDate ? 12 : 13);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canEditClient ? 14 : -1);
  }
}
function ClientDetail_Conditional_2_ng_template_128_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2, "No products mapped to this client.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r1.canEditClient ? 7 : 6);
  }
}
function ClientDetail_Conditional_2_ng_template_137_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Product");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Stage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Status");
    \u0275\u0275elementEnd()();
  }
}
function ClientDetail_Conditional_2_ng_template_139_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 100);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opportunity_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r13.opportunityNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r13.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(opportunity_r13.productName));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(opportunity_r13.stageName));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatCurrency(opportunity_r13.estimatedValue));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(opportunity_r13.status));
  }
}
function ClientDetail_Conditional_2_ng_template_141_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 109);
    \u0275\u0275text(2, "No related opportunities found.");
    \u0275\u0275elementEnd()();
  }
}
function ClientDetail_Conditional_2_Conditional_176_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 110)(1, "div", 111);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 112);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 113);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 29);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rfp_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rfp_r14.rfpNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rfp_r14.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.optional(rfp_r14.productName), " / ", ctx_r1.optional(rfp_r14.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Due ", ctx_r1.formatDateOnly(rfp_r14.submissionDeadline));
  }
}
function ClientDetail_Conditional_2_Conditional_176_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275repeaterCreate(1, ClientDetail_Conditional_2_Conditional_176_For_2_Template, 9, 5, "article", 110, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.client.rfps);
  }
}
function ClientDetail_Conditional_2_Conditional_177_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " No related RFPs found. ");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_181_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 110)(1, "div", 111);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 62);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 113);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const document_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(document_r15.fileName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(document_r15.documentType));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.optional(document_r15.uploadedByUserName), " / ", ctx_r1.formatDate(document_r15.uploadedAt));
  }
}
function ClientDetail_Conditional_2_Conditional_181_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275repeaterCreate(1, ClientDetail_Conditional_2_Conditional_181_For_2_Template, 7, 4, "article", 110, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.client.documents);
  }
}
function ClientDetail_Conditional_2_Conditional_182_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " No documents uploaded for this client. ");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_215_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("/ ", entry_r16.createdByUserName);
  }
}
function ClientDetail_Conditional_2_Conditional_215_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 114)(1, "div", 116);
    \u0275\u0275element(2, "i", 117);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 14)(4, "div", 17)(5, "div", 111);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "p-tag", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 119);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 29);
    \u0275\u0275text(11);
    \u0275\u0275conditionalCreate(12, ClientDetail_Conditional_2_Conditional_215_For_2_Conditional_12_Template, 2, 1, "span");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const entry_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.timelineIcon(entry_r16.activityType));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(entry_r16.title);
    \u0275\u0275advance();
    \u0275\u0275property("value", entry_r16.activityType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(entry_r16.description));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(entry_r16.activityDate), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(entry_r16.createdByUserName ? 12 : -1);
  }
}
function ClientDetail_Conditional_2_Conditional_215_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 115)(1, "p-button", 120);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_Conditional_215_Conditional_3_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.loadTimeline(false));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isLoadingTimeline);
  }
}
function ClientDetail_Conditional_2_Conditional_215_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275repeaterCreate(1, ClientDetail_Conditional_2_Conditional_215_For_2_Template, 13, 6, "article", 114, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ClientDetail_Conditional_2_Conditional_215_Conditional_3_Template, 2, 1, "div", 115);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.timeline);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canLoadMoreTimeline ? 3 : -1);
  }
}
function ClientDetail_Conditional_2_Conditional_216_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " No timeline activity recorded. ");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_229_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Client name is required");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_234_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Country is required");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_234_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "label", 66);
    \u0275\u0275text(2, "Client Type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "p-select", 121);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "label", 66);
    \u0275\u0275text(6, "Country ");
    \u0275\u0275elementStart(7, "span", 68);
    \u0275\u0275text(8, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "p-select", 122);
    \u0275\u0275conditionalCreate(10, ClientDetail_Conditional_2_Conditional_234_Conditional_10_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 36)(12, "label", 66);
    \u0275\u0275text(13, "Industry");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "p-select", 123);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 73)(16, "label", 66);
    \u0275\u0275text(17, "Account Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "p-select", 124);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_19_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("options", ctx_r1.lookups.clientTypes)("showClear", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.lookups.countries);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_19_0 = ctx_r1.editForm.get("countryId")) == null ? null : tmp_19_0.errors) && ((tmp_19_0 = ctx_r1.editForm.get("countryId")) == null ? null : tmp_19_0.touched) ? 10 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.lookups.industries)("showClear", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.lookups.accountOwners)("showClear", true);
  }
}
function ClientDetail_Conditional_2_Conditional_235_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275text(1, " Loading lookup values... ");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_260_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 125);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_260_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 126);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_260_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateClient());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingClient);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingClient)("disabled", !ctx_r1.lookups);
  }
}
function ClientDetail_Conditional_2_Conditional_270_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Full name is required");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_291_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Email must be valid");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_296_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.contactNumberValidationMessage);
  }
}
function ClientDetail_Conditional_2_Conditional_301_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.contactNumberValidationMessage);
  }
}
function ClientDetail_Conditional_2_ng_template_317_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 125);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_317_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.contactDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 127);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_317_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveContact());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingContact);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingContact);
  }
}
function ClientDetail_Conditional_2_Conditional_321_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Product is required");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_321_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "Relationship status is required");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_Conditional_321_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73)(1, "label", 66);
    \u0275\u0275text(2, "Product ");
    \u0275\u0275elementStart(3, "span", 68);
    \u0275\u0275text(4, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-select", 128);
    \u0275\u0275conditionalCreate(6, ClientDetail_Conditional_2_Conditional_321_Conditional_6_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 73)(8, "label", 66);
    \u0275\u0275text(9, "Relationship Status ");
    \u0275\u0275elementStart(10, "span", 68);
    \u0275\u0275text(11, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "p-select", 129);
    \u0275\u0275conditionalCreate(13, ClientDetail_Conditional_2_Conditional_321_Conditional_13_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 73)(15, "label", 66);
    \u0275\u0275text(16, "Opportunity");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "p-select", 130);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 73)(19, "label", 66);
    \u0275\u0275text(20, "Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "p-select", 131);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_17_0;
    let tmp_19_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx_r1.productLookups.products);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_17_0 = ctx_r1.productForm.get("productId")) == null ? null : tmp_17_0.errors) && ((tmp_17_0 = ctx_r1.productForm.get("productId")) == null ? null : tmp_17_0.touched) ? 6 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.productLookups.relationshipStatuses);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_19_0 = ctx_r1.productForm.get("relationshipStatus")) == null ? null : tmp_19_0.errors) && ((tmp_19_0 = ctx_r1.productForm.get("relationshipStatus")) == null ? null : tmp_19_0.touched) ? 13 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.productLookups.opportunities)("showClear", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.productLookups.owners)("showClear", true);
  }
}
function ClientDetail_Conditional_2_Conditional_322_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275text(1, " Loading product lookup values... ");
    \u0275\u0275elementEnd();
  }
}
function ClientDetail_Conditional_2_ng_template_337_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 125);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_337_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.productDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 132);
    \u0275\u0275listener("onClick", function ClientDetail_Conditional_2_ng_template_337_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveProductMapping());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingProduct);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingProduct)("disabled", !ctx_r1.productLookups);
  }
}
function ClientDetail_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "section", 10)(2, "div", 11)(3, "div", 12)(4, "div", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 14)(7, "button", 15);
    \u0275\u0275listener("click", function ClientDetail_Conditional_2_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.backToList());
    });
    \u0275\u0275element(8, "i", 16);
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Back to Clients");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 17)(12, "h2", 18);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "p-tag", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 20)(16, "span", 21);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "div", 22);
    \u0275\u0275conditionalCreate(23, ClientDetail_Conditional_2_Conditional_23_Template, 1, 1, "p-button", 23);
    \u0275\u0275conditionalCreate(24, ClientDetail_Conditional_2_Conditional_24_Template, 1, 4, "p-button", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 25)(26, "div", 26)(27, "div", 27);
    \u0275\u0275text(28, "Account Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 28);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 29);
    \u0275\u0275text(32, "Owner for relationship governance");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 26)(34, "div", 27);
    \u0275\u0275text(35, "Contacts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 30);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 29);
    \u0275\u0275text(39, "Primary contact highlighted below");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 26)(41, "div", 27);
    \u0275\u0275text(42, "Products");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 30);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 29);
    \u0275\u0275text(46, "Mapped products and owners");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 26)(48, "div", 27);
    \u0275\u0275text(49, "Opportunities");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 30);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 29);
    \u0275\u0275text(53, "Commercial pipeline items");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "div", 31)(55, "section", 32)(56, "div", 33)(57, "h3", 34);
    \u0275\u0275text(58, "Client Profile");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 35)(60, "div", 36)(61, "div", 27);
    \u0275\u0275text(62, "Short Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 37);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(65, "div", 36)(66, "div", 27);
    \u0275\u0275text(67, "Industry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "div", 37);
    \u0275\u0275text(69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div", 36)(71, "div", 27);
    \u0275\u0275text(72, "Country");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 37);
    \u0275\u0275text(74);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 36)(76, "div", 27);
    \u0275\u0275text(77, "Tax Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "div", 37);
    \u0275\u0275text(79);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 36)(81, "div", 27);
    \u0275\u0275text(82, "Registration Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "div", 37);
    \u0275\u0275text(84);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(85, "div", 36)(86, "div", 27);
    \u0275\u0275text(87, "Website");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(88, ClientDetail_Conditional_2_Conditional_88_Template, 2, 2, "a", 38)(89, ClientDetail_Conditional_2_Conditional_89_Template, 2, 0, "div", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "div", 39)(91, "div", 27);
    \u0275\u0275text(92, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "div", 40);
    \u0275\u0275text(94);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(95, "div", 39)(96, "div", 27);
    \u0275\u0275text(97, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "div", 40);
    \u0275\u0275text(99);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(100, "div", 41)(101, "div", 42)(102, "h3", 34);
    \u0275\u0275text(103, "Contacts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "div", 17)(105, "span", 43);
    \u0275\u0275text(106);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(107, ClientDetail_Conditional_2_Conditional_107_Template, 1, 0, "p-button", 44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "p-table", 45);
    \u0275\u0275template(109, ClientDetail_Conditional_2_ng_template_109_Template, 12, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(111, ClientDetail_Conditional_2_ng_template_111_Template, 14, 10, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(113, ClientDetail_Conditional_2_ng_template_113_Template, 3, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(115, "div", 41)(116, "div", 42)(117, "h3", 34);
    \u0275\u0275text(118, "Product Mapping");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "div", 17)(120, "span", 43);
    \u0275\u0275text(121);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(122, ClientDetail_Conditional_2_Conditional_122_Template, 1, 0, "p-button", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(123, "p-table", 45);
    \u0275\u0275template(124, ClientDetail_Conditional_2_ng_template_124_Template, 14, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(126, ClientDetail_Conditional_2_ng_template_126_Template, 15, 7, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(128, ClientDetail_Conditional_2_ng_template_128_Template, 3, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(130, "div", 41)(131, "div", 42)(132, "h3", 34);
    \u0275\u0275text(133, "Related Opportunities");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "span", 43);
    \u0275\u0275text(135);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(136, "p-table", 45);
    \u0275\u0275template(137, ClientDetail_Conditional_2_ng_template_137_Template, 13, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(139, ClientDetail_Conditional_2_ng_template_139_Template, 13, 6, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(141, ClientDetail_Conditional_2_ng_template_141_Template, 3, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(143, "aside", 47)(144, "div", 33)(145, "h3", 34);
    \u0275\u0275text(146, "Related Summary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(147, "div", 48)(148, "div", 49)(149, "div", 50);
    \u0275\u0275text(150, "Opportunities");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(151, "div", 51);
    \u0275\u0275text(152);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(153, "div", 49)(154, "div", 50);
    \u0275\u0275text(155, "Interactions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(156, "div", 51);
    \u0275\u0275text(157);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(158, "div", 49)(159, "div", 50);
    \u0275\u0275text(160, "RFPs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(161, "div", 51);
    \u0275\u0275text(162);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(163, "div", 49)(164, "div", 50);
    \u0275\u0275text(165, "Tasks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "div", 51);
    \u0275\u0275text(167);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(168, "div", 52)(169, "div", 50);
    \u0275\u0275text(170, "Documents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "div", 51);
    \u0275\u0275text(172);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(173, "div", 41)(174, "h3", 34);
    \u0275\u0275text(175, "Related RFPs");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(176, ClientDetail_Conditional_2_Conditional_176_Template, 3, 0, "div", 53)(177, ClientDetail_Conditional_2_Conditional_177_Template, 2, 0, "div", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(178, "div", 41)(179, "h3", 34);
    \u0275\u0275text(180, "Documents");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(181, ClientDetail_Conditional_2_Conditional_181_Template, 3, 0, "div", 53)(182, ClientDetail_Conditional_2_Conditional_182_Template, 2, 0, "div", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "div", 41)(184, "h3", 34);
    \u0275\u0275text(185, "Audit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(186, "div", 55)(187, "div", 56)(188, "span", 57);
    \u0275\u0275text(189, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "span", 58);
    \u0275\u0275text(191);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(192, "div", 59)(193, "span", 57);
    \u0275\u0275text(194, "Created By");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "span", 58);
    \u0275\u0275text(196);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(197, "div", 59)(198, "span", 57);
    \u0275\u0275text(199, "Updated");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(200, "span", 58);
    \u0275\u0275text(201);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(202, "div", 60)(203, "span", 57);
    \u0275\u0275text(204, "Updated By");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(205, "span", 58);
    \u0275\u0275text(206);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(207, "div", 41)(208, "div", 61)(209, "div")(210, "h3", 34);
    \u0275\u0275text(211, "Timeline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(212, "div", 62);
    \u0275\u0275text(213);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(214, "p-select", 63);
    \u0275\u0275twoWayListener("ngModelChange", function ClientDetail_Conditional_2_Template_p_select_ngModelChange_214_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.timelineActivityType, $event) || (ctx_r1.timelineActivityType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function ClientDetail_Conditional_2_Template_p_select_onChange_214_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadTimeline(true));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(215, ClientDetail_Conditional_2_Conditional_215_Template, 4, 1)(216, ClientDetail_Conditional_2_Conditional_216_Template, 2, 0, "div", 54);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(217, "p-dialog", 64);
    \u0275\u0275twoWayListener("visibleChange", function ClientDetail_Conditional_2_Template_p_dialog_visibleChange_217_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editDialog, $event) || (ctx_r1.editDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(218, "form", 65)(219, "div", 36)(220, "label", 66);
    \u0275\u0275text(221, "Client Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(222, "input", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "div", 36)(224, "label", 66);
    \u0275\u0275text(225, "Client Name ");
    \u0275\u0275elementStart(226, "span", 68);
    \u0275\u0275text(227, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(228, "input", 69);
    \u0275\u0275conditionalCreate(229, ClientDetail_Conditional_2_Conditional_229_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(230, "div", 36)(231, "label", 66);
    \u0275\u0275text(232, "Short Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(233, "input", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(234, ClientDetail_Conditional_2_Conditional_234_Template, 19, 8)(235, ClientDetail_Conditional_2_Conditional_235_Template, 2, 0, "div", 72);
    \u0275\u0275elementStart(236, "div", 73)(237, "label", 66);
    \u0275\u0275text(238, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(239, "p-select", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(240, "div", 36)(241, "label", 66);
    \u0275\u0275text(242, "Website");
    \u0275\u0275elementEnd();
    \u0275\u0275element(243, "input", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(244, "div", 36)(245, "label", 66);
    \u0275\u0275text(246, "Tax Number");
    \u0275\u0275elementEnd();
    \u0275\u0275element(247, "input", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(248, "div", 36)(249, "label", 66);
    \u0275\u0275text(250, "Registration Number");
    \u0275\u0275elementEnd();
    \u0275\u0275element(251, "input", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(252, "div", 73)(253, "label", 66);
    \u0275\u0275text(254, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275element(255, "textarea", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(256, "div", 73)(257, "label", 66);
    \u0275\u0275text(258, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275element(259, "textarea", 79);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(260, ClientDetail_Conditional_2_ng_template_260_Template, 2, 3, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(262, "p-dialog", 80);
    \u0275\u0275twoWayListener("visibleChange", function ClientDetail_Conditional_2_Template_p_dialog_visibleChange_262_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.contactDialog, $event) || (ctx_r1.contactDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(263, "form", 65)(264, "div", 36)(265, "label", 66);
    \u0275\u0275text(266, "Full Name ");
    \u0275\u0275elementStart(267, "span", 68);
    \u0275\u0275text(268, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(269, "input", 81);
    \u0275\u0275conditionalCreate(270, ClientDetail_Conditional_2_Conditional_270_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(271, "div", 36)(272, "label", 66);
    \u0275\u0275text(273, "First Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(274, "input", 82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(275, "div", 36)(276, "label", 66);
    \u0275\u0275text(277, "Last Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(278, "input", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(279, "div", 36)(280, "label", 66);
    \u0275\u0275text(281, "Designation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(282, "input", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(283, "div", 36)(284, "label", 66);
    \u0275\u0275text(285, "Department");
    \u0275\u0275elementEnd();
    \u0275\u0275element(286, "input", 85);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(287, "div", 36)(288, "label", 66);
    \u0275\u0275text(289, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(290, "input", 86);
    \u0275\u0275conditionalCreate(291, ClientDetail_Conditional_2_Conditional_291_Template, 2, 0, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(292, "div", 36)(293, "label", 66);
    \u0275\u0275text(294, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(295, "input", 87);
    \u0275\u0275listener("input", function ClientDetail_Conditional_2_Template_input_input_295_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.normalizeContactNumber("phone", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(296, ClientDetail_Conditional_2_Conditional_296_Template, 2, 1, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(297, "div", 36)(298, "label", 66);
    \u0275\u0275text(299, "Mobile");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(300, "input", 88);
    \u0275\u0275listener("input", function ClientDetail_Conditional_2_Template_input_input_300_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.normalizeContactNumber("mobile", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(301, ClientDetail_Conditional_2_Conditional_301_Template, 2, 1, "span", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(302, "div", 36)(303, "label", 66);
    \u0275\u0275text(304, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(305, "p-select", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(306, "div", 36)(307, "label", 66);
    \u0275\u0275text(308, "Primary Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(309, "label", 89);
    \u0275\u0275element(310, "input", 90);
    \u0275\u0275elementStart(311, "span");
    \u0275\u0275text(312, "Mark as primary");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(313, "div", 91)(314, "label", 66);
    \u0275\u0275text(315, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275element(316, "textarea", 92);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(317, ClientDetail_Conditional_2_ng_template_317_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(319, "p-dialog", 80);
    \u0275\u0275twoWayListener("visibleChange", function ClientDetail_Conditional_2_Template_p_dialog_visibleChange_319_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.productDialog, $event) || (ctx_r1.productDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(320, "form", 65);
    \u0275\u0275conditionalCreate(321, ClientDetail_Conditional_2_Conditional_321_Template, 22, 8)(322, ClientDetail_Conditional_2_Conditional_322_Template, 2, 0, "div", 72);
    \u0275\u0275elementStart(323, "div", 73)(324, "label", 66);
    \u0275\u0275text(325, "Start Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(326, "p-datepicker", 93, 4);
    \u0275\u0275listener("onSelect", function ClientDetail_Conditional_2_Template_p_datepicker_onSelect_326_listener() {
      \u0275\u0275restoreView(_r3);
      const startDatePicker_r20 = \u0275\u0275reference(327);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(startDatePicker_r20));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(328, "div", 73)(329, "label", 66);
    \u0275\u0275text(330, "End Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(331, "p-datepicker", 94, 5);
    \u0275\u0275listener("onSelect", function ClientDetail_Conditional_2_Template_p_datepicker_onSelect_331_listener() {
      \u0275\u0275restoreView(_r3);
      const endDatePicker_r21 = \u0275\u0275reference(332);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(endDatePicker_r21));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(333, "div", 95)(334, "label", 66);
    \u0275\u0275text(335, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275element(336, "textarea", 92);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(337, ClientDetail_Conditional_2_ng_template_337_Template, 2, 3, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_68_0;
    let tmp_77_0;
    let tmp_78_0;
    let tmp_79_0;
    let tmp_80_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.initials, " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.client.name);
    \u0275\u0275advance();
    \u0275\u0275property("severity", ctx_r1.statusSeverity)("value", ctx_r1.client.statusName || (ctx_r1.client.isActive ? "Active" : "Inactive"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.client.clientCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.clientTypeName));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.countryName));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canEditClient ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canShowStatusAction ? 24 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.accountOwnerUserName || ctx_r1.client.accountOwnerUserId));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.contacts.length);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.productMappings.length);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalOpportunities);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.shortName));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.industryName));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.client.countryName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.taxNumber));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.registrationNumber));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.client.website ? 88 : 89);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.address));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.notes));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.contacts.length, " item(s)");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canEditClient ? 107 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.contacts)("tableStyle", \u0275\u0275pureFunction0(79, _c0));
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate1("", ctx_r1.productMappings.length, " item(s)");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canEditClient ? 122 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.productMappings)("tableStyle", \u0275\u0275pureFunction0(80, _c1));
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate1("", ctx_r1.client.opportunities.length, " item(s)");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.client.opportunities)("tableStyle", \u0275\u0275pureFunction0(81, _c2));
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalOpportunities);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalInteractions);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalRfps);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalTasks);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.relatedSummary.totalDocuments);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.client.rfps.length ? 176 : 177);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.client.documents.length ? 181 : 182);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.client.createdAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.createdBy));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.client.updatedAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.client.updatedBy));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.timelineResponse.totalCount, " activity item(s)");
    \u0275\u0275advance();
    \u0275\u0275property("options", ctx_r1.timelineActivityOptions);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.timelineActivityType);
    \u0275\u0275property("showClear", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.timeline.length ? 215 : 216);
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(82, _c3));
    \u0275\u0275twoWayProperty("visible", ctx_r1.editDialog);
    \u0275\u0275property("modal", true)("contentStyle", \u0275\u0275pureFunction0(83, _c4));
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.editForm);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(((tmp_68_0 = ctx_r1.editForm.get("name")) == null ? null : tmp_68_0.errors) && ((tmp_68_0 = ctx_r1.editForm.get("name")) == null ? null : tmp_68_0.touched) ? 229 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.lookups ? 234 : 235);
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx_r1.statusOptions);
    \u0275\u0275advance(23);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(84, _c5));
    \u0275\u0275twoWayProperty("visible", ctx_r1.contactDialog);
    \u0275\u0275property("modal", true)("contentStyle", \u0275\u0275pureFunction0(85, _c4))("header", ctx_r1.contactMode === "create" ? "Add Contact" : "Edit Contact");
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.contactForm);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_77_0 = ctx_r1.contactForm.get("fullName")) == null ? null : tmp_77_0.errors) && ((tmp_77_0 = ctx_r1.contactForm.get("fullName")) == null ? null : tmp_77_0.touched) ? 270 : -1);
    \u0275\u0275advance(21);
    \u0275\u0275conditional(((tmp_78_0 = ctx_r1.contactForm.get("email")) == null ? null : tmp_78_0.errors) && ((tmp_78_0 = ctx_r1.contactForm.get("email")) == null ? null : tmp_78_0.touched) ? 291 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_79_0 = ctx_r1.contactForm.get("phone")) == null ? null : tmp_79_0.hasError("pattern")) && ((tmp_79_0 = ctx_r1.contactForm.get("phone")) == null ? null : tmp_79_0.touched) ? 296 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_80_0 = ctx_r1.contactForm.get("mobile")) == null ? null : tmp_80_0.hasError("pattern")) && ((tmp_80_0 = ctx_r1.contactForm.get("mobile")) == null ? null : tmp_80_0.touched) ? 301 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.statusOptions);
    \u0275\u0275advance(14);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(86, _c5));
    \u0275\u0275twoWayProperty("visible", ctx_r1.productDialog);
    \u0275\u0275property("modal", true)("contentStyle", \u0275\u0275pureFunction0(87, _c4))("header", ctx_r1.productMode === "create" ? "Add Product Mapping" : "Edit Product Mapping");
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.productForm);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.productLookups ? 321 : 322);
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
  }
}
var ClientDetail = class _ClientDetail {
  route;
  router;
  clientApiService;
  authService;
  messageService;
  timelinePageSize = 10;
  client;
  contacts = [];
  productMappings = [];
  timelineResponse = this.emptyTimelineResponse();
  relatedSummary = this.emptyRelatedSummary();
  lookups;
  productLookups;
  isLoading = true;
  isSavingStatus = false;
  isSavingClient = false;
  isSavingContact = false;
  isSavingProduct = false;
  isLoadingTimeline = false;
  isLoadingEdit = false;
  isLoadingProductLookups = false;
  editDialog = false;
  contactDialog = false;
  productDialog = false;
  contactMode = "create";
  productMode = "create";
  selectedContact;
  selectedProduct;
  errorMessage = "";
  canEditClient = false;
  canDeleteClient = false;
  timelineActivityType = null;
  statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 2 }
  ];
  contactNumberValidationMessage = NEPAL_CONTACT_NUMBER_MESSAGE;
  fb = inject(FormBuilder);
  editForm = this.fb.group({
    clientCode: [{ value: "", disabled: true }],
    name: ["", Validators.required],
    shortName: [""],
    clientTypeId: [""],
    countryId: ["", Validators.required],
    industryId: [""],
    accountOwnerUserId: [""],
    website: [""],
    taxNumber: [""],
    registrationNumber: [""],
    address: [""],
    notes: [""],
    status: [1, Validators.required]
  });
  contactForm = this.fb.group({
    firstName: [""],
    lastName: [""],
    fullName: ["", Validators.required],
    designation: [""],
    department: [""],
    email: ["", Validators.email],
    phone: ["", Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)],
    mobile: ["", Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)],
    isPrimary: [false],
    status: [1, Validators.required],
    notes: [""]
  });
  productForm = this.fb.group({
    productId: ["", Validators.required],
    relationshipStatus: ["", Validators.required],
    opportunityId: [""],
    ownerUserId: [""],
    startDate: [""],
    endDate: [""],
    notes: [""]
  });
  constructor(route, router, clientApiService, authService, messageService) {
    this.route = route;
    this.router = router;
    this.clientApiService = clientApiService;
    this.authService = authService;
    this.messageService = messageService;
  }
  ngOnInit() {
    this.canEditClient = this.authService.hasPermission(Permissions.clients.edit);
    this.canDeleteClient = this.authService.hasPermission(Permissions.clients.delete);
    this.loadClient();
  }
  loadClient() {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.errorMessage = "Client id is missing.";
      this.isLoading = false;
      return;
    }
    forkJoin({
      client: this.clientApiService.getClient(id),
      contacts: this.clientApiService.getClientContacts(id).pipe(catchError(() => of([]))),
      products: this.clientApiService.getClientProducts(id).pipe(catchError(() => of([]))),
      timeline: this.clientApiService.getClientTimeline(id, { pageNumber: 1, pageSize: this.timelinePageSize }).pipe(catchError(() => of(this.emptyTimelineResponse()))),
      relatedSummary: this.clientApiService.getClientRelatedSummary(id).pipe(catchError(() => of(this.emptyRelatedSummary())))
    }).subscribe({
      next: ({ client, contacts, products, timeline, relatedSummary }) => {
        this.client = client;
        this.contacts = contacts;
        this.productMappings = products;
        this.timelineResponse = timeline;
        this.relatedSummary = relatedSummary;
        this.errorMessage = "";
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.status === 403 ? "You are not allowed to view this client." : "Client was not found.";
        this.isLoading = false;
      }
    });
  }
  toggleStatus() {
    if (!this.client || !this.canShowStatusAction) {
      return;
    }
    const request = this.client.isActive ? this.clientApiService.deactivateClient(this.client.id) : this.clientApiService.activateClient(this.client.id);
    const action = this.client.isActive ? "deactivated" : "activated";
    this.isSavingStatus = true;
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Client ${action}`, detail: `The client was ${action} successfully.`, life: 3e3 });
        this.loadClient();
        this.isSavingStatus = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Client status could not be updated.";
        this.messageService.add({ severity: "error", summary: "Status update failed", detail, life: 5e3 });
        this.isSavingStatus = false;
      }
    });
  }
  openEditDialog() {
    if (!this.client || !this.canEditClient) {
      return;
    }
    this.isLoadingEdit = true;
    this.clientApiService.getClientForEdit(this.client.id).subscribe({
      next: (client) => {
        this.editForm.reset({
          clientCode: client.clientCode,
          name: client.name,
          shortName: client.shortName ?? "",
          clientTypeId: client.clientTypeId ?? "",
          countryId: client.countryId,
          industryId: client.industryId ?? "",
          accountOwnerUserId: client.accountOwnerUserId ?? "",
          website: client.website ?? "",
          taxNumber: client.taxNumber ?? "",
          registrationNumber: client.registrationNumber ?? "",
          address: client.address ?? "",
          notes: client.notes ?? "",
          status: client.status || (client.isActive ? 1 : 2)
        });
        this.editDialog = true;
        this.isLoadingEdit = false;
        this.loadLookups();
      },
      error: (error) => {
        const detail = error.status === 403 ? "You are not allowed to edit this client." : "Client edit data could not be loaded.";
        this.messageService.add({ severity: "error", summary: "Edit unavailable", detail, life: 5e3 });
        this.isLoadingEdit = false;
      }
    });
  }
  updateClient() {
    if (!this.client) {
      return;
    }
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    }
    this.isSavingClient = true;
    const value = this.editForm.getRawValue();
    const status = value.status ?? 1;
    this.clientApiService.updateClient(this.client.id, {
      name: value.name ?? "",
      shortName: this.optionalFormString(value.shortName),
      clientTypeId: this.optionalFormString(value.clientTypeId),
      industryId: this.optionalFormString(value.industryId),
      countryId: value.countryId ?? "",
      address: this.optionalFormString(value.address),
      website: this.optionalFormString(value.website),
      taxNumber: this.optionalFormString(value.taxNumber),
      registrationNumber: this.optionalFormString(value.registrationNumber),
      accountOwnerUserId: this.optionalFormString(value.accountOwnerUserId),
      notes: this.optionalFormString(value.notes),
      status,
      isActive: status === 1
    }).subscribe({
      next: (client) => {
        this.messageService.add({ severity: "success", summary: "Client updated", detail: `${client.clientCode} was updated successfully.`, life: 3e3 });
        this.editDialog = false;
        this.loadClient();
        this.isSavingClient = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Client could not be updated.";
        this.messageService.add({ severity: "error", summary: "Update failed", detail, life: 6e3 });
        this.isSavingClient = false;
      }
    });
  }
  loadTimeline(resetPage = true) {
    if (!this.client || this.isLoadingTimeline) {
      return;
    }
    const nextPage = resetPage ? 1 : this.timelineResponse.pageNumber + 1;
    this.isLoadingTimeline = true;
    this.clientApiService.getClientTimeline(this.client.id, {
      activityType: this.timelineActivityType,
      pageNumber: nextPage,
      pageSize: this.timelinePageSize
    }).subscribe({
      next: (response) => {
        this.timelineResponse = resetPage ? response : __spreadProps(__spreadValues({}, response), {
          items: [...this.timelineResponse.items, ...response.items]
        });
        this.isLoadingTimeline = false;
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Timeline unavailable", detail: "Client timeline could not be loaded.", life: 5e3 });
        this.isLoadingTimeline = false;
      }
    });
  }
  openAddContactDialog() {
    if (!this.client || !this.canEditClient) {
      return;
    }
    this.contactMode = "create";
    this.selectedContact = void 0;
    this.contactForm.reset({
      firstName: "",
      lastName: "",
      fullName: "",
      designation: "",
      department: "",
      email: "",
      phone: "",
      mobile: "",
      isPrimary: false,
      status: 1,
      notes: ""
    });
    this.contactForm.controls.isPrimary.enable();
    this.contactDialog = true;
  }
  openEditContactDialog(contact) {
    if (!this.canEditClient) {
      return;
    }
    this.contactMode = "update";
    this.selectedContact = contact;
    this.contactForm.reset({
      firstName: contact.firstName ?? "",
      lastName: contact.lastName ?? "",
      fullName: contact.fullName,
      designation: contact.designation ?? "",
      department: contact.department ?? "",
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      mobile: contact.mobile ?? "",
      isPrimary: contact.isPrimary,
      status: contact.status || (contact.isActive ? 1 : 2),
      notes: contact.notes ?? ""
    });
    this.contactForm.controls.isPrimary.disable();
    this.contactDialog = true;
  }
  saveContact() {
    if (!this.client) {
      return;
    }
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }
    const value = this.contactForm.getRawValue();
    this.isSavingContact = true;
    const request = this.contactMode === "create" ? this.clientApiService.createClientContact({
      clientId: this.client.id,
      firstName: value.firstName ?? "",
      lastName: value.lastName ?? "",
      fullName: value.fullName ?? "",
      designation: this.optionalFormString(value.designation),
      department: this.optionalFormString(value.department),
      email: this.optionalFormString(value.email),
      phone: this.optionalFormString(value.phone),
      mobile: this.optionalFormString(value.mobile),
      isPrimary: value.isPrimary === true,
      notes: this.optionalFormString(value.notes)
    }) : this.clientApiService.updateClientContact(this.selectedContact?.id ?? "", {
      contactId: this.selectedContact?.id ?? "",
      firstName: value.firstName ?? "",
      lastName: value.lastName ?? "",
      fullName: value.fullName ?? "",
      designation: this.optionalFormString(value.designation),
      department: this.optionalFormString(value.department),
      email: this.optionalFormString(value.email),
      phone: this.optionalFormString(value.phone),
      mobile: this.optionalFormString(value.mobile),
      status: value.status ?? 1,
      notes: this.optionalFormString(value.notes)
    });
    request.subscribe({
      next: () => {
        const summary = this.contactMode === "create" ? "Contact added" : "Contact updated";
        this.messageService.add({ severity: "success", summary, detail: "Client contact details were saved.", life: 3e3 });
        this.contactDialog = false;
        this.loadClient();
        this.isSavingContact = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Contact could not be saved.";
        this.messageService.add({ severity: "error", summary: "Contact save failed", detail, life: 6e3 });
        this.isSavingContact = false;
      }
    });
  }
  toggleContactStatus(contact) {
    if (!this.canEditClient) {
      return;
    }
    const isActive = contact.isActive !== true;
    const action = isActive ? "activated" : "deactivated";
    this.clientApiService.updateClientContactStatus(contact.id, { isActive }).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Contact ${action}`, detail: `${contact.fullName} was ${action}.`, life: 3e3 });
        this.loadClient();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Contact status could not be updated.";
        this.messageService.add({ severity: "error", summary: "Status update failed", detail, life: 5e3 });
      }
    });
  }
  setPrimaryContact(contact) {
    if (!this.canEditClient || contact.isPrimary || !contact.isActive) {
      return;
    }
    this.clientApiService.setPrimaryContact(contact.id).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Primary contact updated", detail: `${contact.fullName} is now the primary contact.`, life: 3e3 });
        this.loadClient();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Primary contact could not be updated.";
        this.messageService.add({ severity: "error", summary: "Primary update failed", detail, life: 5e3 });
      }
    });
  }
  openAddProductDialog() {
    if (!this.client || !this.canEditClient) {
      return;
    }
    this.productMode = "create";
    this.selectedProduct = void 0;
    this.productForm.reset({
      productId: "",
      relationshipStatus: "",
      opportunityId: "",
      ownerUserId: "",
      startDate: "",
      endDate: "",
      notes: ""
    });
    this.productDialog = true;
    this.loadProductLookups();
  }
  openEditProductDialog(product) {
    if (!this.canEditClient) {
      return;
    }
    this.productMode = "update";
    this.selectedProduct = product;
    this.productForm.reset({
      productId: product.productId,
      relationshipStatus: product.relationshipStatus,
      opportunityId: product.opportunityId ?? "",
      ownerUserId: product.ownerUserId ?? "",
      startDate: this.toDateInputValue(product.startDate),
      endDate: this.toDateInputValue(product.endDate),
      notes: product.notes ?? ""
    });
    this.productDialog = true;
    this.loadProductLookups();
  }
  saveProductMapping() {
    if (!this.client) {
      return;
    }
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      return;
    }
    const value = this.productForm.getRawValue();
    this.isSavingProduct = true;
    const request = {
      productId: value.productId ?? "",
      relationshipStatus: value.relationshipStatus ?? "",
      opportunityId: this.optionalFormString(value.opportunityId),
      ownerUserId: this.optionalFormString(value.ownerUserId),
      startDate: this.optionalFormString(value.startDate),
      endDate: this.optionalFormString(value.endDate),
      notes: this.optionalFormString(value.notes)
    };
    const saveRequest = this.productMode === "create" ? this.clientApiService.createClientProduct(__spreadValues({ clientId: this.client.id }, request)) : this.clientApiService.updateClientProduct(this.selectedProduct?.id ?? "", request);
    saveRequest.subscribe({
      next: () => {
        const summary = this.productMode === "create" ? "Product mapped" : "Product mapping updated";
        this.messageService.add({ severity: "success", summary, detail: "Client product mapping was saved.", life: 3e3 });
        this.productDialog = false;
        this.loadClient();
        this.isSavingProduct = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Product mapping could not be saved.";
        this.messageService.add({ severity: "error", summary: "Product mapping failed", detail, life: 6e3 });
        this.isSavingProduct = false;
      }
    });
  }
  backToList() {
    this.router.navigate(["/pages/clients"]);
  }
  get statusSeverity() {
    if (!this.client?.isActive) {
      return "secondary";
    }
    switch (this.client.statusName?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "info";
    }
  }
  get canShowStatusAction() {
    return this.client?.isActive === true ? this.canDeleteClient : this.canEditClient;
  }
  get statusActionLabel() {
    return this.client?.isActive === true ? "Deactivate" : "Activate";
  }
  get statusActionIcon() {
    return this.client?.isActive === true ? "pi pi-ban" : "pi pi-check-circle";
  }
  get statusActionSeverity() {
    return this.client?.isActive === true ? "danger" : "success";
  }
  get initials() {
    const words = (this.client?.name ?? "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return "CL";
    }
    return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  }
  get timeline() {
    return this.timelineResponse.items;
  }
  get timelineActivityOptions() {
    return this.timelineResponse.activityTypes.map((activityType) => ({ label: activityType, value: activityType }));
  }
  get canLoadMoreTimeline() {
    return this.timelineResponse.pageNumber < this.timelineResponse.totalPages;
  }
  timelineIcon(eventType) {
    const normalized = eventType?.toLowerCase() ?? "";
    if (normalized.includes("opportunity"))
      return "pi pi-chart-line";
    if (normalized.includes("interaction") || normalized.includes("call") || normalized.includes("meeting"))
      return "pi pi-comments";
    if (normalized.includes("lead"))
      return "pi pi-briefcase";
    if (normalized.includes("created"))
      return "pi pi-plus";
    if (normalized.includes("updated"))
      return "pi pi-pencil";
    if (normalized.includes("activated"))
      return "pi pi-check-circle";
    if (normalized.includes("deactivated") || normalized.includes("deleted"))
      return "pi pi-ban";
    return "pi pi-clock";
  }
  formatDate(value) {
    return value ? new Date(value).toLocaleString() : "Not set";
  }
  formatDateOnly(value) {
    return value ? new Date(value).toLocaleDateString() : "Not set";
  }
  closeDatePicker(picker) {
    setTimeout(() => picker.hideOverlay(), 0);
  }
  normalizeContactNumber(controlName, event) {
    const input = event.target;
    const value = input.value.replace(/\D/g, "").slice(0, 10);
    if (input.value === value) {
      return;
    }
    input.value = value;
    this.contactForm.controls[controlName].setValue(value);
  }
  formatCurrency(value) {
    return new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(value ?? 0);
  }
  optional(value) {
    return value === void 0 || value === null || value === "" ? "Not set" : String(value);
  }
  loadLookups() {
    if (this.lookups) {
      return;
    }
    this.clientApiService.getLookups().subscribe({
      next: (lookups) => {
        this.lookups = lookups;
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Lookups unavailable", detail: "Client lookup values could not be loaded.", life: 5e3 });
      }
    });
  }
  loadProductLookups() {
    if (!this.client || this.productLookups || this.isLoadingProductLookups) {
      return;
    }
    this.isLoadingProductLookups = true;
    this.clientApiService.getClientProductLookups(this.client.id).subscribe({
      next: (lookups) => {
        this.productLookups = lookups;
        this.isLoadingProductLookups = false;
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Product lookups unavailable", detail: "Product mapping lookup values could not be loaded.", life: 5e3 });
        this.isLoadingProductLookups = false;
      }
    });
  }
  optionalFormString(value) {
    return value?.trim() ? value.trim() : null;
  }
  toDateInputValue(value) {
    return value ? new Date(value).toISOString().slice(0, 10) : "";
  }
  emptyTimelineResponse() {
    return {
      items: [],
      pageNumber: 1,
      pageSize: this.timelinePageSize,
      totalCount: 0,
      totalPages: 0,
      activityTypes: []
    };
  }
  emptyRelatedSummary() {
    return {
      totalOpportunities: 0,
      totalRfps: 0,
      totalTasks: 0,
      totalDocuments: 0,
      totalInteractions: 0
    };
  }
  static \u0275fac = function ClientDetail_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ClientDetail)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ClientApiService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientDetail, selectors: [["app-client-detail"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 3, vars: 1, consts: [["header", ""], ["body", ""], ["emptymessage", ""], ["footer", ""], ["startDatePicker", ""], ["endDatePicker", ""], [1, "card", "text-surface-600", "dark:text-surface-300"], [1, "card"], [1, "m-0", "text-red-600"], ["label", "Back to Clients", "icon", "pi pi-arrow-left", "text", "", 3, "onClick"], [1, "mb-4", "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "flex", "flex-wrap", "items-start", "justify-between", "gap-4"], [1, "flex", "min-w-0", "gap-4"], [1, "flex", "h-14", "w-14", "shrink-0", "items-center", "justify-center", "rounded-lg", "bg-primary", "text-xl", "font-semibold", "text-primary-contrast"], [1, "min-w-0"], ["type", "button", 1, "mb-2", "inline-flex", "cursor-pointer", "items-center", "gap-2", "border-0", "bg-transparent", "p-0", "text-sm", "text-primary", 3, "click"], [1, "pi", "pi-arrow-left", "text-xs"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "m-0", "text-2xl", "font-semibold", "text-surface-900", "dark:text-surface-0"], [3, "severity", "value"], [1, "mt-2", "flex", "flex-wrap", "items-center", "gap-x-3", "gap-y-1", "text-sm", "text-surface-600", "dark:text-surface-300"], [1, "font-medium", "text-surface-800", "dark:text-surface-100"], [1, "flex", "flex-wrap", "justify-end", "gap-2"], ["label", "Edit", "icon", "pi pi-pencil", "severity", "secondary", "outlined", "", 3, "loading"], ["outlined", "", 3, "label", "icon", "severity", "loading"], [1, "mt-5", "grid", "grid-cols-12", "gap-3"], [1, "col-span-12", "rounded-md", "border", "border-surface-200", "px-4", "py-3", "dark:border-surface-700", "md:col-span-3"], [1, "text-xs", "font-semibold", "uppercase", "text-surface-500"], [1, "mt-1", "truncate", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "mt-1", "text-xs", "text-surface-500"], [1, "mt-1", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "xl:col-span-8"], [1, "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "m-0", "text-lg", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "mt-4", "grid", "grid-cols-12", "gap-x-6", "gap-y-5"], [1, "col-span-12", "md:col-span-4"], [1, "mt-1", "font-medium", "text-surface-900", "dark:text-surface-0"], ["target", "_blank", "rel", "noopener", 1, "mt-1", "block", "truncate", "font-medium", "text-primary", 3, "href"], [1, "col-span-12", "border-t", "border-surface-200", "pt-4", "dark:border-surface-700"], [1, "mt-1", "whitespace-pre-line", "text-surface-800", "dark:text-surface-100"], [1, "mt-4", "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "mb-4", "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "rounded-md", "bg-surface-100", "px-3", "py-1", "text-sm", "font-medium", "text-surface-700", "dark:bg-surface-800", "dark:text-surface-200"], ["label", "Add Contact", "icon", "pi pi-plus", "size", "small", "outlined", ""], [3, "value", "tableStyle"], ["label", "Add Product", "icon", "pi pi-plus", "size", "small", "outlined", ""], [1, "col-span-12", "xl:col-span-4"], [1, "mt-4", "grid", "grid-cols-2", "gap-3"], [1, "rounded-md", "border", "border-surface-200", "px-3", "py-2", "dark:border-surface-700"], [1, "text-xs", "uppercase", "text-surface-500"], [1, "mt-1", "text-lg", "font-semibold"], [1, "col-span-2", "rounded-md", "border", "border-surface-200", "px-3", "py-2", "dark:border-surface-700"], [1, "mt-4", "flex", "flex-col", "gap-3"], [1, "mt-4", "rounded-md", "border", "border-dashed", "border-surface-300", "p-6", "text-center", "text-surface-500", "dark:border-surface-700"], [1, "mt-4", "divide-y", "divide-surface-200", "dark:divide-surface-700"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3", "first:pt-0"], [1, "text-sm", "text-surface-500"], [1, "text-right", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3", "last:pb-0"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "mt-1", "text-sm", "text-surface-500"], ["optionLabel", "label", "optionValue", "value", "placeholder", "All activity", "appendTo", "body", 1, "min-w-44", 3, "ngModelChange", "onChange", "options", "ngModel", "showClear"], ["header", "Edit Client", 3, "visibleChange", "visible", "modal", "contentStyle"], [1, "grid", "grid-cols-12", "gap-4", 3, "formGroup"], [1, "mb-2", "block", "text-sm", "font-semibold", "text-surface-700", "dark:text-surface-200"], ["pInputText", "", "formControlName", "clientCode", 1, "w-full"], [1, "text-red-500"], ["pInputText", "", "formControlName", "name", 1, "w-full"], [1, "p-error", "mt-1", "block", "text-sm", "text-red-600"], ["pInputText", "", "formControlName", "shortName", 1, "w-full"], [1, "col-span-12", "rounded-md", "border", "border-dashed", "border-surface-300", "p-4", "text-sm", "text-surface-500", "dark:border-surface-700"], [1, "col-span-12", "md:col-span-6"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "status", 1, "w-full", 3, "options"], ["pInputText", "", "formControlName", "website", 1, "w-full"], ["pInputText", "", "formControlName", "taxNumber", 1, "w-full"], ["pInputText", "", "formControlName", "registrationNumber", 1, "w-full"], ["pTextarea", "", "rows", "4", "formControlName", "address", 1, "w-full"], ["pTextarea", "", "rows", "4", "formControlName", "notes", 1, "w-full"], [3, "visibleChange", "visible", "modal", "contentStyle", "header"], ["pInputText", "", "formControlName", "fullName", 1, "w-full"], ["pInputText", "", "formControlName", "firstName", 1, "w-full"], ["pInputText", "", "formControlName", "lastName", 1, "w-full"], ["pInputText", "", "formControlName", "designation", 1, "w-full"], ["pInputText", "", "formControlName", "department", 1, "w-full"], ["pInputText", "", "formControlName", "email", 1, "w-full"], ["pInputText", "", "formControlName", "phone", "inputmode", "numeric", "maxlength", "10", 1, "w-full", 3, "input"], ["pInputText", "", "formControlName", "mobile", "inputmode", "numeric", "maxlength", "10", 1, "w-full", 3, "input"], [1, "flex", "h-10", "items-center", "gap-2", "text-sm", "text-surface-700", "dark:text-surface-200"], ["type", "checkbox", "formControlName", "isPrimary"], [1, "col-span-12", "md:col-span-8"], ["pTextarea", "", "rows", "3", "formControlName", "notes", 1, "w-full"], ["formControlName", "startDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "endDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], [1, "col-span-12"], ["label", "Edit", "icon", "pi pi-pencil", "severity", "secondary", "outlined", "", 3, "onClick", "loading"], ["outlined", "", 3, "onClick", "label", "icon", "severity", "loading"], ["label", "Add Contact", "icon", "pi pi-plus", "size", "small", "outlined", "", 3, "onClick"], [1, "w-32"], [1, "font-medium"], [1, "text-xs", "text-primary"], [1, "flex", "gap-1"], ["icon", "pi pi-pencil", "text", "", "rounded", "", "severity", "secondary", 3, "onClick"], ["icon", "pi pi-star", "text", "", "rounded", "", "severity", "warn", "ariaLabel", "Set primary contact", 3, "disabled"], ["text", "", "rounded", "", 3, "onClick", "icon", "severity", "disabled"], ["icon", "pi pi-star", "text", "", "rounded", "", "severity", "warn", "ariaLabel", "Set primary contact", 3, "onClick", "disabled"], ["label", "Add Product", "icon", "pi pi-plus", "size", "small", "outlined", "", 3, "onClick"], [1, "w-20"], ["colspan", "6"], [1, "rounded-md", "border", "border-surface-200", "p-4", "dark:border-surface-700"], [1, "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "mt-1", "text-sm", "text-surface-700", "dark:text-surface-200"], [1, "mt-2", "text-xs", "text-surface-500"], [1, "flex", "gap-3", "rounded-md", "border", "border-surface-200", "p-4", "dark:border-surface-700"], [1, "mt-4", "text-center"], [1, "flex", "h-9", "w-9", "shrink-0", "items-center", "justify-center", "rounded-md", "bg-surface-100", "text-primary", "dark:bg-surface-800"], [3, "ngClass"], ["severity", "info", 3, "value"], [1, "mt-1", "text-sm", "leading-6", "text-surface-700", "dark:text-surface-200"], ["label", "Load More", "icon", "pi pi-chevron-down", "outlined", "", "size", "small", 3, "onClick", "loading"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "clientTypeId", 1, "w-full", 3, "options", "showClear"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "countryId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "industryId", 1, "w-full", 3, "options", "showClear"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "accountOwnerUserId", 1, "w-full", 3, "options", "showClear"], ["label", "Cancel", "icon", "pi pi-times", "text", "", 3, "onClick", "disabled"], ["label", "Save", "icon", "pi pi-check", 3, "onClick", "loading", "disabled"], ["label", "Save Contact", "icon", "pi pi-check", 3, "onClick", "loading"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "productId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "code", "appendTo", "body", "formControlName", "relationshipStatus", 1, "w-full", 3, "options"], ["optionLabel", "displayName", "optionValue", "id", "appendTo", "body", "formControlName", "opportunityId", 1, "w-full", 3, "options", "showClear"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "ownerUserId", 1, "w-full", 3, "options", "showClear"], ["label", "Save Mapping", "icon", "pi pi-check", 3, "onClick", "loading", "disabled"]], template: function ClientDetail_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ClientDetail_Conditional_0_Template, 3, 0)(1, ClientDetail_Conditional_1_Template, 5, 1)(2, ClientDetail_Conditional_2_Template, 339, 88);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isLoading ? 0 : ctx.errorMessage ? 1 : ctx.client ? 2 : -1);
    }
  }, dependencies: [ButtonModule, Button, CommonModule, NgClass, DatePickerModule, DatePicker, DialogModule, Dialog, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, NgModel, InputTextModule, InputText, ReactiveFormsModule, FormGroupDirective, FormControlName, SelectModule, Select, TableModule, Table, TagModule, Tag, TextareaModule, Textarea, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClientDetail, [{
    type: Component,
    args: [{ selector: "app-client-detail", standalone: true, imports: [ButtonModule, CommonModule, DatePickerModule, DialogModule, FormsModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule], providers: [MessageService], template: `@if (isLoading) {\r
    <p-toast />\r
    <div class="card text-surface-600 dark:text-surface-300">Loading client...</div>\r
} @else if (errorMessage) {\r
    <p-toast />\r
    <div class="card">\r
        <p class="m-0 text-red-600">{{ errorMessage }}</p>\r
        <p-button label="Back to Clients" icon="pi pi-arrow-left" text (onClick)="backToList()" />\r
    </div>\r
} @else if (client) {\r
    <p-toast />\r
\r
    <section class="mb-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
        <div class="flex flex-wrap items-start justify-between gap-4">\r
            <div class="flex min-w-0 gap-4">\r
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-semibold text-primary-contrast">\r
                    {{ initials }}\r
                </div>\r
                <div class="min-w-0">\r
                    <button type="button" class="mb-2 inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm text-primary" (click)="backToList()">\r
                        <i class="pi pi-arrow-left text-xs"></i>\r
                        <span>Back to Clients</span>\r
                    </button>\r
                    <div class="flex flex-wrap items-center gap-2">\r
                        <h2 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ client.name }}</h2>\r
                        <p-tag [severity]="statusSeverity" [value]="client.statusName || (client.isActive ? 'Active' : 'Inactive')" />\r
                    </div>\r
                    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-600 dark:text-surface-300">\r
                        <span class="font-medium text-surface-800 dark:text-surface-100">{{ client.clientCode }}</span>\r
                        <span>{{ optional(client.clientTypeName) }}</span>\r
                        <span>{{ optional(client.countryName) }}</span>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="flex flex-wrap justify-end gap-2">\r
                @if (canEditClient) {\r
                    <p-button label="Edit" icon="pi pi-pencil" severity="secondary" outlined [loading]="isLoadingEdit" (onClick)="openEditDialog()" />\r
                }\r
                @if (canShowStatusAction) {\r
                    <p-button [label]="statusActionLabel" [icon]="statusActionIcon" [severity]="statusActionSeverity" outlined [loading]="isSavingStatus" (onClick)="toggleStatus()" />\r
                }\r
            </div>\r
        </div>\r
\r
        <div class="mt-5 grid grid-cols-12 gap-3">\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Account Owner</div>\r
                <div class="mt-1 truncate font-semibold text-surface-900 dark:text-surface-0">{{ optional(client.accountOwnerUserName || client.accountOwnerUserId) }}</div>\r
                <div class="mt-1 text-xs text-surface-500">Owner for relationship governance</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Contacts</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ contacts.length }}</div>\r
                <div class="mt-1 text-xs text-surface-500">Primary contact highlighted below</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Products</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ productMappings.length }}</div>\r
                <div class="mt-1 text-xs text-surface-500">Mapped products and owners</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Opportunities</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ relatedSummary.totalOpportunities }}</div>\r
                <div class="mt-1 text-xs text-surface-500">Commercial pipeline items</div>\r
            </div>\r
        </div>\r
    </section>\r
\r
    <div class="grid grid-cols-12 gap-4">\r
        <section class="col-span-12 xl:col-span-8">\r
            <div class="rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Client Profile</h3>\r
                <div class="mt-4 grid grid-cols-12 gap-x-6 gap-y-5">\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Short Name</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(client.shortName) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Industry</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(client.industryName) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Country</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ client.countryName }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Tax Number</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(client.taxNumber) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Registration Number</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(client.registrationNumber) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Website</div>\r
                        @if (client.website) {\r
                            <a class="mt-1 block truncate font-medium text-primary" [href]="client.website" target="_blank" rel="noopener">{{ client.website }}</a>\r
                        } @else {\r
                            <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">Not set</div>\r
                        }\r
                    </div>\r
                    <div class="col-span-12 border-t border-surface-200 pt-4 dark:border-surface-700">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Address</div>\r
                        <div class="mt-1 whitespace-pre-line text-surface-800 dark:text-surface-100">{{ optional(client.address) }}</div>\r
                    </div>\r
                    <div class="col-span-12 border-t border-surface-200 pt-4 dark:border-surface-700">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Notes</div>\r
                        <div class="mt-1 whitespace-pre-line text-surface-800 dark:text-surface-100">{{ optional(client.notes) }}</div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">\r
                    <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Contacts</h3>\r
                    <div class="flex flex-wrap items-center gap-2">\r
                        <span class="rounded-md bg-surface-100 px-3 py-1 text-sm font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-200">{{ contacts.length }} item(s)</span>\r
                        @if (canEditClient) {\r
                            <p-button label="Add Contact" icon="pi pi-plus" size="small" outlined (onClick)="openAddContactDialog()" />\r
                        }\r
                    </div>\r
                </div>\r
                <p-table [value]="contacts" [tableStyle]="{ 'min-width': '62rem' }">\r
                    <ng-template #header>\r
                        <tr>\r
                            <th>Name</th>\r
                            <th>Designation</th>\r
                            <th>Email</th>\r
                            <th>Phone</th>\r
                            <th>Status</th>\r
                            @if (canEditClient) {\r
                                <th class="w-32">Actions</th>\r
                            }\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #body let-contact>\r
                        <tr [class.bg-primary-50]="contact.isPrimary">\r
                            <td>\r
                                <div class="font-medium">{{ contact.fullName }}</div>\r
                                @if (contact.isPrimary) {\r
                                    <div class="text-xs text-primary">Primary contact</div>\r
                                }\r
                            </td>\r
                            <td>{{ optional(contact.designation || contact.department) }}</td>\r
                            <td>{{ optional(contact.email) }}</td>\r
                            <td>{{ optional(contact.mobile || contact.phone) }}</td>\r
                            <td>\r
                                <p-tag [severity]="contact.isActive ? 'success' : 'secondary'" [value]="contact.statusName || (contact.isActive ? 'Active' : 'Inactive')" />\r
                            </td>\r
                            @if (canEditClient) {\r
                                <td>\r
                                    <div class="flex gap-1">\r
                                        <p-button icon="pi pi-pencil" text rounded severity="secondary" (onClick)="openEditContactDialog(contact)" />\r
                                        @if (!contact.isPrimary) {\r
                                            <p-button icon="pi pi-star" text rounded severity="warn" [disabled]="!contact.isActive" ariaLabel="Set primary contact" (onClick)="setPrimaryContact(contact)" />\r
                                        }\r
                                        <p-button\r
                                            [icon]="contact.isActive ? 'pi pi-ban' : 'pi pi-check-circle'"\r
                                            text\r
                                            rounded\r
                                            [severity]="contact.isActive ? 'danger' : 'success'"\r
                                            [disabled]="contact.isPrimary && contact.isActive"\r
                                            (onClick)="toggleContactStatus(contact)"\r
                                        />\r
                                    </div>\r
                                </td>\r
                            }\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #emptymessage>\r
                        <tr>\r
                            <td [attr.colspan]="canEditClient ? 6 : 5">No contacts recorded for this client.</td>\r
                        </tr>\r
                    </ng-template>\r
                </p-table>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">\r
                    <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Product Mapping</h3>\r
                    <div class="flex flex-wrap items-center gap-2">\r
                        <span class="rounded-md bg-surface-100 px-3 py-1 text-sm font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-200">{{ productMappings.length }} item(s)</span>\r
                        @if (canEditClient) {\r
                            <p-button label="Add Product" icon="pi pi-plus" size="small" outlined (onClick)="openAddProductDialog()" />\r
                        }\r
                    </div>\r
                </div>\r
                <p-table [value]="productMappings" [tableStyle]="{ 'min-width': '68rem' }">\r
                    <ng-template #header>\r
                        <tr>\r
                            <th>Code</th>\r
                            <th>Product</th>\r
                            <th>Relationship</th>\r
                            <th>Opportunity</th>\r
                            <th>Owner</th>\r
                            <th>Dates</th>\r
                            @if (canEditClient) {\r
                                <th class="w-20">Actions</th>\r
                            }\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #body let-product>\r
                        <tr>\r
                            <td class="font-medium">{{ product.productCode }}</td>\r
                            <td>{{ product.productName }}</td>\r
                            <td>{{ optional(product.relationshipStatus) }}</td>\r
                            <td>{{ optional(product.opportunityNumber || product.opportunityTitle) }}</td>\r
                            <td>{{ optional(product.ownerUserName) }}</td>\r
                            <td>\r
                                @if (product.startDate || product.endDate) {\r
                                    <span>{{ formatDateOnly(product.startDate) }} - {{ formatDateOnly(product.endDate) }}</span>\r
                                } @else {\r
                                    <span>Not set</span>\r
                                }\r
                            </td>\r
                            @if (canEditClient) {\r
                                <td>\r
                                    <p-button icon="pi pi-pencil" text rounded severity="secondary" (onClick)="openEditProductDialog(product)" />\r
                                </td>\r
                            }\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #emptymessage>\r
                        <tr>\r
                            <td [attr.colspan]="canEditClient ? 7 : 6">No products mapped to this client.</td>\r
                        </tr>\r
                    </ng-template>\r
                </p-table>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">\r
                    <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Related Opportunities</h3>\r
                    <span class="rounded-md bg-surface-100 px-3 py-1 text-sm font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-200">{{ client.opportunities.length }} item(s)</span>\r
                </div>\r
                <p-table [value]="client.opportunities" [tableStyle]="{ 'min-width': '58rem' }">\r
                    <ng-template #header>\r
                        <tr>\r
                            <th>Number</th>\r
                            <th>Title</th>\r
                            <th>Product</th>\r
                            <th>Stage</th>\r
                            <th>Value</th>\r
                            <th>Status</th>\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #body let-opportunity>\r
                        <tr>\r
                            <td class="font-medium">{{ opportunity.opportunityNumber }}</td>\r
                            <td>{{ opportunity.title }}</td>\r
                            <td>{{ optional(opportunity.productName) }}</td>\r
                            <td>{{ optional(opportunity.stageName) }}</td>\r
                            <td>{{ formatCurrency(opportunity.estimatedValue) }}</td>\r
                            <td>{{ optional(opportunity.status) }}</td>\r
                        </tr>\r
                    </ng-template>\r
                    <ng-template #emptymessage>\r
                        <tr>\r
                            <td colspan="6">No related opportunities found.</td>\r
                        </tr>\r
                    </ng-template>\r
                </p-table>\r
            </div>\r
        </section>\r
\r
        <aside class="col-span-12 xl:col-span-4">\r
            <div class="rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Related Summary</h3>\r
                <div class="mt-4 grid grid-cols-2 gap-3">\r
                    <div class="rounded-md border border-surface-200 px-3 py-2 dark:border-surface-700">\r
                        <div class="text-xs uppercase text-surface-500">Opportunities</div>\r
                        <div class="mt-1 text-lg font-semibold">{{ relatedSummary.totalOpportunities }}</div>\r
                    </div>\r
                    <div class="rounded-md border border-surface-200 px-3 py-2 dark:border-surface-700">\r
                        <div class="text-xs uppercase text-surface-500">Interactions</div>\r
                        <div class="mt-1 text-lg font-semibold">{{ relatedSummary.totalInteractions }}</div>\r
                    </div>\r
                    <div class="rounded-md border border-surface-200 px-3 py-2 dark:border-surface-700">\r
                        <div class="text-xs uppercase text-surface-500">RFPs</div>\r
                        <div class="mt-1 text-lg font-semibold">{{ relatedSummary.totalRfps }}</div>\r
                    </div>\r
                    <div class="rounded-md border border-surface-200 px-3 py-2 dark:border-surface-700">\r
                        <div class="text-xs uppercase text-surface-500">Tasks</div>\r
                        <div class="mt-1 text-lg font-semibold">{{ relatedSummary.totalTasks }}</div>\r
                    </div>\r
                    <div class="col-span-2 rounded-md border border-surface-200 px-3 py-2 dark:border-surface-700">\r
                        <div class="text-xs uppercase text-surface-500">Documents</div>\r
                        <div class="mt-1 text-lg font-semibold">{{ relatedSummary.totalDocuments }}</div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Related RFPs</h3>\r
                @if (client.rfps.length) {\r
                    <div class="mt-4 flex flex-col gap-3">\r
                        @for (rfp of client.rfps; track rfp.id) {\r
                            <article class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                                <div class="font-semibold text-surface-900 dark:text-surface-0">{{ rfp.rfpNumber }}</div>\r
                                <div class="mt-1 text-sm text-surface-700 dark:text-surface-200">{{ rfp.title }}</div>\r
                                <div class="mt-2 text-xs text-surface-500">{{ optional(rfp.productName) }} / {{ optional(rfp.status) }}</div>\r
                                <div class="mt-1 text-xs text-surface-500">Due {{ formatDateOnly(rfp.submissionDeadline) }}</div>\r
                            </article>\r
                        }\r
                    </div>\r
                } @else {\r
                    <div class="mt-4 rounded-md border border-dashed border-surface-300 p-6 text-center text-surface-500 dark:border-surface-700">\r
                        No related RFPs found.\r
                    </div>\r
                }\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Documents</h3>\r
                @if (client.documents.length) {\r
                    <div class="mt-4 flex flex-col gap-3">\r
                        @for (document of client.documents; track document.id) {\r
                            <article class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                                <div class="font-semibold text-surface-900 dark:text-surface-0">{{ document.fileName }}</div>\r
                                <div class="mt-1 text-sm text-surface-500">{{ optional(document.documentType) }}</div>\r
                                <div class="mt-2 text-xs text-surface-500">{{ optional(document.uploadedByUserName) }} / {{ formatDate(document.uploadedAt) }}</div>\r
                            </article>\r
                        }\r
                    </div>\r
                } @else {\r
                    <div class="mt-4 rounded-md border border-dashed border-surface-300 p-6 text-center text-surface-500 dark:border-surface-700">\r
                        No documents uploaded for this client.\r
                    </div>\r
                }\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Audit</h3>\r
                <div class="mt-4 divide-y divide-surface-200 dark:divide-surface-700">\r
                    <div class="flex items-center justify-between gap-4 py-3 first:pt-0">\r
                        <span class="text-sm text-surface-500">Created</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(client.createdAt) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Created By</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ optional(client.createdBy) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Updated</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(client.updatedAt) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3 last:pb-0">\r
                        <span class="text-sm text-surface-500">Updated By</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ optional(client.updatedBy) }}</span>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="flex flex-wrap items-center justify-between gap-3">\r
                    <div>\r
                        <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Timeline</h3>\r
                        <div class="mt-1 text-sm text-surface-500">{{ timelineResponse.totalCount }} activity item(s)</div>\r
                    </div>\r
                    <p-select\r
                        [options]="timelineActivityOptions"\r
                        optionLabel="label"\r
                        optionValue="value"\r
                        [(ngModel)]="timelineActivityType"\r
                        [showClear]="true"\r
                        placeholder="All activity"\r
                        appendTo="body"\r
                        class="min-w-44"\r
                        (onChange)="loadTimeline(true)"\r
                    />\r
                </div>\r
                @if (timeline.length) {\r
                    <div class="mt-4 flex flex-col gap-3">\r
                        @for (entry of timeline; track entry.entityId) {\r
                            <article class="flex gap-3 rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-100 text-primary dark:bg-surface-800">\r
                                    <i [ngClass]="timelineIcon(entry.activityType)"></i>\r
                                </div>\r
                                <div class="min-w-0">\r
                                    <div class="flex flex-wrap items-center gap-2">\r
                                        <div class="font-semibold text-surface-900 dark:text-surface-0">{{ entry.title }}</div>\r
                                        <p-tag severity="info" [value]="entry.activityType" />\r
                                    </div>\r
                                    <div class="mt-1 text-sm leading-6 text-surface-700 dark:text-surface-200">{{ optional(entry.description) }}</div>\r
                                    <div class="mt-1 text-xs text-surface-500">\r
                                        {{ formatDate(entry.activityDate) }}\r
                                        @if (entry.createdByUserName) {\r
                                            <span>/ {{ entry.createdByUserName }}</span>\r
                                        }\r
                                    </div>\r
                                </div>\r
                            </article>\r
                        }\r
                    </div>\r
                    @if (canLoadMoreTimeline) {\r
                        <div class="mt-4 text-center">\r
                            <p-button label="Load More" icon="pi pi-chevron-down" outlined size="small" [loading]="isLoadingTimeline" (onClick)="loadTimeline(false)" />\r
                        </div>\r
                    }\r
                } @else {\r
                    <div class="mt-4 rounded-md border border-dashed border-surface-300 p-6 text-center text-surface-500 dark:border-surface-700">\r
                        No timeline activity recorded.\r
                    </div>\r
                }\r
            </div>\r
        </aside>\r
    </div>\r
\r
    <p-dialog [(visible)]="editDialog" [modal]="true" [style]="{ width: 'min(1080px, 96vw)' }" [contentStyle]="{ 'max-height': 'calc(100vh - 12rem)', overflow: 'auto' }" header="Edit Client">\r
        <form [formGroup]="editForm" class="grid grid-cols-12 gap-4">\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Client Code</label>\r
                <input pInputText formControlName="clientCode" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Client Name <span class="text-red-500">*</span></label>\r
                <input pInputText formControlName="name" class="w-full" />\r
                @if (editForm.get('name')?.errors && editForm.get('name')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Client name is required</span>\r
                }\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Short Name</label>\r
                <input pInputText formControlName="shortName" class="w-full" />\r
            </div>\r
\r
            @if (lookups) {\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Client Type</label>\r
                    <p-select [options]="lookups.clientTypes" optionLabel="name" optionValue="id" appendTo="body" formControlName="clientTypeId" [showClear]="true" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Country <span class="text-red-500">*</span></label>\r
                    <p-select [options]="lookups.countries" optionLabel="name" optionValue="id" appendTo="body" formControlName="countryId" class="w-full" />\r
                    @if (editForm.get('countryId')?.errors && editForm.get('countryId')?.touched) {\r
                        <span class="p-error mt-1 block text-sm text-red-600">Country is required</span>\r
                    }\r
                </div>\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Industry</label>\r
                    <p-select [options]="lookups.industries" optionLabel="name" optionValue="id" appendTo="body" formControlName="industryId" [showClear]="true" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Account Owner</label>\r
                    <p-select [options]="lookups.accountOwners" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="accountOwnerUserId" [showClear]="true" class="w-full" />\r
                </div>\r
            } @else {\r
                <div class="col-span-12 rounded-md border border-dashed border-surface-300 p-4 text-sm text-surface-500 dark:border-surface-700">\r
                    Loading lookup values...\r
                </div>\r
            }\r
\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Status</label>\r
                <p-select [options]="statusOptions" optionLabel="label" optionValue="value" appendTo="body" formControlName="status" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Website</label>\r
                <input pInputText formControlName="website" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Tax Number</label>\r
                <input pInputText formControlName="taxNumber" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Registration Number</label>\r
                <input pInputText formControlName="registrationNumber" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Address</label>\r
                <textarea pTextarea rows="4" formControlName="address" class="w-full"></textarea>\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Notes</label>\r
                <textarea pTextarea rows="4" formControlName="notes" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingClient" (onClick)="editDialog = false" />\r
            <p-button label="Save" icon="pi pi-check" [loading]="isSavingClient" [disabled]="!lookups" (onClick)="updateClient()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="contactDialog" [modal]="true" [style]="{ width: 'min(920px, 96vw)' }" [contentStyle]="{ 'max-height': 'calc(100vh - 12rem)', overflow: 'auto' }" [header]="contactMode === 'create' ? 'Add Contact' : 'Edit Contact'">\r
        <form [formGroup]="contactForm" class="grid grid-cols-12 gap-4">\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Full Name <span class="text-red-500">*</span></label>\r
                <input pInputText formControlName="fullName" class="w-full" />\r
                @if (contactForm.get('fullName')?.errors && contactForm.get('fullName')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Full name is required</span>\r
                }\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">First Name</label>\r
                <input pInputText formControlName="firstName" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Last Name</label>\r
                <input pInputText formControlName="lastName" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Designation</label>\r
                <input pInputText formControlName="designation" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Department</label>\r
                <input pInputText formControlName="department" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Email</label>\r
                <input pInputText formControlName="email" class="w-full" />\r
                @if (contactForm.get('email')?.errors && contactForm.get('email')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Email must be valid</span>\r
                }\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Phone</label>\r
                <input pInputText formControlName="phone" inputmode="numeric" maxlength="10" class="w-full" (input)="normalizeContactNumber('phone', $event)" />\r
                @if (contactForm.get('phone')?.hasError('pattern') && contactForm.get('phone')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">{{ contactNumberValidationMessage }}</span>\r
                }\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Mobile</label>\r
                <input pInputText formControlName="mobile" inputmode="numeric" maxlength="10" class="w-full" (input)="normalizeContactNumber('mobile', $event)" />\r
                @if (contactForm.get('mobile')?.hasError('pattern') && contactForm.get('mobile')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">{{ contactNumberValidationMessage }}</span>\r
                }\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Status</label>\r
                <p-select [options]="statusOptions" optionLabel="label" optionValue="value" appendTo="body" formControlName="status" class="w-full" />\r
            </div>\r
            <div class="col-span-12 md:col-span-4">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Primary Contact</label>\r
                <label class="flex h-10 items-center gap-2 text-sm text-surface-700 dark:text-surface-200">\r
                    <input type="checkbox" formControlName="isPrimary" />\r
                    <span>Mark as primary</span>\r
                </label>\r
            </div>\r
            <div class="col-span-12 md:col-span-8">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Notes</label>\r
                <textarea pTextarea rows="3" formControlName="notes" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingContact" (onClick)="contactDialog = false" />\r
            <p-button label="Save Contact" icon="pi pi-check" [loading]="isSavingContact" (onClick)="saveContact()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="productDialog" [modal]="true" [style]="{ width: 'min(920px, 96vw)' }" [contentStyle]="{ 'max-height': 'calc(100vh - 12rem)', overflow: 'auto' }" [header]="productMode === 'create' ? 'Add Product Mapping' : 'Edit Product Mapping'">\r
        <form [formGroup]="productForm" class="grid grid-cols-12 gap-4">\r
            @if (productLookups) {\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Product <span class="text-red-500">*</span></label>\r
                    <p-select [options]="productLookups.products" optionLabel="name" optionValue="id" appendTo="body" formControlName="productId" class="w-full" />\r
                    @if (productForm.get('productId')?.errors && productForm.get('productId')?.touched) {\r
                        <span class="p-error mt-1 block text-sm text-red-600">Product is required</span>\r
                    }\r
                </div>\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Relationship Status <span class="text-red-500">*</span></label>\r
                    <p-select [options]="productLookups.relationshipStatuses" optionLabel="name" optionValue="code" appendTo="body" formControlName="relationshipStatus" class="w-full" />\r
                    @if (productForm.get('relationshipStatus')?.errors && productForm.get('relationshipStatus')?.touched) {\r
                        <span class="p-error mt-1 block text-sm text-red-600">Relationship status is required</span>\r
                    }\r
                </div>\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Opportunity</label>\r
                    <p-select [options]="productLookups.opportunities" optionLabel="displayName" optionValue="id" appendTo="body" formControlName="opportunityId" [showClear]="true" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Owner</label>\r
                    <p-select [options]="productLookups.owners" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="ownerUserId" [showClear]="true" class="w-full" />\r
                </div>\r
            } @else {\r
                <div class="col-span-12 rounded-md border border-dashed border-surface-300 p-4 text-sm text-surface-500 dark:border-surface-700">\r
                    Loading product lookup values...\r
                </div>\r
            }\r
\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Start Date</label>\r
                <p-datepicker #startDatePicker formControlName="startDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(startDatePicker)" />\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">End Date</label>\r
                <p-datepicker #endDatePicker formControlName="endDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(endDatePicker)" />\r
            </div>\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Notes</label>\r
                <textarea pTextarea rows="3" formControlName="notes" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingProduct" (onClick)="productDialog = false" />\r
            <p-button label="Save Mapping" icon="pi pi-check" [loading]="isSavingProduct" [disabled]="!productLookups" (onClick)="saveProductMapping()" />\r
        </ng-template>\r
    </p-dialog>\r
}\r
` }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: ClientApiService }, { type: AuthService }, { type: MessageService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientDetail, { className: "ClientDetail", filePath: "src/app/pages/clients/components/client-detail/client-detail.ts", lineNumber: 36 });
})();

// src/app/pages/clients/config/client-columns.config.ts
var ClientColumns = [
  { field: "clientCode", header: "Code", type: "text", width: "140px", sortable: true },
  { field: "name", header: "Client", type: "text", width: "240px", sortable: true },
  { field: "countryName", header: "Country", type: "text", width: "160px", sortable: true },
  { field: "industryName", header: "Industry", type: "text", width: "180px", sortable: true },
  { field: "accountOwnerUserName", header: "Account Owner", type: "text", width: "190px", sortable: true },
  { field: "contactCount", header: "Contacts", type: "number", width: "110px", sortable: false },
  { field: "productCount", header: "Products", type: "number", width: "110px", sortable: false },
  { field: "statusName", header: "Status", type: "text", width: "120px", sortable: true },
  { field: "createdAtDisplay", header: "Created", type: "text", width: "140px", sortable: true },
  { field: "isActive", header: "Active", type: "checkbox", width: "110px", sortable: false }
];

// src/app/pages/clients/config/client-fields.config.ts
function buildClientFields(options) {
  return [
    { key: "name", label: "Client Name", type: "text", required: true, colSpan: 4, section: "Client", placeholder: "Organization name" },
    { key: "shortName", label: "Short Name", type: "text", colSpan: 4, section: "Client", placeholder: "Optional display name" },
    { key: "clientTypeId", label: "Client Type", type: "select", options: options.clientTypes, colSpan: 4, section: "Client", placeholder: "Select client type" },
    { key: "countryId", label: "Country", type: "select", required: true, options: options.countries, colSpan: 4, section: "Classification", placeholder: "Select country" },
    { key: "industryId", label: "Industry", type: "select", options: options.industries, colSpan: 4, section: "Classification", placeholder: "Select industry" },
    { key: "accountOwnerUserId", label: "Account Owner", type: "select", options: options.accountOwners, colSpan: 4, section: "Ownership", placeholder: "Select account owner" },
    { key: "website", label: "Website", type: "text", colSpan: 4, section: "Organization Details", placeholder: "https://example.com" },
    { key: "taxNumber", label: "Tax Number", type: "text", colSpan: 4, section: "Organization Details" },
    { key: "registrationNumber", label: "Registration Number", type: "text", colSpan: 4, section: "Organization Details" },
    { key: "address", label: "Address", type: "textarea", colSpan: 6, section: "Additional Details" },
    { key: "notes", label: "Notes", type: "textarea", colSpan: 6, section: "Additional Details" },
    { key: "status", label: "Status", type: "select", options: options.statuses, colSpan: 6, section: "Status", defaultValue: 1, visibleOn: "update" },
    { key: "isActive", label: "Active", type: "checkbox", colSpan: 6, section: "Status", defaultValue: true, visibleOn: "update" }
  ];
}

// src/app/pages/clients/components/client-list/client-list.ts
var _c02 = () => [10, 25, 50, 100];
function ClientList_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 16);
    \u0275\u0275listener("save", function ClientList_Conditional_26_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveClient($event));
    })("delete", function ClientList_Conditional_26_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleClientStatus($event));
    })("bulkDelete", function ClientList_Conditional_26_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deactivateClients($event));
    })("view", function ClientList_Conditional_26_Template_app_crud_view_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.viewClient($event));
    })("lazyLoad", function ClientList_Conditional_26_Template_app_crud_lazyLoad_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onLazyLoad($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("columns", ctx_r1.columns)("data", ctx_r1.data)("fields", ctx_r1.fields)("title", ctx_r1.title)("dataNotFound", ctx_r1.dataNotFound)("errorMessage", ctx_r1.errorMessage)("bulkActionLabel", ctx_r1.bulkActionLabel)("rowActionLabel", ctx_r1.rowActionLabel)("rowActionIcon", ctx_r1.rowActionIcon)("rowActionLabelResolver", ctx_r1.rowActionLabelResolver)("rowActionIconResolver", ctx_r1.rowActionIconResolver)("canCreate", ctx_r1.canCreate)("canEdit", ctx_r1.canEdit)("canRowAction", ctx_r1.canDelete || ctx_r1.canEdit)("canBulkAction", ctx_r1.canDelete)("canExport", ctx_r1.canExport)("enableViewAction", true)("lazy", true)("lazyLoadOnInit", false)("totalRecords", ctx_r1.totalRecords)("first", ctx_r1.first)("rows", ctx_r1.pageSize)("rowsPerPageOptions", \u0275\u0275pureFunction0(24, _c02))("showGlobalSearch", false);
  }
}
var ClientList = class _ClientList {
  clientApiService;
  messageService;
  authService;
  router;
  title = "Client";
  columns = ClientColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No clients found.";
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  bulkActionLabel = "Deactivate";
  rowActionLabel = "Deactivate";
  rowActionIcon = "pi pi-ban";
  rowActionLabelResolver = (row) => row["isActive"] === true ? "Deactivate" : "Activate";
  rowActionIconResolver = (row) => row["isActive"] === true ? "pi pi-ban" : "pi pi-check-circle";
  filterCountries = [];
  filterIndustries = [];
  filterOwners = [];
  filterStatuses = [
    { label: "Active", value: 1, code: "ACTIVE" },
    { label: "Inactive", value: 2, code: "INACTIVE" }
  ];
  totalRecords = 0;
  first = 0;
  pageNumber = 1;
  pageSize = 10;
  sortField = "createdAt";
  sortDirection = "desc";
  fb = inject(FormBuilder);
  filterForm = this.fb.group({
    searchTerm: [""],
    countryId: [""],
    industryId: [""],
    status: [null],
    accountOwnerUserId: [""]
  });
  constructor(clientApiService, messageService, authService, router) {
    this.clientApiService = clientApiService;
    this.messageService = messageService;
    this.authService = authService;
    this.router = router;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.clients.create);
    this.canEdit = this.authService.hasPermission(Permissions.clients.edit);
    this.canDelete = this.authService.hasPermission(Permissions.clients.delete);
    this.canExport = this.authService.hasPermission(Permissions.clients.export);
    this.loadPage();
  }
  saveClient(event) {
    const value = event.value;
    if (event.mode === "create") {
      this.clientApiService.createClient(this.toCreateRequest(value)).subscribe({
        next: () => {
          this.messageService.add({ severity: "success", summary: "Client created", detail: "The client was created successfully.", life: 3e3 });
          this.loadClients();
        },
        error: (error) => this.showError(error, "Create failed")
      });
      return;
    }
    const id = this.getRowId(event.original);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Client id is missing.", life: 4e3 });
      return;
    }
    this.clientApiService.updateClient(id, this.toUpdateRequest(value)).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Client updated", detail: "The client was updated successfully.", life: 3e3 });
        this.loadClients();
      },
      error: (error) => this.showError(error, "Update failed")
    });
  }
  toggleClientStatus(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Status update failed", detail: "Client id is missing.", life: 4e3 });
      return;
    }
    const isActive = row["isActive"] === true;
    const request = isActive ? this.clientApiService.deactivateClient(id) : this.clientApiService.activateClient(id);
    const action = isActive ? "deactivated" : "activated";
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: `Client ${action}`, detail: `The client was ${action} successfully.`, life: 3e3 });
        this.loadClients();
      },
      error: (error) => this.showError(error, "Status update failed")
    });
  }
  deactivateClients(rows) {
    const activeIds = rows.filter((row) => row["isActive"] === true).map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!activeIds.length) {
      this.messageService.add({ severity: "info", summary: "No active clients", detail: "The selected clients are already inactive.", life: 3e3 });
      return;
    }
    forkJoin(activeIds.map((id) => this.clientApiService.deactivateClient(id))).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Clients deactivated", detail: `${activeIds.length} client(s) were deactivated.`, life: 3e3 });
        this.loadClients();
      },
      error: (error) => this.showError(error, "Bulk deactivate failed")
    });
  }
  viewClient(row) {
    const id = this.getRowId(row);
    if (id) {
      this.router.navigate(["/pages/clients", id]);
    }
  }
  loadPage() {
    this.isLoading = true;
    forkJoin({
      lookups: this.clientApiService.getLookups(),
      filters: this.clientApiService.getFilters()
    }).subscribe({
      next: ({ lookups, filters }) => {
        this.filterCountries = this.toOptions(filters.countries);
        this.filterIndustries = this.toOptions(filters.industries);
        this.filterOwners = this.toUserOptions(filters.accountOwners);
        this.filterStatuses = [
          { label: "Active", value: 1, code: "ACTIVE" },
          { label: "Inactive", value: 2, code: "INACTIVE" }
        ];
        this.fields = buildClientFields({
          clientTypes: this.toOptions(lookups.clientTypes),
          countries: this.toOptions(lookups.countries),
          industries: this.toOptions(lookups.industries),
          accountOwners: this.toUserOptions(lookups.accountOwners),
          statuses: [
            { label: "Active", value: 1, code: "ACTIVE" },
            { label: "Inactive", value: 2, code: "INACTIVE" }
          ]
        });
        this.loadClients();
      },
      error: () => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = "Unable to load client lookups.";
      }
    });
  }
  loadClients() {
    this.clientApiService.getClients(this.buildListQuery()).subscribe({
      next: (response) => {
        this.data = response.items.map((client) => this.toGridRow(client));
        this.totalRecords = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.dataNotFound = response.totalCount === 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = error.status === 401 || error.status === 403 ? "You are not allowed to manage clients." : "Unable to load clients.";
      }
    });
  }
  applyFilters() {
    this.first = 0;
    this.pageNumber = 1;
    this.loadClients();
  }
  clearFilters() {
    this.filterForm.reset({
      searchTerm: "",
      countryId: "",
      industryId: "",
      status: null,
      accountOwnerUserId: ""
    });
    this.applyFilters();
  }
  onLazyLoad(event) {
    this.first = event.first ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.pageNumber = Math.floor(this.first / this.pageSize) + 1;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] ?? "" : event.sortField ?? "";
    this.sortField = this.toApiSortField(sortField);
    this.sortDirection = event.sortOrder === 1 ? "asc" : "desc";
    this.loadClients();
  }
  toGridRow(client) {
    return __spreadProps(__spreadValues({}, client), {
      status: client.status || 1,
      statusName: client.statusName || (client.isActive ? "Active" : "Inactive"),
      industryName: client.industryName ?? "",
      clientTypeName: client.clientTypeName ?? "",
      accountOwnerUserName: client.accountOwnerUserName ?? "",
      website: client.website ?? "",
      contactCount: client.contactCount ?? 0,
      productCount: client.productCount ?? 0,
      createdAtDisplay: this.formatDate(client.createdAt),
      isActive: client.isActive === true
    });
  }
  toCreateRequest(value) {
    return {
      name: String(value["name"] ?? ""),
      shortName: this.optionalString(value["shortName"]),
      clientTypeId: this.optionalString(value["clientTypeId"]),
      industryId: this.optionalString(value["industryId"]),
      countryId: String(value["countryId"] ?? ""),
      address: this.optionalString(value["address"]),
      website: this.optionalString(value["website"]),
      taxNumber: this.optionalString(value["taxNumber"]),
      registrationNumber: this.optionalString(value["registrationNumber"]),
      accountOwnerUserId: this.optionalString(value["accountOwnerUserId"]),
      notes: this.optionalString(value["notes"])
    };
  }
  toUpdateRequest(value) {
    return __spreadProps(__spreadValues({}, this.toCreateRequest(value)), {
      status: this.toNumber(value["status"]) || (value["isActive"] === true ? 1 : 2),
      isActive: value["isActive"] === true
    });
  }
  toOptions(values) {
    return values.map((value) => ({ label: value.name, value: value.id, code: value.code }));
  }
  toUserOptions(values) {
    return values.map((value) => ({ label: value.fullName, value: value.id, code: value.email ?? void 0 }));
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
  buildListQuery() {
    const filters = this.filterForm.getRawValue();
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchTerm: filters.searchTerm?.trim() || void 0,
      countryId: filters.countryId || void 0,
      industryId: filters.industryId || void 0,
      status: filters.status ?? void 0,
      accountOwnerUserId: filters.accountOwnerUserId || void 0,
      sortBy: this.sortField || "createdAt",
      sortDirection: this.sortDirection
    };
  }
  toApiSortField(field) {
    const sortMap = {
      clientCode: "clientCode",
      name: "name",
      countryName: "countryName",
      industryName: "industryName",
      statusName: "status",
      accountOwnerUserName: "accountOwnerUserName",
      createdAtDisplay: "createdAt"
    };
    return sortMap[field] ?? "createdAt";
  }
  formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "";
  }
  showError(error, summary) {
    const detail = error.error?.errors?.join?.(" ") ?? error.error?.detail ?? error.error?.title ?? "The operation could not be completed.";
    this.messageService.add({ severity: "error", summary, detail, life: 6e3 });
  }
  static \u0275fac = function ClientList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ClientList)(\u0275\u0275directiveInject(ClientApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientList, selectors: [["app-client-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 27, vars: 10, consts: [["position", "bottom-right"], [1, "mb-4", "rounded-md", "border", "border-surface-200", "bg-surface-0", "px-5", "py-4", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "grid", "grid-cols-12", "items-end", "gap-3", 3, "formGroup"], [1, "col-span-12", "lg:col-span-3"], [1, "mb-2", "block", "text-xs", "font-semibold", "uppercase", "text-surface-500"], ["pInputText", "", "formControlName", "searchTerm", "placeholder", "Code, name, website, tax", 1, "h-10", "w-full", "text-sm", 3, "keyup.enter"], [1, "col-span-12", "sm:col-span-6", "lg:col-span-2"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "countryId", "placeholder", "All countries", 1, "w-full", "text-sm", 3, "options", "showClear"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "industryId", "placeholder", "All industries", 1, "w-full", "text-sm", 3, "options", "showClear"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "accountOwnerUserId", "placeholder", "All owners", 1, "w-full", "text-sm", 3, "options", "showClear"], [1, "col-span-12", "sm:col-span-6", "lg:col-span-1"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "status", "placeholder", "All", 1, "w-full", "text-sm", 3, "options", "showClear"], [1, "col-span-12", "flex", "justify-end", "gap-2", "lg:col-span-2"], ["label", "Clear", "icon", "pi pi-filter-slash", "severity", "secondary", "size", "small", "outlined", "", 3, "onClick"], ["label", "Apply", "icon", "pi pi-filter", "size", "small", 3, "onClick"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction", "lazy", "lazyLoadOnInit", "totalRecords", "first", "rows", "rowsPerPageOptions", "showGlobalSearch"], [3, "save", "delete", "bulkDelete", "view", "lazyLoad", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "bulkActionLabel", "rowActionLabel", "rowActionIcon", "rowActionLabelResolver", "rowActionIconResolver", "canCreate", "canEdit", "canRowAction", "canBulkAction", "canExport", "enableViewAction", "lazy", "lazyLoadOnInit", "totalRecords", "first", "rows", "rowsPerPageOptions", "showGlobalSearch"]], template: function ClientList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275elementStart(1, "section", 1)(2, "form", 2)(3, "div", 3)(4, "label", 4);
      \u0275\u0275text(5, "Search");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "input", 5);
      \u0275\u0275listener("keyup.enter", function ClientList_Template_input_keyup_enter_6_listener() {
        return ctx.applyFilters();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 6)(8, "label", 4);
      \u0275\u0275text(9, "Country");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "p-select", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 6)(12, "label", 4);
      \u0275\u0275text(13, "Industry");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "p-select", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 6)(16, "label", 4);
      \u0275\u0275text(17, "Owner");
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "p-select", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 10)(20, "label", 4);
      \u0275\u0275text(21, "Status");
      \u0275\u0275elementEnd();
      \u0275\u0275element(22, "p-select", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 12)(24, "p-button", 13);
      \u0275\u0275listener("onClick", function ClientList_Template_p_button_onClick_24_listener() {
        return ctx.clearFilters();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p-button", 14);
      \u0275\u0275listener("onClick", function ClientList_Template_p_button_onClick_25_listener() {
        return ctx.applyFilters();
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(26, ClientList_Conditional_26_Template, 1, 25, "app-crud", 15);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.filterForm);
      \u0275\u0275advance(8);
      \u0275\u0275property("options", ctx.filterCountries)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.filterIndustries)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.filterOwners)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.filterStatuses)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.isLoading ? 26 : -1);
    }
  }, dependencies: [ButtonModule, Button, Crud, InputTextModule, InputText, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, SelectModule, Select, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClientList, [{
    type: Component,
    args: [{ selector: "app-client-list", standalone: true, imports: [ButtonModule, Crud, InputTextModule, ReactiveFormsModule, SelectModule, ToastModule], providers: [MessageService], template: '<p-toast position="bottom-right"></p-toast>\r\n\r\n<section class="mb-4 rounded-md border border-surface-200 bg-surface-0 px-5 py-4 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r\n    <form [formGroup]="filterForm" class="grid grid-cols-12 items-end gap-3">\r\n        <div class="col-span-12 lg:col-span-3">\r\n            <label class="mb-2 block text-xs font-semibold uppercase text-surface-500">Search</label>\r\n            <input pInputText formControlName="searchTerm" class="h-10 w-full text-sm" placeholder="Code, name, website, tax" (keyup.enter)="applyFilters()" />\r\n        </div>\r\n\r\n        <div class="col-span-12 sm:col-span-6 lg:col-span-2">\r\n            <label class="mb-2 block text-xs font-semibold uppercase text-surface-500">Country</label>\r\n            <p-select [options]="filterCountries" optionLabel="label" optionValue="value" appendTo="body" formControlName="countryId" placeholder="All countries" [showClear]="true" class="w-full text-sm" />\r\n        </div>\r\n\r\n        <div class="col-span-12 sm:col-span-6 lg:col-span-2">\r\n            <label class="mb-2 block text-xs font-semibold uppercase text-surface-500">Industry</label>\r\n            <p-select [options]="filterIndustries" optionLabel="label" optionValue="value" appendTo="body" formControlName="industryId" placeholder="All industries" [showClear]="true" class="w-full text-sm" />\r\n        </div>\r\n\r\n        <div class="col-span-12 sm:col-span-6 lg:col-span-2">\r\n            <label class="mb-2 block text-xs font-semibold uppercase text-surface-500">Owner</label>\r\n            <p-select [options]="filterOwners" optionLabel="label" optionValue="value" appendTo="body" formControlName="accountOwnerUserId" placeholder="All owners" [showClear]="true" class="w-full text-sm" />\r\n        </div>\r\n\r\n        <div class="col-span-12 sm:col-span-6 lg:col-span-1">\r\n            <label class="mb-2 block text-xs font-semibold uppercase text-surface-500">Status</label>\r\n            <p-select [options]="filterStatuses" optionLabel="label" optionValue="value" appendTo="body" formControlName="status" placeholder="All" [showClear]="true" class="w-full text-sm" />\r\n        </div>\r\n\r\n        <div class="col-span-12 flex justify-end gap-2 lg:col-span-2">\r\n            <p-button label="Clear" icon="pi pi-filter-slash" severity="secondary" size="small" outlined (onClick)="clearFilters()" />\r\n            <p-button label="Apply" icon="pi pi-filter" size="small" (onClick)="applyFilters()" />\r\n        </div>\r\n    </form>\r\n</section>\r\n\r\n@if (!isLoading) {\r\n    <app-crud\r\n        [columns]="columns"\r\n        [data]="data"\r\n        [fields]="fields"\r\n        [title]="title"\r\n        [dataNotFound]="dataNotFound"\r\n        [errorMessage]="errorMessage"\r\n        [bulkActionLabel]="bulkActionLabel"\r\n        [rowActionLabel]="rowActionLabel"\r\n        [rowActionIcon]="rowActionIcon"\r\n        [rowActionLabelResolver]="rowActionLabelResolver"\r\n        [rowActionIconResolver]="rowActionIconResolver"\r\n        [canCreate]="canCreate"\r\n        [canEdit]="canEdit"\r\n        [canRowAction]="canDelete || canEdit"\r\n        [canBulkAction]="canDelete"\r\n        [canExport]="canExport"\r\n        [enableViewAction]="true"\r\n        [lazy]="true"\r\n        [lazyLoadOnInit]="false"\r\n        [totalRecords]="totalRecords"\r\n        [first]="first"\r\n        [rows]="pageSize"\r\n        [rowsPerPageOptions]="[10, 25, 50, 100]"\r\n        [showGlobalSearch]="false"\r\n        (save)="saveClient($event)"\r\n        (delete)="toggleClientStatus($event)"\r\n        (bulkDelete)="deactivateClients($event)"\r\n        (view)="viewClient($event)"\r\n        (lazyLoad)="onLazyLoad($event)"\r\n    />\r\n}\r\n' }]
  }], () => [{ type: ClientApiService }, { type: MessageService }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientList, { className: "ClientList", filePath: "src/app/pages/clients/components/client-list/client-list.ts", lineNumber: 31 });
})();

// src/app/pages/clients/clients.routes.ts
var clients_routes_default = [
  { path: "", component: ClientList, canActivate: [permissionGuard(Permissions.clients.view)] },
  { path: ":id", component: ClientDetail, canActivate: [permissionGuard(Permissions.clients.view)] }
];
export {
  clients_routes_default as default
};
//# sourceMappingURL=chunk-RZFSTFZR.js.map
