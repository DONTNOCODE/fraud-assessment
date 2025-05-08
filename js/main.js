// 应用切换功能
function switchApp(appId) {
    // 隐藏所有应用容器
    document.querySelectorAll('.app-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // 显示选中的应用
    document.getElementById(appId).style.display = 'block';
    
    // 更新侧边栏选中状态
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.sidebar-item[onclick*="${appId}"]`).classList.add('active');
}

// 从localStorage加载数据
let companies = JSON.parse(localStorage.getItem('companies')) || [
    {
        id: 1,
        name: 'Tenpay',
        productCount: 2
    },
    {
        id: 2,
        name: 'WPE',
        productCount: 1
    }
];

let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        companyId: 1,
        name: '支付产品A',
        description: '跨境支付解决方案',
        launchDate: '2024-03-20',
        assessmentDate: '2024-03-21',
        assessor: '张三',
        countries: ['中国', '美国', '日本'],
        merchants: ['商户A', '商户B']
    },
    {
        id: 2,
        companyId: 1,
        name: '支付产品B',
        description: '国内支付解决方案',
        launchDate: '2024-03-15',
        assessmentDate: '2024-03-16',
        assessor: '李四',
        countries: ['中国'],
        merchants: ['商户C']
    },
    {
        id: 3,
        companyId: 2,
        name: '支付产品C',
        description: '企业支付解决方案',
        launchDate: '2024-03-10',
        assessmentDate: '2024-03-11',
        assessor: '王五',
        countries: ['中国', '新加坡'],
        merchants: ['商户D', '商户E']
    }
];

let fraudAssessments = JSON.parse(localStorage.getItem('fraudAssessments')) || [
    {
        id: 1,
        productId: 1,
        criteria: '示例标准',
        answer: '是',
        description: '示例描述',
        weight: 5,
        likelihood: 3,
        impact: 4,
        inherentRiskLevel: '中',
        riskControl: '示例控制措施',
        controlEffectiveness: '有效',
        residualRisk: '低',
        riskTreatment: '接受',
        actionPlan: '继续监控',
        targetCompletionDate: '2024-12-31'
    }
];

// 预定义的 Fraud Types
const FRAUD_TYPES = [
    { 
        id: 'phishing', 
        name: 'Phishing', 
        icon: 'fa-fish',
        description: '钓鱼欺诈是一种网络攻击，攻击者通过伪装成可信实体来获取敏感信息。'
    },
    { 
        id: 'identity_theft', 
        name: 'Identity Theft', 
        icon: 'fa-user-secret',
        description: '身份盗窃是指犯罪者盗取并使用他人的个人信息。'
    },
    { 
        id: 'account_takeover', 
        name: 'Account Takeover', 
        icon: 'fa-user-lock',
        description: '账户接管是指攻击者获取用户账户的访问权限。'
    },
    { 
        id: 'payment_fraud', 
        name: 'Payment Fraud', 
        icon: 'fa-credit-card',
        description: '支付欺诈包括使用被盗信用卡或其他支付方式进行的欺诈交易。'
    },
    { 
        id: 'money_laundering', 
        name: 'Money Laundering', 
        icon: 'fa-money-bill-wave',
        description: '洗钱是将非法所得转换为合法资金的过程。'
    },
    { 
        id: 'synthetic_identity', 
        name: 'Synthetic Identity Fraud', 
        icon: 'fa-user-ninja',
        description: 'Synthetic Identity Fraud involves the creation of a false identity.'
    },
    { 
        id: 'other_scam', 
        name: 'Other Scam', 
        icon: 'fa-exclamation-triangle',
        description: 'Other Scam involves various types of fraud that do not fit into the other categories.'
    }
];

// 切换标签页
function switchTab(tabId) {
    // 移除所有标签页的active类
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有导航项的active类
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 激活选中的标签页
    document.getElementById(tabId).classList.add('active');
    
    // 激活选中的导航项
    document.querySelector(`.nav-item[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// 显示Fraud Type选择表单
function showFraudTypeSelection() {
    const productId = localStorage.getItem('currentProductId');
    const selectedTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
    
    const formHtml = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Select Fraud Types</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                
                <div class="fraud-type-list">
                    ${FRAUD_TYPES.map(type => `
                        <div class="fraud-type-item">
                            <div class="fraud-type-header">
                                <label>
                                    <input type="checkbox" value="${type.id}" 
                                        data-name="${type.name}" 
                                        data-icon="${type.icon}"
                                        data-description="${type.description || ''}"
                                        ${selectedTypes.some(t => t.id === type.id) ? 'checked disabled' : ''}>
                                    <i class="fas ${type.icon}"></i>
                                    <span>${type.name}</span>
                                </label>
                            </div>
                            <div class="fraud-type-description">
                                ${type.description || ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button type="button" onclick="saveFraudTypeSelection()">Add Selected</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

// 保存选中的Fraud Types
function saveFraudTypeSelection() {
    const modal = document.querySelector('.modal-overlay');
    const selectedCheckboxes = modal.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)');
    
    const selectedTypes = Array.from(selectedCheckboxes).map(checkbox => ({
        id: checkbox.value,
        name: checkbox.dataset.name,
        icon: checkbox.dataset.icon,
        description: checkbox.dataset.description
    }));
    
    if (selectedTypes.length > 0) {
        const productId = localStorage.getItem('currentProductId');
        const existingTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
        
        localStorage.setItem(`fraudTypes_${productId}`, JSON.stringify([
            ...existingTypes,
            ...selectedTypes
        ]));
        
        // 刷新显示
        displaySelectedFraudTypes();
    }
    
    modal.remove();
}

// 显示已选择的Fraud Types
function displaySelectedFraudTypes() {
    const productId = localStorage.getItem('currentProductId');
    const selectedTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
    
    const container = document.querySelector('.fraud-type-grid');
    container.innerHTML = selectedTypes.map(type => `
        <div class="fraud-type-card">
            <div class="fraud-type-icon">
                <i class="fas ${type.icon}"></i>
            </div>
            <div class="fraud-type-info">
                <h3>${type.name}</h3>
                <p>${type.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 显示已选择的Fraud Types
    displaySelectedFraudTypes();
});

// 添加点点指示器函数
function getDotIndicator(level, color) {
    const dotCount = level.toLowerCase() === 'low' ? 2 : 
                     level.toLowerCase() === 'medium' ? 4 : 6;
    const dots = '●'.repeat(dotCount);
    return `<span style="color: ${color}; letter-spacing: 2px;">${dots}</span> ${level}`;
}

// 修改仪表板类型枚举
const DashboardType = {
    RISK: 'risk',           // 风险仪表板
    TRANSACTION: 'transaction', // 交易监控
    PRODUCT: 'product'      // 产品列表
};

// 修改渲染公司列表函数
function renderCompanies() {
    const container = document.getElementById('company-cards');
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i>🏢</i>
                <p>暂无公司数据</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = companies.map(company => `
        <div class="company-card" onclick="showCompanyDashboard(${company.id})">
            <div class="company-info">
                <h3>${company.name}</h3>
                <div class="company-stats">
                    <span>${company.productCount || 0} 个产品</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="icon-button edit-button" onclick="showEditCompanyForm(${company.id}, event)">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 从列表中删除公司
function deleteCompanyFromList(companyId, event) {
    // // 获取按钮元素
    // const button = event.target.closest('button');
    
    // // 显示确认提示
    // const confirmation = document.createElement('div');
    // confirmation.className = 'confirmation-prompt';
    // confirmation.innerHTML = `
    //     <span>确认删除？</span>
    //     <button class='confirm-yes'>是</button>
    //     <button class='confirm-no'>否</button>
    // `;
    
    // // 添加到按钮旁边
    // button.parentElement.appendChild(confirmation);
    
    // // 确认按钮事件
    // confirmation.querySelector('.confirm-yes').onclick = () => {
    //     // 删除公司数据
    //     companies = companies.filter(c => c.id !== companyId);
    //     products = products.filter(p => p.companyId !== companyId); // 同时删除关联产品
        
    //     // 更新 localStorage
    //     localStorage.setItem('companies', JSON.stringify(companies));
    //     localStorage.setItem('products', JSON.stringify(products));
        
    //     // 重新渲染公司列表
    //     renderCompanyCards();
        
    //     // 隐藏仪表板
    //     document.getElementById('company-dashboard').innerHTML = `
    //         <div class="empty-state">
    //             <i>📊</i>
    //             <p>选择一个公司查看详细信息</p>
    //         </div>
    //     `;
    // };
    
    // // 取消按钮事件
    // confirmation.querySelector('.confirm-no').onclick = () => {
    //     confirmation.remove();
    // };
    
    // // 阻止事件冒泡
    // event.stopPropagation();
}

// 修改公司卡片点击处理
function renderCompanyCards() {
    const container = document.getElementById('company-cards');
    container.innerHTML = companies.map(company => `
        <div class="company-card" onclick="showCompanyDashboard(${company.id})">
            <div class="card-content">
                <h3>${company.name}</h3>
                <p>产品数量: ${company.productCount || 0}</p>
            </div>
            <div class="card-actions">
                <button class="icon-button edit-button" onclick="showEditCompanyForm(${company.id}, event)">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 修改公司仪表板渲染
function renderCompanyDashboard(companyId) {
    const company = companies.find(c => c.id === companyId);
    const companyProducts = products.filter(p => p.companyId === companyId);
    
    const dashboard = document.getElementById('company-dashboard');
    dashboard.dataset.currentCompanyId = companyId; // Store current company ID

    // Helper function to format transaction limits
    const formatLimit = (limit) => {
        return limit && limit.amount ? `${limit.amount} ${limit.currency}` : 'N/A';
    };

    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h2>${company.name}</h2>
            <div class="header-actions">
                <button class="add-button" onclick="showAddProductForm(${companyId})">
                    <i class="fas fa-plus"></i>
                    <span>Add Product</span>
                </button>
            </div>
        </div>
        <div class="product-list">
            ${companyProducts.map(product => {
                // Ensure transactionLimits exists
                const limits = product.transactionLimits || { singleMax: {}, daily: {}, monthly: {}, annual: {} };
                return `
                <div class="product-card">
                    <div class="product-info">
                        <div class="product-header">
                            <h3>${product.name}</h3>
                            <div class="card-actions">
                                <button class="icon-button view-log-button" onclick="showProductLog(${product.id}, event)" title="View Change Log">
                                    <i class="fas fa-history"></i>
                                </button>
                                <button class="icon-button edit-button" onclick="editProduct(${product.id}, event)" title="Edit Product">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-button delete-button" onclick="deleteProduct(${product.id}, event)" title="Delete Product">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>上线日期: ${product.launchDate}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>评估人: ${product.assessor}</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <div class="detail-section">
                                <h4>覆盖国家</h4>
                                <div class="tag-list">
                                    ${product.countries.map(country => `
                                        <span class="tag">
                                            <span class="tag-text">${country}</span>
                                            <button class="tag-delete" onclick="removeCountry(${product.id}, '${country}', event)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </span>
                                    `).join('')}
                                    <button class="add-tag" onclick="addCountry(${product.id}, event)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- 风险等级与警告区块插入 -->
                        <div class="risk-level-section">
                            <h3>Overall Risk Level</h3>
                            <div class="risk-item">
                                <span>Inherent Risk：</span>
                                <span id="inherent-risk" class="risk-medium">Medium</span>
                            </div>
                            <div class="risk-item">
                                <span>Control Effectiveness：</span>
                                <span id="control-effectiveness" class="risk-high">High</span>
                            </div>
                            <div class="risk-item">
                                <span>Residual Risk：</span>
                                <span id="residual-risk" class="risk-medium">Medium</span>
                            </div>
                        </div>
                        <div class="regulatory-section warning-section">
                            <h3>Regulatory Requirement</h3>
                            <div class="regulatory-list" id="regulatory-list">
                                <!-- 合规要求列表将动态插入 -->
                            </div>
                            <button class="add-regulatory-btn" onclick="addRegulatoryRequirement(this)">添加合规要求</button>
                        </div>
                    </div>
                    <div class="assessment-buttons">
                        <button class="assessment-btn fraud" onclick="showFraudAssessment(${product.id}, event)">
                            <i class="fas fa-shield-alt"></i>
                            <span>Fraud Assessment</span>
                        </button>
                        <button class="assessment-btn aml" onclick="showAMLAssessment(${product.id}, event)">
                            <i class="fas fa-money-check-alt"></i>
                            <span>AML Assessment</span>
                        </button>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
    renderRegulatoryRequirements(companyProducts[0].id);
}

// 计算公司统计数据
function calculateCompanyStats(companyId) {
    return {
        riskPercentage: Math.floor(Math.random() * 100),
        analysisProgress: Math.floor(Math.random() * 100)
    };
}

// 渲染公司图表
function renderCompanyCharts(companyId) {
    // 渲染 Top 5 Vulnerabilities
    new Chart(document.getElementById(`vulnerabilities-chart-${companyId}`), {
        type: 'bar',
        data: {
            labels: ['Encryption', 'User Permissions', 'Dormant Accounts', 'Physical Security', 'Trusting Employees'],
            datasets: [{
                data: [30, 48, 35, 60, 28],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

    // 渲染 Top 5 Risks
    new Chart(document.getElementById(`risks-chart-${companyId}`), {
        type: 'bar',
        data: {
            labels: ['Risk 1', 'Risk 2', 'Risk 3', 'Risk 4', 'Risk 5'],
            datasets: [{
                data: [54, 18, 11, 12, 14],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, max: 70 }
            }
        }
    });

    // 渲染 Risk Rating Breakdown
    new Chart(document.getElementById(`rating-chart-${companyId}`), {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
            datasets: [{
                data: [46, 38, 12, 4],
                backgroundColor: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c']
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // 渲染 Action Plan Breakdown
    new Chart(document.getElementById(`action-chart-${companyId}`), {
        type: 'doughnut',
        data: {
            labels: ['Implemented', 'Planned', 'Deferred', 'TBD'],
            datasets: [{
                data: [38, 19, 11, 32],
                backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#95a5a6']
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// 添加计算公司风险的辅助函数
function calculateCompanyFraudRisk(companyId) {
    // 这里添加实际的风险计算逻辑
    return Math.floor(Math.random() * 100);
}

function calculateCompanyAMLRisk(companyId) {
    // 这里添加实际的风险计算逻辑
    return Math.floor(Math.random() * 100);
}

function getHighRiskProducts(companyId) {
    // 这里添加实际的高风险产品计算逻辑
    return Math.floor(Math.random() * 5); // 示例：随机数量
}

// 修改渲染产品列表函数
function renderProducts(companyId) {
    const container = document.querySelector('#product-list .card-container');
    const companyProducts = products.filter(p => p.companyId === companyId);
    
    if (companyProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i>🎯</i>
                <p>暂无产品数据</p>
                <button class="add-button" onclick="showAddProductForm()">
                    <i>+</i>
                    <span>添加第一个产品</span>
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = companyProducts.map(product => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${product.name}</h3>
                <button class="delete-button" onclick="deleteProduct(${product.id}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="card-content" onclick="showFraudAssessment(${product.id})">
                <div class="card-info">
                    <div>上线时间：${product.launchDate || '未设置'}</div>
                    <div>评估日期：${product.assessmentDate || '未设置'}</div>
                </div>
                <div class="card-footer">
                    <div class="card-stats">
                        <div class="stat-item">
                            <i>🏢</i>
                            <span>${product.associatedCompanies?.length || 0} 个商户</span>
                        </div>
                        <div class="stat-item">
                            <i>⚠️</i>
                            <span>${product.fraudTypes?.length || 0} 个风险</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 比较两个对象并返回差异描述
function getObjectChanges(oldObj, newObj, fields) {
    const changes = [];
    for (const field of fields) {
        const oldValue = oldObj[field];
        const newValue = newObj[field];
        // 处理嵌套对象，如 transactionLimits
        if (typeof oldValue === 'object' && oldValue !== null && typeof newValue === 'object' && newValue !== null) {
            const nestedFields = Object.keys(newValue);
            const nestedChanges = getObjectChanges(oldValue, newValue, nestedFields);
            if (nestedChanges.length > 0) {
                changes.push(`${field}: { ${nestedChanges.join(', ')} }`);
            }
        } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
             // 简单比较数组内容是否变化
             if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                 changes.push(`${field}: from [${oldValue.join(', ')}] to [${newValue.join(', ')}]`);
             }
        } else if (oldValue !== newValue) {
            changes.push(`${field}: from "${oldValue || ''}" to "${newValue || ''}"`);
        }
    }
    return changes;
}

// 编辑产品
function editProduct(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 确保 product.transactionLimits 存在
    product.transactionLimits = product.transactionLimits || { singleMax: {}, daily: {}, monthly: {}, annual: {} };

    const currencies = ['CNY', 'SGD', 'USD', 'HKD', 'JPY', 'AUD', 'GBP'];
    const getCurrencyOptions = (selectedCurrency) => {
        return currencies.map(c => 
            `<option value="${c}" ${c === selectedCurrency ? 'selected' : ''}>${c}</option>`
        ).join('');
    };
    
    const formHtml = `
        <div class="modal-overlay">
            <div class="modal-content wide-modal product-edit-modal">
                <div class="modal-header">
                    <h3>Edit Product</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <form onsubmit="updateProduct(event, ${productId})" class="product-form">
                     <div class="form-row">
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" name="productName" value="${product.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Assessor</label>
                            <input type="text" name="assessor" value="${product.assessor || ''}" required>
                        </div>
                         <div class="form-group">
                            <label>Approver</label>
                            <input type="text" name="approver" value="${product.approver || ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Product Description</label>
                        <textarea name="description" rows="3" required>${product.description || ''}</textarea>
                    </div>
                    
                   <div class="form-row">
                        <div class="form-group">
                            <label>Product Live Date</label>
                            <input type="date" name="productLiveDate" value="${product.productLiveDate || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Transaction Processing Date</label>
                            <input type="date" name="transactionProcessingDate" value="${product.transactionProcessingDate || ''}" required>
                        </div>
                    </div>

                    <h4>Transaction Limits</h4>
                     <div class="form-row">
                        <div class="form-group transaction-limit">
                            <label>Single Maximum</label>
                            <input type="number" name="singleMaxAmount" placeholder="Amount" value="${product.transactionLimits.singleMax?.amount || ''}">
                            <select name="singleMaxCurrency">${getCurrencyOptions(product.transactionLimits.singleMax?.currency)}</select>
                        </div>
                         <div class="form-group transaction-limit">
                            <label>Daily Limit</label>
                            <input type="number" name="dailyLimitAmount" placeholder="Amount" value="${product.transactionLimits.daily?.amount || ''}">
                            <select name="dailyLimitCurrency">${getCurrencyOptions(product.transactionLimits.daily?.currency)}</select>
                        </div>
                    </div>
                     <div class="form-row">
                        <div class="form-group transaction-limit">
                            <label>Monthly Limit</label>
                            <input type="number" name="monthlyLimitAmount" placeholder="Amount" value="${product.transactionLimits.monthly?.amount || ''}">
                            <select name="monthlyLimitCurrency">${getCurrencyOptions(product.transactionLimits.monthly?.currency)}</select>
                        </div>
                         <div class="form-group transaction-limit">
                            <label>Annual Limit</label>
                            <input type="number" name="annualLimitAmount" placeholder="Amount" value="${product.transactionLimits.annual?.amount || ''}">
                            <select name="annualLimitCurrency">${getCurrencyOptions(product.transactionLimits.annual?.currency)}</select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Covered Countries</label>
                        <div class="dynamic-list" id="edit-countries-list">
                            <div class="list-items">
                                ${product.countries.map(country => `
                                    <div class="list-item">
                                        <input type="text" name="country[]" value="${country}" required>
                                        <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()"><i>-</i></button>
                                    </div>
                                `).join('')}
                            </div>
                            <button type="button" class="add-item-btn" onclick="addListItem('edit-countries-list', 'country')">
                                <i>+</i> Add Country
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="secondary-button" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="primary-button">
                            <i class="fas fa-save"></i> Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

// 更新产品信息并记录日志
function updateProduct(event, productId) {
    event.preventDefault();
    const form = event.target;
    
    const countries = Array.from(form.querySelectorAll('input[name="country[]"]')).map(input => input.value);
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const oldProduct = JSON.parse(JSON.stringify(products[productIndex])); // 深拷贝旧数据

    // 构建新的产品数据
    const updatedProductData = {
        name: form.productName.value,
        description: form.description.value,
        productLiveDate: form.productLiveDate.value,
        transactionProcessingDate: form.transactionProcessingDate.value,
        assessor: form.assessor.value,
        approver: form.approver.value,
        countries: countries,
        transactionLimits: { 
            singleMax: { amount: form.singleMaxAmount.value, currency: form.singleMaxCurrency.value },
            daily: { amount: form.dailyLimitAmount.value, currency: form.dailyLimitCurrency.value },
            monthly: { amount: form.monthlyLimitAmount.value, currency: form.monthlyLimitCurrency.value },
            annual: { amount: form.annualLimitAmount.value, currency: form.annualLimitCurrency.value },
        }
    };

    // 定义需要比较的字段
    const fieldsToCompare = [
        'name', 'description', 'productLiveDate', 'transactionProcessingDate', 
        'assessor', 'approver', 'countries', 'transactionLimits'
    ];

    // 获取更改
    const changes = getObjectChanges(oldProduct, updatedProductData, fieldsToCompare);

    // 如果有更改，则记录日志
    if (changes.length > 0) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: "CurrentUser", // 您可能需要一个实际的用户系统来获取用户名
            changes: changes
        };
        
        const logs = JSON.parse(localStorage.getItem(`productLogs_${productId}`) || '[]');
        logs.push(logEntry);
        localStorage.setItem(`productLogs_${productId}`, JSON.stringify(logs));
    }

    // 更新产品数据
    products[productIndex] = { ...oldProduct, ...updatedProductData, merchants: [] }; // 合并，确保 merchants 保持为空
    
    localStorage.setItem('products', JSON.stringify(products));
    
    showCompanyDashboard(oldProduct.companyId); // 使用旧产品的 companyId 刷新
    form.closest('.modal-overlay').remove();
}

// 删除产品
function deleteProduct(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const confirmHtml = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>删除确认</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="confirm-content">
                    <div class="confirm-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="confirm-message">
                        <p>确定要删除产品 "${product.name}" 吗？</p>
                        <p class="warning-text">此操作无法撤销，相关的所有评估数据都将被删除。</p>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="secondary-button" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i> 取消
                    </button>
                    <button class="danger-button" onclick="confirmDeleteProduct(${productId}, this)">
                        <i class="fas fa-trash"></i> 确认删除
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', confirmHtml);
}

// 确认删除产品
function confirmDeleteProduct(productId, button) {
    const product = products.find(p => p.id === productId);
    const company = companies.find(c => c.id === product.companyId);
    
    // 删除产品相关的所有数据
    localStorage.removeItem(`fraudTypes_${productId}`);
    localStorage.removeItem(`fraudAssessments_${productId}`);
    
    // 更新产品列表和公司产品数量
    products = products.filter(p => p.id !== productId);
    company.productCount--;
    
    // 保存更新
    localStorage.setItem('companies', JSON.stringify(companies));
    localStorage.setItem('products', JSON.stringify(products));
    
    // 关闭确认框并刷新显示
    button.closest('.modal-overlay').remove();
    showCompanyDashboard(company.id);
}

// 更新公司的产品数量
function updateCompanyProductCount(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        company.productCount = products.filter(p => p.companyId === companyId).length;
        localStorage.setItem('companies', JSON.stringify(companies));
    }
}

// 渲染Fraud Type列表
function renderFraudAssessments(productId) {
    const tbody = document.querySelector('#product-detail table tbody');
    const assessments = fraudAssessments.filter(fa => fa.productId === productId);
    
    function getRiskColor(level) {
        switch(level.toLowerCase()) {
            case 'low':
                return '#4CAF50'; // 绿色
            case 'medium':
                return '#FFC107'; // 黄色
            case 'high':
                return '#F44336'; // 红色
            default:
                return 'black';
        }
    }

    tbody.innerHTML = assessments.map(assessment => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; width: 200px;">${assessment.criteria}</td>
            <td style="border: 1px solid #ddd; padding: 8px; width: 100px;">${assessment.fraudRate || '0'}%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">
                <div style="margin-bottom: 4px;">
                    <span>Likelihood: </span>
                    ${getDotIndicator(assessment.likelihood, getRiskColor(assessment.likelihood))}
                </div>
                <div style="margin-bottom: 4px;">
                    <span>Impact: </span>
                    ${getDotIndicator(assessment.impact, getRiskColor(assessment.impact))}
                </div>
                <div style="margin-bottom: 4px;">
                    <span>Inherent Risk: </span>
                    ${getDotIndicator(assessment.inherentRiskLevel, getRiskColor(assessment.inherentRiskLevel))}
                </div>
                <div style="margin-bottom: 4px;">
                    <span>Control Effectiveness: </span>
                    ${getDotIndicator(
                        assessment.controlEffectiveness === 'Strong' ? 'Low' : 
                        assessment.controlEffectiveness === 'Medium' ? 'Medium' : 'High',
                        getRiskColor(
                            assessment.controlEffectiveness === 'Strong' ? 'Low' : 
                            assessment.controlEffectiveness === 'Medium' ? 'Medium' : 'High'
                        )
                    )}
                    (${assessment.controlEffectiveness})
                </div>
                <div>
                    <span>Residual Risk: </span>
                    ${getDotIndicator(assessment.residualRisk, getRiskColor(assessment.residualRisk))}
                </div>
            </td>
            <td style="border: 1px solid #ddd; padding: 8px; width: 120px;">
                <button class="button" onclick="editFraudAssessment(${assessment.id})">编辑</button>
                <button class="button delete" onclick="deleteFraudAssessment(${assessment.id}, ${assessment.productId})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 显示添加企业表单 (添加特定类名)
function showAddCompanyForm() {
    const formHtml = `
        <div class="modal-overlay">
            <div class="modal-content add-company-modal">
                <div class="modal-header">
                     <h3>添加公司</h3>
                     <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <form onsubmit="addCompany(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="companyNameInput">公司名称</label>
                            <input type="text" id="companyNameInput" name="companyName" required>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()">取消</button>
                        <button type="submit">添加</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
    // 聚焦到输入框
    document.getElementById('companyNameInput')?.focus();
}

// 添加新企业
function addCompany(event) {
    event.preventDefault();
    const form = event.target;
    const companyName = form.companyName.value;
    
    const newCompany = {
        id: Date.now(),
        name: companyName,
        productCount: 0
    };
    
    companies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(companies));
    
    renderCompanies();
    form.closest('.modal-overlay').remove();
}

// 显示编辑企业表单
function showEditCompanyForm(companyId, event) {
    event.stopPropagation(); // 阻止事件冒泡，防止触发showCompanyDashboard

    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    const modalHtml = `
        <div class="modal-overlay" onclick="this.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>编辑企业</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <form id="edit-company-form" onsubmit="updateCompany(event, ${companyId})">
                    <div class="form-group">
                        <label for="edit-company-name">企业名称</label>
                        <input type="text" id="edit-company-name" value="${company.name}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()">取消</button>
                        <button type="submit">保存</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 更新企业信息
function updateCompany(event, companyId) {
    event.preventDefault();
    const newName = document.getElementById('edit-company-name').value.trim();
    if (!newName) return;

    const companyIndex = companies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
        companies[companyIndex].name = newName;
        localStorage.setItem('companies', JSON.stringify(companies));
        renderCompanyCards(); // 重新渲染公司列表

        // 如果当前仪表板显示的是这个公司，更新仪表板标题
        const dashboard = document.getElementById('company-dashboard');
        if (dashboard.dataset.currentCompanyId == companyId) {
            const dashboardTitle = dashboard.querySelector('.dashboard-header h2');
            if (dashboardTitle) {
                dashboardTitle.textContent = `${newName} 仪表板`;
            }
        }
    }
    document.getElementById('edit-company-form').closest('.modal-overlay').remove(); // 关闭模态框
}

// 删除公司（旧函数，可能不再使用）
function deleteCompany(companyId, event) {
    // if (confirm(`确定要删除公司 ${companyId} 及其所有产品吗？`)) {
    //     companies = companies.filter(c => c.id !== companyId);
    //     products = products.filter(p => p.companyId !== companyId);
    //     localStorage.setItem('companies', JSON.stringify(companies));
    //     localStorage.setItem('products', JSON.stringify(products));
    //     renderCompanyCards();
    //     document.getElementById('company-dashboard').innerHTML = `
    //         <div class="empty-state">
    //             <i>📊</i>
    //             <p>选择一个公司查看详细信息</p>
    //         </div>
    //     `;
    // }
    // event.stopPropagation(); // 阻止事件冒泡到卡片点击
}

// 显示公司仪表板
function showCompanyDashboard(companyId) {
    const company = companies.find(c => c.id === companyId);
    const companyProducts = products.filter(p => p.companyId === companyId);
    
    const dashboard = document.getElementById('company-dashboard');
    dashboard.dataset.currentCompanyId = companyId; // Store current company ID

    // Helper function to format transaction limits
    const formatLimit = (limit) => {
        return limit && limit.amount ? `${limit.amount} ${limit.currency}` : 'N/A';
    };

    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h2>${company.name}</h2>
            <div class="header-actions">
                <button class="add-button" onclick="showAddProductForm(${companyId})">
                    <i class="fas fa-plus"></i>
                    <span>Add Product</span>
                </button>
            </div>
        </div>
        <div class="product-list">
            ${companyProducts.map(product => {
                // Ensure transactionLimits exists
                const limits = product.transactionLimits || { singleMax: {}, daily: {}, monthly: {}, annual: {} };
                return `
                <div class="product-card">
                    <div class="product-info">
                        <div class="product-header">
                            <h3>${product.name}</h3>
                            <div class="card-actions">
                                <button class="icon-button view-log-button" onclick="showProductLog(${product.id}, event)" title="View Change Log">
                                    <i class="fas fa-history"></i>
                                </button>
                                <button class="icon-button edit-button" onclick="editProduct(${product.id}, event)" title="Edit Product">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-button delete-button" onclick="deleteProduct(${product.id}, event)" title="Delete Product">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p class="product-description">${product.description || 'No description'}</p>
                        <div class="product-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>Product Live Date: ${product.productLiveDate || 'N/A'}</span>
                            </div>
                             <div class="meta-item">
                                <i class="fas fa-calendar-check"></i>
                                <span>Processing Date: ${product.transactionProcessingDate || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user-edit"></i>
                                <span>Assessor: ${product.assessor || 'N/A'}</span>
                            </div>
                             <div class="meta-item">
                                <i class="fas fa-user-check"></i>
                                <span>Approver: ${product.approver || 'N/A'}</span>
                            </div>
                        </div>
                         <div class="product-details">
                             <h4>Transaction Limits</h4>
                             <div class="limits-grid">
                                 <div class="limit-item"><strong>Single Max:</strong> ${formatLimit(limits.singleMax)}</div>
                                 <div class="limit-item"><strong>Daily:</strong> ${formatLimit(limits.daily)}</div>
                                 <div class="limit-item"><strong>Monthly:</strong> ${formatLimit(limits.monthly)}</div>
                                 <div class="limit-item"><strong>Annual:</strong> ${formatLimit(limits.annual)}</div>
                             </div>
                        </div>
                        <div class="product-details">
                            <h4>Covered Countries</h4>
                            <div class="tag-list">
                                ${product.countries && product.countries.length > 0 ? product.countries.map(country => `
                                    <span class="tag">
                                        <span class="tag-text">${country}</span>
                                        <button class="tag-delete" onclick="removeCountry(${product.id}, '${country}', event)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </span>
                                `).join('') : '<span class="no-tags">No Countries Covered</span>'}
                                <button class="add-tag" onclick="addCountry(${product.id}, event)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 风险等级与警告区块插入 -->
                        <div class="risk-level-section">
                            <h3>Overall Risk Level</h3>
                            <div class="risk-item">
                                <span>Inherent Risk：</span>
                                <span id="inherent-risk" class="risk-medium">Medium</span>
                            </div>
                            <div class="risk-item">
                                <span>Control Effectiveness：</span>
                                <span id="control-effectiveness" class="risk-high">High</span>
                            </div>
                            <div class="risk-item">
                                <span>Residual Risk：</span>
                                <span id="residual-risk" class="risk-medium">Medium</span>
                            </div>
                        </div>
                        <div class="regulatory-section warning-section">
                            <h3>Regulatory Requirement</h3>
                            <div class="regulatory-list" id="regulatory-list">
                                <!-- 合规要求列表将动态插入 -->
                            </div>
                            <button class="add-regulatory-btn" onclick="addRegulatoryRequirement(this)">添加合规要求</button>
                        </div>
                    </div>
                    <div class="assessment-buttons">
                        <button class="assessment-btn fraud" onclick="showFraudAssessment(${product.id}, event)">
                            <i class="fas fa-shield-alt"></i>
                            <span>Fraud Assessment</span>
                        </button>
                        <button class="assessment-btn aml" onclick="showAMLAssessment(${product.id}, event)">
                            <i class="fas fa-money-check-alt"></i>
                            <span>AML Assessment</span>
                        </button>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
    renderRegulatoryRequirements(companyProducts[0].id);
}

// 显示添加产品表单
function showAddProductForm(companyId) {
    const currencies = ['CNY', 'SGD', 'USD', 'HKD', 'JPY', 'AUD', 'GBP'];
    const currencyOptions = currencies.map(c => `<option value="${c}">${c}</option>`).join('');

    const formHtml = `
        <div class="modal-overlay">
            <div class="modal-content wide-modal product-edit-modal">
                <div class="modal-header">
                    <h3>Add Product</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <form onsubmit="addProduct(event, ${companyId})" class="product-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" name="productName" required>
                        </div>
                        <div class="form-group">
                            <label>Assessor</label>
                            <input type="text" name="assessor" required>
                        </div>
                        <div class="form-group">
                            <label>Approver</label>
                            <input type="text" name="approver" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Product Description</label>
                        <textarea name="description" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Product Live Date</label>
                            <input type="date" name="productLiveDate" required>
                        </div>
                        <div class="form-group">
                            <label>Transaction Processing Date</label>
                            <input type="date" name="transactionProcessingDate" required>
                        </div>
                    </div>

                    <h4>Transaction Limits</h4>
                    <div class="form-row">
                        <div class="form-group transaction-limit">
                            <label>Single Maximum</label>
                            <input type="number" name="singleMaxAmount" placeholder="Amount">
                            <select name="singleMaxCurrency">${currencyOptions}</select>
                        </div>
                         <div class="form-group transaction-limit">
                            <label>Daily Limit</label>
                            <input type="number" name="dailyLimitAmount" placeholder="Amount">
                            <select name="dailyLimitCurrency">${currencyOptions}</select>
                        </div>
                    </div>
                     <div class="form-row">
                        <div class="form-group transaction-limit">
                            <label>Monthly Limit</label>
                            <input type="number" name="monthlyLimitAmount" placeholder="Amount">
                            <select name="monthlyLimitCurrency">${currencyOptions}</select>
                        </div>
                         <div class="form-group transaction-limit">
                            <label>Annual Limit</label>
                            <input type="number" name="annualLimitAmount" placeholder="Amount">
                            <select name="annualLimitCurrency">${currencyOptions}</select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Covered Countries</label>
                        <div class="dynamic-list" id="countries-list">
                            <div class="list-items"></div>
                            <button type="button" class="add-item-btn" onclick="addListItem('countries-list', 'country')">
                                <i>+</i> Add Country
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

// 添加列表项
function addListItem(listId, type) {
    const container = document.querySelector(`#${listId} .list-items`);
    const itemHtml = `
        <div class="list-item">
            <input type="text" name="${type}[]" required placeholder="输入${type === 'country' ? '国家' : '商户'}名称">
            <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()">
                <i>-</i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHtml);
}

// 添加产品
function addProduct(event, companyId) {
    event.preventDefault();
    const form = event.target;
    
    const countries = Array.from(form.querySelectorAll('input[name="country[]"]')).map(input => input.value);
    
    const newProduct = {
        id: Date.now(),
        companyId: companyId,
        name: form.productName.value,
        description: form.description.value,
        productLiveDate: form.productLiveDate.value,
        transactionProcessingDate: form.transactionProcessingDate.value,
        assessor: form.assessor.value,
        approver: form.approver.value,
        countries: countries,
        merchants: [],
        transactionLimits: {
            singleMax: { amount: form.singleMaxAmount.value, currency: form.singleMaxCurrency.value },
            daily: { amount: form.dailyLimitAmount.value, currency: form.dailyLimitCurrency.value },
            monthly: { amount: form.monthlyLimitAmount.value, currency: form.monthlyLimitCurrency.value },
            annual: { amount: form.annualLimitAmount.value, currency: form.annualLimitCurrency.value },
        }
    };
    
    products.push(newProduct);
    
    const company = companies.find(c => c.id === companyId);
    company.productCount = (company.productCount || 0) + 1;
    
    localStorage.setItem('companies', JSON.stringify(companies));
    localStorage.setItem('products', JSON.stringify(products));
    
    showCompanyDashboard(companyId);
    form.closest('.modal-overlay').remove();
}

// 显示 Fraud Assessment
function showFraudAssessment(productId, event) {
    if (event) event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // 保存当前产品信息到 localStorage
    localStorage.setItem('currentProductId', productId);
    localStorage.setItem('currentProduct', JSON.stringify(product));
    
    // 跳转到 Fraud Assessment 页面
    window.location.href = 'fraud-assessment/index.html';
}

// 显示 AML Assessment
function showAMLAssessment(productId, event) {
    if (event) event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // 保存当前产品信息到 localStorage
    localStorage.setItem('currentProductId', productId);
    localStorage.setItem('currentProduct', JSON.stringify(product));
    
    // 跳转到 AML Assessment 页面
    window.location.href = 'aml-assessment/index.html';
}

// 添加国家
function addCountry(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const countryName = prompt('请输入国家名称：');
    if (countryName && !product.countries.includes(countryName)) {
        product.countries.push(countryName);
        localStorage.setItem('products', JSON.stringify(products));
        showCompanyDashboard(product.companyId);
    }
}

// 删除国家
function removeCountry(productId, country, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`确定要删除国家 "${country}" 吗？`)) {
        product.countries = product.countries.filter(c => c !== country);
        localStorage.setItem('products', JSON.stringify(products));
        showCompanyDashboard(product.companyId);
    }
}

// 登录功能
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'test' && password === 'test') {
        sessionStorage.setItem('isLoggedIn', 'true');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        renderCompanies();
    } else {
        alert('用户名或密码错误');
    }
}

// 显示产品编辑日志
function showProductLog(productId, event) {
    if (event) event.stopPropagation(); // 防止事件冒泡
    const logs = JSON.parse(localStorage.getItem(`productLogs_${productId}`) || '[]');
    const product = products.find(p => p.id === productId);
    const productName = product ? product.name : 'Unknown Product';

    let logHtml = '<p>No changes recorded for this product.</p>';
    if (logs.length > 0) {
        logHtml = logs.reverse().map(log => `
            <div class="log-entry">
                <div class="log-timestamp">${new Date(log.timestamp).toLocaleString()}</div>
                <div class="log-user">by ${log.user}</div>
                <ul class="log-changes">
                    ${log.changes.map(change => `<li>${change}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    const modalHtml = `
        <div class="modal-overlay" onclick="this.remove()">
            <div class="modal-content log-modal">
                <div class="modal-header">
                    <h3>Change Log: ${productName}</h3>
                    <button class="close-button" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="log-container">
                    ${logHtml}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 页面加载完成后执行
window.onload = function() {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        renderCompanies();
    } else {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }
};

// 合规要求数据存储在localStorage，按产品ID区分
function getCurrentProductId() {
    return window.currentProductId || localStorage.getItem('currentProductId');
}

function renderRegulatoryRequirements(productId) {
    const list = document.getElementById('regulatory-list');
    if (!list) return;
    const requirements = JSON.parse(localStorage.getItem(`regulatoryRequirements_${productId}`) || '[]');
    if (requirements.length === 0) {
        list.innerHTML = '<div class="no-tags">暂无合规要求</div>';
        return;
    }
    list.innerHTML = `
        <div class="regulatory-table-header regulatory-item">
            <span style='flex:2;'>Requirement Description</span>
            <span style='flex:1;'>Status</span>
            <span style='flex:2;'>Source</span>
            <span style='width:60px;'></span>
        </div>
        ${requirements.map((item, idx) => `
            <div class="regulatory-item" style="gap:8px;">
                <input class="reg-input" style="flex:2;" value="${item.description || ''}" onchange="updateRegulatoryRequirement(${idx}, 'description', this.value)">
                <select class="reg-select" style="flex:1;" onchange="updateRegulatoryRequirement(${idx}, 'status', this.value)">
                    <option value="meet" ${item.status==='meet'?'selected':''}>meet</option>
                    <option value="not meet" ${item.status==='not meet'?'selected':''}>not meet</option>
                    <option value="partial meet" ${item.status==='partial meet'?'selected':''}>partial meet</option>
                </select>
                <input class="reg-input" style="flex:2;" value="${item.source || ''}" onchange="updateRegulatoryRequirement(${idx}, 'source', this.value)">
                <button class="delete-regulatory-btn" onclick="deleteRegulatoryRequirement(${idx})">删除</button>
            </div>
        `).join('')}
    `;
}

function addRegulatoryRequirement(btn) {
    const productId = getCurrentProductId();
    // 默认空行，用户直接编辑
    const requirements = JSON.parse(localStorage.getItem(`regulatoryRequirements_${productId}`) || '[]');
    requirements.push({description:'', status:'meet', source:''});
    localStorage.setItem(`regulatoryRequirements_${productId}` , JSON.stringify(requirements));
    renderRegulatoryRequirements(productId);
}

function updateRegulatoryRequirement(idx, field, value) {
    const productId = getCurrentProductId();
    let requirements = JSON.parse(localStorage.getItem(`regulatoryRequirements_${productId}`) || '[]');
    requirements[idx][field] = value;
    localStorage.setItem(`regulatoryRequirements_${productId}` , JSON.stringify(requirements));
    // 可选：renderRegulatoryRequirements(productId); // 若需实时刷新
}

function deleteRegulatoryRequirement(idx) {
    const productId = getCurrentProductId();
    let requirements = JSON.parse(localStorage.getItem(`regulatoryRequirements_${productId}`) || '[]');
    requirements.splice(idx, 1);
    localStorage.setItem(`regulatoryRequirements_${productId}` , JSON.stringify(requirements));
    renderRegulatoryRequirements(productId);
}

function showGlobalDashboardModal() {
    if(document.getElementById('global-dashboard-modal')) return;
    // 多维度模拟数据
    const chartDataSets = {
        day: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            transactionAlerts: [12, 18, 9, 15, 20, 8, 10],
            reviewAlerts: [5, 7, 4, 6, 8, 3, 4],
            fraudLoss: [5, 8, 3, 7, 10, 2, 4],
            recovery: [1, 2, 1, 2, 3, 1, 1],
            topTriggers: [
                {name: 'Large Amount', value: 22},
                {name: 'Blacklisted Account', value: 18},
                {name: 'Frequent Transactions', value: 15},
                {name: 'Unusual Location', value: 13},
                {name: 'High Risk Country', value: 12},
                {name: 'Multiple Recipients', value: 10},
                {name: 'Odd Hours', value: 9},
                {name: 'Velocity', value: 8},
                {name: 'New Device', value: 7},
                {name: 'Other', value: 6}
            ],
            caseTable: [
                {type: 'Investing Case', value: 5},
                {type: 'Fraud Case', value: 8},
                {type: 'STR Cases', value: 3}
            ]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            transactionAlerts: [60, 75, 80, 70],
            reviewAlerts: [22, 28, 25, 30],
            fraudLoss: [20, 25, 30, 22],
            recovery: [5, 7, 8, 6],
            topTriggers: [
                {name: 'Large Amount', value: 80},
                {name: 'Blacklisted Account', value: 70},
                {name: 'Frequent Transactions', value: 65},
                {name: 'Unusual Location', value: 60},
                {name: 'High Risk Country', value: 55},
                {name: 'Multiple Recipients', value: 50},
                {name: 'Odd Hours', value: 45},
                {name: 'Velocity', value: 40},
                {name: 'New Device', value: 35},
                {name: 'Other', value: 30}
            ],
            caseTable: [
                {type: 'Investing Case', value: 22},
                {type: 'Fraud Case', value: 30},
                {type: 'STR Cases', value: 12}
            ]
        },
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            transactionAlerts: [300, 280, 350, 400, 420, 390, 410, 430, 390, 370, 360, 380],
            reviewAlerts: [120, 110, 130, 140, 150, 135, 145, 155, 140, 130, 125, 135],
            fraudLoss: [40, 38, 45, 50, 52, 48, 51, 53, 49, 47, 46, 48],
            recovery: [10, 9, 12, 13, 14, 12, 13, 15, 13, 12, 11, 13],
            topTriggers: [
                {name: 'Large Amount', value: 320},
                {name: 'Blacklisted Account', value: 300},
                {name: 'Frequent Transactions', value: 280},
                {name: 'Unusual Location', value: 260},
                {name: 'High Risk Country', value: 250},
                {name: 'Multiple Recipients', value: 230},
                {name: 'Odd Hours', value: 210},
                {name: 'Velocity', value: 200},
                {name: 'New Device', value: 180},
                {name: 'Other', value: 160}
            ],
            caseTable: [
                {type: 'Investing Case', value: 120},
                {type: 'Fraud Case', value: 180},
                {type: 'STR Cases', value: 60}
            ]
        }
    };
    let currentDim = 'day';
    const modalHtml = `
        <div class=\"modal-overlay\" id=\"global-dashboard-modal\" style=\"z-index:2000;\">
            <div class=\"modal-content dashboard-modal\" style=\"width: 1400px; max-width: 99vw; background: #181c2a; color: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.25);padding:24px 24px 18px 24px;\">
                <div class=\"modal-header\" style=\"display:flex;align-items:center;justify-content:space-between;padding:0 0 10px 0;\">
                    <h3 style=\"color:#fff;font-size:1.4em;letter-spacing:1px;\">Dashboard Overview</h3>
                    <button class=\"close-button\" onclick=\"document.getElementById('global-dashboard-modal').remove()\" style=\"color:#fff;font-size:1.5em;\">×</button>
                </div>
                <div class=\"dashboard-row\" style=\"display:flex;gap:24px;margin-bottom:18px;\">
                    <div class=\"dashboard-card green\" style=\"flex:1;min-width:180px;\">
                        <div class=\"card-title\">Total Volume</div>
                        <div class=\"card-value\">$1,000M</div>
                    </div>
                    <div class=\"dashboard-card red\" style=\"flex:1;min-width:180px;\">
                        <div class=\"card-title\">Fraud Loss</div>
                        <div class=\"card-value\">$50M</div>
                    </div>
                    <div class=\"dashboard-card blue\" style=\"flex:1;min-width:180px;\">
                        <div class=\"card-title\">Recovery Amount</div>
                        <div class=\"card-value\">$10M</div>
                    </div>
                    <div class=\"dashboard-card\" style=\"flex:1.2;min-width:220px;background:#23263a;border-radius:12px;padding:18px 16px;display:flex;flex-direction:column;justify-content:center;\">
                        <div class=\"chart-title-row\" style=\"display:flex;align-items:center;justify-content:space-between;\">
                            <div class=\"chart-title\" style=\"font-size:1.1em;font-weight:600;\">Case Overview</div>
                            <select id=\"caseTimeDim\" style=\"background:#23263a;color:#fff;border:1px solid #444;padding:2px 8px;border-radius:6px;\">
                                <option value=\"day\">Day</option>
                                <option value=\"month\">Month</option>
                                <option value=\"year\">Year</option>
                            </select>
                        </div>
                        <table id=\"caseTable\" style=\"width:100%;margin-top:8px;color:#fff;font-size:1.05em;border-collapse:collapse;\">
                            <thead><tr style=\"color:#8ec6ff;font-size:1em;\"><th style=\"text-align:left;padding:4px 8px;\">Type</th><th style=\"text-align:right;padding:4px 8px;\">Count</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                <div class=\"dashboard-row\" style=\"display:flex;gap:24px;\">
                    <div class=\"dashboard-chart-card\" style=\"flex:1;min-width:0;\">
                        <div class=\"chart-title-row\" style=\"display:flex;align-items:center;justify-content:space-between;\">
                            <div class=\"chart-title\">Transaction & Review Alerts</div>
                            <select id=\"alertsTimeDim\" style=\"background:#23263a;color:#fff;border:1px solid #444;padding:2px 8px;border-radius:6px;\">
                                <option value=\"day\">Day</option>
                                <option value=\"month\">Month</option>
                                <option value=\"year\">Year</option>
                            </select>
                        </div>
                        <canvas id=\"alertsChart\" style=\"width:100%;height:180px;max-width:100%;max-height:180px;\" width=\"420\" height=\"180\"></canvas>
                    </div>
                    <div class=\"dashboard-chart-card\" style=\"flex:1;min-width:0;\">
                        <div class=\"chart-title-row\" style=\"display:flex;align-items:center;justify-content:space-between;\">
                            <div class=\"chart-title\">Fraud Loss & Recovery Amount</div>
                            <select id=\"lossTimeDim\" style=\"background:#23263a;color:#fff;border:1px solid #444;padding:2px 8px;border-radius:6px;\">
                                <option value=\"day\">Day</option>
                                <option value=\"month\">Month</option>
                                <option value=\"year\">Year</option>
                            </select>
                        </div>
                        <canvas id=\"lossChart\" style=\"width:100%;height:180px;max-width:100%;max-height:180px;\" width=\"420\" height=\"180\"></canvas>
                    </div>
                    <div class=\"dashboard-chart-card\" style=\"flex:1;min-width:0;\">
                        <div class=\"chart-title-row\" style=\"display:flex;align-items:center;justify-content:space-between;\">
                            <div class=\"chart-title\">Top 10 Trigger Alerts</div>
                            <select id=\"triggerTimeDim\" style=\"background:#23263a;color:#fff;border:1px solid #444;padding:2px 8px;border-radius:6px;\">
                                <option value=\"day\">Day</option>
                                <option value=\"month\">Month</option>
                                <option value=\"year\">Year</option>
                            </select>
                        </div>
                        <canvas id=\"topTriggerChart\" style=\"width:100%;height:220px;max-width:100%;max-height:220px;\" width=\"420\" height=\"220\"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    let chartInstance = null;
    let lossChartInstance = null;
    let topTriggerChartInstance = null;
    function renderAlertsChart(dim) {
        const data = chartDataSets[dim];
        if(chartInstance) chartInstance.destroy();
        chartInstance = new Chart(document.getElementById('alertsChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Transaction Alerts',
                        data: data.transactionAlerts,
                        backgroundColor: '#74b9ff',
                        borderRadius: 6,
                    },
                    {
                        label: 'Review Alerts',
                        data: data.reviewAlerts,
                        backgroundColor: '#fdcb6e',
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                plugins: {
                    legend: { labels: { color: '#fff', font: {size: 13} } }
                },
                layout: { padding: 10 },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#23263a' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#23263a' }, beginAtZero: true }
                },
                responsive: false,
                maintainAspectRatio: false,
            }
        });
    }
    function renderLossChart(dim) {
        const data = chartDataSets[dim];
        if(lossChartInstance) lossChartInstance.destroy();
        lossChartInstance = new Chart(document.getElementById('lossChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Fraud Loss Amount',
                        data: data.fraudLoss,
                        backgroundColor: '#ff7675',
                        borderRadius: 6,
                    },
                    {
                        label: 'Recovery Amount',
                        data: data.recovery,
                        backgroundColor: '#00b894',
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                plugins: {
                    legend: { labels: { color: '#fff', font: {size: 13} } }
                },
                layout: { padding: 10 },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#23263a' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#23263a' }, beginAtZero: true }
                },
                responsive: false,
                maintainAspectRatio: false,
            }
        });
    }
    function renderTopTriggerChart(dim) {
        const data = chartDataSets[dim].topTriggers;
        if(topTriggerChartInstance) topTriggerChartInstance.destroy();
        topTriggerChartInstance = new Chart(document.getElementById('topTriggerChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        label: 'Alert Count',
                        data: data.map(d => d.value),
                        backgroundColor: '#0984e3',
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                layout: { padding: 10 },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#23263a' }, beginAtZero: true },
                    y: { ticks: { color: '#fff' }, grid: { color: '#23263a' } }
                },
                responsive: false,
                maintainAspectRatio: false,
            }
        });
    }
    function renderCaseTable(dim) {
        const data = chartDataSets[dim].caseTable;
        const tbody = document.querySelector('#caseTable tbody');
        tbody.innerHTML = data.map(row => `<tr><td style='padding:4px 8px;'>${row.type}</td><td style='padding:4px 8px;text-align:right;'>${row.value}</td></tr>`).join('');
    }
    setTimeout(() => {
        renderAlertsChart(currentDim);
        renderLossChart(currentDim);
        renderTopTriggerChart(currentDim);
        renderCaseTable(currentDim);
        document.getElementById('alertsTimeDim').addEventListener('change', function() {
            currentDim = this.value;
            renderAlertsChart(currentDim);
            document.getElementById('lossTimeDim').value = currentDim;
            document.getElementById('triggerTimeDim').value = currentDim;
            document.getElementById('caseTimeDim').value = currentDim;
            renderLossChart(currentDim);
            renderTopTriggerChart(currentDim);
            renderCaseTable(currentDim);
        });
        document.getElementById('lossTimeDim').addEventListener('change', function() {
            currentDim = this.value;
            renderLossChart(currentDim);
            document.getElementById('alertsTimeDim').value = currentDim;
            document.getElementById('triggerTimeDim').value = currentDim;
            document.getElementById('caseTimeDim').value = currentDim;
            renderAlertsChart(currentDim);
            renderTopTriggerChart(currentDim);
            renderCaseTable(currentDim);
        });
        document.getElementById('triggerTimeDim').addEventListener('change', function() {
            currentDim = this.value;
            renderTopTriggerChart(currentDim);
            document.getElementById('alertsTimeDim').value = currentDim;
            document.getElementById('lossTimeDim').value = currentDim;
            document.getElementById('caseTimeDim').value = currentDim;
            renderAlertsChart(currentDim);
            renderLossChart(currentDim);
            renderCaseTable(currentDim);
        });
        document.getElementById('caseTimeDim').addEventListener('change', function() {
            currentDim = this.value;
            renderCaseTable(currentDim);
            document.getElementById('alertsTimeDim').value = currentDim;
            document.getElementById('lossTimeDim').value = currentDim;
            document.getElementById('triggerTimeDim').value = currentDim;
            renderAlertsChart(currentDim);
            renderLossChart(currentDim);
            renderTopTriggerChart(currentDim);
        });
    }, 100);
}