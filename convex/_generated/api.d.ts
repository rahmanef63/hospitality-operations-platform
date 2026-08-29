/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminSecurity from "../adminSecurity.js";
import type * as aiSettings from "../aiSettings.js";
import type * as aiValidators from "../aiValidators.js";
import type * as http from "../http.js";
import type * as lib_admin from "../lib/admin.js";
import type * as pms_availability from "../pms/availability.js";
import type * as pms_availabilityRules from "../pms/availabilityRules.js";
import type * as pms_catalog from "../pms/catalog.js";
import type * as pms_dashboard from "../pms/dashboard.js";
import type * as pms_dispatch from "../pms/dispatch.js";
import type * as pms_finance from "../pms/finance.js";
import type * as pms_guests from "../pms/guests.js";
import type * as pms_lib from "../pms/lib.js";
import type * as pms_public from "../pms/public.js";
import type * as pms_readModels from "../pms/readModels.js";
import type * as pms_reservations from "../pms/reservations.js";
import type * as pms_seed from "../pms/seed.js";
import type * as pms_tasks from "../pms/tasks.js";
import type * as pms_validators from "../pms/validators.js";
import type * as welcome from "../welcome.js";
import type * as welcomeLocale from "../welcomeLocale.js";
import type * as welcomeReservations from "../welcomeReservations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminSecurity: typeof adminSecurity;
  aiSettings: typeof aiSettings;
  aiValidators: typeof aiValidators;
  http: typeof http;
  "lib/admin": typeof lib_admin;
  "pms/availability": typeof pms_availability;
  "pms/availabilityRules": typeof pms_availabilityRules;
  "pms/catalog": typeof pms_catalog;
  "pms/dashboard": typeof pms_dashboard;
  "pms/dispatch": typeof pms_dispatch;
  "pms/finance": typeof pms_finance;
  "pms/guests": typeof pms_guests;
  "pms/lib": typeof pms_lib;
  "pms/public": typeof pms_public;
  "pms/readModels": typeof pms_readModels;
  "pms/reservations": typeof pms_reservations;
  "pms/seed": typeof pms_seed;
  "pms/tasks": typeof pms_tasks;
  "pms/validators": typeof pms_validators;
  welcome: typeof welcome;
  welcomeLocale: typeof welcomeLocale;
  welcomeReservations: typeof welcomeReservations;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
