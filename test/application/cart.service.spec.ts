import * as cartService from '../../src/application'
import {InMemoryCarts} from '../../src/infrastructure/persistence/in-memory/in-memory-carts'
import { addProduct, checkItemExists } from '../../src/infrastructure/domain';

let newCart: cartService.NewCart;
let addItem: cartService.AddItem;
let listCartItems: cartService.ListItems;

describe('shopping cart', () => {
    const { persistCart, getCartById, nextCartIdentity } =  InMemoryCarts();

    beforeAll(() => {
        newCart = cartService.newCart(nextCartIdentity, persistCart);
        addItem = cartService.addItem(getCartById, checkItemExists, persistCart);
        listCartItems = cartService.listCartItems(getCartById);
    });
    it(`should throw when trying to add a product that doesn't exist`, async () => {
        const cartViewModel = await newCart();
        expect(async () => await addItem({cart: cartViewModel.id, item: 'invalid-item'})).rejects.toThrowError()
    });

    it('should be able to aggregate items quantity', async () => {
        const item = 'fried-chiken';
        await addProduct(item);
        const cartViewModel =  await newCart();
        await addItem({cart: cartViewModel.id, item});
        expect(await listCartItems(cartViewModel.id)).toStrictEqual([{item, quantity: 1}])
        await addItem({cart: cartViewModel.id, item});
        await addItem({cart: cartViewModel.id, item});
        const items = await listCartItems(cartViewModel.id);
        expect(items).toStrictEqual([{item: 'fried-chiken', quantity: 3}]);
    })
});