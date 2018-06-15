const {mysql} = require('../qcloud')


module.exports = async (ctx) =>{
	const{bookid,comments,openid} = ctx.request.body
	try{
		await mysql('comments').insert({
			bookid,comments,openid
		})
		ctx.state.data={
			msg:'success'
		}
	}catch(e){
		ctx.state={
			code:-1,
			data:{
				msg:'评论失败' + e.sqlMessage
			}
		}
	}


}