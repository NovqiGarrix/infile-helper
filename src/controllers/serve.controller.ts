import { Status, getQuery } from "@deps";
import { OakContext } from "@types";
import handleHttpError from "@utils/handleHttpError.ts";

export async function serveFileHandler(ctx: OakContext<"/">) {

    const { url } = getQuery(ctx);

    ctx.assert(url && typeof url === "string", Status.BadRequest, "Missing required query parameter 'url'");

    try {

        const resp = await fetch(url);
        const contentType = resp.headers.get('content-type')!;

        ctx.response.status = resp.status;

        ctx.response.headers.set('content-type', contentType);
        ctx.response.headers.set('content-length', resp.headers.get('content-length')!);

        ctx.response.body = resp.body;
    } catch (error) {
        return handleHttpError(ctx.response, error);
    }

}