import db from "@/db/index.js";

const selectTransactionList = (pageNum, pageSize, where, orderBy) => {

	return new Promise(async (resolve, reject) => {

		var sql =
			`select a.*,b.name as categoryName,b.icon as categoryIcon from transactions a left join categories b on a.category_id=b.id `
		if (where) {
			sql += ` where ${where} `
		}
		if (orderBy) {
			sql += ` order by ${orderBy} `
		}
		console.log(pageNum,pageSize)
		if (pageNum >= 0 && pageSize >= 0) {
			sql += ` LIMIT ${pageNum} OFFSET ${pageNum*pageSize}`
		}
		console.log(sql)
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				resolve(data);
			},
			fail: function(e) {
				console.error('查询失败: ' + JSON.stringify(e));
				reject(e);
			}
		});
	});
}
const insertTransaction = (transactionData) => {
	// 确保数据包含创建时间
	if (!transactionData.created_at) {
		transactionData.created_at = new Date().toISOString();
	}
	// 确保数据包含更新时间
	if (!transactionData.updated_at) {
		transactionData.updated_at = new Date().toISOString();
	}

	return new Promise((resolve, reject) => {
		// 构建SQL语句，使用字符串拼接而不是参数化查询
		const sql =
			`INSERT INTO transactions (transaction_date, amount, type, remark, category_id, created_at, updated_at) 
			VALUES ('${transactionData.transaction_date}', '${transactionData.amount}', '${transactionData.type}', '${transactionData.remark}', ${transactionData.category_id}, '${transactionData.created_at}', '${transactionData.updated_at}')`;
		console.log(sql)
		// 执行SQL语句
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('插入记账成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('插入记账失败:', error);
				reject(error);
			}
		});
	});
}

const updateTransaction = (transactionId, transactionData) => {
	// 确保数据包含更新时间
	if (!transactionData.updated_at) {
		transactionData.updated_at = new Date().toISOString();
	}

	return new Promise((resolve, reject) => {
		// 构建更新SQL语句
		let updateFields = [];

		// 遍历transactionData对象，构建更新字段和值
		for (let key in transactionData) {
			if (transactionData.hasOwnProperty(key)) {
				// 处理不同类型的值
				let value;
				if (transactionData[key] === null || transactionData[key] === undefined) {
					value = 'NULL';
				} else if (typeof transactionData[key] === 'string') {
					// 转义字符串中的单引号
					value = `'${transactionData[key].replace(/'/g, "''")}'`;
				} else {
					value = transactionData[key];
				}
				updateFields.push(`${key} = ${value}`);
			}
		}

		// 构建完整的SQL语句
		const sql = `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ${transactionId}`;

		// 执行更新操作
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('更新记账成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('更新记账失败:', error);
				reject(error);
			}
		});
	});
}

const deleteTransaction = (transactionId) => {
	return new Promise((resolve, reject) => {
		// 执行删除操作
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: `DELETE FROM transactions WHERE id = ${transactionId}`,
			success: function(data) {
				console.log('删除记账成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('删除记账失败:', error);
				reject(error);
			}
		});
	});
}
const selectTransaction = (transactionId) => {
	return new Promise((resolve, reject) => {
		// 执行删除操作
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: `SELECT * FROM transactions WHERE id = ${transactionId}`,
			success: function(data) {
				console.log('查询记账成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('查询记账失败:', error);
				reject(error);
			}
		});
	});
}
const selectSumAmount = (type, yearMonth) => {
	return new Promise((resolve, reject) => {
		// 构建SQL语句
		let sql = `SELECT sum(amount) total FROM transactions WHERE type = '${type}'`;
		
		// 如果提供了年月参数，添加日期过滤条件
		if (yearMonth) {
			sql += ` AND strftime('%Y-%m', transaction_date) = '${yearMonth}'`;
		}
		
		// 执行查询操作
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('查询记账成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('查询记账失败:', error);
				reject(error);
			}
		});
	});
}
export default {
	selectTransactionList,
	insertTransaction,
	updateTransaction,
	deleteTransaction,
	selectTransaction,
	selectSumAmount
}