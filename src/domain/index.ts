export type Cart = {
    id: CartId,
    itemLines: ItemLines
};

export type CartId = string;
export type Item = string;

export type ItemLines = Map<string, number>;

export type PersistCart = (cart: Cart) => Promise<void>;
export type GetCartById = (id: CartId) => Promise<Cart>;
export type NextCartIdentity = () => CartId

export type CheckItemExists = (item: Item) => boolean;

export interface Carts {
    nextCartIdentity: NextCartIdentity,
    persistCart: PersistCart;
    getCartById: GetCartById;
};

export type CartEvent = ItemWasAdded;

export type ItemWasAdded = {
    cart: CartId,
    item: string,
    quantity: number
};

const events: Map<CartId, CartEvent[]> = new Map();

export const newEmptyCart = (id: string): Cart => ({id, itemLines: new Map()})


export const addItem = (cart: Cart, item: string)  => {
    const cartWithItems = {...cart};
    let quantity = cartWithItems.itemLines.get(item);
    quantity = quantity ? quantity + 1 : 1;
    cartWithItems.itemLines.set(item, quantity);
    const currentEvents = events.get(cartWithItems.id) ?? [];
    events.set(cartWithItems.id, [...currentEvents, {cart: cart.id, item, quantity}]);
    return cartWithItems;
}

export const releaseEvents = (cart: Cart): CartEvent[] => {
    const cartEvents = events.get(cart.id);
    events.delete(cart.id);
    return cartEvents ?? [];
}