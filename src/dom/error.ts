export class BitranDomError extends Error
{
    constructor(message)
    {
        super(message);
        this.name = 'BitranDomError';
    }
}