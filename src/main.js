import {worker} from "./mocks/browser"

worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
        url: "/mockServiceWorker.js"
    }
})
.then(() => {
    import("./page/index.js")

})
