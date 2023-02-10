<template>
    <div id="vk-captcha" class="login-form-input">
        <nuxt-img
            id="vk-captcha-image"
            :src="src"
        />

        <SingleInput
            id="captcha-solve"
            placeholder="Решение"
            type="text"
            :disabled="$parent.loading"
            @input="$parent.captcha.value = $event"
            @keypress.enter.native="$parent.auth"
        />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        src: {
            type: String,
            required: true
        }
    }
};
</script>

<style lang="scss">
#vk-captcha {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 20px;

    &-image {
        width: 40%;
    }
}
</style>