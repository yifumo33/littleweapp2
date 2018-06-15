const { mysql } = require('../qcloud')


module.exports = async (ctx)=>{
	const {id} = ctx.request.query
	var randomNum =  Math.floor( Math.random()*100 )
	console.log('随机数',randomNum)
	await mysql('books')
	       .where('id',id)
	       .increment('count',randomNum)


	const detail = await mysql('books')
						.select()
						.where('id',id)
						.first()

	ctx.state.data = detail     

}