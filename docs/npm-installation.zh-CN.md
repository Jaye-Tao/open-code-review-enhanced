# npm 安装指南

本文介绍如何通过 npm 安装 `open-code-review-enhanced`，并在 Windows、Linux 和 macOS 上完成首次验证。

安装完成后，命令行入口为 `ocr`。

## 1. 安装环境

| 项目 | 要求 |
| --- | --- |
| Node.js | 推荐 18 或更高版本；本包的最低引擎要求为 14 |
| npm | 与 Node.js 一起安装；npm 11 以及更高版本请按本文的“npm 11”章节操作 |
| Git | 2.41 或更高版本，用于读取代码变更 |
| 操作系统 | Windows、Linux、macOS |
| 网络 | 安装时需要访问 npm registry 和 GitHub Release 下载二进制文件 |

检查环境：

```bash
node --version
npm --version
git --version
```

如果命令不存在，请先从 [Node.js 官网](https://nodejs.org/) 和 [Git 官网](https://git-scm.com/) 安装对应软件，然后重新打开终端。

## 2. 安装命令

npm 11 可能默认阻止依赖包的 `postinstall` 脚本。普通安装命令虽然可能显示安装成功，但会输出 `warn` 警告，安装脚本没有运行，平台二进制文件未下载，随后执行 `ocr` 时可能提示找不到二进制文件。

为避免 npm 版本差异，所有环境都只使用下面这条命令。它会显式允许本包运行安装脚本：

```bash
npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
```

如果你已经用普通命令安装过一次，请再次执行上面的命令，让 `postinstall` 脚本补齐当前平台的二进制文件。

## 3. Windows 安装

1. 安装 Node.js（建议选择 LTS 版本）和 Git。
2. 打开 PowerShell 或 Windows Terminal。
3. 检查版本：

   ```powershell
   node --version
   npm --version
   git --version
   ```

4. 安装包：

   ```powershell
   npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
   ```

5. 验证安装：

   ```powershell
   ocr version
   ocr --help
   ```

如果 PowerShell 提示没有权限，建议使用 [nvm-windows](https://github.com/coreybutler/nvm-windows) 管理 Node.js，避免把 npm 全局目录安装到受保护目录。也可以使用“以管理员身份运行”的 PowerShell 重试。

## 4. Linux 安装

1. 安装 Node.js、npm 和 Git。以 Debian/Ubuntu 为例：

   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git
   ```

2. 检查版本：

   ```bash
   node --version
   npm --version
   git --version
   ```

3. 使用 npm 11 命令安装：

   ```bash
   npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
   ```

4. 验证安装：

   ```bash
   ocr version
   ocr --help
   ```

如果遇到 `EACCES` 或全局目录写入权限错误，推荐使用 nvm 安装 Node.js；也可以在确认 npm 全局目录后使用 `sudo`：

```bash
sudo npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
```

## 5. macOS 安装

1. 安装 Node.js 和 Git。已安装 Homebrew 时可以执行：

   ```bash
   brew install node git
   ```

2. 检查版本：

   ```bash
   node --version
   npm --version
   git --version
   ```

3. 使用 npm 11 命令安装：

   ```bash
   npm i -g open-code-review-enhanced --allow-scripts=open-code-review-enhanced
   ```

4. 验证安装：

   ```bash
   ocr version
   ocr --help
   ```

如果遇到全局目录权限错误，推荐使用 nvm 或 Homebrew 安装的 Node.js，不要直接修改系统目录权限。

## 6. 安装后首次配置

进入要评审的 Git 仓库，先配置 LLM：

```bash
cd ~/projects/order-service
ocr config provider
ocr config model
ocr llm test
```

Windows PowerShell 示例：

```powershell
Set-Location C:\Projects\order-service
ocr config provider
ocr config model
ocr llm test
```

配置完成后，可以运行一次预览（不会调用 LLM）确认待评审文件：

```bash
ocr review --preview
```

## 7. 更新、卸载和排错

更新到最新版：

```bash
npm i -g open-code-review-enhanced@latest --allow-scripts=open-code-review-enhanced
```

卸载：

```bash
npm uninstall --global open-code-review-enhanced
```

排查“找不到 `ocr`”或二进制未下载：

```bash
npm prefix --global
ocr version
```

如果 `ocr version` 提示二进制不存在，请重新执行 npm 11 的安装命令，并确认命令中包含：

```text
--allow-scripts=open-code-review-enhanced
```

## 8. 下一步

- [安装后常用命令](./cli-usage.zh-CN.md)
- [中文 CLI 参考](../pages/src/content/docs/zh/cli-reference.md)
- [中文配置说明](../pages/src/content/docs/zh/configuration.md)
