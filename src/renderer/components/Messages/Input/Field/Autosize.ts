// @ts-nocheck
export default {
    name: "autosize",

    inserted: function (el: Element) {
        const style = getComputedStyle(el);
        const minHeight = parseInt(style.getPropertyValue("min-height"));
        const maxHeight = parseInt(style.getPropertyValue("max-height"));
  
        const resize = () => {
            el.style.height = "auto";

            const height = Math.max(Math.min(el.scrollHeight, maxHeight), minHeight);
            el.style.setProperty("overflow-y", height < maxHeight ? "hidden" : "overlay");
            el.style.setProperty("height", `${height}px`, "important");
        };

        el.resize = () => setTimeout(resize, 0);
        el.resize();
    }
};