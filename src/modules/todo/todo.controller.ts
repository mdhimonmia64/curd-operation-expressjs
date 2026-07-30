import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async(req:Request,res:Response) => {
    // const {user_id,title} = req.body;
    try{
        const result = await todoServices.createTodo(req.body);
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
};

const getTodo = async(req:Request,res:Response) => {
    try{
        const result = await todoServices.getTodo();
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
};

const getSingleTodo = async(req:Request,res:Response) => {
    try{
        const result = await todoServices.getSingleTodo(req.params.id as string);
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
};

const updatedTodo = async(req:Request,res:Response) => {
    const {title,completed} = req.body;
    try{
        const result = await todoServices.updatedTodo(title,completed,req.params.id as string);
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
};

const deletedTodo = async(req:Request,res:Response) => {
    try{
        const result = await todoServices.deletedTodo(req.params.id as string);
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
}


export const todoControllers = {
    createTodo,
    getTodo,
    getSingleTodo,
    updatedTodo,
    deletedTodo
}