import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core"
import { AddItem, addItem, NewCart, newCart } from "../application";
import { Cart, Carts } from "../domain"
import { checkItemExists } from "./domain";
import { MikroOrmCarts } from "./persistence/mikro-orm/mikro-orm-carts";

export interface Locator {
	newCart: NewCart,
	addItem: AddItem
}
export const locator = (em: EntityManager): Locator => {
	const cartRepository: EntityRepository<Cart> = em.getRepository<Cart>('cart');
	const carts = MikroOrmCarts(cartRepository);
	return {
		newCart: newCart(carts.nextCartIdentity, carts.persistCart),
		addItem: addItem(carts.getCartById, checkItemExists, carts.persistCart)
	}
}