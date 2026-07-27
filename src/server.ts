import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';


const app = express()
const port = config.port;
// parser
app.use(express.json());
app.use(express.urlencoded());


// initializing DB
initDB();


// Logger middleware
const logger = (req:Request,res:Response,next:NextFunction) => {
    console.log(`${req.method} ${req.path}\n`)
    next();
}

app.get('/',logger, (req:Request, res:Response) => {
  res.send('Hello, I am Learning Next level!')
});

app.post('/users',async (req:Request,res:Response) => {
    const {name,email} = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,[name,email]
        );
        res.status(201).json({
            success:true,
            message:"Data Inserted Successfully",
            data:result.rows[0]
        })
    }catch(err:any){
        res.status(500).json({success:false,message:err.message})
    }
});

app.get("/users",async (req:Request,res:Response) => {
    try{
        const result = await pool.query(
            `SELECT * FROM users`
        );
        res.status(200).json({
            success:true,
            message:"Users retrieved successfully",
            data:result.rows
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});

app.get("/users/:id", async(req:Request,res:Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[req.params.id]);
        if(result.rows.length === 0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            res.status(201).json({
                success:true,
                message:"User fetched successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

app.put("/users/:id", async(req:Request,res:Response) => {
    const {name,email} = req.body;
    try{
        const result = await pool.query(`UPDATE users SET name = $1,email = $2 WHERE id = $3 RETURNING *`,[name,email,req.params.id])
        if(result.rows.length === 0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            res.status(201).json({
                success:true,
                message:"User updated successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

app.delete("/users/:id", async(req:Request,res:Response) => {
    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`,[req.params.id])
        if(result.rowCount === 0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            res.status(201).json({
                success:true,
                message:"Delete users successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});

// todos crud
app.post('/todos',async(req:Request,res:Response) => {
    const {user_id,title} = req.body;
    try{
        const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,[user_id,title]);
        res.status(201).json({
            success:true,
            message:"todos data posted successfully",
            data:result.rows[0]
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});

app.get('/todos',async(req:Request,res:Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos`);
        res.status(200).json({
            success:true,
            message:"todos retrieved successfully",
            data:result.rows
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message,

        })
    }
});

app.get('/todos/:id',async(req:Request,res:Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos WHERE id = $1`,[req.params.id]);
        if(result.rows.length === 0){
            res.status(404).json({
                success:false,
                message:"todos not found"
            })
        }else{
            res.status(200).json({
                success:true,
                message:"todos fetched successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});

app.put('/todos/:id',async(req:Request,res:Response) => {
    const {title,completed} = req.body;
    try{
        const result = await pool.query(`UPDATE todos SET title = $1,completed = $2 WHERE id = $3 RETURNING *`,[title,completed,req.params.id]);
        if(result.rows.length === 0){
            res.status(404).json({
                success:false,
                message:"todos not updated"
            })
        }else{
            res.status(200).json({
                success:true,
                message:"todos updated successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
});

app.delete('/todos/:id',async(req:Request,res:Response) => {
    try{
        const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING *`,[req.params.id]);
        if(result.rowCount === 0){
            res.status(404).json({
                success:false,
                message:"todos not found"
            })
        }else{
            res.status(200).json({
                success:true,
                message:"todos deleted successfully",
                data:result.rows[0]
            })
        }
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

app.use((req:Request,res:Response) => {
    res.status(404).json({
        success:false,
        message:"Route not found",
        path:req.path
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})