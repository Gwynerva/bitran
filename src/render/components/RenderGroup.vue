<script lang="ts" setup>
import { GroupNode } from '@dom/group';
import Render from './Render.vue';

defineProps<{ node: GroupNode }>();

// For edit mode create proxies for every node
// See: https://github.com/CMTV/bitran/blob/main/packages/render/src/render/RenderGroup.vue
</script>

<template>
    <Render :node="child" v-for="child of node.children" />
</template>