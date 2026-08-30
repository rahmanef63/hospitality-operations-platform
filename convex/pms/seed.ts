import { v } from "convex/values";
import { INITIAL_AMENITY_SEEDS, INITIAL_PROPERTY_SEED } from "../../shared/pms/config";
import { internalMutation } from "../_generated/server";
import { recordPmsAudit } from "./lib";
export const initialProperty=internalMutation({args:{actorEmailHash:v.string()},handler:async(ctx,args)=>{
  if(!INITIAL_PROPERTY_SEED)return{skipped:true,propertyId:null,propertyCreated:false,amenitiesCreated:0,amenitiesUpdated:0};
  const now=Date.now();const seed=INITIAL_PROPERTY_SEED;const existing=await ctx.db.query("properties").withIndex("by_slug",q=>q.eq("slug",seed.slug)).unique();const fields={...seed,updatedAt:now,archived:false};let propertyId=existing?._id;let propertyCreated=false;if(existing)await ctx.db.patch(existing._id,fields);else{propertyId=await ctx.db.insert("properties",{...fields,createdAt:now});propertyCreated=true;}if(!propertyId)throw new Error("Initial property could not be initialized.");let amenitiesCreated=0,amenitiesUpdated=0;for(const amenitySeed of INITIAL_AMENITY_SEEDS){const amenity=await ctx.db.query("amenities").withIndex("by_property_key",q=>q.eq("propertyId",propertyId).eq("key",amenitySeed.key)).unique();const amenityFields={propertyId,...amenitySeed,publicVisible:true,active:true,archived:false,updatedAt:now};if(amenity){await ctx.db.patch(amenity._id,amenityFields);amenitiesUpdated+=1;}else{await ctx.db.insert("amenities",{...amenityFields,createdAt:now});amenitiesCreated+=1;}}
  await recordPmsAudit(ctx,{propertyId,resource:"property",resourceId:propertyId,action:"seed",summary:`Initialized tenant property ${seed.name}`,actorEmailHash:args.actorEmailHash});return{skipped:false,propertyId,propertyCreated,amenitiesCreated,amenitiesUpdated};
}});
