import {InMemoryCarts} from '../../../../src/infrastructure/persistence/in-memory/in-memory-carts'
import { cartsContract } from "../../../domain/carts.contract";

const beforeEach = async () => InMemoryCarts()

const afterEach = () => () => false

cartsContract('In Memory Contracts', beforeEach, afterEach);