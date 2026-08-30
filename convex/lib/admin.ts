function constantTimeTextEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

export function authorizeAdminRequest(request: Request): boolean {
  const expected = process.env.HOSPITALITY_CONVEX_ADMIN_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  return constantTimeTextEqual(authorization.slice(7), expected);
}
