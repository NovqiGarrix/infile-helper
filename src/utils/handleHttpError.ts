import { OakResponse, isHttpError, Status } from '@deps';

// deno-lint-ignore no-explicit-any
export default function handleHttpError(response: OakResponse, error: any) {

    if (isHttpError(error)) {
        const { message, status } = error;

        response.status = status;
        response.body = { message };

        return;
    }

    response.status = Status.InternalServerError;
    response.body = {
        message: 'Internal Server Error'
    }

}