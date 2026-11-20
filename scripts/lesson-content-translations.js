/**
 * French and English versions of the scientific lesson contents
 * (mathematics and scientific activity). Arabic remains the base text;
 * icons, ids, media metadata and timing come from the base content so the
 * three language versions stay perfectly aligned.
 *
 * Governance: demonstration content only. All quizzes remain advisory.
 */
module.exports = {
  lc_demo_cur1_0: {
    fr: {
      title: 'La notion de fraction',
      intro: 'Dans cette leçon, nous découvrons la fraction comme partie d’un tout et ses deux façons de la lire et de l’écrire.',
      sections: [
        { heading: 'Qu’est-ce qu’une fraction ?', body: 'Une fraction représente une partie d’une unité divisée en parts égales. Elle s’écrit avec deux nombres : le numérateur au-dessus et le dénominateur au-dessous. Par exemple 3/5 signifie trois parts sur cinq.' },
        { heading: 'Lire une fraction', body: 'On lit 3/5 « trois cinquièmes ». Le numérateur (3) indique le nombre de parts prises ; le dénominateur (5) indique le nombre de parts égales de l’unité.' },
        { heading: 'Les fractions autour de nous', body: 'Amina a partagé un sandwich en deux et en a donné la moitié à sa sœur : 1/2. Si elle le partageait en quatre parts, chacune aurait 1/4. Un quart d’heure vaut 15 minutes.' },
        { heading: 'Comment écrire une fraction', body: '1) Compte toutes les parts égales et écris-les sous la barre (dénominateur).\n2) Compte les parts que tu as prises et écris-les au-dessus (numérateur).\n3) Trace la barre entre les deux.' },
        { heading: 'À toi de jouer', body: 'Un cercle est divisé en 8 parts égales et tu en as colorié 3. Quelle fraction as-tu coloriée ? (Réponse : 3/8)' },
      ],
      keyTerms: [
        { term: 'fraction', definition: 'Un nombre qui représente une ou plusieurs parts d’une unité divisée en parts égales.' },
        { term: 'numérateur et dénominateur', definition: 'Le numérateur est le nombre du haut : il compte les parts prises. Le dénominateur est le nombre du bas : il compte les parts de l’unité.' },
      ],
      workedExamples: [
        { prompt: 'Partage un cercle en 4 parts égales et colorie-en 3. Quelle fraction représente la partie coloriée ?', steps: ['On compte toutes les parts du cercle : 4 → dénominateur = 4', 'On compte les parts coloriées : 3 → numérateur = 3', 'On écrit la fraction : 3/4'], answer: '3/4' },
      ],
    },
    en: {
      title: 'Understanding fractions',
      intro: 'In this lesson we discover what a fraction is — a part of a whole — and how to read and write it.',
      sections: [
        { heading: 'What is a fraction?', body: 'A fraction shows part of a whole that has been split into equal pieces. It has two numbers: the numerator on top and the denominator below. For example, 3/5 means three parts out of five.' },
        { heading: 'Reading a fraction', body: 'We read 3/5 as "three fifths". The numerator (3) tells how many parts were taken; the denominator (5) tells how many equal pieces make up the whole.' },
        { heading: 'Fractions around us', body: 'Amina cut a sandwich into two halves and gave one half to her sister: 1/2. If she cut it into four equal pieces, each piece would be 1/4. A quarter of an hour is 15 minutes.' },
        { heading: 'How to write a fraction', body: '1) Count all the equal pieces and write them below the line (denominator).\n2) Count the pieces you took and write them above the line (numerator).\n3) Draw the separating line between them.' },
        { heading: 'Try it yourself', body: 'A circle is split into 8 equal pieces and you coloured 3 of them. Which fraction did you colour? (Answer: 3/8)' },
      ],
      keyTerms: [
        { term: 'fraction', definition: 'A number that shows one or more parts of a whole divided into equal pieces.' },
        { term: 'numerator and denominator', definition: 'The numerator is the top number: it counts the parts taken. The denominator is the bottom number: it counts the equal parts of the whole.' },
      ],
      workedExamples: [
        { prompt: 'Divide a circle into 4 equal parts and colour 3 of them. Which fraction shows the coloured part?', steps: ['Count all the parts of the circle: 4 → denominator = 4', 'Count the coloured parts: 3 → numerator = 3', 'Write the fraction: 3/4'], answer: '3/4' },
      ],
    },
  },

  lc_demo_cur1_1: {
    fr: {
      title: 'Comparer des fractions',
      intro: 'Nous apprenons à comparer deux fractions qui ont le même dénominateur ou des dénominateurs différents.',
      sections: [
        { heading: 'Même dénominateur', body: 'Si les deux fractions ont le même dénominateur, on compare seulement les numérateurs : le plus grand numérateur donne la fraction la plus grande. Par exemple 3/7 > 2/7.' },
        { heading: 'Dénominateurs différents', body: 'On commence par rendre les dénominateurs égaux à l’aide d’un multiple commun, puis on compare les numérateurs. On peut aussi placer les deux fractions sur une droite numérique.' },
        { heading: 'Comparer avec un dessin', body: 'Dessine deux rectangles égaux : partage le premier en 2 et le second en 4, puis colorie 1/2 et 1/4. Tu verras que la moitié est plus grande que le quart : 1/2 > 1/4.' },
        { heading: 'Une règle rapide', body: 'Quand les numérateurs sont égaux, la fraction qui a le plus petit dénominateur est la plus grande : 1/3 > 1/6, car un tiers est plus grand qu’un sixième.' },
        { heading: 'À toi de jouer', body: 'Range du plus petit au plus grand : 1/6 , 1/3 , 1/2. (Réponse : 1/6 < 1/3 < 1/2)' },
      ],
      keyTerms: [
        { term: 'dénominateur commun', definition: 'Un multiple commun des deux dénominateurs, utilisé pour transformer les deux fractions en fractions de même dénominateur.' },
      ],
      workedExamples: [
        { prompt: 'Compare 1/2 et 1/4.', steps: ['On uniformise le dénominateur : 1/2 = 2/4', 'On compare : 2/4 > 1/4', 'Donc 1/2 > 1/4'], answer: '1/2 > 1/4' },
      ],
    },
    en: {
      title: 'Comparing fractions',
      intro: 'We learn how to compare two fractions with the same denominator or with different denominators.',
      sections: [
        { heading: 'Same denominator', body: 'If the two fractions have the same denominator, compare only the numerators: the larger numerator gives the larger fraction. For example 3/7 > 2/7.' },
        { heading: 'Different denominators', body: 'First make the denominators equal using a common multiple, then compare the numerators. You can also place both fractions on a number line.' },
        { heading: 'Compare with a picture', body: 'Draw two equal rectangles: split the first into 2 parts and the second into 4, then colour 1/2 and 1/4. You will see that one half is bigger than one quarter: 1/2 > 1/4.' },
        { heading: 'A quick rule', body: 'When the numerators are equal, the fraction with the smaller denominator is the larger one: 1/3 > 1/6, because a third is bigger than a sixth.' },
        { heading: 'Try it yourself', body: 'Put in order from smallest to largest: 1/6 , 1/3 , 1/2. (Answer: 1/6 < 1/3 < 1/2)' },
      ],
      keyTerms: [
        { term: 'common denominator', definition: 'A common multiple of both denominators, used to rewrite the two fractions with the same denominator.' },
      ],
      workedExamples: [
        { prompt: 'Compare 1/2 and 1/4.', steps: ['Make the denominators equal: 1/2 = 2/4', 'Compare: 2/4 > 1/4', 'So 1/2 > 1/4'], answer: '1/2 > 1/4' },
      ],
    },
  },

  lc_demo_p2math_0: {
    fr: {
      title: 'Les nombres jusqu’à 1000',
      intro: 'Nous lisons, écrivons et comparons les nombres jusqu’à 1000.',
      sections: [
        { heading: 'Lire les nombres', body: 'Le nombre 345 se lit « trois cent quarante-cinq » : 3 centaines, 4 dizaines et 5 unités.' },
        { heading: 'Lequel est le plus grand ?', body: 'Compare d’abord les centaines ; si elles sont égales, compare les dizaines ; si elles sont égales, compare les unités. Ainsi 410 est plus grand que 399, même si 9 est plus grand que 1.' },
        { heading: 'Compter par sauts', body: 'Entraîne-toi à compter de 10 en 10 : 290, 300, 310, 320… et de 100 en 100 : 700, 800, 900, 1000.' },
        { heading: 'À toi de jouer', body: 'Quel nombre vient juste après 699 ? Et juste avant ? (Réponse : 700 et 698)' },
      ],
      keyTerms: [
        { term: 'la valeur de position', definition: 'La valeur d’un chiffre selon sa place : unités, dizaines, centaines.' },
      ],
      workedExamples: [
        { prompt: 'Quel nombre est formé de 4 centaines, 2 dizaines et 7 unités ?', steps: ['4 centaines = 400', '2 dizaines = 20', '7 unités = 7', 'Total = 427'], answer: '427' },
      ],
    },
    en: {
      title: 'Numbers up to 1000',
      intro: 'We read, write and compare numbers up to 1000.',
      sections: [
        { heading: 'Reading numbers', body: 'The number 345 is read "three hundred and forty-five": 3 hundreds, 4 tens and 5 units.' },
        { heading: 'Which one is bigger?', body: 'Compare the hundreds first; if they are equal, compare the tens; if those are equal, compare the units. So 410 is bigger than 399, even though 9 is bigger than 1.' },
        { heading: 'Counting in jumps', body: 'Practise counting in tens: 290, 300, 310, 320… and in hundreds: 700, 800, 900, 1000.' },
        { heading: 'Try it yourself', body: 'Which number comes straight after 699? And straight before it? (Answer: 700 and 698)' },
      ],
      keyTerms: [
        { term: 'place value', definition: 'The value of a digit according to its position: units, tens, hundreds.' },
      ],
      workedExamples: [
        { prompt: 'Which number is made of 4 hundreds, 2 tens and 7 units?', steps: ['4 hundreds = 400', '2 tens = 20', '7 units = 7', 'Total = 427'], answer: '427' },
      ],
    },
  },

  lc_demo_p2math_1: {
    fr: {
      title: 'La multiplication',
      intro: 'Nous comprenons la multiplication comme un ajout répété et nous entraînons sur la table de multiplication.',
      sections: [
        { heading: 'La multiplication est un ajout répété', body: '3 × 4 signifie trois fois quatre, soit 4 + 4 + 4 = 12. Le signe × abrège l’ajout répété.' },
        { heading: 'Des groupes égaux', body: 'Tu as 4 sacs avec 3 pommes dans chaque sac. Chaque sac est un groupe égal, et le nombre de pommes est 4 × 3 = 12.' },
        { heading: 'Un calcul plus simple', body: 'Commence par apprendre 1×, 2×, 5× et 10×. Par exemple 5 × 7 est la moitié de 10 × 7, soit 35.' },
        { heading: 'À toi de jouer', body: 'Combien y a-t-il de pommes dans 5 sacs de 3 pommes chacun ? (Réponse : 5 × 3 = 15)' },
      ],
      keyTerms: [
        { term: 'multiplication', definition: 'Une opération qui abrège l’ajout du même nombre plusieurs fois.' },
      ],
      workedExamples: [
        { prompt: 'Combien vaut 6 × 3 ?', steps: ['On ajoute 3 six fois : 3+3+3+3+3+3', 'Résultat = 18'], answer: '18' },
      ],
    },
    en: {
      title: 'Multiplication',
      intro: 'We understand multiplication as repeated addition and practise the times tables.',
      sections: [
        { heading: 'Multiplication is repeated addition', body: '3 × 4 means three times four, that is 4 + 4 + 4 = 12. The × sign is a short way of writing repeated addition.' },
        { heading: 'Equal groups', body: 'You have 4 bags with 3 apples in each bag. Each bag is an equal group, and the number of apples is 4 × 3 = 12.' },
        { heading: 'An easier calculation', body: 'Start by learning 1×, 2×, 5× and 10×. For example 5 × 7 is half of 10 × 7, which is 35.' },
        { heading: 'Try it yourself', body: 'How many apples are there in 5 bags with 3 apples in each? (Answer: 5 × 3 = 15)' },
      ],
      keyTerms: [
        { term: 'multiplication', definition: 'An operation that shortens adding the same number several times.' },
      ],
      workedExamples: [
        { prompt: 'What is 6 × 3?', steps: ['Add 3 six times: 3+3+3+3+3+3', 'Result = 18'], answer: '18' },
      ],
    },
  },

  lc_demo_pre_sci_0: {
    fr: {
      title: 'Les sens',
      intro: 'Nous découvrons les cinq sens et la fonction de chacun.',
      sections: [
        { heading: 'Nos cinq sens', body: 'Nous voyons avec les yeux, nous entendons avec les oreilles, nous sentons avec le nez, nous goûtons avec la langue et nous touchons avec la peau. Chaque sens nous informe d’une chose différente.' },
        { heading: 'Comment protéger nos sens ?', body: 'Ne regardons pas le soleil directement, ne mettons pas d’objets pointus dans l’oreille, et lavons-nous les mains avant de manger pour garder nos sens en bonne santé.' },
        { heading: 'Une petite expérience', body: 'Ferme les yeux et demande à un camarade de te donner une pomme : tu la reconnaîtras par l’odorat, le toucher et le goût sans la voir.' },
        { heading: 'À toi de jouer', body: 'Quel sens utilises-tu pour savoir qu’une fleur est parfumée ? (Réponse : l’odorat)' },
      ],
      keyTerms: [
        { term: 'un sens', definition: 'Un organe qui nous aide à connaître ce qui se passe autour de nous.' },
      ],
      workedExamples: [
        { prompt: 'Quel sens utilisons-nous pour voir la couleur d’une pomme ?', steps: ['La couleur se voit', 'La vue est la fonction des yeux'], answer: 'La vue' },
      ],
    },
    en: {
      title: 'The senses',
      intro: 'We discover the five senses and what each one does.',
      sections: [
        { heading: 'Our five senses', body: 'We see with our eyes, hear with our ears, smell with our nose, taste with our tongue and touch with our skin. Each sense tells us about something different.' },
        { heading: 'How do we protect our senses?', body: 'We do not look straight at the sun, we do not put sharp objects in our ears, and we wash our hands before eating to keep our senses healthy.' },
        { heading: 'A small experiment', body: 'Close your eyes and ask a friend to hand you an apple: you will recognise it by smell, touch and taste without seeing it.' },
        { heading: 'Try it yourself', body: 'Which sense do you use to know that a flower is fragrant? (Answer: smell)' },
      ],
      keyTerms: [
        { term: 'a sense', definition: 'An organ that helps us know what is happening around us.' },
      ],
      workedExamples: [
        { prompt: 'Which sense do we use to see the colour of an apple?', steps: ['Colour is seen', 'Seeing is what our eyes do'], answer: 'Sight' },
      ],
    },
  },

  lc_demo_p4_sci_0: {
    fr: {
      title: 'Les matériaux',
      intro: 'Nous distinguons les matériaux solides, liquides et gazeux autour de nous.',
      sections: [
        { heading: 'Les états de la matière', body: 'La matière peut être solide comme la pierre, liquide comme l’eau ou gazeuse comme l’air. Chaque état a une forme et des propriétés différentes.' },
        { heading: 'Les propriétés de chaque état', body: 'L’eau est un liquide : elle prend la forme du verre. La pierre est un solide : elle garde sa forme. L’air est un gaz : il remplit toute la pièce.' },
        { heading: 'Changer d’état', body: 'Si nous chauffons l’eau, elle devient vapeur ; si nous la refroidissons, elle devient glace. C’est la chaleur qui change l’état de la matière.' },
        { heading: 'À toi de jouer', body: 'Mets un glaçon dans un verre et attends un peu : que se passe-t-il ? (Réponse : il fond et devient de l’eau liquide)' },
      ],
      keyTerms: [
        { term: 'la matière', definition: 'Tout ce qui a une masse et occupe un espace.' },
      ],
      workedExamples: [
        { prompt: 'Parmi ces matériaux, lequel est solide : l’eau, la pierre ou l’air ?', steps: ['L’eau est liquide', 'L’air est gazeux', 'La pierre a une forme fixe : elle est donc solide'], answer: 'La pierre' },
      ],
    },
    en: {
      title: 'Materials',
      intro: 'We tell solid, liquid and gaseous materials apart around us.',
      sections: [
        { heading: 'The states of matter', body: 'Matter can be solid like a stone, liquid like water or gaseous like air. Each state has its own shape and properties.' },
        { heading: 'The properties of each state', body: 'Water is a liquid: it takes the shape of the glass. A stone is a solid: it keeps its shape. Air is a gas: it fills the whole room.' },
        { heading: 'Changing state', body: 'If we heat water it becomes steam; if we cool it, it becomes ice. Heat is what changes the state of matter.' },
        { heading: 'Try it yourself', body: 'Put an ice cube in a glass and wait a little: what happens? (Answer: it melts and becomes liquid water)' },
      ],
      keyTerms: [
        { term: 'matter', definition: 'Anything that has mass and takes up space.' },
      ],
      workedExamples: [
        { prompt: 'Which of these materials is solid: water, a stone or air?', steps: ['Water is a liquid', 'Air is a gas', 'A stone keeps a fixed shape, so it is solid'], answer: 'The stone' },
      ],
    },
  },
}
