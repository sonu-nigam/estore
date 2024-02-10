import data from "./data";

export function getProducts () {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
}
