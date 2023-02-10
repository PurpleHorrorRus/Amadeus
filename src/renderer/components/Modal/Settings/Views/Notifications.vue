<template>
    <div id="settings-view-notifications" class="settings-view">
        <ToggleButton
            :text="$strings.SETTINGS.NOTIFICATIONS.DESKTOP"
            :value="config.notifications.desktop"
            @change="deepChange('notifications', config.notifications, 'desktop')"
        />

        <ToggleButton
            :text="$strings.SETTINGS.NOTIFICATIONS.SOUND.ENABLE"
            :value="config.notifications.sound.enable"
            @change="deepChange('notifications', config.notifications.sound, 'enable')"
        />

        <FileChoosing
            v-if="config.notifications.sound.enable"
            :text="$strings.SETTINGS.NOTIFICATIONS.SOUND.FILE"
            :value="config.notifications.sound.file"
            :canClear="Boolean(config.notifications.sound.file)"
            :properties="soundProperties"
            @choose="deepChange('notifications', config.notifications.sound, 'file', $event)"
            @clear="deepChange('notifications', config.notifications.sound, 'file', '')"
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],

    data: () => ({
        soundProperties: {
            properties: ["openFile"],

            filters: [{
                name: "mp3, wav, ogg",
                extensions: ["mp3", "wav", "ogg"]
            }]
        }
    })
};
</script>