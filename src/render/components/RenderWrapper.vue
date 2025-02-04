<script lang="ts" setup>
import { RenderMode } from '@render/product';
defineProps<{ renderMode: RenderMode }>();
</script>

<template>
    <slot></slot>
</template>