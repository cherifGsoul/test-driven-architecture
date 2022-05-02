import { EntitySchema } from "@mikro-orm/core";

export type CartEntity = {
    id: string,
    itemLines: LineItem[]
}

export type LineItem = {item: string, quantity: number}

export const cartSchema = new EntitySchema<CartEntity>({
    name: 'cart',
    properties: {
        id: {type: 'string', primary: true},
        itemLines: {type: 'json'}
    }
})