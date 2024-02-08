import Renderer from "../utils/renderer";
import { CollectionComponent } from "../components/common/CollectionsComponent";

const fetchData = async () => {
    const res = await fetch('/products')

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
    const data = await res.json()

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
            "view-all-link": "/products",
            title: "Latest Drops",
            $collectionItems: ctx.state.collectionItems
        }).end()
        .node(CollectionComponent, {
            "view-all-link": "/weekly-picks",
            title: "Weekly Picks",
            $collectionItems: ctx.state.collectionItems
        }).end()
        .node(CollectionComponent, {
            "view-all-link": "/sale",
            title: "Sale",
            $collectionItems: ctx.state.collectionItems
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
  
    #state = {}

    get state () {
        return this.#state
    }

    set state (value) {
        this.#state = value 
        render(this)
    }

    async connectedCallback() {
        const collectionItems = await fetchData()
        this.state = {
            ...this.state,
            collectionItems
        }
    }
}

customElements.define("home-page", HomePage)

