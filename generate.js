const faker = require('faker')
const times = require('lodash.times')

module.exports = () => {
	return {
		people: times(100, n => {
			return {
				id: n,
				name: faker.name.findName(),
				avatar: faker.internet.avatar(),
			}
		}),
	}
}
