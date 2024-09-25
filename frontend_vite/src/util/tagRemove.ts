export function TagRemove(obj: string | any): string {
    if (typeof obj === 'string')
        return obj.replace(/(<([^>]+)>)/ig, "").replace(/"n/, "").replace(/&amp;/g, "").replace(/&quot;/g, "");
    else return obj;
}
