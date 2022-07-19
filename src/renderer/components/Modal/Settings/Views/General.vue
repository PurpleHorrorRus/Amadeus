<template>
    <div id="settings-view-general" class="settings-view">
        <ToggleButton 
            text="Не прочитывать сообщения при открытии чата" 
            :value="settings.vk.disable_read"
            @change="deepChange(settings.vk, 'disable_read')"
        />

        <ToggleButton 
            text="Не отправлять статус о наборе текста в чат" 
            :value="settings.vk.disable_write"
            @change="deepChange(settings.vk, 'disable_write')"
        />

        <ToggleButton 
            text="Отправлять статус offline после отправки сообщения" 
            :value="settings.vk.send_offline"
            @change="deepChange(settings.vk, 'send_offline')"
        />

        <Dropdown 
            :options="deviceNames"
            :selected="0"
            text="Устройство записи"
            @change="changeInput"
        />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],

    data: () => ({
        devices: [] as MediaDeviceInfo[]
    }),

    computed: {
        deviceNames() {
            return this.devices.map(device => {
                return device.label;
            });
        }
    },

    created() {
        this.initDevices();
    },

    methods: {
        async initDevices() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => {
                return device.kind === "audioinput";
            });
        },

        changeInput(index) {
            this.deepChange(this.settings, "inputDevice", this.devices[index].deviceId);
        }
    }
};
</script>

<style lang="scss">

</style>