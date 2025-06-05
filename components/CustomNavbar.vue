<template>
	<view class="custom-navbar">
		<!-- 左侧区域 -->
		<view class="navbar-left" @click="handleLeftClick" v-if="showLeft">
			<slot name="left">
				<svg-icon name="right" :color="leftIconColor" :size="leftIconSize" style="transform: rotate(180deg);"></svg-icon>
			</slot>
		</view>
		<view class="navbar-left" v-else></view>
		
		<!-- 标题区域 -->
		<view class="navbar-title">
			<slot name="title">
				{{ title }}
			</slot>
		</view>
		
		<!-- 右侧区域 -->
		<view class="navbar-right" @click="handleRightClick" v-if="showRight">
			<slot name="right">
				<svg-icon v-if="rightIcon" :name="rightIcon" :color="rightIconColor" :size="rightIconSize"></svg-icon>
			</slot>
		</view>
		<view class="navbar-right" v-else></view>
	</view>
</template>

<script>
	export default {
		name: 'CustomNavbar',
		props: {
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 是否显示左侧按钮
			showLeft: {
				type: Boolean,
				default: true
			},
			// 是否显示右侧按钮
			showRight: {
				type: Boolean,
				default: false
			},
			// 左侧图标颜色
			leftIconColor: {
				type: String,
				default: '#333333'
			},
			// 左侧图标大小
			leftIconSize: {
				type: [Number, String],
				default: 32
			},
			// 右侧图标
			rightIcon: {
				type: String,
				default: ''
			},
			// 右侧图标颜色
			rightIconColor: {
				type: String,
				default: '#333333'
			},
			// 右侧图标大小
			rightIconSize: {
				type: [Number, String],
				default: 32
			},
			// 是否固定在顶部
			fixed: {
				type: Boolean,
				default: true
			},
			// 是否显示阴影
			shadow: {
				type: Boolean,
				default: true
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			}
		},
		methods: {
			// 左侧按钮点击事件
			handleLeftClick() {
				this.$emit('leftClick')
				// 默认行为是返回上一页
				uni.navigateBack({
					delta: 1
				})
			},
			// 右侧按钮点击事件
			handleRightClick() {
				this.$emit('rightClick')
			}
		}
	}
</script>

<style>
	/* 自定义导航栏样式 */
	.custom-navbar {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		padding-top: var(--status-bar-height);
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
	}
	
	.navbar-left, .navbar-right {
		width: 80rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.navbar-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		flex: 1;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>