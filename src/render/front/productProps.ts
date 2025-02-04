import type { ProductType } from '@';
import type { ProductNode } from '@dom/productNode';

export interface ProductProps<T extends ProductType>
{
    node: ProductNode<T>;
    // core:       ProductCore<T>;
    // render:     ProductRender;
    // //meta:       ProductMeta & T['Meta'];
    // //parseData:  T['ParseData'];
    // renderData: T['RenderData'];
    // // icon:       string;
    // //phrase:     FrontPhrase;
    // //formatText: (text: string) => string;
};

// export async function createProductProps(node: ProductNode | ErrorNode): Promise<ProductProps<any>>
// {
//     const globalState = inject(globalStateKey);
//     const isError = node instanceof ErrorNode;
//     const nodeName = node.name;
//     const core = globalState.bitranCore.products[nodeName];
//     const render = globalState.bitranRender.products[nodeName];

//     // const icon = await (async () => {
//     //     const defaultIcon = node.layout === ProductLayout.Block ? defaultBlockIcon : defaultInlinerIcon;

//     //     if (!render.icon)
//     //         return defaultIcon;

//     //     try { return await render.icon(); }
//     //     catch {
//     //         console.warn(`Failed to load icon for product "${node.name}"! Using the default icon instead!`);
//     //         return defaultIcon;
//     //     }
//     // })();

//     //const phrase = await createPhrase(globalState.language, render.languages, `product:${nodeName}`);

//     const renderData = await (async () => {
//         if (isError)
//             return undefined;

//         let createdRenderData: CreatedRenderData = globalState.content.renderData?.[node.getId()];
//             createdRenderData ||= await createRenderData('front', node, core);

//         if (!createdRenderData)
//             return undefined;

//         if (createdRenderData.status === 'error')
//             return { __error: createdRenderData.errorMessage };

//         if (createdRenderData.status === 'success')
//             return createdRenderData.data;

//         return undefined;
//     })();

//     return {
//         node: node as any,
//         core,
//         render,
//         //meta: isError ? undefined : node.meta,
//         //parseData: isError ? undefined : node.parseData,
//         renderData,
//         // icon,
//         //phrase,
//         //formatText: globalState.formatText,
//     }
// }