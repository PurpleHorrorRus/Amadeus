class Common {
    static getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) arr.push(undefined);
        }

        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    }
}

export default Common;