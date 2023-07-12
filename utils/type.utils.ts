export function typeAsArrayOfKeys<T> (arg: T) {
    return Object.keys(arg as object).filter(e => isNaN(Number(e))) as (keyof typeof arg)[]
} 