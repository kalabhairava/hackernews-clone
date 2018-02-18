import React, { Component } from 'react';
import '../App.css';
import SearchHeader from './SearchHeader';
import Filter from './Filter';
import Posts from './Posts';

// Hackernews API endpoint
const URL = 'https://hn.algolia.com/api/v1/search?query=';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			result: null,
			searchTerm: undefined,
			filterTerm: undefined,
			loading: true,
			noResults: false,
			hasError: false
		};

		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchTermChange = this.onSearchTermChange.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onFilterTermChange = this.onFilterTermChange.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
	}

	render() {
		const {
			result,
			searchTerm,
			filterTerm,
			loading,
			noResults,
			hasError
		} = this.state;

		return (
			<div>
				<SearchHeader
					title="Hacker News"
					onSearchSubmit={this.onSearchSubmit}
					searchTerm={searchTerm}
					onSearchTermChange={this.onSearchTermChange}
				/>

				{!hasError &&
					!noResults && (
						<Filter
							filterTerm={filterTerm}
							onFilterTermChange={this.onFilterTermChange}
						/>
					)}

				<Posts
					list={result ? result.hits : []}
					filterTerm={filterTerm}
					onDismiss={this.onDismiss}
					loading={loading}
					noResults={noResults}
					hasError={hasError}
				/>
			</div>
		);
	}

	componentDidMount() {
		this.fetchSearchTopStories(this.state.searchTerm);
	}

	// --------------------------------------------------------------
	// Class Methods
	// --------------------------------------------------------------
	onDismiss(id, event) {
		const updatedList = this.state.result.hits.filter(
			item => item.objectID !== id
		);

		this.setState({
			result: { ...this.state.result, ...{ hits: updatedList } }
		});
	}

	onSearchSubmit(event) {
		event.preventDefault();
		this.setState({ loading: true, filterTerm: '' });
		this.fetchSearchTopStories(this.state.searchTerm);
	}

	onSearchTermChange(event) {
		this.setState({ searchTerm: event.target.value });
	}

	onFilterTermChange(event) {
		this.setState({ filterTerm: event.target.value });
	}

	setSearchTopStories(result) {
		this.setState({
			result,
			loading: false,
			noResults: !result.hits.length,
			hasError: false
		});
	}

	fetchSearchTopStories(searchTerm = ' ') {
		fetch(`${URL}${searchTerm}`)
			.then(response => response.json())
			.then(result => {
				console.log('fetch successful, about to render data to the screen');
				this.setSearchTopStories(result);
			})
			.catch(e => {
				console.log(`Error fetching data from ${URL}${searchTerm} =>`, e);
				this.setState({ loading: false, hasError: true });
			});
	}
}

export default App;
