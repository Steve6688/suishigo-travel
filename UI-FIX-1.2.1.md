# UI-FIX 1.2.1（对照 preview-v3/build-1.2.0）

## Bug
B1 行程 Tab 的日期条右侧被截断（D6 被切掉，D7 看不到），左右没有留白，也没有滚动吸附。
B2 账本页脚的说明文字贴着左边缘，没有内边距；页面底部也没留出底栏和安全区的空间。
B3 场景页顶栏是一整条蓝色的空玻璃条，没有标题；右侧的刷新按钮没有用处。

## 最丑的 5 处 + CSS
1. **顶栏**：去掉整条玻璃，改成左右两个独立的圆形玻璃按钮。删除刷新按钮，改为“更多”按钮或直接不放。
```css
.scene-topbar{background:none;backdrop-filter:none;border:0;box-shadow:none;padding:0 16px;}
.scene-topbar .btn{width:40px;height:40px;border-radius:50%;}
/* 按钮元素直接加 class="glass"（v3 §2） */
.scene-topbar .title{opacity:0;transition:opacity .2s;}
.scene-topbar.scrolled{ /* 滚过头图后才出现标题和玻璃底 */ }
.scene-topbar.scrolled .title{opacity:1;}
```
2. **每个 Tab 都重复一张大头图**（占 40% 屏幕）：完整头图只在“概览”Tab 显示；其他 4 个 Tab 改成紧凑的头部。
```css
.scene-hero{height:44vh;}
.scene[data-tab]:not([data-tab="overview"]) .scene-hero{height:calc(120px + env(safe-area-inset-top));}
.scene[data-tab]:not([data-tab="overview"]) .scene-hero .meta,
.scene[data-tab]:not([data-tab="overview"]) .badge{display:none;}
.scene-hero{transition:height .32s cubic-bezier(.32,.72,0,1);} /* 只在切 Tab 时触发一次 */
```
3. **首页的占位卡片**：大块空黑卡配罗盘 emoji 太廉价。改用渐变色作封面，高度减到首卡的 60%，并把“0%”圆环去掉。
```css
.scene-card.placeholder{height:180px;background:linear-gradient(135deg,#2A3442,#3A2E2A);}
.scene-card.placeholder .emoji-icon{display:none;}
.scene-card .progress-ring[data-value="0"]{display:none;}
```
4. **日期条和底栏的选中态**：现在是土黄色的实心块，显得发脏。改成浅琥珀色的玻璃胶囊。
```css
.day-strip{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 16px;scroll-padding:0 16px;}
.day-strip::-webkit-scrollbar{display:none;}
.day-chip{flex:0 0 56px;scroll-snap-align:start;}
.day-chip.active,.tabbar .pill{background:rgba(255,181,71,.16);border:1px solid rgba(255,181,71,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.18);}
.day-chip.active{color:#FFB547;}
```
5. **工具页和账本里的彩色 emoji 图标**：和液态玻璃风格冲突。改用单色线条图标（Lucide 或 Tabler，1.75px 线宽），统一放在 36px 的圆角底块里。账本里 ¥0.00 的空行把进度条和金额改成灰色。
```css
.tool-icon{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.06);color:#FFB547;display:grid;place-items:center;}
.tool-icon svg{width:20px;height:20px;stroke-width:1.75;}
.ledger-row.empty .amount{color:rgba(245,247,250,.38);}
.ledger-row.empty .bar{opacity:.3;}
.ledger-add{background:var(--accent-soft);color:var(--accent);border:1px solid rgba(232,137,12,.35);} /* 浅色主题，见 UI-SPEC-v3 §7 */
.page{padding-bottom:calc(64px + 12px + env(safe-area-inset-bottom) + 16px);}
.page-footnote{padding:12px 20px;color:rgba(245,247,250,.5);font-size:12px;text-align:center;}
```

## 验收
- 7 个日期在宽 412px 的屏幕上可以横向滑动，并且每个日期按钮都能完整吸附对齐。
- 除“概览”外，其余 Tab 首屏露出的内容不少于 70%。
- 全 App 不再出现彩色 emoji 图标，也没有实心的大黄色块。
