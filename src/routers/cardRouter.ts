import { Router } from "express";
import { creatCard, ativateCard } from "../controllers/cardController";
import validateApiKey from "../middlewares/validateApiKey";
import { verifyApiKey } from "../services/cardService";

const cardRouter = Router();

cardRouter.post('/card', validateApiKey, creatCard);
cardRouter.post('activate', ativateCard);
cardRouter.get('transactions', );
cardRouter.put('blockade');
cardRouter.put('unlock');

export default cardRouter;