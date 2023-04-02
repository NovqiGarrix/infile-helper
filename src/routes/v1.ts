import { Router } from "@deps";
import serveRoutes from "./serve.routes.ts";

const router = new Router();

router.use("/v1/serve", serveRoutes);

export default router.routes();
