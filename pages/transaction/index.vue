<template>
	<view class="transaction-list-container">
		<!-- 自定义导航栏 -->
		<custom-navbar title="账单明细" :showLeft="true" @leftClick="goBack"></custom-navbar>
		
		<!-- 年月选择器 -->
		<view class="date-selector">
			<picker mode="date" fields="month" :value="currentDate" @change="onDateChange">
				<view class="date-picker">
					<text class="date-text">{{formatYearMonth(currentDate)}}</text>
					<view class="date-icon">
						<text class="arrow-down">▼</text>
					</view>
				</view>
			</picker>
		</view>
		
		<!-- 统计信息 -->
		<view class="statistics-card">
			<view class="statistics-item">
				<text class="statistics-label">收入</text>
				<text class="statistics-value income">¥ {{monthlyIncome}}</text>
			</view>
			<view class="statistics-divider"></view>
			<view class="statistics-item">
				<text class="statistics-label">支出</text>
				<text class="statistics-value expense">¥ {{monthlyExpense}}</text>
			</view>
			<view class="statistics-divider"></view>
			<view class="statistics-item">
				<text class="statistics-label">结余</text>
				<text class="statistics-value">¥ {{monthlyBalance}}</text>
			</view>
		</view>
		
		<!-- 交易列表 -->
		<view class="list-container">
			<view class="empty-list" v-if="transactions.length === 0">
				<view class="empty-content">
					<text class="empty-text">暂无账单记录</text>
				</view>
			</view>
			
			<view v-else>
				<view 
					class="transaction-item"
					v-for="(item, index) in transactions" 
					:key="item.id"
					@touchstart="touchStart(index, $event)"
					@touchmove="touchMove(index, $event)"
					@touchend="touchEnd(index, $event)"
					@click="viewTransactionDetail(item.id)"
				>
					<view class="transaction-content" :style="{transform: 'translateX(' + item.offsetX + 'px)'}">
						<view class="transaction-icon">
							<svg-icon 
								:name="item.categoryIcon" 
								:color="item.type === 'expense' ? '#f56c6c' : '#67c23a'"
								size="60"
							></svg-icon>
						</view>
						<view class="transaction-info">
							<view class="transaction-title">{{item.categoryName}}</view>
							<view class="transaction-remark">{{item.remark}}</view>
							<view class="transaction-time">{{formatDate(item.transaction_date)}}</view>
							
						</view>
						<view class="transaction-amount" :class="item.type === 'expense' ? 'expense' : 'income'">
							{{item.type === 'expense' ? '-' : '+'}}¥ {{item.amount}}
						</view>
					</view>
					<view class="delete-btn" @click="showDeleteConfirm(item)">
						删除
					</view>
				</view>
			</view>
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
				currentDate: new Date().toISOString().split('T')[0], // 当前选择的年月，格式：YYYY-MM-DD
				monthlyIncome: 0,
				monthlyExpense: 0,
				transactions: [],
				startX: 0, // 触摸开始位置
				currentIndex: -1, // 当前操作的项目索引
				showDeletePopup: false, // 是否显示删除确认弹窗
				currentTransaction: null // 当前要删除的交易记录
			}
		},
		computed: {
			monthlyBalance() {
				return this.monthlyIncome - this.monthlyExpense;
			},
			// 当前选择的年月（用于查询）
			currentYearMonth() {
				const date = new Date(this.currentDate);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				return `${year}-${month}`;
			}
		},
		onShow() {
			// 页面显示时加载数据
			this.loadTransactions();
		},
		mounted() {
			// 初始加载数据
			this.loadTransactions();
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 年月选择变化
			onDateChange(e) {
				this.currentDate = e.detail.value;
				this.loadTransactions();
			},
			
			// 格式化年月显示
			formatYearMonth(dateStr) {
				if (!dateStr) return '';
				const date = new Date(dateStr);
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				return `${year}年${month}月`;
			},
			
			// 格式化日期显示
			formatDate(dateStr) {
				if (!dateStr) return '';
				const date = new Date(dateStr);
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${month}-${day}`;
			},
			
			// 加载交易记录
			loadTransactions() {
				// 构建查询条件：当前选择的年月
				const whereClause = `strftime('%Y-%m', transaction_date) = '${this.currentYearMonth}'`;
				
				// 查询交易记录
				transactionsDb.selectTransactionList(-1, -1, whereClause, 'transaction_date desc,id desc').then(res => {
					// 为每条记录添加偏移量属性，用于滑动删除
					this.transactions = res.map(item => {
						return {
							...item,
							offsetX: 0
						};
					});
				});
				
				// 查询当月收入总额
				transactionsDb.selectSumAmount('income', this.currentYearMonth).then(res => {
					this.monthlyIncome = res[0].total || 0;
				});
				
				// 查询当月支出总额
				transactionsDb.selectSumAmount('expense', this.currentYearMonth).then(res => {
					this.monthlyExpense = res[0].total || 0;
				});
			},
			
			// 触摸开始
			touchStart(index, event) {
				// 记录开始触摸的位置
				this.startX = event.touches[0].clientX;
				this.currentIndex = index;
				
				// 重置其他项的偏移量
				this.transactions.forEach((item, idx) => {
					if (idx !== index) {
						item.offsetX = 0;
					}
				});
			},
			
			// 触摸移动
			touchMove(index, event) {
				if (index !== this.currentIndex) return;
				
				const moveX = event.touches[0].clientX;
				const offsetX = moveX - this.startX;
				
				// 只允许向左滑动（显示删除按钮）
				if (offsetX < 0) {
					// 限制最大滑动距离为删除按钮宽度
					const newOffsetX = Math.max(offsetX, -100);
					this.transactions[index].offsetX = newOffsetX;
				} else {
					// 如果已经显示了删除按钮，允许向右滑动关闭
					if (this.transactions[index].offsetX < 0) {
						const newOffsetX = Math.min(0, this.transactions[index].offsetX + (moveX - this.startX));
						this.transactions[index].offsetX = newOffsetX;
						this.startX = moveX;
					}
				}
			},
			
			// 触摸结束
			touchEnd(index, event) {
				if (index !== this.currentIndex) return;
				
				// 根据偏移量决定是否显示删除按钮
				if (this.transactions[index].offsetX < -50) {
					// 如果滑动超过阈值，完全显示删除按钮
					this.transactions[index].offsetX = -100;
				} else {
					// 否则恢复原位
					this.transactions[index].offsetX = 0;
				}
				
				this.currentIndex = -1;
			},
			
			// 显示删除确认弹窗
			showDeleteConfirm(transaction) {
				this.currentTransaction = transaction;
				this.showDeletePopup = true;
			},
			
			// 隐藏删除确认弹窗
			hideDeletePopup() {
				this.showDeletePopup = false;
				this.currentTransaction = null;
			},
			
			// 确认删除
			confirmDelete() {
				if (!this.currentTransaction) return;
				
				transactionsDb.deleteTransaction(this.currentTransaction.id).then(() => {
					// 删除成功后重新加载数据
					this.loadTransactions();
					
					// 显示成功提示
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					
					// 隐藏弹窗
					this.hideDeletePopup();
				}).catch(error => {
					console.error('删除失败:', error);
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				});
			},
			
			// 查看交易详情
			viewTransactionDetail(id) {
				// 如果当前有滑动显示删除按钮的项，不触发点击事件
				if (this.currentIndex !== -1) return;
				
				uni.navigateTo({
					url: `/pages/transaction/detail?id=${id}`
				});
			}
		}
	}
</script>

<style>
	.transaction-list-container {
		padding: 20rpx;
		padding-top: calc(90rpx + var(--status-bar-height));
	}
	
	/* 年月选择器 */
	.date-selector {
		margin-bottom: 20rpx;
	}
	
	.date-picker {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
	}
	
	.date-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.date-icon {
		margin-left: 10rpx;
	}
	
	.arrow-down {
		font-size: 24rpx;
		color: #666;
	}
	
	/* 统计信息卡片 */
	.statistics-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.statistics-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}
	
	.statistics-label {
		font-size: 24rpx;
		color: #909399;
		margin-bottom: 10rpx;
	}
	
	.statistics-value {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}
	
	.statistics-value.income {
		color: #67c23a;
	}
	
	.statistics-value.expense {
		color: #f56c6c;
	}
	
	.statistics-divider {
		width: 2rpx;
		height: 60rpx;
		background-color: #ebeef5;
	}
	
	/* 交易列表 */
	.list-container {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.transaction-item {
		position: relative;
		overflow: hidden;
		margin-bottom: 10rpx;
	}
	
	.transaction-content {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
		background-color: #ffffff;
		transition: transform 0.3s ease;
		position: relative;
		z-index: 1;
	}
	
	.transaction-icon {
		margin-right: 20rpx;
		background-color: #f8f8f8;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.transaction-info {
		flex: 1;
	}
	
	.transaction-title {
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	.transaction-remark{
		font-size: 26rpx;
		color: #909399;
	}
	.transaction-time {
		font-size: 24rpx;
		color: #909399;
	}
	
	.transaction-amount {
		font-size: 32rpx;
		font-weight: 500;
	}
	
	.transaction-amount.expense {
		color: #f56c6c;
	}
	
	.transaction-amount.income {
		color: #67c23a;
	}
	
	/* 删除按钮 */
	.delete-btn {
		position: absolute;
		top: 0;
		right: 0; /* 位于内容右侧 */
		width: 100rpx;
		height: 100%;
		background-color: #f56c6c;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		z-index: 0; /* 确保在内容层下方 */
	}
	
	/* 空列表状态 */
	.empty-list {
		padding: 40rpx 0;
	}
	
	.empty-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #909399;
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