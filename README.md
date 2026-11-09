# 个人学术主页

一个简约、响应式的个人学术主页。米白背景、深绿色点缀、衬线标题，提供个人介绍、研究方向、论文、教育与研究经历，以及联系入口。

**当前人物、论文和经历全部是占位示例，不代表真实学术成果。请先替换再发布。** 页面默认英文，所有文案支持改为中文。没有跟踪统计、外部字体或运行时第三方依赖。

## 本地预览

可以直接双击 `index.html` 查看；推荐使用本地服务器，便于检查文件路径和引用复制：

```powershell
cd D:\selfWEB
npm run dev
```

浏览器打开 <http://localhost:5173>。需要 Node.js 18 或更新版本，**不需要执行 npm install**。修改后保存并刷新浏览器即可。终端按 `Ctrl+C` 停止服务。

端口被占用时，在 PowerShell 中使用：

```powershell
$env:PORT = "5174"
npm run dev
```

## 修改资料

**主要只需要编辑 `site.config.js`。** 头像、论文图片和简历放入 `assets/`。

完整说明见 [信息修改指南](docs/修改指南.md)，含字段说明、添加论文、BibTeX、中文化、隐藏栏目和常见错误。

## 部署到 GitHub

项目已配置 GitHub Pages 自动部署，上传到 GitHub 仓库后启用即可。支持 `用户名.github.io` 个人站点和普通仓库项目站点，所有网站资源均使用相对路径。

按步骤操作：[GitHub 部署指南](docs/GitHub部署指南.md)。

## 项目结构

```text
selfWEB/
├── index.html                 页面结构
├── site.config.js             你的个人资料和所有主要内容
├── styles.css                 颜色、字体、布局、手机适配
├── app.js                     内容渲染、年份筛选、引用复制、导航
├── assets/                    头像、论文图片、公开简历
│   └── favicon.svg            浏览器图标
├── docs/
│   ├── 修改指南.md
│   └── GitHub部署指南.md
├── scripts/
│   ├── serve.mjs              零依赖本地预览服务器
│   └── check.mjs              内容和本地资源检查
└── .github/workflows/deploy.yml  GitHub Pages 自动部署
```

## 发布前检查

```powershell
npm run check
```

检查 JavaScript 语法、必需字段、论文编号和本地资源是否存在。检查不访问外部网站；论文链接内容和学术信息的真实性需要自己确认。

## 交互与兼容性

- 电脑、平板、手机布局；手机导航菜单。
- 论文按年份筛选，自动突出显示本人姓名。
- 填入真实链接后显示 Paper / Code / Project；填入 BibTeX 后显示 Cite 和复制窗口。
- 键盘导航、跳转正文、减少动态效果设置、打印样式。
- 头像加载失败时保留默认图案，论文图片加载失败时恢复内置示意图。

建议使用近期版本的 Chrome、Edge、Firefox 或 Safari。引用复制需要浏览器支持 Clipboard API；复制不可用时会选中文本，允许手动复制。

这是纯静态网站，没有后台、数据库或登录。更新方式是修改文件后推送 GitHub。
