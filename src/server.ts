import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { emit } from "process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const app = express();
const port = 5000;
app.use(express.json());

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,           /* Here the thing happen */
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();

// logger middleware 
const logger = (req: Request, res: Response, next : NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next()
}



app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1,$2) RETURNING*`,
      [name, email]
    );

    res.status(201).json({
      success: true,
      message: "data inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Data inserted failed , err.message",
    });
  }
  res.status(201).json({
    success: true,
    message: "Api is working",
  });
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
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
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id= $1`, [
      req.params.id,
    ]);

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
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
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
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id= $1`, [
      req.params.id,
    ]);

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
});

// TODO CRUD
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = pool.query(
      `INSERT INTO todos (user_id,title) VALUES ($1,$2) RETURNING *`,
      [user_id, title]
    );
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  res.status(201).json({
    success: true,
    message: "data posting successfully",
  });
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
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
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id= $1`, [
      req.params.id,
    ]);

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
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
      [user_id, title, req.params.id]
    );
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
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id= $1`, [
      req.params.id,
    ]);

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
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

/* Summary : Here todos table is refference table for User . Its means User is mother and todos is child. We can delete child(todos) and there will be not impect on mother (Users). But if we delete mother(Users) child will be deleted. Other things is WE can create a lot child by reffering a single mother's id. Everyhting will be idetified by id   */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
