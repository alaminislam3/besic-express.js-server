import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await todoService.createTodo(user_id, title);
    res.status(201).json({
      success: true,
      message: "TOdo created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTodo = async (req: Request, res: Response) => {
  try {
    const result =await todoService.getTodo(req.params.id as string)
    res.status(200).json({
      success: true,
      message: " todos data is here",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}

const getSingleTodo =  async (req: Request, res: Response) => {
  try {
    const result = await todoService.getSingleTodo(req.params.id as string)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos data not found",
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
}

const updateTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result =await todoService.updateTodo(user_id , title, req.params.id as string )
    // console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos data update successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteTodo = async (req: Request, res: Response) => {
    
    try {
    const result = await todoService.deleteTodo(req.params.id as string)

    // console.log(result.rows);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos data deleted successfully",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const todoController = {
  createTodo, getTodo, getSingleTodo, updateTodo , deleteTodo
};
