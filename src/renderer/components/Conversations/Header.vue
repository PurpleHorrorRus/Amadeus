<template>
    <div id="conversations-header">
        <SingleInput 
            placeholder="Поиск" 
            @input="search = $event" 
        />

        <DotsHorizontal class="icon meridius clickable" />
    </div>
</template>

<script>
export default {
    components: {
        DotsHorizontal: () => import("~/assets/icons/dots-horizontal.svg")
    },

    data: () => ({
        search: ""
    })
};
</script>

<style lang="scss">
#conversations-header {
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    .single-input {
        height: 30px;

        font-size: 12px;
    }
}
</style>