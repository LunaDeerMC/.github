---
title: 实体节流
createTime: 2025/06/23 13:39:09
permalink: /core/DeerFolia/features/throttling/
---

引入了 Kaiiju 的实体节流机制，提升了服务器的性能。

```yaml
# config/deer-folia.yml
kaiiju-entity-throttling: true
```

- `kaiiju-entity-throttling`：是否启用 Kaiiju 实体节流机制；

```yaml
# config/kaiiju-entity-throttling.yml
ZombifiedPiglin:
   limit: 1000
   removal: 3000
```

- `limit`：实体数量限制，超过该数量后实体每 3 tick 才会被更新一次；
- `removal`：实体移除限制，超过该数量后实体最先生成的实体会被逐步移除；

## 可用的实体类型包括

AbstractArrow, AbstractBoat, AbstractChestBoat, AbstractChestedHorse, AbstractFish, AbstractGolem, AbstractHorse, AbstractHurtingProjectile, AbstractIllager, AbstractMinecart, AbstractMinecartContainer, AbstractPiglin, AbstractSchoolingFish, AbstractSkeleton, AbstractVillager, AbstractWindCharge, AgeableMob, AgeableWaterCreature, Allay, AmbientCreature, Animal, AreaEffectCloud, Armadillo, ArmorStand, Arrow, Axolotl, Bat, Bee, Blaze, BlockAttachedEntity, BlockDisplay, Boat, Bogged, Breeze, BreezeWindCharge, Camel, Cat, CaveSpider, ChestBoat, ChestRaft, Chicken, Cod, Cow, Creaking, Creeper, Display, Dolphin, Donkey, DragonFireball, Drowned, ElderGuardian, EndCrystal, EnderDragon, EnderDragonPart, EnderMan, Endermite, Entity, Evoker, EvokerFangs, ExperienceOrb, EyeOfEnder, FallingBlockEntity, Fireball, FireworkRocketEntity, FishingHook, FlyingMob, Fox, Frog, Ghast, Giant, GlowItemFrame, GlowSquid, Goat, Guardian, HangingEntity, Hoglin, Horse, Husk, Illusioner, Interaction, IronGolem, ItemDisplay, ItemEntity, ItemFrame, LargeFireball, LeashFenceKnotEntity, LightningBolt, LivingEntity, Llama, LlamaSpit, MagmaCube, Marker, Minecart, MinecartChest, MinecartCommandBlock, MinecartFurnace, MinecartHopper, MinecartSpawner, MinecartTNT, Mob, Monster, Mule, MushroomCow, Ocelot, OminousItemSpawner, Painting, Panda, Parrot, PathfinderMob, PatrollingMonster, Phantom, Pig, Piglin, PiglinBrute, Pillager, Player, PolarBear, PrimedTnt, Projectile, Pufferfish, Rabbit, Raft, Raider, Ravager, Salmon, Sheep, ShoulderRidingEntity, Shulker, ShulkerBullet, Silverfish, Skeleton, SkeletonHorse, Slime, SmallFireball, Sniffer, SnowGolem, Snowball, SpectralArrow, SpellcasterIllager, Spider, Squid, Stray, Strider, Tadpole, TamableAnimal, TextDisplay, ThrowableItemProjectile, ThrowableProjectile, ThrownEgg, ThrownEnderpearl, ThrownExperienceBottle, ThrownPotion, ThrownTrident, TraderLlama, TropicalFish, Turtle, VehicleEntity, Vex, Villager, Vindicator, WanderingTrader, Warden, WaterAnimal, WindCharge, Witch, WitherBoss, WitherSkeleton, WitherSkull, Wolf, Zoglin, Zombie, ZombieHorse, ZombieVillager, ZombifiedPiglin

