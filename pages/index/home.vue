<template>
	<view class="home-container">
		<view class="header">
			<view class="balance-card">
				<view class="balance-title">本月结余</view>
				<view class="balance-amount">¥ {{monthlyBalance}}</view>
				<view class="balance-details">
					<view class="detail-item">
						<view class="detail-label">收入</view>
						<view class="detail-value income">¥ {{monthlyIncome}}</view>
					</view>
					<view class="detail-item">
						<view class="detail-label">支出</view>
						<view class="detail-value expense">¥ {{monthlyExpense}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="transaction-list">
			<view class="list-header">
				<text>近期账单</text>
				<text class="view-all" @click="viewAllTransactions">查看全部</text>
			</view>

			<view class="empty-list" v-if="transactions.length === 0">
				<view class="empty-content">
					<text class="empty-text">暂无账单记录</text>
				</view>
			</view>

			<view class="transaction-item" v-for="(item, index) in transactions" :key="index" @click="viewTransactionDetail(item.id)">
				<view class="transaction-icon">
					<svg-icon :name="item.categoryIcon" :color="item.type === 'expense' ? '#f56c6c' : '#67c23a'"
						size="60"></svg-icon>
				</view>
				<view class="transaction-info">
					<view class="transaction-title">{{item.categoryName}}</view>
					<view class="transaction-time">{{item.transaction_date}}</view>
				</view>
				<view class="transaction-amount" :class="item.type === 'expense' ? 'expense' : 'income'">
					{{item.type === 'expense' ? '-' : '+'}}¥ {{item.amount}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import transactionsDb from '@/db/dto/transactions'
	import categoryDb from '@/db/dto/category'

	export default {
		data() {
			return {
				monthlyIncome: 0,
				monthlyExpense: 0,
				transactions: [],
			}
		},
		computed: {
			monthlyBalance() {
				return this.monthlyIncome - this.monthlyExpense;
			}
		},
		onShow() {

		},
		mounted() {
			this.getRecentTransactions()
			this.getMonthlyData();
		},
		methods: {
			// 获取本月收支数据
			getMonthlyData() {
				transactionsDb.selectSumAmount('income').then(res => {
					this.monthlyIncome = res[0].total || 0
				})
				transactionsDb.selectSumAmount('expense').then(res => {
					this.monthlyExpense = res[0].total || 0
				})
			},

			// 获取最近的交易记录
			getRecentTransactions() {
				transactionsDb.selectTransactionList(5, 0, null, 'transaction_date desc,id desc').then(res => {
					console.log(res)
					this.transactions = res
				})
			},
			
			// 查看全部交易记录
			viewAllTransactions() {
				uni.navigateTo({
					url: '/pages/transaction/index'
				})
			},
			
			// 查看交易详情
			viewTransactionDetail(id) {
				uni.navigateTo({
					url: `/pages/transaction/detail?id=${id}`
				})
			}
		}
	}
</script>

<style>
	.home-container {
		padding: 20rpx;
	}

	.header {
		margin-bottom: 30rpx;
	}

	.balance-card {
		background: linear-gradient(to right, #5677fc, #5c8dff);
		color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 16rpx rgba(86, 119, 252, 0.2);
	}

	.balance-title {
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}

	.balance-amount {
		font-size: 60rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.balance-details {
		display: flex;
		justify-content: space-between;
	}

	.detail-item {
		flex: 1;
	}

	.detail-label {
		font-size: 24rpx;
		opacity: 0.8;
		margin-bottom: 6rpx;
	}

	.detail-value {
		font-size: 32rpx;
		font-weight: 500;
	}

	.income {
		color: #ffffff;
	}

	.expense {
		color: #ffffff;
	}

	.transaction-list {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
		margin-bottom: 20rpx;
		font-size: 30rpx;
		font-weight: 500;
	}

	.view-all {
		color: #5677fc;
		font-size: 26rpx;
	}

	.transaction-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.transaction-item:last-child {
		border-bottom: none;
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

	.empty-list {
		padding: 40rpx 0;
	}

	.empty-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #909399;
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

	.transaction-icon .iconfont {
		color: #5677fc;
	}

	.icon-food:before {
		content: '\e7d0';
	}

	.icon-car:before {
		content: '\e7d7';
	}

	.icon-rmb-circle:before {
		content: '\e7df';
	}

	.icon-shopping-cart:before {
		content: '\e7cf';
	}
</style>