import { Inliner } from "@/core/dom/product";
import { textName } from '.';

export class Text extends Inliner
{
    name = textName;
    content: string;

    get children() { return []; }
}