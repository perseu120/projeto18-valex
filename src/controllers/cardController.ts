import { Response, Request } from "express";
import { creatCardCard } from "../services/cardService";


export async function creatCard(req: Request, res: Response) {

    const apikey =res.locals.apiKey;
    const {type, employeeId} = req.body;

    await creatCardCard(apikey, type, employeeId);

    res.sendStatus(201);

}

export async function ativateCard(req: Request, res: Response) {
    
}