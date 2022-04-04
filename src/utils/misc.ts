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

interface IResult<T> {
    action: IAction<T>;
    isError: boolean;
    value?: T;
    error?: any;
}
type IAction<T> = (result: IResult<any> | null) => T;

function tryall(...actions: IAction<any>[]) {
    const results:IResult<any>[] = [];
    let prevResult: IResult<any> | null = null;

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