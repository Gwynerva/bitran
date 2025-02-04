import { Node } from '@dom/node';

// Алгоритм генерации авто ID -- порядковый номер (быстрый), хеш на основе stringify (медленный метод)
// Не генерировать id для text нод, потому что на них все равно невозможно сослаться.

export abstract class AutoId
{
    ids: Record<string, null> = {};

    abstract generate(node: Node): string;
    abstract finalize(id: string): string;

    exists(id: string)
    {
        return id in this.ids;
    }

    push(id: string)
    {
        if (id in this.ids)
            throw new Error(`Duplicate auto id "${id}"!`);

        this.ids[id] = null;
    }
}

export class DefaultAutoId extends AutoId
{
    nameCounters: Record<string, number> = {};

    generate(node: Node)
    {
        const name = node.name;
        this.nameCounters[name] ||= 0;
        let autoId = `${name}:${++this.nameCounters[name]}`;

        return autoId;
    }

    finalize(id: string): string
    {
        let finalId = id;

        while (this.exists(finalId))
            finalId += '-'; // Keep adding '-' until we get a unique id

        return finalId;
    }
}