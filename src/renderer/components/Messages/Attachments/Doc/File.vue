<template>
    <div class="attachments-item-doc-file" @click="openExternal(item.doc.url)">
        <div class="attachments-item-doc-file-download">
            <FileIcon class="icon" />
        </div>

        <div class="attachments-item-doc-file-information nowrap">
            <span class="attachments-item-doc-file-information-title nowrap" v-text="item.doc.title" />
            <div class="attachments-item-doc-file-information-meta">
                <span class="attachments-item-doc-file-information-meta-size" v-text="size" />
            </div>
        </div>
    </div>
</template>

<script>
import { shell } from "electron";

import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";

export default {
    components: {
        FileIcon: () => import("~/assets/icons/document.svg")
    },

    mixins: [DocMixin]
};
</script>

<style lang="scss">
.attachments-item-doc-file {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    column-gap: 10px;

    &-download {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 40px;
        height: 40px;

        background: var(--secondary);
        border-radius: 100%;

        .icon {
            width: 24px;
        }
    }

    &-information {
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-title {
            font-size: 14px;
        }

        &-meta {
            span {
                font-size: 11px;
            }
        }
    }
}
</style>