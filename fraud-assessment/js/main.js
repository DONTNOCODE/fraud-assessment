// 添加标签页切换功能
function switchTab(tabId) {
    // 更新标签页状态
    document.querySelectorAll('.nav-item').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.nav-item[onclick*="${tabId}"]`).classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    // 加载相应内容
    switch(tabId) {
        case 'fraud':
            loadFraudAssessment();
            break;
        case 'aml':
            loadAMLAssessment();
            break;
        case 'dashboard':
            loadAssessmentDashboard();
            break;
    }
}

// 修改showProductDetail函数，确保显示第一个标签页
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-list').style.display = 'none';
        document.getElementById('product-detail').style.display = 'block';
        
        // 填充产品详情表单
        const form = document.getElementById('product-detail');
        const productInfoTab = document.getElementById('product-info');
        productInfoTab.querySelector('input[type="text"]').value = product.name;
        productInfoTab.querySelectorAll('input[type="date"]')[0].value = product.launchDate;
        productInfoTab.querySelectorAll('input[type="date"]')[1].value = product.assessmentDate;
        productInfoTab.querySelectorAll('input[type="text"]')[1].value = product.assessor;
        
        // 存储当前产品ID
        form.setAttribute('data-product-id', productId);
        
        // 显示第一个标签页
        switchTab('product-info');
        
        // 渲染相关数据
        renderAssociatedCompanies(productId);
        renderFraudAssessments(productId);
        
        // 渲染AML Assessment数据
        if (typeof renderAMLAssessments === 'function') {
            renderAMLAssessments(productId);
        }
        
        // 渲染Dashboard
        if (typeof renderDashboard === 'function') {
            renderDashboard(productId);
        }
    }
}

// 修改显示产品列表函数
function showProductList(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        document.getElementById('company-list').style.display = 'none';
        document.getElementById('product-list').style.display = 'block';
        
        // 设置公司ID和名称
        const productList = document.getElementById('product-list');
        productList.setAttribute('data-company-id', companyId);
        productList.querySelector('h1 span').textContent = company.name;
        
        // 渲染产品列表
        renderProducts(companyId);
        
        // 添加到浏览历史
        location.hash = `company-${companyId}`;
    }
}

// 修改返回功能
function backToCompanyList() {
    document.getElementById('product-detail').style.display = 'none';
    document.getElementById('product-list').style.display = 'none';
    document.getElementById('company-list').style.display = 'block';
    // 清除URL hash
    history.pushState("", document.title, window.location.pathname);
}

// 修改window.onload，添加浏览器后退按钮支持
window.onload = function() {
    renderCompanies();
    
    // 处理后退按钮
    window.onpopstate = function() {
        if (location.hash.startsWith('#company-')) {
            // 返回到产品列表
            const companyId = parseInt(location.hash.replace('#company-', ''));
            document.getElementById('product-detail').style.display = 'none';
            showProductList(companyId);
        } else {
            // 返回到公司列表
            document.getElementById('product-detail').style.display = 'none';
            document.getElementById('product-list').style.display = 'none';
            document.getElementById('company-list').style.display = 'block';
        }
    };
};

// 添加 Fraud Type 表单
function showAddFraudAssessmentForm() {
    const productId = parseInt(document.getElementById('product-detail').getAttribute('data-product-id'));
    
    const selectFormHtml = `
        <div style="padding: 30px;">
            <h3 style="margin-bottom: 25px; color: #333; font-size: 1.6em; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                Select and Edit Fraud Types
            </h3>
            
            <!-- 添加自定义 Fraud Type 的部分 -->
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #4CAF50; border-radius: 8px; background: #f9f9f9;">
                <h4 style="margin-bottom: 15px; color: #4CAF50;">添加自定义 Fraud Type</h4>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="customFraudType" placeholder="输入自定义Fraud Type名称" 
                        style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <button onclick="addCustomFraudType()" class="button" style="white-space: nowrap;">
                        添加
                    </button>
                </div>
                <div id="customFraudTypeList" style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <!-- 自定义的Fraud Types将在这里显示 -->
                </div>
            </div>

            <!-- 预定义 Fraud Types 列表 -->
            <div style="max-height: 60vh; overflow-y: auto; padding-right: 15px;">
                ${FRAUD_TYPES.map(type => `
                    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
                        <label style="display: flex; align-items: start;">
                            <input type="checkbox" value="${type}" 
                                style="margin-top: 4px; width: 18px; height: 18px; accent-color: #4CAF50;">
                            <div style="margin-left: 15px; width: 100%;">
                                <span style="display: block; margin-bottom: 5px;">${type}</span>
                            </div>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const formContainer = document.createElement('div');
    formContainer.innerHTML = selectFormHtml;
    formContainer.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border:1px solid #ddd;border-radius:12px;width:95%;max-width:800px;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
    
    // ... 其他代码保持不变 ...

    // 修改提交按钮的处理逻辑
    submitButton.onclick = () => {
        const selectedTypes = [
            // 获取预定义类型的选择
            ...Array.from(formContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => ({
                    type: checkbox.value
                })),
            // 获取自定义类型
            ...Array.from(formContainer.querySelectorAll('.custom-fraud-type'))
                .map(div => ({
                    type: div.getAttribute('data-type')
                }))
        ];
        
        if (selectedTypes.length === 0) {
            alert('请至少选择或添加一个Fraud Type');
            return;
        }
        
        document.body.removeChild(overlay);
        document.body.removeChild(formContainer);
        
        // 显示详情表单
        showFraudTypeDetailsForm(selectedTypes, productId);
    };

    // ... 其他代码保持不变 ...
}

// 添加自定义 Fraud Type
function addCustomFraudType() {
    const input = document.getElementById('customFraudType');
    const customType = input.value.trim();
    
    if (!customType) {
        alert('请输入Fraud Type名称');
        return;
    }
    
    const container = document.getElementById('customFraudTypeList');
    const typeDiv = document.createElement('div');
    typeDiv.className = 'custom-fraud-type';
    typeDiv.setAttribute('data-type', customType);
    typeDiv.style.cssText = 'background: #4CAF50; color: white; padding: 5px 10px; border-radius: 4px; display: flex; align-items: center; gap: 10px;';
    typeDiv.innerHTML = `
        <span>${customType}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
            ×
        </button>
    `;
    
    container.appendChild(typeDiv);
    input.value = '';
}

// 添加AML Assessment相关函数
function showAddAMLAssessmentForm() {
    // 这里添加AML Assessment表单的代码
    alert('AML Assessment功能正在开发中...');
}

// 添加Dashboard渲染函数
function renderDashboard(productId) {
    // 这里添加Dashboard渲染的代码
    const fraudRiskChart = document.getElementById('fraud-risk-chart');
    const amlRiskChart = document.getElementById('aml-risk-chart');
    
    // 示例：添加临时内容
    fraudRiskChart.innerHTML = '<div style="text-align: center; padding: 20px;">Fraud Risk Chart (Coming Soon)</div>';
    amlRiskChart.innerHTML = '<div style="text-align: center; padding: 20px;">AML Risk Chart (Coming Soon)</div>';
}

// 修改预定义的 Fraud Types，包括 other_scam
const FRAUD_TYPES = [
    { 
        id: 'phishing', 
        name: 'Phishing', 
        icon: 'fa-fish',
        description: '钓鱼欺诈是一种网络攻击，攻击者通过伪装成可信实体来获取敏感信息。'
    },
    { 
        id: 'bec', 
        name: 'Business Email Compromise (BEC)', 
        icon: 'fa-envelope',
        description: '商业电子邮件诈骗是一种针对企业的欺诈，攻击者冒充高管或商业伙伴发送虚假邮件。'
    },
    { id: 'card_skimming', name: 'Card Skimming', icon: 'fa-credit-card', description: 'Card Skimming is a type of fraud where criminals skim credit card information from magnetic strips or chip readers.' },
    { id: 'stolen_card', name: 'Stolen Card/Bank Account', icon: 'fa-wallet', description: 'Stolen Card/Bank Account fraud involves unauthorized access to a victim\'s bank account or credit card information.' },
    { id: 'account_takeover', name: 'Account Takeover', icon: 'fa-user-shield', description: 'Account Takeover fraud involves unauthorized access to a victim\'s online account.' },
    { id: 'identity_fraud', name: 'Identity Fraud', icon: 'fa-user-secret', description: 'Identity Fraud involves the unauthorized use of someone else\'s personal information.' },
    { id: 'chargeback_fraud', name: 'Chargeback Fraud (Friendly Fraud)', icon: 'fa-undo', description: 'Chargeback Fraud (Friendly Fraud) involves a customer fraudulently requesting a chargeback from a merchant.' },
    { id: 'merchant_fraud', name: 'Merchant/Client Fraud', icon: 'fa-store', description: 'Merchant/Client Fraud involves a business or client engaging in fraudulent activities.' },
    { id: 'transaction_laundering', name: 'Transaction Laundering', icon: 'fa-random', description: 'Transaction Laundering involves the illegal transfer of money or assets.' },
    { id: 'triangulation_fraud', name: 'Triangulation Fraud', icon: 'fa-project-diagram', description: 'Triangulation Fraud involves the fraudulent use of multiple parties to launder money.' },
    { id: 'refund_fraud', name: 'Refund Fraud', icon: 'fa-hand-holding-usd', description: 'Refund Fraud involves the fraudulent return of goods or the fraudulent receipt of a refund.' },
    { id: 'money_mule', name: 'Money Mule Schemes', icon: 'fa-horse', description: 'Money Mule Schemes involve the fraudulent transfer of money for a third party.' },
    { id: 'customer_collusive', name: 'Customer Collusive Fraud', icon: 'fa-users', description: 'Customer Collusive Fraud involves a customer and merchant colluding to commit fraud.' },
    { id: 'synthetic_identity', name: 'Synthetic Identity Fraud', icon: 'fa-user-ninja', description: 'Synthetic Identity Fraud involves the creation of a false identity.' },
    { 
        id: 'other_scam', 
        name: 'Other Scam', 
        icon: 'fa-exclamation-triangle', 
        description: 'Other Scam involves various types of fraud that do not fit into the other categories.' 
    }
];

// 计算固有风险等级
function calculateInherentRisk(likelihood, impact) {
    const riskMatrix = {
        'Low': {
            'Low': 'Low',
            'Moderate': 'Low',
            'High': 'Moderate'
        },
        'Moderate': {
            'Low': 'Low',
            'Moderate': 'Moderate',
            'High': 'High'
        },
        'High': {
            'Low': 'Moderate',
            'Moderate': 'High',
            'High': 'High'
        }
    };
    return riskMatrix[likelihood][impact];
}

// 计算剩余风险等级
function calculateResidualRisk(inherentRisk, controlEffectiveness) {
    const riskMatrix = {
        'Low': {
            'Weak': 'Low',
            'Moderate': 'Low',
            'Strong': 'Low'
        },
        'Moderate': {
            'Weak': 'Moderate',
            'Moderate': 'Moderate',
            'Strong': 'Low'
        },
        'High': {
            'Weak': 'High',
            'Moderate': 'High',
            'Strong': 'Moderate'
        }
    };
    return riskMatrix[inherentRisk][controlEffectiveness];
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    const productId = localStorage.getItem('currentProductId');
    const product = JSON.parse(localStorage.getItem('currentProduct'));
    
    // 加载保存的tooltipData
    const savedTooltipData = localStorage.getItem('tooltipData');
    if (savedTooltipData) {
        try {
            const parsedData = JSON.parse(savedTooltipData);
            tooltipData = { ...tooltipData, ...parsedData };
            console.log('已加载保存的提示内容', tooltipData);
        } catch (e) {
            console.error('解析保存的tooltipData失败', e);
        }
    }
    
    if (!product) {
        window.location.href = '../index.html';
        return;
    }
    
    // 渲染产品信息
    renderProductInfo(product);
    // 渲染已选择的Fraud Types（如果有）
    renderSelectedFraudTypes();
    
    // 设置返回按钮事件
    document.querySelector('.back-button').onclick = () => {
        window.location.href = '../index.html';
    };
});

// 渲染产品信息
function renderProductInfo(product) {
    document.querySelector('.product-name').textContent = product.name;
    document.querySelector('.launch-date').textContent = product.launchDate;
    document.querySelector('.assessor').textContent = product.assessor || 'Not assigned';
}

// 渲染已选择的Fraud Types
function renderSelectedFraudTypes() {
    const productId = localStorage.getItem('currentProductId');
    const selectedTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
    const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
    const grid = document.querySelector('.fraud-type-grid');
    
    // 添加Treatment值到显示文本的映射
    const treatmentDisplayMap = {
        'accept': 'Accept',
        'improve': 'Improvement Required',
        'transfer': 'Risk Transfer',
        'monitor': 'Monitor',
        'reject': 'Reject'
    };
    
    if (selectedTypes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shield-alt"></i>
                <p>No fraud types selected. Click "Add Fraud Type" to start your assessment.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = selectedTypes.map(type => {
        const assessment = assessments.find(a => a.fraudTypeId === type.id) || {};
        // 使用映射获取Treatment的显示文本，如果找不到则显示原始值（首字母大写）
        const treatmentDisplayText = treatmentDisplayMap[assessment.treatment?.toLowerCase()] || 
                                    (assessment.treatment ? assessment.treatment.charAt(0).toUpperCase() + assessment.treatment.slice(1) : '');
        
        return `
            <div class="fraud-type-card" data-id="${type.id}">
                <div class="card-header">
                    <div class="header-left">
                        <i class="fas ${type.icon}"></i>
                        <span>${type.name}</span>
                    </div>
                    <div class="header-right">
                        <button class="delete-button" onclick="deleteFraudType('${type.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                        <div class="assessment-details">
                            <div class="detail-row">
                                <label>Weight:</label>
                                <span>${assessment.weight}%</span>
                            </div>
                            <div class="detail-row">
                                <label>Likelihood:</label>
                            <span class="risk-${assessment.likelihood?.toLowerCase()}">${assessment.likelihood}</span>
                            </div>
                            <div class="detail-row">
                                <label>Impact:</label>
                            <span class="risk-${assessment.impact?.toLowerCase()}">${assessment.impact}</span>
                            </div>
                            <div class="detail-row">
                                <label>Inherent Risk:</label>
                            <span class="risk-${assessment.inherentRisk?.toLowerCase()}">${assessment.inherentRisk}</span>
                            </div>
                            <div class="detail-row">
                                <label>Control Effectiveness:</label>
                            <span class="risk-${assessment.controlEffectiveness?.toLowerCase()}">${assessment.controlEffectiveness}</span>
                            </div>
                            <div class="detail-row">
                                <label>Residual Risk:</label>
                            <span class="risk-${assessment.residualRisk?.toLowerCase()}">${assessment.residualRisk}</span>
                        </div>
                        <div class="detail-row">
                            <label>Treatment:</label>
                            <span class="treatment-${assessment.treatment?.toLowerCase()}">${treatmentDisplayText}</span>
                            </div>
                        </div>
                        <div class="assessment-actions">
                            <button class="edit-button" onclick="editFraudAssessment('${type.id}')">
                                <i class="fas fa-edit"></i> Edit Assessment
                            </button>
                        </div>
                </div>
            </div>
        `;
    }).join('');
}

// 定义默认tooltipData
let tooltipData = {
    weight: '权重表示该欺诈类型在整体风险评估中的重要程度。\n- 范围：0-100%\n- 建议：根据欺诈类型的影响范围和严重程度设置',
    likelihood: '发生可能性评估：\n- Low：发生概率较低\n- Moderate：有一定发生可能\n- High：发生概率较高',
    impact: '影响程度评估：\n- Low：影响较小\n- Moderate：影响中等\n- High：影响重大',
    inherentRisk: '固有风险：基于可能性和影响程度的综合评估\n- 自动计算得出\n- 反映未采取控制措施时的风险水平',
    controlEffectiveness: '控制措施有效性评估：\n- Strong：控制措施执行良好\n- Moderate：控制措施有待改进\n- Weak：控制措施效果不佳',
    residualRisk: '剩余风险：实施控制措施后的风险水平\n- 自动计算得出\n- 基于固有风险和控制措施有效性评估',
    treatment: '风险处理方式：\n- Accept：接受当前风险\n- Improve：需要改进控制措施\n- Transfer：转移风险\n- Monitor：持续监控\n- Reject：拒绝接受风险',
    control: '控制措施：\n- 描述应对欺诈风险采取的具体措施\n- 建议明确控制的目标、频率和责任人'
};

// 初始化提示框编辑功能 - 修改为仅设置初始状态
function initializeTooltipEditing() {
    console.log('初始化问号提示编辑功能 - 仅设置初始状态');
    // 此函数现在可以留空，或者只做一些一次性的设置
    // 因为事件处理将通过委托完成
}

// --- 移除旧的初始化函数中的事件绑定逻辑 ---

// 辅助函数，生成控制措施问号提示框的HTML (移到全局)
const createControlTooltipHtml = (index, content) => {
    return `
        <div class="control-help-tooltip" data-control-index="${index}">
            <div class="tooltip-display">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <div class="tooltip-edit-area">
                <textarea class="tooltip-content">${content}</textarea>
                <div class="tooltip-actions">
                    <button type="button" class="cancel-btn" onclick="cancelControlTooltipEdit(this)">取消</button>
                    <button type="button" class="save-btn" onclick="saveControlTooltipEdit(this)">保存</button>
                </div>
            </div>
        </div>
    `;
};

// 再次尝试修改editFraudAssessment函数HTML结构
function editFraudAssessment(fraudTypeId) {
    const productId = localStorage.getItem('currentProductId');
    const selectedTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
    const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
    
    const fraudType = selectedTypes.find(t => t.id === fraudTypeId);
    const existingAssessment = assessments.find(a => a.fraudTypeId === fraudTypeId);
    
    // 辅助函数，生成单个问号提示框的HTML
    const createTooltipHtml = (fieldKey, content) => {
        // 这个函数仍然在editFraudAssessment内部，因为只在这里使用
        return `
            <div class="control-help-tooltip" data-field="${fieldKey}">
                <div class="tooltip-display">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                <div class="tooltip-edit-area">
                    <textarea class="tooltip-content">${content}</textarea>
                    <div class="tooltip-actions">
                        <button type="button" class="cancel-btn" onclick="cancelTooltipEdit(this)">取消</button>
                        <button type="button" class="save-btn" onclick="saveTooltipEdit(this)">保存</button>
                    </div>
                </div>
            </div>
        `;
    };
    
    // --- 移除内部的 createControlTooltipHtml 定义 ---
    
    const formHtml = `
        <div class="modal-overlay">
            <div class="modal-content" id="modal-content-${fraudTypeId}"> 
                <div class="modal-header">
                    <h3>Edit Fraud Assessment - ${fraudType?.name || ''}</h3>
                    <button class="close-button" onclick="closeModal(this)">×</button>
                </div>
                <form id="fraud-assessment-form">
                    <input type="hidden" name="fraudTypeId" value="${fraudTypeId}">
                    <div class="assessment-form">
                        <div class="form-section">
                        <div class="form-group">
                            <label>Fraud Description</label>
                                <textarea name="fraudDescription" rows="4" 
                                    placeholder="描述欺诈类型...">${existingAssessment?.fraudDescription || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Fraud Analysis</label>
                                <textarea name="fraudAnalysis" rows="4" 
                                    placeholder="分析欺诈风险...">${existingAssessment?.fraudAnalysis || ''}</textarea>
                            </div>
                        </div>

                        <div class="form-section">
                            <!-- 将 Inherent Risk 移入 risk-assessment-group -->
                            <div class="risk-assessment-group">
                            <div class="form-group">
                                    <label>
                                        Weight (0-100%)
                                        <div class="control-help">?${createTooltipHtml('weight', tooltipData.weight)}</div>
                                    </label>
                                    <input type="number" name="weight" min="0" max="100" required value="${existingAssessment?.weight || ''}" step="1">
                            </div>
                            <div class="form-group">
                                    <label>
                                        Likelihood
                                        <div class="control-help">?${createTooltipHtml('likelihood', tooltipData.likelihood)}</div>
                                    </label>
                                <select name="likelihood" required onchange="updateInherentRisk(this.form)">
                                    <option value="Low" ${existingAssessment?.likelihood === 'Low' ? 'selected' : ''}>Low</option>
                                    <option value="Moderate" ${existingAssessment?.likelihood === 'Moderate' ? 'selected' : ''}>Moderate</option>
                                    <option value="High" ${existingAssessment?.likelihood === 'High' ? 'selected' : ''}>High</option>
                                </select>
                            </div>
                            <div class="form-group">
                                    <label>
                                        Impact
                                        <div class="control-help">?${createTooltipHtml('impact', tooltipData.impact)}</div>
                                    </label>
                                <select name="impact" required onchange="updateInherentRisk(this.form)">
                                    <option value="Low" ${existingAssessment?.impact === 'Low' ? 'selected' : ''}>Low</option>
                                    <option value="Moderate" ${existingAssessment?.impact === 'Moderate' ? 'selected' : ''}>Moderate</option>
                                    <option value="High" ${existingAssessment?.impact === 'High' ? 'selected' : ''}>High</option>
                                </select>
                            </div>
                                <!-- Inherent Risk 现在是第四项 -->
                            <div class="form-group">
                                    <label>
                                        Inherent Risk
                                        <div class="control-help">?${createTooltipHtml('inherentRisk', tooltipData.inherentRisk)}</div>
                                    </label>
                                    <input type="text" name="inherentRisk" readonly value="${existingAssessment?.inherentRisk || ''}">
                            </div>
                            </div> <!-- .risk-assessment-group 结束 -->
                            <!-- 确保这里没有重复的 Inherent Risk -->
                        </div>

                        <div class="form-section">
                        <div class="form-group">
                            <label>Control Description</label>
                                <textarea name="controlDescription" rows="4" 
                                    placeholder="描述控制措施...">${existingAssessment?.controlDescription || ''}</textarea>
                        </div>
                            <div class="controls-container">
                                <h4 class="controls-title">Controls</h4>
                                <div class="controls-group" id="controlsContainer">
                                <!-- 修改此处：确保初始至少有一行，并且所有行都显示 '-' 按钮 -->
                                ${ (existingAssessment?.controls && existingAssessment.controls.length > 0 ? existingAssessment.controls : [{definition: '', measure: ''}]).map((control, index) => `
                                    <div class="control-input">
                                        <div class="control-help">
                                            ?
                                            ${createControlTooltipHtml(index, control.definition || tooltipData.control)}
                                        </div>
                                        <input type="hidden" name="controlDefinition${index}" 
                                            value="${control.definition || ''}">
                                        <input type="text" name="control${index}" value="${control.measure || ''}" 
                                            placeholder="输入控制措施">
                                        <select name="controlStatus${index}" onchange="updateControlEffectiveness(this.form)">
                                            <option value="implemented" ${control.status === 'implemented' ? 'selected' : ''}>Implemented</option>
                                            <option value="not_implemented" ${control.status === 'not_implemented' ? 'selected' : ''}>Not Implemented</option>
                                            <option value="partial_implemented" ${control.status === 'partial_implemented' ? 'selected' : ''}>Partial Implemented</option>
                                            <option value="not_applicable" ${control.status === 'not_applicable' ? 'selected' : ''}>Not Applicable</option>
                                        </select>
                                        <label class="key-control-label">
                                            <input type="checkbox" name="keyControl${index}" 
                                                ${control.isKeyControl ? 'checked' : ''} 
                                                onchange="updateControlEffectiveness(this.form)"> <!-- 添加 onchange -->
                                            Key Control
                                        </label>
                                        <!-- 始终显示 '-' 按钮 -->
                                            <button type="button" onclick="removeControl(this)">-</button>
                                    </div>
                                `).join('')}
                                </div>
                                <button type="button" class="add-control-btn" onclick="addControl()">
                                    <i class="fas fa-plus"></i>
                                    添加控制措施
                                </button>
                            </div>
                        </div>

                        <!-- 将 Effectiveness, Residual Risk, Treatment 放入新容器 -->
                        <div class="form-section">
                            <div class="effectiveness-risk-treatment-group">
                            <div class="form-group">
                                    <label>
                                        Control Effectiveness
                                        <div class="control-help">?${createTooltipHtml('controlEffectiveness', tooltipData.controlEffectiveness)}</div>
                                    </label>
                                    <input type="text" name="controlEffectiveness" readonly value="${existingAssessment?.controlEffectiveness || ''}">
                            </div>
                            <div class="form-group">
                                    <label>
                                        Residual Risk
                                        <div class="control-help">?${createTooltipHtml('residualRisk', tooltipData.residualRisk)}</div>
                                    </label>
                                    <input type="text" name="residualRisk" readonly value="${existingAssessment?.residualRisk || ''}">
                            </div>
                        <div class="form-group">
                                    <label>
                                        Treatment
                                        <div class="control-help">?${createTooltipHtml('treatment', tooltipData.treatment)}</div>
                                    </label>
                            <select name="treatment" required>
                                <option value="accept" ${existingAssessment?.treatment === 'accept' ? 'selected' : ''}>Accept</option>
                                <option value="improve" ${existingAssessment?.treatment === 'improve' ? 'selected' : ''}>Improvement Required</option>
                                <option value="transfer" ${existingAssessment?.treatment === 'transfer' ? 'selected' : ''}>Risk Transfer</option>
                                <option value="monitor" ${existingAssessment?.treatment === 'monitor' ? 'selected' : ''}>Monitor</option>
                                <option value="reject" ${existingAssessment?.treatment === 'reject' ? 'selected' : ''}>Reject</option>
                            </select>
                        </div>
                    </div>
                        </div>
                        
                        <!-- 新增 Action Plan Section -->
                        <div class="actions-container">
                            <h4 class="actions-title">Action Plan</h4>
                            <div class="actions-group" id="actionsGroup">
                                <!-- 渲染已有的 Actions -->
                                ${ (existingAssessment?.actions || [{ name: '', description: '' }]).map((action, index) => `
                                    <div class="action-input-group">
                                        <div class="action-fields">
                                            <textarea name="actionName${index}" placeholder="Action Name" rows="1">${action.name || ''}</textarea>
                                            <textarea name="actionDescription${index}" placeholder="Action Description" rows="2">${action.description || ''}</textarea>
                                        </div>
                                        <button type="button" onclick="removeAction(this)">-</button>
                                    </div>
                                `).join('')}
                            </div>
                            <button type="button" class="add-action-btn" onclick="addAction()">
                                <i class="fas fa-plus"></i>
                                Add Action
                            </button>
                        </div>
                        <!-- Action Plan Section End -->
                    </div>

                    <div class="form-actions">
                        <button type="button" onclick="closeModal(this)">取消</button>
                        <button type="submit">保存</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    // 初始化风险等级
    const form = document.querySelector(`#modal-content-${fraudTypeId} form`);
    updateInherentRisk(form);
    updateControlEffectiveness(form);
    updateResidualRisk(form);

    // 获取模态框内容区域
    const modalContent = document.getElementById(`modal-content-${fraudTypeId}`);

    if (modalContent) {
        // --- 添加委托事件监听器 ---
        // 悬停显示/隐藏
        modalContent.addEventListener('mouseover', function(e) {
            const helpIcon = e.target.closest('.control-help');
            if (helpIcon) {
                const tooltip = helpIcon.querySelector('.control-help-tooltip');
                if (tooltip && !tooltip.classList.contains('editing')) {
                    tooltip.style.display = 'block';
                }
            }
        });
        modalContent.addEventListener('mouseout', function(e) {
             const helpIcon = e.target.closest('.control-help');
             if (helpIcon) {
                const tooltip = helpIcon.querySelector('.control-help-tooltip');
                 // 检查鼠标是否真的离开了图标和提示框区域
                 const relatedTarget = e.relatedTarget;
                 if (tooltip && !tooltip.classList.contains('editing') && !helpIcon.contains(relatedTarget) && !tooltip.contains(relatedTarget) ) {
                     tooltip.style.display = 'none';
                 }
             }
        });

        // 点击切换编辑模式
        modalContent.addEventListener('click', function(e) {
            const helpIcon = e.target.closest('.control-help');
            if (helpIcon) {
                e.preventDefault();
                e.stopPropagation(); // 阻止冒泡到全局关闭监听器
                const tooltip = helpIcon.querySelector('.control-help-tooltip');
                if (tooltip) {
                    // 关闭其他编辑中的提示框
                    document.querySelectorAll(`#modal-content-${fraudTypeId} .control-help-tooltip.editing`).forEach(otherTooltip => {
                         if (otherTooltip !== tooltip) {
                            otherTooltip.classList.remove('editing');
                            otherTooltip.style.display = 'none';
                        }
                    });
                    // 切换当前状态
                    tooltip.classList.toggle('editing');
                    tooltip.style.display = 'block'; // 确保可见
                    if (tooltip.classList.contains('editing')) {
                         const textarea = tooltip.querySelector('.tooltip-edit-area textarea');
                        if (textarea) textarea.focus();
                    }
                }
            }
            
            // --- 重要：阻止提示框内部的点击事件冒泡，防止关闭自身 --- 
             if (e.target.closest('.control-help-tooltip')) {
                 e.stopPropagation();
             }
        });
        // --- 委托事件监听器结束 ---
    } else {
        console.error(`找不到模态框内容元素：modal-content-${fraudTypeId}`);
    }
    
    // 初始化提示框编辑功能（现在可能为空或只做一次性设置）
    // initializeTooltipEditing(); 
    
    // 添加表单提交事件监听器
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('表单提交事件触发');
        saveFraudAssessment(e, fraudTypeId);
        return false; // 确保不执行默认提交
    });
    
    // 添加全局点击事件监听器，用于关闭编辑状态
    document.removeEventListener('click', closeAllEditingTooltips);
    document.addEventListener('click', closeAllEditingTooltips);
}

function closeModal(button) {
    try {
        console.log('关闭模态框');
        if (!button) {
            console.error('关闭按钮未定义');
            // 尝试查找并关闭所有模态框
            const modals = document.querySelectorAll('.modal-overlay');
            if (modals.length > 0) {
                console.log('找到', modals.length, '个模态框，将全部关闭');
                modals.forEach(modal => modal.remove());
            } else {
                console.error('未找到任何模态框');
            }
            return;
        }
        
        // 查找最近的模态框容器
        const modalOverlay = button.closest('.modal-overlay');
        if (modalOverlay) {
            console.log('找到模态框，准备移除');
            modalOverlay.remove();
    } else {
            console.error('无法找到模态框容器');
            // 尝试查找所有模态框并关闭第一个
            const modals = document.querySelectorAll('.modal-overlay');
            if (modals.length > 0) {
                console.log('找到', modals.length, '个模态框，将关闭第一个');
                modals[0].remove();
            } else {
                console.error('未找到任何模态框');
            }
        }
    } catch (error) {
        console.error('关闭模态框时出错:', error);
        // 最后的尝试，查找所有模态框并移除
        try {
            document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
        } catch (e) {
            console.error('清理模态框失败:', e);
        }
    }
}

// 计算控制有效性
function calculateControlEffectiveness(controls) {
    console.log('[calculateControlEffectiveness] 开始计算，输入 controls:', JSON.parse(JSON.stringify(controls))); // 深拷贝打印
    
    // 检查是否有未实施或部分实施的关键控制
    const hasWeakKeyControl = controls.some(control => 
        control.isKeyControl && 
        (control.status === 'not_implemented' || control.status === 'partial_implemented')
    );
    console.log('[calculateControlEffectiveness] 是否有弱关键控制 (hasWeakKeyControl):', hasWeakKeyControl);
    
    // 如果有未实施或部分实施的关键控制，直接返回 Weak
    if (hasWeakKeyControl) {
        console.log('[calculateControlEffectiveness] 检测到弱关键控制，结果: Weak');
        return 'Weak';
    }
    
    // 计算总分
    let totalScore = 0;
    let implementedCount = 0;
    let partialCount = 0;
    let notImplementedCount = 0;
    let notApplicableCount = 0;
    controls.forEach(control => {
        if (control.status === 'implemented') {
            totalScore += 1;
            implementedCount++;
        } else if (control.status === 'not_applicable') {
            totalScore += 1; // Not Applicable 也算作有效控制，得1分
            notApplicableCount++;
        } else if (control.status === 'partial_implemented') {
            totalScore += 0.5;
            partialCount++;
        } else if (control.status === 'not_implemented') {
             notImplementedCount++;
             // not_implemented 得 0 分
        }
    });
    console.log(`[calculateControlEffectiveness] 分数计算: totalScore=${totalScore}, implemented=${implementedCount}, partial=${partialCount}, notImplemented=${notImplementedCount}, notApplicable=${notApplicableCount}`);

    
    // 计算完全实施的非关键控制数量 (包括 Not Applicable)
    const fullyEffectiveNonKeyControls = controls.filter(control => 
        !control.isKeyControl && 
        (control.status === 'implemented' || control.status === 'not_applicable')
    ).length;
    console.log('[calculateControlEffectiveness] 完全有效的非关键控制数量 (fullyEffectiveNonKeyControls):', fullyEffectiveNonKeyControls);
    
    // 根据得分和条件判断有效性等级
    let result = 'Weak'; // 默认 Weak
    if (totalScore >= controls.length * 0.9 && fullyEffectiveNonKeyControls >= controls.length * 0.3) { // 假设需要90%得分和30%非关键有效
        result = 'Strong';
    } else if (totalScore >= controls.length * 0.7) { // 假设需要70%得分
        result = 'Moderate';
    }
    
    console.log('[calculateControlEffectiveness] 最终计算结果:', result);
    return result;
}

// 更新表单中的控制有效性
function updateControlEffectiveness(form) {
    console.log('[updateControlEffectiveness] 函数被调用');
    if (!form) {
        console.error('[updateControlEffectiveness] 错误: 传入的form参数无效');
        return;
    }
    // 收集所有控制措施
    const controls = Array.from(form.querySelectorAll('.control-input')).map((div, index) => ({
        measure: div.querySelector(`[name="control${index}"]`)?.value.trim(),
        status: div.querySelector(`[name="controlStatus${index}"]`)?.value,
        isKeyControl: div.querySelector(`[name="keyControl${index}"]`)?.checked || false
    })).filter(control => control.measure); // 只包括有 measure 的控制
    
    console.log('[updateControlEffectiveness] 收集到的 controls:', JSON.parse(JSON.stringify(controls))); // 深拷贝打印

    if (controls.length === 0) {
        console.log('[updateControlEffectiveness] 没有有效的控制措施，设置有效性为 N/A 或 Weak? (当前设为 Weak)');
        form.controlEffectiveness.value = 'Weak'; // 或者可以设置为 'N/A'
        updateResidualRisk(form);
        return;
    }
    
    // 计算控制有效性
    const effectiveness = calculateControlEffectiveness(controls);
    console.log('[updateControlEffectiveness] 计算得到的有效性:', effectiveness);
    
    // 更新表单中的控制有效性输入框
    if (form.controlEffectiveness) {
        form.controlEffectiveness.value = effectiveness;
        console.log('[updateControlEffectiveness] 表单字段已更新');
    } else {
         console.error('[updateControlEffectiveness] 错误: 表单中找不到 name="controlEffectiveness" 的元素');
    }
    
    // 触发剩余风险的更新
    updateResidualRisk(form);
}

function saveAction(form) {
    const formData = new FormData(form);
    const actionId = formData.get('actionId') || Math.floor(Math.random() * 10000);
    const actionName = formData.get('actionName');
    const actionDescription = formData.get('actionDescription');
    const priorityLevel = formData.get('priorityLevel');
    const completionDate = formData.get('completionDate');
    const timelineTracking = formData.get('timelineTracking');
    const completionStatus = formData.get('completionStatus');
    const actionOwner = formData.get('actionOwner');
    const remark = formData.get('remark');

    // 获取所有选中的欺诈类型
    const linkedFraud = [];
    document.querySelectorAll('input[name="linkedFraud"]:checked').forEach(checkbox => {
        linkedFraud.push(checkbox.value);
    });

    // 如果是编辑模式，更新现有行
    const existingRow = document.querySelector(`#action-list tr[data-id="${actionId}"]`);
    if (existingRow) {
        existingRow.cells[1].textContent = actionName;
        existingRow.cells[2].textContent = actionDescription;
        existingRow.cells[3].innerHTML = linkedFraud.join('<br>');
        existingRow.cells[4].textContent = priorityLevel;
        existingRow.cells[5].textContent = completionDate;
        existingRow.cells[6].textContent = timelineTracking;
        existingRow.cells[7].textContent = completionStatus;
        existingRow.cells[8].textContent = actionOwner;
        existingRow.cells[9].textContent = remark;
    } else {
        // 否则，添加新行
        const newRowIndex = document.querySelectorAll('#action-list tr').length + 1;
        const newRow = `
            <tr data-id="${actionId}">
                <td>${newRowIndex}</td>
                <td>${actionName}</td>
                <td>${actionDescription}</td>
                <td>${linkedFraud.join('<br>')}</td>
                <td>${priorityLevel}</td>
                <td>${completionDate}</td>
                <td>${timelineTracking}</td>
                <td>${completionStatus}</td>
                <td>${actionOwner}</td>
                <td>${remark}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-button edit-button" onclick="editAction(${actionId})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-button delete-button" onclick="deleteAction(${actionId})">
                            <i class="fas fa-trash"></i>
                </button>
            </div>
                </td>
            </tr>
        `;
        document.getElementById('action-list').insertAdjacentHTML('beforeend', newRow);
    }
    
    // 关闭模态框
    document.querySelector('.modal-overlay').remove();
}

function renderRiskDashboard() {
    const inherentRiskData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
            data: [55.56, 33.33, 11.11], // 示例数据
            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB']
        }]
    };

    const controlEffectivenessData = {
        labels: ['Weak', 'Moderate', 'Strong'],
        datasets: [{
            data: [88.89, 11.11, 0], // 示例数据
            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB']
        }]
    };

    const residualRiskData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
            data: [55.56, 33.33, 11.11], // 示例数据
            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB']
        }]
    };

    new Chart(document.getElementById('inherentRiskChart'), {
        type: 'pie',
        data: inherentRiskData
    });

    new Chart(document.getElementById('controlEffectivenessChart'), {
        type: 'pie',
        data: controlEffectivenessData
    });

    new Chart(document.getElementById('residualRiskChart'), {
        type: 'pie',
        data: residualRiskData
    });
}

// 确保在页面加载时调用
document.addEventListener('DOMContentLoaded', renderRiskDashboard);

function initializeDashboardCharts() {
    // 注册插件
    Chart.register(ChartDataLabels);

    // 从fraud risk assessment获取数据
    const fraudControlData = getFraudControlData();
    const riskTreatmentData = getRiskTreatmentData();
    const improvementProgressData = getImprovementProgressData();
    
    // 获取风险统计数据
    const riskStatsData = getRiskStatisticsData();

    const inherentRiskData = {
        labels: ['Low', 'Moderate', 'High'],
        datasets: [{
            data: [
                riskStatsData.inherentRisk.Low,
                riskStatsData.inherentRisk.Moderate, 
                riskStatsData.inherentRisk.High
            ],
            backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const controlEffectivenessData = {
        labels: ['Weak', 'Moderate', 'Strong'],
        datasets: [{
            data: [
                riskStatsData.controlEffectiveness.Weak,
                riskStatsData.controlEffectiveness.Moderate, 
                riskStatsData.controlEffectiveness.Strong
            ],
            backgroundColor: ['#FF6384', '#FF9F40', '#4BC0C0'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const residualRiskData = {
        labels: ['Low', 'Moderate', 'High'],
        datasets: [{
            data: [
                riskStatsData.residualRisk.Low,
                riskStatsData.residualRisk.Moderate, 
                riskStatsData.residualRisk.High
            ],
            backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 800,
            easing: 'easeOutQuart'
        },
        layout: {
            padding: 20
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    boxWidth: 12,
                    font: {
                        size: 12
                    }
                }
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value) => {
                    return value > 0 ? value : '';
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                padding: 10,
                cornerRadius: 6,
                displayColors: true
            }
        }
    };

    // 创建饼图
    new Chart(document.getElementById('inherentRiskChart'), {
        type: 'doughnut',
        data: inherentRiskData,
        options: {
            ...commonOptions,
            cutout: '50%'
        }
    });

    new Chart(document.getElementById('controlEffectivenessChart'), {
        type: 'doughnut',
        data: controlEffectivenessData,
        options: {
            ...commonOptions,
            cutout: '50%'
        }
    });

    new Chart(document.getElementById('residualRiskChart'), {
        type: 'doughnut',
        data: residualRiskData,
        options: {
            ...commonOptions,
            cutout: '50%'
        }
    });
    
    // Fraud Control Status 水平柱状图
    console.log('Risk Treatment data for chart:', riskTreatmentData);
    
    const fraudControlStatusData = {
        labels: fraudControlData.labels,
        datasets: [
            {
                label: 'Implemented',
                data: fraudControlData.implemented,
                backgroundColor: '#4e73df',
                barThickness: 20,
            },
            {
                label: 'Partial Implemented',
                data: fraudControlData.partialImplemented,
                backgroundColor: '#f6c23e',
                barThickness: 20,
            },
            {
                label: 'Not Implemented',
                data: fraudControlData.notImplemented,
                backgroundColor: '#bdbdbd',
                barThickness: 20,
            },
            {
                label: 'Not Applicable',
                data: fraudControlData.notApplicable,
                backgroundColor: '#ffc107',
                barThickness: 20,
            }
        ]
    };

    const fraudControlStatusOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    borderDash: [3, 3]
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    boxWidth: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                cornerRadius: 6,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += context.parsed.x + '%';
                        }
                        return label;
                    }
                }
            }
        }
    };

    // 确保元素存在后再创建图表
    const fraudControlChartElement = document.getElementById('fraudControlStatusChart');
    if (fraudControlChartElement) {
        new Chart(fraudControlChartElement, {
            type: 'bar',
            data: fraudControlStatusData,
            options: fraudControlStatusOptions
        });
    } else {
        console.error('Fraud Control Status chart element not found!');
    }
    
    // Risk Treatment 水平柱状图
    const riskTreatmentChartData = {
        labels: riskTreatmentData.labels,
        datasets: [
            {
                label: 'Total',
                data: riskTreatmentData.data,
                backgroundColor: '#ff9f40',
                barThickness: 30,
            }
        ]
    };

    const riskTreatmentOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                max: 10,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    borderDash: [3, 3]
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                cornerRadius: 6,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += context.parsed.x;
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                color: '#000',
                anchor: 'end',
                align: 'right',
                offset: 5,
                font: {
                    weight: 'bold',
                    size: 13
                },
                formatter: (value) => {
                    return value;
                }
            }
        }
    };

    // 确保元素存在后再创建图表
    const riskTreatmentChartElement = document.getElementById('riskTreatmentChart');
    if (riskTreatmentChartElement) {
        console.log('Creating Risk Treatment chart with data:', riskTreatmentChartData);
        new Chart(riskTreatmentChartElement, {
            type: 'bar',
            data: riskTreatmentChartData,
            options: riskTreatmentOptions
        });
    } else {
        console.error('Risk Treatment chart element not found!');
    }
    
    // Improvement Progress 水平柱状图
    console.log('Improvement Progress data for chart:', improvementProgressData);
    
    const improvementProgressChartData = {
        labels: improvementProgressData.labels,
        datasets: [
            {
                label: 'Completion Status %',
                data: improvementProgressData.data,
                backgroundColor: '#4e73df',
                barThickness: 15,
            }
        ]
    };

    const improvementProgressOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    borderDash: [3, 3],
                    display: true
                },
                ticks: {
                    stepSize: 20,
                    callback: function(value) {
                        return value + '%';
                    },
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                cornerRadius: 6,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += context.parsed.x + '%';
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                color: '#000',
                anchor: 'end',
                align: 'right',
                offset: 5,
                font: {
                    weight: 'bold',
                    size: 13
                },
                formatter: (value) => {
                    return value > 0 ? value + '%' : '';
                }
            }
        }
    };

    // 确保元素存在后再创建图表
    const improvementProgressChartElement = document.getElementById('improvementProgressChart');
    if (improvementProgressChartElement) {
        console.log('Creating Improvement Progress chart with data:', improvementProgressChartData);
        new Chart(improvementProgressChartElement, {
            type: 'bar',
            data: improvementProgressChartData,
            options: improvementProgressOptions
        });
    } else {
        console.error('Improvement Progress chart element not found!');
    }
    
    console.log('Dashboard charts initialized with data:', {
        inherentRisk: inherentRiskData.datasets[0].data,
        controlEffectiveness: controlEffectivenessData.datasets[0].data,
        residualRisk: residualRiskData.datasets[0].data
    });
}

// 获取风险统计数据
function getRiskStatisticsData() {
    // 初始化统计计数器
    const stats = {
        inherentRisk: {
            Low: 0,
            Moderate: 0,
            High: 0
        },
        controlEffectiveness: {
            Weak: 0,
            Moderate: 0,
            Strong: 0
        },
        residualRisk: {
            Low: 0,
            Moderate: 0,
            High: 0
        }
    };
    
    // 获取当前产品的所有风险评估
    const productId = localStorage.getItem('currentProductId');
    const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
    
    if (assessments.length > 0) {
        // 遍历所有评估，统计各项风险等级
        assessments.forEach(assessment => {
            // 统计固有风险
            if (assessment.inherentRisk && stats.inherentRisk.hasOwnProperty(assessment.inherentRisk)) {
                stats.inherentRisk[assessment.inherentRisk]++;
            }
            
            // 统计控制有效性
            if (assessment.controlEffectiveness && stats.controlEffectiveness.hasOwnProperty(assessment.controlEffectiveness)) {
                stats.controlEffectiveness[assessment.controlEffectiveness]++;
            }
            
            // 统计剩余风险
            if (assessment.residualRisk && stats.residualRisk.hasOwnProperty(assessment.residualRisk)) {
                stats.residualRisk[assessment.residualRisk]++;
            }
        });
        
        console.log('Risk statistics from assessments:', stats);
    } else {
        // 如果没有数据，使用与风险图相符的模拟数据
        stats.inherentRisk = { Low: 2, Moderate: 5, High: 1 };
        stats.controlEffectiveness = { Weak: 6, Moderate: 0, Strong: 0 };
        stats.residualRisk = { Low: 3, Moderate: 3, High: 1 };
        
        console.log('Using sample risk statistics data:', stats);
    }
    
    return stats;
}

// 获取欺诈控制数据
function getFraudControlData() {
    // 从fraud assessment中获取控制状态数据
    const productId = localStorage.getItem('currentProductId');
    console.log('Current Product ID for fraud control:', productId);
    
    // 获取所有欺诈类型及其评估
    const fraudTypes = JSON.parse(localStorage.getItem(`fraudTypes_${productId}`) || '[]');
    const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
    
    console.log('Fraud types:', fraudTypes);
    console.log('Fraud assessments:', assessments);
    
    // 初始化结果对象
    const result = {
        labels: [],
        implemented: [],
        partialImplemented: [],
        notImplemented: [],
        notApplicable: []
    };
    
    // 创建fraud type到assessment的映射
    const assessmentMap = {};
    if (assessments && assessments.length > 0) {
        assessments.forEach(assessment => {
            if (assessment.fraudTypeId) {
                assessmentMap[assessment.fraudTypeId] = assessment;
            }
        });
    }
    
    console.log('Assessment map:', assessmentMap);
    
    // 处理每种欺诈类型
    if (fraudTypes && fraudTypes.length > 0) {
        fraudTypes.forEach(fraudType => {
            // 添加欺诈类型名称到标签数组
            result.labels.push(fraudType.name || fraudType.type);
            
            // 获取该欺诈类型的assessment
            const assessment = assessmentMap[fraudType.id];
            
            // 初始化控制状态计数
            let implemented = 0;
            let partialImplemented = 0;
            let notImplemented = 0;
            let notApplicable = 0;
            
            // 如果有assessment，统计控制状态
            if (assessment && assessment.controls && assessment.controls.length > 0) {
                assessment.controls.forEach(control => {
                    // 根据控制的status属性更新计数
                    if (control.status === 'implemented') {
                        implemented++;
                    } else if (control.status === 'partial') {
                        partialImplemented++;
                    } else if (control.status === 'not_implemented') {
                        notImplemented++;
                    } else if (control.status === 'not_applicable') {
                        notApplicable++;
                    }
                });
                
                // 计算百分比
                const totalControls = assessment.controls.length;
                if (totalControls > 0) {
                    implemented = Math.round((implemented / totalControls) * 100);
                    partialImplemented = Math.round((partialImplemented / totalControls) * 100);
                    notImplemented = Math.round((notImplemented / totalControls) * 100);
                    notApplicable = Math.round((notApplicable / totalControls) * 100);
                    
                    // 确保总和为100%
                    const total = implemented + partialImplemented + notImplemented + notApplicable;
                    if (total !== 100) {
                        // 调整最大的非零值
                        const values = [
                            { name: 'implemented', value: implemented },
                            { name: 'partialImplemented', value: partialImplemented },
                            { name: 'notImplemented', value: notImplemented },
                            { name: 'notApplicable', value: notApplicable }
                        ].filter(item => item.value > 0);
                        
                        if (values.length > 0) {
                            values.sort((a, b) => b.value - a.value);
                            const adjustment = 100 - total;
                            if (values[0].name === 'implemented') implemented += adjustment;
                            else if (values[0].name === 'partialImplemented') partialImplemented += adjustment;
                            else if (values[0].name === 'notImplemented') notImplemented += adjustment;
                            else if (values[0].name === 'notApplicable') notApplicable += adjustment;
                        }
                    }
                }
            } else {
                // 如果没有assessment或控制，默认为100%未实施
                notImplemented = 100;
            }
            
            // 添加百分比到结果数组
            result.implemented.push(implemented);
            result.partialImplemented.push(partialImplemented);
            result.notImplemented.push(notImplemented);
            result.notApplicable.push(notApplicable);
        });
        
        console.log('Calculated fraud control data:', result);
    } else {
        // 如果没有数据，使用模拟数据用于展示
        result.labels = [
            'Phishing',
            'Stolen Card / Bank Account',
            'Account Takeover',
            'Identity Fraud',
            'Merchant / Client Fraud',
            'Transaction Laundering',
            'Refund Fraud',
            'Money Mule Schemes',
            'Customer Collusive Fraud'
        ];
        // 与截图中显示的数据一致
        result.implemented = [55, 60, 55, 60, 70, 65, 60, 65, 60];
        result.partialImplemented = [15, 0, 10, 0, 10, 25, 0, 10, 10];
        result.notImplemented = [30, 40, 35, 40, 10, 10, 20, 5, 30];
        result.notApplicable = [0, 0, 0, 0, 10, 0, 20, 20, 0];
        
        console.log('Using sample fraud control data');
    }
    
    return result;
}

// 获取风险处理数据
function getRiskTreatmentData() {
    // 从fraud assessments中获取风险处理方法的统计数据
    // 初始化计数器
    const treatmentCounts = {
        'Improvement Required (Mitigate)': 0,
        'Accept': 0,
        'Risk Transfer': 0,
        'Monitor': 0,
        'Reject': 0
    };
    
    // 获取所有已保存的fraud assessments
    const productId = localStorage.getItem('currentProductId');
    console.log('Current Product ID:', productId);
    
    const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
    console.log('Raw assessments data:', assessments);
    
    // 创建treatment映射表，将treatment值映射到展示名称
    const treatmentMapping = {
        'improve': 'Improvement Required (Mitigate)',
        'accept': 'Accept', 
        'transfer': 'Risk Transfer',
        'monitor': 'Monitor',
        'reject': 'Reject'
    };
    
    // 遍历所有assessments，统计其treatment方法
    if (assessments && assessments.length > 0) {
        assessments.forEach((assessment, index) => {
            console.log(`Assessment ${index}:`, assessment);
            const treatmentValue = assessment.treatment; // 获取treatment值
            console.log(`Treatment value for assessment ${index}:`, treatmentValue);
            
            if (treatmentValue) {
                const displayName = treatmentMapping[treatmentValue] || treatmentValue;
                console.log(`Mapped display name:`, displayName);
                
                if (treatmentCounts.hasOwnProperty(displayName)) {
                    treatmentCounts[displayName]++;
                    console.log(`Increased count for ${displayName}`);
                }
            }
        });
        
        console.log('Final treatment counts from assessments:', treatmentCounts);
    } else {
        // 如果没有数据，使用模拟数据（基于要求：8个Improvement Required和1个Monitor）
        treatmentCounts['Improvement Required (Mitigate)'] = 8;
        treatmentCounts['Monitor'] = 1;
        console.log('Using sample treatment data');
    }
    
    // 确保返回的数据格式正确
    const result = {
        labels: Object.keys(treatmentCounts),
        data: Object.values(treatmentCounts)
    };
    
    console.log('Returning treatment data:', result);
    
    return result;
}

// 获取改进进度数据
function getImprovementProgressData() {
    // 从action tracker获取completion status数据
    console.log('Getting improvement progress data from Action Tracker');
    
    // 获取Action Tracker表格中的所有行
    const actionRows = document.querySelectorAll('#action-list tr');
    console.log('Found action rows:', actionRows.length);
    
    // 初始化结果数组
    const result = {
        labels: [],
        data: []
    };
    
    // 遍历所有行，提取操作名称和完成状态
    if (actionRows && actionRows.length > 0) {
        actionRows.forEach(row => {
            // 获取操作名称（第2列）和完成状态（第8列）
            const actionName = row.cells[1]?.textContent.trim() || '';
            const statusText = row.cells[7]?.textContent.trim() || '0%';
            
            // 将完成状态转换为数字（移除%符号）
            const statusValue = parseInt(statusText.replace('%', '')) || 0;
            
            // 将数据添加到结果数组
            if (actionName) {
                result.labels.push(actionName);
                result.data.push(statusValue);
            }
        });
        
        console.log('Extracted action data:', result);
    }
    
    // 如果没有找到数据，返回空结果
    if (result.labels.length === 0) {
        console.log('No action data found, using empty data');
    }
    
    return result;
}

// 添加控制措施时，增加控制措施定义输入框和问号提示
function addControl() {
    console.log('[addControl] 函数开始执行'); 
    const container = document.getElementById('controlsContainer');
    if (!container) {
        console.error('[addControl] 错误：找不到ID为 controlsContainer 的容器元素');
        alert('无法添加控制措施：找不到容器。');
        return;
    }
    console.log('[addControl] 找到容器:', container);
    
    const controlCount = container.querySelectorAll('.control-input').length;
    console.log('[addControl] 当前控制措施数量:', controlCount);
    
    // 检查 createControlTooltipHtml 是否可用
    if (typeof createControlTooltipHtml !== 'function') {
        console.error('[addControl] 错误: createControlTooltipHtml 函数未定义或不可用。');
        alert('无法添加控制措施：缺少辅助函数。');
        return;
    }
    
    try {
        // 使用辅助函数创建新行的HTML
        const newControlHtml = `
            <div class="control-input">
                <div class="control-help">
                    ?
                    ${createControlTooltipHtml(controlCount, tooltipData.control)} 
                </div>
                <input type="hidden" name="controlDefinition${controlCount}" value="${tooltipData.control}">
                <input type="text" name="control${controlCount}" placeholder="输入控制措施">
                <select name="controlStatus${controlCount}" onchange="updateControlEffectiveness(this.form)">
                    <option value="implemented">Implemented</option>
                    <option value="not_implemented" selected>Not Implemented</option> 
                    <option value="partial_implemented">Partial Implemented</option>
                    <option value="not_applicable">Not Applicable</option>
                </select>
                <label class="key-control-label">
                    <input type="checkbox" name="keyControl${controlCount}" 
                           onchange="updateControlEffectiveness(this.form)"> <!-- 添加 onchange -->
                    Key Control
                </label>
                <button type="button" onclick="removeControl(this)">-</button>
        </div>
    `;
    
        console.log('[addControl] 生成的HTML:', newControlHtml);
        container.insertAdjacentHTML('beforeend', newControlHtml);
        console.log('[addControl] 新控制措施行已添加到DOM');
        
        // 无需在此处单独添加事件监听器，委托会处理
        
        // 更新控制有效性
        const form = container.closest('form');
        if (form) {
            console.log('[addControl] 找到表单，准备更新控制有效性');
            updateControlEffectiveness(form);
            console.log('[addControl] 控制有效性已更新');
        } else {
            console.warn('[addControl] 未找到父表单，无法更新控制有效性');
        }
        console.log('[addControl] 函数执行完毕');
    } catch (error) {
        console.error('[addControl] 执行时发生错误:', error);
        alert('添加控制措施时出错，请查看控制台。');
    }
}

// 保存欺诈风险评估
function saveFraudAssessment(event, fraudTypeId) {
    event.preventDefault();
    console.log('开始保存欺诈评估, fraudTypeId:', fraudTypeId);
    
    try {
        const form = event.target;
        if (!form) {
            console.error('无法获取表单元素');
            alert('保存失败：无法获取表单元素');
            return;
        }
        
        // 如果从URL参数获取，就从表单隐藏字段获取
        if (!fraudTypeId) {
            fraudTypeId = form.querySelector('input[name="fraudTypeId"]').value;
            console.log('从表单获取到fraudTypeId:', fraudTypeId);
        }
        
        if (!fraudTypeId) {
            console.error('Missing fraudTypeId');
            alert('保存失败：缺少欺诈类型ID');
            return;
        }
        
        const productId = localStorage.getItem('currentProductId');
        console.log('当前产品ID:', productId);
        
        if (!productId) {
            console.error('Missing productId');
            alert('保存失败：缺少产品ID');
            return;
        }
        
        const assessments = JSON.parse(localStorage.getItem(`fraudAssessments_${productId}`) || '[]');
        console.log('现有评估数量:', assessments.length);
        
        // 收集控制措施
        const controls = [];
        const controlInputs = form.querySelectorAll('.control-input');
        console.log('找到控制措施输入框数量:', controlInputs.length);
        
        controlInputs.forEach((controlInput, index) => {
            try {
                const measureInput = controlInput.querySelector(`[name="control${index}"]`);
                if (measureInput && measureInput.value.trim()) {
                    const measure = measureInput.value.trim();
                    const statusSelect = controlInput.querySelector(`[name="controlStatus${index}"]`);
                    const keyControlCheckbox = controlInput.querySelector(`[name="keyControl${index}"]`);
                    const definitionInput = controlInput.querySelector(`[name="controlDefinition${index}"]`);
                    
                    controls.push({
                        measure: measure,
                        status: statusSelect ? statusSelect.value : 'not_implemented',
                        isKeyControl: keyControlCheckbox ? keyControlCheckbox.checked : false,
                        definition: definitionInput ? definitionInput.value : ''
                    });
                    console.log('添加了控制措施:', measure);
                }
            } catch (error) {
                console.error('处理控制措施时出错:', error);
            }
        });
        
        console.log('收集到控制措施数量:', controls.length);
        
        // 收集 Action Plan
        const actions = [];
        const actionInputGroups = form.querySelectorAll('.action-input-group');
        console.log('找到 Action 输入组数量:', actionInputGroups.length);
        actionInputGroups.forEach((actionGroup, index) => {
            try {
                const actionNameInput = actionGroup.querySelector(`textarea[name="actionName${index}"]`);
                const actionDescriptionInput = actionGroup.querySelector(`textarea[name="actionDescription${index}"]`);
                
                if (actionNameInput && actionNameInput.value.trim()) {
                    actions.push({
                        name: actionNameInput.value.trim(),
                        description: actionDescriptionInput ? actionDescriptionInput.value.trim() : ''
                    });
                     console.log('添加了 Action:', actionNameInput.value.trim());
                }
            } catch(error) {
                 console.error('处理 Action 时出错:', error);
            }
        });
        console.log('收集到 Action 数量:', actions.length);

        // 创建/更新评估对象
        const assessment = {
            fraudTypeId: fraudTypeId,
            fraudDescription: form.fraudDescription.value,
            fraudAnalysis: form.fraudAnalysis.value,
            weight: form.weight.value || 0,
            likelihood: form.likelihood.value,
            impact: form.impact.value,
            inherentRisk: form.inherentRisk.value,
            controlDescription: form.controlDescription.value,
            controls: controls, // 添加 controls
            actions: actions, // 添加 actions
            controlEffectiveness: form.controlEffectiveness.value,
            residualRisk: form.residualRisk.value,
            treatment: form.treatment.value
        };
        
        console.log('构建的评估对象 (含Actions):', assessment);
        
        // 将问号提示信息保存到localStorage
        localStorage.setItem('tooltipData', JSON.stringify(tooltipData));
        
        // 更新或添加评估
        const existingIndex = assessments.findIndex(a => a.fraudTypeId === fraudTypeId);
        if (existingIndex >= 0) {
            assessments[existingIndex] = assessment;
            console.log('更新了现有评估，索引:', existingIndex);
    } else {
            assessments.push(assessment);
            console.log('添加了新评估');
        }
        
        // 保存更新后的评估
        localStorage.setItem(`fraudAssessments_${productId}`, JSON.stringify(assessments));
        console.log('保存了更新后的评估到localStorage');
        
        // --- 新增：将Actions添加到Action Tracker Table --- 
        const actionTableBody = document.getElementById('action-list');
        const currentFraudTypeInfo = FRAUD_TYPES.find(ft => ft.id === fraudTypeId) || { name: fraudTypeId }; // 获取当前评估的欺诈类型信息
        
        if (actionTableBody && assessment.actions && assessment.actions.length > 0) {
             console.log('准备将Actions添加到Action Tracker Table');
             // 获取当前表格中已存在的Action Name，避免重复添加 (基于名称判断)
             const existingActionNames = new Set(
                 Array.from(actionTableBody.querySelectorAll('tr td:nth-child(2)'))
                      .map(td => td.textContent.trim())
             );
             console.log('Action Tracker中已存在的Action Names:', existingActionNames);

            assessment.actions.forEach(action => {
                if (action.name && !existingActionNames.has(action.name.trim())) {
                    const newActionId = `assessmentAction-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                    const newRowIndex = actionTableBody.rows.length + 1;
                    
                    // 为Action Tracker表格创建新行
                    const newRowHtml = `
                        <tr data-id="${newActionId}">
                            <td>${newRowIndex}</td>
                            <td>${action.name}</td>
                            <td>${action.description}</td>
                            <td>${currentFraudTypeInfo.name}</td> <!-- Linked Fraud Type -->
                            <td>Low</td> <!-- Default Priority -->
                            <td></td> <!-- Default Completion Date -->
                            <td></td> <!-- Default Timeline Tracking -->
                            <td>Not Started</td> <!-- Default Completion Status -->
                            <td></td> <!-- Default Action Owner -->
                            <td>Generated from ${currentFraudTypeInfo.name} assessment</td> <!-- Default Remark -->
                            <td>
                                <div class="action-buttons">
                                    <button class="icon-button edit-button" onclick="editAction('${newActionId}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-button delete-button" onclick="deleteAction('${newActionId}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    actionTableBody.insertAdjacentHTML('beforeend', newRowHtml);
                    existingActionNames.add(action.name.trim()); // 更新set避免同一批次重复添加
                    console.log('已添加 Action 到 Tracker:', action.name);
                } else if (action.name && existingActionNames.has(action.name.trim())) {
                    console.log('Action 已存在于 Tracker, 跳过添加:', action.name);
                }
            });
        } else if (!actionTableBody) {
            console.warn('找不到 Action Tracker 表格 (ID: action-list)');
        }
        // --- Action Tracker 添加结束 --- 

        // 关闭模态框并更新UI
        closeModal(form.closest('.modal-overlay').querySelector('.close-button'));
        renderSelectedFraudTypes(); 
        
        console.log('评估保存成功');
        return true;
    } catch (error) {
        console.error('保存欺诈评估时出错:', error);
        alert('保存失败: ' + error.message);
        return false;
    }
}

// 更新固有风险
function updateInherentRisk(form) {
    const likelihood = form.likelihood.value;
    const impact = form.impact.value;
    
    if (likelihood && impact) {
        const inherentRisk = calculateInherentRisk(likelihood, impact);
        form.inherentRisk.value = inherentRisk;
    
    // 触发剩余风险的更新
    updateResidualRisk(form);
    }
}

// 更新剩余风险
function updateResidualRisk(form) {
    const inherentRisk = form.inherentRisk.value;
    const controlEffectiveness = form.controlEffectiveness.value;
    
    if (inherentRisk && controlEffectiveness) {
        const residualRisk = calculateResidualRisk(inherentRisk, controlEffectiveness);
        form.residualRisk.value = residualRisk;
    }
}

// 移除控制措施
function removeControl(button) {
    const controlInput = button.closest('.control-input');
    controlInput.remove();
    
    // 更新控制有效性
    const form = controlInput.closest('form');
    if (form) {
        updateControlEffectiveness(form);
    }
} 

// Function to add a new action input group
function addAction() {
    console.log('[addAction] Adding new action');
    const container = document.getElementById('actionsGroup');
    if (!container) {
        console.error('[addAction] Cannot find actionsGroup container');
        return;
    }
    const actionCount = container.querySelectorAll('.action-input-group').length;
    console.log('[addAction] Current action count:', actionCount);
    
    const newActionHtml = `
        <div class="action-input-group">
            <div class="action-fields">
                <textarea name="actionName${actionCount}" placeholder="Action Name" rows="1"></textarea>
                <textarea name="actionDescription${actionCount}" placeholder="Action Description" rows="2"></textarea>
            </div>
            <button type="button" onclick="removeAction(this)">-</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newActionHtml);
    console.log('[addAction] New action group added');
    
    // Focus on the new action name field
    const newNameInput = container.querySelector(`textarea[name="actionName${actionCount}"]`);
    if (newNameInput) {
        newNameInput.focus();
    }
}

// Function to remove an action input group
function removeAction(button) {
    console.log('[removeAction] Removing action');
    const actionGroup = button.closest('.action-input-group');
    if (actionGroup) {
        actionGroup.remove();
        console.log('[removeAction] Action group removed');
    } else {
        console.error('[removeAction] Could not find parent action-input-group');
    }
} 