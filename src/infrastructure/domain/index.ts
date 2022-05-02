import { CheckItemExists } from "../../domain";

const products: Set<string> = new Set()

export const checkItemExists: CheckItemExists = (item: string) => {
    return products.has(item)
}

export const addProduct = (item: string) => products.add(item);