const {mysql} = require('../qcloud')


module.exports = async (ctx) =>{
	const {bookid} = ctx.request.query
	const comments = await mysql('comments').where('bookid',bookid)
	ctx.state.data={
		comments:comments
	}
}