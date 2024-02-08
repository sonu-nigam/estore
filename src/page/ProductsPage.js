import { ProductList } from "../components/common/ProductListComponent";
import Renderer from "../utils/renderer"

const fetchData = async () => {
    const res = await fetch('/products')

    /**
     * @typedef {Object} Category
     * @prop {string} Category.title
     * @prop {string} Category.link
     * @prop {string} Category.img
     * @prop {string} Category.id
     * @prop {Array.<string>} Category.images
     * @prop {Array.<{prices: Array.<{currency_code: string, amount: number}>}>} Category.variants
     */
    /**
     * @type {Array.<Category>} data
     */
    const data = await res.json()

    const categoryList = data.map(item => ({
        title: item.title,
        link: `/products/${item.id}`,
        img: item.images[0],
        id: item.id,
        price: item.variants[0].prices[1]
    }))
    return categoryList
}

/**
 * @param {ProductsPage} ctx
 */
const render = (ctx) => new Renderer(ctx)
    .node("div", {className: "px-4"})
        .node("h3", {className: "text-3xl font-semibold mt-8"})
            .text("Product Listing")
        .end("h3")
        .node("div")
            .node(ProductList, {$productList: ctx.productList}).end()
        .end("div")
    .end("div")


/**
 * @class ProductsPage
 */
export class ProductsPage extends HTMLElement {
    constructor() {
        super();
    }

    /**
    * @param {Object} value 
    */
    set $productList (value) {
        this.productList = value
        render(this)
    }

    async connectedCallback() {
        this.productList = await fetchData()
        render(this)
    }
}

