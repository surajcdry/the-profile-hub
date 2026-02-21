import { nanoid } from "nanoid";

/**
 * Generates a short, URL-friendly list code.
 * @param length - Number of characters (default: 8)
 */
export function generateListCode(length = 8): string {
    return nanoid(length);
}
