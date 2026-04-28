---
title: 命令与权限参考
createTime: 2026/04/28 10:00:00
permalink: /paid/DominionProtect/commands/
---

## 玩家命令

| 命令 | 说明 |
|------|------|
| `/domp help` | 显示帮助 |
| `/domp inspect` | 切换检查模式 |
| `/domp lookup [参数]` | 查询记录 |
| `/domp page <next\|prev\|页码>` | 浏览分页结果 |
| `/domp rollback [参数]` | 发起回溯 |
| `/domp restore [参数]` | 发起恢复 |
| `/domp confirm` | 确认操作 |
| `/domp cancel` | 取消待定操作 |
| `/domp plans` | 查看可用订阅方案 |
| `/domp subscribe <方案ID>` | 订阅方案 |
| `/domp renew <方案ID>` | 续费/切换方案 |
| `/domp unsubscribe` | 取消订阅 |
| `/domp status` | 查看当前订阅状态 |

### 查询参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `t:` | 时间范围 | `t:24h`、`t:7d`、`t:1d12h30m` |
| `p:` | 玩家名 | `p:Steve` |
| `a:` | 操作类型 | `a:break,place` |
| `r:` | 搜索半径 | `r:10` |
| `b:` | 方块类型 | `b:diamond_ore` |
| `e:` | 排除操作 | `e:flow` |

## 管理员命令

| 命令 | 说明 |
|------|------|
| `/domp admin status <领地>` | 查看领地订阅状态 |
| `/domp admin enable <领地> <方案>` | 为领地启用记录 |
| `/domp admin disable <领地>` | 禁用领地记录 |
| `/domp admin rollback <领地> [参数]` | 强制管理员回溯 |
| `/domp admin grant <领地> <天数>` | 延长订阅时间 |
| `/domp admin purge <领地>` | 立即清除领地数据 |
| `/domp admin reload` | 重载配置 |

## 权限

| 节点 | 默认 | 说明 |
|------|------|------|
| `dominionprotect.admin` | OP | 管理员命令 |
| `dominionprotect.rollback` | OP | 回溯/恢复命令 |
| `dominionprotect.default` | true (所有人) | 普通玩家命令 |
