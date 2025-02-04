<script lang="ts" setup>
import { provide } from 'vue';

import { BitranContent } from '@';
import { BitranCore } from '@core/index';
import { BitranRender } from '@render/index';
import { globalStateKey } from '@render/front/state/global';
import { privateStateKey } from '@render/front/state/private';
import { cls } from '@render/class';

import Render from './Render.vue';

const props = defineProps<{
    bitranCore: BitranCore;
    bitranRender: BitranRender;
    content: BitranContent;
    scopeId?: string;
    editMode?: boolean;
    language?: string;
}>();

provide(globalStateKey, {
    scope: props.scopeId || '',
    bitranCore: props.bitranCore,
    bitranRender: props.bitranRender,
    content: props.content,
    editMode: !!props.editMode,
    language: props.language,
});

provide(privateStateKey, {
    iconCache: {},
});

const root = await props.bitranCore.parser.parse(props.content.biCode);
</script>

<template>
    <section :class="[cls.container, editMode && cls.editMode]">
        <Render :node="root" />
    </section>
</template>

<style lang="scss">
@use '$public/scss/def';

#{_(container)}
{
    // Variables to customize Bitran behaviour

    --bitran_gapSmall: 15px;
    --bitran_gap: 30px;
    --bitran_gapBig: 45px;

    --bitran_xPadding: 20px;
    --bitran_blocksGap: 30px;
    --bitran_transitionSpeed: 200ms;
    --bitran_transitionFunction: ease-out;

    --bitran_fontSans: sans-serif;
    --bitran_fontSerif: serif;

    --bitran_text:         light-dark(#333333, #C8C8C8);
    --bitran_textMuted:    light-dark(#696969, #7f7f7f);
    --bitran_textDimmed:   light-dark(#969696, #616161);
    --bitran_textDisabled: light-dark(#b9b9b9, #4f4f4f);

    --bitran_bgAccent:      light-dark(#e1e1e1, #2d2d2d);

    --bitran_colorBrand:    light-dark(#118fe7, #3da1e7);
    --bitran_colorError:    light-dark(#cf2f2f, #c35c5e);

    // Internal variables

    --_bitran_asideWidth: #{def.$asideWidth};
    --_bitran_asideGap: #{def.$asideGap};
    --_bitran_asideFullWidth: #{def.$asideFullWidth};
}

#{_(container)}
{
    container: bitran / inline-size;

    display: flex;
    flex-direction: column;
    gap: var(--bitran_blocksGap);

    font-family: var(--bitran_fontSans);

    padding-right: var(--bitran_xPadding);
    padding-left: calc(var(--bitran_xPadding) - var(--_bitran_asideFullWidth));
}
</style>