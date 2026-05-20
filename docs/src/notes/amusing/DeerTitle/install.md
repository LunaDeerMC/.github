---
title: 安装与配置
createTime: 2026/05/20 02:00:00
permalink: /amusing/DeerTitle/install/
---

## 运行要求

- 服务端：Paper 1.20.1+ 或兼容 API 的 Folia 服务端
- Java：17+

## 可选依赖

- `PlaceholderAPI`：启用称号占位符
- `Vault`：接入现有经济插件；未安装时使用插件内置货币

## 安装步骤

1. 下载最新版本的 DeerTitle 插件 jar
2. 将 jar 文件放入服务器的 `plugins/` 文件夹
3. 启动服务器
4. 插件会自动生成配置文件，按需修改后执行 `/dt reload` 或重启服务器

## 配置参考

`plugins/DeerTitle/config.yml` 主要配置项：

```yaml
general:
  # 语言文件，位于 plugins/DeerTitle/languages/ 目录
  languageCode: zh_cn
  # 调试模式
  debug: false

database:
  # sqlite 或 mariadb / mysql
  type: sqlite
  # SQLite 文件路径
  sqliteFile: database/deertitle.db
  # MariaDB/MySQL 连接信息（type 为 mariadb/mysql 时生效）
  # host: localhost
  # port: 3306
  # database: deertitle
  # username: root
  # password: ""

display:
  # 称号前后缀，支持颜色代码
  titlePrefix: "&8["
  titleSuffix: "&8]"
  # 称号与玩家名之间的分隔符
  titleSeparator: " "

economy:
  # 优先使用 Vault 经济系统
  preferVault: true
  # 内置货币名称和符号（Vault 不可用时生效）
  builtInCurrencyName: 金币
  builtInCurrencySymbol: "$"
  # 新玩家默认余额
  defaultBalance: 0.0

shop:
  # 允许免费称号
  allowFreeTitles: true
  # 商店每页显示数量
  maxPageSize: 45

card:
  # 称号卡材质
  material: NAME_TAG
  # 使用后是否消耗
  consumeOnUse: true
  # 是否要求潜行使用
  requireSneakToUse: false

ui:
  # 是否填充空槽位
  fillEmptySlots: true
  # 玩家菜单每页数量
  playerPageSize: 45
  # 管理员菜单每页数量
  adminPageSize: 45

tasks:
  # 称号过期扫描周期（游戏刻）
  expireCheckIntervalTicks: 600
  # Tab 刷新周期（游戏刻）
  tabRefreshIntervalTicks: 20
```

## 数据库

默认使用 SQLite，不需要额外依赖。首次启动会自动创建数据库并执行迁移。

若切换到 MariaDB/MySQL，将 `database.type` 设置为 `mariadb` 或 `mysql`，并填写对应的连接信息即可。
