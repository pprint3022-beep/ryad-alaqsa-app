/**
 * Upper-primary French lessons (CE2 → CM2) for the Institut Ryad Al Aqsa prototype.
 *
 * Standalone CommonJS content module: nine published lessons, each with a
 * French base version plus a rephrased French variant and an English variant
 * that stay structurally aligned (same section / key-term / example order).
 * Illustrations reference only the approved diagram paths.
 */
module.exports = {
  lessonContents: [
    {
      id: 'lc_v4_fr_upper_1', lessonId: 'cur_l_p3_sub_fr:0', curriculumId: 'cur_l_p3_sub_fr', levelId: 'l_p3',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Un texte court : la famille', intro: 'Lisons ensemble un petit texte qui présente la famille de Sarah et apprenons à le comprendre.',
      sections: [
        { id: 'lc_v4_fr_upper_1_s1', heading: 'Le texte', body: '« Voici la famille de Sarah. Son père s’appelle Karim et sa mère s’appelle Fatima. Elle a un frère, Youssef, et une sœur, Amina. Ils habitent à Casablanca. »', icon: '📖', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_1_s2', heading: 'Qui sont-ils ?', body: 'Le texte présente cinq personnes : le père, la mère, le frère, la sœur et Sarah. On appelle ces personnes les personnages du texte.', icon: '👨‍👩‍👧‍👦', mediaType: 'image', mediaUrl: '/illustrations/diagrams/diagram-family.svg', durationMin: 2 },
        { id: 'lc_v4_fr_upper_1_s3', heading: 'Les mots de la famille', body: 'Les mots « père », « mère », « frère » et « sœur » nomment des liens de parenté. Sarah dit « mon père », « ma mère » : l’article change selon le genre.', icon: '🔤', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_1_s4', heading: 'À toi de jouer', body: 'Relis le texte et réponds : comment s’appelle le frère de Sarah ? Dans quelle ville habite sa famille ?', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un texte', definition: 'Un ensemble de phrases écrites qui racontent quelque chose ou donnent une information.' },
        { term: 'un personnage', definition: 'Une personne dont parle le texte.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_1_we1', prompt: 'Dans le texte, qui est Amina ?', steps: ['Je cherche le nom « Amina » dans le texte.', 'Je lis la phrase : « Elle a un frère, Youssef, et une sœur, Amina. »', 'Le mot « sœur » me dit qui est Amina.'], answer: 'Amina est la sœur de Sarah.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_1'], estimatedMinutes: 11, difficulty: 'easy', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_2', lessonId: 'cur_l_p3_sub_fr:1', curriculumId: 'cur_l_p3_sub_fr', levelId: 'l_p3',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Comprendre un texte', intro: 'Pour bien lire, il faut savoir repérer les informations importantes et répondre aux questions du texte.',
      sections: [
        { id: 'lc_v4_fr_upper_2_s1', heading: 'Lire deux fois', body: 'On lit le texte une première fois pour comprendre le sens général, puis une deuxième fois pour chercher les détails. Une lecture lente aide à mieux retenir.', icon: '👀', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_2_s2', heading: 'Les mots-clés', body: 'Les mots qui reviennent souvent sont des mots-clés. Souligne-les : ils t’aident à retenir l’essentiel et à retrouver une information vite.', icon: '🔑', mediaType: 'image', mediaUrl: '/illustrations/icon-reading.svg', durationMin: 2 },
        { id: 'lc_v4_fr_upper_2_s3', heading: 'Les questions qui aident', body: 'Pose-toi toujours les questions : Qui ? Quoi ? Où ? Quand ? Pourquoi ? Les réponses se trouvent dans le texte, pas seulement dans ta mémoire.', icon: '❓', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_2_s4', heading: 'À toi de jouer', body: 'Lis : « Ce matin, Zacharia porte un sac rouge et va à l’école avec sa sœur. » Où va Zacharia et quelle couleur est son sac ?', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un mot-clé', definition: 'Un mot important qui porte le sens principal d’une phrase ou d’un texte.' },
        { term: 'l’idée principale', definition: 'Le sens le plus important que le texte veut nous transmettre.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_2_we1', prompt: 'D’après la phrase « Ce matin, Zacharia porte un sac rouge et va à l’école avec sa sœur », avec qui va-t-il à l’école ?', steps: ['Je cherche le mot « avec » dans la phrase.', 'Je lis la suite : « avec sa sœur ».', 'Je réponds par une phrase complète.'], answer: 'Zacharia va à l’école avec sa sœur.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_2'], estimatedMinutes: 12, difficulty: 'easy', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_3', lessonId: 'cur_l_p3_sub_fr:3', curriculumId: 'cur_l_p3_sub_fr', levelId: 'l_p3',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Grammaire de base : le nom et le verbe', intro: 'Toute phrase est construite avec des mots : découvrons le nom et le verbe, deux piliers de la phrase.',
      sections: [
        { id: 'lc_v4_fr_upper_3_s1', heading: 'Le nom', body: 'Le nom est un mot qui désigne une personne, un animal, un lieu ou une chose : élève, chat, école, crayon. On reconnaît souvent le nom par son article : le, la, les, un, une.', icon: '🏷️', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_3_s2', heading: 'Le verbe', body: 'Le verbe est le mot qui exprime une action ou un état : manger, courir, être, dormir. C’est lui qui fait vivre la phrase : « Le chat dort. »', icon: '⚡', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_3_s3', heading: 'Trouver le verbe', body: 'Pour trouver le verbe, cherche le mot qui change quand tu modifies le temps ou la personne : je mange, tu manges, il mange. Le verbe se conjugue.', icon: '🔎', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_3_s4', heading: 'La phrase de base', body: 'Une phrase simple contient au moins un nom et un verbe : « L’oiseau chante. » Le nom fait l’action, le verbe dit ce qu’il fait.', icon: '🧩', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_3_s5', heading: 'À toi de jouer', body: 'Dans « Le garçon lit un livre », souligne le nom et entoure le verbe. Combien de noms comptes-tu ?', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un nom', definition: 'Un mot qui nomme une personne, un animal, un lieu ou une chose.' },
        { term: 'un verbe', definition: 'Un mot qui exprime une action ou un état et qui se conjugue.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_3_we1', prompt: 'Dans la phrase « La fille dessine une fleur », trouve le nom et le verbe.', steps: ['Je cherche les mots qui nomment : « fille » et « fleur » sont des noms.', 'Je cherche le mot d’action : « dessine » dit ce que fait la fille.', 'Je vérifie : « dessine » se conjugue — je dessine, tu dessines.'], answer: 'Les noms sont « fille » et « fleur » ; le verbe est « dessine ».' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_3'], estimatedMinutes: 13, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_4', lessonId: 'cur_l_p4_sub_fr:1', curriculumId: 'cur_l_p4_sub_fr', levelId: 'l_p4',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Comprendre un paragraphe', intro: 'Un paragraphe regroupe plusieurs phrases autour d’une même idée : apprenons à la dégager.',
      sections: [
        { id: 'lc_v4_fr_upper_4_s1', heading: 'Qu’est-ce qu’un paragraphe ?', body: 'Un paragraphe est un ensemble de phrases qui parlent du même sujet. Il commence généralement par un retrait ou un nouvel alinéa.', icon: '📄', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_4_s2', heading: 'L’idée directrice', body: 'Chaque paragraphe contient une idée principale, souvent dans la première phrase. Les autres phrases l’expliquent ou donnent des exemples.', icon: '💡', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_4_s3', heading: 'Les phrases d’appui', body: 'Repère les phrases qui apportent une précision ou un exemple : elles servent de preuves à l’idée directrice et rendent le texte plus clair.', icon: '🧱', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_4_s4', heading: 'À toi de jouer', body: 'Lis un paragraphe sur la pluie et surligne la phrase qui résume l’idée principale, puis celles qui donnent des exemples.', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un paragraphe', definition: 'Un groupe de phrases qui traitent toutes du même sujet.' },
        { term: 'l’idée directrice', definition: 'L’idée centrale autour de laquelle s’organise un paragraphe.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_4_we1', prompt: 'Paragraphe : « La pluie est utile aux cultures. Elle arrose les champs sans que les agriculteurs aient à le faire. Grâce à elle, les légumes poussent bien. » Quelle est l’idée directrice ?', steps: ['Je lis toutes les phrases du paragraphe.', 'La première phrase parle de l’utilité de la pluie pour les cultures.', 'Les deux autres phrases donnent des exemples : elle arrose et aide les légumes à pousser.'], answer: 'L’idée directrice est que la pluie est utile aux cultures.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_4'], estimatedMinutes: 12, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_5', lessonId: 'cur_l_p4_sub_fr:2', curriculumId: 'cur_l_p4_sub_fr', levelId: 'l_p4',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Écrire un petit texte', intro: 'Savoir rédiger quelques phrases claires permet de raconter une expérience ou décrire un lieu.',
      sections: [
        { id: 'lc_v4_fr_upper_5_s1', heading: 'Choisir un sujet', body: 'Avant d’écrire, choisis un sujet simple : une sortie, un ami, un animal. Rassemble quelques idées avant de commencer.', icon: '💡', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_5_s2', heading: 'Ordonner les idées', body: 'Classe tes idées dans un ordre logique : le début, les étapes, la fin. Des mots comme « d’abord », « puis », « enfin » guident le lecteur.', icon: '🗂️', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_5_s3', heading: 'Écrire des phrases', body: 'Écris des phrases courtes avec un nom et un verbe. Vérifie la ponctuation : une majuscule au début et un point à la fin.', icon: '✍️', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_5_s4', heading: 'Relire et corriger', body: 'Après avoir écrit, relis-toi : les phrases sont-elles claires ? Les mots sont-ils bien écrits ? Corrige les fautes avant de rendre ton texte.', icon: '🔍', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_5_s5', heading: 'À toi de jouer', body: 'Écris trois phrases sur ta journée : où tu es allé, ce que tu as fait et ce que tu as aimé.', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un brouillon', definition: 'Une première version d’un texte, écrite avant de le corriger.' },
        { term: 'un mot de liaison', definition: 'Un mot qui relie les phrases et montre l’ordre des idées.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_5_we1', prompt: 'Écris un petit texte de trois phrases sur une promenade au parc.', steps: ['Je commence par dire où je vais : « Hier, je suis allé au parc avec ma sœur. »', 'Je raconte une action : « Nous avons joué au ballon sur l’herbe. »', 'Je termine par un ressenti : « Nous étions très contents. »'], answer: 'Hier, je suis allé au parc avec ma sœur. Nous avons joué au ballon sur l’herbe. Nous étions très contents.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_5'], estimatedMinutes: 14, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_6', lessonId: 'cur_l_p5_sub_fr:0', curriculumId: 'cur_l_p5_sub_fr', levelId: 'l_p5',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Le texte littéraire', intro: 'Un texte littéraire raconte une histoire ou décrit un monde avec des mots choisis : entrons dans l’imaginaire.',
      sections: [
        { id: 'lc_v4_fr_upper_6_s1', heading: 'Raconter une histoire', body: 'Le texte littéraire invente une histoire : il présente des personnages, un lieu et des événements. Le lecteur suit l’intrigue avec curiosité.', icon: '📚', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_6_s2', heading: 'Le cadre et les personnages', body: 'Le cadre dit où et quand se passe l’histoire ; les personnages sont ceux qui vivent les événements. Une forêt en automne peut servir de cadre à un conte.', icon: '🎭', mediaType: 'image', mediaUrl: '/illustrations/diagrams/diagram-seasons.svg', durationMin: 2 },
        { id: 'lc_v4_fr_upper_6_s3', heading: 'Les mots imagés', body: 'L’auteur emploie des comparaisons et des images pour faire voir, entendre ou ressentir : « le vent chantait comme une flûte ». Ces mots rendent le récit vivant.', icon: '🌈', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_6_s4', heading: 'Le déroulement', body: 'Une histoire suit souvent trois temps : une situation de départ, un problème, puis une solution. Repérer ces étapes aide à résumer le texte.', icon: '🎬', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_6_s5', heading: 'À toi de jouer', body: 'Après la lecture d’un conte, nomme les personnages, le lieu et l’événement principal, puis raconte la fin avec tes mots.', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un personnage', definition: 'Un être qui agit dans une histoire et participe aux événements.' },
        { term: 'une image littéraire', definition: 'Une expression qui compare ou embellit la réalité pour toucher le lecteur.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_6_we1', prompt: 'Dans « Le vent chantait comme une flûte dans les arbres », quelle image littéraire reconnais-tu et que fait-elle ?', steps: ['Je repère le mot « comme », qui introduit une comparaison.', 'Je compare le chant du vent au son d’une flûte.', 'L’image rend le paysage vivant et agréable à entendre.'], answer: 'C’est une comparaison : le vent est comparé à une flûte, ce qui rend la scène vivante.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_6'], estimatedMinutes: 14, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_7', lessonId: 'cur_l_p5_sub_fr:3', curriculumId: 'cur_l_p5_sub_fr', levelId: 'l_p5',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Le passé composé', intro: 'Le passé composé sert à raconter des actions terminées : découvrons comment le construire.',
      sections: [
        { id: 'lc_v4_fr_upper_7_s1', heading: 'À quoi il sert', body: 'Le passé composé exprime une action passée et terminée : « Hier, j’ai joué au football. » Il oppose une action précise à un état qui dure.', icon: '⏳', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_7_s2', heading: 'La construction', body: 'On le forme avec l’auxiliaire « avoir » au présent + le participe passé du verbe : j’ai mangé, tu as couru, nous avons dansé.', icon: '🧱', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_7_s3', heading: 'Les verbes avec « être »', body: 'Quelques verbes de mouvement prennent « être » : aller, venir, arriver, partir, tomber. On dit « je suis allé » et « elle est partie ».', icon: '🚶', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_7_s4', heading: 'L’accord du participe', body: 'Avec « être », le participe s’accorde avec le sujet : il est allé, elle est allée, ils sont allés. Avec « avoir », il ne change pas si le complément est placé après.', icon: '✅', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_7_s5', heading: 'À toi de jouer', body: 'Mets au passé composé : « Je mange une pomme », « Nous allons à la piscine ».', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un auxiliaire', definition: 'Un verbe (avoir ou être) qui aide à construire un temps composé.' },
        { term: 'un participe passé', definition: 'La forme du verbe utilisée après l’auxiliaire pour former le passé composé.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_7_we1', prompt: 'Mets la phrase au passé composé : « Elle joue dans le jardin. »', steps: ['Je choisis l’auxiliaire : le verbe « jouer » se construit avec « avoir ».', 'Je conjugue « avoir » au présent : « elle a ».', 'J’ajoute le participe passé « joué » : « Elle a joué dans le jardin. »'], answer: 'Elle a joué dans le jardin.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_7'], estimatedMinutes: 15, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_8', lessonId: 'cur_l_p6_sub_fr:0', curriculumId: 'cur_l_p6_sub_fr', levelId: 'l_p6',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Le texte poétique', intro: 'Le poème joue avec les sons et les images : apprenons à le lire et à en saisir le sens.',
      sections: [
        { id: 'lc_v4_fr_upper_8_s1', heading: 'Qu’est-ce qu’un poème ?', body: 'Un poème est un texte court où les mots choisis créent une image ou une émotion. Il ne se lit pas comme une histoire mais comme une chanson.', icon: '🎵', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_8_s2', heading: 'Les vers et les strophes', body: 'Le poème est découpé en vers (lignes courtes) regroupés en strophes. Compter les vers aide à voir la forme du poème.', icon: '📜', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_8_s3', heading: 'Les rimes', body: 'Les rimes sont des sons identiques à la fin de deux vers : « chat » et « matin » ne riment pas, mais « chat » et « rat » riment. Elles donnent de la musique au texte.', icon: '🔁', mediaType: 'image', mediaUrl: '/illustrations/diagrams/diagram-animals.svg', durationMin: 2 },
        { id: 'lc_v4_fr_upper_8_s4', heading: 'L’image poétique', body: 'Le poète compare ou personnifie : « la lune sourit ». Ces images éveillent les sens et font naître un sentiment chez le lecteur.', icon: '🌙', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_8_s5', heading: 'À toi de jouer', body: 'Lis un poème sur un animal, repère les rimes et explique l’image que tu préfères avec tes mots.', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'un vers', definition: 'Une ligne courte qui constitue une unité du poème.' },
        { term: 'une rime', definition: 'La répétition d’un même son à la fin de deux ou plusieurs vers.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_8_we1', prompt: 'Dans « Le petit chat dort sur le tapis, la lune brille et le silence aussi », quels mots riment ?', steps: ['Je lis la fin de chaque vers à voix haute.', '« tapis » et « aussi » se terminent par le même son : -i.', 'Je vérifie que les autres mots ne riment pas entre eux.'], answer: 'Les mots « tapis » et « aussi » riment ensemble.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_8'], estimatedMinutes: 14, difficulty: 'medium', prerequisites: [], status: 'published',
    },
    {
      id: 'lc_v4_fr_upper_9', lessonId: 'cur_l_p6_sub_fr:3', curriculumId: 'cur_l_p6_sub_fr', levelId: 'l_p6',
      subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
      title: 'Grammaire et conjugaison', intro: 'À l’école supérieure, on affine sa grammaire : accords, temps et modes rendent la phrase plus précise.',
      sections: [
        { id: 'lc_v4_fr_upper_9_s1', heading: 'L’accord sujet-verbe', body: 'Le verbe s’accorde avec son sujet en personne et en nombre : « je chante », « nous chantons ». Repère d’abord le sujet avant d’écrire le verbe.', icon: '🔗', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_9_s2', heading: 'Le genre et le nombre', body: 'Les noms et adjectifs ont un genre (masculin/féminin) et un nombre (singulier/pluriel) : « un petit chien », « de petites chiennes ».', icon: '🔢', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_9_s3', heading: 'Les temps du récit', body: 'Pour raconter, on choisit le passé composé pour les actions terminées et l’imparfait pour la description ou l’habitude : « Il pleuvait quand il est sorti. »', icon: '🕰️', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_9_s4', heading: 'Les compléments', body: 'Le COD répond à « quoi ? » après le verbe : « Je mange une pomme ». Le COI répond à « à qui ? » : « Je parle à mon ami ».', icon: '➕', mediaType: 'text', mediaUrl: '', durationMin: 2 },
        { id: 'lc_v4_fr_upper_9_s5', heading: 'À toi de jouer', body: 'Corrige : « Les filles est contentes », « Il a aller au marché ». Explique chaque correction.', icon: '🎯', mediaType: 'text', mediaUrl: '', durationMin: 2 },
      ],
      keyTerms: [
        { term: 'l’accord', definition: 'La règle qui rend le verbe ou l’adjectif conforme au sujet.' },
        { term: 'un complément d’objet', definition: 'Un mot ou groupe de mots qui complète le sens du verbe.' },
      ],
      workedExamples: [
        { id: 'lc_v4_fr_upper_9_we1', prompt: 'Corrige la phrase : « Les oiseaux chante dans le jardin. »', steps: ['Je repère le sujet : « les oiseaux » est un nom masculin pluriel.', 'Le verbe doit donc être à la 3e personne du pluriel : « chantent ».', 'La phrase corrigée : « Les oiseaux chantent dans le jardin. »'], answer: 'Les oiseaux chantent dans le jardin.' },
      ],
      quizQuestionIds: ['q_v4_fr_upper_9'], estimatedMinutes: 15, difficulty: 'medium', prerequisites: [], status: 'published',
    },
  ],
  translations: {
    lc_v4_fr_upper_1: {
      fr: {
        title: 'Lire un court texte : la famille',
        intro: 'Découvrons un mini-texte sur la famille de Sarah et entraînons-nous à en dégager les informations.',
        sections: [
          { heading: 'Le petit texte', body: '« Voilà la famille de Sarah. Karim est son papa et Fatima est sa maman. Elle a un frère prénommé Youssef et une sœur prénommée Amina. La famille vit à Casablanca. »' },
          { heading: 'Les personnes du texte', body: 'Cinq personnes apparaissent dans le passage : le papa, la maman, le frère, la sœur et Sarah. On donne le nom de personnages à ces personnes.' },
          { heading: 'Le vocabulaire de la parenté', body: 'Les termes « papa », « maman », « frère » et « sœur » désignent des liens familiaux. Sarah écrit « mon papa » mais « ma maman » : l’article s’accorde au genre.' },
          { heading: 'À toi de répondre', body: 'Reprends le texte et cherche le prénom du frère de Sarah, puis la ville où vit la famille.' },
        ],
        keyTerms: [
          { term: 'un texte', definition: 'Plusieurs phrases écrites ensemble qui racontent une histoire ou transmettent une information.' },
          { term: 'un personnage', definition: 'La personne dont le texte parle et dont il raconte les actions.' },
        ],
        workedExamples: [
          { prompt: 'Qui est Amina d’après le passage ?', steps: ['Je repère le prénom « Amina » dans la phrase.', 'Je relis : « …et une sœur, Amina. »', 'Le mot « sœur » m’indique le lien de parenté.'], answer: 'Amina est la sœur de Sarah.' },
        ],
      },
      en: {
        title: 'A short text: the family',
        intro: 'Let’s read a short text about Sarah’s family and practise finding the information in it.',
        sections: [
          { heading: 'The text', body: '“This is Sarah’s family. Her father is called Karim and her mother is called Fatima. She has a brother, Youssef, and a sister, Amina. They live in Casablanca.”' },
          { heading: 'Who are they?', body: 'The text introduces five people: the father, the mother, the brother, the sister and Sarah. We call these people the characters of the text.' },
          { heading: 'Family words', body: 'The words “father”, “mother”, “brother” and “sister” name family relationships. Sarah says “my father” and “my mother”: the word changes with the gender.' },
          { heading: 'Your turn', body: 'Read the text again and answer: what is the name of Sarah’s brother? Which city does the family live in?' },
        ],
        keyTerms: [
          { term: 'a text', definition: 'A group of written sentences that tell a story or give information.' },
          { term: 'a character', definition: 'A person that the text talks about.' },
        ],
        workedExamples: [
          { prompt: 'In the text, who is Amina?', steps: ['I look for the name “Amina” in the text.', 'I read the sentence: “...and a sister, Amina.”', 'The word “sister” tells me who Amina is.'], answer: 'Amina is Sarah’s sister.' },
        ],
      },
    },
    lc_v4_fr_upper_2: {
      fr: {
        title: 'Savoir comprendre un texte lu',
        intro: 'Une bonne lecture consiste à repérer les renseignements utiles et à répondre précisément aux questions posées.',
        sections: [
          { heading: 'Deux lectures valent mieux qu’une', body: 'Une première lecture donne le sens d’ensemble ; une seconde lecture permet de relever les détails. Lis lentement pour mieux te souvenir de ce que tu as lu.' },
          { heading: 'Repérer les mots importants', body: 'Les mots qui se répètent sont souvent les mots-clés. Surligne-les : ils te guident vers l’essentiel et te font gagner du temps quand tu cherches une réponse.' },
          { heading: 'Les cinq questions utiles', body: 'Interroge le texte avec Qui ? Quoi ? Où ? Quand ? Pourquoi ? Va toujours chercher la preuve dans les phrases avant de répondre.' },
          { heading: 'Exerce-toi', body: 'Lis cette phrase : « Ce matin, Zacharia porte un sac rouge et va à l’école avec sa sœur. » Où se rend-il et de quelle couleur est son sac ?' },
        ],
        keyTerms: [
          { term: 'un mot-clé', definition: 'Un mot essentiel qui résume le sens d’une phrase ou d’un passage.' },
          { term: 'l’idée principale', definition: 'Le message essentiel que l’auteur souhaite faire passer dans son texte.' },
        ],
        workedExamples: [
          { prompt: 'Dans la phrase sur Zacharia, qui l’accompagne à l’école ?', steps: ['Je repère le mot « avec » dans l’énoncé.', 'Je lis ce qui suit : « avec sa sœur ».', 'Je formule ma réponse en une phrase entière.'], answer: 'Zacharia est accompagné par sa sœur.' },
        ],
      },
      en: {
        title: 'Understanding a text',
        intro: 'Good reading means finding the useful information and answering questions precisely.',
        sections: [
          { heading: 'Read it twice', body: 'A first reading gives the overall meaning; a second reading helps you find details. Read slowly so you remember what you have read.' },
          { heading: 'Spot the key words', body: 'Words that come up again and again are often key words. Underline them: they lead you to the main point and save time when you look for an answer.' },
          { heading: 'Five helpful questions', body: 'Ask the text: Who? What? Where? When? Why? Always find proof in the sentences before you answer.' },
          { heading: 'Try it', body: 'Read this sentence: “This morning, Zacharia is carrying a red bag and going to school with his sister.” Where is he going and what colour is his bag?' },
        ],
        keyTerms: [
          { term: 'a key word', definition: 'An important word that carries the main meaning of a sentence or text.' },
          { term: 'the main idea', definition: 'The most important message the writer wants to share in the text.' },
        ],
        workedExamples: [
          { prompt: 'In the sentence about Zacharia, who goes with him to school?', steps: ['I find the word “with” in the sentence.', 'I read what follows: “with his sister”.', 'I write my answer as a full sentence.'], answer: 'Zacharia goes to school with his sister.' },
        ],
      },
    },
    lc_v4_fr_upper_3: {
      fr: {
        title: 'Les bases de la grammaire : nom et verbe',
        intro: 'Les phrases se construisent grâce à des mots ; attardons-nous sur deux d’entre eux, le nom et le verbe.',
        sections: [
          { heading: 'Reconnaître un nom', body: 'Le nom désigne une personne, un être vivant, un endroit ou un objet : élève, chien, plage, cahier. Son article (le, la, les, un, une) aide à le repérer.' },
          { heading: 'Le rôle du verbe', body: 'Le verbe indique ce qu’on fait ou ce qu’on est : sauter, lire, être, rester. Il est le moteur de la phrase : « Le chien aboie. »' },
          { heading: 'Un test simple pour le verbe', body: 'Change la personne ou le temps : je saute, tu sautes, nous sauterons. Si le mot se transforme, c’est un verbe, car il se conjugue.' },
          { heading: 'Construire une phrase', body: 'Une phrase minimale associe au moins un nom et un verbe : « Le soleil brille. » Le nom est celui qui agit, le verbe annonce l’action.' },
          { heading: 'À toi de repérer', body: 'Dans « Le garçon lit un livre », barre les noms et encadre le verbe. Combien de noms trouve-tu ?' },
        ],
        keyTerms: [
          { term: 'un nom', definition: 'Un mot qui sert à nommer une personne, un animal, un endroit ou un objet.' },
          { term: 'un verbe', definition: 'Un mot qui dit une action ou un état et qui varie selon la personne et le temps.' },
        ],
        workedExamples: [
          { prompt: 'Repère les noms et le verbe dans « La fille dessine une fleur ».', steps: ['Je repère les mots qui nomment : « fille » et « fleur ».', 'Je cherche l’action : « dessine » indique ce que fait la fille.', 'Je confirme avec une autre forme : je dessine, tu dessines.'], answer: 'Les noms : « fille » et « fleur » ; le verbe : « dessine ».' },
        ],
      },
      en: {
        title: 'Basic grammar: nouns and verbs',
        intro: 'Sentences are built from words; let’s look at two of them, the noun and the verb.',
        sections: [
          { heading: 'Recognising a noun', body: 'A noun names a person, a living thing, a place or an object: pupil, dog, beach, notebook. Its article (the, a) helps you spot it.' },
          { heading: 'The job of the verb', body: 'A verb says what someone does or what they are: jump, read, be, stay. It is the engine of the sentence: “The dog barks.”' },
          { heading: 'A simple verb test', body: 'Change the person or the tense: I jump, you jump, we will jump. If the word changes, it is a verb because it is conjugated.' },
          { heading: 'Building a sentence', body: 'A minimal sentence has at least one noun and one verb: “The sun shines.” The noun does the action and the verb tells us what happens.' },
          { heading: 'Your turn to spot', body: 'In “The boy reads a book”, underline the nouns and circle the verb. How many nouns can you find?' },
        ],
        keyTerms: [
          { term: 'a noun', definition: 'A word used to name a person, an animal, a place or a thing.' },
          { term: 'a verb', definition: 'A word that expresses an action or a state and changes with person and tense.' },
        ],
        workedExamples: [
          { prompt: 'Find the nouns and the verb in “The girl draws a flower”.', steps: ['I look for naming words: “girl” and “flower” are nouns.', 'I look for the action: “draws” tells what the girl does.', 'I check another form: I draw, you draw.'], answer: 'The nouns are “girl” and “flower”; the verb is “draws”.' },
        ],
      },
    },
    lc_v4_fr_upper_4: {
      fr: {
        title: 'Saisir l’essentiel d’un paragraphe',
        intro: 'Plusieurs phrases peuvent former un paragraphe ; voyons comment en dégager l’idée centrale.',
        sections: [
          { heading: 'Définir le paragraphe', body: 'Un paragraphe rassemble des phrases qui se rapportent à un unique sujet. Un nouvel alinéa ou un retrait signale généralement son début.' },
          { heading: 'Trouver l’idée centrale', body: 'Chaque paragraphe tourne autour d’une idée maîtresse, le plus souvent énoncée dans la première phrase. Les phrases suivantes la développent.' },
          { heading: 'Reconnaître les exemples', body: 'Les phrases qui fournissent une explication ou un exemple sont des phrases d’appui : elles prouvent l’idée centrale et facilitent la compréhension.' },
          { heading: 'Mets-toi à l’essai', body: 'Dans un paragraphe traitant de la pluie, repère d’abord la phrase qui résume le sujet, puis celles qui illustrent ce propos.' },
        ],
        keyTerms: [
          { term: 'un paragraphe', definition: 'Une suite de phrases qui développent toutes le même thème.' },
          { term: 'l’idée directrice', definition: 'Le point central auquel se rattachent toutes les phrases d’un paragraphe.' },
        ],
        workedExamples: [
          { prompt: '« La pluie est utile aux cultures. Elle arrose les champs sans effort des agriculteurs. Grâce à elle, les légumes poussent bien. » Quelle idée ressort ?', steps: ['Je parcours l’ensemble des phrases.', 'La phrase d’ouverture annonce que la pluie aide les cultures.', 'Les autres phrases montrent comment : elle arrose et fait pousser les légumes.'], answer: 'L’idée directrice : la pluie est bénéfique pour les cultures.' },
        ],
      },
      en: {
        title: 'Understanding a paragraph',
        intro: 'Several sentences can form one paragraph; let’s see how to work out its central idea.',
        sections: [
          { heading: 'What is a paragraph?', body: 'A paragraph brings together sentences that all talk about the same subject. A new line or an indent usually marks where it begins.' },
          { heading: 'Finding the main idea', body: 'Every paragraph centres on one main idea, often stated in the first sentence. The other sentences explain it or give examples.' },
          { heading: 'Spotting supporting sentences', body: 'Sentences that add a detail or an example are supporting sentences: they prove the main idea and make the text clearer.' },
          { heading: 'Your turn', body: 'In a paragraph about rain, first underline the sentence that sums up the topic, then the ones that give examples.' },
        ],
        keyTerms: [
          { term: 'a paragraph', definition: 'A group of sentences that all deal with the same subject.' },
          { term: 'the main idea', definition: 'The central point around which all the sentences of a paragraph are organised.' },
        ],
        workedExamples: [
          { prompt: '“Rain is useful for crops. It waters the fields without the farmers having to do it. Thanks to it, vegetables grow well.” What is the main idea?', steps: ['I read all the sentences in the paragraph.', 'The first sentence says rain helps crops.', 'The other two give examples: it waters and helps vegetables grow.'], answer: 'The main idea is that rain is useful for crops.' },
        ],
      },
    },
    lc_v4_fr_upper_5: {
      fr: {
        title: 'Rédiger un court texte',
        intro: 'Quelques phrases bien construites suffisent pour raconter un souvenir ou présenter un endroit.',
        sections: [
          { heading: 'Décider du sujet', body: 'Choisis d’abord un thème facile : une excursion, un camarade, un animal familier. Note deux ou trois idées avant de prendre ta plume.' },
          { heading: 'Classer ses idées', body: 'Ordonne tes notes : le commencement, le déroulement, la conclusion. Les expressions « d’abord », « ensuite », « pour finir » aident le lecteur à te suivre.' },
          { heading: 'Former ses phrases', body: 'Rédige des phrases brèves comportant un nom et un verbe. Sois attentif à la ponctuation : majuscule initiale et point final.' },
          { heading: 'Relire son travail', body: 'Une fois le texte écrit, relis-le : les phrases sont-elles compréhensibles ? L’orthographe est-elle correcte ? Gomme tes erreurs avant de le recopier.' },
          { heading: 'Lance-toi', body: 'Rédige trois phrases sur ta journée : ton lieu de sortie, ton activité préférée et ce qui t’a plu.' },
        ],
        keyTerms: [
          { term: 'un brouillon', definition: 'Une première rédaction d’un texte que l’on retravaille ensuite.' },
          { term: 'un mot de liaison', definition: 'Un terme qui relie les phrases et indique la suite des idées.' },
        ],
        workedExamples: [
          { prompt: 'Compose un court texte de trois phrases sur une promenade au parc.', steps: ['J’annonce le cadre : « Hier, je suis allé au parc avec ma sœur. »', 'Je raconte l’action : « Nous avons joué au ballon sur l’herbe. »', 'J’ajoute un sentiment : « Nous étions très contents. »'], answer: 'Hier, je suis allé au parc avec ma sœur. Nous avons joué au ballon sur l’herbe. Nous étions très contents.' },
        ],
      },
      en: {
        title: 'Writing a short text',
        intro: 'A few well-built sentences are enough to tell a story about a memory or describe a place.',
        sections: [
          { heading: 'Choose a topic', body: 'First pick an easy topic: a trip, a friend, a pet. Jot down two or three ideas before you start writing.' },
          { heading: 'Put your ideas in order', body: 'Sort your notes: the beginning, what happened, the ending. Words like “first”, “then” and “finally” help the reader follow you.' },
          { heading: 'Write the sentences', body: 'Write short sentences with a noun and a verb. Watch the punctuation: a capital letter at the start and a full stop at the end.' },
          { heading: 'Read it again', body: 'Once your text is written, read it over: are the sentences clear? Is the spelling right? Fix your mistakes before copying it out.' },
          { heading: 'Have a go', body: 'Write three sentences about your day: where you went, what you did and what you enjoyed.' },
        ],
        keyTerms: [
          { term: 'a draft', definition: 'A first version of a text that you later improve.' },
          { term: 'a linking word', definition: 'A word that joins sentences and shows the order of ideas.' },
        ],
        workedExamples: [
          { prompt: 'Write a three-sentence text about a walk in the park.', steps: ['I set the scene: “Yesterday I went to the park with my sister.”', 'I tell the action: “We played ball on the grass.”', 'I add a feeling: “We were very happy.”'], answer: 'Yesterday I went to the park with my sister. We played ball on the grass. We were very happy.' },
        ],
      },
    },
    lc_v4_fr_upper_6: {
      fr: {
        title: 'Découvrir un texte littéraire',
        intro: 'Un récit imaginaire met en scène des personnages dans un cadre choisi ; apprenons à le décortiquer.',
        sections: [
          { heading: 'L’invention d’une histoire', body: 'Le texte littéraire crée un univers fictif avec des héros, des lieux et des péripéties. Le lecteur avance dans le récit avec le désir de savoir la suite.' },
          { heading: 'Le décor et les héros', body: 'Le décor précise le temps et le lieu de l’action ; les héros sont les êtres qui la vivent. Une forêt d’automne, par exemple, peut ouvrir un conte merveilleux.' },
          { heading: 'Le pouvoir des images', body: 'Écrivains et écrivaines utilisent comparaisons et métaphores pour suggérer une couleur, un bruit ou une émotion : « la brise murmurait comme un secret ».' },
          { heading: 'Le fil du récit', body: 'La plupart des contes suivent un schéma : une situation initiale, un événement qui trouble l’ordre, puis un dénouement. Ce repère facilite le résumé.' },
          { heading: 'À toi de raconter', body: 'Une fois le conte lu, cite les personnages, le cadre et l’événement principal, puis relate la conclusion avec tes propres mots.' },
        ],
        keyTerms: [
          { term: 'un personnage', definition: 'Un être qui prend part à l’action d’un récit et vit les événements.' },
          { term: 'une image littéraire', definition: 'Une tournure qui compare ou embellit le réel afin d’émouvoir le lecteur.' },
        ],
        workedExamples: [
          { prompt: '« La brise murmurait comme un secret » : quelle image reconnais-tu et quel effet produit-elle ?', steps: ['Le mot « comme » signale une comparaison.', 'On compare le murmure de la brise à un secret.', 'L’image donne au paysage une atmosphère douce et mystérieuse.'], answer: 'Une comparaison : la brise est assimilée à un secret, ce qui crée une ambiance douce et mystérieuse.' },
        ],
      },
      en: {
        title: 'Exploring literary texts',
        intro: 'An imaginary story brings characters to life in a chosen setting; let’s learn how to unpack it.',
        sections: [
          { heading: 'Making up a story', body: 'A literary text creates a fictional world with heroes, places and events. The reader follows the plot eagerly, wanting to know what happens next.' },
          { heading: 'Setting and characters', body: 'The setting tells us where and when the action happens; the characters are the beings who live it. An autumn forest, for example, can open a fairy tale.' },
          { heading: 'The power of images', body: 'Writers use similes and metaphors to suggest a colour, a sound or a feeling: “the breeze whispered like a secret”. These words make the scene vivid.' },
          { heading: 'The thread of the story', body: 'Most tales follow a pattern: an opening situation, an event that upsets it, and an ending. This guide makes summarizing easier.' },
          { heading: 'Your turn to retell', body: 'After reading the tale, name the characters, the setting and the main event, then retell the ending in your own words.' },
        ],
        keyTerms: [
          { term: 'a character', definition: 'A being who takes part in the action of a story and experiences the events.' },
          { term: 'a literary image', definition: 'A phrase that compares or embellishes reality in order to move the reader.' },
        ],
        workedExamples: [
          { prompt: 'In “the breeze whispered like a secret”, what image can you find and what effect does it have?', steps: ['The word “like” signals a comparison.', 'The whisper of the breeze is compared to a secret.', 'The image gives the scene a soft, mysterious atmosphere.'], answer: 'It is a simile: the breeze is compared to a secret, creating a soft and mysterious mood.' },
        ],
      },
    },
    lc_v4_fr_upper_7: {
      fr: {
        title: 'Employer le passé composé',
        intro: 'Pour parler d’une action achevée dans le passé, on recourt au passé composé ; voyons sa formation.',
        sections: [
          { heading: 'Son usage', body: 'Le passé composé rapporte un fait passé et terminé : « Samedi, j’ai rendu visite à mon oncle. » Il se distingue de l’imparfait, qui décrit une habitude ou une durée.' },
          { heading: 'La formule à retenir', body: 'Auxiliaire « avoir » au présent suivi du participe passé : j’ai fini, tu as choisi, ils ont chanté. Le verbe principal garde sa terminaison de participe.' },
          { heading: 'Les verbes qui prennent « être »', body: 'Les verbes de déplacement comme aller, venir, entrer, sortir, monter se conjuguent avec « être » : « nous sommes entrés », « il est monté ».' },
          { heading: 'L’accord du participe', body: 'Après « être », le participe s’accorde en genre et en nombre avec le sujet : elle est partie, nous sommes parties. Après « avoir », il reste invariable si le complément vient après.' },
          { heading: 'Transforme les phrases', body: 'Conjugue au passé composé : « Je lis un conte », « Elles arrivent à l’école ».' },
        ],
        keyTerms: [
          { term: 'un auxiliaire', definition: 'Le verbe avoir ou être employé pour former les temps composés.' },
          { term: 'un participe passé', definition: 'La forme verbale qui suit l’auxiliaire dans un temps composé.' },
        ],
        workedExamples: [
          { prompt: 'Passe au passé composé : « Elle joue dans le jardin. »', steps: ['Je détermine l’auxiliaire : « jouer » s’écrit avec « avoir ».', 'Je conjugue l’auxiliaire : « elle a ».', 'J’ajoute le participe passé « joué » : « Elle a joué dans le jardin. »'], answer: 'Elle a joué dans le jardin.' },
        ],
      },
      en: {
        title: 'The perfect tense (passé composé)',
        intro: 'To talk about a finished action in the past, French uses the passé composé; let’s see how it is formed.',
        sections: [
          { heading: 'When to use it', body: 'The passé composé reports a past action that is complete: “Yesterday, I played football.” It differs from the imperfect, which describes a habit or a lasting state.' },
          { heading: 'The formula to remember', body: 'The auxiliary “avoir” in the present plus the past participle: j’ai mangé, tu as couru, nous avons dansé. The main verb keeps its participle ending.' },
          { heading: 'Verbs that take “être”', body: 'Movement verbs such as aller (to go), venir (to come), arriver (to arrive) and partir (to leave) use “être”: je suis allé, elle est partie.' },
          { heading: 'Agreement of the participle', body: 'After “être”, the participle agrees with the subject in gender and number: il est allé, elle est allée. After “avoir”, it does not change when the object comes after the verb.' },
          { heading: 'Your turn', body: 'Put into the passé composé: “Je mange une pomme” (I eat an apple), “Nous allons à la piscine” (we go to the pool).' },
        ],
        keyTerms: [
          { term: 'an auxiliary', definition: 'The verb avoir or être used to build a compound tense.' },
          { term: 'a past participle', definition: 'The form of the verb used after the auxiliary in the passé composé.' },
        ],
        workedExamples: [
          { prompt: 'Put into the passé composé: “Elle joue dans le jardin.”', steps: ['I choose the auxiliary: “jouer” takes “avoir”.', 'I conjugate the auxiliary: “elle a”.', 'I add the past participle “joué”: “Elle a joué dans le jardin.”'], answer: 'Elle a joué dans le jardin.' },
        ],
      },
    },
    lc_v4_fr_upper_8: {
      fr: {
        title: 'Lire un texte poétique',
        intro: 'Le poème joue sur le rythme et les images ; voyons comment en saisir le sens et la beauté.',
        sections: [
          { heading: 'La nature du poème', body: 'Le poème est un écrit bref où chaque mot est choisi pour suggérer une sensation ou une émotion. On l’écoute autant qu’on le lit, comme une chanson.' },
          { heading: 'Vers et strophes', body: 'Le texte se divise en vers, c’est-à-dire en lignes relativement courtes, eux-mêmes réunis en strophes. Cette disposition donne sa forme au poème.' },
          { heading: 'Trouver les rimes', body: 'Une rime est la répétition d’un son final : « chat » rime avec « rat », mais pas avec « chien ». Elle apporte de la musicalité et aide à mémoriser les vers.' },
          { heading: 'L’image dans le poème', body: 'Le poète compare ou anime les choses : « la lune sourit ». Ce genre d’image frappe l’imagination et fait naître une émotion.' },
          { heading: 'À ton tour', body: 'Après la lecture d’un poème animalier, repère les rimes, puis explique dans tes mots l’image qui t’a le plus touché.' },
        ],
        keyTerms: [
          { term: 'un vers', definition: 'Une ligne du poème, généralement courte, qui forme une unité de lecture.' },
          { term: 'une rime', definition: 'L’identité de son à la fin de deux vers ou plus.' },
        ],
        workedExamples: [
          { prompt: '« Le petit chat dort sur le tapis, la lune brille et le silence aussi » : quels mots riment ?', steps: ['Je prononce à haute voix la fin de chaque vers.', '« tapis » et « aussi » partagent la même terminaison sonore : -i.', 'Je constate que les autres mots ne forment pas de rime.'], answer: 'Les mots « tapis » et « aussi » riment l’un avec l’autre.' },
        ],
      },
      en: {
        title: 'Reading poetic texts',
        intro: 'A poem plays with rhythm and imagery; let’s discover how to grasp its meaning and beauty.',
        sections: [
          { heading: 'What a poem is', body: 'A poem is a short piece of writing where each word is chosen to suggest a feeling or a sensation. We listen to it as much as we read it, like a song.' },
          { heading: 'Lines and stanzas', body: 'A poem is divided into lines, which are fairly short, and the lines are grouped into stanzas. This layout gives the poem its shape.' },
          { heading: 'Finding the rhymes', body: 'A rhyme is the repetition of a final sound: “cat” rhymes with “hat” but not with “dog”. Rhyme adds music and helps us remember the lines.' },
          { heading: 'The poetic image', body: 'The poet compares things or brings them to life: “the moon smiles”. Such images spark the imagination and stir an emotion.' },
          { heading: 'Your turn', body: 'After reading a poem about an animal, spot the rhymes, then explain in your own words the image that touched you most.' },
        ],
        keyTerms: [
          { term: 'a line', definition: 'One of the short rows of a poem, read as a single unit.' },
          { term: 'a rhyme', definition: 'The repetition of the same sound at the end of two or more lines.' },
        ],
        workedExamples: [
          { prompt: 'In “The little cat sleeps on the mat, the moon shines and the silence is flat”, which words rhyme?', steps: ['I say the end of each line out loud.', '“mat” and “flat” share the same ending sound.', 'I check that the other words do not rhyme.'], answer: '“Mat” and “flat” rhyme with each other.' },
        ],
      },
    },
    lc_v4_fr_upper_9: {
      fr: {
        title: 'Perfectionner sa grammaire et sa conjugaison',
        intro: 'Accords et temps bien choisis rendent une phrase plus claire et plus élégante.',
        sections: [
          { heading: 'Faire accorder le verbe', body: 'Le verbe prend la personne et le nombre du sujet : « tu écris », « vous écrivez ». Identifie le sujet avant de conjuguer pour éviter les fautes.' },
          { heading: 'Genre et nombre des mots', body: 'Noms et adjectifs varient : masculin ou féminin, singulier ou pluriel. On écrit « un vieux livre » mais « une vieille amie », « des maisons blanches ».' },
          { heading: 'Choisir le bon temps', body: 'Dans un récit, le passé composé note les actions achevées et l’imparfait peint le décor ou la répétition : « Le soleil brillait lorsque nous sommes partis. »' },
          { heading: 'Bien placer les compléments', body: 'Le complément d’objet direct répond à « quoi ? » : « Elle lit un roman ». Le complément indirect répond à « à qui ? » : « Elle écrit à sa grand-mère ».' },
          { heading: 'Corrige ces phrases', body: 'Rétablis l’accord : « Les filles est contentes », « Il a aller au marché ». Justifie chaque modification.' },
        ],
        keyTerms: [
          { term: 'l’accord', definition: 'La concordance du verbe ou de l’adjectif avec le sujet en personne, en genre et en nombre.' },
          { term: 'un complément d’objet', definition: 'Un élément qui complète le verbe et répond à une question comme quoi ou à qui.' },
        ],
        workedExamples: [
          { prompt: 'Corrige : « Les oiseaux chante dans le jardin. »', steps: ['Le sujet « les oiseaux » est masculin pluriel.', 'Le verbe « chanter » prend donc la terminaison du présent de l’indicatif, 3e personne du pluriel : « chantent ».', 'On obtient : « Les oiseaux chantent dans le jardin. »'], answer: 'Les oiseaux chantent dans le jardin.' },
        ],
      },
      en: {
        title: 'Refining grammar and conjugation',
        intro: 'Correct agreements and well-chosen tenses make a sentence clearer and more elegant.',
        sections: [
          { heading: 'Making the verb agree', body: 'The verb takes the person and number of its subject: “tu écris” (you write), “vous écrivez” (you all write). Find the subject before conjugating.' },
          { heading: 'Gender and number', body: 'Nouns and adjectives change: masculine or feminine, singular or plural. We write “un vieux livre” but “une vieille amie”, “des maisons blanches”.' },
          { heading: 'Choosing the right tense', body: 'In a story, the passé composé marks completed actions while the imperfect sets the scene or shows repetition: “The sun was shining when we left.”' },
          { heading: 'Placing objects correctly', body: 'The direct object answers “what?”: “She reads a novel”. The indirect object answers “to whom?”: “She writes to her grandmother”.' },
          { heading: 'Fix these sentences', body: 'Correct the agreement: “Les filles est contentes”, “Il a aller au marché”. Explain each change.' },
        ],
        keyTerms: [
          { term: 'agreement', definition: 'The way a verb or adjective matches its subject in person, gender and number.' },
          { term: 'an object', definition: 'A word or group of words that completes the meaning of the verb.' },
        ],
        workedExamples: [
          { prompt: 'Correct: “Les oiseaux chante dans le jardin.”', steps: ['The subject “les oiseaux” is masculine plural.', 'So the verb “chanter” takes the third-person plural ending: “chantent”.', 'The corrected sentence is: “Les oiseaux chantent dans le jardin.”'], answer: 'Les oiseaux chantent dans le jardin.' },
        ],
      },
    },
  },
  questions: [
    { id: 'q_v4_fr_upper_1', levelId: 'l_p3', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'easy', prompt: 'Comment s’appelle la sœur de Sarah ?', options: ['Amina', 'Fatima', 'Youssef', 'Karim'], correctIndex: 0, skill: 'Compréhension de texte', explanation: 'Le texte dit : « Elle a un frère, Youssef, et une sœur, Amina. »' },
    { id: 'q_v4_fr_upper_2', levelId: 'l_p3', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'easy', prompt: 'Quelles questions aide-t-il à se poser pour comprendre un texte ?', options: ['Qui ? Quoi ? Où ? Quand ? Pourquoi ?', 'Combien ? Quel prix ? Quelle heure ?', 'Oui ou non ? Pourquoi pas ?', 'Quel jour ? Quel mois ? Quelle année ?'], correctIndex: 0, skill: 'Stratégies de lecture', explanation: 'Les cinq questions Qui ? Quoi ? Où ? Quand ? Pourquoi ? guident la compréhension.' },
    { id: 'q_v4_fr_upper_3', levelId: 'l_p3', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Dans « Le chat dort », quel est le verbe ?', options: ['chat', 'dort', 'Le', 'Le chat'], correctIndex: 1, skill: 'Grammaire de base', explanation: '« Dort » exprime l’action : c’est le verbe ; « chat » est le nom.' },
    { id: 'q_v4_fr_upper_4', levelId: 'l_p4', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Où trouve-t-on généralement l’idée directrice d’un paragraphe ?', options: ['Dans la dernière phrase', 'Dans la première phrase', 'Dans le titre du livre', 'Dans la marge'], correctIndex: 1, skill: 'Compréhension du paragraphe', explanation: 'L’idée directrice est souvent énoncée dans la première phrase, que les autres phrases développent.' },
    { id: 'q_v4_fr_upper_5', levelId: 'l_p4', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Lequel de ces mots est un mot de liaison ?', options: ['Puis', 'Chien', 'Rouge', 'École'], correctIndex: 0, skill: 'Expression écrite', explanation: '« Puis » relie les étapes du récit ; c’est un mot de liaison.' },
    { id: 'q_v4_fr_upper_6', levelId: 'l_p5', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Dans « le vent chantait comme une flûte », quelle figure reconnaît-on ?', options: ['Une comparaison', 'Une question', 'Une rime', 'Une négation'], correctIndex: 0, skill: 'Texte littéraire', explanation: 'Le mot « comme » introduit une comparaison entre le vent et une flûte.' },
    { id: 'q_v4_fr_upper_7', levelId: 'l_p5', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Quel auxiliaire utilise-t-on pour le passé composé de « aller » ?', options: ['Avoir', 'Être', 'Aller', 'Faire'], correctIndex: 1, skill: 'Conjugaison', explanation: '« Aller » est un verbe de mouvement : on dit « je suis allé », avec l’auxiliaire « être ».' },
    { id: 'q_v4_fr_upper_8', levelId: 'l_p6', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Quels mots riment dans : « Le chat dort sur le tapis / La lune brille et le silence aussi » ?', options: ['chat / lune', 'tapis / aussi', 'dort / brille', 'chat / tapis'], correctIndex: 1, skill: 'Texte poétique', explanation: '« Tapis » et « aussi » se terminent par le même son -i : ils riment.' },
    { id: 'q_v4_fr_upper_9', levelId: 'l_p6', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Quelle est la forme correcte : « Les oiseaux … dans le jardin. » ?', options: ['chante', 'chantent', 'chantes', 'chantons'], correctIndex: 1, skill: 'Grammaire et conjugaison', explanation: 'Le sujet « les oiseaux » est à la 3e personne du pluriel : on écrit « chantent ».' },
  ],
}
