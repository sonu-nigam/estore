import Renderer from "active-dom"
// import Renderer from "../utils/renderer";
import { CollectionComponent } from "../components/common/CollectionsComponent";
import { getProducts } from "../services/products";

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
        img: item.images[0]
    }))
    return categoryList
}

/**
 * @param {HomePage} ctx
 */
const render = (ctx) => new Renderer(ctx)
        .node(CollectionComponent, {
            view_all_link: "/products",
            title: "Latest Drops",
            collectionItems: ctx.collectionItems,
        }).end()
        .node(CollectionComponent, {
            view_all_link: "/weekly-picks",
            title: "Weekly Picks",
            collectionItems: ctx.collectionItems
        }).end()
        .node(CollectionComponent, {
            view_all_link: "/sale",
            title: "Sale",
            collectionItems: ctx.collectionItems
        }).end()


/**
 * @class HomePage
 */
export class HomePage extends HTMLElement {
    /** 
        * @type {Array.<string>} observedAttributes
        */
    static observedAttributes = []

    constructor() {
        super()
    }

    async connectedCallback() {
        const response = await fetchData();
        this.collectionItems = response
        render(this);
    }
}

customElements.define("home-page", HomePage)

