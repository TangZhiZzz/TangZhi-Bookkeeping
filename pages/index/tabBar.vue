<template>
	<view class="tab-bar-container">
		<!-- 使用封装的自定义导航栏组件 -->
		<custom-navbar 
			title="TangZhi记账" 
			:showLeft="false"
		></custom-navbar>
		
		<!-- 页面内容区域 -->
		<view class="page-content">
			<view v-if="currentTab === 0">
				<!-- 首页内容 -->
				<home-page></home-page>
			</view>
			<view v-if="currentTab === 1">
				<!-- 记账页面 -->
				<account-page></account-page>
			</view>
			<view v-if="currentTab === 2">
				<!-- 我的页面 -->
				<my-page></my-page>
			</view>
		</view>
		
		<!-- 使用原生底部导航栏替代u-tabbar -->
		<view class="custom-tabbar">
			<view 
				class="tabbar-item" 
				:class="{active: currentTab === 0}"
				@click="tabChange(0)"
			>
				<view class="tabbar-icon">
					<svg-icon name="home" color="#5677fc"></svg-icon>
				</view>
				<text class="tabbar-text">首页</text>
			</view>
			
			<view 
				class="tabbar-item" 
				:class="{active: currentTab === 1}"
				@click="tabChange(1)"
			>
				<view class="tabbar-icon">
					<svg-icon name="plus-circle" color="#5677fc"></svg-icon>
				</view>
				<text class="tabbar-text">记账</text>
			</view>
			
			<view 
				class="tabbar-item" 
				:class="{active: currentTab === 2}"
				@click="tabChange(2)"
			>
				<view class="tabbar-icon">
					<svg-icon name="account" color="#5677fc"></svg-icon>
				</view>
				<text class="tabbar-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
    // 移除 SvgIcon 导入，因为已经全局注册
	import HomePage from './home.vue'
	import AccountPage from './account.vue'
	import MyPage from './my.vue'

	export default {
		components: {
			HomePage,
			AccountPage,
			MyPage
		},
		data() {
			return {
				// 当前选中的标签页索引
				currentTab: 0
			}
		},
		mounted() {
			
		},

		methods: {
			// 切换标签页
			tabChange(index) {
				this.currentTab = index
				if (index === 1) {
					console.log('打开记账表单')
				}
			},
			
			
		}
	}
</script>

<style>
	.tab-bar-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	
	/* 自定义导航栏样式已移至CustomNavbar组件 */

	.page-content {
		flex: 1;
		padding: 20rpx;
		margin-top: calc(90rpx + var(--status-bar-height));
		margin-bottom: 100rpx;
	}
	
	/* 自定义底部导航栏样式 */
	.custom-tabbar {
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		box-shadow: 0 -2rpx 6rpx rgba(0, 0, 0, 0.1);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.tabbar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 33.33%;
		height: 100%;
	}
	
	.tabbar-icon {
		font-size: 48rpx;
		color: #909399;
		line-height: 1;
	}
	
	.tabbar-text {
		font-size: 24rpx;
		color: #909399;
		margin-top: 6rpx;
	}
	
	.tabbar-item.active .tabbar-icon,
	.tabbar-item.active .tabbar-text {
		color: #5677fc;
	}
	
	.placeholder-content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background-color: #f8f8f8;
		border-radius: 12rpx;
	}
	
	.placeholder-content text {
		font-size: 32rpx;
		color: #909399;
	}
	
	/* 添加图标字体样式 */
	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_3094754_ux2jvypv2ij.woff2?t=1640936657917') format('woff2');
	}
	
	.iconfont {
		font-family: 'iconfont';
	}
	
	.icon-home:before {
		content: '\e6b8';
	}
	
	.icon-plus-circle:before {
		content: '\e781';
	}
	
	.icon-account:before {
		content: '\e614';
	}
</style>