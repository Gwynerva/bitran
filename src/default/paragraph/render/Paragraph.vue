<script lang="ts" setup>
import { cls } from '@render/class';
import { useParseData } from '@render/front/use/parseData';
import { ProductProps } from '@render/front';

import { ParagraphType } from '../shared';

import Render from '@render/components/Render.vue';

const { node } = defineProps<ProductProps<ParagraphType>>();
const parseData = useParseData(node);
</script>

<template>
    <p :class="cls.paragraph">
        <Render :node="parseData" />
    </p>
</template>

<style lang="scss">
#{_(paragraph)}
{
    text-align: justify;
}
</style>