import { Status, getQuery } from "@deps";
import { OakContext } from "@types";

import isUrl from "@utils/isUrl.ts";
import handleHttpError from "@utils/handleHttpError.ts";

export async function serveFileHandler(ctx: OakContext<"/">) {

    const { url } = getQuery(ctx);

    ctx.assert(url && typeof url === "string", Status.BadRequest, "Missing required query parameter 'url'");
    ctx.assert(isUrl(url), Status.BadRequest, "Invalid URL");

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

export async function serveGDriveFileHandler(ctx: OakContext<"/gdrive">) {

    const { url } = getQuery(ctx);

    ctx.assert(url && typeof url === "string", Status.BadRequest, "Missing required query parameter 'url'");
    ctx.assert(isUrl(url), Status.BadRequest, "Invalid URL");

    const urlInURL = new URL(url);
    const accessToken = urlInURL.searchParams.get('qat');
    ctx.assert(accessToken, Status.BadRequest, "Invalid URL");

    urlInURL.searchParams.delete('qat');

    try {

        const resp = await fetch(urlInURL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        if (!resp.ok) {
            ctx.response.status = Status.BadRequest;
            ctx.response.body = {
                code: Status.BadRequest,
                status: 'Bad Request',
                errors: [{ error: 'Something went wrong.' }]
            }
            return;
        }

        ctx.response.status = resp.status;

        const contentType = resp.headers.get('content-type')!;
        const contentLength = resp.headers.get('content-length');

        ctx.response.headers.set('Content-Type', contentType);

        if (contentLength) {
            ctx.response.headers.set('Content-Length', contentLength);
        }

        ctx.response.body = resp.body;
    } catch (error) {
        return handleHttpError(ctx.response, error);
    }

}