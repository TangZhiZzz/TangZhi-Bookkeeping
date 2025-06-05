<template>
	<view class="container">
		<!-- 使用封装的自定义导航栏组件 -->
		<custom-navbar 
			title="图标示例" 
			@leftClick="goBack"
		></custom-navbar>
		
		<!-- 通用图标 -->
		<view class="section">
			<view class="section-title">通用图标</view>
			<view class="icon-grid">
				<view class="icon-item" v-for="(icon, index) in commonIcons" :key="index">
					<svg-icon :name="icon.name" color="#5677fc"></svg-icon>
					<text class="icon-name">{{icon.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 支出分类图标 -->
		<view class="section">
			<view class="section-title">支出分类图标</view>
			<view class="icon-grid">
				<view class="icon-item" v-for="(category, index) in expenseCategories" :key="index">
					<svg-icon :name="category.icon" color="#f56c6c"></svg-icon>
					<text class="icon-name">{{category.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 收入分类图标 -->
		<view class="section">
			<view class="section-title">收入分类图标</view>
			<view class="icon-grid">
				<view class="icon-item" v-for="(category, index) in incomeCategories" :key="index">
					<svg-icon :name="category.icon" color="#67c23a"></svg-icon>
					<text class="icon-name">{{category.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 不同尺寸 -->
		<view class="section">
			<view class="section-title">不同尺寸</view>
			<view class="size-demo">
				<svg-icon name="home" color="#5677fc" size="24"></svg-icon>
				<svg-icon name="home" color="#5677fc" size="32"></svg-icon>
				<svg-icon name="home" color="#5677fc" size="48"></svg-icon>
				<svg-icon name="home" color="#5677fc" size="64"></svg-icon>
			</view>
		</view>
		
		<!-- 不同颜色 -->
		<view class="section">
			<view class="section-title">不同颜色</view>
			<view class="color-demo">
				<svg-icon name="plus-circle" color="#5677fc"></svg-icon>
				<svg-icon name="plus-circle" color="#f56c6c"></svg-icon>
				<svg-icon name="plus-circle" color="#67c23a"></svg-icon>
				<svg-icon name="plus-circle" color="#909399"></svg-icon>
			</view>
		</view>
		
		<!-- 在表单中的应用 -->
		<view class="section">
			<view class="section-title">在表单中的应用</view>
			<view class="form-demo">
				<view class="form-item">
					<text class="form-label">分类</text>
					<view class="form-value">
						<text>餐饮</text>
						<svg-icon name="right" color="#c0c4cc" size="30"></svg-icon>
					</view>
				</view>
				<view class="form-item">
					<text class="form-label">日期</text>
					<view class="form-value">
						<text>2023-05-15</text>
						<svg-icon name="right" color="#c0c4cc" size="30"></svg-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import iconCategories from '@/static/icons/icon-categories.json';
	import iconsData from '@/static/icons/icons.json';
	
	export default {
		data() {
			return {
				expenseCategories: [],
				incomeCategories: [],
				commonIcons: []
			}
		},
		onLoad() {
			// 加载支出和收入分类
			this.expenseCategories = iconCategories.expense_categories;
			this.incomeCategories = iconCategories.income_categories;
			
			// 加载通用图标
			this.commonIcons = iconsData.icons.filter(icon => icon.category === 'common');
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f8f8f8;
		margin-top: calc(90rpx + var(--status-bar-height));
	}
	
	/* 页面标题已由自定义导航栏替代 */
	
	.section {
		margin-bottom: 40rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333333;
	}
	
	.icon-grid {
		display: flex;
		flex-wrap: wrap;
	}
	
	.icon-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
	}
	
	.icon-name {
		font-size: 24rpx;
		color: #606266;
		margin-top: 10rpx;
	}
	
	.size-demo {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx 0;
	}
	
	.color-demo {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx 0;
	}
	
	.form-demo {
		padding: 10rpx 0;
	}
	
	.form-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.form-label {
		width: 160rpx;
		font-size: 30rpx;
		color: #333333;
	}
	
	.form-value {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>