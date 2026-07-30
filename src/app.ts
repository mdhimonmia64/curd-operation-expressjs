import express, { Request, Response } from 'express';
import config from './config';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';
import { authRoutes } from './modules/auth/auth.routes';
import logger from './middleware/logger';



const app = express()

// parser
app.use(express.json());
app.use(express.urlencoded());


// initializing DB
initDB();

app.get('/',logger, (req:Request, res:Response) => {
  res.send('Hello, I am Learning Next level!')
});

app.use("/users",userRoutes)

// todos crud
app.use('/todos',todoRoutes);

// auth routes
app.use("/auth",authRoutes);

app.use((req:Request,res:Response) => {
    res.status(404).json({
        success:false,
        message:"Route not found",
        path:req.path
    })
})

export default app;