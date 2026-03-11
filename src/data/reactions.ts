import type { Reaction } from '../types';

export const reactions: Reaction[] = [
  // ─── GLYCOLYSIS (10 steps) ─────────────────────────────────────────────────
  {
    id: 'r_hexokinase',
    fromMetaboliteId: 'glucose',
    toMetaboliteId: 'glucose_6_phosphate',
    pathId: 'glycolysis',
    enzymeName: 'Гексокиназа (в печени — глюкокиназа)',
    enzymeShortName: 'ГК / ГлК',
    reactionType: 'фосфорилирование',
    stepNumber: 1,
    cofactors: ['АТФ', 'Mg²⁺'],
    energyYield: '−1 АТФ',
    description:
      'Глюкоза фосфорилируется по 6-му положению за счёт АТФ, образуя глюкозо-6-фосфат. Реакция необратима и удерживает глюкозу в клетке. Гексокиназа насыщается при низкой концентрации глюкозы (низкий Km); глюкокиназа печени — при высокой (высокий Km), что обеспечивает буферный захват глюкозы после еды.',
    clinicalNotes: [
      {
        id: 'cn_hexokinase_def',
        title: 'Дефицит гексокиназы',
        deficiencyOf: 'Гексокиназа',
        biochemicalConsequences:
          'Накопление глюкозы внутриклеточно не происходит — нарушается первый шаг гликолиза в эритроцитах.',
        clinicalManifestations: 'Гемолитическая анемия, желтуха, спленомегалия.',
        disease: 'Гемолитическая анемия вследствие дефицита гексокиназы',
      },
    ],
  },
  {
    id: 'r_phosphoglucose_isomerase',
    fromMetaboliteId: 'glucose_6_phosphate',
    toMetaboliteId: 'fructose_6_phosphate',
    pathId: 'glycolysis',
    enzymeName: 'Фосфоглюкоизомераза',
    enzymeShortName: 'ФГИ',
    reactionType: 'изомеризация',
    stepNumber: 2,
    description:
      'Обратимая изомеризация: альдоза (Г6Ф) переходит в кетозу (Ф6Ф). Реакция не требует кофакторов и легко обратима.',
    isReversible: true,
  },
  {
    id: 'r_pfk1',
    fromMetaboliteId: 'fructose_6_phosphate',
    toMetaboliteId: 'fructose_1_6_bisphosphate',
    pathId: 'glycolysis',
    enzymeName: 'Фосфофруктокиназа-1',
    enzymeShortName: 'ФФК-1',
    reactionType: 'фосфорилирование',
    stepNumber: 3,
    cofactors: ['АТФ', 'Mg²⁺'],
    energyYield: '−1 АТФ',
    description:
      'Необратимая реакция — главный пункт регуляции гликолиза. ФФК-1 аллостерически активируется АМФ, АДФ, фруктозо-2,6-бисфосфатом и ингибируется АТФ, цитратом. При инсулинорезистентности активность ФФК-1 снижается.',
    clinicalNotes: [
      {
        id: 'cn_pfk1_def',
        title: 'Болезнь Таруи (дефицит ФФК-1)',
        deficiencyOf: 'Фосфофруктокиназа-1',
        biochemicalConsequences:
          'Накопление глюкозо-6-фосфата и фруктозо-6-фосфата; нарушение гликолиза в эритроцитах и мышцах.',
        clinicalManifestations:
          'Миопатия с болями при нагрузке, гемолитическая анемия, гиперурикемия.',
        disease: 'Гликогеноз VII типа (болезнь Таруи)',
      },
    ],
  },
  {
    id: 'r_aldolase',
    fromMetaboliteId: 'fructose_1_6_bisphosphate',
    toMetaboliteId: 'gap',
    pathId: 'glycolysis',
    enzymeName: 'Альдолаза',
    enzymeShortName: 'Альд',
    reactionType: 'ретроальдольное расщепление',
    stepNumber: 4,
    description:
      'Расщепление фруктозо-1,6-бисфосфата на два трёхуглеродных фрагмента: глицеральдегид-3-фосфат (ГАФ) и дигидроксиацетонфосфат (ДГАП). ДГАП быстро изомеризуется в ГАФ триозофосфатизомеразой, эффективно удваивая поток через нижнюю часть гликолиза.',
    clinicalNotes: [
      {
        id: 'cn_aldolase_def',
        title: 'Дефицит альдолазы A',
        deficiencyOf: 'Альдолаза A',
        biochemicalConsequences: 'Накопление фруктозо-1,6-бисфосфата, нарушение нижнего гликолиза.',
        clinicalManifestations: 'Гемолитическая анемия, задержка развития, миопатия.',
        disease: 'Гемолитическая анемия вследствие дефицита альдолазы',
      },
    ],
  },
  {
    id: 'r_tpi',
    fromMetaboliteId: 'dhap',
    toMetaboliteId: 'gap',
    pathId: 'glycolysis',
    enzymeName: 'Триозофосфатизомераза',
    enzymeShortName: 'ТПИ',
    reactionType: 'изомеризация',
    stepNumber: 4,
    isReversible: true,
    description:
      'Обратимое превращение ДГАП в ГАФ, что позволяет обоим трёхуглеродным продуктам альдолазы вступить в нижнюю фазу гликолиза. Один из каталитически совершенных ферментов — диффузионно-ограниченная скорость.',
  },
  {
    id: 'r_gapdh',
    fromMetaboliteId: 'gap',
    toMetaboliteId: 'bisphosphoglycerate_1_3',
    pathId: 'glycolysis',
    enzymeName: 'Глицеральдегид-3-фосфатдегидрогеназа',
    enzymeShortName: 'ГАФДГ',
    reactionType: 'окислительное фосфорилирование',
    stepNumber: 6,
    cofactors: ['НАД⁺', 'Pᵢ'],
    description:
      'ГАФ окисляется с одновременным фосфорилированием: НАД⁺ восстанавливается до НАДН, образуется высокоэнергетический 1,3-БФГ. При анаэробных условиях регенерация НАД⁺ осуществляется через лактатдегидрогеназу.',
  },
  {
    id: 'r_pgk',
    fromMetaboliteId: 'bisphosphoglycerate_1_3',
    toMetaboliteId: 'phosphoglycerate_3',
    pathId: 'glycolysis',
    enzymeName: 'Фосфоглицераткиназа',
    enzymeShortName: 'ФГК',
    reactionType: 'субстратное фосфорилирование',
    stepNumber: 7,
    cofactors: ['АДФ', 'Mg²⁺'],
    energyYield: '+1 АТФ (×2)',
    description:
      'Первая реакция субстратного фосфорилирования в гликолизе: фосфатная группа 1,3-БФГ переносится на АДФ → АТФ. С учётом двух молекул ГАФ даёт +2 АТФ. Обратима, но смещена вправо.',
    isReversible: true,
  },
  {
    id: 'r_pgm',
    fromMetaboliteId: 'phosphoglycerate_3',
    toMetaboliteId: 'phosphoglycerate_2',
    pathId: 'glycolysis',
    enzymeName: 'Фосфоглицератмутаза',
    enzymeShortName: 'ФГМ',
    reactionType: 'изомеризация',
    stepNumber: 8,
    isReversible: true,
    description: 'Перемещение фосфатной группы с 3-го на 2-е положение. Обратимая реакция.',
  },
  {
    id: 'r_enolase',
    fromMetaboliteId: 'phosphoglycerate_2',
    toMetaboliteId: 'phosphoenolpyruvate',
    pathId: 'glycolysis',
    enzymeName: 'Енолаза',
    reactionType: 'дегидратация',
    stepNumber: 9,
    cofactors: ['Mg²⁺'],
    description:
      'Дегидратация 2-ФГ с образованием высокоэнергетического фосфоенолпирувата (ФЕП). Ингибируется фторидом (ионы F⁻), что используется для подавления гликолиза в пробах крови.',
  },
  {
    id: 'r_pyruvate_kinase',
    fromMetaboliteId: 'phosphoenolpyruvate',
    toMetaboliteId: 'pyruvate',
    pathId: 'glycolysis',
    enzymeName: 'Пируваткиназа',
    enzymeShortName: 'ПК',
    reactionType: 'субстратное фосфорилирование',
    stepNumber: 10,
    cofactors: ['АДФ', 'Mg²⁺', 'K⁺'],
    energyYield: '+1 АТФ (×2)',
    description:
      'Необратимая реакция: фосфат ФЕП переносится на АДФ → АТФ. Второй необратимый регуляторный шаг гликолиза. Активируется фруктозо-1,6-бисфосфатом (кормовое активирование), ингибируется АТФ и аланином.',
    clinicalNotes: [
      {
        id: 'cn_pk_def',
        title: 'Дефицит пируваткиназы',
        deficiencyOf: 'Пируваткиназа (эритроцитарная)',
        biochemicalConsequences:
          'Накопление ФЕП и 2,3-БФГ; снижение выработки АТФ в эритроцитах.',
        clinicalManifestations:
          'Хроническая гемолитическая анемия, желтуха, спленомегалия, желчнокаменная болезнь.',
        disease: 'Наследственная гемолитическая анемия вследствие дефицита ПК',
      },
    ],
  },

  // ─── PYRUVATE → ACETYL-COA ─────────────────────────────────────────────────
  {
    id: 'r_pdh',
    fromMetaboliteId: 'pyruvate',
    toMetaboliteId: 'acetyl_coa',
    pathId: 'pyruvate_to_acetylcoa',
    enzymeName: 'Пируватдегидрогеназный комплекс',
    enzymeShortName: 'ПДГ-комплекс',
    reactionType: 'окислительное декарбоксилирование',
    cofactors: ['НАД⁺', 'КоА', 'ТПФ', 'ФАД', 'липоат'],
    energyYield: '+1 НАДН (×2)',
    description:
      'Необратимая реакция, соединяющая гликолиз с циклом Кребса. Пируват окисляется до ацетил-КоА с потерей CO₂ и восстановлением НАД⁺ до НАДН. Комплекс ингибируется ацетил-КоА и НАДН; активируется при дефиците АТФ и снижении НАДН.',
    clinicalNotes: [
      {
        id: 'cn_pdh_def',
        title: 'Дефицит пируватдегидрогеназы',
        deficiencyOf: 'ПДГ-комплекс (E1-субъединица, PDHA1)',
        biochemicalConsequences:
          'Накопление пирувата и лактата; ацетил-КоА не образуется → нарушение цикла Кребса.',
        clinicalManifestations:
          'Лактат-ацидоз, энцефалопатия, задержка психомоторного развития, синдром Ли.',
        disease: 'Синдром Ли / первичный лактат-ацидоз',
      },
    ],
  },

  // ─── TCA CYCLE (8 steps) ──────────────────────────────────────────────────
  {
    id: 'r_citrate_synthase',
    fromMetaboliteId: 'acetyl_coa',
    toMetaboliteId: 'citrate',
    pathId: 'tca_cycle',
    enzymeName: 'Цитратсинтаза',
    enzymeShortName: 'ЦС',
    reactionType: 'конденсация',
    stepNumber: 1,
    description:
      'Ацетил-КоА конденсируется с оксалоацетатом, образуя цитрат. Необратимая реакция — «вход» в цикл. Ингибируется АТФ, НАДН, сукцинил-КоА. Регулирует скорость цикла согласно энергетическому статусу клетки.',
  },
  {
    id: 'r_aconitase',
    fromMetaboliteId: 'citrate',
    toMetaboliteId: 'isocitrate',
    pathId: 'tca_cycle',
    enzymeName: 'Аконитаза',
    reactionType: 'дегидратация/гидратация',
    stepNumber: 2,
    isReversible: true,
    description:
      'Изомеризация цитрата в изоцитрат через промежуточный цис-аконитат. Фермент содержит железо-серный кластер; ингибируется фторцитратом (продуктом отравления фторацетатом).',
  },
  {
    id: 'r_isocitrate_dh',
    fromMetaboliteId: 'isocitrate',
    toMetaboliteId: 'alpha_ketoglutarate',
    pathId: 'tca_cycle',
    enzymeName: 'Изоцитратдегидрогеназа',
    enzymeShortName: 'ИЦДГ',
    reactionType: 'окислительное декарбоксилирование',
    stepNumber: 3,
    cofactors: ['НАД⁺', 'Mg²⁺'],
    energyYield: '+1 НАДН, −1 CO₂',
    description:
      'Первая реакция выделения CO₂ в цикле. Необратима. Аллостерически активируется АДФ, Ca²⁺ и ингибируется АТФ, НАДН. Ключевой регуляторный шаг.',
    clinicalNotes: [
      {
        id: 'cn_idh_mut',
        title: 'Мутация IDH1/IDH2 при онкологии',
        deficiencyOf: 'Изоцитратдегидрогеназа (мутантная)',
        biochemicalConsequences:
          'Образование 2-гидроксиглутарата (онкометаболита) вместо α-кетоглутарата; ингибирование ТЕТ-деметилаз → гиперметилирование ДНК.',
        clinicalManifestations:
          'Глиомы, острый миелоидный лейкоз, холангиокарцинома.',
        disease: 'IDH-мутантные опухоли',
      },
    ],
  },
  {
    id: 'r_alpha_kg_dh',
    fromMetaboliteId: 'alpha_ketoglutarate',
    toMetaboliteId: 'succinyl_coa',
    pathId: 'tca_cycle',
    enzymeName: 'α-Кетоглутаратдегидрогеназный комплекс',
    enzymeShortName: 'α-КГДГ',
    reactionType: 'окислительное декарбоксилирование',
    stepNumber: 4,
    cofactors: ['НАД⁺', 'КоА', 'ТПФ', 'ФАД', 'липоат'],
    energyYield: '+1 НАДН, −1 CO₂',
    description:
      'Аналог ПДГ-комплекса. Необратимая реакция. Ингибируется АТФ, НАДН, сукцинил-КоА. Требует витаминов B₁ (тиамин), B₂, B₃, B₅, липоевой кислоты.',
    clinicalNotes: [
      {
        id: 'cn_thiamine_def',
        title: 'Дефицит тиамина (B₁)',
        deficiencyOf: 'α-КГДГ и ПДГ-комплекс',
        biochemicalConsequences:
          'Нарушение обоих окислительных декарбоксилирований; накопление пирувата, лактата и α-кетоглутарата.',
        clinicalManifestations:
          'Бери-бери (периферическая нейропатия, сердечная недостаточность), энцефалопатия Вернике.',
        disease: 'Авитаминоз B₁ (бери-бери, синдром Вернике-Корсакова)',
      },
    ],
  },
  {
    id: 'r_succinyl_coa_synthetase',
    fromMetaboliteId: 'succinyl_coa',
    toMetaboliteId: 'succinate',
    pathId: 'tca_cycle',
    enzymeName: 'Сукцинил-КоА-синтетаза',
    reactionType: 'субстратное фосфорилирование',
    stepNumber: 5,
    cofactors: ['ГДФ', 'Pᵢ'],
    energyYield: '+1 ГТФ',
    isReversible: true,
    description:
      'Единственный шаг цикла с прямым синтезом нуклеозидтрифосфата (ГТФ). В сердце образуется АТФ напрямую.',
  },
  {
    id: 'r_succinate_dh',
    fromMetaboliteId: 'succinate',
    toMetaboliteId: 'fumarate',
    pathId: 'tca_cycle',
    enzymeName: 'Сукцинатдегидрогеназа (Комплекс II дыхательной цепи)',
    enzymeShortName: 'СДГ',
    reactionType: 'дегидрогенирование',
    stepNumber: 6,
    cofactors: ['ФАД'],
    energyYield: '+1 ФАДН₂',
    description:
      'Единственный фермент цикла Кребса, встроенный в внутреннюю митохондриальную мембрану; одновременно является комплексом II дыхательной цепи. ФАДН₂ непосредственно передаёт электроны на убихинон.',
    clinicalNotes: [
      {
        id: 'cn_sdh_mut',
        title: 'Мутации SDH при феохромоцитоме',
        deficiencyOf: 'Сукцинатдегидрогеназа',
        biochemicalConsequences:
          'Накопление сукцината → онкометаболический эффект, ингибирование пролилгидроксилаз → стабилизация HIF-1α.',
        clinicalManifestations:
          'Наследственная параганглиома/феохромоцитома, синдром SDHB.',
        disease: 'Наследственная параганглиома-феохромоцитома',
      },
    ],
  },
  {
    id: 'r_fumarase',
    fromMetaboliteId: 'fumarate',
    toMetaboliteId: 'malate',
    pathId: 'tca_cycle',
    enzymeName: 'Фумараза (фумарат-гидратаза)',
    reactionType: 'гидратация',
    stepNumber: 7,
    isReversible: true,
    description: 'Гидратация фумарата до L-малата. Реакция стереоспецифична (только L-изомер).',
  },
  {
    id: 'r_malate_dh',
    fromMetaboliteId: 'malate',
    toMetaboliteId: 'oxaloacetate',
    pathId: 'tca_cycle',
    enzymeName: 'Малатдегидрогеназа',
    enzymeShortName: 'МДГ',
    reactionType: 'дегидрогенирование',
    stepNumber: 8,
    cofactors: ['НАД⁺'],
    energyYield: '+1 НАДН',
    isReversible: true,
    description:
      'Последний шаг цикла: малат окисляется до оксалоацетата с образованием НАДН. Термодинамически невыгодна, но ОАА поглощается следующим оборотом цикла (цитратсинтазой), что смещает равновесие вправо.',
  },

  // ─── β-OXIDATION (4 repeating steps) ────────────────────────────────────
  {
    id: 'r_acyl_coa_synthetase',
    fromMetaboliteId: 'fatty_acid',
    toMetaboliteId: 'fatty_acyl_coa',
    pathId: 'beta_oxidation',
    enzymeName: 'Ацил-КоА синтетаза (Длинноцепочечная)',
    enzymeShortName: 'АКС',
    reactionType: 'активация',
    stepNumber: 1,
    cofactors: ['КоА', 'АТФ'],
    energyYield: '−2 АТФ (АТФ → АМФ + PPi)',
    description:
      'Активация жирной кислоты путём присоединения кофермента А. Происходит в цитоплазме. Требует 2 эквивалента АТФ (АТФ расщепляется до АМФ + пирофосфата). Активированный ацил-КоА транспортируется в митохондрии с помощью карнитин-ацилкарнитин-транслоказы.',
    clinicalNotes: [
      {
        id: 'cn_cpt1_def',
        title: 'Дефицит карнитин-пальмитоилтрансферазы I (КПТ-I)',
        deficiencyOf: 'КПТ-I (транспортный фермент в митохондрии)',
        biochemicalConsequences:
          'Жирные кислоты не поступают в митохондрии → нет β-окисления; гипокетонемия.',
        clinicalManifestations:
          'Гипогликемия натощак (без кетоза), гепатомегалия, рабдомиолиз при нагрузке.',
        disease: 'Дефицит КПТ-I',
      },
    ],
  },
  {
    id: 'r_acyl_coa_dh',
    fromMetaboliteId: 'fatty_acyl_coa',
    toMetaboliteId: 'enoyl_coa',
    pathId: 'beta_oxidation',
    enzymeName: 'Ацил-КоА дегидрогеназа (VLCAD/LCAD/MCAD/SCAD)',
    enzymeShortName: 'АКД',
    reactionType: 'дегидрогенирование',
    stepNumber: 2,
    cofactors: ['ФАД'],
    energyYield: '+1 ФАДН₂',
    description:
      'Первый шаг β-окисления: образование транс-двойной связи между Cα и Cβ. ФАДН₂ передаёт электроны в электрон-транспортную цепь через ЭПФ-ФАД.',
    clinicalNotes: [
      {
        id: 'cn_mcad_def',
        title: 'Дефицит MCAD (среднецепочечная ацил-КоА дегидрогеназа)',
        deficiencyOf: 'MCAD',
        biochemicalConsequences:
          'Накопление среднецепочечных ацилкарнитинов; снижение кетогенеза при голодании.',
        clinicalManifestations:
          'Гипогликемия натощак (без кетоза), летаргия, рвота, кома у детей раннего возраста. Одна из наиболее частых органических ацидемий.',
        disease: 'Дефицит MCAD (наиболее частое нарушение β-окисления)',
      },
    ],
  },
  {
    id: 'r_enoyl_coa_hydratase',
    fromMetaboliteId: 'enoyl_coa',
    toMetaboliteId: 'hydroxyacyl_coa',
    pathId: 'beta_oxidation',
    enzymeName: 'Еноил-КоА гидратаза',
    reactionType: 'гидратация',
    stepNumber: 3,
    description: 'Присоединение воды к двойной связи транс-еноил-КоА → L-3-гидроксиацил-КоА. Стереоспецифична.',
    isReversible: true,
  },
  {
    id: 'r_hydroxyacyl_coa_dh',
    fromMetaboliteId: 'hydroxyacyl_coa',
    toMetaboliteId: 'ketoacyl_coa',
    pathId: 'beta_oxidation',
    enzymeName: 'L-3-Гидроксиацил-КоА дегидрогеназа',
    enzymeShortName: 'ХАДГ',
    reactionType: 'дегидрогенирование',
    stepNumber: 4,
    cofactors: ['НАД⁺'],
    energyYield: '+1 НАДН',
    description: 'Окисление гидроксигруппы до кетогруппы с образованием НАДН. Важный шаг для энергетики.',
  },
  {
    id: 'r_thiolase',
    fromMetaboliteId: 'ketoacyl_coa',
    toMetaboliteId: 'acetyl_coa',
    pathId: 'beta_oxidation',
    enzymeName: 'Ацетил-КоА-ацетилтрансфераза (Тиолаза)',
    enzymeShortName: 'Тиолаза',
    reactionType: 'тиолиз',
    stepNumber: 5,
    cofactors: ['КоА'],
    description:
      'Тиолитическое расщепление 3-кетоацил-КоА: высвобождается ацетил-КоА и укороченный на 2 углерода ацил-КоА. Цикл повторяется до полного расщепления жирной кислоты.',
  },

  // ─── GLUCONEOGENESIS (bypass reactions) ────────────────────────────────────
  {
    id: 'r_pyruvate_carboxylase',
    fromMetaboliteId: 'pyruvate',
    toMetaboliteId: 'oxaloacetate',
    pathId: 'gluconeogenesis',
    enzymeName: 'Пируваткарбоксилаза',
    enzymeShortName: 'ПК',
    reactionType: 'карбоксилирование',
    cofactors: ['АТФ', 'биотин', 'CO₂'],
    energyYield: '−1 АТФ',
    description:
      'Первый обходной шаг глюконеогенеза. Пируват карбоксилируется до оксалоацетата в митохондриях. Аллостерически активируется ацетил-КоА (сигнал высокой «жировой» нагрузки, направляющий пируват на глюконеогенез).',
    clinicalNotes: [
      {
        id: 'cn_pc_def',
        title: 'Дефицит пируваткарбоксилазы',
        deficiencyOf: 'Пируваткарбоксилаза',
        biochemicalConsequences:
          'Нарушение глюконеогенеза и анаплероза ЦТК; накопление пирувата, лактата; снижение ОАА.',
        clinicalManifestations:
          'Лактат-ацидоз, гипогликемия, задержка развития, судороги.',
        disease: 'Дефицит пируваткарбоксилазы',
      },
    ],
  },
  {
    id: 'r_pepck',
    fromMetaboliteId: 'oxaloacetate',
    toMetaboliteId: 'phosphoenolpyruvate',
    pathId: 'gluconeogenesis',
    enzymeName: 'Фосфоенолпируваткарбоксикиназа',
    enzymeShortName: 'ФЕПКК / PEPCK',
    reactionType: 'декарбоксилирование/фосфорилирование',
    cofactors: ['ГТФ', 'CO₂'],
    description:
      'ОАА декарбоксилируется и фосфорилируется → ФЕП. Второй обходной шаг; экспрессия гена стимулируется глюкагоном и кортизолом, подавляется инсулином.',
  },
  {
    id: 'r_fructose_1_6_bisphosphatase',
    fromMetaboliteId: 'fructose_1_6_bisphosphate',
    toMetaboliteId: 'fructose_6_phosphate',
    pathId: 'gluconeogenesis',
    enzymeName: 'Фруктозо-1,6-бисфосфатаза',
    enzymeShortName: 'ФБФаза-1',
    reactionType: 'гидролиз фосфатной группы',
    description:
      'Необратимый обходной шаг, противоположный реакции ФФК-1. Ингибируется АМФ и фруктозо-2,6-бисфосфатом; активируется цитратом. Регулирует скорость глюконеогенеза.',
    clinicalNotes: [
      {
        id: 'cn_fbpase_def',
        title: 'Дефицит фруктозо-1,6-бисфосфатазы',
        deficiencyOf: 'Фруктозо-1,6-бисфосфатаза',
        biochemicalConsequences:
          'Нарушение глюконеогенеза из всех субстратов (лактат, глицерол, аланин).',
        clinicalManifestations:
          'Гипогликемия натощак, лактат-ацидоз, гипераланинемия.',
        disease: 'Дефицит ФБФ-1',
      },
    ],
  },
  {
    id: 'r_glucose_6_phosphatase',
    fromMetaboliteId: 'glucose_6_phosphate',
    toMetaboliteId: 'glucose',
    pathId: 'gluconeogenesis',
    enzymeName: 'Глюкозо-6-фосфатаза',
    enzymeShortName: 'Г6Фаза',
    reactionType: 'гидролиз фосфатной группы',
    description:
      'Конечный шаг: Г6Ф гидролизуется до свободной глюкозы, которая выходит в кровоток. Экспрессируется преимущественно в печени и почках. Отсутствует в мышцах → мышечный гликоген не даёт глюкозу в кровь.',
    clinicalNotes: [
      {
        id: 'cn_g6pase_def',
        title: 'Болезнь Гирке (гликогеноз Ia типа)',
        deficiencyOf: 'Глюкозо-6-фосфатаза',
        biochemicalConsequences:
          'Накопление Г6Ф → накопление гликогена и жира в печени; нет свободной глюкозы.',
        clinicalManifestations:
          'Тяжёлая гипогликемия натощак, гепатомегалия, гиперурикемия, гиперлипидемия, задержка роста.',
        disease: 'Болезнь Гирке (гликогеноз Ia)',
      },
    ],
  },

  // ─── GLYCOGEN METABOLISM ──────────────────────────────────────────────────
  {
    id: 'r_glycogen_synthase',
    fromMetaboliteId: 'udp_glucose',
    toMetaboliteId: 'glycogen',
    pathId: 'glycogen_metabolism',
    enzymeName: 'Гликогенсинтаза',
    reactionType: 'гликозилирование',
    description:
      'Перенос глюкозы с УДФ-глюкозы на нередуцирующий конец гликогеновой цепи (α-1,4-связь). Ключевой фермент синтеза гликогена; активируется инсулином (через дефосфорилирование), ингибируется глюкагоном.',
    clinicalNotes: [
      {
        id: 'cn_gsd0',
        title: 'Гликогеноз 0 типа (агликогеноз)',
        deficiencyOf: 'Гликогенсинтаза',
        biochemicalConsequences:
          'Гликоген в печени не синтезируется → нет депо для поддержания гликемии натощак.',
        clinicalManifestations:
          'Гипогликемия натощак, гипергликемия после еды, задержка роста.',
        disease: 'Гликогеноз 0 типа',
      },
    ],
  },
  {
    id: 'r_udp_glucose_pyrophosphorylase',
    fromMetaboliteId: 'glucose_1_phosphate',
    toMetaboliteId: 'udp_glucose',
    pathId: 'glycogen_metabolism',
    enzymeName: 'УДФ-глюкозопирофосфорилаза',
    reactionType: 'нуклеотидилирование',
    description: 'Активация глюкозо-1-фосфата с помощью УТФ: образуется УДФ-глюкоза + пирофосфат. Реакция необратима (пирофосфат гидролизуется пирофосфатазой).',
  },
  {
    id: 'r_phosphoglucomutase',
    fromMetaboliteId: 'glucose_6_phosphate',
    toMetaboliteId: 'glucose_1_phosphate',
    pathId: 'glycogen_metabolism',
    enzymeName: 'Фосфоглюкомутаза',
    reactionType: 'изомеризация',
    isReversible: true,
    description: 'Перемещение фосфатной группы между 6-м и 1-м положением глюкозы. Обратима.',
  },
  {
    id: 'r_glycogen_phosphorylase',
    fromMetaboliteId: 'glycogen',
    toMetaboliteId: 'glucose_1_phosphate',
    pathId: 'glycogen_metabolism',
    enzymeName: 'Гликогенфосфорилаза',
    enzymeShortName: 'ГФ',
    reactionType: 'фосфоролиз',
    cofactors: ['Pᵢ', 'ПЛП'],
    description:
      'Фосфоролиз нередуцирующих концов гликогена: высвобождается глюкозо-1-фосфат. Активируется адреналином (в мышцах и печени), глюкагоном (в печени), АМФ (в мышцах). Требует ПЛП (пиридоксальфосфат, витамин B₆).',
    clinicalNotes: [
      {
        id: 'cn_hers_disease',
        title: 'Болезнь Херса (гликогеноз VI типа)',
        deficiencyOf: 'Гликогенфосфорилаза (печёночная)',
        biochemicalConsequences:
          'Накопление гликогена в печени; невозможность мобилизации глюкозы.',
        clinicalManifestations:
          'Гепатомегалия, умеренная гипогликемия натощак, задержка роста.',
        disease: 'Болезнь Херса',
      },
    ],
  },
];

export const reactionMap = new Map<string, Reaction>(
  reactions.map((r) => [r.id, r]),
);
