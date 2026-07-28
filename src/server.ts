import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';



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

app.use("/users",userRoutes)

// todos crud
app.use('/todos',todoRoutes);


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