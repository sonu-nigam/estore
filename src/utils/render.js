/**
    * @typedef {Partial<HTMLElement | HTMLAnchorElement | HTMLBRElement | HTMLImageElement>} HtmlProps
    * @property {string} [*]
    */
/**
    * @class Root
    * @constructor
    * @param {HTMLElement} ctx
    */
export default class Root {
    /**
        * @private #parentElement
        * @private #previousChild
        * @private #queue
        * @private #pauseExecution
        */
    #parentElement;
    #previousChild;
    #queue;
    #pauseExecution

    /**
        * Create Root of the dom tree
        * @param {HTMLElement} ctx
        */
    constructor(ctx) {
        this.root = ctx
        this.#parentElement = ctx
        this.#previousChild = null
        this.#queue = []
        this.#pauseExecution = false
        return this
    }

    async executeTask(task) {
        return this[task.fn].apply(this, task.args)
    }

    async executeQueue() {
        if (this.#pauseExecution) return;
        this.#pauseExecution = true;
        while (this.#queue.length) {
            const task = this.#queue[0];
            this.#pauseExecution = true;
            await this.executeTask(task);
            this.#queue.shift();
        }
        this.#pauseExecution = false
    }

    /**
        * Returns Current Element
        * @param {keyof HTMLElementTagNameMap | string} element
        * @returns {boolean}
        * @description Checks Whether the node is a void element
        */
    #isVoidElement(element) {
        return [
            "AREA",
            "BASE",
            "BR",
            "COL",
            "HR",
            "IMG",
            "INPUT",
            "LINK",
            "META",
            "PARAM",
            "SOURCE",
            "TRACK",
            "WBR"
        ].includes(element)  
    }

    /**
        * Returns Current Element
        * @returns {HTMLElement | null}
        */
    #getCurrentElement() {
        if (this.#previousChild) {
            return this.#previousChild.nextSibling
        }
        return this.#parentElement.firstChild
    }

    async _text(str) {
        let currentElement = this.#getCurrentElement()
        const nodeValue = currentElement?.nodeValue || null
        if (nodeValue !== str) {
            const textNode = document.createTextNode(str);
            if (!nodeValue) {
                this.#parentElement.appendChild(textNode);
            } else {
                this.#parentElement.replaceChild(textNode, currentElement);
            }
            currentElement = textNode
        }

        this.#previousChild = currentElement;
        return this
    }

    _removeNodeEventListners(element, props) {
        Object.entries(props).forEach(([key, value]) => {
            if (key.startsWith("on")) {
                element.removeEventListener(key.toLowerCase().substring(2), value)
            }
        })
    }

    _isObject(obj) {
        return (obj && typeof obj === "object" && !Array.isArray(obj)) ?
            true :
            false
    }

    _getNewAndStaleProps(newProps, oldProps) {
        const staleProps = this._isObject(oldProps) ? oldProps : {}

        if (!this._isObject(newProps)) {
            throw new Error("Props should be an Object");
        }

        const updatedProps = {}
        const deletedProps = {}

        const uniqueKeys = Object.keys(Object.assign({}, newProps, staleProps));
        if (!uniqueKeys.length) return [{}, {}]

        uniqueKeys.forEach(key => {
            if (newProps[key] !== staleProps[key]) {
                if (newProps[key] === undefined) {
                    updatedProps[key] = undefined
                } else {
                    deletedProps[key] = staleProps[key]
                    updatedProps[key] = newProps[key]
                }
            }
        })
        return [updatedProps, deletedProps]
    }

    /**
        * @param {keyof HTMLElementTagNameMap | typeof HTMLElement} element
        * @returns {string | keyof HTMLElementTagNameMap}
        */
    _getNodeName(element) {
        if (typeof element === "string") {
            return String(element).toUpperCase()
        }

        if (element.prototype instanceof HTMLElement) {
            const className = element.name
            const dashed = String(className)
                .replace(/([A-Z]($|[a-z]))/g, '-$1')
                .replace(/--/g, '-')
                .replace(/^-|-$/, '')
                .toLowerCase()

            if (!dashed.includes('-')) {
                throw new DOMException(
                    `${String(className)} is not a valid tag name`,
                    'SyntaxError'
                );
            }
            return dashed.toUpperCase()
        }

        throw new DOMException(
            `${String(element)} is not a valid tag name`,
            'SyntaxError'
        );
    }


    /**
        * 
        * @param {keyof HTMLElementTagNameMap | typeof HTMLElement} element
        * @param {HtmlProps} [props]
        */
    async _node(element, props = {}) {
        const nodeName = this._getNodeName(element)
        const isVoidElement = this.#isVoidElement(nodeName)
        let currentElement = this.#getCurrentElement()
        if (currentElement?.nodeName !== nodeName) {
            if (typeof element !== "string" &&
                element.prototype instanceof HTMLElement &&
                !customElements.get(nodeName?.toLowerCase())
            ) {
                customElements.define(nodeName?.toLowerCase(), element)
            }
            const newNode = document.createElement(nodeName);
            if (!currentElement) {
                this.#parentElement.appendChild(newNode)
            } else {
                this.#parentElement.replaceChild(newNode, currentElement)
            }
            currentElement = newNode
        }

        const cacheProps = currentElement.$cacheProps
        const [updatedProps, removedProps] = this._getNewAndStaleProps(props, cacheProps)
        for (const key in removedProps) {
        }

        for (const key in updatedProps) {
            const value = updatedProps[key]
            if (key.startsWith("$") || key === "className" || key.startsWith("on")) {
                currentElement[key] = value
            } else {
                currentElement.setAttribute(key, value)
            }
        }
        currentElement.$cacheProps = props

        if (isVoidElement) {
            this.#previousChild = currentElement
        } else {
            this.#parentElement = currentElement;
            this.#previousChild = null;
        }
        return this
    }

    /**
         * This callback is displayed as a global member.
         * @callback bindCallback
         * @param {this} currentCtx
         * @param {HTMLElement} root
         */
    /**
        * @param {bindCallback} cb 
        */
    bind(cb) {
        cb(this, this.root);
        return this;
    }

    /**
        * @param {keyof HTMLElementTagNameMap | typeof HTMLElement} [element]
        */
    async _end(element) {
        if (element && String(element).toUpperCase() !== this.#parentElement.nodeName) {
            throw new Error(`Wrong End tag is provided. Expected: ${element} Provided: ${this.#parentElement.nodeName} in component ${this.root.nodeName}`)
        }

        while (this.#previousChild?.nextSibling) {
            this.#parentElement.removeChild(this.#previousChild.nextSibling)
        }

        this.#previousChild = this.#parentElement
        this.#parentElement = this.#parentElement.parentElement
        return this
    }

    /**
        * Create Text Node and append it to the parent element
        * @param {string} nodeValue
        * @returns {this}
        */
    text(nodeValue) {
        this.#queue.push({ fn: this._text.name, args: [nodeValue] });
        this.executeQueue();
        return this;
    }

    /**
        * 
        * @param {keyof HTMLElementTagNameMap | typeof HTMLElement} type
        * @param {HtmlProps} [props]
        * @returns {this}
        */
    node(type, props) {
        this.#queue.push({ fn: this._node.name, args: [type, props] });
        this.executeQueue();
        return this;
    }

    /**
        * @description Closes the current opened HTML Tag
        * @param {keyof HTMLElementTagNameMap | typeof HTMLElement} [element]
        */
    end(element) {
        this.#queue.push({ fn: this._end.name, args: [element] });
        this.executeQueue();
        return this;
    }

    /**
        * @param {Root} ctx
        * @returns {Object}
        * @prop {node} node
        * @prop {text} text
        * @prop {end} end
        * @bind {bind} bind
        */
    static MethodBinder = (ctx) => {
        const funNames = ["node", "text", "end", "bind"]
        const obj = {}
        funNames.forEach(name => {
            obj[name] = ctx[name].bind(ctx)
        })
        return obj
    }

}
