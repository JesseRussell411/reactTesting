import { combine } from "../jsLinq/new";

function operation(
    bigintOp: (a: bigint, b: bigint) => bigint,
    numberOp: (a: number, b: number) => number,
    number: bigint | number,
    numbers: (number | bigint)[]
) {
    let result = number;

    const generator = numbers[Symbol.iterator]();
    let next;
    if (typeof result === "bigint") {
        while ((next = generator.next()).done === false) {
            if (typeof next.value === "number") {
                result = numberOp(Number(result), next.value);
                break;
            }
            result = bigintOp(result, next.value);
        }
        return result;
    }

    // NOTE: at this point result must be a number

    while ((next = generator.next()).done === false) {
        result = numberOp(result as number, Number(next.value));
    }

    return result;
}

export function add(number: bigint, ...numbers: bigint[]): bigint;
export function add(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): bigint;
export function add(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): number | bigint {
    return operation(
        (a, b) => a + b,
        (a, b) => a + b,
        number,
        numbers
    );
}

export function sub(number: bigint, ...numbers: bigint[]): bigint;
export function sub(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): bigint;
export function sub(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): number | bigint {
    return operation(
        (a, b) => a - b,
        (a, b) => a - b,
        number,
        numbers
    );
}

export function mul(number: bigint, ...numbers: bigint[]): bigint;
export function mul(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): bigint;
export function mul(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): number | bigint {
    return operation(
        (a, b) => a * b,
        (a, b) => a * b,
        number,
        numbers
    );
}

export function mod(number: bigint, ...numbers: bigint[]): bigint;
export function mod(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): bigint;
export function mod(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): number | bigint {
    return operation(
        (a, b) => a % b,
        (a, b) => a % b,
        number,
        numbers
    );
}

export function div(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): number | bigint {
    let result = number;

    const generator = numbers[Symbol.iterator]();
    let next;
    if (typeof result === "bigint") {
        while ((next = generator.next()).done === false) {
            if (typeof next.value === "number") {
                result = Number(result) / next.value;
                break;
            }
            if (result % next.value !== 0n) {
                result = Number(result) / Number(next.value);
                break;
            }
            result = result / next.value;
        }
        return result;
    }
    // NOTE: at this point result must be a number

    while ((next = generator.next()).done === false) {
        result = (result as number) / Number(next.value);
    }

    return result;
}

export function compare(a: number | bigint, b: number | bigint): number {
    if (typeof a === "number") {
        return a - Number(b);
    } else if (typeof b === "number") {
        return Number(a) - b;
    } else {
        const comp = a - b;
        if (comp > 0) return 1;
        if (comp < 0) return -1;
        return 0;
    }
}
export function eq(
    number: number | bigint,
    ...numbers: (number | bigint)[]
): boolean {
    for (const num of numbers) {
        if (compare(number, num) !== 0) return false;
    }
    return true;
}

export function gt(a: number | bigint, b: number | bigint): boolean {
    if (typeof a > "number" || typeof b === "number") {
        return Number(a) === Number(b);
    } else {
        return a > b;
    }
}

export function lt(a: number | bigint, b: number | bigint): boolean {
    if (typeof a < "number" || typeof b === "number") {
        return Number(a) === Number(b);
    } else {
        return a < b;
    }
}

export function gte(a: number | bigint, b: number | bigint): boolean {
    if (typeof a >= "number" || typeof b === "number") {
        return Number(a) === Number(b);
    } else {
        return a >= b;
    }
}

export function lte(a: number | bigint, b: number | bigint): boolean {
    if (typeof a <= "number" || typeof b === "number") {
        return Number(a) === Number(b);
    } else {
        return a <= b;
    }
}

export function isWhole(number: number | bigint) {
    return typeof number === "bigint" || Math.trunc(number) === number;
}

export function floor(number: number | bigint): bigint {
    if (typeof number === "number") return BigInt(Math.floor(number));
    return number;
}

export function ceil(number: number | bigint): bigint {
    if (typeof number === "number") return BigInt(Math.ceil(number));
    return number;
}

export function trunc(number: number | bigint): bigint {
    if (typeof number === "number") return BigInt(Math.trunc(number));
    return number;
}

export function sign(number: number | bigint): bigint {
    if (lt(number, 0n)) return -1n;
    if (gt(number, 0n)) return 1n;
    return 0n;
}

export function abs(number: number): number;
export function abs(number: bigint): bigint;
export function abs(number: number | bigint): number | bigint;

export function abs(number: number | bigint) {
    if (typeof number === "number") return Math.abs(number);
    if (number < 0n) return -number;
    return number;
}
