/**
 * Priority
 * 1 => /static
 * 2 => /:dynamic
 * 3 => *
 */

const Routes = [
    "/",
    "/admin",
    "/products",
    "/:slug",
    "/products/123", 
    "/*",
    "/products/:id",
    "/:slug/:id"
]

/**
 * @param {Array.<string>} routes
 * @returns {Array.<string>}
 */
function routesListLinter (routes) {
    return routes.map(route => (
            route.endsWith("/") ? route.slice(0, - 1) : route
        ).startsWith("/") ? route : ("/" + route))
}

const LintedRoutes = routesListLinter(Routes)

/**
 * @param {string} pathname 
 * @param {Array.<string>} routes 
 */
function getMatchedRoutes (pathname, routes) {
    let catchAllRoute = null

    for(const route of routes) {
        if (route === "/*") catchAllRoute = route
        if (route === pathname) return [ route ]
        if (route.includes("/:")) {
            let idx = 0
            let pathTokens = pathname.split("/")
            let routeTokens = route.split(/\//)
            while (idx < routeTokens.length) {
                const currentVar = routeTokens[idx]
                if (currentVar[0] === ":") {
                    const newRoute = routeTokens.slice(0, idx + 1)
                    newRoute[idx] = pathTokens[idx]
                    if (pathname.startsWith(newRoute.join("/"))) {
                        routeTokens[idx] = pathTokens[idx]
                    }
                    if (pathname === newRoute.join("/")) {
                        return [ route, {
                            [currentVar.substring(1)]: pathTokens[idx]
                        } ]
                    }
                    if (pathTokens[idx] === undefined) break;
                }
                idx++;
            }
        }
    }

    return catchAllRoute ? [catchAllRoute] : null
}

console.log(getMatchedRoutes("/product/12/hdjsjad/jfddjsa", LintedRoutes))

// console.log(PathMatcher("/admin/user", Routes), "matcher")
