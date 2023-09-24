export function range(min, max) {
    return Array.from({length: max - min})
    .map((__, index) => index + min)
}
export function count(array, field, interval) {
    return array.reduce((res, cur)=>{
        const intervalNumber = Math.trunc(cur[field] / interval);
        res[intervalNumber] = res[intervalNumber] == undefined ? 1 :
         res[intervalNumber] + 1
         return res;
    }, {});
}

export function arraySum(array) {
    return array.reduce((sum, cur) => sum + cur, 0);
}
export function matrixSum(matrix) {
    return matrix.reduce((sum, cur) => sum + arraySum(cur), 0);
}
