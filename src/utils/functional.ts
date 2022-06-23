export function attempt(action?: () => void, catchError: ((e: any) => void) = ((e) => console.error(e))) {
    try {
        action?.();
        return true;
    } catch (error) {
        catchError(error);
        return false;
    }
}