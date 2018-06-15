
const https = require('https')
const {mysql} = require('../qcloud')

module.exports = async (ctx) =>{

	const {isbn,openid} = ctx.request.body



	if(isbn && openid){

		const findRes = await mysql('books').select().where('isbn',isbn)
		if(findRes.length){
			ctx.state={
				code:-1,
				data:{
					msg:'你已经添加过这本书了'
				}
			}
			return
		}


		let url = 'https://api.douban.com/v2/book/isbn/' + isbn
		const bookinfo = await getJSON(url)
		const rate = bookinfo.rating.average
		const {title,image,alt,publisher,summary,price} = bookinfo
		const tags = bookinfo.tags.map(v=>{
			return `${v.title} ${v.count}`
		}).join(',')
		const author = bookinfo.author.join(',')
		console.log({
			rate,title,image,alt,publisher,summary,price,tags,author
		})
		try{

			await mysql('books').insert({
				isbn,openid,rate,title,image,alt,publisher,summary,price,tags,author

				})
			ctx.state.data={
				title,
				msg:'success'
			}

		}catch(e){
			ctx.state ={
				code:-1,
				data:{
					msg:'新增失败:' + e.sqlMessage
				}
			}
		}
		
	}
} 


// https://api.douban.com/v2/book/isbn/:name


function getJSON(url){
	return new Promise((reslove,reject)=>{
		https.get(url,res=>{
			let urlDate = ''
			res.on('data',data=>{
				urlDate += data
			})
			res.on('end',data=>{
				const bookinfo = JSON.parse(urlDate)
				if(bookinfo.title){
					reslove(bookinfo)
				}
				reject(bookinfo)
			})
		})
	})
}