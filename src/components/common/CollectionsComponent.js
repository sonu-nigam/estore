import Renderer from "active-dom"
// import Renderer from "../../utils/renderer";

/**
 * @param {Renderer} tree
 * @param {CollectionComponent} ctx
 */
const collectionItem = (tree, ctx) => {
    
    if (!ctx.collectionItems) return

    for (const category of ctx.collectionItems) {
        tree
            .node("a", {
                href: category.link,
                onclick: ctx.onClickLink,
                className: "block min-w-60"
            })
                .node("div", {className: ""})
                    .node("img", {
                        src: category.img,
                        className: "bg-gray-200 w-full border-gray-300 border rounded-md"
                    })
                .end("div")
                .node("div", {
                    className: "mt-4"
                })
                    .text(category.title)
                .end("div")
            .end("a")
    }
}

/**
 * @param {CollectionComponent} ctx
 */
const render = (ctx) => {
    new Renderer(ctx)
        .node("div", {className: "mt-8 p-4"})
            .node("div", {className: "flex justify-between mb-10"})
                .node("p")
                    .text(ctx.getAttribute("title"))
                .end("p")
                .node("a", {
                    href: ctx.getAttribute("view_all_link"),
                    onclick: ctx.onClickLink
                })
                    .text("View all")
                .end("a")
            .end("div")
            .node("div", {className: "w-full overflow-scroll pb-4"})
                .node("div", {className: "flex gap-4"})
                    .bind(collectionItem)
                .end("div")
            .end("div")
        .end("div")
}

const INTERNAL_STATE = {}

/**
    * @class {HTMLElement} CollectionComponent  
    */
export class CollectionComponent extends HTMLElement {
    constructor() {
        super()
    }

    static observedAttributes = ["title", "view_all_link"]

    /**
     * @param {PointerEvent} event
     */
    onClickLink = (event) => {
        event.preventDefault()
        const path = event.currentTarget.attributes.href.value
        history.pushState(null, "", path)
        const popStateEvent = new PopStateEvent('popstate', { state: null });
        dispatchEvent(popStateEvent);
    }

    get collectionItems () {
        return INTERNAL_STATE.collectionItems
    }

    /** @param {Object} value */
    set collectionItems (value) {
        INTERNAL_STATE.collectionItems = value
        render(this)
    }

    attributeChangedCallback() {
        render(this)
    }

    connectedCallback() {
        render(this)
    }
}

