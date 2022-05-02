import { EntityRepository } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Cart, CartId, Carts } from "../../../domain";
import { CartEntity } from "./schema/cart.schema";



export const MikroOrmCarts = (repository: EntityRepository<CartEntity>): Carts => {
    return {
        nextCartIdentity: () => v4(),
        persistCart: async (cart: Cart): Promise<void> => {
            const entity = repository.create({
                id: cart.id,
                itemLines: Array.from(cart.itemLines, ([item, quantity]) => ({ item, quantity }))
            });
            await repository.persistAndFlush(entity);
        },
        getCartById: async (id: CartId): Promise<Cart> => {
            const entity = await repository.findOne({id});

            if (!entity) {
                throw new Error(`Cart ${id} can not be found`);
            }

            const cart: Cart = {id: entity.id, itemLines: new Map()}
            const itemLines = entity?.itemLines;
            
            itemLines.forEach((itemLine: {item: string, quantity: number}) => {
                cart.itemLines.set(itemLine.item, itemLine.quantity);
            });

            return cart;
        }
    }
}