
export default function isUrl(url: string) {
    try {
        return !!new URL(url);
    } catch (_error) {
        return false;
    }
}