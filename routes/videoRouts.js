import express from 'express';
import { uploadVideo, transformVideo, handleWebhook, getHistory } from '../controllers/videoController.js';

const router = express.Router();

router.post('/upload', uploadVideo);
router.post('/transform', transformVideo);
router.post('/webhook', handleWebhook);
router.get('/history', getHistory);

export default router;