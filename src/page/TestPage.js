import Renderer from "../utils/renderer"

/**
 * @param {Renderer} tree
 * @param {TestPage} ctx
 */
const showFrag = (tree, ctx) => {
    if (ctx.show) {
        tree.node("b").text("Showing").end("b")
    } else {
        tree.node("i").text("Not Showing").end("i") 
    } 
}

/**
 * @param {TestPage} ctx
 */
const render = (ctx) => {
    new Renderer(ctx)
    .node("div", {className: "px-4"})
        .node("h3", {className: "text-3xl font-semibold mt-8"})
            .text("Product Listing")
        .end("h3")
        .node("button", {onclick: ctx.onClickButtton})
            .text("click me")
        .end("button")
        .bind(showFrag)
    .end("div")
    .finish()
}


/**
 * @class TestPage
 */
export class TestPage extends HTMLElement {
    #show = false
    constructor() {
        super();
    }

    /**
     * @returns { boolean }
     */
    get show () {
        return this.#show 
    }

    /**
    * @param {boolean} value
    */
    set show (value) {
        this.#show = value
        render(this)
    }
    
    onClickButtton = () => {
        this.show = !this.show
    }

    async connectedCallback() {
        render(this)
    }
}


