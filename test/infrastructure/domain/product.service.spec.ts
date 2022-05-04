import { addProduct, checkItemExists } from '../../../src/infrastructure/domain'
import { productServiceContract } from '../../domain/product.service.contract'

productServiceContract(checkItemExists, addProduct);