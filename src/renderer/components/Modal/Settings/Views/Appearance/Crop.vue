<template>
    <VueCropper
        ref="cropper"
        :src="image"
        :dragMode="'none'"
        :viewMode="3"
        :zoomable="false"
        :scalable="false"
        :movable="false"
        :background="false"
        :cropBoxResizable="false"
        :toggleDragModeOnDblclick="false"
        :autoCropArea="1"
        :aspectRatio="aspectRatio"
        @crop="crop"
        @cropend="end"
    />
</template>

<script>
export default {
    components: {
        VueCropper: () => import("vue-cropperjs")
    },

    props: {
        image: {
            type: String,
            required: true
        }
    },

    data: () => ({
        aspectRatio: 1,

        area: {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    }),

    watch: {
        image: {
            handler: function(image) {
                console.log("reset");
                this.$refs.cropper.replace(image);
                this.$refs.cropper.reset();
            }
        }
    },

    created() {
        window.addEventListener("resize", this.adjustAspectRatio);
    },

    mounted() {
        this.adjustAspectRatio();
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.adjustAspectRatio);
    },

    methods: {
        crop({ detail: area }) {
            this.area = area;
        },

        end() {
            const image = this.$refs.cropper.getImageData();
            this.area.width = Math.floor(this.area.width + 10);

            this.$emit("crop", {
                aspectRatio: {
                    width: window.innerWidth / window.innerHeight,
                    height: window.innerHeight / window.innerWidth
                },

                area: this.area,
                image: {
                    width: image.naturalWidth,
                    height: image.naturalHeight
                }
            });
        },

        adjustAspectRatio() {
            this.aspectRatio = window.innerWidth / window.innerHeight;
            this.$refs.cropper?.setAspectRatio(this.aspectRatio);
            return this.aspectRatio;
        }
    }
};
</script>

<style lang="scss">
.cropper-wrapper {
    overflow-x: hidden;
    overflow-y: hidden  ;
}
</style>