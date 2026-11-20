module.exports = {
  units: {
    "cur6": {
      shared: {
        sections: [
          ["Greetings in English", "We say Hello when we meet a friend. We say Goodbye when we leave. A smile makes our words kind."],
          ["Sounds and Letters", "English words are made of sounds. The letter A says a as in apple. We listen before we speak."],
          ["Words We Use Every Day", "We use short words for people, colours and toys. Saying them often helps us remember. Practice makes our voice strong."],
          ["Listening and Repeating", "We listen to a word and say it again. We copy the sound with care. Repeating helps us speak clearly."]
        ],
        vocab: [
          ["hello", "A word we say when we meet someone."],
          ["goodbye", "A word we say when we leave."],
          ["colour", "Red, blue or yellow are colours."],
          ["family", "The people who live with us."],
          ["toy", "Something we play with."],
          ["friend", "A person we like to play with."]
        ],
        outcomes: [
          "Say hello and goodbye in English.",
          "Name at least three colours in English.",
          "Introduce a family member with a short sentence.",
          "Listen and repeat new words clearly."
        ],
        diagram: "diagram-colors.svg"
      },
      lessons: [
        {
          t: "Hello and Goodbye",
          intro: "We greet people every day. Let us learn two kind English words.",
          sections: [
            ["Morning Greetings", "In the morning we say Good morning to our teacher. We look at the person and smile. Our voice sounds happy and clear."],
            ["Saying Goodbye", "When school ends we say Goodbye or Bye. We can wave our hand too. Kind words help friends feel good."]
          ],
          examples: [
            ["Greet your teacher in the morning", ["Look at your teacher.", "Smile and stand straight.", "Say: Good morning, teacher."], "Good morning, teacher."],
            ["Say goodbye to a friend", ["Turn to your friend.", "Wave your hand.", "Say: Goodbye, my friend."], "Goodbye, my friend."]
          ],
          questions: [
            ["What do we say when we meet a friend?", ["Goodbye", "Hello", "Thank you", "Sorry"], 1, "We use Hello to greet someone when we meet them; Goodbye is for leaving."],
            ["In our greeting lesson, when do we say Good morning to the teacher?", ["At night", "In the morning", "At lunch", "In the evening"], 1, "Good morning is used from early morning until midday."],
            ["Which action goes with a greeting?", ["Frowning", "Smiling", "Sleeping", "Running"], 1, "A smile shows kindness and makes the greeting warm."],
            ["How can we say goodbye with our body?", ["Wave our hand", "Close our eyes", "Sit down", "Hide"], 0, "Waving is a friendly way to say goodbye without words."]
          ]
        },
        {
          t: "Colours Around Us",
          intro: "The world has many colours. Let us learn to name them in English.",
          sections: [
            ["Naming Colours", "The sky is blue and the sun is yellow. Leaves are green. We say the colour word after we look at the thing."],
            ["Colours at School", "Our bag may be red and our book may be white. We point and say the colour. Pointing helps us learn the word."]
          ],
          examples: [
            ["Name the colour of the sky", ["Look up at the sky.", "Think of the word for blue.", "Say: The sky is blue."], "The sky is blue."],
            ["Describe your green book", ["Look at your book cover.", "Find the colour word.", "Say: My book is green."], "My book is green."]
          ],
          questions: [
            ["What colour is the sun?", ["Blue", "Green", "Yellow", "Black"], 2, "The sun looks yellow to us, so we say yellow."],
            ["In our colours lesson, which word names a colour?", ["Table", "Red", "Chair", "Pencil"], 1, "Red names a colour; the others name objects."],
            ["How do we learn a colour word?", ["Point and say it", "Sleep", "Write a long text", "Shout"], 0, "Pointing at the object while saying the word links sound and meaning."],
            ["The leaves are ___.", ["blue", "green", "white", "black"], 1, "Most leaves are green, so green fits the sentence."]
          ]
        },
        {
          t: "My Family and Toys",
          intro: "We talk about the people at home and the things we play with.",
          sections: [
            ["People in My Family", "I live with my mother, father and sister. In English we say my mum and my dad. Family words help us talk about home."],
            ["My Favourite Toy", "I have a ball and a small car. I say my ball and my car. We use my to show something is ours."]
          ],
          examples: [
            ["Introduce your sister", ["Think of her name.", "Use the word my.", "Say: This is my sister."], "This is my sister."],
            ["Talk about your ball", ["Hold your ball.", "Use my before the toy.", "Say: My ball is red."], "My ball is red."]
          ],
          questions: [
            ["Which word shows something is yours?", ["my", "the", "a", "and"], 0, "My tells that the thing belongs to you."],
            ["Who is my mum?", ["Your friend", "Your mother", "Your teacher", "Your sister"], 1, "Mum is another word for mother."],
            ["What can you say about your toy?", ["My car is blue", "Car blue my", "Blue is car", "Is my blue car"], 0, "English sentences put my car before the colour: My car is blue."],
            ["We use family words to talk about ___ .", ["toys", "home people", "colours", "food only"], 1, "Family words name the people we live with."]
          ]
        },
        {
          t: "Review: Say and Show",
          intro: "We join the words we know and show what we can say.",
          sections: [
            ["Putting Words Together", "We can join a greeting and a name: Hello, I am Sara. Short sentences help us speak with confidence. We say them slowly and clearly."],
            ["Show What You Know", "We point to a colour and name it. We show a toy and say my. Reviewing helps our memory grow."]
          ],
          examples: [
            ["Greet and introduce yourself", ["Smile at the class.", "Say hello.", "Say your name: Hello, I am Omar."], "Hello, I am Omar."],
            ["Name a colour and a toy", ["Point to something yellow.", "Name your toy.", "Say: My ball is yellow."], "My ball is yellow."]
          ],
          questions: [
            ["Choose a complete greeting.", ["I Sara", "Hello, I am Sara", "Am I Sara", "Sara hello I"], 1, "A greeting plus I am makes a clear introduction."],
            ["Which sentence names a colour?", ["My ball is yellow", "Ball my yellow", "Yellow ball my is", "My is ball yellow"], 0, "The colour comes after is in this pattern."],
            ["What helps us remember new words?", ["Repeating them", "Ignoring them", "Whispering once", "Sleeping in class"], 0, "Repeated practice strengthens memory."],
            ["Review lessons help us ___ .", ["forget", "practise again", "stop learning", "hide"], 1, "Review gives another chance to practise and improve."]
          ]
        }
      ]
    },
    "cur14": {
      shared: {
        sections: [
          ["Saluer en amazigh", "En amazigh on dit Azul pour saluer. On répond Azul fellawen. Un sourire accompagne toujours le mot."],
          ["Les sons tifinaghs", "La langue amazighe utilise des lettres tifinaghs. Chaque lettre a un son clair. On écoute avant de répéter."],
          ["Les mots de la vie quotidienne", "On apprend les mots pour la famille, les couleurs et les nombres. Les répéter chaque jour aide à les retenir."],
          ["Écouter et répéter", "L'élève écoute le mot puis le répète. La répétition améliore la prononciation. La pratique donne de la confiance."]
        ],
        vocab: [
          ["Azul", "Bonjour, mot de salutation amazigh."],
          ["tanemmirt", "Merci en amazigh."],
          ["Ar tddut?", "Comment vas-tu ? en amazigh."],
          ["tifinagh", "Alphabet de la langue amazighe."],
          ["tamazight", "La langue amazighe."],
          ["taddart", "La maison en amazigh."]
        ],
        outcomes: [
          "Dire bonjour et merci en amazigh.",
          "Reconnaître quelques lettres tifinaghs.",
          "Nommer des membres de la famille en amazigh.",
          "Se présenter avec une phrase courte."
        ],
        diagram: "diagram-family.svg"
      },
      lessons: [
        {
          t: "Dire bonjour : Azul",
          intro: "Chaque langue a sa façon de saluer. Découvrons le mot amazigh Azul.",
          sections: [
            ["Le mot Azul", "Quand on rencontre quelqu'un, on dit Azul. La personne répond Azul fellawen. On regarde la personne avec un sourire."],
            ["Remercier", "Quand on reçoit quelque chose, on dit tanemmirt. Ce mot veut dire merci. Il montre notre reconnaissance."]
          ],
          examples: [
            ["Saluer un camarade", ["Regarder le camarade.", "Sourire.", "Dire : Azul."], "Azul."],
            ["Dire merci à l'enseignant", ["Recevoir le cahier.", "Regarder l'enseignant.", "Dire : tanemmirt."], "tanemmirt."]
          ],
          questions: [
            ["Dans la leçon de salutation amazighe, que signifie Azul ?", ["Merci", "Bonjour", "Au revoir", "S'il vous plaît"], 1, "Azul est le mot amazigh utilisé pour saluer."],
            ["Que répond-on à Azul ?", ["Azul fellawen", "tanemmirt", "Ar tddut?", "taddart"], 0, "La réponse traditionnelle est Azul fellawen."],
            ["Quand dit-on tanemmirt après avoir reçu quelque chose en cadeau ?", ["Pour saluer", "Pour remercier", "Pour dormir", "Pour compter"], 1, "tanemmirt signifie merci, on l'emploie après avoir reçu quelque chose."],
            ["Comment saluer avec le corps ?", ["En souriant", "En fermant les yeux", "En courant", "En cachant son visage"], 0, "Le sourire accompagne naturellement la salutation."]
          ]
        },
        {
          t: "Couleurs et nombres",
          intro: "Apprenons à nommer les couleurs et à compter en amazigh.",
          sections: [
            ["Les couleurs", "En amazigh, chaque couleur a un nom. On apprend à nommer le vert et le rouge. On montre l'objet en disant son nom."],
            ["Compter jusqu'à cinq", "On compte avec les doigts : un, deux, trois, quatre, cinq. Chaque nombre correspond à un doigt. Compter aide à ordonner les choses."]
          ],
          examples: [
            ["Nommer la couleur verte", ["Regarder la feuille.", "Penser au mot amazigh.", "Dire : azegza."], "azegza"],
            ["Compter trois objets", ["Montrer le premier doigt.", "Montrer le deuxième.", "Montrer le troisième : trois."], "trois doigts"]
          ],
          questions: [
            ["Que signifie azegza ?", ["Rouge", "Vert", "Bleu", "Blanc"], 1, "azegza est le mot amazigh pour la couleur verte."],
            ["Combien de doigts pour cinq ?", ["Deux", "Trois", "Cinq", "Dix"], 2, "Le nombre cinq correspond à cinq doigts."],
            ["Comment apprendre un nombre ?", ["En comptant sur ses doigts", "En dormant", "En écrivant au hasard", "En criant"], 0, "Les doigts donnent une image concrète de chaque nombre."],
            ["Nommer une couleur aide à ___ .", ["décrire un objet", "compter", "saluer", "courir"], 0, "Le nom de couleur décrit l'apparence d'un objet."]
          ]
        },
        {
          t: "Ma famille et la maison",
          intro: "Parlons de notre famille et de la maison où nous vivons.",
          sections: [
            ["Les membres de la famille", "On dit taddart pour la maison. La famille vit ensemble dans la maison. Chaque personne a un nom et un rôle."],
            ["Se présenter", "Je peux dire mon nom et mon âge. Je peux dire où j'habite. Une courte phrase suffit pour se faire comprendre."]
          ],
          examples: [
            ["Dire où j'habite", ["Penser à ma maison.", "Choisir le mot taddart.", "Dire : J'habite dans taddart."], "J'habite dans taddart."],
            ["Nommer un membre de la famille", ["Penser à ma mère.", "Utiliser le mot appris.", "Dire le nom."], "Je présente ma mère."]
          ],
          questions: [
            ["Que signifie taddart ?", ["L'école", "La maison", "Le livre", "Le jardin"], 1, "taddart est le mot amazigh pour maison."],
            ["Que peut-on dire pour se présenter ?", ["Son nom", "La météo", "Un long calcul", "Une chanson"], 0, "Dire son nom est la base d'une présentation."],
            ["Où vit la famille ?", ["Dans la maison", "Dans le cahier", "Dans le sac", "Dans le ciel"], 0, "La famille habite dans la maison, taddart."],
            ["Une phrase courte aide à ___ .", ["se faire comprendre", "oublier", "se cacher", "dormir"], 0, "Une phrase simple et claire transmet le message."]
          ]
        },
        {
          t: "Évaluation : je me présente",
          intro: "Révisons les mots appris et montrons ce que nous savons dire.",
          sections: [
            ["Réviser les salutations", "On revoit Azul et tanemmirt. On les dit avec un sourire. La répétition rend les mots familiers."],
            ["Montrer ce que je sais", "Je dis bonjour, je nomme une couleur et je me présente. Je vérifie ma prononciation. Chaque essai améliore ma parole."]
          ],
          examples: [
            ["Saluer puis dire merci", ["Dire : Azul.", "Recevoir un objet.", "Dire : tanemmirt."], "Azul, puis tanemmirt."],
            ["Se présenter en deux phrases", ["Dire son nom.", "Dire où on habite.", "Joindre les deux phrases."], "Je m'appelle Omar et j'habite dans taddart."]
          ],
          questions: [
            ["Quel mot commence une salutation ?", ["Azul", "taddart", "azegza", "tanemmirt"], 0, "On commence par Azul pour saluer."],
            ["Quel mot remercie ?", ["Azul", "tanemmirt", "azegza", "tifinagh"], 1, "tanemmirt est le mot de remerciement."],
            ["Que faut-il faire pour bien parler ?", ["Répéter les mots", "Se taire toujours", "Écrire sans lire", "Courir vite"], 0, "La répétition régulière améliore la prononciation."],
            ["L'évaluation sert à ___ .", ["vérifier ce qu'on sait", "se moquer", "arrêter d'apprendre", "perdre son temps"], 0, "L'évaluation formative montre ce qui est acquis et ce qu'il faut revoir."]
          ]
        }
      ]
    },
    "cur22": {
      shared: {
        sections: [
          ["Las palabras en español", "En español saludamos con hola. Cada palabra tiene un sonido claro. Escuchamos antes de hablar."],
          ["Los colores y las formas", "El cielo es azul y el sol es amarillo. Un círculo es redondo. Nombrar ayuda a recordar."],
          ["La familia y la casa", "La familia vive en la casa. Decimos mi madre y mi padre. Las palabras de familia son importantes."],
          ["Practicar cada día", "Repetir palabras en voz alta ayuda a aprender. Escuchar y repetir mejora la pronunciación. La práctica da confianza."]
        ],
        vocab: [
          ["hola", "Palabra para saludar."],
          ["adiós", "Palabra para despedirse."],
          ["gracias", "Palabra para dar las gracias."],
          ["casa", "El lugar donde vivimos."],
          ["familia", "Las personas que viven con nosotros."],
          ["color", "Rojo, azul o verde son colores."]
        ],
        outcomes: [
          "Saludar y despedirse en español.",
          "Nombrar colores y formas sencillas.",
          "Presentar a un miembro de la familia.",
          "Escribir frases cortas con corrección."
        ],
        diagram: "diagram-shapes.svg"
      },
      lessons: [
        {
          t: "Hola y adiós",
          intro: "Aprendemos a saludar y a despedirnos en español.",
          sections: [
            ["Saludar en español", "Decimos hola al encontrar a un amigo. También decimos buenos días por la mañana. La sonrisa hace el saludo más amable."],
            ["Despedirse", "Al salir decimos adiós o hasta luego. Podemos mover la mano. Un saludo amable agrada a los demás."]
          ],
          examples: [
            ["Saluda a tu profesor", ["Mira al profesor.", "Sonríe.", "Di: Hola, profesor."], "Hola, profesor."],
            ["Despídete de un amigo", ["Mira a tu amigo.", "Mueve la mano.", "Di: Hasta luego."], "Hasta luego."]
          ],
          questions: [
            ["¿Qué palabra usamos para saludar?", ["Adiós", "Hola", "Gracias", "Por favor"], 1, "Usamos hola para saludar cuando encontramos a alguien."],
            ["¿Cuándo decimos buenos días?", ["Por la noche", "Por la mañana", "Al cenar", "A medianoche"], 1, "Buenos días se usa por la mañana."],
            ["¿Qué palabra da las gracias?", ["Hola", "Adiós", "Gracias", "Familia"], 2, "Gracias expresa agradecimiento."],
            ["¿Cómo acompañamos un saludo?", ["Con una sonrisa", "Con enojo", "Durmiendo", "Corriendo"], 0, "La sonrisa acompaña un saludo amable."]
          ]
        },
        {
          t: "Los colores y las formas",
          intro: "Observamos los colores y las formas que nos rodean.",
          sections: [
            ["Nombrar colores", "La bandera de Marruecos es roja y verde. El cielo es azul. Decimos el color después de mirar el objeto."],
            ["Formas sencillas", "Una pelota es redonda. Una mesa es cuadrada. Las formas nos ayudan a describir lo que vemos."]
          ],
          examples: [
            ["Describe una pelota", ["Mira la pelota.", "Piensa en su forma.", "Di: La pelota es redonda."], "La pelota es redonda."],
            ["Nombra un color", ["Mira el cielo.", "Piensa en azul.", "Di: El cielo es azul."], "El cielo es azul."]
          ],
          questions: [
            ["¿De qué color es la bandera de Marruecos?", ["Azul y blanco", "Rojo y verde", "Amarillo y negro", "Morado y rosa"], 1, "La bandera marroquí es roja con una estrella verde."],
            ["¿Qué forma tiene una pelota?", ["Cuadrada", "Redonda", "Triangular", "Larga"], 1, "Una pelota es redonda, como un círculo."],
            ["¿Cómo aprendemos un color?", ["Mirando y diciendo", "Durmiéndonos", "Callando siempre", "Corriendo"], 0, "Mirar el objeto y decir su color une imagen y palabra."],
            ["Una mesa suele ser ___ .", ["redonda", "cuadrada", "azul", "bonita"], 1, "Muchas mesas tienen forma cuadrada o rectangular."]
          ]
        },
        {
          t: "Mi familia y mi casa",
          intro: "Hablamos de las personas que queremos y del lugar donde vivimos.",
          sections: [
            ["Mi familia", "Vivo con mi madre, mi padre y mi hermana. En español decimos mi mamá y mi papá. Cada persona es importante."],
            ["Mi casa", "Mi casa tiene una puerta y ventanas. En la casa comemos y descansamos. Decimos mi casa porque es nuestra."]
          ],
          examples: [
            ["Presenta a tu madre", ["Piensa en su nombre.", "Usa mi.", "Di: Esta es mi madre."], "Esta es mi madre."],
            ["Describe tu casa", ["Piensa en la puerta.", "Usa mi casa.", "Di: Mi casa es pequeña."], "Mi casa es pequeña."]
          ],
          questions: [
            ["¿Qué palabra muestra pertenencia?", ["mi", "el", "la", "y"], 0, "mi indica que algo es nuestro."],
            ["¿Quién es mi papá?", ["Mi madre", "Mi padre", "Mi amigo", "Mi profesor"], 1, "Papá es otra forma de decir padre."],
            ["¿Qué hay en una casa?", ["Una puerta", "Una nube", "Un río", "Una estrella"], 0, "La puerta es parte de una casa."],
            ["Esta es mi ... sirve para ___ .", ["presentar a alguien", "contar dinero", "medir", "saltar"], 0, "Esta estructura presenta a una persona."]
          ]
        },
        {
          t: "Repaso: describe tu día",
          intro: "Repasamos las palabras nuevas y las usamos juntas.",
          sections: [
            ["Juntar frases", "Podemos decir Hola, soy Sara. También podemos decir Mi casa es azul. Las frases cortas son claras y útiles."],
            ["Mostrar lo aprendido", "Saludamos, nombramos un color y presentamos a la familia. Repasar nos ayuda a recordar. Cada intento mejora la pronunciación."]
          ],
          examples: [
            ["Saluda y di tu nombre", ["Sonríe.", "Di hola.", "Di: Hola, soy Omar."], "Hola, soy Omar."],
            ["Describe tu día", ["Di un color.", "Nombra a tu familia.", "Di: Mi casa es verde."], "Mi casa es verde."]
          ],
          questions: [
            ["Elige un saludo completo.", ["Soy Sara hola", "Hola, soy Sara", "Sara hola soy", "Hola soy"], 1, "El saludo y soy forman una presentación clara."],
            ["¿Qué frase nombra un color?", ["Mi casa es verde", "Verde casa mi es", "Mi es verde casa", "Casa mi verde es"], 0, "El color va después de es en esta estructura."],
            ["¿Para qué sirve repasar?", ["Para recordar mejor", "Para olvidar", "Para callar", "Para correr"], 0, "Repasar refuerza la memoria."],
            ["La práctica diaria da ___ .", ["confianza", "miedo", "sueño", "hambre"], 0, "Practicar seguido aumenta la confianza al hablar."]
          ]
        }
      ]
    },
    "cur_l_pre_sub_math": {
      shared: {
        sections: [
          ["العد في حياتنا", "نعد التفاحات في السوق ونعد أصدقاءنا في الصف. العد يعني ذكر الأعداد بالترتيب. كل عدد يأتي بعد الذي قبله."],
          ["التعرف على الأشكال", "نرى الأشكال في كل مكان: الدائرة في الطبق والمربع في النافذة. لكل شكل اسم وصورة. ننظر جيدا ثم نسميه."],
          ["المقارنة والتصنيف", "نقارن بين شيئين لنعرف أيهما أكبر أو أصغر. ونصنف الأشياء المتشابهة في مجموعة واحدة. الترتيب يساعدنا على الفهم."],
          ["التفكير بالأمثلة", "نستخدم أمثلة من بيتنا ومدرستنا لنتعلم. نلمس ونعد ونقارن بأيدينا. العمل العملي يجعل الفكرة واضحة."]
        ],
        vocab: [
          ["عدد", "كلمة نستخدمها للعد مثل واحد واثنان وثلاثة."],
          ["دائرة", "شكل مستدير لا زوايا له."],
          ["مربع", "شكل له أربعة أضلاع متساوية."],
          ["أكبر", "وصف لشيء يأخذ حيزا أكثر."],
          ["أصغر", "وصف لشيء يأخذ حيزا أقل."],
          ["مجموعة", "أشياء متشابهة نضعها معا."]
        ],
        outcomes: [
          "يعد الأطفال الأعداد من 1 إلى 10 بالترتيب.",
          "يتعرفون على الدائرة والمربع والمثلث.",
          "يقارنون بين شيئين ويحددون الأكبر والأصغر.",
          "يصنفون الأشكال في مجموعات حسب الخصائص."
        ],
        outcomeTr: {
          fr: [
            "Compter les nombres de 1 à 10 dans l'ordre.",
            "Reconnaître le cercle, le carré et le triangle.",
            "Comparer deux objets et identifier le plus grand et le plus petit.",
            "Classer les formes en groupes selon leurs propriétés."
          ],
          en: [
            "Count from 1 to 10 in the correct order.",
            "Recognise the circle, the square and the triangle.",
            "Compare two objects and identify the bigger and the smaller.",
            "Sort shapes into groups according to their properties."
          ]
        },
        diagram: "diagram-shapes.svg"
      },
      lessons: [
        {
          t: "العد من 1 إلى 10",
          intro: "نتعلم عد الأشياء من واحد إلى عشرة. نعد أصابعنا وأقلامنا لنفهم الأعداد.",
          sections: [
            ["العد بالترتيب", "نقول واحد، اثنان، ثلاثة إلى عشرة. كل عدد نقوله يأتي بعد الذي قبله. نعد ببطء ثم نعيد بسرعة."],
            ["العد على الأصابع", "لنا عشرة أصابع في أيدينا. نلمس كل إصبع ونقول عددا. هكذا نربط العدد بشيء نراه."]
          ],
          examples: [
            ["عد أربعة أقلام", ["ضع الأقلام في صف.", "لمس كل قلم وقل عددا.", "قل: واحد، اثنان، ثلاثة، أربعة."], "أربعة أقلام"],
            ["عد أصابع اليدين", ["افتح يديك.", "لمس الإصبع الأول.", "استمر حتى العاشر."], "عشرة أصابع"]
          ],
          questions: [
            ["ما العدد الذي يأتي بعد أربعة؟", ["ثلاثة", "خمسة", "سبعة", "عشرة"], 1, "العد بالترتيب يجعل خمسة بعد أربعة مباشرة."],
            ["كم أصبعا في اليدين معا؟", ["خمسة", "ستة", "عشرة", "ثمانية"], 2, "لكل يد خمسة أصابع، والمجموع عشرة."],
            ["كيف نعد الأقلام بشكل صحيح؟", ["نلمس كل قلم ونقول عددا", "نغلق أعيننا", "نقول رقما عشوائيا", "نقفز فوقها"], 0, "لمس كل شيء مع ذكر العدد يمنع تكرار العد أو نسيانه."],
            ["أي مجموعة فيها ثلاث تفاحات؟", ["تفاحة واحدة", "تفاحتان", "ثلاث تفاحات", "خمس تفاحات"], 2, "العد الدقيق يحدد أن المجموعة الثالثة تحتوي على ثلاث تفاحات."]
          ],
          tr: {
            fr: {
              t: "Compter de 1 à 10",
              intro: "On apprend à compter les objets de un à dix. On compte nos doigts et nos crayons pour comprendre les nombres.",
              sections: [
                ["Compter dans la vie", "On compte les pommes au marché et les amis en classe. Compter veut dire énoncer les nombres dans l'ordre. Chaque nombre vient après le précédent."],
                ["Compter dans l'ordre", "On dit un, deux, trois jusqu'à dix. Chaque nombre dit vient après le précédent. On compte lentement puis on recommence plus vite."],
                ["Découvrir les formes", "On voit des formes partout : un cercle dans l'assiette et un carré dans la fenêtre. Chaque forme a un nom et une image. On regarde bien puis on la nomme."],
                ["Compter sur les doigts", "Nous avons dix doigts aux mains. On touche chaque doigt en disant un nombre. Ainsi on relie le nombre à quelque chose de visible."],
                ["Comparer et classer", "On compare deux objets pour savoir lequel est plus grand ou plus petit. On classe les objets semblables dans un même groupe. L'ordre nous aide à comprendre."],
                ["Réfléchir avec des exemples", "On utilise des exemples de la maison et de l'école pour apprendre. On touche, on compte et on compare. Manipuler rend l'idée claire."]
              ],
              vocab: [
                ["nombre", "Mot utilisé pour compter comme un, deux, trois."],
                ["cercle", "Forme ronde sans coins."],
                ["carré", "Forme avec quatre côtés égaux."],
                ["plus grand", "Description d'un objet qui occupe plus de place."],
                ["plus petit", "Description d'un objet qui occupe moins de place."],
                ["groupe", "Objets semblables que l'on met ensemble."]
              ],
              examples: [
                ["Compter quatre crayons", ["Aligner les crayons.", "Toucher chaque crayon en disant un nombre.", "Dire : un, deux, trois, quatre."], "quatre crayons"],
                ["Compter les doigts des deux mains", ["Ouvrir les mains.", "Toucher le premier doigt.", "Continuer jusqu'au dixième."], "dix doigts"]
              ]
            },
            en: {
              t: "Counting from 1 to 10",
              intro: "We learn to count objects from one to ten. We count our fingers and pencils to understand numbers.",
              sections: [
                ["Counting in daily life", "We count apples at the market and friends in class. Counting means saying numbers in order. Each number comes after the one before it."],
                ["Counting in order", "We say one, two, three up to ten. Each number we say comes after the one before. We count slowly, then repeat faster."],
                ["Recognising shapes", "We see shapes everywhere: a circle in a plate and a square in a window. Each shape has a name and a picture. We look carefully, then name it."],
                ["Counting on fingers", "We have ten fingers on our hands. We touch each finger and say a number. This links the number to something we can see."],
                ["Comparing and sorting", "We compare two objects to see which is bigger or smaller. We sort similar objects into one group. Ordering helps us understand."],
                ["Thinking with examples", "We use examples from home and school to learn. We touch, count and compare. Hands-on work makes the idea clear."]
              ],
              vocab: [
                ["number", "A word we use to count, like one, two, three."],
                ["circle", "A round shape with no corners."],
                ["square", "A shape with four equal sides."],
                ["bigger", "Describing something that takes more space."],
                ["smaller", "Describing something that takes less space."],
                ["group", "Similar things we put together."]
              ],
              examples: [
                ["Count four pencils", ["Line up the pencils.", "Touch each pencil and say a number.", "Say: one, two, three, four."], "four pencils"],
                ["Count the fingers on both hands", ["Open your hands.", "Touch the first finger.", "Continue up to the tenth."], "ten fingers"]
              ]
            }
          }
        },
        {
          t: "الدائرة والمربع والمثلث",
          intro: "نتعرف على الأشكال التي نراها حولنا. لكل شكل اسم وخصائص تميزه.",
          sections: [
            ["الدائرة والمربع", "الدائرة مستديرة ولا زوايا لها، مثل الطبق. المربع له أربعة أضلاع وأربع زوايا، مثل النافذة. نلمس حواف الشكل لنتعرف عليه."],
            ["المثلث والشكل العام", "المثلث له ثلاثة أضلاع وثلاث زوايا. نجد المثلث في بعض اللافتات. نسمي الشكل بعد أن نعد أضلاعه."]
          ],
          examples: [
            ["وصف طبق مستدير", ["انظر إلى الطبق.", "ابحث عن الزوايا.", "قل: هذا شكل دائرة."], "شكل دائرة"],
            ["وصف نافذة مربعة", ["انظر إلى النافذة.", "عد الأضلاع.", "قل: أربعة أضلاع، إنه مربع."], "مربع"]
          ],
          questions: [
            ["كم ضلعا للمثلث؟", ["اثنان", "ثلاثة", "أربعة", "خمسة"], 1, "المثلث له ثلاثة أضلاع وثلاث زوايا."],
            ["أي شكل لا زوايا له؟", ["المربع", "المثلث", "الدائرة", "المستطيل"], 2, "الدائرة مستديرة بالكامل وليس لها زوايا."],
            ["كيف نعرف المربع؟", ["بعد أضلاعه الأربعة", "بلونه فقط", "بحجمه الكبير", "بصوته"], 0, "المربع يتميز بأربعة أضلاع متساوية وأربع زوايا."],
            ["الطبق يشبه ___ .", ["المثلث", "الدائرة", "المربع", "الخط"], 1, "الطبق مستدير لذلك يشبه الدائرة."]
          ],
          tr: {
            fr: {
              t: "Le cercle, le carré et le triangle",
              intro: "On découvre les formes que l'on voit autour de nous. Chaque forme a un nom et des caractéristiques.",
              sections: [
                ["Compter dans la vie", "On compte les pommes au marché et les amis en classe. Compter veut dire énoncer les nombres dans l'ordre. Chaque nombre vient après le précédent."],
                ["Le cercle et le carré", "Le cercle est rond et n'a pas de coins, comme une assiette. Le carré a quatre côtés et quatre coins, comme une fenêtre. On touche les bords pour reconnaître la forme."],
                ["Découvrir les formes", "On voit des formes partout : un cercle dans l'assiette et un carré dans la fenêtre. Chaque forme a un nom et une image. On regarde bien puis on la nomme."],
                ["Le triangle", "Le triangle a trois côtés et trois coins. On voit des triangles sur certains panneaux. On nomme la forme après avoir compté ses côtés."],
                ["Comparer et classer", "On compare deux objets pour savoir lequel est plus grand ou plus petit. On classe les objets semblables dans un même groupe. L'ordre nous aide à comprendre."],
                ["Réfléchir avec des exemples", "On utilise des exemples de la maison et de l'école pour apprendre. On touche, on compte et on compare. Manipuler rend l'idée claire."]
              ],
              vocab: [
                ["nombre", "Mot utilisé pour compter comme un, deux, trois."],
                ["cercle", "Forme ronde sans coins."],
                ["carré", "Forme avec quatre côtés égaux."],
                ["plus grand", "Description d'un objet qui occupe plus de place."],
                ["plus petit", "Description d'un objet qui occupe moins de place."],
                ["groupe", "Objets semblables que l'on met ensemble."]
              ],
              examples: [
                ["Décrire une assiette ronde", ["Regarder l'assiette.", "Chercher les coins.", "Dire : c'est un cercle."], "un cercle"],
                ["Décrire une fenêtre carrée", ["Regarder la fenêtre.", "Compter les côtés.", "Dire : quatre côtés, c'est un carré."], "un carré"]
              ]
            },
            en: {
              t: "The circle, the square and the triangle",
              intro: "We discover the shapes we see around us. Each shape has a name and special features.",
              sections: [
                ["Counting in daily life", "We count apples at the market and friends in class. Counting means saying numbers in order. Each number comes after the one before it."],
                ["The circle and the square", "A circle is round and has no corners, like a plate. A square has four sides and four corners, like a window. We touch the edges to recognise the shape."],
                ["Recognising shapes", "We see shapes everywhere: a circle in a plate and a square in a window. Each shape has a name and a picture. We look carefully, then name it."],
                ["The triangle", "A triangle has three sides and three corners. We see triangles on some signs. We name a shape after counting its sides."],
                ["Comparing and sorting", "We compare two objects to see which is bigger or smaller. We sort similar objects into one group. Ordering helps us understand."],
                ["Thinking with examples", "We use examples from home and school to learn. We touch, count and compare. Hands-on work makes the idea clear."]
              ],
              vocab: [
                ["number", "A word we use to count, like one, two, three."],
                ["circle", "A round shape with no corners."],
                ["square", "A shape with four equal sides."],
                ["bigger", "Describing something that takes more space."],
                ["smaller", "Describing something that takes less space."],
                ["group", "Similar things we put together."]
              ],
              examples: [
                ["Describe a round plate", ["Look at the plate.", "Look for corners.", "Say: it is a circle."], "a circle"],
                ["Describe a square window", ["Look at the window.", "Count the sides.", "Say: four sides, it is a square."], "a square"]
              ]
            }
          }
        },
        {
          t: "الأكبر والأصغر",
          intro: "نقارن بين شيئين لنعرف أيهما أكبر. نستخدم كلمات مثل أكبر وأصغر ومساو.",
          sections: [
            ["المقارنة بالحجم", "نضع تفاحتين جنبا إلى جنب لنرى أيهما أكبر. الشيء الذي يأخذ حيزا أكثر هو الأكبر. والآخر هو الأصغر."],
            ["المقارنة بالعدد", "نقارن مجموعتين من الأقلام. المجموعة التي فيها أقلام أكثر هي الأكبر عددا. نعد بعناية قبل أن نحكم."]
          ],
          examples: [
            ["مقارنة تفاحتين", ["ضع التفاحتين معا.", "انظر إلى الحجم.", "قل: هذه أكبر من هذه."], "إحداهما أكبر والأخرى أصغر"],
            ["مقارنة مجموعتين", ["عد أقلام المجموعة الأولى.", "عد أقلام المجموعة الثانية.", "قل: هذه المجموعة أكثر."], "المجموعة ذات الأقلام الأكثر"]
          ],
          questions: [
            ["ما معنى أكبر؟", ["يأخذ حيزا أقل", "يأخذ حيزا أكثر", "له لون واحد", "ليس له شكل"], 1, "الأكبر هو الشيء الذي يشغل مساحة أو حيزا أكثر."],
            ["إذا كانت المجموعة الأولى فيها 5 والثانية 3، أيهما أكثر؟", ["الأولى", "الثانية", "متساويتان", "لا يمكن معرفة"], 0, "العدد 5 أكبر من 3، فالمجموعة الأولى أكثر."],
            ["كيف نقارن حجم شيئين؟", ["نضعهما معا وننظر", "نغلق أعيننا", "نقول عشوائيا", "نرميهما"], 0, "وضع الشيئين معا يسمح برؤية الفرق في الحجم."],
            ["عند تساوي العددين نقول ___ .", ["أكبر", "أصغر", "متساويان", "جديد"], 2, "إذا كان العددان متماثلين فالشيئان متساويان."]
          ],
          tr: {
            fr: {
              t: "Le plus grand et le plus petit",
              intro: "On compare deux objets pour savoir lequel est le plus grand. On utilise des mots comme plus grand, plus petit et égal.",
              sections: [
                ["Compter dans la vie", "On compte les pommes au marché et les amis en classe. Compter veut dire énoncer les nombres dans l'ordre. Chaque nombre vient après le précédent."],
                ["Comparer la taille", "On place deux pommes côte à côte pour voir laquelle est la plus grande. L'objet qui prend le plus de place est le plus grand. L'autre est le plus petit."],
                ["Découvrir les formes", "On voit des formes partout : un cercle dans l'assiette et un carré dans la fenêtre. Chaque forme a un nom et une image. On regarde bien puis on la nomme."],
                ["Comparer le nombre", "On compare deux groupes de crayons. Le groupe qui contient le plus de crayons est le plus grand en nombre. On compte avec soin avant de décider."],
                ["Comparer et classer", "On compare deux objets pour savoir lequel est plus grand ou plus petit. On classe les objets semblables dans un même groupe. L'ordre nous aide à comprendre."],
                ["Réfléchir avec des exemples", "On utilise des exemples de la maison et de l'école pour apprendre. On touche, on compte et on compare. Manipuler rend l'idée claire."]
              ],
              vocab: [
                ["nombre", "Mot utilisé pour compter comme un, deux, trois."],
                ["cercle", "Forme ronde sans coins."],
                ["carré", "Forme avec quatre côtés égaux."],
                ["plus grand", "Description d'un objet qui occupe plus de place."],
                ["plus petit", "Description d'un objet qui occupe moins de place."],
                ["groupe", "Objets semblables que l'on met ensemble."]
              ],
              examples: [
                ["Comparer deux pommes", ["Placer les deux pommes ensemble.", "Regarder la taille.", "Dire : celle-ci est plus grande."], "l'une est plus grande, l'autre plus petite"],
                ["Comparer deux groupes", ["Compter les crayons du premier groupe.", "Compter ceux du deuxième groupe.", "Dire : ce groupe en a plus."], "le groupe avec le plus de crayons"]
              ]
            },
            en: {
              t: "Bigger and smaller",
              intro: "We compare two objects to see which one is bigger. We use words like bigger, smaller and equal.",
              sections: [
                ["Counting in daily life", "We count apples at the market and friends in class. Counting means saying numbers in order. Each number comes after the one before it."],
                ["Comparing size", "We place two apples side by side to see which is bigger. The object that takes more space is the bigger one. The other is the smaller one."],
                ["Recognising shapes", "We see shapes everywhere: a circle in a plate and a square in a window. Each shape has a name and a picture. We look carefully, then name it."],
                ["Comparing numbers", "We compare two groups of pencils. The group with more pencils is bigger in number. We count carefully before deciding."],
                ["Comparing and sorting", "We compare two objects to see which is bigger or smaller. We sort similar objects into one group. Ordering helps us understand."],
                ["Thinking with examples", "We use examples from home and school to learn. We touch, count and compare. Hands-on work makes the idea clear."]
              ],
              vocab: [
                ["number", "A word we use to count, like one, two, three."],
                ["circle", "A round shape with no corners."],
                ["square", "A shape with four equal sides."],
                ["bigger", "Describing something that takes more space."],
                ["smaller", "Describing something that takes less space."],
                ["group", "Similar things we put together."]
              ],
              examples: [
                ["Compare two apples", ["Place the two apples together.", "Look at their size.", "Say: this one is bigger."], "one is bigger, the other is smaller"],
                ["Compare two groups", ["Count the pencils in the first group.", "Count those in the second group.", "Say: this group has more."], "the group with more pencils"]
              ]
            }
          }
        },
        {
          t: "تصنيف الأشكال في مجموعات",
          intro: "نجمع الأشياء المتشابهة في مجموعة واحدة. التصنيف يساعدنا على ترتيب الأفكار والأشياء.",
          sections: [
            ["تصنيف حسب الشكل", "نضع كل الدوائر معا وكل المربعات معا. ننظر إلى الخصائص لا إلى اللون. هكذا تتكون مجموعات واضحة."],
            ["تصنيف حسب اللون والحجم", "يمكننا تصنيف الأقلام حسب لونها: حمراء وزرقاء. ويمكننا تصنيفها حسب الطول: طويلة وقصيرة. كل تصنيف يظهر صفة مختلفة."]
          ],
          examples: [
            ["تصنيف أشكال مختلطة", ["انظر إلى كل شكل.", "ضع الدوائر معا.", "ضع المربعات في مجموعة أخرى."], "مجموعة دوائر ومجموعة مربعات"],
            ["تصنيف أقلام حسب اللون", ["افصل الأحمر عن الأزرق.", "ضع كل لون في كيس.", "عد كل كيس."], "كيس أحمر وكيس أزرق"]
          ],
          questions: [
            ["على ماذا نبني تصنيف الأشكال؟", ["على الخصائص", "على المزاج", "على الصوت", "على السعر"], 0, "التصنيف العلمي يعتمد على خصائص الأشياء مثل الشكل."],
            ["أي مجموعة تضم الدوائر فقط؟", ["مجموعة فيها مربعان", "مجموعة فيها ثلاث دوائر", "مجموعة فيها مثلث", "مجموعة مختلطة"], 1, "المجموعة التي تحتوي على دوائر فقط هي المطلوبة."],
            ["لماذا نصنف الأشياء؟", ["لنرتّبها ونفهمها", "لنخفيها", "لنزيد حجمها", "لنغير لونها"], 0, "التصنيف يرتب الأشياء ويسهل فهمها ومقارنتها."],
            ["تصنيف الأقلام حسب الطول يظهر صفة ___ .", ["اللون", "الطول", "الرائحة", "السعر"], 1, "الطول هو الصفة التي نقارنها في هذا التصنيف."]
          ],
          tr: {
            fr: {
              t: "Classer les formes en groupes",
              intro: "On rassemble les objets semblables dans un même groupe. Classer aide à organiser les idées et les objets.",
              sections: [
                ["Compter dans la vie", "On compte les pommes au marché et les amis en classe. Compter veut dire énoncer les nombres dans l'ordre. Chaque nombre vient après le précédent."],
                ["Classer selon la forme", "On met tous les cercles ensemble et tous les carrés ensemble. On regarde les caractéristiques et non la couleur. Ainsi se forment des groupes clairs."],
                ["Découvrir les formes", "On voit des formes partout : un cercle dans l'assiette et un carré dans la fenêtre. Chaque forme a un nom et une image. On regarde bien puis on la nomme."],
                ["Classer selon la couleur et la taille", "On peut classer les crayons selon la couleur : rouges et bleus. On peut aussi les classer selon la longueur : longs et courts. Chaque classement montre un trait différent."],
                ["Comparer et classer", "On compare deux objets pour savoir lequel est plus grand ou plus petit. On classe les objets semblables dans un même groupe. L'ordre nous aide à comprendre."],
                ["Réfléchir avec des exemples", "On utilise des exemples de la maison et de l'école pour apprendre. On touche, on compte et on compare. Manipuler rend l'idée claire."]
              ],
              vocab: [
                ["nombre", "Mot utilisé pour compter comme un, deux, trois."],
                ["cercle", "Forme ronde sans coins."],
                ["carré", "Forme avec quatre côtés égaux."],
                ["plus grand", "Description d'un objet qui occupe plus de place."],
                ["plus petit", "Description d'un objet qui occupe moins de place."],
                ["groupe", "Objets semblables que l'on met ensemble."]
              ],
              examples: [
                ["Classer des formes mélangées", ["Regarder chaque forme.", "Mettre les cercles ensemble.", "Mettre les carrés dans un autre groupe."], "un groupe de cercles et un groupe de carrés"],
                ["Classer des crayons par couleur", ["Séparer le rouge du bleu.", "Mettre chaque couleur dans un sac.", "Compter chaque sac."], "un sac rouge et un sac bleu"]
              ]
            },
            en: {
              t: "Sorting shapes into groups",
              intro: "We put similar objects together in one group. Sorting helps us organise ideas and objects.",
              sections: [
                ["Counting in daily life", "We count apples at the market and friends in class. Counting means saying numbers in order. Each number comes after the one before it."],
                ["Sorting by shape", "We put all the circles together and all the squares together. We look at features, not at colour. This makes clear groups."],
                ["Recognising shapes", "We see shapes everywhere: a circle in a plate and a square in a window. Each shape has a name and a picture. We look carefully, then name it."],
                ["Sorting by colour and size", "We can sort pencils by colour: red and blue. We can also sort them by length: long and short. Each sort shows a different feature."],
                ["Comparing and sorting", "We compare two objects to see which is bigger or smaller. We sort similar objects into one group. Ordering helps us understand."],
                ["Thinking with examples", "We use examples from home and school to learn. We touch, count and compare. Hands-on work makes the idea clear."]
              ],
              vocab: [
                ["number", "A word we use to count, like one, two, three."],
                ["circle", "A round shape with no corners."],
                ["square", "A shape with four equal sides."],
                ["bigger", "Describing something that takes more space."],
                ["smaller", "Describing something that takes less space."],
                ["group", "Similar things we put together."]
              ],
              examples: [
                ["Sort mixed shapes", ["Look at each shape.", "Put the circles together.", "Put the squares in another group."], "a group of circles and a group of squares"],
                ["Sort pencils by colour", ["Separate red from blue.", "Put each colour in a bag.", "Count each bag."], "a red bag and a blue bag"]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p1_sub_math": {
      shared: {
        sections: [
          ["الأعداد حتى مئة", "نعد العشرات والآحاد في حياتنا اليومية. العشرون والمئة أعداد نستخدمها في السوق والمدرسة. فهم العدد يساعدنا على الحساب."],
          ["الجمع والطرح", "الجمع يعني ضم مجموعتين معا. والطرح يعني أخذ جزء من مجموعة. نستخدمهما في مواقف بسيطة مثل شراء الحلوى."],
          ["حل المسائل", "نقرأ المسألة بعناية ثم نحدد المطلوب. نختار العملية المناسبة ونحسب. ثم نتحقق من إجابتنا."],
          ["الأشكال والهندسة", "نعرف المربع والمستطيل والمثلث من محيطنا. لكل شكل خصائص تميزه. نعد الأضلاع والزوايا لنتعرف عليه."]
        ],
        vocab: [
          ["عشرة", "مجموعة من عشرة أشياء أو العدد 10."],
          ["عشرات", "الأعداد التي تدل على مجموعات من عشرة."],
          ["جمع", "ضم عددين للحصول على مجموع."],
          ["طرح", "أخذ عدد من آخر للحصول على الفرق."],
          ["مجموع", "نتيجة عملية الجمع."],
          ["فرق", "نتيجة عملية الطرح."]
        ],
        outcomes: [
          "يقرأ الأعداد حتى 100 ويكتبها.",
          "يجمع ويطرح أعدادا صغيرة بدقة.",
          "يحل مسائل كلامية من خطوتين.",
          "يتعرف على خصائص الأشكال الهندسية."
        ],
        outcomeTr: {
          fr: [
            "Lire et écrire les nombres jusqu'à 100.",
            "Additionner et soustraire de petits nombres avec précision.",
            "Résoudre des problèmes écrits en deux étapes.",
            "Identifier les propriétés des formes géométriques."
          ],
          en: [
            "Read and write numbers up to 100.",
            "Add and subtract small numbers accurately.",
            "Solve two-step word problems.",
            "Identify the properties of geometric shapes."
          ]
        },
        diagram: "diagram-place-value.svg"
      },
      lessons: [
        {
          t: "الأعداد من 1 إلى 100",
          intro: "نتعرف على الأعداد حتى مئة. نفهم العشرات والآحاد لنقرأ الأعداد كتابة ولفظا.",
          sections: [
            ["العشرات والآحاد", "العدد 34 يعني ثلاث عشرات وأربعة آحاد. نكتب 3 في خانة العشرات و4 في خانة الآحاد. كل خانة لها قيمة مختلفة."],
            ["العد قفزا", "نعد بالعشرات: 10، 20، 30 حتى 100. ثم نضيف الآحاد بينها. العد القفزي يسرع الحساب."]
          ],
          examples: [
            ["كتابة العدد ستة وثلاثين", ["نكتب 3 في العشرات.", "نكتب 6 في الآحاد.", "النتيجة: 36."], "36"],
            ["تحليل العدد 52", ["ننظر إلى الرقم 5.", "ننظر إلى الرقم 2.", "نقول: خمس عشرات واثنان آحاد."], "5 عشرات و2 آحاد"]
          ],
          questions: [
            ["كم عشرة في العدد 40؟", ["اثنتان", "أربع", "خمس", "عشر"], 1, "الرقم 4 في خانة العشرات يعني أربع عشرات."],
            ["ما قيمة الرقم 7 في العدد 73؟", ["سبعة آحاد", "سبع عشرات", "سبعة مئة", "صفر"], 1, "الرقم 7 في خانة العشرات يساوي سبع عشرات."],
            ["كيف نكتب خمسين؟", ["5", "50", "500", "15"], 1, "خمسون تعني خمس عشرات، فنكتب 50."],
            ["العدد الذي يأتي بعد 89 هو ___ .", ["88", "90", "99", "100"], 1, "بعد 89 يأتي 90 مباشرة في العد."]
          ],
          tr: {
            fr: {
              t: "Les nombres de 1 à 100",
              intro: "On découvre les nombres jusqu'à cent. On comprend les dizaines et les unités pour lire et écrire les nombres.",
              sections: [
                ["Les nombres jusqu'à cent", "On compte les dizaines et les unités dans la vie quotidienne. Vingt et cent sont des nombres utilisés au marché et à l'école. Comprendre un nombre aide à calculer."],
                ["Les dizaines et les unités", "Le nombre 34 veut dire trois dizaines et quatre unités. On écrit 3 dans la colonne des dizaines et 4 dans celle des unités. Chaque colonne a une valeur différente."],
                ["L'addition et la soustraction", "L'addition consiste à réunir deux groupes. La soustraction consiste à retirer une partie d'un groupe. On les utilise pour des situations simples comme acheter des bonbons."],
                ["Compter par bonds", "On compte par dizaines : 10, 20, 30 jusqu'à 100. Puis on ajoute les unités entre elles. Compter par bonds accélère le calcul."],
                ["Résoudre des problèmes", "On lit le problème avec attention puis on identifie ce qui est demandé. On choisit l'opération adéquate et on calcule. Ensuite on vérifie la réponse."],
                ["Les formes et la géométrie", "On reconnaît le carré, le rectangle et le triangle autour de nous. Chaque forme a des caractéristiques propres. On compte les côtés et les coins pour la reconnaître."]
              ],
              vocab: [
                ["dizaine", "Groupe de dix objets ou le nombre dix."],
                ["dizaines", "Nombres qui indiquent des groupes de dix."],
                ["addition", "Réunir deux nombres pour obtenir une somme."],
                ["soustraction", "Retirer un nombre d'un autre pour obtenir une différence."],
                ["somme", "Résultat de l'addition."],
                ["différence", "Résultat de la soustraction."]
              ],
              examples: [
                ["Écrire trente-six", ["Écrire 3 dans les dizaines.", "Écrire 6 dans les unités.", "Résultat : 36."], "36"],
                ["Analyser le nombre 52", ["Regarder le chiffre 5.", "Regarder le chiffre 2.", "Dire : cinq dizaines et deux unités."], "5 dizaines et 2 unités"]
              ]
            },
            en: {
              t: "Numbers from 1 to 100",
              intro: "We discover numbers up to one hundred. We understand tens and ones to read and write numbers.",
              sections: [
                ["Numbers up to one hundred", "We count tens and ones in daily life. Twenty and one hundred are numbers used at the market and school. Understanding a number helps us calculate."],
                ["Tens and ones", "The number 34 means three tens and four ones. We write 3 in the tens column and 4 in the ones column. Each column has a different value."],
                ["Addition and subtraction", "Addition means putting two groups together. Subtraction means taking part of a group away. We use them in simple situations like buying sweets."],
                ["Counting in jumps", "We count in tens: 10, 20, 30 up to 100. Then we add the ones in between. Counting in jumps makes calculating faster."],
                ["Solving problems", "We read the problem carefully, then identify what is asked. We choose the right operation and calculate. Then we check our answer."],
                ["Shapes and geometry", "We recognise the square, rectangle and triangle around us. Each shape has its own features. We count sides and corners to identify it."]
              ],
              vocab: [
                ["ten", "A group of ten things, or the number 10."],
                ["tens", "Numbers that show groups of ten."],
                ["addition", "Putting two numbers together to get a sum."],
                ["subtraction", "Taking one number from another to get a difference."],
                ["sum", "The result of adding."],
                ["difference", "The result of subtracting."]
              ],
              examples: [
                ["Write thirty-six", ["Write 3 in the tens.", "Write 6 in the ones.", "Result: 36."], "36"],
                ["Analyse the number 52", ["Look at the digit 5.", "Look at the digit 2.", "Say: five tens and two ones."], "5 tens and 2 ones"]
              ]
            }
          }
        },
        {
          t: "الجمع والطرح حتى 20",
          intro: "نتدرب على جمع عددين وطرح عدد من آخر. نربط كل عملية بموقف من حياتنا.",
          sections: [
            ["الجمع", "إذا كان معي 7 دراهم وأضفت 5، يصبح معي 12. نجمع العددين لنعرف المجموع. نكتب 7 + 5 = 12."],
            ["الطرح", "إذا كان معي 10 تفاحات وأكلت 3، يبقى 7. نطرح لنعرف ما بقي. نكتب 10 − 3 = 7."]
          ],
          examples: [
            ["جمع دراهم", ["أبدأ بـ 8 دراهم.", "أضيف 6.", "المجموع: 14 درهما."], "14 درهما"],
            ["طرح تفاحات", ["أبدأ بـ 12 تفاحة.", "آخذ 4.", "الباقي: 8 تفاحات."], "8 تفاحات"]
          ],
          questions: [
            ["ما نتيجة 9 + 6؟", ["13", "14", "15", "16"], 2, "9 + 6 = 15 لأن 9 + 1 = 10 ثم نضيف 5."],
            ["ما نتيجة 14 − 5؟", ["8", "9", "10", "11"], 1, "14 − 5 = 9 لأننا نطرح 4 للوصول إلى 10 ثم نطرح 1."],
            ["أي إشارة للجمع؟", ["+", "−", "×", "÷"], 0, "إشارة الجمع هي + وتعني ضم عددين."],
            ["إذا أضفت 3 إلى عدد فالنتيجة تكبر بـ ___ .", ["1", "2", "3", "0"], 2, "إضافة 3 تزيد العدد بمقدار 3."]
          ],
          tr: {
            fr: {
              t: "L'addition et la soustraction jusqu'à 20",
              intro: "On s'exerce à additionner deux nombres et à en soustraire un autre. On relie chaque opération à une situation de la vie.",
              sections: [
                ["Les nombres jusqu'à cent", "On compte les dizaines et les unités dans la vie quotidienne. Vingt et cent sont des nombres utilisés au marché et à l'école. Comprendre un nombre aide à calculer."],
                ["L'addition", "Si j'ai 7 dirhams et que j'en ajoute 5, j'en ai 12. On additionne les deux nombres pour connaître la somme. On écrit 7 + 5 = 12."],
                ["L'addition et la soustraction", "L'addition consiste à réunir deux groupes. La soustraction consiste à retirer une partie d'un groupe. On les utilise pour des situations simples comme acheter des bonbons."],
                ["La soustraction", "Si j'ai 10 pommes et que j'en mange 3, il en reste 7. On soustrait pour savoir ce qui reste. On écrit 10 − 3 = 7."],
                ["Résoudre des problèmes", "On lit le problème avec attention puis on identifie ce qui est demandé. On choisit l'opération adéquate et on calcule. Ensuite on vérifie la réponse."],
                ["Les formes et la géométrie", "On reconnaît le carré, le rectangle et le triangle autour de nous. Chaque forme a des caractéristiques propres. On compte les côtés et les coins pour la reconnaître."]
              ],
              vocab: [
                ["dizaine", "Groupe de dix objets ou le nombre dix."],
                ["dizaines", "Nombres qui indiquent des groupes de dix."],
                ["addition", "Réunir deux nombres pour obtenir une somme."],
                ["soustraction", "Retirer un nombre d'un autre pour obtenir une différence."],
                ["somme", "Résultat de l'addition."],
                ["différence", "Résultat de la soustraction."]
              ],
              examples: [
                ["Additionner des dirhams", ["Commencer avec 8 dirhams.", "Ajouter 6.", "Somme : 14 dirhams."], "14 dirhams"],
                ["Soustraire des pommes", ["Commencer avec 12 pommes.", "En prendre 4.", "Reste : 8 pommes."], "8 pommes"]
              ]
            },
            en: {
              t: "Addition and subtraction up to 20",
              intro: "We practise adding two numbers and subtracting one from another. We link each operation to a real situation.",
              sections: [
                ["Numbers up to one hundred", "We count tens and ones in daily life. Twenty and one hundred are numbers used at the market and school. Understanding a number helps us calculate."],
                ["Addition", "If I have 7 dirhams and add 5, I have 12. We add the two numbers to find the sum. We write 7 + 5 = 12."],
                ["Addition and subtraction", "Addition means putting two groups together. Subtraction means taking part of a group away. We use them in simple situations like buying sweets."],
                ["Subtraction", "If I have 10 apples and eat 3, 7 remain. We subtract to find what is left. We write 10 − 3 = 7."],
                ["Solving problems", "We read the problem carefully, then identify what is asked. We choose the right operation and calculate. Then we check our answer."],
                ["Shapes and geometry", "We recognise the square, rectangle and triangle around us. Each shape has its own features. We count sides and corners to identify it."]
              ],
              vocab: [
                ["ten", "A group of ten things, or the number 10."],
                ["tens", "Numbers that show groups of ten."],
                ["addition", "Putting two numbers together to get a sum."],
                ["subtraction", "Taking one number from another to get a difference."],
                ["sum", "The result of adding."],
                ["difference", "The result of subtracting."]
              ],
              examples: [
                ["Add dirhams", ["Start with 8 dirhams.", "Add 6.", "Sum: 14 dirhams."], "14 dirhams"],
                ["Subtract apples", ["Start with 12 apples.", "Take away 4.", "Left: 8 apples."], "8 apples"]
              ]
            }
          }
        },
        {
          t: "حل مسائل كلامية",
          intro: "نقرأ المسألة ونفهم ما تطلبه. نختار العملية ثم نحسب ونتحقق.",
          sections: [
            ["فهم المسألة", "نقرأ المسألة مرتين ونحدد الأرقام المذكورة. نسأل: ماذا نعرف وماذا نريد؟ هذه الخطوة تمنع الأخطاء."],
            ["التحقق من الإجابة", "بعد الحساب نعيد القراءة لنرى هل الإجابة منطقية. إذا جمعنا عددين يجب أن تكون النتيجة أكبر من كل واحد منهما."]
          ],
          examples: [
            ["مسألة تفاحات", ["لدي 6 تفاحات واشتريت 4.", "أجمع: 6 + 4.", "الجواب: 10 تفاحات."], "10 تفاحات"],
            ["مسألة دراهم", ["مع أحمد 20 درهما وأنفق 7.", "أحسب: 20 − 7.", "الجواب: 13 درهما."], "13 درهما"]
          ],
          questions: [
            ["في مسألة لدي 5 وأضفت 3، ما العملية؟", ["الجمع", "الطرح", "القسمة", "المقارنة"], 0, "كلمة أضفت تعني جمع العددين."],
            ["ما أول خطوة في حل المسألة؟", ["قراءتها بعناية", "كتابة الجواب", "القفز", "الرسم عشوائيا"], 0, "الفهم الجيد يأتي قبل الحساب."],
            ["إذا كانت النتيجة أصغر من العدد الأصلي فالعملية ___ .", ["جمع", "طرح", "مقارنة", "عد"], 1, "الطرح ينقص العدد، لذا تكون النتيجة أصغر."],
            ["لماذا نتحقق من الجواب؟", ["لنتأكد من صحته", "لنغير السؤال", "لنزيد الوقت", "لننسى"], 0, "التحقق يكشف الأخطاء ويؤكد منطقية الإجابة."]
          ],
          tr: {
            fr: {
              t: "Résoudre des problèmes écrits",
              intro: "On lit le problème et on identifie ce qu'il demande. On choisit l'opération, on calcule puis on vérifie.",
              sections: [
                ["Les nombres jusqu'à cent", "On compte les dizaines et les unités dans la vie quotidienne. Vingt et cent sont des nombres utilisés au marché et à l'école. Comprendre un nombre aide à calculer."],
                ["Comprendre le problème", "On lit le problème deux fois et on relève les nombres mentionnés. On se demande : que sais-je et que veux-je trouver ? Cette étape évite les erreurs."],
                ["L'addition et la soustraction", "L'addition consiste à réunir deux groupes. La soustraction consiste à retirer une partie d'un groupe. On les utilise pour des situations simples comme acheter des bonbons."],
                ["Vérifier la réponse", "Après le calcul, on relit pour voir si la réponse est logique. Si on additionne deux nombres, le résultat doit être plus grand."],
                ["Résoudre des problèmes", "On lit le problème avec attention puis on identifie ce qui est demandé. On choisit l'opération adéquate et on calcule. Ensuite on vérifie la réponse."],
                ["Les formes et la géométrie", "On reconnaît le carré, le rectangle et le triangle autour de nous. Chaque forme a des caractéristiques propres. On compte les côtés et les coins pour la reconnaître."]
              ],
              vocab: [
                ["dizaine", "Groupe de dix objets ou le nombre dix."],
                ["dizaines", "Nombres qui indiquent des groupes de dix."],
                ["addition", "Réunir deux nombres pour obtenir une somme."],
                ["soustraction", "Retirer un nombre d'un autre pour obtenir une différence."],
                ["somme", "Résultat de l'addition."],
                ["différence", "Résultat de la soustraction."]
              ],
              examples: [
                ["Problème de pommes", ["J'ai 6 pommes et j'en achète 4.", "J'additionne : 6 + 4.", "Réponse : 10 pommes."], "10 pommes"],
                ["Problème de dirhams", ["Ahmed a 20 dirhams et en dépense 7.", "Je calcule : 20 − 7.", "Réponse : 13 dirhams."], "13 dirhams"]
              ]
            },
            en: {
              t: "Solving word problems",
              intro: "We read a problem and understand what it asks. We choose the operation, calculate and check.",
              sections: [
                ["Numbers up to one hundred", "We count tens and ones in daily life. Twenty and one hundred are numbers used at the market and school. Understanding a number helps us calculate."],
                ["Understanding the problem", "We read the problem twice and note the numbers given. We ask: what do I know and what do I need to find? This step prevents mistakes."],
                ["Addition and subtraction", "Addition means putting two groups together. Subtraction means taking part of a group away. We use them in simple situations like buying sweets."],
                ["Checking the answer", "After calculating, we reread to see if the answer makes sense. If we add two numbers, the result must be bigger than each one."],
                ["Solving problems", "We read the problem carefully, then identify what is asked. We choose the right operation and calculate. Then we check our answer."],
                ["Shapes and geometry", "We recognise the square, rectangle and triangle around us. Each shape has its own features. We count sides and corners to identify it."]
              ],
              vocab: [
                ["ten", "A group of ten things, or the number 10."],
                ["tens", "Numbers that show groups of ten."],
                ["addition", "Putting two numbers together to get a sum."],
                ["subtraction", "Taking one number from another to get a difference."],
                ["sum", "The result of adding."],
                ["difference", "The result of subtracting."]
              ],
              examples: [
                ["Apple problem", ["I have 6 apples and buy 4.", "I add: 6 + 4.", "Answer: 10 apples."], "10 apples"],
                ["Dirham problem", ["Ahmed has 20 dirhams and spends 7.", "I calculate: 20 − 7.", "Answer: 13 dirhams."], "13 dirhams"]
              ]
            }
          }
        },
        {
          t: "أشكال حولنا",
          intro: "نعرف أشكالا هندسية نراها في الصف والبيت. نميزها بعد أضلاعها وزواياها.",
          sections: [
            ["المستطيل والمربع", "المستطيل له أربعة أضلاع، ضلعان طويلان وضلعان قصيران. المربع كل أضلاعه متساوية. كلاهما له أربع زوايا."],
            ["الشكل والواقع", "اللوح في الصف مستطيل. وقطعة اللعبة المربعة تشبه المربع. نربط الشكل الهندسي بشيء حقيقي لنتذكره."]
          ],
          examples: [
            ["وصف اللوح", ["انظر إلى لوح الصف.", "عد أضلاعه.", "قل: إنه مستطيل."], "مستطيل"],
            ["وصف قطعة لعبة", ["انظر إلى القطعة المربعة.", "قارن أضلاعها.", "قل: أضلاعها متساوية، إنها مربع."], "مربع"]
          ],
          questions: [
            ["كم ضلعا للمستطيل؟", ["ثلاثة", "أربعة", "خمسة", "اثنان"], 1, "المستطيل له أربعة أضلاع، اثنان طويلان واثنان قصيران."],
            ["ما الفرق بين المربع والمستطيل؟", ["المربع أضلاعه متساوية", "المستطيل مستدير", "المربع بلا زوايا", "لا فرق"], 0, "في المربع كل الأضلاع متساوية، بينما في المستطيل ضلعان طويلان وضلعان قصيران."],
            ["أي شيء يشبه المستطيل؟", ["الطبق", "لوح الصف", "العملة", "الكرة"], 1, "لوح الصف مستطيل الشكل."],
            ["الزوايا في المربع ___ .", ["أربع", "ثلاث", "اثنتان", "لا توجد"], 0, "للمربع أربع زوايا قائمة."]
          ],
          tr: {
            fr: {
              t: "Les formes autour de nous",
              intro: "On reconnaît des formes géométriques dans la classe et à la maison. On les distingue par leurs côtés et leurs coins.",
              sections: [
                ["Les nombres jusqu'à cent", "On compte les dizaines et les unités dans la vie quotidienne. Vingt et cent sont des nombres utilisés au marché et à l'école. Comprendre un nombre aide à calculer."],
                ["Le rectangle et le carré", "Le rectangle a quatre côtés : deux longs et deux courts. Le carré a tous ses côtés égaux. Les deux ont quatre coins."],
                ["L'addition et la soustraction", "L'addition consiste à réunir deux groupes. La soustraction consiste à retirer une partie d'un groupe. On les utilise pour des situations simples comme acheter des bonbons."],
                ["La forme et la réalité", "Le tableau de la classe est un rectangle. Un plateau de jeu carré ressemble à un carré. On relie la forme géométrique à un objet réel pour s'en souvenir."],
                ["Résoudre des problèmes", "On lit le problème avec attention puis on identifie ce qui est demandé. On choisit l'opération adéquate et on calcule. Ensuite on vérifie la réponse."],
                ["Les formes et la géométrie", "On reconnaît le carré, le rectangle et le triangle autour de nous. Chaque forme a des caractéristiques propres. On compte les côtés et les coins pour la reconnaître."]
              ],
              vocab: [
                ["dizaine", "Groupe de dix objets ou le nombre dix."],
                ["dizaines", "Nombres qui indiquent des groupes de dix."],
                ["addition", "Réunir deux nombres pour obtenir une somme."],
                ["soustraction", "Retirer un nombre d'un autre pour obtenir une différence."],
                ["somme", "Résultat de l'addition."],
                ["différence", "Résultat de la soustraction."]
              ],
              examples: [
                ["Décrire le tableau", ["Regarder le tableau de la classe.", "Compter ses côtés.", "Dire : c'est un rectangle."], "un rectangle"],
                ["Décrire un plateau de jeu", ["Regarder le plateau carré.", "Comparer ses côtés.", "Dire : ses côtés sont égaux, c'est un carré."], "un carré"]
              ]
            },
            en: {
              t: "Shapes around us",
              intro: "We recognise geometric shapes in the classroom and at home. We tell them apart by their sides and corners.",
              sections: [
                ["Numbers up to one hundred", "We count tens and ones in daily life. Twenty and one hundred are numbers used at the market and school. Understanding a number helps us calculate."],
                ["The rectangle and the square", "A rectangle has four sides: two long and two short. A square has all its sides equal. Both have four corners."],
                ["Addition and subtraction", "Addition means putting two groups together. Subtraction means taking part of a group away. We use them in simple situations like buying sweets."],
                ["Shapes in real life", "The classroom board is a rectangle. A square game board looks like a square. We link a geometric shape to a real object to remember it."],
                ["Solving problems", "We read the problem carefully, then identify what is asked. We choose the right operation and calculate. Then we check our answer."],
                ["Shapes and geometry", "We recognise the square, rectangle and triangle around us. Each shape has its own features. We count sides and corners to identify it."]
              ],
              vocab: [
                ["ten", "A group of ten things, or the number 10."],
                ["tens", "Numbers that show groups of ten."],
                ["addition", "Putting two numbers together to get a sum."],
                ["subtraction", "Taking one number from another to get a difference."],
                ["sum", "The result of adding."],
                ["difference", "The result of subtracting."]
              ],
              examples: [
                ["Describe the board", ["Look at the classroom board.", "Count its sides.", "Say: it is a rectangle."], "a rectangle"],
                ["Describe a game board", ["Look at the square board.", "Compare its sides.", "Say: its sides are equal, it is a square."], "a square"]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p2_sub_amz": {
      shared: {
        sections: [
          ["L'écriture tifinagh", "L'amazigh s'écrit avec l'alphabet tifinagh. Chaque symbole représente un son. On apprend à reconnaître les lettres une à une."],
          ["Les mots amazighs", "Un mot est formé de lettres tifinaghs. Les mots courts sont plus faciles à lire. On lit lentement puis plus vite."],
          ["La phrase simple", "Une phrase exprime une idée complète. En amazigh, l'ordre des mots est important. On commence par le sujet puis l'action."],
          ["Comprendre un texte", "Pour comprendre, on cherche les mots connus. On relit chaque phrase avec attention. Les images aident aussi à deviner le sens."]
        ],
        vocab: [
          ["tifinagh", "Alphabet utilisé pour écrire l'amazigh."],
          ["lettre", "Symbole qui représente un son."],
          ["mot", "Ensemble de lettres qui a un sens."],
          ["phrase", "Ensemble de mots qui exprime une idée."],
          ["sujet", "La personne ou la chose dont on parle."],
          ["action", "Ce que fait le sujet."]
        ],
        outcomes: [
          "Reconnaître quelques lettres tifinaghs.",
          "Lire des mots amazighs courts.",
          "Construire une phrase simple.",
          "Comprendre le sens d'un petit texte."
        ],
        diagram: "diagram-french-alphabet.svg"
      },
      lessons: [
        {
          t: "Découvrir les lettres tifinaghs",
          intro: "L'amazigh a son propre alphabet. Apprenons à reconnaître les premières lettres.",
          sections: [
            ["Les symboles tifinaghs", "Chaque lettre tifinagh a une forme simple. Certaines ressemblent à un cercle ou à une croix. On les trace du doigt avant de les écrire."],
            ["Les sons des lettres", "Une lettre correspond à un son. Quand on voit la lettre, on dit son son. Relier la forme au son aide à mémoriser."]
          ],
          examples: [
            ["Reconnaître une lettre", ["Regarder la forme de la lettre.", "Dire son son.", "La retrouver dans un mot."], "La lettre est reconnue par sa forme et son son."],
            ["Tracer une lettre", ["Poser le doigt sur la lettre.", "Suivre son contour.", "L'écrire sur le cahier."], "La lettre est tracée correctement."]
          ],
          questions: [
            ["Comment s'appelle l'alphabet amazigh ?", ["Le latin", "Le tifinagh", "Le grec", "L'arabe"], 1, "L'amazigh s'écrit avec l'alphabet tifinagh."],
            ["Que représente une lettre ?", ["Un son", "Une couleur", "Un nombre", "Une image"], 0, "Chaque lettre tifinagh correspond à un son."],
            ["Comment apprendre une lettre tifinagh nouvelle au cahier ?", ["La tracer et la dire", "La cacher", "La chanter fort", "L'ignorer"], 0, "Tracer la forme et dire le son renforce la mémoire."],
            ["Une lettre tifinagh peut ressembler à ___ .", ["un cercle", "un nuage", "une montagne", "une rivière"], 0, "Certaines lettres tifinaghs ont des formes géométriques simples comme le cercle."]
          ]
        },
        {
          t: "Lire des mots amazighs",
          intro: "Les lettres s'assemblent pour former des mots. Entrons dans la lecture des mots courts.",
          sections: [
            ["Assembler les lettres", "Quand on assemble deux ou trois lettres, on obtient un mot. On lit chaque son puis on les joint. La lecture devient plus fluide avec la pratique."],
            ["Les mots courts", "Les mots comme Azul sont courts et faciles. On les lit lentement au début. Puis on les reconnaît du premier coup."]
          ],
          examples: [
            ["Lire le mot Azul", ["Repérer chaque lettre.", "Dire chaque son.", "Joindre les sons : A-zu-l."], "Azul"],
            ["Lire un mot de trois lettres", ["Séparer les lettres.", "Lire chaque son.", "Assembler le mot."], "Le mot est lu correctement."]
          ],
          questions: [
            ["Que obtient-on en assemblant des lettres ?", ["Un mot", "Une couleur", "Un son seul", "Une page"], 0, "L'assemblage de lettres forme un mot."],
            ["Comment lire un mot tifinagh difficile en début de lecture ?", ["Lentement, son par son", "Très vite", "Sans regarder", "À l'envers"], 0, "Lire lentement chaque son puis assembler donne le mot."],
            ["Quel mot amazigh signifie bonjour ?", ["Azul", "Livre", "École", "Merci"], 0, "Azul est le salut amazigh."],
            ["La pratique rend la lecture ___ .", ["plus fluide", "plus lente", "plus difficile", "invisible"], 0, "Lire souvent rend la lecture plus fluide."]
          ]
        },
        {
          t: "Écrire une phrase simple",
          intro: "Une phrase dit une idée complète. Apprenons à la construire correctement.",
          sections: [
            ["Le sujet et l'action", "Une phrase simple dit qui fait quoi. Le sujet est la personne, l'action est ce qu'elle fait. On place le sujet avant l'action en amazigh."],
            ["La ponctuation", "Une phrase commence par une majuscule et se termine par un point. Le point montre que l'idée est finie. Relire sa phrase évite les erreurs."]
          ],
          examples: [
            ["Construire une phrase", ["Choisir un sujet : l'enfant.", "Choisir une action : joue.", "Écrire : L'enfant joue."], "L'enfant joue."],
            ["Corriger une phrase", ["Lire la phrase à voix haute.", "Vérifier la majuscule.", "Ajouter le point final."], "La phrase est correcte."]
          ],
          questions: [
            ["Qu'est-ce qu'une phrase simple ?", ["Une idée complète", "Une seule lettre", "Un seul son", "Une image"], 0, "Une phrase exprime une idée complète avec un sujet et une action."],
            ["Qui est le sujet dans L'enfant joue ?", ["L'enfant", "Joue", "Le point", "La majuscule"], 0, "Le sujet est la personne dont on parle : l'enfant."],
            ["Dans une phrase amazigh écrite au cahier, par quoi commence-t-on ?", ["Une majuscule", "Un point", "Une virgule", "Un espace"], 0, "La phrase commence par une majuscule."],
            ["Que montre le point final ?", ["La fin de l'idée", "Le début", "Une question", "Un cri"], 0, "Le point indique que la phrase est terminée."]
          ]
        },
        {
          t: "Comprendre un petit texte",
          intro: "Lire, c'est aussi comprendre. Découvrons comment trouver le sens d'un texte.",
          sections: [
            ["Chercher les mots connus", "Quand on lit un texte, on repère d'abord les mots que l'on connaît. Ils donnent des indices sur le sens. Les images aident aussi à comprendre."],
            ["Relire pour comprendre", "Une première lecture donne une idée générale. Une deuxième lecture précise les détails. On peut expliquer le texte avec ses propres mots."]
          ],
          examples: [
            ["Lire un texte court", ["Lire une première fois.", "Souligner les mots connus.", "Dire de quoi parle le texte."], "Le texte parle de la famille."],
            ["Répondre à une question", ["Relire la phrase concernée.", "Chercher le mot réponse.", "Répondre avec une phrase courte."], "La réponse est dans le texte."]
          ],
          questions: [
            ["Que faire en premier devant un texte ?", ["Repérer les mots connus", "Fermer le livre", "Écrire sans lire", "Sauter les phrases"], 0, "Les mots connus servent de repères pour comprendre."],
            ["À quoi sert la deuxième lecture ?", ["À préciser les détails", "À oublier le texte", "À le rendre plus court", "À changer les mots"], 0, "Relire permet de saisir les détails."],
            ["Comment expliquer un texte ?", ["Avec ses propres mots", "En le recopiant seulement", "En le cachant", "En criant"], 0, "Reformuler avec ses mots montre la compréhension."],
            ["Les images dans un texte aident à ___ .", ["comprendre le sens", "compter les pages", "fermer le livre", "écrire plus vite"], 0, "Les images donnent des indices visuels sur le sens."]
          ]
        }
      ]
    },
    "cur_l_p3_sub_fr": {
      shared: {
        sections: [
          ["Lire un texte court", "Un texte court raconte une petite histoire ou donne une information. On le lit d'abord silencieusement. Puis on le lit à voix haute avec la bonne intonation."],
          ["Comprendre ce que l'on lit", "Pour comprendre, on cherche qui fait quoi et où. On relève les mots importants. Les images et le titre aident aussi."],
          ["Écrire une phrase", "Une phrase commence par une majuscule et finit par un point. Les mots sont séparés par des espaces. Écrire clairement aide le lecteur."],
          ["Les mots de la grammaire", "Le nom désigne une personne ou un objet. Le verbe exprime l'action. L'adjectif décrit le nom."]
        ],
        vocab: [
          ["texte", "Ensemble de phrases qui racontent quelque chose."],
          ["titre", "Le nom donné à un texte."],
          ["phrase", "Ensemble de mots qui exprime une idée."],
          ["nom", "Mot qui désigne une personne ou une chose."],
          ["verbe", "Mot qui exprime une action."],
          ["adjectif", "Mot qui décrit un nom."]
        ],
        outcomes: [
          "Lire un texte court avec aisance.",
          "Répondre à des questions de compréhension.",
          "Écrire quelques phrases correctes.",
          "Identifier nom, verbe et adjectif."
        ],
        diagram: "diagram-french-alphabet.svg"
      },
      lessons: [
        {
          t: "Lire un petit texte",
          intro: "Les mots assemblés racontent une histoire. Apprenons à les lire avec soin.",
          sections: [
            ["Le titre et les images", "Avant de lire, on regarde le titre et les images. Ils annoncent le sujet du texte. Cela prépare l'esprit à comprendre."],
            ["La lecture à voix haute", "On lit chaque phrase jusqu'au point. On marque une petite pause à la virgule. Une voix claire rend le texte agréable."]
          ],
          examples: [
            ["Lire une phrase simple", ["Regarder le titre.", "Lire la phrase jusqu'au point.", "Dire ce que dit la phrase."], "La phrase est lue clairement."],
            ["Lire avec la bonne voix", ["Repérer la virgule.", "Faire une courte pause.", "Continuer jusqu'au point."], "La lecture est fluide."]
          ],
          questions: [
            ["Que regarde-t-on avant de lire ?", ["Le titre et les images", "La dernière page", "Le dos du livre", "La couverture seulement"], 0, "Le titre et les images donnent une première idée du sujet."],
            ["Jusqu'où lit-on une phrase ?", ["Jusqu'au point", "Jusqu'à la virgule", "Jusqu'au mot", "Jusqu'à la page"], 0, "La phrase s'arrête au point."],
            ["Comment lire à voix haute un texte court en français ?", ["Avec une voix claire", "Très vite", "Sans respirer", "En chuchotant"], 0, "Une voix claire et des pauses rendent la lecture compréhensible."],
            ["La virgule indique ___ .", ["une courte pause", "la fin du texte", "une question", "un cri"], 0, "La virgule marque une courte pause dans la phrase."]
          ]
        },
        {
          t: "Répondre aux questions de lecture",
          intro: "Après la lecture, on vérifie ce que l'on a compris. Les réponses se trouvent dans le texte.",
          sections: [
            ["Chercher dans le texte", "Quand on répond, on relit la phrase qui contient la réponse. On ne devine pas au hasard. La réponse se trouve dans le texte."],
            ["Répondre avec une phrase", "Une bonne réponse est une phrase complète. Elle reprend le sujet et l'action. On vérifie l'orthographe après avoir écrit."]
          ],
          examples: [
            ["Trouver qui fait l'action", ["Relire la première phrase.", "Chercher le nom du personnage.", "Répondre : Le garçon joue."], "Le garçon joue."],
            ["Répondre où se passe l'action", ["Chercher le mot de lieu.", "Lire la phrase entière.", "Répondre : À l'école."], "À l'école."]
          ],
          questions: [
            ["Où trouver la réponse ?", ["Dans le texte", "Dans son imagination", "Dans un autre livre", "Sur la couverture"], 0, "La réponse est dans le texte lu."],
            ["Comment être sûr de sa réponse ?", ["Relire la phrase", "Deviner", "Choisir au hasard", "Sauter la question"], 0, "Relire permet de trouver la réponse exacte."],
            ["Une bonne réponse est ___ .", ["une phrase complète", "un seul mot toujours", "un dessin", "un silence"], 0, "Une phrase complète est plus claire qu'un mot isolé."],
            ["Après avoir écrit votre réponse de lecture, que vérifiez-vous ?", ["L'orthographe", "La couleur du papier", "L'heure", "Le bruit"], 0, "Relire son écriture permet de corriger les fautes."]
          ]
        },
        {
          t: "Écrire quelques phrases",
          intro: "Écrire, c'est mettre ses idées en forme. Quelques règles simples rendent le texte clair.",
          sections: [
            ["Les règles de la phrase", "Une phrase commence par une majuscule et se termine par un point. On met un espace entre les mots. Ces règles rendent l'écriture lisible."],
            ["Relier ses idées", "On écrit une idée par phrase. On peut utiliser et pour joindre deux idées. Relire son texte améliore la clarté."]
          ],
          examples: [
            ["Écrire une phrase sur sa famille", ["Commencer par une majuscule.", "Écrire l'idée.", "Mettre un point."], "Ma famille est grande."],
            ["Joindre deux idées", ["Écrire la première idée.", "Ajouter et.", "Écrire la deuxième idée."], "Je joue et je lis."]
          ],
          questions: [
            ["Quand on écrit une phrase en français, par quoi commence-t-elle ?", ["Une majuscule", "Un point", "Une virgule", "Un chiffre"], 0, "La première lettre d'une phrase est une majuscule."],
            ["Que met-on entre les mots ?", ["Un espace", "Un point", "Une virgule", "Rien"], 0, "Les mots sont séparés par des espaces."],
            ["Quel mot joint deux idées ?", ["et", "mais toujours", "le", "très"], 0, "La conjonction et relie deux idées simples."],
            ["Pourquoi relire le texte que vous venez d'écrire en français ?", ["Pour corriger les fautes", "Pour le cacher", "Pour le raccourcir", "Pour dormir"], 0, "La relecture permet de repérer et corriger les erreurs."]
          ]
        },
        {
          t: "Reconnaître nom, verbe, adjectif",
          intro: "Les mots ont des rôles différents dans la phrase. Apprenons à les repérer.",
          sections: [
            ["Le nom et le verbe", "Le nom désigne une personne ou un objet : chat, école. Le verbe dit ce qu'on fait : mange, court. Une phrase contient souvent les deux."],
            ["L'adjectif", "L'adjectif décrit le nom : petit chat, grande école. Il donne une information supplémentaire. On le place généralement après le nom en français."]
          ],
          examples: [
            ["Trouver le nom", ["Lire la phrase : Le chat mange.", "Chercher la personne ou l'objet.", "Répondre : chat."], "chat"],
            ["Trouver l'adjectif", ["Lire : Le petit chat.", "Chercher le mot qui décrit.", "Répondre : petit."], "petit"]
          ],
          questions: [
            ["Quel est le nom dans Le chat mange ?", ["chat", "mange", "Le", "point"], 0, "Chat désigne un animal, c'est le nom."],
            ["Quel est le verbe dans Il court ?", ["court", "Il", "rapidement", "espace"], 0, "Court exprime l'action, c'est le verbe."],
            ["Que fait l'adjectif ?", ["Il décrit le nom", "Il remplace le point", "Il coupe la phrase", "Il compte les mots"], 0, "L'adjectif apporte une description du nom."],
            ["Dans grande école, l'adjectif est ___ .", ["grande", "école", "le", "une"], 0, "Grande décrit l'école, c'est l'adjectif."]
          ]
        }
      ]
    },
    "cur_l_p3_sub_art": {
      shared: {
        sections: [
          ["الفن في حياتنا", "نرى الفن في الرسوم والألوان والأنغام. الفن يعبر عن أفكارنا ومشاعرنا. كل طفل قادر على الإبداع."],
          ["المشاهدة والدقة", "الفنان ينظر جيدا قبل أن يبدأ العمل. يلاحظ الأشكال والألوان والتفاصيل. الملاحظة الدقيقة تجعل العمل أجمل."],
          ["التجربة والتكرار", "نتعلم الفن بالتجربة والتكرار. نجرب أكثر من طريقة ثم نختار الأفضل. الخطأ جزء من التعلم."],
          ["عرض العمل وتقديره", "نعرض أعمالنا على زملائنا ونستمع لآرائهم. نقدر عمل الآخرين بكلمات لطيفة. العرض يزيد الثقة."]
        ],
        vocab: [
          ["رسم", "صورة نرسمها بقلم أو فرشاة."],
          ["لون", "ما نضيفه للرسم مثل الأحمر أو الأزرق."],
          ["إيقاع", "تكرار منظم للأصوات في الموسيقى."],
          ["تمثيل", "تقمص دور وأداءه أمام الآخرين."],
          ["إبداع", "ابتكار شيء جديد بطريقتك."],
          ["تفصيل", "جزء صغير يضيف دقة للعمل الفني."]
        ],
        outcomes: [
          "يرسم الطفل أشكالا بسيطة بدقة.",
          "يختار ألوانا مناسبة لعمله.",
          "يميز إيقاعا بسيطا في الموسيقى.",
          "يشارك في تمثيل مشهد قصير."
        ],
        diagram: "diagram-colors.svg"
      },
      lessons: [
        {
          t: "الرسم بالقلم",
          intro: "نبدأ بالخطوط البسيطة لنبني منها أشكالا جميلة. الرسم يحتاج إلى نظر وتأنٍّ.",
          sections: [
            ["الخطوط والأشكال", "نبدأ برسم خطوط بسيطة: مستقيمة ومنحنية. من الخطوط تتكون الأشكال. الضغط الخفيف على القلم يجعل الخط جميلا."],
            ["رسم من الطبيعة", "ننظر إلى ورقة شجر أو تفاحة ثم نرسمها. نبدأ بالشكل العام ثم نضيف التفاصيل. النظر الجيد يساعد على الرسم."]
          ],
          examples: [
            ["رسم منزل بسيط", ["ارسم مربعا للبيت.", "أضف مثلثا للسقف.", "ارسم بابا ونوافذ."], "منزل مرسوم بخطوط واضحة"],
            ["رسم ورقة شجر", ["انظر إلى شكل الورقة.", "ارسم محيطها.", "أضف الخطوط الداخلية."], "ورقة شجر مرسومة بدقة"]
          ],
          questions: [
            ["ما الذي تتكون منه الأشكال؟", ["الخطوط", "الأصوات", "الروائح", "الطعم"], 0, "الخطوط تتجمع لتكوّن الأشكال."],
            ["كيف نرسم تفاحة جيدا؟", ["ننظر إليها ثم نرسم شكلها", "نرسم بدون نظر", "نغلق أعيننا", "نكتب عنها"], 0, "الملاحظة قبل الرسم تجعل الصورة أقرب للواقع."],
            ["ما أول خطوة لرسم منزل؟", ["رسم الشكل الأساسي", "تلوين السقف", "كتابة الاسم", "قص الورقة"], 0, "نبدأ بالشكل العام ثم نضيف التفاصيل."],
            ["الضغط الخفيف على القلم يجعل الخط ___ .", ["أجمل", "أغمق", "أقصر", "أخشن"], 0, "الضغط الخفيف يعطي خطا رقيقا وجميلا."]
          ]
        },
        {
          t: "التلوين بعناية",
          intro: "الألوان تضيف الحياة للرسم. نتعلم كيف نختارها ونستخدمها بشكل مرتب.",
          sections: [
            ["اختيار الألوان", "نختار لونا مناسبا للشيء الذي نرسمه. السماء زرقاء والشمس صفراء. تناسق الألوان يجعل الرسم مبهجا."],
            ["التلوين داخل الحدود", "نلون من الداخل إلى الخارج بلطف. نحافظ على حدود الشكل دون تجاوزها. التأني يعطي نتيجة مرتبة."]
          ],
          examples: [
            ["تلوين السماء", ["اختر قلما أزرق.", "لون من الأعلى.", "استمر حتى تمتلئ المساحة."], "سماء زرقاء مرتبة"],
            ["تلوين تفاحة", ["اختر الأحمر.", "لون داخل الحدود.", "اترك مساحة صغيرة للضوء."], "تفاحة حمراء جميلة"]
          ],
          questions: [
            ["أي لون للسماء في الرسم؟", ["الأحمر", "الأزرق", "الأسود", "البني"], 1, "نلون السماء بالأزرق كما نراها في الواقع."],
            ["كيف نلون السماء والتفاحة داخل حدود الرسم؟", ["من الداخل بلطف", "بسرعة عشوائية", "خارج الحدود", "بقوة كبيرة"], 0, "التلوين الهادئ داخل الحدود يعطي عملا مرتبا."],
            ["ما فائدة تناسق الألوان؟", ["يجعل الرسم مبهجا", "يخفي الرسم", "يصعب الرؤية", "يوقف الإبداع"], 0, "الألوان المتناسقة تريح العين وتجمل العمل."],
            ["إذا أخطأنا في التلوين ن___ .", ["نصلح بهدوء", "نمزق الورقة", "نتوقف للأبد", "نغضب"], 0, "الخطأ فرصة للتصحيح والتعلم."]
          ]
        },
        {
          t: "الإيقاع والموسيقى",
          intro: "الموسيقى تتكون من أصوات منظمة. نكتشف الإيقاع بالتصفيق والاستماع.",
          sections: [
            ["الصوت والإيقاع", "الموسيقى تتكون من أصوات متكررة بانتظام. هذا التكرار يسمى الإيقاع. نصفق بأيدينا لنحس بالإيقاع."],
            ["الآلات البسيطة", "يمكننا صنع موسيقى بالطبل أو بالدربكة. كل آلة تعطي صوتا مختلفا. نصغي جيدا قبل أن نعزف معا."]
          ],
          examples: [
            ["صنع إيقاع بالتصفيق", ["صفق مرتين.", "اسكت قليلا.", "أعد التصفيق."], "إيقاع: صفق صفق، سكوت، صفق صفق"],
            ["الاستماع للدربكة", ["اصغ إلى الصوت.", "ميز بين الضربات.", "قلد الإيقاع."], "إيقاع الدربكة مقلد بدقة"]
          ],
          questions: [
            ["ما الإيقاع في الموسيقى؟", ["تكرار منظم للأصوات", "لون الرسم", "شكل الورقة", "رائحة الزهرة"], 0, "الإيقاع هو تكرار الأصوات بانتظام."],
            ["كيف نحس بالإيقاع؟", ["بالتصفيق", "بالصمت التام", "بالقراءة", "بالنوم"], 0, "التصفيق يساعد على إحساس الجسم بالإيقاع."],
            ["أي آلة تصدر صوتا؟", ["الدربكة", "القلم", "الورقة", "المعدة"], 0, "الدربكة آلة موسيقية تصدر صوتا."],
            ["قبل العزف معا يجب أن ___ .", ["نصغي جيدا", "نصرخ", "نغلق الآذان", "نركض"], 0, "الاستماع الجيد ينسق العزف الجماعي."]
          ]
        },
        {
          t: "المسرح والتمثيل",
          intro: "المسرح يجمع الصوت والحركة والخيال. نتعلم كيف نؤدي دورا أمام زملائنا.",
          sections: [
            ["الدور والأداء", "في المسرح يتقمص الممثل دورا. يلبس ملابس مناسبة ويستخدم صوته وحركاته. الأداء الواضح يساعد المشاهد على الفهم."],
            ["العمل الجماعي", "المسرح عمل جماعي يشارك فيه الجميع. كل شخص له دور مهم. الاحترام والاستماع يجعلان العرض ناجحا."]
          ],
          examples: [
            ["تمثيل مشهد قصير", ["اختر دورا.", "احفظ جملة واحدة.", "قلها بصوت واضح."], "مشهد قصير مؤدى بوضوح"],
            ["التعاون في العرض", ["وزع الأدوار.", "تدرب مع الفريق.", "استمع لزملائك."], "عرض جماعي منظم"]
          ],
          questions: [
            ["ماذا يفعل الممثل؟", ["يتقمص دورا", "يرسم فقط", "يكتب كتابا", "يعد الأعداد"], 0, "الممثل يتقمص دورا ويؤديه أمام الجمهور."],
            ["ما الذي يساعد المشاهد على الفهم؟", ["الأداء الواضح", "الصمت الطويل", "إخفاء الوجه", "الهمس"], 0, "الصوت والحركات الواضحة تنقل المعنى."],
            ["المسرح عمل ___ .", ["جماعي", "فردي فقط", "صامت دائما", "مكتوب فقط"], 0, "المسرح يتطلب تعاون عدة أشخاص."],
            ["كيف نحترم زملاءنا في العرض؟", ["نستمع لهم", "نقاطعهم", "نسخر منهم", "نتجاهلهم"], 0, "الاستماع والاحترام أساس العمل الجماعي."]
          ]
        }
      ]
    },
    "cur_l_p4_sub_sci": {
      shared: {
        sections: [
          ["العالم من حولنا", "نلاحظ الأشياء من حولنا: الماء والهواء والنباتات. لكل شيء خصائص تميزه. الملاحظة هي أول خطوة في العمل العلمي."],
          ["حالات المادة", "المادة تأتي في ثلاث حالات: صلبة وسائلة وغازية. الحجر صلب والماء سائل والهواء غاز. لكل حالة شكل وسلوك خاص."],
          ["الطاقة والتغير", "الطاقة تجعل الأشياء تتحرك أو تتغير. الشمس تعطينا الضوء والحرارة. بدون طاقة لا يحدث تغيير."],
          ["التجربة والأمان", "التجربة اختبار نقوم به لاكتشاف شيء جديد. نستخدم أدوات بسيطة وندون ملاحظاتنا. نتبع قواعد الأمان في كل تجربة."]
        ],
        vocab: [
          ["مادة", "كل ما يشغل حيزا ويمكن ملاحظته."],
          ["حالة", "الشكل الذي تكون عليه المادة: صلبة أو سائلة أو غازية."],
          ["طاقة", "ما يجعل الأشياء تتحرك أو تتغير."],
          ["ملاحظة", "ما نراه أو نسمعه أو نلمسه أثناء التجربة."],
          ["تجربة", "اختبار منظم لمعرفة شيء ما."],
          ["بيئة", "كل ما يحيط بنا من هواء وماء وكائنات."]
        ],
        outcomes: [
          "يميز بين المواد الصلبة والسائلة والغازية.",
          "يشرح دور الطاقة في حركة الأشياء.",
          "ينفذ تجربة بسيطة ويدون ملاحظاته.",
          "يقترح أفعالا للحفاظ على البيئة."
        ],
        outcomeTr: {
          fr: [
            "Distinguer les matières solides, liquides et gazeuses.",
            "Expliquer le rôle de l'énergie dans le mouvement des objets.",
            "Réaliser une expérience simple et noter ses observations.",
            "Proposer des gestes pour protéger l'environnement."
          ],
          en: [
            "Distinguish solid, liquid and gaseous materials.",
            "Explain the role of energy in the movement of objects.",
            "Carry out a simple experiment and record observations.",
            "Suggest actions to protect the environment."
          ]
        },
        diagram: "diagram-states-of-matter.svg"
      },
      lessons: [
        {
          t: "المواد من حولنا",
          intro: "كل شيء حولنا مادة. نتعرف على خصائص المواد التي نراها ونلمسها.",
          sections: [
            ["التعرف على المادة", "الملح والسكر والماء مواد نراها في البيت. لكل مادة لون وطعم وملمس. نميز المادة بخصائصها لا بحجمها فقط."],
            ["كيف تتصرف المادة؟", "الحجر يحتفظ بشكله لأنه صلب. الماء يأخذ شكل الإناء لأنه سائل. الهواء لا نراه لكنه يملأ الفراغات."]
          ],
          examples: [
            ["وصف الماء", ["انظر إلى الماء في الكوب.", "لمس الإناء.", "قل: الماء سائل ويأخذ شكل الكوب."], "الماء سائل"],
            ["وصف الحجر", ["امسك الحجر.", "حاول تغيير شكله.", "قل: الحجر صلب."], "الحجر صلب"]
          ],
          questions: [
            ["أي مما يلي مادة سائلة؟", ["الحجر", "الماء", "الخشب", "الحديد"], 1, "الماء يسيل ويأخذ شكل الإناء، لذلك هو سائل."],
            ["كيف نميز المادة؟", ["بخصائصها", "باسمها فقط", "بحجمها فقط", "بلونها فقط"], 0, "الخصائص مثل اللون والملمس والحالة تميز المادة."],
            ["لماذا لا نرى الهواء؟", ["لأنه غاز شفاف", "لأنه بعيد", "لأنه صغير جدا", "لأنه لا يوجد"], 0, "الهواء غاز شفاف لا لون له، لذلك لا نراه."],
            ["المادة التي تحتفظ بشكلها هي ___ .", ["سائلة", "غازية", "صلبة", "ماء"], 2, "المادة الصلبة تحتفظ بشكلها ولا تسيل."]
          ],
          tr: {
            fr: {
              t: "Les matières autour de nous",
              intro: "Tout ce qui nous entoure est une matière. On découvre les propriétés des matières que l'on voit et touche.",
              sections: [
                ["Le monde autour de nous", "On observe les objets autour de nous : l'eau, l'air et les plantes. Chaque chose a des propriétés qui la distinguent. L'observation est la première étape du travail scientifique."],
                ["Reconnaître une matière", "Le sel, le sucre et l'eau sont des matières de la maison. Chaque matière a une couleur, un goût et un toucher. On la distingue par ses propriétés et non seulement par sa taille."],
                ["Les états de la matière", "La matière existe sous trois états : solide, liquide et gazeux. La pierre est solide, l'eau est liquide et l'air est gazeux. Chaque état a sa forme et son comportement."],
                ["Les états en pratique", "La pierre garde sa forme car elle est solide. L'eau prend la forme du récipient car elle est liquide. L'air est invisible mais il remplit les espaces."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les objets. Le soleil nous donne la lumière et la chaleur. Sans énergie, aucun changement ne se produit."],
                ["L'expérience et la sécurité", "Une expérience est un test que l'on réalise pour découvrir quelque chose. On utilise des outils simples et on note ses observations. On respecte toujours les règles de sécurité."]
              ],
              vocab: [
                ["matière", "Tout ce qui occupe une place et que l'on peut observer."],
                ["état", "La forme que prend la matière : solide, liquide ou gazeux."],
                ["énergie", "Ce qui fait bouger ou changer les objets."],
                ["observation", "Ce que l'on voit, entend ou touche pendant l'expérience."],
                ["expérience", "Test organisé pour connaître quelque chose."],
                ["environnement", "Tout ce qui nous entoure : air, eau et êtres vivants."]
              ],
              examples: [
                ["Décrire l'eau", ["Regarder l'eau dans le verre.", "Toucher le récipient.", "Dire : l'eau est liquide et prend la forme du verre."], "l'eau est liquide"],
                ["Décrire une pierre", ["Tenir la pierre.", "Essayer de changer sa forme.", "Dire : la pierre est solide."], "la pierre est solide"]
              ]
            },
            en: {
              t: "Matter around us",
              intro: "Everything around us is matter. We discover the properties of matter that we see and touch.",
              sections: [
                ["The world around us", "We observe things around us: water, air and plants. Each thing has properties that distinguish it. Observation is the first step in science."],
                ["Recognising matter", "Salt, sugar and water are materials we find at home. Each material has a colour, a taste and a texture. We tell them apart by their properties, not just by size."],
                ["States of matter", "Matter has three states: solid, liquid and gas. A stone is solid, water is liquid and air is gas. Each state has its own shape and behaviour."],
                ["States in practice", "A stone keeps its shape because it is solid. Water takes the shape of its container because it is liquid. Air is invisible but fills empty spaces."],
                ["Energy and change", "Energy makes things move or change. The sun gives us light and heat. Without energy, no change happens."],
                ["Experiments and safety", "An experiment is a test we do to discover something. We use simple tools and record our observations. We always follow safety rules."]
              ],
              vocab: [
                ["matter", "Anything that takes up space and can be observed."],
                ["state", "The form matter takes: solid, liquid or gas."],
                ["energy", "What makes things move or change."],
                ["observation", "What we see, hear or touch during an experiment."],
                ["experiment", "An organized test to find something out."],
                ["environment", "Everything around us: air, water and living things."]
              ],
              examples: [
                ["Describe water", ["Look at the water in the glass.", "Touch the container.", "Say: water is liquid and takes the shape of the glass."], "water is liquid"],
                ["Describe a stone", ["Hold the stone.", "Try to change its shape.", "Say: the stone is solid."], "the stone is solid"]
              ]
            }
          }
        },
        {
          t: "الطاقة في حياتنا",
          intro: "الطاقة تجعل الأشياء تتحرك وتتغير. الشمس والكهرباء من مصادر الطاقة.",
          sections: [
            ["الطاقة من الشمس", "الشمس تمدنا بالضوء والحرارة. الضوء يساعد النبات على النمو. الحرارة تجفف الملابس."],
            ["الطاقة والحركة", "الكهرباء تشغل المصباح والمراوح. عندما تنقطع الكهرباء تتوقف الآلة. الطاقة ضرورية للحركة."]
          ],
          examples: [
            ["نمو النبات", ["ضع النبات قرب النافذة.", "اتركه في الضوء.", "لاحظ نموه بعد أيام."], "الضوء ساعد النبات على النمو"],
            ["تشغيل المصباح", ["اضغط على المفتاح.", "انتظر الضوء.", "قل: الكهرباء أعطت الضوء."], "المصباح أضاء بالكهرباء"]
          ],
          questions: [
            ["ما الذي نأخذه من الشمس؟", ["الضوء والحرارة", "الماء", "الحجر", "الصوت"], 0, "الشمس تعطينا الضوء والحرارة."],
            ["ماذا يحدث عند انقطاع الكهرباء؟", ["تتوقف الآلة", "تزداد الحركة", "يضيء المصباح", "ينمو النبات أسرع"], 0, "بدون طاقة كهربائية تتوقف الأجهزة عن العمل."],
            ["كيف يساعد الضوء النبات؟", ["يساعده على النمو", "يمنعه من النمو", "يغير لونه فقط", "يوقف الماء"], 0, "الضوء ضروري لصنع الغذاء في النبات."],
            ["الطاقة تجعل الأشياء ___ .", ["تتحرك", "تختفي", "تصبح صخرة", "تنام"], 0, "الطاقة هي ما يسبب الحركة والتغير."]
          ],
          tr: {
            fr: {
              t: "L'énergie dans notre vie",
              intro: "L'énergie fait bouger et changer les objets. Le soleil et l'électricité sont des sources d'énergie.",
              sections: [
                ["Le monde autour de nous", "On observe les objets autour de nous : l'eau, l'air et les plantes. Chaque chose a des propriétés qui la distinguent. L'observation est la première étape du travail scientifique."],
                ["L'énergie du soleil", "Le soleil nous donne la lumière et la chaleur. La lumière aide les plantes à pousser. La chaleur fait sécher les vêtements."],
                ["Les états de la matière", "La matière existe sous trois états : solide, liquide et gazeux. La pierre est solide, l'eau est liquide et l'air est gazeux. Chaque état a sa forme et son comportement."],
                ["L'énergie et le mouvement", "L'électricité fait fonctionner la lampe et le ventilateur. Quand le courant s'arrête, la machine s'arrête. L'énergie est nécessaire au mouvement."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les objets. Le soleil nous donne la lumière et la chaleur. Sans énergie, aucun changement ne se produit."],
                ["L'expérience et la sécurité", "Une expérience est un test que l'on réalise pour découvrir quelque chose. On utilise des outils simples et on note ses observations. On respecte toujours les règles de sécurité."]
              ],
              vocab: [
                ["matière", "Tout ce qui occupe une place et que l'on peut observer."],
                ["état", "La forme que prend la matière : solide, liquide ou gazeux."],
                ["énergie", "Ce qui fait bouger ou changer les objets."],
                ["observation", "Ce que l'on voit, entend ou touche pendant l'expérience."],
                ["expérience", "Test organisé pour connaître quelque chose."],
                ["environnement", "Tout ce qui nous entoure : air, eau et êtres vivants."]
              ],
              examples: [
                ["Faire pousser une plante", ["Placer la plante près de la fenêtre.", "La laisser à la lumière.", "Observer sa croissance après quelques jours."], "la lumière a aidé la plante à pousser"],
                ["Allumer la lampe", ["Appuyer sur l'interrupteur.", "Attendre la lumière.", "Dire : l'électricité a donné la lumière."], "la lampe s'est allumée grâce à l'électricité"]
              ]
            },
            en: {
              t: "Energy in our life",
              intro: "Energy makes things move and change. The sun and electricity are sources of energy.",
              sections: [
                ["The world around us", "We observe things around us: water, air and plants. Each thing has properties that distinguish it. Observation is the first step in science."],
                ["Energy from the sun", "The sun gives us light and heat. Light helps plants grow. Heat dries clothes."],
                ["States of matter", "Matter has three states: solid, liquid and gas. A stone is solid, water is liquid and air is gas. Each state has its own shape and behaviour."],
                ["Energy and movement", "Electricity runs the lamp and the fan. When the power stops, the machine stops. Energy is needed for movement."],
                ["Energy and change", "Energy makes things move or change. The sun gives us light and heat. Without energy, no change happens."],
                ["Experiments and safety", "An experiment is a test we do to discover something. We use simple tools and record our observations. We always follow safety rules."]
              ],
              vocab: [
                ["matter", "Anything that takes up space and can be observed."],
                ["state", "The form matter takes: solid, liquid or gas."],
                ["energy", "What makes things move or change."],
                ["observation", "What we see, hear or touch during an experiment."],
                ["experiment", "An organized test to find something out."],
                ["environment", "Everything around us: air, water and living things."]
              ],
              examples: [
                ["Growing a plant", ["Place the plant near the window.", "Leave it in the light.", "Observe its growth after a few days."], "light helped the plant grow"],
                ["Switching on the lamp", ["Press the switch.", "Wait for the light.", "Say: electricity gave the light."], "the lamp lit up thanks to electricity"]
              ]
            }
          }
        },
        {
          t: "نقوم بتجربة بسيطة",
          intro: "التجربة طريقة لمعرفة شيء بالملاحظة. نتعلم كيف نخطط ونلاحظ وندون.",
          sections: [
            ["خطوات التجربة", "نبدأ بسؤال: هل يطفو الحجر أم يغرق؟ نضع الحجر في الماء ونلاحظ. ثم نكتب النتيجة."],
            ["تدوين الملاحظات", "نكتب ما رأيناه بصدق دون تخمين. نستخدم جدولا بسيطا للنتائج. الملاحظة الدقيقة أساس العلم."]
          ],
          examples: [
            ["تجربة الطفو", ["املأ كوبا بالماء.", "ضع الحجر داخله.", "لاحظ: الحجر غرق."], "الحجر غرق في الماء"],
            ["تجربة الورقة", ["ضع ورقة على الماء.", "انتظر قليلا.", "لاحظ: الورقة طفت."], "الورقة طفت على الماء"]
          ],
          questions: [
            ["ما أول خطوة في التجربة؟", ["طرح سؤال", "كتابة النتيجة", "غسل الكوب", "إطفاء الضوء"], 0, "التجربة تبدأ بسؤال نريد الإجابة عليه."],
            ["كيف ندون الملاحظات؟", ["بصدق كما نرى", "بما نتخيله", "بسرعة دون نظر", "بصوت عال"], 0, "الملاحظة الصادقة هي أساس التجربة."],
            ["ماذا نستخدم لتسجيل النتائج؟", ["جدولا بسيطا", "الهواء", "الظل", "الصمت"], 0, "الجدول يساعد على تنظيم النتائج."],
            ["إذا غرق الحجر فهذا يعني ___ .", ["أنه لا يطفو", "أنه خفيف", "أنه سائل", "أنه طار"], 0, "الغرق يعني أن الحجر نزل إلى قاع الماء ولم يطف."]
          ],
          tr: {
            fr: {
              t: "Réaliser une expérience simple",
              intro: "L'expérience est une façon de découvrir par l'observation. On apprend à préparer, observer et noter.",
              sections: [
                ["Le monde autour de nous", "On observe les objets autour de nous : l'eau, l'air et les plantes. Chaque chose a des propriétés qui la distinguent. L'observation est la première étape du travail scientifique."],
                ["Les étapes de l'expérience", "On commence par une question : la pierre flotte-t-elle ou coule-t-elle ? On met la pierre dans l'eau et on observe. Puis on écrit le résultat."],
                ["Les états de la matière", "La matière existe sous trois états : solide, liquide et gazeux. La pierre est solide, l'eau est liquide et l'air est gazeux. Chaque état a sa forme et son comportement."],
                ["Noter ses observations", "On écrit ce que l'on a vu sincèrement, sans deviner. On utilise un tableau simple pour les résultats. L'observation précise est le fondement de la science."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les objets. Le soleil nous donne la lumière et la chaleur. Sans énergie, aucun changement ne se produit."],
                ["L'expérience et la sécurité", "Une expérience est un test que l'on réalise pour découvrir quelque chose. On utilise des outils simples et on note ses observations. On respecte toujours les règles de sécurité."]
              ],
              vocab: [
                ["matière", "Tout ce qui occupe une place et que l'on peut observer."],
                ["état", "La forme que prend la matière : solide, liquide ou gazeux."],
                ["énergie", "Ce qui fait bouger ou changer les objets."],
                ["observation", "Ce que l'on voit, entend ou touche pendant l'expérience."],
                ["expérience", "Test organisé pour connaître quelque chose."],
                ["environnement", "Tout ce qui nous entoure : air, eau et êtres vivants."]
              ],
              examples: [
                ["Expérience de la flottaison", ["Remplir un verre d'eau.", "Y placer la pierre.", "Observer : la pierre a coulé."], "la pierre a coulé dans l'eau"],
                ["Expérience de la feuille", ["Poser une feuille sur l'eau.", "Attendre un peu.", "Observer : la feuille flotte."], "la feuille flotte sur l'eau"]
              ]
            },
            en: {
              t: "Carrying out a simple experiment",
              intro: "An experiment is a way to discover through observation. We learn to plan, observe and record.",
              sections: [
                ["The world around us", "We observe things around us: water, air and plants. Each thing has properties that distinguish it. Observation is the first step in science."],
                ["Steps of the experiment", "We start with a question: does the stone float or sink? We put the stone in water and observe. Then we write the result."],
                ["States of matter", "Matter has three states: solid, liquid and gas. A stone is solid, water is liquid and air is gas. Each state has its own shape and behaviour."],
                ["Recording observations", "We write what we saw honestly, without guessing. We use a simple table for results. Careful observation is the basis of science."],
                ["Energy and change", "Energy makes things move or change. The sun gives us light and heat. Without energy, no change happens."],
                ["Experiments and safety", "An experiment is a test we do to discover something. We use simple tools and record our observations. We always follow safety rules."]
              ],
              vocab: [
                ["matter", "Anything that takes up space and can be observed."],
                ["state", "The form matter takes: solid, liquid or gas."],
                ["energy", "What makes things move or change."],
                ["observation", "What we see, hear or touch during an experiment."],
                ["experiment", "An organized test to find something out."],
                ["environment", "Everything around us: air, water and living things."]
              ],
              examples: [
                ["Floating experiment", ["Fill a glass with water.", "Place the stone in it.", "Observe: the stone sank."], "the stone sank in the water"],
                ["Leaf experiment", ["Put a leaf on the water.", "Wait a little.", "Observe: the leaf floats."], "the leaf floats on the water"]
              ]
            }
          }
        },
        {
          t: "نحافظ على بيئتنا",
          intro: "البيئة هي كل ما يحيط بنا. علينا أن نحافظ على نظافتها ومواردها.",
          sections: [
            ["نظافة المحيط", "نرمي النفايات في السلة لا في الشارع. الماء النظيف مهم للشرب وللنباتات. الهواء النقي يساعدنا على التنفس."],
            ["ترشيد الماء والطاقة", "نغلق الصنبور بعد الاستعمال ونطفئ الضوء عند الخروج. الترشيد يحفظ الموارد للأجيال القادمة. كل فعل صغير يهم."]
          ],
          examples: [
            ["تنظيف الفصل", ["اجمع الأوراق من الأرض.", "ضعها في السلة.", "امسح الطاولة."], "الفصل نظيف ومرتب"],
            ["ترشيد الماء", ["افتح الصنبور للغسل.", "أغلقه بعد الانتهاء.", "قل: حفظت الماء."], "الماء لم يهدر"]
          ],
          questions: [
            ["أين نرمي النفايات؟", ["في الشارع", "في السلة", "في النهر", "تحت الشجرة"], 1, "السلة مخصصة للنفايات وتحافظ على نظافة المكان."],
            ["في درس الحفاظ على البيئة، لماذا نغلق الصنبور بعد الغسل؟", ["لحفظ الماء", "لزيادة الماء", "لإصدار صوت", "لتبريد الغرفة"], 0, "إغلاق الصنبور يمنع هدر الماء."],
            ["ما فائدة الهواء النقي؟", ["يساعد على التنفس", "يملأ الكوب", "يغسل الأطباق", "يضيء الغرفة"], 0, "الهواء النقي ضروري لصحتنا وتنفسنا."],
            ["الحفاظ على البيئة مسؤولية ___ .", ["الجميع", "المدرس فقط", "الطبيب فقط", "لا أحد"], 0, "كل شخص مسؤول عن حماية البيئة بأفعاله."]
          ],
          tr: {
            fr: {
              t: "Protégeons notre environnement",
              intro: "L'environnement est tout ce qui nous entoure. Nous devons préserver sa propreté et ses ressources.",
              sections: [
                ["Le monde autour de nous", "On observe les objets autour de nous : l'eau, l'air et les plantes. Chaque chose a des propriétés qui la distinguent. L'observation est la première étape du travail scientifique."],
                ["La propreté autour de nous", "On jette les déchets dans la poubelle et non dans la rue. L'eau propre est importante pour boire et pour les plantes. L'air pur nous aide à respirer."],
                ["Les états de la matière", "La matière existe sous trois états : solide, liquide et gazeux. La pierre est solide, l'eau est liquide et l'air est gazeux. Chaque état a sa forme et son comportement."],
                ["Économiser l'eau et l'énergie", "On ferme le robinet après usage et on éteint la lumière en sortant. Économiser préserve les ressources pour les générations futures. Chaque petit geste compte."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les objets. Le soleil nous donne la lumière et la chaleur. Sans énergie, aucun changement ne se produit."],
                ["L'expérience et la sécurité", "Une expérience est un test que l'on réalise pour découvrir quelque chose. On utilise des outils simples et on note ses observations. On respecte toujours les règles de sécurité."]
              ],
              vocab: [
                ["matière", "Tout ce qui occupe une place et que l'on peut observer."],
                ["état", "La forme que prend la matière : solide, liquide ou gazeux."],
                ["énergie", "Ce qui fait bouger ou changer les objets."],
                ["observation", "Ce que l'on voit, entend ou touche pendant l'expérience."],
                ["expérience", "Test organisé pour connaître quelque chose."],
                ["environnement", "Tout ce qui nous entoure : air, eau et êtres vivants."]
              ],
              examples: [
                ["Nettoyer la classe", ["Ramasser les papiers par terre.", "Les mettre dans la poubelle.", "Essuyer la table."], "la classe est propre et rangée"],
                ["Économiser l'eau", ["Ouvrir le robinet pour se laver.", "Le fermer après.", "Dire : j'ai économisé l'eau."], "l'eau n'a pas été gaspillée"]
              ]
            },
            en: {
              t: "Protecting our environment",
              intro: "The environment is everything around us. We must keep it clean and protect its resources.",
              sections: [
                ["The world around us", "We observe things around us: water, air and plants. Each thing has properties that distinguish it. Observation is the first step in science."],
                ["Keeping things clean", "We throw rubbish in the bin, not in the street. Clean water matters for drinking and for plants. Clean air helps us breathe."],
                ["States of matter", "Matter has three states: solid, liquid and gas. A stone is solid, water is liquid and air is gas. Each state has its own shape and behaviour."],
                ["Saving water and energy", "We close the tap after use and turn off the light when leaving. Saving preserves resources for future generations. Every small action matters."],
                ["Energy and change", "Energy makes things move or change. The sun gives us light and heat. Without energy, no change happens."],
                ["Experiments and safety", "An experiment is a test we do to discover something. We use simple tools and record our observations. We always follow safety rules."]
              ],
              vocab: [
                ["matter", "Anything that takes up space and can be observed."],
                ["state", "The form matter takes: solid, liquid or gas."],
                ["energy", "What makes things move or change."],
                ["observation", "What we see, hear or touch during an experiment."],
                ["experiment", "An organized test to find something out."],
                ["environment", "Everything around us: air, water and living things."]
              ],
              examples: [
                ["Cleaning the classroom", ["Pick up the papers on the floor.", "Put them in the bin.", "Wipe the table."], "the classroom is clean and tidy"],
                ["Saving water", ["Open the tap to wash.", "Close it afterwards.", "Say: I saved water."], "the water was not wasted"]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p5_sub_amz": {
      shared: {
        sections: [
          ["Le texte littéraire amazigh", "La littérature amazighe raconte la vie, la nature et les valeurs. Les textes utilisent des images et des comparaisons. On les lit pour comprendre le message."],
          ["Analyser un texte", "Pour analyser, on cherche le thème, les personnages et le sens des mots. On observe comment l'auteur exprime ses idées. L'analyse rend la lecture plus riche."],
          ["Produire un texte", "Écrire, c'est organiser ses idées en phrases claires. On choisit les mots qui expriment ce que l'on veut dire. Relire améliore le résultat."],
          ["La culture amazighe", "La culture amazighe est vivante et variée. Elle se transmet par la langue, les contes et les fêtes. La connaître renforce l'identité."]
        ],
        vocab: [
          ["texte", "Ensemble de phrases qui racontent ou expliquent."],
          ["thème", "L'idée principale d'un texte."],
          ["personnage", "La personne ou l'être dont parle le texte."],
          ["comparaison", "Rapprocher deux choses pour les décrire."],
          ["production", "Texte que l'on écrit soi-même."],
          ["identité", "Ce qui caractérise un peuple et ses valeurs."]
        ],
        outcomes: [
          "Lire et comprendre un texte littéraire amazigh.",
          "Analyser le thème et les personnages.",
          "Rédiger un court texte personnel.",
          "Expliquer un élément de la culture amazighe."
        ],
        diagram: "diagram-family.svg"
      },
      lessons: [
        {
          t: "Lire un récit amazigh",
          intro: "Un récit nous transporte dans un autre lieu. Découvrons comment le lire avec attention.",
          sections: [
            ["Le cadre du récit", "Un récit présente un lieu et des personnages. Il peut se passer dans un village ou dans la montagne. Le cadre aide à imaginer la scène."],
            ["Les images dans le texte", "L'auteur compare souvent la nature à quelque chose de familier. Il peut dire que la montagne est comme un ami. Ces images rendent le texte vivant."]
          ],
          examples: [
            ["Trouver le cadre", ["Lire le début du texte.", "Repérer le lieu.", "Dire : l'action se passe au village."], "Au village."],
            ["Repérer une comparaison", ["Chercher le mot comme.", "Lire la phrase entière.", "Expliquer la comparaison."], "La montagne est comparée à un ami."]
          ],
          questions: [
            ["Que présente le cadre d'un récit ?", ["Le lieu et les personnages", "La fin seulement", "Le titre seul", "Les chiffres"], 0, "Le cadre situe l'action dans un lieu et présente les personnages."],
            ["À quoi sert une comparaison ?", ["À décrire de façon vivante", "À cacher le sens", "À raccourcir le texte", "À changer le titre"], 0, "La comparaison donne une image qui rend la description plus vivante."],
            ["Quel mot signale souvent une comparaison ?", ["comme", "mais", "donc", "et"], 0, "Le mot comme introduit fréquemment une comparaison."],
            ["Où peut se passer un récit amazigh ?", ["Dans un village", "Dans une couleur", "Dans un nombre", "Dans une ombre"], 0, "Le village est un cadre courant des récits amazighs."]
          ]
        },
        {
          t: "Analyser le thème et les personnages",
          intro: "L'analyse cherche le sens profond du texte. Apprenons à identifier le thème et les personnages.",
          sections: [
            ["Trouver le thème", "Le thème est l'idée principale du texte. On le découvre en se demandant de quoi parle le texte. Toutes les phrases ne sont pas aussi importantes."],
            ["Comprendre les personnages", "On observe ce que font et disent les personnages. Leurs actions révèlent leur caractère. On peut expliquer leurs choix avec des preuves du texte."]
          ],
          examples: [
            ["Dégager le thème", ["Lire tout le texte.", "Repérer l'idée qui revient.", "Dire : le thème est l'amitié."], "Le thème est l'amitié."],
            ["Expliquer un personnage", ["Chercher ses actions.", "Chercher ses paroles.", "Dire : il est généreux car il aide."], "Il est généreux."]
          ],
          questions: [
            ["Qu'est-ce que le thème ?", ["L'idée principale", "Le titre", "Le dernier mot", "La page"], 0, "Le thème est l'idée centrale que le texte veut transmettre."],
            ["Comment connaître le caractère d'un personnage ?", ["Par ses actions et ses paroles", "Par sa couleur", "Par le nombre de pages", "Par le titre"], 0, "Les actions et les paroles révèlent le caractère."],
            ["Que faut-il pour appuyer une analyse ?", ["Des preuves du texte", "Des devinettes", "Des dessins seuls", "Du hasard"], 0, "Une analyse solide s'appuie sur des éléments du texte."],
            ["Toutes les phrases ont-elles la même importance ?", ["Non, certaines sont secondaires", "Oui, toujours", "Oui, sauf la première", "Non, seulement la dernière"], 0, "Certaines phrases développent l'idée principale, d'autres sont des détails."]
          ]
        },
        {
          t: "Écrire mon propre texte",
          intro: "Écrire, c'est mettre ses idées en ordre et les exprimer avec des mots justes.",
          sections: [
            ["Organiser ses idées", "Avant d'écrire, on note les idées principales dans l'ordre. On commence par une introduction simple. Ensuite on ajoute des détails."],
            ["Choisir ses mots", "On choisit des mots précis et des images pour exprimer son idée. On évite de répéter le même mot. Relire permet de corriger et d'améliorer."]
          ],
          examples: [
            ["Écrire un début de texte", ["Noter le lieu.", "Présenter le personnage.", "Écrire deux phrases."], "Dans le village, vivait un enfant curieux."],
            ["Améliorer une phrase", ["Repérer un mot répété.", "Le remplacer par un synonyme.", "Relire la phrase."], "La phrase est plus claire."]
          ],
          questions: [
            ["Avant de commencer son texte, que note-t-on en premier ?", ["Noter ses idées", "Dormir", "Effacer la page", "Chanter"], 0, "Noter ses idées aide à organiser le texte."],
            ["Comment éviter la répétition ?", ["En utilisant des synonymes", "En écrivant plus vite", "En sautant des lignes", "En criant"], 0, "Les synonymes rendent le texte plus varié."],
            ["Que contient une introduction simple ?", ["Le lieu et le personnage", "La conclusion", "Les chiffres", "La signature"], 0, "L'introduction présente le cadre et les personnages."],
            ["Dans cet exercice d'écriture, pourquoi relire son texte avant de le rendre ?", ["Pour le corriger", "Pour le cacher", "Pour l'oublier", "Pour le raccourcir"], 0, "La relecture révèle les fautes et les idées peu claires."]
          ]
        },
        {
          t: "Découvrir la culture amazighe",
          intro: "La culture amazighe se vit chaque jour. Découvrons ses contes et ses fêtes.",
          sections: [
            ["La langue et les contes", "La langue amazighe se transmet par la famille et les contes. Les contes racontent des valeurs comme le courage et la générosité. Ils divertissent et enseignent."],
            ["Les fêtes et l'identité", "Les fêtes amazighes rassemblent les familles. On y chante, on danse et on partage des repas. Ces moments renforcent l'identité et l'appartenance."]
          ],
          examples: [
            ["Expliquer un conte", ["Nommer le conte.", "Dire la valeur qu'il transmet.", "Donner un exemple."], "Le conte enseigne le courage."],
            ["Présenter une fête", ["Nommer la fête.", "Dire ce qu'on y fait.", "Expliquer son importance."], "C'est une fête de partage et de joie."]
          ],
          questions: [
            ["Comment se transmet la langue amazighe ?", ["Par la famille et les contes", "Par le silence", "Par les machines", "Par l'oubli"], 0, "La famille et les contes transmettent la langue de génération en génération."],
            ["Que transmettent les contes ?", ["Des valeurs", "Des chiffres", "Des couleurs", "Des horaires"], 0, "Les contes transmettent des valeurs comme le courage."],
            ["Que fait-on pendant les fêtes ?", ["On partage des repas", "On dort toujours", "On se cache", "On court sans but"], 0, "Les fêtes sont des moments de partage et de convivialité."],
            ["Les fêtes renforcent ___ .", ["l'identité", "l'oubli", "la fatigue", "le silence"], 0, "Les moments partagés renforcent l'identité et l'appartenance."]
          ]
        }
      ]
    },
    "cur_l_p6_sub_ar": {
      shared: {
        sections: [
          ["الأدب العربي", "الأدب العربي غني بالشعر والنثر. يعبر الأدب عن المشاعر والأفكار والقيم. نقرأه لنتذوق الجمال ونتعلم."],
          ["تحليل النص", "نقرأ النص أكثر من مرة لفهم معناه. نحدد الفكرة الرئيسة والصور الفنية. ثم نبدي رأينا مع الدليل من النص."],
          ["التعبير الإنشائي", "نكتب ما نشعر به وما نفكر فيه بأسلوب واضح. نختار الكلمات المناسبة ونرتب أفكارنا. الكتابة الجيدة تحتاج إلى تدريب."],
          ["القواعد والصرف", "القواعد تساعدنا على الكتابة الصحيحة. الصرف يشرح كيف تتغير الكلمات. إتقانهما يجعل تعبيرنا أدق."]
        ],
        vocab: [
          ["نص", "مجموعة من الجمل تحمل معنى."],
          ["قصيدة", "نظم شعري له وزن وقافية."],
          ["فكرة رئيسة", "المعنى الأساسي الذي يدور حوله النص."],
          ["صورة فنية", "تشبيه أو استعارة تجعل المعنى أجمل."],
          ["إنشاء", "كتابة تعبير عن فكرة أو شعور."],
          ["صرف", "علم يدرس تغيرات الكلمة وأوزانها."]
        ],
        outcomes: [
          "يتذوق الطالب نصا أدبيا ويحدد فكرته.",
          "يحلل الصور الفنية ويدعم رأيه بالدليل.",
          "يكتب تعبيرا إنشائيا منظما.",
          "يطبق قواعد صرفية بسيطة."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "نص شعري قصير",
          intro: "نقرأ بيتا من الشعر ونتذوق إيقاعه ومعناه.",
          sections: [
            ["القصيدة ووزنها", "القصيدة كلام موزون له إيقاع جميل. تتكون من أبيات متشابهة في الوزن والقافية. نقرأها بصوت هادئ لنتذوق موسيقاها."],
            ["المعنى والصورة", "الشاعر يستخدم صورا مثل تشبيه الوجه بالقمر. الصورة تجعل المعنى حيا في الذهن. نبحث عن المعنى وراء الألفاظ."]
          ],
          examples: [
            ["قراءة بيت شعري", ["اقرأ البيت ببطء.", "لاحظ القافية.", "قل: البيت له إيقاع جميل."], "بيت موزون ومؤثر"],
            ["فهم صورة شعرية", ["اقرأ التشبيه.", "حدد المشبه والمشبه به.", "اشرح المعنى."], "الوجه شُبّه بالقمر للجمال"]
          ],
          questions: [
            ["ما القصيدة؟", ["كلام موزون ذو قافية", "نثر بلا وزن", "قائمة كلمات", "رسالة قصيرة"], 0, "القصيدة نظم له وزن وقافية."],
            ["ما فائدة الصورة الفنية؟", ["تجعل المعنى أجمل", "تطيل النص", "تخفي المعنى", "تغير العنوان"], 0, "الصورة الفنية تجعل المعنى حيا وجميلا."],
            ["كيف نقرأ الشعر؟", ["بهدوء وإنصات", "بسرعة كبيرة", "بصمت تام", "بصوت عال جدا"], 0, "القراءة الهادئة تساعد على تذوق الإيقاع."],
            ["التشبيه نوع من ___ .", ["الصورة الفنية", "القاعدة", "العنوان", "الرقم"], 0, "التشبيه صورة فنية تقرب المعنى."]
          ]
        },
        {
          t: "تحليل النص وتقييمه",
          intro: "التحليل يبحث في أعماق النص. نتعلم استخراج الفكرة وتأييد الرأي بالدليل.",
          sections: [
            ["الفكرة الرئيسة", "نقرأ النص كاملا ثم نسأل: ما الفكرة التي يريد الكاتب إيصالها؟ نستدل بجمل من النص. الفكرة الرئيسة تجمع كل التفاصيل."],
            ["إبداء الرأي بالدليل", "لا يكفي أن نقول إن النص جميل. بل نذكر الجملة التي تدعم رأينا. الرأي المبني على الدليل أقوى وأقنع."]
          ],
          examples: [
            ["استخراج الفكرة", ["اقرأ النص مرتين.", "لاحظ تكرار المعنى.", "قل: الفكرة هي حب الوطن."], "الفكرة: حب الوطن"],
            ["تأييد رأي", ["اختر رأيك.", "ابحث عن جملة دالة.", "اربط الرأي بالجملة."], "الجملة تدعم رأيي"]
          ],
          questions: [
            ["كيف نجد الفكرة الرئيسة؟", ["بقراءة النص وملاحظة المعنى المتكرر", "بعدّ الكلمات", "بقراءة العنوان فقط", "بالنوم"], 0, "الفكرة الرئيسة تظهر من معنى النص كاملا لا من جزء منه."],
            ["لماذا نحتاج إلى الدليل؟", ["لندعم رأينا", "لنطيل النص", "لنغير الكاتب", "لنحذف الفكرة"], 0, "الدليل من النص يجعل رأينا مقنعا وموثوقا."],
            ["التفاصيل في النص ___ .", ["تخدم الفكرة الرئيسة", "تلغي الفكرة", "لا علاقة لها", "هي العنوان"], 0, "التفاصيل تبني الفكرة الرئيسة وتوضحها."],
            ["الرأي المبني على الدليل يكون ___ .", ["أقوى", "أضعف", "مجهولا", "ممنوعا"], 0, "الاستدلال يجعل الرأي مقنعا لدى القارئ."]
          ]
        },
        {
          t: "تعبير إنشائي عن ذكرى",
          intro: "لكل منا ذكرى جميلة يستمتع باستعادتها. في هذا الدرس نكتب عن ذكرى نحبها ونعبر عن مشاعرنا بكلمات بسيطة.",
          sections: [
            ["ترتيب الأفكار", "نختار فكرة نكتب عنها مثل رحلة أو عيد. نرتب الأحداث من البداية إلى النهاية. الترتيب يساعد القارئ على المتابعة."],
            ["الأسلوب الواضح", "نستخدم جملا قصيرة ومعنى مباشرا. نضيف وصفا بسيطا يجعل النص حيا. ثم نختم بفكرة نحس بها."]
          ],
          examples: [
            ["كتابة فقرة عن العيد", ["اذكر المناسبة.", "اكتب ما حدث.", "اختم بشعورك."], "العيد يوم فرح واجتماع"],
            ["وصف مكان", ["اختر المكان.", "اذكر ثلاث صفات.", "اربطها بالشعور."], "الحديقة مكان هادئ وجميل"]
          ],
          questions: [
            ["بماذا نبدأ التعبير الإنشائي؟", ["باختيار الفكرة", "بالخاتمة", "بالأرقام", "بالعنوان فقط"], 0, "اختيار الفكرة يحدد مسار الكتابة."],
            ["كيف نرتب الأحداث؟", ["من البداية إلى النهاية", "عشوائيا", "من النهاية", "حسب الحجم"], 0, "الترتيب الزمني يسهل فهم النص."],
            ["ما فائدة الوصف البسيط؟", ["يحيي النص", "يطيله بلا معنى", "يخفي الفكرة", "يمنع القراءة"], 0, "الوصف يعطي القارئ صورة واضحة."],
            ["الخاتمة في التعبير تحتوي على ___ .", ["شعور أو فكرة", "عنوان جديد", "رقم فقط", "سؤال فقط"], 0, "الخاتمة تترك أثرا أو تلخص الشعور."]
          ]
        },
        {
          t: "قواعد وصرف بسيطة",
          intro: "الكلمة العربية لها أصل وصيغ متعددة. نفهمها بقواعد سهلة.",
          sections: [
            ["الكلمة وأصلها", "الكلمة العربية لها أصل ثابت وتأتي منها صيغ مختلفة. من الأصل ك ت ب نكتب: كتاب وكاتب ومكتبة. معرفة الأصل تساعد على الفهم."],
            ["الإعراب المبسط", "المبتدأ يأتي أولا والخبر يخبر عنه. في قولنا الكتاب مفيد، الكتاب مبتدأ ومفيد خبر. هذا الترتيب يعطي جملة صحيحة."]
          ],
          examples: [
            ["اشتقاق كلمة من أصل", ["اختر الأصل ك ت ب.", "أضف صيغة اسم.", "قل: كتاب."], "كتاب"],
            ["تحديد المبتدأ والخبر", ["اقرأ: التفاحة حمراء.", "حدد من نتحدث عنه.", "قل: التفاحة مبتدأ وحمراء خبر."], "التفاحة مبتدأ، حمراء خبر"]
          ],
          questions: [
            ["ما أصل كلمة كاتب؟", ["ك ت ب", "ك ت أ", "ك ا ت", "ك ب ت"], 0, "كاتب من الأصل ك ت ب الذي يدل على الكتابة."],
            ["ما المبتدأ في الجملة التفاحة حمراء؟", ["التفاحة", "حمراء", "الجملة", "النقطة"], 0, "المبتدأ هو ما نبدأ به الحديث: التفاحة."],
            ["ما الخبر في الجملة التفاحة حمراء؟", ["حمراء", "التفاحة", "لا يوجد", "النقطة"], 0, "الخبر هو ما يخبر به عن المبتدأ: حمراء."],
            ["معرفة أصل الكلمة تساعد على ___ .", ["فهم معناها", "تغييرها", "حذفها", "نسيانها"], 0, "الأصل يربط الكلمات المتشابهة في المعنى."]
          ]
        }
      ]
    },
    "cur_l_p6_sub_cul": {
      shared: {
        sections: [
          ["الثقافة المغربية", "الثقافة المغربية متنوعة وغنية. تظهر في اللغة والمأكل والملبس والاحتفالات. فهم الثقافة يساعدنا على معرفة أنفسنا."],
          ["الفنون والجمال", "الفنون تعبر عن ذوق الناس وأفكارهم. نرى ذلك في الزخرفة والخط العربي والموسيقى. الجمال في الفن يعكس هوية المكان."],
          ["الرياضة والصحة", "الرياضة تقوي الجسم وتنظم الوقت. كرة القدم والجري من الرياضات المحبوبة. اللعب الجماعي يعلمنا التعاون."],
          ["المواطنة اليومية", "المواطنة تعني احترام القانون والممتلكات العامة. نحافظ على نظافة الشارع ونعامل الناس بلطف. مشاركتنا الإيجابية تفيد الجميع."]
        ],
        vocab: [
          ["ثقافة", "مجموعة العادات والقيم التي تميز شعبا."],
          ["تراث", "ما ورثناه من أجدادنا من عادات ومهارات."],
          ["زخرفة", "زينة هندسية أو نباتية تستخدم في الفن."],
          ["رياضة", "نشاط بدني يقوي الجسم وينمي المهارات."],
          ["قانون", "قاعدة ملزمة تنظم حياة الناس."],
          ["مواطنة", "انتماء الإنسان إلى وطنه ومسؤوليته نحوه."]
        ],
        outcomes: [
          "يشرح مظاهر من الثقافة المغربية.",
          "يتعرف على فنون زخرفية وخطية.",
          "يمارس نشاطا رياضيا بأمان.",
          "يطبق سلوكا يوميا يعبر عن المواطنة."
        ],
        diagram: "diagram-morocco-map.svg"
      },
      lessons: [
        {
          t: "مظاهر الثقافة المغربية",
          intro: "لكل شعب عاداته وطعامه ولباسه. نتعرف على مظاهر ثقافتنا.",
          sections: [
            ["اللغة والمأكل", "اللغة العربية والأمازيغية لغتان وطنيتان. نأكل الكسكسي والطاجين في المناسبات. الطعام يعكس تاريخ بلدنا وعاداته."],
            ["الملبس والاحتفال", "الجلابة والقفطان لباسان معروفان. نرتديهما في الأعراس والأعياد. الاحتفالات تجمع العائلة والأصدقاء."]
          ],
          examples: [
            ["التعريف بالكسكسي", ["اذكر اسم الطعام.", "قل متى نأكله.", "اربطه بالمناسبة."], "الكسكسي طعام نأكله يوم الجمعة"],
            ["وصف مناسبة", ["اختر العيد.", "اذكر ما يحدث.", "اذكر الشعور."], "العيد فرح واجتماع عائلي"]
          ],
          questions: [
            ["ما اللغتان الوطنيتان في المغرب؟", ["العربية والأمازيغية", "الفرنسية والإسبانية", "الإنجليزية والألمانية", "الإيطالية والبرتغالية"], 0, "العربية والأمازيغية لغتان وطنيتان في المغرب."],
            ["ما الطعام المعروف في المغرب؟", ["الكسكسي", "البيتزا", "البرجر", "السوشي"], 0, "الكسكسي من أشهر الأطعمة المغربية."],
            ["متى نرتدي القفطان؟", ["في المناسبات", "في النوم", "في الرياضة", "في المطر"], 0, "القفطان لباس احتفالي يُرتدى في المناسبات."],
            ["الاحتفالات تجمع ___ .", ["العائلة والأصدقاء", "الكتب فقط", "الأرقام", "الظل"], 0, "المناسبات فرصة لاجتماع الأحباب."]
          ]
        },
        {
          t: "الفنون في بلدنا",
          intro: "الفن يظهر ذوق أهل البلد ومهارتهم. نكتشف الزخرفة والموسيقى.",
          sections: [
            ["الزخرفة والخط", "الزخرفة المغربية تستخدم أشكالا هندسية ونباتية. نراها في المساجد والبيوت. الخط العربي يزين الجدران والكتب."],
            ["الموسيقى والصنعة", "الموسيقى المغربية لها إيقاعات متنوعة. الآلات مثل الدربكة والعود تصنع هذه الألحان. الصنعة اليدوية تعكس مهارة الحرفيين."]
          ],
          examples: [
            ["وصف زخرفة", ["انظر إلى النقش.", "حدد الشكل الهندسي.", "قل: إنها زخرفة مغربية."], "زخرفة بأشكال هندسية"],
            ["التعريف بالدربكة", ["اسم الآلة.", "اذكر صوتها.", "اذكر استخدامها."], "الدربكة آلة إيقاعية"]
          ],
          questions: [
            ["ما الذي تستخدمه الزخرفة المغربية؟", ["أشكالا هندسية", "صورا فقط", "أرقاما", "ظلالا"], 0, "تعتمد الزخرفة على أشكال هندسية ونباتية."],
            ["أين نرى الخط العربي؟", ["على الجدران والكتب", "في الماء", "في الهواء", "تحت الأرض"], 0, "الخط العربي يزين الجدران والكتب."],
            ["ما الآلة الموسيقية المغربية؟", ["الدربكة", "البيانو فقط", "الطبل الصيني", "الإيتار الكهربائي"], 0, "الدربكة آلة مغربية مشهورة."],
            ["الصنعة اليدوية تدل على ___ .", ["مهارة الحرفيين", "الكسل", "النسيان", "الصمت"], 0, "الصنعة تعبر عن مهارة الحرفي وذوقه."]
          ]
        },
        {
          t: "الرياضة واللعب الجماعي",
          intro: "الرياضة تحافظ على صحتنا وتعلمنا التعاون مع الآخرين.",
          sections: [
            ["فوائد الرياضة", "الرياضة تقوي العضلات وتحافظ على الصحة. الجري وكرة القدم نشاطان مفيدان. التمرين المنتظم يزيد النشاط."],
            ["اللعب بأمان", "نلبس ملابس مناسبة قبل اللعب. نحترم القواعد والزملاء. إذا أصيب أحد نخبر المعلما فورا."]
          ],
          examples: [
            ["الاستعداد للعب", ["البس حذاء مناسبا.", "ابحث عن مكان آمن.", "ابدأ بالتمارين."], "استعددت للعب بأمان"],
            ["حل خلاف في اللعب", ["توقف عن اللعب.", "استمع للآخر.", "اتفق على القاعدة."], "عاد اللعب باحترام"]
          ],
          questions: [
            ["ما فائدة ممارسة الجري وكرة القدم في درس الرياضة؟", ["تقوي الجسم", "تضعفه", "توقف الحركة", "تزيد النوم"], 0, "الرياضة تقوي العضلات وتحافظ على الصحة."],
            ["ماذا نفعل قبل لعب كرة القدم أو الجري في درس الرياضة؟", ["نلبس ملابس مناسبة", "نركض بلا حذاء", "نتجاهل القواعد", "ندفع الزملاء"], 0, "الملابس المناسبة تحمي الجسم."],
            ["كيف نحل خلافا أثناء اللعب؟", ["بالاستماع والاتفاق", "بالصراخ", "بالانسحاب غاضبين", "بدون قواعد"], 0, "الحوار والاتفاق على القاعدة يحفظان المتعة."],
            ["إذا أصيب زميل ن___ .", ["نخبر المعلما", "نتركه", "نضحك", "نكمل اللعب"], 0, "إخبار المعلم أول خطوة لمساعدة المصاب."]
          ]
        },
        {
          t: "المواطنة في حياتنا اليومية",
          intro: "المواطنة سلوك نمارسه كل يوم في المدرسة والشارع والبيت.",
          sections: [
            ["احترام القواعد", "المواطن يحترم القانون ولا يتجاوز الإشارات. يحافظ على الأماكن العامة نظيفة. سلوكه اللطيف يعكس أدبه."],
            ["المشاركة الإيجابية", "نشارك في تنظيف الحي ومساعدة المحتاج. ونقول الحقيقة ونؤدي الواجب. المشاركة الصغيرة تصنع فرقا كبيرا."]
          ],
          examples: [
            ["المحافظة على الحديقة", ["لا أرمي الأوراق.", "أضعها في السلة.", "أقول للآخرين."], "الحديقة نظيفة بجهودنا"],
            ["مساعدة جار", ["أراه يحمل أكياسا.", "أعرض المساعدة.", "أبتسم له."], "قدمت مساعدة لطيفة"]
          ],
          questions: [
            ["ماذا تعني المواطنة؟", ["الانتماء والمسؤولية", "اللعب فقط", "النوم", "الصمت"], 0, "المواطنة انتماء إلى الوطن ومسؤولية تجاهه."],
            ["كيف نحافظ على المكان العام؟", ["برمي النفايات في السلة", "برميها في الشارع", "بتجاهلها", "بكتابة عليه"], 0, "وضع النفايات في السلة يحافظ على النظافة."],
            ["ما سلوك المواطن المحترم؟", ["يقول الحقيقة", "يكذب", "يتجاوز القواعد", "يضحك على الناس"], 0, "الصدق والالتزام من صفات المواطن المحترم."],
            ["المشاركة الصغيرة ___ .", ["تصنع فرقا", "لا تهم", "توقف العمل", "تزيد الفوضى"], 0, "كل فعل إيجابي يساهم في تحسين الحياة العامة."]
          ]
        }
      ]
    }
  }
};

