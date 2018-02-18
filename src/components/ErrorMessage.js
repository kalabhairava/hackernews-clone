import React from 'react';

function ErrorMessage(props) {
	const { children } = props;

	return <div className="error">{children}</div>;
}

export default ErrorMessage;
