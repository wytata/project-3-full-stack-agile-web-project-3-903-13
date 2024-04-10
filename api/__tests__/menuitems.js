const request = require('supertest')
const app = require('../index')

describe("Retrieve all menu items", () => {
	test("The menu items service should correctly retrieve all menu items from the database table menuitems", () => {
		
		return request(app)
		.get("/api/menuitems")
		.then(response => {
			expect(response.statusCode).toBe(200)
		})
	})
})
/*
describe("Submit a transaction request without totalCost", () => {
	test("The transaction service should reject requests not containing a total cost.", () => {
		const transaction = {
			"taxAmount": 2.39,
			"orderContents": [
				{
						"id": 2,
						"quantity": 1
				}
			]
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})

describe("Submit a transaction request without taxAmount", () => {
	test("The transaction service should reject requests not containing a tax amount.", () => {
		const transaction = {
			"totalCost": 44.22,
			"orderContents": [
				{
						"id": 2,
						"quantity": 1
				}
			]
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})

describe("Submit a transaction request without order contents.", () => {
	test("The transaction service should reject requests not containing an order.", () => {
		const transaction = {
			"totalCost": 44.22,
			"taxAmount": 2.22,
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})

describe("Submit transaction request with improper formatting of order contents.", () => {
	test("The transaction service should not serve requests with improperly-formatted order contents.", () => {
		const transaction = {
			"totalCost": 45.92,
			"taxAmount": 2.39,
			"orderContents": [
				{
					"id": 2,
					"quantity": 1
				},
				{
					"ghda;": 2, // doesn't have id attribute -> should trigger error
					"quantity": 3
				}
			]
		}
		return request(app)
		.post("/api/transactions/new")
		.send(transaction)
		.then(response => {
			expect(response.statusCode).toBe(400)
		})
	})
})
*/