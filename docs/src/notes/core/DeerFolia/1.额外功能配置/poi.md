---
title: POI 优化
createTime: 2025/06/23 13:42:00
permalink: /core/DeerFolia/features/poi/
---

通过降低 POI（兴趣点）相关操作的频率，减少了村民等实体的 CPU 占用，尤其在村民较多的场景下效果显著。

## 优化的组件

- **Villager.java** — 为铁傀儡生成检查添加了速率限制，引入玩家距离检查以避免不必要的计算
- **SecondaryPoiSensor.java** — 降低 POI 扫描频率，跳过不需要次要 POI 的职业扫描
- **ValidateNearbyPoi.java** — 为 POI 验证检查添加速率限制，防止冗余操作
- **GolemSensor.java** — 如果附近没有玩家则跳过铁傀儡检测检查，减少不必要的计算

## 配置项

```yaml
# config/deer-folia.yml
poi-optimizations:
   enabled: true
   golem-spawn-check-interval: 200
   secondary-poi-sensor-interval: 80
   village-distance-cache-duration: 100
   golem-spawn-player-distance-limit: 128
```

- `enabled`：是否启用 POI 优化；
- `golem-spawn-check-interval`：村民铁傀儡生成检查的最小间隔（tick），默认 200；
- `secondary-poi-sensor-interval`：次要 POI 传感器扫描的最小间隔（tick），默认 80；
- `village-distance-cache-duration`：村庄距离计算缓存的持续时间（tick），默认 100；
- `golem-spawn-player-distance-limit`：当村民与最近玩家距离超过此值时跳过铁傀儡生成检查，默认 128；

> 默认配置适用于大多数场景。如果服务器村民数量较多导致 TPS 下降，可以适当增大各项间隔参数。
> 如果发现铁傀儡生成异常，可以尝试减小 `golem-spawn-check-interval` 或增大 `golem-spawn-player-distance-limit`。
