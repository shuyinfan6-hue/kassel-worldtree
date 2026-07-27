# 卡塞尔世界树球形徽章

一个可以直接放入网页的球形世界树动画：左半繁荣、右半枯萎，支持鼠标和触摸拖动、滚轮缩放、自动旋转与双击复位。

## 立即预览

下载仓库后，直接双击 `index.html` 即可打开，不需要安装软件，也不依赖网络资源。

## 放进你自己的网页

最简单的方法是把 `index.html`、`styles.css`、`app.js` 三个文件复制到你的网站目录，然后访问 `index.html`。

如果要嵌入已有页面，可以使用：

```html
<iframe
  src="/kassel-worldtree/index.html"
  title="卡塞尔世界树球形徽章"
  style="width:100%;height:720px;border:0;background:#05070a"
  loading="lazy">
</iframe>
```

## 操作

- 鼠标或手指拖动：旋转
- 鼠标滚轮：缩放
- 双击：复位
- 右上角按钮：暂停或继续自动旋转

## 文件说明

- `index.html`：页面结构
- `styles.css`：视觉样式和响应式布局
- `app.js`：世界树绘制、动画与交互

本组件使用原生 Canvas 2D 制作，无需 npm、Three.js 或外部 CDN，Windows、Android、iPhone 和常见桌面浏览器都能直接运行。
