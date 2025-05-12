import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";


export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // request --> headers --> auth token 
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return
    }

    const tokenstring = token.split(" ")[1];
    try {
        const decoded = jwt.verify(tokenstring, process.env.JWT_SECRET as string) as { id: string };
        // get id --> user --> attach user to the request 
        const userId = decoded.id;
        console.log("Passed through auth middlware");
        const foundUser = await User.findById(userId).exec();
        if (!foundUser) {
            res.status(401).send({ message: "Unauthorized" })
            return;
        }
        // req.user = foundUser;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });

    }

} 