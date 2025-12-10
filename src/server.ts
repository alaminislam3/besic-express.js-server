import express, { NextFunction, Request, Response } from "express";

import { emit } from "process";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./middleware/modules/user/user.routes";
import { todoRouter } from "./middleware/modules/todo/todo.routes";

const app = express();
const port = config.port;
app.use(express.json());


// initializing DB
initDB();


app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World!");
});

// USER CRUD
app.use("/users", userRouter)

// app.get("/users/:id", userRouter);

// app.put("/users/:id", );

// app.delete("/users/:id", );

// TODO CRUD
app.use("/todos", todoRouter);

// app.get("/todos", );

// app.get("/todos/:id",);

// app.put("/todos/:id", );

// app.delete("/todos/:id", );



/* Summary : Here todos table is refference table for User . Its means User is mother and todos is child. We can delete child(todos) and there will be not impect on mother (Users). But if we delete mother(Users) child will be deleted. Other things is WE can create a lot child by reffering a single mother's id. Everyhting will be idetified by id   */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
