<template>
    <div id="modal-window-about-view" class="settings-view">
        <span id="modal-window-about-view-label" v-text="'Amadeus'" />

        <span id="modal-window-about-view-description" class="small-text">
            Amadeus - это бесплатное программное обеспечение с открытым исходным кодом.
            Приложение не преследует коммерческих целей и не допускает редактирование исходного кода
            и распространения с любыми коммерческими целями. Приложение и автор не имеют никакого
            отношения к компании VK и её сотрудникам.
        </span>

        <div id="modal-window-about-view-contacts">
            <Contact
                v-for="contact of contacts"
                :key="contact.id"
                :contact="contact"
            />
        </div>

        <div id="modal-window-about-view-bottom">
            <div id="modal-window-about-view-bottom-amadeus">
                <span id="modal-window-about-view-bottom-amadeus-label" v-text="'Amadeus'" />
                <span id="modal-window-about-view-bottom-amadeus-version" v-text="version.amadeus" />
            </div>

            <div id="modal-window-about-view-bottom-electron">
                <span id="modal-window-about-view-bottom-electron-label" v-text="'Electron'" />
                <span id="modal-window-about-view-bottom-electron-version" v-text="version.electron" />
            </div>

            <div id="modal-window-about-view-bottom-copyright">
                <span id="modal-window-about-view-bottom-copyright-label" v-text="'© PurpleHorrorRus'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";

export default {
    components: {
        Contact: () => import("./About/Contact.vue")
    },

    data: () => ({
        version: {
            amadeus: "0.0.0",
            electron: "0.0.0"
        },

        contacts: [],
        links: {
            VKGroup: "https://vk.com/infinitesoftware",
            GitHub: "https://github.com/PurpleHorrorRus/Amadeus",
            Donate: "https://donationalerts.com/r/infinitehorror"
        }
    }),

    async created() {
        this.contacts = [
            {
                id: "VKGroup",
                url: this.links.VKGroup,
                icon: () => import("~/assets/icons/brands/vk.svg"),
                label: "Infinite Software"
            },

            {
                id: "GitHub",
                url: this.links.GitHub,
                icon: () => import("~/assets/icons/brands/github.svg"),
                label: "GitHub"
            },

            {
                id: "Donate",
                url: this.links.Donate,
                icon: () => import("~/assets/icons/brands/dollar.svg"),
                label: "Поддержать"
            }
        ];

        this.version.electron = process.versions.electron;
        this.version.amadeus = await this.$ipc.invoke("getVersion");
    }
};
</script>

<style lang="scss">
#modal-window-about-view {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    height: max-content !important;
    min-height: 0px !important;

    &-label {
        font-family: "Fira Sans";
        font-size: 20px !important;
    }

    &-contacts {
        display: flex;
        flex-direction: row;
        column-gap: 20px;
        row-gap: 5px;
        flex-wrap: wrap;

        *:hover {
            cursor: pointer;
        }

        .modal-window-about-view-contacts-item {
            &#VKGroup {
                &:hover {
                    span {
                        color: #2787f5;
                    }

                    .icon path {
                        fill: #2787f5 !important;
                    }
                }
            }

            &#GitHub:hover {
                span {
                    color: #c0c0c0;
                }

                .icon path {
                    fill: #c0c0c0 !important;
                }
            }

            &#Twitch:hover {
                span {
                    color: #9146FF;
                }

                .icon path {
                    fill: #9146FF !important;
                }
            }

            &#Donate:hover {
                span {
                    color: #ffff00;
                }

                .icon path {
                    fill: #ffff00;
                }
            }
        }
    }

    &-bottom {
        display: flex;
        align-items: center;
        column-gap: 20px;

        span {
            font-size: 11px;
            color: var(--small-text);
        }
    }
}
</style>