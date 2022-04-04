export function mod(
    obj: Record<string | number | symbol, any>,
    mods?: Record<string | number | symbol, any>,
    deletes?: Array<string | number>
) {
    const result = { ...obj };

    if (mods !== undefined) {
        for (const modField in mods) {
            const mod = mods[modField];

            if (typeof mod === "function") {
                result[modField] = mod(result[modField]);
            } else {
                result[modField] = mod;
            }
        }
    }

    if (deletes !== undefined) {
        for (const toDelete of deletes) {
            delete result[toDelete];
        }
    }

    return result;
}

function tryall(...actions) {
    const results = [];
    let prevResult = undefined;

    for (const action of actions) {
        try {
            const value = action(prevResult);
            prevResult = { action, isError: false, value };
        } catch (error) {
            console.error(error);
            prevResult = { action, isError: true, error };
        }

        results.push(prevResult);
    }
    return results;
}