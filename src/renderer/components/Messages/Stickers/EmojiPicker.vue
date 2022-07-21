<template>
    <div id="emoji">
        <VEmojiPicker
            :showSearch="false"
            :i18n="i18n"
            @select="insert($event.data)"
            @click.stop.native
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import { VEmojiPicker } from "v-emoji-picker";

export default {
    components: {
        VEmojiPicker
    },

    data() {
        return {
            input: "",
            search: ""
        };
    },

    computed: {
        i18n() {
            return {
                categories: {
                    Activity: "Активности",
                    Flags: "Флаги",
                    Foods: "Еда",
                    Frequently: "Часто используемые",
                    Objects: "Объекты",
                    Nature: "Природа",
                    Peoples: "Люди",
                    Symbols: "Символы",
                    Places: "Места"
                }
            };
        }
    },

    methods: {
        ...mapActions({
            insert: "input/INSERT_MESSAGE"
        })
    }
};
</script>

<style lang="scss">
#emoji {
    grid-area: collection;

    height: 100%;

    overflow-y: auto;

    .emoji-picker {
        display: flex;

        width: 100%;
        height: 100%;

        background: none;
        border: none;

        overflow-y: auto;

        --ep-color-active: var(--secondary);

        #Categories {
            padding: 5px 0px 0px 0px;

            background: none;
            border: none;

            overflow: hidden;

            .category.active {
                filter: none;
            }

            svg path {
                fill: var(--icons);
            }
        }

        #Emojis {
            height: 100%;

            overflow-y: auto;

            .container-emoji {
                height: 100%;

                overflow: hidden;
            }

            .grid-emojis {
                display: flex;
                justify-content: space-evenly;
                flex-wrap: wrap;
                grid-gap: 1.1%;

                height: 100%;

                padding: 0px 5px;

                overflow-y: auto;

                .emoji {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .category-title {
                margin: 10px;
                padding: 0px;

                color: var(--small-text);
            }
        }
    }
}
</style>