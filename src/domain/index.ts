export type Cart = Readonly<{
    id: CartId,
    itemLines: ItemLine[]
}>;
export type ItemLine = Readonly<{item: Item, quantity: number}>

export type CartId = Readonly<string>;
export type Item = Readonly<string>;

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

export type ItemWasAdded = Readonly<{
    cart: CartId,
    item: Item,
    quantity: number
}>;

const events: Map<CartId, CartEvent[]> = new Map();

export const newEmptyCart = (id: string): Cart => ({id, itemLines: []})

export const addItem = (cart: Cart, item: string)  => {
    let cartWithItems = {...cart};
    let itemLine = cartWithItems.itemLines.find(itemLine => {
        return itemLine.item === item;
    });

    let itemLines = [...cart.itemLines];

    if (!itemLine) {
        itemLine = { item, quantity: 0 };
        itemLines = [...itemLines, itemLine];
    }

    itemLines = itemLines.map(itemLineInCart => {
        if (itemLineInCart.item === itemLine?.item) {
            const quantity = itemLine.quantity + 1;
            itemLine = { ...itemLine, quantity }
            return itemLine;
        }
        return itemLineInCart;
    });

    cartWithItems = { ...cartWithItems, itemLines: itemLines };
    const currentEvents = events.get(cartWithItems.id) ?? [];
    events.set(cartWithItems.id, [...currentEvents, {cart: cart.id, item, quantity: itemLine.quantity}]);
    return cartWithItems;
}

export const releaseEvents = (cart: Cart): CartEvent[] => {
    const cartEvents = events.get(cart.id);
    events.delete(cart.id);
    return cartEvents ?? [];
}

const removeLineItem = (itemLines: ItemLine[], itemLine: ItemLine) => {
    const idx = itemLines.indexOf(itemLine);
    if (idx >= 0) {
        itemLines.splice(idx, 1);
    }
    return idx;
}