---
title: 配置文件参考
createTime: 2026/04/28 10:00:00
permalink: /paid/DominionProtect/config/
---

配置文件位于 `plugins/DominionProtect/config.yml`。

## 基础设置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `language` | `zh_cn` | 插件语言，对应 `languages` 文件夹中的文件名 |
| `debug` | `false` | 调试模式，排查问题时开启 |

## 数据库

连接 MariaDB/MySQL 的数据库配置。

```yaml
database:
  host: localhost
  port: 3307
  database: dominion_protect
  username: root
  password: ''
  pool-size: 10
```

| 配置项 | 说明 |
|--------|------|
| `host` | 数据库地址 |
| `port` | 数据库端口 |
| `database` | 数据库名 |
| `username` | 数据库用户名 |
| `password` | 数据库密码 |
| `pool-size` | 连接池大小 |

## 事件记录

控制哪些事件类型会被记录。

```yaml
recording:
  flush-interval-seconds: 5
  batch-size: 1000
  retry-limit: 3
  disabled-actions:
    - block-from-to
    - block-spread
  enabled-actions: []
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `flush-interval-seconds` | `5` | 缓冲区刷入数据库的间隔（秒） |
| `batch-size` | `1000` | 每批写入的最大记录数 |
| `retry-limit` | `3` | 写入失败时的重试次数 |
| `disabled-actions` | `block-from-to, block-spread` | 禁用的事件类型列表 |
| `enabled-actions` | `[]` | 启用的事件类型列表，为空则全部启用 |

## 订阅方案

配置经济系统和订阅计划。

```yaml
subscription:
  vault-unavailable-strategy: free
  plans:
    - id: basic
      name: Basic Plan
      period-days: 30
      price: 1000.0
      record-limit: 100000
      quota-full-strategy: stop
    - id: premium
      name: Premium Plan
      period-days: 30
      price: 5000.0
      record-limit: -1
      quota-full-strategy: evict
```

| 配置项 | 说明 |
|--------|------|
| `vault-unavailable-strategy` | Vault 不可用时的策略。`free` = 无条件开放，`paid` = 付费内容不可用 |
| `plans[].id` | 方案唯一标识，用于命令引用 |
| `plans[].name` | 方案显示名称 |
| `plans[].period-days` | 订阅周期（天） |
| `plans[].price` | 价格（游戏币） |
| `plans[].record-limit` | 最大记录数，`-1` 表示不限 |
| `plans[].quota-full-strategy` | 配额用满时的策略。`stop` = 停止记录，`evict` = 淘汰旧记录 |
| `plans[].description` | 方案描述文本 |

## 查询

控制玩家查询行为的默认值。

```yaml
query:
  inspect-default-time: 24h
  page-size: 10
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `inspect-default-time` | `24h` | 检查模式默认查询时间范围 |
| `page-size` | `10` | 分页每页显示条数 |

## 回溯

控制回溯/恢复操作的行为。

```yaml
rollback:
  max-records: 50000
  batch-size: 200
  batch-interval-ticks: 2
  confirm-timeout-seconds: 30
  preview-enabled: true
  preview-timeout-seconds: 60
  preview-max-blocks: 10000
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `max-records` | `50000` | 单次回溯最大记录数 |
| `batch-size` | `200` | 每批处理的方块数 |
| `batch-interval-ticks` | `2` | 每批之间的 tick 间隔 |
| `confirm-timeout-seconds` | `30` | 确认操作的超时时间（秒） |
| `preview-enabled` | `true` | 是否启用幽灵方块预览 |
| `preview-timeout-seconds` | `60` | 预览展示的超时时间（秒） |
| `preview-max-blocks` | `10000` | 预览最大方块数 |

## 数据清理

控制过期数据的自动清理策略。

```yaml
cleanup:
  grace-period-days: 7
  max-retention-days: 90
  batch-size: 5000
  purge-delay-ms: 100
  cycle-interval-hours: 6
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `grace-period-days` | `7` | 宽限期（天），到期后才可清理 |
| `max-retention-days` | `90` | 最大保留天数，超出后强制清理 |
| `batch-size` | `5000` | 每批清理的记录数 |
| `purge-delay-ms` | `100` | 每批清理之间的延迟（毫秒） |
| `cycle-interval-hours` | `6` | 清理循环间隔（小时） |
