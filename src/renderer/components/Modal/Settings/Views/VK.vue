<template>
    <div id="settings-view-vk" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.VK.TITLE" />

        <ToggleButton
            :text="$strings.SETTINGS.VK.READ"
            :value="config.vkService.read"
            @change="deepChange('vkService', config.vkService, 'read')"
        />

        <ToggleButton
            :text="$strings.SETTINGS.VK.WRITE"
            :value="config.vkService.write"
            @change="deepChange('vkService', config.vkService, 'write')"
        />

        <ToggleButton
            :text="$strings.SETTINGS.VK.SEND_OFFLINE"
            :value="config.vkService.offline"
            @change="deepChange('vkService', config.vkService, 'offline')"
        />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin]
};
</script>