<template>
	<view class="category-edit-page">
		<!-- 使用封装的自定义导航栏组件 -->
		<custom-navbar :title="isEdit ? '编辑分类' : '添加分类'" @leftClick="goBack" @rightClick="showDeleteConfirm"
			:showRight="isEdit" rightIcon="close" rightIconColor="#ff5a5f"></custom-navbar>

		<!-- 表单内容 -->
		<view class="form-container">
			<!-- 分类名称 -->
			<view class="form-item">
				<view class="form-label">分类名称</view>
				<view class="form-input">
					<input type="text" v-model="categoryForm.name" placeholder="请输入分类名称"
						placeholder-class="input-placeholder" />
				</view>
			</view>

			<!-- 分类图标 -->
			<view class="form-item">
				<view class="form-label">分类图标</view>
				<view class="form-input" @click="showIconSelector">
					<view class="selected-icon">
						<svg-icon :name="categoryForm.icon || 'food'"
							:color="categoryForm.type === 'expense' ? '#f56c6c' : '#67c23a'" size="48"></svg-icon>
					</view>
					<view class="selected-value">{{selectedValue||'选择图标'}}</view>
					<svg-icon name="right" color="#c0c4cc" size="32"></svg-icon>
				</view>
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="btn-container">
			<button class="save-btn" @click="saveCategory">保存</button>
		</view>

		<!-- 图标选择器 -->
		<view class="custom-popup" v-if="showIconPopup">
			<view class="custom-popup-mask" @click="hideIconSelector"></view>
			<view class="custom-popup-content custom-popup-bottom">
				<view class="popup-container">
					<view class="popup-header">
						<view class="popup-title">选择图标</view>
						<view class="popup-close" @click="hideIconSelector">
							<svg-icon name="close" color="#333333" size="32"></svg-icon>
						</view>
					</view>
					<view class="popup-content">
						<view class="icon-item" v-for="(item, index) in iconList" :key="index" @click="selectIcon(item)"
							:class="{'icon-selected': categoryForm.icon === item.icon}">
							<view class="icon-wrapper">
								<svg-icon :name="item.icon"
									:color="categoryForm.type === 'expense' ? '#f56c6c' : '#67c23a'"
									size="48"></svg-icon>
								<text class="icon-name">{{item.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 删除确认弹窗 -->
		<view class="custom-popup" v-if="showDeletePopup">
			<view class="custom-popup-mask" @click="hideDeleteConfirm"></view>
			<view class="custom-popup-content custom-popup-center">
				<view class="custom-dialog">
					<view class="custom-dialog-title">
						<text class="custom-dialog-title-text">删除分类</text>
					</view>
					<view class="custom-dialog-content">
						<text class="custom-dialog-content-text">确定要删除该分类吗？删除后无法恢复，且相关记账数据将失去分类关联。</text>
					</view>
					<view class="custom-dialog-buttons">
						<view class="custom-dialog-button" @click="hideDeleteConfirm">
							<text class="custom-dialog-button-text">取消</text>
						</view>
						<view class="custom-dialog-button custom-dialog-button-primary" @click="confirmDelete">
							<text class="custom-dialog-button-text custom-dialog-button-text-primary">确定</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import iconCategories from '@/static/icons/icon-categories.json';
	import categoryDb from '@/db/dto/category'
	import {
		computed
	} from 'vue';
	export default {
		data() {
			return {
				isEdit: false,
				categoryId: null,
				categoryType: 'expense',
				showIconPopup: false,
				showDeletePopup: false,
				selectedValue: null,
				categoryForm: {
					name: '',
					icon: 'food',
					type: 'expense'
				}

			}
		},
		computed: {
			iconList() {
				if (this.categoryForm.type === 'expense') {
					return iconCategories.expense_categories;
				} else {
					return iconCategories.income_categories;
				}
			}

		},
		onLoad(options) {
			console.log(options)
			// 设置分类类型
			if (options.type) {
				this.categoryType = options.type
				this.categoryForm.type = options.type
			}

			// 判断是编辑还是新增
			if (options.id) {
				this.isEdit = true
				this.categoryId = options.id
				this.loadCategoryDetail(options.id)
			} else {
				// 新增分类，设置默认图标
				if (this.categoryForm.type === 'expense') {
					this.categoryForm.icon = 'food'
				} else {
					this.categoryForm.icon = 'rmb-circle'
				}
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},

			// 加载分类详情
			loadCategoryDetail(id) {
				try {

					categoryDb.selectCategory(id).then(res => {

						const {
							id,
							...rest
						} = res[0];
						this.categoryForm = rest;

					})

				} catch (error) {
					console.error('加载分类详情失败:', error)
					uni.showToast({
						title: '加载分类详情失败',
						icon: 'none'
					})
				}
			},

			// 显示图标选择器
			showIconSelector() {
				this.showIconPopup = true
			},

			// 隐藏图标选择器
			hideIconSelector() {
				this.showIconPopup = false
			},

			// 选择图标
			selectIcon(item) {
				this.categoryForm.icon = item.icon
				this.selectedValue = item.name
				this.hideIconSelector()
			},

			// 保存分类
			saveCategory() {
				// 表单验证
				if (!this.categoryForm.name) {
					uni.showToast({
						title: '请输入分类名称',
						icon: 'none'
					})
					return
				}

				try {

					if (this.isEdit) {
						categoryDb.updateCategory(this.categoryId, this.categoryForm)
					} else {
						categoryDb.insertCategory(this.categoryForm)
					}

					// 提示保存成功
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})

					// 返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('保存分类失败:', error)
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					})
				}
			},

			// 显示删除确认弹窗
			showDeleteConfirm() {
				this.showDeletePopup = true
			},

			// 隐藏删除确认弹窗
			hideDeleteConfirm() {
				this.showDeletePopup = false
			},

			// 确认删除
			confirmDelete() {
				try {

					categoryDb.deleteCategory(this.categoryId)
					this.hideDeleteConfirm()
					// 提示删除成功
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})

					// 返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('删除分类失败:', error)
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.category-edit-page {
		background-color: #f5f5f5;
		height: 100vh;
		overflow: hidden;
	}

	/* 表单容器 */
	.form-container {
		padding: 20rpx;
		margin-top: calc(90rpx + var(--status-bar-height));
		background-color: #ffffff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	/* 表单项 */
	.form-item {
		padding: 30rpx 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.form-item:last-child {
		border-bottom: none;
	}

	.form-label {
		font-size: 28rpx;
		color: #606266;
		margin-bottom: 16rpx;
	}

	.form-input {
		display: flex;
		align-items: center;
	}

	.form-input input {
		flex: 1;
		height: 80rpx;
		font-size: 32rpx;
		color: #333333;
	}

	.input-placeholder {
		color: #c0c4cc;
	}

	/* 选择图标样式 */
	.selected-icon {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		background-color: #f5f7fa;
		border-radius: 50%;
		padding: 10rpx;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.selected-value {
		flex: 1;
		font-size: 32rpx;
		color: #333333;
	}

	/* 保存按钮 */
	.btn-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30rpx 20rpx;
		background-color: #ffffff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 99;
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	}

	.save-btn {
		background: linear-gradient(to right, #5677fc, #5c8dff);
		color: #ffffff;
		border-radius: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		box-shadow: 0 10rpx 20rpx rgba(86, 119, 252, 0.2);
	}

	/* 弹窗样式 */
	.popup-container {
		background-color: #ffffff;
		border-radius: 24rpx 24rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.popup-close {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-content {
		padding: 20rpx 10rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		max-height: 60vh;
		overflow-y: auto;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}

	/* 自定义滚动条样式 */
	.popup-content::-webkit-scrollbar {
		width: 6rpx;
	}

	.popup-content::-webkit-scrollbar-thumb {
		background-color: #dcdfe6;
		border-radius: 3rpx;
	}

	.popup-content::-webkit-scrollbar-track {
		background-color: #f5f7fa;
	}

	.icon-item {
		width: 20%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		position: relative;
	}

	.icon-wrapper {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		transition: all 0.3s ease;
	}

	.icon-item:active .icon-wrapper {
		transform: scale(0.95);
		background-color: #f0f0f0;
	}

	.icon-selected .icon-wrapper {
		background-color: rgba(86, 119, 252, 0.1);
		border: 2rpx solid #5677fc;
		box-shadow: 0 0 10rpx rgba(86, 119, 252, 0.2);
	}

	.icon-selected::after {
		content: '';
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #5677fc;
		z-index: 1;
	}

	.icon-name {
		font-size: 24rpx;
		color: #606266;
		margin-top: 10rpx;
		text-align: center;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 开关样式 */
	.switch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.switch-item .form-label {
		margin-bottom: 0;
	}

	/* 自定义弹窗样式 */
	.custom-popup {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		overflow: hidden;
	}

	.custom-popup-mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		opacity: 1;
		transition: opacity 0.3s;
	}

	.custom-popup-content {
		position: absolute;
		transition: all 0.3s;
	}

	.custom-popup-bottom {
		left: 0;
		right: 0;
		bottom: 0;
	}

	.custom-popup-center {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		max-width: 600rpx;
	}

	/* 自定义对话框样式 */
	.custom-dialog {
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.custom-dialog-title {
		padding: 30rpx 30rpx 10rpx;
		text-align: center;
	}

	.custom-dialog-title-text {
		font-size: 34rpx;
		font-weight: bold;
		color: #f56c6c;
	}

	.custom-dialog-content {
		padding: 30rpx;
		text-align: center;
	}

	.custom-dialog-content-text {
		font-size: 28rpx;
		color: #606266;
		line-height: 1.5;
	}

	.custom-dialog-buttons {
		display: flex;
		border-top: 1px solid #f0f0f0;
	}

	.custom-dialog-button {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		color: #606266;
	}

	.custom-dialog-button-primary {
		color: #f56c6c;
		font-weight: bold;
		border-left: 1px solid #f0f0f0;
	}

	.custom-dialog-button-text {
		font-size: 32rpx;
	}

	.custom-dialog-button-text-primary {
		color: #f56c6c;
	}
</style>