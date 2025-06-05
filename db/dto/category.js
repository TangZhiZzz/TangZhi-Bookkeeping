import db from "@/db/index.js";

const selectCategoryList = (pageNum, pageSize, orderBy) => {
	
	return new Promise(async (resolve, reject) => {
		
		var sql = `select * from categories `
		if (orderBy) {
			sql += ` order by ${orderBy} `
		}
		if (pageNum>=0 && pageSize>0) {
			sql += ` LIMIT ${pageSize} OFFSET ${pageNum}`
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
const insertCategory = (categoryData) => {
	// 确保数据包含创建时间
	if (!categoryData.created_at) {
		categoryData.created_at = new Date().toISOString();
	}
	// 确保数据包含更新时间
	if (!categoryData.updated_at) {
		categoryData.updated_at = new Date().toISOString();
	}
	
	return new Promise((resolve, reject) => {
		// 处理可能为null的值
		const icon = categoryData.icon ? `'${categoryData.icon}'` : 'NULL';
		const color = categoryData.color ? `'${categoryData.color}'` : 'NULL';
		
		// 构建SQL语句，使用字符串拼接而不是参数化查询
		const sql = `INSERT INTO categories (name, type, icon, color, created_at, updated_at) 
			VALUES ('${categoryData.name}', '${categoryData.type}', ${icon}, ${color}, '${categoryData.created_at}', '${categoryData.updated_at}')`;
		console.log(sql)
		// 执行SQL语句
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('插入分类成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('插入分类失败:', error);
				reject(error);
			}
		});
	});
}

const updateCategory = (categoryId, categoryData) => {
	// 确保数据包含更新时间
	if (!categoryData.updated_at) {
		categoryData.updated_at = new Date().toISOString();
	}
	
	return new Promise((resolve, reject) => {
		// 构建更新SQL语句
		let updateFields = [];
		
		// 遍历categoryData对象，构建更新字段和值
		for (let key in categoryData) {
			if (categoryData.hasOwnProperty(key)) {
				// 处理不同类型的值
				let value;
				if (categoryData[key] === null || categoryData[key] === undefined) {
					value = 'NULL';
				} else if (typeof categoryData[key] === 'string') {
					// 转义字符串中的单引号
					value = `'${categoryData[key].replace(/'/g, "''")}'`;
				} else {
					value = categoryData[key];
				}
				updateFields.push(`${key} = ${value}`);
			}
		}
		
		// 构建完整的SQL语句
		const sql = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ${categoryId}`;
		
		// 执行更新操作
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: sql,
			success: function(data) {
				console.log('更新分类成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('更新分类失败:', error);
				reject(error);
			}
		});
	});
}

const deleteCategory = (categoryId) => {
	return new Promise((resolve, reject) => {
		// 执行删除操作
		plus.sqlite.executeSql({
			name: db.dbName,
			sql: `DELETE FROM categories WHERE id = ${categoryId}`,
			success: function(data) {
				console.log('删除分类成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('删除分类失败:', error);
				reject(error);
			}
		});
	});
}
const selectCategory = (categoryId) => {
	return new Promise((resolve, reject) => {
		// 执行删除操作
		plus.sqlite.selectSql({
			name: db.dbName,
			sql: `SELECT * FROM categories WHERE id = ${categoryId}`,
			success: function(data) {
				console.log('查询分类成功:', data);
				resolve(data);
			},
			fail: function(error) {
				console.error('查询分类失败:', error);
				reject(error);
			}
		});
	});
}


export default {
	selectCategoryList,
	insertCategory,
	updateCategory,
	deleteCategory,
	selectCategory
}