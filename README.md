# WebExtension Vite 启动模板

一个由 [Vite](https://vitejs.dev/) 驱动的 WebExtension（[Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/) 等）启动模板。

<p align="center">
<sub>弹出窗口</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741643-813b3773-17ff-4281-9737-f319e00feddc.png"><br/>
<sub>选项页面</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741653-43125b62-6578-4452-83a7-bee19be2eaa2.png"><br/>
<sub>在内容脚本中注入 Vue 应用</sub><br/>
<img src="https://user-images.githubusercontent.com/11247099/130695439-52418cf0-e186-4085-8e19-23fe808a274e.png">
</p>

## 特性

- ⚡️ **即时热更新** - 开发时使用 **Vite**（无需刷新！）
- 🥝 Vue 3 - 组合式 API、[`<script setup>` 语法](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) 等更多特性！
- 💬 轻松通信 - 由 [`webext-bridge`](https://github.com/antfu/webext-bridge) 和 [VueUse](https://github.com/antfu/vueuse) 存储提供支持
- 🌈 [UnoCSS](https://github.com/unocss/unocss) - 即时按需的原子化 CSS 引擎
- 🦾 [TypeScript](https://www.typescriptlang.org/) - 类型安全
- 📦 [组件自动导入](./src/components)
- 🌟 [图标](./src/components) - 可直接访问任何图标集的图标
- 🖥 内容脚本 - 在内容脚本中也可以使用 Vue
- 🌍 WebExtension - 适用于 Chrome、Firefox 等浏览器的同构扩展
- 📃 具有完整类型支持的动态 `manifest.json`

## 预置功能

### WebExtension 库

- [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - 带类型的 WebExtension 浏览器 API 填充库
- [`webext-bridge`](https://github.com/antfu/webext-bridge) - 用于上下文之间无缝通信

### Vite 插件

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - 直接使用 `browser` 和 Vue 组合式 API，无需导入
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - 组件自动导入
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - 图标作为组件
  - [Iconify](https://iconify.design) - 使用任何图标集的图标 [🔍Icônes](https://icones.netlify.app/)

### Vue 插件

- [VueUse](https://github.com/antfu/vueuse) - 实用的组合式 API 集合

### UI 框架

- [UnoCSS](https://github.com/unocss/unocss) - 即时按需的原子化 CSS 引擎

### 编码风格

- 使用带有 [`<script setup>` SFC 语法](https://github.com/vuejs/rfcs/pull/227) 的组合式 API
- [ESLint](https://eslint.org/) 配合 [@antfu/eslint-config](https://github.com/antfu/eslint-config)，使用单引号，无分号

### 开发工具

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - 快速、节省磁盘空间的包管理器
- [esno](https://github.com/antfu/esno) - 由 esbuild 驱动的 TypeScript / ESNext node 运行时
- [npm-run-all](https://github.com/mysticatea/npm-run-all) - 并行或串行运行多个 npm 脚本
- [web-ext](https://github.com/mozilla/web-ext) - 用于开发 web 扩展的流畅体验

## 使用模板

### GitHub 模板

[从 GitHub 上使用此模板创建仓库](https://github.com/antfu/vitesse-webext/generate)。

### 克隆到本地

如果你更喜欢手动操作并保持更清晰的 git 历史

> 如果你没有安装 pnpm，请运行：npm install -g pnpm

```bash
npx degit antfu/vitesse-webext my-webext
cd my-webext
pnpm i
```

## 使用方法

### 文件夹结构

- `src` - 主源代码
  - `contentScript` - 作为 `content_script` 注入的脚本和组件
  - `background` - 后台脚本
  - `components` - 在弹出窗口和选项页面中共享的自动导入的 Vue 组件
  - `styles` - 在弹出窗口和选项页面中共享的样式
  - `assets` - 在 Vue 组件中使用的资源
  - `manifest.ts` - 扩展的 manifest 配置
- `extension` - 扩展包根目录
  - `assets` - 静态资源（主要用于 `manifest.json`）
  - `dist` - 构建文件，同时在开发时为 Vite 提供存根入口
- `scripts` - 开发和打包辅助脚本

### 开发

```bash
pnpm dev
```

然后**在浏览器中加载 `extension/` 文件夹作为扩展**。

Firefox 开发者可以运行以下命令：

```bash
pnpm dev-firefox
```

当 `extension/` 文件发生变化时，`web-ext` 会自动重新加载扩展。

> 虽然 Vite 在大多数情况下会自动处理热更新，但仍建议使用 [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) 以获得更清晰的硬重载。

## 使用 Gitpod

如果你有网络浏览器，只需一次点击即可获得完全预配置的开发环境：

[![在 Gitpod 中打开](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/antfu/vitesse-webext)

### 构建

要构建扩展，运行

```bash
pnpm build
```

然后打包 `extension` 下的文件，你可以将 `extension.crx` 或 `extension.xpi` 上传到相应的扩展商店。

## 致谢

[![Volta](https://user-images.githubusercontent.com/904724/195351818-9e826ea9-12a0-4b06-8274-352743cd2047.png)](https://volta.net)

这个模板最初是为 [volta.net](https://volta.net) 浏览器扩展创建的。

## 变体

这是 [Vitesse](https://github.com/antfu/vitesse) 的一个变体，查看[完整的变体列表](https://github.com/antfu/vitesse#variations)。
