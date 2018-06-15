<template>
	<div>
		
		<p class="text-footer" >{{hint}}</p>
		<Card  :key="book.id" v-for="book in books" :book="book" ></Card>
		
	</div>
</template>

<script>
	import {get} from '@/util'
	import Card from '@/components/Card'
	export default{
		data(){
			return{
				books:[],
				page:0,
				more:true,
				hint:'下拉展示更多图书',
				EnableRefresh:true,
				tops:[]
			}
		},
		methods:{
			async getList(init){
				if(init){
					this.page = 0
					this.more = true
				}
				wx.showNavigationBarLoading()

				const books = await get('/weapp/booklist',{page:this.page})
				if(books.list.length < 5 && this.page > 0){
					this.hint = '没有更多图书了！'
					var _this = this
					wx.stopPullDownRefresh()
					this.EnableRefresh = false
					setTimeout(function(){
						_this.hint = ''
					},3000)

				}
				if(init){
					this.books = books.list
					wx.stopPullDownRefresh()
				}else{
					this.books = this.books.concat(books.list).reverse()
				}
				wx.hideNavigationBarLoading()
			},
			async getTop(){
				const tops = await get('/weapp/top')
				this.tops = tops.list
			}
		},
		mounted(){
			this.getList(true)
			const haha  = this.getTop()
			console.log(haha)
			
		},
		components:{
			Card
		},
		onPullDownRefresh(){
			if(this.EnableRefresh){
				this.page = this.page + 1
					console.log(111)
					this.getList()
			}
			
		}
	}
</script>

<style></style>

