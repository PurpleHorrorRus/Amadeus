<template>
    <div id="settings-view-appearance" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.APPEARANCE.TITLE" />

        <FileChoosing
            :text="$strings.SETTINGS.APPEARANCE.BACKGROUND"
            :value="messagesBackground"
            :canClear="true"
            @choose="changeMessagesBackground"
        />

        <div 
            v-if="settings.appearance.messages.background.url" 
            id="settings-view-appearance-background" 
            class="settings-view-category"
        >
            <RangeItem 
                :text="$strings.SETTINGS.APPEARANCE.BACKGROUND_WIDTH"
                :value="settings.appearance.messages.background.width"
                @change="deepChange(settings.appearance.messages.background, 'width', $event)"
            />

            <RangeItem 
                :text="$strings.SETTINGS.APPEARANCE.BACKGROUND_HEIGHT"
                :value="settings.appearance.messages.background.height"
                @change="deepChange(settings.appearance.messages.background, 'height', $event)"
            />

            <RangeItem 
                :text="$strings.SETTINGS.APPEARANCE.BACKGROUND_ZOOM"
                :value="settings.appearance.messages.background.zoom"
                :min="1"
                :max="10"
                @change="deepChange(settings.appearance.messages.background, 'zoom', $event)"
            />

            <RangeItem 
                :text="$strings.SETTINGS.APPEARANCE.BACKGROUND_X"
                :value="settings.appearance.messages.background.x"
                :max="100"
                :min="-100"
                @change="deepChange(settings.appearance.messages.background, 'x', $event)"
            />

            <RangeItem 
                :text="$strings.SETTINGS.APPEARANCE.BACKGROUND_Y"
                :value="settings.appearance.messages.background.y"
                :max="100"
                :min="-100"
                @change="deepChange(settings.appearance.messages.background, 'y', $event)"
            />
        </div>

        <div id="settings-view-appearance-colors" class="settings-view-category">
            <Dropdown 
                :text="$strings.SETTINGS.APPEARANCE.THEME"
                :options="themeNames"
                :selected="choosedThemeIndex"
                @change="changeTheme"
            />

            <ColorPicker 
                :text="$strings.SETTINGS.APPEARANCE.THEME_MESSAGES.IN"
                :variable="'message'"
                :value="settings.appearance.colors.message"
                @input="saveColor"
            />

            <ColorPicker 
                :text="$strings.SETTINGS.APPEARANCE.THEME_MESSAGES.OUT"
                :variable="'out'"
                :value="settings.appearance.colors.out"
                @input="saveColor"
            />
        </div>

        <ToggleButton
            :text="$strings.SETTINGS.APPEARANCE.STICKERS"
            :value="settings.appearance.stickersTheme"
            @change="deepChange(settings.appearance, 'stickersTheme')"
        />
    </div>
</template>

<script lang="ts">
import fs from "fs-extra";

import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        ColorPicker: () => import("~/components/Global/ColorPicker.vue")
    },

    mixins: [CoreMixin, AppearanceMixin],

    computed: {
        messagesBackground() {
            return this.settings.appearance.messages.background.url 
                || "Не задано";
        },

        themeNames() {
            return this.themes.map(theme => {
                return theme.name;
            });
        },

        choosedThemeIndex() {
            return this.themes.findIndex(theme => {
                return theme.id === this.settings.appearance.theme;
            });
        }
    },

    methods: {
        changeMessagesBackground(path) {
            this.deepChange(this.settings.appearance.messages.background, "url", path);

            if (!path) {
                this.setBackground(false);
                fs.writeFileSync(this.paths.background, "");
                return false;
            }

            fs.copySync(path, this.paths.background);
            this.setBackground(true);
            return true;
        },

        changeTheme(index) {
            this.setTheme(this.themes[index].id);
            this.deepChange(this.settings.appearance, "theme", this.themes[index].id);
            return true;
        },

        saveColor(data) {
            this.calculateContrasts(data);
            this.deepChange(this.settings.appearance.colors, data.variable, data.value);
            return true;
        }
    }
};
</script>