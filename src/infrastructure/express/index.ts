import { NextFunction, Request, Response, Router } from "express";
import { AddItem, ListItems, newCart, NewCart } from "../../application";
import { Cart, Item } from "../../domain";
import { addProduct } from "../domain";

const products: Array<Item> = ['FRIED-CHIKEN', 'BURGER'];

products.forEach(product => {
	addProduct(product);
})

export const cartRouter = (newCart: NewCart, listItems: ListItems, addItem: AddItem) => {
	const router = Router();

	// List cart items handler
	router.get('/', async (request: Request, response: Response, next: NextFunction) => {
		const cartId = request.session.cartId;
		let cartProducts: Array<any> = [];

		if (cartId) {
			cartProducts = await listItems(cartId);
		}
		response.render('index', {products, cartProducts})	
	});

	// Add cart items handler
	router.post('/cart', async (request: Request, response: Response, next: NextFunction) => {
		let cartId = request.session.cartId;
		let cart: Cart | null = null;
		const { product } = request.body;
	
		if (!cartId) {
			cart = await newCart();
			cartId = cart.id;
			request.session.cartId = cartId;
		}

		cart = await addItem({
			cart: cartId,
			item: product
		});

		response.redirect('/');
	})
	return router;
}