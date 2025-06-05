<template>
	<view class="category-page">
		<!-- 使用封装的自定义导航栏组件 -->
		<custom-navbar title="分类管理" @leftClick="goBack"></custom-navbar>

		<!-- 分类列表 -->
		<view class="category-list">
			<!-- 支出分类 -->
			<view class="category-group">
				<view class="group-header">
					<view class="group-title">支出分类</view>
					<view class="group-action" @click="addCategory('expense')">
						<svg-icon name="plus-circle" color="#5677fc" size="32"></svg-icon>
						<text>添加</text>
					</view>
				</view>

				<view class="empty-list" v-if="expenseCategories.length === 0">
					<view class="empty-content">
						<text class="empty-text">暂无支出分类，点击添加按钮创建</text>
					</view>
				</view>

				<view class="category-item" v-for="(item, index) in expenseCategories" :key="'expense-'+index"
					@click="editCategory(item)">
					<view class="category-icon">
						<svg-icon :name="item.icon" color="#f56c6c" size="48"></svg-icon>
					</view>
					<view class="category-info">
						<view class="category-name">{{item.name}}</view>
					</view>
					<view class="category-arrow">
						<svg-icon name="right" color="#c0c4cc" size="32"></svg-icon>
					</view>
				</view>
			</view>

			<!-- 收入分类 -->
			<view class="category-group">
				<view class="group-header">
					<view class="group-title">收入分类</view>
					<view class="group-action" @click="addCategory('income')">
						<svg-icon name="plus-circle" color="#5677fc" size="32"></svg-icon>
						<text>添加</text>
					</view>
				</view>

				<view class="empty-list" v-if="incomeCategories.length === 0">
					<view class="empty-content">
						<text class="empty-text">暂无收入分类，点击添加按钮创建</text>
					</view>
				</view>

				<view class="category-item" v-for="(item, index) in incomeCategories" :key="'income-'+index"
					@click="editCategory(item)">
					<view class="category-icon">
						<svg-icon :name="item.icon" color="#67c23a" size="48"></svg-icon>
					</view>
					<view class="category-info">
						<view class="category-name">{{item.name}}</view>
					</view>
					<view class="category-arrow">
						<svg-icon name="right" color="#c0c4cc" size="32"></svg-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import categoryDb from '@/db/dto/category'
	export default {
		data() {
			return {
				expenseCategories: [],
				incomeCategories: []
			}
		},
		onLoad() {

		},
		onShow() {
			// 加载分类列表
			this.loadCategories()
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},

			// 加载分类列表
			loadCategories() {
				try {
					categoryDb.selectCategoryList().then((res) => {
						console.log(res)
						this.incomeCategories = res.filter(n => n.type == 'income')
						this.expenseCategories = res.filter(n => n.type == 'expense')
					})

				} catch (error) {
					console.error('加载分类列表失败:', error)
					uni.showToast({
						title: '加载分类列表失败',
						icon: 'none'
					})
				}
			},

			// 添加分类
			addCategory(type) {
				uni.navigateTo({
					url: `/pages/category/edit?type=${type}`
				})
			},

			// 编辑分类
			editCategory(category) {
				uni.navigateTo({
					url: `/pages/category/edit?id=${category.id}&type=${category.type}`
				})
			}
		}
	}
</script>

<style>
	.category-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 分类列表样式 */
	.category-list {
		padding: 20rpx;
		margin-top: calc(90rpx + var(--status-bar-height));
	}

	.category-group {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}

	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f0f0f0;
		margin-bottom: 20rpx;
	}

	.group-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.group-action {
		display: flex;
		align-items: center;
		color: #5677fc;
		font-size: 28rpx;
	}

	.group-action text {
		margin-left: 8rpx;
	}

	.category-item {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.category-item:last-child {
		border-bottom: none;
	}

	.category-icon {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
	}

	.category-info {
		flex: 1;
	}

	.category-name {
		font-size: 32rpx;
		color: #333333;
	}

	.category-arrow {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.empty-list {
		padding: 40rpx 0;
	}

	.empty-content {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #909399;
	}
</style>