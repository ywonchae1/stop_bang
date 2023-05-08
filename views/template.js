module.exports = {
	reviewHTML: function(title, body, button='') {
		return `
		<!DOCTYPE HTML>
		<html>
			<head>
				<title>${title}</title>
			</head>
			<body>
				<h3><a href='/'>Home</a></h3>
				${title}
				${body}
				${button}
			</body>
		</html>`;
	},
	listHTML: function(data, useUpdate=false) {
		let result = '';
		for (let i=0; i<data.length; i++) {
			result += `
			<p>${data[i].rating}</p>
			<a href='/'>${data[i].content}</a>
			`;
			if (useUpdate)
				result += `
				<form action='/review/${data[i].rv_id}/update' method='post'>
					<input type='submit' value='수정'>
				</form>
				<form action='/review/${data[i].rv_id}/delete_process' method='post'>
					<input type='hidden' name=userName value=${data[i].r_username}>
					<input type='submit' value='삭제'>
				</form>
				`;
		}
		return result;
	}
}
