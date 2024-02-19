/**
 * @class HomeElement
 */
class HomeElement {
    /**
     * @param {string} name 
     */
    constructor (name) {
        this.name = name
    }

    /** 
     * @type {string } viewLink
     */
    viewLink;
}


/**
 * @template {HomeElement} 
 * @param {HomeElement} tag
 * @param { () =>  HomeElement } options 
 */
function node (tag, options) {
    const child = new tag("world")
    return child
}


node(HomeElement, { 
    viewLink: "hello" 
})
