import {
  UserApiService
} from "./chunk-QS27J5HP.js";
import {
  Tag,
  TagModule
} from "./chunk-QWMZLFPI.js";
import {
  NEPAL_CONTACT_NUMBER_MESSAGE,
  NEPAL_CONTACT_NUMBER_PATTERN
} from "./chunk-DH3WPG22.js";
import {
  Crud,
  MultiSelect,
  MultiSelectModule
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
  SortIcon,
  SortableColumn,
  Table,
  TableModule
} from "./chunk-ZBJQJW6L.js";
import {
  ActivatedRoute,
  AuthService,
  Router,
  permissionGuard
} from "./chunk-CPXJEDC2.js";
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
  CommonModule,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  HttpClient,
  MaxLengthValidator,
  MessageService,
  NgClass,
  NgControlStatus,
  NgControlStatusGroup,
  PrimeTemplate,
  ReactiveFormsModule,
  Validators,
  apiUrl,
  ɵNgNoValidate
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  Injectable,
  forkJoin,
  inject,
  of,
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
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/leads/services/lead.endpoint.service.ts
var LeadEndpointService = class _LeadEndpointService {
  leads = apiUrl("/leads");
  leadSources = apiUrl("/leads/lookups/sources");
  leadCategories = apiUrl("/leads/lookups/categories");
  products = apiUrl("/leads/lookups/products");
  partners = apiUrl("/leads/lookups/partners");
  countries = apiUrl("/leads/lookups/countries");
  leadIndustries = apiUrl("/leads/lookups/industries");
  clientLookups = apiUrl("/leads/clients/lookups");
  clientContacts = apiUrl("/leads/clients/contacts");
  static \u0275fac = function LeadEndpointService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LeadEndpointService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LeadEndpointService, factory: _LeadEndpointService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LeadEndpointService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/pages/leads/services/lead.api-service.ts
var LeadApiService = class _LeadApiService {
  http;
  endpoints;
  constructor(http, endpoints) {
    this.http = http;
    this.endpoints = endpoints;
  }
  getLeads() {
    return this.http.get(this.endpoints.leads);
  }
  getDeletedLeadLogs() {
    return this.http.get(`${this.endpoints.leads}/deleted`);
  }
  getLead(id) {
    return this.http.get(`${this.endpoints.leads}/${id}`);
  }
  getLeadForEdit(id) {
    return this.http.get(`${this.endpoints.leads}/${id}/edit`);
  }
  createLead(request) {
    return this.http.post(this.endpoints.leads, request);
  }
  updateLead(id, request) {
    return this.http.put(`${this.endpoints.leads}/${id}`, request);
  }
  qualifyLead(id, request) {
    return this.http.patch(`${this.endpoints.leads}/${id}/qualify`, request);
  }
  disqualifyLead(id, request) {
    return this.http.patch(`${this.endpoints.leads}/${id}/disqualify`, request);
  }
  getLeadConversion(id) {
    return this.http.get(`${this.endpoints.leads}/${id}/conversion`);
  }
  convertLead(id, request) {
    return this.http.post(`${this.endpoints.leads}/${id}/convert`, request);
  }
  assignLead(id, request) {
    return this.http.patch(`${this.endpoints.leads}/${id}/assign`, request);
  }
  getLeadInteractions(id) {
    return this.http.get(`${this.endpoints.leads}/${id}/interactions`);
  }
  createLeadInteraction(id, request) {
    return this.http.post(`${this.endpoints.leads}/${id}/interactions`, request);
  }
  deleteLead(id) {
    return this.http.delete(`${this.endpoints.leads}/${id}`);
  }
  deleteLeads(ids) {
    return forkJoin(ids.map((id) => this.deleteLead(id)));
  }
  getLookupBundle() {
    return forkJoin({
      sources: this.http.get(this.endpoints.leadSources),
      categories: this.http.get(this.endpoints.leadCategories),
      partners: this.http.get(this.endpoints.partners),
      countries: this.http.get(this.endpoints.countries),
      industries: this.http.get(this.endpoints.leadIndustries),
      products: this.http.get(this.endpoints.products),
      clients: this.http.get(this.endpoints.clientLookups),
      contacts: this.http.get(this.endpoints.clientContacts)
    });
  }
  static \u0275fac = function LeadApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LeadApiService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(LeadEndpointService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LeadApiService, factory: _LeadApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LeadApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }, { type: LeadEndpointService }], null);
})();

// src/app/pages/leads/components/lead-detail/lead-detail.ts
var _c0 = () => ({ "min-width": "42rem" });
var _c1 = () => ({ width: "min(560px, 94vw)" });
var _c2 = () => ({ width: "min(1120px, 96vw)" });
var _c3 = () => ({ "max-height": "calc(100vh - 12rem)", overflow: "auto" });
var _c4 = () => ({ width: "min(640px, 94vw)" });
var _c5 = () => ({ width: "min(1040px, 96vw)" });
var _forTrack0 = ($index, $item) => $item.id;
function LeadDetail_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "div", 9);
    \u0275\u0275text(2, "Loading lead...");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "div", 10)(2, "p", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-button", 12);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_1_Template_p_button_onClick_4_listener() {
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
function LeadDetail_Conditional_2_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 99);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_23_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openInteractionDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("loading", ctx_r1.isSavingInteraction);
  }
}
function LeadDetail_Conditional_2_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 100);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_24_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openConversionDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("loading", ctx_r1.isConverting);
  }
}
function LeadDetail_Conditional_2_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 101);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_25_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openQualificationDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 102);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_25_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openDisqualificationDialog());
    });
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 103);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_26_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAssignmentDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("loading", ctx_r1.isAssigning);
  }
}
function LeadDetail_Conditional_2_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 104);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_27_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEditDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("label", ctx_r1.editActionLabel)("loading", ctx_r1.isSavingLead);
  }
}
function LeadDetail_Conditional_2_ng_template_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Product");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Category");
    \u0275\u0275elementEnd()();
  }
}
function LeadDetail_Conditional_2_ng_template_120_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 105);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const product_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r9.productCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r9.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(product_r9.productCategoryName));
  }
}
function LeadDetail_Conditional_2_ng_template_122_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 106);
    \u0275\u0275text(2, "No product interests recorded.");
    \u0275\u0275elementEnd()();
  }
}
function LeadDetail_Conditional_2_Conditional_131_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 107);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_Conditional_131_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openInteractionDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("loading", ctx_r1.isSavingInteraction);
  }
}
function LeadDetail_Conditional_2_Conditional_132_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const interaction_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" / ", interaction_r11.createdByUserName);
  }
}
function LeadDetail_Conditional_2_Conditional_132_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 114);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const interaction_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Follow-up ", ctx_r1.formatDate(interaction_r11.nextFollowUpDate), " ");
  }
}
function LeadDetail_Conditional_2_Conditional_132_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 108)(1, "div", 109)(2, "div", 110)(3, "div", 111);
    \u0275\u0275element(4, "i", 112);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 17)(6, "div", 20)(7, "h4", 113);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-tag", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 34);
    \u0275\u0275text(11);
    \u0275\u0275conditionalCreate(12, LeadDetail_Conditional_2_Conditional_132_For_2_Conditional_12_Template, 2, 1, "span");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(13, LeadDetail_Conditional_2_Conditional_132_For_2_Conditional_13_Template, 2, 1, "div", 114);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 115);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const interaction_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r1.interactionIcon(interaction_r11.interactionType));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(interaction_r11.subject || interaction_r11.interactionType);
    \u0275\u0275advance();
    \u0275\u0275property("severity", ctx_r1.interactionSeverity(interaction_r11.interactionType))("value", interaction_r11.interactionType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(interaction_r11.interactionDate), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(interaction_r11.createdByUserName ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(interaction_r11.nextFollowUpDate ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(interaction_r11.notes);
  }
}
function LeadDetail_Conditional_2_Conditional_132_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275repeaterCreate(1, LeadDetail_Conditional_2_Conditional_132_For_2_Template, 16, 8, "article", 108, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.interactions);
  }
}
function LeadDetail_Conditional_2_Conditional_133_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " No interactions recorded yet. ");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_157_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 62);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", "mailto:" + ctx_r1.lead.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.lead.email);
  }
}
function LeadDetail_Conditional_2_Conditional_158_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275text(1, "Not set");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_212_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 116)(1, "div", 117);
    \u0275\u0275element(2, "i", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 119)(4, "div", 120);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 121);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 122);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const entry_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.timelineIcon(entry_r12.eventType));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(entry_r12.eventType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r12.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(entry_r12.createdAt));
  }
}
function LeadDetail_Conditional_2_Conditional_212_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275repeaterCreate(1, LeadDetail_Conditional_2_Conditional_212_For_2_Template, 10, 4, "div", 116, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.lead.timelineEntries);
  }
}
function LeadDetail_Conditional_2_Conditional_213_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 75);
    \u0275\u0275text(1, "No timeline entries recorded.");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_ng_template_220_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_220_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.qualificationDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 124);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_220_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.qualifyLead());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingStatus);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingStatus);
  }
}
function LeadDetail_Conditional_2_Conditional_230_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Disqualification reason is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_ng_template_235_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_235_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.disqualificationDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 125);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_235_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.disqualifyLead());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingStatus);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingStatus);
  }
}
function LeadDetail_Conditional_2_Conditional_245_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Assignee is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_ng_template_250_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_250_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.assignmentDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 126);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_250_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.assignLead());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isAssigning);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isAssigning);
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_13_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Partner is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "label", 78);
    \u0275\u0275text(2, "Partner ");
    \u0275\u0275elementStart(3, "span", 81);
    \u0275\u0275text(4, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-select", 133);
    \u0275\u0275conditionalCreate(6, LeadDetail_Conditional_2_Conditional_253_Conditional_13_Conditional_6_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx_r1.leadLookups.partners);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_15_0 = ctx_r1.editForm.get("partnerId")) == null ? null : tmp_15_0.errors) && ((tmp_15_0 = ctx_r1.editForm.get("partnerId")) == null ? null : tmp_15_0.touched) ? 6 : -1);
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Campaign name is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Start date is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "End date is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Address is required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 94)(1, "div", 108)(2, "h3", 134);
    \u0275\u0275text(3, "Source Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "div", 135)(6, "label", 78);
    \u0275\u0275text(7, "Campaign Name ");
    \u0275\u0275elementStart(8, "span", 81);
    \u0275\u0275text(9, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "input", 136);
    \u0275\u0275conditionalCreate(11, LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_11_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 135)(13, "label", 78);
    \u0275\u0275text(14, "Start Date ");
    \u0275\u0275elementStart(15, "span", 81);
    \u0275\u0275text(16, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "p-datepicker", 137, 6);
    \u0275\u0275listener("onSelect", function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Template_p_datepicker_onSelect_17_listener() {
      \u0275\u0275restoreView(_r16);
      const sourceStartDatePicker_r17 = \u0275\u0275reference(18);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(sourceStartDatePicker_r17));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(19, LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_19_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 135)(21, "label", 78);
    \u0275\u0275text(22, "End Date ");
    \u0275\u0275elementStart(23, "span", 81);
    \u0275\u0275text(24, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "p-datepicker", 138, 7);
    \u0275\u0275listener("onSelect", function LeadDetail_Conditional_2_Conditional_253_Conditional_26_Template_p_datepicker_onSelect_25_listener() {
      \u0275\u0275restoreView(_r16);
      const sourceEndDatePicker_r18 = \u0275\u0275reference(26);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(sourceEndDatePicker_r18));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_27_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 135)(29, "label", 78);
    \u0275\u0275text(30, "Address ");
    \u0275\u0275elementStart(31, "span", 81);
    \u0275\u0275text(32, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(33, "textarea", 139);
    \u0275\u0275conditionalCreate(34, LeadDetail_Conditional_2_Conditional_253_Conditional_26_Conditional_34_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_16_0;
    let tmp_18_0;
    let tmp_20_0;
    let tmp_21_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(((tmp_16_0 = ctx_r1.editForm.get("campaignName")) == null ? null : tmp_16_0.errors) && ((tmp_16_0 = ctx_r1.editForm.get("campaignName")) == null ? null : tmp_16_0.touched) ? 11 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_18_0 = ctx_r1.editForm.get("sourceStartDate")) == null ? null : tmp_18_0.errors) && ((tmp_18_0 = ctx_r1.editForm.get("sourceStartDate")) == null ? null : tmp_18_0.touched) ? 19 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_20_0 = ctx_r1.editForm.get("sourceEndDate")) == null ? null : tmp_20_0.errors) && ((tmp_20_0 = ctx_r1.editForm.get("sourceEndDate")) == null ? null : tmp_20_0.touched) ? 27 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_21_0 = ctx_r1.editForm.get("address")) == null ? null : tmp_21_0.errors) && ((tmp_21_0 = ctx_r1.editForm.get("address")) == null ? null : tmp_21_0.touched) ? 34 : -1);
  }
}
function LeadDetail_Conditional_2_Conditional_253_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 89)(1, "div", 43)(2, "label", 78);
    \u0275\u0275text(3, "Source ");
    \u0275\u0275elementStart(4, "span", 81);
    \u0275\u0275text(5, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "p-select", 127);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 43)(8, "label", 78);
    \u0275\u0275text(9, "Category ");
    \u0275\u0275elementStart(10, "span", 81);
    \u0275\u0275text(11, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "p-select", 128);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, LeadDetail_Conditional_2_Conditional_253_Conditional_13_Template, 7, 2, "div", 43);
    \u0275\u0275elementStart(14, "div", 91)(15, "label", 78);
    \u0275\u0275text(16, "Client ");
    \u0275\u0275elementStart(17, "span", 81);
    \u0275\u0275text(18, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "p-select", 129);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 91)(21, "label", 78);
    \u0275\u0275text(22, "Contact ");
    \u0275\u0275elementStart(23, "span", 81);
    \u0275\u0275text(24, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(25, "p-select", 130);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, LeadDetail_Conditional_2_Conditional_253_Conditional_26_Template, 35, 6, "div", 94);
    \u0275\u0275elementStart(27, "div", 43)(28, "label", 78);
    \u0275\u0275text(29, "Lead Score");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "p-inputnumber", 131);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 43)(32, "label", 78);
    \u0275\u0275text(33, "Products ");
    \u0275\u0275elementStart(34, "span", 81);
    \u0275\u0275text(35, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(36, "p-multiselect", 132);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r1.editForm);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.leadLookups.sources);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.leadLookups.categories);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isEditPartnerSource ? 13 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.leadLookups.clients);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.editContactOptions);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isEditCampaignSource ? 26 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("useGrouping", false);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.editProductOptions);
  }
}
function LeadDetail_Conditional_2_ng_template_254_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_254_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 140);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_254_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateLead());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingLead);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingLead);
  }
}
function LeadDetail_Conditional_2_Conditional_279_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, "Notes are required");
    \u0275\u0275elementEnd();
  }
}
function LeadDetail_Conditional_2_ng_template_285_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_285_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.interactionDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 141);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_285_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addInteraction());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isSavingInteraction);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSavingInteraction);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 78);
    \u0275\u0275text(1, "Existing Client");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "p-select", 129);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("options", ctx_r1.conversion.existingClients);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div")(2, "label", 78);
    \u0275\u0275text(3, "Client Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 151);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "label", 78);
    \u0275\u0275text(7, "Country");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "p-select", 152);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div")(10, "label", 78);
    \u0275\u0275text(11, "Industry");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "p-select", 153);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275property("options", ctx_r1.conversion.countries);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.conversion.industries);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 78);
    \u0275\u0275text(1, "Existing Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "p-select", 154);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("options", ctx_r1.filteredContacts);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Conditional_49_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.contactNumberValidationMessage);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 91)(2, "label", 78);
    \u0275\u0275text(3, "First Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 155);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 91)(6, "label", 78);
    \u0275\u0275text(7, "Last Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "input", 156);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 91)(10, "label", 78);
    \u0275\u0275text(11, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 157);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 91)(14, "label", 78);
    \u0275\u0275text(15, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 158);
    \u0275\u0275listener("input", function LeadDetail_Conditional_2_Conditional_288_Conditional_49_Template_input_input_16_listener($event) {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.normalizeNewContactPhone($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, LeadDetail_Conditional_2_Conditional_288_Conditional_49_Conditional_17_Template, 2, 1, "span", 83);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(17);
    \u0275\u0275conditional(((tmp_15_0 = ctx_r1.conversionForm.get("newContactPhone")) == null ? null : tmp_15_0.hasError("pattern")) && ((tmp_15_0 = ctx_r1.conversionForm.get("newContactPhone")) == null ? null : tmp_15_0.touched) ? 17 : -1);
  }
}
function LeadDetail_Conditional_2_Conditional_288_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 89)(1, "div", 91)(2, "label", 78);
    \u0275\u0275text(3, "Product ");
    \u0275\u0275elementStart(4, "span", 81);
    \u0275\u0275text(5, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "p-select", 142);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 91)(8, "label", 78);
    \u0275\u0275text(9, "Opportunity Title ");
    \u0275\u0275elementStart(10, "span", 81);
    \u0275\u0275text(11, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "input", 143);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 43)(14, "label", 78);
    \u0275\u0275text(15, "Estimated Value ");
    \u0275\u0275elementStart(16, "span", 81);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(18, "p-inputnumber", 144);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 43)(20, "label", 78);
    \u0275\u0275text(21, "Currency ");
    \u0275\u0275elementStart(22, "span", 81);
    \u0275\u0275text(23, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(24, "p-select", 145);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 43)(26, "label", 78);
    \u0275\u0275text(27, "Expected Close Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "p-datepicker", 146, 8);
    \u0275\u0275listener("onSelect", function LeadDetail_Conditional_2_Conditional_288_Template_p_datepicker_onSelect_28_listener() {
      \u0275\u0275restoreView(_r23);
      const expectedCloseDatePicker_r24 = \u0275\u0275reference(29);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(expectedCloseDatePicker_r24));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 94)(31, "label", 78);
    \u0275\u0275text(32, "Owner ");
    \u0275\u0275elementStart(33, "span", 81);
    \u0275\u0275text(34, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(35, "p-select", 147);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 91)(37, "section", 108)(38, "h3", 148);
    \u0275\u0275text(39, "Client");
    \u0275\u0275elementEnd();
    \u0275\u0275element(40, "p-select", 149);
    \u0275\u0275conditionalCreate(41, LeadDetail_Conditional_2_Conditional_288_Conditional_41_Template, 3, 1)(42, LeadDetail_Conditional_2_Conditional_288_Conditional_42_Template, 13, 2, "div", 53);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 91)(44, "section", 108)(45, "h3", 148);
    \u0275\u0275text(46, "Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275element(47, "p-select", 150);
    \u0275\u0275conditionalCreate(48, LeadDetail_Conditional_2_Conditional_288_Conditional_48_Template, 3, 1)(49, LeadDetail_Conditional_2_Conditional_288_Conditional_49_Template, 18, 1, "div", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r1.conversionForm);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.conversion.productInterests);
    \u0275\u0275advance(12);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.conversion.currencies);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("options", ctx_r1.conversion.ownerUsers);
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx_r1.conversionModeOptions);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.useExistingClient ? 41 : 42);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.conversionModeOptions);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.useExistingContact ? 48 : 49);
  }
}
function LeadDetail_Conditional_2_ng_template_289_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 123);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_289_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.conversionDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 159);
    \u0275\u0275listener("onClick", function LeadDetail_Conditional_2_ng_template_289_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.convertLead());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isConverting);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isConverting);
  }
}
function LeadDetail_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "p-toast");
    \u0275\u0275elementStart(1, "section", 13)(2, "div", 14)(3, "div", 15)(4, "div", 16);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 17)(7, "button", 18);
    \u0275\u0275listener("click", function LeadDetail_Conditional_2_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.backToList());
    });
    \u0275\u0275element(8, "i", 19);
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Back to Leads");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 20)(12, "h2", 21);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "p-tag", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 23)(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "div", 25);
    \u0275\u0275conditionalCreate(23, LeadDetail_Conditional_2_Conditional_23_Template, 1, 1, "p-button", 26);
    \u0275\u0275conditionalCreate(24, LeadDetail_Conditional_2_Conditional_24_Template, 1, 1, "p-button", 27);
    \u0275\u0275conditionalCreate(25, LeadDetail_Conditional_2_Conditional_25_Template, 2, 0);
    \u0275\u0275conditionalCreate(26, LeadDetail_Conditional_2_Conditional_26_Template, 1, 1, "p-button", 28);
    \u0275\u0275conditionalCreate(27, LeadDetail_Conditional_2_Conditional_27_Template, 1, 2, "p-button", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 30)(29, "div", 31)(30, "div", 32);
    \u0275\u0275text(31, "Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 33);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 34);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 31)(37, "div", 32);
    \u0275\u0275text(38, "Lead Score");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 35);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 34);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 31)(44, "div", 32);
    \u0275\u0275text(45, "Last Interaction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 35);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 34);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 31)(51, "div", 32);
    \u0275\u0275text(52, "Next Follow-up");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 35);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 34);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(57, "div", 36)(58, "section", 37)(59, "div", 38)(60, "div", 39)(61, "div")(62, "h3", 40);
    \u0275\u0275text(63, "Account Snapshot");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "p", 41);
    \u0275\u0275text(65, "Core lead attributes and commercial context.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(66, "div", 42)(67, "div", 43)(68, "div", 32);
    \u0275\u0275text(69, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "div", 44);
    \u0275\u0275text(71);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "div", 43)(73, "div", 32);
    \u0275\u0275text(74, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "div", 44);
    \u0275\u0275text(76);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(77, "div", 43)(78, "div", 32);
    \u0275\u0275text(79, "Campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 44);
    \u0275\u0275text(81);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "div", 43)(83, "div", 32);
    \u0275\u0275text(84, "Partner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "div", 44);
    \u0275\u0275text(86);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(87, "div", 43)(88, "div", 32);
    \u0275\u0275text(89, "Date Range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "div", 44);
    \u0275\u0275text(91);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(92, "div", 43)(93, "div", 32);
    \u0275\u0275text(94, "Industry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "div", 44);
    \u0275\u0275text(96);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(97, "div", 43)(98, "div", 32);
    \u0275\u0275text(99, "Country");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "div", 44);
    \u0275\u0275text(101);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(102, "div", 45)(103, "div", 32);
    \u0275\u0275text(104, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "div", 46);
    \u0275\u0275text(106);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(107, "div", 47)(108, "div", 48)(109, "div")(110, "h3", 40);
    \u0275\u0275text(111, "Product Interest");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "p", 41);
    \u0275\u0275text(113, "Products associated with this lead.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(114, "span", 49);
    \u0275\u0275text(115);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(116, "div", 50)(117, "p-table", 51);
    \u0275\u0275template(118, LeadDetail_Conditional_2_ng_template_118_Template, 7, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(120, LeadDetail_Conditional_2_ng_template_120_Template, 7, 3, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(122, LeadDetail_Conditional_2_ng_template_122_Template, 3, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(124, "div", 47)(125, "div", 48)(126, "div")(127, "h3", 40);
    \u0275\u0275text(128, "Interactions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(129, "p", 41);
    \u0275\u0275text(130, "Communication history, notes, and scheduled follow-ups.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(131, LeadDetail_Conditional_2_Conditional_131_Template, 1, 1, "p-button", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(132, LeadDetail_Conditional_2_Conditional_132_Template, 3, 0, "div", 53)(133, LeadDetail_Conditional_2_Conditional_133_Template, 2, 0, "div", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "div", 47)(135, "h3", 40);
    \u0275\u0275text(136, "Internal Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "p", 55);
    \u0275\u0275text(138);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(139, "aside", 56)(140, "div", 38)(141, "h3", 40);
    \u0275\u0275text(142, "Primary Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "div", 57)(144, "div")(145, "div", 32);
    \u0275\u0275text(146, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(147, "div", 44);
    \u0275\u0275text(148);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "div", 58);
    \u0275\u0275text(150);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(151, "div", 59)(152, "div", 60);
    \u0275\u0275element(153, "i", 61);
    \u0275\u0275elementStart(154, "div", 17)(155, "div", 32);
    \u0275\u0275text(156, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(157, LeadDetail_Conditional_2_Conditional_157_Template, 2, 2, "a", 62)(158, LeadDetail_Conditional_2_Conditional_158_Template, 2, 0, "div", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(159, "div", 60);
    \u0275\u0275element(160, "i", 64);
    \u0275\u0275elementStart(161, "div")(162, "div", 32);
    \u0275\u0275text(163, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(164, "div", 44);
    \u0275\u0275text(165);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "div", 58);
    \u0275\u0275text(167);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(168, "div", 60);
    \u0275\u0275element(169, "i", 65);
    \u0275\u0275elementStart(170, "div", 17)(171, "div", 32);
    \u0275\u0275text(172, "Website");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "div", 66);
    \u0275\u0275text(174);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(175, "div", 47)(176, "h3", 40);
    \u0275\u0275text(177, "Ownership");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(178, "div", 67)(179, "div", 68)(180, "span", 69);
    \u0275\u0275text(181, "Assigned To");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(182, "span", 70);
    \u0275\u0275text(183);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(184, "div", 71)(185, "span", 69);
    \u0275\u0275text(186, "Assigned At");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "span", 70);
    \u0275\u0275text(188);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(189, "div", 71)(190, "span", 69);
    \u0275\u0275text(191, "Qualified At");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(192, "span", 70);
    \u0275\u0275text(193);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(194, "div", 72)(195, "span", 69);
    \u0275\u0275text(196, "Disqualification");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(197, "span", 73);
    \u0275\u0275text(198);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(199, "div", 71)(200, "span", 69);
    \u0275\u0275text(201, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(202, "span", 70);
    \u0275\u0275text(203);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(204, "div", 74)(205, "span", 69);
    \u0275\u0275text(206, "Updated");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(207, "span", 70);
    \u0275\u0275text(208);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(209, "div", 47)(210, "h3", 40);
    \u0275\u0275text(211, "Timeline");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(212, LeadDetail_Conditional_2_Conditional_212_Template, 3, 0, "div", 57)(213, LeadDetail_Conditional_2_Conditional_213_Template, 2, 0, "p", 75);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(214, "p-dialog", 76);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_214_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.qualificationDialog, $event) || (ctx_r1.qualificationDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(215, "form", 77)(216, "div")(217, "label", 78);
    \u0275\u0275text(218, "Qualification Remarks");
    \u0275\u0275elementEnd();
    \u0275\u0275element(219, "textarea", 79);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(220, LeadDetail_Conditional_2_ng_template_220_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(222, "p-dialog", 80);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_222_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.disqualificationDialog, $event) || (ctx_r1.disqualificationDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(223, "form", 77)(224, "div")(225, "label", 78);
    \u0275\u0275text(226, "Disqualification Reason ");
    \u0275\u0275elementStart(227, "span", 81);
    \u0275\u0275text(228, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(229, "input", 82);
    \u0275\u0275conditionalCreate(230, LeadDetail_Conditional_2_Conditional_230_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "div")(232, "label", 78);
    \u0275\u0275text(233, "Remarks");
    \u0275\u0275elementEnd();
    \u0275\u0275element(234, "textarea", 84);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(235, LeadDetail_Conditional_2_ng_template_235_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(237, "p-dialog", 85);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_237_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.assignmentDialog, $event) || (ctx_r1.assignmentDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(238, "form", 77)(239, "div")(240, "label", 78);
    \u0275\u0275text(241, "Assignee ");
    \u0275\u0275elementStart(242, "span", 81);
    \u0275\u0275text(243, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(244, "p-select", 86);
    \u0275\u0275conditionalCreate(245, LeadDetail_Conditional_2_Conditional_245_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(246, "div")(247, "label", 78);
    \u0275\u0275text(248, "Remarks");
    \u0275\u0275elementEnd();
    \u0275\u0275element(249, "textarea", 87);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(250, LeadDetail_Conditional_2_ng_template_250_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(252, "p-dialog", 88);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_252_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editDialog, $event) || (ctx_r1.editDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275conditionalCreate(253, LeadDetail_Conditional_2_Conditional_253_Template, 37, 9, "form", 89);
    \u0275\u0275template(254, LeadDetail_Conditional_2_ng_template_254_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(256, "p-dialog", 90);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_256_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.interactionDialog, $event) || (ctx_r1.interactionDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(257, "form", 89)(258, "div", 91)(259, "label", 78);
    \u0275\u0275text(260, "Type ");
    \u0275\u0275elementStart(261, "span", 81);
    \u0275\u0275text(262, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(263, "p-select", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(264, "div", 91)(265, "label", 78);
    \u0275\u0275text(266, "Interaction Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(267, "p-datepicker", 93, 4);
    \u0275\u0275listener("onSelect", function LeadDetail_Conditional_2_Template_p_datepicker_onSelect_267_listener() {
      \u0275\u0275restoreView(_r3);
      const interactionDatePicker_r20 = \u0275\u0275reference(268);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(interactionDatePicker_r20));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(269, "div", 94)(270, "label", 78);
    \u0275\u0275text(271, "Subject");
    \u0275\u0275elementEnd();
    \u0275\u0275element(272, "input", 95);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(273, "div", 94)(274, "label", 78);
    \u0275\u0275text(275, "Notes ");
    \u0275\u0275elementStart(276, "span", 81);
    \u0275\u0275text(277, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(278, "textarea", 96);
    \u0275\u0275conditionalCreate(279, LeadDetail_Conditional_2_Conditional_279_Template, 2, 0, "span", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(280, "div", 94)(281, "label", 78);
    \u0275\u0275text(282, "Next Follow-up Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(283, "p-datepicker", 97, 5);
    \u0275\u0275listener("onSelect", function LeadDetail_Conditional_2_Template_p_datepicker_onSelect_283_listener() {
      \u0275\u0275restoreView(_r3);
      const nextFollowUpDatePicker_r21 = \u0275\u0275reference(284);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeDatePicker(nextFollowUpDatePicker_r21));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(285, LeadDetail_Conditional_2_ng_template_285_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(287, "p-dialog", 98);
    \u0275\u0275twoWayListener("visibleChange", function LeadDetail_Conditional_2_Template_p_dialog_visibleChange_287_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.conversionDialog, $event) || (ctx_r1.conversionDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275conditionalCreate(288, LeadDetail_Conditional_2_Conditional_288_Template, 50, 12, "form", 89);
    \u0275\u0275template(289, LeadDetail_Conditional_2_ng_template_289_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_67_0;
    let tmp_73_0;
    let tmp_87_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.leadInitials, " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.lead.clientName || ctx_r1.lead.companyName);
    \u0275\u0275advance();
    \u0275\u0275property("severity", ctx_r1.statusSeverity)("value", ctx_r1.lead.status);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.lead.leadNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.lead.sourceName, " / ", ctx_r1.lead.categoryName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.countryName));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canShowInteractionAction ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canShowConvert ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canShowQualificationActions ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canShowAssignAction ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canShowEditActions ? 27 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.assignedToUserName || ctx_r1.lead.assignedToUserId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDateOnly(ctx_r1.lead.assignedAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.leadScore));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.lead.productInterests.length, " product interest(s)");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((ctx_r1.latestInteraction == null ? null : ctx_r1.latestInteraction.interactionType) || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.latestInteraction == null ? null : ctx_r1.latestInteraction.interactionDate));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.nextFollowUpDate));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.openActivityCount, " scheduled follow-up(s)");
    \u0275\u0275advance(15);
    \u0275\u0275textInterpolate(ctx_r1.lead.sourceName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.lead.categoryName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.campaignName));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.partnerName));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.formatDateOnly(ctx_r1.lead.sourceStartDate), " - ", ctx_r1.formatDateOnly(ctx_r1.lead.sourceEndDate));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.industryName));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.lead.countryName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.address));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r1.lead.productInterests.length, " item(s)");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.lead.productInterests)("tableStyle", \u0275\u0275pureFunction0(92, _c0));
    \u0275\u0275advance(14);
    \u0275\u0275conditional(ctx_r1.canShowInteractionAction ? 131 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.interactions.length ? 132 : 133);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.notes));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.lead.clientContactName || ctx_r1.lead.contactPersonName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.jobTitle));
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.lead.email ? 157 : 158);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.phone));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.alternatePhone));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.website));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.assignedToUserName || ctx_r1.lead.assignedToUserId));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.lead.assignedAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.lead.qualificationDate));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.optional(ctx_r1.lead.disqualificationReason));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.lead.createdAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(ctx_r1.lead.updatedAt));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.lead.timelineEntries.length ? 212 : 213);
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(93, _c1));
    \u0275\u0275twoWayProperty("visible", ctx_r1.qualificationDialog);
    \u0275\u0275property("modal", true);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.qualificationForm);
    \u0275\u0275advance(7);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(94, _c1));
    \u0275\u0275twoWayProperty("visible", ctx_r1.disqualificationDialog);
    \u0275\u0275property("modal", true);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.disqualificationForm);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_67_0 = ctx_r1.disqualificationForm.get("disqualificationReason")) == null ? null : tmp_67_0.errors) && ((tmp_67_0 = ctx_r1.disqualificationForm.get("disqualificationReason")) == null ? null : tmp_67_0.touched) ? 230 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(95, _c1));
    \u0275\u0275twoWayProperty("visible", ctx_r1.assignmentDialog);
    \u0275\u0275property("modal", true);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.assignmentForm);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.users);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_73_0 = ctx_r1.assignmentForm.get("assignedToUserId")) == null ? null : tmp_73_0.errors) && ((tmp_73_0 = ctx_r1.assignmentForm.get("assignedToUserId")) == null ? null : tmp_73_0.touched) ? 245 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(96, _c2));
    \u0275\u0275twoWayProperty("visible", ctx_r1.editDialog);
    \u0275\u0275property("modal", true)("contentStyle", \u0275\u0275pureFunction0(97, _c3));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.leadLookups ? 253 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(98, _c4));
    \u0275\u0275twoWayProperty("visible", ctx_r1.interactionDialog);
    \u0275\u0275property("modal", true);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.interactionForm);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.interactionTypeOptions);
    \u0275\u0275advance(4);
    \u0275\u0275property("showTime", true)("hideOnDateTimeSelect", false)("showIcon", true);
    \u0275\u0275advance(12);
    \u0275\u0275conditional(((tmp_87_0 = ctx_r1.interactionForm.get("notes")) == null ? null : tmp_87_0.errors) && ((tmp_87_0 = ctx_r1.interactionForm.get("notes")) == null ? null : tmp_87_0.touched) ? 279 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("showTime", true)("hideOnDateTimeSelect", false)("showIcon", true);
    \u0275\u0275advance(4);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(99, _c5));
    \u0275\u0275twoWayProperty("visible", ctx_r1.conversionDialog);
    \u0275\u0275property("modal", true)("contentStyle", \u0275\u0275pureFunction0(100, _c3));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.conversion ? 288 : -1);
  }
}
var LeadDetail = class _LeadDetail {
  route;
  router;
  leadApiService;
  userApiService;
  authService;
  nonEditableStatuses = /* @__PURE__ */ new Set(["assigned", "converted"]);
  qualificationStatuses = /* @__PURE__ */ new Set(["new"]);
  lead;
  isLoading = true;
  isSavingStatus = false;
  isAssigning = false;
  isConverting = false;
  isSavingLead = false;
  isSavingInteraction = false;
  errorMessage = "";
  canEditLead = false;
  canApproveLead = false;
  qualificationDialog = false;
  disqualificationDialog = false;
  assignmentDialog = false;
  editDialog = false;
  conversionDialog = false;
  interactionDialog = false;
  conversion;
  interactions = [];
  leadLookups;
  users = [];
  interactionTypeOptions = [
    { label: "Call", value: "Call" },
    { label: "Meeting", value: "Meeting" },
    { label: "Note", value: "Note" }
  ];
  conversionModeOptions = [
    { label: "Create New", value: "new" },
    { label: "Use Existing", value: "existing" }
  ];
  contactNumberValidationMessage = NEPAL_CONTACT_NUMBER_MESSAGE;
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  sourceSubscription;
  partnerSubscription;
  clientSubscription;
  contactModeSubscription;
  qualificationForm = this.fb.group({
    qualificationRemarks: ["", [Validators.maxLength(1e3)]]
  });
  disqualificationForm = this.fb.group({
    disqualificationReason: ["", [Validators.required, Validators.maxLength(500)]],
    disqualificationRemarks: ["", [Validators.maxLength(1e3)]]
  });
  assignmentForm = this.fb.group({
    assignedToUserId: ["", Validators.required],
    remarks: ["", [Validators.maxLength(1e3)]]
  });
  interactionForm = this.fb.group({
    interactionType: ["Call", Validators.required],
    subject: ["", [Validators.maxLength(250)]],
    notes: ["", [Validators.required, Validators.maxLength(2e3)]],
    interactionDate: [null],
    nextFollowUpDate: [null]
  });
  editForm = this.fb.group({
    sourceId: ["", Validators.required],
    categoryId: ["", Validators.required],
    partnerId: [""],
    campaignName: [""],
    sourceStartDate: [""],
    sourceEndDate: [""],
    clientId: ["", Validators.required],
    clientContactId: ["", Validators.required],
    address: [""],
    notes: [""],
    leadScore: [null],
    productIds: [[], Validators.required]
  });
  conversionForm = this.fb.group({
    productId: ["", Validators.required],
    clientMode: ["new", Validators.required],
    clientId: [""],
    newClientName: [""],
    newClientCountryId: [""],
    newClientIndustryId: [""],
    contactMode: ["new", Validators.required],
    contactId: [""],
    newContactFirstName: [""],
    newContactLastName: [""],
    newContactEmail: [""],
    newContactPhone: ["", Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)],
    opportunityTitle: ["", Validators.required],
    estimatedValue: [0, [Validators.required, Validators.min(0)]],
    currencyId: ["", Validators.required],
    expectedCloseDate: [""],
    ownerUserId: ["", Validators.required]
  });
  constructor(route, router, leadApiService, userApiService, authService) {
    this.route = route;
    this.router = router;
    this.leadApiService = leadApiService;
    this.userApiService = userApiService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canEditLead = this.authService.hasPermission(Permissions.leads.edit);
    this.canApproveLead = this.authService.hasPermission(Permissions.leads.approve);
    this.sourceSubscription = this.editForm.controls.sourceId.valueChanges.subscribe(() => this.applyEditSourceRules());
    this.partnerSubscription = this.editForm.controls.partnerId.valueChanges.subscribe(() => this.clearUnavailableEditProducts());
    this.clientSubscription = this.editForm.controls.clientId.valueChanges.subscribe(() => this.clearUnavailableEditContact());
    this.contactModeSubscription = this.conversionForm.controls.contactMode.valueChanges.subscribe(() => this.applyConversionContactRules());
    this.loadLead();
  }
  ngOnDestroy() {
    this.sourceSubscription?.unsubscribe();
    this.partnerSubscription?.unsubscribe();
    this.clientSubscription?.unsubscribe();
    this.contactModeSubscription?.unsubscribe();
  }
  loadLead() {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.errorMessage = "Lead id is missing.";
      this.isLoading = false;
      return;
    }
    forkJoin({
      lead: this.leadApiService.getLead(id),
      interactions: this.leadApiService.getLeadInteractions(id)
    }).subscribe({
      next: ({ lead, interactions }) => {
        this.lead = lead;
        this.interactions = interactions;
        this.isLoading = false;
        this.errorMessage = "";
      },
      error: (error) => {
        this.errorMessage = error.status === 403 ? "You are not allowed to view this lead." : "Lead was not found.";
        this.isLoading = false;
      }
    });
  }
  get statusSeverity() {
    switch (this.lead?.status?.toLowerCase()) {
      case "qualified":
        return "success";
      case "disqualified":
        return "danger";
      case "assigned":
        return "info";
      case "new":
        return "secondary";
      default:
        return "warn";
    }
  }
  get canShowConvert() {
    return this.canApproveLead && this.canAccessAssignedLead && this.lead?.status?.toLowerCase() === "qualified" && !this.lead.convertedOpportunityId;
  }
  get canShowQualificationActions() {
    return this.canEditLead && this.qualificationStatuses.has(this.leadStatus);
  }
  get canShowEditActions() {
    return this.canEditLead && !this.nonEditableStatuses.has(this.leadStatus);
  }
  get canShowAssignAction() {
    return this.canEditLead && this.lead?.status?.toLowerCase() === "qualified";
  }
  get canShowInteractionAction() {
    return this.canEditLead && this.leadStatus !== "converted";
  }
  get editActionLabel() {
    return this.leadStatus === "disqualified" ? "Re-submit" : "Edit";
  }
  get leadStatus() {
    return this.lead?.status?.toLowerCase() ?? "";
  }
  get canAccessAssignedLead() {
    if (this.authService.hasAnyRole(["Admin", "SuperAdmin"])) {
      return true;
    }
    const assignedToUserId = this.lead?.assignedToUserId?.toLowerCase();
    const currentUserId = this.authService.currentUser()?.userId?.toLowerCase();
    return !!assignedToUserId && assignedToUserId === currentUserId;
  }
  get leadInitials() {
    return this.getInitials(this.lead?.clientName || this.lead?.companyName || "");
  }
  get latestInteraction() {
    return this.interactions[0];
  }
  get nextFollowUpDate() {
    return this.interactions.filter((interaction) => !!interaction.nextFollowUpDate).map((interaction) => interaction.nextFollowUpDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  }
  get openActivityCount() {
    return this.interactions.filter((interaction) => !!interaction.nextFollowUpDate).length;
  }
  interactionSeverity(type) {
    switch (type?.toLowerCase()) {
      case "call":
        return "info";
      case "meeting":
        return "success";
      case "note":
        return "secondary";
      default:
        return "warn";
    }
  }
  interactionIcon(type) {
    switch (type?.toLowerCase()) {
      case "call":
        return "pi pi-phone";
      case "meeting":
        return "pi pi-calendar";
      case "note":
        return "pi pi-file-edit";
      default:
        return "pi pi-comments";
    }
  }
  timelineIcon(eventType) {
    const normalized = eventType?.toLowerCase() ?? "";
    if (normalized.includes("created"))
      return "pi pi-plus";
    if (normalized.includes("assigned"))
      return "pi pi-user-plus";
    if (normalized.includes("status") || normalized.includes("qualified"))
      return "pi pi-check-circle";
    if (normalized.includes("converted"))
      return "pi pi-arrow-right-arrow-left";
    if (normalized.includes("interaction"))
      return "pi pi-comments";
    return "pi pi-clock";
  }
  openQualificationDialog() {
    if (!this.canShowQualificationActions) {
      return;
    }
    this.qualificationForm.reset({ qualificationRemarks: "" });
    this.qualificationDialog = true;
  }
  openDisqualificationDialog() {
    if (!this.canShowQualificationActions) {
      return;
    }
    this.disqualificationForm.reset({ disqualificationReason: "", disqualificationRemarks: "" });
    this.disqualificationDialog = true;
  }
  openAssignmentDialog() {
    this.assignmentForm.reset({ assignedToUserId: this.lead?.assignedToUserId ?? "", remarks: "" });
    this.assignmentDialog = true;
    if (this.users.length) {
      return;
    }
    this.isAssigning = true;
    this.userApiService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((user) => user.isActive);
        this.isAssigning = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isAssigning = false;
      }
    });
  }
  openEditDialog() {
    if (!this.lead || !this.canShowEditActions) {
      return;
    }
    this.isSavingLead = true;
    forkJoin({
      lookups: this.leadLookups ? of(this.leadLookups) : this.leadApiService.getLookupBundle(),
      lead: this.leadApiService.getLeadForEdit(this.lead.id)
    }).subscribe({
      next: ({ lookups, lead }) => {
        this.leadLookups = lookups;
        this.editForm.reset({
          sourceId: lead.sourceId,
          categoryId: lead.categoryId,
          partnerId: lead.partnerId ?? "",
          campaignName: lead.campaignName ?? "",
          sourceStartDate: this.formatDateInput(lead.sourceStartDate),
          sourceEndDate: this.formatDateInput(lead.sourceEndDate),
          clientId: lead.clientId ?? "",
          clientContactId: lead.clientContactId ?? "",
          address: lead.address ?? "",
          notes: "",
          leadScore: lead.leadScore ?? null,
          productIds: lead.selectedProductIds
        });
        this.applyEditSourceRules();
        this.clearUnavailableEditContact();
        this.editDialog = true;
        this.isSavingLead = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isSavingLead = false;
      }
    });
  }
  openInteractionDialog() {
    this.interactionForm.reset({
      interactionType: "Call",
      subject: "",
      notes: "",
      interactionDate: /* @__PURE__ */ new Date(),
      nextFollowUpDate: null
    });
    this.interactionDialog = true;
  }
  openConversionDialog() {
    if (!this.lead || !this.canShowConvert) {
      return;
    }
    this.isConverting = true;
    this.leadApiService.getLeadConversion(this.lead.id).subscribe({
      next: (conversion) => {
        this.conversion = conversion;
        const firstProduct = conversion.productInterests[0]?.productId ?? "";
        const firstCurrency = conversion.currencies[0]?.id ?? "";
        const defaultOwnerUserId = conversion.defaultOwnerUserId ?? conversion.ownerUsers[0]?.id ?? "";
        const selectedClientId = this.resolveConversionClientId(conversion);
        const selectedContactId = this.resolveConversionContactId(conversion, selectedClientId);
        this.conversionForm.reset({
          productId: firstProduct,
          clientMode: selectedClientId ? "existing" : "new",
          clientId: selectedClientId,
          newClientName: conversion.companyName,
          newClientCountryId: conversion.countries[0]?.id ?? "",
          newClientIndustryId: "",
          contactMode: selectedContactId ? "existing" : "new",
          contactId: selectedContactId,
          newContactFirstName: this.firstName(conversion.contactPersonName),
          newContactLastName: this.lastName(conversion.contactPersonName),
          newContactEmail: conversion.email ?? "",
          newContactPhone: conversion.phone ?? "",
          opportunityTitle: `${conversion.companyName} Opportunity`,
          estimatedValue: 0,
          currencyId: firstCurrency,
          expectedCloseDate: "",
          ownerUserId: defaultOwnerUserId
        });
        this.applyConversionContactRules();
        this.conversionDialog = true;
        this.isConverting = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isConverting = false;
      }
    });
  }
  qualifyLead() {
    if (!this.lead) {
      return;
    }
    this.qualificationForm.markAllAsTouched();
    if (this.qualificationForm.invalid) {
      return;
    }
    const value = this.qualificationForm.getRawValue();
    this.isSavingStatus = true;
    this.leadApiService.qualifyLead(this.lead.id, { qualificationRemarks: value.qualificationRemarks ?? void 0 }).subscribe({
      next: () => {
        this.qualificationDialog = false;
        this.messageService.add({ severity: "success", summary: "Lead qualified", detail: "Conversion is now available for this lead.", life: 4e3 });
        this.loadLead();
        this.isSavingStatus = false;
      },
      error: (error) => this.handleStatusError(error)
    });
  }
  disqualifyLead() {
    if (!this.lead) {
      return;
    }
    this.disqualificationForm.markAllAsTouched();
    if (this.disqualificationForm.invalid) {
      return;
    }
    const value = this.disqualificationForm.getRawValue();
    this.isSavingStatus = true;
    this.leadApiService.disqualifyLead(this.lead.id, {
      disqualificationReason: value.disqualificationReason ?? "",
      disqualificationRemarks: value.disqualificationRemarks ?? void 0
    }).subscribe({
      next: () => {
        this.disqualificationDialog = false;
        this.messageService.add({ severity: "success", summary: "Lead disqualified", detail: "The reason and timeline entry were recorded.", life: 4e3 });
        this.loadLead();
        this.isSavingStatus = false;
      },
      error: (error) => this.handleStatusError(error)
    });
  }
  assignLead() {
    if (!this.lead) {
      return;
    }
    this.assignmentForm.markAllAsTouched();
    if (this.assignmentForm.invalid) {
      return;
    }
    const value = this.assignmentForm.getRawValue();
    this.isAssigning = true;
    this.leadApiService.assignLead(this.lead.id, {
      assignedToUserId: value.assignedToUserId ?? "",
      remarks: value.remarks ?? void 0
    }).subscribe({
      next: () => {
        this.assignmentDialog = false;
        this.messageService.add({ severity: "success", summary: "Lead assigned", detail: "Assignment was updated.", life: 4e3 });
        this.loadLead();
        this.isAssigning = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isAssigning = false;
      }
    });
  }
  addInteraction() {
    if (!this.lead) {
      return;
    }
    this.interactionForm.markAllAsTouched();
    if (this.interactionForm.invalid) {
      return;
    }
    this.isSavingInteraction = true;
    this.leadApiService.createLeadInteraction(this.lead.id, this.buildInteractionRequest()).subscribe({
      next: () => {
        this.interactionDialog = false;
        this.messageService.add({ severity: "success", summary: "Interaction saved", detail: "The interaction was added to the lead timeline.", life: 4e3 });
        this.loadLead();
        this.isSavingInteraction = false;
      },
      error: (error) => {
        this.handleActionError(error, "Interaction failed", "Lead interaction could not be saved.");
        this.isSavingInteraction = false;
      }
    });
  }
  convertLead() {
    if (!this.lead) {
      return;
    }
    this.conversionForm.markAllAsTouched();
    if (this.conversionForm.invalid) {
      return;
    }
    const request = this.buildConversionRequest();
    this.isConverting = true;
    this.leadApiService.convertLead(this.lead.id, request).subscribe({
      next: (opportunity) => {
        this.conversionDialog = false;
        this.messageService.add({ severity: "success", summary: "Lead converted", detail: `${opportunity.opportunityNumber} was created.`, life: 5e3 });
        this.loadLead();
        this.isConverting = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isConverting = false;
      }
    });
  }
  updateLead() {
    if (!this.lead) {
      return;
    }
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    }
    this.isSavingLead = true;
    const wasDisqualified = this.lead.status?.toLowerCase() === "disqualified";
    this.leadApiService.updateLead(this.lead.id, this.buildUpdateLeadRequest()).subscribe({
      next: (lead) => {
        this.editDialog = false;
        const summary = wasDisqualified ? "Lead resubmitted" : "Lead updated";
        const detail = wasDisqualified ? `${lead.leadNumber} was moved back to the active qualification pipeline.` : `${lead.leadNumber} was updated successfully.`;
        this.messageService.add({ severity: "success", summary, detail, life: 4e3 });
        this.loadLead();
        this.isSavingLead = false;
      },
      error: (error) => {
        this.handleStatusError(error);
        this.isSavingLead = false;
      }
    });
  }
  backToList() {
    this.router.navigate(["/pages/leads"]);
  }
  formatDate(value) {
    return value ? new Date(value).toLocaleString() : "Not set";
  }
  optional(value) {
    return value === void 0 || value === null || value === "" ? "Not set" : String(value);
  }
  formatDateOnly(value) {
    return value ? new Date(value).toLocaleDateString() : "Not set";
  }
  closeDatePicker(picker) {
    setTimeout(() => picker.hideOverlay(), 0);
  }
  normalizeNewContactPhone(event) {
    const input = event.target;
    const value = input.value.replace(/\D/g, "").slice(0, 10);
    if (input.value === value) {
      return;
    }
    input.value = value;
    this.conversionForm.controls.newContactPhone.setValue(value);
  }
  get filteredContacts() {
    const clientId = this.conversionForm.controls.clientId.value;
    return this.conversion?.existingContacts.filter((contact) => contact.clientId === clientId) ?? [];
  }
  get useExistingClient() {
    return this.conversionForm.controls.clientMode.value === "existing";
  }
  get useExistingContact() {
    return this.conversionForm.controls.contactMode.value === "existing";
  }
  get isEditCampaignSource() {
    return this.selectedEditSourceCode() === "campaign";
  }
  get isEditPartnerSource() {
    return this.selectedEditSourceCode() === "partner";
  }
  get editProductOptions() {
    if (!this.leadLookups) {
      return [];
    }
    if (!this.isPartnerOwnedEditProductContext) {
      return this.leadLookups.products.filter((product) => !product.ownershipTypeCode || product.ownershipTypeCode === "InHouse");
    }
    const assignedProductIds = this.selectedEditPartnerProductIds;
    return this.leadLookups.products.filter((product) => assignedProductIds.has(product.id));
  }
  get editContactOptions() {
    const clientId = this.editForm.controls.clientId.value;
    return this.leadLookups?.contacts.filter((contact) => contact.clientId === clientId) ?? [];
  }
  get isPartnerOwnedEditProductContext() {
    if (!this.isEditPartnerSource) {
      return false;
    }
    const partnerTypeCode = this.selectedEditPartnerTypeCode();
    return partnerTypeCode === "vendor" || partnerTypeCode === "supplier";
  }
  get selectedEditPartnerProductIds() {
    const partnerId = this.editForm.controls.partnerId.value;
    const partner = this.leadLookups?.partners.find((item) => item.id === partnerId);
    return new Set((partner?.productIds ?? []).map(String));
  }
  buildInteractionRequest() {
    const value = this.interactionForm.getRawValue();
    return {
      leadId: this.lead?.id ?? "",
      interactionType: value.interactionType ?? "",
      subject: this.optionalFormString(value.subject) ?? void 0,
      notes: value.notes ?? "",
      interactionDate: this.toIsoDateTime(value.interactionDate),
      nextFollowUpDate: this.toIsoDateTime(value.nextFollowUpDate)
    };
  }
  buildUpdateLeadRequest() {
    const value = this.editForm.getRawValue();
    return {
      sourceId: value.sourceId ?? "",
      categoryId: value.categoryId ?? "",
      partnerId: this.optionalFormString(value.partnerId),
      campaignName: this.optionalFormString(value.campaignName),
      sourceStartDate: this.optionalFormString(value.sourceStartDate),
      sourceEndDate: this.optionalFormString(value.sourceEndDate),
      clientId: value.clientId ?? "",
      clientContactId: value.clientContactId ?? "",
      companyName: "",
      website: null,
      contactPersonName: "",
      jobTitle: null,
      email: null,
      phone: null,
      alternatePhone: null,
      countryId: "00000000-0000-0000-0000-000000000000",
      address: this.optionalFormString(value.address),
      industryId: null,
      notes: null,
      leadScore: value.leadScore,
      productIds: value.productIds ?? []
    };
  }
  applyEditSourceRules() {
    this.setRequired("campaignName", this.isEditCampaignSource);
    this.setRequired("partnerId", this.isEditPartnerSource);
    this.setRequired("sourceStartDate", this.isEditCampaignSource);
    this.setRequired("sourceEndDate", this.isEditCampaignSource);
    this.setRequired("address", this.isEditCampaignSource);
    if (!this.isEditCampaignSource) {
      this.editForm.controls.campaignName.reset("", { emitEvent: false });
      this.editForm.controls.sourceStartDate.reset("", { emitEvent: false });
      this.editForm.controls.sourceEndDate.reset("", { emitEvent: false });
      this.editForm.controls.address.reset("", { emitEvent: false });
    }
    if (!this.isEditPartnerSource) {
      this.editForm.controls.partnerId.reset("", { emitEvent: false });
    }
    this.clearUnavailableEditProducts();
  }
  setRequired(controlName, required) {
    const control = this.editForm.controls[controlName];
    control.setValidators(required ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }
  selectedEditSourceCode() {
    const sourceId = this.editForm.controls.sourceId.value;
    const source = this.leadLookups?.sources.find((item) => item.id === sourceId);
    return String(source?.code ?? source?.name ?? "").trim().toLowerCase();
  }
  selectedEditPartnerTypeCode() {
    const partnerId = this.editForm.controls.partnerId.value;
    const partner = this.leadLookups?.partners.find((item) => item.id === partnerId);
    return String(partner?.partnerTypeCode ?? "").trim().replace(/-/g, "_").toLowerCase();
  }
  clearUnavailableEditProducts() {
    const allowedProductIds = new Set(this.editProductOptions.map((product) => product.id));
    const selectedProductIds = this.editForm.controls.productIds.value ?? [];
    const availableProductIds = selectedProductIds.filter((productId) => allowedProductIds.has(productId));
    if (availableProductIds.length !== selectedProductIds.length) {
      this.editForm.controls.productIds.reset(availableProductIds, { emitEvent: false });
    }
  }
  clearUnavailableEditContact() {
    const contactId = this.editForm.controls.clientContactId.value;
    if (!contactId || this.editContactOptions.some((contact) => contact.id === contactId)) {
      return;
    }
    this.editForm.controls.clientContactId.reset("", { emitEvent: false });
  }
  applyConversionContactRules() {
    const control = this.conversionForm.controls.newContactPhone;
    control.setValidators(this.useExistingContact ? [] : [Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)]);
    control.updateValueAndValidity({ emitEvent: false });
  }
  buildConversionRequest() {
    const value = this.conversionForm.getRawValue();
    const request = {
      productId: value.productId ?? "",
      opportunityTitle: value.opportunityTitle ?? "",
      estimatedValue: value.estimatedValue ?? 0,
      currencyId: value.currencyId ?? "",
      expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : void 0,
      ownerUserId: value.ownerUserId ?? ""
    };
    return request;
  }
  resolveConversionClientId(conversion) {
    const selectedClient = this.findClientById(conversion, conversion.selectedClientId);
    if (selectedClient) {
      return selectedClient.id;
    }
    const selectedContact = this.findContactById(conversion, conversion.selectedContactId);
    if (selectedContact) {
      return selectedContact.clientId;
    }
    return this.findMatchingClient(conversion)?.id ?? this.findMatchingContact(conversion)?.clientId ?? "";
  }
  resolveConversionContactId(conversion, clientId) {
    const selectedContact = this.findContactById(conversion, conversion.selectedContactId, clientId);
    if (selectedContact) {
      return selectedContact.id;
    }
    return this.findMatchingContact(conversion, clientId)?.id ?? "";
  }
  findClientById(conversion, clientId) {
    return clientId ? conversion.existingClients.find((client) => client.id === clientId) : void 0;
  }
  findContactById(conversion, contactId, clientId) {
    const contact = contactId ? conversion.existingContacts.find((item) => item.id === contactId) : void 0;
    return contact && (!clientId || contact.clientId === clientId) ? contact : void 0;
  }
  findMatchingClient(conversion) {
    const companyName = this.normalizeComparisonValue(conversion.companyName);
    return companyName ? conversion.existingClients.find((client) => this.normalizeComparisonValue(client.name) === companyName) : void 0;
  }
  findMatchingContact(conversion, clientId) {
    const candidates = clientId ? conversion.existingContacts.filter((contact) => contact.clientId === clientId) : conversion.existingContacts;
    const email = this.normalizeComparisonValue(conversion.email);
    if (email) {
      const contactByEmail = candidates.find((contact) => this.normalizeComparisonValue(contact.email) === email);
      if (contactByEmail) {
        return contactByEmail;
      }
    }
    const contactName = this.normalizeComparisonValue(conversion.contactPersonName);
    return contactName ? candidates.find((contact) => this.normalizeComparisonValue(contact.fullName) === contactName) : void 0;
  }
  normalizeComparisonValue(value) {
    return value?.trim().toLowerCase().replace(/[\W_]+/g, "") ?? "";
  }
  firstName(fullName) {
    return fullName.trim().split(/\s+/)[0] ?? "";
  }
  lastName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(" ") : "-";
  }
  getInitials(value) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return "LD";
    }
    return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  }
  formatDateInput(value) {
    return value ? new Date(value).toISOString().slice(0, 10) : "";
  }
  toIsoDateTime(value) {
    if (!value) {
      return void 0;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
  }
  optionalFormString(value) {
    return value?.trim() ? value : null;
  }
  handleStatusError(error) {
    const detail = error.error?.errors?.join(" ") ?? "Lead status could not be updated.";
    this.messageService.add({ severity: "error", summary: "Status update failed", detail, life: 5e3 });
    this.isSavingStatus = false;
  }
  handleActionError(error, summary, fallback) {
    const detail = error.error?.errors?.join(" ") ?? fallback;
    this.messageService.add({ severity: "error", summary, detail, life: 5e3 });
  }
  static \u0275fac = function LeadDetail_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LeadDetail)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(LeadApiService), \u0275\u0275directiveInject(UserApiService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LeadDetail, selectors: [["app-lead-detail"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 3, vars: 1, consts: [["header", ""], ["body", ""], ["emptymessage", ""], ["footer", ""], ["interactionDatePicker", ""], ["nextFollowUpDatePicker", ""], ["sourceStartDatePicker", ""], ["sourceEndDatePicker", ""], ["expectedCloseDatePicker", ""], [1, "card", "text-surface-600", "dark:text-surface-300"], [1, "card"], [1, "m-0", "text-red-600"], ["label", "Back to Leads", "icon", "pi pi-arrow-left", "text", "", 3, "onClick"], [1, "mb-4", "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "mb-4", "flex", "flex-wrap", "items-start", "justify-between", "gap-4"], [1, "flex", "min-w-0", "gap-4"], [1, "flex", "h-14", "w-14", "shrink-0", "items-center", "justify-center", "rounded-lg", "bg-primary", "text-xl", "font-semibold", "text-primary-contrast"], [1, "min-w-0"], ["type", "button", 1, "mb-2", "inline-flex", "items-center", "gap-2", "border-0", "bg-transparent", "p-0", "text-sm", "text-primary", "cursor-pointer", 3, "click"], [1, "pi", "pi-arrow-left", "text-xs"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "m-0", "text-2xl", "font-semibold", "text-surface-900", "dark:text-surface-0"], [3, "severity", "value"], [1, "mt-2", "flex", "flex-wrap", "items-center", "gap-x-3", "gap-y-1", "text-sm", "text-surface-600", "dark:text-surface-300"], [1, "font-medium", "text-surface-800", "dark:text-surface-100"], [1, "flex", "flex-wrap", "justify-end", "gap-2"], ["label", "Add Interaction", "icon", "pi pi-comments", 3, "loading"], ["label", "Convert", "icon", "pi pi-arrow-right-arrow-left", "severity", "success", 3, "loading"], ["label", "Assign", "icon", "pi pi-user-plus", "severity", "secondary", "outlined", "", 3, "loading"], ["icon", "pi pi-pencil", "severity", "secondary", "outlined", "", 3, "label", "loading"], [1, "grid", "grid-cols-12", "gap-3"], [1, "col-span-12", "rounded-md", "border", "border-surface-200", "px-4", "py-3", "dark:border-surface-700", "md:col-span-3"], [1, "text-xs", "font-semibold", "uppercase", "text-surface-500"], [1, "mt-1", "truncate", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "mt-1", "text-xs", "text-surface-500"], [1, "mt-1", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "xl:col-span-8"], [1, "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "mb-4", "flex", "items-center", "justify-between", "gap-3"], [1, "m-0", "text-lg", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "mb-0", "mt-1", "text-sm", "text-surface-500"], [1, "grid", "grid-cols-12", "gap-x-6", "gap-y-5"], [1, "col-span-12", "md:col-span-4"], [1, "mt-1", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "col-span-12", "border-t", "border-surface-200", "pt-4", "dark:border-surface-700"], [1, "mt-1", "whitespace-pre-line", "text-surface-800", "dark:text-surface-100"], [1, "mt-4", "rounded-lg", "border", "border-surface-200", "bg-surface-0", "p-5", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "mb-4", "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "rounded-md", "bg-surface-100", "px-3", "py-1", "text-sm", "font-medium", "text-surface-700", "dark:bg-surface-800", "dark:text-surface-200"], [1, "overflow-x-auto"], [3, "value", "tableStyle"], ["label", "Log", "icon", "pi pi-plus", "severity", "secondary", "outlined", "", 3, "loading"], [1, "flex", "flex-col", "gap-3"], [1, "rounded-md", "border", "border-dashed", "border-surface-300", "p-6", "text-center", "text-surface-500", "dark:border-surface-700"], [1, "mb-0", "mt-3", "whitespace-pre-line", "leading-6", "text-surface-700", "dark:text-surface-200"], [1, "col-span-12", "xl:col-span-4"], [1, "mt-4", "flex", "flex-col", "gap-4"], [1, "mt-1", "text-sm", "text-surface-500"], [1, "grid", "grid-cols-1", "gap-3"], [1, "flex", "items-start", "gap-3"], [1, "pi", "pi-envelope", "mt-1", "text-surface-400"], [1, "mt-1", "block", "truncate", "font-medium", "text-primary", 3, "href"], [1, "mt-1", "font-medium", "text-surface-700", "dark:text-surface-200"], [1, "pi", "pi-phone", "mt-1", "text-surface-400"], [1, "pi", "pi-globe", "mt-1", "text-surface-400"], [1, "mt-1", "truncate", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "mt-4", "divide-y", "divide-surface-200", "dark:divide-surface-700"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3", "first:pt-0"], [1, "text-sm", "text-surface-500"], [1, "text-right", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3"], [1, "flex", "items-start", "justify-between", "gap-4", "py-3"], [1, "max-w-48", "text-right", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "justify-between", "gap-4", "py-3", "last:pb-0"], [1, "mb-0", "mt-3", "text-surface-600", "dark:text-surface-300"], ["header", "Qualify Lead", 3, "visibleChange", "visible", "modal"], [1, "flex", "flex-col", "gap-3", 3, "formGroup"], [1, "mb-2", "block", "text-sm", "font-semibold", "text-surface-700", "dark:text-surface-200"], ["pTextarea", "", "rows", "4", "formControlName", "qualificationRemarks", 1, "w-full"], ["header", "Disqualify Lead", 3, "visibleChange", "visible", "modal"], [1, "text-red-500"], ["pInputText", "", "formControlName", "disqualificationReason", 1, "w-full"], [1, "p-error", "mt-1", "block", "text-sm", "text-red-600"], ["pTextarea", "", "rows", "4", "formControlName", "disqualificationRemarks", 1, "w-full"], ["header", "Assign Lead", 3, "visibleChange", "visible", "modal"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "assignedToUserId", 1, "w-full", 3, "options"], ["pTextarea", "", "rows", "4", "formControlName", "remarks", 1, "w-full"], ["header", "Edit Lead", 3, "visibleChange", "visible", "modal", "contentStyle"], [1, "grid", "grid-cols-12", "gap-4", 3, "formGroup"], ["header", "Add Interaction", 3, "visibleChange", "visible", "modal"], [1, "col-span-12", "md:col-span-6"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "interactionType", 1, "w-full", 3, "options"], ["formControlName", "interactionDate", "dateFormat", "yy-mm-dd", "hourFormat", "24", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showTime", "hideOnDateTimeSelect", "showIcon"], [1, "col-span-12"], ["pInputText", "", "formControlName", "subject", 1, "w-full"], ["pTextarea", "", "rows", "5", "formControlName", "notes", 1, "w-full"], ["formControlName", "nextFollowUpDate", "dateFormat", "yy-mm-dd", "hourFormat", "24", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showTime", "hideOnDateTimeSelect", "showIcon"], ["header", "Convert Lead to Opportunity", 3, "visibleChange", "visible", "modal", "contentStyle"], ["label", "Add Interaction", "icon", "pi pi-comments", 3, "onClick", "loading"], ["label", "Convert", "icon", "pi pi-arrow-right-arrow-left", "severity", "success", 3, "onClick", "loading"], ["label", "Qualify", "icon", "pi pi-check-circle", "severity", "success", "outlined", "", 3, "onClick"], ["label", "Disqualify", "icon", "pi pi-times-circle", "severity", "danger", "outlined", "", 3, "onClick"], ["label", "Assign", "icon", "pi pi-user-plus", "severity", "secondary", "outlined", "", 3, "onClick", "loading"], ["icon", "pi pi-pencil", "severity", "secondary", "outlined", "", 3, "onClick", "label", "loading"], [1, "font-medium"], ["colspan", "3"], ["label", "Log", "icon", "pi pi-plus", "severity", "secondary", "outlined", "", 3, "onClick", "loading"], [1, "rounded-md", "border", "border-surface-200", "p-4", "dark:border-surface-700"], [1, "flex", "flex-wrap", "items-start", "justify-between", "gap-3"], [1, "flex", "min-w-0", "gap-3"], [1, "flex", "h-10", "w-10", "shrink-0", "items-center", "justify-center", "rounded-md", "bg-surface-100", "text-primary", "dark:bg-surface-800"], [3, "ngClass"], [1, "m-0", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "rounded-md", "bg-amber-50", "px-3", "py-2", "text-xs", "font-medium", "text-amber-800", "dark:bg-amber-900/30", "dark:text-amber-200"], [1, "mb-0", "mt-3", "whitespace-pre-line", "text-sm", "leading-6", "text-surface-700", "dark:text-surface-200"], [1, "flex", "gap-3"], [1, "mt-1", "flex", "h-8", "w-8", "shrink-0", "items-center", "justify-center", "rounded-md", "bg-surface-100", "text-primary", "dark:bg-surface-800"], [1, "text-xs", 3, "ngClass"], [1, "min-w-0", "flex-1", "border-b", "border-surface-200", "pb-4", "last:border-0", "last:pb-0", "dark:border-surface-700"], [1, "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "mt-1", "text-sm", "leading-5", "text-surface-600", "dark:text-surface-300"], [1, "mt-2", "text-xs", "text-surface-500"], ["label", "Cancel", "icon", "pi pi-times", "text", "", 3, "onClick", "disabled"], ["label", "Qualify", "icon", "pi pi-check-circle", "severity", "success", 3, "onClick", "loading"], ["label", "Disqualify", "icon", "pi pi-times-circle", "severity", "danger", 3, "onClick", "loading"], ["label", "Assign", "icon", "pi pi-user-plus", 3, "onClick", "loading"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "sourceId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "categoryId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "clientId", 1, "w-full", 3, "options"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "clientContactId", 1, "w-full", 3, "options"], ["formControlName", "leadScore", 1, "w-full", 3, "useGrouping"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "productIds", "display", "chip", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "partnerId", 1, "w-full", 3, "options"], [1, "m-0", "mb-3", "text-base", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "col-span-12", "md:col-span-3"], ["pInputText", "", "formControlName", "campaignName", 1, "w-full"], ["formControlName", "sourceStartDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "sourceEndDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["pTextarea", "", "rows", "2", "formControlName", "address", 1, "w-full"], ["label", "Save", "icon", "pi pi-check", 3, "onClick", "loading"], ["label", "Save Interaction", "icon", "pi pi-check", 3, "onClick", "loading"], ["optionLabel", "productName", "optionValue", "productId", "appendTo", "body", "formControlName", "productId", 1, "w-full", 3, "options"], ["pInputText", "", "formControlName", "opportunityTitle", 1, "w-full"], ["formControlName", "estimatedValue", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["optionLabel", "code", "optionValue", "id", "appendTo", "body", "formControlName", "currencyId", 1, "w-full", 3, "options"], ["formControlName", "expectedCloseDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "ownerUserId", 1, "w-full", 3, "options"], [1, "mt-0", "text-base"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "clientMode", 1, "mb-3", "w-full", 3, "options"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "contactMode", 1, "mb-3", "w-full", 3, "options"], ["pInputText", "", "formControlName", "newClientName", 1, "w-full"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "newClientCountryId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "newClientIndustryId", 1, "w-full", 3, "options"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "contactId", 1, "w-full", 3, "options"], ["pInputText", "", "formControlName", "newContactFirstName", 1, "w-full"], ["pInputText", "", "formControlName", "newContactLastName", 1, "w-full"], ["pInputText", "", "formControlName", "newContactEmail", 1, "w-full"], ["pInputText", "", "formControlName", "newContactPhone", "inputmode", "numeric", "maxlength", "10", 1, "w-full", 3, "input"], ["label", "Convert", "icon", "pi pi-arrow-right-arrow-left", 3, "onClick", "loading"]], template: function LeadDetail_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, LeadDetail_Conditional_0_Template, 3, 0)(1, LeadDetail_Conditional_1_Template, 5, 1)(2, LeadDetail_Conditional_2_Template, 291, 101);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isLoading ? 0 : ctx.errorMessage ? 1 : ctx.lead ? 2 : -1);
    }
  }, dependencies: [ButtonModule, Button, CommonModule, NgClass, DatePickerModule, DatePicker, DialogModule, Dialog, InputNumberModule, InputNumber, InputTextModule, InputText, MultiSelectModule, MultiSelect, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, SelectModule, Select, TableModule, Table, TagModule, Tag, TextareaModule, Textarea, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LeadDetail, [{
    type: Component,
    args: [{ selector: "app-lead-detail", standalone: true, imports: [ButtonModule, CommonModule, DatePickerModule, DialogModule, InputNumberModule, InputTextModule, MultiSelectModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule], providers: [MessageService], template: `@if (isLoading) {\r
    <p-toast />\r
    <div class="card text-surface-600 dark:text-surface-300">Loading lead...</div>\r
} @else if (errorMessage) {\r
    <p-toast />\r
    <div class="card">\r
        <p class="m-0 text-red-600">{{ errorMessage }}</p>\r
        <p-button label="Back to Leads" icon="pi pi-arrow-left" text (onClick)="backToList()" />\r
    </div>\r
} @else if (lead) {\r
    <p-toast />\r
    <section class="mb-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
        <div class="mb-4 flex flex-wrap items-start justify-between gap-4">\r
            <div class="flex min-w-0 gap-4">\r
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-semibold text-primary-contrast">\r
                    {{ leadInitials }}\r
                </div>\r
                <div class="min-w-0">\r
                    <button type="button" class="mb-2 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-sm text-primary cursor-pointer" (click)="backToList()">\r
                        <i class="pi pi-arrow-left text-xs"></i>\r
                        <span>Back to Leads</span>\r
                    </button>\r
                    <div class="flex flex-wrap items-center gap-2">\r
                        <h2 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ lead.clientName || lead.companyName }}</h2>\r
                        <p-tag [severity]="statusSeverity" [value]="lead.status" />\r
                    </div>\r
                    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-600 dark:text-surface-300">\r
                        <span class="font-medium text-surface-800 dark:text-surface-100">{{ lead.leadNumber }}</span>\r
                        <span>{{ lead.sourceName }} / {{ lead.categoryName }}</span>\r
                        <span>{{ optional(lead.countryName) }}</span>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="flex flex-wrap justify-end gap-2">\r
                @if (canShowInteractionAction) {\r
                    <p-button label="Add Interaction" icon="pi pi-comments" [loading]="isSavingInteraction" (onClick)="openInteractionDialog()" />\r
                }\r
                @if (canShowConvert) {\r
                    <p-button label="Convert" icon="pi pi-arrow-right-arrow-left" severity="success" [loading]="isConverting" (onClick)="openConversionDialog()" />\r
                }\r
                @if (canShowQualificationActions) {\r
                    <p-button label="Qualify" icon="pi pi-check-circle" severity="success" outlined (onClick)="openQualificationDialog()" />\r
                    <p-button label="Disqualify" icon="pi pi-times-circle" severity="danger" outlined (onClick)="openDisqualificationDialog()" />\r
                }\r
                @if (canShowAssignAction) {\r
                    <p-button label="Assign" icon="pi pi-user-plus" severity="secondary" outlined [loading]="isAssigning" (onClick)="openAssignmentDialog()" />\r
                }\r
                @if (canShowEditActions) {\r
                    <p-button [label]="editActionLabel" icon="pi pi-pencil" severity="secondary" outlined [loading]="isSavingLead" (onClick)="openEditDialog()" />\r
                }\r
            </div>\r
        </div>\r
\r
        <div class="grid grid-cols-12 gap-3">\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Owner</div>\r
                <div class="mt-1 truncate font-semibold text-surface-900 dark:text-surface-0">{{ optional(lead.assignedToUserName || lead.assignedToUserId) }}</div>\r
                <div class="mt-1 text-xs text-surface-500">{{ formatDateOnly(lead.assignedAt) }}</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Lead Score</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ optional(lead.leadScore) }}</div>\r
                <div class="mt-1 text-xs text-surface-500">{{ lead.productInterests.length }} product interest(s)</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Last Interaction</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ latestInteraction?.interactionType || 'Not set' }}</div>\r
                <div class="mt-1 text-xs text-surface-500">{{ formatDate(latestInteraction?.interactionDate) }}</div>\r
            </div>\r
            <div class="col-span-12 rounded-md border border-surface-200 px-4 py-3 dark:border-surface-700 md:col-span-3">\r
                <div class="text-xs font-semibold uppercase text-surface-500">Next Follow-up</div>\r
                <div class="mt-1 font-semibold text-surface-900 dark:text-surface-0">{{ formatDate(nextFollowUpDate) }}</div>\r
                <div class="mt-1 text-xs text-surface-500">{{ openActivityCount }} scheduled follow-up(s)</div>\r
            </div>\r
        </div>\r
    </section>\r
\r
    <div class="grid grid-cols-12 gap-4">\r
        <section class="col-span-12 xl:col-span-8">\r
            <div class="rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex items-center justify-between gap-3">\r
                    <div>\r
                        <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Account Snapshot</h3>\r
                        <p class="mb-0 mt-1 text-sm text-surface-500">Core lead attributes and commercial context.</p>\r
                    </div>\r
                </div>\r
\r
                <div class="grid grid-cols-12 gap-x-6 gap-y-5">\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Source</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ lead.sourceName }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Category</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ lead.categoryName }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Campaign</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.campaignName) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Partner</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.partnerName) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Date Range</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ formatDateOnly(lead.sourceStartDate) }} - {{ formatDateOnly(lead.sourceEndDate) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Industry</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.industryName) }}</div>\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Country</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ lead.countryName }}</div>\r
                    </div>\r
                    <div class="col-span-12 border-t border-surface-200 pt-4 dark:border-surface-700">\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Address</div>\r
                        <div class="mt-1 whitespace-pre-line text-surface-800 dark:text-surface-100">{{ optional(lead.address) }}</div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">\r
                    <div>\r
                        <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Product Interest</h3>\r
                        <p class="mb-0 mt-1 text-sm text-surface-500">Products associated with this lead.</p>\r
                    </div>\r
                    <span class="rounded-md bg-surface-100 px-3 py-1 text-sm font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-200">{{ lead.productInterests.length }} item(s)</span>\r
                </div>\r
\r
                <div class="overflow-x-auto">\r
                    <p-table [value]="lead.productInterests" [tableStyle]="{ 'min-width': '42rem' }">\r
                        <ng-template #header>\r
                            <tr>\r
                                <th>Code</th>\r
                                <th>Product</th>\r
                                <th>Category</th>\r
                            </tr>\r
                        </ng-template>\r
                        <ng-template #body let-product>\r
                            <tr>\r
                                <td class="font-medium">{{ product.productCode }}</td>\r
                                <td>{{ product.productName }}</td>\r
                                <td>{{ optional(product.productCategoryName) }}</td>\r
                            </tr>\r
                        </ng-template>\r
                        <ng-template #emptymessage>\r
                            <tr>\r
                                <td colspan="3">No product interests recorded.</td>\r
                            </tr>\r
                        </ng-template>\r
                    </p-table>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">\r
                    <div>\r
                        <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Interactions</h3>\r
                        <p class="mb-0 mt-1 text-sm text-surface-500">Communication history, notes, and scheduled follow-ups.</p>\r
                    </div>\r
                    @if (canShowInteractionAction) {\r
                        <p-button label="Log" icon="pi pi-plus" severity="secondary" outlined [loading]="isSavingInteraction" (onClick)="openInteractionDialog()" />\r
                    }\r
                </div>\r
\r
                @if (interactions.length) {\r
                    <div class="flex flex-col gap-3">\r
                        @for (interaction of interactions; track interaction.id) {\r
                            <article class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                                <div class="flex flex-wrap items-start justify-between gap-3">\r
                                    <div class="flex min-w-0 gap-3">\r
                                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-100 text-primary dark:bg-surface-800">\r
                                            <i [ngClass]="interactionIcon(interaction.interactionType)"></i>\r
                                        </div>\r
                                        <div class="min-w-0">\r
                                            <div class="flex flex-wrap items-center gap-2">\r
                                                <h4 class="m-0 font-semibold text-surface-900 dark:text-surface-0">{{ interaction.subject || interaction.interactionType }}</h4>\r
                                                <p-tag [severity]="interactionSeverity(interaction.interactionType)" [value]="interaction.interactionType" />\r
                                            </div>\r
                                            <div class="mt-1 text-xs text-surface-500">\r
                                                {{ formatDate(interaction.interactionDate) }}\r
                                                @if (interaction.createdByUserName) {\r
                                                    <span> / {{ interaction.createdByUserName }}</span>\r
                                                }\r
                                            </div>\r
                                        </div>\r
                                    </div>\r
                                    @if (interaction.nextFollowUpDate) {\r
                                        <div class="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">\r
                                            Follow-up {{ formatDate(interaction.nextFollowUpDate) }}\r
                                        </div>\r
                                    }\r
                                </div>\r
                                <p class="mb-0 mt-3 whitespace-pre-line text-sm leading-6 text-surface-700 dark:text-surface-200">{{ interaction.notes }}</p>\r
                            </article>\r
                        }\r
                    </div>\r
                } @else {\r
                    <div class="rounded-md border border-dashed border-surface-300 p-6 text-center text-surface-500 dark:border-surface-700">\r
                        No interactions recorded yet.\r
                    </div>\r
                }\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Internal Notes</h3>\r
                <p class="mb-0 mt-3 whitespace-pre-line leading-6 text-surface-700 dark:text-surface-200">{{ optional(lead.notes) }}</p>\r
            </div>\r
        </section>\r
\r
        <aside class="col-span-12 xl:col-span-4">\r
            <div class="rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Primary Contact</h3>\r
                <div class="mt-4 flex flex-col gap-4">\r
                    <div>\r
                        <div class="text-xs font-semibold uppercase text-surface-500">Name</div>\r
                        <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ lead.clientContactName || lead.contactPersonName }}</div>\r
                        <div class="mt-1 text-sm text-surface-500">{{ optional(lead.jobTitle) }}</div>\r
                    </div>\r
                    <div class="grid grid-cols-1 gap-3">\r
                        <div class="flex items-start gap-3">\r
                            <i class="pi pi-envelope mt-1 text-surface-400"></i>\r
                            <div class="min-w-0">\r
                                <div class="text-xs font-semibold uppercase text-surface-500">Email</div>\r
                                @if (lead.email) {\r
                                    <a class="mt-1 block truncate font-medium text-primary" [href]="'mailto:' + lead.email">{{ lead.email }}</a>\r
                                } @else {\r
                                    <div class="mt-1 font-medium text-surface-700 dark:text-surface-200">Not set</div>\r
                                }\r
                            </div>\r
                        </div>\r
                        <div class="flex items-start gap-3">\r
                            <i class="pi pi-phone mt-1 text-surface-400"></i>\r
                            <div>\r
                                <div class="text-xs font-semibold uppercase text-surface-500">Phone</div>\r
                                <div class="mt-1 font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.phone) }}</div>\r
                                <div class="mt-1 text-sm text-surface-500">{{ optional(lead.alternatePhone) }}</div>\r
                            </div>\r
                        </div>\r
                        <div class="flex items-start gap-3">\r
                            <i class="pi pi-globe mt-1 text-surface-400"></i>\r
                            <div class="min-w-0">\r
                                <div class="text-xs font-semibold uppercase text-surface-500">Website</div>\r
                                <div class="mt-1 truncate font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.website) }}</div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Ownership</h3>\r
                <div class="mt-4 divide-y divide-surface-200 dark:divide-surface-700">\r
                    <div class="flex items-center justify-between gap-4 py-3 first:pt-0">\r
                        <span class="text-sm text-surface-500">Assigned To</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.assignedToUserName || lead.assignedToUserId) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Assigned At</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(lead.assignedAt) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Qualified At</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(lead.qualificationDate) }}</span>\r
                    </div>\r
                    <div class="flex items-start justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Disqualification</span>\r
                        <span class="max-w-48 text-right font-medium text-surface-900 dark:text-surface-0">{{ optional(lead.disqualificationReason) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3">\r
                        <span class="text-sm text-surface-500">Created</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(lead.createdAt) }}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between gap-4 py-3 last:pb-0">\r
                        <span class="text-sm text-surface-500">Updated</span>\r
                        <span class="text-right font-medium text-surface-900 dark:text-surface-0">{{ formatDate(lead.updatedAt) }}</span>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4 rounded-lg border border-surface-200 bg-surface-0 p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
                <h3 class="m-0 text-lg font-semibold text-surface-900 dark:text-surface-0">Timeline</h3>\r
                @if (lead.timelineEntries.length) {\r
                    <div class="mt-4 flex flex-col gap-4">\r
                        @for (entry of lead.timelineEntries; track entry.id) {\r
                            <div class="flex gap-3">\r
                                <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-100 text-primary dark:bg-surface-800">\r
                                    <i class="text-xs" [ngClass]="timelineIcon(entry.eventType)"></i>\r
                                </div>\r
                                <div class="min-w-0 flex-1 border-b border-surface-200 pb-4 last:border-0 last:pb-0 dark:border-surface-700">\r
                                    <div class="font-medium text-surface-900 dark:text-surface-0">{{ entry.eventType }}</div>\r
                                    <div class="mt-1 text-sm leading-5 text-surface-600 dark:text-surface-300">{{ entry.description }}</div>\r
                                    <div class="mt-2 text-xs text-surface-500">{{ formatDate(entry.createdAt) }}</div>\r
                                </div>\r
                            </div>\r
                        }\r
                    </div>\r
                } @else {\r
                    <p class="mb-0 mt-3 text-surface-600 dark:text-surface-300">No timeline entries recorded.</p>\r
                }\r
            </div>\r
        </aside>\r
    </div>\r
\r
    <p-dialog [(visible)]="qualificationDialog" [modal]="true" [style]="{ width: 'min(560px, 94vw)' }" header="Qualify Lead">\r
        <form [formGroup]="qualificationForm" class="flex flex-col gap-3">\r
            <div>\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Qualification Remarks</label>\r
                <textarea pTextarea rows="4" formControlName="qualificationRemarks" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingStatus" (onClick)="qualificationDialog = false" />\r
            <p-button label="Qualify" icon="pi pi-check-circle" severity="success" [loading]="isSavingStatus" (onClick)="qualifyLead()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="disqualificationDialog" [modal]="true" [style]="{ width: 'min(560px, 94vw)' }" header="Disqualify Lead">\r
        <form [formGroup]="disqualificationForm" class="flex flex-col gap-3">\r
            <div>\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Disqualification Reason <span class="text-red-500">*</span></label>\r
                <input pInputText formControlName="disqualificationReason" class="w-full" />\r
                @if (disqualificationForm.get('disqualificationReason')?.errors && disqualificationForm.get('disqualificationReason')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Disqualification reason is required</span>\r
                }\r
            </div>\r
\r
            <div>\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Remarks</label>\r
                <textarea pTextarea rows="4" formControlName="disqualificationRemarks" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingStatus" (onClick)="disqualificationDialog = false" />\r
            <p-button label="Disqualify" icon="pi pi-times-circle" severity="danger" [loading]="isSavingStatus" (onClick)="disqualifyLead()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="assignmentDialog" [modal]="true" [style]="{ width: 'min(560px, 94vw)' }" header="Assign Lead">\r
        <form [formGroup]="assignmentForm" class="flex flex-col gap-3">\r
            <div>\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Assignee <span class="text-red-500">*</span></label>\r
                <p-select [options]="users" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="assignedToUserId" class="w-full" />\r
                @if (assignmentForm.get('assignedToUserId')?.errors && assignmentForm.get('assignedToUserId')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Assignee is required</span>\r
                }\r
            </div>\r
\r
            <div>\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Remarks</label>\r
                <textarea pTextarea rows="4" formControlName="remarks" class="w-full"></textarea>\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isAssigning" (onClick)="assignmentDialog = false" />\r
            <p-button label="Assign" icon="pi pi-user-plus" [loading]="isAssigning" (onClick)="assignLead()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="editDialog" [modal]="true" [style]="{ width: 'min(1120px, 96vw)' }" [contentStyle]="{ 'max-height': 'calc(100vh - 12rem)', overflow: 'auto' }" header="Edit Lead">\r
        @if (leadLookups) {\r
            <form [formGroup]="editForm" class="grid grid-cols-12 gap-4">\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Source <span class="text-red-500">*</span></label>\r
                    <p-select [options]="leadLookups.sources" optionLabel="name" optionValue="id" appendTo="body" formControlName="sourceId" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Category <span class="text-red-500">*</span></label>\r
                    <p-select [options]="leadLookups.categories" optionLabel="name" optionValue="id" appendTo="body" formControlName="categoryId" class="w-full" />\r
                </div>\r
                @if (isEditPartnerSource) {\r
                    <div class="col-span-12 md:col-span-4">\r
                        <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Partner <span class="text-red-500">*</span></label>\r
                        <p-select [options]="leadLookups.partners" optionLabel="name" optionValue="id" appendTo="body" formControlName="partnerId" class="w-full" />\r
                        @if (editForm.get('partnerId')?.errors && editForm.get('partnerId')?.touched) {\r
                            <span class="p-error mt-1 block text-sm text-red-600">Partner is required</span>\r
                        }\r
                    </div>\r
                }\r
\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Client <span class="text-red-500">*</span></label>\r
                    <p-select [options]="leadLookups.clients" optionLabel="name" optionValue="id" appendTo="body" formControlName="clientId" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Contact <span class="text-red-500">*</span></label>\r
                    <p-select [options]="editContactOptions" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="clientContactId" class="w-full" />\r
                </div>\r
                @if (isEditCampaignSource) {\r
                    <div class="col-span-12">\r
                        <div class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                            <h3 class="m-0 mb-3 text-base font-semibold text-surface-900 dark:text-surface-0">Source Details</h3>\r
                            <div class="grid grid-cols-12 gap-4">\r
                                <div class="col-span-12 md:col-span-3">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Campaign Name <span class="text-red-500">*</span></label>\r
                                    <input pInputText formControlName="campaignName" class="w-full" />\r
                                    @if (editForm.get('campaignName')?.errors && editForm.get('campaignName')?.touched) {\r
                                        <span class="p-error mt-1 block text-sm text-red-600">Campaign name is required</span>\r
                                    }\r
                                </div>\r
                                <div class="col-span-12 md:col-span-3">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Start Date <span class="text-red-500">*</span></label>\r
                                    <p-datepicker #sourceStartDatePicker formControlName="sourceStartDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(sourceStartDatePicker)" />\r
                                    @if (editForm.get('sourceStartDate')?.errors && editForm.get('sourceStartDate')?.touched) {\r
                                        <span class="p-error mt-1 block text-sm text-red-600">Start date is required</span>\r
                                    }\r
                                </div>\r
                                <div class="col-span-12 md:col-span-3">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">End Date <span class="text-red-500">*</span></label>\r
                                    <p-datepicker #sourceEndDatePicker formControlName="sourceEndDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(sourceEndDatePicker)" />\r
                                    @if (editForm.get('sourceEndDate')?.errors && editForm.get('sourceEndDate')?.touched) {\r
                                        <span class="p-error mt-1 block text-sm text-red-600">End date is required</span>\r
                                    }\r
                                </div>\r
                                <div class="col-span-12 md:col-span-3">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Address <span class="text-red-500">*</span></label>\r
                                    <textarea pTextarea rows="2" formControlName="address" class="w-full"></textarea>\r
                                    @if (editForm.get('address')?.errors && editForm.get('address')?.touched) {\r
                                        <span class="p-error mt-1 block text-sm text-red-600">Address is required</span>\r
                                    }\r
                                </div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                }\r
\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Lead Score</label>\r
                    <p-inputnumber formControlName="leadScore" [useGrouping]="false" class="w-full" />\r
                </div>\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Products <span class="text-red-500">*</span></label>\r
                    <p-multiselect [options]="editProductOptions" optionLabel="name" optionValue="id" appendTo="body" formControlName="productIds" display="chip" class="w-full" />\r
                </div>\r
\r
            </form>\r
        }\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingLead" (onClick)="editDialog = false" />\r
            <p-button label="Save" icon="pi pi-check" [loading]="isSavingLead" (onClick)="updateLead()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="interactionDialog" [modal]="true" [style]="{ width: 'min(640px, 94vw)' }" header="Add Interaction">\r
        <form [formGroup]="interactionForm" class="grid grid-cols-12 gap-4">\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Type <span class="text-red-500">*</span></label>\r
                <p-select [options]="interactionTypeOptions" optionLabel="label" optionValue="value" appendTo="body" formControlName="interactionType" class="w-full" />\r
            </div>\r
\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Interaction Date</label>\r
                <p-datepicker #interactionDatePicker formControlName="interactionDate" dateFormat="yy-mm-dd" [showTime]="true" hourFormat="24" [hideOnDateTimeSelect]="false" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(interactionDatePicker)" />\r
            </div>\r
\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Subject</label>\r
                <input pInputText formControlName="subject" class="w-full" />\r
            </div>\r
\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Notes <span class="text-red-500">*</span></label>\r
                <textarea pTextarea rows="5" formControlName="notes" class="w-full"></textarea>\r
                @if (interactionForm.get('notes')?.errors && interactionForm.get('notes')?.touched) {\r
                    <span class="p-error mt-1 block text-sm text-red-600">Notes are required</span>\r
                }\r
            </div>\r
\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Next Follow-up Date</label>\r
                <p-datepicker #nextFollowUpDatePicker formControlName="nextFollowUpDate" dateFormat="yy-mm-dd" [showTime]="true" hourFormat="24" [hideOnDateTimeSelect]="false" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(nextFollowUpDatePicker)" />\r
            </div>\r
        </form>\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSavingInteraction" (onClick)="interactionDialog = false" />\r
            <p-button label="Save Interaction" icon="pi pi-check" [loading]="isSavingInteraction" (onClick)="addInteraction()" />\r
        </ng-template>\r
    </p-dialog>\r
\r
    <p-dialog [(visible)]="conversionDialog" [modal]="true" [style]="{ width: 'min(1040px, 96vw)' }" [contentStyle]="{ 'max-height': 'calc(100vh - 12rem)', overflow: 'auto' }" header="Convert Lead to Opportunity">\r
        @if (conversion) {\r
            <form [formGroup]="conversionForm" class="grid grid-cols-12 gap-4">\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Product <span class="text-red-500">*</span></label>\r
                    <p-select [options]="conversion.productInterests" optionLabel="productName" optionValue="productId" appendTo="body" formControlName="productId" class="w-full" />\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-6">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Opportunity Title <span class="text-red-500">*</span></label>\r
                    <input pInputText formControlName="opportunityTitle" class="w-full" />\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Estimated Value <span class="text-red-500">*</span></label>\r
                    <p-inputnumber formControlName="estimatedValue" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Currency <span class="text-red-500">*</span></label>\r
                    <p-select [options]="conversion.currencies" optionLabel="code" optionValue="id" appendTo="body" formControlName="currencyId" class="w-full" />\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-4">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Expected Close Date</label>\r
                    <p-datepicker #expectedCloseDatePicker formControlName="expectedCloseDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(expectedCloseDatePicker)" />\r
                </div>\r
\r
                <div class="col-span-12">\r
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Owner <span class="text-red-500">*</span></label>\r
                    <p-select [options]="conversion.ownerUsers" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="ownerUserId" class="w-full" />\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-6">\r
                    <section class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                        <h3 class="mt-0 text-base">Client</h3>\r
                        <p-select [options]="conversionModeOptions" optionLabel="label" optionValue="value" appendTo="body" formControlName="clientMode" class="mb-3 w-full" />\r
\r
                        @if (useExistingClient) {\r
                            <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Existing Client</label>\r
                            <p-select [options]="conversion.existingClients" optionLabel="name" optionValue="id" appendTo="body" formControlName="clientId" class="w-full" />\r
                        } @else {\r
                            <div class="flex flex-col gap-3">\r
                                <div>\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Client Name</label>\r
                                    <input pInputText formControlName="newClientName" class="w-full" />\r
                                </div>\r
                                <div>\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Country</label>\r
                                    <p-select [options]="conversion.countries" optionLabel="name" optionValue="id" appendTo="body" formControlName="newClientCountryId" class="w-full" />\r
                                </div>\r
                                <div>\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Industry</label>\r
                                    <p-select [options]="conversion.industries" optionLabel="name" optionValue="id" appendTo="body" formControlName="newClientIndustryId" class="w-full" />\r
                                </div>\r
                            </div>\r
                        }\r
                    </section>\r
                </div>\r
\r
                <div class="col-span-12 md:col-span-6">\r
                    <section class="rounded-md border border-surface-200 p-4 dark:border-surface-700">\r
                        <h3 class="mt-0 text-base">Contact</h3>\r
                        <p-select [options]="conversionModeOptions" optionLabel="label" optionValue="value" appendTo="body" formControlName="contactMode" class="mb-3 w-full" />\r
\r
                        @if (useExistingContact) {\r
                            <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Existing Contact</label>\r
                            <p-select [options]="filteredContacts" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="contactId" class="w-full" />\r
                        } @else {\r
                            <div class="grid grid-cols-12 gap-3">\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">First Name</label>\r
                                    <input pInputText formControlName="newContactFirstName" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Last Name</label>\r
                                    <input pInputText formControlName="newContactLastName" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Email</label>\r
                                    <input pInputText formControlName="newContactEmail" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Phone</label>\r
                                    <input pInputText formControlName="newContactPhone" inputmode="numeric" maxlength="10" class="w-full" (input)="normalizeNewContactPhone($event)" />\r
                                    @if (conversionForm.get('newContactPhone')?.hasError('pattern') && conversionForm.get('newContactPhone')?.touched) {\r
                                        <span class="p-error mt-1 block text-sm text-red-600">{{ contactNumberValidationMessage }}</span>\r
                                    }\r
                                </div>\r
                            </div>\r
                        }\r
                    </section>\r
                </div>\r
            </form>\r
        }\r
\r
        <ng-template #footer>\r
            <p-button label="Cancel" icon="pi pi-times" text [disabled]="isConverting" (onClick)="conversionDialog = false" />\r
            <p-button label="Convert" icon="pi pi-arrow-right-arrow-left" [loading]="isConverting" (onClick)="convertLead()" />\r
        </ng-template>\r
    </p-dialog>\r
}\r
` }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: LeadApiService }, { type: UserApiService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LeadDetail, { className: "LeadDetail", filePath: "src/app/pages/leads/components/lead-detail/lead-detail.ts", lineNumber: 36 });
})();

// src/app/pages/leads/config/lead-fields.config.ts
function buildLeadFields(options) {
  const isCampaignSource = (formValue) => selectedSourceCode(formValue, options.sources) === "campaign";
  const isPartnerSource = (formValue) => selectedSourceCode(formValue, options.sources) === "partner";
  const isPartnerOwnedProductContext = (formValue) => {
    if (!isPartnerSource(formValue)) {
      return false;
    }
    const partnerTypeCode = selectedPartnerTypeCode(formValue, options.partners);
    return partnerTypeCode === "vendor" || partnerTypeCode === "supplier";
  };
  const availableProductInterest = (option, formValue) => {
    if (!isPartnerOwnedProductContext(formValue)) {
      return isInHouseProduct(option);
    }
    return selectedPartnerProductIds(formValue, options.partners).has(String(option.value));
  };
  const contactBelongsToSelectedClient = (option, formValue) => {
    const selectedClientId = formValue["clientId"];
    return !!selectedClientId && option.clientId === selectedClientId;
  };
  return [
    { key: "sourceId", label: "Source", type: "select", required: true, options: options.sources, colSpan: 3, section: "Lead Classification", placeholder: "Select lead source" },
    { key: "categoryId", label: "Category", type: "select", required: true, options: options.categories, colSpan: 3, section: "Lead Classification", placeholder: "Select lead category" },
    { key: "partnerId", label: "Partner", type: "select", options: options.partners, colSpan: 3, section: "Lead Classification", placeholder: "Select lead partner", visibleWhen: isPartnerSource, requiredWhen: isPartnerSource },
    { key: "leadScore", label: "Lead Score", type: "number", colSpan: 3, section: "Lead Classification" },
    { key: "clientId", label: "Client", type: "select", required: true, options: options.clients, colSpan: 6, section: "Client", placeholder: "Select existing client" },
    { key: "clientContactId", label: "Contact", type: "select", required: true, options: options.contacts, colSpan: 6, section: "Client", placeholder: "Select client contact", optionFilter: contactBelongsToSelectedClient },
    { key: "productIds", label: "Product Interests", type: "multiSelect", required: true, options: options.products, colSpan: 12, section: "Product Interest", placeholder: "Select products", optionFilter: availableProductInterest },
    { key: "campaignName", label: "Campaign Name", type: "text", colSpan: 3, section: "Source Details", visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
    { key: "sourceStartDate", label: "Start Date", type: "date", colSpan: 3, section: "Source Details", visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
    { key: "sourceEndDate", label: "End Date", type: "date", colSpan: 3, section: "Source Details", visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
    { key: "address", label: "Address", type: "textarea", colSpan: 3, section: "Source Details", visibleWhen: isCampaignSource, requiredWhen: isCampaignSource }
  ];
}
function selectedSourceCode(formValue, sources) {
  const selectedSourceId = formValue["sourceId"];
  const source = sources.find((option) => option.value === selectedSourceId);
  return String(source?.code ?? source?.label ?? "").trim().toLowerCase();
}
function selectedPartnerTypeCode(formValue, partners) {
  const selectedPartnerId2 = formValue["partnerId"];
  const partner = partners.find((option) => option.value === selectedPartnerId2);
  return String(partner?.partnerTypeCode ?? "").trim().replace(/-/g, "_").toLowerCase();
}
function selectedPartnerId(formValue) {
  const selectedPartnerId2 = formValue["partnerId"];
  return typeof selectedPartnerId2 === "string" && selectedPartnerId2.trim() ? selectedPartnerId2 : null;
}
function selectedPartnerProductIds(formValue, partners) {
  const partnerId = selectedPartnerId(formValue);
  const partner = partners.find((option) => option.value === partnerId);
  return new Set((partner?.productIds ?? []).map(String));
}
function isInHouseProduct(option) {
  return !option.ownershipTypeCode || option.ownershipTypeCode === "InHouse";
}

// src/app/pages/leads/config/lead-columns.config.ts
var LeadColumns = [
  { field: "leadNumber", header: "Lead #", type: "text", width: "150px", sortable: true },
  { field: "clientName", header: "Client", type: "text", width: "220px", sortable: true },
  { field: "clientContactName", header: "Contact", type: "text", width: "200px", sortable: true },
  { field: "email", header: "Email", type: "email", width: "220px", sortable: true },
  { field: "phone", header: "Phone", type: "text", width: "160px", sortable: false },
  { field: "sourceName", header: "Source", type: "text", width: "150px", sortable: true },
  { field: "partnerName", header: "Partner", type: "text", width: "180px", sortable: true },
  { field: "categoryName", header: "Category", type: "text", width: "150px", sortable: true },
  { field: "countryName", header: "Country", type: "text", width: "160px", sortable: true },
  { field: "status", header: "Status", type: "text", width: "130px", sortable: true },
  { field: "productNames", header: "Products", type: "text", width: "260px", sortable: false }
];

// src/app/pages/leads/components/lead-list/lead-list.ts
var _c02 = () => [10, 20, 30];
var _c12 = () => ["leadNumber", "companyName", "contactPersonName", "email", "deletedByUserName"];
function LeadList_Conditional_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 6);
    \u0275\u0275listener("onClick", function LeadList_Conditional_1_Conditional_0_Conditional_1_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.refreshDeletedLogs());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("outlined", true)("loading", ctx_r2.isDeletedLogsLoading);
  }
}
function LeadList_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275conditionalCreate(1, LeadList_Conditional_1_Conditional_0_Conditional_1_Template, 1, 2, "p-button", 4);
    \u0275\u0275elementStart(2, "p-button", 5);
    \u0275\u0275listener("onClick", function LeadList_Conditional_1_Conditional_0_Template_p_button_onClick_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleDeletedLogs());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showDeletedLogs ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r2.showDeletedLogs ? "pi pi-list" : "pi pi-history")("label", ctx_r2.showDeletedLogs ? "Active Leads" : "Deleted Leads")("outlined", true);
  }
}
function LeadList_Conditional_1_Conditional_1_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 10);
    \u0275\u0275text(2, "Lead # ");
    \u0275\u0275element(3, "p-sortIcon", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 12);
    \u0275\u0275text(5, "Company ");
    \u0275\u0275element(6, "p-sortIcon", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Products");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 14);
    \u0275\u0275text(18, "Deleted By ");
    \u0275\u0275element(19, "p-sortIcon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 16);
    \u0275\u0275text(21, "Deleted On ");
    \u0275\u0275element(22, "p-sortIcon", 17);
    \u0275\u0275elementEnd()();
  }
}
function LeadList_Conditional_1_Conditional_1_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "div");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 19);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275element(15, "p-tag", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.leadNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.companyName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(log_r4.contactPersonName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.email || log_r4.phone || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.sourceName || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.categoryName || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", log_r4.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.productNames || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.deletedByUserName || log_r4.deletedBy || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(log_r4.deletedOn));
  }
}
function LeadList_Conditional_1_Conditional_1_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 21);
    \u0275\u0275text(2, "No deleted lead logs found.");
    \u0275\u0275elementEnd()();
  }
}
function LeadList_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 2);
    \u0275\u0275template(1, LeadList_Conditional_1_Conditional_1_ng_template_1_Template, 23, 0, "ng-template", 7)(2, LeadList_Conditional_1_Conditional_1_ng_template_2_Template, 22, 10, "ng-template", 8)(3, LeadList_Conditional_1_Conditional_1_ng_template_3_Template, 3, 0, "ng-template", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r2.deletedLeadLogs)("loading", ctx_r2.isDeletedLogsLoading)("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(6, _c02))("globalFilterFields", \u0275\u0275pureFunction0(7, _c12));
  }
}
function LeadList_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-crud", 22);
    \u0275\u0275listener("save", function LeadList_Conditional_1_Conditional_2_Template_app_crud_save_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.saveLead($event));
    })("delete", function LeadList_Conditional_1_Conditional_2_Template_app_crud_delete_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteLead($event));
    })("bulkDelete", function LeadList_Conditional_1_Conditional_2_Template_app_crud_bulkDelete_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteLeads($event));
    })("view", function LeadList_Conditional_1_Conditional_2_Template_app_crud_view_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.viewLead($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("columns", ctx_r2.columns)("data", ctx_r2.data)("fields", ctx_r2.fields)("title", ctx_r2.title)("dataNotFound", ctx_r2.dataNotFound)("errorMessage", ctx_r2.errorMessage)("canCreate", ctx_r2.canCreate)("canEdit", ctx_r2.canEdit)("canEditRowResolver", ctx_r2.canEditLeadRow)("editActionLabelResolver", ctx_r2.editActionLabelResolver)("canRowAction", ctx_r2.canDelete)("canBulkAction", ctx_r2.canDelete)("canExport", ctx_r2.canExport)("enableViewAction", true);
  }
}
function LeadList_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, LeadList_Conditional_1_Conditional_0_Template, 3, 4, "div", 1);
    \u0275\u0275conditionalCreate(1, LeadList_Conditional_1_Conditional_1_Template, 4, 8, "p-table", 2)(2, LeadList_Conditional_1_Conditional_2_Template, 1, 14, "app-crud", 3);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.canViewDeletedLogs ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showDeletedLogs ? 1 : 2);
  }
}
var LeadList = class _LeadList {
  leadApiService;
  messageService;
  authService;
  router;
  emptyGuid = "00000000-0000-0000-0000-000000000000";
  title = "Lead";
  columns = LeadColumns;
  fields = [];
  data = [];
  isLoading = true;
  dataNotFound = false;
  errorMessage = "No leads found.";
  canCreate = false;
  canEdit = false;
  canDelete = false;
  canExport = false;
  canViewDeletedLogs = false;
  showDeletedLogs = false;
  deletedLeadLogs = [];
  isDeletedLogsLoading = false;
  canEditLeadRow = (row) => !["assigned", "converted"].includes(String(row["status"] ?? "").toLowerCase());
  editActionLabelResolver = (row) => this.isDisqualified(row["status"]) ? "Re-submit" : "Edit";
  constructor(leadApiService, messageService, authService, router) {
    this.leadApiService = leadApiService;
    this.messageService = messageService;
    this.authService = authService;
    this.router = router;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.leads.create);
    this.canEdit = this.authService.hasPermission(Permissions.leads.edit);
    this.canDelete = this.authService.hasPermission(Permissions.leads.delete);
    this.canExport = this.authService.hasPermission(Permissions.leads.export);
    this.canViewDeletedLogs = this.authService.hasAnyRole(["Admin", "SuperAdmin"]);
    this.loadPage();
  }
  toggleDeletedLogs() {
    this.showDeletedLogs = !this.showDeletedLogs;
    if (this.showDeletedLogs && !this.deletedLeadLogs.length) {
      this.loadDeletedLeadLogs();
    }
  }
  refreshDeletedLogs() {
    this.loadDeletedLeadLogs();
  }
  saveLead(event) {
    if (event.mode === "create") {
      this.createLead(event.value);
      return;
    }
    this.updateLead(event);
  }
  createLead(value) {
    this.leadApiService.createLead(this.toLeadRequest(value)).subscribe({
      next: (lead) => {
        this.messageService.add({
          severity: lead.hasDuplicateWarning ? "warn" : "success",
          summary: lead.hasDuplicateWarning ? "Lead created with warning" : "Lead created",
          detail: lead.duplicateWarning ?? `${lead.leadNumber} was created successfully.`,
          life: 5e3
        });
        this.loadLeads();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Failed to create lead.";
        this.messageService.add({ severity: "error", summary: "Validation failed", detail, life: 6e3 });
      }
    });
  }
  updateLead(event) {
    const id = event.original ? this.getRowId(event.original) : null;
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Update failed", detail: "Lead id is missing.", life: 4e3 });
      return;
    }
    this.leadApiService.updateLead(id, this.toLeadRequest(event.value)).subscribe({
      next: (lead) => {
        this.messageService.add({ severity: "success", summary: "Lead updated", detail: `${lead.leadNumber} was updated successfully.`, life: 4e3 });
        this.loadLeads();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Failed to update lead.";
        this.messageService.add({ severity: "error", summary: "Validation failed", detail, life: 6e3 });
      }
    });
  }
  deleteLead(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Delete failed", detail: "Lead id is missing.", life: 4e3 });
      return;
    }
    this.leadApiService.deleteLead(id).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Lead deleted", detail: "The lead was removed from the active list.", life: 3e3 });
        this.loadLeads();
        if (this.deletedLeadLogs.length) {
          this.loadDeletedLeadLogs();
        }
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Delete failed", detail: "Unable to delete the selected lead.", life: 5e3 });
      }
    });
  }
  deleteLeads(rows) {
    const ids = rows.map((row) => this.getRowId(row)).filter((id) => !!id);
    if (!ids.length) {
      this.messageService.add({ severity: "error", summary: "Delete failed", detail: "No valid lead ids were selected.", life: 4e3 });
      return;
    }
    this.leadApiService.deleteLeads(ids).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Leads deleted", detail: `${ids.length} lead(s) were removed from the active list.`, life: 3e3 });
        this.loadLeads();
        if (this.deletedLeadLogs.length) {
          this.loadDeletedLeadLogs();
        }
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Delete failed", detail: "Unable to delete the selected leads.", life: 5e3 });
      }
    });
  }
  viewLead(row) {
    const id = this.getRowId(row);
    if (!id) {
      this.messageService.add({ severity: "error", summary: "Detail failed", detail: "Lead id is missing.", life: 4e3 });
      return;
    }
    this.router.navigate(["/pages/leads", id]);
  }
  loadPage() {
    this.isLoading = true;
    this.leadApiService.getLookupBundle().subscribe({
      next: (lookups) => {
        this.fields = buildLeadFields(this.toFieldOptions(lookups));
        this.loadLeads();
      },
      error: () => {
        this.isLoading = false;
        this.dataNotFound = true;
        this.errorMessage = "Unable to load lead lookups.";
      }
    });
  }
  loadLeads() {
    this.leadApiService.getLeads().subscribe({
      next: (leads) => {
        this.data = leads.map((lead) => __spreadValues({}, lead));
        this.dataNotFound = leads.length === 0;
        this.isLoading = false;
      },
      error: () => {
        this.dataNotFound = true;
        this.errorMessage = "Unable to load leads.";
        this.isLoading = false;
      }
    });
  }
  loadDeletedLeadLogs() {
    this.isDeletedLogsLoading = true;
    this.leadApiService.getDeletedLeadLogs().subscribe({
      next: (logs) => {
        this.deletedLeadLogs = logs;
        this.isDeletedLogsLoading = false;
      },
      error: (error) => {
        this.isDeletedLogsLoading = false;
        const detail = error.status === 401 || error.status === 403 ? "You are not allowed to view deleted lead logs." : "Unable to load deleted lead logs.";
        this.messageService.add({ severity: "error", summary: "Deleted logs unavailable", detail, life: 5e3 });
      }
    });
  }
  formatDate(value) {
    return value ? new Date(value).toLocaleString() : "Not set";
  }
  toLeadRequest(value) {
    return {
      sourceId: String(value["sourceId"]),
      categoryId: String(value["categoryId"]),
      partnerId: this.optionalString(value["partnerId"]),
      campaignName: this.optionalString(value["campaignName"]),
      sourceStartDate: this.optionalString(value["sourceStartDate"]),
      sourceEndDate: this.optionalString(value["sourceEndDate"]),
      clientId: String(value["clientId"] ?? ""),
      clientContactId: String(value["clientContactId"] ?? ""),
      companyName: "",
      website: null,
      contactPersonName: "",
      jobTitle: null,
      email: null,
      phone: null,
      alternatePhone: null,
      countryId: this.emptyGuid,
      address: this.optionalString(value["address"]),
      industryId: null,
      notes: null,
      leadScore: typeof value["leadScore"] === "number" ? value["leadScore"] : null,
      productIds: Array.isArray(value["productIds"]) ? value["productIds"].map(String) : []
    };
  }
  toFieldOptions(lookups) {
    return {
      sources: this.toOptions(lookups.sources),
      categories: this.toOptions(lookups.categories),
      partners: this.toOptions(lookups.partners),
      countries: this.toOptions(lookups.countries),
      industries: this.toOptions(lookups.industries),
      products: this.toOptions(lookups.products),
      clients: lookups.clients.map((client) => ({
        label: client.name,
        value: client.id
      })),
      contacts: lookups.contacts.map((contact) => ({
        label: contact.email ? `${contact.fullName} (${contact.email})` : contact.fullName,
        value: contact.id,
        clientId: contact.clientId
      }))
    };
  }
  toOptions(values) {
    return values.map((value) => ({
      label: value.name,
      value: value.id,
      code: value.code,
      partnerTypeCode: value.partnerTypeCode,
      productIds: value.productIds,
      ownershipTypeCode: value.ownershipTypeCode,
      ownerPartnerId: value.ownerPartnerId
    }));
  }
  optionalString(value) {
    if (typeof value !== "string") {
      return null;
    }
    return value.trim() ? value : null;
  }
  getRowId(row) {
    return typeof row["id"] === "string" && row["id"].trim() ? row["id"] : null;
  }
  isDisqualified(status) {
    return String(status ?? "").trim().toLowerCase() === "disqualified";
  }
  static \u0275fac = function LeadList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LeadList)(\u0275\u0275directiveInject(LeadApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LeadList, selectors: [["app-lead-list"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 2, vars: 1, consts: [["position", "bottom-right"], [1, "mb-3", "flex", "justify-end", "gap-2"], ["dataKey", "id", "responsiveLayout", "scroll", "styleClass", "p-datatable-sm", 3, "value", "loading", "paginator", "rows", "rowsPerPageOptions", "globalFilterFields"], [3, "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "canCreate", "canEdit", "canEditRowResolver", "editActionLabelResolver", "canRowAction", "canBulkAction", "canExport", "enableViewAction"], ["icon", "pi pi-refresh", "severity", "secondary", 3, "outlined", "loading"], ["severity", "secondary", 3, "onClick", "icon", "label", "outlined"], ["icon", "pi pi-refresh", "severity", "secondary", 3, "onClick", "outlined", "loading"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pSortableColumn", "leadNumber"], ["field", "leadNumber"], ["pSortableColumn", "companyName"], ["field", "companyName"], ["pSortableColumn", "deletedByUserName"], ["field", "deletedByUserName"], ["pSortableColumn", "deletedOn"], ["field", "deletedOn"], [1, "font-medium"], [1, "text-sm", "text-color-secondary"], ["severity", "secondary", 3, "value"], ["colspan", "9", 1, "py-6", "text-center", "text-color-secondary"], [3, "save", "delete", "bulkDelete", "view", "columns", "data", "fields", "title", "dataNotFound", "errorMessage", "canCreate", "canEdit", "canEditRowResolver", "editActionLabelResolver", "canRowAction", "canBulkAction", "canExport", "enableViewAction"]], template: function LeadList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast", 0);
      \u0275\u0275conditionalCreate(1, LeadList_Conditional_1_Template, 3, 2);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 1 : -1);
    }
  }, dependencies: [ButtonModule, Button, PrimeTemplate, CommonModule, Crud, TableModule, Table, SortableColumn, SortIcon, TagModule, Tag, ToastModule, Toast], styles: ["\n\n[_nghost-%COMP%]     .partner-column {\n  font-weight: 500;\n  color: var(--primary-color);\n}\n[_nghost-%COMP%]     .partner-header {\n  background-color: var(--surface-50);\n  font-weight: 600;\n}\n/*# sourceMappingURL=lead-list.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LeadList, [{
    type: Component,
    args: [{ selector: "app-lead-list", standalone: true, imports: [ButtonModule, CommonModule, Crud, TableModule, TagModule, ToastModule], providers: [MessageService], template: `<p-toast position="bottom-right"></p-toast>\r
\r
@if (!isLoading) {\r
    @if (canViewDeletedLogs) {\r
        <div class="mb-3 flex justify-end gap-2">\r
            @if (showDeletedLogs) {\r
                <p-button icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="isDeletedLogsLoading" (onClick)="refreshDeletedLogs()"></p-button>\r
            }\r
            <p-button [icon]="showDeletedLogs ? 'pi pi-list' : 'pi pi-history'" [label]="showDeletedLogs ? 'Active Leads' : 'Deleted Leads'" severity="secondary" [outlined]="true" (onClick)="toggleDeletedLogs()"></p-button>\r
        </div>\r
    }\r
\r
    @if (showDeletedLogs) {\r
        <p-table\r
            [value]="deletedLeadLogs"\r
            dataKey="id"\r
            [loading]="isDeletedLogsLoading"\r
            [paginator]="true"\r
            [rows]="10"\r
            [rowsPerPageOptions]="[10, 20, 30]"\r
            [globalFilterFields]="['leadNumber', 'companyName', 'contactPersonName', 'email', 'deletedByUserName']"\r
            responsiveLayout="scroll"\r
            styleClass="p-datatable-sm"\r
        >\r
            <ng-template pTemplate="header">\r
                <tr>\r
                    <th pSortableColumn="leadNumber">Lead # <p-sortIcon field="leadNumber"></p-sortIcon></th>\r
                    <th pSortableColumn="companyName">Company <p-sortIcon field="companyName"></p-sortIcon></th>\r
                    <th>Contact</th>\r
                    <th>Source</th>\r
                    <th>Category</th>\r
                    <th>Status</th>\r
                    <th>Products</th>\r
                    <th pSortableColumn="deletedByUserName">Deleted By <p-sortIcon field="deletedByUserName"></p-sortIcon></th>\r
                    <th pSortableColumn="deletedOn">Deleted On <p-sortIcon field="deletedOn"></p-sortIcon></th>\r
                </tr>\r
            </ng-template>\r
            <ng-template pTemplate="body" let-log>\r
                <tr>\r
                    <td class="font-medium">{{ log.leadNumber }}</td>\r
                    <td>{{ log.companyName }}</td>\r
                    <td>\r
                        <div>{{ log.contactPersonName }}</div>\r
                        <div class="text-sm text-color-secondary">{{ log.email || log.phone || 'Not set' }}</div>\r
                    </td>\r
                    <td>{{ log.sourceName || 'Not set' }}</td>\r
                    <td>{{ log.categoryName || 'Not set' }}</td>\r
                    <td><p-tag [value]="log.status" severity="secondary"></p-tag></td>\r
                    <td>{{ log.productNames || 'Not set' }}</td>\r
                    <td>{{ log.deletedByUserName || log.deletedBy || 'Not set' }}</td>\r
                    <td>{{ formatDate(log.deletedOn) }}</td>\r
                </tr>\r
            </ng-template>\r
            <ng-template pTemplate="emptymessage">\r
                <tr>\r
                    <td colspan="9" class="py-6 text-center text-color-secondary">No deleted lead logs found.</td>\r
                </tr>\r
            </ng-template>\r
        </p-table>\r
    } @else {\r
        <app-crud\r
            [columns]="columns"\r
            [data]="data"\r
            [fields]="fields"\r
            [title]="title"\r
            [dataNotFound]="dataNotFound"\r
            [errorMessage]="errorMessage"\r
            [canCreate]="canCreate"\r
            [canEdit]="canEdit"\r
            [canEditRowResolver]="canEditLeadRow"\r
            [editActionLabelResolver]="editActionLabelResolver"\r
            [canRowAction]="canDelete"\r
            [canBulkAction]="canDelete"\r
            [canExport]="canExport"\r
            [enableViewAction]="true"\r
            (save)="saveLead($event)"\r
            (delete)="deleteLead($event)"\r
            (bulkDelete)="deleteLeads($event)"\r
            (view)="viewLead($event)"\r
        />\r
    }\r
}\r
`, styles: ["/* src/app/pages/leads/components/lead-list/lead-list.scss */\n:host ::ng-deep .partner-column {\n  font-weight: 500;\n  color: var(--primary-color);\n}\n:host ::ng-deep .partner-header {\n  background-color: var(--surface-50);\n  font-weight: 600;\n}\n/*# sourceMappingURL=lead-list.css.map */\n"] }]
  }], () => [{ type: LeadApiService }, { type: MessageService }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LeadList, { className: "LeadList", filePath: "src/app/pages/leads/components/lead-list/lead-list.ts", lineNumber: 30 });
})();

// src/app/pages/leads/leads.routes.ts
var leads_routes_default = [
  { path: "", component: LeadList, canActivate: [permissionGuard(Permissions.leads.view)] },
  { path: ":id", component: LeadDetail, canActivate: [permissionGuard(Permissions.leads.view)] }
];
export {
  leads_routes_default as default
};
//# sourceMappingURL=chunk-3QSAHJB7.js.map
