import { getIntersection, range, RangeIntersection } from '..';

test('Zero intersection', () => {
    expect(getIntersection(range(4, 20), range(21, 80))).toBe(RangeIntersection.None);
    expect(getIntersection(range(21, 80), range(4, 20))).toBe(RangeIntersection.None);
    expect(getIntersection(range(4, 20), range(69, 80))).toBe(RangeIntersection.None);
});

test('Partial intersection', () => {
    expect(getIntersection(range(4, 20), range(5,21))).toBe(RangeIntersection.Partial);
    expect(getIntersection(range(5,21), range(4, 20))).toBe(RangeIntersection.Partial);

    expect(getIntersection(range(4, 20), range(20,21))).toBe(RangeIntersection.Partial);
    expect(getIntersection(range(4, 20), range(1, 4))).toBe(RangeIntersection.Partial);
});

test('Inside', () => {
    expect(getIntersection(range(4, 20), range(3,21))).toBe(RangeIntersection.Inside);
    expect(getIntersection(range(4, 20), range(4,21))).toBe(RangeIntersection.Inside);
    expect(getIntersection(range(5, 21), range(4,21))).toBe(RangeIntersection.Inside);
});

test('Contain', () => {
    expect(getIntersection(range(3,21), range(4, 20))).toBe(RangeIntersection.Contain);
    expect(getIntersection(range(4,21), range(4, 20))).toBe(RangeIntersection.Contain);
    expect(getIntersection(range(4,21), range(5, 21))).toBe(RangeIntersection.Contain);
});