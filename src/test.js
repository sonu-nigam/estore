/**
 * Priority
 * 1 => /static
 * 2 => /:dynamic
 * 3 => *
 */

const Routes = [
    "/",
    "/admin",
    "/:slug",
    "/products",
    "/products/",
    "/products/123", 
    "/*",
    "/products/:id",
    "/products/*"
]

/**
    * @param {string} pathname
    * @param {Array.<string>} routes
    * @param {number} [tokenIndex=0] 
    * @returns {string | null}
    */
function getMatchedPaths (pathname, routes, tokenIndex = 2) {
    const pathToken = pathname.split("/", tokenIndex).join("/")
    
    const priorty1Exists = []
    const priorty2Exists = []
    const priorty3Exists = []

    for (let i = 0; i < routes.length; i++) {
        const currentRoute = routes[i]
        const currentRouteToken = currentRoute.split("/", tokenIndex).join("/")

        if (currentRouteToken.startsWith(pathToken)) {
            priorty1Exists.push(currentRoute)
        } else if (currentRouteToken.startsWith("/:")) {
            priorty2Exists.push(currentRoute)
        } else if (currentRouteToken.startsWith("/*")){
            priorty3Exists.push(currentRoute)
        }
    }

    let matchedRoutes = null

    if (priorty1Exists.length) {
        matchedRoutes = priorty1Exists
    } else if (priorty2Exists.length) {
        matchedRoutes = priorty2Exists
    } else if (priorty3Exists.length){
        matchedRoutes = priorty3Exists
    }

    console.log(matchedRoutes)
    if (matchedRoutes.length > 1) {
        const matched = getMatchedPaths(pathToken, matchedRoutes, tokenIndex + 1)
        console.log(matched)
    }

    return null
}

/**
    * @param {string} pathname
    * @param {Array.<string>} routes
    */
function PathMatcher(pathname, routes) {
    /**
        * @type {string | null} matchedPath
        */
    return getMatchedPaths(pathname, routes)
}

console.log(PathMatcher("/admin/user", Routes), "matcher")
