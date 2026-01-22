import express from 'express';
import { getExchanges } from '../controllers/exchangeController.js';

const router = express.Router();

router.get('/', getExchanges);

export default router;
