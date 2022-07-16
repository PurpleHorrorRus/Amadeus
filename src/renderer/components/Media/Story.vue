<template>
    <div id="media-page-story">
        <video 
            id="story"
            ref="player"
            class="media-page-item-frame"
            :src="story.src"
            autoplay loop
            @mousedown="pause"
            @mouseup="resume"
        />

        <div id="media-page-story-icon" @click="toggleMute">
            <VolumeHighIcon v-if="sound" class="icon vkgram clickable" />
            <VolumeMuteIcon v-else class="icon vkgram clickable" />
        </div>
    </div>
</template>

<script>
export default {
    components: {
        VolumeHighIcon: () => import("~/assets/icons/volume-high.svg"),
        VolumeMuteIcon: () => import("~/assets/icons/volume-mute.svg")
    },

    props: {
        story: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        sound: true
    }),

    methods: {
        toggleMute() {
            this.sound = !this.sound;
            this.$refs.player.muted = !this.sound;
        },

        pause() {
            this.$refs.player.pause();
        },

        resume() {
            this.$refs.player.play();
        }
    }
};
</script>

<style lang="scss">
#media-page-story {
    display: flex;
    align-items: flex-start;
    column-gap: 10px;

    #story {
        width: 19vw;
        height: 31vw;

        object-fit: cover;
        border-radius: 8px;
    }

    &-icon {
        .icon {
            width: 36px;
        }
    }
}
</style>