// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 为CTA按钮添加点击事件
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // TODO: 实现注册/登录逻辑
            console.log('CTA按钮被点击');
        });
    }

    // 为导航链接添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 