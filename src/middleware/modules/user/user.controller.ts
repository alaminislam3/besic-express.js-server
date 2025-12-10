import { Request, Response } from "express";
import { pool } from "../../../config/db";
import { userService } from "./user.service";
import { Result } from "pg";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "data inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Data inserted failed"
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();
    res.status(200).json({
      success: true,
      message: " user data is here",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user fatched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userService.updateUser(
      name,
      email,
      req.params.id as string
    );
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user data update successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();

    // console.log(result.rows);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
