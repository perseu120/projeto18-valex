import { Router } from "express";
import { creatCard, ativateCard, unlockCard, blockCard, recharge } from "../controllers/cardController";
import validateApiKey from "../middlewares/validateApiKey";

const cardRouter = Router();

cardRouter.post('/card', validateApiKey, creatCard);
cardRouter.post('/activate', ativateCard);
cardRouter.get('/transactions', );
cardRouter.put('/blockade/:id', blockCard);
cardRouter.put('/unlock/:id', unlockCard);
cardRouter.post('/recharge/:id',validateApiKey, recharge);

export default cardRouter;