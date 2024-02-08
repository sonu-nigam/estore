import Root from "../../utils/render";

/**
    * @param {RouterComponent} ctx
    */
const render = (ctx) => {
    const root = new Root(ctx)

    const currentRoute = ctx.routes.find(route => route.path === location.pathname)
    const notFoundRoute = ctx.routes.find(route => route.path === "*")

    if (currentRoute){
        root.node(currentRoute.component)
    } else {
        root.node(notFoundRoute.component)
    }
}
    
/**
    * @class {HTMLElement} RouterComponent  
    */
export class RouterComponent extends HTMLElement {
    /** 
        * @type {Array.<string>} observedAttributes
        */
    static observedAttributes = []

    constructor() {
        super()
    }

    /**
        * @typedef {Object} Route
        * @prop {string} path
        * @prop {keyof HTMLElementTagNameMap | typeof HTMLElement} component
        */
    /**
        * @type {Array.<Route>}
        */
    #routes = []

    get routes () {
        return this.#routes
    }

    set routes (value) {
        this.#routes = value 
        render(this)
    }

    connectedCallback() {
        render(this)
    }
}

