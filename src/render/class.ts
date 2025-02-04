export const clsPrefix = 'bitran';

export const cls = new Proxy({} as any, {
    get(target, property)
    {
        return property ? `${clsPrefix}-${property.toString()}` : '';
    }
})