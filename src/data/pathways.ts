import type { MetabolicPathway } from '../types';

export const pathways: MetabolicPathway[] = [
  {
    id: 'glycolysis',
    name: 'Гликолиз',
    shortName: 'Гликолиз',
    color: '#d42020',
    description:
      'Гликолиз — универсальный путь расщепления глюкозы, протекающий в цитоплазме всех клеток. Из одной молекулы глюкозы (C₆) образуются две молекулы пирувата (C₃) с чистым выходом 2 АТФ и 2 НАДН.',
    educationalGoal:
      'Понять последовательность и логику десяти реакций гликолиза; выделить три необратимые регуляторные ступени; объяснить различие аэробного и анаэробного путей.',
    location: 'Цитоплазма',
    metaboliteIds: [
      'glucose',
      'glucose_6_phosphate',
      'fructose_6_phosphate',
      'fructose_1_6_bisphosphate',
      'gap',
      'bisphosphoglycerate_1_3',
      'phosphoglycerate_3',
      'phosphoglycerate_2',
      'phosphoenolpyruvate',
      'pyruvate',
    ],
    reactionIds: [
      'r_hexokinase',
      'r_phosphoglucose_isomerase',
      'r_pfk1',
      'r_aldolase',
      'r_tpi',
      'r_gapdh',
      'r_pgk',
      'r_pgm',
      'r_enolase',
      'r_pyruvate_kinase',
    ],
  },
  {
    id: 'pyruvate_to_acetylcoa',
    name: 'Переход пирувата в ацетил-КоА',
    shortName: 'Пируват → Ацетил-КоА',
    color: '#e07b00',
    description:
      'Реакция окислительного декарбоксилирования пирувата в митохондриальном матриксе. Соединяет гликолиз с циклом Кребса; ключевой необратимый «мост» углеводного и жирового обмена.',
    educationalGoal:
      'Описать роль ПДГ-комплекса и его кофакторов; объяснить, почему дефицит тиамина нарушает и гликолиз, и цикл Кребса одновременно.',
    location: 'Митохондриальный матрикс',
    metaboliteIds: ['pyruvate', 'acetyl_coa'],
    reactionIds: ['r_pdh'],
  },
  {
    id: 'tca_cycle',
    name: 'Цикл трикарбоновых кислот (цикл Кребса)',
    shortName: 'Цикл Кребса',
    color: '#1a7fc1',
    description:
      'Центральный амфиболический путь, протекающий в митохондриальном матриксе. За один оборот из одного ацетил-КоА образуются 3 НАДН, 1 ФАДН₂, 1 ГТФ и выделяются 2 CO₂.',
    educationalGoal:
      'Назвать все 8 шагов цикла и основные регуляторные точки; связать выход восстановленных коферментов с работой дыхательной цепи и синтезом АТФ.',
    location: 'Митохондриальный матрикс',
    metaboliteIds: [
      'acetyl_coa',
      'oxaloacetate',
      'citrate',
      'isocitrate',
      'alpha_ketoglutarate',
      'succinyl_coa',
      'succinate',
      'fumarate',
      'malate',
    ],
    reactionIds: [
      'r_citrate_synthase',
      'r_aconitase',
      'r_isocitrate_dh',
      'r_alpha_kg_dh',
      'r_succinyl_coa_synthetase',
      'r_succinate_dh',
      'r_fumarase',
      'r_malate_dh',
    ],
  },
  {
    id: 'beta_oxidation',
    name: 'β-Окисление жирных кислот',
    shortName: 'β-Окисление',
    color: '#2e8b57',
    description:
      'Ступенчатое расщепление жирных кислот в митохондриях с последовательным отщеплением двухуглеродных фрагментов в виде ацетил-КоА. Главный источник энергии при голодании.',
    educationalGoal:
      'Объяснить цикл из 4 реакций β-окисления; рассчитать выход АТФ для пальмитиновой кислоты; понять, почему нарушение β-окисления вызывает гипогликемию без кетоза.',
    location: 'Митохондриальный матрикс',
    metaboliteIds: [
      'fatty_acid',
      'fatty_acyl_coa',
      'enoyl_coa',
      'hydroxyacyl_coa',
      'ketoacyl_coa',
      'acetyl_coa',
    ],
    reactionIds: [
      'r_acyl_coa_synthetase',
      'r_acyl_coa_dh',
      'r_enoyl_coa_hydratase',
      'r_hydroxyacyl_coa_dh',
      'r_thiolase',
    ],
  },
  {
    id: 'gluconeogenesis',
    name: 'Глюконеогенез',
    shortName: 'ГНГ',
    color: '#7b2fbe',
    description:
      'Синтез глюкозы из неуглеводных предшественников (лактата, глицерола, аминокислот). Протекает преимущественно в печени и почках. Включает 7 реакций гликолиза (обратимых) и 4 обходных необратимых реакции.',
    educationalGoal:
      'Назвать 4 обходных реакции глюконеогенеза и объяснить, почему они нужны; связать цикл Кори с нагрузкой и восстановлением; понять гормональную регуляцию (инсулин / глюкагон).',
    location: 'Цитоплазма и митохондрии (печень, почки)',
    metaboliteIds: [
      'pyruvate',
      'oxaloacetate',
      'phosphoenolpyruvate',
      'fructose_1_6_bisphosphate',
      'fructose_6_phosphate',
      'glucose_6_phosphate',
      'glucose',
    ],
    reactionIds: [
      'r_pyruvate_carboxylase',
      'r_pepck',
      'r_pgm',
      'r_enolase',
      'r_pgk',
      'r_gapdh',
      'r_tpi',
      'r_aldolase',
      'r_fructose_1_6_bisphosphatase',
      'r_phosphoglucose_isomerase',
      'r_glucose_6_phosphatase',
    ],
  },
  {
    id: 'glycogen_metabolism',
    name: 'Обмен гликогена',
    shortName: 'Гликоген',
    color: '#b07800',
    description:
      'Синтез (гликогеногенез) и распад (гликогенолиз) гликогена в печени и мышцах. Позволяет быстро накапливать и мобилизовать глюкозу в ответ на изменение энергетического статуса.',
    educationalGoal:
      'Сравнить гликогенолиз в мышцах и печени; объяснить роль Г6Фазы; разобрать различные типы гликогенозов и их биохимическую основу.',
    location: 'Цитоплазма (печень, мышцы)',
    metaboliteIds: [
      'glycogen',
      'glucose_1_phosphate',
      'udp_glucose',
      'glucose_6_phosphate',
      'glucose',
    ],
    reactionIds: [
      'r_glycogen_phosphorylase',
      'r_phosphoglucomutase',
      'r_udp_glucose_pyrophosphorylase',
      'r_glycogen_synthase',
      'r_glucose_6_phosphatase',
    ],
  },
];

export const pathwayMap = new Map<string, MetabolicPathway>(
  pathways.map((p) => [p.id, p]),
);
