function generateId(base, ranLen = 8) {
    return base + Math.random().toString().substr(3, ranLen) + Date.now();
}

export default generateId;
