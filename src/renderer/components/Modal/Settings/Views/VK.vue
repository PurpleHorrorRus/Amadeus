<template>
    <div id="settings-view-vk" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.VK.TITLE" />

        <ToggleButton 
            :text="$strings.SETTINGS.VK.DONT_READ" 
            :value="settings.vk.disable_read"
            @change="deepChange(settings.vk, 'disable_read')"
        />

        <ToggleButton 
            :text="$strings.SETTINGS.VK.DONT_WRITE" 
            :value="settings.vk.disable_write"
            @change="deepChange(settings.vk, 'disable_write')"
        />

        <ToggleButton 
            :text="$strings.SETTINGS.VK.SEND_OFFLINE" 
            :value="settings.vk.send_offline"
            @change="deepChange(settings.vk, 'send_offline')"
        />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin]
};
</script>