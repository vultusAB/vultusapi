function diff(arg1, arg2, res) {
    arg1.forEach((elem) => {
        if (!arg2.includes(elem)) {
            res = [...res, elem]
        }
    })
    arg2.forEach((elem) => {
        if (!arg1.includes(elem)) {
            res = [...res, elem]
        }
    })
    return res;
}

module.exports = (array1, array2) => diff(array1, array2, []);