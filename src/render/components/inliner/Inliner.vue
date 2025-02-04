<script lang="ts" setup>
import { InlinerNode } from '@dom/productNode';
import { ErrorNode } from '@default/error';
import { prepareProduct } from '@render/front';

const props = defineProps<{ node: InlinerNode | ErrorNode }>();
const { VNode: InlinerVNode, prepareError: error } = await prepareProduct(props.node);
</script>

<template>
    <span v-if="error" style="color: red;">Inliner Error — {{ error }}</span>
    <InlinerVNode v-else />
</template>