import { Subject, Observable } from 'rxjs/Rx'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { string } from 'prop-types'
import { css } from 'glamor'

const searchStyle = css({
	display: 'flex',
	flexWrap: 'wrap',
})
const resultStyle = css({
	fontSize: 14,
	lineHeight: 15 / 14,
	boxSizing: 'border-box',
	border: 'solid 2px gray',
	padding: 4,
	margin: 4,
	width: 140,
	height: 170,
	'& div': {
		display: 'block',
		fontWeight: 'bold',
	},
})

function performSearch(query) {
	return Observable.ajax(`http://localhost:3000/api/people?name_like=${query}`)
		.map(({ response }) => response)
}
const SearchResult = ({ name, avatar }) => (
	<div {...resultStyle}>
		<div>{name}</div>
		<img className="person__images" src={avatar}/>
	</div>
)
SearchResult.propTypes = {
	name: string.isRequired,
	avatar: string.isRequired,
}

class Search extends Component {

	constructor(props) {
		super(props)
		this.state = {
			value: '',
			results: [],
		}
		this.searchSubject$ = new Subject()
		this.search$ = this.searchSubject$
      .map(e => e.target.value)
      .startWith('')
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(query => performSearch(query))

		this.search$.subscribe(results => this.setState({ results }))
	}
	handleChange = event => {
		this.setState({ value: event.target.value })
		this.searchSubject$.next(event)
	}
	render() {
		const { value, results } = this.state
		return (
			<div>
				<h1>Search Demo</h1>
				<label>
					Search:
					<input
						value={value}
						onChange={this.handleChange}
					/>
				</label>
				<br/>
				<h2>Results</h2>
				<div {...searchStyle}>
					{ results.map(person => (
						<SearchResult key={person.id} {...person}/>
					)) }
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Search/>, document.getElementById('app'))
