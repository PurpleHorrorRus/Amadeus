<template>
    <div id="settings-view-appearance" class="settings-view">
        <FileChoosing
            text="Фон сообщений"
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
                text="Ширина фона"
                :value="settings.appearance.messages.background.width"
                @change="deepChange(settings.appearance.messages.background, 'width', $event)"
            />

            <RangeItem 
                text="Высота фона"
                :value="settings.appearance.messages.background.height"
                @change="deepChange(settings.appearance.messages.background, 'height', $event)"
            />

            <RangeItem 
                text="Приближение фона"
                :value="settings.appearance.messages.background.zoom"
                :min="1"
                :max="10"
                @change="deepChange(settings.appearance.messages.background, 'zoom', $event)"
            />

            <RangeItem 
                text="Позиция фона по горизонтали"
                :value="settings.appearance.messages.background.x"
                @change="deepChange(settings.appearance.messages.background, 'x', $event)"
            />

            <RangeItem 
                text="Позиция фона по вертикали"
                :value="settings.appearance.messages.background.y"
                @change="deepChange(settings.appearance.messages.background, 'y', $event)"
            />
        </div>

        <div id="settings-view-appearance-colors" class="settings-view-category">
            <Dropdown 
                text="Цветовая схема"
                :options="themeNames"
                :selected="choosedThemeIndex"
                @change="changeTheme"
            />

            <ColorPicker 
                text="Цвет фона входящих сообщений"
                :variable="'message'"
                :value="settings.appearance.colors.message"
                @input="saveColor"
            />

            <ColorPicker 
                text="Цвет фона исходящих сообщений"
                :variable="'out'"
                :value="settings.appearance.colors.out"
                @input="saveColor"
            />
        </div>

        <ToggleButton 
            text="Светлая тема для анимированных стикеров"
            :value="settings.appearance.stickersTheme"
            @change="deepChange(settings.appearance, 'stickersTheme')"
        />
    </div>
</template>

<script>
import fs from "fs";

import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        ColorPicker: () => import("~/components/Global/ColorPicker")
    },

    mixins: [CoreMixin, AppearanceMixin],

    computed: {
        messagesBackground() {
            return this.settings.appearance.messages.background.url 
                || "Не задано";
        },

        themeNames() {
            return this.themes.map(theme => theme.name);
        },

        choosedThemeIndex() {
            return this.themes
                .map(theme => theme.id)
                .indexOf(this.settings.appearance.theme);
        }
    },

    methods: {
        changeMessagesBackground(path) {
            if (!path) {
                this.deepChange(this.settings.appearance.messages.background, "url", "");
                this.deepChange(this.settings.appearance.messages.background, "base64", "");
                return false;
            }

            const base64 = "data:image/png;base64," + fs.readFileSync(path, "base64");
            this.deepChange(this.settings.appearance.messages.background, "url", path);
            this.deepChange(this.settings.appearance.messages.background, "base64", base64);
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