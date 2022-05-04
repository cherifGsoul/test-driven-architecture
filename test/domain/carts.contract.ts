import { addItem, Carts, GetCartById, newEmptyCart, NextCartIdentity, PersistCart } from "../../src/domain";

export const cartsContract = (name: string, beforeEachTest: Function, afterEachTest: Function) => {
    let persistCart: PersistCart, getCartById: GetCartById, nextCartIdentity: NextCartIdentity;

    describe(name, () => {
        beforeEach(async () => {
            const carts: Carts = await beforeEachTest();
            persistCart = carts.persistCart;
            getCartById = carts.getCartById;
            nextCartIdentity = carts.nextCartIdentity;
        });

        afterEach(async () => {
            await afterEachTest()
        });

        it('should throw if a cart can not be found', () => {
            expect(async () => await getCartById('not-valid')).rejects.toThrowError();
        });

        it('should be able to find a persisted cart', async () => {
            const cart = newEmptyCart(nextCartIdentity());
            await persistCart(cart)
            const persistedCart = await getCartById(cart.id);
            expect(cart).toStrictEqual(persistedCart);
        });

        it('should be able to persist a modified cart', async () => {
            let cart = newEmptyCart(nextCartIdentity());
            cart = addItem(cart, 'fried-chiken');
            await persistCart(cart);
            let persistedCart = await getCartById(cart.id);
            let lineItem = persistedCart.itemLines.find(itemLine => {
                return itemLine.item === 'fried-chiken'
            });
            expect(lineItem?.quantity).toBe(1);
            expect(cart).toStrictEqual(persistedCart);
            persistedCart = addItem(persistedCart, 'fried-chiken');
            await persistCart(persistedCart)
            persistedCart = await getCartById(cart.id);
            lineItem = persistedCart.itemLines.find(itemLine => {
                return itemLine.item === 'fried-chiken'
            })
            expect(lineItem?.quantity).toBe(2);
        });
    });
}