-- 账户表：记录资金存放位置 
CREATE TABLE IF NOT EXISTS accounts ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(50) NOT NULL, -- 账户名称
    type VARCHAR(20) NOT NULL, -- 账户类型：cash, bank, credit_card, alipay, wechat, other
    initial_balance DECIMAL(10, 2) NOT NULL DEFAULT 0, -- 初始余额
    current_balance DECIMAL(10, 2) NOT NULL DEFAULT 0, -- 当前余额
    is_default INTEGER NOT NULL DEFAULT 0, -- 是否默认账户
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
); 

-- 分类表：记录收支分类 
CREATE TABLE IF NOT EXISTS categories ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(50) NOT NULL, -- 分类名称
    type VARCHAR(10) NOT NULL, -- 分类类型：income或expense
    icon VARCHAR(50) DEFAULT NULL, -- 分类图标
    color VARCHAR(20) DEFAULT NULL, -- 分类颜色
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
); 

-- 交易记录表：核心记账表 
CREATE TABLE IF NOT EXISTS transactions ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    transaction_date DATE NOT NULL, -- 交易日期
    amount DECIMAL(10, 2) NOT NULL, -- 交易金额
    type VARCHAR(10) NOT NULL, -- 交易类型：income, expense, transfer
    description VARCHAR(255) DEFAULT NULL, -- 交易描述
    category_id INTEGER NOT NULL, -- 分类ID
    account_id INTEGER NOT NULL, -- 账户ID
    target_account_id INTEGER DEFAULT NULL, -- 转账目标账户ID（仅转账时使用）
    receipt_image VARCHAR(255) DEFAULT NULL, -- 凭证图片路径
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新时间
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE, 
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE, 
    FOREIGN KEY (target_account_id) REFERENCES accounts(id) ON DELETE SET NULL 
); 

-- 标签表：用于标记交易 
CREATE TABLE IF NOT EXISTS tags ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(50) NOT NULL, -- 标签名称
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
); 

-- 交易-标签关联表：多对多关系 
CREATE TABLE IF NOT EXISTS transaction_tags ( 
    transaction_id INTEGER NOT NULL, 
    tag_id INTEGER NOT NULL, 
    PRIMARY KEY (transaction_id, tag_id), 
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE, 
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE 
); 

-- 触发器：插入交易时更新账户余额 
CREATE TRIGGER IF NOT EXISTS update_account_balance_after_insert 
AFTER INSERT ON transactions 
BEGIN 
    UPDATE accounts SET current_balance = current_balance + NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'income'; 
    
    UPDATE accounts SET current_balance = current_balance - NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'expense'; 
    
    UPDATE accounts SET current_balance = current_balance - NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'transfer'; 
    
    UPDATE accounts SET current_balance = current_balance + NEW.amount 
    WHERE id = NEW.target_account_id AND NEW.type = 'transfer'; 
END; 

-- 触发器：更新交易时调整账户余额 
CREATE TRIGGER IF NOT EXISTS update_account_balance_after_update 
AFTER UPDATE ON transactions 
BEGIN 
    -- 处理旧记录的余额调整
    UPDATE accounts SET current_balance = current_balance - OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'income'; 
    
    UPDATE accounts SET current_balance = current_balance + OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'expense'; 
    
    UPDATE accounts SET current_balance = current_balance + OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'transfer'; 
    
    UPDATE accounts SET current_balance = current_balance - OLD.amount 
    WHERE id = OLD.target_account_id AND OLD.type = 'transfer'; 

    -- 处理新记录的余额调整
    UPDATE accounts SET current_balance = current_balance + NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'income'; 
    
    UPDATE accounts SET current_balance = current_balance - NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'expense'; 
    
    UPDATE accounts SET current_balance = current_balance - NEW.amount 
    WHERE id = NEW.account_id AND NEW.type = 'transfer'; 
    
    UPDATE accounts SET current_balance = current_balance + NEW.amount 
    WHERE id = NEW.target_account_id AND NEW.type = 'transfer'; 
END; 

-- 触发器：删除交易时调整账户余额
CREATE TRIGGER IF NOT EXISTS update_account_balance_after_delete
AFTER DELETE ON transactions
BEGIN
    UPDATE accounts SET current_balance = current_balance - OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'income'; 
    
    UPDATE accounts SET current_balance = current_balance + OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'expense'; 
    
    UPDATE accounts SET current_balance = current_balance + OLD.amount 
    WHERE id = OLD.account_id AND OLD.type = 'transfer'; 
    
    UPDATE accounts SET current_balance = current_balance - OLD.amount 
    WHERE id = OLD.target_account_id AND OLD.type = 'transfer'; 
END;