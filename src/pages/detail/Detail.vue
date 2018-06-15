<template>
	<div>
	<BookInfo :info="info" :tagsArray = "tagsArray"></BookInfo>	
	<textarea  class="textarea" 
					   v-model='comment'
					   maxlength="1000"
					   placeholder="请输入笔记">
	</textarea>
	<button class="btn" @click="addComment">添加笔记</button>

	<h1 id='title'>读书笔记</h1>
	<ul class="comments-list">
		<li  class="comment-item" v-for="comment in comments" :key="comment.id">
			{{comment.comments}}
		</li>
	</ul>


	</div>
	
</template>

<script>
	import {get,post,showModal} from '@/util'
	import BookInfo from '@/components/BookInfo'
	export default{
		data(){
			return{
				bookid:'',
				info:{},
				tagsArray:[],
				comment:'',
				comments:[]
			}
		},
		methods:{
			async getDetail(){
				const info = await get('/weapp/bookdetail',{id:this.bookid})
				this.info = info
				
				this.tagsArray = this.info.tags.split(',')
				wx.setNavigationBarTitle({
					title:this.info.title
				})
				
			},
			async addComment(){
					if(!this.comment){
						return
					}
					var openid = wx.getStorageSync('open_id')
					var data = {
						bookid:this.bookid,
						comments:this.comment,
						openid:openid
					}	
					try{
						await post('/weapp/addcomment',data)
						this.comment = ''
						this.getComment()
					} catch(e){
						showModal('失败')
					}

			},
			async getComment(){
				const comments = await get('/weapp/commentlist',{bookid:this.bookid})
				this.comments = comments.comments
				console.log( this.comments)
				
			}

		},

		mounted(){
			this.bookid = this.$root.$mp.query.id
			this.getDetail()
			this.getComment()

		},
		components:{
			BookInfo
		}
	}
</script>

<style lang='scss'>
		#title{
			color: #EA5A49;
			font-size:60rpx; 
		}
		.textarea{
				width:730rpx;
				height:200rpx;
				background:#eeeeee;
				padding:10px;
		}
		.comments-list{
			margin-top:
			40rpx;
			padding:0 40rpx;
			.comment-item{
				margin: 20rpx 0; 
				font-size:12px;
				border:3rpx solid #EA5A49;
				border-radius:5px;
				color:white;
				background:grey;
				padding:10rpx 20rpx;
			}
		}
		
	
</style>

