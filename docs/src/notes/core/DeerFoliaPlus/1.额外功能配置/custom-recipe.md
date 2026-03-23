---
title: 自定义合成配方
createTime: 2026/03/23 13:35:52
permalink: /core/DeerFoliaPlus/features/custom-recipe/
---

DeerFoliaPlus 支持通过 YAML 配置文件添加自定义合成配方，覆盖所有原版工作方块类型。

## 启用功能

在 `config/deer-folia-plus.yml` 中启用自定义合成：

```yaml
custom-recipe:
  enabled: true
```

服务器启动后会自动在 `config/custom-recipes.yml` 生成配方配置文件（含注释示例）。  
修改配方后需要**重启服务器**使更改生效。

---

## 支持的合成类型

| `type` 值 | 对应工作方块 | 说明 |
|---|---|---|
| `shaped` | 合成台 / 背包 2×2 合成区 | 有序合成（配方有固定形状） |
| `shapeless` | 合成台 / 背包 2×2 合成区 | 无序合成（只要材料齐全即可） |
| `smelting` | 熔炉 (Furnace) | 普通熔炼 |
| `blasting` | 高炉 (Blast Furnace) | 矿物快速熔炼 |
| `smoking` | 烟熏炉 (Smoker) | 食物快速烹饪 |
| `campfire_cooking` | 营火 (Campfire) | 营火烹饪 |
| `stonecutting` | 切石机 (Stonecutter) | 切割配方 |

---

## 配置文件结构

配方文件位于 `config/custom-recipes.yml`，基本结构如下：

```yaml
recipes:
  配方ID:
    type: 合成类型
    # ... 类型特定字段
    result:
      item: minecraft:物品ID
      amount: 数量
      # ... 可选的自定义属性
```

每个配方由唯一的 **配方ID** 标识（英文小写、下划线），配方ID 会被注册到 `deerfoliaplus:配方ID` 命名空间。

---

## 产物 (result) 属性

所有合成类型共享相同的产物定义格式：

```yaml
result:
  item: minecraft:diamond_sword     # [必填] 物品 ID
  amount: 1                         # [可选] 数量，默认 1
  name: "&6黄金之剑"                # [可选] 自定义名称，支持颜色代码
  custom-id: golden_sword           # [可选] 隐藏自定义 ID
  enchantments:                     # [可选] 原版附魔
    sharpness: 5
    unbreaking: 3
  nbt:                              # [可选] 自定义 NBT 数据
    MyCustomTag: "value"
    Tier: 3
```

### 自定义名称 (`name`)

支持使用 `&` 或 `§` 作为颜色代码前缀：

| 代码 | 颜色 | 代码 | 颜色 |
|---|---|---|---|
| `&0` | 黑色 | `&8` | 深灰 |
| `&1` | 深蓝 | `&9` | 蓝色 |
| `&2` | 深绿 | `&a` | 绿色 |
| `&3` | 深青 | `&b` | 青色 |
| `&4` | 深红 | `&c` | 红色 |
| `&5` | 紫色 | `&d` | 粉色 |
| `&6` | 金色 | `&e` | 黄色 |
| `&7` | 灰色 | `&f` | 白色 |
| `&l` | **粗体** | `&o` | *斜体* |
| `&n` | 下划线 | `&m` | ~~删除线~~ |
| `&k` | 混淆字符 | `&r` | 重置格式 |

示例：`"&6&l黄金之剑"` → 金色粗体

### 附魔 (`enchantments`)

使用原版附魔 ID（不含 `minecraft:` 前缀），值为附魔等级：

```yaml
enchantments:
  sharpness: 5          # 锋利 V
  unbreaking: 3         # 耐久 III
  looting: 3            # 抢夺 III
  efficiency: 5         # 效率 V
  fortune: 3            # 时运 III
  protection: 4         # 保护 IV
  fire_aspect: 2        # 火焰附加 II
  silk_touch: 1         # 精准采集 I
  mending: 1            # 经验修补 I
  knockback: 2          # 击退 II
  sweeping_edge: 3      # 横扫之刃 III
  power: 5              # 力量 V（弓）
  infinity: 1           # 无限 I（弓）
  # ... 支持所有原版附魔
```

> 等级可以超过原版限制（如 `sharpness: 10`）。

### 自定义 NBT (`nbt`)

在产物的 `CustomData` 组件中存储自定义 NBT 键值对，支持的数据类型：

| YAML 值类型 | NBT 类型 | 示例 |
|---|---|---|
| 字符串 | TagString | `MyTag: "hello"` |
| 整数 | TagInt | `Tier: 3` |
| 浮点数 | TagDouble | `Damage: 1.5` |
| 布尔值 | TagBoolean | `IsCustom: true` |
| 长整数 | TagLong | `Timestamp: 1234567890` |

```yaml
result:
  item: minecraft:compass
  name: "&b追踪指南针"
  custom-id: tracker
  nbt:
    TrackingType: "player"
    TrackingRange: 256
    Active: true
```

> NBT 数据存储在物品的 `minecraft:custom_data` 组件中，对玩家不可见。  
> 自定义 ID (`custom-id`) 也是通过同一组件实现的，key 为 `DeerFoliaPlus.CustomItemId`，两者不冲突。

---

## 隐藏自定义 ID 系统

`custom-id` 是本功能的核心机制，用于区分"外观相同但实际不同"的物品。

### 工作原理

- **产物端**：在 `result` 中设置 `custom-id: xxx`，合成出的物品会携带一个隐藏标记
- **原料端**：在 `ingredients` 中设置 `custom-id: xxx`，只有携带该标记的物品才会被匹配
- 隐藏 ID 存储在物品的 `CustomData` 组件中（key: `DeerFoliaPlus.CustomItemId`），**玩家在游戏中完全不可见**

### 典型用法：链式合成

```yaml
recipes:
  # 第一步：4 石头 -> 顽石（外观是石头，但携带隐藏ID）
  stub_stone:
    type: shaped
    pattern:
      - "SS"
      - "SS"
    ingredients:
      S:
        item: minecraft:stone
    result:
      item: minecraft:stone
      amount: 1
      name: "&6顽石"
      custom-id: stub_stone

  # 第二步：4 顽石 -> 超级石头（只有顽石才能参与，普通石头不行）
  super_stone:
    type: shaped
    pattern:
      - "SS"
      - "SS"
    ingredients:
      S:
        item: minecraft:stone
        custom-id: stub_stone    # 要求必须是"顽石"
    result:
      item: minecraft:stone
      amount: 1
      name: "&c超级石头"
      custom-id: super_stone
      enchantments:
        unbreaking: 3
```

在上述例子中：
- 4 个普通石头 → 1 个顽石（看起来是石头，但名称不同且携带 `stub_stone` 标记）
- 4 个顽石 → 1 个超级石头（普通石头无法替代，必须是前一步合成的顽石）

---

## 各合成类型详细配置

### 有序合成 (`shaped`)

在合成台或背包 2×2 区域中使用，材料必须按固定图案放置。

```yaml
配方ID:
  type: shaped
  group: ""                # [可选] 配方组（配方书分组用）
  category: misc           # [可选] 配方分类：building / redstone / equipment / misc
  pattern:                 # [必填] 合成图案（最大 3x3，空格表示空位）
    - "ABA"
    - " C "
    - "ABA"
  ingredients:             # [必填] 图案中字符对应的物品
    A:
      item: minecraft:iron_ingot
    B:
      item: minecraft:diamond
      custom-id: refined_diamond   # [可选] 要求特定自定义物品
    C:
      item: minecraft:stick
  result:
    item: minecraft:diamond_pickaxe
    amount: 1
    name: "&b精铸钻石镐"
    custom-id: refined_pickaxe
    enchantments:
      efficiency: 5
      unbreaking: 3
```

**图案规则：**
- 使用单字符代表各材料，空格 ` ` 表示空位
- 最大 3 行 × 3 列，多余的空行/空列会被自动裁剪
- 2×2 的图案可在背包合成区和合成台中使用
- 配方支持左右镜像匹配

**原料格式：**

```yaml
# 简写格式（不需要 custom-id 时）
ingredients:
  S: minecraft:stone

# 完整格式（需要 custom-id 时）
ingredients:
  S:
    item: minecraft:stone
    custom-id: stub_stone
```

### 无序合成 (`shapeless`)

不需要固定排列顺序，只要所有材料放入合成区即可。

```yaml
配方ID:
  type: shapeless
  group: ""
  category: misc           # building / redstone / equipment / misc
  ingredients:             # [必填] 材料列表
    - item: minecraft:diamond_sword
    - item: minecraft:nether_star
    - minecraft:gold_ingot         # 简写格式
  result:
    item: minecraft:diamond_sword
    amount: 1
    name: "&d魔法剑"
    custom-id: magic_sword
    enchantments:
      sharpness: 5
      looting: 3
```

**原料格式：**

```yaml
# 列表中可混用两种格式
ingredients:
  # 完整格式（支持 custom-id）
  - item: minecraft:stone
    custom-id: stub_stone
  # 简写格式
  - minecraft:gold_ingot
```

### 熔炉熔炼 (`smelting`)

```yaml
配方ID:
  type: smelting
  group: ""
  category: misc           # food / blocks / misc
  ingredient:              # [必填] 输入材料（单个物品）
    item: minecraft:coal
    custom-id: magic_coal  # [可选] 要求特定自定义物品
  result:
    item: minecraft:diamond
    amount: 1
  experience: 1.0          # [可选] 经验奖励，默认 0
  cooking-time: 200        # [可选] 烹饪时间（tick），默认 200（10 秒）
```

**简写原料格式（不需要 custom-id 时）：**

```yaml
ingredient: minecraft:coal
```

### 高炉冶炼 (`blasting`)

配置格式与 `smelting` 完全相同，仅 `type` 不同。高炉速度为熔炉的 2 倍，因此 `cooking-time` 通常设为 100。

```yaml
配方ID:
  type: blasting
  ingredient:
    item: minecraft:raw_copper
  result:
    item: minecraft:copper_ingot
    amount: 2
    name: "&6精炼铜"
    custom-id: refined_copper
  experience: 0.7
  cooking-time: 100
```

### 烟熏炉烹饪 (`smoking`)

配置格式与 `smelting` 完全相同，仅 `type` 不同。烟熏炉主要用于食物，速度为熔炉的 2 倍。

```yaml
配方ID:
  type: smoking
  ingredient:
    item: minecraft:golden_apple
  result:
    item: minecraft:enchanted_golden_apple
    amount: 1
    name: "&e超级金苹果"
    custom-id: super_golden_apple
  experience: 2.0
  cooking-time: 400
```

### 营火烹饪 (`campfire_cooking`)

配置格式与 `smelting` 完全相同，仅 `type` 不同。营火不消耗燃料，默认烹饪时间较长（600 tick = 30 秒）。

```yaml
配方ID:
  type: campfire_cooking
  ingredient:
    item: minecraft:porkchop
  result:
    item: minecraft:cooked_porkchop
    amount: 1
    name: "&6美味猪排"
    custom-id: gourmet_porkchop
    nbt:
      Quality: "premium"
  experience: 0.35
  cooking-time: 600
```

### 切石机 (`stonecutting`)

```yaml
配方ID:
  type: stonecutting
  group: ""
  ingredient:              # [必填] 输入材料
    item: minecraft:stone
    custom-id: stub_stone  # [可选]
  result:
    item: minecraft:stone_bricks
    amount: 4
```

> 切石机配方没有 `experience` 和 `cooking-time` 字段。

---

## 完整示例

以下是一个包含多种类型配方的完整配置文件示例：

```yaml
recipes:

  # ======== 合成台 ========

  # 有序合成：自定义工具
  magic_pickaxe:
    type: shaped
    pattern:
      - "DDD"
      - " S "
      - " S "
    ingredients:
      D:
        item: minecraft:diamond
      S:
        item: minecraft:stick
    result:
      item: minecraft:diamond_pickaxe
      amount: 1
      name: "&b&l魔法钻石镐"
      custom-id: magic_pickaxe
      enchantments:
        efficiency: 5
        unbreaking: 3
        fortune: 3
      nbt:
        CreatedBy: "custom_recipe"
        Tier: 1

  # 无序合成：升级工具（需要前一步的产物）
  magic_pickaxe_v2:
    type: shapeless
    ingredients:
      - item: minecraft:diamond_pickaxe
        custom-id: magic_pickaxe
      - item: minecraft:nether_star
    result:
      item: minecraft:diamond_pickaxe
      amount: 1
      name: "&d&l终极钻石镐"
      custom-id: magic_pickaxe_v2
      enchantments:
        efficiency: 10
        unbreaking: 5
        fortune: 5
        mending: 1
      nbt:
        CreatedBy: "custom_recipe"
        Tier: 2

  # ======== 熔炉 ========

  crystal_from_glass:
    type: smelting
    ingredient:
      item: minecraft:glass
    result:
      item: minecraft:prismarine_crystals
      amount: 2
      name: "&b水晶"
      custom-id: crystal
    experience: 0.5
    cooking-time: 300

  # ======== 高炉 ========

  hardened_iron:
    type: blasting
    ingredient:
      item: minecraft:iron_ingot
    result:
      item: minecraft:iron_ingot
      amount: 1
      name: "&7硬化铁锭"
      custom-id: hardened_iron
    experience: 0.8
    cooking-time: 150

  # ======== 烟熏炉 ========

  golden_steak:
    type: smoking
    ingredient:
      item: minecraft:cooked_beef
    result:
      item: minecraft:cooked_beef
      amount: 1
      name: "&6黄金牛排"
      custom-id: golden_steak
      nbt:
        Nutrition: "enhanced"
    experience: 1.0
    cooking-time: 200

  # ======== 营火 ========

  smoked_salmon:
    type: campfire_cooking
    ingredient:
      item: minecraft:salmon
    result:
      item: minecraft:cooked_salmon
      amount: 1
      name: "&6烟熏三文鱼"
      custom-id: smoked_salmon
    experience: 0.35
    cooking-time: 600

  # ======== 切石机 ========

  fancy_bricks:
    type: stonecutting
    ingredient:
      item: minecraft:stone
    result:
      item: minecraft:chiseled_stone_bricks
      amount: 2
      name: "&f精雕石砖"
      custom-id: fancy_bricks
```

---

## 注意事项

1. **配方 ID 唯一性**：每个配方的 ID 必须唯一，建议使用英文小写加下划线命名
2. **物品 ID 格式**：使用完整的 Minecraft 物品 ID，如 `minecraft:stone`、`minecraft:diamond_sword`
3. **自定义 ID 匹配**：设置了 `custom-id` 的原料只匹配携带相同隐藏 ID 的物品，普通物品不会被错误匹配
4. **优先级**：含有 `custom-id` 要求的配方优先级高于不含的，避免冲突
5. **背包合成**：2×2 的有序合成图案和不超过 4 个材料的无序合成可在背包合成区使用
6. **配方冲突**：如果自定义配方与原版配方使用相同的材料和图案，自定义配方会优先匹配
7. **服务器重启**：修改 `custom-recipes.yml` 后需要重启服务器才能生效
8. **NBT 与 custom-id 共存**：`nbt` 和 `custom-id` 可以同时使用，两者都存储在 `CustomData` 组件中，互不干扰
