<template>
    <div id="settings-view-general" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.GENERAL.TITLE" />

        <ToggleButton
            :text="$strings.SETTINGS.GENERAL.STARTUP"
            :value="config.window.startup"
            @change="turnStartup"
        />

        <ToggleButton
            :text="$strings.SETTINGS.GENERAL.HIDE_ON_CLOSE"
            :value="config.window.hideOnClose"
            @change="deepChange('window', config.window, 'hideOnClose')"
        />

        <ToggleButton
            :text="$strings.SETTINGS.GENERAL.NOTIFICATIONS"
            :value="config.general.notifications"
            @change="deepChange('general', config.general, 'notifications')"
        />

        <ToggleButton
            :text="$strings.SETTINGS.GENERAL.DEVTOOLS"
            :value="config.window.devtools"
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
                return device.deviceId === this.config.general.inputDevice;
            }) || 0;
        },

        selectedOutputDevice() {
            return this.outputDevices.findIndex(device => {
                return device.deviceId === this.config.general.outputDevice;
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
            this.$ipc.send("changeStartup", !this.config.window.startup);
            return this.deepChange("window", this.config.window, "startup");
        },

        turnDevTools() {
            this.$ipc.send(this.config.window.devtools ? "closeDevTools" : "openDevTools");
            return this.deepChange("window", this.config.window, "devtools");
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
            return this.deepChange("general", this.config.general, device, devices[index].deviceId);
        }
    }
};
</script>