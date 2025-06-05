<template>
	<view class="my-container">

		<!-- 统计卡片 -->
		<view class="stats-card">
			<view class="stats-item">
				<view class="stats-value">{{stats.days}}</view>
				<view class="stats-label">记账天数</view>
			</view>
			<view class="stats-divider"></view>
			<view class="stats-item">
				<view class="stats-value">{{stats.records}}</view>
				<view class="stats-label">记账笔数</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="function-list">
			<view class="function-group">
				<!-- <view class="function-item" @click="navigateToAccount()">
					<view class="function-icon">
						<svg-icon name="account" color="#5677fc" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">账户管理</view>
						<view class="function-desc">管理资金账户</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view> -->
				<view class="function-item" @click="navigateToCategory()">
					<view class="function-icon">
						<svg-icon name="food" color="#5677fc" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">分类管理</view>
						<view class="function-desc">自定义收支分类</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>



				<view class="function-item" @click="navigateToTag()">
					<view class="function-icon">
						<svg-icon name="shopping-cart" color="#5677fc" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">标签管理</view>
						<view class="function-desc">管理交易标签</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>

			</view>

			<!-- <view class="function-group">
				<view class="function-item" @click="navigateTo('/pages/backup/index')">
					<view class="function-icon">
						<svg-icon name="graph" color="#5677fc" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">数据备份</view>
						<view class="function-desc">备份和恢复账单数据</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>
				
				<view class="function-item" @click="navigateTo('/pages/settings/index')">
					<view class="function-icon">
						<svg-icon name="graph" color="#5677fc" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">系统设置</view>
						<view class="function-desc">主题、语言等设置</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>
			</view> -->

			<!-- <view class="function-group" v-if="userInfo.id">
				<view class="function-item" @click="logout">
					<view class="function-icon">
						<svg-icon name="close" color="#f56c6c" size="48"></svg-icon>
					</view>
					<view class="function-info">
						<view class="function-title">退出登录</view>
						<view class="function-desc">安全退出当前账号</view>
					</view>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>
			</view> -->
		</view>

		<!-- 版本信息 -->
		<view class="app-version">
			<text>TangZhi记账 v1.0.0</text>
		</view>
	</view>
</template>

<script>
	import statsDb from '@/db/dto/stats'
	export default {
		data() {
			return {
				// 用户信息
				userInfo: {
					id: '',
					nickname: '',
					avatar: ''
				},
				// 统计数据
				stats: {
					days: 0,
					records: 0
				}
			}
		},
		mounted() {

			// 加载统计数据
			this.loadStats()
		},
		methods: {

			// 加载统计数据
			loadStats() {
				// 从数据库获取统计数据
				statsDb.getStats().then(stats => {
					console.log('获取统计数据成功:', stats);
					this.stats = stats;
				}).catch(error => {
					console.error('获取统计数据失败:', error);
					// 加载失败时使用默认值
					this.stats = {
						days: 0,
						records: 0
					};
				});
			},



			// 页面导航
			navigateToPage(url) {
				// 实际应用中应该跳转到对应页面
				uni.showToast({
					title: '跳转到: ' + url,
					icon: 'none'
				})
				// uni.navigateTo({
				//   url: url
				// })
			},

			// 跳转到分类管理页面
			navigateToCategory() {
				uni.navigateTo({
					url: '/pages/category/index'
				})
			},

			// 跳转到账户管理页面
			navigateToAccount() {
				uni.navigateTo({
					url: '/pages/account/index'
				})
			},

			// 跳转到标签管理页面
			navigateToTag() {
				uni.navigateTo({
					url: '/pages/tag/index'
				})
			}
		}
	}
</script>

<style>
	.my-container {
		padding: 20rpx;
	}


	.stats-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}

	.stats-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.stats-value {
		font-size: 40rpx;
		font-weight: bold;
		color: #5677fc;
		margin-bottom: 10rpx;
	}

	.stats-label {
		font-size: 24rpx;
		color: #909399;
	}

	.stats-divider {
		width: 2rpx;
		height: 80rpx;
		background-color: #f5f5f5;
	}

	.function-list {
		margin-bottom: 30rpx;
	}

	.function-group {
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.function-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.function-item:last-child {
		border-bottom: none;
	}

	.function-icon {
		margin-right: 20rpx;
		background-color: #f8f8f8;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.function-info {
		flex: 1;
	}

	.function-title {
		font-size: 28rpx;
		color: #303133;
		margin-bottom: 6rpx;
	}

	.function-desc {
		font-size: 24rpx;
		color: #909399;
	}

	.app-version {
		text-align: center;
		padding: 40rpx 0;
		font-size: 24rpx;
		color: #c0c4cc;
	}

	/* 添加图标字体样式 */
	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_3094754_ux2jvypv2ij.woff2?t=1640936657917') format('woff2');
	}

	.iconfont {
		font-family: 'iconfont';
		font-size: 40rpx;
		color: #5677fc;
	}

	.arrow-icon {
		font-size: 28rpx;
		color: #c0c4cc;
	}

	.icon-calendar:before {
		content: '\e6b5';
	}

	.icon-account:before {
		content: '\e614';
	}

	.icon-grid:before {
		content: '\e627';
	}

	.icon-tags:before {
		content: '\e893';
	}

	.icon-reload:before {
		content: '\e788';
	}

	.icon-setting:before {
		content: '\e78e';
	}

	.icon-close-circle:before {
		content: '\e77d';
		color: #f56c6c;
	}

	.icon-arrow-right:before {
		content: '\e743';
	}
</style>