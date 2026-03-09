---
title: 假人系统
createTime: 2025/06/23 13:35:52
permalink: /core/DeerFoliaPlus/features/fakeplayer/
---

引入了来自 Leaves/Lumina 的假人（FakePlayer/Bot）系统，可以在服务器中创建假人来模拟玩家行为，适用于挂机、加载区块等场景。

## 使用方法

启用假人功能后，可以通过 `/bot` 命令来管理假人。

## 配置参考

```yaml
# config/deer-folia-plus.yml
fake-player:
   enable: false
   always-send-data: true
   spawn-phantom: true
   skip-sleep-check: true
   invulnerable: true
   prefix: "BOT_"
   suffix: ""
   resident-bot: true
   cache-skin: true
   regen-amount: 0.0
   amount-per-player: 2
```

- `enable`：是否启用假人功能；
- `always-send-data`：是否始终向客户端发送假人数据，即使玩家不在线也会发送；
- `spawn-phantom`：是否为假人生成幻翼，设为 `true` 时假人会像真实玩家一样被幻翼攻击；
- `skip-sleep-check`：是否跳过假人的睡眠检查，设为 `true` 时服务器会忽略假人的睡眠状态；
- `invulnerable`：是否使假人无敌，设为 `true` 时假人不会受到任何伤害（也不会被怪物仇恨）；
- `prefix`：假人名称前缀，默认为 `BOT_`，前缀计入名称长度，总长度不超过 16 个字符；
- `suffix`：假人名称后缀；
- `resident-bot`：是否在服务器关闭前自动保存假人并在启动时自动加载；
- `cache-skin`：是否缓存假人皮肤；
- `regen-amount`：假人每秒回复的生命值，默认为 `0.0` 表示不回复；
- `amount-per-player`：每个真实玩家可以创建的假人数量；
