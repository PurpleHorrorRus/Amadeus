<template>
    <div class="attachments-item-playlist-main-actions">
        <SolidButton
            label="Открыть на сайте"
            @click.stop.native="$parent.openExternal(item.link)"
        />

        <SolidButton
            v-tooltip="$strings.TOOLTIP.SOON"
            label="Открыть в Meridius"
            :disabled="true"
            @click.stop.native
        />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.attachments-item-playlist-main-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
</style>