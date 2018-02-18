import React from 'react';

function SearchHeader(props) {
	const { title, onSearchSubmit, searchTerm, onSearchTermChange } = props;

	return (
		<div className="header">
			<span className="page-title"> {title} </span>
			<form onSubmit={onSearchSubmit}>
				<input
					name="search"
					type="text"
					value={searchTerm}
					onChange={onSearchTermChange}
					placeholder="Search"
				/>
			</form>
		</div>
	);
}

export default SearchHeader;
