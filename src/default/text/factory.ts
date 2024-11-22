import { StrFactory } from "@/core/factory";
import { Text } from './node';

export class TextStr extends StrFactory<Text>
{
    stringify(product: Text)
    {
        return product.content ?? '';
    }
}