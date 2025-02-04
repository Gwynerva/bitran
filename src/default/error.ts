import { Node } from '@dom/node';
import { ProductLayout } from '@dom/productNode';


export class ErrorNode extends Node
{
    layout: ProductLayout;
    src: string;
    error: Error;
}