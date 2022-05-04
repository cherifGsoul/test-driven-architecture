import { EntitySchema } from "@mikro-orm/core";
import { Cart } from "../../../../domain";

export const cartSchema = new EntitySchema<Cart>({
    name: 'cart',
    properties: {
        id: {type: 'string', primary: true},
        itemLines: {type: 'json'}
    }
});