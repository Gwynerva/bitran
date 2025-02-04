export function defineIcon(iconLoader: () => Promise<{ default: string }>)
{
    return async () => (await iconLoader()).default;
}