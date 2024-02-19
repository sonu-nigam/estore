import { store } from "../../store/store";
import Renderer from "active-dom";

/**
    * @param {HeaderComponent} ctx
    */
const render = (ctx) => {
    const cart = store.getState()

    new Renderer(ctx)
    .node("header", {className: `p-3 flex gap-3 items-center justify-between`})
        .node("a", {
            className: "uppercase text-3xl font-semibold text-nowrap",
            href: "/",
            onclick: ctx.onClickLogo
        })
            .text("E-Store")
        .end("a")
        .node("div", {className: "flex gap-3"})
            .node("a", {href: "/cart"})
                .node("span")
                    .text("Cart")
                    .text("(")                
                    .text(cart.length)
                    .text(")")
                .end("span")
            .end("a")
            .node("a", {href: "/cart"})
                .node("span")
                    .text("About")
                .end("span")
            .end("a")
            .node("a", {href: "/cart"})
                .node("span")
                    .text("Support")
                .end("span")
            .end("a")
        .end("div")
    .end("header")
}

/**
    * @class {HTMLElement} HeaderComponent
    */
export class HeaderComponent extends HTMLElement {

    constructor() {
        super()
    }

    /**
        * @param {MouseEvent} event
        */
    onClickLogo = (event) => {
        event.preventDefault()
        history.pushState(null, "", "/")
        const popStateEvent = new PopStateEvent('popstate', { state: null });
        dispatchEvent(popStateEvent);
    }

    updateCart = () => render(this)

    connectedCallback() {
        store.subscribe(this.updateCart)
        render(this)
    }
}

