export const products = [
  {
    id: "fridge-coolpro-x5",
    name: "CoolPro X5",
    category: "Холодильники",
    brand: "CoolPro",
    price: 72990,
    currency: "RUB",
    inStock: true,
    stockQty: 12,
    sku: "TM-FR-001",
    shortDescription:
      "Двухкамерный холодильник с зоной свежести и тихой инверторной системой.",
    description:
      "CoolPro X5 поддерживает стабильную температуру во всех зонах, снижая образование инея и сохраняя натуральный вкус продуктов. Инверторный компрессор уменьшает потребление энергии и работает практически бесшумно, а зона свежести помогает дольше сохранять текстуру овощей и фруктов.",
    highlights: [
      "Интеллектуальное распределение холода по всей камере.",
      "Зона свежести с регулируемой влажностью.",
      "Сенсорная панель управления на двери."
    ],
    attributes: {
      type: "двухкамерный",
      coolingSystem: "No Frost",
      volumeTotalL: 380,
      noiseDb: 36,
      energyClass: "A+++",
      freshZone: true,
      color: "графитовый"
    },
    specs: [
      {
        label: "Тип",
        value: "двухкамерный холодильник с нижней морозильной камерой"
      },
      {
        label: "Общий объём",
        value:
          "380 л (холодильная камера — 270 л, морозильная — 110 л)"
      },
      { label: "Класс энергоэффективности", value: "A+++" },
      { label: "Уровень шума", value: "до 36 дБ" },
      { label: "Система охлаждения", value: "No Frost в обеих камерах" },
      { label: "Зона свежести", value: "есть, регулируемая влажность" },
      { label: "Цвет", value: "графитовый серебристый" }
    ],
    images: [
      { src: "assets/products/fridge-1.svg", alt: "Холодильник CoolPro X5 — вид спереди" },
      { src: "assets/products/fridge-2.svg", alt: "Холодильник CoolPro X5 — открытые полки" },
      { src: "assets/products/fridge-3.svg", alt: "Холодильник CoolPro X5 — панель управления" }
    ],
    tags: ["Новинка 2026", "A+++ энергосбережение"]
  },
  {
    id: "fridge-citycool-200",
    name: "CityCool 200",
    category: "Холодильники",
    brand: "CityCool",
    price: 44990,
    currency: "RUB",
    inStock: true,
    stockQty: 7,
    sku: "TM-FR-002",
    shortDescription:
      "Узкий холодильник для небольших кухонь, удобная организация полок.",
    description:
      "CityCool 200 — узкий холодильник с прозрачными ящиками и регулируемыми полками. Подходит для студий и небольших кухонь и при этом сохраняет достаточный объём для повседневных нужд.",
    highlights: [
      "Узкий корпус 55 см",
      "Регулируемые полки из стекла",
      "Низкое энергопотребление A++"
    ],
    attributes: {
      type: "однокамерный",
      coolingSystem: "Static",
      widthCm: 55,
      volumeTotalL: 200,
      noiseDb: 40,
      energyClass: "A++",
      freshZone: false,
      color: "белый"
    },
    specs: [
      { label: "Тип", value: "однокамерный холодильник с морозильным отделением" },
      { label: "Общий объём", value: "200 л" },
      { label: "Ширина", value: "55 см" },
      { label: "Класс энергоэффективности", value: "A++" },
      { label: "Уровень шума", value: "до 40 дБ" },
      { label: "Управление", value: "механическое" },
      { label: "Цвет", value: "белый" }
    ],
    images: [
      { src: "assets/products/fridge-compact-1.svg", alt: "Холодильник CityCool 200 — вид спереди" },
      { src: "assets/products/fridge-compact-2.svg", alt: "Холодильник CityCool 200 — полки и ящики" }
    ],
    tags: ["Компактная серия", "A++ энергосбережение"]
  },
  {
    id: "washer-washmaster-9-eco",
    name: "WashMaster 9 Eco",
    category: "Стиральные машины",
    brand: "WashMaster",
    price: 48490,
    currency: "RUB",
    inStock: true,
    stockQty: 9,
    sku: "TM-WM-101",
    shortDescription:
      "Фронтальная загрузка 9 кг, защита от протечек и тихий ночной режим.",
    description:
      "WashMaster 9 Eco предлагает 15 программ стирки, включая деликатные и быстрые режимы. Контроль пенообразования и защита от протечек обеспечивают безопасную эксплуатацию даже при интенсивном использовании.",
    highlights: ["Загрузка 9 кг", "AquaStop защита от протечек", "Ночной режим"],
    attributes: {
      loadKg: 9,
      spinRpm: 1400,
      energyClass: "A++",
      leakProtection: true,
      depthCm: 58,
      color: "белый"
    },
    specs: [
      { label: "Тип", value: "стиральная машина с фронтальной загрузкой" },
      { label: "Максимальная загрузка", value: "9 кг" },
      { label: "Скорость отжима", value: "до 1400 об/мин" },
      { label: "Класс энергоэффективности", value: "A++" },
      { label: "Программы", value: "15" },
      { label: "Защита", value: "AquaStop" }
    ],
    images: [
      { src: "assets/products/washer-1.svg", alt: "Стиральная машина WashMaster 9 Eco — вид спереди" },
      { src: "assets/products/washer-2.svg", alt: "Стиральная машина WashMaster 9 Eco — панель управления" }
    ],
    tags: ["9 кг загрузка", "Защита от протечек"]
  },
  {
    id: "washer-compact-wash-6",
    name: "Compact Wash 6",
    category: "Стиральные машины",
    brand: "WashMaster",
    price: 36990,
    currency: "RUB",
    inStock: true,
    stockQty: 5,
    sku: "TM-WM-102",
    shortDescription:
      "Узкая модель с загрузкой 6 кг, идеально для небольшой ванной комнаты.",
    description:
      "Compact Wash 6 сочетает компактные размеры и функциональность. Быстрая стирка на 15 минут освежает одежду, а деликатные режимы бережно относятся к тканям.",
    highlights: ["Узкий формат 45 см", "Быстрый цикл 15 минут", "Блокировка от детей"],
    attributes: {
      loadKg: 6,
      spinRpm: 1200,
      energyClass: "A+",
      leakProtection: false,
      depthCm: 45,
      color: "белый"
    },
    specs: [
      { label: "Тип", value: "узкая стиральная машина с фронтальной загрузкой" },
      { label: "Максимальная загрузка", value: "6 кг" },
      { label: "Глубина корпуса", value: "45 см" },
      { label: "Скорость отжима", value: "до 1200 об/мин" },
      { label: "Быстрая программа", value: "15 минут" }
    ],
    images: [
      { src: "assets/products/washer-compact-1.svg", alt: "Стиральная машина Compact Wash 6 — вид спереди" }
    ],
    tags: ["Узкий формат", "6 кг загрузка"]
  },
  {
    id: "coffee-barista-one-touch",
    name: "Barista One Touch",
    category: "Кофемашины",
    brand: "Barista",
    price: 39990,
    currency: "RUB",
    inStock: true,
    stockQty: 14,
    sku: "TM-CF-501",
    shortDescription:
      "Автоматическая кофемашина с капучинатором и настройкой крепости.",
    description:
      "Barista One Touch готовит популярные напитки одним нажатием. Встроенный капучинатор автоматически взбивает молоко, а регулировка крепости и объёма позволяет настроить кофе под ваши предпочтения.",
    highlights: ["One Touch напитки", "Автокапучинатор", "Автопромывка"],
    attributes: {
      powerW: 1450,
      pressureBar: 15,
      waterTankL: 1.8,
      beansContainerG: 250,
      milkSystem: true,
      color: "чёрный/серебристый"
    },
    specs: [
      { label: "Тип", value: "автоматическая кофемашина" },
      { label: "Мощность", value: "1450 Вт" },
      { label: "Давление", value: "15 бар" },
      { label: "Объём воды", value: "1,8 л" },
      { label: "Контейнер для зёрен", value: "250 г" },
      { label: "Капучинатор", value: "автоматический" }
    ],
    images: [
      { src: "assets/products/coffee-1.svg", alt: "Кофемашина Barista One Touch — вид спереди" },
      { src: "assets/products/coffee-2.svg", alt: "Кофемашина Barista One Touch — подача напитка" }
    ],
    tags: ["One Touch", "Автокапучинатор"]
  },
  {
    id: "vacuum-cleanair-swift",
    name: "CleanAir Swift",
    category: "Пылесосы",
    brand: "CleanAir",
    price: 21990,
    currency: "RUB",
    inStock: true,
    stockQty: 20,
    sku: "TM-VC-801",
    shortDescription:
      "Беспроводной пылесос с системой фильтрации HEPA и режимом турбо.",
    description:
      "CleanAir Swift обеспечивает эффективную уборку благодаря турбо‑щётке и многоуровневой системе фильтрации. Лёгкий корпус и беспроводной формат делают уборку максимально удобной.",
    highlights: ["До 50 минут работы", "HEPA 13 фильтр", "Настенная док‑станция"],
    attributes: {
      batteryMin: 50,
      filter: "HEPA 13",
      dustBoxL: 0.6,
      weightKg: 2.4,
      wireless: true,
      color: "тёмно‑серый"
    },
    specs: [
      { label: "Тип", value: "вертикальный беспроводной пылесос" },
      { label: "Время работы", value: "до 50 минут" },
      { label: "Фильтрация", value: "HEPA 13" },
      { label: "Пылесборник", value: "0,6 л" },
      { label: "Вес", value: "2,4 кг" }
    ],
    images: [
      { src: "assets/products/vacuum-1.svg", alt: "Пылесос CleanAir Swift — вид спереди" }
    ],
    tags: ["Беспроводной", "HEPA‑фильтр"]
  },
  {
    id: "kettle-quickboil-17",
    name: "QuickBoil 1.7",
    category: "Мелкая техника",
    brand: "QuickBoil",
    price: 4990,
    currency: "RUB",
    inStock: true,
    stockQty: 30,
    sku: "TM-SM-301",
    shortDescription:
      "Электрочайник 1,7 л со скрытым нагревателем и автоотключением.",
    description:
      "QuickBoil 1.7 быстро нагревает воду, защищён от перегрева и отключается при закипании. Удобная шкала уровня воды и поворотная база 360° упрощают использование.",
    highlights: ["Объём 1,7 л", "Автоотключение", "Поворотная база 360°"],
    attributes: {
      volumeL: 1.7,
      powerW: 2200,
      material: "нержавеющая сталь/пластик",
      autoOff: true,
      color: "серебристый"
    },
    specs: [
      { label: "Тип", value: "электрический чайник" },
      { label: "Объём", value: "1,7 л" },
      { label: "Мощность", value: "2200 Вт" },
      { label: "Автоотключение", value: "есть" }
    ],
    images: [
      { src: "assets/products/kettle-1.svg", alt: "Электрочайник QuickBoil 1.7" }
    ],
    tags: ["Мелкая техника"]
  },
  {
    id: "microwave-heatwave-20",
    name: "HeatWave 20",
    category: "Мелкая техника",
    brand: "HeatWave",
    price: 8990,
    currency: "RUB",
    inStock: false,
    stockQty: 0,
    sku: "TM-SM-302",
    shortDescription:
      "Микроволновая печь 20 л с таймером и быстрыми программами разогрева.",
    description:
      "HeatWave 20 — компактная микроволновая печь для быстрого разогрева и разморозки. Простое механическое управление и понятный таймер.",
    highlights: ["Объём 20 л", "Разморозка", "Таймер"],
    attributes: {
      volumeL: 20,
      powerW: 700,
      control: "механическое",
      defrost: true,
      color: "белый"
    },
    specs: [
      { label: "Тип", value: "микроволновая печь" },
      { label: "Объём", value: "20 л" },
      { label: "Мощность", value: "700 Вт" },
      { label: "Управление", value: "механическое" }
    ],
    images: [
      { src: "assets/products/microwave-1.svg", alt: "Микроволновая печь HeatWave 20" }
    ],
    tags: ["Мелкая техника"]
  },
  {
    id: "dishwasher-aquawash-60",
    name: "AquaWash 60",
    category: "Посудомоечные машины",
    brand: "AquaWash",
    price: 54990,
    currency: "RUB",
    inStock: true,
    stockQty: 6,
    sku: "TM-DW-201",
    shortDescription:
      "Посудомоечная машина 60 см на 14 комплектов с тихим режимом и сушкой.",
    description:
      "AquaWash 60 рассчитана на большую семью: вместимость 14 комплектов, экономичные режимы и тихая работа. Есть быстрые программы и автоматическая сушка для удобства.",
    highlights: ["14 комплектов", "Тихий режим", "Автосушка"],
    attributes: {
      widthCm: 60,
      sets: 14,
      noiseDb: 44,
      drying: true,
      color: "нержавеющая сталь"
    },
    specs: [
      { label: "Тип", value: "посудомоечная машина полноразмерная" },
      { label: "Ширина", value: "60 см" },
      { label: "Вместимость", value: "14 комплектов" },
      { label: "Уровень шума", value: "до 44 дБ" },
      { label: "Сушка", value: "автоматическая" }
    ],
    images: [
      { src: "assets/products/dishwasher-1.svg", alt: "Посудомоечная машина AquaWash 60" }
    ],
    tags: ["60 см", "Автосушка"]
  },
  {
    id: "air-pure-breatheasy-300",
    name: "BreatheEasy 300",
    category: "Климатическая техника",
    brand: "BreatheEasy",
    price: 17990,
    currency: "RUB",
    inStock: true,
    stockQty: 18,
    sku: "TM-CL-701",
    shortDescription:
      "Очиститель воздуха с HEPA‑фильтром и автоматическим режимом для комнаты до 30 м².",
    description:
      "BreatheEasy 300 очищает воздух от пыли и аллергенов с помощью HEPA‑фильтра. Автоматический режим подстраивает мощность под качество воздуха, а ночной режим снижает шум.",
    highlights: ["HEPA‑фильтр", "Авто режим", "Ночной режим"],
    attributes: {
      hepa: true,
      autoMode: true,
      areaM2: 30,
      noiseDb: 24,
      color: "белый"
    },
    specs: [
      { label: "Тип", value: "очиститель воздуха" },
      { label: "Площадь", value: "до 30 м²" },
      { label: "Фильтрация", value: "HEPA" },
      { label: "Режимы", value: "авто / ночной" }
    ],
    images: [
      { src: "assets/products/air-purifier-1.svg", alt: "Очиститель воздуха BreatheEasy 300" }
    ],
    tags: ["HEPA", "Авто режим"]
  }
];

