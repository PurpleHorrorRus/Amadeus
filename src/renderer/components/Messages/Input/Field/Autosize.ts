export default {
    name: "autosize",

    inserted: function (el: HTMLTextAreaElement & { resize?: () => void }) {
        const style = getComputedStyle(el);
        const minHeight = parseInt(style.minHeight);
        const maxHeight = parseInt(style.maxHeight);

        const resize = () => {
            const height = el.value.length > 0
                ? Math.max(Math.min(el.scrollHeight, maxHeight), minHeight)
                : minHeight;

            el.style.setProperty("overflow-y", height < maxHeight ? "hidden" : "overlay");
            el.style.setProperty("height", `${height}px`, "important");
        };

        el.resize = () => setTimeout(resize, 0);
        el.resize();
    }
};