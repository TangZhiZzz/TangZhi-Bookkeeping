# TangZhi 记账应用数据库设计

## 数据库结构


### 分类表 (categories)

记录收支分类

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER | 主键，自增 |
| name | VARCHAR(50) | 分类名称 |
| type | VARCHAR(10) | 分类类型：income(收入), expense(支出) |
| icon | VARCHAR(50) | 分类图标 |
| color | VARCHAR(20) | 分类颜色 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 记账表 (transactions)

核心记账表

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | INTEGER | 主键，自增 |
| transaction_date | TIMESTAMP | 交易日期 |
| amount | DECIMAL(10, 2) | 交易金额 |
| type | VARCHAR(10) | 分类类型：income(收入), expense(支出) |
| remark | VARCHAR(255) | 交易描述 |
| category_id | INT | 分类ID |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |