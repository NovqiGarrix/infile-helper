import { Router } from '@deps';
import { serveFileHandler } from '@controllers/serve.controller.ts';

const router = new Router();

router.get("/", serveFileHandler);

export default router.routes();