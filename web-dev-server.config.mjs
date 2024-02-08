// import fs from "fs"

export default {
    open: true,
    nodeResolve: true,
    watch: true,
    appIndex: 'src/index.html',
    rootDir: 'src/',
    // mimeTypes: {
    //     '**/*.css': 'js',
    // },
    // plugins: [postcss({
    //     config: {
    //         path: './postcss.config.js',
    //     },
    //     modules: true
    // })]
    // plugins: [
    //     {
    //         name: 'environment',
    //         serve(context) {
    //             console.log(context)
    //             if (context.path === '/mockServiceWorker.js') {
    //                 const data = fs.readFileSyc("./src/mockServiceWorker.js")
    //                 return data
    //             }
    //         },
    //     },
    // ],
}
