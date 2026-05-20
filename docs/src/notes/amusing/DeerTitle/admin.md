---
title: 管理员手册
createTime: 2026/05/20 02:00:00
permalink: /amusing/DeerTitle/admin/
---

管理员命令需要权限节点 `deertitle.admin`。

## 重载配置

```
/dt reload
```

修改 `config.yml` 后执行此命令可热重载配置，无需重启服务器。

## 称号管理

```
/dt admin create <称号文本> || <描述>
/dt admin setdesc <称号ID> <描述>
/dt admin setenabled <称号ID> <true|false>
```

- `create` 使用 `||` 分隔称号文本与描述
- `setenabled` 可启用或禁用某个称号
- 所有带 `<称号ID>` 的参数均支持 Tab 补全

## 玩家管理

```
/dt admin grant <玩家> <称号ID> [天数|-1]
/dt admin revoke <玩家> <称号ID>
/dt admin coin set <玩家> <金额>
/dt admin coin add <玩家> <金额>
/dt admin card <玩家> <称号ID> [天数|-1]
```

- `days = -1` 表示永久称号
- `coin set/add` 用于管理内置货币（Vault 不可用时）
- `card` 向在线玩家发放称号卡

## 商店管理

### 添加商店优惠

```
/dt admin shop add <称号ID> price=<价格> days=<天数> stock=<库存> [saleEnd=<截止日期>]
```

参数说明（使用 `key=value` 格式，不区分顺序）：

| 参数 | 说明 | 是否必填 |
|------|------|---------|
| `price` | 价格（正数） | ✅ |
| `days` | 时长天数，`-1` 为永久 | ✅ |
| `stock` | 库存数量，`-1` 为无限 | ✅ |
| `saleEnd` | 促销截止日期，`-1` 为永不过期 | 可选 |

日期格式：`yyyy-MM-dd`

### 修改商店优惠

```
/dt admin shop set <商店优惠ID> [price=<价格>] [days=<天数>] [stock=<库存>] [saleEnd=<截止日期>]
```

至少传入一个参数，只更新传入的字段。

### 移除商店优惠

```
/dt admin shop remove <商店优惠ID>
```

## 权限节点汇总

| 权限节点 | 说明 | 默认值 |
|---------|------|-------|
| `deertitle.admin` | 管理员命令 | op |
| `deertitle.use` | 玩家基础命令 | true |
| `deertitle.shop` | 商店相关命令 | true |
| `deertitle.card.use` | 使用称号卡 | true |
