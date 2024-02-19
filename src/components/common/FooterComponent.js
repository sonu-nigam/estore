import Renderer from "active-dom";

/** @param {FooterComponent} ctx */
const render = (ctx) => new Renderer(ctx)
    .node("footer", {className: "p-4"})
        .node("div", {
            className: "text-gray-500 mt-8 text-sm flex justify-between"
        })
            .node("span")
                .text("2024 E-Store. All right not reserved.")
            .end("span")
            .node("span")
                .text("Powered by web components")
            .end("span")
        .end("div")
    .end("footer")
    
/** @class {HTMLElement} FooterComponent  */
export class FooterComponent extends HTMLElement {
    /** @type {Array.<string>} observedAttributes */
    static observedAttributes = []

    constructor() {
        super()
    }

    #state = {}

    get state () {
        return this.#state
    }


    set state (value) {
        this.#state = value 
        render(this)
    }

    connectedCallback() {
        render(this)
    }
}

