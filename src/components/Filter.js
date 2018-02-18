import React from 'react';

function Filter(props) {
	const { filterTerm, onFilterTermChange } = props;

	return (
		<div className="filter-box">
			<input
				name="filter"
				type="text"
				value={filterTerm}
				onChange={onFilterTermChange}
				placeholder="Filter Results"
			/>
		</div>
	);
}

export default Filter;
