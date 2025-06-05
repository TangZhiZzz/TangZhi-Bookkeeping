<template>
	<view class="transaction-detail-container">
		<!-- 自定义导航栏 -->
		<custom-navbar title="账单详情" :showLeft="true" @leftClick="goBack"></custom-navbar>
		
		<!-- 交易详情卡片 -->
		<view class="detail-card" v-if="transaction">
			<!-- 金额信息 -->
			<view class="amount-section">
				<view class="amount" :class="transaction.type === 'expense' ? 'expense' : 'income'">
					{{transaction.type === 'expense' ? '-' : '+'}}¥ {{transaction.amount}}
				</view>
				<view class="transaction-type">
					{{transaction.type === 'expense' ? '支出' : '收入'}}
				</view>
			</view>
			
			<!-- 详细信息列表 -->
			<view class="detail-list">
				<!-- 分类 -->
				<view class="detail-item">
					<view class="detail-label">分类</view>
					<view class="detail-value category-value">
						<view class="category-icon">
							<svg-icon 
								:name="transaction.categoryIcon" 
								:color="transaction.type === 'expense' ? '#f56c6c' : '#67c23a'"
								size="40"
							></svg-icon>
						</view>
						<text>{{transaction.categoryName}}</text>
					</view>
				</view>
				
				<!-- 日期 -->
				<view class="detail-item">
					<view class="detail-label">日期</view>
					<view class="detail-value">{{transaction.transaction_date}}</view>
				</view>
				
				<!-- 备注 -->
				<view class="detail-item" v-if="transaction.remark">
					<view class="detail-label">备注</view>
					<view class="detail-value">{{transaction.remark}}</view>
				</view>
				
				<!-- 创建时间 -->
				<view class="detail-item">
					<view class="detail-label">创建时间</view>
					<view class="detail-value">{{formatDateTime(transaction.created_at)}}</view>
				</view>
				
				<!-- 更新时间 -->
				<view class="detail-item">
					<view class="detail-label">更新时间</view>
					<view class="detail-value">{{formatDateTime(transaction.updated_at)}}</view>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-buttons" v-if="transaction">
			<!-- <button class="edit-btn" @click="editTransaction">编辑</button> -->
			<button class="delete-btn" @click="showDeleteConfirm">删除</button>
		</view>
		
		<!-- 删除确认弹窗 -->
		<view class="custom-popup-mask" v-if="showDeletePopup" @click="hideDeletePopup"></view>
		<view class="custom-popup-content custom-popup-center" v-if="showDeletePopup" @click.stop>
			<view class="custom-dialog">
				<view class="custom-dialog-title">确认删除</view>
				<view class="custom-dialog-content">确定要删除这条记账记录吗？</view>
				<view class="custom-dialog-buttons">
					<view class="custom-dialog-button" @click="hideDeletePopup">取消</view>
					<view class="custom-dialog-button confirm" @click="confirmDelete">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import transactionsDb from '@/db/dto/transactions'
	
	export default {
		data() {
			return {
				transactionId: null,
				transaction: null,
				showDeletePopup: false
			}
		},
		onLoad(options) {
			// 获取传递的交易ID
			if (options.id) {
				this.transactionId = options.id;
				this.loadTransactionDetail();
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 加载交易详情
			loadTransactionDetail() {
				// 构建查询条件
				const whereClause = `a.id = ${this.transactionId}`;
				
				// 查询交易记录
				transactionsDb.selectTransactionList(-1, -1, whereClause).then(res => {
					if (res && res.length > 0) {
						this.transaction = res[0];
					} else {
						uni.showToast({
							title: '未找到交易记录',
							icon: 'none'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				}).catch(error => {
					console.error('加载交易详情失败:', error);
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				});
			},
			
			// 格式化日期时间
			formatDateTime(dateTimeStr) {
				if (!dateTimeStr) return '';
				
				const date = new Date(dateTimeStr);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');
				const seconds = date.getSeconds().toString().padStart(2, '0');
				
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			
			// 编辑交易
			// editTransaction() {
			// 	// 跳转到编辑页面
			// 	uni.navigateTo({
			// 		url: `/pages/transaction/edit?id=${this.transactionId}`
			// 	});
			// },
			
			// 显示删除确认弹窗
			showDeleteConfirm() {
				this.showDeletePopup = true;
			},
			
			// 隐藏删除确认弹窗
			hideDeletePopup() {
				this.showDeletePopup = false;
			},
			
			// 确认删除
			confirmDelete() {
				if (!this.transactionId) return;
				
				transactionsDb.deleteTransaction(this.transactionId).then(() => {
					// 删除成功后返回上一页
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					
					// 隐藏弹窗
					this.hideDeletePopup();
					
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}).catch(error => {
					console.error('删除失败:', error);
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				});
			}
		}
	}
</script>

<style>
	.transaction-detail-container {
		padding: 20rpx;
		padding-top: calc(90rpx + var(--status-bar-height));
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	/* 详情卡片 */
	.detail-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}
	
	/* 金额部分 */
	.amount-section {
		padding: 40rpx 30rpx;
		text-align: center;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.amount {
		font-size: 60rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.amount.expense {
		color: #f56c6c;
	}
	
	.amount.income {
		color: #67c23a;
	}
	
	.transaction-type {
		font-size: 28rpx;
		color: #909399;
	}
	
	/* 详情列表 */
	.detail-list {
		padding: 20rpx 0;
	}
	
	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.detail-item:last-child {
		border-bottom: none;
	}
	
	.detail-label {
		font-size: 28rpx;
		color: #909399;
	}
	
	.detail-value {
		font-size: 28rpx;
		color: #333333;
		text-align: right;
		word-break: break-all;
	}
	
	/* 分类值的特殊样式 */
	.category-value {
		display: flex;
		align-items: center;
	}
	
	.category-icon {
		margin-right: 10rpx;
		background-color: #f8f8f8;
		border-radius: 50%;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	/* 操作按钮 */
	.action-buttons {
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
	}
	
	.edit-btn, .delete-btn {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
		margin: 0 10rpx;
	}
	
	.edit-btn {
		background-color: #5677fc;
		color: #ffffff;
	}
	
	.delete-btn {
		background-color: #f56c6c;
		color: #ffffff;
	}
	
	/* 弹窗样式 */
	.custom-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 998;
	}
	
	.custom-popup-content {
		position: fixed;
		z-index: 999;
	}
	
	.custom-popup-center {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
	}
	
	.custom-dialog {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.custom-dialog-title {
		padding: 30rpx;
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.custom-dialog-content {
		padding: 40rpx 30rpx;
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}
	
	.custom-dialog-buttons {
		display: flex;
		border-top: 2rpx solid #f5f5f5;
	}
	
	.custom-dialog-button {
		flex: 1;
		padding: 20rpx 0;
		text-align: center;
		font-size: 30rpx;
		color: #333;
	}
	
	.custom-dialog-button.confirm {
		color: #5677fc;
		border-left: 2rpx solid #f5f5f5;
	}
</style>