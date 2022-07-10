<template>
    <div class="attachments-item attachments-item-map">
        <YandexMap 
            ymap-class 
            :settings="settings" 
            :coords="coords" 
            :zoom="16" 
            @click.native.stop="{}"
        >
            <YandexMapMarker
                marker-id="1" 
                :coords="coords"
                :icon="markerIcon"
            />
        </YandexMap>

        <span 
            class="attachments-item-title attachments-item-map-title nowrap" 
            v-text="geo.place.title" 
        />
    </div>
</template>

<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
    components: {
        YandexMap: yandexMap,
        YandexMapMarker: ymapMarker
    },

    props: {
        geo: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        settings: {
            apiKey: "AKPeBEwBAAAA0qePSQIA03AwA4O4ze6XTqIecsNp7REB6VYAAAAAAAAAAADNzChqedeUxsCAyYkFUHiD7MPITA==",
            lang: "ru_RU",
            coordorder: "latlong",
            enterprise: false,
            version: "2.1"
        }
    }),

    computed: {
        coords() {
            return Object.values(this.geo.coordinates);
        },

        marker() {
            return {
                layout: "default#imageWithContent",
                content: this.geo.place.title
            };
        }
    }
};
</script>

<style lang="scss">
.attachments-item-map {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    .ymap-container {
        width: 30vw;
        height: 30vw;
    }

    &-title {
        margin-top: 5px;
    }
}
</style>