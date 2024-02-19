import Renderer from "active-dom"

export class NotFoundPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        new Renderer(this)
            .node("h1", {className: "text-5xl font-bold"})
                .text("Page Not Found")
            .end("h1")
    }
}
