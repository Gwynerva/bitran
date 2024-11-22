<script lang="ts" setup>
import { UseBitran } from '@/useBitran';

defineProps<{
    bitran: UseBitran;
    content: string;
}>();
</script>

<template>
    <div>Some Bitran Content</div>
</template>