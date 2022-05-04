import { 
    Cart,
    CheckItemExists,
    GetCartById,
    PersistCart,
    addItem as addItemToCart,
    releaseEvents,
    newEmptyCart,
    NextCartIdentity
} from "../domain"

export type AddItemCommand = {
    cart: string,
    item: string
}

export type ItemLineViewModel = { item: string, quantity: number } ;

export type NewCart = () => Promise<Cart>;
export type AddItem = (command: AddItemCommand) => Promise<Cart>;
export type ListItems = (id: string) => Promise<ItemLineViewModel[]>;

export const newCart = (
    nextCartIdentity: NextCartIdentity, // dependency
    persistCart: PersistCart // dependency
): NewCart => {
    return async () => {
        const cart = newEmptyCart(nextCartIdentity());
        await persistCart(cart);
        return cart;
    }
}

export const addItem = (
    getCartById: GetCartById, // dependency
    checkItemExists: CheckItemExists, // dependency
    persistCart: PersistCart // dependency
): AddItem => {
    return async (command: AddItemCommand): Promise<Cart> => {
        try {
            const cart = await getCartById(command.cart);
            const { item } = command;
            if(!checkItemExists(command.item)) {
                throw new Error(`Item ${command.item} doesn't exist`);
            }
            const cartWithItems = addItemToCart(cart, item);
            await persistCart(cartWithItems);
            releaseEvents(cartWithItems);
            return cart;
        } catch(err: any) {
            throw new Error(err.message)
        }
    }
}

export const listCartItems = (
    getCartById: GetCartById // dependency
): ListItems => {
    return async (id: string) => {
        try {
            const cart = await getCartById(id);
            return cart.itemLines;
        } catch(err: any) {
            throw new Error(err.message)
        }
    }
}