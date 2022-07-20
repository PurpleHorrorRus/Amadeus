<template>
    <div class="attachments-item-playlist-main-actions">
        <SolidButton 
            label="Открыть на сайте" 
            @click.stop.native="$parent.openExternal(item.link)" 
        />

        <SolidButton 
            v-tooltip="'Скоро'" 
            label="Открыть в Meridius"
            :disabled="true"
            @click.stop.native
        />
    </div>
</template>

<script>
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
    column-gap: 10px;
}
</style>