import React from 'react';

const test1 = (props: any) => {
	const search = props.id;
	console.log('test1 search:', search);
	if (!search)
		return (
			<div>
				<h1>Profile Page</h1>
				<h2>Search: MYpage</h2>
			</div>
		)
	else
		return (
			<div>
				<h1>Profile Page</h1>
				<h2>Search: id_{search}</h2>
			</div>
		)
}

export default test1;