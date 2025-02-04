<script lang="ts" setup>
import { Text, Fragment, h, VNode } from 'vue';

import { ProductProps } from '@render/front/productProps';
import { useParseData } from '@render/front/use/parseData';
import { usePrettyText } from '@render/front/use/pretty';

import { TextType } from '../shared';

const { node } = defineProps<ProductProps<TextType>>();
const text = useParseData(node);
const pretty = usePrettyText();

const SubNodes: VNode[] = [];
for (const textFragment of text.split(/\\$/gm))
{
    if (!textFragment)
        continue;

    SubNodes.push(h(Text, pretty(textFragment)));
    SubNodes.push(h('br'));
}

SubNodes.pop(); // Remove last <br>

const TextContent = h(Fragment, SubNodes);
</script>

<template>
    <TextContent />
</template>