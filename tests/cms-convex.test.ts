import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { api, internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
import { defaultCmsDocument } from "@/shared/cms";

const modules = import.meta.glob("../convex/**/*.{ts,js}");
const actorEmailHash = "cms-test-actor-hash-000000000000000000000000000000";

describe("Convex CMS draft and publish contract", () => {
  it("seeds atomically, keeps draft private, then publishes the reviewed snapshot", async () => {
    const t = convexTest(schema, modules);
    const initial = defaultCmsDocument();
    const initialJson = JSON.stringify(initial);
    await expect(t.mutation(internal.cms.ensure, { json: initialJson, actorEmailHash })).resolves.toMatchObject({ created: true, version: 1 });
    await expect(t.mutation(internal.cms.ensure, { json: initialJson, actorEmailHash })).resolves.toMatchObject({ created: false, version: 1 });

    const changed = defaultCmsDocument();
    changed.site.home.hero.title = "Draft-only headline";
    await t.mutation(internal.cms.saveDraft, { json: JSON.stringify(changed), actorEmailHash });
    const beforePublish = await t.query(api.cms.getPublished, {});
    expect(JSON.parse(beforePublish!.json).site.home.hero.title).not.toBe("Draft-only headline");

    await t.mutation(internal.cms.publish, { actorEmailHash });
    const afterPublish = await t.query(api.cms.getPublished, {});
    expect(JSON.parse(afterPublish!.json).site.home.hero.title).toBe("Draft-only headline");
    const overview = await t.query(internal.cms.getAdminOverview, {});
    expect(overview.events.map((event) => event.action)).toEqual(expect.arrayContaining(["seed", "save", "publish"]));
  });
});
