import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { modelProfile, galleryItems, subscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Model Profile Router
  model: router({
    // Obtener perfil de la modelo
    getProfile: publicProcedure.query(async () => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const result = await db.select().from(modelProfile).limit(1);
        const profile = result.length > 0 ? result[0] : null;

        if (!profile) {
          // Crear perfil por defecto si no existe
          const defaultProfile = {
            name: "Modelo",
            age: 24,
            city: "Medellín, Colombia",
            bio: "Contenido exclusivo y personalizado",
            profilePhoto: null,
            coverPhoto: null,
            subscriptionPrice: 8000,
            subscribers: 8352,
            whatsappNumber: "+57 300 1234567",
            breKey: "8248086081",
            isLive: false,
            lastLiveTime: null,
          };
          await db.insert(modelProfile).values(defaultProfile);
          return defaultProfile;
        }

        return profile;
      } catch (error) {
        console.error("Error getting profile:", error);
        throw error;
      }
    }),

    // Actualizar perfil
    updateProfile: publicProcedure
      .input(
        z.object({
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
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          const profiles = await db.select().from(modelProfile).limit(1);
          if (profiles.length === 0) {
            throw new Error("Profile not found");
          }

          const profile = profiles[0];
          await db
            .update(modelProfile)
            .set(input)
            .where(eq(modelProfile.id, profile.id));

          return { success: true };
        } catch (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
      }),

    // Incrementar contador de suscriptores
    incrementSubscribers: publicProcedure.mutation(async () => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const profiles = await db.select().from(modelProfile).limit(1);
        if (profiles.length === 0) {
          throw new Error("Profile not found");
        }

        const profile = profiles[0];
        await db
          .update(modelProfile)
          .set({ subscribers: profile.subscribers + 1 })
          .where(eq(modelProfile.id, profile.id));

        return { success: true };
      } catch (error) {
        console.error("Error incrementing subscribers:", error);
        throw error;
      }
    }),

    // Actualizar contador de suscriptores manualmente
    updateSubscribers: publicProcedure
      .input(z.object({ count: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          const profiles = await db.select().from(modelProfile).limit(1);
          if (profiles.length === 0) {
            throw new Error("Profile not found");
          }

          const profile = profiles[0];
          await db
            .update(modelProfile)
            .set({ subscribers: input.count })
            .where(eq(modelProfile.id, profile.id));

          return { success: true };
        } catch (error) {
          console.error("Error updating subscribers:", error);
          throw error;
        }
      }),
  }),

  // Gallery Router
  gallery: router({
    // Obtener galería
    getGallery: publicProcedure.query(async () => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const items = await db.select().from(galleryItems);
        return items;
      } catch (error) {
        console.error("Error getting gallery:", error);
        throw error;
      }
    }),

    // Agregar item a galería
    addItem: publicProcedure
      .input(
        z.object({
          id: z.string(),
          uri: z.string(),
          type: z.enum(["photo", "video"]),
          isPrivate: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          await db.insert(galleryItems).values({
            id: input.id,
            uri: input.uri,
            type: input.type,
            isPrivate: input.isPrivate ?? true,
          });

          return { success: true };
        } catch (error) {
          console.error("Error adding gallery item:", error);
          throw error;
        }
      }),

    // Actualizar item de galería
    updateItem: publicProcedure
      .input(
        z.object({
          id: z.string(),
          isPrivate: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          await db
            .update(galleryItems)
            .set({ isPrivate: input.isPrivate })
            .where(eq(galleryItems.id, input.id));

          return { success: true };
        } catch (error) {
          console.error("Error updating gallery item:", error);
          throw error;
        }
      }),

    // Eliminar item de galería
    deleteItem: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          await db
            .delete(galleryItems)
            .where(eq(galleryItems.id, input.id));

          return { success: true };
        } catch (error) {
          console.error("Error deleting gallery item:", error);
          throw error;
        }
      }),
  }),

  // Subscribers Router
  subscription: router({
    // Verificar si dispositivo está suscrito
    checkSubscription: publicProcedure
      .input(z.object({ deviceId: z.string() }))
      .query(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          const result = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.deviceId, input.deviceId))
            .limit(1);

          return result.length > 0 ? result[0].isSubscribed : false;
        } catch (error) {
          console.error("Error checking subscription:", error);
          return false;
        }
      }),

    // Marcar dispositivo como suscrito
    subscribe: publicProcedure
      .input(z.object({ deviceId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new Error("Database not available");
          }

          const existing = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.deviceId, input.deviceId))
            .limit(1);

          if (existing.length > 0) {
            // Actualizar suscripción existente
            await db
              .update(subscribers)
              .set({ isSubscribed: true, subscriptionDate: new Date() })
              .where(eq(subscribers.deviceId, input.deviceId));
          } else {
            // Crear nueva suscripción
            await db.insert(subscribers).values({
              deviceId: input.deviceId,
              isSubscribed: true,
              subscriptionDate: new Date(),
            });
          }

          // Incrementar contador de suscriptores
          const profiles = await db.select().from(modelProfile).limit(1);
          if (profiles.length > 0) {
            const profile = profiles[0];
            await db
              .update(modelProfile)
              .set({ subscribers: profile.subscribers + 1 })
              .where(eq(modelProfile.id, profile.id));
          }

          return { success: true };
        } catch (error) {
          console.error("Error subscribing:", error);
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
