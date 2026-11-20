module.exports = {
  units: {
    'cur5': {
      shared: {
        sections: [
          ['الحرف والصوت', 'لكل حرف في العربية شكل وصوت خاص. ننطق الحرف ونكرره حتى نسمع صوته بوضوح. ثم نبحث عنه في الكلمات التي نعرفها.'],
          ['من الكلمة إلى الجملة', 'الكلمة تتكوّن من حروف مرتّبة، مثل كلمة باب. إذا ضممنا كلمات عدّة صارت جملة. نقرأ الكلمة ثم نقرأ الجملة بترتيب.'],
          ['أشياء حولي', 'نرى في بيتنا ومدرستنا أشياء كثيرة مثل الشمس والماء والشجرة. نسمّي كل شيء باسمه وننطق اسمه ببطء.'],
          ['الأسرة والمدرسة', 'الأسرة هي الأم والأب والإخوة. في المدرسة نجد المعلّم والزملاء. نستخدم هذه الكلمات في جمل قصيرة.']
        ],
        vocab: [
          ['حرف', 'أصغر وحدة ننطقها ونكتبها مثل أ وب وت'],
          ['كلمة', 'حروف مرتّبة لها معنى مثل باب وماء'],
          ['جملة', 'كلمات مرتّبة تفيد معنى كاملا'],
          ['الشمس', 'ما نراه مشرقا في النهار'],
          ['المدرسة', 'المكان الذي نتعلّم فيه ونلعب مع الزملاء'],
          ['الأسرة', 'الأم والأب والأبناء الذين يعيشون معا']
        ],
        outcomes: [
          'أن ينطق الطفل الحروف أ وب وت نطقا صحيحا',
          'أن يكوّن الطفل كلمات بسيطة من صور مألوفة',
          'أن يقرأ الطفل جملة قصيرة من ثلاث كلمات',
          'أن يستخدم الطفل كلمات الأسرة والمدرسة في كلامه'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'الحروف أ وب وت',
          intro: 'نتعلّم اليوم ثلاثة حروف أولى: أ وب وت. ننظر إلى شكلها وننطق صوتها مع المعلّم.',
          sections: [
            ['شكل الحرف أ', 'الحرف أ يبدأ به كثير من الكلمات مثل «أم» و«أخ». نرسمه في الهواء ثم نكتبه على الورق. ننطق «أ» بفم مفتوح.'],
            ['صوتا ب وت', 'الحرف ب ننطقه بشفتينا مثل «باب». والحرف ت ننطقه بطرف لساننا مثل «تفاحة». نكرّر الصوتين حتى نفرّق بينهما.']
          ],
          examples: [
            ['اكتب الحرف الأول من كلمة «أم»', ['ننظر إلى كلمة أم', 'نسمع الصوت في أولها', 'نكتب الحرف أ'], 'أ'],
            ['اختر الحرف الذي يبدأ به اسم «باب»', ['نلفظ كلمة باب ببطء', 'نسمع صوت الشفتين في البداية', 'نكتب الحرف ب'], 'ب']
          ],
          questions: [
            ['ما الحرف الذي يبدأ به اسم «تفاحة»؟', ['ت', 'ب', 'أ', 'م'], 0, 'لأننا ننطق «ت» قبل بقية حروف كلمة تفاحة.'],
            ['أي كلمة تبدأ بالحرف أ؟', ['أخ', 'باب', 'توت', 'ماء'], 0, 'لأن كلمة أخ تبدأ بصوت «أ»، أما بقية الكلمات فتبدأ بحروف أخرى.'],
            ['كيف ننطق الحرف ب؟', ['بشفتينا معا', 'بطرف اللسان', 'بإغلاق العينين', 'بالأنف فقط'], 0, 'لأن صوت «ب» يخرج من ضم الشفتين ثم فتحهما.'],
            ['ما الفرق بين «ب» و«ت»؟', ['لكل واحد صوت مختلف', 'كلاهما نفس الصوت', 'كلاهما حرف واحد', 'لا فرق بينهما'], 0, 'لأن «ب» صوته من الشفتين و«ت» صوته من طرف اللسان.']
          ]
        },
        {
          t: 'كلمات من صور الأشياء',
          intro: 'ننظر إلى صور أشياء نعرفها، ثم نكوّن كلماتها من الحروف. نقرأ الكلمة ببطء ونفهم معناها.',
          sections: [
            ['من الصورة إلى الكلمة', 'إذا رأينا صورة باب قلنا «باب». نكتب الحروف ب ا ب بالترتيب. الصورة تساعدنا على تذكّر المعنى.'],
            ['كلمات الماء والشمس', 'كلمة «ماء» تتكوّن من ثلاثة حروف، وكلمة «شمس» من أربعة. نقرأ كل كلمة مرتين حتى نحفظ شكلها.']
          ],
          examples: [
            ['كوّن كلمة من صورة شمس', ['ننظر إلى الصورة ونقول شمس', 'نكتب الحروف ش م س', 'نقرأ الكلمة شمس'], 'شمس'],
            ['رتّب الحروف ب ا ب إلى كلمة', ['نقرأ الحروف ب ا ب', 'نضمّها بالترتيب', 'نحصل على «باب»'], 'باب']
          ],
          questions: [
            ['أي كلمة تعني ما نشربه؟', ['ماء', 'باب', 'شمس', 'قط'], 0, 'لأن الماء هو الشراب الذي نحتاجه كل يوم.'],
            ['كم حرفا في كلمة «شمس»؟', ['أربعة', 'ثلاثة', 'اثنان', 'خمسة'], 0, 'لأن كلمة شمس تتكوّن من ش وم وس، أي أربعة حروف.'],
            ['ما الكلمة التي تبدأ بحرف «ب»؟', ['باب', 'شمس', 'ماء', 'أم'], 0, 'لأن أول حرف في باب هو «ب»، بينما تبدأ الكلمات الأخرى بحروف مختلفة.'],
            ['لماذا ننظر إلى الصورة قبل كتابة الكلمة؟', ['لنتذكّر معناها', 'لنعدّ الحروف فقط', 'لأن الصورة مكتوبة', 'لأنها أجمل'], 0, 'لأن الصورة تذكّرنا بالشيء نفسه فنختار الكلمة الصحيحة.']
          ]
        },
        {
          t: 'جمل قصيرة عن الأسرة',
          intro: 'نضمّ كلمات مألوفة في جمل قصيرة. نقرأ الجملة بوضوح ونفهم من قائلها وماذا فعل.',
          sections: [
            ['الجملة من كلمات', 'الجملة مثل «أمي في البيت» تتكوّن من ثلاث كلمات. كل كلمة لها دور، ومجموعها يعطي معنى كاملا.'],
            ['جمل عن المدرسة', 'نقول «أذهب إلى المدرسة». هذه الجملة تخبرنا أين نذهب. نقرأها بصوت هادئ وواضح.']
          ],
          examples: [
            ['اقرأ الجملة: أمي في البيت', ['نقرأ أمي', 'نقرأ في البيت', 'نفهم أن أمي موجودة في البيت'], 'أمي في البيت'],
            ['كوّن جملة من: أبي / المدرسة / في', ['نبدأ بـ«أبي»', 'نضيف «في المدرسة»', 'نحصل على «أبي في المدرسة»'], 'أبي في المدرسة']
          ],
          questions: [
            ['ما المعنى في جملة «أمي في البيت»؟', ['أمي موجودة في البيت', 'أمي في المدرسة', 'البيت بعيد', 'أمي تقرأ'], 0, 'لأن عبارة «في البيت» تخبرنا عن مكان أمي.'],
            ['أي جزء في الجملة يدل على المكان؟', ['في البيت', 'أمي', 'الجملة كلها', 'لا شيء'], 0, 'لأن «في» تسبق المكان وتدل على حيث يوجد الشيء.'],
            ['رتّب الكلمات: أذهب / إلى / المدرسة', ['أذهب إلى المدرسة', 'المدرسة إلى أذهب', 'إلى أذهب المدرسة', 'أذهب المدرسة إلى'], 0, 'لأن الفعل يأتي أولا ثم نذكر المكان بعد «إلى».'],
            ['لماذا نقرأ الجملة ببطء؟', ['لنفهم معناها', 'لأنها قصيرة جدا', 'لأننا نخاف', 'لننساها'], 0, 'لأن القراءة الهادئة تساعدنا على تمييز الكلمات وفهم الجملة.']
          ]
        },
        {
          t: 'أتحقق من تعلّمي',
          intro: 'هذه مراجعة لطيفة لما تعلّمناه. نقرأ ونختار الإجابة التي نراها صحيحة، ثم نشرح سبب اختيارنا.',
          sections: [
            ['أقرأ وأختار', 'نقرأ السؤال مرتين قبل الاختيار. ثم نستبعد الإجابات التي لا تناسب المعنى. المهم أن نعرف لماذا اخترنا.'],
            ['أصحّح لنفسي', 'إذا أخطأنا نعود إلى الحرف أو الكلمة ونقرأها مرة أخرى. الخطأ فرصة للتعلّم، وليس نهاية الدرس.']
          ],
          examples: [
            ['اختر الكلمة الصحيحة: «... في السماء نهارا»', ['نقرأ الجملة', 'نفكر في الشيء المضيء نهارا', 'نختار «الشمس»'], 'الشمس'],
            ['حدّد الحرف الأول من «مدرسة»', ['نلفظ مدرسة', 'نسمع أول صوت', 'نكتب «م»'], 'م']
          ],
          questions: [
            ['أيّها حرف صحيح من الحروف التي تعلّمناها؟', ['ت', 'ـ', '؟', '!'], 0, 'لأن «ت» حرف هجائي، أما البقية فليست حروفا.'],
            ['أي كلمة تدل على مكان نتعلّم فيه؟', ['المدرسة', 'الشمس', 'الماء', 'الباب'], 0, 'لأننا نذهب إلى المدرسة للتعلّم واللعب مع الزملاء.'],
            ['ما الترتيب الصحيح لحروف «باب»؟', ['ب ا ب', 'ا ب ب', 'ب ب ا', 'ا ا ب'], 0, 'لأن كلمة باب تبدأ بـ«ب» ثم «ألف» ثم «ب».'],
            ['كيف نتصرّف بعد خطأ في القراءة؟', ['نعيد القراءة بهدوء', 'نتوقف عن التعلّم', 'نضحك على الخطأ', 'نغيّر الكتاب'], 0, 'لأن إعادة القراءة تساعدنا على تصحيح الخطأ وفهم النص.']
          ]
        }
      ]
    },
    'cur13': {
      shared: {
        sections: [
          ['Words Around Me', 'We learn new words by looking at things in our classroom and home. We say each word slowly and listen to its sound. Repeating helps us remember.'],
          ['Colours and Shapes', 'Many things have a colour and a shape. A ball is round and can be red or blue. We name the colour and the shape when we talk.'],
          ['My Family', 'My family includes my mother, father, brothers and sisters. We use short sentences to talk about them. Each person has a name and a role.'],
          ['Reading and Saying', 'We read simple sentences and say them aloud. We look at the first letter of each word. Saying words helps us learn them faster.']
        ],
        vocab: [
          ['word', 'a group of letters that has a meaning, like book'],
          ['colour', 'red, blue, green or yellow'],
          ['family', 'the people who live with us, like mother and father'],
          ['school', 'the place where we learn and play with friends'],
          ['sentence', 'a group of words that gives a complete idea'],
          ['shape', 'the form of a thing, like a circle or a square']
        ],
        outcomes: [
          'Learners name common classroom objects in English',
          'Learners identify and say at least four colours',
          'Learners use simple sentences to talk about family members',
          'Learners read short sentences with correct word order'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'School Things',
          intro: 'We use many things at school every day. Today we learn their English names and how to say them.',
          sections: [
            ['In My Bag', 'I keep a pencil, a book and a ruler in my bag. The pencil writes, and the book has stories. I take my bag to school each morning.'],
            ['On My Desk', 'My desk has a notebook and an eraser. I write in the notebook. I use the eraser when I make a mistake.']
          ],
          examples: [
            ['Name the thing you write with', ['Look at the object in your hand', 'It has a sharp end', 'It is a pencil'], 'a pencil'],
            ['Name the thing that has many pages', ['Think about the object on the desk', 'You open it to read', 'It is a book'], 'a book']
          ],
          questions: [
            ['What do you use to write?', ['a pencil', 'a chair', 'a window', 'a door'], 0, 'A pencil has a point that leaves marks on paper, so we use it for writing.'],
            ['Where do you put your books?', ['in a bag', 'in a cup', 'on a plate', 'in a shoe'], 0, 'A bag is made to carry school things such as books and notebooks.'],
            ['Which word is a school thing?', ['ruler', 'river', 'rain', 'road'], 0, 'A ruler is used in class to draw straight lines and measure.'],
            ['Why do we say words aloud in class?', ['to practise pronunciation', 'to make noise', 'to sleep', 'to hide the word'], 0, 'Saying a word aloud trains the mouth and ears to produce and recognise it.']
          ]
        },
        {
          t: 'Colours Around Me',
          intro: 'The world is full of colours. We will learn the English names of the colours we see every day.',
          sections: [
            ['Bright Colours', 'The sun is yellow and the sky is blue. Leaves are green and tomatoes are red. We can name each colour when we see it.'],
            ['Colours in the Classroom', 'My pencil is red and my bag is blue. The board is green. We point to a thing and say its colour in English.']
          ],
          examples: [
            ['What colour is the sky on a clear day?', ['Look up at the sky', 'It is not green or red', 'It is blue'], 'blue'],
            ['What colour are the leaves in spring?', ['Think of a tree in spring', 'The leaves are fresh', 'They are green'], 'green']
          ],
          questions: [
            ['What colour is a tomato?', ['red', 'blue', 'black', 'grey'], 0, 'A ripe tomato has a red skin, so the word red matches it.'],
            ['Which word names a colour?', ['yellow', 'window', 'teacher', 'pencil'], 0, 'Yellow is a colour, while the other words name objects or people.'],
            ['The sun looks ____ in the morning.', ['yellow', 'green', 'purple', 'brown'], 0, 'We often see the sun as yellow or golden, so yellow fits the sentence.'],
            ['Why do we learn colour words?', ['to describe things we see', 'to count money', 'to write numbers', 'to run faster'], 0, 'Colour words help us describe and understand the world around us.']
          ]
        },
        {
          t: 'My Family',
          intro: 'Families are important. Let us learn how to talk about the people who live with us in English.',
          sections: [
            ['People at Home', 'My mother cooks and my father works. My sister plays with me. I love all the people in my family.'],
            ['Talking About Family', 'We say: "This is my mother." We can also say "He is my brother." Short sentences help us introduce people clearly.']
          ],
          examples: [
            ['Introduce your mother in English', ['Start with "This is"', 'Add "my mother"', 'Say "This is my mother."'], 'This is my mother.'],
            ['Introduce your brother', ['Choose "He is" for a boy', 'Add "my brother"', 'Say "He is my brother."'], 'He is my brother.']
          ],
          questions: [
            ['Who is the woman who takes care of you?', ['my mother', 'my brother', 'my pencil', 'my desk'], 0, 'A mother is a family member who cares for her children.'],
            ['How do we introduce a person?', ['This is my friend.', 'Run to the door.', 'Open the book.', 'Close your eyes.'], 0, '"This is..." is the pattern we use to show or introduce someone.'],
            ['Which word means a boy in your family?', ['brother', 'sister', 'mother', 'grandmother'], 0, 'A brother is a male child in the family.'],
            ['Why do we use short sentences?', ['they are clear and easy to say', 'they are very long', 'they have no meaning', 'they are difficult'], 0, 'Short sentences carry a clear idea and are easier for a young learner to say.']
          ]
        },
        {
          t: 'Check My Learning',
          intro: 'Let us review what we have learned. Read each question carefully and choose the best answer, then explain why.',
          sections: [
            ['Read Before You Choose', 'Read the whole sentence first. Look at the key word in the question. Then choose the answer that fits the meaning.'],
            ['Learn From Mistakes', 'If an answer is wrong, go back to the word and read it again. Mistakes show us what to practise next.']
          ],
          examples: [
            ['Choose the correct colour word', ['Read the options', 'Find the word that names a colour', 'Choose "green"'], 'green'],
            ['Choose the correct school thing', ['Read the options', 'Find the thing used in class', 'Choose "ruler"'], 'ruler']
          ],
          questions: [
            ['Which of these is a school thing?', ['notebook', 'ocean', 'mountain', 'cloud'], 0, 'A notebook is used at school to write lessons, unlike the other words.'],
            ['What colour is grass usually?', ['green', 'red', 'blue', 'white'], 0, 'Healthy grass is green because of the chlorophyll in its leaves.'],
            ['Which sentence correctly introduces your father?', ['This is my father.', 'This my father is.', 'Is this father my.', 'Father is this my.'], 0, 'English word order puts "This is" before the name of the person.'],
            ['What should you do after a wrong answer?', ['review the word', 'stop learning', 'laugh at it', 'change the book'], 0, 'Reviewing the word helps you understand it and remember it next time.']
          ]
        }
      ]
    },
    'cur21': {
      shared: {
        sections: [
          ['Wörter im Alltag', 'Wir lernen neue Wörter, indem wir auf Dinge um uns herum schauen. Wir sprechen jedes Wort langsam und hören auf den Klang. Wiederholen hilft uns, die Wörter zu behalten.'],
          ['Farben und Formen', 'Viele Dinge haben eine Farbe und eine Form. Ein Ball ist rund und kann rot oder blau sein. Wir nennen die Farbe und die Form, wenn wir darüber sprechen.'],
          ['Meine Familie', 'Zu meiner Familie gehören meine Mutter, mein Vater und meine Geschwister. Wir benutzen kurze Sätze, um über sie zu sprechen. Jeder Mensch hat einen Namen.'],
          ['Lesen und Sprechen', 'Wir lesen einfache Sätze und sprechen sie laut. Wir achten auf den ersten Buchstaben jedes Wortes. Lautes Sprechen hilft beim Lernen.']
        ],
        vocab: [
          ['das Wort', 'eine Gruppe von Buchstaben mit einer Bedeutung, zum Beispiel Buch'],
          ['die Farbe', 'rot, blau, grün oder gelb'],
          ['die Familie', 'die Menschen, die mit uns leben, wie Mutter und Vater'],
          ['die Schule', 'der Ort, wo wir lernen und mit Freunden spielen'],
          ['der Satz', 'mehrere Wörter, die einen ganzen Gedanken ergeben'],
          ['die Form', 'die Gestalt einer Sache, zum Beispiel Kreis oder Quadrat']
        ],
        outcomes: [
          'Die Lernenden benennen einfache Gegenstände auf Deutsch',
          'Die Lernenden erkennen und sagen mindestens vier Farben',
          'Die Lernenden bilden kurze Sätze über ihre Familie',
          'Die Lernenden lesen kurze Sätze in der richtigen Wortstellung'
        ],
        diagram: 'diagram-shapes.svg'
      },
      lessons: [
        {
          t: 'Mein Schulranzen',
          intro: 'Jeden Tag nehmen wir viele Dinge mit zur Schule. Heute lernen wir ihre deutschen Namen.',
          sections: [
            ['In meinem Ranzen', 'In meinem Ranzen sind ein Bleistift, ein Buch und ein Lineal. Der Bleistift schreibt, und das Buch hat Geschichten. Ich nehme den Ranzen jeden Morgen mit.'],
            ['Auf meinem Tisch', 'Auf meinem Tisch liegen ein Heft und ein Radiergummi. Ich schreibe in das Heft. Den Radiergummi benutze ich, wenn ich einen Fehler mache.']
          ],
          examples: [
            ['Wie heißt das Ding, mit dem man schreibt?', ['Sieh dir den Gegenstand an', 'Er hat eine spitze Spitze', 'Es ist der Bleistift'], 'der Bleistift'],
            ['Wie heißt das Ding mit vielen Seiten?', ['Denke an den Gegenstand auf dem Tisch', 'Man öffnet ihn zum Lesen', 'Es ist das Buch'], 'das Buch']
          ],
          questions: [
            ['Womit schreibt man?', ['mit dem Bleistift', 'mit dem Stuhl', 'mit dem Fenster', 'mit der Tür'], 0, 'Der Bleistift hat eine Spitze, die auf Papier schreibt.'],
            ['Wohin legt man die Bücher?', ['in den Ranzen', 'in eine Tasse', 'auf einen Teller', 'in einen Schuh'], 0, 'Der Ranzen ist gemacht, um Schulsachen zu tragen.'],
            ['Welches Wort ist eine Schulsache?', ['Lineal', 'Fluss', 'Regen', 'Straße'], 0, 'Ein Lineal benutzt man im Unterricht zum Zeichnen und Messen.'],
            ['Warum sprechen wir Wörter laut aus?', ['um die Aussprache zu üben', 'um Lärm zu machen', 'um zu schlafen', 'um das Wort zu verstecken'], 0, 'Lautes Sprechen trainiert Mund und Ohr, sodass man das Wort besser erkennt.']
          ]
        },
        {
          t: 'Farben und Formen',
          intro: 'Die Welt hat viele Farben und Formen. Wir lernen, wie man sie auf Deutsch nennt.',
          sections: [
            ['Helle Farben', 'Die Sonne ist gelb und der Himmel ist blau. Blätter sind grün und Tomaten sind rot. Wir können jede Farbe nennen, wenn wir sie sehen.'],
            ['Formen um uns', 'Ein Ball ist rund, ein Buch ist viereckig. Wir zeigen auf eine Sache und sagen die Form auf Deutsch. So üben wir die Wörter.']
          ],
          examples: [
            ['Welche Farbe hat der Himmel an einem klaren Tag?', ['Sieh nach oben', 'Er ist nicht grün oder rot', 'Er ist blau'], 'blau'],
            ['Welche Form hat ein Ball?', ['Denke an den Ball', 'Er hat keine Ecken', 'Er ist rund'], 'rund']
          ],
          questions: [
            ['Welche Farbe hat eine Tomate?', ['rot', 'blau', 'schwarz', 'grau'], 0, 'Eine reife Tomate hat eine rote Farbe.'],
            ['Welches Wort nennt eine Farbe?', ['gelb', 'Fenster', 'Lehrer', 'Bleistift'], 0, 'Gelb ist eine Farbe, die anderen Wörter bezeichnen Dinge oder Personen.'],
            ['Die Sonne sieht am Morgen ____ aus.', ['gelb', 'grün', 'lila', 'braun'], 0, 'Die Sonne erscheint uns oft gelb oder golden, deshalb passt gelb.'],
            ['Ein Ball ist ____ .', ['rund', 'eckig', 'viereckig', 'lang'], 0, 'Ein Ball hat keine Ecken und ist deshalb rund.']
          ]
        },
        {
          t: 'Meine Familie',
          intro: 'Die Familie ist wichtig. Wir lernen, wie man auf Deutsch über die Menschen spricht, die bei uns leben.',
          sections: [
            ['Menschen zu Hause', 'Meine Mutter kocht und mein Vater arbeitet. Meine Schwester spielt mit mir. Ich habe alle Menschen in meiner Familie gern.'],
            ['Über die Familie sprechen', 'Wir sagen: "Das ist meine Mutter." Wir können auch sagen: "Er ist mein Bruder." Kurze Sätze machen die Vorstellung klar.']
          ],
          examples: [
            ['Stelle deine Mutter auf Deutsch vor', ['Beginne mit "Das ist"', 'Füge "meine Mutter" hinzu', 'Sage "Das ist meine Mutter."'], 'Das ist meine Mutter.'],
            ['Stelle deinen Bruder vor', ['Wähle "Er ist" für einen Jungen', 'Füge "mein Bruder" hinzu', 'Sage "Er ist mein Bruder."'], 'Er ist mein Bruder.']
          ],
          questions: [
            ['Wer ist die Frau, die sich um dich kümmert?', ['meine Mutter', 'mein Bruder', 'mein Bleistift', 'mein Tisch'], 0, 'Die Mutter ist ein Familienmitglied, das für seine Kinder sorgt.'],
            ['Wie stellt man eine Person vor?', ['Das ist mein Freund.', 'Lauf zur Tür.', 'Öffne das Buch.', 'Schließe die Augen.'], 0, 'Mit "Das ist..." zeigt man auf eine Person und nennt sie.'],
            ['Welches Wort bedeutet ein Junge in der Familie?', ['Bruder', 'Schwester', 'Mutter', 'Großmutter'], 0, 'Ein Bruder ist ein männliches Kind in der Familie.'],
            ['Warum benutzen wir kurze Sätze?', ['sie sind klar und leicht zu sagen', 'sie sind sehr lang', 'sie haben keine Bedeutung', 'sie sind schwer'], 0, 'Kurze Sätze enthalten eine klare Idee und sind leichter auszusprechen.']
          ]
        },
        {
          t: 'Wiederholung und Check',
          intro: 'Wir wiederholen, was wir gelernt haben. Lies jede Frage aufmerksam und wähle die beste Antwort.',
          sections: [
            ['Erst lesen, dann wählen', 'Lies den ganzen Satz zuerst. Achte auf das Schlüsselwort in der Frage. Dann wähle die Antwort, die zum Sinn passt.'],
            ['Aus Fehlern lernen', 'Wenn eine Antwort falsch ist, sieh dir das Wort noch einmal an. Fehler zeigen uns, was wir noch üben können.']
          ],
          examples: [
            ['Wähle das richtige Farbwort', ['Lies die Möglichkeiten', 'Finde das Wort für eine Farbe', 'Wähle "grün"'], 'grün'],
            ['Wähle die richtige Schulsache', ['Lies die Möglichkeiten', 'Finde die Sache aus dem Unterricht', 'Wähle "Lineal"'], 'Lineal']
          ],
          questions: [
            ['Welches davon ist eine Schulsache?', ['Heft', 'Ozean', 'Berg', 'Wolke'], 0, 'Ein Heft wird in der Schule zum Schreiben benutzt.'],
            ['Welche Farbe hat Gras meistens?', ['grün', 'rot', 'blau', 'weiß'], 0, 'Gesundes Gras ist grün, weil es Chlorophyll enthält.'],
            ['Welcher Satz stellt deinen Vater richtig vor?', ['Das ist mein Vater.', 'Das mein Vater ist.', 'Ist das Vater mein.', 'Vater ist das mein.'], 0, 'Im Deutschen steht "Das ist" vor der Person.'],
            ['Was machst du nach einer falschen Antwort?', ['das Wort wiederholen', 'aufhören zu lernen', 'darüber lachen', 'das Buch wechseln'], 0, 'Wiederholen hilft dir, das Wort zu verstehen und es beim nächsten Mal zu behalten.']
          ]
        }
      ]
    },
    'cur_l_pre_sub_amz': {
      shared: {
        sections: [
          ['Les lettres tifinagh', "Le tifinagh est l'écriture de la langue amazighe. Chaque lettre a une forme et un son. On commence par les lettres simples comme ⴰ, ⴱ et ⵜ."],
          ['Les mots de la vie', "On apprend des mots qu'on entend à la maison et à l'école. Par exemple azul veut dire bonjour et tanemmirt veut dire merci. Répéter les mots aide à les retenir."],
          ['La voix et le rythme', "Dans la tradition amazighe, on chante et on frappe des mains. Les chants accompagnent les fêtes et le travail. Écouter le rythme aide à prononcer les mots."],
          ['La famille et le pays', "On parle de la famille avec des mots comme aba (papa) et yemma (maman). La langue amazighe est parlée au Maroc dans les montagnes et les villes. Elle fait partie de la culture du pays."]
        ],
        vocab: [
          ['tifinagh', "l'alphabet utilisé pour écrire l'amazigh"],
          ['azul', 'mot amazigh qui veut dire bonjour ou salut'],
          ['tanemmirt', 'mot amazigh qui veut dire merci'],
          ['yemma', 'mot amazigh qui veut dire maman'],
          ['izran', 'chants traditionnels amazighs'],
          ['tamazight', 'la langue amazighe']
        ],
        outcomes: [
          'Reconnaître et tracer quelques lettres tifinagh simples',
          'Dire au moins quatre mots amazighs de la vie quotidienne',
          'Participer à un chant ou à un rythme avec la classe',
          'Nommer des éléments de la culture amazighe avec des mots simples'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'Les premières lettres tifinagh',
          intro: "Découvrons les premières lettres de l'écriture tifinagh. On les regarde et on les trace avec le doigt.",
          sections: [
            ['Les lettres ⴰ, ⴱ, ⵜ', "La lettre ⴰ se lit «a», ⴱ se lit «b» et ⵜ se lit «t». On les trace dans l'air avant de les écrire. Chaque lettre a un son bien précis."],
            ['Où voir ces lettres ?', "On retrouve ces lettres dans les mots azul et tamazight. On cherche la lettre ⴰ au début de azul. Regarder des mots aide à reconnaître les lettres."]
          ],
          examples: [
            ['Trouve la première lettre de azul', ['Regarde le mot azul', 'Écoute le premier son', "C'est la lettre ⴰ"], 'ⴰ'],
            ['Trace la lettre qui fait le son t', ['Écoute le son t', 'Cherche la lettre correspondante', "C'est ⵜ"], 'ⵜ']
          ],
          questions: [
            ['Comment se lit la lettre ⴰ ?', ['a', 'b', 't', 'm'], 0, 'La lettre tifinagh ⴰ correspond au son a, comme dans azul.'],
            ['Quelle lettre fait le son b ?', ['ⴱ', 'ⴰ', 'ⵜ', 'ⵎ'], 0, 'En tifinagh, le son b s écrit avec la lettre ⴱ.'],
            ['Où trouve-t-on le tifinagh ?', ["dans l'écriture amazighe", 'dans les nombres seulement', 'sur les voitures seulement', 'dans le ciel'], 0, "Le tifinagh est le système d'écriture utilisé pour la langue amazighe."],
            ['Pourquoi tracer les lettres avec le doigt ?', ['pour mémoriser leur forme', 'pour faire du bruit', 'pour les cacher', 'pour dessiner un animal'], 0, 'Tracer la lettre avec le doigt aide le cerveau et la main à retenir sa forme.']
          ]
        },
        {
          t: 'Les mots simples : azul et tanemmirt',
          intro: 'Apprenons deux mots amazighs très utiles pour saluer et remercier. On les dit avec un sourire.',
          sections: [
            ['Dire bonjour', "Le mot azul veut dire bonjour. On le dit en arrivant à l'école ou en rencontrant un proche. C'est un mot de politesse et de vie quotidienne."],
            ['Dire merci', "Tanemmirt veut dire merci. On le dit quand quelqu'un nous aide. On peut aussi lever les mains pour montrer notre reconnaissance."]
          ],
          examples: [
            ['Quel mot dis-tu pour saluer ?', ["Pense au matin à l'école", 'Cherche le mot de politesse', 'Je dis azul'], 'azul'],
            ['Quel mot dis-tu après un cadeau ?', ['Pense à la personne qui donne', 'Cherche le mot pour remercier', 'Je dis tanemmirt'], 'tanemmirt']
          ],
          questions: [
            ["En arrivant à l'école, que veut dire le mot azul ?", ['bonjour', 'merci', 'au revoir', 'non'], 0, "Azul est le mot amazigh utilisé pour saluer quelqu'un."],
            ['Que veut dire tanemmirt ?', ['merci', 'bonjour', 'oui', 'eau'], 0, 'Tanemmirt est le mot qui exprime la gratitude en amazigh.'],
            ['Dans quelle situation dit-on tanemmirt à un camarade ?', ['quand on remercie', 'quand on dort', 'quand on court', 'quand on écrit'], 0, 'On dit tanemmirt pour remercier une personne qui a aidé.'],
            ['Comment appelle-t-on maman en amazigh ?', ['yemma', 'azul', 'aba', 'izran'], 0, 'Yemma est le mot amazigh qui désigne la mère.']
          ]
        },
        {
          t: 'Les chants et le rythme',
          intro: "Les chants amazighs accompagnent les fêtes et la vie du village. Écoutons le rythme et répétons les paroles.",
          sections: [
            ['Les izran', "Izran signifie chants en amazigh. On les chante lors des fêtes et des mariages. Les paroles racontent la vie, la nature et l'amour du pays."],
            ['Le rythme des mains', "Pendant le chant, on frappe des mains et on tape du pied. Ce rythme aide à garder le tempo. Il rend la musique vivante et collective."]
          ],
          examples: [
            ['Comment appelle-t-on les chants amazighs ?', ['Écoute la musique traditionnelle', 'Cherche le mot pour chants', 'Ce sont les izran'], 'izran'],
            ['Comment garder le rythme ?', ['Écoute le battement', 'Frappe des mains avec les autres', 'Le rythme reste régulier'], 'en frappant des mains']
          ],
          questions: [
            ['Que sont les izran ?', ['des chants', 'des lettres', 'des jeux', 'des couleurs'], 0, 'Izran est le mot amazigh qui désigne les chants traditionnels.'],
            ['Quand chante-t-on souvent les izran ?', ['pendant les fêtes', 'pendant le sommeil', 'pendant la pluie seulement', 'jamais'], 0, 'Les chants accompagnent les fêtes et les moments de vie collective.'],
            ['Comment participe-t-on au rythme ?', ['en frappant des mains', 'en fermant les yeux', 'en courant', 'en écrivant'], 0, 'Frapper des mains permet de suivre et de garder le tempo ensemble.'],
            ['Pourquoi chanter ensemble ?', ['pour partager un moment joyeux', 'pour faire du bruit', 'pour oublier les mots', 'pour dormir'], 0, 'Chanter ensemble renforce le lien entre les personnes de la classe.']
          ]
        },
        {
          t: 'La culture amazighe autour de nous',
          intro: 'La culture amazighe est riche et vivante. Découvrons quelques mots pour en parler simplement.',
          sections: [
            ['Les mots du quotidien', 'Aman veut dire eau et akal veut dire terre. Tafukt est le soleil. Ces mots montrent le lien entre la langue et la nature.'],
            ['La langue et le pays', "Tamazight est la langue amazighe. On la parle au Maroc dans plusieurs régions. La garder vivante, c'est respecter la culture de tous."]
          ],
          examples: [
            ['Dis le mot amazigh pour eau', ['Pense à ce que tu bois', 'Cherche le mot dans la leçon', "C'est aman"], 'aman'],
            ['Dis le mot amazigh pour soleil', ['Regarde le ciel', 'Cherche le mot qui brille', "C'est tafukt"], 'tafukt']
          ],
          questions: [
            ['Que veut dire aman ?', ["l'eau", 'le feu', 'le vent', 'la maison'], 0, "Aman est le mot amazigh qui désigne l'eau, indispensable à la vie."],
            ['Que veut dire tafukt ?', ['le soleil', 'la lune', 'la pluie', 'le champ'], 0, 'Tafukt désigne le soleil dans la langue amazighe.'],
            ["Comment s'appelle la langue amazighe ?", ['tamazight', 'tifinagh', 'azul', 'izran'], 0, 'Tamazight est le nom de la langue, tandis que tifinagh est son écriture.'],
            ['Pourquoi apprendre ces mots ?', ['pour connaître la culture', 'pour oublier le français', 'pour ne plus parler', 'pour dessiner'], 0, "Apprendre ces mots permet de découvrir et de respecter la culture amazighe."]
          ]
        }
      ]
    },
    'cur_l_p1_sub_amz': {
      shared: {
        sections: [
          ['Découvrir le tifinagh', "Le tifinagh est l'écriture de l'amazigh. On lit les lettres de gauche à droite. On commence par les lettres les plus simples comme ⴰ, ⵎ et ⵢ."],
          ['Les couleurs en amazigh', "On nomme les couleurs avec des mots amazighs. Azwaw est le bleu, azggagh est le rouge. On associe le mot à la couleur qu'on voit."],
          ['Les mots de tous les jours', "On dit azul pour bonjour et tanemmirt pour merci. Ces mots sont courts et faciles à retenir. On les utilise à la maison et à l'école."],
          ['La culture amazighe', 'La culture amazighe comprend la musique, les tapis et les fêtes. On la découvre par les mots et les images. Chaque mot raconte un peu de cette culture.']
        ],
        vocab: [
          ['tifinagh', 'écriture utilisée pour la langue amazighe'],
          ['azul', 'salutation amazighe qui veut dire bonjour'],
          ['azwaw', 'mot amazigh pour la couleur bleue'],
          ['azggagh', 'mot amazigh pour la couleur rouge'],
          ['yemma', 'maman en amazigh'],
          ['ahidous', 'danse et chant traditionnels amazighs']
        ],
        outcomes: [
          'Lire et tracer plusieurs lettres tifinagh courantes',
          'Nommer quelques couleurs en amazigh',
          'Dire des mots et de courtes phrases de politesse',
          'Décrire un élément simple de la culture amazighe'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'Lire les lettres tifinagh',
          intro: "On apprend à reconnaître et à tracer de nouvelles lettres tifinagh. On les compare avec les sons qu'on entend.",
          sections: [
            ['Les lettres ⵎ, ⵢ, ⵏ', "La lettre ⵎ se lit m, ⵢ se lit y et ⵏ se lit n. On les trace en suivant le sens des flèches. On dit le son en même temps que l'on écrit."],
            ['Retrouver les lettres', "On cherche ces lettres dans des mots comme aman et yemma. La lettre ⵎ apparaît au début de aman. Reconnaître une lettre dans un mot est plus facile après l'avoir tracée."]
          ],
          examples: [
            ['Quel son fait la lettre ⵎ ?', ['Regarde la forme de la lettre', 'Rappelle-toi la leçon', 'Elle fait le son m'], 'm'],
            ['Trouve la lettre y dans yemma', ['Écoute le début de yemma', 'Cherche la lettre qui fait y', "C'est ⵢ"], 'ⵢ']
          ],
          questions: [
            ['Comment se lit ⵏ ?', ['n', 'm', 'y', 'a'], 0, 'La lettre tifinagh ⵏ correspond au son n.'],
            ['Quel mot commence par ⵢ ?', ['yemma', 'aman', 'azul', 'tamazight'], 0, 'Le mot yemma commence par la lettre ⵢ qui fait le son y.'],
            ['Dans quel sens lit-on le tifinagh ?', ['de gauche à droite', 'de droite à gauche', 'de bas en haut', 'en cercle'], 0, "Le tifinagh se lit de gauche à droite, comme on l'écrit ici."],
            ['Comment retenir la lettre tifinagh ⵎ ?', ['la tracer et la dire', 'la cacher', 'la colorier sans la lire', 'la sauter'], 0, 'Tracer la lettre en disant son son aide à la mémoriser.']
          ]
        },
        {
          t: 'Les couleurs en amazigh',
          intro: 'Les couleurs ont aussi un nom en amazigh. Apprenons à les reconnaître et à les dire.',
          sections: [
            ['Bleu, rouge, jaune', 'Azwaw veut dire bleu, azggagh veut dire rouge et awragh veut dire jaune. On associe chaque mot à un objet de la classe. Le ciel est azwaw et le soleil est awragh.'],
            ['Les couleurs autour de nous', 'On regarde les vêtements et les cahiers. On dit le nom de la couleur en amazigh. Répéter le mot plusieurs fois aide à le retenir.']
          ],
          examples: [
            ['Comment dire bleu en amazigh ?', ['Regarde le ciel', 'Cherche le mot de la couleur', 'On dit azwaw'], 'azwaw'],
            ['Comment dire rouge en amazigh ?', ['Regarde une tomate', 'Cherche le mot de la couleur', 'On dit azggagh'], 'azggagh']
          ],
          questions: [
            ['Que veut dire azwaw ?', ['bleu', 'rouge', 'jaune', 'vert'], 0, 'Azwaw est le mot amazigh qui désigne la couleur bleue.'],
            ['Quel mot veut dire rouge ?', ['azggagh', 'azwaw', 'awragh', 'aman'], 0, 'Azggagh est utilisé pour la couleur rouge en amazigh.'],
            ["Comment s'appelle le jaune ?", ['awragh', 'azggagh', 'azwaw', 'yemma'], 0, 'Awragh est le mot amazigh pour la couleur jaune.'],
            ['Pourquoi associer le mot à un objet ?', ['pour mieux se souvenir', 'pour changer la couleur', 'pour le cacher', 'pour dormir'], 0, "L'image et le mot ensemble créent un lien qui aide la mémoire."]
          ]
        },
        {
          t: 'De courtes phrases amazigh',
          intro: "On peut maintenant assembler des mots pour dire de petites phrases. On commence par des phrases de politesse.",
          sections: [
            ['Saluer et remercier', 'On dit Azul pour bonjour et Tanemmirt pour merci. On ajoute parfois un nom pour être plus clair. Ces phrases rendent les échanges aimables.'],
            ["Présenter quelqu'un", 'On peut dire «ⴰⴱⴰ» pour papa et «ⵢⴻⵎⵎⴰ» pour maman. En montrant une photo, on nomme la personne. Une courte phrase suffit pour se faire comprendre.']
          ],
          examples: [
            ['Salue ton camarade en amazigh', ['Regarde ton camarade', 'Choisis le mot de salutation', 'Dis Azul'], 'Azul'],
            ['Nomme la personne sur la photo', ['Regarde la photo', 'Reconnais la femme', 'Dis Yemma'], 'Yemma']
          ],
          questions: [
            ['Quel mot amazigh sert à saluer un camarade ?', ['Azul', 'Aman', 'Azwaw', 'Yemma'], 0, 'Azul est la salutation amazighe qui correspond à bonjour.'],
            ['Que signifie Tanemmirt ?', ['merci', 'bonjour', 'bleu', 'papa'], 0, 'Tanemmirt exprime le remerciement en amazigh.'],
            ['Comment dire maman ?', ['Yemma', 'Aba', 'Azul', 'Aman'], 0, 'Yemma est le mot amazigh pour désigner la mère.'],
            ['Pourquoi utiliser des phrases courtes ?', ['elles sont faciles à retenir', 'elles sont longues', 'elles sont difficiles', 'elles ne servent pas'], 0, 'Une phrase courte contient une idée claire, facile à dire et à mémoriser.']
          ]
        },
        {
          t: 'Découvrir la culture amazighe',
          intro: 'La culture amazighe se découvre par les sons, les images et les objets. Regardons quelques exemples simples.',
          sections: [
            ['La musique et la danse', "L'ahidous est une danse chantée des montagnes. Les participants forment un cercle et chantent ensemble. C'est un moment de partage pour le village."],
            ['Les objets et les mots', 'Les tapis et les poteries portent des motifs amazighs. On apprend les mots pour les nommer. Chaque mot ouvre une petite fenêtre sur la culture.']
          ],
          examples: [
            ['Nomme une danse chantée amazighe', ['Pense aux fêtes de montagne', 'Cherche le mot dans la leçon', "C'est l'ahidous"], 'ahidous'],
            ['Dis le mot amazigh pour terre', ['Pense au sol', 'Cherche le mot dans la leçon', "C'est akal"], 'akal']
          ],
          questions: [
            ["Qu'est-ce que l'ahidous ?", ['une danse chantée', 'une lettre', 'une couleur', 'un nombre'], 0, "L'ahidous est une danse traditionnelle accompagnée de chants."],
            ['Où trouve-t-on des motifs amazighs ?', ['sur les tapis', 'sur les nuages', 'dans le ciel', 'sur la lune'], 0, 'Les tapis amazighs sont connus pour leurs motifs géométriques.'],
            ['Pourquoi apprendre des mots culturels ?', ['pour comprendre la culture', 'pour les oublier', 'pour ne rien dire', 'pour changer de langue'], 0, 'Les mots culturels aident à comprendre et à respecter les traditions.'],
            ["Que fait-on pendant l'ahidous ?", ['on chante en cercle', 'on dort', 'on court seul', 'on écrit'], 0, "Pendant l'ahidous, les gens chantent ensemble en formant un cercle."]
          ]
        }
      ]
    },
    'cur_l_p2_sub_fr': {
      shared: {
        sections: [
          ["Les lettres de l'alphabet", "Le français s'écrit avec des lettres. On les apprend dans un ordre précis, de A à Z. Chaque lettre a un nom et souvent plusieurs sons."],
          ['Les mots de la classe', 'Dans la classe, on voit un cahier, un crayon, une table et une chaise. On dit le nom de chaque objet à voix haute. Répéter aide à retenir les mots.'],
          ['Les petites phrases', "Une phrase est un groupe de mots qui veut dire quelque chose. On commence par une majuscule et on met un point à la fin. Une courte phrase est plus facile à lire."],
          ["Comprendre ce qu'on lit", "Quand on lit, on cherche les mots que l'on connaît. On relit la phrase si on n'a pas compris. Les images aident aussi à deviner le sens."]
        ],
        vocab: [
          ['alphabet', "l'ensemble des lettres utilisées pour écrire"],
          ['lettre', 'un signe comme A, B ou C'],
          ['mot', 'un groupe de lettres qui a un sens, comme chat'],
          ['phrase', 'un groupe de mots qui exprime une idée complète'],
          ['majuscule', "une grande lettre utilisée au début d'une phrase"],
          ['ponctuation', 'les signes comme le point et la virgule']
        ],
        outcomes: [
          "Reconnaître et nommer les lettres de l'alphabet",
          'Lire des mots simples de la classe',
          'Écrire une courte phrase avec une majuscule et un point',
          'Répondre à des questions simples sur un texte court'
        ],
        diagram: 'diagram-french-alphabet.svg'
      },
      lessons: [
        {
          t: "L'alphabet français",
          intro: "Apprenons les lettres de l'alphabet français dans leur ordre. On les dit et on les écrit avec soin.",
          sections: [
            ['De A à F', "Les premières lettres sont A, B, C, D, E et F. On les prononce une par une. On peut chanter l'alphabet pour mieux s'en souvenir."],
            ['Les lettres qui se ressemblent', "Les lettres B et D se ressemblent, mais elles ne sont pas dans le même sens. La lettre P a une jambe vers le bas. On regarde bien la forme avant d'écrire."]
          ],
          examples: [
            ['Quelle lettre vient après A ?', ['Commence par la première lettre', "Avance d'une lettre", "C'est la lettre B"], 'B'],
            ['Quelle lettre fait le son m ?', ['Écoute le son', "Cherche la lettre dans l'alphabet", "C'est la lettre M"], 'M']
          ],
          questions: [
            ["Quelle est la première lettre de l'alphabet ?", ['A', 'Z', 'M', 'B'], 0, "L'alphabet français commence par la lettre A."],
            ['Quelle lettre vient après D ?', ['E', 'C', 'F', 'G'], 0, "Dans l'ordre alphabétique, E suit directement D."],
            ["Comment s'appelle une grande lettre ?", ['une majuscule', 'une minuscule', 'un point', 'une virgule'], 0, "Une majuscule est une grande lettre, utilisée notamment au début d'une phrase."],
            ["Pourquoi apprendre l'alphabet ?", ['pour lire et écrire les mots', 'pour compter', 'pour courir', 'pour dormir'], 0, "Connaître les lettres permet de lire et d'écrire tous les mots."]
          ]
        },
        {
          t: 'Les mots de la classe',
          intro: 'Regardons autour de nous et nommons les objets de la classe en français. On dit chaque mot clairement.',
          sections: [
            ['Sur le bureau', "Sur le bureau, il y a un cahier, un crayon et une gomme. On écrit dans le cahier avec le crayon. La gomme efface ce que l'on a écrit."],
            ['Dans la salle', 'La salle a une porte, des fenêtres et un tableau. On ouvre la porte pour entrer. Le tableau sert à écrire des mots pour toute la classe.']
          ],
          examples: [
            ["Nomme l'objet avec lequel on écrit", ['Regarde ton bureau', "Cherche l'objet qui a une pointe", "C'est un crayon"], 'un crayon'],
            ["Nomme l'objet qui efface", ['Pense à une erreur', "Cherche l'objet qui efface", "C'est une gomme"], 'une gomme']
          ],
          questions: [
            ['Que trouve-t-on sur un bureau ?', ['un cahier', 'un nuage', 'une rivière', 'une montagne'], 0, 'Le cahier est un objet de la classe posé sur le bureau.'],
            ['Avec quoi efface-t-on ?', ['avec une gomme', 'avec une fenêtre', 'avec une chaise', 'avec une porte'], 0, 'La gomme sert à effacer les traits de crayon.'],
            ["Quel mot désigne une grande surface où l'on écrit ?", ['un tableau', 'un crayon', 'une gomme', 'un cahier'], 0, 'Le tableau est la grande surface fixée au mur de la classe.'],
            ['Pourquoi dire les mots à voix haute ?', ['pour les retenir', 'pour les cacher', 'pour faire moins de bruit', 'pour les oublier'], 0, "Dire un mot à voix haute aide à entendre sa forme et à le mémoriser."]
          ]
        },
        {
          t: 'Les petites phrases',
          intro: 'On assemble maintenant des mots pour faire une phrase. On respecte la majuscule et le point final.',
          sections: [
            ['Commencer et finir', 'Une phrase commence par une majuscule et finit par un point. Par exemple : « Je lis un livre. » Cette règle aide le lecteur à repérer la phrase.'],
            ['Une idée par phrase', "Chaque phrase dit une seule chose. « Le chat dort. » est une phrase courte et claire. On peut en ajouter une autre pour continuer l'histoire."]
          ],
          examples: [
            ["Écris une phrase avec « chat »", ['Commence par une majuscule', 'Ajoute un verbe', 'Termine par un point : Le chat dort.'], 'Le chat dort.'],
            ['Corrige : « je mange une pomme »', ['Regarde la première lettre', 'Mets une majuscule', 'Ajoute un point : Je mange une pomme.'], 'Je mange une pomme.']
          ],
          questions: [
            ['Comment commence une phrase ?', ['par une majuscule', 'par une minuscule', 'par un point', 'par une virgule'], 0, "En français, la première lettre d'une phrase est une majuscule."],
            ['Comment finit une phrase ?', ['par un point', 'par une virgule', "par un point d'exclamation toujours", 'par une lettre'], 0, 'La plupart des phrases se terminent par un point.'],
            ['Quelle est une phrase courte et claire ?', ['Le chat dort.', 'chat le dort', 'dort chat le', 'le chat dort point'], 0, "Cette phrase respecte l'ordre des mots et contient une seule idée."],
            ['Pourquoi une seule idée par phrase ?', ['pour être bien comprise', 'pour être très longue', 'pour cacher le sens', 'pour ne pas finir'], 0, 'Une idée par phrase rend la lecture plus claire pour tout le monde.']
          ]
        },
        {
          t: 'Comprendre un petit texte',
          intro: 'On lit maintenant un tout petit texte. On cherche les mots connus et on répond à des questions simples.',
          sections: [
            ['Lire et chercher', "Avant de lire, on regarde le titre et l'image. Pendant la lecture, on souligne les mots qu'on connaît. Cela donne des repères pour comprendre."],
            ["Vérifier sa compréhension", "Après la lecture, on se demande : qui ? où ? quoi ? On relit la phrase qui donne la réponse. Si on ne comprend pas, on demande à l'adulte."]
          ],
          examples: [
            ['Texte : « Le soleil brille. Les oiseaux chantent. » Où sont les oiseaux ?', ['Cherche le mot oiseaux', 'Lis la phrase avec chanter', 'Ils sont dehors, dans le ciel'], 'dans le ciel'],
            ["Texte : « Je vais à l'école. J'ai mon cartable. » Qu'est-ce que je porte ?", ['Cherche le mot cartable', 'Lis la deuxième phrase', 'Je porte mon cartable'], 'mon cartable']
          ],
          questions: [
            ['Que fait le soleil dans le texte ?', ['il brille', 'il dort', 'il chante', 'il écrit'], 0, 'Le texte dit explicitement que le soleil brille.'],
            ['Qui chante dans le texte ?', ['les oiseaux', 'les tables', 'les cahiers', 'les portes'], 0, 'La phrase « Les oiseaux chantent » nous le dit clairement.'],
            ["Que faut-il faire si on ne comprend pas ?", ['relire et demander', 'fermer le livre', 'deviner sans chercher', 'oublier le texte'], 0, "Relire et demander de l'aide permet de construire le sens."],
            ["Pourquoi regarder l'image avant de lire ?", ['pour avoir des repères', 'pour ne pas lire', 'pour changer le texte', 'pour compter les mots'], 0, "L'image donne des indices qui aident à anticiper le contenu du texte."]
          ]
        }
      ]
    },
    'cur_l_p3_sub_ar': {
      shared: {
        sections: [
          ['النص وسؤاله', 'النص المقروء يصلنا بفكرة أو صورة. نقرأ العنوان أولا ثم نقرأ الجمل. بعد القراءة نسأل: ماذا قال النص؟'],
          ['الكلمة في سياقها', 'معنى الكلمة يتضح من الجملة التي جاءت فيها. إذا قرأنا «الشجرة مثمرة» فهمنا أنها تعطي ثمارا. لا نحفظ الكلمة وحدها.'],
          ['الفصول والشجرة', 'تتغير الشجرة مع الفصول: تزهر في الربيع وتثمر في الصيف. تسقط أوراقها في الخريف. هذا الوصف يساعدنا على فهم النص.'],
          ['من الفهم إلى الكتابة', 'بعد فهم النص نستطيع أن نكتب جملة تشبه جمله. نقلّد الأسلوب ثم نضيف فكرتنا. هكذا تتقن القراءة والكتابة معا.']
        ],
        vocab: [
          ['نص', 'مجموعة جمل مكتوبة تحمل فكرة أو قصة'],
          ['عنوان', 'الجملة التي تخبرنا عن موضوع النص'],
          ['فكرة', 'المعنى الرئيسي الذي يريد النص إيصاله'],
          ['استنتاج', 'أن نفهم شيئا لم يقل النص صراحة'],
          ['سياق', 'الكلمات التي تحيط بالكلمة وتوضح معناها'],
          ['فقرة', 'مجموعة جمل تتحدث عن فكرة واحدة']
        ],
        outcomes: [
          'أن يقرأ التلميذ النص بوضوح ويعبر عن معناه',
          'أن يحدد التلميذ الفكرة الرئيسية في نص قصير',
          'أن يستنتج التلميذ معنى كلمة من سياقها',
          'أن يكتب التلميذ فقرة قصيرة مترابطة'
        ],
        diagram: 'diagram-seasons.svg'
      },
      lessons: [
        {
          t: 'نص قرائي: شجرة الزيتون',
          intro: 'نقرأ نصا قصيرا عن شجرة الزيتون في بستان جدّنا. نقرأ بتمهّل ونلاحظ الكلمات المهمّة.',
          sections: [
            ['العنوان يهدينا', 'عنوان النص «شجرة الزيتون» يخبرنا أن الحديث عن شجرة. قبل القراءة نتوقع ما سنجده. هذا التوقع يجعل القراءة أكثر انتباها.'],
            ['قراءة النص', 'يقول النص: «في بستان جدّنا شجرة زيتون عجوز. في الربيع تزهر، وفي الخريف نجنى ثمارها.» نقرأ الجمل مرتين، ثم نبرز الكلمات: بستان، تزهر، نجنى.']
          ],
          examples: [
            ['ما موضوع النص؟', ['نقرأ العنوان', 'نبحث عن تكرار كلمة زيتون', 'الموضوع شجرة الزيتون'], 'شجرة الزيتون'],
            ['متى تزهر الشجرة؟', ['نبحث عن كلمة تزهر', 'نقرأ الجملة التي بعدها', 'تزهر في الربيع'], 'في الربيع']
          ],
          questions: [
            ['أين توجد شجرة الزيتون التي وصفها النص؟', ['في بستان جدّنا', 'في البحر', 'في المدينة الكبيرة', 'في المدرسة'], 0, 'لأن النص قال «في بستان جدّنا»، وهذا يحدد مكان الشجرة.'],
            ['ماذا نجني في الخريف؟', ['ثمار الزيتون', 'الزهور', 'الأوراق', 'التراب'], 0, 'لأن الجملة تقول «في الخريف نجنى ثمارها»، والثمار هنا الزيتون.'],
            ['أي كلمة تدل على مكان النبات؟', ['بستان', 'عجوز', 'نقرأ', 'قصير'], 0, 'لأن البستان هو الأرض التي تزرع فيها الأشجار.'],
            ['لماذا نقرأ العنوان أولا؟', ['لنعرف موضوع النص', 'لنعدّ الجمل', 'لأنه أكبر سطر', 'لأنه آخر سطر'], 0, 'لأن العنوان يهيّئ ذهننا لما سيأتي في النص.']
          ]
        },
        {
          t: 'أفهم وأستنتج',
          intro: 'القراءة ليست نطقا فقط، بل فهما. اليوم نتدرب على استخراج الفكرة والاستدلال من الجمل.',
          sections: [
            ['الفكرة الرئيسية', 'نسأل أنفسنا: ماذا يريد النص أن يقول؟ إذا تكرر ذكر الزيتون والبستان فالفكرة عن شجرة مثمرة. الفكرة ليست كل جملة، بل المعنى الجامع.'],
            ['الاستنتاج من القرينة', 'قد لا يقول النص «الجد يحب الشجرة»، لكننا نستنتج ذلك من اهتمامه بها. القرينة هي الدليل الصغير في الجملة. نستدل ولا نخترع.']
          ],
          examples: [
            ['استخرج الفكرة من: «الشجرة تعطينا الظل والزيتون»', ['نبحث عن العمل المشترك', 'نجد الظل والثمر', 'الفكرة: الشجرة مفيدة'], 'الشجرة مفيدة'],
            ['استنتج من: «يسقي الجد الشجرة كل صباح»', ['نلاحظ الفعل يسقي', 'نربطه بالاهتمام', 'الجد يهتم بالشجرة'], 'الجد يهتم بالشجرة']
          ],
          questions: [
            ['ما الفكرة الرئيسية في وصف شجرة تعطي الظل والثمر؟', ['الشجرة مفيدة', 'الشجرة سوداء', 'الظل بعيد', 'الثمر قليل'], 0, 'لأن الجملة تذكر نفعين للشجرة، فيكون المعنى الجامع أنها مفيدة.'],
            ['أي جملة تدل على اهتمام الجد؟', ['يسقي الجد الشجرة كل صباح', 'الشجرة كبيرة', 'السماء زرقاء', 'اليوم جميل'], 0, 'لأن السقي المتكرر يدل على العناية والاهتمام.'],
            ['ما معنى «نستنتج»؟', ['نفهم ما لم يقل صراحة', 'نكتب العنوان', 'نحفظ النص', 'نعدّ الكلمات'], 0, 'لأن الاستنتاج يعني الوصول إلى معنى بدليل من النص لا بذكر مباشر.'],
            ['لماذا نستدل بالقرينة؟', ['لأنها دليل من النص', 'لأنها أطول جملة', 'لأنها آخر كلمة', 'لأنها سهلة'], 0, 'لأن القرينة جزء من النص يدعم فهمنا ولا يخرج عنه.']
          ]
        },
        {
          t: 'أكتب فقرة قصيرة',
          intro: 'بعد الفهم نأتي الكتابة. نكتب فقرة قصيرة عن الشجرة أو عن يوم في البستان.',
          sections: [
            ['جمل مترابطة', 'الفقرة تتكوّن من جمل تدور حول فكرة واحدة. نبدأ بجملة تعرّف الشيء، ثم نضيف وصفا. كل جملة تكمّل التي قبلها.'],
            ['علامات الترقيم', 'نبدأ الجملة بحرف كبير ونضع نقطة في آخرها. إذا أضفنا جملة أخرى نفصل بينهما بنقطة. الترقيم يجعل كتابتنا واضحة للقارئ.']
          ],
          examples: [
            ['اكتب فقرة عن شجرة الزيتون', ['ابدأ: عندنا شجرة زيتون', 'أضف: تزهر في الربيع', 'اختم: نجني ثمارها في الخريف'], 'عندنا شجرة زيتون. تزهر في الربيع. نجني ثمارها في الخريف.'],
            ['حسّن الجملة: «الشجرة اعطت ظل»', ['صحّح الهمزة: أعطت', 'أضف نقطة في النهاية', 'الشجرة أعطت ظلا'], 'الشجرة أعطت ظلا.']
          ],
          questions: [
            ['كم فكرة في الفقرة الجيدة؟', ['فكرة واحدة واضحة', 'أفكار كثيرة بلا نظام', 'لا فكرة', 'فكرتان متناقضتان'], 0, 'لأن ترابط الفقرة يعتمد على دوران جملها حول فكرة واحدة.'],
            ['ما وظيفة النقطة في آخر الجملة؟', ['تدل على نهاية الجملة', 'تدل على السؤال', 'تدل على التعجب', 'تزين الحرف'], 0, 'لأن النقطة علامة ترقيم تفصل بين جملتين تامتين.'],
            ['أي جملة تصلح بداية لفقرة عن البستان؟', ['في بستاننا أشجار كثيرة', 'والثمر كثير', 'ثم نذهب', 'لذلك أحبها'], 0, 'لأن البداية تعرّف المكان قبل أن نضيف التفاصيل.'],
            ['لماذا نراجع ما كتبناه؟', ['لنصلح الأخطاء', 'لنحذف كل الجمل', 'لأن الكتابة سهلة دائما', 'لنزيد الغلط'], 0, 'لأن المراجعة تساعدنا على تصحيح الإملاء وترتيب الأفكار.']
          ]
        },
        {
          t: 'قواعد نحوية أساسية',
          intro: 'نتعرف اليوم على ركني الجملة الاسمية: المبتدأ والخبر. هذه القاعدة تساعدنا على قراءة صحيحة وكتابة صحيحة.',
          sections: [
            ['المبتدأ والخبر', 'الجملة الاسمية مثل «الشجرة مثمرة» تتكوّن من مبتدأ وخبر. المبتدأ هو الاسم الذي نبدأ به، والخبر ما نقوله عنه. كلاهما مرفوع.'],
            ['تطبيق القاعدة', 'في جملة «الزيتون ثمر مفيد» الزيتون مبتدأ و«ثمر مفيد» خبر. إذا حذفنا الخبر صارت الجملة ناقصة. ندرّب على تمييز كل ركن.']
          ],
          examples: [
            ['حدّد المبتدأ في: «الشجرة عالية»', ['ابدأ بالاسم الأول', 'اسأل: من الذي نخبر عنه؟', 'المبتدأ الشجرة'], 'الشجرة'],
            ['حدّد الخبر في: «الزيتون مفيد»', ['ابحث عمّا قيل عن الزيتون', 'الخبر يكمل المعنى', 'الخبر مفيد'], 'مفيد']
          ],
          questions: [
            ['ما ركنا الجملة الاسمية؟', ['المبتدأ والخبر', 'الفعل والفاعل', 'الاسم والصفة فقط', 'العنوان والنص'], 0, 'لأن الجملة الاسمية تتكوّن من اسم نبدأ به وخبر نخبر به عنه.'],
            ['في جملة «السماء صافية» ما الخبر؟', ['صافية', 'السماء', 'في', 'لا يوجد'], 0, 'لأن «صافية» هي ما قيل عن السماء، فهي الخبر.'],
            ['ماذا يحدث لو حذفنا الخبر؟', ['تصبح الجملة ناقصة المعنى', 'تصبح أجمل', 'لا يتغير شيء', 'تصبح سؤالا'], 0, 'لأن الخبر هو الذي يفيدنا بالمعنى عن المبتدأ.'],
            ['أي جملة اسمية كاملة؟', ['البستان واسع', 'في البستان', 'يذهب الولد', 'بستان كبير'], 0, 'لأنها تبدأ باسم وتحمل خبرا، بخلاف الخيارات الأخرى.']
          ]
        }
      ]
    },
    'cur_l_p3_sub_cul': {
      shared: {
        sections: [
          ['الثقافة في حياتنا', 'الثقافة هي ما نرثه من عادات ولغة وفنون. نراها في الأكل والملابس والأفراح. الاعتراف بها يعني احترام من حولنا.'],
          ['الفنون المغربية', 'يتميّز المغرب بزخارف الزليج والسيراميك والخط العربي. تُزيّن هذه الفنون المساجد والبيوت. كل نقشة تحمل معنى وتاريخا.'],
          ['المدن والمعالم', 'تضم المغرب مدنا مثل الرباط والدار البيضاء ومراكش وفاس. لكل مدينة طابعها الخاص. نعرفها على الخريطة ونحترم معالمها.'],
          ['المواطنة اليومية', 'المواطن الصالح يحترم النظام ويحافظ على النظافة. يساعد جيرانه ويقول الحقيقة. هذه الأعمال تبني مجتمعا أفضل.']
        ],
        vocab: [
          ['ثقافة', 'مجموعة العادات والفنون والقيم التي يتوارثها الناس'],
          ['زليج', 'فسيفساء مغربية من قطع صغيرة ملوّنة'],
          ['مواطنة', 'شعور الفرد بالمسؤولية تجاه مجتمعه'],
          ['معلم', 'مكان أو أثر له قيمة تاريخية أو ثقافية'],
          ['تعاون', 'أن يعمل أشخاص معا لتحقيق هدف'],
          ['احترام', 'تقدير الآخرين وحقوقهم']
        ],
        outcomes: [
          'أن يميّز التلميذ مظاهر الثقافة المغربية',
          'أن يذكر التلميذ أمثلة على الفنون المغربية',
          'أن يحدّد التلميذ بعض المدن المغربية على الخريطة',
          'أن يطبّق التلميذ سلوكات المواطنة في حياته اليومية'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'ثقافة المغرب وتنوّعها',
          intro: 'المغرب بلد غني بالثقافة. نتعرّف اليوم على بعض مظاهرها التي نراها في حياتنا.',
          sections: [
            ['ما هي الثقافة؟', 'الثقافة تشمل اللغة والطعام والملابس والأفراح. في المغرب نسمع العربية والأمازيغية. هذا التنوّع يجعل البلد غنيا.'],
            ['العادات اليومية', 'نشارك الطعام مع العائلة ونزور الأقارب في الأعياد. نحترم الكبار ونرحّب بالضيف. هذه العادات تربطنا ببعضنا.']
          ],
          examples: [
            ['اذكر مظهرا من مظاهر الثقافة المغربية', ['فكّر في ما تأكله في البيت', 'فكّر في اللغة التي تتكلمها', 'الكسكسي مظهر من مظاهر الثقافة'], 'الكسكسي'],
            ['اذكر لغتين تتكلمهما في المغرب', ['اسمع من حولك', 'فكّر في المدرسة والبيت', 'العربية والأمازيغية'], 'العربية والأمازيغية']
          ],
          questions: [
            ['ما المقصود بالثقافة المغربية؟', ['العادات والفنون واللغة', 'الطعام فقط', 'المدرسة فقط', 'اللعب فقط'], 0, 'لأن الثقافة تشمل كل ما يتوارثه الناس من عادات وفنون ولغة.'],
            ['أيّ لغتين تستعملان في المغرب؟', ['العربية والأمازيغية', 'الفرنسية والصينية فقط', 'الإنجليزية واليابانية', 'الإسبانية والروسية'], 0, 'لأن العربية والأمازيغية لغتان وطنيتان في المغرب.'],
            ['ماذا نفعل مع الضيف؟', ['نرحّب به ونكرمه', 'نتجاهله', 'نغلق الباب', 'نتركه وحده'], 0, 'لأن إكرام الضيف من العادات المغربية المتجذّرة.'],
            ['لماذا نحتفي بالتنوّع الثقافي؟', ['لأنه يثري حياتنا', 'لأنه يقلّل من الأصدقاء', 'لأنه يمنع اللعب', 'لأنه بلا فائدة'], 0, 'لأن اختلاف العادات يضيف الجمال والخبرة إلى حياة الناس.']
          ]
        },
        {
          t: 'الفن المغربي: الزليج والسيراميك',
          intro: 'الفن المغربي جميل ومعروف. نكتشف اليوم الزليج والسيراميك ونبحث عن معاني نقوشهما.',
          sections: [
            ['قطع الزليج', 'الزليج فسيفساء تُصنع من قطع صغيرة ملوّنة تُركّب جنبا إلى جنب. نرى الزليج في المساجد والقصور. الأشكال غالبا هندسية ومتكرّرة.'],
            ['السيراميك والخط', 'تُصنع الأطباق والأواني من الطين ثم تُزيّن. نرى أيضا الخط العربي على الجدران والأواني. هذه الفنون تجمع بين الصنعة والجمال.']
          ],
          examples: [
            ['ما الذي يُصنع منه الزليج؟', ['ننظر إلى الصورة', 'نلاحظ القطع الصغيرة', 'قطع ملوّنة تُركّب معا'], 'قطع صغيرة ملوّنة'],
            ['أين نرى الخط العربي؟', ['نتذكّر الجدران والأواني', 'نبحث في الأمثلة', 'على الجدران والأواني'], 'على الجدران والأواني']
          ],
          questions: [
            ['ما هو الزليج؟', ['فسيفساء من قطع ملوّنة', 'نوع من الطعام', 'لعبة شعبية', 'نوع من الملابس'], 0, 'لأن الزليج يُركّب من قطع صغيرة ملوّنة لتشكيل زخارف.'],
            ['من ماذا يُصنع السيراميك؟', ['من الطين', 'من الحديد', 'من الورق', 'من الزجاج'], 0, 'لأن الأواني الخزفية تُشكّل من الطين ثم تُحرق وتُزيّن.'],
            ['ما شكل النقوش في الزليج غالبا؟', ['هندسية متكرّرة', 'عشوائية بلا نظام', 'صور فقط', 'كلمات فقط'], 0, 'لأن الزخرفة المغربية تعتمد على أشكال هندسية منظّمة.'],
            ['لماذا نهتم بالفن التقليدي؟', ['لأنه جزء من هويتنا', 'لأنه سهل', 'لأنه جديد فقط', 'لأنه بلا قيمة'], 0, 'لأن الفن التقليدي يحمل ذاكرة الصنّاع ويُعبّر عن هوية البلد.']
          ]
        },
        {
          t: 'الرياضة في حياتنا',
          intro: 'الرياضة جزء من حياتنا اليومية. نتعرّف اليوم على ألعاب يحبّها الأطفال في المغرب.',
          sections: [
            ['الألعاب الشعبية', 'يلعب الأطفال كرة القدم في الساحات. كما نعرف ألعابا مثل «الحجلة» و«القفز بالحبل». هذه الألعاب تجمع الأولاد والبنات.'],
            ['فوائد اللعب', 'اللعب يقوّي الجسم وينمّي الصداقة. نتعلّم احترام القواعد والفوز والخسارة. الرياضة تجعلنا سعداء ونشطاء.']
          ],
          examples: [
            ['اذكر لعبة يحبّها الأطفال', ['فكّر في ساحة الحي', 'تذكّر لعبة الكرة', 'كرة القدم'], 'كرة القدم'],
            ['ما فائدة القفز بالحبل؟', ['نفكّر في حركة الجسم', 'نلاحظ نشاط القلب', 'يقوّي الجسم'], 'يقوّي الجسم']
          ],
          questions: [
            ['أيّ لعبة تُلفّ فيها الحبال؟', ['القفز بالحبل', 'كرة القدم', 'الشطرنج', 'السباحة'], 0, 'لأن هذه اللعبة تعتمد على قفز اللاعب فوق حبل يدور.'],
            ['ما فائدة الألعاب الشعبية في ساحة الحي؟', ['تقوية الجسم والصداقة', 'إضعاف الجسم', 'منع اللعب', 'الجلوس طويلا'], 0, 'لأن الحركة تنشّط الجسم واللعب الجماعي يبني الصداقة.'],
            ['ماذا نتعلّم من المباراة؟', ['احترام القواعد', 'الغش', 'الانسحاب', 'الشجار'], 0, 'لأن اللعب المنظّم يعلّمنا الالتزام بالقواعد واللعب بإنصاف.'],
            ['بعد خسارة فريقك في لعبة الحجلة بالساحة، ماذا تفعل؟', ['نهنئ الفائز ونحاول مجددا', 'نغضب', 'نترك الفريق', 'نلغي اللعبة'], 0, 'لأن روح الرياضة تعني احترام النتيجة والمحاولة مرة أخرى.']
          ]
        },
        {
          t: 'المواطنة الصالحة',
          intro: 'المواطنة سلوكات بسيطة نمارسها كل يوم. نتعلّم اليوم كيف نكون أفرادا صالحين في مجتمعنا.',
          sections: [
            ['النظافة والاحترام', 'نرمي النفايات في السلة ونحافظ على نظافة المدرسة. نحترم المعلّم والزملاء ونصغي إليهم. هذه الأعمال تعكس حسن الخلق.'],
            ['التعاون في الحي', 'نساعد الجار إذا احتاج إلى يد العون. نشارك في تنظيف الساحة. عندما يتعاون الجميع تصبح الحياة أجمل.']
          ],
          examples: [
            ['ماذا نفعل بالورقة بعد الأكل؟', ['ننظر إلى المكان', 'نبحث عن سلة النفايات', 'نضع الورقة في السلة'], 'نضعها في سلة النفايات'],
            ['كيف نساعد زميلا تعثر؟', ['نلاحظ ما حدث', 'نتقدّم بهدوء', 'نساعده على النهوض'], 'نساعده على النهوض']
          ],
          questions: [
            ['أي سلوك يدل على المواطنة؟', ['رمي النفايات في السلة', 'رميها في الشارع', 'كسر المقاعد', 'الصخب في الصف'], 0, 'لأن الحفاظ على النظافة مسؤولية كل فرد في المكان.'],
            ['كيف نتعامل مع الجار؟', ['بالاحترام والمساعدة', 'بالتجاهل', 'بالشجار', 'بالسخرية'], 0, 'لأن حسن الجوار من أساسات التعايش السلمي.'],
            ['ما معنى التعاون بين أفراد الحي؟', ['العمل معا لتحقيق هدف', 'العمل وحدك دائما', 'رفض المساعدة', 'تجنّب الآخرين'], 0, 'لأن التعاون يجمع جهود الناس فيعملون أفضل.'],
            ['لماذا نحترم القواعد؟', ['لأنها تنظّم حياتنا', 'لأنها مزعجة', 'لأنها قديمة', 'لأنها لا تُستخدم'], 0, 'لأن القواعد تحمي الجميع وتجعل الحياة اليومية أكثر نظاما.']
          ]
        }
      ]
    },
    'cur_l_p4_sub_isl': {
      shared: {
        sections: [
          ['العبادة في حياة المسلم', 'العبادة هي ما يتقرّب به المسلم من الله. منها الصلاة والصيام والزكاة. كل عبادة لها أثر في سلوكنا اليومي.'],
          ['الصلاة نور', 'الصلاة عماد الدين، يؤديها المسلم في أوقات معلومة. فيها قيام وركوع وسجود. نرى في الرسم هيئات الصلاة التي نتعلّمها في المسجد.'],
          ['الأخلاق في الإسلام', 'يأمر المسلم بالصدق والأمانة وحسن الخلق. لا يكذب ولا يغش ولا يؤذي أحدا. الخلق الحسن من أفضل ما يُعطى الإنسان.'],
          ['التعاون والقدوة', 'يحبّ المسلم أن يعمل مع إخوانه في الخير. التعاون على البرّ والتقوى من صفات المؤمنين. نقتدي بالنبي ﷺ في أخلاقه.']
        ],
        vocab: [
          ['عبادة', 'ما يفعله المسلم ليقترب من الله تعالى'],
          ['زكاة', 'إخراج جزء من المال لصالح الفقراء والمحتاجين'],
          ['صدق', 'قول الحقيقة وعدم الكذب'],
          ['أمانة', 'حفظ حقوق الآخرين وعدم الخيانة'],
          ['تعاون', 'مساعدة بعضنا بعضا في عمل الخير'],
          ['سيرة', 'حياة النبي ﷺ وأخلاقه وأعماله']
        ],
        outcomes: [
          'أن يشرح التلميذ معنى الزكاة وأثرها',
          'أن يميّز التلميذ بين الأخلاق الحميدة والسيئة',
          'أن يذكر التلميذ أمثلة على التعاون في حياته',
          'أن يذكر التلميذ درسا من سيرة النبي ﷺ'
        ],
        diagram: 'diagram-prayer.svg'
      },
      lessons: [
        {
          t: 'الزكاة: حق المال',
          intro: 'الزكاة عبادة فيها تعاون ومساعدة. نتعلّم معناها وأثرها في حياة الناس.',
          sections: [
            ['ما هي الزكاة؟', 'الزكاة إخراج جزء محدد من المال يعطى للفقراء والمحتاجين. هي حق للآخرين في مالنا. بها يتطهّر المال ويقوى التكافل بين الناس.'],
            ['أثر الزكاة', 'إذا أخرجنا الزكاة ساعدنا من لا يجد طعاما أو دواء. يشعر الفقير بالدفء والاطمئنان. ويزداد الغني شكرا لله على نعمته.']
          ],
          examples: [
            ['لماذا نُخرج الزكاة؟', ['نتذكّر أمر الله', 'ننظر إلى من يحتاج', 'لإعانة الفقراء والتطهّر'], 'لإعانة الفقراء والتطهّر'],
            ['ماذا يحدث إذا تعاون الناس؟', ['نتخيّل شخصا بلا طعام', 'نفكر في مساعدة الجميع', 'يقلّ الفقر ويكثر الخير'], 'يقلّ الفقر ويكثر الخير']
          ],
          questions: [
            ['ما معنى الزكاة؟', ['إخراج جزء من المال للمحتاجين', 'جمع المال لنفسك', 'شراء الألعاب', 'الدعاء فقط'], 0, 'لأن الزكاة حق يُخرج من المال ليصل إلى الفقراء والمحتاجين.'],
            ['من يستفيد من الزكاة؟', ['الفقراء والمحتاجون', 'الأغنياء فقط', 'الحيوانات فقط', 'لا أحد'], 0, 'لأن الزكاة شرعت لتسدّ حاجة من لا يملك ما يكفيه.'],
            ['ما الأثر الطيب للزكاة؟', ['نشر التكافل', 'زيادة الخلاف', 'منع الصلاة', 'تقليل الأصدقاء'], 0, 'لأن إعطاء المال للمحتاج يقوّي أواصر التعاون بين الناس.'],
            ['كيف يشكر الغني نعمة المال؟', ['بإخراج الزكاة', 'بالتفاخر', 'بالحفظ وحده', 'بالإنفاق على نفسه فقط'], 0, 'لأن إعطاء حق الله في المال من صور الشكر والطاعة.']
          ]
        },
        {
          t: 'الأخلاق الحميدة: الصدق والأدب',
          intro: 'حسن الخلق من أفضل ما يتحلى به المسلم. اليوم نتدرب على الصدق والاحترام في أقوالنا وأفعالنا.',
          sections: [
            ['الصدق في القول', 'الصدق هو قول الحقيقة وعدم الكذب، حتى في الأشياء الصغيرة. إذا أخطأنا نعترف بالخطأ. الصادق يحبّه الناس ويثقون به.'],
            ['الأدب مع الناس', 'الأدب أن نحسن الكلام ونصغي لغيرنا. نقول «من فضلك» و«شكرا» ونحترم الكبار. الأدب يظهر في المعاملة لا في المظهر فقط.']
          ],
          examples: [
            ['كسر صديق كتابا فقال: أنا لم ألمسه، وهو يعلم أنه لمسه. ماذا تقول؟', ['نتذكّر الصدق', 'ننظر إلى الفعل', 'قل الحقيقة واعتذر'], 'أقول الحقيقة وأعتذر'],
            ['طلبت من زميلك أن يناولك قلما. ماذا تقول؟', ['نتذكّر الأدب', 'نختار عبارة لطيفة', 'أقول: من فضلك'], 'من فضلك']
          ],
          questions: [
            ['ما معنى الصدق؟', ['قول الحقيقة', 'الكذب أحيانا', 'الصمت دائما', 'المزاح باستمرار'], 0, 'لأن الصدق هو مطابقة القول للحقيقة في كل الأحوال.'],
            ['أيّ سلوك من الأدب؟', ['قول من فضلك', 'مقاطعة المتكلّم', 'الضحك على الخطأ', 'تجاهل التحية'], 0, 'لأن العبارات اللطيفة تعبّر عن احترام الآخرين.'],
            ['ماذا يفعل الصادق إذا أخطأ؟', ['يعترف ويصحّح', 'ينكر', 'يلوم غيره', 'يخفي الخطأ'], 0, 'لأن الاعتراف بالخطأ أول خطوة إلى تصحيحه.'],
            ['لماذا يحب الناس الصادق؟', ['لأنهم يثقون به', 'لأنه كثير الكلام', 'لأنه قوي فقط', 'لأنه يكذب قليلا'], 0, 'لأن الصدق يبني الثقة، والثقة أساس المحبة.']
          ]
        },
        {
          t: 'التعاون على الخير',
          intro: 'التعاون صفة يحبّها الله. نرى اليوم كيف نعمل معا في المدرسة والحي.',
          sections: [
            ['التعاون في الصف', 'إذا نسي زميله قلما نعطه، وإذا لم يفهم مسألة نشرحها له. العمل الجماعي ينجز المهمة بسرعة. لا أحد يستغني عن الآخر.'],
            ['التعاون في الحي', 'نشارك في تنظيف الطريق، ونساعد الجار في حمل الأغراض. عندما نضيف جهودنا تصبح الأعمال الصعبة سهلة. هذه هي القوة الجماعية.']
          ],
          examples: [
            ['زميلك لم يحضر دفتره. ماذا تفعل؟', ['تنظر إلى حاجته', 'تتذكّر التعاون', 'أعطيه ورقة وأساعده'], 'أعطيه ما يحتاج وأساعده'],
            ['الفريق يحتاج إلى تنظيف الساحة. ماذا تفعل؟', ['أنضم إلى الفريق', 'أقوم بنصيبي', 'أنظّف معهم'], 'أنظّف مع الفريق']
          ],
          questions: [
            ['ما صورة التعاون في الصف؟', ['إعارة الزميل ما يحتاج', 'الاستئثار بالأقلام', 'الضحك عليه', 'العمل منفردا'], 0, 'لأن إعطاء الزميل حاجته يدل على روح المساعدة.'],
            ['ماذا ينتج عن التعاون؟', ['إنجاز العمل بسهولة', 'تأخير العمل', 'زيادة الخلاف', 'قلة الأصدقاء'], 0, 'لأن جهود الجميع تكمل بعضها فتخفّ المشقة.'],
            ['أيّ قول يشجّع على التعاون؟', ['تعالوا نعمل معا', 'أنا وحدي يكفي', 'لا تلمسوا أشيائي', 'ابتعدوا عني'], 0, 'لأن الدعوة للعمل الجماعي تعبّر عن روح التعاون.'],
            ['لماذا نحب التعاون؟', ['لأنه يقرّب القلوب', 'لأنه يكرهنا', 'لأنه بلا فائدة', 'لأنه يوقف العمل'], 0, 'لأن العمل المشترك يزيد المحبة ويرفع عن الناس الحرج.']
          ]
        },
        {
          t: 'السيرة النبوية: أخلاق نبينا ﷺ',
          intro: 'نتعرّف اليوم على بعض أخلاق النبي محمد ﷺ من سيرته العطرة، لنقتدي بها في حياتنا.',
          sections: [
            ['الصدق والأمانة', 'عُرف النبي ﷺ بالصدق والأمانة قبل الرسالة. كان الناس يثقون به ويسمّونه الصادق الأمين. حين أُئمن على مال غيره حفظه كاملا.'],
            ['الرحمة بالصغار', 'كان النبي ﷺ رحيما بالأطفال والضعفاء. كان يبتسم لهم ويسأل عن أحوالهم. الرحمة من أخلاق المؤمنين التي نحاول تطبيقها.']
          ],
          examples: [
            ['ماذا كان الناس ينادون النبي ﷺ قبل الرسالة؟', ['نتذكّر أخلاقه', 'ننظر إلى ثقة الناس', 'الصادق الأمين'], 'الصادق الأمين'],
            ['كيف نتعامل مع طفل صغير؟', ['نتذكّر رحمته ﷺ', 'نختار أسلوبا لطيفا', 'نبتسم له ونرفق به'], 'نبتسم له ونرفق به']
          ],
          questions: [
            ['بماذا عُرف النبي ﷺ؟', ['بالصدق والأمانة', 'بالكذب', 'بالقسوة', 'بالجبن'], 0, 'لأن الناس عرفوه بالصدق والأمانة حتى قبل بعثته.'],
            ['كيف كان يعامل الأطفال؟', ['بالرحمة والرفق', 'بالإهمال', 'بالغلظة', 'بالتجاهل'], 0, 'لأن السيرة تذكر رحمته ﷺ بالصغار والضعفاء.'],
            ['ماذا نستفيد من السيرة؟', ['قدوة في الأخلاق', 'نسيان التاريخ', 'الابتعاد عن الخير', 'تغيير الدين'], 0, 'لأن حياة النبي ﷺ تعلّمنا كيف نكون صادقين ورحماء.'],
            ['أيّ خلق نطبّقه في المدرسة؟', ['الأمانة والاحترام', 'الاستيلاء على الأشياء', 'الإهمال', 'السخرية'], 0, 'لأن الأمانة تعني الحفاظ على حقوق الزملاء واحترام ممتلكاتهم.']
          ]
        }
      ]
    },
    'cur_l_p5_sub_en': {
      shared: {
        sections: [
          ['Talking Every Day', 'We use short expressions many times a day. We greet people, ask questions and give thanks. The right words make our talk clear and kind.'],
          ['Reading Short Texts', 'A short text gives one main idea. We look at the title and read the sentences carefully. Then we find the information the question asks for.'],
          ['Writing Sentences', 'A sentence starts with a capital letter and ends with a full stop. It carries one complete idea. Good writing is simple and clear.'],
          ['Grammar Basics', 'A sentence needs a subject and a verb. The verb changes with the subject in the present tense. We use a or an before a singular countable noun.']
        ],
        vocab: [
          ['expression', 'a short phrase used in daily talk, such as Thank you'],
          ['greeting', 'words we say when we meet someone, like Hello'],
          ['text', 'a short piece of writing that gives information'],
          ['sentence', 'a group of words with a subject and a verb'],
          ['subject', 'the person or thing that does the action'],
          ['verb', 'the word that shows the action or state']
        ],
        outcomes: [
          'Learners use polite daily expressions in conversation',
          'Learners find specific information in a short text',
          'Learners write clear sentences with correct punctuation',
          'Learners identify the subject and verb in a sentence'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'Daily Expressions',
          intro: 'We use polite expressions every day. Let us learn how to greet, ask and thank people in English.',
          sections: [
            ['Greetings and Replies', 'When we meet someone we say "Hello" or "Good morning". The other person may say "Fine, thank you". We can ask "How are you?" to show we care.'],
            ['Being Polite', 'We say "Please" when we ask for something and "Thank you" when someone helps us. We say "Sorry" when we make a mistake. Polite words make people feel respected.']
          ],
          examples: [
            ['Your friend says "How are you?" What do you answer?', ['Listen to the greeting', 'Think about a polite reply', 'Say "I am fine, thank you."'], 'I am fine, thank you.'],
            ['Someone gives you a pen. What do you say?', ['Notice the kind action', 'Choose a polite word', 'Say "Thank you."'], 'Thank you.']
          ],
          questions: [
            ['What do you say in the morning?', ['Good morning', 'Good night', 'Goodbye', 'Sorry'], 0, '"Good morning" is the greeting used in the early part of the day.'],
            ['What do you say when you need help?', ['Please', 'Sorry', 'Goodbye', 'Welcome'], 0, '"Please" makes a request sound polite and friendly.'],
            ['What do you say after a mistake?', ['Sorry', 'Thank you', 'Hello', 'Please'], 0, 'Saying "Sorry" shows that you regret the mistake.'],
            ['Why do we use polite expressions?', ['to show respect', 'to speak loudly', 'to hide meaning', 'to finish quickly'], 0, 'Polite words show that we value and respect the other person.']
          ]
        },
        {
          t: 'Reading Short Texts',
          intro: 'Short texts give us information in a few lines. We will practise finding the key details in a simple passage.',
          sections: [
            ['Look at the Title', 'The title tells us what the text is about. Before reading, we can guess the topic. This guess helps us understand the sentences that follow.'],
            ['Find the Details', 'We read each sentence slowly and look for names, places and times. If a question asks "Where?", we search for a place word. We do not guess without evidence.']
          ],
          examples: [
            ['Text: "Sami is nine. He lives in Casablanca." How old is Sami?', ['Find the number in the text', 'Read the first sentence', 'Sami is nine'], 'nine'],
            ['Text: "The family has a cat and a dog." How many pets are there?', ['Find the animals', 'Read the sentence again', 'There are two pets'], 'two']
          ],
          questions: [
            ['What does a title help you do?', ['know the topic', 'count the letters', 'write a new text', 'close the book'], 0, 'The title gives a clue about what the text will discuss.'],
            ['In "Lina goes to school", where does Lina go?', ['to school', 'to the park', 'to the shop', 'to the beach'], 0, 'The phrase "goes to school" states the place directly.'],
            ['What should you do if you do not understand?', ['reread the sentence', 'stop forever', 'guess without reading', 'tear the page'], 0, 'Rereading gives another chance to find the meaning in the words.'],
            ['Why do we look for names and places?', ['they give key information', 'they are very long', 'they are at the end', 'they are not useful'], 0, 'Names and places often answer the questions we ask about a text.']
          ]
        },
        {
          t: 'Writing Sentences',
          intro: 'Writing is easier when we follow a few simple rules. Let us build clear sentences step by step.',
          sections: [
            ['Capital and Full Stop', 'Every sentence begins with a capital letter and ends with a full stop. For example: "The sun is bright." These signs show the reader where a sentence starts and stops.'],
            ['One Idea at a Time', 'A good sentence expresses one clear idea. We choose the words that say exactly what we mean. Then we read our sentence again to check it.']
          ],
          examples: [
            ['Write a sentence about your family', ['Start with a capital letter', 'Add a subject and a verb', 'End with a full stop: I love my family.'], 'I love my family.'],
            ['Correct: "the cat sleeps"', ['Look at the first letter', 'Make it a capital', 'Add a full stop: The cat sleeps.'], 'The cat sleeps.']
          ],
          questions: [
            ['How does a sentence start?', ['with a capital letter', 'with a full stop', 'with a comma', 'with a small letter'], 0, 'English sentences begin with a capital letter.'],
            ['How does a sentence usually end?', ['with a full stop', 'with a comma only', 'with a question mark always', 'with a space'], 0, 'A full stop shows that the sentence is complete.'],
            ['Which sentence about your brother is written correctly?', ['My brother plays football.', 'my brother plays football', 'My brother plays football', 'my brother plays football.'], 0, 'It has a capital letter at the start and a full stop at the end.'],
            ['Why do we reread our writing?', ['to check clarity and mistakes', 'to make it longer', 'to hide errors', 'to finish fast'], 0, 'Rereading helps us notice mistakes and improve the meaning.']
          ]
        },
        {
          t: 'Grammar Basics',
          intro: 'Grammar helps us put words in the right order. Today we look at the subject, the verb and a / an.',
          sections: [
            ['Subject and Verb', 'The subject is the person or thing that acts. The verb tells what the subject does. In "Ali plays", Ali is the subject and plays is the verb.'],
            ['A and An', 'We use "a" before a word beginning with a consonant sound, as in "a book". We use "an" before a vowel sound, as in "an apple". The article helps us talk about one thing.']
          ],
          examples: [
            ['Find the verb: "The girl reads a book."', ['Find the subject first', 'Look for the action word', 'The verb is reads'], 'reads'],
            ['Choose a or an: ____ orange', ['Listen to the first sound', 'It is a vowel sound', 'Use an: an orange'], 'an']
          ],
          questions: [
            ['In "The boy runs", what is the subject?', ['The boy', 'runs', 'The', 'boy runs'], 0, 'The subject is the person who does the action, here the boy.'],
            ['Which word tells what the swimmer does?', ['swims', 'table', 'blue', 'quickly'], 0, 'Swims shows an action, so it is a verb.'],
            ['We say ____ egg.', ['an', 'a', 'two', 'no'], 0, 'Egg begins with a vowel sound, so we use "an".'],
            ['Why do sentences need a verb?', ['to show the action', 'to make them long', 'to add colour', 'to end them'], 0, 'Without a verb, the sentence does not tell us what happens.']
          ]
        }
      ]
    },
    'cur_l_p5_sub_sport': {
      shared: {
        sections: [
          ['الجسم والحركة', 'يتكوّن جسمنا من أعضاء تساعدنا على الحركة. الأرجل تمشي وتجري، والذراعان ترفعان وتدفعان. نحرك أعضاءنا بطريقة صحيحة.'],
          ['الحركات الأساسية', 'من الحركات المهمة: المشي والجري والقفز والرمي. كل حركة تستخدم عضلات معيّنة. التكرار المنتظم يقوّي الجسم.'],
          ['اللعب الجماعي', 'الألعاب الرياضية تُمارَس مع الزملاء. نحتاج إلى احترام القواعد والاستماع إلى المعلّم. الفريق ينجح عندما يتعاون أفراده.'],
          ['الرياضة والصحة', 'الرياضة تقوّي القلب وتحسّن المزاج. تساعدنا على النوم الجيد والتركيز في الدراسة. قليل من الحركة كل يوم يحدث فرقا.']
        ],
        vocab: [
          ['حركة', 'تغيير وضع الجسم أو جزء منه'],
          ['عضلة', 'جزء من الجسم ينقبض وينبسط ليحرك العضو'],
          ['جري', 'حركة سريعة للقدمين تستخدم في الألعاب'],
          ['تعاون', 'عمل الفريق معا لتحقيق هدف مشترك'],
          ['قاعدة', 'تعليمة تنظّم بها المباراة'],
          ['لياقة', 'قدرة الجسم على الحركة والنشاط']
        ],
        outcomes: [
          'أن يؤدي التلميذ حركات أساسية بطريقة صحيحة',
          'أن يسمّي التلميذ أعضاء الجسم المستعملة في كل حركة',
          'أن يلتزم التلميذ بقواعد لعبة جماعية',
          'أن يشرح التلميذ فائدة الرياضة للصحة'
        ],
        diagram: 'diagram-body.svg'
      },
      lessons: [
        {
          t: 'الحركات الأساسية: الجري والقفز',
          intro: 'نبدأ اليوم بحركات بسيطة نعرفها جميعا. نجرّبها في مكان آمن وننتبه إلى أعضاء جسمنا.',
          sections: [
            ['الجري بانتظام', 'الجري يعني تحريك القدمين بسرعة مع ضبط النفس. نبدأ ببطء ثم نزيد السرعة قليلا. نتنفس بعمق حتى لا نتعب بسرعة.'],
            ['القفز بأمان', 'نقفز على قدمينا معا، ثم نهبط بهدوء. نثني الركبتين عند النزول لتخفيف الضرر. نترك مسافة كافية بين الزملاء.']
          ],
          examples: [
            ['كيف نستعد للجري؟', ['ننظر إلى المكان', 'نفرد الذراعين', 'نبدأ بخطوات بطيئة'], 'نبدأ بخطوات بطيئة'],
            ['كيف نهبط بعد القفز؟', ['ننتظر النزول', 'نثني الركبتين', 'نلمس الأرض بهدوء'], 'نثني الركبتين']
          ],
          questions: [
            ['أي عضو نستعمله في الجري أكثر؟', ['القدمان', 'العينان', 'الأذنان', 'الأنف'], 0, 'لأن الجري يعتمد على حركة القدمين بالتناوب.'],
            ['لماذا نثني الركبتين عند النزول؟', ['لتقليل الصدمة', 'لإطالة القفزة', 'لإغلاق العينين', 'لزيادة السرعة'], 0, 'لأن ثني الركبتين يمتصّ الصدمة ويحمي المفاصل.'],
            ['أي مكان يصلح للجري؟', ['ساحة واسعة وآمنة', 'الشارع المزدحم', 'الدرج الضيق', 'غرفة مظلمة'], 0, 'لأن المكان الواسع يمنع التصادم مع الآخرين.'],
            ['ماذا نفعل قبل الحركة؟', ['نتأكد من سلامة المكان', 'نركض فورا', 'نغلق أعيننا', 'ندفع زميلا'], 0, 'لأن التنبيه إلى المكان يمنع الإصابات قبل البدء.']
          ]
        },
        {
          t: 'الألعاب الرياضية: كرة القدم',
          intro: 'كرة القدم لعبة يحبّها كثير من الأطفال. نتعلّم اليوم كيف نلعبها بأمان وروح جماعية.',
          sections: [
            ['أساسيات اللعبة', 'يلعب فريقان بالكرة نحو هدف واحد. نركل الكرة بالقدم ونمرّرها للزميل. الهدف أن تُدخل الكرة داخل المرمى.'],
            ['القواعد والإنصاف', 'لا نلمس الكرة باليد، ولا نعترض اللاعب الآخر بعنف. نحترم حكم المباراة ونقبل النتيجة. اللعب النظيف أهم من الفوز.']
          ],
          examples: [
            ['كيف نمرّر الكرة؟', ['ننظر إلى الزميل', 'ندفع الكرة بجانب القدم', 'نرسلها نحوه'], 'ندفع الكرة نحو الزميل'],
            ['ماذا نفعل إذا اختلفنا على خطأ؟', ['نتوقف عن اللعب', 'نستمع إلى الحكم', 'نكمل باحترام'], 'نحترم قرار الحكم']
          ],
          questions: [
            ['كم فريقا يلعب كرة القدم؟', ['فريقان', 'فريق واحد', 'ثلاثة فرق', 'لا أحد'], 0, 'لأن المباراة تقوم بين فريقين يحاول كل منهما إدخال الكرة في المرمى.'],
            ['أي عضو نستعمله أساسا؟', ['القدم', 'اليد', 'الأنف', 'الشعر'], 0, 'لأن قواعد اللعبة تسمح بلمس الكرة بالقدم أساسا.'],
            ['ما معنى اللعب النظيف؟', ['احترام القواعد والخصم', 'الغش', 'الشجار', 'إيقاف اللعب'], 0, 'لأن اللعب النظيف يعني الالتزام بالقواعد واحترام الجميع.'],
            ['كيف نتصرّف بعد المباراة؟', ['نصافح الفريق الآخر', 'نغضب', 'نكسر الكرة', 'نهرب'], 0, 'لأن المصافحة تعبّر عن الاحترام بعد بذل الجهد.']
          ]
        },
        {
          t: 'العمل الجماعي في الرياضة',
          intro: 'الفريق لا ينجح إلا إذا تعاون أفراده. نتعلّم اليوم كيف نعمل معا داخل الملعب.',
          sections: [
            ['دور كل لاعب', 'لكل لاعب مهمة: من يمرّر، ومن يستقبل، ومن يحرس المرمى. إذا قام كل واحد بدوره انتظم الفريق. لا يحتاج الفريق إلى لاعب واحد فقط.'],
            ['التشجيع والاستماع', 'نشجّع الزميل إذا أخطأ ونستمع لتعليمات المعلّم. نرفع اليد عند الحاجة بدل الصراخ. التعاون يصنع فريقا قويا.']
          ],
          examples: [
            ['زميلك سقط أثناء اللعب. ماذا تفعل؟', ['تتوقف عن الجري', 'تساعده على النهوض', 'تتابع اللعب معه'], 'أساعده على النهوض'],
            ['كيف تطلب الكرة من زميلك؟', ['تناديه بهدوء', 'ترفع يدك', 'تنتظر التمريرة'], 'أرفع يدي وأطلب بهدوء']
          ],
          questions: [
            ['لماذا يحتاج الفريق إلى التعاون؟', ['لأن الجهود تكمل بعضها', 'لأن اللعب سهل', 'لأن القواعد قليلة', 'لأن الوقت طويل'], 0, 'لأن كل لاعب يؤدي دورا، ومجموع الأدوار يصنع نجاح الفريق.'],
            ['ما دور حارس المرمى؟', ['حماية المرمى', 'ركل الكرة دائما', 'الجلوس على الأرض', 'تحديد الوقت'], 0, 'لأن الحارس يقف أمام المرمى لمنع دخول الكرة.'],
            ['كيف نشجّع زميلا أخطأ؟', ['نقول له حاول مرة أخرى', 'نسخر منه', 'نطرده', 'نصمت'], 0, 'لأن التشجيع يزيد ثقة الزميل ويحافظ على روح الفريق.'],
            ['ما أثر الاستماع للمعلّم؟', ['تنظيم اللعب', 'زيادة الفوضى', 'طول الوقت', 'قلة الحركة'], 0, 'لأن تعليمات المعلّم تنظّم الأدوار وتحافظ على الأمان.']
          ]
        },
        {
          t: 'الرياضة والصحة',
          intro: 'الحركة صديقة لجسمنا. نكتشف اليوم كيف تساعدنا الرياضة على العيش بصحة ونشاط.',
          sections: [
            ['فوائد للجسم', 'الرياضة تقوّي عضلات القلب وتحسّن التنفس. تنشّط الدورة الدموية وتساعد على النوم. الجسم المتحرك يكون أكثر قدرة على التركيز.'],
            ['عادات يومية بسيطة', 'يمكننا المشي قليلا بعد المدرسة واللعب في الساحة. نبدأ بحركة خفيفة ونزيدها تدريجيا. الأهم أن نداوم كل يوم بدل أن نجلس طويلا.']
          ],
          examples: [
            ['كيف تقوّي صحتك بالحركة؟', ['تختار لعبة تحبها', 'تخصّص وقتا قصيرا يوميا', 'تواظب عليها'], 'أواطب على حركة قصيرة كل يوم'],
            ['ماذا تفعل بعد المدرسة؟', ['أجلس طويلا', 'أمشي أو ألعب قليلا', 'أنام فورا'], 'أمشي أو ألعب قليلا']
          ],
          questions: [
            ['أي فائدة للرياضة؟', ['تقوية القلب', 'إضعاف النوم', 'تقليل التنفس', 'زيادة التعب'], 0, 'لأن الحركة المنتظمة تنشّط القلب وتحسّن قدرة الجسم.'],
            ['ما أفضل عادة يومية؟', ['حركة قصيرة ومنتظمة', 'حركة كبيرة مرة واحدة', 'الجلوس طويلا', 'النوم طول النهار'], 0, 'لأن الاستمرار اليومي أفضل من المجهود الكبير النادر.'],
            ['كيف تساعد الرياضة الدراسة؟', ['تحسّن التركيز', 'تزيد النسيان', 'تمنع القراءة', 'تجعلنا متأخرين'], 0, 'لأن الجسم النشيط والذهن المرتاح يساعدان على الانتباه.'],
            ['متى نتوقف عن اللعب؟', ['عند التعب الشديد', 'عند الفوز فقط', 'عند نهاية الساعة فقط', 'أبدا'], 0, 'لأن الإصغاء إلى جسمنا يحمينا من الإرهاق.']
          ]
        }
      ]
    },
    'cur_l_p6_sub_histgeo': {
      shared: {
        sections: [
          ['المغرب بلدي', 'المغرب بلد في شمال غرب إفريقيا. يطلّ على المحيط الأطلسي والبحر الأبيض المتوسط. عاصمته الرباط، ومن مدنه الكبيرة الدار البيضاء ومراكش.'],
          ['العالم من حولنا', 'العالم يتكوّن من قارات وبلدان كثيرة. لكل بلد لغاته وعاداته وطبيعته. ندرس الأماكن لنفهم كيف يعيش الناس.'],
          ['الخريطة والاتجاهات', 'الخريطة رسم مصغّر لمكان أكبر. نقرأ رموزها وعنوانها ونحدّد الجهات: شمال وجنوب وشرق وغرب. المفتاح يشرح معنى كل رمز.'],
          ['البيئة والمسؤولية', 'البيئة هي الهواء والماء والتراب والكائنات الحية. نحافظ عليها بعدم تلويثها وترشيد الماء. كل فرد مسؤول عن نظافة مكانه.']
        ],
        vocab: [
          ['خريطة', 'رسم مصغّر يوضّح معالم مكان ما'],
          ['قارة', 'مساحة كبيرة من اليابسة تضم بلدانا كثيرة'],
          ['اتجاه', 'جهة نحدّدها مثل الشمال أو الغرب'],
          ['عاصمة', 'المدينة التي تقع فيها الإدارة الرئيسية للبلد'],
          ['بيئة', 'ما يحيط بنا من هواء وماء وتراب وكائنات'],
          ['مورد', 'ما نستعمله من الطبيعة مثل الماء والغابات']
        ],
        outcomes: [
          'أن يحدّد التلميذ موقع المغرب على الخريطة',
          'أن يميّز التلميذ القارات والبحار الرئيسية',
          'أن يقرأ التلميذ الاتجاهات والرموز على خريطة بسيطة',
          'أن يقترح التلميذ أعمالا لحماية البيئة'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'المغرب: بلدي ومكانه',
          intro: 'نتعرّف اليوم على بلدنا المغرب ومكانه في القارة الإفريقية. نقرأ الخريطة ونحدّد معالمه.',
          sections: [
            ['موقع المغرب', 'يقع المغرب في شمال غرب إفريقيا. يحدّه المحيط الأطلسي من الغرب والبحر الأبيض المتوسط من الشمال. هذه المواقع جعلت له مناخا متنوعا.'],
            ['مدن ومعالم', 'الرباط عاصمة المغرب، والدار البيضاء أكبر مدنها. في الجبال توجد غابات الأرز، وفي الجنوب توجد الواحات. كل جهة لها طابعها.']
          ],
          examples: [
            ['أين يقع المغرب؟', ['ننظر إلى خريطة إفريقيا', 'نبحث في الجهة الشمالية الغربية', 'في شمال غرب إفريقيا'], 'في شمال غرب إفريقيا'],
            ['ما عاصمة المغرب؟', ['ننظر إلى الخريطة', 'نبحث عن رمز العاصمة', 'الرباط'], 'الرباط']
          ],
          questions: [
            ['أي بحر يطلّ عليه المغرب من الشمال؟', ['البحر الأبيض المتوسط', 'البحر الأحمر', 'بحر الشمال', 'المحيط الهندي'], 0, 'لأن المغرب يقع في الشمال النهائي للقارة ويطلّ على البحر الأبيض المتوسط.'],
            ['أي مدينة مغربية هي العاصمة؟', ['الرباط', 'مراكش', 'فاس', 'طنجة'], 0, 'لأن الرباط هي المدينة التي تضم الإدارة الرئيسية للبلد.'],
            ['أين توجد غابات الأرز؟', ['في الجبال', 'في البحر', 'في الصحراء فقط', 'في المدينة'], 0, 'لأن أشجار الأرز تنمو في المناطق الجبلية الباردة.'],
            ['لماذا ندرس موقع بلدنا؟', ['لنعرف مكانه وخصائصه', 'لنغيّر اسمه', 'لننسى تاريخه', 'للعب فقط'], 0, 'لأن معرفة الموقع تساعدنا على فهم المناخ والطبيعة والحياة اليومية.']
          ]
        },
        {
          t: 'العالم: القارات والبلدان',
          intro: 'المغرب جزء من عالم واسع. اليوم نتعرّف على القارات وكيف نفرّق بين البلدان.',
          sections: [
            ['القارات', 'اليابسة تنقسم إلى قارات مثل إفريقيا وأوروبا وآسيا. المغرب يقع في قارة إفريقيا. أوروبا تقابلها عبر البحر الأبيض المتوسط.'],
            ['بلدان مختلفة', 'لكل بلد اسم وعاصمة ولغة. الناس في البلدان المختلفة يأكلون ويلبسون بطرق متنوعة. نحترم هذه الاختلافات ونتعلّم منها.']
          ],
          examples: [
            ['في أي قارة يقع المغرب؟', ['ننظر إلى الخريطة', 'نجد قارة إفريقيا', 'في إفريقيا'], 'إفريقيا'],
            ['ما الذي يختلف بين البلدان؟', ['نفكر في اللغة والطعام', 'نقارن بين عادات الناس', 'اللغة والعادات'], 'اللغة والعادات']
          ],
          questions: [
            ['كم قارة تقريبا في العالم؟', ['سبع', 'اثنتان', 'عشر', 'واحدة'], 0, 'لأن اليابسة تنقسم إلى سبع قارات معروفة.'],
            ['أي قارة تقابل المغرب عبر المتوسط؟', ['أوروبا', 'آسيا', 'أمريكا', 'أوقيانوسيا'], 0, 'لأن الضفة الشمالية للبحر الأبيض المتوسط تقع فيها أوروبا.'],
            ['ما الذي يميّز البلدان؟', ['لغاتها وعاداتها', 'لون الخريطة فقط', 'عدد الحروف', 'لا شيء'], 0, 'لأن كل بلد له لغة وتاريخ وعادات تخصّه.'],
            ['كيف نتعامل مع اختلاف الشعوب؟', ['بالاحترام والفضول', 'بالسخرية', 'بالرفض', 'بالجهل'], 0, 'لأن الاحترام يسمح لنا بالتعلّم من تجارب الآخرين.']
          ]
        },
        {
          t: 'قراءة الخريطة والاتجاهات',
          intro: 'الخريطة لغة مرئية نقرأها اليوم. نتعلّم الاتجاهات والرموز لنجد الأماكن بدقة.',
          sections: [
            ['الجهات الأربع', 'أعلى الخريطة جهة الشمال، وأسفلها الجنوب. اليمين شرق واليسار غرب. نستخدم بوصلة صغيرة أو سهم الشمال لتحديد الجهة.'],
            ['المفتاح والرموز', 'المفتاح يشرح ما تعنيه النقاط والخطوط. النقطة الصغيرة قد تعني مدينة، والخط الأزرق قد يعني نهرا. بدون المفتاح لا نفهم الخريطة جيدا.']
          ],
          examples: [
            ['إذا كان الشمال في الأعلى، فأين الشرق؟', ['ننظر إلى السهم', 'نحدد اليمين', 'الشرق على اليمين'], 'على اليمين'],
            ['كيف نعرف رمز مدينة على الخريطة؟', ['ننظر إلى المفتاح', 'نقرأ شرح النقطة', 'نفهم أنها مدينة'], 'نراجع مفتاح الخريطة']
          ],
          questions: [
            ['أين جهة الشمال عادة على الخريطة؟', ['في الأعلى', 'في الأسفل', 'على اليمين', 'على اليسار'], 0, 'لأن الخرائط تُرسم وفق اتفاق شائع يجعل الشمال في الأعلى.'],
            ['ما وظيفة مفتاح الخريطة؟', ['شرح الرموز', 'تلوين الخريطة', 'طيّ الخريطة', 'كتابة العنوان'], 0, 'لأن المفتاح يخبرنا ماذا تعني كل نقطة أو خط أو لون.'],
            ['إذا كانت المدينة غرب النهر فأين النهر منها؟', ['شرقها', 'غربها', 'شمالها', 'جنوبها'], 0, 'لأن الجهة المعاكسة للغرب هي الشرق.'],
            ['لماذا نحتاج إلى سهم الشمال؟', ['لتحديد الاتجاهات', 'لعدّ المدن', 'لقياس المسافة', 'لتلوين البحر'], 0, 'لأن السهم يخبرنا أي جهة هي الشمال فنستدل على باقي الجهات.']
          ]
        },
        {
          t: 'البيئة وحمايتها',
          intro: 'بيئتنا هي ما نعيش فيه من هواء وماء وتراب. اليوم نبحث في كيف نحافظ عليها.',
          sections: [
            ['عناصر البيئة', 'البيئة تضم الهواء النقي والماء العذب والتراب والغابات والحيوانات. كل عنصر يؤثر في الآخر. إذا تلوّث الماء تأثرت الكائنات التي تشرب منه.'],
            ['سلوكات تحمي البيئة', 'نرمي النفايات في سلة مخصّصة، ونغلق الصنبور بعد استعمال الماء. نطفئ الضوء عند الخروج من الغرفة، ونزرع شجرة من حين إلى آخر. الماء مورد ثمين، وترشيد استعماله يترك نصيبا للآخرين وللأجيال القادمة.']
          ],
          examples: [
            ['كيف تحافظ على الماء؟', ['ننظر إلى الصنبور', 'نغلقه بعد الشرب', 'لا نتركه مفتوحا'], 'أغلق الصنبور بعد الاستعمال'],
            ['ماذا نفعل بالأوراق المستعملة؟', ['ننظر إلى سلة النفايات', 'نضعها في المكان المخصص', 'لا نرميها في الشارع'], 'أضعها في سلة النفايات']
          ],
          questions: [
            ['ما أفضل طريقة للمحافظة على الماء؟', ['إغلاق الصنبور بعد الاستعمال', 'تركه مفتوحا', 'إلقاء النفايات فيه', 'إشعال النار قربه'], 0, 'لأن إغلاق الصنبور يوقف الهدر ويحافظ على مورد ثمين.'],
            ['أي سلوك يضرّ بالبيئة؟', ['رمي البلاستيك في الشارع', 'زرع شجرة', 'تنظيف الساحة', 'ترشيد الضوء'], 0, 'لأن البلاستيك المتروك يلوّث التراب والماء ويؤذي الكائنات الحية.'],
            ['لماذا نزرع الأشجار في شارع المدرسة؟', ['لأنها تنقّي الهواء وتظللنا', 'لأنها تقلل الماء', 'لأنها تلوّث', 'لأنها لا تنفع'], 0, 'لأن الأشجار تمتصّ ثاني أكسيد الكربون وتوفّر الظل والفواكه.'],
            ['ما معنى ترشيد الاستعمال؟', ['استعمال ما نحتاجه فقط', 'استعمال كل شيء', 'تجنّب كل شيء', 'شراء المزيد دائما'], 0, 'لأن الترشيد يعني الاعتدال حتى تبقى الموارد للآخرين.']
          ]
        }
      ]
    }
  }
}
