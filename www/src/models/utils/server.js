export const searchResults = function* (filters, search,pageinfo, sortinfo){
	//发出ajax请求
	const {results , total} = yield fetch("/houses" , {
		"method" : "POST" , 
		"headers" : {
			"Content-Type" : "application/json"
		},
		"body" : JSON.stringify({
			filters ,
			search,
			pageinfo,
			sortinfo
		})
	}).then(response=>response.json());

	return {
		results ,
		total
	};
}