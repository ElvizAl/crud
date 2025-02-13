import { z } from "zod"
import { publicProcedure, router } from "@/server/trpc"
import { TRPCError} from "@trpc/server"

export const todoRouter = router({
    getTodos: publicProcedure.query(async ({ctx}) => {
        const todos = await ctx.db.todo.findMany()
        if(!todos) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Todos not found"})
        }
        return todos
    }),
    addTodo: publicProcedure
        .input(z.object({title: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const todo = await ctx.db.todo.create({
                data: {
                    title: input.title
            },
        });
        if(!todo) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed add todo"})
        }
        return todo
    }),
    toggleTodo: publicProcedure
        .input(z.object({id: z.number(), completed: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
            const todo = await ctx.db.todo.update({
                where: {id: input.id},
                data: {completed: input.completed},
            });
            if(!todo) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed add toogle todo"})
            }
            return todo
    }),
    deleteTodo: publicProcedure
        .input(z.object({id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const todo = await ctx.db.todo.delete({
                where: {id: input.id}
            });
            if(!todo) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed delete todo"})
            }
            return todo
    }),
    editTodo: publicProcedure
    .input(z.object({id: z.number(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
        const todo = await ctx.db.todo.update({
            where: {id: input.id},
            data: {title: input.title},
        });
        if(!todo) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed edit todo"})
        }
        return todo
    }),
});