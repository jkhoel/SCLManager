export function typeAsArrayOfKeys<T> (arg: T) {
    return Object.keys(arg as object) as (keyof typeof arg)[]
} 