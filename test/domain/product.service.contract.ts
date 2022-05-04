import { CheckItemExists } from "../../src/domain";

// Add product is not part of the contract
// it is just a function helper for testing purposes
export const productServiceContract = (checkItemExists: CheckItemExists, addProduct: Function) => {
	describe('product service', () => {
		it('should be able to check if product exists', () => {
			const item = 'FRIED-CHIKEN';
			addProduct(item);
			expect(checkItemExists(item)).toBeTruthy();
			expect(checkItemExists('INVALID')).toBeFalsy();
		});
	});
}