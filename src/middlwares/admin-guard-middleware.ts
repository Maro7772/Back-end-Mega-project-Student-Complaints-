import{Request, Response , NextFunction} from "express";


export const adminGuardMiddleware = async(
    req: Request , 
    res:Response,
    next:NextFunction
)=>{
 const currentUser = req.user;

 if(currentUser.role != "admin"){
    res.status(403).send({message:"Forbidden to access"})
 }
    
    next();
}
    
