import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { MikroORM } from "@mikro-orm/core"
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Cart, Carts, Item } from './domain';
import { MikroOrmCarts } from './infrastructure/persistence/mikro-orm/mikro-orm-carts';
import { addItem, listCartItems, newCart } from './application';
import { addProduct, checkItemExists } from './infrastructure/domain';

const app: Application = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..',  'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
	secret: 'foobarbaz',
	resave: true,
	saveUninitialized: false
}));
declare module 'express-session' {
    export interface SessionData {
        cartId:  string
    }
}

const products: Array<Item> = ['FRIED-CHIKEN', 'BURGER'];

products.forEach(product => {
	addProduct(product);
})

const bootstrap = async () => {

	const orm = await MikroORM.init<SqliteDriver>();

	const em = orm.em.fork();

	const carts: Carts = MikroOrmCarts(em.getRepository<Cart>('cart'))

	const listItems = listCartItems(carts.getCartById)

	const newEmptyCart = newCart(carts.nextCartIdentity, carts.persistCart)

	const addCartItem = addItem(carts.getCartById, checkItemExists, carts.persistCart);

	app.get('/', async (request: Request, response: Response) => {
		const cartId = request.session.cartId;
		let cartProducts: Array<any> = [];

		if (cartId) {
			cartProducts = await listItems(cartId);
		}
		response.render('index', {products, cartProducts})	
	});

	app.post('/cart', async (request: Request, response: Response) => {
		let cartId = request.session.cartId;
		let cart: Cart | null = null;
		const { product } = request.body;
	
		if (!cartId) {
			cart = await newEmptyCart();
			cartId = cart.id;
			request.session.cartId = cartId;
		}

		cart = await addCartItem({
			cart: cartId,
			item: product
		});

		response.redirect('/');
	});
	

	app.listen(3000, () => {
		console.log(`App at 3000`)
	});


}

bootstrap();

