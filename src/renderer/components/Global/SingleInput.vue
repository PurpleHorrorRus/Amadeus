<template>
    <input
        v-model="mutated"
        class="single-input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="input"
        @keydown.enter="enter"
        @keydown="press"
        @keyup="up"
    >
</template>

<script>
import InputMixin from "~/mixins/Input";

export default {
    mixins: [InputMixin]
};
</script>

<style lang="scss">
.single-input {
    display: inline-block;

    width: 100%;

    padding: 10px;

    background: none;

    color: var(--text);

    border: none;
    border: 2px solid var(--field);
    outline: none;

    vertical-align: middle;

    background-color: var(--field);
    border-radius: 4px;

    font-size: 18px;

    &:focus {
        border: 2px solid var(--secondary);
    }
}
</style>