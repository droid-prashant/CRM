import "./chunk-WDMUDEB6.js";

// src/app/pages/pages.routes.ts
var pages_routes_default = [
  { path: "", redirectTo: "/pages/leads", pathMatch: "full" },
  { path: "clients", loadChildren: () => import("./chunk-RZFSTFZR.js").then((m) => m.default) },
  { path: "leads", loadChildren: () => import("./chunk-3QSAHJB7.js").then((m) => m.default) },
  { path: "lookups", loadChildren: () => import("./chunk-RCNWJZUR.js").then((m) => m.default) },
  { path: "notifications", loadChildren: () => import("./chunk-FXUKAHHC.js").then((m) => m.default) },
  { path: "opportunities", loadChildren: () => import("./chunk-CDOOKL5N.js").then((m) => m.default) },
  { path: "partners", loadChildren: () => import("./chunk-XKC67HYK.js").then((m) => m.default) },
  { path: "products", loadChildren: () => import("./chunk-NLZCG62G.js").then((m) => m.default) },
  { path: "roles", loadChildren: () => import("./chunk-7FG5D5JP.js").then((m) => m.default) },
  { path: "users", loadChildren: () => import("./chunk-U4WYUF4R.js").then((m) => m.default) },
  { path: "**", redirectTo: "/notfound" }
];
export {
  pages_routes_default as default
};
//# sourceMappingURL=chunk-A7273H6Q.js.map
