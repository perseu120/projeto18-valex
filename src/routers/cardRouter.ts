import { Router } from "express";
import { creatCard, ativateCard, unlockCard } from "../controllers/cardController";
import validateApiKey from "../middlewares/validateApiKey";

const cardRouter = Router();

cardRouter.post('/card', validateApiKey, creatCard);
cardRouter.post('/activate', ativateCard);
cardRouter.get('/transactions', );
cardRouter.put('/blockade');
cardRouter.put('/unlock/:id', unlockCard);

export default cardRouter;