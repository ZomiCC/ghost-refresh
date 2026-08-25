# 开发踩坑备忘（Ghost Refresh）

> 2026-08-25 上线全流程实录。下次开发/发版前先读一遍，别再踩。

## 我们自己包里的坑（已修复，引以为戒）

1. **宿主半边必须导出合法插件形状**（1.0.0 → 1.0.1）
   - 错误写法：`export default {}` —— Cordis 挂载时直接崩：
     `invalid plugin, expect function or object with an "apply" method, received object`
   - 正确写法：`export default { apply() {} }`（哪怕宿主什么都不干）
   - 教训：浏览器专属插件的宿主半边也不能是裸对象。

2. **别给"整活动画"的插件加 `prefers-reduced-motion` 适配**（1.0.1 → 1.0.2）
   - `@media (prefers-reduced-motion: reduce){.dsh-ghost-layer{display:none;}}`
   - 症状：用户系统关了动画效果 → 按钮在、鬼永远不出现，"假装坏掉"。
   - 教训：用户装这个插件就是要看动画；无障碍适配不该静默禁用插件核心功能。

3. **滑块语义要跟直觉走**（1.0.1 → 1.0.2）
   - "频率"滑块实际存的是间隔秒数：右=120s（冷清），用户以为是右=更频繁。
   - 修复：UI 层反向映射（`value: 125 - s.interval`），右=5s 一只；存储层语义不变，老设置无缝兼容。

## 环境/工具的坑（不是我们的 bug，但要知道怎么破）

4. **pnpm 元数据缓存会钉住旧 latest**
   - 发布新版后，装过旧版的机器上：裸 `add` → "Already up to date" 不升级；
     `update` 甚至"删了重装"都被缓存骗回旧版。
   - 破解：**显式版本号** `dsh plugin --profile web add dsh-ghost-refresh@x.y.z`。
   - 常规发版不用嘱咐（新用户现查 registry，秒拿最新；老用户缓存过期后 update 自愈）；
     **紧急修复才需要让用户带版本号升级**。

5. **DSH CLI 偶发漏写 bundles**（官方 bug）
   - `dsh plugin add` 装上了包，但偶尔不把名字写进 profile `package.json` 的
     `dsh.profile.bundles` 数组 → 不报错但插件不加载。
   - 排查：`node -p "require('<profile目录>/package.json').dsh.profile.bundles"`
   - 修复：重跑一遍 add 碰运气；不行就手工往数组末尾补一行，重启 DSH。

6. **npm 发布强制 2FA**
   - 直接 `npm publish` 报 `EOTP` / 403。
   - 破解：账号开 2FA 后，生成 Granular Access Token（勾选"允许绕过 2FA"用于发布），
     用 `--userconfig <临时npmrc>` 指定令牌发布，用完删临时文件、吊销令牌。

## 验证纪律（每次发版必走）

- 发布后 **`npm pack` 下载 tarball 解包**，确认关键文件与本地一致（哈希对比），
  别信"本地能跑 npm 上就对了"。
- **全新 profile 从 npm 装一遍再启动**，零报错 + 页面含模块 + `/plugins/<pkg>/client.js` 200。
- 启动命令细节：`web` 子命令拒绝 `--profile`；自定义 profile 用
  `node bin.js --profile <name> --no-open --port <p>`，且 profile 必须包含
  `@deepseek-ai/dsh-web-app` bundle 才有服务器。
- 调试完清僵尸 node 进程（job_kill 有时只杀外层壳，node 本体还活着占端口）。

## 发布渠道备忘

- npm: `dsh-ghost-refresh`（发布用临时 granular token）
- 市场: deepseek1024.com（1024Store）自动检测 npm 包点亮安装命令
- 雷达: AdamPlatin123/awesome-dsh-plugins 按 `dsh-plugin` topic 自动扫（无需提交）
- 目录: Dominic789654/awesome-deepseek-harness 手工 PR（PR #268）
