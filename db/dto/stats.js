import db from "@/db/index.js";

/**
 * 获取统计数据
 * 包括记账天数和记账笔数
 * @returns {Promise} 返回包含days和records的对象
 */
const getStats = () => {
	return new Promise((resolve, reject) => {
		// 构建SQL语句，同时查询记账天数和记账笔数
		const sql = `
			SELECT 
				COUNT(*) as records, 
				COUNT(DISTINCT date(transaction_date)) as days 
			FROM transactions
		`;
		
		// 执行查询操作
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('查询统计数据成功:', data);
				// 如果查询结果为空，返回默认值
				if (data.length === 0) {
					resolve({ days: 0, records: 0 });
				} else {
					resolve({
						days: data[0].days || 0,
						records: data[0].records || 0
					});
				}
			},
			fail: function(error) {
				console.error('查询统计数据失败:', error);
				reject(error);
			}
		});
	});
};

/**
 * 获取指定月份的统计数据
 * @param {String} yearMonth 年月，格式为YYYY-MM
 * @returns {Promise} 返回包含days和records的对象
 */
const getMonthlyStats = (yearMonth) => {
	return new Promise((resolve, reject) => {
		// 构建SQL语句，查询指定月份的记账天数和记账笔数
		const sql = `
			SELECT 
				COUNT(*) as records, 
				COUNT(DISTINCT date(transaction_date)) as days 
			FROM transactions
			WHERE strftime('%Y-%m', transaction_date) = '${yearMonth}'
		`;
		
		// 执行查询操作
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('查询月度统计数据成功:', data);
				// 如果查询结果为空，返回默认值
				if (data.length === 0) {
					resolve({ days: 0, records: 0 });
				} else {
					resolve({
						days: data[0].days || 0,
						records: data[0].records || 0
					});
				}
			},
			fail: function(error) {
				console.error('查询月度统计数据失败:', error);
				reject(error);
			}
		});
	});
};

export default {
	getStats,
	getMonthlyStats
};