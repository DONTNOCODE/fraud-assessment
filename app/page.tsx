'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <main>
      {/* 顶部导航栏 */}
      <header className="fixed w-full top-0 bg-white/95 shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">技能市场</div>
            <ul className="hidden md:flex space-x-8">
              <li><a href="#home" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">首页</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">服务</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">关于我们</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">联系我们</a></li>
            </ul>
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">登录</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out">注册</button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero 区域 */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center pt-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          发现优质技能服务
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          连接千万技能达人，让服务触手可及
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
          立即开始
        </button>
      </section>

      {/* 服务分类 */}
      <section id="services" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            服务分类
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: 'ri-code-line', title: '编程开发', desc: '网站开发、小程序、APP等' },
              { icon: 'ri-translate-2', title: '翻译服务', desc: '中英互译、文档翻译等' },
              { icon: 'ri-movie-line', title: '视频制作', desc: '短视频、后期剪辑等' },
              { icon: 'ri-pencil-ruler-2-line', title: '设计服务', desc: '平面设计、UI设计等' },
            ].map((category) => (
              <div key={category.title} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out text-center transform hover:-translate-y-1 border border-gray-100">
                <i className={`${category.icon} text-4xl text-blue-600 mb-4 inline-block`}></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-500 text-sm">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门服务 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            热门服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: '/images/service-placeholder.jpg', title: 'Logo设计', price: '¥299起', rating: '4.9', desc: '专业的品牌Logo设计，含3次修改' },
              { img: '/images/service-placeholder.jpg', title: '微信小程序开发', price: '¥1999起', rating: '4.8', desc: '一站式小程序开发服务' },
              { img: '/images/service-placeholder.jpg', title: '短视频剪辑', price: '¥199起', rating: '4.7', desc: '专业短视频剪辑与特效制作' },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden transform hover:-translate-y-1 border border-gray-100">
                <div className="w-full h-48 bg-gray-200">
                  {/* <Image src={service.img} alt={service.title} width={400} height={300} className="w-full h-full object-cover"/> */}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-600 font-bold">{service.price}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="ri-star-fill text-yellow-400 mr-1"></i>
                      <span>{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 bg-gray-100 text-center">
        <p className="text-gray-500">&copy; 2024 C2C技能服务平台. All rights reserved.</p>
      </footer>
    </main>
  );
} 