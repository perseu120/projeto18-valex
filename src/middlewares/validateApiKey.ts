import { Response, Request, NextFunction } from "express";

export default async function validateApiKey(req: Request, res: Response, next: NextFunction){

    const apikey = String(req.header('x-api-key'));
    
    if(!apikey){
        return res.sendStatus(401);
    }
    
    res.locals.apiKey = apikey;

    next();
}