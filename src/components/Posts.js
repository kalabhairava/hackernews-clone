import React from 'react';
import Loader from 'react-loader-spinner';
import ErrorMessage from './ErrorMessage';
import Post from './Post';

function Posts(props) {
	const { list, filterTerm, onDismiss, loading, noResults, hasError } = props;

	if (loading) {
		return (
			<div className="loader">
				<Loader type="Rings" color="#d3d3d3" height={500} width={500} />
			</div>
		);
	}

	if (hasError) {
		return (
			<ErrorMessage>
				Something went wrong :( Failed to fetch data from Hackernews API. Please
				check your internet connection.
			</ErrorMessage>
		);
	}

	if (noResults) {
		return (
			<ErrorMessage>
				No results found. Please try again with different keywords.
			</ErrorMessage>
		);
	}

	return (
		<div className="table">
			{list.filter(filterSearchResults(filterTerm)).map(item => {
				return (
					<div key={item.objectID} className="table-row">
						<Post item={item} onDismiss={onDismiss} />
					</div>
				);
			})}
		</div>
	);
}

function filterSearchResults(filterTerm) {
	if (filterTerm) {
		return item =>
			item.title && item.title.toLowerCase().includes(filterTerm.toLowerCase());
	} else {
		return item => !!item.title;
	}
}

export default Posts;
