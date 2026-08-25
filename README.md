# Ghost Refresh · 鬼影提神 👻

一只友好的小幽灵会定时飘过你的 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 网页界面——提神醒脑，防止摸鱼睡着。

A friendly ghost drifts across your DeepSeek Harness web UI at random intervals — a tiny nudge to keep you awake and refreshed.

## 功能 / Features

- 👻 幽灵随机从左/右飘过页面，带漂浮起伏与柔和光晕（`prefers-reduced-motion` 下自动隐藏）
- ⚙️ 右下角「👻 Ghost」按钮打开设置面板：
  - 速度 0.5×–2× / Speed
  - 透明度 20%–100% / Opacity
  - 大小 50%–180% / Size
  - 频率 5–120 秒 / Frequency
- 💾 设置经 localStorage 持久化，实时生效 / Settings persist per browser and apply live
- 🖼️ 零依赖、自包含：幽灵贴图以内联 data URI 打包进客户端 bundle

## 安装 / Install

```bash
dsh plugin --profile web add dsh-ghost-refresh
```

然后重启 DSH。（desktop profile 把 `web` 换成 `desktop`。）

## 卸载 / Uninstall

```bash
dsh plugin --profile web remove dsh-ghost-refresh
```

## 结构 / Structure

```text
package.json        # dsh.client（浏览器半边）+ dsh.bundle（组合补丁）声明
cordis.patch.yml    # 向 profile 插入插件行
lib/index.js        # 宿主半边（本插件纯浏览器侧，宿主为空实现）
lib/client.js       # 浏览器半边：幽灵图层 + 设置按钮 + localStorage 持久化
```

## License

[MIT](LICENSE)
