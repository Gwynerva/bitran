<script lang="ts" setup>
import { ProductProps } from '@render/front/productProps';
import { useParseData } from '@render/index';

import { SpanType } from '../shared';

import Render from '@render/components/Render.vue';

const { node } = defineProps<ProductProps<SpanType>>();
const parseData = useParseData(node);
</script>

<template>
    <span><Render :node="parseData" /></span>
</template>