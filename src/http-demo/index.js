/* eslint-disable no-unused-vars, quotes, quote-props, comma-dangle, no-console */
import { Observable } from 'rxjs/Rx'
import { clearNodes, addPerson } from './utils'

function performSearchFetch(query) {
	return Observable.from(
		fetch(
			`http://localhost:3000/api/people?name_like=${query}`
		).then(response => response.json())
	)
}
function performSearchAjax(query) {
	return Observable.ajax(`http://localhost:3000/api/people?name_like=${query}`)
		.map(({ response }) => response)
}

const searchField = document.querySelector('.search')
const resultList = document.querySelector('.results')
const clearResults = clearNodes(resultList)

const search$ = Observable.of([
	{
		"id": 4,
		"name": "Dr. Pete MacGyver",
		"avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vlajki/128.jpg"
	},
	{
		"id": 55,
		"name": "Annabelle MacGyver",
		"avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/artvavs/128.jpg"
	}
])

// search$.subscribe(val => console.log(val))
search$.subscribe(
	results => {
		clearResults()
		results.map(addPerson).forEach(resultNode => {
			resultList.appendChild(resultNode)
		})
	},
	err => {
		console.log('Error', err)
	}
)
