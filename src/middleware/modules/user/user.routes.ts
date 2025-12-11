import express, { Request, Response } from "express"
import { userController } from "./user.controller";
import auth from "../../auth";
import logger from "../../logger";
const router = express.Router()

router.post("/",userController.createUser)

router.get("/",logger,auth("admin"), userController.getUser)

router.get("/:id", userController.getSingleUser)

router.put("/:id", userController.updateUser)

router.delete("/:id" , userController.deleteUser)

export const userRouter = router