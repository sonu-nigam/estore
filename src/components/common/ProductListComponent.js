import Renderer from "../../utils/renderer"

/**
* @typedef {Object | null} Product 
* @prop {string} value.title
* @prop {string} value.id
* @prop {string} value.img
* @prop {Object.<{current_code: string, amount: number}>} value.price
*/

/**
 * @param {Renderer} tree
 * @param {ProductList} root
 */
const product = (tree, root) => {
    if (!root?.productList?.length) return 

    root?.productList?.forEach(item => {
        tree.node("div")
                .node("a", {
                    href: "/products/" + item.id,
                    className: 'block',
                    onclick: root.onClickProduct("/products/" + item.id)
                })
                    .node("img", {
                        src: item.img,
                        className: "border-gray-200 border rounded-lg shadow-md"
                    })
                    .node("figcaption", {
                        className: "flex py-2 justify-between gap-4 text-sm text-gray-500"
                    })
                        .node("span")
                            .text(item.title)
                        .end("span")
                        .node("span")
                            .text(item.price.currency_code.toUpperCase())
                            .text(" ")
                            .text(item.price.amount)
                        .end("span")
                    .end("figcaption")
                .end("a")
            .end("div")
                
    })
}

/**
 * @param {ProductList} ctx
 */
const render = (ctx) => new Renderer(ctx)
    .node("div", {className: "mt-4"})
        .node("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        })
            .bind((root) => product(root, ctx))
        .end("div")
    .end("div")


/**
 * @class ProductList
 */
export class ProductList extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * @property {Array.<Product>} ProductList.productList
     */
    productList = null

    /**
    * @param {Array.<Product>} value 
    */
    set $productList (value) {
        this.productList = value
        render(this)
    }

    /**
     * @callback onClickEventHandler
     * @param {MouseEvent} event
     */

    /**
     * @param {string} url
     * @returns {onClickEventHandler}
     */
    onClickProduct = (url) => (event) => {
        console.log(event)
        event.preventDefault()
        history.pushState(null, null, url)
        const popStateEvent = new PopStateEvent('popstate', { state: null });
        dispatchEvent(popStateEvent);
    }

    connectedCallback() {
        render(this)
    }
}

