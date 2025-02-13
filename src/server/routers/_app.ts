import { createHydrationHelpers } from "@trpc/react-query/rsc"
import { cache } from "react"
import { createCallerFactory, createTRPCContext, router } from "../trpc"
import { makeQueryClient } from "@/app/_trpc/query-client"
import { todoRouter } from "@/server/routers/todo";

export const appRouter = router({
    todo: todoRouter
});

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const {trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
    caller,
    getQueryClient
)

export type AppRouter = typeof appRouter
