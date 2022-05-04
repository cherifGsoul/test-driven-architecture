import { v4 } from "uuid";
import { addItem, Cart, newEmptyCart } from "../../src/domain"

describe('cart', () => {
    it('should add items', () => {
        let cart: Cart = newEmptyCart(v4());
        cart = addItem(cart, 'FRIED-CHIKEN');
        const itemLine = cart.itemLines.find(itemLine => {
            return itemLine.item === 'FRIED-CHIKEN'
        })
        expect(itemLine?.quantity).toBe(1);
    })

    it('should aggregate items quantities', () => {
        let cart: Cart = newEmptyCart(v4());
        cart = addItem(cart, 'FRIED-CHIKEN');
        cart = addItem(cart, 'FRIED-CHIKEN');
        const itemLine = cart.itemLines.find(itemLine => {
            return itemLine.item === 'FRIED-CHIKEN'
        })
        expect(itemLine?.quantity).toBe(2);
    })
})