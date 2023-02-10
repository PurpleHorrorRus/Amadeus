<template>
    <div class="attachments-item attachments-item-miniapp">
        <nuxt-img
            :src="item.icon"
            class="attachments-item-miniapp-icon"
        />

        <div class="attachments-item-miniapp-main nowrap">
            <div class="attachments-item-miniapp-main-info">
                <span
                    class="attachments-item-miniapp-main-info__title nowrap"
                    v-text="item.title"
                />

                <span
                    class="attachments-item-miniapp-main-info__description small-text nowrap"
                    v-text="item.shortDescription"
                />
            </div>

            <SolidButton
                :label="$strings.CHAT.ATTACHMENTS.MINI_APP.BUTTON"
                @click.native="openExternal(item.url)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [CoreMixin, AttachmentMixin]
};
</script>

<style lang="scss">
.attachments-item-miniapp {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: 100px;
    column-gap: 10px;

    border-radius: 8px;

    background-color: var(--backdrop);

    &-icon {
        width: 100%;
        height: 100%;

        border-radius: 8px 0px 0px 8px;
    }

    &-main {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        padding: 10px;

        &-info {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>