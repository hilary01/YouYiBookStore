/*
 * 判断字符串是否为空
 * @param str 传入的字符串
 * @returns {}
 */
const isNotEmpty = (str) => {
    if (str != null && str.length > 0) {
        return true;
    } else {
        return false;
    }
}
export default {
    isNotEmpty,
}