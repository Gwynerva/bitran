<script lang="ts" setup>
import { Component } from 'vue';

import { GroupNode } from '@dom/group';
import { Node } from '@dom/node';
import { ProductNode } from '@dom/productNode';
import { ErrorNode } from '@default/error';

import RenderGroup from './RenderGroup.vue';
import RenderProduct from './RenderProduct.vue';

const props = defineProps<{ node: Node }>();

let RenderComponent: Component;

switch(true)
{
    case props.node instanceof GroupNode:
        RenderComponent = RenderGroup;
        break;
    case props.node instanceof ErrorNode:
    case props.node instanceof ProductNode:
        RenderComponent = RenderProduct;
        break;
}

if (!RenderComponent)
    throw new Error(`Can't render unknown node "${props.node?.name || props.node}"!`);
</script>

<template>
    <RenderComponent :node />
</template>