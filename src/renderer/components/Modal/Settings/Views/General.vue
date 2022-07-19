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
            :options="getDeviceNames(inputDevices)"
            :selected="selectedInputDevice"
            text="Устройство записи"
            @change="changeDevice('inputDevice', inputDevices, $event)"
        />

        <Dropdown 
            :options="getDeviceNames(outputDevices)"
            :selected="selectedOutputDevice"
            text="Устройство вывода"
            @change="changeDevice('outputDevice', outputDevices, $event)"
        />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],

    data: () => ({
        inputDevices: [] as MediaDeviceInfo[],
        outputDevices: [] as MediaDeviceInfo[]
    }),

    computed: {
        selectedInputDevice() {
            return this.inputDevices.findIndex(device => {
                return device.deviceId === this.settings.inputDevice;
            }) || 0;
        },

        selectedOutputDevice() {
            return this.outputDevices.findIndex(device => {
                return device.deviceId === this.settings.outputDevice;
            }) || 0;
        }
    },

    created() {
        this.initDevices();
    },

    methods: {
        async initDevices() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.inputDevices = this.getDevices(devices, "audioinput");
            this.outputDevices = this.getDevices(devices, "audiooutput");
        },

        getDevices(devices: MediaDeviceInfo[], kind: string) {
            return devices.filter(device => device.kind === kind);
        },

        getDeviceNames(devices: MediaDeviceInfo[]) {
            return devices.map(device => {
                return device.label;
            });
        },

        changeDevice(device: string, devices: MediaDeviceInfo[], index: number) {
            this.deepChange(this.settings, device, devices[index].deviceId);
        }
    }
};
</script>