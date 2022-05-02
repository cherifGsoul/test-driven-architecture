import { v4 } from "uuid";
import { Cart, CartId, Carts } from "../../../domain";

const carts: Map<string, Cart> = new Map()


export const InMemoryCarts = (): Carts => {
    return {
        nextCartIdentity: () => v4(),
        persistCart: async (cart: Cart): Promise<void> => {
            carts.set(cart.id, cart)
        },
        getCartById: async (id: CartId): Promise<Cart> => {
            const cart = carts.get(id);
            if (!cart) {
                throw new Error(`Cart ${id} can not be found`);
            }
            return cart;
        }
    }

}