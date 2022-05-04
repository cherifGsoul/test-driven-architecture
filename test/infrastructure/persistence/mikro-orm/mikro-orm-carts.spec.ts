import { MikroORM } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Cart } from "../../../../src/domain";
import { MikroOrmCarts } from '../../../../src/infrastructure/persistence/mikro-orm/mikro-orm-carts';
import { cartsContract } from "../../../domain/carts.contract";

let orm: MikroORM;

const beforeEach = async () => {
    orm = await MikroORM.init<SqliteDriver>();
    const repository  = orm.em.fork().getRepository<Cart>('cart')
    return MikroOrmCarts(repository);
}

const afterEach = async () => {
    await orm.close();
}

cartsContract('Mikro ORM Carts', beforeEach, afterEach);