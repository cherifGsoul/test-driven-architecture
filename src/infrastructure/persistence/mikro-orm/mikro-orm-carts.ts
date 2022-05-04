import { EntityRepository, wrap } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Cart, CartId, Carts } from "../../../domain";



export const MikroOrmCarts = (repository: EntityRepository<Cart>): Carts => {
    return {
        nextCartIdentity: () => v4(),
        persistCart: async (cart: Cart): Promise<void> => {
            const entity = repository.create(cart);
            await repository.persistAndFlush(entity);
        },
        getCartById: async (id: CartId): Promise<Cart> => {
            const entity = await repository.findOne({id});
            if (!entity || entity === null) {
                throw new Error(`Cart ${id} can not be found`);
            }
            const cart = wrap(entity).toObject();
            return cart;
        }
    }
}