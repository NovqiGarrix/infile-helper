import "@dotenv";

import createServer from "@app";
import logger from "@utils/logger.ts";

const abortController = new AbortController();

const PORT = +(Deno.env.get("PORT") || 4001);

const app = createServer();

const signals = ["SIGINT", "SIGTERM"];
for (let systemSignal of signals) {
    if (Deno.build.os === "windows" && systemSignal === "SIGTERM") {
        systemSignal = "SIGBREAK";
    }

    Deno.addSignalListener(systemSignal as Deno.Signal, () => {
        logger.warning(`Received ${systemSignal}, exiting...`.toUpperCase());
        Deno.exit(0);
    });
}

globalThis.addEventListener("unload", () => {
    abortController.abort();
});

app.addEventListener("listen", ({ hostname, port, serverType }) => {
    logger.info(
        `Listening on ${hostname}:${port} with ${serverType} SERVER`
            .toUpperCase(),
    );
});

await app.listen({ port: PORT, signal: abortController.signal });
