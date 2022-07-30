<template>
    <div id="settings-view-appearance" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.APPEARANCE.TITLE" />

        <FileChoosing
            :text="$strings.SETTINGS.APPEARANCE.BACKGROUND"
            :value="messagesBackground"
            :canClear="true"
            @choose="changeMessagesBackground"
        />

        <Crop
            :image="settings.appearance.messages.background.url"
            @crop="resizeBackground"
        />

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
import { mapState } from "vuex";
import fs from "fs-extra";

import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        Crop: () => import("./Appearance/Crop.vue"),
        ColorPicker: () => import("~/components/Global/ColorPicker.vue")
    },

    mixins: [CoreMixin, AppearanceMixin],

    computed: {
        ...mapState({
            background: (state: any) => state.background
        }),

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

        resizeBackground({ aspectRatio, area, image }) {
            console.log("arw =", aspectRatio.width, "arh =", aspectRatio.height);

            const leftBorder = area.x;
            const rightBorder = area.x + area.width - 10;
            const topBorder = Math.max(area.y, 0);
            const bottomBorder = Math.min(area.y + area.height, image.height);
            console.log(
                "lb =", leftBorder,
                "rb =", rightBorder,
                "tb =", topBorder,
                "bb =", bottomBorder
            );

            const leftBorderPercent = Math.floor(Math.max((leftBorder / image.width) * 100, 1));
            const rightBorderPercent = Math.ceil((rightBorder / image.width) * 100);
            const topBorderPercent = Math.floor(Math.max((topBorder / image.height) * 100, 1));
            const bottomBorderPercent = Math.floor((bottomBorder / image.height) * 100);
            console.log(
                "lbp =", leftBorderPercent,
                "rbp =", rightBorderPercent,
                "tbp =", topBorderPercent,
                "bbp =", bottomBorderPercent
            );

            const centerX = Math.floor((leftBorderPercent + rightBorderPercent) / 2);
            const centerY = Math.floor((topBorderPercent + bottomBorderPercent) / 2);
            console.log("cx =", centerX, "cy =", centerY);

            const x = leftBorderPercent > 1
                ? rightBorderPercent === 100 ? 100 : centerX
                : 0;

            const y = topBorderPercent > 1
                ? bottomBorderPercent === 100 ? 100 : centerY
                : 0;

            console.log("x =", x, "y =", y);

            console.log("");
            this.settings.appearance.messages.background.x = x;
            this.settings.appearance.messages.background.y = y;
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

<style lang="scss">
.cropper {
    height: 600px;
    width: 600px;
    background: #DDD;
}
</style>