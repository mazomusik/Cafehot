import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { modelProfile, galleryItems, subscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  model: router({
    getProfile: publicProcedure.query(async () => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.select().from(modelProfile).limit(1);
        if (result.length === 0) {
          const defaultProfile = {
            name: "Modelo",
            age: 24,
            city: "Medellín, Colombia",
            bio: "Contenido exclusivo",
            profilePhoto: null,
            coverPhoto: null,
            subscriptionPrice: 8000,
            subscribers: 8352,
            whatsappNumber: "+57 300 1234567",
            breKey: "8248086081",
          };
          await db.insert(modelProfile).values(defaultProfile);
          return defaultProfile;
        }
        return result[0];
      } catch (error) {
        console.error("Error getting profile:", error);
        throw error;
      }
    }),

    updateProfile: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        age: z.number().optional(),
        city: z.string().optional(),
        bio: z.string().optional(),
        profilePhoto: z.string().nullable().optional(),
        coverPhoto: z.string().nullable().optional(),
        subscriptionPrice: z.number().optional(),
        whatsappNumber: z.string().optional(),
        breKey: z.string().optional(),
        isLive: z.boolean().optional(),
        lastLiveTime: z.string().nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) throw new Error("Database not available");

          const updates: any = { ...input };

          // Si viene una imagen nueva (en base64), la subimos a Cloudinary
          if (input.profilePhoto && input.profilePhoto.startsWith("data:image")) {
            const uploaded = await storagePut(input.profilePhoto, "profiles");
            updates.profilePhoto = uploaded.url;
          }
          if (input.coverPhoto && input.coverPhoto.startsWith("data:image")) {
            const uploaded = await storagePut(input.coverPhoto, "covers");
            updates.coverPhoto = uploaded.url;
          }

          const profiles = await db.select().from(modelProfile).limit(1);
          if (profiles.length === 0) throw new Error("Profile not found");

          await db.update(modelProfile).set(updates).where(eq(modelProfile.id, profiles[0].id));
          return { success: true };
        } catch (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      }),

    updateSubscribers: publicProcedure
      .input(z.object({ count: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const profiles = await db.select().from(modelProfile).limit(1);
        if (profiles.length > 0) {
          await db.update(modelProfile).set({ subscribers: input.count }).where(eq(modelProfile.id, profiles[0].id));
        }
        return { success: true };
      }),
  }),

  gallery: router({
    getGallery: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(galleryItems);
    }),

    addItem: publicProcedure
      .input(z.object({
        id: z.string(),
        uri: z.string(),
        type: z.enum(["photo", "video"]),
        isPrivate: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let finalUri = input.uri;
        // Si es una imagen nueva, subir a Cloudinary
        if (input.uri.startsWith("data:image") || input.uri.startsWith("data:video")) {
          const uploaded = await storagePut(input.uri, "gallery");
          finalUri = uploaded.url;
        }

        await db.insert(galleryItems).values({
          id: input.id,
          uri: finalUri,
          type: input.type,
          isPrivate: input.isPrivate ?? true,
        });
        return { success: true };
      }),

    deleteItem: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(galleryItems).where(eq(galleryItems.id, input.id));
        return { success: true };
      }),
  }),

  subscription: router({
    checkSubscription: publicProcedure
      .input(z.object({ deviceId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return false;
        const result = await db.select().from(subscribers).where(eq(subscribers.deviceId, input.deviceId)).limit(1);
        return result.length > 0 ? result[0].isSubscribed : false;
      }),

    subscribe: publicProcedure
      .input(z.object({ deviceId: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(subscribers).values({
          deviceId: input.deviceId,
          isSubscribed: true,
          subscriptionDate: new Date(),
        }).onDuplicateKeyUpdate({ set: { isSubscribed: true } });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
