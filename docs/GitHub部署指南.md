# 部署到 GitHub Pages

本项目已包含 `.github/workflows/deploy.yml`。第一次设置完成后，推送到 `main` 分支会自动检查并发布网站，不需要购买服务器。

以下步骤是把本地项目发布到你自己的 GitHub 账号。当前项目只配置了部署流程，**尚未创建远程仓库或实际发布**。

## 1. 先准备网站内容

1. 按照 [修改指南](修改指南.md) 替换默认姓名、邮箱、论文、经历和平台链接。
2. 把公开的头像、简历和论文图片放入 `assets/`。
3. 在项目目录执行 `npm run check`，再执行 `npm run dev` 预览。

## 2. 创建 GitHub 仓库

登录 [GitHub](https://github.com)，点击 **New repository**，选择下面一种命名方式。

| 仓库名称 | 最终网址 | 适用情况 |
| --- | --- | --- |
| `你的用户名.github.io` | `https://你的用户名.github.io/` | 推荐，作为主要个人主页；名称中的用户名必须与你的 GitHub 用户名一致 |
| `academic-homepage` 或其他名称 | `https://你的用户名.github.io/academic-homepage/` | 普通项目站点，已有个人主站也可以使用 |

免费个人账号建议建立 **Public** 仓库。首次创建时先不要勾选 README、`.gitignore` 或 License，避免与本地文件冲突。

## 3. 首次推送本地项目

在 PowerShell 中执行下面的命令。**先把最后的远程地址改成自己刚创建的仓库地址**：

```powershell
cd D:\selfWEB
git init -b main
git add .
git commit -m "Create academic homepage"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

上面针对当前新项目。如果你后来已初始化 Git，不需要再次执行 `git init`；已添加 `origin` 时使用 `git remote -v` 查看地址，必要时用 `git remote set-url origin 新地址` 修改。

第一次提交如果 Git 提示缺少身份，设置你希望出现在提交记录里的信息，再重新提交：

```powershell
git config user.name "你的名字"
git config user.email "你的 GitHub 提交邮箱"
```

推送时按 GitHub 登录提示完成认证。GitHub 不支持使用账号密码直接进行 HTTPS Git 推送，可以使用 Git Credential Manager 的浏览器登录，或 GitHub 的 Personal Access Token。通常 Windows Git 已附带 Credential Manager。

## 4. 启用 GitHub Pages

1. 进入 GitHub 仓库页面。
2. 点击 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 打开仓库顶部 **Actions** 标签，找到 **Deploy homepage to GitHub Pages**。
5. 如果第一次推送时还未启用 Pages，先前工作流可能失败。启用之后，在工作流页面点击 **Run workflow**，分支选 `main`，重新运行。
6. 等待 `build` 和 `deploy` 两个任务都显示绿色成功。
7. 在 **Settings → Pages** 或部署记录中打开显示的网站地址。

如果工作流停在等待环境批准，按仓库自己的 `github-pages` 环境规则批准该次部署。普通新建公开个人仓库一般不需要额外设置。

## 5. 以后如何更新

编辑本地资料、保存并检查，然后：

```powershell
cd D:\selfWEB
npm run check
git add .
git commit -m "Update profile and publications"
git push
```

工作流会自动运行。确认部署成功之后刷新网页。你也可以直接在 GitHub 页面编辑 `site.config.js` 并提交到 `main`，同样会自动发布。

## 6. 部署流程做了什么

```text
推送 main
   ↓
检查 JavaScript、资料配置和本地资源
   ↓
复制网站文件到临时发布目录
   ↓
上传 GitHub Pages 构建产物
   ↓
部署并提供公开访问地址
```

只把 `index.html`、`styles.css`、`app.js`、`site.config.js`、`.nojekyll` 和 `assets/` 发布到 Pages。修改指南、开发脚本和 README 不属于网站发布文件；公开仓库中仍能查看源码与文档。

站点不需要构建命令、不需要 `npm install`，也不需要额外 Secrets。工作流使用 GitHub 自带的短期令牌和 Pages 权限。

## 7. 可选：不用 GitHub Actions

这是纯静态项目，也可以在 **Settings → Pages → Source** 选择 **Deploy from a branch**，分支选择 `main`，目录选择 `/ (root)`，然后保存。

如果采用这个方式，先删除 `.github/workflows/deploy.yml`，避免同时运行两套部署。根目录已有 `.nojekyll`，可以直接发布。这个方式会把仓库根目录里其他可发布文件也一起放到网站，因此推荐使用上面的 Actions 方式。

## 8. 可选：绑定自定义域名

1. 在 GitHub **Settings → Pages → Custom domain** 填入自己的域名。
2. 按 [GitHub 官方域名配置文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) 配置 DNS。
3. 如果采用当前 Actions 部署，域名以 Pages 设置为准；如果你还要使用 `CNAME` 文件，把文件放在 `assets/` **之外的根目录**，并在工作流的 `cp` 步骤中加入 `CNAME`，确保它被复制到 `_site/`。
4. DNS 和证书生效后，在 Pages 设置里启用 **Enforce HTTPS**。

## 9. 常见部署问题

| 问题 | 处理方式 |
| --- | --- |
| Pages 返回 404 | 检查 Settings → Pages 的 Source、Actions 是否成功，以及仓库名和访问网址是否一致 |
| `configure-pages` 报找不到 Pages 站点 | 先在 Settings → Pages 选择 GitHub Actions，再手动重新运行工作流 |
| 工作流没启动 | 确认推送分支是 `main`；使用其他分支时同步修改 `deploy.yml` 的 `branches` |
| Actions 被禁用 | 在 Settings → Actions → General 中允许本仓库运行所需的 GitHub Actions |
| 权限错误 | 确认工作流保留 `pages: write` 和 `id-token: write`，并检查组织策略是否允许 Pages 部署 |
| build 检查失败 | 查看失败任务日志，先在本地运行 `npm run check` 修复语法、缺失文件或错误配置 |
| CSS / 图片丢失 | 使用相对路径；严格核对文件名大小写；确认文件已提交 |
| 修改后仍是旧内容 | 等待部署成功，用 `Ctrl+F5` 刷新，核对访问的是正确仓库对应的网址 |
| Git 推送被拒绝 | 先检查是否选错仓库、是否缺少权限、远程是否已有提交；不要直接强制覆盖远程历史 |

实际是否能成功发布，以你在 GitHub 上运行工作流的结果为准。本地检查不会代替远程认证和 Pages 设置。
