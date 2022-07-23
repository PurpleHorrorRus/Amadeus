<template>
    <div class="file-choosing-item">
        <span class="file-choosing-item-text" v-text="text" />
        
        <div class="file-choosing-item-container">
            <div class="file-choosing-item-container-block nowrap flex-spaced">
                <span class="file-choosing-item-container-block-data nowrap" v-text="value" />
                <div class="file-choosing-item-container-block-button clickable" @click="open">
                    <MoreHorizontalIcon class="icon amadeus" />
                </div>
            </div>

            <XIcon 
                v-if="canClear" 
                class="icon clickable" 
                @click="$emit('choose', '')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { resolve } from "path";
import { ipcRenderer } from "electron";

export default {
    components: {
        MoreHorizontalIcon: () => import("~icons/more-horizontal.svg"),
        XIcon: () => import("~icons/x.svg")
    },

    props: {
        text: {
            type: String,
            required: true
        },

        value: {
            type: String,
            required: true
        },

        canClear: {
            type: Boolean,
            required: false,
            default: false
        },

        properties: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },

    methods: {
        async open() {
            const filePaths = await ipcRenderer.invoke("select", this.properties);

            if (filePaths) {
                const [path] = filePaths;
                this.$emit("choose", resolve(path));
            }
        }
    }
};
</script>

<style lang="scss">
.file-choosing-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-container {
        display: flex;
        flex-direction: row;
        column-gap: 10px;

        &-text {
            font-weight: 300;
        }

        &-block {
            position: relative;

            display: flex;
            flex-direction: row;
            align-items: center;

            width: 25vw;
            max-width: 200px;
            height: 20px;

            padding-left: 10px;

            background-color: var(--item);
            border: var(--borderWidth) solid var(--border);
            border-radius: 50px;

            &-data {
                width: 13vw;

                font-size: 11pt;
                font-weight: 300;
            }

            &-button {
                position: absolute;
                right: 0px;
                top: 0px;

                display: flex;
                justify-content: center;
                align-items: center;

                width: 30px;
                height: 100%;

                padding-left: 2px;

                background-color: var(--switch-unchecked);
                border-radius: 50px;
            }
        }
    }

    .icon {
        width: 16px;
    }
}
</style>