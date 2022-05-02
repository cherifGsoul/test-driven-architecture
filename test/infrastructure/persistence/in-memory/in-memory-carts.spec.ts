import { addItem, newEmptyCart } from "../../../../src/domain";
import {InMemoryCarts} from '../../../../src/infrastructure/persistence/in-memory/in-memory-carts'

describe('in memory carts', () => {
    const { persistCart, getCartById, nextCartIdentity } =  InMemoryCarts();

    it('should throw if a cart can not be found', () => {
        expect(getCartById('not-valid')).resolves.toThrowError();
    })
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