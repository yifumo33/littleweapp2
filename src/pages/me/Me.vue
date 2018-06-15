<template>
	
		<div class="container">
			<div class="userinfo">

				<img v-bind:src= "image" alt="">
				<p @click="login2" v-if="getUserInfoShow">{{hint}}</p>
			</div>

			<div class="progressBar">
				<progress v-bind:percent='percent' color='#FA5A49' ></progress> 
				<!-- 记住凡是设置属性，都要加上:或者v-bind: -->
				<p>{{year}}已经过去了{{day}}天,{{percent}}%</p>
			</div>


			<button class="btn" @click="scanBook" v-if="addBookShow">添加图书</button>	
			<button class="btn" open-type="getUserInfo" @click="authorize" v-if="authorizeShow">点击允许获取您的用户资料</button>
		</div>
		
	
</template>

<script>
	
	import config from '@/config'
	import {showSuccess,post,showModal} from '@/util'
	import qcloud from 'wafer2-client-sdk'
	export default{
		components:{

		},
		data(){
			return{
				userinfo:{},
				image:"https://i.loli.net/2018/06/13/5b2097c1ace4d.jpg",
				getUserInfoShow:false,
				avatarShow:false,
				hint:'点击获取你的用户信息',
				authorizeShow:false,
				open_id:'',
				addBookShow:false
			}
		},
		computed:{
			year(){
				return new Date().getFullYear()
			},
			day(){
				let start = new Date()
				start.setMonth(0)
				start.setDate(1)
				let offset = new Date().getTime() - start.getTime()
				return parseInt((offset/1000/60/60/24)+1)
			},
			percent(){
				return parseInt(this.day/365*100)
			},
			xxopen_id(){
				return this.open_id
			}

		},
		created(){
			
			this.userinfo2 = wx.getStorageSync('userinfo2') 
			if(this.userinfo2){
				this.image = this.userinfo2.avatarUrl
				this.hint = this.userinfo2.nickName
				this.getUserInfoShow = true
				this.addBookShow = true
			}else{
				this.authorizeShow = true;
			}
			console.log(this.userinfo2)


		},
		methods:{

			getOpenId(){
				var _this = this
			 	 wx.login({
		        success: function (res) {
		          var code = res.code; //返回code
		          console.log(code);
		          var appId = 'wx6c00d1aae3cf7049';
		          var secret = '9e21cff940ea3222a19b0dc042a0fc42';
		          wx.request({
		            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
		            data: {},
		            header: {
		              'content-type': 'json'
		            },
		            success: function (res) {
		              var openid = res.data.openid //返回openid
		              console.log('openid为' + openid);
		              _this.open_id = openid
		              wx.setStorageSync('open_id',openid)

		            }
		          })
		        }
		      })
			},
			authorize(){
				showSuccess('获得授权成功')
				this.getUserInfoShow = true
			},
			 login(){

					this.hint = '登陆中'
					var _this = this
			 		qcloud.setLoginUrl(config.loginUrl);
					qcloud.login({
					    success: function (userinfo) { 
					       showSuccess('登陆成功')
					       qcloud.request({
					       		url:config.userUrl,
					       		login:true,

					       		success(userResult){
					       			console.log(userResult.data.data)
									_this.userinfo = userResult.data.data
									_this.image = userResult.data.data.avatarUrl
									_this.hint = _this.userinfo.nickName
									wx.setStorageSync('userinfo',_this.userinfo)
									_this.authorizeShow = false
									_this.addBookShow = true
					       		}
					       })
					    },
					    fail: function (err) {
					        console.log('登录失败', err);
					    }
					});
			},
			login2(){


					this.hint = '登陆中'
					var _this = this
					this.getOpenId()
				    wx.getUserInfo({
			            success: function(res) {
			              console.log("wx.getUserInfo",res.userInfo)
			               _this.image = res.userInfo.avatarUrl
						   _this.hint = res.userInfo.nickName
						    _this.authorizeShow = false
						    var userinfo = res.userInfo
						    
						    _this.userinfo = userinfo
							 wx.setStorageSync('userinfo2',userinfo)
							 _this.addBookShow = true
			           }
			         })
				},
			scanBook(){			
				wx.scanCode({
				  success: (res) => {
				    console.log(res)
				   	this.addBook(res.result)
				  }
				})


			},
			async addBook(isbn){
				console.log('haha')
				var _this = this
				const res = await post('/weapp/addbook',{
					 isbn,
					 openid:wx.getStorageSync('open_id')
				})
				showModal('添加成功',`${res.title}添加成功！`)
			}

		}

	}
</script>

<style lang="scss">
	.container{
		padding:0 60rpx;
		.userinfo{
			
			margin-top:200rpx; 
			text-align: center;
			img{
				width:200rpx;
				height:200rpx;
				border-radius:50%;
			}
			p{
				margin:25rpx 0; 
			}
			
		}
		.progressBar{
			width:90%;
			margin:40rpx auto;  
			text-align: center;
			p{
				text-align:center;
			}
			button{
				width:90%;
				margin:0 auto;
			}
			
		}
	}


</style>











