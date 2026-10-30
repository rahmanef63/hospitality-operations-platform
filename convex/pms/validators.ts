import { v } from "convex/values";

export const propertyTypeValidator = v.union(
  v.literal("villa"), v.literal("homestay"), v.literal("guesthouse"),
  v.literal("apartment"), v.literal("house"), v.literal("other"),
);
export const propertyStatusValidator = v.union(v.literal("active"), v.literal("inactive"));
export const publicationStatusValidator = v.union(v.literal("draft"), v.literal("published"));
export const unitTypeValidator = v.union(
  v.literal("villa"), v.literal("room"), v.literal("suite"),
  v.literal("house"), v.literal("apartment"), v.literal("other"),
);
export const unitStatusValidator = v.union(v.literal("active"), v.literal("out_of_service"), v.literal("inactive"));
export const amenityCategoryValidator = v.union(
  v.literal("leisure"), v.literal("wellness"), v.literal("view"),
  v.literal("service"), v.literal("accessibility"), v.literal("other"),
);
export const reservationStatusValidator = v.union(
  v.literal("inquiry"), v.literal("tentative"), v.literal("confirmed"),
  v.literal("checked_in"), v.literal("checked_out"), v.literal("cancelled"), v.literal("no_show"),
);
export const reservationSourceValidator = v.union(
  v.literal("direct"), v.literal("whatsapp"), v.literal("airbnb"),
  v.literal("booking"), v.literal("agoda"), v.literal("traveloka"), v.literal("other"),
);
export const blockReasonValidator = v.union(
  v.literal("owner_use"), v.literal("maintenance"), v.literal("closed"), v.literal("other"),
);
export const transactionKindValidator = v.union(v.literal("payment"), v.literal("refund"), v.literal("expense"));
export const transactionMethodValidator = v.union(
  v.literal("cash"), v.literal("bank_transfer"), v.literal("card"),
  v.literal("e_wallet"), v.literal("ota"), v.literal("other"),
);
export const transactionStatusValidator = v.union(v.literal("pending"), v.literal("completed"), v.literal("void"));
export const taskCategoryValidator = v.union(
  v.literal("housekeeping"), v.literal("maintenance"), v.literal("guest_request"),
  v.literal("inspection"), v.literal("other"),
);
export const taskPriorityValidator = v.union(
  v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent"),
);
export const taskStatusValidator = v.union(
  v.literal("open"), v.literal("in_progress"), v.literal("done"), v.literal("cancelled"),
);
export const auditActionValidator = v.union(
  v.literal("create"), v.literal("update"), v.literal("archive"), v.literal("seed"),
);
