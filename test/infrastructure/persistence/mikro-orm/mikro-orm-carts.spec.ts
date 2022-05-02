import { MikroORM } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { addItem, Cart, GetCartById, newEmptyCart, NextCartIdentity, PersistCart } from "../../../../src/domain";
import { MikroOrmCarts } from '../../../../src/infrastructure/persistence/mikro-orm/mikro-orm-carts';
import { CartEntity } from "../../../../src/infrastructure/persistence/mikro-orm/schema/cart.schema";

describe('Mikro ORM carts', () => {
    let orm: MikroORM;
    let persistCart: PersistCart, getCartById: GetCartById, nextCartIdentity: NextCartIdentity;
    
    beforeEach(async () => {
        orm = await MikroORM.init<SqliteDriver>();
        const repository  = orm.em.fork().getRepository<CartEntity>('cart')
        const carts = MikroOrmCarts(repository);
        persistCart = carts.persistCart
        getCartById = carts.getCartById
        nextCartIdentity = carts.nextCartIdentity
        
    })

    afterEach(async () => {
        orm.close();
    })

    // it('should throw if a cart can not be found', () => {
    //     expect(getCartById('not-valid')).resolves.toThrowError();
    // })
    it('should be able to find a persisted cart', async () => {
        const cart = newEmptyCart(nextCartIdentity());
        await persistCart(cart)
        const persistedCart = await getCartById(cart.id)
        expect(cart).toStrictEqual(persistedCart)
    });

    it('should be able to persist a modified cart', async () => {
        let cart = newEmptyCart(nextCartIdentity());
        cart = addItem(cart, 'fried-chiken');
        await persistCart(cart);
        let persistedCart = await getCartById(cart.id);
        expect(cart.itemLines.get('fried-chiken')).toBe(1);
        expect(cart).toStrictEqual(persistedCart);
        persistedCart = addItem(persistedCart, 'fried-chiken');
        await persistCart(persistedCart);
        persistedCart = await getCartById(cart.id);
        expect(persistedCart.itemLines.get('fried-chiken')).toBe(2);
    });
});