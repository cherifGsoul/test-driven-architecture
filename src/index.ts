import express, { Application } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { MikroORM } from "@mikro-orm/core"
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Cart, Carts, Item } from './domain';
import { MikroOrmCarts } from './infrastructure/persistence/mikro-orm/mikro-orm-carts';
import { addItem, listCartItems, newCart } from './application';
import { addProduct, checkItemExists } from './infrastructure/domain';
import { cartRouter } from './infrastructure/express';

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

const bootstrap = async () => {

	const orm = await MikroORM.init<SqliteDriver>();

	const em = orm.em.fork();

	const carts: Carts = MikroOrmCarts(em.getRepository<Cart>('cart'))

	const listItems = listCartItems(carts.getCartById)

	const newEmptyCart = newCart(carts.nextCartIdentity, carts.persistCart)

	const addCartItem = addItem(carts.getCartById, checkItemExists, carts.persistCart);

	const router = cartRouter(newEmptyCart, listItems, addCartItem);

	app.use(router);

	app.listen(3000, () => {
		console.log(`App at 3000`)
	});
}

bootstrap();

