export interface Range
{
    start: number;
    end: number;
}

export enum RangeIntersection
{
    None,
    Partial,
    Inside,
    Contain,
}

export function range(start: number, end: number): Range
{
    if (end <= start)
        throw new Error(`Error creating range: proivided end '${end}' can't be less or equal start '${start}'!`);

    return {
        start,
        end
    }
}

export function tryRange(start: number, end: number): Range
{
    try {
        return range(start, end);
    }
    catch {
        return null;
    }
}

export function getIntersection(range: Range, toCompareWithRange: Range): RangeIntersection
{
    let inverseLogic = false;
    let rangeA: Range, rangeB: Range;

    if (range.start <= toCompareWithRange.start)
    {
        rangeA = range;
        rangeB = toCompareWithRange;
    }
    else
    {
        rangeA = toCompareWithRange;
        rangeB = range;
        inverseLogic = true;
    }

    if (rangeA.end < rangeB.start)
        return RangeIntersection.None;

    // Different edges

    if (rangeA.start < rangeB.start && rangeA.end > rangeB.end)
        return inverseLogic ? RangeIntersection.Inside : RangeIntersection.Contain;

    if (rangeA.start > rangeB.start && rangeA.end < rangeB.end)
        return inverseLogic ? RangeIntersection.Contain : RangeIntersection.Inside;

    // Some edges are the same

    if (rangeA.start === rangeB.start)
    {
        if (rangeA.end >= rangeB.end)
            return inverseLogic ? RangeIntersection.Inside : RangeIntersection.Contain;
        else
            return inverseLogic ? RangeIntersection.Contain : RangeIntersection.Inside;
    }

    if (rangeA.end === rangeB.end)
    {
        if (rangeA.start <= rangeB.start)
            return inverseLogic ? RangeIntersection.Inside : RangeIntersection.Contain;
        else
            return inverseLogic ? RangeIntersection.Contain : RangeIntersection.Inside;
    }

    // All other cases

    return RangeIntersection.Partial;
}