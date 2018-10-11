import mixes from './mixes.js'

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    // ...apply enhancements to the app
    Vue.prototype.$mixes = mixes;

    let interviews = siteData.pages
        .filter(x => {
            console.log;
            return x.path.match(/(?=.*interviews)(?=.*html)/);
        })
        .sort((a, b) => {
            return (
                b.frontmatter.date
                    .split(".")
                    .reverse()
                    .join("") -
                a.frontmatter.date
                    .split(".")
                    .reverse()
                    .join("")
            );
        });
    interviews[0].first = true;

    Vue.prototype.$interviews = interviews;

}