export function and(first: boolean, ...rest: boolean[]) {
    if (!first) return false;
    for (const bool of rest) if (!bool) return false;
    return true;
}

export function or(first: boolean, ...rest: boolean[]) {
    if (first) return true;
    for (const bool of rest) if (bool) return true;
    return false;
}
