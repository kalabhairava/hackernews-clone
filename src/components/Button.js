import React from 'react';

function Button(props) {
	const { children, onClick, style, classList } = props;
	return (
		<button onClick={onClick} type="button" style={style} className={classList}>
			{children}
		</button>
	);
}

export default Button;
