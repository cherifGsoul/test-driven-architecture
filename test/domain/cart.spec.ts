import { v4 } from "uuid";
import { addItem, Cart, newEmptyCart } from "../../src/domain"

describe('cart', () => {
    it('should add items', () => {
        let cart: Cart = newEmptyCart(v4());
        cart = addItem(cart, 'FRIED-CHIKEN');
        expect(cart.itemLines.get('FRIED-CHIKEN')).toBe(1);
    })

    it('should aggregate items quantities', () => {
        let cart: Cart = newEmptyCart(v4());
        cart = addItem(cart, 'FRIED-CHIKEN');
        cart = addItem(cart, 'FRIED-CHIKEN');
        expect(cart.itemLines.get('FRIED-CHIKEN')).toBe(2);
    })
})