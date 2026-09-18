import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { clearSession, getConfig, getDataset, getDefaults, getNotes, getPipeline, getState, getStatus, loadDataset, predictEmployee, runDescriptive, trainModels } from "./analytics";

const modelName = z.enum(["Random Forest", "Decision Tree", "Logistic Regression"]);

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
  analytics: router({
    state: publicProcedure.query(() => getState()),
    config: publicProcedure.query(() => getConfig()),
    defaults: publicProcedure.query(() => getDefaults()),
    notes: publicProcedure.query(() => getNotes()),
    status: publicProcedure.query(() => ({ status: getStatus(), dataset: getDataset(), pipeline: getPipeline() })),
    upload: publicProcedure.input(z.object({ fileName: z.string(), base64: z.string() })).mutation(({ input }) => loadDataset(input.fileName, input.base64)),
    reset: publicProcedure.mutation(() => clearSession()),
    train: publicProcedure.input(z.object({ target: z.enum(["burnout", "worklife"]), experiment: z.enum(["baseline", "experiment1", "experiment2", "cross_validation"]), augmentation: z.enum(["none", "smote", "bootstrap"]), models: z.array(modelName) })).mutation(({ input }) => trainModels(input)),
    predict: publicProcedure.input(z.object({ model: modelName, values: z.record(z.string(), z.union([z.string(), z.number()])) })).mutation(({ input }) => predictEmployee({ model: input.model, values: input.values })),
    descriptive: publicProcedure.input(z.object({ support: z.number().min(0.01).max(1), confidence: z.number().min(0.01).max(1) })).mutation(({ input }) => runDescriptive(input)),
  }),
});

export type AppRouter = typeof appRouter;
