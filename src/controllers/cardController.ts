import { Response, Request } from "express";
import { blockCardService, creatCardCard, unlockCardService } from "../services/cardService";


export async function creatCard(req: Request, res: Response) {

    const apikey =res.locals.apiKey;
    const {type, employeeId} = req.body;

    await creatCardCard(apikey, type, employeeId);

    res.sendStatus(201);

}

export async function ativateCard(req: Request, res: Response) {
    
}

export async function unlockCard(req: Request, res: Response) {
    const { password } = req.body;
    
    const cardId = Number(req.params.id);
   
    await unlockCardService(cardId, password);

    return res.status(200).send("Cartão desbloqueado");
}

export async function blockCard(req: Request, res: Response) {
    const { password } = req.body;
    
    const cardId = Number(req.params.id);
   
    await blockCardService(cardId, password);

    return res.status(200).send("Cartão bloqueado");
}