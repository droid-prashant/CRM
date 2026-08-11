import {
  Tag,
  TagModule
} from "./chunk-QWMZLFPI.js";
import {
  NotificationApiService
} from "./chunk-T27D5LDS.js";
import {
  Permissions
} from "./chunk-COJCLJYA.js";
import {
  ConfirmDialog,
  ConfirmDialogModule,
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
  AuthService,
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
  CheckboxControlValueAccessor,
  CommonModule,
  ConfirmationService,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  HttpClient,
  HttpParams,
  MessageService,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  Validators,
  apiUrl,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-NMY5IBCO.js";
import {
  Component,
  Injectable,
  Subscription,
  forkJoin,
  inject,
  merge,
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

// src/app/pages/opportunities/services/opportunity-api.service.ts
var OpportunityApiService = class _OpportunityApiService {
  http;
  opportunitiesUrl = apiUrl("/opportunities");
  constructor(http) {
    this.http = http;
  }
  getOpportunities(query) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        params = params.set(key, String(value));
      }
    });
    return this.http.get(this.opportunitiesUrl, { params });
  }
  getPipeline(query) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        params = params.set(key, String(value));
      }
    });
    return this.http.get(`${this.opportunitiesUrl}/pipeline`, { params });
  }
  createOpportunity(request) {
    return this.http.post(this.opportunitiesUrl, request);
  }
  updateOpportunity(id, request) {
    return this.http.put(`${this.opportunitiesUrl}/${id}`, request);
  }
  changeStage(id, request) {
    const formData = new FormData();
    formData.append("stageId", request.stageId);
    formData.append("remarks", request.remarks ?? "");
    if (request.estimatedValue !== void 0 && request.estimatedValue !== null) {
      formData.append("estimatedValue", request.estimatedValue.toString());
    }
    if (request.proposalDocument) {
      formData.append("proposalDocument", request.proposalDocument);
    }
    return this.http.patch(`${this.opportunitiesUrl}/${id}/stage`, formData);
  }
  closeAsWon(id, request) {
    return this.http.patch(`${this.opportunitiesUrl}/${id}/won`, request);
  }
  closeAsLost(id, request) {
    return this.http.patch(`${this.opportunitiesUrl}/${id}/lost`, request);
  }
  getStageHistory(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/stage-history`);
  }
  getActivities(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/activities`);
  }
  createActivity(id, request) {
    return this.http.post(`${this.opportunitiesUrl}/${id}/activities`, request);
  }
  downloadProposalDocument(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-document`, { responseType: "blob" });
  }
  getProposalHistory(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-versions`);
  }
  uploadProposalVersion(id, request) {
    const formData = new FormData();
    formData.append("proposalDocument", request.proposalDocument);
    if (request.description) {
      formData.append("description", request.description);
    }
    return this.http.post(`${this.opportunitiesUrl}/${id}/proposal-versions`, formData);
  }
  downloadProposalVersion(id, documentId) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-versions/${documentId}/download`, { responseType: "blob" });
  }
  previewProposalVersion(id, documentId) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/proposal-versions/${documentId}/preview`, { responseType: "blob" });
  }
  getCommercialDocuments(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/commercial-documents`);
  }
  uploadCommercialDocument(id, request) {
    const formData = new FormData();
    formData.append("documentType", request.documentType);
    formData.append("remarks", request.remarks ?? "");
    formData.append("commercialDocument", request.commercialDocument);
    return this.http.post(`${this.opportunitiesUrl}/${id}/commercial-documents`, formData);
  }
  previewCommercialDocument(id, documentId) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/commercial-documents/${documentId}/preview`, { responseType: "blob" });
  }
  downloadCommercialDocument(id, documentId) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/commercial-documents/${documentId}/download`, { responseType: "blob" });
  }
  deleteCommercialDocument(id, documentId) {
    return this.http.delete(`${this.opportunitiesUrl}/${id}/commercial-documents/${documentId}`);
  }
  getCommercialBreakdown(id) {
    return this.http.get(`${this.opportunitiesUrl}/${id}/commercial-breakdown`);
  }
  saveCommercialBreakdown(id, request) {
    return this.http.put(`${this.opportunitiesUrl}/${id}/commercial-breakdown`, request);
  }
  getLookupBundle() {
    return this.http.get(`${this.opportunitiesUrl}/lookups`);
  }
  static \u0275fac = function OpportunityApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OpportunityApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OpportunityApiService, factory: _OpportunityApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OpportunityApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pages/opportunities/components/opportunity-list/opportunity-list.ts
var _c0 = () => [10, 25, 50];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.documentId;
var _forTrack2 = ($index, $item) => $item.stageId;
var _forTrack3 = ($index, $item) => $item.eventType;
function OpportunityList_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 103);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_14_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openCreateDialog());
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorMessage);
  }
}
function OpportunityList_Conditional_43_For_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 110);
  }
  if (rf & 2) {
    const stage_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("severity", stage_r5.isWonStage ? "success" : "danger");
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 128);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opportunity_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", opportunity_r7.proposalVersionNumber);
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 122)(1, "button", 127);
    \u0275\u0275listener("click", function OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r8);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.downloadProposalDocument(opportunity_r7));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Conditional_3_Template, 2, 1, "span", 128);
    \u0275\u0275elementStart(4, "button", 129);
    \u0275\u0275listener("click", function OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openProposalHistory(opportunity_r7));
    });
    \u0275\u0275text(5, "History");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opportunity_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", opportunity_r7.proposalDocumentFileName || "Proposal document", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(opportunity_r7.proposalVersionNumber ? 3 : -1);
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_18_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 131);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const nextStage_r10 = ctx.$implicit;
    \u0275\u0275property("value", nextStage_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(nextStage_r10.name);
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 130);
    \u0275\u0275listener("change", function OpportunityList_Conditional_43_For_3_For_10_Conditional_18_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onStageChange(opportunity_r7, $event));
    });
    \u0275\u0275elementStart(1, "option", 131);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, OpportunityList_Conditional_43_For_3_For_10_Conditional_18_For_4_Template, 2, 2, "option", 131, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opportunity_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", opportunity_r7.stageId)("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("value", opportunity_r7.stageId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opportunity_r7.stageName);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.stageOptionsFor(opportunity_r7));
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 132);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Conditional_21_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r11);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openUploadProposalDialog(opportunity_r7));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 133);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Conditional_21_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r11);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openEditDialog(opportunity_r7));
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 134);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Conditional_22_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r12);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openCloseDialog(opportunity_r7, "won"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 135);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Conditional_22_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r12);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openCloseDialog(opportunity_r7, "lost"));
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 136);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Conditional_23_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r13);
      const opportunity_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openCommercialDialog(opportunity_r7));
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_43_For_3_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 114);
    \u0275\u0275listener("dragstart", function OpportunityList_Conditional_43_For_3_For_10_Template_article_dragstart_0_listener($event) {
      const opportunity_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onOpportunityDragStart(opportunity_r7, $event));
    })("dragend", function OpportunityList_Conditional_43_For_3_For_10_Template_article_dragend_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onOpportunityDragEnd());
    });
    \u0275\u0275elementStart(1, "div", 115)(2, "div", 19)(3, "div", 116);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 117);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "p-tag", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 119)(9, "div", 120);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 121);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, OpportunityList_Conditional_43_For_3_For_10_Conditional_17_Template, 6, 2, "div", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, OpportunityList_Conditional_43_For_3_For_10_Conditional_18_Template, 5, 4, "select", 123);
    \u0275\u0275elementStart(19, "div", 124)(20, "p-button", 125);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_43_For_3_For_10_Template_p_button_onClick_20_listener() {
      const opportunity_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openActivityDialog(opportunity_r7));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, OpportunityList_Conditional_43_For_3_For_10_Conditional_21_Template, 2, 0);
    \u0275\u0275conditionalCreate(22, OpportunityList_Conditional_43_For_3_For_10_Conditional_22_Template, 2, 0);
    \u0275\u0275conditionalCreate(23, OpportunityList_Conditional_43_For_3_For_10_Conditional_23_Template, 1, 0, "p-button", 126);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opportunity_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("cursor-move", ctx_r2.canMoveOpportunity(opportunity_r7))("opacity-60", (ctx_r2.draggedOpportunity == null ? null : ctx_r2.draggedOpportunity.id) === opportunity_r7.id);
    \u0275\u0275attribute("draggable", ctx_r2.canMoveOpportunity(opportunity_r7));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(opportunity_r7.opportunityNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r7.title);
    \u0275\u0275advance();
    \u0275\u0275property("severity", ctx_r2.statusSeverity(opportunity_r7.status))("value", opportunity_r7.status);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(opportunity_r7.clientName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatCurrency(opportunity_r7.estimatedValue, opportunity_r7.currencyCode));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Close: ", ctx_r2.formatDate(opportunity_r7.expectedCloseDate));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Owner: ", opportunity_r7.ownerUserName || "Not set");
    \u0275\u0275advance();
    \u0275\u0275conditional(opportunity_r7.hasProposalDocument ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canEdit && !opportunity_r7.isFinalStage && opportunity_r7.status === "Open" ? 18 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.canEdit && opportunity_r7.status === "Open" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canApprove && opportunity_r7.status === "Open" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canManageCommercial(opportunity_r7) ? 23 : -1);
  }
}
function OpportunityList_Conditional_43_For_3_ForEmpty_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Drop to move here ");
  }
}
function OpportunityList_Conditional_43_For_3_ForEmpty_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No deals ");
  }
}
function OpportunityList_Conditional_43_For_3_ForEmpty_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 113);
    \u0275\u0275conditionalCreate(1, OpportunityList_Conditional_43_For_3_ForEmpty_11_Conditional_1_Template, 1, 0)(2, OpportunityList_Conditional_43_For_3_ForEmpty_11_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stage_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isStageDragTarget(stage_r5) ? 1 : 2);
  }
}
function OpportunityList_Conditional_43_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 106);
    \u0275\u0275listener("dragover", function OpportunityList_Conditional_43_For_3_Template_div_dragover_0_listener($event) {
      const stage_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStageDragOver(stage_r5, $event));
    })("dragleave", function OpportunityList_Conditional_43_For_3_Template_div_dragleave_0_listener() {
      const stage_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStageDragLeave(stage_r5));
    })("drop", function OpportunityList_Conditional_43_For_3_Template_div_drop_0_listener($event) {
      const stage_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStageDrop(stage_r5, $event));
    });
    \u0275\u0275elementStart(1, "div", 107)(2, "div", 19)(3, "div", 108);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 109);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, OpportunityList_Conditional_43_For_3_Conditional_7_Template, 1, 1, "p-tag", 110);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 111);
    \u0275\u0275repeaterCreate(9, OpportunityList_Conditional_43_For_3_For_10_Template, 24, 18, "article", 112, _forTrack0, false, OpportunityList_Conditional_43_For_3_ForEmpty_11_Template, 3, 1, "div", 113);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stage_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("border-primary", ctx_r2.isStageDragTarget(stage_r5))("bg-primary-50", ctx_r2.isStageDragTarget(stage_r5))("dark:bg-primary-950", ctx_r2.isStageDragTarget(stage_r5));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(stage_r5.stageName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", stage_r5.opportunities.length, " deal(s)");
    \u0275\u0275advance();
    \u0275\u0275conditional(stage_r5.isFinal ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(stage_r5.opportunities);
  }
}
function OpportunityList_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 104);
    \u0275\u0275repeaterCreate(2, OpportunityList_Conditional_43_For_3_Template, 12, 10, "div", 105, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.pipelineStages);
  }
}
function OpportunityList_Conditional_44_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 138);
    \u0275\u0275text(2, "Opportunity # ");
    \u0275\u0275element(3, "p-sortIcon", 139);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 140);
    \u0275\u0275text(5, "Title ");
    \u0275\u0275element(6, "p-sortIcon", 141);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Client");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Product");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 142);
    \u0275\u0275text(12, "Value ");
    \u0275\u0275element(13, "p-sortIcon", 143);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 144);
    \u0275\u0275text(17, "Stage ");
    \u0275\u0275element(18, "p-sortIcon", 145);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Proposal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th", 146);
    \u0275\u0275text(24, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opportunity_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("From ", opportunity_r16.leadNumber);
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 109);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opportunity_r16 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", opportunity_r16.proposalVersionNumber);
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 122)(1, "p-button", 156);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_44_ng_template_4_Conditional_20_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r17);
      const opportunity_r16 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.downloadProposalDocument(opportunity_r16));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, OpportunityList_Conditional_44_ng_template_4_Conditional_20_Conditional_2_Template, 2, 1, "span", 109);
    \u0275\u0275elementStart(3, "p-button", 157);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_44_ng_template_4_Conditional_20_Template_p_button_onClick_3_listener() {
      \u0275\u0275restoreView(_r17);
      const opportunity_r16 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openProposalHistory(opportunity_r16));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opportunity_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(opportunity_r16.proposalVersionNumber ? 2 : -1);
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 153);
    \u0275\u0275text(1, "Not set");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 158);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_44_ng_template_4_Conditional_24_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r18);
      const opportunity_r16 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openEditDialog(opportunity_r16));
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_44_ng_template_4_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 136);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_44_ng_template_4_Conditional_25_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r19);
      const opportunity_r16 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openCommercialDialog(opportunity_r16));
    });
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_44_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 147);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 148);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, OpportunityList_Conditional_44_ng_template_4_Conditional_6_Template, 2, 1, "div", 149);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 150);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 150);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 151);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 150);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "p-tag", 152);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "p-tag", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275conditionalCreate(20, OpportunityList_Conditional_44_ng_template_4_Conditional_20_Template, 4, 1, "div", 122)(21, OpportunityList_Conditional_44_ng_template_4_Conditional_21_Template, 2, 0, "span", 153);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 154)(23, "p-button", 125);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_44_ng_template_4_Template_p_button_onClick_23_listener() {
      const opportunity_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openActivityDialog(opportunity_r16));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(24, OpportunityList_Conditional_44_ng_template_4_Conditional_24_Template, 1, 0, "p-button", 155);
    \u0275\u0275conditionalCreate(25, OpportunityList_Conditional_44_ng_template_4_Conditional_25_Template, 1, 0, "p-button", 126);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opportunity_r16 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r16.opportunityNumber);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(opportunity_r16.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(opportunity_r16.leadNumber ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r16.clientName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r16.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatCurrency(opportunity_r16.estimatedValue, opportunity_r16.currencyCode));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opportunity_r16.ownerUserName || "Not set");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", opportunity_r16.stageName);
    \u0275\u0275advance(2);
    \u0275\u0275property("severity", ctx_r2.statusSeverity(opportunity_r16.status))("value", opportunity_r16.status);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(opportunity_r16.hasProposalDocument ? 20 : 21);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.canEdit && opportunity_r16.status === "Open" ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canManageCommercial(opportunity_r16) ? 25 : -1);
  }
}
function OpportunityList_Conditional_44_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 159);
    \u0275\u0275text(2, "No opportunities found.");
    \u0275\u0275elementEnd()();
  }
}
function OpportunityList_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "p-table", 137);
    \u0275\u0275listener("onLazyLoad", function OpportunityList_Conditional_44_Template_p_table_onLazyLoad_1_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onLazyLoad($event));
    });
    \u0275\u0275template(2, OpportunityList_Conditional_44_ng_template_2_Template, 25, 0, "ng-template", null, 5, \u0275\u0275templateRefExtractor)(4, OpportunityList_Conditional_44_ng_template_4_Template, 26, 13, "ng-template", null, 6, \u0275\u0275templateRefExtractor)(6, OpportunityList_Conditional_44_ng_template_6_Template, 3, 0, "ng-template", null, 7, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r2.opportunities)("loading", ctx_r2.isLoading)("lazy", true)("lazyLoadOnInit", false)("paginator", true)("first", ctx_r2.first)("rows", ctx_r2.pageSize)("totalRecords", ctx_r2.totalRecords)("rowsPerPageOptions", \u0275\u0275pureFunction0(10, _c0))("showCurrentPageReport", true);
  }
}
function OpportunityList_For_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62)(1, "div", 160)(2, "span", 121);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 109);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 161);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const activity_r22 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", activity_r22.activityType, " \xB7 ", activity_r22.subject || "No subject");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(activity_r22.activityDate));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(activity_r22.notes);
  }
}
function OpportunityList_ForEmpty_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275text(1, "No activities yet.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_For_88_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 162);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r23.remarks);
  }
}
function OpportunityList_For_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62)(1, "div", 121);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 149);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, OpportunityList_For_88_Conditional_5_Template, 2, 1, "div", 162);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r23 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", item_r23.fromStageName || "Created", " \u2192 ", item_r23.toStageName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r2.formatDate(item_r23.changedAt), " \xB7 ", item_r23.changedByUserName || "System");
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r23.remarks ? 5 : -1);
  }
}
function OpportunityList_ForEmpty_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275text(1, "No stage history yet.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "label", 50);
    \u0275\u0275text(2, "Final Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "p-inputnumber", 163);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
  }
}
function OpportunityList_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "label", 50);
    \u0275\u0275text(2, "Lost Reason");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 164);
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_ng_template_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 165);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_103_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 166);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_103_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeOpportunity());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("label", ctx_r2.closingMode === "won" ? "Mark Won" : "Mark Lost")("severity", ctx_r2.closingMode === "won" ? "success" : "danger")("loading", ctx_r2.isSaving);
  }
}
function OpportunityList_Conditional_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Remarks must be 1000 characters or fewer.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_118_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 100);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_118_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 167)(1, "span", 120);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-button", 168);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_118_Conditional_4_Template_p_button_onClick_3_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.downloadProposalDocument(ctx_r2.pendingStageOpportunity));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r2.pendingStageOpportunity == null ? null : ctx_r2.pendingStageOpportunity.proposalDocumentFileName) || "Proposal document");
  }
}
function OpportunityList_Conditional_118_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.proposalDocumentError);
  }
}
function OpportunityList_Conditional_118_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "label", 50);
    \u0275\u0275text(2, " Final Proposal Document ");
    \u0275\u0275conditionalCreate(3, OpportunityList_Conditional_118_Conditional_3_Template, 2, 0, "span", 100);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, OpportunityList_Conditional_118_Conditional_4_Template, 4, 1, "div", 167);
    \u0275\u0275elementStart(5, "input", 101);
    \u0275\u0275listener("change", function OpportunityList_Conditional_118_Template_input_change_5_listener($event) {
      \u0275\u0275restoreView(_r26);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onProposalDocumentSelected($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, OpportunityList_Conditional_118_Conditional_6_Template, 2, 1, "span", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 54)(8, "label", 50);
    \u0275\u0275text(9, "Estimated Value");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "p-inputnumber", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.isProposalDocumentRequired ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r2.pendingStageOpportunity == null ? null : ctx_r2.pendingStageOpportunity.hasProposalDocument) ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.proposalDocumentError ? 6 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
  }
}
function OpportunityList_ng_template_119_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 165);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_119_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cancelStageChange());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 169);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_119_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmStageChange());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r2.isSaving);
  }
}
function OpportunityList_Conditional_122_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75)(1, "div", 170)(2, "div")(3, "div", 70);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 71);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "p-tag", 118);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r2.selectedOpportunity.opportunityNumber, " \xB7 ", ctx_r2.selectedOpportunity.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r2.selectedOpportunity.clientName, " \xB7 ", ctx_r2.selectedOpportunity.productName);
    \u0275\u0275advance();
    \u0275\u0275property("severity", ctx_r2.statusSeverity(ctx_r2.selectedOpportunity.status))("value", ctx_r2.selectedOpportunity.status);
  }
}
function OpportunityList_Conditional_123_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 76);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.commercialError);
  }
}
function OpportunityList_Conditional_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77);
    \u0275\u0275text(1, "Loading commercial details...");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_125_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 180);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.commercialDocumentError);
  }
}
function OpportunityList_Conditional_125_For_25_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 161);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const document_r31 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(document_r31.remarks);
  }
}
function OpportunityList_Conditional_125_For_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 62)(1, "div", 199)(2, "div", 19)(3, "div", 23);
    \u0275\u0275element(4, "p-tag", 152);
    \u0275\u0275elementStart(5, "span", 109);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 200);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 149);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, OpportunityList_Conditional_125_For_25_Conditional_11_Template, 2, 1, "p", 161);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 201)(13, "p-button", 202);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_125_For_25_Template_p_button_onClick_13_listener() {
      const document_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.previewCommercialDocument(document_r31));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p-button", 203);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_125_For_25_Template_p_button_onClick_14_listener() {
      const document_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.downloadCommercialDocument(document_r31));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p-button", 204);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_125_For_25_Template_p_button_onClick_15_listener() {
      const document_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.confirmDeleteCommercialDocument(document_r31));
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const document_r31 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r2.documentTypeLabel(document_r31.documentType));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatFileSize(document_r31.fileSize));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(document_r31.fileName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r2.formatDate(document_r31.uploadedOn), " \xB7 ", document_r31.uploadedByUserName || "System");
    \u0275\u0275advance();
    \u0275\u0275conditional(document_r31.remarks ? 11 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.isSavingCommercial);
  }
}
function OpportunityList_Conditional_125_ForEmpty_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 182);
    \u0275\u0275text(1, "No Agreement or PO document uploaded.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_125_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 109);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Updated ", ctx_r2.formatDate(ctx_r2.commercialBreakdown.updatedOn));
  }
}
function OpportunityList_Conditional_125_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 189)(1, "div", 54)(2, "label", 50);
    \u0275\u0275text(3, "License Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-inputnumber", 205);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 54)(6, "label", 50);
    \u0275\u0275text(7, "AMC Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "p-inputnumber", 206);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 54)(10, "label", 50);
    \u0275\u0275text(11, "AMC Start Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p-datepicker", 207, 11);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Conditional_82_Template_p_datepicker_onSelect_12_listener() {
      \u0275\u0275restoreView(_r35);
      const amcStartDatePicker_r36 = \u0275\u0275reference(13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(amcStartDatePicker_r36));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 54)(15, "label", 50);
    \u0275\u0275text(16, "AMC Renewal Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p-datepicker", 208, 12);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Conditional_82_Template_p_datepicker_onSelect_17_listener() {
      \u0275\u0275restoreView(_r35);
      const amcRenewalDatePicker_r37 = \u0275\u0275reference(18);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(amcRenewalDatePicker_r37));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 54)(20, "label", 50);
    \u0275\u0275text(21, "AMC Expiry Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p-datepicker", 209, 13);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Conditional_82_Template_p_datepicker_onSelect_22_listener() {
      \u0275\u0275restoreView(_r35);
      const amcExpiryDatePicker_r38 = \u0275\u0275reference(23);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(amcExpiryDatePicker_r38));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
  }
}
function OpportunityList_Conditional_125_Conditional_88_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 189)(1, "div", 54)(2, "label", 50);
    \u0275\u0275text(3, "Subscription Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-inputnumber", 210);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 54)(6, "label", 50);
    \u0275\u0275text(7, "Billing Frequency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "p-select", 211);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 54)(10, "label", 50);
    \u0275\u0275text(11, "Subscription Start Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p-datepicker", 212, 14);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Conditional_88_Template_p_datepicker_onSelect_12_listener() {
      \u0275\u0275restoreView(_r39);
      const subscriptionStartDatePicker_r40 = \u0275\u0275reference(13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(subscriptionStartDatePicker_r40));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 54)(15, "label", 50);
    \u0275\u0275text(16, "Next Billing Date");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 213);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("readonly", ctx_r2.commercialForm.controls.isFinal.value)("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r2.subscriptionBillingFrequencies);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true);
  }
}
function OpportunityList_Conditional_125_Conditional_93_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 215)(1, "div")(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p-button", 216);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_125_Conditional_93_For_8_Template_p_button_onClick_6_listener() {
      const event_r42 = \u0275\u0275restoreView(_r41).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.resolveCommercialReminder(event_r42.eventType, event_r42.dueDate));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const event_r42 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(event_r42.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(event_r42.dueDate));
    \u0275\u0275advance();
    \u0275\u0275property("outlined", true)("disabled", ctx_r2.isResolvingCommercialReminder);
  }
}
function OpportunityList_Conditional_125_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 198)(1, "div")(2, "h4");
    \u0275\u0275text(3, "Resolve Reminder Events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Mark renewal, expiry, or billing reminders resolved after the follow-up action is completed.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 214);
    \u0275\u0275repeaterCreate(7, OpportunityList_Conditional_125_Conditional_93_For_8_Template, 7, 4, "article", 215, _forTrack3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.commercialReminderEvents());
  }
}
function OpportunityList_Conditional_125_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46)(1, "section", 171)(2, "div", 172)(3, "h3", 173);
    \u0275\u0275text(4, "Agreement / PO Documents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 174);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "form", 175)(8, "div", 176)(9, "label", 50);
    \u0275\u0275text(10, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "p-select", 177);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 178)(13, "label", 50);
    \u0275\u0275text(14, "Document");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 101);
    \u0275\u0275listener("change", function OpportunityList_Conditional_125_Template_input_change_15_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCommercialDocumentSelected($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 48)(17, "label", 50);
    \u0275\u0275text(18, "Remarks");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "textarea", 179);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, OpportunityList_Conditional_125_Conditional_20_Template, 2, 1, "div", 180);
    \u0275\u0275elementStart(21, "div", 57)(22, "p-button", 181);
    \u0275\u0275listener("onClick", function OpportunityList_Conditional_125_Template_p_button_onClick_22_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.uploadCommercialDocument());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 61);
    \u0275\u0275repeaterCreate(24, OpportunityList_Conditional_125_For_25_Template, 16, 7, "article", 62, _forTrack0, false, OpportunityList_Conditional_125_ForEmpty_26_Template, 2, 0, "div", 182);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "section", 183)(28, "div", 172)(29, "h3", 173);
    \u0275\u0275text(30, "Confirmed Commercial Breakdown");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(31, OpportunityList_Conditional_125_Conditional_31_Template, 2, 1, "span", 109);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "form", 65)(33, "div", 54)(34, "label", 50);
    \u0275\u0275text(35, "Currency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "p-select", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 54)(38, "label", 50);
    \u0275\u0275text(39, "Final Payable Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(40, "p-inputnumber", 184);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 54)(42, "label", 185);
    \u0275\u0275element(43, "input", 186);
    \u0275\u0275elementStart(44, "span");
    \u0275\u0275text(45, "Is Final");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "div", 187)(47, "div", 188);
    \u0275\u0275text(48, "Agreement Reference");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 189)(50, "div", 48)(51, "label", 50);
    \u0275\u0275text(52, "Agreement Document");
    \u0275\u0275elementEnd();
    \u0275\u0275element(53, "p-select", 190);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 54)(55, "label", 50);
    \u0275\u0275text(56, "Agreement Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "p-datepicker", 191, 8);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Template_p_datepicker_onSelect_57_listener() {
      \u0275\u0275restoreView(_r29);
      const agreementDatePicker_r32 = \u0275\u0275reference(58);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(agreementDatePicker_r32));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "div", 54)(60, "label", 50);
    \u0275\u0275text(61, "Agreement Expiry Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "p-datepicker", 192, 9);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Template_p_datepicker_onSelect_62_listener() {
      \u0275\u0275restoreView(_r29);
      const agreementExpiryDatePicker_r33 = \u0275\u0275reference(63);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(agreementExpiryDatePicker_r33));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(64, "div", 187)(65, "div", 188);
    \u0275\u0275text(66, "Purchase Order Reference");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "div", 189)(68, "div", 48)(69, "label", 50);
    \u0275\u0275text(70, "PO Document");
    \u0275\u0275elementEnd();
    \u0275\u0275element(71, "p-select", 193);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "div", 48)(73, "label", 50);
    \u0275\u0275text(74, "PO Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "p-datepicker", 194, 10);
    \u0275\u0275listener("onSelect", function OpportunityList_Conditional_125_Template_p_datepicker_onSelect_75_listener() {
      \u0275\u0275restoreView(_r29);
      const purchaseOrderDatePicker_r34 = \u0275\u0275reference(76);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDatePicker(purchaseOrderDatePicker_r34));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(77, "div", 187)(78, "label", 195);
    \u0275\u0275element(79, "input", 196);
    \u0275\u0275elementStart(80, "span");
    \u0275\u0275text(81, "License Applicable");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(82, OpportunityList_Conditional_125_Conditional_82_Template, 24, 9, "div", 189);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "div", 187)(84, "label", 195);
    \u0275\u0275element(85, "input", 197);
    \u0275\u0275elementStart(86, "span");
    \u0275\u0275text(87, "Subscription Applicable");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(88, OpportunityList_Conditional_125_Conditional_88_Template, 18, 6, "div", 189);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "div", 48)(90, "label", 50);
    \u0275\u0275text(91, "Remarks");
    \u0275\u0275elementEnd();
    \u0275\u0275element(92, "textarea", 179);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(93, OpportunityList_Conditional_125_Conditional_93_Template, 9, 0, "section", 198);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r2.commercialDocuments.length, " active");
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r2.commercialUploadForm);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r2.commercialDocumentTypes);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r2.commercialDocumentError ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("loading", ctx_r2.isSavingCommercial);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.commercialDocuments);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r2.commercialBreakdown ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r2.commercialForm);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r2.currencies);
    \u0275\u0275advance(4);
    \u0275\u0275property("readonly", !ctx_r2.commercialForm.controls.isFinal.value)("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(13);
    \u0275\u0275property("options", ctx_r2.agreementDocuments)("showClear", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(9);
    \u0275\u0275property("options", ctx_r2.purchaseOrderDocuments)("showClear", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r2.commercialForm.controls.licenseApplicable.value ? 82 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.commercialForm.controls.subscriptionApplicable.value ? 88 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.commercialBreakdown && ctx_r2.commercialReminderEvents().length ? 93 : -1);
  }
}
function OpportunityList_ng_template_126_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 217);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_126_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r43);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.commercialDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 218);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_126_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r43);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveCommercialBreakdown());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSavingCommercial);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r2.isSavingCommercial)("disabled", ctx_r2.isLoadingCommercial || !ctx_r2.hasCommercialDocument);
  }
}
function OpportunityList_ng_template_146_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 165);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_146_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r44);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.editDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 219);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_146_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r44);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.updateOpportunity());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r2.isSaving);
  }
}
function OpportunityList_Conditional_154_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Client is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_159_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Contact is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_164_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Product is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_169_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Lead is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_174_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Title is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_175_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Title must be 250 characters or fewer.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_180_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Estimated value is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_181_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Estimated value must be 0 or greater.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_186_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Currency is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_196_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1, "Owner is required.");
    \u0275\u0275elementEnd();
  }
}
function OpportunityList_Conditional_197_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93)(1, "div", 220);
    \u0275\u0275text(2, "License Fees");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 99)(4, "div", 89)(5, "label", 50);
    \u0275\u0275text(6, "License Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "p-inputnumber", 221);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 89)(9, "label", 50);
    \u0275\u0275text(10, "AMC Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "p-inputnumber", 222);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 89)(13, "label", 50);
    \u0275\u0275text(14, "Implementation Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "p-inputnumber", 223);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(7);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
  }
}
function OpportunityList_Conditional_198_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93)(1, "div", 220);
    \u0275\u0275text(2, "Subscription Fees");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 99)(4, "div", 89)(5, "label", 50);
    \u0275\u0275text(6, "Subscription Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "p-inputnumber", 224);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(7);
    \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
  }
}
function OpportunityList_ng_template_199_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 165);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_199_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r46);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.createDialog = false);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 225);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_199_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r46);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.createOpportunity());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r2.isSaving);
  }
}
function OpportunityList_Conditional_203_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75)(1, "div", 70);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 226);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedOpportunity.opportunityNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedOpportunity.title);
  }
}
function OpportunityList_For_205_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 228);
  }
}
function OpportunityList_For_205_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 229);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const version_r48 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(version_r48.description);
  }
}
function OpportunityList_For_205_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 227)(1, "div", 199)(2, "div", 19)(3, "div", 122)(4, "span", 70);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, OpportunityList_For_205_Conditional_6_Template, 1, 0, "p-tag", 228);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 71);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, OpportunityList_For_205_Conditional_9_Template, 2, 1, "div", 229);
    \u0275\u0275elementStart(10, "div", 230);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 231)(13, "p-button", 232);
    \u0275\u0275listener("onClick", function OpportunityList_For_205_Template_p_button_onClick_13_listener() {
      const version_r48 = \u0275\u0275restoreView(_r47).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.previewProposalVersion(ctx_r2.selectedOpportunity.id, version_r48));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p-button", 233);
    \u0275\u0275listener("onClick", function OpportunityList_For_205_Template_p_button_onClick_14_listener() {
      const version_r48 = \u0275\u0275restoreView(_r47).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.downloadProposalVersion(ctx_r2.selectedOpportunity.id, version_r48));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const version_r48 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("border-primary", version_r48.isLastCommunicated);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Version ", version_r48.versionNumber);
    \u0275\u0275advance();
    \u0275\u0275conditional(version_r48.isLastCommunicated ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(version_r48.fileName);
    \u0275\u0275advance();
    \u0275\u0275conditional(version_r48.description ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" Uploaded by ", version_r48.uploadedByUserName || "Unknown", " on ", ctx_r2.formatDate(version_r48.uploadedOn), " ");
  }
}
function OpportunityList_ForEmpty_206_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Loading... ");
  }
}
function OpportunityList_ForEmpty_206_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No proposal versions found. ");
  }
}
function OpportunityList_ForEmpty_206_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 97);
    \u0275\u0275conditionalCreate(1, OpportunityList_ForEmpty_206_Conditional_1_Template, 1, 0)(2, OpportunityList_ForEmpty_206_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.selectedProposalHistory === void 0 ? 1 : 2);
  }
}
function OpportunityList_Conditional_209_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "div", 70);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 226);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedUploadOpportunity.opportunityNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedUploadOpportunity.title);
  }
}
function OpportunityList_ng_template_220_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 165);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_220_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r49);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cancelUploadProposal());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 234);
    \u0275\u0275listener("onClick", function OpportunityList_ng_template_220_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r49);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmUploadProposal());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r2.isSaving)("disabled", !ctx_r2.uploadProposalFile);
  }
}
var OpportunityList = class _OpportunityList {
  opportunityApiService;
  notificationApiService;
  messageService;
  confirmationService;
  authService;
  proposalSentStageName = "proposal sent";
  maxProposalDocumentBytes = 10 * 1024 * 1024;
  maxCommercialDocumentBytes = 10 * 1024 * 1024;
  allowedProposalDocumentExtensions = /* @__PURE__ */ new Set([".pdf", ".doc", ".docx"]);
  allowedCommercialDocumentExtensions = /* @__PURE__ */ new Set([".pdf", ".doc", ".docx"]);
  opportunities = [];
  pipelineStages = [];
  clients = [];
  allContacts = [];
  contacts = [];
  products = [];
  leads = [];
  users = [];
  currencies = [];
  stages = [];
  statuses = [];
  activityTypes = [
    { label: "Note", value: "Note" },
    { label: "Call", value: "Call" },
    { label: "Meeting", value: "Meeting" },
    { label: "Follow-up", value: "FollowUp" }
  ];
  commercialDocumentTypes = [
    { label: "Agreement", value: "Agreement" },
    { label: "Purchase Order", value: "PurchaseOrder" }
  ];
  subscriptionBillingFrequencies = [
    { label: "Monthly", value: "Monthly" },
    { label: "Quarterly", value: "Quarterly" },
    { label: "Semi Annual", value: "SemiAnnual" },
    { label: "Annual", value: "Annual" }
  ];
  viewMode = "pipeline";
  isLoading = true;
  isSaving = false;
  createDialog = false;
  editDialog = false;
  closeDialog = false;
  activityDialog = false;
  stageChangeDialog = false;
  proposalHistoryDialog = false;
  uploadProposalDialog = false;
  commercialDialog = false;
  selectedProposalHistory;
  selectedUploadOpportunity;
  uploadProposalDescription = "";
  uploadProposalFile;
  closingMode = "won";
  canCreate = false;
  canEdit = false;
  canApprove = false;
  errorMessage = "";
  selectedOpportunity;
  pendingStageOpportunity;
  pendingStageId = "";
  pendingStageName = "";
  selectedProposalDocument;
  proposalDocumentError = "";
  draggedOpportunity;
  dragOverStageId = "";
  stageHistory = [];
  activities = [];
  commercialDocuments = [];
  commercialBreakdown;
  selectedCommercialDocument;
  commercialDocumentError = "";
  commercialError = "";
  isLoadingCommercial = false;
  isSavingCommercial = false;
  isResolvingCommercialReminder = false;
  totalRecords = 0;
  first = 0;
  pageNumber = 1;
  pageSize = 10;
  sortField = "";
  sortDirection = "desc";
  fb = inject(FormBuilder);
  subscriptions = new Subscription();
  isSyncingCommercialForm = false;
  filterForm = this.fb.group({
    searchTerm: [""],
    clientId: [""],
    stageId: [""],
    ownerUserId: [""],
    status: [""]
  });
  opportunityForm = this.fb.group({
    clientId: ["", Validators.required],
    contactId: ["", Validators.required],
    leadId: ["", Validators.required],
    productId: ["", Validators.required],
    title: ["", [Validators.required, Validators.maxLength(250)]],
    estimatedValue: [0, [Validators.required, Validators.min(0)]],
    currencyId: ["", Validators.required],
    expectedCloseDate: [""],
    ownerUserId: ["", Validators.required],
    licenseFee: [0],
    amcFee: [0],
    implementationFee: [0],
    subscriptionFee: [0]
  });
  editForm = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(250)]],
    estimatedValue: [0, [Validators.required, Validators.min(0)]],
    ownerUserId: ["", Validators.required]
  });
  activityForm = this.fb.group({
    activityType: ["Note", Validators.required],
    subject: [""],
    notes: ["", [Validators.required, Validators.maxLength(2e3)]],
    activityDate: [""],
    followUpDate: [""]
  });
  stageChangeForm = this.fb.group({
    remarks: ["", Validators.maxLength(1e3)],
    estimatedValue: [0, [Validators.required, Validators.min(0)]]
  });
  closeForm = this.fb.group({
    finalAmount: [0],
    lostReason: [""],
    closedDate: [(/* @__PURE__ */ new Date()).toISOString().slice(0, 10), Validators.required],
    note: [""]
  });
  commercialUploadForm = this.fb.group({
    documentType: ["Agreement", Validators.required],
    remarks: ["", Validators.maxLength(1e3)]
  });
  commercialForm = this.fb.group({
    currencyId: ["", Validators.required],
    finalPayableAmount: [0, [Validators.required, Validators.min(0)]],
    isFinal: [false],
    agreementDocumentId: [""],
    agreementDate: [""],
    agreementExpiryDate: [""],
    purchaseOrderDocumentId: [""],
    purchaseOrderDate: [""],
    licenseApplicable: [false],
    licenseAmount: [0],
    amcAmount: [0],
    amcStartDate: [""],
    amcRenewalDate: [""],
    amcExpiryDate: [""],
    subscriptionApplicable: [false],
    subscriptionAmount: [0],
    subscriptionBillingFrequency: [""],
    subscriptionStartDate: [""],
    nextSubscriptionBillingDate: [""],
    remarks: ["", Validators.maxLength(1e3)]
  });
  constructor(opportunityApiService, notificationApiService, messageService, confirmationService, authService) {
    this.opportunityApiService = opportunityApiService;
    this.notificationApiService = notificationApiService;
    this.messageService = messageService;
    this.confirmationService = confirmationService;
    this.authService = authService;
  }
  ngOnInit() {
    this.canCreate = this.authService.hasPermission(Permissions.opportunities.create);
    this.canEdit = this.authService.hasPermission(Permissions.opportunities.edit);
    this.canApprove = this.authService.hasPermission(Permissions.opportunities.approve);
    this.registerCommercialFormHandlers();
    this.loadPage();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  setViewMode(mode) {
    this.viewMode = mode;
  }
  openCreateDialog() {
    const defaultCurrencyId = this.currencies[0]?.id ?? "";
    this.contacts = [];
    this.selectedProduct = void 0;
    this.opportunityForm.reset({
      clientId: "",
      contactId: "",
      leadId: "",
      productId: "",
      title: "",
      estimatedValue: 0,
      currencyId: defaultCurrencyId,
      expectedCloseDate: "",
      ownerUserId: "",
      licenseFee: 0,
      amcFee: 0,
      implementationFee: 0,
      subscriptionFee: 0
    });
    this.createDialog = true;
  }
  openEditDialog(opportunity) {
    this.selectedOpportunity = opportunity;
    this.editForm.reset({
      title: opportunity.title,
      estimatedValue: opportunity.estimatedValue,
      ownerUserId: opportunity.ownerUserId
    });
    this.editDialog = true;
  }
  openCloseDialog(opportunity, mode) {
    this.selectedOpportunity = opportunity;
    this.closingMode = mode;
    this.closeForm.reset({
      finalAmount: opportunity.estimatedValue,
      lostReason: "",
      closedDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      note: ""
    });
    this.closeDialog = true;
  }
  openActivityDialog(opportunity) {
    this.selectedOpportunity = opportunity;
    this.activityForm.reset({
      activityType: "Note",
      subject: "",
      notes: "",
      activityDate: "",
      followUpDate: ""
    });
    this.activityDialog = true;
    forkJoin({
      activities: this.opportunityApiService.getActivities(opportunity.id),
      history: this.opportunityApiService.getStageHistory(opportunity.id)
    }).subscribe({
      next: (result) => {
        this.activities = result.activities;
        this.stageHistory = result.history;
      },
      error: () => {
        this.activities = [];
        this.stageHistory = [];
        this.messageService.add({ severity: "error", summary: "Unable to load timeline", detail: "Activity and stage history could not be loaded.", life: 5e3 });
      }
    });
  }
  openCommercialDialog(opportunity) {
    this.selectedOpportunity = opportunity;
    this.commercialDialog = true;
    this.commercialDocuments = [];
    this.commercialBreakdown = void 0;
    this.commercialError = "";
    this.selectedCommercialDocument = void 0;
    this.commercialDocumentError = "";
    this.commercialUploadForm.reset({ documentType: "Agreement", remarks: "" });
    this.resetCommercialForm(opportunity);
    this.loadCommercialFinalization(opportunity.id);
  }
  onClientChange(clientId) {
    this.opportunityForm.patchValue({ contactId: "" });
    this.contacts = clientId ? this.allContacts.filter((contact) => contact.clientId === clientId) : [];
  }
  onLeadChange(leadId) {
    const lead = this.leads.find((item) => item.id === leadId);
    const ownerUserId = lead?.assignedToUserId && this.users.some((user) => user.id === lead.assignedToUserId) ? lead.assignedToUserId : "";
    this.opportunityForm.patchValue({ ownerUserId });
  }
  selectedProduct;
  onProductChange(productId) {
    this.selectedProduct = this.products.find((p) => p.id === productId);
    if (!this.selectedProduct) {
      return;
    }
    if (!this.selectedProduct.isLicenseBased) {
      this.opportunityForm.patchValue({ licenseFee: 0, amcFee: 0, implementationFee: 0 });
    }
    if (!this.selectedProduct.isSubscriptionBased) {
      this.opportunityForm.patchValue({ subscriptionFee: 0 });
    }
  }
  onStageChange(opportunity, event) {
    const select = event.target;
    const stageId = select.value;
    select.value = opportunity.stageId;
    if (!stageId || stageId === opportunity.stageId) {
      return;
    }
    this.prepareStageChange(opportunity, stageId);
  }
  onOpportunityDragStart(opportunity, event) {
    if (!this.canMoveOpportunity(opportunity)) {
      event.preventDefault();
      return;
    }
    this.draggedOpportunity = opportunity;
    event.dataTransfer?.setData("text/plain", opportunity.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  }
  onOpportunityDragEnd() {
    this.draggedOpportunity = void 0;
    this.dragOverStageId = "";
  }
  onStageDragOver(stage, event) {
    if (!this.canDropOnStage(stage)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "none";
      }
      return;
    }
    event.preventDefault();
    this.dragOverStageId = stage.stageId;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }
  onStageDragLeave(stage) {
    if (this.dragOverStageId === stage.stageId) {
      this.dragOverStageId = "";
    }
  }
  onStageDrop(stage, event) {
    event.preventDefault();
    this.dragOverStageId = "";
    if (!this.draggedOpportunity || !this.canDropOnStage(stage)) {
      return;
    }
    this.prepareStageChange(this.draggedOpportunity, stage.stageId);
  }
  get isProposalSentTarget() {
    return this.normalizeStageName(this.pendingStageName) === this.proposalSentStageName;
  }
  get isProposalDocumentRequired() {
    return this.isProposalSentTarget && this.pendingStageOpportunity?.hasProposalDocument !== true;
  }
  canMoveOpportunity(opportunity) {
    return this.canEdit && !opportunity.isFinalStage && opportunity.status === "Open";
  }
  canDropOnStage(stage) {
    return !!this.draggedOpportunity && !stage.isFinal && stage.sequence > this.draggedOpportunity.stageSequence && stage.stageId !== this.draggedOpportunity.stageId;
  }
  isStageDragTarget(stage) {
    return this.dragOverStageId === stage.stageId && this.canDropOnStage(stage);
  }
  prepareStageChange(opportunity, stageId) {
    const targetStage = this.stages.find((stage) => stage.id === stageId);
    this.pendingStageOpportunity = opportunity;
    this.pendingStageId = stageId;
    this.pendingStageName = targetStage?.name ?? "selected stage";
    this.selectedProposalDocument = void 0;
    this.proposalDocumentError = "";
    this.stageChangeForm.reset({
      remarks: "",
      estimatedValue: opportunity.estimatedValue
    });
    this.stageChangeDialog = true;
  }
  confirmStageChange() {
    this.stageChangeForm.markAllAsTouched();
    if (this.stageChangeForm.invalid || !this.pendingStageOpportunity || !this.pendingStageId) {
      return;
    }
    if (this.isProposalDocumentRequired && !this.selectedProposalDocument) {
      this.proposalDocumentError = "Final proposal document is required when moving an opportunity to Proposal Sent.";
      return;
    }
    if (this.selectedProposalDocument && !this.isValidProposalDocument(this.selectedProposalDocument)) {
      return;
    }
    const opportunity = this.pendingStageOpportunity;
    const value = this.stageChangeForm.getRawValue();
    this.isSaving = true;
    this.opportunityApiService.changeStage(opportunity.id, { stageId: this.pendingStageId, remarks: value.remarks?.trim() || void 0, estimatedValue: value.estimatedValue, proposalDocument: this.selectedProposalDocument }).subscribe({
      next: () => {
        this.stageChangeDialog = false;
        this.clearPendingStageChange();
        this.messageService.add({ severity: "success", summary: "Stage updated", detail: `${opportunity.opportunityNumber} moved successfully.`, life: 3e3 });
        this.refreshData();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Stage could not be updated.";
        this.messageService.add({ severity: "error", summary: "Stage update failed", detail, life: 5e3 });
        this.isSaving = false;
      }
    });
  }
  cancelStageChange() {
    this.stageChangeDialog = false;
    this.clearPendingStageChange();
  }
  onProposalDocumentSelected(event) {
    const input = event.target;
    const file = input.files?.item(0) ?? void 0;
    this.selectedProposalDocument = file;
    this.proposalDocumentError = "";
    if (file) {
      this.isValidProposalDocument(file);
    }
  }
  createOpportunity() {
    this.opportunityForm.markAllAsTouched();
    if (this.opportunityForm.invalid) {
      return;
    }
    this.isSaving = true;
    this.opportunityApiService.createOpportunity(this.buildCreateRequest()).subscribe({
      next: (opportunity) => {
        this.createDialog = false;
        this.messageService.add({ severity: "success", summary: "Opportunity created", detail: `${opportunity.opportunityNumber} was created successfully.`, life: 4e3 });
        this.refreshData();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Failed to create opportunity.";
        this.messageService.add({ severity: "error", summary: "Validation failed", detail, life: 6e3 });
        this.isSaving = false;
      }
    });
  }
  updateOpportunity() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid || !this.selectedOpportunity) {
      return;
    }
    this.isSaving = true;
    this.opportunityApiService.updateOpportunity(this.selectedOpportunity.id, this.buildUpdateRequest()).subscribe({
      next: (opportunity) => {
        this.editDialog = false;
        this.selectedOpportunity = void 0;
        this.messageService.add({ severity: "success", summary: "Opportunity updated", detail: `${opportunity.opportunityNumber} was updated successfully.`, life: 4e3 });
        this.refreshData();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Failed to update opportunity.";
        this.messageService.add({ severity: "error", summary: "Validation failed", detail, life: 6e3 });
        this.isSaving = false;
      }
    });
  }
  addActivity() {
    this.activityForm.markAllAsTouched();
    if (this.activityForm.invalid || !this.selectedOpportunity) {
      return;
    }
    this.isSaving = true;
    this.opportunityApiService.createActivity(this.selectedOpportunity.id, this.buildActivityRequest()).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Activity added", detail: "Opportunity activity was saved.", life: 3e3 });
        this.openActivityDialog(this.selectedOpportunity);
        this.isSaving = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Activity could not be saved.";
        this.messageService.add({ severity: "error", summary: "Activity failed", detail, life: 5e3 });
        this.isSaving = false;
      }
    });
  }
  closeOpportunity() {
    this.closeForm.markAllAsTouched();
    if (this.closeForm.invalid || !this.selectedOpportunity) {
      return;
    }
    const value = this.closeForm.getRawValue();
    if (this.closingMode === "won" && value.finalAmount == null) {
      this.messageService.add({ severity: "warn", summary: "Final amount required", detail: "Enter the final won amount.", life: 4e3 });
      return;
    }
    if (this.closingMode === "lost" && !value.lostReason?.trim()) {
      this.messageService.add({ severity: "warn", summary: "Lost reason required", detail: "Enter why the opportunity was lost.", life: 4e3 });
      return;
    }
    this.isSaving = true;
    const request = {
      finalAmount: value.finalAmount ?? void 0,
      lostReason: value.lostReason?.trim() || void 0,
      closedDate: new Date(value.closedDate ?? "").toISOString(),
      note: value.note?.trim() || void 0
    };
    const action = this.closingMode === "won" ? this.opportunityApiService.closeAsWon(this.selectedOpportunity.id, request) : this.opportunityApiService.closeAsLost(this.selectedOpportunity.id, request);
    action.subscribe({
      next: () => {
        this.closeDialog = false;
        this.messageService.add({ severity: "success", summary: `Opportunity ${this.closingMode}`, detail: `${this.selectedOpportunity?.opportunityNumber} was closed.`, life: 4e3 });
        this.refreshData();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Opportunity could not be closed.";
        this.messageService.add({ severity: "error", summary: "Close failed", detail, life: 6e3 });
        this.isSaving = false;
      }
    });
  }
  formatCurrency(value, currencyCode) {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: currencyCode || "NPR",
      currencyDisplay: "code",
      maximumFractionDigits: 2
    }).format(value ?? 0);
  }
  formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "Not set";
  }
  closeDatePicker(picker) {
    setTimeout(() => picker.hideOverlay(), 0);
  }
  downloadProposalDocument(opportunity) {
    if (!opportunity.hasProposalDocument) {
      return;
    }
    this.opportunityApiService.downloadProposalDocument(opportunity.id).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, opportunity.proposalDocumentFileName || `${opportunity.opportunityNumber}-proposal`);
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Download failed", detail: "Proposal document could not be downloaded.", life: 5e3 });
      }
    });
  }
  openProposalHistory(opportunity) {
    this.selectedOpportunity = opportunity;
    this.selectedProposalHistory = void 0;
    this.proposalHistoryDialog = true;
    this.opportunityApiService.getProposalHistory(opportunity.id).subscribe({
      next: (versions) => {
        this.selectedProposalHistory = versions;
      },
      error: () => {
        this.selectedProposalHistory = [];
        this.messageService.add({ severity: "error", summary: "Failed to load", detail: "Proposal history could not be loaded.", life: 5e3 });
      }
    });
  }
  openUploadProposalDialog(opportunity) {
    this.selectedUploadOpportunity = opportunity;
    this.uploadProposalDescription = "";
    this.uploadProposalFile = void 0;
    this.uploadProposalDialog = true;
  }
  onUploadProposalFileSelected(event) {
    const input = event.target;
    this.uploadProposalFile = input.files?.item(0) ?? void 0;
  }
  confirmUploadProposal() {
    if (!this.selectedUploadOpportunity || !this.uploadProposalFile) {
      return;
    }
    const file = this.uploadProposalFile;
    const extension = this.fileExtension(file.name);
    if (!this.allowedProposalDocumentExtensions.has(extension)) {
      this.messageService.add({ severity: "error", summary: "Invalid file", detail: "Proposal document must be a PDF, DOC, or DOCX file.", life: 5e3 });
      return;
    }
    if (file.size > this.maxProposalDocumentBytes) {
      this.messageService.add({ severity: "error", summary: "File too large", detail: "Proposal document must be 10 MB or smaller.", life: 5e3 });
      return;
    }
    this.isSaving = true;
    const request = {
      proposalDocument: file,
      description: this.uploadProposalDescription.trim() || void 0
    };
    this.opportunityApiService.uploadProposalVersion(this.selectedUploadOpportunity.id, request).subscribe({
      next: () => {
        this.uploadProposalDialog = false;
        this.selectedUploadOpportunity = void 0;
        this.uploadProposalFile = void 0;
        this.messageService.add({ severity: "success", summary: "Proposal uploaded", detail: "New proposal version was uploaded successfully.", life: 3e3 });
        this.isSaving = false;
        this.refreshData();
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Proposal could not be uploaded.";
        this.messageService.add({ severity: "error", summary: "Upload failed", detail, life: 5e3 });
        this.isSaving = false;
      }
    });
  }
  cancelUploadProposal() {
    this.uploadProposalDialog = false;
    this.selectedUploadOpportunity = void 0;
    this.uploadProposalFile = void 0;
  }
  onUploadProposalDescriptionChange(event) {
    this.uploadProposalDescription = event.target.value;
  }
  downloadProposalVersion(opportunityId, version) {
    this.opportunityApiService.downloadProposalVersion(opportunityId, version.documentId).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, version.fileName);
      },
      error: (error) => {
        this.showBlobError(error, "Download failed", "Proposal version could not be downloaded.");
      }
    });
  }
  previewProposalVersion(opportunityId, version) {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      this.messageService.add({ severity: "warn", summary: "Preview blocked", detail: "Allow pop-ups for this site and try preview again.", life: 5e3 });
      return;
    }
    previewWindow.opener = null;
    previewWindow.document.write("<p>Loading proposal preview...</p>");
    this.opportunityApiService.previewProposalVersion(opportunityId, version.documentId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        previewWindow.location.href = url;
        setTimeout(() => URL.revokeObjectURL(url), 6e4);
      },
      error: (error) => {
        previewWindow.close();
        this.showBlobError(error, "Preview failed", "Proposal version could not be previewed.");
      }
    });
  }
  onCommercialDocumentSelected(event) {
    const input = event.target;
    const file = input.files?.item(0) ?? void 0;
    this.selectedCommercialDocument = file;
    this.commercialDocumentError = "";
    if (file) {
      this.isValidCommercialDocument(file);
    }
  }
  uploadCommercialDocument() {
    this.commercialUploadForm.markAllAsTouched();
    if (this.commercialUploadForm.invalid || !this.selectedOpportunity) {
      return;
    }
    if (!this.selectedCommercialDocument) {
      this.commercialDocumentError = "Agreement or PO document is required.";
      return;
    }
    if (!this.isValidCommercialDocument(this.selectedCommercialDocument)) {
      return;
    }
    const value = this.commercialUploadForm.getRawValue();
    this.isSavingCommercial = true;
    this.opportunityApiService.uploadCommercialDocument(this.selectedOpportunity.id, {
      documentType: value.documentType ?? "Agreement",
      remarks: value.remarks?.trim() || void 0,
      commercialDocument: this.selectedCommercialDocument
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Document uploaded", detail: "Agreement/PO document was saved.", life: 3e3 });
        this.selectedCommercialDocument = void 0;
        this.commercialUploadForm.reset({ documentType: value.documentType ?? "Agreement", remarks: "" });
        this.loadCommercialFinalization(this.selectedOpportunity.id);
        this.isSavingCommercial = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Agreement/PO document could not be uploaded.";
        this.messageService.add({ severity: "error", summary: "Upload failed", detail, life: 5e3 });
        this.isSavingCommercial = false;
      }
    });
  }
  previewCommercialDocument(document2) {
    if (!this.selectedOpportunity) {
      return;
    }
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      this.messageService.add({ severity: "warn", summary: "Preview blocked", detail: "Allow pop-ups for this site and try preview again.", life: 5e3 });
      return;
    }
    previewWindow.opener = null;
    previewWindow.document.write("<p>Loading document preview...</p>");
    this.opportunityApiService.previewCommercialDocument(this.selectedOpportunity.id, document2.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        previewWindow.location.href = url;
        setTimeout(() => URL.revokeObjectURL(url), 6e4);
      },
      error: (error) => {
        previewWindow.close();
        this.showBlobError(error, "Preview failed", "Document preview is unavailable.");
      }
    });
  }
  downloadCommercialDocument(commercialDocument) {
    if (!this.selectedOpportunity) {
      return;
    }
    this.opportunityApiService.downloadCommercialDocument(this.selectedOpportunity.id, commercialDocument.id).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, commercialDocument.fileName);
      },
      error: (error) => {
        this.showBlobError(error, "Download failed", "Document could not be downloaded.");
      }
    });
  }
  confirmDeleteCommercialDocument(commercialDocument) {
    this.confirmationService.confirm({
      message: `Delete ${commercialDocument.fileName}?`,
      header: "Delete Document",
      icon: "pi pi-exclamation-triangle",
      accept: () => this.deleteCommercialDocument(commercialDocument)
    });
  }
  deleteCommercialDocument(commercialDocument) {
    if (!this.selectedOpportunity) {
      return;
    }
    this.isSavingCommercial = true;
    this.opportunityApiService.deleteCommercialDocument(this.selectedOpportunity.id, commercialDocument.id).subscribe({
      next: () => {
        this.commercialDocuments = this.commercialDocuments.filter((document2) => document2.id !== commercialDocument.id);
        this.clearDeletedCommercialDocumentSelection(commercialDocument);
        this.messageService.add({ severity: "success", summary: "Document deleted", detail: "Agreement/PO document was removed.", life: 3e3 });
        this.isSavingCommercial = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Agreement/PO document could not be deleted.";
        this.messageService.add({ severity: "error", summary: "Delete failed", detail, life: 6e3 });
        this.isSavingCommercial = false;
      }
    });
  }
  saveCommercialBreakdown() {
    this.commercialForm.markAllAsTouched();
    this.commercialError = "";
    if (this.commercialForm.invalid || !this.selectedOpportunity) {
      return;
    }
    const request = this.buildCommercialBreakdownRequest();
    const errors = this.validateCommercialBreakdownRequest(request);
    if (errors.length) {
      this.commercialError = errors.join(" ");
      return;
    }
    this.isSavingCommercial = true;
    this.opportunityApiService.saveCommercialBreakdown(this.selectedOpportunity.id, request).subscribe({
      next: (breakdown) => {
        this.commercialBreakdown = breakdown;
        this.patchCommercialForm(breakdown);
        this.commercialDialog = false;
        this.messageService.add({ severity: "success", summary: "Commercial breakdown saved", detail: "Final commercial details were recorded.", life: 3e3 });
        this.isSavingCommercial = false;
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Commercial breakdown could not be saved.";
        this.messageService.add({ severity: "error", summary: "Save failed", detail, life: 6e3 });
        this.isSavingCommercial = false;
      }
    });
  }
  commercialReminderEvents() {
    const breakdown = this.commercialBreakdown;
    if (!breakdown) {
      return [];
    }
    const events = [
      { label: "Agreement expiry", eventType: "AgreementExpiry", dueDate: breakdown.agreementExpiryDate },
      { label: "AMC renewal", eventType: "AmcRenewal", dueDate: breakdown.licenseApplicable ? breakdown.amcRenewalDate : void 0 },
      { label: "AMC expiry", eventType: "AmcExpiry", dueDate: breakdown.licenseApplicable ? breakdown.amcExpiryDate : void 0 },
      { label: "Subscription billing", eventType: "SubscriptionBilling", dueDate: breakdown.subscriptionApplicable ? breakdown.nextSubscriptionBillingDate : void 0 }
    ];
    return events.filter((event) => !!event.dueDate);
  }
  resolveCommercialReminder(eventType, sourceDueDate) {
    if (!this.commercialBreakdown || !sourceDueDate) {
      return;
    }
    this.isResolvingCommercialReminder = true;
    this.notificationApiService.resolveEvent({
      eventType,
      sourceRecordType: "OpportunityCommercialBreakdown",
      sourceRecordId: this.commercialBreakdown.id,
      sourceDueDate,
      resolutionRemarks: "Resolved from opportunity commercial breakdown."
    }).subscribe({
      next: () => {
        this.isResolvingCommercialReminder = false;
        this.messageService.add({ severity: "success", summary: "Reminder resolved", detail: "Future reminders for this event will stop.", life: 3e3 });
      },
      error: (error) => {
        const detail = error.error?.errors?.join?.(" ") ?? "Reminder event could not be resolved.";
        this.isResolvingCommercialReminder = false;
        this.messageService.add({ severity: "error", summary: "Resolve failed", detail, life: 6e3 });
      }
    });
  }
  canManageCommercial(opportunity) {
    return this.canEdit && this.isWonOpportunity(opportunity);
  }
  isWonOpportunity(opportunity) {
    return opportunity?.status?.toLowerCase() === "won";
  }
  documentTypeLabel(value) {
    return value === "PurchaseOrder" ? "Purchase Order" : "Agreement";
  }
  formatFileSize(bytes) {
    if (!bytes) {
      return "0 KB";
    }
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
  }
  get agreementDocuments() {
    return this.commercialDocuments.filter((document2) => document2.documentType === "Agreement");
  }
  get purchaseOrderDocuments() {
    return this.commercialDocuments.filter((document2) => document2.documentType === "PurchaseOrder");
  }
  get hasCommercialDocument() {
    return this.commercialDocuments.length > 0;
  }
  statusSeverity(status) {
    const normalized = status?.toLowerCase();
    if (normalized === "won")
      return "success";
    if (normalized === "lost")
      return "danger";
    return "info";
  }
  stageOptionsFor(opportunity) {
    return this.stages.filter((stage) => !stage.isFinal && (stage.sequence ?? 0) > opportunity.stageSequence);
  }
  showCreateError(controlName, errorName) {
    const control = this.opportunityForm.get(controlName);
    if (!control || !(control.touched || control.dirty)) {
      return false;
    }
    return errorName ? control.hasError(errorName) : control.invalid;
  }
  applyFilters() {
    this.first = 0;
    this.pageNumber = 1;
    this.refreshData();
  }
  clearFilters() {
    this.filterForm.reset({
      searchTerm: "",
      clientId: "",
      stageId: "",
      ownerUserId: "",
      status: ""
    });
    this.applyFilters();
  }
  onLazyLoad(event) {
    this.first = event.first ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.pageNumber = Math.floor(this.first / this.pageSize) + 1;
    this.sortField = Array.isArray(event.sortField) ? event.sortField[0] ?? "" : event.sortField ?? "";
    this.sortDirection = event.sortOrder === 1 ? "asc" : "desc";
    this.loadOpportunities();
  }
  loadPage() {
    this.isLoading = true;
    this.opportunityApiService.getLookupBundle().subscribe({
      next: (lookups) => {
        this.applyLookups(lookups);
        this.refreshData();
      },
      error: () => {
        this.errorMessage = "Unable to load opportunity lookups.";
        this.isLoading = false;
      }
    });
  }
  refreshData() {
    this.isLoading = true;
    forkJoin({
      list: this.opportunityApiService.getOpportunities(this.buildListQuery()),
      pipeline: this.opportunityApiService.getPipeline(this.buildPipelineQuery())
    }).subscribe({
      next: (result) => {
        this.opportunities = result.list.items;
        this.totalRecords = result.list.totalCount;
        this.pageNumber = result.list.pageNumber;
        this.pageSize = result.list.pageSize;
        this.pipelineStages = result.pipeline;
        this.errorMessage = "";
        this.isSaving = false;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Unable to load opportunities.";
        this.isSaving = false;
        this.isLoading = false;
      }
    });
  }
  loadOpportunities() {
    this.isLoading = true;
    this.opportunityApiService.getOpportunities(this.buildListQuery()).subscribe({
      next: (result) => {
        this.opportunities = result.items;
        this.totalRecords = result.totalCount;
        this.pageNumber = result.pageNumber;
        this.pageSize = result.pageSize;
        this.errorMessage = "";
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Unable to load opportunities.";
        this.isLoading = false;
      }
    });
  }
  loadCommercialFinalization(opportunityId) {
    this.isLoadingCommercial = true;
    forkJoin({
      documents: this.opportunityApiService.getCommercialDocuments(opportunityId),
      breakdown: this.opportunityApiService.getCommercialBreakdown(opportunityId)
    }).subscribe({
      next: (result) => {
        this.commercialDocuments = result.documents;
        this.commercialBreakdown = result.breakdown;
        if (result.breakdown) {
          this.patchCommercialForm(result.breakdown);
        } else if (this.selectedOpportunity) {
          this.resetCommercialForm(this.selectedOpportunity);
        }
        this.isLoadingCommercial = false;
      },
      error: () => {
        this.commercialError = "Commercial finalization details could not be loaded.";
        this.isLoadingCommercial = false;
      }
    });
  }
  downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  showBlobError(error, summary, fallback) {
    const errorBlob = error?.error;
    if (errorBlob instanceof Blob && errorBlob.type.includes("application/json")) {
      errorBlob.text().then((text) => {
        try {
          const parsed = JSON.parse(text);
          const detail = parsed.errors?.join(" ") || parsed.message || fallback;
          this.messageService.add({ severity: "error", summary, detail, life: 5e3 });
        } catch {
          this.messageService.add({ severity: "error", summary, detail: fallback, life: 5e3 });
        }
      }).catch(() => this.messageService.add({ severity: "error", summary, detail: fallback, life: 5e3 }));
      return;
    }
    this.messageService.add({ severity: "error", summary, detail: fallback, life: 5e3 });
  }
  applyLookups(lookups) {
    this.clients = lookups.clients;
    this.allContacts = lookups.contacts;
    this.products = lookups.products;
    this.leads = lookups.leads.filter((lead) => ["new", "qualified", "converted"].includes(lead.status.toLowerCase()));
    this.users = lookups.ownerUsers.filter((user) => user.isActive !== false);
    this.currencies = lookups.currencies;
    this.stages = lookups.stages;
    this.statuses = lookups.statuses;
  }
  buildListQuery() {
    return __spreadProps(__spreadValues({}, this.buildPipelineQuery()), {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: this.sortField || void 0,
      sortDirection: this.sortField ? this.sortDirection : void 0
    });
  }
  buildPipelineQuery() {
    const filters = this.filterForm.getRawValue();
    return {
      searchTerm: filters.searchTerm?.trim() || void 0,
      clientId: filters.clientId || void 0,
      stageId: filters.stageId || void 0,
      ownerUserId: filters.ownerUserId || void 0
    };
  }
  buildCreateRequest() {
    const value = this.opportunityForm.getRawValue();
    return {
      clientId: value.clientId ?? "",
      contactId: value.contactId ?? "",
      leadId: value.leadId ?? "",
      productId: value.productId ?? "",
      title: value.title ?? "",
      estimatedValue: value.estimatedValue ?? 0,
      currencyId: value.currencyId ?? "",
      ownerUserId: value.ownerUserId ?? "",
      expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : void 0
    };
  }
  buildUpdateRequest() {
    const value = this.editForm.getRawValue();
    return {
      id: this.selectedOpportunity?.id ?? "",
      title: value.title ?? "",
      estimatedValue: value.estimatedValue ?? 0,
      ownerUserId: value.ownerUserId ?? ""
    };
  }
  buildActivityRequest() {
    const value = this.activityForm.getRawValue();
    return {
      activityType: value.activityType ?? "Note",
      subject: value.subject?.trim() || void 0,
      notes: value.notes ?? "",
      activityDate: value.activityDate ? new Date(value.activityDate).toISOString() : void 0,
      followUpDate: value.followUpDate ? new Date(value.followUpDate).toISOString() : void 0
    };
  }
  clearPendingStageChange() {
    this.pendingStageOpportunity = void 0;
    this.pendingStageId = "";
    this.pendingStageName = "";
    this.selectedProposalDocument = void 0;
    this.proposalDocumentError = "";
  }
  resetCommercialForm(opportunity) {
    this.withCommercialFormSync(() => {
      this.commercialForm.reset({
        currencyId: opportunity.currencyId,
        finalPayableAmount: opportunity.finalAmount ?? opportunity.estimatedValue ?? 0,
        isFinal: false,
        agreementDocumentId: "",
        agreementDate: "",
        agreementExpiryDate: "",
        purchaseOrderDocumentId: "",
        purchaseOrderDate: "",
        licenseApplicable: false,
        licenseAmount: 0,
        amcAmount: 0,
        amcStartDate: "",
        amcRenewalDate: "",
        amcExpiryDate: "",
        subscriptionApplicable: false,
        subscriptionAmount: 0,
        subscriptionBillingFrequency: "",
        subscriptionStartDate: "",
        nextSubscriptionBillingDate: "",
        remarks: ""
      });
    });
  }
  patchCommercialForm(breakdown) {
    this.withCommercialFormSync(() => {
      this.commercialForm.reset({
        currencyId: breakdown.currencyId,
        finalPayableAmount: breakdown.finalPayableAmount,
        isFinal: breakdown.isFinal,
        agreementDocumentId: breakdown.agreementDocumentId ?? "",
        agreementDate: this.formatDateInput(breakdown.agreementDate),
        agreementExpiryDate: this.formatDateInput(breakdown.agreementExpiryDate),
        purchaseOrderDocumentId: breakdown.purchaseOrderDocumentId ?? "",
        purchaseOrderDate: this.formatDateInput(breakdown.purchaseOrderDate),
        licenseApplicable: breakdown.licenseApplicable,
        licenseAmount: breakdown.licenseAmount ?? 0,
        amcAmount: breakdown.amcAmount ?? 0,
        amcStartDate: this.formatDateInput(breakdown.amcStartDate),
        amcRenewalDate: this.formatDateInput(breakdown.amcRenewalDate),
        amcExpiryDate: this.formatDateInput(breakdown.amcExpiryDate),
        subscriptionApplicable: breakdown.subscriptionApplicable,
        subscriptionAmount: breakdown.subscriptionAmount ?? 0,
        subscriptionBillingFrequency: breakdown.subscriptionBillingFrequency ?? "",
        subscriptionStartDate: this.formatDateInput(breakdown.subscriptionStartDate),
        nextSubscriptionBillingDate: this.formatDateInput(breakdown.nextSubscriptionBillingDate),
        remarks: breakdown.remarks ?? ""
      });
    });
  }
  clearDeletedCommercialDocumentSelection(commercialDocument) {
    if (commercialDocument.documentType === "Agreement" && this.commercialForm.controls.agreementDocumentId.value === commercialDocument.id) {
      this.commercialForm.patchValue({ agreementDocumentId: "", agreementDate: "", agreementExpiryDate: "" });
    }
    if (commercialDocument.documentType === "PurchaseOrder" && this.commercialForm.controls.purchaseOrderDocumentId.value === commercialDocument.id) {
      this.commercialForm.patchValue({ purchaseOrderDocumentId: "", purchaseOrderDate: "" });
    }
  }
  registerCommercialFormHandlers() {
    const controls = this.commercialForm.controls;
    this.subscriptions.add(controls.licenseApplicable.valueChanges.subscribe((selected) => this.onLicenseApplicableChanged(selected ?? false)));
    this.subscriptions.add(controls.subscriptionApplicable.valueChanges.subscribe((selected) => this.onSubscriptionApplicableChanged(selected ?? false)));
    this.subscriptions.add(controls.isFinal.valueChanges.subscribe(() => this.syncCommercialAmounts("mode")));
    this.subscriptions.add(controls.finalPayableAmount.valueChanges.subscribe(() => this.syncCommercialAmounts("final")));
    this.subscriptions.add(controls.licenseAmount.valueChanges.subscribe(() => this.syncCommercialAmounts("license")));
    this.subscriptions.add(controls.amcAmount.valueChanges.subscribe(() => this.syncCommercialAmounts("amc")));
    this.subscriptions.add(controls.subscriptionAmount.valueChanges.subscribe(() => this.syncCommercialAmounts("subscription")));
    this.subscriptions.add(merge(controls.subscriptionApplicable.valueChanges, controls.subscriptionBillingFrequency.valueChanges, controls.subscriptionStartDate.valueChanges).subscribe(() => this.updateNextSubscriptionBillingDate()));
  }
  onLicenseApplicableChanged(selected) {
    if (this.isSyncingCommercialForm) {
      return;
    }
    if (selected) {
      this.withCommercialFormSync(() => {
        this.commercialForm.patchValue({
          subscriptionApplicable: false,
          subscriptionAmount: 0,
          subscriptionBillingFrequency: "",
          subscriptionStartDate: "",
          nextSubscriptionBillingDate: ""
        }, { emitEvent: false });
      });
    }
    this.syncCommercialAmounts("mode");
  }
  onSubscriptionApplicableChanged(selected) {
    if (this.isSyncingCommercialForm) {
      return;
    }
    if (selected) {
      this.withCommercialFormSync(() => {
        this.commercialForm.patchValue({
          licenseApplicable: false,
          licenseAmount: 0,
          amcAmount: 0,
          amcStartDate: "",
          amcRenewalDate: "",
          amcExpiryDate: ""
        }, { emitEvent: false });
      });
    }
    this.syncCommercialAmounts("mode");
  }
  syncCommercialAmounts(source) {
    if (this.isSyncingCommercialForm) {
      return;
    }
    this.withCommercialFormSync(() => {
      const controls = this.commercialForm.controls;
      const isFinal = controls.isFinal.value === true;
      const licenseApplicable = controls.licenseApplicable.value === true;
      const subscriptionApplicable = controls.subscriptionApplicable.value === true;
      const finalPayableAmount = this.commercialAmount(controls.finalPayableAmount.value);
      const licenseAmount = this.commercialAmount(controls.licenseAmount.value);
      const amcAmount = this.commercialAmount(controls.amcAmount.value);
      const subscriptionAmount = this.commercialAmount(controls.subscriptionAmount.value);
      if (licenseApplicable) {
        if (isFinal) {
          if (source === "license") {
            controls.finalPayableAmount.patchValue(licenseAmount, { emitEvent: false });
          } else if (source !== "amc") {
            controls.licenseAmount.patchValue(finalPayableAmount, { emitEvent: false });
            if (source === "mode") {
              controls.amcAmount.patchValue(0, { emitEvent: false });
            }
          }
        } else {
          controls.finalPayableAmount.patchValue(this.roundCommercialAmount(licenseAmount + amcAmount), { emitEvent: false });
        }
        return;
      }
      if (subscriptionApplicable) {
        if (isFinal) {
          controls.subscriptionAmount.patchValue(finalPayableAmount, { emitEvent: false });
        } else {
          controls.finalPayableAmount.patchValue(subscriptionAmount, { emitEvent: false });
        }
      }
    });
  }
  withCommercialFormSync(action) {
    this.isSyncingCommercialForm = true;
    try {
      action();
    } finally {
      this.isSyncingCommercialForm = false;
    }
  }
  commercialAmount(value) {
    return this.roundCommercialAmount(Math.max(Number(value ?? 0), 0));
  }
  roundCommercialAmount(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  updateNextSubscriptionBillingDate() {
    const controls = this.commercialForm.controls;
    if (!controls.subscriptionApplicable.value) {
      if (controls.nextSubscriptionBillingDate.value) {
        controls.nextSubscriptionBillingDate.patchValue("", { emitEvent: false });
      }
      return;
    }
    const nextBillingDate = this.calculateNextSubscriptionBillingDate(controls.subscriptionStartDate.value, controls.subscriptionBillingFrequency.value);
    if (controls.nextSubscriptionBillingDate.value !== nextBillingDate) {
      controls.nextSubscriptionBillingDate.patchValue(nextBillingDate, { emitEvent: false });
    }
  }
  buildCommercialBreakdownRequest() {
    const value = this.commercialForm.getRawValue();
    return {
      currencyId: value.currencyId ?? "",
      finalPayableAmount: this.commercialAmount(value.finalPayableAmount),
      isFinal: value.isFinal ?? false,
      agreementDocumentId: value.agreementDocumentId || void 0,
      agreementDate: this.toIsoDate(value.agreementDate),
      agreementExpiryDate: this.toIsoDate(value.agreementExpiryDate),
      purchaseOrderDocumentId: value.purchaseOrderDocumentId || void 0,
      purchaseOrderDate: this.toIsoDate(value.purchaseOrderDate),
      licenseApplicable: value.licenseApplicable ?? false,
      licenseAmount: value.licenseApplicable ? this.commercialAmount(value.licenseAmount) : void 0,
      amcAmount: value.licenseApplicable ? this.commercialAmount(value.amcAmount) : void 0,
      amcStartDate: value.licenseApplicable ? this.toIsoDate(value.amcStartDate) : void 0,
      amcRenewalDate: value.licenseApplicable ? this.toIsoDate(value.amcRenewalDate) : void 0,
      amcExpiryDate: value.licenseApplicable ? this.toIsoDate(value.amcExpiryDate) : void 0,
      subscriptionApplicable: value.subscriptionApplicable ?? false,
      subscriptionAmount: value.subscriptionApplicable ? this.commercialAmount(value.subscriptionAmount) : void 0,
      subscriptionBillingFrequency: value.subscriptionApplicable ? value.subscriptionBillingFrequency || void 0 : void 0,
      subscriptionStartDate: value.subscriptionApplicable ? this.toIsoDate(value.subscriptionStartDate) : void 0,
      nextSubscriptionBillingDate: void 0,
      remarks: value.remarks?.trim() || void 0
    };
  }
  validateCommercialBreakdownRequest(request) {
    const errors = [];
    if (!this.hasCommercialDocument) {
      errors.push("Upload an Agreement or PO document before saving commercial breakdown.");
    }
    if (!request.agreementDocumentId && !request.purchaseOrderDocumentId) {
      errors.push("Select at least one Agreement or PO document reference.");
    }
    if (request.agreementDocumentId && (!request.agreementDate || !request.agreementExpiryDate)) {
      errors.push("Agreement date and expiry date are required.");
    }
    if (request.purchaseOrderDocumentId && !request.purchaseOrderDate) {
      errors.push("PO date is required.");
    }
    if (request.licenseApplicable && request.subscriptionApplicable) {
      errors.push("Select either License Applicable or Subscription Applicable, not both.");
    }
    if (!request.licenseApplicable && !request.subscriptionApplicable) {
      errors.push("Select License Applicable or Subscription Applicable.");
    }
    if (request.licenseApplicable && (request.licenseAmount == null || request.licenseAmount <= 0)) {
      errors.push("License amount is required.");
    }
    if (request.licenseApplicable && request.amcAmount != null && request.amcAmount > 0 && (!request.amcStartDate || !request.amcRenewalDate || !request.amcExpiryDate)) {
      errors.push("AMC start date, renewal date, and expiry date are required when AMC amount is entered.");
    }
    if (request.subscriptionApplicable && (request.subscriptionAmount == null || request.subscriptionAmount <= 0 || !request.subscriptionBillingFrequency || !request.subscriptionStartDate)) {
      errors.push("Subscription amount, billing frequency, and start date are required.");
    }
    return errors;
  }
  isValidProposalDocument(file) {
    const extension = this.fileExtension(file.name);
    if (!this.allowedProposalDocumentExtensions.has(extension)) {
      this.proposalDocumentError = "Proposal document must be a PDF, DOC, or DOCX file.";
      return false;
    }
    if (file.size > this.maxProposalDocumentBytes) {
      this.proposalDocumentError = "Proposal document must be 10 MB or smaller.";
      return false;
    }
    this.proposalDocumentError = "";
    return true;
  }
  isValidCommercialDocument(file) {
    const extension = this.fileExtension(file.name);
    if (!this.allowedCommercialDocumentExtensions.has(extension)) {
      this.commercialDocumentError = "Agreement or PO document must be a PDF, DOC, or DOCX file.";
      return false;
    }
    if (file.size > this.maxCommercialDocumentBytes) {
      this.commercialDocumentError = "Agreement or PO document must be 10 MB or smaller.";
      return false;
    }
    this.commercialDocumentError = "";
    return true;
  }
  fileExtension(fileName) {
    const index = fileName.lastIndexOf(".");
    return index >= 0 ? fileName.slice(index).toLowerCase() : "";
  }
  normalizeStageName(value) {
    return (value ?? "").trim().toLowerCase();
  }
  formatDateInput(value) {
    return value ? new Date(value).toISOString().slice(0, 10) : "";
  }
  toIsoDate(value) {
    return value ? new Date(value).toISOString() : void 0;
  }
  calculateNextSubscriptionBillingDate(startDate, frequency) {
    if (!startDate || !frequency) {
      return "";
    }
    const months = this.billingFrequencyMonths(frequency);
    if (!months) {
      return "";
    }
    const parsedDate = this.parseDateOnly(startDate);
    if (!parsedDate) {
      return "";
    }
    const target = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth() + months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(parsedDate.getUTCDate(), lastDay));
    return target.toISOString().slice(0, 10);
  }
  billingFrequencyMonths(frequency) {
    switch (frequency) {
      case "Monthly":
        return 1;
      case "Quarterly":
        return 3;
      case "SemiAnnual":
        return 6;
      case "Annual":
        return 12;
      default:
        return 0;
    }
  }
  parseDateOnly(value) {
    const parts = value.split("-").map(Number);
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return void 0;
    }
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }
  static \u0275fac = function OpportunityList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OpportunityList)(\u0275\u0275directiveInject(OpportunityApiService), \u0275\u0275directiveInject(NotificationApiService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(ConfirmationService), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OpportunityList, selectors: [["app-opportunity-list"]], features: [\u0275\u0275ProvidersFeature([ConfirmationService, MessageService])], decls: 222, vars: 82, consts: [["activityDatePicker", ""], ["followUpDatePicker", ""], ["closedDatePicker", ""], ["footer", ""], ["expectedCloseDatePicker", ""], ["header", ""], ["body", ""], ["emptymessage", ""], ["agreementDatePicker", ""], ["agreementExpiryDatePicker", ""], ["purchaseOrderDatePicker", ""], ["amcStartDatePicker", ""], ["amcRenewalDatePicker", ""], ["amcExpiryDatePicker", ""], ["subscriptionStartDatePicker", ""], ["position", "bottom-right"], ["styleClass", "opportunity-confirm-dialog"], [1, "rounded-md", "border", "border-surface-200", "bg-surface-0", "shadow-sm", "dark:border-surface-700", "dark:bg-surface-900"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-surface-200", "px-5", "py-4", "dark:border-surface-700"], [1, "min-w-0"], [1, "text-xs", "font-semibold", "uppercase", "tracking-wide", "text-surface-500", "dark:text-surface-400"], [1, "m-0", "mt-1", "text-xl", "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "mb-0", "mt-1", "text-sm", "text-surface-600", "dark:text-surface-300"], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["label", "Pipeline", "icon", "pi pi-sitemap", "size", "small", 3, "onClick", "outlined"], ["label", "List", "icon", "pi pi-list", "size", "small", 3, "onClick", "outlined"], ["label", "Create", "icon", "pi pi-plus", "size", "small"], [1, "mx-5", "mt-4", "rounded-md", "border", "border-red-200", "bg-red-50", "px-4", "py-3", "text-sm", "text-red-700", "dark:border-red-900/60", "dark:bg-red-900/20", "dark:text-red-200"], [1, "border-b", "border-surface-200", "bg-surface-50/60", "px-5", "py-4", "dark:border-surface-700", "dark:bg-surface-950/30"], [1, "grid", "grid-cols-12", "items-end", "gap-3", 3, "formGroup"], [1, "col-span-12", "xl:col-span-4"], [1, "mb-2", "block", "text-xs", "font-semibold", "uppercase", "tracking-wide", "text-surface-500", "dark:text-surface-400"], [1, "relative"], [1, "pi", "pi-search", "pointer-events-none", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-sm", "text-surface-400"], ["pInputText", "", "formControlName", "searchTerm", "placeholder", "Search number, title, client, product", 1, "h-10", "w-full", "pl-9", "text-sm", 3, "keyup.enter"], [1, "col-span-12", "sm:col-span-6", "lg:col-span-3", "xl:col-span-2"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "clientId", "placeholder", "All clients", 1, "w-full", "text-sm", 3, "options", "showClear"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "stageId", "placeholder", "All stages", 1, "w-full", "text-sm", 3, "options", "showClear"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "ownerUserId", "placeholder", "All owners", 1, "w-full", "text-sm", 3, "options", "showClear"], ["optionLabel", "name", "optionValue", "code", "appendTo", "body", "formControlName", "status", "placeholder", "Open", 1, "w-full", "text-sm", 3, "options", "showClear"], [1, "col-span-12", "flex", "flex-wrap", "justify-end", "gap-2"], ["label", "Clear", "icon", "pi pi-filter-slash", "severity", "secondary", "size", "small", "outlined", "", 3, "onClick"], ["label", "Apply Filters", "icon", "pi pi-filter", "size", "small", 3, "onClick"], [1, "overflow-x-auto", "px-5", "py-4"], [1, "px-5", "py-4"], ["styleClass", "opportunity-dialog opportunity-dialog--activity opportunity-dialog--scrollable", "header", "Opportunity Activity", 3, "visibleChange", "visible", "modal"], [1, "grid", "grid-cols-12", "gap-5"], [1, "col-span-12", "grid", "grid-cols-12", "gap-3", "lg:col-span-5", 3, "formGroup"], [1, "col-span-12"], [1, "text-sm", "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "mb-2", "block", "text-sm", "font-semibold"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "activityType", 1, "w-full", 3, "options"], ["pInputText", "", "formControlName", "subject", 1, "w-full"], ["formControlName", "notes", "rows", "5", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-3", "text-sm", "dark:border-surface-600", "dark:bg-surface-900"], [1, "col-span-12", "md:col-span-6"], ["formControlName", "activityDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "followUpDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], [1, "col-span-12", "flex", "justify-end"], ["label", "Add Activity", "icon", "pi pi-plus", "size", "small", 3, "onClick", "loading"], [1, "col-span-12", "space-y-4", "lg:col-span-7"], [1, "mb-2", "text-sm", "font-semibold"], [1, "space-y-2"], [1, "rounded-md", "border", "border-surface-200", "p-3", "text-sm", "dark:border-surface-700"], [1, "rounded-md", "border", "border-dashed", "border-surface-300", "p-4", "text-center", "text-sm", "text-surface-500"], ["styleClass", "opportunity-dialog opportunity-dialog--close", 3, "visibleChange", "visible", "modal", "header"], [1, "grid", "grid-cols-12", "gap-4", 3, "formGroup"], ["formControlName", "closedDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "note", "rows", "4", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-3", "text-sm", "dark:border-surface-600", "dark:bg-surface-900"], ["styleClass", "opportunity-dialog opportunity-dialog--stage-change", "header", "Move Opportunity", 3, "visibleChange", "visible", "modal"], [1, "col-span-12", "rounded-md", "border", "border-surface-200", "bg-surface-50", "p-3", "text-sm", "dark:border-surface-700", "dark:bg-surface-950/40"], [1, "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "mt-1", "text-surface-600", "dark:text-surface-300"], ["formControlName", "remarks", "rows", "4", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-3", "text-sm", "dark:border-surface-600", "dark:bg-surface-900"], [1, "mt-1", "block", "text-sm", "text-red-600"], ["styleClass", "opportunity-dialog opportunity-dialog--commercial opportunity-dialog--scrollable", "header", "Commercial Finalization", 3, "visibleChange", "visible", "modal"], [1, "mb-4", "rounded-md", "border", "border-surface-200", "bg-surface-50", "p-3", "text-sm", "dark:border-surface-700", "dark:bg-surface-950/40"], [1, "mb-4", "rounded-md", "border", "border-red-200", "bg-red-50", "px-3", "py-2", "text-sm", "text-red-700", "dark:border-red-900/60", "dark:bg-red-900/20", "dark:text-red-200"], [1, "rounded-md", "border", "border-surface-200", "p-4", "text-sm", "text-surface-500", "dark:border-surface-700"], ["styleClass", "opportunity-dialog opportunity-dialog--edit", "header", "Edit Opportunity", 3, "visibleChange", "visible", "modal"], ["pInputText", "", "disabled", "", 1, "w-full", 3, "value"], ["pInputText", "", "formControlName", "title", 1, "w-full"], ["formControlName", "estimatedValue", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "ownerUserId", 1, "w-full", 3, "options"], ["styleClass", "opportunity-dialog opportunity-dialog--create opportunity-dialog--scrollable", "header", "Create Opportunity", 3, "visibleChange", "visible", "modal"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "clientId", 1, "w-full", 3, "onChange", "options"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "contactId", 1, "w-full", 3, "options"], ["optionLabel", "name", "optionValue", "id", "appendTo", "body", "formControlName", "productId", 1, "w-full", 3, "onChange", "options"], ["optionLabel", "companyName", "optionValue", "id", "appendTo", "body", "formControlName", "leadId", "placeholder", "Select lead", 1, "w-full", 3, "onChange", "options"], ["pInputText", "", "formControlName", "title", "placeholder", "Client product opportunity", 1, "w-full"], [1, "col-span-12", "md:col-span-4"], ["optionLabel", "code", "optionValue", "id", "appendTo", "body", "formControlName", "currencyId", 1, "w-full", 3, "options"], ["formControlName", "expectedCloseDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["optionLabel", "fullName", "optionValue", "id", "appendTo", "body", "formControlName", "ownerUserId", "placeholder", "Select owner", 1, "w-full", 3, "options"], [1, "col-span-12", "mt-2", "border-t", "border-surface-200", "pt-4", "dark:border-surface-700"], ["styleClass", "opportunity-dialog opportunity-dialog--proposal-history opportunity-dialog--scrollable", "header", "Proposal History", 3, "visibleChange", "visible", "modal"], [1, "space-y-3"], [1, "rounded-md", "border", "border-surface-200", "p-4", "text-sm", "dark:border-surface-700", 3, "border-primary"], [1, "rounded-md", "border", "border-dashed", "border-surface-300", "p-6", "text-center", "text-sm", "text-surface-500", "dark:border-surface-700"], ["styleClass", "opportunity-dialog opportunity-dialog--proposal-upload", "header", "Upload New Proposal Version", 3, "visibleChange", "visible", "modal"], [1, "grid", "grid-cols-12", "gap-4"], [1, "text-red-500"], ["type", "file", "accept", ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-2", "text-sm", "dark:border-surface-600", "dark:bg-surface-900", 3, "change"], ["rows", "3", "placeholder", "Optional description for this version", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-3", "text-sm", "dark:border-surface-600", "dark:bg-surface-900", 3, "input"], ["label", "Create", "icon", "pi pi-plus", "size", "small", 3, "onClick"], [1, "opportunity-pipeline-grid"], [1, "rounded-md", "border", "border-surface-200", "bg-surface-50", "transition-colors", "dark:border-surface-700", "dark:bg-surface-950/40", 3, "border-primary", "bg-primary-50", "dark:bg-primary-950"], [1, "rounded-md", "border", "border-surface-200", "bg-surface-50", "transition-colors", "dark:border-surface-700", "dark:bg-surface-950/40", 3, "dragover", "dragleave", "drop"], [1, "flex", "items-center", "justify-between", "gap-2", "border-b", "border-surface-200", "px-3", "py-3", "dark:border-surface-700"], [1, "truncate", "text-sm", "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "text-xs", "text-surface-500"], ["value", "Final", 3, "severity"], [1, "space-y-3", "p-3"], [1, "rounded-md", "border", "border-surface-200", "bg-surface-0", "p-3", "shadow-sm", "transition-opacity", "dark:border-surface-700", "dark:bg-surface-900", 3, "cursor-move", "opacity-60"], [1, "rounded-md", "border", "border-dashed", "border-surface-300", "px-3", "py-6", "text-center", "text-sm", "text-surface-500", "dark:border-surface-700"], [1, "rounded-md", "border", "border-surface-200", "bg-surface-0", "p-3", "shadow-sm", "transition-opacity", "dark:border-surface-700", "dark:bg-surface-900", 3, "dragstart", "dragend"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "text-xs", "font-semibold", "text-primary"], [1, "mt-1", "line-clamp-2", "text-sm", "font-semibold", "text-surface-950", "dark:text-surface-0"], [3, "severity", "value"], [1, "mt-3", "space-y-1", "text-xs", "text-surface-600", "dark:text-surface-300"], [1, "truncate"], [1, "font-semibold"], [1, "flex", "items-center", "gap-2"], [1, "mt-3", "h-9", "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "px-2", "text-sm", "dark:border-surface-600", "dark:bg-surface-900", 3, "value", "disabled"], [1, "mt-3", "flex", "flex-wrap", "justify-end", "gap-1"], ["icon", "pi pi-history", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Activity", 3, "onClick"], ["icon", "pi pi-file-check", "severity", "success", "text", "", "rounded", "", "size", "small", "ariaLabel", "Commercial finalization"], ["type", "button", 1, "text-left", "text-xs", "font-semibold", "text-primary", "hover:underline", 3, "click"], [1, "text-xs", "text-surface-400"], ["type", "button", 1, "text-xs", "text-primary", "hover:underline", 3, "click"], [1, "mt-3", "h-9", "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "px-2", "text-sm", "dark:border-surface-600", "dark:bg-surface-900", 3, "change", "value", "disabled"], [3, "value"], ["icon", "pi pi-upload", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Upload proposal", 3, "onClick"], ["icon", "pi pi-pencil", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Edit", 3, "onClick"], ["icon", "pi pi-check", "severity", "success", "text", "", "rounded", "", "size", "small", "ariaLabel", "Mark won", 3, "onClick"], ["icon", "pi pi-times", "severity", "danger", "text", "", "rounded", "", "size", "small", "ariaLabel", "Mark lost", 3, "onClick"], ["icon", "pi pi-file-check", "severity", "success", "text", "", "rounded", "", "size", "small", "ariaLabel", "Commercial finalization", 3, "onClick"], ["currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} opportunities", "styleClass", "text-sm opportunity-table", 3, "onLazyLoad", "value", "loading", "lazy", "lazyLoadOnInit", "paginator", "first", "rows", "totalRecords", "rowsPerPageOptions", "showCurrentPageReport"], ["pSortableColumn", "opportunityNumber"], ["field", "opportunityNumber"], ["pSortableColumn", "title"], ["field", "title"], ["pSortableColumn", "estimatedValue", 1, "text-right"], ["field", "estimatedValue"], ["pSortableColumn", "stageName"], ["field", "stageName"], [1, "w-28", "text-right"], [1, "whitespace-nowrap", "font-semibold", "text-primary"], [1, "font-medium", "text-surface-950", "dark:text-surface-0"], [1, "mt-1", "text-xs", "text-surface-500"], [1, "whitespace-nowrap"], [1, "whitespace-nowrap", "text-right", "font-semibold"], ["severity", "info", 3, "value"], [1, "text-sm", "text-surface-500"], [1, "text-right"], ["icon", "pi pi-pencil", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Edit opportunity"], ["icon", "pi pi-download", "severity", "secondary", "text", "", "size", "small", 3, "onClick"], ["icon", "pi pi-eye", "severity", "secondary", "text", "", "size", "small", 3, "onClick"], ["icon", "pi pi-pencil", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Edit opportunity", 3, "onClick"], ["colspan", "10", 1, "py-8", "text-center", "text-sm", "text-surface-500"], [1, "flex", "justify-between", "gap-3"], [1, "mb-0", "mt-2", "text-surface-600", "dark:text-surface-300"], [1, "mt-2", "text-surface-600", "dark:text-surface-300"], ["formControlName", "finalAmount", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["pInputText", "", "formControlName", "lostReason", 1, "w-full"], ["label", "Cancel", "icon", "pi pi-times", "text", "", 3, "onClick", "disabled"], ["icon", "pi pi-check", 3, "onClick", "label", "severity", "loading"], [1, "mb-2", "flex", "items-center", "justify-between", "gap-3", "rounded-md", "border", "border-surface-200", "bg-surface-50", "px-3", "py-2", "text-sm", "dark:border-surface-700", "dark:bg-surface-950/40"], ["icon", "pi pi-download", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Download proposal", 3, "onClick"], ["label", "Move", "icon", "pi pi-arrow-right", 3, "onClick", "loading"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "col-span-12", "lg:col-span-5"], [1, "mb-3", "flex", "items-center", "justify-between", "gap-3"], [1, "m-0", "text-base", "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "text-xs", "font-medium", "text-surface-500"], [1, "mb-4", "grid", "grid-cols-12", "gap-3", "rounded-md", "border", "border-surface-200", "p-3", "dark:border-surface-700", 3, "formGroup"], [1, "col-span-12", "md:col-span-5"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "documentType", 1, "w-full", 3, "options"], [1, "col-span-12", "md:col-span-7"], ["formControlName", "remarks", "rows", "3", 1, "w-full", "rounded-md", "border", "border-surface-300", "bg-surface-0", "p-3", "text-sm", "dark:border-surface-600", "dark:bg-surface-900"], [1, "col-span-12", "text-sm", "text-red-600"], ["label", "Upload", "icon", "pi pi-upload", "size", "small", 3, "onClick", "loading"], [1, "rounded-md", "border", "border-dashed", "border-surface-300", "p-4", "text-center", "text-sm", "text-surface-500", "dark:border-surface-700"], [1, "col-span-12", "lg:col-span-7"], ["formControlName", "finalPayableAmount", 1, "w-full", 3, "readonly", "min", "minFractionDigits", "maxFractionDigits"], [1, "mb-2", "flex", "items-center", "gap-2", "text-sm", "font-semibold"], ["type", "checkbox", "formControlName", "isFinal", 1, "h-4", "w-4"], [1, "col-span-12", "rounded-md", "border", "border-surface-200", "p-3", "dark:border-surface-700"], [1, "mb-3", "text-sm", "font-semibold"], [1, "grid", "grid-cols-12", "gap-3"], ["optionLabel", "fileName", "optionValue", "id", "appendTo", "body", "formControlName", "agreementDocumentId", "placeholder", "Select agreement", 1, "w-full", 3, "options", "showClear"], ["formControlName", "agreementDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "agreementExpiryDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["optionLabel", "fileName", "optionValue", "id", "appendTo", "body", "formControlName", "purchaseOrderDocumentId", "placeholder", "Select PO", 1, "w-full", 3, "options", "showClear"], ["formControlName", "purchaseOrderDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], [1, "mb-3", "flex", "items-center", "gap-2", "text-sm", "font-semibold"], ["type", "checkbox", "formControlName", "licenseApplicable", 1, "h-4", "w-4"], ["type", "checkbox", "formControlName", "subscriptionApplicable", 1, "h-4", "w-4"], [1, "commercial-reminder-panel"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "mt-2", "truncate", "font-semibold", "text-surface-950", "dark:text-surface-0"], [1, "flex", "shrink-0", "gap-1"], ["icon", "pi pi-eye", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Preview", 3, "onClick"], ["icon", "pi pi-download", "severity", "secondary", "text", "", "rounded", "", "size", "small", "ariaLabel", "Download", 3, "onClick"], ["icon", "pi pi-trash", "severity", "danger", "text", "", "rounded", "", "size", "small", "ariaLabel", "Delete", 3, "onClick", "disabled"], ["formControlName", "licenseAmount", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["formControlName", "amcAmount", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["formControlName", "amcStartDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "amcRenewalDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "amcExpiryDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["formControlName", "subscriptionAmount", 1, "w-full", 3, "readonly", "min", "minFractionDigits", "maxFractionDigits"], ["optionLabel", "label", "optionValue", "value", "appendTo", "body", "formControlName", "subscriptionBillingFrequency", 1, "w-full", 3, "options"], ["formControlName", "subscriptionStartDate", "dateFormat", "yy-mm-dd", "dataType", "string", "appendTo", "body", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "onSelect", "showIcon"], ["pInputText", "", "formControlName", "nextSubscriptionBillingDate", "readonly", "", 1, "w-full"], [1, "commercial-reminder-list"], [1, "commercial-reminder-item"], ["label", "Resolve", "icon", "pi pi-check", "size", "small", "severity", "success", 3, "onClick", "outlined", "disabled"], ["label", "Close", "icon", "pi pi-times", "text", "", 3, "onClick", "disabled"], ["label", "Save Breakdown", "icon", "pi pi-check", 3, "onClick", "loading", "disabled"], ["label", "Save Changes", "icon", "pi pi-check", 3, "onClick", "loading"], [1, "mb-3", "text-xs", "font-semibold", "uppercase", "tracking-wide", "text-surface-500", "dark:text-surface-400"], ["formControlName", "licenseFee", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["formControlName", "amcFee", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["formControlName", "implementationFee", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["formControlName", "subscriptionFee", 1, "w-full", 3, "min", "minFractionDigits", "maxFractionDigits"], ["label", "Create", "icon", "pi pi-check", 3, "onClick", "loading"], [1, "text-surface-600", "dark:text-surface-300"], [1, "rounded-md", "border", "border-surface-200", "p-4", "text-sm", "dark:border-surface-700"], ["severity", "info", "value", "Last Communicated"], [1, "mt-1", "italic", "text-surface-500"], [1, "mt-2", "text-xs", "text-surface-500"], [1, "mt-3", "flex", "gap-2"], ["icon", "pi pi-eye", "label", "Preview", "severity", "secondary", "text", "", "size", "small", 3, "onClick"], ["icon", "pi pi-download", "label", "Download", "severity", "secondary", "text", "", "size", "small", 3, "onClick"], ["label", "Upload", "icon", "pi pi-upload", 3, "onClick", "loading", "disabled"]], template: function OpportunityList_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275element(0, "p-toast", 15)(1, "p-confirmdialog", 16);
      \u0275\u0275elementStart(2, "section", 17)(3, "div", 18)(4, "div", 19)(5, "div", 20);
      \u0275\u0275text(6, "Sales Pipeline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "h2", 21);
      \u0275\u0275text(8, "Opportunities");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 22);
      \u0275\u0275text(10, "Manage deal movement, activity, and closing from one pipeline view.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 23)(12, "p-button", 24);
      \u0275\u0275listener("onClick", function OpportunityList_Template_p_button_onClick_12_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.setViewMode("pipeline"));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p-button", 25);
      \u0275\u0275listener("onClick", function OpportunityList_Template_p_button_onClick_13_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.setViewMode("list"));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(14, OpportunityList_Conditional_14_Template, 1, 0, "p-button", 26);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(15, OpportunityList_Conditional_15_Template, 2, 1, "div", 27);
      \u0275\u0275elementStart(16, "div", 28)(17, "form", 29)(18, "div", 30)(19, "label", 31);
      \u0275\u0275text(20, "Search");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 32);
      \u0275\u0275element(22, "i", 33);
      \u0275\u0275elementStart(23, "input", 34);
      \u0275\u0275listener("keyup.enter", function OpportunityList_Template_input_keyup_enter_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.applyFilters());
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div", 35)(25, "label", 31);
      \u0275\u0275text(26, "Client");
      \u0275\u0275elementEnd();
      \u0275\u0275element(27, "p-select", 36);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 35)(29, "label", 31);
      \u0275\u0275text(30, "Stage");
      \u0275\u0275elementEnd();
      \u0275\u0275element(31, "p-select", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 35)(33, "label", 31);
      \u0275\u0275text(34, "Owner");
      \u0275\u0275elementEnd();
      \u0275\u0275element(35, "p-select", 38);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 35)(37, "label", 31);
      \u0275\u0275text(38, "Status");
      \u0275\u0275elementEnd();
      \u0275\u0275element(39, "p-select", 39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 40)(41, "p-button", 41);
      \u0275\u0275listener("onClick", function OpportunityList_Template_p_button_onClick_41_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.clearFilters());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p-button", 42);
      \u0275\u0275listener("onClick", function OpportunityList_Template_p_button_onClick_42_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.applyFilters());
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(43, OpportunityList_Conditional_43_Template, 4, 0, "div", 43)(44, OpportunityList_Conditional_44_Template, 8, 11, "div", 44);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "p-dialog", 45);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_45_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.activityDialog, $event) || (ctx.activityDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(46, "div", 46)(47, "form", 47)(48, "div", 48)(49, "div", 49);
      \u0275\u0275text(50);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "div", 48)(52, "label", 50);
      \u0275\u0275text(53, "Type");
      \u0275\u0275elementEnd();
      \u0275\u0275element(54, "p-select", 51);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div", 48)(56, "label", 50);
      \u0275\u0275text(57, "Subject");
      \u0275\u0275elementEnd();
      \u0275\u0275element(58, "input", 52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "div", 48)(60, "label", 50);
      \u0275\u0275text(61, "Notes");
      \u0275\u0275elementEnd();
      \u0275\u0275element(62, "textarea", 53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "div", 54)(64, "label", 50);
      \u0275\u0275text(65, "Activity Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p-datepicker", 55, 0);
      \u0275\u0275listener("onSelect", function OpportunityList_Template_p_datepicker_onSelect_66_listener() {
        \u0275\u0275restoreView(_r1);
        const activityDatePicker_r20 = \u0275\u0275reference(67);
        return \u0275\u0275resetView(ctx.closeDatePicker(activityDatePicker_r20));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "div", 54)(69, "label", 50);
      \u0275\u0275text(70, "Follow-up");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "p-datepicker", 56, 1);
      \u0275\u0275listener("onSelect", function OpportunityList_Template_p_datepicker_onSelect_71_listener() {
        \u0275\u0275restoreView(_r1);
        const followUpDatePicker_r21 = \u0275\u0275reference(72);
        return \u0275\u0275resetView(ctx.closeDatePicker(followUpDatePicker_r21));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(73, "div", 57)(74, "p-button", 58);
      \u0275\u0275listener("onClick", function OpportunityList_Template_p_button_onClick_74_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.addActivity());
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(75, "div", 59)(76, "div")(77, "div", 60);
      \u0275\u0275text(78, "Recent Activities");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "div", 61);
      \u0275\u0275repeaterCreate(80, OpportunityList_For_81_Template, 8, 4, "div", 62, _forTrack0, false, OpportunityList_ForEmpty_82_Template, 2, 0, "div", 63);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(83, "div")(84, "div", 60);
      \u0275\u0275text(85, "Stage History");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "div", 61);
      \u0275\u0275repeaterCreate(87, OpportunityList_For_88_Template, 6, 5, "div", 62, _forTrack0, false, OpportunityList_ForEmpty_89_Template, 2, 0, "div", 63);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(90, "p-dialog", 64);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_90_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.closeDialog, $event) || (ctx.closeDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(91, "form", 65);
      \u0275\u0275conditionalCreate(92, OpportunityList_Conditional_92_Template, 4, 3, "div", 48)(93, OpportunityList_Conditional_93_Template, 4, 0, "div", 48);
      \u0275\u0275elementStart(94, "div", 48)(95, "label", 50);
      \u0275\u0275text(96, "Closed Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(97, "p-datepicker", 66, 2);
      \u0275\u0275listener("onSelect", function OpportunityList_Template_p_datepicker_onSelect_97_listener() {
        \u0275\u0275restoreView(_r1);
        const closedDatePicker_r24 = \u0275\u0275reference(98);
        return \u0275\u0275resetView(ctx.closeDatePicker(closedDatePicker_r24));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(99, "div", 48)(100, "label", 50);
      \u0275\u0275text(101, "Note");
      \u0275\u0275elementEnd();
      \u0275\u0275element(102, "textarea", 67);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(103, OpportunityList_ng_template_103_Template, 2, 4, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(105, "p-dialog", 68);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_105_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.stageChangeDialog, $event) || (ctx.stageChangeDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(106, "form", 65)(107, "div", 69)(108, "div", 70);
      \u0275\u0275text(109);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "div", 71);
      \u0275\u0275text(111);
      \u0275\u0275elementEnd()();
      \u0275\u0275text(112, ". ");
      \u0275\u0275elementStart(113, "div", 48)(114, "label", 50);
      \u0275\u0275text(115, "Remarks");
      \u0275\u0275elementEnd();
      \u0275\u0275element(116, "textarea", 72);
      \u0275\u0275conditionalCreate(117, OpportunityList_Conditional_117_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(118, OpportunityList_Conditional_118_Template, 11, 6);
      \u0275\u0275elementEnd();
      \u0275\u0275template(119, OpportunityList_ng_template_119_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "p-dialog", 74);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_121_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.commercialDialog, $event) || (ctx.commercialDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275conditionalCreate(122, OpportunityList_Conditional_122_Template, 8, 6, "div", 75);
      \u0275\u0275conditionalCreate(123, OpportunityList_Conditional_123_Template, 2, 1, "div", 76);
      \u0275\u0275conditionalCreate(124, OpportunityList_Conditional_124_Template, 2, 0, "div", 77)(125, OpportunityList_Conditional_125_Template, 94, 23, "div", 46);
      \u0275\u0275template(126, OpportunityList_ng_template_126_Template, 2, 3, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(128, "p-dialog", 78);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_128_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.editDialog, $event) || (ctx.editDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(129, "form", 65)(130, "div", 48)(131, "label", 50);
      \u0275\u0275text(132, "Opportunity #");
      \u0275\u0275elementEnd();
      \u0275\u0275element(133, "input", 79);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(134, "div", 48)(135, "label", 50);
      \u0275\u0275text(136, "Title");
      \u0275\u0275elementEnd();
      \u0275\u0275element(137, "input", 80);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(138, "div", 54)(139, "label", 50);
      \u0275\u0275text(140, "Estimated Value");
      \u0275\u0275elementEnd();
      \u0275\u0275element(141, "p-inputnumber", 81);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(142, "div", 54)(143, "label", 50);
      \u0275\u0275text(144, "Owner");
      \u0275\u0275elementEnd();
      \u0275\u0275element(145, "p-select", 82);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(146, OpportunityList_ng_template_146_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(148, "p-dialog", 83);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_148_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.createDialog, $event) || (ctx.createDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(149, "form", 65)(150, "div", 54)(151, "label", 50);
      \u0275\u0275text(152, "Client");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(153, "p-select", 84);
      \u0275\u0275listener("onChange", function OpportunityList_Template_p_select_onChange_153_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onClientChange($event.value));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(154, OpportunityList_Conditional_154_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(155, "div", 54)(156, "label", 50);
      \u0275\u0275text(157, "Contact");
      \u0275\u0275elementEnd();
      \u0275\u0275element(158, "p-select", 85);
      \u0275\u0275conditionalCreate(159, OpportunityList_Conditional_159_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(160, "div", 54)(161, "label", 50);
      \u0275\u0275text(162, "Product");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(163, "p-select", 86);
      \u0275\u0275listener("onChange", function OpportunityList_Template_p_select_onChange_163_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onProductChange($event.value));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(164, OpportunityList_Conditional_164_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(165, "div", 54)(166, "label", 50);
      \u0275\u0275text(167, "Lead");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(168, "p-select", 87);
      \u0275\u0275listener("onChange", function OpportunityList_Template_p_select_onChange_168_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onLeadChange($event.value));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(169, OpportunityList_Conditional_169_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(170, "div", 48)(171, "label", 50);
      \u0275\u0275text(172, "Title");
      \u0275\u0275elementEnd();
      \u0275\u0275element(173, "input", 88);
      \u0275\u0275conditionalCreate(174, OpportunityList_Conditional_174_Template, 2, 0, "span", 73)(175, OpportunityList_Conditional_175_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(176, "div", 89)(177, "label", 50);
      \u0275\u0275text(178, "Estimated Value");
      \u0275\u0275elementEnd();
      \u0275\u0275element(179, "p-inputnumber", 81);
      \u0275\u0275conditionalCreate(180, OpportunityList_Conditional_180_Template, 2, 0, "span", 73)(181, OpportunityList_Conditional_181_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(182, "div", 89)(183, "label", 50);
      \u0275\u0275text(184, "Currency");
      \u0275\u0275elementEnd();
      \u0275\u0275element(185, "p-select", 90);
      \u0275\u0275conditionalCreate(186, OpportunityList_Conditional_186_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(187, "div", 89)(188, "label", 50);
      \u0275\u0275text(189, "Expected Close Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(190, "p-datepicker", 91, 4);
      \u0275\u0275listener("onSelect", function OpportunityList_Template_p_datepicker_onSelect_190_listener() {
        \u0275\u0275restoreView(_r1);
        const expectedCloseDatePicker_r45 = \u0275\u0275reference(191);
        return \u0275\u0275resetView(ctx.closeDatePicker(expectedCloseDatePicker_r45));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(192, "div", 48)(193, "label", 50);
      \u0275\u0275text(194, "Owner");
      \u0275\u0275elementEnd();
      \u0275\u0275element(195, "p-select", 92);
      \u0275\u0275conditionalCreate(196, OpportunityList_Conditional_196_Template, 2, 0, "span", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(197, OpportunityList_Conditional_197_Template, 16, 9, "div", 93);
      \u0275\u0275conditionalCreate(198, OpportunityList_Conditional_198_Template, 8, 3, "div", 93);
      \u0275\u0275elementEnd();
      \u0275\u0275template(199, OpportunityList_ng_template_199_Template, 2, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(201, "p-dialog", 94);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_201_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.proposalHistoryDialog, $event) || (ctx.proposalHistoryDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(202, "div", 95);
      \u0275\u0275conditionalCreate(203, OpportunityList_Conditional_203_Template, 5, 2, "div", 75);
      \u0275\u0275repeaterCreate(204, OpportunityList_For_205_Template, 15, 8, "div", 96, _forTrack1, false, OpportunityList_ForEmpty_206_Template, 3, 1, "div", 97);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(207, "p-dialog", 98);
      \u0275\u0275twoWayListener("visibleChange", function OpportunityList_Template_p_dialog_visibleChange_207_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.uploadProposalDialog, $event) || (ctx.uploadProposalDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(208, "div", 99);
      \u0275\u0275conditionalCreate(209, OpportunityList_Conditional_209_Template, 5, 2, "div", 69);
      \u0275\u0275elementStart(210, "div", 48)(211, "label", 50);
      \u0275\u0275text(212, "Proposal Document ");
      \u0275\u0275elementStart(213, "span", 100);
      \u0275\u0275text(214, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(215, "input", 101);
      \u0275\u0275listener("change", function OpportunityList_Template_input_change_215_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onUploadProposalFileSelected($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(216, "div", 48)(217, "label", 50);
      \u0275\u0275text(218, "Description / Remarks");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(219, "textarea", 102);
      \u0275\u0275listener("input", function OpportunityList_Template_textarea_input_219_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onUploadProposalDescriptionChange($event));
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(220, OpportunityList_ng_template_220_Template, 2, 3, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_45_0;
      \u0275\u0275advance(12);
      \u0275\u0275property("outlined", ctx.viewMode !== "pipeline");
      \u0275\u0275advance();
      \u0275\u0275property("outlined", ctx.viewMode !== "list");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canCreate ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage ? 15 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.filterForm);
      \u0275\u0275advance(10);
      \u0275\u0275property("options", ctx.clients)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.stages)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.users)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.statuses)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.viewMode === "pipeline" ? 43 : 44);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("visible", ctx.activityDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.activityForm);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.selectedOpportunity == null ? null : ctx.selectedOpportunity.opportunityNumber, " \xB7 ", ctx.selectedOpportunity == null ? null : ctx.selectedOpportunity.title);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.activityTypes);
      \u0275\u0275advance(12);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(5);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(3);
      \u0275\u0275property("loading", ctx.isSaving);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.activities);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.stageHistory);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("visible", ctx.closeDialog);
      \u0275\u0275property("modal", true)("header", ctx.closingMode === "won" ? "Mark Opportunity Won" : "Mark Opportunity Lost");
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.closeForm);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.closingMode === "won" ? 92 : 93);
      \u0275\u0275advance(5);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("visible", ctx.stageChangeDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.stageChangeForm);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.pendingStageOpportunity == null ? null : ctx.pendingStageOpportunity.opportunityNumber);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("", ctx.pendingStageOpportunity == null ? null : ctx.pendingStageOpportunity.stageName, " to ", ctx.pendingStageName);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(((tmp_45_0 = ctx.stageChangeForm.get("remarks")) == null ? null : tmp_45_0.errors) && ((tmp_45_0 = ctx.stageChangeForm.get("remarks")) == null ? null : tmp_45_0.touched) ? 117 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isProposalSentTarget ? 118 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("visible", ctx.commercialDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.selectedOpportunity ? 122 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.commercialError ? 123 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoadingCommercial ? 124 : 125);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("visible", ctx.editDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.editForm);
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.selectedOpportunity == null ? null : ctx.selectedOpportunity.opportunityNumber);
      \u0275\u0275advance(8);
      \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.users);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("visible", ctx.createDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.opportunityForm);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.clients);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("clientId", "required") ? 154 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.contacts);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("contactId", "required") ? 159 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.products);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("productId", "required") ? 164 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.leads);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("leadId", "required") ? 169 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.showCreateError("title", "required") ? 174 : ctx.showCreateError("title", "maxlength") ? 175 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("min", 0)("minFractionDigits", 0)("maxFractionDigits", 2);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("estimatedValue", "required") ? 180 : ctx.showCreateError("estimatedValue", "min") ? 181 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("options", ctx.currencies);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("currencyId", "required") ? 186 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("showIcon", true);
      \u0275\u0275advance(5);
      \u0275\u0275property("options", ctx.users);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showCreateError("ownerUserId", "required") ? 196 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.selectedProduct == null ? null : ctx.selectedProduct.isLicenseBased) ? 197 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.selectedProduct == null ? null : ctx.selectedProduct.isSubscriptionBased) ? 198 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("visible", ctx.proposalHistoryDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.selectedOpportunity ? 203 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.selectedProposalHistory);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("visible", ctx.uploadProposalDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.selectedUploadOpportunity ? 209 : -1);
    }
  }, dependencies: [ButtonModule, Button, CommonModule, ConfirmDialogModule, ConfirmDialog, DatePickerModule, DatePicker, DialogModule, Dialog, InputNumberModule, InputNumber, InputTextModule, InputText, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, SelectModule, Select, TableModule, Table, SortableColumn, SortIcon, TagModule, Tag, ToastModule, Toast], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.opportunity-pipeline-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: minmax(14rem, 1fr);\n  gap: 0.75rem;\n  min-width: max-content;\n}\n.commercial-reminder-panel[_ngcontent-%COMP%] {\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  margin-top: 1rem;\n  padding: 0.85rem;\n}\n.commercial-reminder-panel[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin: 0;\n}\n.commercial-reminder-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.commercial-reminder-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.commercial-reminder-item[_ngcontent-%COMP%] {\n  align-items: center;\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  display: flex;\n  gap: 0.75rem;\n  justify-content: space-between;\n  padding: 0.65rem;\n}\n.commercial-reminder-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 650;\n}\n.commercial-reminder-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  display: block;\n  margin-top: 0.15rem;\n}\n[_nghost-%COMP%]     .opportunity-confirm-dialog {\n  width: 450px;\n}\n[_nghost-%COMP%]     .opportunity-table .p-datatable-table {\n  min-width: 78rem;\n}\n[_nghost-%COMP%]     .opportunity-dialog {\n  width: min(640px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--activity {\n  width: min(860px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--close {\n  width: min(560px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--stage-change {\n  width: min(520px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--proposal-history {\n  width: min(720px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--proposal-upload {\n  width: min(520px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--commercial {\n  width: min(1120px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--create {\n  width: min(960px, 96vw);\n}\n[_nghost-%COMP%]     .opportunity-dialog--scrollable .p-dialog-content {\n  max-height: calc(100vh - 12rem);\n  overflow: auto;\n}\n/*# sourceMappingURL=opportunity-list.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OpportunityList, [{
    type: Component,
    args: [{ selector: "app-opportunity-list", standalone: true, imports: [ButtonModule, CommonModule, ConfirmDialogModule, DatePickerModule, DialogModule, InputNumberModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, ToastModule], providers: [ConfirmationService, MessageService], template: `<p-toast position="bottom-right"></p-toast>\r
<p-confirmdialog styleClass="opportunity-confirm-dialog" />\r
\r
<section class="rounded-md border border-surface-200 bg-surface-0 shadow-sm dark:border-surface-700 dark:bg-surface-900">\r
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-surface-200 px-5 py-4 dark:border-surface-700">\r
        <div class="min-w-0">\r
            <div class="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Sales Pipeline</div>\r
            <h2 class="m-0 mt-1 text-xl font-semibold text-surface-950 dark:text-surface-0">Opportunities</h2>\r
            <p class="mb-0 mt-1 text-sm text-surface-600 dark:text-surface-300">Manage deal movement, activity, and closing from one pipeline view.</p>\r
        </div>\r
        <div class="flex flex-wrap items-center gap-2">\r
            <p-button label="Pipeline" icon="pi pi-sitemap" size="small" [outlined]="viewMode !== 'pipeline'" (onClick)="setViewMode('pipeline')" />\r
            <p-button label="List" icon="pi pi-list" size="small" [outlined]="viewMode !== 'list'" (onClick)="setViewMode('list')" />\r
            @if (canCreate) {\r
                <p-button label="Create" icon="pi pi-plus" size="small" (onClick)="openCreateDialog()" />\r
            }\r
        </div>\r
    </div>\r
\r
    @if (errorMessage) {\r
        <div class="mx-5 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">{{ errorMessage }}</div>\r
    }\r
\r
    <div class="border-b border-surface-200 bg-surface-50/60 px-5 py-4 dark:border-surface-700 dark:bg-surface-950/30">\r
        <form [formGroup]="filterForm" class="grid grid-cols-12 items-end gap-3">\r
            <div class="col-span-12 xl:col-span-4">\r
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Search</label>\r
                <div class="relative">\r
                    <i class="pi pi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400"></i>\r
                    <input pInputText formControlName="searchTerm" class="h-10 w-full pl-9 text-sm" placeholder="Search number, title, client, product" (keyup.enter)="applyFilters()" />\r
                </div>\r
            </div>\r
\r
            <div class="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">\r
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Client</label>\r
                <p-select [options]="clients" optionLabel="name" optionValue="id" appendTo="body" formControlName="clientId" placeholder="All clients" [showClear]="true" class="w-full text-sm" />\r
            </div>\r
\r
            <div class="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">\r
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Stage</label>\r
                <p-select [options]="stages" optionLabel="name" optionValue="id" appendTo="body" formControlName="stageId" placeholder="All stages" [showClear]="true" class="w-full text-sm" />\r
            </div>\r
\r
            <div class="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">\r
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Owner</label>\r
                <p-select [options]="users" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="ownerUserId" placeholder="All owners" [showClear]="true" class="w-full text-sm" />\r
            </div>\r
\r
            <div class="col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2">\r
                <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Status</label>\r
                <p-select [options]="statuses" optionLabel="name" optionValue="code" appendTo="body" formControlName="status" placeholder="Open" [showClear]="true" class="w-full text-sm" />\r
            </div>\r
\r
            <div class="col-span-12 flex flex-wrap justify-end gap-2">\r
                <p-button label="Clear" icon="pi pi-filter-slash" severity="secondary" size="small" outlined (onClick)="clearFilters()" />\r
                <p-button label="Apply Filters" icon="pi pi-filter" size="small" (onClick)="applyFilters()" />\r
            </div>\r
        </form>\r
    </div>\r
\r
    @if (viewMode === 'pipeline') {\r
        <div class="overflow-x-auto px-5 py-4">\r
            <div class="opportunity-pipeline-grid">\r
                @for (stage of pipelineStages; track stage.stageId) {\r
                    <div\r
                        class="rounded-md border border-surface-200 bg-surface-50 transition-colors dark:border-surface-700 dark:bg-surface-950/40"\r
                        [class.border-primary]="isStageDragTarget(stage)"\r
                        [class.bg-primary-50]="isStageDragTarget(stage)"\r
                        [class.dark:bg-primary-950]="isStageDragTarget(stage)"\r
                        (dragover)="onStageDragOver(stage, $event)"\r
                        (dragleave)="onStageDragLeave(stage)"\r
                        (drop)="onStageDrop(stage, $event)"\r
                    >\r
                        <div class="flex items-center justify-between gap-2 border-b border-surface-200 px-3 py-3 dark:border-surface-700">\r
                            <div class="min-w-0">\r
                                <div class="truncate text-sm font-semibold text-surface-950 dark:text-surface-0">{{ stage.stageName }}</div>\r
                                <div class="text-xs text-surface-500">{{ stage.opportunities.length }} deal(s)</div>\r
                            </div>\r
                            @if (stage.isFinal) {\r
                                <p-tag [severity]="stage.isWonStage ? 'success' : 'danger'" value="Final" />\r
                            }\r
                        </div>\r
\r
                        <div class="space-y-3 p-3">\r
                            @for (opportunity of stage.opportunities; track opportunity.id) {\r
                                <article\r
                                    class="rounded-md border border-surface-200 bg-surface-0 p-3 shadow-sm transition-opacity dark:border-surface-700 dark:bg-surface-900"\r
                                    [class.cursor-move]="canMoveOpportunity(opportunity)"\r
                                    [class.opacity-60]="draggedOpportunity?.id === opportunity.id"\r
                                    [attr.draggable]="canMoveOpportunity(opportunity)"\r
                                    (dragstart)="onOpportunityDragStart(opportunity, $event)"\r
                                    (dragend)="onOpportunityDragEnd()"\r
                                >\r
                                    <div class="flex items-start justify-between gap-2">\r
                                        <div class="min-w-0">\r
                                            <div class="text-xs font-semibold text-primary">{{ opportunity.opportunityNumber }}</div>\r
                                            <div class="mt-1 line-clamp-2 text-sm font-semibold text-surface-950 dark:text-surface-0">{{ opportunity.title }}</div>\r
                                        </div>\r
                                        <p-tag [severity]="statusSeverity(opportunity.status)" [value]="opportunity.status" />\r
                                    </div>\r
                                    <div class="mt-3 space-y-1 text-xs text-surface-600 dark:text-surface-300">\r
                                        <div class="truncate">{{ opportunity.clientName }}</div>\r
                                        <div class="font-semibold">{{ formatCurrency(opportunity.estimatedValue, opportunity.currencyCode) }}</div>\r
                                        <div>Close: {{ formatDate(opportunity.expectedCloseDate) }}</div>\r
                                        <div>Owner: {{ opportunity.ownerUserName || 'Not set' }}</div>\r
                                        @if (opportunity.hasProposalDocument) {\r
                                            <div class="flex items-center gap-2">\r
                                                <button type="button" class="text-left text-xs font-semibold text-primary hover:underline" (click)="downloadProposalDocument(opportunity)">\r
                                                    {{ opportunity.proposalDocumentFileName || 'Proposal document' }}\r
                                                </button>\r
                                                @if (opportunity.proposalVersionNumber) {\r
                                                    <span class="text-xs text-surface-400">v{{ opportunity.proposalVersionNumber }}</span>\r
                                                }\r
                                                <button type="button" class="text-xs text-primary hover:underline" (click)="openProposalHistory(opportunity)">History</button>\r
                                            </div>\r
                                        }\r
                                    </div>\r
\r
                                    @if (canEdit && !opportunity.isFinalStage && opportunity.status === 'Open') {\r
                                        <select class="mt-3 h-9 w-full rounded-md border border-surface-300 bg-surface-0 px-2 text-sm dark:border-surface-600 dark:bg-surface-900" [value]="opportunity.stageId" (change)="onStageChange(opportunity, $event)" [disabled]="isSaving">\r
                                            <option [value]="opportunity.stageId">{{ opportunity.stageName }}</option>\r
                                            @for (nextStage of stageOptionsFor(opportunity); track nextStage.id) {\r
                                                <option [value]="nextStage.id">{{ nextStage.name }}</option>\r
                                            }\r
                                        </select>\r
                                    }\r
\r
                                    <div class="mt-3 flex flex-wrap justify-end gap-1">\r
                                        <p-button icon="pi pi-history" severity="secondary" text rounded size="small" ariaLabel="Activity" (onClick)="openActivityDialog(opportunity)" />\r
                                        @if (canEdit && opportunity.status === 'Open') {\r
                                            <p-button icon="pi pi-upload" severity="secondary" text rounded size="small" ariaLabel="Upload proposal" (onClick)="openUploadProposalDialog(opportunity)" />\r
                                            <p-button icon="pi pi-pencil" severity="secondary" text rounded size="small" ariaLabel="Edit" (onClick)="openEditDialog(opportunity)" />\r
                                        }\r
                                        @if (canApprove && opportunity.status === 'Open') {\r
                                            <p-button icon="pi pi-check" severity="success" text rounded size="small" ariaLabel="Mark won" (onClick)="openCloseDialog(opportunity, 'won')" />\r
                                            <p-button icon="pi pi-times" severity="danger" text rounded size="small" ariaLabel="Mark lost" (onClick)="openCloseDialog(opportunity, 'lost')" />\r
                                        }\r
                                        @if (canManageCommercial(opportunity)) {\r
                                            <p-button icon="pi pi-file-check" severity="success" text rounded size="small" ariaLabel="Commercial finalization" (onClick)="openCommercialDialog(opportunity)" />\r
                                        }\r
                                    </div>\r
                                </article>\r
                            } @empty {\r
                                <div class="rounded-md border border-dashed border-surface-300 px-3 py-6 text-center text-sm text-surface-500 dark:border-surface-700">\r
                                    @if (isStageDragTarget(stage)) {\r
                                        Drop to move here\r
                                    } @else {\r
                                        No deals\r
                                    }\r
                                </div>\r
                            }\r
                        </div>\r
                    </div>\r
                }\r
            </div>\r
        </div>\r
    } @else {\r
        <div class="px-5 py-4">\r
            <p-table\r
                [value]="opportunities"\r
                [loading]="isLoading"\r
                [lazy]="true"\r
                [lazyLoadOnInit]="false"\r
                [paginator]="true"\r
                [first]="first"\r
                [rows]="pageSize"\r
                [totalRecords]="totalRecords"\r
                [rowsPerPageOptions]="[10, 25, 50]"\r
                [showCurrentPageReport]="true"\r
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} opportunities"\r
                (onLazyLoad)="onLazyLoad($event)"\r
                styleClass="text-sm opportunity-table"\r
            >\r
                <ng-template #header>\r
                    <tr>\r
                        <th pSortableColumn="opportunityNumber">Opportunity # <p-sortIcon field="opportunityNumber" /></th>\r
                        <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>\r
                        <th>Client</th>\r
                        <th>Product</th>\r
                        <th pSortableColumn="estimatedValue" class="text-right">Value <p-sortIcon field="estimatedValue" /></th>\r
                        <th>Owner</th>\r
                        <th pSortableColumn="stageName">Stage <p-sortIcon field="stageName" /></th>\r
                        <th>Status</th>\r
                        <th>Proposal</th>\r
                        <th class="w-28 text-right">Actions</th>\r
                    </tr>\r
                </ng-template>\r
\r
                <ng-template #body let-opportunity>\r
                    <tr>\r
                        <td class="whitespace-nowrap font-semibold text-primary">{{ opportunity.opportunityNumber }}</td>\r
                        <td>\r
                            <div class="font-medium text-surface-950 dark:text-surface-0">{{ opportunity.title }}</div>\r
                            @if (opportunity.leadNumber) {\r
                                <div class="mt-1 text-xs text-surface-500">From {{ opportunity.leadNumber }}</div>\r
                            }\r
                        </td>\r
                        <td class="whitespace-nowrap">{{ opportunity.clientName }}</td>\r
                        <td class="whitespace-nowrap">{{ opportunity.productName }}</td>\r
                        <td class="whitespace-nowrap text-right font-semibold">{{ formatCurrency(opportunity.estimatedValue, opportunity.currencyCode) }}</td>\r
                        <td class="whitespace-nowrap">{{ opportunity.ownerUserName || 'Not set' }}</td>\r
                        <td><p-tag severity="info" [value]="opportunity.stageName" /></td>\r
                        <td><p-tag [severity]="statusSeverity(opportunity.status)" [value]="opportunity.status" /></td>\r
                        <td>\r
                            @if (opportunity.hasProposalDocument) {\r
                                <div class="flex items-center gap-2">\r
                                    <p-button icon="pi pi-download" severity="secondary" text size="small" (onClick)="downloadProposalDocument(opportunity)" />\r
                                    @if (opportunity.proposalVersionNumber) {\r
                                        <span class="text-xs text-surface-500">v{{ opportunity.proposalVersionNumber }}</span>\r
                                    }\r
                                    <p-button icon="pi pi-eye" severity="secondary" text size="small" (onClick)="openProposalHistory(opportunity)" />\r
                                </div>\r
                            } @else {\r
                                <span class="text-sm text-surface-500">Not set</span>\r
                            }\r
                        </td>\r
                        <td class="text-right">\r
                            <p-button icon="pi pi-history" severity="secondary" text rounded size="small" ariaLabel="Activity" (onClick)="openActivityDialog(opportunity)" />\r
                            @if (canEdit && opportunity.status === 'Open') {\r
                                <p-button icon="pi pi-pencil" severity="secondary" text rounded size="small" ariaLabel="Edit opportunity" (onClick)="openEditDialog(opportunity)" />\r
                            }\r
                            @if (canManageCommercial(opportunity)) {\r
                                <p-button icon="pi pi-file-check" severity="success" text rounded size="small" ariaLabel="Commercial finalization" (onClick)="openCommercialDialog(opportunity)" />\r
                            }\r
                        </td>\r
                    </tr>\r
                </ng-template>\r
\r
                <ng-template #emptymessage>\r
                    <tr>\r
                        <td colspan="10" class="py-8 text-center text-sm text-surface-500">No opportunities found.</td>\r
                    </tr>\r
                </ng-template>\r
            </p-table>\r
        </div>\r
    }\r
</section>\r
\r
<p-dialog [(visible)]="activityDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--activity opportunity-dialog--scrollable" header="Opportunity Activity">\r
    <div class="grid grid-cols-12 gap-5">\r
        <form [formGroup]="activityForm" class="col-span-12 grid grid-cols-12 gap-3 lg:col-span-5">\r
            <div class="col-span-12">\r
                <div class="text-sm font-semibold text-surface-950 dark:text-surface-0">{{ selectedOpportunity?.opportunityNumber }} &middot; {{ selectedOpportunity?.title }}</div>\r
            </div>\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">Type</label>\r
                <p-select [options]="activityTypes" optionLabel="label" optionValue="value" appendTo="body" formControlName="activityType" class="w-full" />\r
            </div>\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">Subject</label>\r
                <input pInputText formControlName="subject" class="w-full" />\r
            </div>\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">Notes</label>\r
                <textarea formControlName="notes" rows="5" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900"></textarea>\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold">Activity Date</label>\r
                <p-datepicker #activityDatePicker formControlName="activityDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(activityDatePicker)" />\r
            </div>\r
            <div class="col-span-12 md:col-span-6">\r
                <label class="mb-2 block text-sm font-semibold">Follow-up</label>\r
                <p-datepicker #followUpDatePicker formControlName="followUpDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(followUpDatePicker)" />\r
            </div>\r
            <div class="col-span-12 flex justify-end">\r
                <p-button label="Add Activity" icon="pi pi-plus" size="small" [loading]="isSaving" (onClick)="addActivity()" />\r
            </div>\r
        </form>\r
\r
        <div class="col-span-12 space-y-4 lg:col-span-7">\r
            <div>\r
                <div class="mb-2 text-sm font-semibold">Recent Activities</div>\r
                <div class="space-y-2">\r
                    @for (activity of activities; track activity.id) {\r
                        <div class="rounded-md border border-surface-200 p-3 text-sm dark:border-surface-700">\r
                            <div class="flex justify-between gap-3">\r
                                <span class="font-semibold">{{ activity.activityType }} &middot; {{ activity.subject || 'No subject' }}</span>\r
                                <span class="text-xs text-surface-500">{{ formatDate(activity.activityDate) }}</span>\r
                            </div>\r
                            <p class="mb-0 mt-2 text-surface-600 dark:text-surface-300">{{ activity.notes }}</p>\r
                        </div>\r
                    } @empty {\r
                        <div class="rounded-md border border-dashed border-surface-300 p-4 text-center text-sm text-surface-500">No activities yet.</div>\r
                    }\r
                </div>\r
            </div>\r
\r
            <div>\r
                <div class="mb-2 text-sm font-semibold">Stage History</div>\r
                <div class="space-y-2">\r
                    @for (item of stageHistory; track item.id) {\r
                        <div class="rounded-md border border-surface-200 p-3 text-sm dark:border-surface-700">\r
                            <div class="font-semibold">{{ item.fromStageName || 'Created' }} &rarr; {{ item.toStageName }}</div>\r
                            <div class="mt-1 text-xs text-surface-500">{{ formatDate(item.changedAt) }} &middot; {{ item.changedByUserName || 'System' }}</div>\r
                            @if (item.remarks) {\r
                                <div class="mt-2 text-surface-600 dark:text-surface-300">{{ item.remarks }}</div>\r
                            }\r
                        </div>\r
                    } @empty {\r
                        <div class="rounded-md border border-dashed border-surface-300 p-4 text-center text-sm text-surface-500">No stage history yet.</div>\r
                    }\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="closeDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--close" [header]="closingMode === 'won' ? 'Mark Opportunity Won' : 'Mark Opportunity Lost'">\r
    <form [formGroup]="closeForm" class="grid grid-cols-12 gap-4">\r
        @if (closingMode === 'won') {\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">Final Amount</label>\r
                <p-inputnumber formControlName="finalAmount" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
            </div>\r
        } @else {\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">Lost Reason</label>\r
                <input pInputText formControlName="lostReason" class="w-full" />\r
            </div>\r
        }\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Closed Date</label>\r
            <p-datepicker #closedDatePicker formControlName="closedDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(closedDatePicker)" />\r
        </div>\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Note</label>\r
            <textarea formControlName="note" rows="4" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900"></textarea>\r
        </div>\r
    </form>\r
\r
    <ng-template #footer>\r
        <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSaving" (onClick)="closeDialog = false" />\r
        <p-button [label]="closingMode === 'won' ? 'Mark Won' : 'Mark Lost'" icon="pi pi-check" [severity]="closingMode === 'won' ? 'success' : 'danger'" [loading]="isSaving" (onClick)="closeOpportunity()" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="stageChangeDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--stage-change" header="Move Opportunity">\r
    <form [formGroup]="stageChangeForm" class="grid grid-cols-12 gap-4">\r
        <div class="col-span-12 rounded-md border border-surface-200 bg-surface-50 p-3 text-sm dark:border-surface-700 dark:bg-surface-950/40">\r
            <div class="font-semibold text-surface-950 dark:text-surface-0">{{ pendingStageOpportunity?.opportunityNumber }}</div>\r
            <div class="mt-1 text-surface-600 dark:text-surface-300">{{ pendingStageOpportunity?.stageName }} to {{ pendingStageName }}</div>\r
        </div>.\r
          \r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Remarks</label>\r
            <textarea formControlName="remarks" rows="4" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900"></textarea>\r
            @if (stageChangeForm.get('remarks')?.errors && stageChangeForm.get('remarks')?.touched) {\r
                <span class="mt-1 block text-sm text-red-600">Remarks must be 1000 characters or fewer.</span>\r
            }\r
        </div>\r
        @if (isProposalSentTarget) {\r
            <div class="col-span-12">\r
                <label class="mb-2 block text-sm font-semibold">\r
                    Final Proposal Document\r
                    @if (isProposalDocumentRequired) {\r
                        <span class="text-red-500">*</span>\r
                    }\r
                </label>\r
                @if (pendingStageOpportunity?.hasProposalDocument) {\r
                    <div class="mb-2 flex items-center justify-between gap-3 rounded-md border border-surface-200 bg-surface-50 px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-950/40">\r
                        <span class="truncate">{{ pendingStageOpportunity?.proposalDocumentFileName || 'Proposal document' }}</span>\r
                        <p-button icon="pi pi-download" severity="secondary" text rounded size="small" ariaLabel="Download proposal" (onClick)="downloadProposalDocument(pendingStageOpportunity!)" />\r
                    </div>\r
                }\r
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="w-full rounded-md border border-surface-300 bg-surface-0 p-2 text-sm dark:border-surface-600 dark:bg-surface-900" (change)="onProposalDocumentSelected($event)" />\r
                @if (proposalDocumentError) {\r
                    <span class="mt-1 block text-sm text-red-600">{{ proposalDocumentError }}</span>\r
                }\r
             \r
            </div>\r
             <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Estimated Value</label>\r
            <p-inputnumber formControlName="estimatedValue" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
        </div>\r
        }\r
    </form>\r
\r
    <ng-template #footer>\r
        <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSaving" (onClick)="cancelStageChange()" />\r
        <p-button label="Move" icon="pi pi-arrow-right" [loading]="isSaving" (onClick)="confirmStageChange()" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="commercialDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--commercial opportunity-dialog--scrollable" header="Commercial Finalization">\r
    @if (selectedOpportunity) {\r
        <div class="mb-4 rounded-md border border-surface-200 bg-surface-50 p-3 text-sm dark:border-surface-700 dark:bg-surface-950/40">\r
            <div class="flex flex-wrap items-center justify-between gap-3">\r
                <div>\r
                    <div class="font-semibold text-surface-950 dark:text-surface-0">{{ selectedOpportunity.opportunityNumber }} &middot; {{ selectedOpportunity.title }}</div>\r
                    <div class="mt-1 text-surface-600 dark:text-surface-300">{{ selectedOpportunity.clientName }} &middot; {{ selectedOpportunity.productName }}</div>\r
                </div>\r
                <p-tag [severity]="statusSeverity(selectedOpportunity.status)" [value]="selectedOpportunity.status" />\r
            </div>\r
        </div>\r
    }\r
\r
    @if (commercialError) {\r
        <div class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">{{ commercialError }}</div>\r
    }\r
\r
    @if (isLoadingCommercial) {\r
        <div class="rounded-md border border-surface-200 p-4 text-sm text-surface-500 dark:border-surface-700">Loading commercial details...</div>\r
    } @else {\r
        <div class="grid grid-cols-12 gap-5">\r
            <section class="col-span-12 lg:col-span-5">\r
                <div class="mb-3 flex items-center justify-between gap-3">\r
                    <h3 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Agreement / PO Documents</h3>\r
                    <span class="text-xs font-medium text-surface-500">{{ commercialDocuments.length }} active</span>\r
                </div>\r
\r
                <form [formGroup]="commercialUploadForm" class="mb-4 grid grid-cols-12 gap-3 rounded-md border border-surface-200 p-3 dark:border-surface-700">\r
                    <div class="col-span-12 md:col-span-5">\r
                        <label class="mb-2 block text-sm font-semibold">Type</label>\r
                        <p-select [options]="commercialDocumentTypes" optionLabel="label" optionValue="value" appendTo="body" formControlName="documentType" class="w-full" />\r
                    </div>\r
                    <div class="col-span-12 md:col-span-7">\r
                        <label class="mb-2 block text-sm font-semibold">Document</label>\r
                        <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="w-full rounded-md border border-surface-300 bg-surface-0 p-2 text-sm dark:border-surface-600 dark:bg-surface-900" (change)="onCommercialDocumentSelected($event)" />\r
                    </div>\r
                    <div class="col-span-12">\r
                        <label class="mb-2 block text-sm font-semibold">Remarks</label>\r
                        <textarea formControlName="remarks" rows="3" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900"></textarea>\r
                    </div>\r
                    @if (commercialDocumentError) {\r
                        <div class="col-span-12 text-sm text-red-600">{{ commercialDocumentError }}</div>\r
                    }\r
                    <div class="col-span-12 flex justify-end">\r
                        <p-button label="Upload" icon="pi pi-upload" size="small" [loading]="isSavingCommercial" (onClick)="uploadCommercialDocument()" />\r
                    </div>\r
                </form>\r
\r
                <div class="space-y-2">\r
                    @for (document of commercialDocuments; track document.id) {\r
                        <article class="rounded-md border border-surface-200 p-3 text-sm dark:border-surface-700">\r
                            <div class="flex items-start justify-between gap-3">\r
                                <div class="min-w-0">\r
                                    <div class="flex flex-wrap items-center gap-2">\r
                                        <p-tag severity="info" [value]="documentTypeLabel(document.documentType)" />\r
                                        <span class="text-xs text-surface-500">{{ formatFileSize(document.fileSize) }}</span>\r
                                    </div>\r
                                    <div class="mt-2 truncate font-semibold text-surface-950 dark:text-surface-0">{{ document.fileName }}</div>\r
                                    <div class="mt-1 text-xs text-surface-500">{{ formatDate(document.uploadedOn) }} &middot; {{ document.uploadedByUserName || 'System' }}</div>\r
                                    @if (document.remarks) {\r
                                        <p class="mb-0 mt-2 text-surface-600 dark:text-surface-300">{{ document.remarks }}</p>\r
                                    }\r
                                </div>\r
                                <div class="flex shrink-0 gap-1">\r
                                    <p-button icon="pi pi-eye" severity="secondary" text rounded size="small" ariaLabel="Preview" (onClick)="previewCommercialDocument(document)" />\r
                                    <p-button icon="pi pi-download" severity="secondary" text rounded size="small" ariaLabel="Download" (onClick)="downloadCommercialDocument(document)" />\r
                                    <p-button icon="pi pi-trash" severity="danger" text rounded size="small" ariaLabel="Delete" [disabled]="isSavingCommercial" (onClick)="confirmDeleteCommercialDocument(document)" />\r
                                </div>\r
                            </div>\r
                        </article>\r
                    } @empty {\r
                        <div class="rounded-md border border-dashed border-surface-300 p-4 text-center text-sm text-surface-500 dark:border-surface-700">No Agreement or PO document uploaded.</div>\r
                    }\r
                </div>\r
            </section>\r
\r
            <section class="col-span-12 lg:col-span-7">\r
                <div class="mb-3 flex items-center justify-between gap-3">\r
                    <h3 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Confirmed Commercial Breakdown</h3>\r
                    @if (commercialBreakdown) {\r
                        <span class="text-xs text-surface-500">Updated {{ formatDate(commercialBreakdown.updatedOn) }}</span>\r
                    }\r
                </div>\r
\r
                <form [formGroup]="commercialForm" class="grid grid-cols-12 gap-4">\r
                    <div class="col-span-12 md:col-span-6">\r
                        <label class="mb-2 block text-sm font-semibold">Currency</label>\r
                        <p-select [options]="currencies" optionLabel="code" optionValue="id" appendTo="body" formControlName="currencyId" class="w-full" />\r
                    </div>\r
                    <div class="col-span-12 md:col-span-6">\r
                        <label class="mb-2 block text-sm font-semibold">Final Payable Amount</label>\r
                        <p-inputnumber formControlName="finalPayableAmount" [readonly]="!commercialForm.controls.isFinal.value" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                    </div>\r
                    <div class="col-span-12 md:col-span-6">\r
                        <label class="mb-2 flex items-center gap-2 text-sm font-semibold">\r
                            <input type="checkbox" formControlName="isFinal" class="h-4 w-4" />\r
                            <span>Is Final</span>\r
                        </label>\r
                    </div>\r
\r
                    <div class="col-span-12 rounded-md border border-surface-200 p-3 dark:border-surface-700">\r
                        <div class="mb-3 text-sm font-semibold">Agreement Reference</div>\r
                        <div class="grid grid-cols-12 gap-3">\r
                            <div class="col-span-12">\r
                                <label class="mb-2 block text-sm font-semibold">Agreement Document</label>\r
                                <p-select [options]="agreementDocuments" optionLabel="fileName" optionValue="id" appendTo="body" formControlName="agreementDocumentId" placeholder="Select agreement" [showClear]="true" class="w-full" />\r
                            </div>\r
                            <div class="col-span-12 md:col-span-6">\r
                                <label class="mb-2 block text-sm font-semibold">Agreement Date</label>\r
                                <p-datepicker #agreementDatePicker formControlName="agreementDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(agreementDatePicker)" />\r
                            </div>\r
                            <div class="col-span-12 md:col-span-6">\r
                                <label class="mb-2 block text-sm font-semibold">Agreement Expiry Date</label>\r
                                <p-datepicker #agreementExpiryDatePicker formControlName="agreementExpiryDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(agreementExpiryDatePicker)" />\r
                            </div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="col-span-12 rounded-md border border-surface-200 p-3 dark:border-surface-700">\r
                        <div class="mb-3 text-sm font-semibold">Purchase Order Reference</div>\r
                        <div class="grid grid-cols-12 gap-3">\r
                            <div class="col-span-12">\r
                                <label class="mb-2 block text-sm font-semibold">PO Document</label>\r
                                <p-select [options]="purchaseOrderDocuments" optionLabel="fileName" optionValue="id" appendTo="body" formControlName="purchaseOrderDocumentId" placeholder="Select PO" [showClear]="true" class="w-full" />\r
                            </div>\r
                            <div class="col-span-12">\r
                                <label class="mb-2 block text-sm font-semibold">PO Date</label>\r
                                <p-datepicker #purchaseOrderDatePicker formControlName="purchaseOrderDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(purchaseOrderDatePicker)" />\r
                            </div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="col-span-12 rounded-md border border-surface-200 p-3 dark:border-surface-700">\r
                        <label class="mb-3 flex items-center gap-2 text-sm font-semibold">\r
                            <input type="checkbox" formControlName="licenseApplicable" class="h-4 w-4" />\r
                            <span>License Applicable</span>\r
                        </label>\r
                        @if (commercialForm.controls.licenseApplicable.value) {\r
                            <div class="grid grid-cols-12 gap-3">\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">License Amount</label>\r
                                    <p-inputnumber formControlName="licenseAmount" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">AMC Amount</label>\r
                                    <p-inputnumber formControlName="amcAmount" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">AMC Start Date</label>\r
                                    <p-datepicker #amcStartDatePicker formControlName="amcStartDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(amcStartDatePicker)" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">AMC Renewal Date</label>\r
                                    <p-datepicker #amcRenewalDatePicker formControlName="amcRenewalDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(amcRenewalDatePicker)" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">AMC Expiry Date</label>\r
                                    <p-datepicker #amcExpiryDatePicker formControlName="amcExpiryDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(amcExpiryDatePicker)" />\r
                                </div>\r
                            </div>\r
                        }\r
                    </div>\r
\r
                    <div class="col-span-12 rounded-md border border-surface-200 p-3 dark:border-surface-700">\r
                        <label class="mb-3 flex items-center gap-2 text-sm font-semibold">\r
                            <input type="checkbox" formControlName="subscriptionApplicable" class="h-4 w-4" />\r
                            <span>Subscription Applicable</span>\r
                        </label>\r
                        @if (commercialForm.controls.subscriptionApplicable.value) {\r
                            <div class="grid grid-cols-12 gap-3">\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">Subscription Amount</label>\r
                                    <p-inputnumber formControlName="subscriptionAmount" [readonly]="commercialForm.controls.isFinal.value" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">Billing Frequency</label>\r
                                    <p-select [options]="subscriptionBillingFrequencies" optionLabel="label" optionValue="value" appendTo="body" formControlName="subscriptionBillingFrequency" class="w-full" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">Subscription Start Date</label>\r
                                    <p-datepicker #subscriptionStartDatePicker formControlName="subscriptionStartDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(subscriptionStartDatePicker)" />\r
                                </div>\r
                                <div class="col-span-12 md:col-span-6">\r
                                    <label class="mb-2 block text-sm font-semibold">Next Billing Date</label>\r
                                    <input pInputText formControlName="nextSubscriptionBillingDate" readonly class="w-full" />\r
                                </div>\r
                            </div>\r
                        }\r
                    </div>\r
\r
                    <div class="col-span-12">\r
                        <label class="mb-2 block text-sm font-semibold">Remarks</label>\r
                        <textarea formControlName="remarks" rows="3" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900"></textarea>\r
                    </div>\r
                </form>\r
\r
                @if (commercialBreakdown && commercialReminderEvents().length) {\r
                    <section class="commercial-reminder-panel">\r
                        <div>\r
                            <h4>Resolve Reminder Events</h4>\r
                            <p>Mark renewal, expiry, or billing reminders resolved after the follow-up action is completed.</p>\r
                        </div>\r
                        <div class="commercial-reminder-list">\r
                            @for (event of commercialReminderEvents(); track event.eventType) {\r
                                <article class="commercial-reminder-item">\r
                                    <div>\r
                                        <span>{{ event.label }}</span>\r
                                        <small>{{ formatDate(event.dueDate) }}</small>\r
                                    </div>\r
                                    <p-button label="Resolve" icon="pi pi-check" size="small" severity="success" [outlined]="true" [disabled]="isResolvingCommercialReminder" (onClick)="resolveCommercialReminder(event.eventType, event.dueDate)" />\r
                                </article>\r
                            }\r
                        </div>\r
                    </section>\r
                }\r
            </section>\r
        </div>\r
    }\r
\r
    <ng-template #footer>\r
        <p-button label="Close" icon="pi pi-times" text [disabled]="isSavingCommercial" (onClick)="commercialDialog = false" />\r
        <p-button label="Save Breakdown" icon="pi pi-check" [loading]="isSavingCommercial" [disabled]="isLoadingCommercial || !hasCommercialDocument" (onClick)="saveCommercialBreakdown()" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="editDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--edit" header="Edit Opportunity">\r
    <form [formGroup]="editForm" class="grid grid-cols-12 gap-4">\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Opportunity #</label>\r
            <input pInputText [value]="selectedOpportunity?.opportunityNumber" class="w-full" disabled />\r
        </div>\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Title</label>\r
            <input pInputText formControlName="title" class="w-full" />\r
        </div>\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Estimated Value</label>\r
            <p-inputnumber formControlName="estimatedValue" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
        </div>\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Owner</label>\r
            <p-select [options]="users" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="ownerUserId" class="w-full" />\r
        </div>\r
    </form>\r
\r
    <ng-template #footer>\r
        <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSaving" (onClick)="editDialog = false" />\r
        <p-button label="Save Changes" icon="pi pi-check" [loading]="isSaving" (onClick)="updateOpportunity()" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="createDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--create opportunity-dialog--scrollable" header="Create Opportunity">\r
    <form [formGroup]="opportunityForm" class="grid grid-cols-12 gap-4">\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Client</label>\r
            <p-select [options]="clients" optionLabel="name" optionValue="id" appendTo="body" formControlName="clientId" class="w-full" (onChange)="onClientChange($event.value)" />\r
            @if (showCreateError('clientId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Client is required.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Contact</label>\r
            <p-select [options]="contacts" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="contactId" class="w-full" />\r
            @if (showCreateError('contactId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Contact is required.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Product</label>\r
            <p-select [options]="products" optionLabel="name" optionValue="id" appendTo="body" formControlName="productId" class="w-full" (onChange)="onProductChange($event.value)" />\r
            @if (showCreateError('productId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Product is required.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-6">\r
            <label class="mb-2 block text-sm font-semibold">Lead</label>\r
            <p-select [options]="leads" optionLabel="companyName" optionValue="id" appendTo="body" formControlName="leadId" placeholder="Select lead" class="w-full" (onChange)="onLeadChange($event.value)" />\r
            @if (showCreateError('leadId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Lead is required.</span>\r
            }\r
        </div>\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Title</label>\r
            <input pInputText formControlName="title" class="w-full" placeholder="Client product opportunity" />\r
            @if (showCreateError('title', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Title is required.</span>\r
            } @else if (showCreateError('title', 'maxlength')) {\r
                <span class="mt-1 block text-sm text-red-600">Title must be 250 characters or fewer.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-4">\r
            <label class="mb-2 block text-sm font-semibold">Estimated Value</label>\r
            <p-inputnumber formControlName="estimatedValue" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
            @if (showCreateError('estimatedValue', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Estimated value is required.</span>\r
            } @else if (showCreateError('estimatedValue', 'min')) {\r
                <span class="mt-1 block text-sm text-red-600">Estimated value must be 0 or greater.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-4">\r
            <label class="mb-2 block text-sm font-semibold">Currency</label>\r
            <p-select [options]="currencies" optionLabel="code" optionValue="id" appendTo="body" formControlName="currencyId" class="w-full" />\r
            @if (showCreateError('currencyId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Currency is required.</span>\r
            }\r
        </div>\r
        <div class="col-span-12 md:col-span-4">\r
            <label class="mb-2 block text-sm font-semibold">Expected Close Date</label>\r
            <p-datepicker #expectedCloseDatePicker formControlName="expectedCloseDate" dateFormat="yy-mm-dd" dataType="string" appendTo="body" styleClass="w-full" inputStyleClass="w-full" [showIcon]="true" (onSelect)="closeDatePicker(expectedCloseDatePicker)" />\r
        </div>\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Owner</label>\r
            <p-select [options]="users" optionLabel="fullName" optionValue="id" appendTo="body" formControlName="ownerUserId" placeholder="Select owner" class="w-full" />\r
            @if (showCreateError('ownerUserId', 'required')) {\r
                <span class="mt-1 block text-sm text-red-600">Owner is required.</span>\r
            }\r
        </div>\r
\r
        @if (selectedProduct?.isLicenseBased) {\r
            <div class="col-span-12 mt-2 border-t border-surface-200 pt-4 dark:border-surface-700">\r
                <div class="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">License Fees</div>\r
                <div class="grid grid-cols-12 gap-4">\r
                    <div class="col-span-12 md:col-span-4">\r
                        <label class="mb-2 block text-sm font-semibold">License Fee</label>\r
                        <p-inputnumber formControlName="licenseFee" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <label class="mb-2 block text-sm font-semibold">AMC Fee</label>\r
                        <p-inputnumber formControlName="amcFee" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                    </div>\r
                    <div class="col-span-12 md:col-span-4">\r
                        <label class="mb-2 block text-sm font-semibold">Implementation Fee</label>\r
                        <p-inputnumber formControlName="implementationFee" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                    </div>\r
                </div>\r
            </div>\r
        }\r
\r
        @if (selectedProduct?.isSubscriptionBased) {\r
            <div class="col-span-12 mt-2 border-t border-surface-200 pt-4 dark:border-surface-700">\r
                <div class="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Subscription Fees</div>\r
                <div class="grid grid-cols-12 gap-4">\r
                    <div class="col-span-12 md:col-span-4">\r
                        <label class="mb-2 block text-sm font-semibold">Subscription Fee</label>\r
                        <p-inputnumber formControlName="subscriptionFee" [min]="0" [minFractionDigits]="0" [maxFractionDigits]="2" class="w-full" />\r
                    </div>\r
                </div>\r
            </div>\r
        }\r
    </form>\r
\r
    <ng-template #footer>\r
        <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSaving" (onClick)="createDialog = false" />\r
        <p-button label="Create" icon="pi pi-check" [loading]="isSaving" (onClick)="createOpportunity()" />\r
    </ng-template>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="proposalHistoryDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--proposal-history opportunity-dialog--scrollable" header="Proposal History">\r
    <div class="space-y-3">\r
        @if (selectedOpportunity) {\r
            <div class="mb-4 rounded-md border border-surface-200 bg-surface-50 p-3 text-sm dark:border-surface-700 dark:bg-surface-950/40">\r
                <div class="font-semibold text-surface-950 dark:text-surface-0">{{ selectedOpportunity.opportunityNumber }}</div>\r
                <div class="text-surface-600 dark:text-surface-300">{{ selectedOpportunity.title }}</div>\r
            </div>\r
        }\r
        @for (version of selectedProposalHistory; track version.documentId) {\r
            <div class="rounded-md border border-surface-200 p-4 text-sm dark:border-surface-700" [class.border-primary]="version.isLastCommunicated">\r
                <div class="flex items-start justify-between gap-3">\r
                    <div class="min-w-0">\r
                        <div class="flex items-center gap-2">\r
                            <span class="font-semibold text-surface-950 dark:text-surface-0">Version {{ version.versionNumber }}</span>\r
                            @if (version.isLastCommunicated) {\r
                                <p-tag severity="info" value="Last Communicated" />\r
                            }\r
                        </div>\r
                        <div class="mt-1 text-surface-600 dark:text-surface-300">{{ version.fileName }}</div>\r
                        @if (version.description) {\r
                            <div class="mt-1 italic text-surface-500">{{ version.description }}</div>\r
                        }\r
                        <div class="mt-2 text-xs text-surface-500">\r
                            Uploaded by {{ version.uploadedByUserName || 'Unknown' }} on {{ formatDate(version.uploadedOn) }}\r
                        </div>\r
                    </div>\r
                </div>\r
                <div class="mt-3 flex gap-2">\r
                    <p-button icon="pi pi-eye" label="Preview" severity="secondary" text size="small" (onClick)="previewProposalVersion(selectedOpportunity!.id, version)" />\r
                    <p-button icon="pi pi-download" label="Download" severity="secondary" text size="small" (onClick)="downloadProposalVersion(selectedOpportunity!.id, version)" />\r
                </div>\r
            </div>\r
        } @empty {\r
            <div class="rounded-md border border-dashed border-surface-300 p-6 text-center text-sm text-surface-500 dark:border-surface-700">\r
                @if (selectedProposalHistory === undefined) {\r
                    Loading...\r
                } @else {\r
                    No proposal versions found.\r
                }\r
            </div>\r
        }\r
    </div>\r
</p-dialog>\r
\r
<p-dialog [(visible)]="uploadProposalDialog" [modal]="true" styleClass="opportunity-dialog opportunity-dialog--proposal-upload" header="Upload New Proposal Version">\r
    <div class="grid grid-cols-12 gap-4">\r
        @if (selectedUploadOpportunity) {\r
            <div class="col-span-12 rounded-md border border-surface-200 bg-surface-50 p-3 text-sm dark:border-surface-700 dark:bg-surface-950/40">\r
                <div class="font-semibold text-surface-950 dark:text-surface-0">{{ selectedUploadOpportunity.opportunityNumber }}</div>\r
                <div class="text-surface-600 dark:text-surface-300">{{ selectedUploadOpportunity.title }}</div>\r
            </div>\r
        }\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Proposal Document <span class="text-red-500">*</span></label>\r
            <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="w-full rounded-md border border-surface-300 bg-surface-0 p-2 text-sm dark:border-surface-600 dark:bg-surface-900" (change)="onUploadProposalFileSelected($event)" />\r
        </div>\r
        <div class="col-span-12">\r
            <label class="mb-2 block text-sm font-semibold">Description / Remarks</label>\r
            <textarea rows="3" class="w-full rounded-md border border-surface-300 bg-surface-0 p-3 text-sm dark:border-surface-600 dark:bg-surface-900" placeholder="Optional description for this version" (input)="onUploadProposalDescriptionChange($event)"></textarea>\r
        </div>\r
    </div>\r
\r
    <ng-template #footer>\r
        <p-button label="Cancel" icon="pi pi-times" text [disabled]="isSaving" (onClick)="cancelUploadProposal()" />\r
        <p-button label="Upload" icon="pi pi-upload" [loading]="isSaving" (onClick)="confirmUploadProposal()" [disabled]="!uploadProposalFile" />\r
    </ng-template>\r
</p-dialog>\r
`, styles: ["/* src/app/pages/opportunities/components/opportunity-list/opportunity-list.scss */\n:host {\n  display: block;\n}\n.opportunity-pipeline-grid {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: minmax(14rem, 1fr);\n  gap: 0.75rem;\n  min-width: max-content;\n}\n.commercial-reminder-panel {\n  border: 1px solid var(--surface-border);\n  border-radius: 8px;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  margin-top: 1rem;\n  padding: 0.85rem;\n}\n.commercial-reminder-panel h4 {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin: 0;\n}\n.commercial-reminder-panel p {\n  color: var(--text-color-secondary);\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.commercial-reminder-list {\n  display: grid;\n  gap: 0.5rem;\n}\n.commercial-reminder-item {\n  align-items: center;\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  display: flex;\n  gap: 0.75rem;\n  justify-content: space-between;\n  padding: 0.65rem;\n}\n.commercial-reminder-item span {\n  display: block;\n  font-weight: 650;\n}\n.commercial-reminder-item small {\n  color: var(--text-color-secondary);\n  display: block;\n  margin-top: 0.15rem;\n}\n:host ::ng-deep .opportunity-confirm-dialog {\n  width: 450px;\n}\n:host ::ng-deep .opportunity-table .p-datatable-table {\n  min-width: 78rem;\n}\n:host ::ng-deep .opportunity-dialog {\n  width: min(640px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--activity {\n  width: min(860px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--close {\n  width: min(560px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--stage-change {\n  width: min(520px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--proposal-history {\n  width: min(720px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--proposal-upload {\n  width: min(520px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--commercial {\n  width: min(1120px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--create {\n  width: min(960px, 96vw);\n}\n:host ::ng-deep .opportunity-dialog--scrollable .p-dialog-content {\n  max-height: calc(100vh - 12rem);\n  overflow: auto;\n}\n/*# sourceMappingURL=opportunity-list.css.map */\n"] }]
  }], () => [{ type: OpportunityApiService }, { type: NotificationApiService }, { type: MessageService }, { type: ConfirmationService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OpportunityList, { className: "OpportunityList", filePath: "src/app/pages/opportunities/components/opportunity-list/opportunity-list.ts", lineNumber: 47 });
})();

// src/app/pages/opportunities/opportunities.routes.ts
var opportunities_routes_default = [{ path: "", component: OpportunityList, canActivate: [permissionGuard(Permissions.opportunities.view)] }];
export {
  opportunities_routes_default as default
};
//# sourceMappingURL=chunk-CDOOKL5N.js.map
