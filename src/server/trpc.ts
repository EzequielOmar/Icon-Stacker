import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./_context";
import { prisma } from "./db/_client";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
export const mergeRouters = t.mergeRouters;

const closePrismaConnection = async () => {
  if (prisma !== null) {
    await prisma.$disconnect();
    console.error("Prisma connection closed");
  }
};

process.on("exit", async (code) => {
  await closePrismaConnection();
  console.error(`Process exited with code ${code}`);
});

process.on("SIGINT", async () => {
  await closePrismaConnection();
  console.error("Received SIGINT. Exiting...");
  process.exit();
});

process.on("SIGTERM", async () => {
  await closePrismaConnection();
  console.error("Received SIGTERM. Exiting...");
  process.exit();
});