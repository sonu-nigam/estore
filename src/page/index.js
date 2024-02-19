import { FooterComponent } from "../components/common/FooterComponent";
import { HeaderComponent } from "../components/common/HeaderComponent";
// import Renderer from "../utils/renderer";
import Renderer from "active-dom"
import { getMatchedRoutes } from "../utils/router";
import { HomePage } from "./HomePage";
import { NotFoundPage } from "./NotFoundPage";
import { ProductDetailPage } from "./ProductDetailPage";
import { ProductsPage } from "./ProductsPage";
import { TestPage } from "./TestPage";

const routes = [
    {
        path: "/",
        component: HomePage,
    }, {
        path: "/products",
        component: ProductsPage,
    }, {
        path: "/products/:id",
        component: ProductDetailPage,
    }, {
        path: "/test",
        component: TestPage,
    }, {
        path: "*",
        component: NotFoundPage 
    }
]

/**
 * @param {RootElement} ctx
 */
const render = (ctx) => {
    new Renderer(ctx)
        .node(HeaderComponent, {className: "block max-w-5xl mx-auto"}).end()
        .node("main", {className: "max-w-5xl mx-auto"})
            .bind((currentCtx) => {
                const currentRoute = getMatchedRoutes(location.pathname, routes)
                if (currentRoute) currentCtx.node(currentRoute.component).end()
            })
        .end("main")
        .node(FooterComponent, {className: "block max-w-5xl mx-auto"}).end()
}

/**
 * @class {HTMLElement} RootElement
 */
class RootElement extends HTMLElement {
    constructor() {
        super()
    }

    onPopstateChange = () => {
        render(this)
    }
    
    connectedCallback() {
        window.addEventListener("popstate", this.onPopstateChange)
        render(this)
    }

    disconnectedCallback() {
        window.removeEventListener("popstate", this.onPopstateChange)
    }
}

customElements.define("root-element", RootElement)
