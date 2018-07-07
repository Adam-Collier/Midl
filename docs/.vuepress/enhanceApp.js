import mixes from './mixes.js'

export default ({
    Vue, // the version of Vue being used in the VuePress app
}) => {
    // ...apply enhancements to the app
    Vue.prototype.$mixes = mixes;
}