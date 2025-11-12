# 🎨 AutoHub AI - Гайд по компонентам

## 📱 Структура страницы

```
┌─────────────────────────────────────────────┐
│                  HEADER                     │ ← Fixed, backdrop blur
│  [Logo]     [Меню]      [Опубликовать]     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│              HERO SECTION                   │
│       [Powered by AI badge]                 │
│                                             │
│          AutoHub AI маркетплейс             │
│             автозапчастей                   │
│                                             │
│    [Поисковая строка с glow эффектом]       │
│    [Quick search tags]                      │
│                                             │
│    [1000+] [99%] [24/7]                     │
│     Stats  Stats Stats                      │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│            ПОПУЛЯРНЫЕ БРЕНДЫ                │
│                                             │
│  [🅰️]  [🅱️]  [⭐]  [🔴]  [🔵]  [🏁]        │
│  Audi  BMW  Merc  Toyo   VW   Ford         │
│                                             │
│  [⚫]  [🅷]  [🔷]  [🇭]  [🇰]  [🔶]          │
│  Niss  Honda Mazda Hyun  Kia  Rena         │
│                                             │
│      [Показать все бренды →]                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           ПОЧЕМУ AUTOHUB AI                 │
│                                             │
│  [🤖]        [⚡]        [🔍]                │
│  AI          Без         Умный              │
│  обогащ.     регистр.    поиск              │
│                                             │
│  [📱]        [🔒]        [💎]                │
│  Mobile      Модерация   Бесплатно          │
│  First                                      │
│                                             │
│    ┌───────────────────────────────┐        │
│    │      ГОТОВЫ НАЧАТЬ?           │        │
│    │  [✨ Опубликовать]  [🔍 Каталог]│       │
│    │   5 мин | 0₽ | AI             │        │
│    └───────────────────────────────┘        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                 FOOTER                      │
│                                             │
│  AutoHub AI     Платформа  Компания         │
│  [Stats]        - Главная  - О нас          │
│                 - Каталог  - Контакты       │
│                                             │
│  [Newsletter подписка]                      │
│                                             │
│  © 2025  [Соцсети]  [RU]                    │
└─────────────────────────────────────────────┘

      [FAB] ← Floating Action Button
        ✨
```

---

## 🎯 Компоненты в деталях

### 1. Header

**Состояния:**
```
Transparent (top)     → Opaque (scrolled)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg-transparent        → bg-dark-bg/95
no shadow             → shadow-lg
```

**Анимации:**
- Logo: scale на hover (1.05)
- AI текст: gradient с animation
- Пульсирующая точка на logo
- Nav links: underline slide
- CTA button: gradient shift + glow
- Burger: rotate animation (☰ → ✕)

---

### 2. Hero Section

**Элементы:**
```
1. Badge [Powered by AI]
   ├─ Пульсирующая точка
   └─ Backdrop blur

2. Заголовок (3 строки)
   ├─ "AutoHub" (белый)
   ├─ "AI маркетплейс" (gradient + animate)
   └─ "автозапчастей" (белый)

3. Подзаголовок
   ├─ Основной текст
   └─ "Публикуйте бесплатно" (оранжевый)

4. Поисковая строка
   ├─ Glow на focus
   ├─ Scale на focus (1.05)
   ├─ Иконка 🔍
   └─ Кнопка "Найти" (gradient)

5. Quick tags
   ├─ [Двигатель]
   ├─ [Коробка передач]
   └─ [Фары]

6. Stats
   ├─ 1000+ Запчастей
   ├─ 99% AI точность
   └─ 24/7 Доступность
```

**Фон:**
- Gradient от темного к светлому
- 3 плавающих круга (animate-float)
- Radial gradient overlay

---

### 3. Brand Cards

**Сетка:**
```
Mobile:  2 колонки
Tablet:  3 колонки
Desktop: 6 колонок
```

**Hover эффект:**
```
Normal              Hover
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
scale(1)      →     scale(1.02)
translateY(0) →     translateY(-8px)
border-gray   →     border-orange
no shadow     →     glow shadow
no badge      →     badge (20+)
```

**Анимации:**
- Staggered появление (delay по индексу)
- Иконка scale + rotate на hover
- Animated ring вокруг иконки
- Gradient glow на hover

---

### 4. Info Blocks

**6 карточек преимуществ:**
```
🤖 AI обогащение       ⚡ Без регистрации
🔍 Умный поиск         📱 Mobile First
🔒 Модерация           💎 Бесплатно
```

**Каждая карточка:**
- Gradient background на hover (разные цвета)
- Иконка scale(1.1) + rotate(6deg)
- Title меняет цвет на оранжевый
- Декоративное кольцо scale(1.5)

**CTA секция:**
- Animated gradient фон
- Две кнопки (Primary + Secondary)
- Trust indicators (5 мин, 0₽, AI)

---

### 5. Footer

**5-колоночная структура:**
```
┌─────────────┬──────┬──────┬──────┐
│   AutoHub   │ Плат │ Комп │ Подд │
│     AI      │ форм │  ани │ ержк │
│             │  а   │   я  │  а   │
│ [Stats 3x]  │      │      │      │
└─────────────┴──────┴──────┴──────┘
```

**Newsletter:**
- Стеклянный эффект (backdrop-blur)
- Email input + кнопка
- Gradient кнопка с hover

**Соцсети:**
- 4 иконки (Telegram, WA, IG, VK)
- Разные цвета hover
- Scale(1.1) на hover

---

### 6. Floating Action Button

**Состояния:**
```
Scroll < 100px         Scroll > 100px
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
opacity: 0             opacity: 1
translateY(16px)       translateY(0)
pointer-events: none   pointer-events: auto
```

**Mobile:**
- Круглая кнопка (64x64px)
- Только иконка ✨
- Pulsing ring animation
- Bottom-right позиция

**Desktop:**
- Расширенная кнопка
- Иконка + текст
- Gradient фон
- Hover: scale + glow

---

## 🎨 Дизайн-токены

### Colors
```css
--primary-orange:       #D97757
--primary-orange-hover: #C46847
--dark-bg:              #1A1A1A
--dark-bg-secondary:    #252525
--dark-bg-tertiary:     #2D2D2D
--text-primary:         #FFFFFF
--text-secondary:       #B0B0B0
--text-muted:           #707070
```

### Typography
```css
--font-family: 'Inter', sans-serif

/* Размеры */
--text-xs:   12px
--text-sm:   14px
--text-base: 16px
--text-lg:   18px
--text-xl:   20px
--text-2xl:  24px
--text-3xl:  30px
--text-4xl:  36px
--text-5xl:  48px
--text-6xl:  60px
--text-7xl:  72px

/* Веса */
--font-light:     300
--font-regular:   400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
--font-extrabold: 800
```

### Spacing
```css
--spacing-xs:  4px
--spacing-sm:  8px
--spacing-md:  16px
--spacing-lg:  24px
--spacing-xl:  32px
--spacing-2xl: 48px
--spacing-3xl: 64px
--spacing-4xl: 96px
```

### Border Radius
```css
--radius-sm:  8px
--radius-md:  12px
--radius-lg:  16px
--radius-xl:  20px
--radius-2xl: 24px
--radius-3xl: 32px
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
--shadow-md:   0 4px 6px rgba(0,0,0,0.1)
--shadow-lg:   0 10px 15px rgba(0,0,0,0.1)
--shadow-xl:   0 20px 25px rgba(0,0,0,0.15)
--shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)
--shadow-glow: 0 0 40px rgba(217,119,87,0.5)
```

### Animations
```css
/* Durations */
--duration-fast:   150ms
--duration-normal: 200ms
--duration-slow:   300ms
--duration-slower: 500ms

/* Easings */
--ease-in:     cubic-bezier(0.4, 0, 1, 1)
--ease-out:    cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🎬 Ключевые анимации

### 1. Fade Up
```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
**Использование:** Появление контента

---

### 2. Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
```
**Использование:** Декоративные круги

---

### 3. Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(217,119,87,0.3); }
  50%      { box-shadow: 0 0 40px rgba(217,119,87,0.5); }
}
```
**Использование:** Glow эффекты

---

### 4. Gradient Shift
```css
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```
**Использование:** Анимированные градиенты

---

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────┐
│  Mobile (< 640px)                       │
│  - 1-2 колонки                          │
│  - Вертикальная компоновка              │
│  - FAB круглая                          │
│  - Burger menu                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tablet (640-1024px)                    │
│  - 2-3 колонки                          │
│  - Смешанная компоновка                 │
│  - FAB круглая                          │
│  - Burger menu или полное               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Desktop (> 1024px)                     │
│  - 3-6 колонок                          │
│  - Горизонтальная компоновка            │
│  - FAB расширенная                      │
│  - Полное меню                          │
└─────────────────────────────────────────┘
```

---

## ✨ Особые эффекты

### Glass Effect (Backdrop Blur)
```css
.glass-effect {
  background: rgba(45, 45, 45, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### Gradient Text
```css
.text-gradient {
  background: linear-gradient(135deg, #D97757 0%, #E8A87C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Card Hover
```css
.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(217,119,87,0.2);
}
```

---

## 🎯 Интерактивные элементы

### Кнопки

**Primary:**
```
[✨ Опубликовать]
bg: gradient orange → orange-hover
hover: scale(1.05) + glow shadow
```

**Secondary:**
```
[🔍 Смотреть каталог]
border: white/10 → orange/50
hover: scale(1.05)
```

**Ghost:**
```
[Показать все →]
bg: transparent
hover: text-orange
```

---

### Inputs

**Search:**
```
height: 64px (mobile) | 72px (desktop)
focus: border-orange + glow + scale(1.05)
icon: встроенная 🔍
button: gradient с hover
```

**Newsletter:**
```
height: 48px
focus: border-orange/50
button: gradient с scale
```

---

## 🚀 Performance Tips

### Оптимизации:
1. ✅ CSS animations используют `transform` и `opacity` (GPU)
2. ✅ `will-change` для интенсивных анимаций
3. ✅ `contain: layout` для изолированных компонентов
4. ✅ Lazy loading для изображений
5. ✅ Debounced scroll handlers

### Метрики:
- First Paint: < 1s
- Time to Interactive: < 2.5s
- Lighthouse Mobile: 85+

---

## 📚 Документация

Полная документация доступна в:
- [design-implementation.md](./design-implementation.md) - Детали реализации
- [prd.md](./prd.md) - Product Requirements Document

---

**🎉 Готово к использованию!**
