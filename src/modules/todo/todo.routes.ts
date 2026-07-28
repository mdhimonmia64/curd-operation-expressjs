import express from "express";
import { todoControllers } from "./todo.controller";

const route = express.Router();

// routes --> controller --> service
route.post("/",todoControllers.createTodo);

route.get("/",todoControllers.getTodo);

route.get("/:id",todoControllers.getSingleTodo);

route.put("/:id",todoControllers.updatedTodo);

route.delete("/:id",todoControllers.deletedTodo);

export const todoRoutes = route;