<template>
	<view class="account-container">
		<view class="form-card">
			<view class="form-header">
				<view class="tab-group">
					<view class="tab-item" :class="{active: formData.type === 'expense'}"
						@click="formData.type = 'expense'">
						支出
					</view>
					<view class="tab-item" :class="{active: formData.type === 'income'}"
						@click="formData.type = 'income'">
						收入
					</view>
				</view>
			</view>

			<view class="amount-input">
				<text class="currency-symbol">¥</text>
				<input type="digit" v-model="formData.amount" placeholder="0.00" placeholder-class="amount-placeholder"
					class="amount-field" focus confirm-type="done" />
			</view>

			<view class="form-item" @click="showCategoryPopup">
				<text class="form-label">分类</text>
				<view class="form-value">
					<text v-if="formData.categoryName">{{formData.categoryName}}</text>
					<text v-else class="placeholder">请选择分类</text>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>
				</view>
			</view>

			<view class="form-item">
				<text class="form-label">日期</text>
				<view class="form-value">
					<picker mode="date" :value="formData.transaction_date" @change="onDateChange">
						<view class="picker-value">
							<text>{{formatDate(formData.transaction_date)}}</text>
						</view>
					</picker>
					<svg-icon name="right" color="#909399" size="32"></svg-icon>

				</view>
			</view>

			<view class="form-item">
				<text class="form-label">备注</text>
				<view class="form-value">
					<input type="text" v-model="formData.remark" placeholder="添加备注" placeholder-class="placeholder"
						class="remark-field" />
				</view>
			</view>

			<view class="form-actions">
				<button class="reset-btn" @click="resetForm">重置</button>
				<button class="save-btn" @click="saveRecord">保存</button>
			</view>
		</view>

		<!-- 分类选择弹窗 -->
		<view class="popup-container" v-if="showPopup" @click="closePopup">
			<view class="popup-mask"></view>
			<view class="popup-content" @click.stop="">
				<view class="popup-header">
					<text>选择分类</text>
					<view @click="closePopup"> <svg-icon name="close" color="#909399" size="40"></svg-icon>
					</view>
				</view>
				<view class="category-list">
					<view class="category-item" v-for="(item, index) in currentCategories" :key="index"
						@click="selectCategory(item)">
						<view class="category-icon">
							<svg-icon :name="item.icon" :color="formData.type === 'expense' ? '#f56c6c' : '#67c23a'"
								size="60"></svg-icon>
						</view>
						<text class="category-name">{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import categoryDb from '@/db/dto/category'
	import transactionsDb from '@/db/dto/transactions'
	export default {
		data() {
			return {
				formData: {
					type: 'expense',
					amount: '',
					category_id: '',
					categoryName: '',
					categoryIcon: '',
					transaction_date: new Date().toISOString().split('T')[0],
					remark: ''
				},
				showPopup: false,
				expenseCategories: [],
				incomeCategories: []
			}
		},
		computed: {
			currentCategories() {
				return this.formData.type === 'expense' ? this.expenseCategories : this.incomeCategories
			}
		},
		mounted() {
			// 加载分类数据
			this.loadCategories()
		},
		methods: {
			// 加载分类数据
			loadCategories() {
				try {
					categoryDb.selectCategoryList().then((res) => {
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

			// 显示分类选择弹窗
			showCategoryPopup() {
				this.showPopup = true
			},

			// 关闭分类选择弹窗
			closePopup() {
				this.showPopup = false
			},

			// 选择分类
			selectCategory(category) {
				this.formData.category_id = category.id
				this.formData.categoryName = category.name
				this.formData.categoryIcon = category.icon
				this.closePopup()
			},

			// 日期选择变化
			onDateChange(e) {
				this.formData.date = e.detail.value
			},

			// 格式化日期
			formatDate(dateStr) {
				if (!dateStr) return ''
				const date = new Date(dateStr)
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')
				return `${year}-${month}-${day}`
			},

			// 保存记录
			saveRecord() {
				// 表单验证
				if (!this.formData.amount) {
					uni.showToast({
						title: '请输入金额',
						icon: 'none'
					})
					return
				}

				if (!this.formData.category_id) {
					uni.showToast({
						title: '请选择分类',
						icon: 'none'
					})
					return
				}

				const {
					categoryName,
					categoryIcon,
					...rest
				} = this.formData
				// 构建记录数据
				const record = {
					...rest,
					amount: parseFloat(this.formData.amount)
				}
				console.log(record)
				console.log(transactionsDb)
				transactionsDb.insertTransaction(record).then(res=>{
					console.log(res)
					// 模拟保存成功
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
					
					// 重置表单
					this.resetForm()
				})
				
			},

			// 重置表单
			resetForm() {
				const type=this.formData.type;
				this.formData =  {
					type: type,
					amount: '',
					category_id: '',
					categoryName: '',
					categoryIcon: '',
					transaction_date: new Date().toISOString().split('T')[0],
					remark: ''
				}
			}
		}
	}
</script>

<style>
	.account-container {
		padding: 20rpx;
	}

	.form-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.form-header {
		margin-bottom: 30rpx;
	}

	.tab-group {
		display: flex;
		border-radius: 8rpx;
		overflow: hidden;
		border: 2rpx solid #5677fc;
		width: 400rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		font-size: 28rpx;
		color: #5677fc;
	}

	.tab-item.active {
		background-color: #5677fc;
		color: #ffffff;
	}

	.amount-input {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
		margin-bottom: 30rpx;
	}

	.currency-symbol {
		font-size: 60rpx;
		margin-right: 20rpx;
		color: #333333;
	}

	.amount-field {
		flex: 1;
		font-size: 60rpx;
		height: 80rpx;
	}

	.amount-placeholder {
		color: #c0c4cc;
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

	.placeholder {
		color: #c0c4cc;
	}

	.picker-value {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.remark-field {
		width: 100%;
	}

	.form-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 50rpx;
	}

	.reset-btn {
		flex: 1;
		margin-right: 20rpx;
		background-color: #f8f8f8;
		color: #333333;
		border: none;
		font-size: 30rpx;
	}

	.save-btn {
		flex: 1;
		margin-left: 20rpx;
		background-color: #5677fc;
		color: #ffffff;
		border: none;
		font-size: 30rpx;
	}

	/* 弹窗样式 */
	.popup-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}

	.popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.popup-content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ffffff;
		border-radius: 24rpx 24rpx 0 0;
		padding-bottom: 30rpx;
		max-height: 70vh;
		overflow-y: auto;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.category-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
	}

	.category-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
	}

	.category-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #f8f8f8;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.category-name {
		font-size: 24rpx;
		color: #333333;
	}

	/* 添加图标字体样式 */
	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_3094754_ux2jvypv2ij.woff2?t=1640936657917') format('woff2');
	}

	.iconfont {
		font-family: 'iconfont';
		font-size: 40rpx;
	}

	.icon-right:before {
		content: '\e6a3';
		color: #c0c4cc;
		font-size: 30rpx;
	}

	.icon-close:before {
		content: '\e6a2';
		color: #909399;
		font-size: 36rpx;
	}

	.icon-food:before {
		content: '\e7d0';
		color: #5677fc;
	}

	.icon-car:before {
		content: '\e7d7';
		color: #5677fc;
	}

	.icon-shopping-cart:before {
		content: '\e7cf';
		color: #5677fc;
	}

	.icon-video:before {
		content: '\e7c8';
		color: #5677fc;
	}

	.icon-rmb-circle:before {
		content: '\e7df';
		color: #5677fc;
	}

	.icon-gift:before {
		content: '\e7b4';
		color: #5677fc;
	}

	.icon-graph:before {
		content: '\e7b2';
		color: #5677fc;
	}
</style>