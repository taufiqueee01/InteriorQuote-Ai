import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard router
  dashboard: router({
    getStats: protectedProcedure.query(({ ctx }) =>
      db.getDashboardStats(ctx.user.id)
    ),
  }),

  // Clients router
  clients: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getClientsByUserId(ctx.user.id)
    ),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getClientById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        projectAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createClient({
          userId: ctx.user.id,
          ...input,
        })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        projectAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.updateClient(input.id, {
          name: input.name,
          phone: input.phone,
          email: input.email,
          projectAddress: input.projectAddress,
          notes: input.notes,
        })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteClient(input.id)),
  }),

  // Quotations router
  quotations: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getQuotationsByUserId(ctx.user.id)
    ),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getQuotationById(input.id)),
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        projectType: z.string(),
        area: z.number().optional(),
        budget: z.number().optional(),
        estimatedTimeline: z.string().optional(),
        selectedServices: z.array(z.string()).default([]),
        subtotal: z.number().default(0),
        gstAmount: z.number().default(0),
        finalTotal: z.number().default(0),
      }))
      .mutation(({ ctx, input }) =>
        db.createQuotation({
          userId: ctx.user.id,
          clientId: input.clientId,
          projectType: input.projectType,
          area: input.area?.toString(),
          budget: input.budget?.toString(),
          estimatedTimeline: input.estimatedTimeline,
          selectedServices: input.selectedServices,
          subtotal: input.subtotal?.toString(),
          gstAmount: input.gstAmount?.toString(),
          finalTotal: input.finalTotal?.toString(),
        })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clientId: z.number().optional(),
        projectType: z.string().optional(),
        area: z.number().optional(),
        budget: z.number().optional(),
        estimatedTimeline: z.string().optional(),
        selectedServices: z.array(z.string()).optional(),
        subtotal: z.number().optional(),
        gstAmount: z.number().optional(),
        finalTotal: z.number().optional(),
      }))
      .mutation(({ input }) =>
        db.updateQuotation(input.id, {
          clientId: input.clientId,
          projectType: input.projectType,
          area: input.area?.toString(),
          budget: input.budget?.toString(),
          estimatedTimeline: input.estimatedTimeline,
          selectedServices: input.selectedServices,
          subtotal: input.subtotal?.toString(),
          gstAmount: input.gstAmount?.toString(),
          finalTotal: input.finalTotal?.toString(),
        })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteQuotationItemsByQuotationId(input.id);
        await db.deleteQuotation(input.id);
      }),
    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.duplicateQuotation(input.id)),
  }),

  // Quotation Items router
  quotationItems: router({
    getByQuotationId: protectedProcedure
      .input(z.object({ quotationId: z.number() }))
      .query(({ input }) => db.getQuotationItemsByQuotationId(input.quotationId)),
    create: protectedProcedure
      .input(z.object({
        quotationId: z.number(),
        itemName: z.string(),
        quantity: z.number(),
        rate: z.number(),
        gstPercentage: z.number().default(0),
        discount: z.number().default(0),
      }))
      .mutation(({ input }) =>
        db.createQuotationItem({
          quotationId: input.quotationId,
          itemName: input.itemName,
          quantity: input.quantity.toString(),
          rate: input.rate.toString(),
          gstPercentage: input.gstPercentage.toString(),
          discount: input.discount.toString(),
        })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        itemName: z.string().optional(),
        quantity: z.number().optional(),
        rate: z.number().optional(),
        gstPercentage: z.number().optional(),
        discount: z.number().optional(),
      }))
      .mutation(({ input }) =>
        db.updateQuotationItem(input.id, {
          itemName: input.itemName,
          quantity: input.quantity?.toString(),
          rate: input.rate?.toString(),
          gstPercentage: input.gstPercentage?.toString(),
          discount: input.discount?.toString(),
        })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteQuotationItem(input.id)),
  }),

  // Proposals router
  proposals: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getProposalsByUserId(ctx.user.id)
    ),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProposalById(input.id)),
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        quotationId: z.number().optional(),
        projectType: z.string(),
        area: z.number().optional(),
        budget: z.number().optional(),
        estimatedTimeline: z.string().optional(),
        selectedServices: z.array(z.string()).default([]),
        pricingSummary: z.object({
          subtotal: z.number(),
          gst: z.number(),
          total: z.number(),
        }).optional(),
        termsAndConditions: z.string().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createProposal({
          userId: ctx.user.id,
          clientId: input.clientId,
          quotationId: input.quotationId,
          projectType: input.projectType,
          area: input.area?.toString(),
          budget: input.budget?.toString(),
          estimatedTimeline: input.estimatedTimeline,
          selectedServices: input.selectedServices,
          pricingSummary: input.pricingSummary,
          termsAndConditions: input.termsAndConditions,
        })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clientId: z.number().optional(),
        quotationId: z.number().optional(),
        projectType: z.string().optional(),
        area: z.number().optional(),
        budget: z.number().optional(),
        estimatedTimeline: z.string().optional(),
        selectedServices: z.array(z.string()).optional(),
        pricingSummary: z.object({
          subtotal: z.number(),
          gst: z.number(),
          total: z.number(),
        }).optional(),
        termsAndConditions: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.updateProposal(input.id, {
          clientId: input.clientId,
          quotationId: input.quotationId,
          projectType: input.projectType,
          area: input.area?.toString(),
          budget: input.budget?.toString(),
          estimatedTimeline: input.estimatedTimeline,
          selectedServices: input.selectedServices,
          pricingSummary: input.pricingSummary,
          termsAndConditions: input.termsAndConditions,
        })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteProposal(input.id)),
    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.duplicateProposal(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
