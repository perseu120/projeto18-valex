import { Response, Request } from "express";
import { activateCardService, blockCardService, creatCardCard, rechargeService, unlockCardService } from "../services/cardService";


export async function creatCard(req: Request, res: Response) {

    const apikey =res.locals.apiKey;
    const {type, employeeId} = req.body;

    await creatCardCard(apikey, type, employeeId);

    return res.sendStatus(201);

}

export async function ativateCard(req: Request, res: Response) {
    const { id, cvc, password } = req.body;

    activateCardService(id, cvc, password);

    return res.sendStatus(200);
    
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

export async function recharge(req: Request, res: Response) {
    const apikey =res.locals.apiKey;
    const { amount } = req.body;
    const cardId = Number(req.params.id);

    rechargeService(cardId, amount, apikey);

    res.sendStatus(200);
    
}