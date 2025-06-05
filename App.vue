<script>
	import db from 'db/index.js'
	export default {
		onLaunch: function() {
			// 使用Promise方式
			db.isExistsTable().then(exists => {
			  if (!exists) {
			    db.initDatabaseSchema()
			  } 
			});

			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/* 全局图标字体样式 */
@font-face {
    font-family: 'iconfont';
    src: url('https://at.alicdn.com/t/font_3094754_ux2jvypv2ij.woff2?t=1640936657917') format('woff2');
}

.iconfont {
    font-family: 'iconfont';
}
</style>