
<script>
	import qcloud from 'wafer2-client-sdk'
	import {get,showSuccess} from './util'
	import config from './config'
	export default{
	  async created () {
	  	

	  		// let user = wx.getStorageSync('userinfo')
	  		// if(!user){
			  // 		qcloud.setLoginUrl(config.loginUrl);
					// qcloud.login({
					//     success: function (userinfo) { 
					//        showSuccess('登陆成功')
					//        qcloud.request({
					//        		url:config.userUrl,
					//        		login:true,
					//        		success(userResult){
					//        			console.log(userResult)
					//        		}
					//        })
					//     },
					//     fail: function (err) {
					//         console.log('登录失败', err);
					//     }
					// });
	  		// }

		





	  }
	}
</script>


<style>
	.btn{
		color:white;
		background:#EA5A49;
		margin-bottom:10px;
		padding:0 15px;
		border-radius:2px;
		font-size:16px;
		line-height:40px;
		height:40px;
		width:100%;   
	}
	.btn:active{
		background:#FA5A49;
	},
	.text-footer{
		text-align: center;
		font-size: 12px;
	}
</style>