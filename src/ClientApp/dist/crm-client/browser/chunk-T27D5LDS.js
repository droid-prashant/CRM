import {
  HttpClient,
  apiUrl
} from "./chunk-NMY5IBCO.js";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ACBHL573.js";

// src/app/pages/notifications/services/notification-api.service.ts
var NotificationApiService = class _NotificationApiService {
  http;
  notificationsUrl = apiUrl("/notifications");
  constructor(http) {
    this.http = http;
  }
  getConfigurations() {
    return this.http.get(`${this.notificationsUrl}/configurations`);
  }
  getEventTypes() {
    return this.http.get(`${this.notificationsUrl}/event-types`);
  }
  getProcessorStatus() {
    return this.http.get(`${this.notificationsUrl}/processor-status`);
  }
  updateConfiguration(eventType, request) {
    return this.http.put(`${this.notificationsUrl}/configurations/${eventType}`, request);
  }
  getMyNotifications() {
    return this.http.get(`${this.notificationsUrl}/my`);
  }
  markAsRead(notificationId) {
    return this.http.patch(`${this.notificationsUrl}/${notificationId}/read`, {});
  }
  markAllAsRead() {
    return this.http.patch(`${this.notificationsUrl}/read-all`, {});
  }
  resolveEvent(request) {
    return this.http.post(`${this.notificationsUrl}/resolve`, request);
  }
  processDueNotifications() {
    return this.http.post(`${this.notificationsUrl}/process`, {});
  }
  static \u0275fac = function NotificationApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationApiService, factory: _NotificationApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  NotificationApiService
};
//# sourceMappingURL=chunk-T27D5LDS.js.map
