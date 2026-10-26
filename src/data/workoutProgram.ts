import { DayWorkout, Exercise } from '../types';

// Banco de Exercícios para Iniciantes Sem Equipamento
export const EXERCISES_LIBRARY: Record<string, Exercise> = {
  polichinelo_iniciante: {
    id: 'polichinelo_iniciante',
    name: 'Polichinelo de Baixo Impacto',
    muscleGroup: 'Corpo Inteiro',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'jumping_jacks',
    instructions: [
      'Fique em pé com os pés juntos e os braços ao lado do corpo.',
      'Dê um passo lateral com a perna direita enquanto eleva os braços acima da cabeça.',
      'Retorne à posição inicial e repita para o lado esquerdo de forma contínua.',
      'Mantenha o abdômen firme e respire ritmicamente.'
    ],
    beginnerTip: 'Sem impactos nos joelhos! Toque a ponta do pé no chão com suavidade e mantenha o ritmo constante.'
  },
  agachamento_livre: {
    id: 'agachamento_livre',
    name: 'Agachamento Livre com Apoio de Postura',
    muscleGroup: 'Pernas & Glúteos',
    reps: 12,
    sets: 3,
    restSeconds: 25,
    intensity: 'leve',
    iconType: 'squats',
    instructions: [
      'Posicione os pés na largura dos ombros, ligeiramente apontados para fora.',
      'Projete os quadris para trás como se fosse sentar em uma cadeira imaginária.',
      'Mantenha o peito aberto e a coluna alinhada.',
      'Desça até as coxas ficarem paralelas ao chão ou no limite do seu conforto, empurre pelos calcanhares para subir.'
    ],
    beginnerTip: 'Não deixe os joelhos fecharem para dentro ao subir. Se sentir insegurança, use uma cadeira atrás como guia.'
  },
  flexao_parede: {
    id: 'flexao_parede',
    name: 'Flexão Inclinada na Parede',
    muscleGroup: 'Braços & Peito',
    reps: 10,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'wall_pushup',
    instructions: [
      'Fique em pé de frente para a parede, a um passo de distância.',
      'Apoie as palmas das mãos na parede na altura e largura dos ombros.',
      'Flexione os cotovelos lentamente aproximando o peito da parede.',
      'Empurre firmemente com as mãos até esticar os braços sem travar as articulações.'
    ],
    beginnerTip: 'Excelente para quem nunca fez flexão. Quanto mais longe seus pés estiverem da parede, maior o esforço.'
  },
  ponte_gluteos: {
    id: 'ponte_gluteos',
    name: 'Elevação Pélvica (Ponte de Glúteos)',
    muscleGroup: 'Pernas & Glúteos',
    reps: 15,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'glute_bridge',
    instructions: [
      'Deite de costas no colchonete ou tapete com os joelhos dobrados e pés firmes no chão.',
      'Braços estendidos ao lado do quadril com as palmas voltadas para baixo.',
      'Eleve o quadril em direção ao teto, contraindo forte os glúteos no ponto mais alto.',
      'Segure por 1 segundo no topo e desça controladamente sem despencar.'
    ],
    beginnerTip: 'Protege a lombar e fortalece a cadeia posterior. Sinta a força vindo das nádegas e coxas, não da coluna.'
  },
  prancha_joelhos: {
    id: 'prancha_joelhos',
    name: 'Prancha Frontal com Apoio nos Joelhos',
    muscleGroup: 'Abdômen & Core',
    durationSeconds: 25,
    sets: 3,
    restSeconds: 25,
    intensity: 'leve',
    iconType: 'knee_plank',
    instructions: [
      'Apoie os antebraços e os joelhos no chão.',
      'Mantenha os cotovelos alinhados exatamente abaixo dos ombros.',
      'Forme uma linha reta dos ombros até os joelhos, ativando o abdômen como se fosse levar o umbigo até as costas.',
      'Mantenha a respiração fluida sem prender o ar.'
    ],
    beginnerTip: 'Não deixe o quadril cair nem subir demais. Se tremer é normal, o abdômen está sendo ativado!'
  },
  perdigueiro: {
    id: 'perdigueiro',
    name: 'Perdigueiro (Bird-Dog)',
    muscleGroup: 'Abdômen & Core',
    reps: 10,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'bird_dog',
    instructions: [
      'Posicione-se em 4 apoios no chão (mãos abaixo dos ombros e joelhos abaixo do quadril).',
      'Estenda o braço direito para frente e a perna esquerda para trás simultaneamente.',
      'Mantenha o corpo paralelo ao chão por 2 segundos.',
      'Retorne suavemente e alterne para o braço esquerdo e perna direita.'
    ],
    beginnerTip: 'Exercício de ouro para a postura e saúde da coluna vertebral. Concentre-se no equilíbrio e estabilidade.'
  },
  panturrilha_em_pe: {
    id: 'panturrilha_em_pe',
    name: 'Elevação de Panturrilha em Pé',
    muscleGroup: 'Pernas & Glúteos',
    reps: 15,
    sets: 3,
    restSeconds: 15,
    intensity: 'leve',
    iconType: 'calf_raises',
    instructions: [
      'Fique em pé próximo a uma parede ou encosto para manter o equilíbrio.',
      'Eleve os calcanhares o mais alto possível, ficando na ponta dos pés.',
      'Aperte a panturrilha no topo por 1 segundo.',
      'Desça lentamente sentindo a musculatura trabalhar.'
    ],
    beginnerTip: 'Melhora a circulação sanguínea das pernas e reduz o inchaço após dias sentado.'
  },
  circulos_bracos: {
    id: 'circulos_bracos',
    name: 'Círculos com os Braços & Ativação de Ombros',
    muscleGroup: 'Braços & Peito',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'arm_circles',
    instructions: [
      'Fique em pé com postura ereta e abra os braços na horizontal, na altura dos ombros.',
      'Faça giros pequenos e controlados para frente por 15 segundos.',
      'Sem abaixar os braços, inverta o movimento girando para trás por mais 15 segundos.',
      'Mantenha os ombros relaxados, longe das orelhas.'
    ],
    beginnerTip: 'Apesar de simples, queima e fortalece os ombros sem precisar de halteres!'
  },
  afundo_estatico: {
    id: 'afundo_estatico',
    name: 'Passada Estática / Afundo Suave',
    muscleGroup: 'Pernas & Glúteos',
    reps: 10,
    sets: 3,
    restSeconds: 25,
    intensity: 'moderado',
    iconType: 'lunges',
    instructions: [
      'Dê um passo longo para frente com uma das pernas.',
      'Mantenha o tronco reto e flexione ambos os joelhos em direção ao chão.',
      'O joelho de trás se aproxima do chão sem tocar com força.',
      'Empurre o chão com a perna da frente para retornar à posição inicial do afundo.'
    ],
    beginnerTip: 'Você pode segurar levemente na parede para manter a firmeza no início.'
  },
  flexao_joelhos: {
    id: 'flexao_joelhos',
    name: 'Flexão no Chão com Joelhos Apoiados',
    muscleGroup: 'Braços & Peito',
    reps: 8,
    sets: 3,
    restSeconds: 30,
    intensity: 'moderado',
    iconType: 'wall_pushup',
    instructions: [
      'Deite de bruços e posicione as mãos no chão na largura dos ombros.',
      'Mantenha os joelhos apoiados e cruze os pés atrás se preferir.',
      'Empurre o chão elevando o tronco em bloco unido.',
      'Desça controladamente até que o peito fique a quatro dedos do chão.'
    ],
    beginnerTip: 'O próximo passo de evolução da flexão na parede. Não deixe a lombar arquear.'
  },
  joelhos_altos_leve: {
    id: 'joelhos_altos_leve',
    name: 'Marcha Estacionária com Joelhos Elevados',
    muscleGroup: 'Corpo Inteiro',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 20,
    intensity: 'leve',
    iconType: 'high_knees',
    instructions: [
      'Fique em pé e comece a marchar no mesmo lugar.',
      'Eleve os joelhos alternadamente até a altura do quadril.',
      'Mova os braços em sincronia com as pernas, mantendo postura ereta.',
      'Acelere o ritmo conforme for se sentindo aquecido.'
    ],
    beginnerTip: 'Excelente para queimar calorias e melhorar a coordenação sem impacto nas articulações.'
  },
  alongamento_gato_vaca: {
    id: 'alongamento_gato_vaca',
    name: 'Mobilidade da Coluna (Gato e Vaca)',
    muscleGroup: 'Alongamento & Mobilidade',
    durationSeconds: 40,
    sets: 2,
    restSeconds: 15,
    intensity: 'leve',
    iconType: 'cat_cow',
    instructions: [
      'Fique em 4 apoios com as mãos sob os ombros e joelhos sob os quadris.',
      'Inspire, curve a coluna para baixo, empine o quadril e olhe suavemente para frente (Vaca).',
      'Expire, arqueie as costas para cima em direção ao teto, soltando o pescoço e olhando para o umbigo (Gato).',
      'Repita alternando as duas posturas de forma fluida e consciente.'
    ],
    beginnerTip: 'Alivia dores e tensões acumuladas nas costas causadas por passar muito tempo sentado.'
  },
  alongamento_completo: {
    id: 'alongamento_completo',
    name: 'Alongamento Global & Relaxamento',
    muscleGroup: 'Alongamento & Mobilidade',
    durationSeconds: 45,
    sets: 2,
    restSeconds: 15,
    intensity: 'leve',
    iconType: 'stretching',
    instructions: [
      'Sente-se confortavelmente no chão com as pernas cruzadas.',
      'Entrelace os dedos e estique os braços lá em cima, crescendo a coluna em direção ao teto.',
      'Incline suavemente o tronco para a direita e para a esquerda.',
      'Respire fundo 5 vezes pelo nariz e solte pela boca.'
    ],
    beginnerTip: 'Perfeito para relaxar a mente e avisar aos músculos que a missão do dia foi cumprida com sucesso!'
  }
};

// Gerador do Programa completo de 30 Dias para Iniciantes
export function generate30DaysProgram(): DayWorkout[] {
  const lib = EXERCISES_LIBRARY;

  return [
    // --- SEMANA 1: ADAPTAÇÃO & ATIVAÇÃO (Dias 1-7) ---
    {
      day: 1,
      week: 1,
      title: 'Dia 1: Ativação & Primeira Conquista',
      focus: 'Corpo Inteiro & Postura',
      description: 'O início da sua transformação! Treino leve de familiarização para despertar os músculos sem dor excessiva.',
      estimatedMinutes: 12,
      estimatedCalories: 75,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_parede,
        lib.ponte_gluteos,
        lib.alongamento_completo
      ]
    },
    {
      day: 2,
      week: 1,
      title: 'Dia 2: Pernas Firmes & Postura',
      focus: 'Membros Inferiores',
      description: 'Fortalecimento da base do corpo com exercícios de baixo impacto que protegem os joelhos e ativam os glúteos.',
      estimatedMinutes: 14,
      estimatedCalories: 85,
      isRestDay: false,
      exercises: [
        lib.joelhos_altos_leve,
        lib.agachamento_livre,
        lib.ponte_gluteos,
        lib.panturrilha_em_pe,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 3,
      week: 1,
      title: 'Dia 3: Braços Leves & Core',
      focus: 'Membros Superiores & Abdômen',
      description: 'Estimule a musculatura dos braços, ombros e peitoral utilizando a parede e estabilidade no solo.',
      estimatedMinutes: 13,
      estimatedCalories: 70,
      isRestDay: false,
      exercises: [
        lib.flexao_parede,
        lib.circulos_bracos,
        lib.prancha_joelhos,
        lib.perdigueiro,
        lib.alongamento_completo
      ]
    },
    {
      day: 4,
      week: 1,
      title: 'Dia 4: Descanso Ativo & Mobilidade',
      focus: 'Recuperação Muscular',
      description: 'O descanso faz parte do treino! Alongamentos suaves para lubrificar as articulações e acelerar a recuperação.',
      estimatedMinutes: 10,
      estimatedCalories: 40,
      isRestDay: true,
      restAdvice: 'Beba bastante água hoje e faça alongamentos leves se desejar. Seu corpo está assimilando os primeiros dias de treino.',
      exercises: [
        lib.alongamento_gato_vaca,
        lib.alongamento_completo
      ]
    },
    {
      day: 5,
      week: 1,
      title: 'Dia 5: Abdômen Firme & Estabilidade',
      focus: 'Core & Equilíbrio',
      description: 'Aprenda a ativar a musculatura profunda do abdômen para proteger a coluna e melhorar a postura do dia a dia.',
      estimatedMinutes: 14,
      estimatedCalories: 80,
      isRestDay: false,
      exercises: [
        lib.perdigueiro,
        lib.prancha_joelhos,
        lib.ponte_gluteos,
        lib.joelhos_altos_leve,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 6,
      week: 1,
      title: 'Dia 6: Circuito Cardio Leve',
      focus: 'Condicionamento Físico',
      description: 'Ritmo contínuo e alegre para queimar calorias e aumentar sua disposição para o final de semana.',
      estimatedMinutes: 15,
      estimatedCalories: 100,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.joelhos_altos_leve,
        lib.agachamento_livre,
        lib.panturrilha_em_pe,
        lib.alongamento_completo
      ]
    },
    {
      day: 7,
      week: 1,
      title: 'Dia 7: Celebração da 1ª Semana',
      focus: 'Recuperação & Alinhamento',
      description: 'Parabéns por completar sua primeira semana! Dedique este dia para repousar ou fazer uma caminhada leve.',
      estimatedMinutes: 8,
      estimatedCalories: 30,
      isRestDay: true,
      restAdvice: 'Primeira semana concluída com sucesso! Aproveite para pesar e conferir sua evolução no app.',
      exercises: [
        lib.alongamento_completo
      ]
    },

    // --- SEMANA 2: RESISTÊNCIA & RITMO (Dias 8-14) ---
    {
      day: 8,
      week: 2,
      title: 'Dia 8: Novo Ritmo de Força',
      focus: 'Corpo Inteiro',
      description: 'Começando a 2ª semana com um leve ganho de repetições. Seus músculos já reconhecem os movimentos básicos.',
      estimatedMinutes: 15,
      estimatedCalories: 105,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_parede,
        lib.ponte_gluteos,
        lib.prancha_joelhos
      ]
    },
    {
      day: 9,
      week: 2,
      title: 'Dia 9: Pernas Fortes & Passadas',
      focus: 'Membros Inferiores',
      description: 'Introdução suave à passada estática para fortalecer coxas e melhorar o equilíbrio corporal.',
      estimatedMinutes: 16,
      estimatedCalories: 110,
      isRestDay: false,
      exercises: [
        lib.joelhos_altos_leve,
        lib.afundo_estatico,
        lib.agachamento_livre,
        lib.panturrilha_em_pe,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 10,
      week: 2,
      title: 'Dia 10: Peito & Ombros Definidos',
      focus: 'Membros Superiores',
      description: 'Mais controle e sustentação para braços e postura com transição para flexão com joelhos.',
      estimatedMinutes: 15,
      estimatedCalories: 95,
      isRestDay: false,
      exercises: [
        lib.flexao_joelhos,
        lib.circulos_bracos,
        lib.flexao_parede,
        lib.perdigueiro,
        lib.alongamento_completo
      ]
    },
    {
      day: 11,
      week: 2,
      title: 'Dia 11: Descanso Ativo & Respiração',
      focus: 'Recuperação',
      description: 'Pausa merecida para recarregar as energias e evitar fadiga acumulada.',
      estimatedMinutes: 10,
      estimatedCalories: 45,
      isRestDay: true,
      restAdvice: 'Hidrate-se bem. Se sentir alguma musculatura dolorida, o alongamento do dia vai aliviar.',
      exercises: [
        lib.alongamento_gato_vaca,
        lib.alongamento_completo
      ]
    },
    {
      day: 12,
      week: 2,
      title: 'Dia 12: Core Blindado',
      focus: 'Abdômen & Lombar',
      description: 'Séries focadas na sustentação do tronco com prancha e perdigueiro.',
      estimatedMinutes: 15,
      estimatedCalories: 90,
      isRestDay: false,
      exercises: [
        lib.prancha_joelhos,
        lib.perdigueiro,
        lib.ponte_gluteos,
        lib.joelhos_altos_leve,
        lib.alongamento_completo
      ]
    },
    {
      day: 13,
      week: 2,
      title: 'Dia 13: Queima Dinâmica em Casa',
      focus: 'Cardio & Metabolismo',
      description: 'Circuito dinâmico para acelerar os batimentos com segurança e gastar energia.',
      estimatedMinutes: 16,
      estimatedCalories: 120,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.joelhos_altos_leve,
        lib.agachamento_livre,
        lib.afundo_estatico,
        lib.alongamento_completo
      ]
    },
    {
      day: 14,
      week: 2,
      title: 'Dia 14: Metade do Desafio!',
      focus: 'Recuperação & Balanço',
      description: 'Você chegou a 50% dos 30 dias! Sinta a diferença na respiração e disposição.',
      estimatedMinutes: 10,
      estimatedCalories: 40,
      isRestDay: true,
      restAdvice: 'Fantástico! 14 dias de consistência criaram um hábito poderoso na sua rotina.',
      exercises: [
        lib.alongamento_completo
      ]
    },

    // --- SEMANA 3: FORÇA & TONIFICAÇÃO (Dias 15-21) ---
    {
      day: 15,
      week: 3,
      title: 'Dia 15: Corpo Firme & Conectado',
      focus: 'Força Funcional',
      description: 'Iniciando a segunda metade do programa com mais confiança e postura sólida.',
      estimatedMinutes: 17,
      estimatedCalories: 125,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_joelhos,
        lib.ponte_gluteos,
        lib.prancha_joelhos
      ]
    },
    {
      day: 16,
      week: 3,
      title: 'Dia 16: Pernas Esculpidas',
      focus: 'Inferiores & Glúteos',
      description: 'Combinação potente de agachamento e afundo estático para tonificar coxas e quadris.',
      estimatedMinutes: 18,
      estimatedCalories: 130,
      isRestDay: false,
      exercises: [
        lib.agachamento_livre,
        lib.afundo_estatico,
        lib.ponte_gluteos,
        lib.panturrilha_em_pe,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 17,
      week: 3,
      title: 'Dia 17: Braços & Tronco Tonificados',
      focus: 'Superiores & Ombros',
      description: 'Foco na flexão com joelhos e ativação de ombros para ganhar firmeza nos braços.',
      estimatedMinutes: 17,
      estimatedCalories: 110,
      isRestDay: false,
      exercises: [
        lib.flexao_joelhos,
        lib.circulos_bracos,
        lib.flexao_parede,
        lib.perdigueiro,
        lib.alongamento_completo
      ]
    },
    {
      day: 18,
      week: 3,
      title: 'Dia 18: Descanso & Relaxamento Muscular',
      focus: 'Descanso Ativo',
      description: 'Permita que suas fibras musculares se regenerem e fiquem mais firmes e fortes.',
      estimatedMinutes: 10,
      estimatedCalories: 45,
      isRestDay: true,
      restAdvice: 'Durma pelo menos 7 a 8 horas hoje para maximizar os resultados dos seus treinos.',
      exercises: [
        lib.alongamento_gato_vaca,
        lib.alongamento_completo
      ]
    },
    {
      day: 19,
      week: 3,
      title: 'Dia 19: Core & Abdômen Definido',
      focus: 'Abdômen & Estabilidade',
      description: 'Aumento gradual de tempo na prancha para consolidar a força central do corpo.',
      estimatedMinutes: 18,
      estimatedCalories: 115,
      isRestDay: false,
      exercises: [
        lib.prancha_joelhos,
        lib.perdigueiro,
        lib.ponte_gluteos,
        lib.joelhos_altos_leve,
        lib.alongamento_completo
      ]
    },
    {
      day: 20,
      week: 3,
      title: 'Dia 20: Circuito Turbo Queima',
      focus: 'Cardio & Resistência',
      description: 'Treino contínuo e revigorante que acelera o metabolismo e dá sensação de dever cumprido.',
      estimatedMinutes: 18,
      estimatedCalories: 140,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.joelhos_altos_leve,
        lib.agachamento_livre,
        lib.afundo_estatico,
        lib.alongamento_completo
      ]
    },
    {
      day: 21,
      week: 3,
      title: 'Dia 21: Fim da 3ª Semana',
      focus: 'Recuperação',
      description: '21 dias! Estudos mostram que 21 dias são o tempo de criar um novo hábito de vida saudável.',
      estimatedMinutes: 10,
      estimatedCalories: 40,
      isRestDay: true,
      restAdvice: 'Você alcançou o marco dos 21 dias! A reta final dos 30 dias começa amanhã.',
      exercises: [
        lib.alongamento_completo
      ]
    },

    // --- SEMANA 4: RETA FINAL & CONQUISTA DOS 30 DIAS (Dias 22-30) ---
    {
      day: 22,
      week: 4,
      title: 'Dia 22: Força Total Iniciante',
      focus: 'Corpo Inteiro',
      description: 'Começando a reta final! Seu corpo já tem mais equilíbrio, firmeza e condicionamento.',
      estimatedMinutes: 18,
      estimatedCalories: 135,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_joelhos,
        lib.afundo_estatico,
        lib.prancha_joelhos
      ]
    },
    {
      day: 23,
      week: 4,
      title: 'Dia 23: Pernas de Aço',
      focus: 'Membros Inferiores',
      description: 'Séries consistentes para queimar as coxas e definir glúteos e panturrilhas.',
      estimatedMinutes: 19,
      estimatedCalories: 140,
      isRestDay: false,
      exercises: [
        lib.agachamento_livre,
        lib.afundo_estatico,
        lib.ponte_gluteos,
        lib.panturrilha_em_pe,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 24,
      week: 4,
      title: 'Dia 24: Tronco Firme & Braços',
      focus: 'Membros Superiores',
      description: 'Exercícios combinados de empurrar e sustentação com foco em peito e ombros.',
      estimatedMinutes: 18,
      estimatedCalories: 120,
      isRestDay: false,
      exercises: [
        lib.flexao_joelhos,
        lib.circulos_bracos,
        lib.prancha_joelhos,
        lib.perdigueiro,
        lib.alongamento_completo
      ]
    },
    {
      day: 25,
      week: 4,
      title: 'Dia 25: Descanso & Recuperação Estratégica',
      focus: 'Descanso Ativo',
      description: 'Recarregando o tanque para os últimos 5 dias do programa de 30 dias.',
      estimatedMinutes: 10,
      estimatedCalories: 40,
      isRestDay: true,
      restAdvice: 'Faltam só 5 dias! Mantenha a hidratação e visualize sua conquista final.',
      exercises: [
        lib.alongamento_gato_vaca,
        lib.alongamento_completo
      ]
    },
    {
      day: 26,
      week: 4,
      title: 'Dia 26: Abdômen de Ferro',
      focus: 'Core Avançado para Iniciantes',
      description: 'Sequência desafiadora de estabilidade do abdômen, sem machucar a coluna.',
      estimatedMinutes: 19,
      estimatedCalories: 125,
      isRestDay: false,
      exercises: [
        lib.prancha_joelhos,
        lib.perdigueiro,
        lib.ponte_gluteos,
        lib.joelhos_altos_leve,
        lib.alongamento_completo
      ]
    },
    {
      day: 27,
      week: 4,
      title: 'Dia 27: Cardio & Alta Disposição',
      focus: 'Metabolismo & Queima',
      description: 'Circuito animado com todos os movimentos aprendidos durante as semanas.',
      estimatedMinutes: 20,
      estimatedCalories: 150,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.joelhos_altos_leve,
        lib.agachamento_livre,
        lib.afundo_estatico,
        lib.alongamento_completo
      ]
    },
    {
      day: 28,
      week: 4,
      title: 'Dia 28: Força & Resistência Final',
      focus: 'Corpo Inteiro',
      description: 'Treino completo com excelente cadência e sensação de domínio físico.',
      estimatedMinutes: 20,
      estimatedCalories: 145,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_joelhos,
        lib.ponte_gluteos,
        lib.prancha_joelhos
      ]
    },
    {
      day: 29,
      week: 4,
      title: 'Dia 29: Penúltimo Desafio & Postura',
      focus: 'Alinhamento & Força',
      description: 'A véspera da sua grande vitória! Sinta o quanto sua resistência e postura melhoraram.',
      estimatedMinutes: 16,
      estimatedCalories: 110,
      isRestDay: false,
      exercises: [
        lib.perdigueiro,
        lib.agachamento_livre,
        lib.circulos_bracos,
        lib.panturrilha_em_pe,
        lib.alongamento_gato_vaca
      ]
    },
    {
      day: 30,
      week: 4,
      title: 'Dia 30: Grande Conclusão dos 30 Dias!',
      focus: 'Celebração & Corpo Inteiro',
      description: 'O grande dia! Você provou a si mesmo que é capaz de manter a consistência e transformar sua saúde em casa.',
      estimatedMinutes: 20,
      estimatedCalories: 160,
      isRestDay: false,
      exercises: [
        lib.polichinelo_iniciante,
        lib.agachamento_livre,
        lib.flexao_joelhos,
        lib.afundo_estatico,
        lib.ponte_gluteos,
        lib.prancha_joelhos,
        lib.alongamento_completo
      ]
    }
  ];
}
