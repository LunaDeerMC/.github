---
title: 使用方法
createTime: 2026/05/20 02:00:00
permalink: /amusing/DeerTitle/use/
---

## 基本操作

主命令：`/deertitle`

别名：`/dt`、`/title`

直接输入 `/dt` 即可打开 GUI 主菜单，包含「我的称号」和「称号商店」等选项。

## 玩家命令

| 命令 | 说明 |
|------|------|
| `/dt` | 打开主菜单 |
| `/dt list` | 列出自己拥有的称号 |
| `/dt wear <称号ID>` | 佩戴一个称号 |
| `/dt equip <称号ID>` | wear 的别名 |
| `/dt remove` | 卸下当前称号 |
| `/dt current` | 显示当前佩戴的称号 |
| `/dt balance` | 显示余额 |
| `/dt shop` | 打开称号商店 |
| `/dt buy <商店优惠ID>` | 购买一个商店优惠 |
| `/dt help [子命令]` | 查看帮助信息 |

> 所有带有 `<称号ID>`、`<商店优惠ID>` 参数的命令均支持 Tab 补全。

## 称号卡

称号卡是一种道具（默认材质为命名牌），右键使用可获得对应称号。

- 如果管理员开启了 `consumeOnUse`，使用后称号卡会被消耗
- 如果开启了 `requireSneakToUse`，需要潜行状态下手持称号卡右键使用

## PlaceholderAPI 占位符

注册标识符：`deertitle`

| 占位符 | 说明 |
|--------|------|
| `%deertitle_current%` | 当前佩戴的称号（带前后缀） |
| `%deertitle_current_legacy%` | 当前佩戴的称号（兼容格式） |
| `%deertitle_current_plain%` | 当前佩戴的称号（纯文本） |
| `%deertitle_has_title%` | 是否拥有称号 |

安装 PlaceholderAPI 后插件会自动注册扩展，无需手动操作。
