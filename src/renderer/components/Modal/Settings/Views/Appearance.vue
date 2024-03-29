<template>
    <div id="settings-view-appearance" class="settings-view">
        <span
            class="modal-view-title"
            v-text="$strings.SETTINGS.APPEARANCE.TITLE"
        />

        <FileChoosing
            :text="$strings.SETTINGS.APPEARANCE.BACKGROUND"
            :value="config.appearance.messages.background.url"
            :canClear="backgroundExist"
            :properties="backgroundProperties"
            @choose="changeMessagesBackground"
            @clear="clearMessagesBackground"
        />

        <Crop
            v-if="backgroundExist"
            :image="config.appearance.messages.background.url"
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
                :value="config.appearance.colors.message"
                @input="saveColor"
            />

            <ColorPicker
                :text="$strings.SETTINGS.APPEARANCE.THEME_MESSAGES.OUT"
                :variable="'out'"
                :value="config.appearance.colors.out"
                @input="saveColor"
            />
        </div>

        <ToggleButton
            :text="$strings.SETTINGS.APPEARANCE.STICKERS"
            :value="config.appearance.stickersTheme"
            @change="deepChange(
                'appearance',
                config.appearance,
                'stickersTheme',
                Number(!config.appearance.stickersTheme)
            )"
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

    data: () => ({
        backgroundProperties: {
            properties: ["openFile"],
            filters: [{
                name: "jpg, jpeg, png",
                extensions: ["jpg", "jpeg", "png"]
            }]
        }
    }),

    computed: {
        ...mapState({
            background: (state: any) => state.background
        }),

        backgroundExist() {
            return Boolean(this.config.appearance.messages.background.url);
        },

        themeNames() {
            return this.themes.map(theme => {
                return theme.name;
            });
        },

        choosedThemeIndex() {
            return this.themes.findIndex(theme => {
                return theme.id === this.config.appearance.theme;
            });
        }
    },

    methods: {
        changeMessagesBackground(path: string) {
            if (!path) {
                return false;
            }

            this.deepChange("appearance", this.config.appearance.messages.background, "url", path);
            fs.copySync(path, this.paths.background);
            return this.setBackground(true);
        },

        clearMessagesBackground() {
            this.deepChange("appearance", this.config.appearance.messages.background, "url", "");
            this.setBackground(false);
            return fs.writeFileSync(this.paths.background, "");
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

            this.config.appearance.messages.background.x = x;
            this.config.appearance.messages.background.y = y;
            this.config.appearance.save();
        },

        changeTheme(index) {
            this.setTheme(this.themes[index].id);
            return this.deepChange("appearance", this.config.appearance, "theme", this.themes[index].id);
        },

        saveColor(data) {
            this.calculateContrasts(data);
            return this.deepChange("appearance", this.config.appearance.colors, data.variable, data.value);
        }
    }
};
</script>

<style lang="scss">
.cropper {
    height: 600px;
    width: 600px;
    background-color: #DDD;
}
</style>