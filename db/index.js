// 数据库名称
const dbName = 'tz'

/**
 * 数据库地址
 * @type {String} 推荐以下划线为开头   _doc/xxx.db
 * @description 开发环境中数据库所在地址：文件管理/Android/data/io.dcloud.HBuilder/downloads/salary.db
 * @description 打包安装后数据库所在地址：文件管理/Android/data/uni.UNI4312312(以UNI开头接数字)/downloads/salary.db
 */

// 数据库地址,推荐以下划线为开头   _doc/xxx.db
// 如果路径不为_downloads/xxx.db,在手机中会找不到文件夹(强烈建议：不要修改路径)
const dbPath = '_doc/tz.db'

// 判断数据库是否打开(箭头函数)
const isOpen = () => {
	// 数据库打开了就返回 true,否则返回 false
	var open = plus.sqlite.isOpenDatabase({
		name: dbName, // 数据库名称
		path: dbPath, // 数据库地址
	})
	console.log('数据库打开状态', open)
	return open
}

// 创建数据库 或 有该数据库就打开(普通函数)
const openSqlite = () => {
	return new Promise((resolve, reject) => {
		// 打开数据库
		plus.sqlite.openDatabase({
			name: dbName,
			path: dbPath,
			success: function(e) {
				console.log('数据库打开成功');
				resolve(e); // 成功回调
			},
			fail: function(e) {
				console.error('数据库打开失败: ' + JSON.stringify(e));
				reject(e); // 失败回调
			}
		});
	});
}

// 关闭数据库(箭头函数)
const closeSqlite = () => {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: dbName,
			success: function(e) {
				console.log('数据库关闭成功');
				resolve(e);
			},
			fail: function(e) {
				console.error('数据库关闭失败: ' + JSON.stringify(e));
				reject(e);
			}
		});
	});
}


// 初始化数据库表结构
const initDatabaseSchema = async () => {
	try {
		if (isOpen()) {
			await createTabls();
		} else {
			await openSqlite();
			await createTabls();
		}
		console.log("数据库初始化成功");
	} catch (e) {
		console.error("数据库初始化失败: " + JSON.stringify(e));
	}
};

// 执行单个SQL语句的Promise包装函数
const executeSql = (sql, description) => {
	plus.sqlite.executeSql({
		name: dbName,
		sql: sql,
		success: function(e) {
			console.log(`${description} 创建成功`);
			resolve(e);
		},
		fail: function(e) {
			console.error(`${description} 创建失败: ${JSON.stringify(e)}`);
			reject(e);
		}
	});
};

// 逐个创建表和触发器
const createTabls = () => {
	try {

		// 创建分类表
		const categoriesTable = `
		CREATE TABLE IF NOT EXISTS categories ( 
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			name VARCHAR(50) NOT NULL, -- 分类名称
			type VARCHAR(10) NOT NULL, -- 分类类型：income或expense
			icon VARCHAR(50) DEFAULT NULL, -- 分类图标
			color VARCHAR(20) DEFAULT NULL, -- 分类颜色
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
		)`;
		executeSql(categoriesTable, '分类表');

		// 插入分类数据
		const categoriesData = [
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('餐饮', 'expense', 'food', '${new Date().toISOString()}', '${new Date().toISOString()}')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('交通', 'expense', 'car', '${new Date().toISOString()}', '${new Date().toISOString()}')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('购物', 'expense', 'shopping-cart', '${new Date().toISOString()}', '${new Date().toISOString()}')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('娱乐', 'expense', 'video', '${new Date().toISOString()}', '${new Date().toISOString()}')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('工资', 'income', 'rmb-circle', '${new Date().toISOString()}', '${new Date().toISOString()}')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('奖金', 'income', 'gift', '2025-06-05T04:32:50.624Z', '2025-06-05T04:32:50.624Z')`,
			`INSERT INTO categories (name, type, icon, created_at, updated_at) 
						VALUES ('理财', 'income', 'graph', '${new Date().toISOString()}', '${new Date().toISOString()}')`
		];

		executeSql(categoriesData, '分类表数据')


		// 创建记账表
		const transactionsTable = `
		CREATE TABLE IF NOT EXISTS transactions (
		    id INTEGER PRIMARY KEY AUTOINCREMENT, 
		    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,-- 交易日期
		    amount DECIMAL(10, 2) NOT NULL,-- 交易金额
		    type VARCHAR(10) NOT NULL, -- 分类类型：income或expense
		    remark VARCHAR(255) DEFAULT NULL,-- 交易描述
		    category_id INT NOT NULL,-- 分类ID
		    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
		    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
		)`
		executeSql(transactionsTable, '记账表')
		console.log('所有表和触发器创建完成');
	} catch (error) {
		console.error('创建表结构时出错:', error);
	}
}

const isExistsTable = () => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!isOpen()) {
				await openSqlite();
			}

			plus.sqlite.selectSql({
				name: dbName, // 数据库名称
				sql: `SELECT name FROM sqlite_master WHERE type='table'  AND name NOT LIKE 'sqlite_%' AND name <>'android_metadata';  -- 排除 SQLite 系统表`,
				success: function(e) {
					console.log(e)
					console.log('表检查成功!');
					if (e.length == 0) {
						resolve(false);
					} else {
						resolve(true);
					}
				},
				fail: function(e) {
					console.log('表检查失败: ' + JSON.stringify(e));
					resolve(false); // 使用resolve而不是reject，因为表不存在不是错误情况
				}
			});
		} catch (error) {
			console.error('表检查操作失败: ' + JSON.stringify(error));
			resolve(false); // 使用resolve而不是reject，保持与fail回调一致的行为
		}
	});
}

// 导出方法
export default {
	dbName,
	// 查询数据库是否打开
	isOpen,
	// 创建/开启数据库
	openSqlite,
	// 关闭数据库
	closeSqlite,
	// 初始化数据库表结构
	initDatabaseSchema,
	// 表是否存在
	isExistsTable
}