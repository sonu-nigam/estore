import Root from "../../utils/renderer";

/**
    * @param {CollectionComponent} ctx
    */
const render = (ctx) => {
    new Root(ctx)
        .node("div", {className: "mt-8 p-4"})
            .node("div", {className: "flex justify-between mb-10"})
                .node("p")
                    .text(ctx.getAttribute("title"))
                .end("p")
                .node("a", {
                    href: ctx.getAttribute("view-all-link"),
                    onclick: ctx.onClickViewAll(ctx.getAttribute("view-all-link"))
                })
                    .text("View all")
                .end("a")
            .end("div")
            .node("div", {className: "w-full overflow-scroll pb-4"})
                .node("div", {className: "flex gap-4"})
                    .bind((currentCtx) => {
                        if (!ctx.collectionItems) return

                        for (const category of ctx.collectionItems) {
                            currentCtx
                                .node("a", {
                                    href: category.link,
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
                    })
                .end("div")
            .end("div")
        .end("div")
}

/**
    * @class {HTMLElement} CollectionComponent  
    */
export class CollectionComponent extends HTMLElement {
    /** 
        * @type {Array.<string>} observedAttributes
        */
    static observedAttributes = ["title", "view-all-link"]

    constructor() {
        super()
    }

    /**
        * @callback onClickEventHandler
        * @param {MouseEvent} event
        */
    /**
        * @param {string} pathname
        * @returns {onClickEventHandler}
        */

    onClickViewAll = (pathname) => (event) => {
        event.preventDefault()
        history.pushState(null, "", pathname)
        const popStateEvent = new PopStateEvent('popstate', { state: null });
        dispatchEvent(popStateEvent);
    }

    get $collectionItems () {
        return this.collectionItems
    }

    /**
        * @param {Object} value 
        */
    set $collectionItems (value) {
        this.collectionItems = value
        render(this)
    }

    attributeChangedCallback() {
        render(this)
    }

    connectedCallback() {
        render(this)
    }
}

