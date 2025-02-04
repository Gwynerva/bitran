<script lang="ts" setup>
import { Component, h, inject, onMounted, ref } from 'vue';

import { ErrorNode } from '@default/error';
import { ProductLayout, ProductNode } from '@dom/productNode';
import { RenderMode } from '@render/product';
import { globalStateKey } from '@render/front/state/global';

import Block from './block/Block.vue';
import Inliner from './inliner/Inliner.vue';
import BlockLoading from './block/BlockLoading.vue';
import InlinerLoading from './inliner/InlinerLoading.vue';

const props = defineProps<{ node: ProductNode | ErrorNode }>();
const globalState = inject(globalStateKey);

const productName = props.node.name;

if (!globalState.bitranCore.products[productName])
    throw new Error(`Product "${productName}" is not registered in Bitran core!`);

if (!globalState.bitranRender.products[productName])
    throw new Error(`Product "${productName}" is not registered in Bitran render!`);

const renderMode = globalState.editMode ? RenderMode.Client : (globalState.bitranRender.products[productName]?.mode ?? RenderMode.Client);
const RenderWrapper = globalState.bitranRender.RenderWrapper;

const loadingVisible = ref(false);
onMounted(() => setTimeout(() => loadingVisible.value = true, 500));

const isBlock = props.node.layout === ProductLayout.Block;

const _createVNodeWithNode = (component: Component) => h(component, { node: props.node });
const ProductWrapper = _createVNodeWithNode(isBlock ? Block : Inliner);
const ProductLoading = _createVNodeWithNode(isBlock ? BlockLoading : InlinerLoading);
</script>

<template>
    <RenderWrapper :renderMode>
        <ProductWrapper v-if="renderMode > RenderMode.Client" />
        <Suspense v-else>
            <ProductWrapper />
            <template #fallback>
                <ProductLoading v-if="loadingVisible" />
                <component v-else :is="isBlock ? 'div' : 'span'" />
            </template>
        </Suspense>
    </RenderWrapper>
</template>