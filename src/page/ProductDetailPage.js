import { store } from "../store/store"
import Renderer from "../utils/renderer"

const fetchData = async () => {
    const res = await fetch('/products')

    /** @typedef {Object} Category @prop {string} Category.title
     * @prop {string} Category.link
     * @prop {string} Category.img
     * @prop {string} Category.id
     * @prop {Array.<string>} Category.images
     * @prop {Array.<{prices: Array.<{currency_code: string, amount: number}>}>} Category.variants
     */
    /** @type {Array.<Category>} data */
    const data = await res.json()
    const categoryList = data.find(item => item.id === "123451")
    return categoryList
}

/** @param {ProductDetailPage} root
 */
const render = (root) => {

    const selectedVariant = root
        .productDetail
        .variants
        .find(variant => variant.title === [
                root.formValues.size, root.formValues.color
            ].join(" / "))

    const price = selectedVariant.prices
        .find(price => price.currency_code === "usd")

    new Renderer(root)
        .node("div", {className: "mt-4 p-4"})
            .node("div", {className: "w-full "})
                .node("h3", {className: "text-4xl font-semibold capitalize"})
                    .text(root.productDetail?.title)
                .end("h3")
                .node("div", {className: "grid grid-cols-2 gap-4 w-full mt-8"})
                    .bind((ctx) => {
                        if (!root.productDetail) return
                        root.productDetail.images.forEach(image => {
                            ctx.node("img", {src: image, className: "rounded-lg w-full"})
                        })
                    })
                .end("div")
            .end("div")
            .node("div")
                .node("p", {className: "mt-4"})
                    .text(root.productDetail.description)
                .end("p")
                .node("hr", {className: "h-1 bg-gray-200 my-4 rounded-sm"})
                .bind(tree => {
                    root.productDetail.options.forEach(option => tree
                        .node("div") 
                            .node("div", {className: "my-4"})
                                .text("Select ")
                                .text(option.title)
                            .end("div")
                            .node("div", {className: "flex gap-4"})
                                .bind(tree => option.values.forEach(value => tree
                                    .node("button", {
                                        className: [
                                            "px-8 py-1 border border-gray-200",
                                            "rounded-lg text-sm capitalize",   
                                            root.formValues[option.title.toLowerCase()] === value
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                        ].join(" "),
                                        onclick: root
                                            .onChangeOption(option.title.toLowerCase(), value)
                                    })
                                        .text(value)
                                    .end("button")
                                ))
                            .end("div")
                        .end("div")
                    )
                })
                .node("hr", {className: "h-1 bg-gray-200 my-4 rounded-sm"})
                .node("div")
                    .node("span", {className: "uppercase text-gray-500 text-sm"})
                        .text(price?.currency_code)
                        .text(" ")
                        .text(price?.amount)
                    .end("span")
                .end("div")
                .node("div", {className: "mt-4"})
                    .node("button", {
                        className: [
                            "px-8 py-1 border border-gray-200",
                            "bg-black text-white rounded-lg text-sm"
                        ].join(" "),
                        onclick: root.onClickAddToCart(selectedVariant)
                    })
                        .text("Add to Cart")
                    .end("button")
                .end("div")
            .end("div")
        .end("div")
}

/**
 * @typedef {Object | null} ProductDetail
 * @prop {Array.<string>} images
 */

/**
 * @class ProductDetailPage
 */
export class ProductDetailPage extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: "open" })
        /**
         * @type {ProductDetail}
         */
        this.productDetail = null
    }

    /**
    * @param {ProductDetail} value 
    * 
    */
    set $productDetail (value) {
        this.productDetail = value
        render(this)
    }

    /**
    * @typedef {Object} FormValue 
    * @prop {string} FormValue.size
    * @prop {string} FormValue.color
    */
    formValues = {
        size: "S",
        color: "Black"
    }

    /** @callback onChangeOption */
    /**
     * @param {string} type
     * @param {string} value
     * @returns {onChangeOption}
     */
    onChangeOption = (type, value) => () => {
        this.$formValues = {
            ...this.formValues,
            [type]: value
        }
    }

    /**
    * @param {FormValue} value 
    */
    set $formValues (value) {
        this.formValues = value
        render(this)
    }

    /** @callback onClickAddToCart */
    /**
     * @param {Object} variant
     * @returns {onClickAddToCart}
     */
    onClickAddToCart = (variant) => () => {
        store.dispatch({ type: "ADD_TO_CART", value: variant }) 
    }

    async connectedCallback() {
        this.$productDetail = await fetchData()
        render(this)
    }
}
