module.exports = {
  units: {
    "cur8": {
      shared: {
        sections: [
          ["Les mots du quotidien", "En français, on salue les gens avec des mots simples : bonjour, bonsoir, salut. Ces mots changent selon le moment de la journée. Les utiliser montre la politesse."],
          ["Les couleurs et les formes", "Les couleurs comme rouge, bleu, vert et jaune servent à décrire les objets. Les formes simples sont le rond, le carré et le triangle. On dit « une pomme rouge » ou « un cercle bleu »."],
          ["La famille", "On présente sa famille avec des mots comme papa, maman, frère et sœur. On peut dire « voici ma maman » en montrant une photo. Ces mots aident à mieux se faire connaître."],
          ["Écouter et répéter", "Pour apprendre le français, il faut écouter et répéter les mots à voix haute. La répétition aide à retenir le son et le sens des mots. On progresse avec un peu de pratique chaque jour."]
        ],
        vocab: [
          ["bonjour", "mot utilisé le matin pour saluer quelqu'un"],
          ["une couleur", "ce qui donne son aspect à un objet, comme le rouge ou le bleu"],
          ["une forme", "l'apparence d'un objet : rond, carré ou triangle"],
          ["la famille", "les personnes proches : parents, frères et sœurs"],
          ["merci", "mot pour remercier quelqu'un"],
          ["s'il vous plaît", "mot poli pour demander quelque chose"]
        ],
        outcomes: [
          "Saluer et se présenter en français avec des phrases simples.",
          "Nommer et décrire les couleurs et les formes.",
          "Présenter les membres de sa famille.",
          "Répondre à des questions simples sur soi."
        ],
        diagram: "diagram-french-alphabet.svg"
      },
      lessons: [
        {
          t: "Bonjour ! Je m'appelle...",
          intro: "Aujourd'hui nous apprenons à saluer et à dire notre nom en français. Ces mots nous aident à être polis avec les autres.",
          sections: [
            ["Dire bonjour", "Le matin on dit « bonjour » et le soir on dit « bonsoir ». Avec un ami on peut dire simplement « salut ». Le mot change selon le moment de la journée."],
            ["Se présenter", "Pour dire son nom, on dit « je m'appelle + son nom ». On peut ajouter son âge : « j'ai sept ans ». On regarde la personne quand on parle."]
          ],
          examples: [
            ["Comment saluer la maîtresse le matin ?", ["On arrive en classe.", "On dit « Bonjour, maîtresse ».", "On sourit et on attend son tour."], "On dit « Bonjour, maîtresse »."],
            ["Comment dire ton nom à un nouvel ami ?", ["On s'approche de lui.", "On dit « Je m'appelle Karim ».", "On demande « Et toi ? »."], "On dit « Je m'appelle Karim, et toi ? »."]
          ],
          questions: [
            ["Quel mot dit-on le matin ?", ["Bonjour", "Bonne nuit", "Bonsoir", "Au revoir"], 0, "« Bonjour » s'utilise le matin ; « bonsoir » s'utilise le soir."],
            ["Comment compléter : Je ... Amal ?", ["m'appelle", "suis", "ai", "va"], 0, "« Je m'appelle » sert à donner son nom, alors que « je suis » dit ce qu'on est."],
            ["Que dit-on pour remercier ?", ["Merci", "Salut", "Pardon", "Oui"], 0, "« Merci » exprime la reconnaissance après un service ou un cadeau."],
            ["Quelle phrase est polie pour demander ?", ["S'il vous plaît", "Donne-moi", "Vite", "Non"], 0, "« S'il vous plaît » rend la demande polie et respectueuse."]
          ]
        },
        {
          t: "Les couleurs et les formes",
          intro: "Nous allons nommer les couleurs et les formes que nous voyons tous les jours. Cela nous aide à décrire les objets avec précision.",
          sections: [
            ["Les couleurs", "Les couleurs principales sont rouge, bleu, jaune et vert. On dit « une pomme rouge » ou « un ciel bleu ». Le mot de couleur vient après le nom."],
            ["Les formes", "Les formes simples sont le rond, le carré et le triangle. On dit « un ballon rond » ou « une table carrée ». On peut toucher la forme pour la reconnaître."]
          ],
          examples: [
            ["Comment décrire une orange ?", ["On la regarde.", "On voit sa couleur orange.", "On dit « une orange ronde et orange »."], "C'est une orange ronde et orange."],
            ["Comment décrire un drapeau ?", ["On regarde ses couleurs.", "On compte les bandes.", "On dit « un drapeau rouge et vert »."], "On décrit les couleurs et la forme du drapeau."]
          ],
          questions: [
            ["Quelle est la couleur du ciel dégagé ?", ["Bleu", "Rouge", "Vert", "Jaune"], 0, "Le ciel dégagé paraît bleu grâce à la lumière du soleil."],
            ["Comment appelle-t-on une forme à quatre côtés égaux ?", ["Un carré", "Un rond", "Un triangle", "Une ligne"], 0, "Le carré a quatre côtés de même longueur et quatre angles."],
            ["Où place-t-on le mot de couleur ?", ["Après le nom", "Avant le nom", "Au début", "À la fin de la phrase"], 0, "En français, l'adjectif de couleur se place après le nom : « une fleur bleue »."],
            ["Quel mot décrit un ballon ?", ["Rond", "Carré", "Triangle", "Droit"], 0, "Un ballon a une forme ronde, c'est-à-dire sans coins."]
          ]
        },
        {
          t: "Ma famille",
          intro: "Nous allons parler des personnes qui nous sont proches. Savoir présenter sa famille permet de mieux se faire connaître.",
          sections: [
            ["Les membres de la famille", "On dit « mon papa », « ma maman », « mon frère » et « ma sœur ». Les mots changent selon la personne. Les grands-parents s'appellent « papi » et « mamie »."],
            ["Présenter une photo", "Pour montrer une photo, on dit « voici ma famille ». On peut dire « voici mon frère » en montrant du doigt. On répond aux questions avec des phrases courtes."]
          ],
          examples: [
            ["Comment présenter ta maman ?", ["On montre la photo.", "On dit « Voici ma maman ».", "On ajoute « elle est gentille »."], "On dit « Voici ma maman, elle est gentille »."],
            ["Comment dire que tu as deux sœurs ?", ["On compte les personnes.", "On dit « j'ai deux sœurs ».", "On peut nommer leurs prénoms."], "On dit « J'ai deux sœurs qui s'appellent Sara et Lina »."]
          ],
          questions: [
            ["Comment dit-on le père en français ?", ["Le papa", "La maman", "Le frère", "La sœur"], 0, "« Papa » est le mot familier pour désigner le père."],
            ["Que veut dire « voici » ?", ["Montrer quelque chose", "Demander quelque chose", "Dire merci", "Dire non"], 0, "« Voici » sert à montrer ou à présenter une personne ou un objet."],
            ["Quelle phrase présente une sœur ?", ["Voici ma sœur", "Voici mon frère", "Voici mon papa", "Voici ma maison"], 0, "« Ma sœur » désigne une fille, alors que « mon frère » désigne un garçon."],
            ["Comment répondre à « Tu as des frères ? »", ["Oui, j'ai un frère", "Je suis sept ans", "C'est rouge", "Au revoir"], 0, "La réponse doit parler du nombre de frères dans une phrase complète."]
          ]
        },
        {
          t: "Je sais dire et écrire",
          intro: "Dans ce dernier temps, nous révisons tous les mots appris. Nous allons écouter, lire et répondre pour montrer ce que nous savons faire.",
          sections: [
            ["Réviser les mots", "On relit les mots de salutation, de couleur et de famille. On les dit à voix haute pour bien les retenir. On peut les classer par thème."],
            ["Vérifier sa compréhension", "On écoute une phrase et on choisit la bonne image. On répond à des questions simples. Les erreurs aident à apprendre et à progresser."]
          ],
          examples: [
            ["Relie le mot à son image", ["On lit le mot « chat ».", "On cherche l'image du chat.", "On trace une ligne."], "On relie « chat » à l'image du chat."],
            ["Complète la phrase : Je m'appelle ...", ["On écoute la question.", "On prend son nom.", "On écrit « Je m'appelle + son nom »."], "On écrit par exemple « Je m'appelle Youssef »."]
          ],
          questions: [
            ["Quel mot va avec « bonne nuit » ?", ["Le soir", "Le matin", "Midi", "L'école"], 0, "« Bonne nuit » se dit le soir avant d'aller dormir."],
            ["Choisis le mot de couleur : ...", ["Vert", "Table", "Chien", "Livre"], 0, "« Vert » est un adjectif de couleur ; les autres mots sont des noms."],
            ["Dans la phrase « J'ai sept ans », quel est l'ordre des mots en français ?", ["J'ai sept ans", "Je sept ans ai", "Sept j'ai ans", "Ai je sept ans"], 0, "En français, l'ordre est « j'ai + âge + ans »."],
            ["Comment dire merci en français ?", ["Merci", "Salut", "Bonjour", "Pardon"], 0, "« Merci » est le mot pour remercier quelqu'un."]
          ]
        }
      ]
    },

    "cur16": {
      shared: {
        sections: [
          ["Greetings and names", "In English we greet people with simple words: hello, good morning and good afternoon. We use different greetings at different times of the day. A greeting shows politeness."],
          ["Colours and shapes", "We describe things with colours such as red, blue and green, and shapes such as circle, square and triangle. We say 'a red apple' or 'a blue circle'."],
          ["Family and friends", "We talk about people close to us with words like mother, father, brother and sister. We can say 'this is my friend' when we introduce someone."],
          ["Listen and repeat", "To learn English, we listen and repeat words out loud. Repeating helps us remember how words sound and what they mean. A little practice every day helps a lot."]
        ],
        vocab: [
          ["hello", "a word we use to greet someone"],
          ["colour", "what makes things look red, blue or green"],
          ["shape", "the form of an object such as a circle or a square"],
          ["family", "the people close to us such as parents and siblings"],
          ["friend", "a person we like and spend time with"],
          ["please", "a polite word when we ask for something"]
        ],
        outcomes: [
          "Greet someone and introduce themselves in simple English.",
          "Name and describe colours and shapes accurately.",
          "Introduce members of their family and friends.",
          "Answer simple questions about themselves."
        ],
        diagram: "diagram-family.svg"
      },
      lessons: [
        {
          t: "Hello! My name is...",
          intro: "Today we learn to greet people and say our name in English. These words help us speak politely to others.",
          sections: [
            ["Saying hello", "In the morning we say 'good morning' and in the afternoon 'good afternoon'. With a friend we can simply say 'hello' or 'hi'. We choose the word that fits the time."],
            ["Introducing yourself", "To give your name, we say 'My name is ...'. We can add our age: 'I am nine years old'. We look at the person while speaking."]
          ],
          examples: [
            ["How do you greet your teacher in the morning?", ["You enter the classroom.", "You say 'Good morning, teacher'.", "You smile and wait for your turn."], "Say 'Good morning, teacher'."],
            ["How do you tell a new friend your name?", ["You go near them.", "You say 'My name is Karim'.", "You ask 'And you?'."], "Say 'My name is Karim, and you?'."]
          ],
          questions: [
            ["Which greeting do we use in the morning?", ["Good morning", "Good night", "Good afternoon", "Goodbye"], 0, "'Good morning' is used in the morning; 'good afternoon' is used later in the day."],
            ["Complete: My name ... Amal.", ["is", "am", "are", "be"], 0, "'My name is' gives a name, while 'I am' says age or feeling."],
            ["Which word shows politeness when asking?", ["Please", "Hey", "Now", "No"], 0, "'Please' makes a request polite and respectful."],
            ["How do you say thanks in English?", ["Thank you", "Hello", "Sorry", "Yes"], 0, "'Thank you' expresses gratitude after a favour or a gift."]
          ]
        },
        {
          t: "Colours and shapes",
          intro: "We are going to name the colours and shapes we see around us every day. This helps us describe things clearly.",
          sections: [
            ["Naming colours", "The main colours are red, blue, yellow and green. We say 'a red apple' or 'a green tree'. In English the colour word comes before the noun."],
            ["Naming shapes", "The simple shapes are a circle, a square and a triangle. We say 'a round ball' or 'a square table'. We can touch a shape to recognise it."]
          ],
          examples: [
            ["How do you describe an orange?", ["You look at it.", "You see its orange colour.", "You say 'a round, orange fruit'."], "It is a round, orange fruit."],
            ["How do you describe a flag?", ["You look at its colours.", "You count the bands.", "You say 'a red and green flag'."], "You describe the colours and the shape."]
          ],
          questions: [
            ["What colour is a clear sky?", ["Blue", "Red", "Green", "Yellow"], 0, "A clear sky looks blue because of sunlight in the air."],
            ["Which shape has four equal sides?", ["A square", "A circle", "A triangle", "A line"], 0, "A square has four sides of the same length."],
            ["Where is the colour word in English?", ["Before the noun", "After the noun", "At the end", "It is not used"], 0, "In English we say 'a blue car', so the colour comes before the noun."],
            ["Which word describes a ball?", ["Round", "Square", "Triangle", "Straight"], 0, "A ball is round, meaning it has no corners."]
          ]
        },
        {
          t: "My family and friends",
          intro: "We all have people we love and spend time with. In this lesson we learn how to talk about them in English.",
          sections: [
            ["Family words", "We say 'mother', 'father', 'brother' and 'sister'. Grandparents are 'grandmother' and 'grandfather'. Each word names a different person in the family."],
            ["Talking about friends", "We say 'This is my friend' to introduce someone. We can add 'He is kind' or 'She is funny'. We speak kindly about the people close to us."]
          ],
          examples: [
            ["How do you introduce your mother?", ["You show her photo.", "You say 'This is my mother'.", "You add 'She is kind'."], "You say 'This is my mother, she is kind'."],
            ["How do you say you have two sisters?", ["You count them.", "You say 'I have two sisters'.", "You name them."], "You say 'I have two sisters, Sara and Lina'."]
          ],
          questions: [
            ["Which word means the father?", ["Father", "Mother", "Sister", "Friend"], 0, "'Father' is the male parent in a family."],
            ["What does 'this is' do?", ["It introduces someone", "It asks a question", "It says thanks", "It says goodbye"], 0, "'This is' is used to point out or introduce a person."],
            ["Which sentence talks about a brother?", ["This is my brother", "This is my house", "This is my book", "This is my pen"], 0, "'Brother' names a male sibling in the family."],
            ["How do you answer 'Have you got friends?'", ["Yes, I have three friends", "I am nine", "It is blue", "Good night"], 0, "The answer should give information about friends."]
          ]
        },
        {
          t: "Checkpoint: I can say and write",
          intro: "In this last part we review all the words we have learned. We will listen, read and answer to show what we can do.",
          sections: [
            ["Reviewing the words", "We read again the greetings, colours and family words. We say them out loud to remember them. We can group them by topic."],
            ["Checking understanding", "We listen to a sentence and choose the right picture. We answer short questions. Mistakes help us learn and improve."]
          ],
          examples: [
            ["Match the word to the picture", ["You read the word 'cat'.", "You find the picture of the cat.", "You draw a line."], "You match 'cat' to the picture of the cat."],
            ["Complete: My name is ...", ["You listen to the question.", "You take your name.", "You write 'My name is + your name'."], "You write 'My name is Youssef'."]
          ],
          questions: [
            ["Which words go with 'good night'?", ["At bedtime", "At breakfast", "At noon", "At school"], 0, "'Good night' is said in the evening before sleeping."],
            ["Choose the colour word:", ["Green", "Table", "Dog", "Book"], 0, "'Green' is a colour; the other words name objects or animals."],
            ["In 'I am nine years old', which word order is correct in English?", ["I am nine years old", "I nine am years old", "Am I nine years old", "Nine I am old years"], 0, "In English we say 'I am + age + years old'."],
            ["How do you say thanks?", ["Thank you", "Hello", "Sorry", "Please"], 0, "'Thank you' is the phrase used to thank someone."]
          ]
        }
      ]
    },

    "cur24": {
      shared: {
        sections: [
          ["Reading a story", "A story has characters, a place and a sequence of events. We read the whole text first to understand the situation. Then we reread to notice details."],
          ["Finding the main idea", "The main idea is the point the writer wants to share. Detail sentences explain or support it. We can write the main idea in one clear sentence."],
          ["Paragraph writing", "A paragraph begins with a topic sentence. Other sentences give examples and explanations. A closing sentence finishes the idea."],
          ["Checking our work", "We reread our writing to check spelling and grammar. We ask a classmate to read it too. Careful checking makes our work clearer."]
        ],
        vocab: [
          ["main idea", "the most important point of a text"],
          ["character", "a person or animal in a story"],
          ["topic sentence", "the sentence that tells what a paragraph is about"],
          ["detail", "a small piece of information that explains the main idea"],
          ["draft", "a first version of a piece of writing"],
          ["revise", "to improve a text by correcting and adding ideas"]
        ],
        outcomes: [
          "Identify the main idea and supporting details in a short text.",
          "Write a descriptive paragraph with a clear topic sentence.",
          "Use verb tenses correctly in familiar contexts.",
          "Tell a short story with clear sequence and expression."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "Understanding a narrative text",
          intro: " Stories help us imagine other places and lives. In this lesson we learn how to follow a narrative and find its central meaning.",
          sections: [
            ["Following the events", "A narrative moves through a beginning, a middle and an end. We note who the characters are and what problem they face. We follow the order of events step by step."],
            ["Finding the central meaning", "After reading, we ask what the story teaches or shows. We look for the sentence that expresses the lesson. We support our answer with details from the text."]
          ],
          examples: [
            ["Find the main idea of a story about a lost boy", ["You read the whole story.", "You note that the boy is found by friends.", "You write: friendship helps us in difficulty."], "The main idea is that friendship helps us in hard times."],
            ["Identify a supporting detail", ["You find a sentence about the search.", "You check if it explains the main idea.", "You include it as evidence."], "The friends searching for the boy is a supporting detail."]
          ],
          questions: [
            ["What is the main idea of a text?", ["The central point of the text", "The longest sentence", "The writer's name", "The number of pages"], 0, "The main idea is the central message that all the details support."],
            ["What is a character?", ["A person or animal in the story", "The title of the book", "A colour in the text", "The last sentence"], 0, "Characters are the beings who act in a story."],
            ["Which detail supports 'teamwork matters'?", ["The team solved the task together", "The day was sunny", "The book was thick", "The boy wore a hat"], 0, "Working together directly shows the idea of teamwork."],
            ["Why reread a story?", ["To notice details and check meaning", "To make it shorter", "To change the author", "To skip the end"], 0, "Rereading helps us catch details and confirm our understanding."]
          ]
        },
        {
          t: "Descriptive writing: a place in Morocco",
          intro: " A good description helps the reader see a place. We will write about a Moroccan place using clear details.",
          sections: [
            ["Choosing details", "We choose details about sight, sound and smell. For a souk, we can describe colours, voices and spices. Specific details are better than general words."],
            ["Building the paragraph", "We start with a topic sentence naming the place. We add sentences with sensory details. We finish with a sentence that gives our feeling about the place."]
          ],
          examples: [
            ["Write a topic sentence about a souk", ["You name the place.", "You give a general impression.", "You write: The souk is a lively place."], "The topic sentence is 'The souk is a lively place'."],
            ["Add a sensory detail", ["You think of a sound.", "You write about the voices.", "You add: Sellers call out to customers."], "A good detail is 'Sellers call out to customers'."]
          ],
          questions: [
            ["What does a topic sentence do?", ["It tells what the paragraph is about", "It ends the story", "It gives the date", "It names the writer"], 0, "The topic sentence introduces the main subject of the paragraph."],
            ["Which is a sensory detail?", ["The smell of mint tea", "The page number", "The author's age", "The book price"], 0, "A smell is something we sense, so it is a sensory detail."],
            ["Where does the closing sentence go?", ["At the end of the paragraph", "At the start", "In the title", "Before the topic sentence"], 0, "The closing sentence finishes the paragraph after the supporting sentences."],
            ["Why use specific details?", ["They make writing clearer", "They make it shorter", "They remove the topic", "They are not needed"], 0, "Specific details help the reader imagine the place clearly."]
          ]
        },
        {
          t: "Verb tenses and time expressions",
          intro: " Verbs tell us when an action happens. In this lesson we practise choosing the right tense with time words.",
          sections: [
            ["Present and past", "We use the present for habits and facts: 'I live in Rabat'. We use the past for completed actions: 'I visited Fes last year'. Time words such as 'yesterday' signal the past."],
            ["Future plans", "We use 'will' or 'going to' for future plans: 'I will travel tomorrow'. We match the verb form to the time expression. Consistent tenses make writing clear."]
          ],
          examples: [
            ["Choose the tense: I ... to school every day", ["You see 'every day'.", "This shows a habit.", "You write 'go'."], "I go to school every day."],
            ["Choose the tense: She ... Marrakech last week", ["You see 'last week'.", "This shows completed time.", "You write 'visited'."], "She visited Marrakech last week."]
          ],
          questions: [
            ["Which word signals the past?", ["Yesterday", "Every day", "Tomorrow", "Always"], 0, "'Yesterday' refers to a finished time, so it signals the past."],
            ["How do we show a future plan?", ["Use 'will' or 'going to'", "Use the past tense", "Use no verb", "Use only a noun"], 0, "'Will' and 'going to' express future intentions."],
            ["Which sentence shows a habit?", ["I play football on Fridays", "I played yesterday", "I will play tomorrow", "I am playing now"], 0, "'On Fridays' shows repeated action, which is a habit."],
            ["Why match tense to time?", ["To make the meaning clear", "To add more nouns", "To remove details", "To change the topic"], 0, "A correct tense tells the reader exactly when the action happens."]
          ]
        },
        {
          t: "Storytelling and oral presentation",
          intro: " Telling a story well needs order and expression. In this lesson we practise speaking clearly and keeping the audience interested.",
          sections: [
            ["Organising the talk", "We begin by introducing the characters and the place. We tell the events in order using words like 'first', 'then' and 'finally'. We end with the lesson of the story."],
            ["Speaking with expression", "We speak at a steady pace and pause at important moments. We look at the listeners and use a clear voice. Practice helps us feel more confident."]
          ],
          examples: [
            ["Start a story orally", ["You greet the listeners.", "You name the main character.", "You say where it happened."], "Today I will tell you about a boy named Karim who lived in a village."],
            ["Use sequencing words", ["You describe the first event.", "You add the next event.", "You finish with the result."], "First he lost the key, then he searched, finally his friend found it."]
          ],
          questions: [
            ["Which word helps sequence a story?", ["Then", "Blue", "Quickly", "Maybe"], 0, "'Then' shows the order of events in a story."],
            ["What should a story start with?", ["An introduction of characters and place", "The final answer", "A random number", "The closing line"], 0, "Listeners need to know who the story is about and where it happens."],
            ["Why pause while speaking?", ["To emphasise important moments", "To forget the story", "To stop speaking forever", "To change the topic"], 0, "Pauses help the audience follow and feel the important parts."],
            ["How can we build confidence?", ["By practising often", "By speaking very quietly", "By avoiding listeners", "By skipping the ending"], 0, "Regular practice makes speaking easier and more confident."]
          ]
        }
      ]
    },

    "cur_l_pre_sub_sci": {
      shared: {
        sections: [
          ["حواسنا", "نستعمل الحواس الخمس لنتعرف على الأشياء من حولنا: العين للنظر، والأذن للسمع، والأنف للشم، واللسان للتذوق، والجلد للمس. كل حاسة تعطينا معلومة مختلفة."],
          ["النباتات من حولنا", "النباتات كائنات حية تنمو في التربة وتحتاج إلى الماء والضوء. الشجرة نبات كبير، والزهرة نبات صغير جميل."],
          ["الحيوانات من حولنا", "الحيوانات كائنات حية تتحرك وتتغذى. بعضها يعيش في البيت مثل القط، وبعضها في المزرعة مثل البقرة."],
          ["الماء في حياتنا", "الماء مهم لكل الكائنات الحية. نشربه ونستعمله للغسل ولري النباتات. يجب ألا نبدّر الماء."]
        ],
        vocab: [
          ["الحاسة", "القدرة التي نمتلكها لنتعرف على الأشياء مثل النظر والسمع"],
          ["النبات", "كائن حي ينمو في التربة ويحتاج إلى الماء والضوء"],
          ["الحيوان", "كائن حي يتحرك ويتغذى ويتنفس"],
          ["الماء", "سائل شفاف نحتاجه لنشرب ولنظيف الأشياء"],
          ["الجذور", "جزء النبات الذي يمتص الماء من التربة"],
          ["النمو", "زيادة حجم الكائن الحي وتكبره مع الوقت"]
        ],
        outcomes: [
          "يسمّي الحواس الخمس ويذكر وظيفة كل حاسة.",
          "يميّز بين النباتات والحيوانات بأمثلة من بيئته.",
          "يشرح حاجة الكائنات الحية إلى الماء.",
          "يذكر سلوكا يحمي الماء ويحافظ على الكائنات."
        ],
        outcomeTr: {
          fr: [
            "Nommer les cinq sens et indiquer la fonction de chacun.",
            "Distinguer les plantes des animaux à l'aide d'exemples de son environnement.",
            "Expliquer pourquoi les êtres vivants ont besoin d'eau.",
            "Citer un comportement qui protège l'eau et préserve les êtres vivants."
          ],
          en: [
            "Name the five senses and state the function of each one.",
            "Distinguish plants from animals using examples from the local environment.",
            "Explain why living things need water.",
            "Identify a behaviour that protects water and preserves living things."
          ]
        },
        diagram: "diagram-five-senses.svg"
      },
      lessons: [
        {
          t: "حواسنا الخمس",
          intro: "كل يوم نستعمل حواسنا دون أن ننتبه. في هذا الدرس نتعرف إلى كل حاسة ونتدرب على استعمالها.",
          sections: [
            ["العين والأنف", "العين ترى الألوان والأشكال، فنعرف التفاحة الحمراء بالنظر. الأنف يشمّ الروائح، فنعرف رائحة الزهرة أو رائحة الطعام."],
            ["الأذن والجلد", "الأذن تسمع الأصوات مثل صوت الجرس. الجلد يحسّ باللمس والحرارة والبرودة، فنعرف أن الماء بارد أو دافئ."]
          ],
          examples: [
            ["كيف نعرف أن الليمون حامض؟", ["نأخذ الليمون بأيدينا.", "ننظر إلى لونه الأصفر.", "نتذوقه باللسان فنعرف طعمه."], "نتعرف على الليمون باللسان وبالعين معا."],
            ["كيف نعرف أن القط نائم؟", ["ننظر إلى عينيه المغلقتين.", "نصغي إلى تنفسه الهادئ.", "نلمسه بلطف دون إزعاجه."], "نعرف ذلك بالنظر والسمع معا."]
          ],
          questions: [
            ["أي حاسة نستعملها لنتذوق العسل؟", ["اللسان", "الأذن", "العين", "الجلد"], 0, "اللسان فيه براعم التذوق التي تميّز الطعم الحلو وغيره."],
            ["ما وظيفة الأذن؟", ["سماع الأصوات", "شمّ الروائح", "رؤية الألوان", "تذوق الطعام"], 0, "الأذن تستقبل الأصوات فنسمع بها أصوات البيت والشارع."],
            ["لماذا نستعمل أكثر من حاسة لتعرف التفاحة؟", ["لأن كل حاسة تعطينا معلومة مختلفة", "لأن الحواس تتعب بسرعة", "لأن التفاحة كبيرة", "لأننا نلعب"], 0, "العين تعطي اللون والأنف الرائحة واللسان الطعم، فتكتمل المعرفة باجتماعها."],
            ["أي موقف يستعمل الجلد فيه؟", ["لمس ماء بارد", "شمّ وردة", "سماع أغنية", "رؤية قمر"], 0, "الجلد يحسّ بالحرارة والبرودة والملمس، فنعرف برودة الماء باللمس."]
          ],
          tr: {
            fr: {
              t: "Nos cinq sens",
              intro: "Chaque jour nous utilisons nos sens sans y penser. Dans cette leçon, nous découvrons chaque sens et nous nous entraînons à l'utiliser.",
              sections: [
                ["Nos sens", "Nous utilisons nos cinq sens pour connaître les objets autour de nous : les yeux pour voir, les oreilles pour entendre, le nez pour sentir, la langue pour goûter et la peau pour toucher."],
                ["Les yeux et le nez", "Les yeux voient les couleurs et les formes ; nous connaissons ainsi la pomme rouge par la vue. Le nez sent les odeurs ; nous connaissons ainsi l'odeur d'une fleur ou du repas."],
                ["Les plantes autour de nous", "Les plantes sont des êtres vivants qui poussent dans la terre et qui ont besoin d'eau et de lumière. Un arbre est une grande plante et une fleur est une petite plante jolie."],
                ["Les oreilles et la peau", "Les oreilles entendent les sons comme la sonnerie. La peau ressent le toucher, la chaleur et le froid ; nous savons ainsi si l'eau est froide ou tiède."],
                ["Les animaux autour de nous", "Les animaux sont des êtres vivants qui bougent et qui se nourrissent. Certains vivent à la maison comme le chat, d'autres à la ferme comme la vache."],
                ["L'eau dans notre vie", "L'eau est importante pour tous les êtres vivants. Nous la buvons, nous l'utilisons pour laver et pour arroser les plantes. Nous ne devons pas la gaspiller."]
              ],
              vocab: [
                ["le sens", "la capacité de connaître les objets, comme la vue et l'ouïe"],
                ["la plante", "un être vivant qui pousse dans la terre et a besoin d'eau et de lumière"],
                ["l'animal", "un être vivant qui bouge, se nourrit et respire"],
                ["l'eau", "un liquide clair dont nous avons besoin pour boire et nettoyer"],
                ["les racines", "la partie de la plante qui absorbe l'eau de la terre"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Comment savons-nous que le citron est acide ?", ["Nous prenons le citron dans les mains.", "Nous regardons sa couleur jaune.", "Nous le goûtons avec la langue pour connaître son goût."], "Nous connaissons le citron avec la langue et avec les yeux."],
                ["Comment savons-nous que le chat dort ?", ["Nous regardons ses yeux fermés.", "Nous écoutons sa respiration calme.", "Nous le touchons doucement sans le déranger."], "Nous le savons par la vue et par l'ouïe."]
              ]
            },
            en: {
              t: "Our five senses",
              intro: "Every day we use our senses without noticing. In this lesson, we learn about each sense and practise using it.",
              sections: [
                ["Our senses", "We use our five senses to learn about things around us: eyes for seeing, ears for hearing, the nose for smelling, the tongue for tasting and skin for touching."],
                ["Eyes and nose", "Eyes see colours and shapes, so we know the red apple by sight. The nose smells odours, so we know the smell of a flower or of food."],
                ["Plants around us", "Plants are living things that grow in soil and need water and light. A tree is a big plant and a flower is a small, pretty plant."],
                ["Ears and skin", "Ears hear sounds like a bell. Skin feels touch, heat and cold, so we know if water is cold or warm."],
                ["Animals around us", "Animals are living things that move and feed. Some live at home like a cat, and others live on a farm like a cow."],
                ["Water in our life", "Water is important for all living things. We drink it, use it to wash and to water plants. We must not waste it."]
              ],
              vocab: [
                ["sense", "an ability we use to know things, such as sight and hearing"],
                ["plant", "a living thing that grows in soil and needs water and light"],
                ["animal", "a living thing that moves, feeds and breathes"],
                ["water", "a clear liquid we need to drink and to clean things"],
                ["roots", "the part of a plant that takes in water from the soil"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["How do we know that a lemon is sour?", ["We hold the lemon in our hands.", "We look at its yellow colour.", "We taste it with our tongue to know its flavour."], "We know the lemon with our tongue and our eyes together."],
                ["How do we know that the cat is asleep?", ["We look at its closed eyes.", "We listen to its quiet breathing.", "We touch it gently without disturbing it."], "We know it by sight and hearing together."]
              ]
            }
          }
        },
        {
          t: "النباتات من حولنا",
          intro: "النباتات تعيش قريبا منا في الحقل والحديقة. في هذا الدرس نتعرف إلى أجزائها واحتياجاتها.",
          sections: [
            ["أجزاء النبات", "النبات جذوره في التربة وساقه فوقها. الأوراق تصنع الغذاء بمساعدة الشمس. الزهرة تتحول إلى ثمرة تحتوي على البذور."],
            ["ماذا يحتاج النبات؟", "يحتاج النبات إلى الماء والهواء والضوء لينمو. الجذور تمتص الماء من التربة. إذا لم يسقَ النبات ذبل."]
          ],
          examples: [
            ["لماذا نضع الماء عند جذور الشجرة؟", ["نحفر حفرة صغيرة حول الجذع.", "نصب الماء ببطء.", "يمتص الجذر الماء ويوصله إلى الساق."], "لأن الجذور تمتص الماء وتنقله إلى بقية النبات."],
            ["كيف نعتني بزهرة في أصيص؟", ["نضع الأصيص قرب النافذة.", "نسقيها عند جفاف التربة.", "ننتزع الأعشاب الضارة."], "نوفر لها الضوء والماء وننظف التربة."]
          ],
          questions: [
            ["أي جزء يمتص الماء؟", ["الجذور", "الزهرة", "الثمرة", "الورقة"], 0, "الجذور هي الجزء الموجود في التربة والمختص بامتصاص الماء."],
            ["ما الذي يحتاجه النبات لينمو؟", ["الماء والضوء", "الحجر", "الحديد", "الظلام"], 0, "الماء والضوء ضروريان لصنع الغذاء ونمو النبات."],
            ["ماذا يحدث إذا لم نسقِ النبات؟", ["يذبل", "يكبر", "يزهر", "يتحرك"], 0, "غياب الماء يفقد النبات نضارته فيذبل."],
            ["إلى ماذا تتحول الزهرة؟", ["إلى ثمرة", "إلى جذر", "إلى حجر", "إلى ساق"], 0, "بعد التلقيح تتحول الزهرة إلى ثمرة تحمل البذور."]
          ],
          tr: {
            fr: {
              t: "Les plantes autour de nous",
              intro: "Les plantes vivent près de nous, dans le champ et le jardin. Dans cette leçon, nous découvrons leurs parties et leurs besoins.",
              sections: [
                ["Nos sens", "Nous utilisons nos cinq sens pour connaître les objets autour de nous : les yeux pour voir, les oreilles pour entendre, le nez pour sentir, la langue pour goûter et la peau pour toucher."],
                ["Les parties de la plante", "La plante a des racines dans la terre et une tige au-dessus. Les feuilles fabriquent la nourriture avec l'aide du soleil. La fleur devient un fruit qui contient les graines."],
                ["Les plantes autour de nous", "Les plantes sont des êtres vivants qui poussent dans la terre et qui ont besoin d'eau et de lumière. Un arbre est une grande plante et une fleur est une petite plante jolie."],
                ["De quoi a besoin la plante ?", "La plante a besoin d'eau, d'air et de lumière pour pousser. Les racines absorbent l'eau de la terre. Si on ne l'arrose pas, la plante se flétrit."],
                ["Les animaux autour de nous", "Les animaux sont des êtres vivants qui bougent et qui se nourrissent. Certains vivent à la maison comme le chat, d'autres à la ferme comme la vache."],
                ["L'eau dans notre vie", "L'eau est importante pour tous les êtres vivants. Nous la buvons, nous l'utilisons pour laver et pour arroser les plantes. Nous ne devons pas la gaspiller."]
              ],
              vocab: [
                ["le sens", "la capacité de connaître les objets, comme la vue et l'ouïe"],
                ["la plante", "un être vivant qui pousse dans la terre et a besoin d'eau et de lumière"],
                ["l'animal", "un être vivant qui bouge, se nourrit et respire"],
                ["l'eau", "un liquide clair dont nous avons besoin pour boire et nettoyer"],
                ["les racines", "la partie de la plante qui absorbe l'eau de la terre"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Pourquoi mettre de l'eau près des racines de l'arbre ?", ["Nous creusons un petit trou autour du tronc.", "Nous versons l'eau doucement.", "La racine absorbe l'eau et la conduit vers la tige."], "Parce que les racines absorbent l'eau et la transmettent au reste de la plante."],
                ["Comment prendre soin d'une fleur en pot ?", ["Nous plaçons le pot près de la fenêtre.", "Nous l'arrosons quand la terre est sèche.", "Nous enlevons les mauvaises herbes."], "Nous lui donnons de la lumière et de l'eau et nous nettoyons la terre."]
              ]
            },
            en: {
              t: "Plants around us",
              intro: "Plants live near us in the field and the garden. In this lesson, we learn about their parts and their needs.",
              sections: [
                ["Our senses", "We use our five senses to learn about things around us: eyes for seeing, ears for hearing, the nose for smelling, the tongue for tasting and skin for touching."],
                ["Parts of a plant", "A plant has roots in the soil and a stem above it. Leaves make food with the help of the sun. The flower becomes a fruit that contains seeds."],
                ["Plants around us", "Plants are living things that grow in soil and need water and light. A tree is a big plant and a flower is a small, pretty plant."],
                ["What does a plant need?", "A plant needs water, air and light to grow. Roots take in water from the soil. If we do not water it, the plant wilts."],
                ["Animals around us", "Animals are living things that move and feed. Some live at home like a cat, and others live on a farm like a cow."],
                ["Water in our life", "Water is important for all living things. We drink it, use it to wash and to water plants. We must not waste it."]
              ],
              vocab: [
                ["sense", "an ability we use to know things, such as sight and hearing"],
                ["plant", "a living thing that grows in soil and needs water and light"],
                ["animal", "a living thing that moves, feeds and breathes"],
                ["water", "a clear liquid we need to drink and to clean things"],
                ["roots", "the part of a plant that takes in water from the soil"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["Why do we pour water near a tree's roots?", ["We dig a small hole around the trunk.", "We pour the water slowly.", "The root takes in water and carries it to the stem."], "Because roots absorb water and pass it to the rest of the plant."],
                ["How do we care for a flower in a pot?", ["We put the pot near the window.", "We water it when the soil is dry.", "We remove the weeds."], "We give it light and water and we clean the soil."]
              ]
            }
          }
        },
        {
          t: "الحيوانات من حولنا",
          intro: "نرى الحيوانات في البيت والقرية. في هذا الدرس نميّز أنواعها ونعرف كيف تتغذى.",
          sections: [
            ["أنواع الحيوانات", "الحيوانات كثيرة ومتنوعة. منها ما يعيش في البيت مثل القط والكلب، ومنها ما يعيش في المزرعة مثل الدجاج والبقرة."],
            ["كيف يتغذى الحيوان؟", "الحيوانات تتغذى بطرق مختلفة. البقرة تأكل العشب، والقط يأكل اللحم. بعض الحيوانات تأكل النباتات وبعضها يأكل الحيوانات الأخرى."]
          ],
          examples: [
            ["لماذا نقول إن الدجاج حيوان؟", ["نلاحظ أنه يتحرك.", "نراه يأكل الحب.", "نراه يضع البيض."], "لأنه يتحرك ويتغذى ويتكاثر."],
            ["كيف نحافظ على قط أليف؟", ["نعطيه طعاما وماء نظيفين.", "ننظف مكانه.", "نذهب به إلى الطبيب عند المرض."], "نوفر له الغذاء والنظافة والرعاية."]
          ],
          questions: [
            ["أي حيوان يعيش في المزرعة؟", ["البقرة", "السمكة", "القط", "العصفور"], 0, "البقرة من الحيوانات التي تربى في المزرعة."],
            ["ماذا تأكل البقرة؟", ["العشب", "الحجر", "الخشب", "الورق"], 0, "البقرة حيوان عاشب يتغذى على العشب."],
            ["أي صفة تدل على أن الكائن حيوان؟", ["يتحرك ويتغذى", "لا يتغير", "لا يحتاج ماء", "يثبت في مكانه"], 0, "الحركة والتغذية من علامات الحياة عند الحيوان."],
            ["كيف نرعى الحيوان الأليف؟", ["نوفر له الطعام والنظافة", "نتركه جائعا", "نغلقه بلا ماء", "ننساه"], 0, "الحيوان الأليف يحتاج إلى غذاء وماء ونظافة ورعاية."]
          ],
          tr: {
            fr: {
              t: "Les animaux autour de nous",
              intro: "Nous voyons des animaux à la maison et au village. Dans cette leçon, nous distinguons leurs sortes et nous apprenons comment ils se nourrissent.",
              sections: [
                ["Nos sens", "Nous utilisons nos cinq sens pour connaître les objets autour de nous : les yeux pour voir, les oreilles pour entendre, le nez pour sentir, la langue pour goûter et la peau pour toucher."],
                ["Les sortes d'animaux", "Les animaux sont nombreux et variés. Certains vivent à la maison comme le chat et le chien, d'autres à la ferme comme la poule et la vache."],
                ["Les plantes autour de nous", "Les plantes sont des êtres vivants qui poussent dans la terre et qui ont besoin d'eau et de lumière. Un arbre est une grande plante et une fleur est une petite plante jolie."],
                ["Comment l'animal se nourrit-il ?", "Les animaux se nourrissent de façons différentes. La vache mange de l'herbe et le chat mange de la viande. Certains animaux mangent des plantes et d'autres mangent d'autres animaux."],
                ["Les animaux autour de nous", "Les animaux sont des êtres vivants qui bougent et qui se nourrissent. Certains vivent à la maison comme le chat, d'autres à la ferme comme la vache."],
                ["L'eau dans notre vie", "L'eau est importante pour tous les êtres vivants. Nous la buvons, nous l'utilisons pour laver et pour arroser les plantes. Nous ne devons pas la gaspiller."]
              ],
              vocab: [
                ["le sens", "la capacité de connaître les objets, comme la vue et l'ouïe"],
                ["la plante", "un être vivant qui pousse dans la terre et a besoin d'eau et de lumière"],
                ["l'animal", "un être vivant qui bouge, se nourrit et respire"],
                ["l'eau", "un liquide clair dont nous avons besoin pour boire et nettoyer"],
                ["les racines", "la partie de la plante qui absorbe l'eau de la terre"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Pourquoi dit-on que la poule est un animal ?", ["Nous observons qu'elle bouge.", "Nous la voyons manger des grains.", "Nous la voyons pondre des œufs."], "Parce qu'elle bouge, se nourrit et se reproduit."],
                ["Comment prendre soin d'un chat ?", ["Nous lui donnons de la nourriture et de l'eau propres.", "Nous nettoyons son endroit.", "Nous l'emmenons chez le vétérinaire s'il est malade."], "Nous lui offrons de la nourriture, de la propreté et des soins."]
              ]
            },
            en: {
              t: "Animals around us",
              intro: "We see animals at home and in the village. In this lesson, we tell their kinds apart and learn how they feed.",
              sections: [
                ["Our senses", "We use our five senses to learn about things around us: eyes for seeing, ears for hearing, the nose for smelling, the tongue for tasting and skin for touching."],
                ["Kinds of animals", "Animals are many and varied. Some live at home like the cat and the dog, and others live on the farm like the hen and the cow."],
                ["Plants around us", "Plants are living things that grow in soil and need water and light. A tree is a big plant and a flower is a small, pretty plant."],
                ["How does an animal feed?", "Animals feed in different ways. The cow eats grass and the cat eats meat. Some animals eat plants and others eat other animals."],
                ["Animals around us", "Animals are living things that move and feed. Some live at home like a cat, and others live on a farm like a cow."],
                ["Water in our life", "Water is important for all living things. We drink it, use it to wash and to water plants. We must not waste it."]
              ],
              vocab: [
                ["sense", "an ability we use to know things, such as sight and hearing"],
                ["plant", "a living thing that grows in soil and needs water and light"],
                ["animal", "a living thing that moves, feeds and breathes"],
                ["water", "a clear liquid we need to drink and to clean things"],
                ["roots", "the part of a plant that takes in water from the soil"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["Why do we say a hen is an animal?", ["We see that it moves.", "We see it eating grain.", "We see it laying eggs."], "Because it moves, feeds and reproduces."],
                ["How do we care for a pet cat?", ["We give it clean food and water.", "We clean its place.", "We take it to the vet when it is sick."], "We give it food, cleanliness and care."]
              ]
            }
          }
        },
        {
          t: "الماء في حياتنا",
          intro: "الماء ضروري لكل كائن حي. في هذا الدرس نتعرف مصادره ونتعلم كيف نحافظ عليه.",
          sections: [
            ["أين نجد الماء؟", "نجد الماء في الأنهار والآبار والأمطار. الماء صافٍ وعديم اللون. نستعمله في الشرب والغسل والطهي."],
            ["لا نبدّر الماء", "الماء ثمين، خاصة في بلدنا المغرب. نغلق الصنبور بعد الغسل ونصلح التسريب. ترشيد الماء يحمي النباتات والحيوانات."]
          ],
          examples: [
            ["كيف نوفر الماء عند غسل اليدين؟", ["نفتح الصنبور قليلا.", "نفرك اليدين بالصابون.", "نغلق الصنبور بعد الانتهاء."], "نستعمل قدرا قليلا من الماء ونغلق الصنبور."],
            ["ماذا نفعل إذا رأينا صنبورا يقطر؟", ["نلاحظ تسريب الماء.", "نخبر المعلمة أو الوالدين.", "نساعد في إصلاحه أو نبلّغ من يصلحه."], "نخبر شخصا كبيرا ليسبب الإصلاح."]
          ],
          questions: [
            ["أين نجد الماء طبيعيا؟", ["في الأنهار", "في الحجر", "في الشمس", "في الخشب"], 0, "الأنهار من المصادر الطبيعية للماء العذب."],
            ["كيف نرشد استعمال الماء؟", ["نغلق الصنبور", "نتركه مفتوحا", "نكثر الغسل بلا سبب", "نرمي الماء"], 0, "إغلاق الصنبور بعد الاستعمال يمنع هدر الماء."],
            ["لماذا الماء مهم؟", ["لأن الكائنات تشربه وتنمو به", "لأنه ثقيل", "لأنه بارد", "لأنه ملون"], 0, "الماء يدخل في كل عمليات الحياة عند النباتات والحيوانات والإنسان."],
            ["ماذا نفعل عند تسريب الماء؟", ["نخبر شخصا كبيرا", "نتجاهله", "نلعب تحته", "نزيد التسريب"], 0, "إخبار شخص كبير يسمح بإصلاح التسريب سريعا."]
          ],
          tr: {
            fr: {
              t: "L'eau dans notre vie",
              intro: "L'eau est nécessaire à tous les êtres vivants. Dans cette leçon, nous découvrons ses sources et nous apprenons à la préserver.",
              sections: [
                ["Nos sens", "Nous utilisons nos cinq sens pour connaître les objets autour de nous : les yeux pour voir, les oreilles pour entendre, le nez pour sentir, la langue pour goûter et la peau pour toucher."],
                ["Où trouve-t-on l'eau ?", "Nous trouvons l'eau dans les rivières, les puits et la pluie. L'eau est claire et sans couleur. Nous l'utilisons pour boire, laver et cuisiner."],
                ["Les plantes autour de nous", "Les plantes sont des êtres vivants qui poussent dans la terre et qui ont besoin d'eau et de lumière. Un arbre est une grande plante et une fleur est une petite plante jolie."],
                ["Ne pas gaspiller l'eau", "L'eau est précieuse, surtout dans notre pays le Maroc. Nous fermons le robinet après nous être lavés et nous réparons les fuites. Économiser l'eau protège les plantes et les animaux."],
                ["Les animaux autour de nous", "Les animaux sont des êtres vivants qui bougent et qui se nourrissent. Certains vivent à la maison comme le chat, d'autres à la ferme comme la vache."],
                ["L'eau dans notre vie", "L'eau est importante pour tous les êtres vivants. Nous la buvons, nous l'utilisons pour laver et pour arroser les plantes. Nous ne devons pas la gaspiller."]
              ],
              vocab: [
                ["le sens", "la capacité de connaître les objets, comme la vue et l'ouïe"],
                ["la plante", "un être vivant qui pousse dans la terre et a besoin d'eau et de lumière"],
                ["l'animal", "un être vivant qui bouge, se nourrit et respire"],
                ["l'eau", "un liquide clair dont nous avons besoin pour boire et nettoyer"],
                ["les racines", "la partie de la plante qui absorbe l'eau de la terre"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Comment économiser l'eau en se lavant les mains ?", ["Nous ouvrons le robinet doucement.", "Nous frottons les mains avec du savon.", "Nous fermons le robinet après avoir fini."], "Nous utilisons peu d'eau et nous fermons le robinet."],
                ["Que faire si nous voyons un robinet qui fuit ?", ["Nous remarquons la fuite.", "Nous prévenons la maîtresse ou les parents.", "Nous prévenons une personne qui peut réparer."], "Nous prévenons une grande personne pour qu'elle répare la fuite."]
              ]
            },
            en: {
              t: "Water in our life",
              intro: "Water is necessary for every living thing. In this lesson, we learn about its sources and how to protect it.",
              sections: [
                ["Our senses", "We use our five senses to learn about things around us: eyes for seeing, ears for hearing, the nose for smelling, the tongue for tasting and skin for touching."],
                ["Where do we find water?", "We find water in rivers, wells and rain. Water is clear and colourless. We use it for drinking, washing and cooking."],
                ["Plants around us", "Plants are living things that grow in soil and need water and light. A tree is a big plant and a flower is a small, pretty plant."],
                ["Do not waste water", "Water is precious, especially in our country Morocco. We close the tap after washing and we fix leaks. Saving water protects plants and animals."],
                ["Animals around us", "Animals are living things that move and feed. Some live at home like a cat, and others live on a farm like a cow."],
                ["Water in our life", "Water is important for all living things. We drink it, use it to wash and to water plants. We must not waste it."]
              ],
              vocab: [
                ["sense", "an ability we use to know things, such as sight and hearing"],
                ["plant", "a living thing that grows in soil and needs water and light"],
                ["animal", "a living thing that moves, feeds and breathes"],
                ["water", "a clear liquid we need to drink and to clean things"],
                ["roots", "the part of a plant that takes in water from the soil"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["How do we save water when washing hands?", ["We turn the tap on gently.", "We rub our hands with soap.", "We close the tap when we finish."], "We use a little water and close the tap."],
                ["What should we do if we see a dripping tap?", ["We notice the leak.", "We tell the teacher or our parents.", "We tell someone who can fix it."], "We tell an adult so the leak can be fixed."]
              ]
            }
          }
        }
      ]
    },

    "cur_l_p1_sub_sci": {
      shared: {
        sections: [
          ["الكائنات الحية", "الكائنات الحية تنمو وتتغذى وتتنفس. النباتات والحيوانات والإنسان كائنات حية. كل كائن حي يحتاج إلى الماء والهواء والغذاء."],
          ["البيئة", "البيئة هي كل ما يحيط بنا: الهواء والماء والتربة والنباتات. البيئة النظيفة تساعد الكائنات على العيش. نحافظ على بيئتنا بعدم رمي النفايات."],
          ["التجارب", "التجربة طريقة لمعرفة الحقائق بالملاحظة. نلاحظ ونقارن ثم نسجل النتيجة. التجربة تساعدنا على فهم الظواهر من حولنا."],
          ["الصحة", "الصحة تعني أن يكون الجسم سليما ونشيطا. النظافة والغذاء الجيد والرياضة تحافظ على الصحة. نزور الطبيب عندما نمرض."]
        ],
        vocab: [
          ["كائن حي", "مخلوق ينمو ويتغذى ويتنفس"],
          ["البيئة", "كل ما يحيط بالكائن من هواء وماء وتربة"],
          ["التجربة", "اختبار نقوم به لملاحظة ظاهرة ومعرفة نتيجتها"],
          ["الملاحظة", "النظر الدقيق إلى شيء لجمع المعلومات"],
          ["النظافة", "الحفاظ على النظافة في الجسم والمكان"],
          ["النمو", "زيادة حجم الكائن الحي بمرور الوقت"]
        ],
        outcomes: [
          "يميّز الكائنات الحية من الجماد بأمثلة.",
          "يصف عناصر البيئة ويذكر كيف نحافظ عليها.",
          "يجرّب ملاحظة بسيطة ويسجل النتيجة.",
          "يذكر عادات تحافظ على الصحة."
        ],
        outcomeTr: {
          fr: [
            "Distinguer les êtres vivants des objets inanimés à l'aide d'exemples.",
            "Décrire les éléments de l'environnement et indiquer comment les protéger.",
            "Réaliser une observation simple et noter le résultat.",
            "Citer des habitudes quotidiennes qui préservent la santé."
          ],
          en: [
            "Distinguish living things from non-living things using examples.",
            "Describe the parts of the environment and explain how to protect them.",
            "Carry out a simple observation and record the result.",
            "Name daily habits that maintain good health."
          ]
        },
        diagram: "diagram-animals.svg"
      },
      lessons: [
        {
          t: "الكائنات الحية والجماد",
          intro: "ننظر حولنا فنجد أشياء كثيرة: بعضها حي وبعضها جماد. في هذا الدرس نتعلم كيف نميّز بينها.",
          sections: [
            ["علامات الحياة", "الإنسان والحيوان والنبات كائنات حية لأنها تنمو وتتغذى وتتنفس. الشجرة تنمو وتحتاج إلى الماء. الطفل يكبر ويأكل كل يوم."],
            ["الأشياء غير الحية", "الطاولة والحجر والكتاب أشياء غير حية لأنها لا تنمو ولا تأكل. لا تحتاج إلى ماء أو هواء. نميّزها بالملاحظة الدقيقة."]
          ],
          examples: [
            ["هل الهاتف كائن حي؟", ["ننظر إلى الهاتف.", "هل ينمو أو يأكل؟ لا.", "إذن هو شيء غير حي."], "الهاتف شيء غير حي لأنه لا ينمو ولا يتغذى."],
            ["لماذا نقول إن البذرة كائن حي؟", ["نزرع البذرة في التربة.", "نسقيها بالماء.", "بعد أيام تنبت وتكبر."], "لأنها تنمو وتحتاج إلى الماء."]
          ],
          questions: [
            ["أيّها كائن حي؟", ["الشجرة", "الكتاب", "الحجر", "الكرسي"], 0, "الشجرة تنمو وتتغذى بالماء والضوء، لذلك هي كائن حي."],
            ["ما الفرق بين الحي والجماد؟", ["الحي ينمو ويتغذى", "الجماد ينمو", "الحي لا يحتاج ماء", "لا فرق"], 0, "الكائن الحي ينمو ويتغذى ويتنفس، بخلاف الجماد."],
            ["لماذا تحتاج السمكة إلى الماء؟", ["لأنها تتنفس فيه", "لأنها تحب اللون", "لأنها لا تأكل", "لأنها كبيرة"], 0, "السمكة تتنفس بالخياشيم وتحتاج إلى الماء لتعيش."],
            ["أي مثال على ملاحظة صحيحة؟", ["القط يتحرك ويأكل", "القط جميل فقط", "القط لونه أسود فقط", "القط موجود"], 0, "الملاحظة العلمية تصف ما نراه مثل الحركة والتغذية."]
          ],
          tr: {
            fr: {
              t: "Les êtres vivants et les objets",
              intro: "Autour de nous, il y a beaucoup de choses : certaines sont vivantes et d'autres ne le sont pas. Dans cette leçon, nous apprenons à les distinguer.",
              sections: [
                ["Les êtres vivants", "Les êtres vivants grandissent, se nourrissent et respirent. Les plantes, les animaux et les humains sont des êtres vivants. Chaque être vivant a besoin d'eau, d'air et de nourriture."],
                ["Les signes de la vie", "Les humains, les animaux et les plantes sont des êtres vivants parce qu'ils grandissent, se nourrissent et respirent. L'arbre grandit et a besoin d'eau. L'enfant grandit et mange chaque jour."],
                ["L'environnement", "L'environnement est tout ce qui nous entoure : l'air, l'eau, le sol et les plantes. Un environnement propre aide les êtres vivants à vivre. Nous le protégeons en ne jetant pas de déchets."],
                ["Les objets non vivants", "La table, la pierre et le livre sont des objets non vivants parce qu'ils ne grandissent pas et ne mangent pas. Ils n'ont besoin ni d'eau ni d'air. Nous les distinguons par une observation attentive."],
                ["Les expériences", "Une expérience est une façon de connaître les faits par l'observation. Nous observons, nous comparons, puis nous notons le résultat. L'expérience nous aide à comprendre les phénomènes autour de nous."],
                ["La santé", "La santé signifie avoir un corps sain et actif. La propreté, une bonne nourriture et le sport gardent la santé. Nous allons chez le médecin quand nous sommes malades."]
              ],
              vocab: [
                ["un être vivant", "un être qui grandit, se nourrit et respire"],
                ["l'environnement", "tout ce qui entoure un être : l'air, l'eau et le sol"],
                ["une expérience", "un essai que nous faisons pour observer un phénomène et en connaître le résultat"],
                ["l'observation", "le fait de regarder attentivement quelque chose pour recueillir des informations"],
                ["la propreté", "le fait de garder le corps et le lieu propres"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Le téléphone est-il un être vivant ?", ["Nous regardons le téléphone.", "Grandit-il ou mange-t-il ? Non.", "Donc c'est un objet non vivant."], "Le téléphone est un objet non vivant parce qu'il ne grandit pas et ne se nourrit pas."],
                ["Pourquoi dit-on qu'une graine est un être vivant ?", ["Nous plantons la graine dans la terre.", "Nous l'arrosons avec de l'eau.", "Après quelques jours, elle germe et grandit."], "Parce qu'elle grandit et a besoin d'eau."]
              ]
            },
            en: {
              t: "Living things and non-living things",
              intro: "Around us there are many things: some are living and some are not. In this lesson, we learn to tell them apart.",
              sections: [
                ["Living things", "Living things grow, feed and breathe. Plants, animals and humans are living things. Every living thing needs water, air and food."],
                ["Signs of life", "Humans, animals and plants are living things because they grow, feed and breathe. A tree grows and needs water. A child grows and eats every day."],
                ["The environment", "The environment is everything around us: air, water, soil and plants. A clean environment helps living things survive. We protect it by not throwing rubbish."],
                ["Non-living things", "The table, the stone and the book are non-living things because they do not grow and do not eat. They need no water or air. We tell them apart by careful observation."],
                ["Experiments", "An experiment is a way to find facts by observing. We observe, we compare, then we record the result. Experiments help us understand the world around us."],
                ["Health", "Health means having a healthy and active body. Cleanliness, good food and sport keep us healthy. We visit the doctor when we are ill."]
              ],
              vocab: [
                ["living thing", "a being that grows, feeds and breathes"],
                ["environment", "everything around a living thing, such as air, water and soil"],
                ["experiment", "a test we do to observe something and learn its result"],
                ["observation", "looking carefully at something to gather information"],
                ["cleanliness", "keeping the body and the place clean"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["Is a phone a living thing?", ["We look at the phone.", "Does it grow or eat? No.", "So it is a non-living thing."], "A phone is a non-living thing because it does not grow or feed."],
                ["Why do we say a seed is a living thing?", ["We plant the seed in soil.", "We water it.", "After a few days it sprouts and grows."], "Because it grows and needs water."]
              ]
            }
          }
        },
        {
          t: "البيئة النظيفة",
          intro: "البيئة هي المكان الذي نعيش فيه. في هذا الدرس نعرف عناصرها وكيف نحافظ على نظافتها.",
          sections: [
            ["عناصر البيئة", "البيئة تشمل الهواء والماء والتربة والنباتات. في ساحة المدرسة نجد أشجارا وطيورا وترابا. كل عنصر له دور في حياة الكائنات."],
            ["نحافظ على البيئة", "نرمي النفايات في السلة ولا نقطع الأشجار. نطفئ الضوء عندما لا نحتاجه. حماية البيئة مسؤولية كل واحد منا."]
          ],
          examples: [
            ["ماذا نفعل بورقة بعد الأكل؟", ["ننظر إلى الورقة.", "نبحث عن سلة النفايات.", "نضع الورقة فيها."], "نرمي الورقة في سلة النفايات."],
            ["كيف نحافظ على شجرة المدرسة؟", ["لا نقطع أغصانها.", "نسقيها في الصيف.", "نمنع الآخرين من إيذائها."], "نحميها ونعتني بها."]
          ],
          questions: [
            ["في درس «البيئة النظيفة»، أي سلوك يحمي البيئة؟", ["رمي النفايات في السلة", "رميها في الشارع", "قطع الأشجار", "ترك الصنبور مفتوحا"], 0, "وضع النفايات في السلة يمنع التلوث ويحافظ على نظافة المكان."],
            ["ما من عناصر البيئة؟", ["الهواء والماء", "الكتاب والقلم", "اللعب والدرس", "النوم واليقظة"], 0, "الهواء والماء من العناصر الطبيعية المحيطة بنا."],
            ["لماذا نطفئ الضوء؟", ["لترشيد الطاقة", "لأننا نخاف", "لأن الضوء جميل", "لأن الوقت ليل"], 0, "إطفاء الضوء يوفر الطاقة ويحمي البيئة."],
            ["من المسؤول عن نظافة الصف؟", ["كل التلاميذ", "المعلمة وحدها", "المدير وحده", "لا أحد"], 0, "النظافة مسؤولية مشتركة بين الجميع."]
          ],
          tr: {
            fr: {
              t: "Un environnement propre",
              intro: "L'environnement est le lieu où nous vivons. Dans cette leçon, nous connaissons ses éléments et comment garder sa propreté.",
              sections: [
                ["Les êtres vivants", "Les êtres vivants grandissent, se nourrissent et respirent. Les plantes, les animaux et les humains sont des êtres vivants. Chaque être vivant a besoin d'eau, d'air et de nourriture."],
                ["Les éléments de l'environnement", "L'environnement comprend l'air, l'eau, le sol et les plantes. Dans la cour de l'école, nous trouvons des arbres, des oiseaux et de la terre. Chaque élément a un rôle dans la vie des êtres."],
                ["L'environnement", "L'environnement est tout ce qui nous entoure : l'air, l'eau, le sol et les plantes. Un environnement propre aide les êtres vivants à vivre. Nous le protégeons en ne jetant pas de déchets."],
                ["Protéger l'environnement", "Nous jetons les déchets dans la poubelle et nous ne coupons pas les arbres. Nous éteignons la lumière quand nous n'en avons pas besoin. Protéger l'environnement est la responsabilité de chacun."],
                ["Les expériences", "Une expérience est une façon de connaître les faits par l'observation. Nous observons, nous comparons, puis nous notons le résultat. L'expérience nous aide à comprendre les phénomènes autour de nous."],
                ["La santé", "La santé signifie avoir un corps sain et actif. La propreté, une bonne nourriture et le sport gardent la santé. Nous allons chez le médecin quand nous sommes malades."]
              ],
              vocab: [
                ["un être vivant", "un être qui grandit, se nourrit et respire"],
                ["l'environnement", "tout ce qui entoure un être : l'air, l'eau et le sol"],
                ["une expérience", "un essai que nous faisons pour observer un phénomène et en connaître le résultat"],
                ["l'observation", "le fait de regarder attentivement quelque chose pour recueillir des informations"],
                ["la propreté", "le fait de garder le corps et le lieu propres"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Que faire d'un papier après le repas ?", ["Nous regardons le papier.", "Nous cherchons la poubelle.", "Nous y mettons le papier."], "Nous jetons le papier dans la poubelle."],
                ["Comment protéger l'arbre de l'école ?", ["Nous ne cassons pas ses branches.", "Nous l'arrosons en été.", "Nous empêchons les autres de l'abîmer."], "Nous le protégeons et nous en prenons soin."]
              ]
            },
            en: {
              t: "A clean environment",
              intro: "The environment is the place where we live. In this lesson, we learn about its parts and how to keep it clean.",
              sections: [
                ["Living things", "Living things grow, feed and breathe. Plants, animals and humans are living things. Every living thing needs water, air and food."],
                ["Parts of the environment", "The environment includes air, water, soil and plants. In the school yard we find trees, birds and soil. Each part has a role in the life of living things."],
                ["The environment", "The environment is everything around us: air, water, soil and plants. A clean environment helps living things survive. We protect it by not throwing rubbish."],
                ["Protecting the environment", "We throw rubbish in the bin and we do not cut down trees. We turn off the light when we do not need it. Protecting the environment is everyone's responsibility."],
                ["Experiments", "An experiment is a way to find facts by observing. We observe, we compare, then we record the result. Experiments help us understand the world around us."],
                ["Health", "Health means having a healthy and active body. Cleanliness, good food and sport keep us healthy. We visit the doctor when we are ill."]
              ],
              vocab: [
                ["living thing", "a being that grows, feeds and breathes"],
                ["environment", "everything around a living thing, such as air, water and soil"],
                ["experiment", "a test we do to observe something and learn its result"],
                ["observation", "looking carefully at something to gather information"],
                ["cleanliness", "keeping the body and the place clean"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["What do we do with a paper after eating?", ["We look at the paper.", "We look for the bin.", "We put the paper in it."], "We throw the paper in the bin."],
                ["How do we protect the school tree?", ["We do not break its branches.", "We water it in summer.", "We stop others from harming it."], "We protect it and take care of it."]
              ]
            }
          }
        },
        {
          t: "نجرّب ونلاحظ",
          intro: "التجربة تساعدنا على معرفة الأشياء بأنفسنا. في هذا الدرس نقوم بملاحظات بسيطة ونسجل ما نجده.",
          sections: [
            ["خطوات التجربة", "نبدأ بسؤال مثل: هل يطفو الحجر أم يغرق؟ ثم نضع الحجر في الماء ونلاحظ. أخيرا نكتب النتيجة: الحجر يغرق."],
            ["نسجّل الملاحظة", "الملاحظة الصحيحة وصف لما نراه وكل ما نلمسه. نكتب النتيجة بجملة قصيرة. المقارنة بين شيئين تساعدنا على فهم الفرق."]
          ],
          examples: [
            ["هل الورقة تطفو أم تغرق؟", ["نأخذ ورقة وحجرا.", "نضعهما في وعاء ماء.", "نلاحظ أن الورقة تطفو والحجر يغرق."], "الورقة تطفو والحجر يغرق."],
            ["أي مادة تمتص الماء؟", ["نأخذ قطعة قماش وقطعة بلاستيك.", "نضع قطرات ماء على كل واحدة.", "نلاحظ أن القماش يمتص الماء."], "القماش يمتص الماء، أما البلاستيك فلا."]
          ],
          questions: [
            ["أول خطوة في التجربة؟", ["طرح سؤال", "كتابة النتيجة", "رمي الأشياء", "النوم"], 0, "نبدأ دائما بسؤال واضح نريد الإجابة عنه بالملاحظة."],
            ["ماذا نكتب بعد الملاحظة؟", ["النتيجة", "السؤال", "الاسم فقط", "الوقت"], 0, "بعد الملاحظة نكتب النتيجة التي توصلنا إليها."],
            ["كيف نعرف أن القماش امتص الماء؟", ["نرى الماء اختفى فيه", "نراه طار", "نراه أصبح حجرا", "نراه كبر"], 0, "اختفاء قطرات الماء في القماش دليل على امتصاصه."],
            ["لماذا نقارن بين شيئين؟", ["لنعرف الفرق بينهما", "لأننا نلعب", "لأن الوقت قصير", "لأننا نكتب"], 0, "المقارنة تظهر أوجه الشبه والاختلاف فتوضح الملاحظة."]
          ],
          tr: {
            fr: {
              t: "Nous expérimentons et observons",
              intro: "L'expérience nous aide à connaître les choses par nous-mêmes. Dans cette leçon, nous faisons des observations simples et nous notons ce que nous trouvons.",
              sections: [
                ["Les êtres vivants", "Les êtres vivants grandissent, se nourrissent et respirent. Les plantes, les animaux et les humains sont des êtres vivants. Chaque être vivant a besoin d'eau, d'air et de nourriture."],
                ["Les étapes de l'expérience", "Nous commençons par une question : la pierre flotte-t-elle ou coule-t-elle ? Puis nous mettons la pierre dans l'eau et nous observons. Enfin, nous écrivons le résultat : la pierre coule."],
                ["L'environnement", "L'environnement est tout ce qui nous entoure : l'air, l'eau, le sol et les plantes. Un environnement propre aide les êtres vivants à vivre. Nous le protégeons en ne jetant pas de déchets."],
                ["Noter l'observation", "Une bonne observation décrit ce que nous voyons et touchons. Nous écrivons le résultat en une courte phrase. Comparer deux choses nous aide à comprendre la différence."],
                ["Les expériences", "Une expérience est une façon de connaître les faits par l'observation. Nous observons, nous comparons, puis nous notons le résultat. L'expérience nous aide à comprendre les phénomènes autour de nous."],
                ["La santé", "La santé signifie avoir un corps sain et actif. La propreté, une bonne nourriture et le sport gardent la santé. Nous allons chez le médecin quand nous sommes malades."]
              ],
              vocab: [
                ["un être vivant", "un être qui grandit, se nourrit et respire"],
                ["l'environnement", "tout ce qui entoure un être : l'air, l'eau et le sol"],
                ["une expérience", "un essai que nous faisons pour observer un phénomène et en connaître le résultat"],
                ["l'observation", "le fait de regarder attentivement quelque chose pour recueillir des informations"],
                ["la propreté", "le fait de garder le corps et le lieu propres"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["La feuille flotte-t-elle ou coule-t-elle ?", ["Nous prenons une feuille et une pierre.", "Nous les mettons dans un récipient d'eau.", "Nous observons que la feuille flotte et que la pierre coule."], "La feuille flotte et la pierre coule."],
                ["Quelle matière absorbe l'eau ?", ["Nous prenons un tissu et un morceau de plastique.", "Nous déposons des gouttes d'eau sur chacun.", "Nous observons que le tissu absorbe l'eau."], "Le tissu absorbe l'eau, mais pas le plastique."]
              ]
            },
            en: {
              t: "We experiment and observe",
              intro: "Experiments help us discover things for ourselves. In this lesson, we make simple observations and record what we find.",
              sections: [
                ["Living things", "Living things grow, feed and breathe. Plants, animals and humans are living things. Every living thing needs water, air and food."],
                ["Steps of an experiment", "We start with a question: does the stone float or sink? Then we put the stone in water and observe. Finally, we write the result: the stone sinks."],
                ["The environment", "The environment is everything around us: air, water, soil and plants. A clean environment helps living things survive. We protect it by not throwing rubbish."],
                ["Recording the observation", "A good observation describes what we see and touch. We write the result in a short sentence. Comparing two things helps us understand the difference."],
                ["Experiments", "An experiment is a way to find facts by observing. We observe, we compare, then we record the result. Experiments help us understand the world around us."],
                ["Health", "Health means having a healthy and active body. Cleanliness, good food and sport keep us healthy. We visit the doctor when we are ill."]
              ],
              vocab: [
                ["living thing", "a being that grows, feeds and breathes"],
                ["environment", "everything around a living thing, such as air, water and soil"],
                ["experiment", "a test we do to observe something and learn its result"],
                ["observation", "looking carefully at something to gather information"],
                ["cleanliness", "keeping the body and the place clean"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["Does a leaf float or sink?", ["We take a leaf and a stone.", "We put them in a bowl of water.", "We see that the leaf floats and the stone sinks."], "The leaf floats and the stone sinks."],
                ["Which material absorbs water?", ["We take a cloth and a piece of plastic.", "We put drops of water on each.", "We see that the cloth absorbs the water."], "Cloth absorbs water, but plastic does not."]
              ]
            }
          }
        },
        {
          t: "صحتنا في أيدينا",
          intro: "الصحة نعمة نحافظ عليها بعادات بسيطة يومية. في هذا الدرس نتعرف إلى هذه العادات ونطبقها.",
          sections: [
            ["عادات صحية", "نغسل اليدين قبل الأكل وبعده. ننظف أسناننا مرتين في اليوم. ننام مبكرا ونأكل خضروات وفواكه."],
            ["عند المرض", "إذا مرضنا نخبر الوالدين ونذهب إلى الطبيب. نأخذ الدواء كما يعطينا الطبيب. نرتاح ونشرب الماء بكثرة."]
          ],
          examples: [
            ["متى نغسل اليدين؟", ["قبل الأكل.", "بعد اللعب.", "بعد الذهاب إلى الحمام."], "نغسل اليدين قبل الأكل وبعده وبعد اللعب."],
            ["ماذا نفعل إذا ارتفعت حرارتنا؟", ["نخبر الوالدين.", "نرتاح في السرير.", "نشرب الماء ونذهب للطبيب."], "نخبر كبيرا ونذهب إلى الطبيب."]
          ],
          questions: [
            ["كم مرة ننظف أسناننا يوميا؟", ["مرتين", "مرة كل أسبوع", "عند المرض فقط", "لا ننظفها"], 0, "تنظيف الأسنان مرتين يوميا يحميها من التسوس."],
            ["لماذا نغسل اليدين قبل الأكل؟", ["لإزالة الجراثيم", "لأن الماء بارد", "لأن اليدين كبيرة", "لأننا نلعب"], 0, "غسل اليدين يزيل الجراثيم التي قد تنتقل إلى الطعام."],
            ["ما أول ما نفعله عند المرض؟", ["إخبار الوالدين", "أخذ دواء عشوائي", "اللعب في الخارج", "شرب ماء بارد"], 0, "إخبار شخص كبير يضمن الحصول على الرعاية الصحيحة."],
            ["أي عادة تقوي الصحة؟", ["النوم المبكر", "السهر كثيرا", "نسيان وجبة", "عدم شرب الماء"], 0, "النوم المبكر يمنح الجسم الراحة والتجديد."]
          ],
          tr: {
            fr: {
              t: "Notre santé entre nos mains",
              intro: "La santé est un bien que nous gardons par des habitudes simples chaque jour. Dans cette leçon, nous découvrons ces habitudes et les mettons en pratique.",
              sections: [
                ["Les êtres vivants", "Les êtres vivants grandissent, se nourrissent et respirent. Les plantes, les animaux et les humains sont des êtres vivants. Chaque être vivant a besoin d'eau, d'air et de nourriture."],
                ["Des habitudes saines", "Nous nous lavons les mains avant et après le repas. Nous brossons nos dents deux fois par jour. Nous nous couchons tôt et nous mangeons des légumes et des fruits."],
                ["L'environnement", "L'environnement est tout ce qui nous entoure : l'air, l'eau, le sol et les plantes. Un environnement propre aide les êtres vivants à vivre. Nous le protégeons en ne jetant pas de déchets."],
                ["Quand nous sommes malades", "Si nous sommes malades, nous prévenons nos parents et nous allons chez le médecin. Nous prenons le médicament comme le médecin l'indique. Nous nous reposons et nous buvons beaucoup d'eau."],
                ["Les expériences", "Une expérience est une façon de connaître les faits par l'observation. Nous observons, nous comparons, puis nous notons le résultat. L'expérience nous aide à comprendre les phénomènes autour de nous."],
                ["La santé", "La santé signifie avoir un corps sain et actif. La propreté, une bonne nourriture et le sport gardent la santé. Nous allons chez le médecin quand nous sommes malades."]
              ],
              vocab: [
                ["un être vivant", "un être qui grandit, se nourrit et respire"],
                ["l'environnement", "tout ce qui entoure un être : l'air, l'eau et le sol"],
                ["une expérience", "un essai que nous faisons pour observer un phénomène et en connaître le résultat"],
                ["l'observation", "le fait de regarder attentivement quelque chose pour recueillir des informations"],
                ["la propreté", "le fait de garder le corps et le lieu propres"],
                ["la croissance", "l'augmentation de la taille d'un être vivant avec le temps"]
              ],
              examples: [
                ["Quand nous lavons-nous les mains ?", ["Avant de manger.", "Après avoir joué.", "Après être allé aux toilettes."], "Nous nous lavons les mains avant et après le repas et après avoir joué."],
                ["Que faire si nous avons de la fièvre ?", ["Nous prévenons nos parents.", "Nous nous reposons au lit.", "Nous buvons de l'eau et nous allons chez le médecin."], "Nous prévenons un adulte et nous allons chez le médecin."]
              ]
            },
            en: {
              t: "Our health in our hands",
              intro: "Health is a gift we keep through simple daily habits. In this lesson, we learn these habits and practise them.",
              sections: [
                ["Living things", "Living things grow, feed and breathe. Plants, animals and humans are living things. Every living thing needs water, air and food."],
                ["Healthy habits", "We wash our hands before and after meals. We brush our teeth twice a day. We sleep early and eat vegetables and fruit."],
                ["The environment", "The environment is everything around us: air, water, soil and plants. A clean environment helps living things survive. We protect it by not throwing rubbish."],
                ["When we are ill", "If we are ill, we tell our parents and go to the doctor. We take the medicine as the doctor says. We rest and drink plenty of water."],
                ["Experiments", "An experiment is a way to find facts by observing. We observe, we compare, then we record the result. Experiments help us understand the world around us."],
                ["Health", "Health means having a healthy and active body. Cleanliness, good food and sport keep us healthy. We visit the doctor when we are ill."]
              ],
              vocab: [
                ["living thing", "a being that grows, feeds and breathes"],
                ["environment", "everything around a living thing, such as air, water and soil"],
                ["experiment", "a test we do to observe something and learn its result"],
                ["observation", "looking carefully at something to gather information"],
                ["cleanliness", "keeping the body and the place clean"],
                ["growth", "the increase in the size of a living thing over time"]
              ],
              examples: [
                ["When do we wash our hands?", ["Before eating.", "After playing.", "After using the toilet."], "We wash our hands before and after meals and after playing."],
                ["What should we do if we have a fever?", ["We tell our parents.", "We rest in bed.", "We drink water and go to the doctor."], "We tell an adult and go to the doctor."]
              ]
            }
          }
        }
      ]
    },

    "cur_l_p2_sub_isl": {
      shared: {
        sections: [
          ["الطهارة والوضوء", "الوضوء طهارة للجسد قبل الصلاة. نغسل الوجه واليدين والقدمين ونمسح الرأس. الوضوء سنة نبوية يعلمناها الصغار منذ الصغر."],
          ["البر بالوالدين", "البر يعني الإحسان إلى الوالدين بالقول والفعل. نطيعهما ونخدمهما ونقول لهما كلمات لطيفة. البر من أفضل الأعمال."],
          ["التعاون بين الناس", "التعاون يعني أن نساعد بعضنا في الخير. في الصف نساعد الزميل في الفهم، وفي البيت نساعد في تنظيف الغرفة. الله يحب المتعاونين."],
          ["قصص الصالحين", "القصص تعلمنا دروسا من حياة الصالحين. نقرأ قصص الأنبياء لنعرف صبرهم وأخلاقهم. من القصة نتعلم أن نكون صادقين."]
        ],
        vocab: [
          ["الوضوء", "تطهير الجسد بالماء قبل الصلاة"],
          ["الصلاة", "عبادة يؤديها المسلم في أوقات محددة"],
          ["البر", "الإحسان واللطف خاصة مع الوالدين"],
          ["التعاون", "مساعدة الناس بعضهم بعضا في الخير"],
          ["الصدق", "قول الحق وعدم الكذب"],
          ["القدوة", "الشخص الذي نقتدي به في أخلاقه"]
        ],
        outcomes: [
          "يذكر خطوات الوضوء بالترتيب.",
          "يبين معنى البر بالوالدين بسلوكات يومية.",
          "يمثل موقفا من مواقف التعاون في الصف.",
          "يستخلص درسا أخلاقيا من قصة قصيرة."
        ],
        diagram: "diagram-prayer.svg"
      },
      lessons: [
        {
          t: "خطوات الوضوء",
          intro: "الوضوء تطهير نتعلمه صغارا. في هذا الدرس نرتب خطواته ونعرف ما يبطلها.",
          sections: [
            ["كيف نتوضأ؟", "نبدأ بغسل اليدين ثلاث مرات، ثم نتمضمض ونستنشق. نغسل الوجه، ثم اليدين إلى المرفقين. نمسح الرأس ونغسل القدمين."],
            ["ما يبطل الوضوء؟", "ينقض الوضوء خروج شيء من السبيلين أو النوم العميق. إذا أخطأنا في الترتيب نعيد الخطوة. الوضوء طهارة للجسد والقلب."]
          ],
          examples: [
            ["رتّب غسل اليدين في الوضوء", ["نبدأ باليد اليمنى.", "ثم اليد اليسرى.", "نكرر ثلاث مرات."], "نغسل اليدين ثلاث مرات نبدأ باليمنى."],
            ["ماذا نفعل بعد مسح الرأس؟", ["ننتهي من المسح.", "نغسل القدمين.", "نقول الدعاء المأثور."], "نغسل القدمين ثم ندعو."]
          ],
          questions: [
            ["أي خطوة تأتي قبل غسل الوجه؟", ["التمضمض", "غسل القدمين", "مسح الرأس", "الدعاء"], 0, "التمضمض والاستنشاق يأتيان قبل غسل الوجه في ترتيب الوضوء."],
            ["كم مرة نغسل اليدين في الوضوء؟", ["ثلاثا", "مرة", "خمسا", "عشرا"], 0, "السنة غسل اليدين ثلاث مرات في بداية الوضوء."],
            ["ما الذي ينقض الوضوء؟", ["النوم العميق", "النظر للسماء", "قراءة القرآن", "المشي في البيت"], 0, "النوم العميق من نواقض الوضوء عند الفقهاء."],
            ["لماذا نتوضأ قبل الصلاة؟", ["لأن الطهارة شرط للصلاة", "لأننا نحب الماء", "لأن الوقت قصير", "لأننا نلعب"], 0, "الطهارة شرط لصحة الصلاة كما أمر الشرع."]
          ]
        },
        {
          t: "البر بالوالدين",
          intro: "الوالدان يعطياننا الكثير. في هذا الدرس نتعلم كيف نبرهما بالكلام والعمل.",
          sections: [
            ["معنى البر", "البر هو الإحسان إلى الوالدين وطاعتهما في المعروف. نقول لهما كلمات طيبة ولا نرفع صوتنا. نحترمهما حتى لو اختلفنا معهما."],
            ["صور البر اليومية", "نساعد في تنظيف البيت ونحضر لهما الماء. نزور الجد والجدة ونصلي لهما. بر الوالدين يرضي الله وينشر المحبة في البيت."]
          ],
          examples: [
            ["ماذا تقول لأمك بعد الطعام؟", ["تشكرها.", "تقول «شكرا يا أمي».", "تساعدها في رفع الأطباق."], "أشكرها وأساعدها."],
            ["كيف تبر والدك وهو متعب؟", ["أخفف عنه العمل.", "أحضر له ماء.", "أجلسه وأقرأ له قرآنا."], "أخدمه وأريحه."]
          ],
          questions: [
            ["ما معنى بر الوالدين؟", ["الإحسان إليهما", "إغضابهما", "نسيانهما", "السخرية منهما"], 0, "البر يعني الإحسان واللطف والطاعة في المعروف."],
            ["أي سلوك من البر؟", ["مساعدة الأم في البيت", "رفع الصوت عليها", "كسر الأشياء", "الهروب من المدرسة"], 0, "مساعدة الأم عمل صالح يعبر عن البر."],
            ["متى نطيع الوالدين؟", ["في المعروف", "في كل شيء حتى المعصية", "إذا أرادا ذلك فقط", "لا نطيعهما أبدا"], 0, "الطاعة واجبة في المعروف، ولا طاعة في معصية."],
            ["ما أثر البر في البيت؟", ["ينشر المحبة", "يسبب الفوضى", "يقلل الطعام", "يمنع النوم"], 0, "البر يزيد المحبة والسكينة في الأسرة."]
          ]
        },
        {
          t: "نتعاون في الخير",
          intro: "التعاون يجعل العمل أسهل وأجمل. في هذا الدرس نتدرب على التعاون في الصف والبيت.",
          sections: [
            ["التعاون في الصف", "إذا لم يفهم الزميل نشرح له درسا. نوزع الأعمال بيننا عند التنظيف. التعاون ينهي العمل في وقت قصير."],
            ["التعاون في الحي", "نساعد الجار في حمل الأشياء ونشارك في تنظيف الشارع. التعاون على الخير مطلوب، ولا يكون في الخطأ. الله يحب من يعمل مع أخيه."]
          ],
          examples: [
            ["كيف نتعاون في تنظيف الصف؟", ["نقسم الأعمال.", "يمسح أحدنا السبورة.", "يجمع الآخر القمامة."], "نتقاسم العمل فينظف الصف بسرعة."],
            ["صديقك لا يفهم المسألة", ["نصغي إليه.", "نشرح له خطوة بخطوة.", "نتأكد أنه فهم."], "نساعده بالشرح حتى يفهم."]
          ],
          questions: [
            ["في درس «نتعاون في الخير»، ما معنى التعاون؟", ["مساعدة بعضنا في الخير", "العمل وحدنا دائما", "الخصام", "اللعب فقط"], 0, "التعاون هو أن يعمل الناس معا لمصلحة مشتركة."],
            ["أي موقف تعاون؟", ["شرح الدرس للزميل", "إخفاء الكتاب عنه", "الضحك عليه", "تركه وحده"], 0, "شرح الدرس للزميل مساعدة له في الخير."],
            ["هل نتعاون في الخطأ؟", ["لا", "نعم", "أحيانا", "لا نعرف"], 0, "التعاون يكون في الخير والتقوى لا في الإثم."],
            ["ما فائدة تقسيم العمل؟", ["ينجز العمل بسرعة", "يزيد التعب", "يقلل الأصدقاء", "يمنع اللعب"], 0, "تقسيم العمل يوزع الجهد وينهي المهمة بسرعة."]
          ]
        },
        {
          t: "من قصص الصالحين",
          intro: "القصص تحمل لنا دروسا في الصبر والصدق. في هذا الدرس نقرأ قصة ونستخلص منها عبرة.",
          sections: [
            ["كيف نقرأ القصة؟", "نقرأ القصة بهدوء من البداية إلى النهاية. نحدد من هي الشخصية وما الذي حدث. ننتبه إلى نهاية القصة لأنها تحمل الدرس."],
            ["نستخلص العبرة", "بعد القراءة نسأل: ماذا تعلمنا من هذه القصة؟ قد نتعلم الصدق أو الصبر أو الشجاعة. نطبق الدرس في حياتنا اليومية."]
          ],
          examples: [
            ["قصة رجل صادق", ["وجد مالا في السوق.", "انتظر صاحبه.", "ردّ المال إليه."], "تعلّمنا أن الصدق والأمانة من صفات المسلم."],
            ["قصة صبر في امتحان", ["درس التلميذ كل يوم.", "تعثر في البداية.", "لم يستسلم حتى نجح."], "تعلّمنا أن الصبر والعمل يثمران."]
          ],
          questions: [
            ["ماذا نفعل بعد قراءة القصة؟", ["نستخلص العبرة", "نغلق الكتاب فقط", "ننساها", "نغير اسمها"], 0, "لأن القصة تُقرأ لتعليمنا درسا نستفيد منه في حياتنا."],
            ["أي صفة تعلّمناها من قصة رد المال؟", ["الأمانة", "الغضب", "الكسل", "النسيان"], 0, "رد المال لصاحبه يدل على الأمانة والصدق."],
            ["لماذا نقرأ سيرة النبي ﷺ؟", ["لنقتدي بأخلاقه", "لنضيع الوقت", "لأنها طويلة", "لأننا نحب القراءة فقط"], 0, "سيرة النبي ﷺ قدوة لنا في الأخلاق والأعمال."],
            ["أي درس من قصة التلميذ المجتهد؟", ["الصبر يثمر", "اللعب أهم", "لا تدرس", "اهرب من الامتحان"], 0, "المثابرة والصبر على الدراسة تؤديان إلى النجاح."]
          ]
        }
      ]
    },

    "cur_l_p3_sub_amz": {
      shared: {
        sections: [
          ["Lire un texte court", "Un texte court se lit attentivement du début à la fin. On repère d'abord le titre, puis les mots importants. La lecture à voix haute aide à mieux comprendre."],
          ["Comprendre ce que l'on lit", "Pour comprendre, on cherche qui agit et ce qui se passe. On relit les phrases difficiles. On peut expliquer le texte avec ses propres mots."],
          ["S'exprimer à l'oral et à l'écrit", "Après la lecture, on dit ce que l'on a aimé. On écrit ensuite quelques phrases simples. Les mots amazighs comme Azul, qui signifie bonjour, enrichissent notre expression."],
          ["La culture amazighe", "La culture amazighe est vivante au Maroc. Le tifinagh est l'écriture traditionnelle amazighe. Ces mots font partie de notre identité et de notre quotidien."]
        ],
        vocab: [
          ["un texte", "un ensemble de phrases qui racontent ou expliquent quelque chose"],
          ["le titre", "le mot ou la phrase qui nomme le texte"],
          ["comprendre", "saisir le sens de ce que l'on lit ou entend"],
          ["Azul", "mot amazigh qui signifie bonjour"],
          ["Tifinagh", "l'alphabet traditionnel amazigh"],
          ["s'exprimer", "dire ou écrire ce que l'on pense"]
        ],
        outcomes: [
          "Lire un texte court de manière claire et correcte.",
          "Identifier les idées principales d'un texte simple.",
          "Utiliser quelques mots amazighs dans une phrase.",
          "Écrire un court paragraphe personnel."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "Un petit texte à lire",
          intro: "Nous allons lire un texte court sur la vie au Maroc. La lecture à voix haute nous aide à mieux entendre les mots.",
          sections: [
            ["Lire le titre d'abord", "Avant de lire, nous regardons le titre. Il nous dit de quoi parle le texte. Ensuite, nous lisons les phrases une par une."],
            ["Lire à voix haute", "Quand nous lisons à voix haute, nous prononçons chaque mot clairement. Nous marquons une petite pause à la fin de la phrase. Une lecture régulière devient plus facile."]
          ],
          examples: [
            ["Comment commencer la lecture d'un texte ?", ["Nous regardons le titre.", "Nous lisons la première phrase.", "Nous continuons doucement."], "Nous commençons par le titre puis nous lisons les phrases."],
            ["Comment lire une phrase difficile ?", ["Nous lisons la phrase lentement.", "Nous cherchons le sens des mots.", "Nous relisons la phrase."], "Nous lisons lentement et nous relisons pour comprendre."]
          ],
          questions: [
            ["Dans la leçon « Un petit texte à lire », que fait-on avant la lecture ?", ["On regarde le titre", "On ferme le livre", "On écrit la fin", "On dort"], 0, "Le titre annonce le sujet du texte et prépare la lecture."],
            ["Dans « Un petit texte à lire », comment lire à voix haute ?", ["Clairement et avec des pauses", "Très vite sans pause", "En silence", "En sautant des mots"], 0, "Une lecture claire avec des pauses rend le texte compréhensible."],
            ["Que faire si un mot est difficile ?", ["Chercher son sens et relire", "Sauter le mot", "Rire du mot", "Fermer le livre"], 0, "Chercher le sens et relire aide à comprendre le texte."],
            ["À quoi sert la lecture régulière ?", ["Elle rend la lecture plus facile", "Elle fait oublier les mots", "Elle est inutile", "Elle remplace l'école"], 0, "L'entraînement régulier améliore la lecture et la prononciation."]
          ]
        },
        {
          t: "Vérifier sa compréhension",
          intro: "Après la lecture, il faut vérifier que l'on a bien compris. Nous allons chercher les idées et répondre à des questions.",
          sections: [
            ["Chercher les idées", "Nous cherchons qui agit et ce qui se passe dans le texte. Nous soulignons les mots importants. Une idée principale résume le texte en une phrase."],
            ["Répondre aux questions", "Nous relisons le texte pour trouver la réponse. Nous répondons avec une phrase complète. Si nous ne trouvons pas, nous relisons la phrase concernée."]
          ],
          examples: [
            ["Comment trouver l'idée principale ?", ["Nous lisons le texte.", "Nous cherchons le sujet répété.", "Nous écrivons une phrase de résumé."], "L'idée principale est le sujet central du texte."],
            ["Comment répondre à une question sur le texte ?", ["Nous relisons la phrase liée.", "Nous prenons l'information.", "Nous écrivons une phrase complète."], "Nous répondons avec une phrase complète tirée du texte."]
          ],
          questions: [
            ["Où trouvons-nous la réponse ?", ["Dans le texte", "Dans le cahier d'un autre", "Dans la rue", "Dans le titre seul"], 0, "La réponse se trouve dans les phrases du texte que nous relisons."],
            ["Qu'est-ce qu'une idée principale ?", ["Une phrase qui résume le texte", "Un mot de la fin", "Le nom de l'auteur", "La date"], 0, "L'idée principale résume en une phrase le sujet du texte."],
            ["Comment répondre correctement ?", ["Avec une phrase complète", "Avec un seul mot toujours", "En criant", "Sans relire"], 0, "Une phrase complète rend la réponse claire et correcte."],
            ["Pourquoi relire le texte ?", ["Pour mieux comprendre", "Pour finir vite", "Pour ne pas écrire", "Pour changer le titre"], 0, "La relecture permet de vérifier et d'approfondir la compréhension."]
          ]
        },
        {
          t: "Exprimer ses idées",
          intro: "Après avoir compris un texte, nous pouvons dire et écrire ce que nous en pensons. Cela s'appelle s'exprimer.",
          sections: [
            ["Dire ce que l'on a aimé", "Nous disons : j'ai aimé ce texte parce que ... Nous donnons une raison simple. Parler avec un camarade aide à trouver les mots justes."],
            ["Écrire quelques phrases", "Nous écrivons trois ou quatre phrases sur le texte. Nous commençons par une phrase d'introduction. Nous terminons par notre avis personnel."]
          ],
          examples: [
            ["Comment dire que l'on a aimé une histoire ?", ["Je choisis une phrase du texte.", "Je dis ce que j'ai aimé.", "Je donne une raison."], "J'ai aimé cette histoire parce qu'elle est drôle."],
            ["Comment écrire un petit avis ?", ["J'écris le titre.", "Je résume en une phrase.", "J'ajoute mon avis."], "Mon avis : ce texte est intéressant et facile à lire."]
          ],
          questions: [
            ["Comment exprimer son avis ?", ["Dire ce que l'on pense avec une raison", "Répondre par oui seulement", "Ne rien dire", "Changer le texte"], 0, "Un avis personnel s'exprime avec une raison claire."],
            ["Que faut-il écrire en premier ?", ["Une phrase d'introduction", "La fin", "La signature", "Rien"], 0, "Une phrase d'introduction présente le sujet avant le détail."],
            ["À quoi sert de parler avec un camarade ?", ["À trouver les mots justes", "À ne pas lire", "À oublier le texte", "À dormir"], 0, "L'échange avec un camarade aide à formuler ses idées."],
            ["Combien de phrases pour un petit avis ?", ["Trois ou quatre", "Dix pages", "Une seule toujours", "Aucune"], 0, "Trois ou quatre phrases suffisent pour un avis court et clair."]
          ]
        },
        {
          t: "Mots et culture amazighes",
          intro: "La langue amazighe fait partie de la culture marocaine. Nous allons découvrir quelques mots et l'écriture tifinagh.",
          sections: [
            ["Des mots de la vie quotidienne", "En amazigh, on dit Azul pour bonjour et Azul fellawen pour bonjour à tous. Ces mots sont utilisés au Maroc. Les apprendre enrichit notre langue."],
            ["L'écriture tifinagh", "Le tifinagh est l'alphabet amazigh traditionnel. On le voit sur des panneaux et dans des décorations. Le préserver aide à garder notre identité culturelle vivante."]
          ],
          examples: [
            ["Comment saluer en amazigh ?", ["Je regarde la personne.", "Je dis Azul.", "Je souris."], "On dit Azul pour saluer."],
            ["Où voit-on le tifinagh ?", ["Sur les panneaux de route.", "Dans les décorations.", "Sur les affiches culturelles."], "On le voit sur les panneaux et dans les décorations."]
          ],
          questions: [
            ["Dans « Mots et culture amazighes », que signifie le mot Azul ?", ["Bonjour", "Merci", "Au revoir", "Non"], 0, "Azul est le mot amazigh utilisé pour saluer."],
            ["Dans la leçon amazighe, comment nomme-t-on l'alphabet traditionnel ?", ["L'alphabet amazigh", "Un plat marocain", "Une ville", "Un sport"], 0, "Le tifinagh est l'écriture traditionnelle de la langue amazighe."],
            ["Où peut-on voir le tifinagh ?", ["Sur des panneaux", "Uniquement dans les livres français", "Nulle part", "Dans le ciel"], 0, "Le tifinagh apparaît sur des panneaux et dans des décorations culturelles."],
            ["Pourquoi apprendre des mots amazighs ?", ["Pour enrichir notre langue", "Pour oublier le français", "Pour ne pas parler", "Pour dormir"], 0, "Apprendre ces mots renforce notre identité et enrichit notre expression."]
          ]
        }
      ]
    },

    "cur_l_p4_sub_ar": {
      shared: {
        sections: [
          ["القراءة الواعية", "القراءة الواعية تعني أن نفهم ما نقرأ لا أن نلفظ الكلمات فقط. نقرأ بهدوء ونتوقف عند المعاني. إذا لم نفهم جملة نعيد قراءتها."],
          ["استخراج الأفكار", "لكل نص فكرة رئيسية تدور حولها المعاني. نبحث عن الجملة التي تلخص النص. الأفكار الفرعية توضح الفكرة الرئيسية."],
          ["التعبير عن الفهم", "بعد القراءة نعبر عما فهمناه بكلماتنا. نستطيع تلخيص النص في جمل قليلة. التعبير يساعدنا على تثبيت المعنى."],
          ["القواعد النحوية", "القواعد تساعدنا على قراءة صحيحة وكتابة سليمة. نعرف الفاعل والمفعول في الجملة. الإعراب الصحيح يوضح المعنى."]
        ],
        vocab: [
          ["النص", "مجموعة جمل مترابطة تحمل معنى"],
          ["الفكرة الرئيسية", "المعنى الأساسي الذي يدور حوله النص"],
          ["التلخيص", "ذكر أهم المعاني بجمل قليلة"],
          ["الفاعل", "من قام بالفعل في الجملة"],
          ["المفعول", "من وقع عليه الفعل في الجملة"],
          ["السياق", "الظروف التي تساعد على فهم المعنى"]
        ],
        outcomes: [
          "يقرأ نصا قراءة صحيحة معبرة.",
          "يحدد الفكرة الرئيسية والأفكار الفرعية.",
          "يلخص النص بجمل من عنده.",
          "يحدد الفاعل والمفعول في جمل بسيطة."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "نص قرائي: شجرة الزيتون",
          intro: "نقرأ اليوم نصا قصيرا عن شجرة الزيتون في بلدنا. سنقرأ بتمهل ونفهم المعاني.",
          sections: [
            ["النص", "في قرية مغربية، تقف شجرة زيتون عجوز في وسط الحقل. يقطف الجد الزيتون في الخريف ويأخذه إلى المعصرة. من الزيتون نستخرج زيتا طيبا تطبخ به الأسرة."],
            ["نقرأ بتمهل", "نقرأ الجملة كاملة ثم نتوقف عند نهايتها. نضع علامة تحت الكلمات التي لا نفهمها. القراءة الهادئة تساعد على الفهم."]
          ],
          examples: [
            ["من هو الشخصية في النص؟", ["نقرأ أول سطر.", "نجد كلمة «الجد».", "نقول إن الجد هو الشخصية."], "الجد هو الشخصية في النص."],
            ["أين تقف الشجرة؟", ["نقرأ الجملة الأولى.", "نجد «في وسط الحقل».", "نحدد المكان."], "تقف الشجرة في وسط الحقل."]
          ],
          questions: [
            ["في نص «شجرة الزيتون»، أين تقف الشجرة؟", ["في وسط الحقل", "في البحر", "في السوق", "في المدرسة"], 0, "النص يقول إن الشجرة تقف في وسط الحقل."],
            ["متى يقطف الجد الزيتون؟", ["في الخريف", "في الربيع", "في الصيف", "في الشتاء"], 0, "النص ذكر الخريف كوقت لقطف الزيتون."],
            ["ماذا نستخرج من الزيتون؟", ["الزيت", "القمح", "الملح", "القطن"], 0, "من الزيتون يستخرج الزيت كما يوضح النص."],
            ["كيف نقرأ النص؟", ["بتمهل وفهم", "بسرعة دون فهم", "بصوت عال فقط", "بدون نظر"], 0, "القراءة الواعية تحتاج إلى تمهل وفهم المعاني."]
          ]
        },
        {
          t: "نستخرج الأفكار",
          intro: "لكل نص فكرة أساسية وأفكار فرعية. في هذا الدرس نتدرب على إيجادها في نص بسيط.",
          sections: [
            ["الفكرة الرئيسية", "الفكرة الرئيسية هي المعنى العام الذي يدور حوله النص. في نص الزيتون الفكرة هي أهمية شجرة الزيتون للأسرة. نجدها غالبا في أول النص أو آخره."],
            ["الأفكار الفرعية", "الأفكار الفرعية تشرح الفكرة الرئيسية. مثل: قطف الزيتون، عصره، وطبخ الزيت. كل فكرة فرعية توضح جانبا من الموضوع."]
          ],
          examples: [
            ["ما الفكرة الرئيسية في نص المدرسة؟", ["نقرأ النص كاملا.", "نسأل: عن ماذا يتحدث؟", "نكتب: المدرسة مكان للتعلم."], "الفكرة هي أن المدرسة مكان للتعلم والنمو."],
            ["نستخرج فكرة فرعية", ["نقرأ الجملة.", "نحدد ما تضيفه.", "نكتبها باختصار."], "الجملة تضيف فكرة فرعية توضح المعنى."]
          ],
          questions: [
            ["ما الفكرة الرئيسية؟", ["المعنى العام للنص", "كلمة واحدة", "اسم الكاتب", "عدد الجمل"], 0, "الفكرة الرئيسية تلخص المعنى العام الذي يدور حوله النص."],
            ["ما دور الأفكار الفرعية؟", ["توضح الفكرة الرئيسية", "تغير العنوان", "تلغي النص", "تقلل المعنى"], 0, "الأفكار الفرعية تشرح جوانب الفكرة الرئيسية وتدعمها."],
            ["أين نجد الفكرة غالبا؟", ["في البداية أو النهاية", "في الاسم فقط", "في الفراغ", "في الرقم"], 0, "غالبا تظهر الفكرة الرئيسية في المقدمة أو الخاتمة."],
            ["كيف نكتب الفكرة؟", ["بجملة واضحة", "بصورة فقط", "بكلمة مهملة", "بعلامة"], 0, "كتابة الفكرة بجملة واضحة تجعل المعنى مفهوما."]
          ]
        },
        {
          t: "أعبر عن فهمي",
          intro: "بعد أن فهمت النص، عبر عن ذلك بكلماتك. التلخيص والحديث يساعدانك على تثبيت المعنى.",
          sections: [
            ["ألخص النص", "التلخيص ذكر أهم المعاني بجمل قليلة. نبدأ بالفكرة الرئيسية ثم نضيف تفصيلين. لا نذكر كل كلمة، بل المعنى المهم."],
            ["أتحدث عن النص", "نقول «فهمت من النص أن ...». نستخدم جملا قصيرة وواضحة. ننصت إلى زملائنا عندما يتحدثون."]
          ],
          examples: [
            ["لخص نص الزيتون", ["نذكر الفكرة: الزيتون مهم للأسرة.", "نضيف: يقطفه الجد في الخريف.", "نختم: منه يصنع الزيت."], "الزيتون مهم للأسرة، يقطفه الجد خريفا ويصنع منه الزيت."],
            ["عبر عن رأيك في النص", ["أقول إن النص مفيد.", "أذكر سببا.", "أختم بجملة قصيرة."], "أرى النص مفيدا لأنه يعرفنا بثمرة بلدنا."]
          ],
          questions: [
            ["ما التلخيص؟", ["ذكر أهم المعاني بجمل قليلة", "نسخ النص كاملا", "قراءة العنوان فقط", "كتابة اسم النص"], 0, "التلخيص يختصر النص في أهم معانيه دون حذف الفكرة الأساسية."],
            ["بماذا نبدأ التلخيص؟", ["بالفكرة الرئيسية", "بالتفاصيل الصغيرة", "بالأرقام", "بالنهاية"], 0, "البدء بالفكرة الرئيسية يعطي التلخيص وضوحا."],
            ["كيف نتحدث عن النص؟", ["بجمل قصيرة وواضحة", "بكلمات مبهمة", "بصمت", "بصوت خفيف جدا"], 0, "الجمل القصيرة الواضحة تعبر عن الفهم بشكل أفضل."],
            ["ماذا نفعل عندما يتحدث زميلنا؟", ["ننصت إليه", "نقاطعه", "نغادر الصف", "نكتب شيئا آخر"], 0, "الإنصات احترام ويساعد على الاستفادة من أفكار الآخرين."]
          ]
        },
        {
          t: "قواعد نحوية في النص",
          intro: "القواعد تساعدنا على فهم الجملة وقراءتها قراءة صحيحة. في هذا الدرس نعرف الفاعل والمفعول.",
          sections: [
            ["الفاعل والمفعول", "في جملة «يقطف الجد الزيتون»، الجد هو الفاعل لأنه قام بالفعل. الزيتون هو المفعول لأنه وقع عليه الفعل. الفاعل غالبا مرفوع والمفعول منصوب."],
            ["علامات الإعراب", "نعرف الفاعل بالضمة والمفعول بالفتحة في المثال الصحيح. إذا تغيرت الحركة تغير المعنى. الإعراب الصحيح يساعد على الفهم السليم."]
          ],
          examples: [
            ["حدد الفاعل في: كتب التلميذ الدرس", ["نبحث عن الفعل: كتب.", "نسأل: من كتب؟", "التلميذ هو الفاعل."], "التلميذ فاعل مرفوع."],
            ["حدد المفعول في: شرب الولد الماء", ["الفعل شرب.", "ماذا شرب؟ الماء.", "الماء هو المفعول."], "الماء مفعول به منصوب."]
          ],
          questions: [
            ["من الفاعل في «أكل القط السمكة»؟", ["القط", "السمكة", "أكل", "لا أحد"], 0, "القط هو من قام بفعل الأكل، لذلك هو الفاعل."],
            ["ما المفعول في «قرأت الكتاب»؟", ["الكتاب", "قرأت", "أنا", "الصف"], 0, "الكتاب هو ما وقع عليه فعل القراءة، فهو المفعول."],
            ["كيف يُعرف الفاعل غالبا؟", ["بالرفع", "بالنصب", "بالجر", "بالسكون"], 0, "الفاعل يُرفع في الأصل، علامته الضمة أو ما ينوب عنها."],
            ["لماذا نعرب الجملة؟", ["لفهم المعنى بشكل صحيح", "لزيادة الكلمات", "لتغيير النص", "للنوم"], 0, "الإعراب الصحيح يوضح موقع كل كلمة ويمنع لبس المعنى."]
          ]
        }
      ]
    },

    "cur_l_p4_sub_cul": {
      shared: {
        sections: [
          ["ثقافتنا المغربية", "المغرب بلد له ثقافة غنية تجمع بين الأصالة والتنوع. نجد ذلك في المأكل والملبس واللغة. نفتخر بثقافتنا ونحترم ثقافات الآخرين."],
          ["الفنون والجمال", "الفن يعبر عن جمال البلد وتاريخه. الزليج والخط العربي والنقش على الخشب فنون مغربية مشهورة. نرى هذه الفنون في المساجد والقصور."],
          ["الرياضة والصحة", "الرياضة تقوي الجسم وتعلمنا الانضباط. كرة القدم رياضة يحبها المغاربة. اللعب الجماعي يعلمنا التعاون والاحترام."],
          ["المواطنة الصالحة", "المواطن الصالح يحترم القانون وينظف بيئته. يشارك في الخير ويحترم جيرانه. يساعد في بناء الوطن بسلوكه اليومي."]
        ],
        vocab: [
          ["الثقافة", "مجموعة العادات والفنون والقيم التي تميز مجتمعا"],
          ["الزليج", "فن مغربي في تزيين الجدران والأرضيات بالبلاط الملون"],
          ["الرياضة", "نشاط بدني يقوي الجسم وينمي المهارات"],
          ["المواطنة", "انتماء الإنسان إلى وطنه والتزامه تجاهه"],
          ["الاحترام", "تقدير الآخرين ومعاملتهم بلطف"],
          ["الوطن", "البلد الذي نعيش فيه وننتمي إليه"]
        ],
        outcomes: [
          "يذكر مظاهر من الثقافة المغربية.",
          "يميز بعض الفنون المغربية ويصفها.",
          "يبين أهمية الرياضة للصحة.",
          "يمثل سلوكا يدل على المواطنة الصالحة."
        ],
        diagram: "diagram-morocco-map.svg"
      },
      lessons: [
        {
          t: "مظاهر ثقافتنا",
          intro: "لكل بلد ثقافة تميزه. في هذا الدرس نتعرف إلى مظاهر الثقافة المغربية.",
          sections: [
            ["في المأكل والملبس", "يحب المغاربة الكسكسي والطاجين والشاي بالنعناع. يرتدي الرجال الجلباب والنساء الحايك في المناسبات. هذه العادات تعبر عن هويتنا."],
            ["مدننا وثقافتنا", "ننظر إلى خريطة المغرب لنتعرف على مدن مثل الرباط وفاس ومراكش. الخريطة تعرض المغرب بحدوده المتصلة المعتمدة. لكل مدينة طابعها الثقافي الخاص."]
          ],
          examples: [
            ["ما الطبق المغربي المشهور؟", ["نفكر في أكلات بلدنا.", "نذكر الكسكسي.", "نقول إنه طبق مغربي."], "الكسكسي طبق مغربي مشهور."],
            ["كيف نعرف مدينة فاس؟", ["ننظر إلى الخريطة.", "نجد اسم فاس.", "نذكر أنها مدينة ثقافية."], "فاس مدينة مغربية عريقة في الثقافة."]
          ],
          questions: [
            ["في درس «مظاهر ثقافتنا»، أي طبق مغربي ذكرناه؟", ["الكسكسي", "البيتزا", "البرجر", "السوشي"], 0, "الكسكسي من الأطباق المغربية المعروفة."],
            ["ما الشراب المغربي المشهور؟", ["الشاي بالنعناع", "القهوة فقط", "الماء الغازي", "العصير الصناعي"], 0, "الشاي بالنعناع جزء من الضيافة المغربية."],
            ["أي مدينة مغربية؟", ["مراكش", "باريس", "مدريد", "القاهرة"], 0, "مراكش مدينة مغربية عريقة."],
            ["ماذا تعبر الثقافة؟", ["عن هوية البلد", "عن الطقس فقط", "عن الرياضة فقط", "عن المال فقط"], 0, "الثقافة تعبر عن هوية الشعب وعاداته وقيمه."]
          ]
        },
        {
          t: "فنون مغربية",
          intro: "الفنون تعبر عن جمال البلد وتاريخه. في هذا الدرس نتعرف إلى فنون مغربية مشهورة.",
          sections: [
            ["الزليج والخط", "الزليج فن تزيين بالبلاط الملون يزين المساجد والقصور. الخط العربي يزين الجدران والمصاحف. هذان الفنان يعكسان مهارة الحرفيين المغاربة."],
            ["النقش والحرف", "ينقش المغاربة على الخشب والجلد والفضة. نجد هذه الصناعات في الأسواق القديمة. دعم الحرفيين يحافظ على هذه الفنون."]
          ],
          examples: [
            ["أين نرى الزليج؟", ["ندخل مسجدا أو قصرا.", "ننظر إلى الجدران.", "نلاحظ الأشكال الملونة."], "نرى الزليج في المساجد والقصور."],
            ["كيف ندعم الحرفي؟", ["نشتري منتجه.", "نمدحه.", "نتعرف على صنعته."], "نشتري من الحرفي ونتعرف على فنه."]
          ],
          questions: [
            ["كيف عرّفنا الزليج في درس «فنون مغربية»؟", ["فن تزيين بالبلاط", "نوع من الطعام", "لعبة رياضية", "نوع من الشاي"], 0, "الزليج فن مغربي في تزيين الأسطح بالبلاط الملون."],
            ["أي فن مغربي آخر؟", ["الخط العربي", "الرسم بالكهرباء", "الغناء الأجنبي", "الرقص الحديث"], 0, "الخط العربي من الفنون المغربية المعروفة."],
            ["أين نجد الصناعات الحرفية؟", ["في الأسواق القديمة", "في المطار فقط", "في البحر", "في الفراغ"], 0, "الأسواق القديمة تعرض الصناعات الحرفية المغربية."],
            ["لماذا نحافظ على الفنون؟", ["لأنها جزء من هويتنا", "لأنها سهلة", "لأنها قديمة فقط", "لأنها لا تحتاج صيانة"], 0, "الفنون تحمل تاريخ البلد وهويته، لذا يجب الحفاظ عليها."]
          ]
        },
        {
          t: "الرياضة والصحة",
          intro: "الرياضة جزء من حياتنا اليومية. في هذا الدرس نعرف فوائدها وأشهر الرياضات عندنا.",
          sections: [
            ["فوائد الرياضة", "الرياضة تقوي القلب والعضلات وتزيد نشاط الجسم. تلعب مع الأصدقاء فتعلم التعاون. بعد اللعب نشعر بالسعادة والاسترخاء."],
            ["رياضات يحبها المغاربة", "كرة القدم هي الرياضة الأكثر شعبية. كرة السلة والسباحة وألعاب القوى ممارسة أيضا. المهم أن نختار رياضة نحبها ونمارسها بانتظام."]
          ],
          examples: [
            ["لماذا نلعب كرة القدم؟", ["نقوي أجسامنا.", "نتعاون مع الفريق.", "نستمتع باللعب."], "لأنها تقوي الجسم وتعلم التعاون."],
            ["كيف نبدأ رياضة جديدة؟", ["نختار رياضة مناسبة.", "نتعلم القواعد.", "نتدرب بانتظام."], "نختار رياضة ونتدرب عليها بالتدريج."]
          ],
          questions: [
            ["في درس «الرياضة والصحة»، ما الفائدة المذكورة للرياضة؟", ["تقوي الجسم", "تضعفه", "تغني عن الطعام", "تغني عن النوم"], 0, "الرياضة تقوي العضلات والقلب وتحسن اللياقة."],
            ["أي رياضة مشهورة في المغرب؟", ["كرة القدم", "الغولف فقط", "التنس فقط", "السباحة فقط"], 0, "كرة القدم تحظى بشعبية كبيرة في المغرب."],
            ["في درس «الرياضة والصحة»، ماذا نفعل قبل التمرين؟", ["نتدرب ونحمّي الجسم", "نأكل كثيرا", "ننام", "نركض بلا قواعد"], 0, "الإحماء يهيئ الجسم ويقلل الإصابات."],
            ["ما أثر التعاون في الرياضة؟", ["يقوي الفريق", "يفرق الفريق", "يمنع اللعب", "يقلل النشاط"], 0, "التعاون بين اللاعبين يساعد الفريق على تحقيق أهدافه."]
          ]
        },
        {
          t: "مواطن صالح",
          intro: "المواطن الصالح يحب وطنه ويعمل لخيره. في هذا الدرس نتعرف إلى سلوكات المواطنة.",
          sections: [
            ["احترام القانون والنظام", "يمتثل المواطن للقوانين ويحترم الإشارات في الطريق. يحترم جيرانه ولا يؤذي أحدا. النظام يحمي حقوق الجميع."],
            ["المساهمة في الخير", "ينظف المواطن شارعه ويساعد المحتاج. يحافظ على الممتلكات العامة. مشاركته تجعل الوطن أجمل."]
          ],
          examples: [
            ["كيف نحترم القانون في الطريق؟", ["نمشي في الرصيف.", "ننتظر الإشارة.", "نعبر عند الممر المخصص."], "نتبع إشارات المرور ونعبر من الممر."],
            ["كيف نساعد في الحي؟", ["ننظف أمام البيت.", "نساعد الجار.", "نزرع شجرة."], "نقوم بأعمال خيرية بسيطة في الحي."]
          ],
          questions: [
            ["ما معنى المواطنة؟", ["الانتماء للوطن والالتزام نحوه", "السفر كثيرا", "شراء الأشياء", "اللعب فقط"], 0, "المواطنة تعني الانتماء إلى الوطن والقيام بواجبات تجاهه."],
            ["أي سلوك مواطني؟", ["احترام إشارات المرور", "كسر الإشارة", "رمي النفايات", "إيذاء الجار"], 0, "احترام القوانين من أهم سلوكات المواطنة."],
            ["كيف نحافظ على الممتلكات العامة؟", ["نستخدمها برفق", "نكسرها", "نرسم عليها", "نأخذها للبيت"], 0, "العناية بالممتلكات العامة تحفظ حق الجميع فيها."],
            ["ما دور الفرد في بناء الوطن؟", ["العمل الصالح والالتزام", "الانتظار فقط", "الشكوى دائما", "الهروب"], 0, "كل فرد يسهم بعمله الصالح في بناء وطنه."]
          ]
        }
      ]
    },

    "cur_l_p5_sub_isl": {
      shared: {
        sections: [
          ["الحج والعمرة", "الحج ركن من أركان الإسلام لمن استطاع إليه سبيلا. يتجه الحاج إلى البيت الحرام في مكة. يؤدي الحج مناسك مخصوصة في وقت معلوم."],
          ["الأخلاق الإسلامية", "الأخلاق الحسنة من الإيمان. الصدق والأمانة والحياء من أهم الأخلاق. المسلم يتعامل مع الناس باللطف والعدل."],
          ["التعاون والتكافل", "التعاون من صفات المؤمنين. نتعاون في الخير ولا نتعاون في الإثم. الصدقة والمساعدة تنشر المحبة بين الناس."],
          ["التاريخ الإسلامي", "التاريخ الإسلامي غني بالدروس والعبر. نقرأ سيرة النبي ﷺ لنقتدي به. الصحابة ضربوا أمثلة في الصبر والشجاعة."]
        ],
        vocab: [
          ["الحج", "السفر إلى مكة لأداء مناسك الحج في وقت معلوم"],
          ["المناسك", "الأعمال التي يؤديها الحاج في الحج"],
          ["الأمانة", "حفظ الحقوق وأداء ما أؤمن عليه"],
          ["التكافل", "تعاون أفراد المجتمع فيما بينهم"],
          ["السيرة", "حياة النبي ﷺ وأعماله"],
          ["العدل", "إعطاء كل ذي حق حقه"]
        ],
        outcomes: [
          "يذكر أركان الحج باختصار.",
          "يميز بين خلق حسن وخلق سيئ في موقف.",
          "يشرح فائدة التعاون في المجتمع.",
          "يستخلص عبرة من سيرة النبي ﷺ."
        ],
        diagram: "diagram-prayer.svg"
      },
      lessons: [
        {
          t: "مناسك الحج",
          intro: "الحج رحلة إيمانية إلى البيت الحرام. في هذا الدرس نتعرف إلى أهم مناسكه وترتيبها.",
          sections: [
            ["الإحرام والطواف", "يبدأ الحاج بالإحرام عند الميقات، فيلبس ثيابا مخصوصة. ثم يطوف حول الكعبة سبعة أشواط. الطواف تعبير عن توحيد الله وتعظيم بيته."],
            ["الوقوف والرمي", "يقف الحاج بعرفة في اليوم المعروف، وهو ركن أساسي. ثم يرمي الجمرات ويحلق شعره. يجدد الحاج عهده مع الله في هذه المواقف."]
          ],
          examples: [
            ["رتّب بداية الحج", ["يصل الحاج إلى الميقات.", "يلبس الإحرام.", "يذهب إلى مكة للطواف."], "يبدأ الحج بالإحرام ثم الطواف."],
            ["ما أهم يوم في الحج؟", ["يوم عرفة.", "يقف فيه الحاج.", "يدعو فيه كثيرا."], "يوم عرفة من أعظم أيام الحج."]
          ],
          questions: [
            ["أين يبدأ الحاج إحرامه؟", ["الميقات", "السوق", "المنزل", "المدرسة"], 0, "الميقات هو المكان الذي يبدأ منه الحاج إحرامه."],
            ["كم شوطا في الطواف؟", ["سبعة", "ثلاثة", "خمسة", "عشرة"], 0, "الطواف حول الكعبة سبعة أشواط كما ورد في السنة."],
            ["ما الركن الأساسي في الحج؟", ["الوقوف بعرفة", "شراء الهدايا", "زيارة السوق", "ركوب السيارة"], 0, "الوقوف بعرفة ركن لا يصح الحج بدونه."],
            ["ماذا يفعل الحاج بعد الرمي؟", ["يحلق شعره", "يغلق الطواف", "يعود للميقات", "يبدأ الإحرام"], 0, "حلق الشعر أو تقصيره من أعمال الحج بعد الرمي."]
          ]
        },
        {
          t: "الأخلاق الحسنة",
          intro: "الأخلاق الحسنة تزين المسلم وتقربه من الله. في هذا الدرس نميّز بين الخلق الحسن والخلق السيئ.",
          sections: [
            ["الصدق والأمانة", "الصدق قول الحق في القول والفعل. الأمانة أداء الحقوق كما هي. المسلم الصادق يثق به الناس ويحبونه."],
            ["الحياء والعدل", "الحياء يمنع المسلم من القبيح. العدل يعني إعطاء كل ذي حقه. هذه الأخلاق تجعل المجتمع آمنا ومحببا."]
          ],
          examples: [
            ["وجدت مالا في السوق", ["تنظر إلى المال.", "تبحث عن صاحبه.", "تردّه إليه."], "ترد المال لصاحبه، وهذا من الأمانة."],
            ["سألك صديق عن رأيك", ["تقول الحق بلطف.", "لا تكذب.", "تختار كلمة مناسبة."], "تقول الحق مع الأدب، وهذا من الصدق."]
          ],
          questions: [
            ["ما الأمانة؟", ["أداء الحقوق كما هي", "أخذ مال الغير", "قول الكذب", "نسيان الوعد"], 0, "الأمانة حفظ الحقوق وأداؤها كما يجب."],
            ["أي خلق حسن؟", ["الصدق", "الكذب", "الغدر", "الظلم"], 0, "الصدق من أفضل الأخلاق التي أمر بها الإسلام."],
            ["ما معنى العدل؟", ["إعطاء كل ذي حق حقه", "أخذ حق الغير", "ظلم الناس", "نسيان الحقوق"], 0, "العدل هو إيصال الحق إلى صاحبه دون ظلم."],
            ["لماذا نتحلى بالأخلاق؟", ["لأنها من الإيمان", "لأنها سهلة فقط", "لأننا نحب اللعب", "لأن الوقت قصير"], 0, "حسن الخلق من كمال الإيمان كما بيّن النبي ﷺ."]
          ]
        },
        {
          t: "نتعاون في الخير",
          intro: "المسلم يعمل مع إخوانه في الخير. في هذا الدرس نعرف كيف يظهر التعاون في حياتنا.",
          sections: [
            ["التكافل في الأسرة", "يتعاون أفراد الأسرة في تنظيم البيت ورعاية الصغار وكبار السن. كل واحد يقوم بدوره. الأسرة المتعاونة تعيش في سكينة."],
            ["التعاون في المجتمع", "نتعاون مع الجيران والمسلمين في الأعمال النافعة. الصدقة وإطعام المحتاج من صور التكافل. التعاون في الإثم حرام، والتعاون في الخير مطلوب."]
          ],
          examples: [
            ["جارك مريض", ["تسأل عن حاله.", "تحضر له دواء أو طعاما.", "تخبر أهلك ليساعدوه."], "نساعد جارنا المريض بالطعام والزيارة."],
            ["المسجد يحتاج تنظيفا", ["تشارك في التنظيف.", "تجمع الأصدقاء.", "تحترم المكان."], "نتعاون لتنظيف المسجد."]
          ],
          questions: [
            ["أي تعاون مطلوب؟", ["التعاون في الخير", "التعاون في الإثم", "التعاون في الكذب", "التعاون في الظلم"], 0, "الإسلام يأمر بالتعاون على البر والتقوى وينهى عن التعاون على الإثم."],
            ["ما صورة التكافل؟", ["إطعام المحتاج", "نسيان الجار", "كسر الأشياء", "الخصام"], 0, "إطعام المحتاج والتصدق عليه من صور التكافل الاجتماعي."],
            ["كيف يتعاون أفراد الأسرة؟", ["كل يقوم بدوره", "واحد يعمل وحده", "لا أحد يعمل", "الخصام المستمر"], 0, "توزيع الأعمال بين أفراد الأسرة يحقق التعاون."],
            ["ما أثر الصدقة؟", ["تنشر المحبة", "تفرق الناس", "تقلل المال دائما", "تغني عن العمل"], 0, "الصدقة تطهر المال وتنشر المحبة بين الناس."]
          ]
        },
        {
          t: "دروس من التاريخ الإسلامي",
          intro: "التاريخ الإسلامي مليء بالدروس. في هذا الدرس نقرأ مواقف من السيرة ونستخلص منها عبرا.",
          sections: [
            ["سيرة النبي ﷺ", "ولد النبي ﷺ في مكة ودعا إلى الإسلام بالحكمة. عانى مع قومه كثيرا وصبر على الأذى. كان رحيما حتى مع من خالفه."],
            ["موقف من حياة الصحابة", "الصحابة رضي الله عنهم ضحوا بأموالهم وأنفسهم لنصر الدين. أبو بكر الصديق كان أول من صدّق النبي ﷺ. منهم نتعلم الشجاعة والوفاء."]
          ],
          examples: [
            ["ماذا نتعلم من صبر النبي ﷺ؟", ["نقرأ ما لاقاه في مكة.", "نلاحظ صبره.", "نقول: نتعلم الصبر."], "نتعلم أن الصبر على الأذى من صفات المؤمن."],
            ["كيف نقتدي بأبي بكر؟", ["نعرف أنه صدّق النبي ﷺ.", "نلاحظ كرمه.", "نكون صادقين مثله."], "نقتدي به في الصدق والكرم."]
          ],
          questions: [
            ["أين ولد النبي ﷺ؟", ["في مكة", "في المدينة", "في القدس", "في مصر"], 0, "ولد النبي ﷺ في مدينة مكة المكرمة."],
            ["كيف كان النبي ﷺ مع الناس؟", ["رحيم وحكيم", "قاسٍ", "غاضب دائما", "بعيد عنهم"], 0, "النبي ﷺ كان رحيما وحكيما في دعوته ومعاملته."],
            ["من أول من صدّق النبي ﷺ؟", ["أبو بكر الصديق", "عمر بن الخطاب", "علي بن أبي طالب", "عثمان بن عفان"], 0, "أبو بكر الصديق رضي الله عنه كان أول من آمن بالنبي ﷺ."],
            ["ما العبرة من سيرة الصحابة؟", ["الشجاعة والوفاء", "الهروب", "الكسل", "النسيان"], 0, "الصحابة قدوة في الشجاعة والوفاء والتضحية."]
          ]
        }
      ]
    },

    "cur_l_p6_sub_en": {
      shared: {
        sections: [
          ["Everyday conversations", "In English, daily conversations follow a simple pattern: a greeting, a question and an answer. We use short phrases such as 'How are you?' and 'I am fine, thanks'. Polite words make conversation pleasant."],
          ["Writing messages", "A short message has a greeting, a main idea and a closing. We write clearly and use complete sentences. We check spelling before we finish."],
          ["Question words", "Question words such as who, what, where, when and why help us ask for information. Each word asks about a different detail. The answer should match the question."],
          ["Speaking with a partner", "When we speak with a partner, we take turns and listen carefully. We ask follow-up questions to keep the conversation going. Practice builds confidence."]
        ],
        vocab: [
          ["conversation", "a talk between two or more people"],
          ["message", "a short piece of writing sent to someone"],
          ["question word", "a word such as who or where that starts a question"],
          ["reply", "an answer to something said or written"],
          ["polite", "showing good manners toward others"],
          ["turn", "a chance to speak one after another"]
        ],
        outcomes: [
          "Take part in a short daily conversation in English.",
          "Write a clear short message with a greeting and closing.",
          "Use question words correctly to ask for information.",
          "Ask and answer in a pair dialogue with clear pronunciation."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "Daily conversations",
          intro: "We speak with people every day. In this lesson we practise the simple pattern of an English conversation.",
          sections: [
            ["Greeting and responding", "A conversation often starts with 'Hello' or 'Good morning'. We answer with 'I am fine, thank you' or 'Not bad'. We add a question such as 'And you?' to continue."],
            ["Keeping it polite", "We use 'please' when we ask and 'thank you' when someone helps. We listen while the other person speaks. Politeness makes others feel respected."]
          ],
          examples: [
            ["Start a conversation with a classmate", ["You say 'Hello, Sara'.", "You ask 'How are you?'.", "You answer 'I am fine, thanks'."], "Hello, Sara. How are you? I am fine, thanks."],
            ["Ask for a pencil politely", ["You say 'Excuse me'.", "You say 'Can I use your pencil, please?'.", "You say 'Thank you'."], "Excuse me, can I use your pencil, please? Thank you."]
          ],
          questions: [
            ["How do we start a conversation?", ["With a greeting", "With a question mark", "With a number", "With a closing"], 0, "A greeting such as 'hello' opens the conversation politely."],
            ["Which reply is polite?", ["I am fine, thank you", "I am not telling you", "Go away", "Nothing"], 0, "A polite reply answers kindly and thanks the speaker."],
            ["What does 'please' do?", ["It makes a request polite", "It ends a conversation", "It asks the time", "It names a person"], 0, "'Please' shows good manners when we ask for something."],
            ["Why should we listen?", ["To answer appropriately", "To speak louder", "To stop the talk", "To change the topic"], 0, "Listening helps us give a relevant answer and shows respect."]
          ]
        },
        {
          t: "Writing a short email",
          intro: "Messages let us share news with people far away. We will write a short email with a clear structure.",
          sections: [
            ["The parts of a message", "We begin with 'Dear ...' and end with 'Best wishes'. The middle part gives the news or the request. Each part has a clear job."],
            ["Writing clearly", "We use short sentences and check the spelling of key words. We read the message again before sending. Clear writing helps the reader understand quickly."]
          ],
          examples: [
            ["Write to a friend about your day", ["You write 'Dear Karim'.", "You say 'I played football after school'.", "You close with 'Best wishes'."], "Dear Karim, I played football after school. Best wishes, Amal."],
            ["Write a request to a teacher", ["You greet the teacher.", "You ask about the homework.", "You thank the teacher."], "Dear teacher, can you explain the homework? Thank you."]
          ],
          questions: [
            ["How does a message begin?", ["With a greeting", "With the closing", "With the date only", "With a question"], 0, "A message starts with a greeting such as 'Dear Sara'."],
            ["Where do we put the news?", ["In the middle", "In the greeting", "In the closing", "In the address"], 0, "The middle part carries the main idea or news."],
            ["Why check spelling?", ["To make the message clear", "To make it longer", "To change the topic", "To add pictures"], 0, "Correct spelling helps the reader understand our message."],
            ["Which is a closing?", ["Best wishes", "Dear Ali", "How are you", "Thank you for"], 0, "'Best wishes' is a common way to end a friendly message."]
          ]
        },
        {
          t: "Question words and answers",
          intro: "Questions help us learn new information. In this lesson we match each question word with the right kind of answer.",
          sections: [
            ["Who, what and where", "'Who' asks about a person, 'what' asks about a thing, and 'where' asks about a place. We choose the word that fits the answer we want. Each question needs a matching reply."],
            ["When and why", "'When' asks about time and 'why' asks about a reason. We answer 'when' with a time expression and 'why' with 'because'. Matching the word to the answer makes sense."]
          ],
          examples: [
            ["Ask about a place", ["You want to know the location.", "You choose 'where'.", "You write 'Where is the library?'."], "Where is the library?"],
            ["Ask about a reason", ["You want to know why.", "You choose 'why'.", "You write 'Why are you late?'."], "Why are you late?"]
          ],
          questions: [
            ["Which word asks about a person?", ["Who", "Where", "When", "Why"], 0, "'Who' is used to ask for the name or identity of a person."],
            ["Which answer fits 'Where?'", ["In the park", "Yesterday", "Because I was ill", "My friend"], 0, "'Where' asks about a place, so the answer must name a place."],
            ["Which word asks about time?", ["When", "What", "Who", "How many"], 0, "'When' asks about the time something happens."],
            ["How do we answer 'Why?'", ["With 'because'", "With a colour", "With a number", "With a greeting"], 0, "'Why' asks for a reason, which we give using 'because'."]
          ]
        },
        {
          t: "Pair dialogue practice",
          intro: "Speaking practice helps us use English with confidence. In this lesson we work in pairs and take turns.",
          sections: [
            ["Taking turns", "One student asks and the other answers, then they change roles. We wait for the partner to finish before speaking. Taking turns makes the dialogue fair and clear."],
            ["Keeping the dialogue going", "We add a follow-up question such as 'What about you?'. We use short answers and a friendly tone. Mistakes are part of learning, so we keep trying."]
          ],
          examples: [
            ["Ask about favourite food", ["You ask 'What is your favourite food?'.", "Your partner answers.", "You say 'Me too!'."], "What is your favourite food? I like couscous. Me too!"],
            ["Ask about a weekend", ["You ask 'Where did you go?'.", "Your partner answers.", "You reply 'That sounds nice'."], "Where did you go? I went to the park. That sounds nice."]
          ],
          questions: [
            ["What does taking turns mean?", ["Speaking one after another", "Speaking all at once", "Not speaking at all", "Only asking questions"], 0, "Taking turns means each person has a chance to speak."],
            ["How do we continue a dialogue?", ["Ask a follow-up question", "Stop immediately", "Look away", "Repeat the same word"], 0, "A follow-up question keeps the conversation active."],
            ["How should we treat mistakes?", ["As part of learning", "As a reason to stop", "As a joke about others", "As something to hide"], 0, "Mistakes help us improve, so we keep practising kindly."],
            ["Why speak clearly?", ["So the partner understands", "To finish faster", "To avoid listening", "To change the question"], 0, "Clear speech helps the listener follow our meaning."]
          ]
        }
      ]
    },

    "cur_l_p6_sub_sport": {
      shared: {
        sections: [
          ["الحركات الأساسية", "الحركات الأساسية مثل الجري والقفز والرمي تقوي الجسم. كل حركة تنشّط مجموعة من العضلات. التكرار المنتظم يحسن المهارة."],
          ["الألعاب الرياضية", "الألعاب الرياضية مثل كرة القدم وكرة السلة تنمي المهارات. تحتاج الجماعة إلى قواعد واضحة. اللعب يعلمنا الانضباط واحترام الخصم."],
          ["التعاون في الفريق", "العمل الجماعي أساس كثير من الرياضات. يمرر اللاعب الكرة إلى زميله ليحقق الفريق هدفه. الثقة بين أفراد الفريق تزيد فرص النجاح."],
          ["الصحة والرياضة", "الرياضة تقوي القلب والعضلات وتحافظ على الصحة. الإحماء قبل اللعب يقي من الإصابات. شرب الماء بعد التمرين يساعد الجسم على التعافي."]
        ],
        vocab: [
          ["الإحماء", "تمارين خفيفة قبل النشاط الرياضي لتجهيز الجسم"],
          ["العضلة", "جزء من الجسم يتحرك وينقبض لينتج الحركة"],
          ["الفريق", "مجموعة لاعبين يتعاونون لتحقيق هدف"],
          ["القاعدة", "تعليمات تنظم سير اللعب"],
          ["اللياقة", "قدرة الجسم على أداء النشاط بقوة ونشاط"],
          ["التعافي", "عودة الجسم إلى حالته الطبيعية بعد المجهود"]
        ],
        outcomes: [
          "يؤدي حركات أساسية بطريقة صحيحة.",
          "يشرح قواعد لعبة جماعية بسيطة.",
          "يمثل دورا تعاونيا داخل فريق.",
          "يذكر عادات صحية ترافق النشاط الرياضي."
        ],
        diagram: "diagram-body.svg"
      },
      lessons: [
        {
          t: "حركات الجري والقفز",
          intro: "الجري والقفز من أبسط الحركات الرياضية. في هذا الدرس نتعلم أداءهما بطريقة صحيحة وآمنة.",
          sections: [
            ["الجري السليم", "نقف معتدلين ونحرّك الذراعين بالتناسب مع الخطوات. ننظر إلى الأمام ونتنفس بانتظام. نبدأ بسرعة معتدلة ثم نزيد بالتدريج."],
            ["القفز بأمان", "نثني الركبتين قليلا قبل القفز وندفع بالقدمين معا. نهبط على قدمينا برفق وثني الركبتين. نتجنب القفز على أرض صلبة أو مبللة."]
          ],
          examples: [
            ["كيف نستعد للجري؟", ["نلبس حذاء مناسبا.", "نحمّي الساقين بحركات خفيفة.", "نبدأ بجري هادئ."], "نرتدي الحذاء ونحمّي الجسم ثم نجري بالتدريج."],
            ["كيف نهبط بعد القفز؟", ["نصل إلى الأرض بالقدمين.", "نثني الركبتين.", "نحافظ على التوازن."], "نهبط برفق مع ثني الركبتين."]
          ],
          questions: [
            ["ماذا نفعل قبل الجري؟", ["نحمّي الجسم", "نشرب ماء باردا", "نركض بسرعة فائقة", "ننام"], 0, "الإحماء يهيئ العضلات ويقلل احتمال الإصابة."],
            ["كيف نهبط بعد القفز؟", ["برفق مع ثني الركبتين", "بقوة على رجل واحدة", "على الظهر", "بلا نظر"], 0, "ثني الركبتين عند الهبوط يمتص الصدمة ويحمي المفاصل."],
            ["أي حركة تنشّط الساقين؟", ["الجري", "قراءة الكتاب", "الرسم", "النوم"], 0, "الجري يستخدم عضلات الساقين ويقويها."],
            ["لماذا ننظر إلى الأمام أثناء الجري؟", ["للحفاظ على التوازن والأمان", "للنوم", "لرؤية السماء", "لتغيير الاتجاه دائما"], 0, "النظر للأمام يساعد على التوازن وتجنب العوائق."]
          ]
        },
        {
          t: "قواعد الألعاب الجماعية",
          intro: "كل لعبة جماعية تحتاج إلى قواعد. في هذا الدرس نتعرف إلى قواعد كرة القدم وكرة السلة.",
          sections: [
            ["قواعد كرة القدم", "يلعب فريقان، ولكل فريق حارس مرمى. لا يجوز لمس الكرة باليد إلا للحارس. الهدف هو إدخال الكرة في مرمى الفريق الآخر."],
            ["قواعد كرة السلة", "يمرر اللاعبون الكرة بأيديهم ويسجلون بتسديدها في السلة. لا يجوز الجري بالكرة دون مراوغة أو تمرير. الحكم يراقب الالتزام بالقواعد."]
          ],
          examples: [
            ["كيف نبدأ مباراة كرة القدم؟", ["نقسم اللاعبين فريقين.", "نحدد الحارس لكل فريق.", "نبدأ باللعب حسب القواعد."], "نبدأ بتقسيم الفرق وتحديد الحراس."],
            ["ماذا يفعل الحكم؟", ["يراقب اللعب.", "يطبق القواعد.", "يعلن عن المخالفات."], "الحكم يضمن احترام القواعد."]
          ],
          questions: [
            ["كم فريقا في مباراة كرة القدم؟", ["فريقان", "فريق واحد", "ثلاثة فرق", "أربعة فرق"], 0, "كرة القدم تلعب بين فريقين متنافسين."],
            ["من يلمس الكرة بيده في كرة القدم؟", ["حارس المرمى", "كل اللاعبين", "المشاهدون", "لا أحد"], 0, "حارس المرمى هو الوحيد المسموح له بمسك الكرة داخل منطقته."],
            ["كيف نسجل في كرة السلة؟", ["بتسديد الكرة في السلة", "برميها خارج الملعب", "بلمس الشبكة باليد", "بالجري فقط"], 0, "التسديد في السلة هو طريقة تسجيل النقاط."],
            ["لماذا نحتاج إلى القواعد؟", ["لتنظيم اللعب بعدل", "لإطالة الوقت", "لمنع التسجيل", "للفوضى"], 0, "القواعد تجعل اللعب منظما وعادلا للجميع."]
          ]
        },
        {
          t: "العمل بروح الفريق",
          intro: "أكثر الرياضات تعتمد على العمل الجماعي. في هذا الدرس نتعلم كيف يكون اللاعب عضوا نافعا في فريقه.",
          sections: [
            ["أدوار داخل الفريق", "لكل لاعب دور: حارس أو مدافع أو مهاجم. يعرف اللاعب دوره ويقوم به بجد. تنظيم الأدوار يغطي نقاط القوة والضعف."],
            ["الثقة والدعم", "نشجع زميلنا إذا أخطأ ولا نوبخه. نمرر الكرة إلى الزميل في وضع أفضل. الثقة المتبادلة ترفع مستوى الفريق."]
          ],
          examples: [
            ["زميلك أضاع الكرة", ["لا تغضب منه.", "قل له: لا بأس.", "ساعده في الدفاع."], "ندعم الزميل ونستمر في اللعب."],
            ["متى نمرر الكرة؟", ["عندما يكون الزميل أقرب للهدف.", "عندما نكون محاصرين.", "عندما نرى فرصة أفضل."], "نمرر الكرة عند وجود فرصة أفضل للفريق."]
          ],
          questions: [
            ["ما فائدة توزيع الأدوار؟", ["تغطية نقاط القوة والضعف", "زيادة الفوضى", "تقليل اللاعبين", "منع التمرير"], 0, "توزيع الأدوار يساعد كل لاعب على تقديم أفضل ما لديه."],
            ["كيف نتعامل مع خطأ زميلنا؟", ["ندعمه ونشجعه", "نوبخه", "نتركه", "نضحك عليه"], 0, "الدعم يحافظ على ثقة اللاعب ومعنويات الفريق."],
            ["متى نمرر الكرة؟", ["عندما يكون التمرير أفضل للفريق", "دائما دون نظر", "عند نهاية المباراة فقط", "عندما نكون وحدنا"], 0, "التمرير الجيد يخدم هدف الفريق لا اللاعب وحده."],
            ["ما أثر الثقة في الفريق؟", ["ترفع مستوى الأداء", "تضعفه", "توقف اللعب", "تسبب الخصام"], 0, "الثقة تجعل اللاعبين يتعاونون باطمئنان."]
          ]
        },
        {
          t: "الرياضة والصحة",
          intro: "الرياضة تحافظ على صحة الجسم والعقل. في هذا الدرس نتعرف إلى العادات الصحية المرافقة للنشاط الرياضي.",
          sections: [
            ["قبل وأثناء اللعب", "نأكل وجبة خفيفة قبل التمرين بوقت كاف. نشرب الماء على دفعات صغيرة أثناء اللعب. نرتدي ملابس مريحة وحذاء مناسبا."],
            ["بعد اللعب", "نهدّئ الجسم بحركات خفيفة ثم نأخذ قسطا من الراحة. نغسل اليدين والوجه ونشرب الماء. النوم الجيد يساعد الجسم على التعافي."]
          ],
          examples: [
            ["ماذا نشرب أثناء المباراة؟", ["ماء بكميات صغيرة.", "مشروبا غازيا كثيرا.", "ماء باردا جدا دفعة واحدة."], "نشرب الماء على دفعات صغيرة."],
            ["كيف ننهي التمرين؟", ["حركات تهدئة خفيفة.", "راحة قصيرة.", "شرب الماء."], "نختم بحركات خفيفة ثم نرتاح."]
          ],
          questions: [
            ["ماذا نفعل قبل التمرين؟", ["نأكل وجبة خفيفة ونحمّي", "نركض بلا إحماء", "نشرب مشروبات غازية", "ننام بعد الأكل مباشرة"], 0, "الوجبة الخفيفة والإحماء يهيئان الجسم للنشاط."],
            ["كيف نشرب أثناء اللعب؟", ["على دفعات صغيرة", "دفعة واحدة كبيرة", "لا نشرب أبدا", "بعد المباراة فقط"], 0, "شرب الماء على دفعات يحافظ على راحة الجسم."],
            ["ما فائدة حركات التهدئة؟", ["إعادة الجسم إلى حالته تدريجيا", "زيادة الإصابات", "إيقاف التنفس", "تغيير القواعد"], 0, "التهدئة التدريجية تساعد العضلات والقلب على التعافي."],
            ["أي عادة صحية بعد اللعب؟", ["غسل اليدين والوجه", "نسيان شرب الماء", "الجلوس في الشمس طويلا", "خلع الحذاء فورا والجري"], 0, "النظافة بعد اللعب تحمي الجسم من الجراثيم."]
          ]
        }
      ]
    }
  }
}
