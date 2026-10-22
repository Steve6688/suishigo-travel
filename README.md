# 随时Go（suishigo-travel）

多场景自驾旅行攻略 App（Android，Capacitor 7），浅色主题 + iOS 风格悬浮液态玻璃界面。当前版本 **1.2.9**（versionCode 12）。

## 功能
- 首页场景卡片：青甘大环线、川西环线、云南大理丽江、北疆环线
- 每个场景 5 个 Tab：概览 / 行程（按天）/ 美食 / 清单 / 工具（预算、天气、门票、地图外跳、汇率）
- 悬浮玻璃底栏与顶栏，圆形返回键 + 居中标题胶囊
- 手势：Tab 与首页底栏页左右滑动切换；全局左边缘右滑返回
- 添加场景 / 重新生成：输入目的地，调用 DeepSeek API 生成同结构攻略（Key 在「我」页填写，仅存本机）；封面取自 Wikimedia Commons；结果本地缓存，失败保留旧版

## 目录
| 路径 | 说明 |
|---|---|
| `www/` | 前端页面（HTML/CSS/JS），`www/data/scenes/*.json` 为场景数据，`www/images/` 图片（来源见 `CREDITS.txt`） |
| `android/` | Capacitor 生成的 Android 工程 |
| `UI-SPEC-v3.md` | 界面与动效规范（§7 浅色主题，§8 手势参数） |
| `RESEARCH-MVP-v3.md`、`PLAN-ADD-SCENE-1.2.8.md` | 产品需求与添加场景方案 |
| `IMAGE-SPEC.md` | 图片选取规范 |

## 构建
```bash
npm install
npx cap sync android
cd android && ./gradlew assembleRelease
```
签名：在 `keystore/keystore.properties` 写入 `storeFile / storePassword / keyAlias / keyPassword`（该目录已在 `.gitignore` 中，**不入库**）。包名 `com.qinggan.travel`。

## 说明
个人非商用项目，不上架。
