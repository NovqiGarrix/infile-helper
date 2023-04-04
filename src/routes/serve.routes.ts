import { Router } from '@deps';
import { serveFileHandler, serveGDriveFileHandler } from '@controllers/serve.controller.ts';

const router = new Router();

router.get("/", serveFileHandler);
router.get("/gdrive", serveGDriveFileHandler);

export default router.routes();