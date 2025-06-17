---
title: 管理员说明
createTime: 2025/06/17 19:01:45
permalink: /amusing/LiteWorldEdit/install/
---

## 支持版本

- 1.20.1+ (Folia、Paper)

## 安装方法

1. 将插件放入服务器# 标题的 `plugins` 目录下
2. 重启服务器
3. 在 `plugins/LiteWorldEdit/config.yml` 中配置
4. 控制台或OP输入 `/lwe reload` 重载配置

## 配置文件参考

```yaml
# 选区最大尺寸
maximum-size:
  x: 64
  y: 64
  z: 64

# 任务执行速度 1 表示每tick执行一次
multiplier: 1

# 是否启用掉落物（不建议，可能因为过多掉落物卡服）
drop-items: false

debug: false
```

