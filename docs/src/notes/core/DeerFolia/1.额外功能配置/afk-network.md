---
title: AFK 网络优化
createTime: 2026/04/24 10:00:00
permalink: /core/DeerFolia/features/afk-network/
---

## 工作原理

当玩家处于闲置状态超过设定阈值后，服务器将停止向该玩家发送「高流量但非必要」的数据包。同时又不会终止相关tick的运行。
这些数据包包括区块更新、实体数据和世界效果等，而与玩家交互相关的 UI 更新（如计分板和 Tab 列表）则可以通过配置选择性保留。这样可以显著降低服务器对 AFK 玩家网络资源的消耗，同时在玩家返回时通过重新同步机制确保客户端状态的准确性。

### 抑制的数据包类别

- `chunk-stream`：新的区块数据和光照更新。
- `block-updates`：频繁的方块变化或动画。
- `entity-stream`：实体的移动、生成和数据更新。
- `world-effects`：粒子效果、声音和等级事件。
- `ui-stream`：Boss 栏、计分板和 Tab 列表更新。

当玩家重新恢复活跃时，服务器会根据配置执行「重新同步」，重新发送附近的区块和追踪的实体，以确保客户端状态是最新的。系统还会记录 AFK 期间节省的流量，并在玩家返回时进行提示。

## 配置项

```yaml
# config/deer-folia.yml
afk-network-optimization:
  enabled: true
  # 判定为 AFK 的闲置时间（tick），1200 为 1 分钟
  afk-threshold-ticks: 1200
  # 进入 AFK 模式时的消息
  afk-enter-message: "§7[DeerFolia] §a你已进入 AFK 模式，网络消耗已降至最低。"
  # 返回时的消息，支持 {saved_traffic} 和 {saved_bandwidth} 占位符
  afk-exit-message: "§7[DeerFolia] §a欢迎回来！AFK 期间为你节省了 {saved_traffic} 流量。"
  # 仅旋转视角是否计为活跃状态
  count-look-changes-as-activity: true
  # 恢复活跃后是否重新同步周围区块和实体
  resync-on-resume: true
  # 是否开启带宽节省统计
  stats-enabled: true
  # 不进行抑制的数据包类别白名单，例如 ["ui-stream"]
  suppression-whitelist-categories: []
  # 单个类别抑制的数据量上限（字节），达到后强制执行一次该类别的同步，-1 为不限制
  max-suppressed-bytes-before-category-resync: -1
```

- `enabled`：是否启用 AFK 网络优化；
- `afk-threshold-ticks`：玩家闲置多久后进入 AFK 模式；
- `count-look-changes-as-activity`：如果设为 `false`，仅转动视角而不移动位置仍会被判定为 AFK；
- `resync-on-resume`：建议保持开启，以防止玩家返回后看到虚假的世界状态；
- `suppression-whitelist-categories`：如果你希望在 AFK 时仍能即时看到计分板或 Tab 列表更新，可以将 `ui-stream` 加入此列表。

> 此优化与低层级的 `network-optimizations`（VarInt 和帧编码优化）互补。前者减少每个数据包的成本，而 AFK 优化则通过对闲置玩家过滤数据包来减少数据包总量。
