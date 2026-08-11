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

// src/app/pages/users/services/user-api.service.ts
var UserApiService = class _UserApiService {
  http;
  usersUrl = apiUrl("/users");
  rolesUrl = apiUrl("/roles");
  constructor(http) {
    this.http = http;
  }
  getUsers() {
    return this.http.get(this.usersUrl);
  }
  createUser(request) {
    return this.http.post(this.usersUrl, request);
  }
  updateUser(id, request) {
    return this.http.put(`${this.usersUrl}/${id}`, request);
  }
  activateUser(id) {
    return this.http.patch(`${this.usersUrl}/${id}/activate`, {});
  }
  deactivateUser(id) {
    return this.http.patch(`${this.usersUrl}/${id}/deactivate`, {});
  }
  getRoles() {
    return this.http.get(this.rolesUrl);
  }
  static \u0275fac = function UserApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserApiService, factory: _UserApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  UserApiService
};
//# sourceMappingURL=chunk-QS27J5HP.js.map
