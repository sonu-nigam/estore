import { ProductList } from "../components/common/ProductListComponent";
import { getProducts } from "../services/products";
import Renderer from "active-dom"

const fetchData = async () => {

    /**
     * @typedef {Object} Category
     * @property {string} Category.title
     * @property {string} Category.link
     * @property {string} Category.img
     * @property {string} Category.id
     * @property {Array.<string>} Category.images
     */

    /**
     * @type {Array.<Category>} data
     */
    const data = await getProducts()

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

