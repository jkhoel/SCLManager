interface String {
    toProperCase(): string;
}

String.prototype.toProperCase = function (): string {
    return this.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
}
