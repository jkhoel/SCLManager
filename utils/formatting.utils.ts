export function toPounds(weight: number, rounded = false): string {
    if(rounded) weight = Math.round(weight)
    return new Intl.NumberFormat("en-US", { style: "unit", unit: "pound"}).format(weight)
}