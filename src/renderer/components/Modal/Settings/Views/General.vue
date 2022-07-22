<template>
    <div id="settings-view-general" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.GENERAL.TITLE" />

        <ToggleButton 
            :text="$strings.SETTINGS.GENERAL.STARTUP" 
            :value="settings.startup"
            @change="turnStartup"
        />

        <ToggleButton 
            :text="$strings.SETTINGS.GENERAL.HIDE_ON_CLOSE" 
            :value="settings.hideOnClose"
            @change="deepChange(settings, 'hideOnClose')"
        />

        <ToggleButton 
            :text="$strings.SETTINGS.GENERAL.DEVTOOLS" 
            :value="settings.devtools"
            @change="turnDevTools"
        />

        <Dropdown 
            :options="getDeviceNames(inputDevices)"
            :selected="selectedInputDevice"
            :text="$strings.SETTINGS.GENERAL.INPUT_DEVICE"
            @change="changeDevice('inputDevice', inputDevices, $event)"
        />

        <Dropdown 
            :options="getDeviceNames(outputDevices)"
            :selected="selectedOutputDevice"
            :text="$strings.SETTINGS.GENERAL.OUTPUT_DEVICE"
            @change="changeDevice('outputDevice', outputDevices, $event)"
        />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";

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

        turnStartup() {
            ipcRenderer.send("changeStartup", !this.settings.startup);
            return this.deepChange(this.settings, "startup");
        },

        turnDevTools() {
            ipcRenderer.send(this.settings.devtools ? "closeDevTools" : "openDevTools");
            return this.deepChange(this.settings, "devtools");
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