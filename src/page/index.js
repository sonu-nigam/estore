import { FooterComponent } from "../components/common/FooterComponent";
import { HeaderComponent } from "../components/common/HeaderComponent";
import Renderer from "../utils/renderer";
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
        path: "/products/123451",
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
            const currentRoute = routes
                .find(route => location.pathname === route.path)
            const notFoundRoute = routes
                .find(route => route.path === "*")
            if (currentRoute){
                currentCtx.node(currentRoute.component).end()
            } else {
                currentCtx.node(notFoundRoute.component).end()
            }
        })
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

RootElement.hello = 123
customElements.define("root-element", RootElement)
