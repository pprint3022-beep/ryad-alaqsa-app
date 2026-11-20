module.exports = {
  units: {
    'cur3': {
      shared: {
        sections: [
          ['Les lettres et les sons', "En français, les lettres forment des sons. On apprend à reconnaître chaque lettre et à la prononcer. Les lettres s'assemblent pour créer des mots."],
          ['Lire à haute voix', "La lecture à haute voix aide à entendre les sons. On lit lentement, puis on lit plus vite. La voix marque la fin d'une phrase."],
          ['Le sens des mots', "Chaque mot porte un sens. On peut le deviner grâce à l'image ou à la phrase. Relire aide à mieux comprendre."],
          ['La ponctuation', "Les signes comme le point et la virgule guident la lecture. Le point marque une pause plus longue. La question se termine par un point d'interrogation."]
        ],
        vocab: [
          ['lettre', "Un signe écrit comme a, b, c qui forme un mot."],
          ['mot', "Un ensemble de lettres qui a un sens."],
          ['phrase', "Un ensemble de mots qui exprime une idée complète."],
          ['son', "Ce que l'on entend quand on prononce une lettre."],
          ['point', "Un signe qui marque la fin d'une phrase."],
          ['lecture', "L'action de lire un texte."]
        ],
        outcomes: [
          "Nommer et reconnaître les lettres de l'alphabet français.",
          'Lire des mots simples à haute voix.',
          "Comprendre le sens d'une phrase courte.",
          'Respecter les signes de ponctuation en lecture.'
        ],
        diagram: 'diagram-french-alphabet.svg'
      },
      lessons: [
        {
          t: "L'alphabet français",
          intro: "L'alphabet français compte vingt-six lettres. On les apprend dans un ordre précis pour lire et écrire.",
          sections: [
            ['Les voyelles et les consonnes', "Les voyelles sont a, e, i, o, u et y. Les autres lettres sont des consonnes. Les voyelles donnent de la voix aux mots."],
            ["L'ordre des lettres", "On apprend l'alphabet de A à Z. Certaines lettres se ressemblent comme b et d. Écrire chaque lettre aide à la mémoriser."]
          ],
          examples: [
            ["Retrouver l'ordre", ["Écris les lettres a, b, c.", 'Ajoute d et e après c.', "Lis l'ordre à voix haute."], 'a, b, c, d, e'],
            ['Compter les voyelles', ["Cherche les voyelles dans le mot école.", 'Tu trouves é, o, e.', "Compte-les : il y en a trois."], 'Trois voyelles']
          ],
          questions: [
            ['Quelle lettre vient après b ?', ['c', 'a', 'd', 'z'], 0, "Dans l'ordre de l'alphabet, c suit directement b."],
            ["Combien de lettres l'alphabet français contient-il de A à Z ?", ['26', '24', '20', '30'], 0, "L'alphabet français contient vingt-six lettres, de A à Z."],
            ['Quel groupe contient seulement des voyelles ?', ['a, e, i', 'b, c, d', 'm, n, p', 's, t, r'], 0, 'a, e et i sont des voyelles ; les autres groupes ont des consonnes.'],
            ['Pourquoi apprend-on l’alphabet ?', ['Pour lire et écrire les mots', 'Pour dessiner', 'Pour courir', 'Pour chanter'], 0, "Connaître les lettres permet de lire et d'écrire tous les mots."]
          ]
        },
        {
          t: 'Les mots simples',
          intro: "Un mot simple est formé de quelques lettres. On peut le lire, l'écrire et le relier à une image.",
          sections: [
            ['Des mots courts aux mots longs', "On commence par des mots comme papa ou maman. Puis on lit des mots plus longs comme école. Découper le mot en syllabes aide à le lire."],
            ["Le mot et l'image", "Une image peut aider à deviner un mot. Le mot chat correspond à un dessin de chat. Vérifier avec l'enseignant confirme la lecture."]
          ],
          examples: [
            ['Lire un mot avec une image', ["Regarde le dessin d'un arbre.", 'Lis les lettres a-r-b-r-e.', 'Dis le mot : arbre.'], 'arbre'],
            ['Découper en syllabes', ['Prends le mot soleil.', 'Sépare so-leil.', 'Lis chaque partie puis le mot entier.'], 'so-leil']
          ],
          questions: [
            ['Quel mot correspond à un dessin de maison ?', ['maison', 'chat', 'livre', 'arbre'], 0, "Le dessin d'une maison représente le mot maison."],
            ['Combien de syllabes dans le mot maman ?', ['2', '1', '3', '4'], 0, 'On entend ma-man, soit deux syllabes.'],
            ['Quel est un mot court ?', ['papa', 'éléphant', 'ordinateur', 'bibliothèque'], 0, 'papa ne contient que quatre lettres, contrairement aux autres.'],
            ['Quelle méthode aide à lire un mot long comme école ?', ['Le découper en syllabes', 'Fermer les yeux', 'Le sauter', 'Le colorier'], 0, 'Découper en syllabes rend la lecture plus facile.']
          ]
        },
        {
          t: 'Les phrases courtes',
          intro: "Une phrase assemble des mots pour dire quelque chose. Elle commence par une majuscule et se termine par un point.",
          sections: [
            ['Construire une phrase', "Une phrase simple dit qui fait quoi. Par exemple : Le chat dort. On place une majuscule au début et un point à la fin."],
            ['La phrase et le sens', "L'ordre des mots donne du sens à la phrase. « Le chat mange » n'a pas le même sens que « Le rat mange ». Relire vérifie la phrase."]
          ],
          examples: [
            ['Compléter une phrase', ["Commence par : Le chat ...", "Choisis l'action : dort.", 'Ajoute un point à la fin.'], 'Le chat dort.'],
            ['Trouver la majuscule', ['Lis : le soleil brille.', 'Cherche le premier mot.', 'Écris : Le soleil brille.'], 'Le soleil brille.']
          ],
          questions: [
            ["Que faut-il mettre au début d'une phrase ?", ['Une majuscule', 'Un point', 'Une virgule', 'Un espace'], 0, 'Toute phrase commence par une lettre majuscule.'],
            ['Quel signe termine une phrase ?', ['Le point', 'Le tiret', 'Les guillemets', 'Les parenthèses'], 0, "Le point marque la fin d'une phrase."],
            ['Quelle phrase a du sens ?', ['Le chien court.', 'Court le chien le.', 'Le court chien.', 'Chien le court.'], 0, "Seule cette phrase respecte l'ordre qui donne un sens."],
            ['Pourquoi relire sa phrase ?', ['Pour vérifier le sens', 'Pour la rendre plus longue', 'Pour changer de couleur', 'Pour compter les mots'], 0, 'Relire permet de corriger le sens et les erreurs.']
          ]
        }
      ]
    },
    'cur11': {
      shared: {
        sections: [
          ['الحرف والكلمة', 'يتكون الكلام من حروف تتجمع لتصنع كلمات. ننطق الحرف بصوته الصحيح ثم نقرأ الكلمة. الحروف العربية تتصل عند الكتابة.'],
          ['القراءة بصوت عالٍ', 'تساعد القراءة بصوت عالٍ على تمييز الأصوات. نقرأ ببطء ثم نزيد السرعة. الوقف عند علامات الترقيم يجعل القراءة أوضح.'],
          ['معنى الكلمة', 'لكل كلمة معنى نفهمه من السياق أو من الصورة. نربط الكلمة بمعناها في جملة. إعادة القراءة تزيد الفهم.'],
          ['الجملة المفيدة', 'تتكون الجملة من كلمات تعبر عن فكرة كاملة. نرتب الكلمات ترتيباً صحيحاً لنفهم المعنى. نختم الجملة بعلامة مثل النقطة.']
        ],
        vocab: [
          ['حرف', 'أصغر وحدة في الكتابة مثل ب أو ت.'],
          ['كلمة', 'مجموعة من الحروف لها معنى.'],
          ['جملة', 'مجموعة من الكلمات تعبر عن فكرة تامة.'],
          ['نطق', 'إخراج الصوت من الفم عند قراءة الحرف.'],
          ['صورة', 'رسم يساعد على فهم معنى الكلمة.'],
          ['قراءة', 'النظر إلى الكلمات ونطقها لفهم المعنى.']
        ],
        outcomes: [
          'يميّز الطالب بين الحروف المتصلة والمنفصلة.',
          'يقرأ كلمات مكونة من مقطعين قراءة صحيحة.',
          'يكوّن جملة اسمية بسيطة.',
          'يربط بين الكلمة ومعناها في جملة.'
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'الحروف المتصلة والمنفصلة',
          intro: 'الحروف العربية تتغير أشكالها حسب موقعها في الكلمة. نتعلم كيف نصل الحروف ونقرأها.',
          sections: [
            ['أشكال الحرف في الكلمة', 'للحرف العربي أشكال مختلفة في أول الكلمة ووسطها وآخرها. نلاحظ شكل الحرف ثم ننطق صوته. التدريب يثبت الحفظ.'],
            ['حروف لا تتصل', 'بعض الحروف لا تتصل بما بعدها مثل الألف والواو. نكتبها منفصلة ثم نكمل بقية الكلمة. نقرأ الكلمة بعد كتابتها.']
          ],
          examples: [
            ['وصل حروف كلمة باب', ['نكتب الباء في الأول.', 'نضيف الألف ثم الباء.', 'نقرأ: باب.'], 'باب'],
            ['تمييز الحرف المنفصل', ['ننظر إلى كلمة ولد.', 'نجد الواو لا تتصل.', 'نكتب بقية الحروف.'], 'الواو منفصلة']
          ],
          questions: [
            ['أي حرف لا يتصل بما بعده؟', ['الألف', 'الباء', 'التاء', 'الجيم'], 0, 'الألف حرف منفصل لا يتصل بالحرف الذي يليه.'],
            ['كم شكلاً للحرف العربي في الكلمة؟', ['أربعة', 'اثنان', 'ثلاثة', 'واحد'], 0, 'للحرف العربي أربعة أشكال: منفصل، وأول، ووسط، وآخر.'],
            ['كيف نقرأ كلمة باب؟', ['با + ب', 'ب + ا + ب', 'ب + ب', 'ا + ب'], 0, 'نقطع الكلمة إلى صوتين: با وب، ثم ندمجهما.'],
            ['لماذا نتدرب على كتابة الحروف؟', ['لنحسن القراءة والكتابة', 'لنلعب', 'لننام', 'لنأكل'], 0, 'التدريب المتكرر يساعد على إتقان شكل الحرف ونطقه.']
          ]
        },
        {
          t: 'قراءة كلمات من مقطعين',
          intro: 'نقرأ اليوم كلمات تتكون من مقطعين مثل كتاب ومدرسة. نقطع الكلمة لنقرأها بسهولة.',
          sections: [
            ['تقطيع الكلمة', 'نقسم الكلمة إلى مقاطع صغيرة. كل مقطع يحتوي على حرف ساكن وحرف متحرك. ثم ندمج المقاطع لنقرأ الكلمة كاملة.'],
            ['الكلمات في جمل', 'نضع الكلمة في جملة لنتأكد من معناها. كلمة كتاب نجدها في جملة: الكتاب على الطاولة. السياق يساعد على الفهم.']
          ],
          examples: [
            ['قراءة كلمة كتاب', ['نقسمها: كِ + تَا + ب.', 'ننطق المقطعين.', 'نقول: كتاب.'], 'كتاب'],
            ['قراءة كلمة مدرسة', ['نقسمها: مَدْ + رَ + سَة.', 'نقرأ كل جزء.', 'نقول: مدرسة.'], 'مدرسة']
          ],
          questions: [
            ['كم مقطعاً في كلمة كتاب؟', ['مقطعان', 'مقطع واحد', 'ثلاثة', 'أربعة'], 0, 'ننطق كِ وتاب، أي مقطعان عند التقطيع المبسط.'],
            ['أي كلمة تتكون من مقطعين؟', ['كتاب', 'ب', 'ت', 'وا'], 0, 'كتاب كلمة كاملة لها مقطعان، والباقي حروف أو أدوات.'],
            ['أين نجد معنى الكلمة؟', ['في الجملة', 'في اللون', 'في الصوت وحده', 'في العدد'], 0, 'الجملة تعطينا سياقاً يوضح معنى الكلمة.'],
            ['لماذا نقطع الكلمة قبل قراءتها؟', ['لتسهيل النطق', 'لتكبيرها', 'لتغيير معناها', 'لإخفائها'], 0, 'التقطيع يجعل نطق الكلمة الطويلة أسهل وأدق.']
          ]
        },
        {
          t: 'الجملة الاسمية البسيطة',
          intro: 'الجملة الاسمية تبدأ باسم وتخبر عنه شيئاً. نتعلم ترتيب كلماتها.',
          sections: [
            ['المبتدأ والخبر', 'تبدأ الجملة الاسمية باسم يسمى المبتدأ. ثم يأتي الخبر الذي يعطينا معلومة. مثل: الولدُ نشيطٌ.'],
            ['ترتيب الكلمات', 'نضع المبتدأ أولاً ثم الخبر. إذا قلبنا الترتيب فسد المعنى. نقرأ الجملة ونتأكد من وضوحها.']
          ],
          examples: [
            ['كوّن جملة', ['اختر مبتدأ: الشمسُ.', 'أضف خبراً: مشرقةٌ.', 'اكتب: الشمسُ مشرقةٌ.'], 'الشمسُ مشرقةٌ'],
            ['صحّح ترتيباً', ['لدينا: نشيطٌ الولدُ.', 'نقدم المبتدأ: الولدُ.', 'نكتب: الولدُ نشيطٌ.'], 'الولدُ نشيطٌ']
          ],
          questions: [
            ['ما أول ما في الجملة الاسمية؟', ['مبتدأ', 'خبر', 'فعل', 'حرف جر'], 0, 'الجملة الاسمية تبدأ باسم هو المبتدأ.'],
            ['في جملة الولدُ نشيطٌ، ما الخبر؟', ['نشيطٌ', 'الولدُ', 'ال', 'و'], 0, 'الخبر هو الكلمة التي تفيدنا عن المبتدأ، وهي نشيطٌ.'],
            ['أي جملة اسمية صحيحة؟', ['البنتُ جميلةٌ', 'جميلةٌ البنتُ كلا', 'البنتُ وجميلةٌ', 'في البنتُ جميلةٌ'], 0, 'هذه الجملة تبدأ بمبتدأ ثم خبر بترتيب صحيح.'],
            ['ماذا يفيد الخبر؟', ['معلومة عن المبتدأ', 'اسم المبتدأ', 'لون الورق', 'عدد الكلمات'], 0, 'الخبر يعطينا معلومة أو وصفاً للمبتدأ.']
          ]
        },
        {
          t: 'تقويم القراءة والكتابة',
          intro: 'نراجع ما تعلمناه ثم نختبر أنفسنا في القراءة والكتابة.',
          sections: [
            ['مراجعة الحروف والكلمات', 'نعيد قراءة الحروف المتصلة والمنفصلة. ثم نقرأ كلمات مثل كتاب ومدرسة. المراجعة تثبت المعلومات في الذهن.'],
            ['أخطاء شائعة', 'من الأخطاء الخلط بين أشكال الحرف أو نسيان الترتيب. نراجع جملة ونصححها. الانتباه يقلل الأخطاء.']
          ],
          examples: [
            ['صحّح كلمة', ['كتبنا: كتا ب.', 'نلصق الحروف: كتاب.', 'نقرأ الكلمة.'], 'كتاب'],
            ['أعد ترتيب جملة', ['لدينا: مشرقة الشمس.', 'نكتب: الشمس مشرقة.', 'نضع نقطة في النهاية.'], 'الشمس مشرقة.']
          ],
          questions: [
            ['ما الفرق بين الحرف المتصل والمنفصل؟', ['المتصل يرتبط بما بعده', 'المنفصل أكبر', 'المتصل لونه أسود', 'لا فرق'], 0, 'الحرف المتصل يرتبط بالحرف الذي يليه، والمنفصل يبقى وحده.'],
            ['أي كلمة نقرأها بمقطعين؟', ['كتاب', 'ب', 'ا', 'لا'], 0, 'كتاب كلمة تامة تتكون من مقطعين.'],
            ['ما آخر ما في الجملة المفيدة؟', ['علامة ترقيم', 'حرف جر', 'مبتدأ', 'واو'], 0, 'نختم الجملة بعلامة ترقيم مثل النقطة.'],
            ['لماذا نراجع الدروس؟', ['لنتذكر ونصحح الأخطاء', 'لننسى', 'لنلعب فقط', 'لتصير الكلمات أصغر'], 0, 'المراجعة تعيد المعلومة للذهن وتساعد على تصحيح الأخطاء.']
          ]
        }
      ]
    },
    'cur19': {
      shared: {
        sections: [
          ['Les signes tifinaghes', "L'écriture amazighe utilise des signes appelés tifinagh. Chaque signe représente un son. On apprend à les reconnaître un à un."],
          ['Lire à voix haute', "Lire à voix haute aide à entendre les sons de tamazight. On prononce chaque signe clairement. La répétition rend la lecture plus sûre."],
          ['Le sens des mots', "Chaque mot amazigh porte un sens. On le relie à une image ou à une situation de la vie quotidienne. Le contexte aide à comprendre."],
          ['La phrase amazighe', "Une phrase assemble des mots pour exprimer une idée. En amazigh, l'ordre des mots suit des règles précises. Relire permet de vérifier le sens."]
        ],
        vocab: [
          ['tifinagh', "L'alphabet utilisé pour écrire la langue amazighe."],
          ['tamazight', 'La langue amazighe parlée au Maroc.'],
          ['signe', 'Un caractère écrit qui représente un son.'],
          ['mot', 'Un ensemble de signes qui a un sens.'],
          ['phrase', 'Un ensemble de mots qui exprime une idée complète.'],
          ['prononcer', 'Dire un son ou un mot avec la voix.']
        ],
        outcomes: [
          'Reconnaître des signes tifinaghes courants.',
          'Lire des mots amazighes à voix haute.',
          'Comprendre le sens de mots de la vie quotidienne.',
          'Construire une phrase simple en amazigh.'
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'Découvrir les signes tifinaghes',
          intro: "L'écriture amazighe se lit avec des signes appelés tifinagh. Nous allons en reconnaître quelques-uns.",
          sections: [
            ['Les signes et les sons', "Chaque signe tifinagh correspond à un son. Certains signes se ressemblent et demandent de l'attention. On les trace du doigt avant de les écrire."],
            ['Où voit-on le tifinagh ?', "On voit le tifinagh sur les panneaux, dans les livres et à l'école. Au Maroc, cette écriture est présente dans la vie quotidienne. La reconnaître aide à lire les affiches."]
          ],
          examples: [
            ['Repérer un signe', ["Observe le premier signe de ton tableau.", "Dis le son qu'il représente.", 'Retrace-le dans ton cahier.'], 'Chaque signe correspond à un son précis.'],
            ['Dire bonjour en amazigh', ['Le mot azul veut dire bonjour.', 'Répète : azul.', 'Réponds aussi par azul.'], 'azul']
          ],
          questions: [
            ["Comment appelle-t-on l'écriture amazighe ?", ['Le tifinagh', 'Le latin', "L'arabe", 'Le grec'], 0, "L'écriture propre à l'amazigh s'appelle le tifinagh."],
            ['À quoi sert un signe ?', ['À représenter un son', 'À colorier', 'À compter', 'À dessiner un arbre'], 0, 'Chaque signe écrit correspond à un son de la langue.'],
            ['Quel mot veut dire bonjour en amazigh ?', ['azul', 'merci', 'livre', 'soleil'], 0, 'Azul est le mot amazigh utilisé pour saluer.'],
            ['Où peut-on voir du tifinagh ?', ['Sur les panneaux', 'Dans le ciel', "Dans l'eau", "Sur les étoiles"], 0, 'Le tifinagh apparaît sur les panneaux et les affiches au Maroc.']
          ]
        },
        {
          t: 'Lire des mots de la vie quotidienne',
          intro: 'Nous lisons des mots amazighes que l’on entend souvent à la maison et à l’école.',
          sections: [
            ['Les mots de la famille', 'Les mots de la famille reviennent souvent en amazigh. On les associe aux personnes que l’on connaît. Les répéter aide à les retenir.'],
            ["Le mot et l'image", "Une image peut aider à deviner le sens d'un mot amazigh. On regarde le dessin puis on lit le mot. On vérifie ensuite avec l'enseignant."]
          ],
          examples: [
            ["Lire un mot avec l'image", ["Regarde le dessin d'une maison.", 'Lis le mot taddart.', "Associe-le à l'image."], 'taddart = la maison'],
            ['Répéter un mot', ['Écoute : tanemmirt.', 'Répète le mot deux fois.', "Dis-le quand on te remercie."], 'tanemmirt veut dire merci.']
          ],
          questions: [
            ['Que veut dire taddart ?', ['La maison', 'Le chien', 'Le livre', "L'eau"], 0, 'Taddart est le mot amazigh pour la maison.'],
            ['Que signifie tanemmirt ?', ['Merci', 'Bonjour', 'Au revoir', 'Oui'], 0, 'Tanemmirt sert à remercier en amazigh.'],
            ['Comment retenir un nouveau mot ?', ["Le répéter et le relier à une image", 'Le cacher', "L'écrire une seule fois", 'Le sauter'], 0, "La répétition et l'image aident à mémoriser le mot."],
            ['Parmi ces mots amazighes, lequel sert à saluer ?', ['azul', 'taddart', 'aman', 'tigmmi'], 0, 'Azul est utilisé pour dire bonjour ; les autres mots ont d’autres sens.']
          ]
        },
        {
          t: 'Construire une phrase simple en amazigh',
          intro: 'Une phrase amazigh assemble des mots pour dire quelque chose. Nous apprenons à les ordonner.',
          sections: [
            ["L'ordre des mots", "En amazigh, les mots suivent un ordre précis dans la phrase. On commence souvent par le sujet. Les mots se placent ensuite autour de l'action."],
            ["Le sens de la phrase", "Pour vérifier le sens, on relit la phrase lentement. On peut aussi se représenter la scène. Une phrase claire se comprend du premier coup."]
          ],
          examples: [
            ['Compléter une salutation', ['Commence par : azul.', 'Ajoute le nom : Fellah.', 'Écris : azul Fellah.'], 'azul Fellah'],
            ['Répondre poliment', ['Quelqu’un dit : azul.', 'Réponds par : azul.', 'Ajoute un sourire.'], 'azul']
          ],
          questions: [
            ['Que faut-il pour faire une phrase ?', ['Des mots ordonnés', 'Une seule lettre', 'Un dessin', 'Un chiffre'], 0, 'Une phrase est formée de mots placés dans un ordre qui donne un sens.'],
            ["Comment vérifier le sens d'une phrase ?", ['En la relisant lentement', 'En la cachant', 'En la coloriant', 'En comptant les lignes'], 0, 'Relire lentement permet de vérifier que la phrase est claire.'],
            ['Quel mot amazigh veut dire eau ?', ['aman', 'azul', 'taddart', 'tanemmirt'], 0, 'Aman est le mot amazigh qui désigne l’eau.'],
            ['Pourquoi apprendre la phrase en amazigh ?', ['Pour communiquer', 'Pour dormir', 'Pour courir', 'Pour dessiner'], 0, 'Apprendre des phrases permet de parler et d’échanger en amazigh.']
          ]
        },
        {
          t: 'Évaluation : lire et écrire en tifinagh',
          intro: 'Nous révisons les signes, les mots et les phrases vus dans cette unité.',
          sections: [
            ['Réviser les signes', 'On repasse en revue les signes tifinaghes appris. On les relit et on les retrace. La révision fixe les connaissances.'],
            ['Corriger les erreurs', 'Il arrive de confondre deux signes qui se ressemblent. On recommence lentement et on demande de l’aide. Chaque erreur corrigée est un progrès.']
          ],
          examples: [
            ['Relire une liste', ['Prends ta liste de mots.', 'Lis chaque mot à voix haute.', 'Corrige ce qui ne va pas.'], 'La relecture améliore la lecture.'],
            ['Retracer un signe', ['Choisis un signe difficile.', 'Trace-le trois fois.', 'Dis son son à chaque fois.'], 'Le signe devient plus familier.']
          ],
          questions: [
            ['Quand corrige-t-on une erreur ?', ["Dès qu'on la remarque", 'Jamais', 'À la fin de l’année', 'Seulement le vendredi'], 0, "Corriger tout de suite évite de répéter la même erreur."],
            ['Que signifie le mot amazigh « azul » ?', ['Bonjour', 'Merci', 'Maison', 'Eau'], 0, 'Azul est la formule de salutation en amazigh.'],
            ['Comment fixer un signe dans sa mémoire ?', ['En le retracant plusieurs fois', 'En le regardant une fois', 'En le sautant', 'En le cachant'], 0, 'Répéter le tracé aide à mémoriser le signe.'],
            ['Que contient une phrase ?', ['Des mots qui ont un sens', 'Une seule voyelle', 'Un seul chiffre', 'Rien'], 0, 'Une phrase est un ensemble de mots porteurs de sens.']
          ]
        }
      ]
    },
    'cur_l_pre_sub_ar': {
      shared: {
        sections: [
          ['الحرف في البداية', 'ننظر إلى الحرف الأول في الكلمة. ننطقه بوضوح ثم نسمع صوته. في الصف نتعلم الحرف ونكرره.'],
          ['الصوت والحرف', 'لكل حرف صوت خاص به. نضع أصابعنا على فمنا وننطق الحرف. هكذا نحس بالصوت.'],
          ['الكلمات من حولنا', 'نجد كلمات كثيرة حولنا في البيت والمدرسة. نسمي الأشياء بأسمائها. تسمية الأشياء تساعدنا على تعلم الكلمات.'],
          ['الصورة تساعد', 'الصورة تساعدنا على فهم الكلمة. ننظر إلى الصورة ثم نقول اسم الشيء. نكرر الكلمة مع الصورة.']
        ],
        vocab: [
          ['حرف', 'شكل صغير نكتبه وننطق صوته.'],
          ['صوت', 'ما نسمعه عندما ننطق الحرف.'],
          ['كلمة', 'مجموعة حروف ننطقها ونفهم معناها.'],
          ['صورة', 'رسم يوضح لنا الشيء.'],
          ['اسم', 'الكلمة التي نسمي بها شيئاً.'],
          ['قصة', 'كلام ممتع نقرأه أو نسمعه.']
        ],
        outcomes: [
          'يسمي عددا من حروف الهجاء.',
          'يقلد أصوات الحروف البسيطة.',
          'يسمي أشياء مألوفة بكلمات عربية.',
          'يعيد سرد قصة مصورة بسيطة.'
        ],
        diagram: 'diagram-animals.svg'
      },
      lessons: [
        {
          t: 'التعرف على حروف الهجاء',
          intro: 'نتعرف اليوم على حروف نراها كل يوم. ننظر إلى شكل الحرف ونقول اسمه.',
          sections: [
            ['حرف الألف', 'حرف الألف أول حروف الهجاء. نرسمه خطاً مستقيماً من الأعلى إلى الأسفل. نقول: ألف، ألف، ونكرر صوته بصوت واضح.'],
            ['حرف الباء', 'نرسم شكل الباء مثل قوس صغير، ثم نضع تحته نقطة واحدة. ننطق: باء، باء، ونضم الشفتين ثم نفتحهما. نكرر الحرف بإصبعنا على الورقة قبل كتابته بالقلم.']
          ],
          examples: [
            ['أشر إلى الحرف', ['انظر إلى حرف ألف.', 'قل اسمه بصوت عالٍ.', 'أشر إلى مثله في الصف.'], 'ألف'],
            ['قارن حرفين', ['خذ ورقة فيها ألف وباء.', 'قل: ألف.', 'ثم قل: باء.'], 'ألف وباء']
          ],
          questions: [
            ['ما أول حرف في ترتيب حروف الهجاء؟', ['ألف', 'باء', 'تاء', 'ميم'], 0, 'يبدأ ترتيب الحروف العربية بحرف الألف.'],
            ['أين نضع نقطة حرف الباء عند الكتابة؟', ['تحتها', 'فوقها', 'في وسطها', 'لا نقطة لها'], 0, 'نقطة حرف الباء تكتب تحت شكله.'],
            ['كيف ننطق حرف الألف بصوت صحيح؟', ['ألف', 'باء', 'ميم', 'واو'], 0, 'اسم هذا الحرف ألف وصوته أ.'],
            ['لماذا نتعلم حروف الهجاء في الصف؟', ['لنقرأ ونكتب', 'لنلعب بالكرات', 'لنأكل', 'لننام'], 0, 'معرفة الحروف هي أول خطوة نحو القراءة والكتابة.']
          ]
        },
        {
          t: 'أصوات الحروف',
          intro: 'لكل حرف صوت نسمعه عندما ننطقه. نستمع جيداً ثم نقلد الصوت.',
          sections: [
            ['ننطق ونسمع', 'نضع يدنا على فمنا وننطق: م م م. نحس باهتزاز الشفتين. لكل حرف إحساس مختلف.'],
            ['أصوات قريبة', 'بعض الأصوات تتشابه مثل صوت الباء والميم. ننصت إلى الفرق. التكرار يساعد على التمييز.']
          ],
          examples: [
            ['قلد صوت الميم', ['ضع شفتيك معاً.', 'قل: م م م.', 'استمع إلى صوتك.'], 'م م م'],
            ['فرّق بين صوتين', ['قل: ب ب ب.', 'ثم قل: م م م.', 'أخبر عن الفرق.'], 'الباء تنفجر والميم تهمس']
          ],
          questions: [
            ['ماذا نسمع عند نطق الحرف؟', ['صوته', 'لونه', 'حجمه', 'وزنه'], 0, 'عند نطق الحرف نسمع صوتاً خاصاً به.'],
            ['أي حرف ننطقه م م م عند إغلاق الشفتين؟', ['الميم', 'الباء', 'الألف', 'التاء'], 0, 'صوت الميم هو م م م عند إغلاق الشفتين.'],
            ['كيف نفرق بين أصوات متشابهة؟', ['بالإنصات والتكرار', 'بالنظر للسقف', 'بالصمت التام', 'بالعد'], 0, 'الإنصات الجيد والتكرار يساعدان على التمييز.'],
            ['أين نحس باهتزاز صوت الميم عند النطق؟', ['على الشفتين', 'على اليد', 'على القدم', 'على الرأس'], 0, 'عند نطق الميم نحس باهتزاز الشفتين.']
          ]
        },
        {
          t: 'مفردات بسيطة',
          intro: 'نتعلم أسماء أشياء نراها حولنا. ننظر إلى الصورة ثم نقول الاسم.',
          sections: [
            ['أسماء الأشياء', 'نسمي الأشياء القريبة منا مثل الكتاب والقلم. نضع الكلمة بجانب الشيء. هكذا نحفظ الاسم.'],
            ['أسماء الحيوانات', 'ننظر إلى صور حيوانات مثل القط والطائر. نقول: قط، طائر. الصورة تساعدنا على حفظ الاسم.']
          ],
          examples: [
            ['سمّ الصورة', ['انظر إلى صورة القط.', 'قل: قط.', 'كرر الكلمة ثلاث مرات.'], 'قط'],
            ['اربط اللون بالشيء', ['انظر إلى التفاحة.', 'قل: حمراء.', 'ثم قل: تفاحة حمراء.'], 'تفاحة حمراء']
          ],
          questions: [
            ['ما اسم الحيوان الذي يموء؟', ['القط', 'الطائر', 'السمك', 'الفيل'], 0, 'القط هو الحيوان المعروف بصوت المواء.'],
            ['ماذا نفعل مع الصورة؟', ['ننظر إليها ونقول الاسم', 'نرميها', 'نغلق عينا', 'نكتب رقماً'], 0, 'الصورة تساعدنا على معرفة اسم الشيء.'],
            ['أي كلمة من هذه الكلمات تدل على لون؟', ['أحمر', 'كتاب', 'قلم', 'باب'], 0, 'أحمر كلمة تدل على لون، والباقي أسماء أشياء.'],
            ['لماذا نكرر الكلمة الجديدة أكثر من مرة؟', ['لنحفظها', 'لننساها', 'لتصير قصيرة', 'لتغيير لونها'], 0, 'التكرار يساعد على تثبيت الكلمة في الذاكرة.']
          ]
        },
        {
          t: 'قصص مصورة',
          intro: 'نقرأ قصة قصيرة بصور. ننظر إلى كل صورة ونقول ما يحدث.',
          sections: [
            ['النظر إلى الصور', 'كل صورة في القصة تعطينا معلومة. نبدأ بالصورة الأولى ثم نتبع الترتيب. الترتيب يساعد على فهم القصة.'],
            ['إعادة السرد', 'بعد القراءة نعيد القصة بكلماتنا. نقول: أولاً، ثم، وأخيراً. السرد ينمي اللغة عند الطفل.']
          ],
          examples: [
            ['احكِ قصة القط', ['الصورة الأولى: قط جائع.', 'الصورة الثانية: قط يأكل.', 'قل: القط أكل السمك.'], 'القط أكل السمك'],
            ['رتّب الأحداث', ['ابدأ بالصورة الأولى.', 'ثم انظر إلى الثانية.', 'انتهِ بالأخيرة.'], 'أولاً، ثم، أخيراً']
          ],
          questions: [
            ['بماذا نبدأ قراءة القصة المصورة؟', ['بالصورة الأولى', 'بالصورة الأخيرة', 'بالصفحة الأخيرة', 'بالغلاف فقط'], 0, 'القصة تُقرأ باتباع ترتيب الصور من البداية.'],
            ['ماذا فعل القط في القصة؟', ['أكل السمك', 'شرب الشاي', 'فتح الباب', 'غنى'], 0, 'القصة تقول إن القط أكل السمك.'],
            ['أي كلمة من الكلمات التالية تدل على الترتيب؟', ['ثم', 'قط', 'أحمر', 'كتاب'], 0, 'ثم كلمة تستخدم لترتيب أحداث القصة.'],
            ['لماذا نعيد سرد القصة؟', ['لنتدرب على الكلام', 'لننساها', 'لتصير الصور أكبر', 'لنعد الحروف'], 0, 'إعادة السرد تقوي التعبير اللغوي والتذكر.']
          ]
        }
      ]
    },
    'cur_l_p1_sub_ar': {
      shared: {
        sections: [
          ['المقطع والكلمة', 'يتكون المقطع من حرف ساكن وحرف متحرك. نقرأ المقطع ثم ندمجه مع غيره. من المقاطع تتكون الكلمة.'],
          ['القراءة الصحيحة', 'نقرأ بوضوح وبطء في البداية. ننتبه إلى شكل الحرف وصوته. ثم نزيد السرعة بعد التدريب.'],
          ['الكتابة بالقلم', 'نمسك القلم بطريقة صحيحة. نكتب الحرف من اليمين إلى اليسار. نراجع ما كتبنا ونصححه.'],
          ['الفهم والتعبير', 'بعد القراءة نفكر في المعنى. نجيب عن أسئلة بسيطة حول النص. ثم نعبر عن رأينا بجمل قصيرة.']
        ],
        vocab: [
          ['مقطع', 'جزء من الكلمة يضم حرفين أو أكثر.'],
          ['ساكن', 'حرف لا حركة عليه مثل ل في كتاب.'],
          ['متحرك', 'حرف عليه فتح أو ضم أو كسر.'],
          ['نص', 'كتابة مقروءة تحمل معنى.'],
          ['جملة', 'مجموعة كلمات تعبر عن فكرة.'],
          ['سؤال', 'طلب نجيب عنه بكلام أو كتابة.']
        ],
        outcomes: [
          'يقرأ مقاطع مكونة من حرفين.',
          'يكتب حروفاً وكلمات بخط واضح.',
          'يجيب عن أسئلة فهم حول نص بسيط.',
          'يعبر شفويا عن فكرة بجملة قصيرة.'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'قراءة المقاطع',
          intro: 'نبدأ بقراءة مقاطع قصيرة ثم ندمجها في كلمات. التدريب يجعل القراءة أسهل.',
          sections: [
            ['مقطع ساكن ومتحرك', 'المقطع مثل ب + ا = با. الحرف الأول ساكن والثاني متحرك. ننطق المقطع مرات عديدة.'],
            ['من المقطع إلى الكلمة', 'نجمع عدة مقاطع لنحصل على كلمة. مثلا: با + ب = باب. نقرأ كل مقطع على حدة ثم الكلمة كاملة.']
          ],
          examples: [
            ['اقرأ مقطع با', ['انظر إلى الحرف ب.', 'أضف الألف.', 'قل: با.'], 'با'],
            ['كوّن كلمة من مقطعين', ['لدينا: بَا + ب.', 'نقرأ المقطعين.', 'نقول: باب.'], 'باب']
          ],
          questions: [
            ['كيف نقرأ المقطع با؟', ['ب + ا', 'ا + ب', 'ب + ب', 'ا + ا'], 0, 'المقطع با يتكون من الباء ثم الألف.'],
            ['ماذا يسمى الحرف الذي لا حركة عليه؟', ['ساكن', 'متحرك', 'ممدود', 'مشدد'], 0, 'الحرف الساكن لا يحمل علامة حركة.'],
            ['ما الكلمة الناتجة عن با + ب؟', ['باب', 'بب', 'ابا', 'ببا'], 0, 'دمج المقطعين يعطي كلمة باب.'],
            ['لماذا نكرر قراءة المقطع؟', ['لنتقن النطق', 'لنغير معناه', 'لنكتبه أكبر', 'لنحذفه'], 0, 'التكرار يساعد على إتقان نطق المقطع.']
          ]
        },
        {
          t: 'كتابة الحروف والكلمات',
          intro: 'نتعلم كتابة الحروف بخط واضح ثم نكتب كلمات قصيرة.',
          sections: [
            ['طريقة الإمساك بالقلم', 'نمسك القلم بأصابعنا بطريقة مريحة. نضع الورقة بشكل مستقيم. الكتابة المريحة تجعل الخط أجمل.'],
            ['اتجاه الكتابة', 'نكتب الحروف من اليمين إلى اليسار في العربية. نبدأ من أول السطر. نترك فراغاً بين الكلمات.']
          ],
          examples: [
            ['اكتب حرف الباء', ['ضع النقطة تحت الشكل.', 'ارسم شكل الباء.', 'اقرأ ما كتبت.'], 'ب'],
            ['اكتب كلمة باب', ['اكتب باء ثم ألف.', 'أضف باء في النهاية.', 'تحقق من ترتيب الحروف.'], 'باب']
          ],
          questions: [
            ['من أين نبدأ الكتابة في العربية؟', ['من اليمين', 'من اليسار', 'من الأسفل', 'من الأعلى'], 0, 'النص العربي يُكتب من اليمين إلى اليسار.'],
            ['أين نقطة حرف الباء؟', ['تحت الحرف', 'فوق الحرف', 'يمين الحرف', 'يسار الحرف'], 0, 'نقطة الباء توضع تحت شكل الحرف.'],
            ['ماذا نترك بين الكلمات؟', ['فراغاً', 'نقطة', 'شرطة', 'قوساً'], 0, 'الفراغ يفصل الكلمات ويجعل القراءة واضحة.'],
            ['لماذا نراجع ما كتبنا؟', ['لتصحيح الأخطاء', 'لزيادة عدد الكلمات', 'لتغيير اللون', 'لإخفاء الخط'], 0, 'المراجعة تساعد على اكتشاف الأخطاء وتصحيحها.']
          ]
        },
        {
          t: 'فهم نص بسيط',
          intro: 'نقرأ نصاً قصيراً عن الأسرة ثم نجيب عن أسئلة حوله.',
          sections: [
            ['قراءة النص', 'نقرأ النص بصوت هادئ. ننتبه إلى أسماء الأشخاص والأشياء. ثم نعيد القراءة لنتأكد من الفهم.'],
            ['الإجابة عن الأسئلة', 'نبحث في النص عن الإجابة. نكتب الجملة التي تدل عليها. الإجابة من النص تكون صحيحة ومختصرة.']
          ],
          examples: [
            ['ابحث عن الإجابة', ['النص: سارة تلعب في الحديقة.', 'السؤال: أين تلعب سارة؟', 'الجواب: في الحديقة.'], 'في الحديقة'],
            ['استخرج الاسم', ['الجملة: الأب يقرأ الكتاب.', 'اسأل: من يقرأ؟', 'الجواب: الأب.'], 'الأب']
          ],
          questions: [
            ['إذا كان النص: سارة تلعب في الحديقة، أين تلعب سارة؟', ['في الحديقة', 'في المطبخ', 'في المدرسة', 'في الغرفة'], 0, 'النص ذكر صراحة أنها تلعب في الحديقة.'],
            ['كيف نجد الإجابة في النص؟', ['نبحث عن الجملة المناسبة', 'نخمن', 'نسأل صديقا فقط', 'نغلق الكتاب'], 0, 'الإجابة الصحيحة تؤخذ من جمل موجودة في النص.'],
            ['ما فائدة إعادة قراءة النص؟', ['تأكيد الفهم', 'جعل النص أقصر', 'تغيير الكاتب', 'حذف الأسئلة'], 0, 'إعادة القراءة تثبت المعنى وتوضح التفاصيل.'],
            ['في جملة الأب يقرأ الكتاب، من يقرأ؟', ['الأب', 'الكتاب', 'الحديقة', 'سارة'], 0, 'الفاعل في الجملة هو الأب.']
          ]
        },
        {
          t: 'التعبير الشفهي',
          intro: 'نتدرب على الكلام أمام زملائنا بجمل قصيرة وواضحة.',
          sections: [
            ['البداية والنهاية', 'نبدأ كلامنا بتحية بسيطة. ثم نقول الفكرة التي نريدها. نختم بجملة قصيرة مثل: هذا رأيي.'],
            ['الإنصات إلى الآخرين', 'عندما يتكلم زميلنا نصت إليه. لا نقاطعه حتى ينتهي. ثم نطرح سؤالاً لطيفاً.']
          ],
          examples: [
            ['عرّف نفسك', ['قل: السلام عليكم.', 'قل: اسمي سارة.', 'قل: أنا أحب القراءة.'], 'السلام عليكم، اسمي سارة، أحب القراءة.'],
            ['احكِ عن يومك', ['ابدأ: اليوم ذهبت إلى المدرسة.', 'أضف: قرأت كتاباً.', 'اختم: كان يوماً جميلاً.'], 'أخبرت عن المدرسة والكتاب.']
          ],
          questions: [
            ['كيف نبدأ الكلام أمام الصف؟', ['بتحية بسيطة', 'بالصمت', 'بالضحك', 'بالجري'], 0, 'التحية بداية لطيفة ومنظمة للكلام.'],
            ['ماذا نفعل حين يتكلم زميلنا؟', ['ننصت إليه', 'نقاطعه', 'نكتب رسالة', 'ننظر للنافذة'], 0, 'الإنصات احترام ويساعد على الفهم.'],
            ['أي جملة تعبير جيد؟', ['أحب التفاح', 'تفاح أحب أنا', 'أحب أنا التفاح', 'التفاح أحب'], 0, 'هذه الجملة مرتبة وواضحة المعنى.'],
            ['لماذا نتدرب على التعبير الشفهي؟', ['لنتكلم بثقة', 'لنصمت دائماً', 'لنكتب فقط', 'لننسى الكلام'], 0, 'التدريب يساعد الطالب على الكلام بوضوح وثقة.']
          ]
        }
      ]
    },
    'cur_l_p1_sub_sport': {
      shared: {
        sections: [
          ['الجسم يتحرك', 'جسمنا يستطيع المشي والجري والقفز. كل حركة تستخدم عضلات معينة. نحرك أجسامنا بلطف وبأمان.'],
          ['الإحماء', 'قبل اللعب نحمي أجسامنا بحركات بسيطة. نمد أذرعنا ونحرك أقدامنا. الإحماء يمنع التعب والجرح.'],
          ['قواعد اللعب', 'كل لعبة لها قواعد نحترمها. ننتظر دورنا ولا ندفع الآخرين. الاحترام يجعل اللعب ممتعاً للجميع.'],
          ['الصحة والأمان', 'نشرب الماء بعد اللعب ونرتاح قليلاً. ننظف أيدينا قبل الأكل. الاهتمام بالصحة جزء من الرياضة.']
        ],
        vocab: [
          ['حركة', 'تغيير وضع الجسم مثل القفز.'],
          ['إحماء', 'حركات بسيطة قبل اللعب لتجنب الأذى.'],
          ['لعبة', 'نشاط ممتع نقوم به مع آخرين.'],
          ['فريق', 'مجموعة من الأشخاص يعملون معاً.'],
          ['قاعدة', 'تعليمات نتبعها أثناء اللعب.'],
          ['راحة', 'توقف قصير لاستعادة النشاط.']
        ],
        outcomes: [
          'ينفذ حركات بسيطة باتزان.',
          'يتبع قواعد لعبة جماعية.',
          'يتعاون مع زملائه في فريق.',
          'يطبق عادات صحية بعد النشاط.'
        ],
        diagram: 'diagram-body.svg'
      },
      lessons: [
        {
          t: 'حركات الجسم',
          intro: 'نكتشف حركات يستطيع جسمنا القيام بها. نجربها في الصف بهدوء.',
          sections: [
            ['حركات الأذرع والساقين', 'نرفع أذرعنا فوق الرأس ثم نخفضها. نرفع ركبتي بالتناوب. هذه الحركات تقوي العضلات.'],
            ['التوازن', 'نقف على قدم واحدة قليلاً. نمد أذرعنا للمساعدة على التوازن. إذا تعبنا نجلس ونستريح.']
          ],
          examples: [
            ['محاكاة شجرة الزيتون', ['قف منتصباً كالشجرة.', 'مد ذراعيك كالأغصان.', 'ابقَ هكذا ثوانٍ قليلة.'], 'جسدك متزن كشجرة زيتون.'],
            ['القفز الخفيف', ['اقفز في مكانك مرتين.', 'اهبط برفق على قدميك.', 'ابتسم وكرر مرة أخرى.'], 'قفزت مرتين بأمان.']
          ],
          questions: [
            ['أي حركة تقوي الساقين؟', ['القفز', 'قراءة الكتاب', 'النوم', 'الكتابة'], 0, 'القفز يستخدم عضلات الساقين ويقويها.'],
            ['كيف نساعد أنفسنا على التوازن؟', ['نمد الأذرع', 'نغلق الأعين', 'نركض بسرعة', 'نصرخ'], 0, 'مد الأذرع يساعد الجسم على الحفاظ على التوازن.'],
            ['ماذا نفعل إذا تعبنا؟', ['نستريح قليلاً', 'نواصل بسرعة', 'ندفع زميلاً', 'نصعد الطاولة'], 0, 'الراحة القصيرة تعيد النشاط وتحمي الجسم.'],
            ['ما فائدة حركة الأذرع والساقين في الصف؟', ['لنبقى نشيطين وأقوياء', 'لننام أكثر', 'لنأكل أكثر', 'لنصمت'], 0, 'الحركة المنتظمة تقوي الجسم وتحافظ على نشاطه.']
          ]
        },
        {
          t: 'ألعاب جماعية بسيطة',
          intro: 'نلعب ألعاباً مع زملائنا ونتعلم كيف ننتظر دورنا.',
          sections: [
            ['لعبة الكرة', 'نرمي الكرة لزميلنا بلطف. نقول اسمه قبل الرمي. نلتقط الكرة بأيدينا بهدوء.'],
            ['دور كل لاعب', 'لكل واحد دور في اللعبة. ننتظر دورنا بصبر. إذا أخطأ أحد فلا نسخر منه.']
          ],
          examples: [
            ['رمي الكرة', ['نادِ زميلك باسمه.', 'ارمِ الكرة نحوه.', 'قل: تفضل.'], 'تم الرمي بأمان'],
            ['الصف في اللعب', ['قف في الصف.', 'انتظر دورك.', 'العب ثم عد إلى الصف.'], 'العب ثم عد إلى الصف']
          ],
          questions: [
            ['ماذا نقول قبل رمي الكرة؟', ['اسم الزميل', 'كلمة سر', 'رقماً', 'لا شيء'], 0, 'مناداة الزميل باسمه تجعل الرمي آمناً وواضحاً.'],
            ['ماذا نفعل بعد أن نلعب؟', ['نعود إلى الصف', 'نركض حول الملعب', 'ندفع الصف', 'نأخذ الكرة'], 0, 'العودة إلى الصف تتيح للآخرين اللعب بدورهم.'],
            ['كيف نتعامل مع من أخطأ؟', ['نشجعه', 'نسخر منه', 'نتركه', 'نغضب'], 0, 'التشجيع يجعل اللعب ممتعاً ولا يحرج أحداً.'],
            ['لماذا ننتظر دورنا؟', ['لاحترام الآخرين', 'لأننا متعبون', 'لأن الكرة صغيرة', 'لأن الصف قصير'], 0, 'انتظار الدور يعني احترام حق كل زميل في اللعب.']
          ]
        },
        {
          t: 'العمل داخل الفريق',
          intro: 'نتعاون في فريق صغير لننجز نشاطاً ممتعاً.',
          sections: [
            ['توزيع الأدوار', 'في الفريق كل واحد له دور. أحدنا يحضر الكرة وآخر يرتب الصف. تقسيم العمل يسهل المهمة.'],
            ['التشجيع والاستماع', 'نستمع لاقتراحات زملائنا. نقول: فكرة جيدة. وإن اختلفنا نتحدث بهدوء.']
          ],
          examples: [
            ['نظّم فريقاً', ['اختر زميلاً لحمل الكرة.', 'واطلب من آخر ترتيب الصف.', 'ابدأ اللعب معاً.'], 'الفريق جاهز'],
            ['اختلاف الرأي', ['اسمع رأي زميلك.', 'قل رأيك بهدوء.', 'اتفقا على حل.'], 'اتفقنا على حل']
          ],
          questions: [
            ['ماذا يعني العمل في فريق؟', ['التعاون لتحقيق هدف', 'اللعب وحدنا', 'الصمت التام', 'السباق وحدنا'], 0, 'الفريق يعني أن يعمل الأفراد معاً من أجل هدف مشترك.'],
            ['ماذا نقول لمن قدم فكرة؟', ['فكرة جيدة', 'لا', 'اصمت', 'اذهب'], 0, 'التشجيع يحترم زميلك ويشجعه على المشاركة.'],
            ['كيف نحل الخلاف؟', ['بالكلام الهادئ', 'بالصراخ', 'بالدفع', 'بالانسحاب'], 0, 'الحوار الهادئ يسمع للطرفين ويصل إلى حل.'],
            ['لماذا نحدد دوراً لكل لاعب في الفريق؟', ['لإنجاز المهمة بسهولة', 'لإطالة الوقت', 'لتكثير اللاعبين', 'لتغيير اللعبة'], 0, 'تقسيم العمل يجعل المهمة أسهل وأسرع.']
          ]
        },
        {
          t: 'الصحة بعد اللعب',
          intro: 'بعد اللعب نعتني بجسمنا. نرتاح ونشرب الماء وننظف أيدينا.',
          sections: [
            ['الراحة وشرب الماء', 'بعد الجري نجلس قليلاً ونتنفس بعمق. نشرب الماء على دفعات صغيرة. ذلك يعيد لنا النشاط.'],
            ['النظافة والأمان', 'ننظف أيدينا بالماء والصابون قبل الأكل. نضع الكرة في مكانها بعد اللعب. المكان المرتب يمنع التعثر.']
          ],
          examples: [
            ['بعد نهاية اللعب', ['اجلس وخذ نفساً عميقاً.', 'اشرب قليلاً من الماء.', 'امسح عرقك بمنشفة.'], 'استعدت نشاطي'],
            ['ترتيب المكان', ['التقط الكرة.', 'ضعها في الصندوق.', 'أزل أي عائق عن الأرض.'], 'المكان أصبح آمناً']
          ],
          questions: [
            ['ما الشراب المناسب بعد الجري في الملعب؟', ['الماء', 'العصير الغازي', 'القهوة', 'الحليب البارد جداً'], 0, 'الماء هو الأفضل ليعوض الجسم ما فقده.'],
            ['لماذا ننظف أيدينا قبل الأكل؟', ['للوقاية من الجراثيم', 'لأنها باردة', 'لأننا متعبون', 'لأن الطعام ساخن'], 0, 'غسل اليدين يزيل الجراثيم ويحفظ الصحة.'],
            ['أين نضع الكرة بعد اللعب؟', ['في مكانها المخصص', 'في منتصف الطريق', 'تحت الطاولة', 'على النافذة'], 0, 'إعادة الأشياء لمكانها تمنع التعثر وتحافظ على النظام.'],
            ['ماذا يفعل التنفس العميق؟', ['يساعد على الاسترخاء', 'يزيد الجوع', 'يوقف اللعب', 'يغير اللون'], 0, 'التنفس العميق يهدئ الجسم بعد المجهود.']
          ]
        }
      ]
    },
    'cur_l_p2_sub_art': {
      shared: {
        sections: [
          ['الفن تعبير', 'الفن وسيلة لنعبّر عما نراه ونحسه. نستخدم الخطوط والألوان والأصوات. كل فنان له طريقته الخاصة.'],
          ['الملاحظة', 'قبل الرسم نلاحظ الشيء جيداً. ننظر إلى شكله ولونه وحجمه. الملاحظة الدقيقة تجعل العمل أجمل.'],
          ['المحاولة والتكرار', 'لا نخاف من الخطأ في الفن. نجرب ثم نحسن عملنا. التدريب ينمي المهارة.'],
          ['عرض العمل', 'نعرض عملنا على الآخرين بفخر. نسمع آراءهم باحترام. الفن يجمعنا ويجعلنا سعداء.']
        ],
        vocab: [
          ['خط', 'أثر القلم على الورقة.'],
          ['لون', 'ما نراه في الشيء مثل الأحمر أو الأزرق.'],
          ['شكل', 'حدود الشيء مثل الدائرة والمربع.'],
          ['إيقاع', 'نظام الأصوات في الموسيقى.'],
          ['تمثيل', 'تقليد شخص أو موقف على المسرح.'],
          ['معرض', 'مكان نعرض فيه الأعمال الفنية.']
        ],
        outcomes: [
          'يرسم أشكالاً بسيطة بخطوط واضحة.',
          'يختار ألواناً مناسبة لعمله.',
          'يميز إيقاعاً موسيقيا بسيطاً.',
          'يشارك في تمثيل مشهد قصير.'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'الرسم بالخطوط',
          intro: 'نبدأ بالخطوط لنرسم أشكالاً بسيطة مستوحاة من بيئتنا.',
          sections: [
            ['الخطوط المستقيمة والمنحنية', 'نرسم خطوطاً مستقيمة كجذع الشجرة وخطوطاً منحنية كأغصانها. نجمع بينهما لنشكل صورة. تنوع الخطوط يجعل الرسم حياً.'],
            ['رسم شجرة الزيتون', 'نرسم جذعاً بنياً ثم أغصاناً خضراء. نضيف دوائر صغيرة للزيتون. ننظر إلى شجرة حقيقية إن أمكن.']
          ],
          examples: [
            ['ارسم بيتاً', ['ارسم مربعاً للجدار.', 'أضف مثلثاً للسقف.', 'ارسم باباً ونافذة.'], 'بيت بخطوط واضحة'],
            ['ارسم موجة البحر', ['ارسم خطاً منحنياً.', 'كرره تحته.', 'أضف دوائر للفقاعات.'], 'موجات بحر بسيطة']
          ],
          questions: [
            ['أي خط يشبه جذع الشجرة؟', ['المستقيم', 'المنحني', 'الدائري', 'المكسور'], 0, 'جذع الشجرة يُرسم عادة بخط مستقيم صاعد.'],
            ['ما الشكل الذي نرسمه للسقف؟', ['مثلث', 'دائرة', 'بيضاوي', 'خط'], 0, 'المثلث شكل مناسب لسقف البيت البسيط.'],
            ['من أين نأخذ أفكار الرسم؟', ['من الأشياء حولنا', 'من الفراغ', 'من النوم', 'من الصمت'], 0, 'الملاحظة اليومية تعطينا أفكاراً للرسم.'],
            ['لماذا نتنوع الخطوط؟', ['لجعل الرسم أجمل وأوضح', 'لتقليل الوقت', 'لإخفاء الشكل', 'لتغيير الورقة'], 0, 'تنوع الخطوط يضيف تفاصيل ويجعل الصورة أقرب للواقع.']
          ]
        },
        {
          t: 'التلوين بعناية',
          intro: 'نتعلم اختيار الألوان وتلوين المساحات داخل الحدود.',
          sections: [
            ['الألوان الأساسية', 'الأحمر والأصفر والأزرق ألوان أساسية. يمكن مزج لونين للحصول على لون جديد. الأزرق والأصفر يعطيان الأخضر.'],
            ['داخل الحدود', 'نلون داخل خطوط الرسم بهدوء. نبدأ من الأعلى ونتجه للأسفل. القلم الملون لا يجب أن يخرج عن الخط.']
          ],
          examples: [
            ['مزّج لونين', ['خذ أصفر وأزرق.', 'لون بهما فوق بعض.', 'تحصل على الأخضر.'], 'الأخضر'],
            ['لوّن السماء', ['اختر أزرق للسماء.', 'لون من الأعلى.', 'اترك الشمس صفراء.'], 'سماء زرقاء وشمس صفراء']
          ],
          questions: [
            ['أي لونين يعطيان الأخضر؟', ['الأزرق والأصفر', 'الأحمر والأصفر', 'الأحمر والأزرق', 'الأبيض والأسود'], 0, 'مزج الأزرق مع الأصفر ينتج اللون الأخضر.'],
            ['كيف نحافظ على حدود الرسم أثناء التلوين؟', ['نتبع الحدود بهدوء', 'نسرع عشوائياً', 'نخرج عن الخط', 'نلون خارج الورقة'], 0, 'الهدوء والدقة يجعلان التلوين مرتباً.'],
            ['ما الألوان الأساسية؟', ['أحمر، أصفر، أزرق', 'أخضر، بني، رمادي', 'أبيض، أسود، رمادي', 'وردي، بنفسجي، برتقالي'], 0, 'هذه الألوان الثلاثة هي أساس بقية الألوان.'],
            ['لماذا نختار الألوان بعناية؟', ['لأنها تعبر عن المعنى', 'لأنها رخيصة', 'لأنها قليلة', 'لأنها سريعة'], 0, 'اللون المناسب يساعد على فهم الصورة والإحساس بها.']
          ]
        },
        {
          t: 'الإيقاع والموسيقى',
          intro: 'نستمع إلى أصوات حولنا ونكتشف الإيقاع ثم نقلده.',
          sections: [
            ['الأصوات من حولنا', 'نسمع صوت المطر وصوت الطبول وصوت التصفيق. لكل صوت إيقاع مختلف. ننصت ثم نقلده.'],
            ['الإيقاع بالتصفيق', 'نصفق مرتين ثم نسكت مرة. نكرر النمط. التكرار المنتظم يعطي إيقاعاً واضحاً.']
          ],
          examples: [
            ['قلّد إيقاع المطر', ['استمع: قطرة قطرة.', 'قل: تك تك.', 'كرر ثلاث مرات.'], 'تك تك تك تك'],
            ['اصنع إيقاعاً', ['صفق مرتين.', 'اسكت مرة.', 'اعد النمط.'], 'صفق صفق سكوت']
          ],
          questions: [
            ['ما اسم تكرار الأصوات بترتيب منتظم في الموسيقى؟', ['نظام منتظم للأصوات', 'لون الصوت', 'حجم الآلة', 'اسم المغني'], 0, 'الإيقاع هو تكرار الأصوات بترتيب زمني منتظم.'],
            ['أي صوت له إيقاع واضح؟', ['صوت الطبول', 'صوت الريح', 'صوت الورق', 'صوت الظل'], 0, 'الطبول تعطي إيقاعاً منتظماً يسهل متابعته.'],
            ['ماذا نفعل بعد الاستماع للإيقاع؟', ['نقلده', 'ننساه', 'نكتبه فقط', 'نغيره'], 0, 'تقليد الإيقاع يساعد على الإحساس به وحفظه.'],
            ['لماذا نكرر النمط؟', ['ليصير الإيقاع واضحاً', 'ليصير أعلى دائماً', 'ليختفي', 'ليتغير اللون'], 0, 'التكرار يثبت الإيقاع في الذهن ويجعله منظماً.']
          ]
        },
        {
          t: 'المسرح الصغير',
          intro: 'نمثل مشهداً قصيراً أمام زملائنا باستخدام الكلام والحركة.',
          sections: [
            ['اختيار المشهد', 'نختار موقفاً بسيطاً من حياتنا مثل التحية أو المساعدة. نوزع الأدوار بيننا. المشهد القصير أسهل في التمثيل.'],
            ['الأداء والتعبير', 'نتكلم بصوت مسموع ونحرك أيدينا بلطف. ننظر إلى الجمهور. التمثيل يساعد على فهم المشاعر.']
          ],
          examples: [
            ['مشهد التحية', ['واحد يقول: السلام عليكم.', 'الآخر يرد: وعليكم السلام.', 'يتصافحان.'], 'تم تمثيل التحية'],
            ['مشهد المساعدة', ['زميل يسقط قلماً.', 'آخر يلتقطه.', 'يقول: تفضل.'], 'تم تمثيل المساعدة']
          ],
          questions: [
            ['ماذا نختار للمسرح الصغير؟', ['موقفاً بسيطاً ومألوفاً', 'قصة طويلة جداً', 'شيئاً مخيفاً', 'صمتاً تاماً'], 0, 'الموقف المألوف يسهل تمثيله وفهمه.'],
            ['كيف يجب أن يكون صوت الممثل في المشهد؟', ['بصوت مسموع وواضح', 'بهمس شديد', 'بالصراخ', 'بالصمت'], 0, 'الصوت الواضح يصل إلى الجمهور ويعبر عن المشهد.'],
            ['ماذا يفعل الممثل مع الجمهور؟', ['ينظر إليهم', 'يدير ظهره', 'يغلق عينيه', 'يخرج مسرعاً'], 0, 'النظر إلى الجمهور جزء من الأداء الجيد.'],
            ['ما فائدة التمثيل؟', ['فهم المشاعر والتعبير عنها', 'النوم', 'تجنب الكلام', 'إخفاء الوجه'], 0, 'التمثيل ينمي التعبير ويساعد على فهم مشاعر الآخرين.']
          ]
        }
      ]
    },
    'cur_l_p3_sub_sci': {
      shared: {
        sections: [
          ['المادة والشيء', 'كل شيء من حولنا مصنوع من مادة. المادة قد تكون صلبة أو سائلة أو غازية. نعرف المادة بخصائصها مثل اللون والرائحة.'],
          ['الطاقة والتغير', 'الطاقة تجعل الأشياء تتحرك أو تتغير. من أنواعها ضوء الشمس والكهرباء والحرارة. نلاحظ أثر الطاقة في حياتنا.'],
          ['خطوات التجربة', 'تبدأ التجربة بسؤال نريد الإجابة عنه. ثم نضع فرضية ونجرّب ونلاحظ. أخيراً نسجل النتيجة ونقارنها بالتوقع.'],
          ['البيئة والمحافظة', 'البيئة هي ما يحيط بنا من هواء وماء ونباتات. نحافظ عليها بعدم إتلاف النبات وترشيد الماء. كل كائن له دور في الطبيعة.']
        ],
        vocab: [
          ['مادة', 'كل ما يشغل حيزاً وله كتلة.'],
          ['صلب', 'مادة تحافظ على شكلها مثل الحجر.'],
          ['سائل', 'مادة تأخذ شكل الإناء مثل الماء.'],
          ['طاقة', 'ما يساعد الأشياء على الحركة أو التغير.'],
          ['تجربة', 'عمل منظم نجريه لاختبار فكرة.'],
          ['بيئة', 'كل ما يحيط بالكائن الحي.']
        ],
        outcomes: [
          'يصنف مواد بسيطة إلى صلبة وسائلة وغازية.',
          'يذكر أمثلة على الطاقة في حياته.',
          'يتبع خطوات تجربة بسيطة ويسجل ملاحظاته.',
          'يقترح سلوكاً للمحافظة على البيئة.'
        ],
        outcomeTr: {
          fr: [
            'Classer des matériaux simples en solides, liquides et gazeux.',
            "Citer des exemples d'énergie dans sa vie quotidienne.",
            "Suivre les étapes d'une expérience simple et noter ses observations.",
            "Proposer un comportement pour protéger l'environnement."
          ],
          en: [
            'Classify simple materials as solid, liquid, or gas.',
            'Give examples of energy in everyday life.',
            'Follow the steps of a simple experiment and record observations.',
            'Propose an action to protect the environment.'
          ]
        },
        diagram: 'diagram-states-of-matter.svg'
      },
      lessons: [
        {
          t: 'حالات المادة',
          intro: 'المادة تأخذ أشكالاً مختلفة. نتعرف اليوم على الصلب والسائل والغاز.',
          sections: [
            ['الصلب والسائل', 'الحجر والخشب مواد صلبة تحافظ على شكلها. الماء والحليب مواد سائلة تأخذ شكل الإناء. نلاحظ الفرق بالنظر واللمس.'],
            ['الغاز من حولنا', 'الهواء غاز لا نراه لكننا نحس به. يملأ الغاز كل المساحة المتاحة له. البالون المملوء بالهواء مثال واضح.']
          ],
          examples: [
            ['صنّف المواد', ['خذ حجراً وكوب ماء.', 'قل: الحجر صلب.', 'قل: الماء سائل.'], 'حجر صلب وماء سائل'],
            ['جرّب مع البالون', ['انفخ بالوناً.', 'لاحظ أنه يمتلئ بالهواء.', 'قل: الهواء غاز.'], 'البالون فيه غاز']
          ],
          questions: [
            ['أي مادة سائلة؟', ['الماء', 'الحجر', 'الخشب', 'الملعقة'], 0, 'الماء يأخذ شكل الإناء، لذلك هو سائل.'],
            ['كيف نعرف المادة الصلبة؟', ['تحافظ على شكلها', 'تتغير بسرعة', 'لا ترى', 'تطير'], 0, 'المادة الصلبة تحتفظ بشكلها ولا تأخذ شكل الإناء.'],
            ['ما الذي يملأ البالون؟', ['الهواء', 'الماء', 'الرمل', 'الزيت'], 0, 'الهواء غاز يملأ المساحة التي يجدها.'],
            ['لماذا نلاحظ الخصائص؟', ['لنميز بين المواد', 'لنغير لونها', 'لنزيد عددها', 'لنخفيها'], 0, 'الخصائص مثل الشكل والرائحة تساعد على تمييز المواد.']
          ],
          tr: {
            fr: {
              t: "Les états de la matière",
              intro: "La matière prend différentes formes. Aujourd'hui, nous découvrons le solide, le liquide et le gaz.",
              sections: [
                ["La matière et l'objet", "Tout ce qui nous entoure est fait de matière. La matière peut être solide, liquide ou gazeuse. On la reconnaît à ses propriétés comme la couleur et l'odeur."],
                ['Le solide et le liquide', "La pierre et le bois sont des matières solides qui gardent leur forme. L'eau et le lait sont des liquides qui prennent la forme du récipient. On observe la différence par la vue et le toucher."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les choses. Ses formes incluent la lumière du soleil, l'électricité et la chaleur. On observe ses effets dans notre vie."],
                ['Le gaz autour de nous', "L'air est un gaz qu'on ne voit pas mais qu'on sent. Un gaz occupe tout l'espace disponible. Un ballon gonflé en est un bon exemple."],
                ['Les étapes de l’expérience', "Une expérience commence par une question. On formule ensuite une hypothèse, on expérimente et on observe. Enfin, on note le résultat et on le compare à la prévision."],
                ["L'environnement et sa protection", "L'environnement est tout ce qui nous entoure : l'air, l'eau et les plantes. On le protège en n'abîmant pas les plantes et en économisant l'eau. Chaque être vivant a un rôle dans la nature."]
              ],
              vocab: [
                ['matière', "Tout ce qui occupe une place et a une masse."],
                ['solide', 'Une matière qui garde sa forme, comme la pierre.'],
                ['liquide', "Une matière qui prend la forme du récipient, comme l'eau."],
                ['énergie', 'Ce qui permet aux choses de bouger ou de changer.'],
                ['expérience', 'Une démarche organisée pour tester une idée.'],
                ['environnement', 'Tout ce qui entoure un être vivant.']
              ],
              examples: [
                ['Classer les matières', ["Prends une pierre et un verre d'eau.", 'Dis : la pierre est solide.', "Dis : l'eau est liquide."], "La pierre est solide et l'eau est liquide."],
                ['Essayer avec un ballon', ['Gonfle un ballon.', "Observe qu'il se remplit d'air.", "Dis : l'air est un gaz."], 'Le ballon contient un gaz.']
              ]
            },
            en: {
              t: 'States of Matter',
              intro: 'Matter takes different forms. Today we learn about solids, liquids, and gases.',
              sections: [
                ['Matter and Objects', 'Everything around us is made of matter. Matter can be solid, liquid, or gas. We recognize it by properties such as color and smell.'],
                ['Solids and Liquids', 'Stone and wood are solids that keep their shape. Water and milk are liquids that take the shape of their container. We notice the difference by looking and touching.'],
                ['Energy and Change', 'Energy makes things move or change. Its forms include sunlight, electricity, and heat. We observe its effects in our daily life.'],
                ['Gases Around Us', 'Air is a gas we cannot see but can feel. A gas fills all the space available to it. An inflated balloon is a clear example.'],
                ['Steps of an Experiment', 'An experiment starts with a question. Then we make a hypothesis, test it, and observe. Finally, we record the result and compare it with the prediction.'],
                ['The Environment and Its Protection', 'The environment is everything around us: air, water, and plants. We protect it by not damaging plants and by saving water. Every living thing has a role in nature.']
              ],
              vocab: [
                ['matter', 'Anything that takes up space and has mass.'],
                ['solid', 'Matter that keeps its shape, like a stone.'],
                ['liquid', 'Matter that takes the shape of its container, like water.'],
                ['energy', 'What makes things move or change.'],
                ['experiment', 'An organized procedure to test an idea.'],
                ['environment', 'Everything that surrounds a living thing.']
              ],
              examples: [
                ['Sort the materials', ['Take a stone and a glass of water.', 'Say: the stone is solid.', 'Say: the water is liquid.'], 'The stone is solid and the water is liquid.'],
                ['Try with a balloon', ['Blow up a balloon.', 'Notice it fills with air.', 'Say: air is a gas.'], 'The balloon contains a gas.']
              ]
            }
          }
        },
        {
          t: 'مصادر الطاقة',
          intro: 'نحتاج الطاقة في حياتنا اليومية. نتعرف على مصادرها وأثرها.',
          sections: [
            ['ضوء الشمس والحرارة', 'الشمس تعطينا الضوء والحرارة. الضوء يساعد النبات على النمو. الحرارة تجفف الملابس وتطبخ الطعام.'],
            ['الكهرباء في البيت', 'الكهرباء تشغل المصباح والثلاجة. نستخدمها بحذر ولا نلمس الأسلاك. ترشيد الكهرباء يحافظ على المال والبيئة.']
          ],
          examples: [
            ['لاحظ أثر الشمس', ['ضع قطعة قماش مبللة في الشمس.', 'انتظر قليلاً.', 'لاحظ أنها جفت.'], 'الشمس حرارة جففت القماش'],
            ['رشّد الكهرباء', ['أطفئ المصباح عند الخروج.', 'افصل الشاحن.', 'وفر الطاقة.'], 'تم ترشيد الكهرباء']
          ],
          questions: [
            ['ما الذي يعطينا الضوء نهاراً؟', ['الشمس', 'القمر', 'النجوم', 'المصباح'], 0, 'الشمس هي مصدر الضوء الطبيعي في النهار.'],
            ['ماذا تشغل الكهرباء؟', ['المصباح', 'الحجر', 'الشجرة', 'الكتاب'], 0, 'الكهرباء تشغل الأجهزة مثل المصباح.'],
            ['لماذا نطفئ المصباح؟', ['لترشيد الطاقة', 'ليزداد الضوء', 'لنكسره', 'ليصير أزرق'], 0, 'إطفاء المصباح غير المستخدم يوفر الكهرباء.'],
            ['كيف نساعد النبات على النمو؟', ['بضوء الشمس والماء', 'بالظلام', 'بالحجر', 'بالملح'], 0, 'النبات يحتاج ضوء الشمس والماء لينمو.']
          ],
          tr: {
            fr: {
              t: "Les sources d'énergie",
              intro: 'Nous avons besoin d’énergie chaque jour. Découvrons ses sources et ses effets.',
              sections: [
                ["La matière et l'objet", "Tout ce qui nous entoure est fait de matière. La matière peut être solide, liquide ou gazeuse. On la reconnaît à ses propriétés comme la couleur et l'odeur."],
                ['La lumière et la chaleur du soleil', 'Le soleil nous donne la lumière et la chaleur. La lumière aide les plantes à grandir. La chaleur sèche le linge et cuit les aliments.'],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les choses. Ses formes incluent la lumière du soleil, l'électricité et la chaleur. On observe ses effets dans notre vie."],
                ["L'électricité à la maison", "L'électricité fait fonctionner la lampe et le réfrigérateur. Nous l'utilisons avec prudence et ne touchons pas les fils. L'économiser protège l'argent et l'environnement."],
                ['Les étapes de l’expérience', 'Une expérience commence par une question. On formule ensuite une hypothèse, on expérimente et on observe. Enfin, on note le résultat et on le compare à la prévision.'],
                ["L'environnement et sa protection", "L'environnement est tout ce qui nous entoure : l'air, l'eau et les plantes. On le protège en n'abîmant pas les plantes et en économisant l'eau. Chaque être vivant a un rôle dans la nature."]
              ],
              vocab: [
                ['matière', "Tout ce qui occupe une place et a une masse."],
                ['solide', 'Une matière qui garde sa forme, comme la pierre.'],
                ['liquide', "Une matière qui prend la forme du récipient, comme l'eau."],
                ['énergie', 'Ce qui permet aux choses de bouger ou de changer.'],
                ['expérience', 'Une démarche organisée pour tester une idée.'],
                ['environnement', 'Tout ce qui entoure un être vivant.']
              ],
              examples: [
                ["Observer l'effet du soleil", ["Mets un linge humide au soleil.", 'Attends un peu.', "Observe qu'il a séché."], "La chaleur du soleil a séché le linge."],
                ["Économiser l'électricité", ['Éteins la lampe en sortant.', 'Débranche le chargeur.', "Économise l'énergie."], "L'électricité a été économisée."]
              ]
            },
            en: {
              t: 'Sources of Energy',
              intro: 'We need energy every day. Let us discover its sources and effects.',
              sections: [
                ['Matter and Objects', 'Everything around us is made of matter. Matter can be solid, liquid, or gas. We recognize it by properties such as color and smell.'],
                ['Sunlight and Heat', 'The sun gives us light and heat. Light helps plants grow. Heat dries clothes and cooks food.'],
                ['Energy and Change', 'Energy makes things move or change. Its forms include sunlight, electricity, and heat. We observe its effects in our daily life.'],
                ['Electricity at Home', 'Electricity powers the lamp and the refrigerator. We use it carefully and do not touch wires. Saving it protects money and the environment.'],
                ['Steps of an Experiment', 'An experiment starts with a question. Then we make a hypothesis, test it, and observe. Finally, we record the result and compare it with the prediction.'],
                ['The Environment and Its Protection', 'The environment is everything around us: air, water, and plants. We protect it by not damaging plants and by saving water. Every living thing has a role in nature.']
              ],
              vocab: [
                ['matter', 'Anything that takes up space and has mass.'],
                ['solid', 'Matter that keeps its shape, like a stone.'],
                ['liquid', 'Matter that takes the shape of its container, like water.'],
                ['energy', 'What makes things move or change.'],
                ['experiment', 'An organized procedure to test an idea.'],
                ['environment', 'Everything that surrounds a living thing.']
              ],
              examples: [
                ["Observe the sun's effect", ['Put a wet cloth in the sun.', 'Wait a little.', 'Notice it has dried.'], "The sun's heat dried the cloth."],
                ['Save electricity', ['Turn off the lamp when leaving.', 'Unplug the charger.', 'Save energy.'], 'Electricity was saved.']
              ]
            }
          }
        },
        {
          t: 'أقوم بتجربة بسيطة',
          intro: 'التجربة تساعدنا على الإجابة عن أسئلتنا. نتبع خطوات مرتبة.',
          sections: [
            ['السؤال والفرضية', 'نبدأ بسؤال: هل ينمو النبات في الظلام؟ ثم نكتب توقعاً نسميه الفرضية. الفرضية إجابة مؤقتة نختبرها.'],
            ['الملاحظة والتسجيل', 'نراقب التجربة كل يوم ونكتب ما نراه. التسجيل الدقيق يساعدنا على مقارنة النتيجة بالتوقع.']
          ],
          examples: [
            ['جرّب نمو النبات', ['ضع نبتتين: واحدة في الشمس وواحدة في الظلام.', 'اسقِهما بالمقدار نفسه.', 'سجل ملاحظاتك.'], 'نبات الشمس ينمو أفضل'],
            ['سجّل النتيجة', ['اكتب تاريخ اليوم.', 'صف لون النبتة.', 'قارن بين النبتتين.'], 'تم تسجيل الملاحظات']
          ],
          questions: [
            ['بماذا تبدأ التجربة؟', ['بسؤال', 'بالنتيجة', 'بالرسم', 'باللعب'], 0, 'كل تجربة تبدأ بسؤال نريد الإجابة عنه.'],
            ['كيف نسمي التوقع المؤقت الذي نختبره في التجربة؟', ['توقع نختبره', 'نتيجة نهائية', 'أداة تجربة', 'لون النبات'], 0, 'الفرضية إجابة مؤقتة نتحقق منها بالتجربة.'],
            ['لماذا نسجل الملاحظات؟', ['للمقارنة والتحليل', 'لإطالة التجربة', 'لتغيير السؤال', 'لإخفاء النتيجة'], 0, 'التسجيل يمكننا من مقارنة ما حدث بما توقعناه.'],
            ['ماذا يجب أن يكون متساوياً في التجربة؟', ['مقدار الماء', 'لون الورقة', 'اسم النبتة', 'وقت اليوم'], 0, 'تثبيت مقدار الماء يجعل المقارنة عادلة.']
          ],
          tr: {
            fr: {
              t: 'Je réalise une expérience simple',
              intro: 'Une expérience nous aide à répondre à nos questions. Suivons des étapes ordonnées.',
              sections: [
                ["La matière et l'objet", "Tout ce qui nous entoure est fait de matière. La matière peut être solide, liquide ou gazeuse. On la reconnaît à ses propriétés comme la couleur et l'odeur."],
                ["La question et l'hypothèse", "On commence par une question : la plante pousse-t-elle dans l'obscurité ? On écrit ensuite une prévision appelée hypothèse. C'est une réponse provisoire qu'on va tester."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les choses. Ses formes incluent la lumière du soleil, l'électricité et la chaleur. On observe ses effets dans notre vie."],
                ["L'observation et la notation", "On observe l'expérience chaque jour et on note ce qu'on voit. Une notation précise permet de comparer le résultat à la prévision."],
                ['Les étapes de l’expérience', 'Une expérience commence par une question. On formule ensuite une hypothèse, on expérimente et on observe. Enfin, on note le résultat et on le compare à la prévision.'],
                ["L'environnement et sa protection", "L'environnement est tout ce qui nous entoure : l'air, l'eau et les plantes. On le protège en n'abîmant pas les plantes et en économisant l'eau. Chaque être vivant a un rôle dans la nature."]
              ],
              vocab: [
                ['matière', "Tout ce qui occupe une place et a une masse."],
                ['solide', 'Une matière qui garde sa forme, comme la pierre.'],
                ['liquide', "Une matière qui prend la forme du récipient, comme l'eau."],
                ['énergie', 'Ce qui permet aux choses de bouger ou de changer.'],
                ['expérience', 'Une démarche organisée pour tester une idée.'],
                ['environnement', 'Tout ce qui entoure un être vivant.']
              ],
              examples: [
                ["Tester la croissance d'une plante", ["Place deux plants : un au soleil et un dans l'obscurité.", 'Arrose-les avec la même quantité.', 'Note tes observations.'], 'Le plant au soleil pousse mieux.'],
                ['Noter le résultat', ["Écris la date du jour.", 'Décris la couleur du plant.', 'Compare les deux plants.'], 'Les observations ont été notées.']
              ]
            },
            en: {
              t: 'I Carry Out a Simple Experiment',
              intro: 'An experiment helps us answer our questions. Let us follow clear steps.',
              sections: [
                ['Matter and Objects', 'Everything around us is made of matter. Matter can be solid, liquid, or gas. We recognize it by properties such as color and smell.'],
                ['The Question and the Hypothesis', 'We start with a question: does a plant grow in the dark? Then we write a prediction called a hypothesis. It is a temporary answer we will test.'],
                ['Energy and Change', 'Energy makes things move or change. Its forms include sunlight, electricity, and heat. We observe its effects in our daily life.'],
                ['Observation and Recording', 'We observe the experiment every day and write down what we see. Careful recording helps us compare the result with the prediction.'],
                ['Steps of an Experiment', 'An experiment starts with a question. Then we make a hypothesis, test it, and observe. Finally, we record the result and compare it with the prediction.'],
                ['The Environment and Its Protection', 'The environment is everything around us: air, water, and plants. We protect it by not damaging plants and by saving water. Every living thing has a role in nature.']
              ],
              vocab: [
                ['matter', 'Anything that takes up space and has mass.'],
                ['solid', 'Matter that keeps its shape, like a stone.'],
                ['liquid', 'Matter that takes the shape of its container, like water.'],
                ['energy', 'What makes things move or change.'],
                ['experiment', 'An organized procedure to test an idea.'],
                ['environment', 'Everything that surrounds a living thing.']
              ],
              examples: [
                ['Test plant growth', ['Put two plants: one in the sun and one in the dark.', 'Water them with the same amount.', 'Record your observations.'], 'The plant in the sun grows better.'],
                ['Record the result', ["Write today's date.", "Describe the plant's color.", 'Compare the two plants.'], 'The observations were recorded.']
              ]
            }
          }
        },
        {
          t: 'البيئة من حولنا',
          intro: 'ننظر إلى الهواء والماء والنباتات من حولنا ونتعلم كيف نحافظ عليها.',
          sections: [
            ['عناصر البيئة', 'البيئة تشمل الهواء والماء والتراب والنباتات والحيوانات. كل عنصر يؤثر في الآخر. شجرة الزيتون تعطي الظل والفاكهة.'],
            ['سلوكنا نحو البيئة', 'نرمي النفايات في السلة ولا نقطع الأشجار. نغلق الصنبور بعد الاستعمال. هذه الأفعال البسيطة تحمي البيئة.']
          ],
          examples: [
            ['احمِ شجرة', ['لا تقطع أغصانها.', 'اسقِها في الصيف.', 'اجلس في ظلها.'], 'الشجرة تنمو وتعطي الظل'],
            ['وفّر الماء', ['افتح الصنبور عند الحاجة.', 'أغلقه بعد غسل اليدين.', 'لا تدع الماء يضيع.'], 'تم توفير الماء']
          ],
          questions: [
            ['ماذا تشمل البيئة؟', ['الهواء والماء والنباتات', 'الكتب فقط', 'الملابس فقط', 'الطعام فقط'], 0, 'البيئة تشمل كل العناصر الطبيعية من حولنا.'],
            ['ماذا نفعل بالنفايات؟', ['نرميها في السلة', 'نرميها في الشارع', 'نحرقها', 'ندفنها في الحديقة'], 0, 'وضع النفايات في السلة يحافظ على نظافة المكان.'],
            ['كيف يساعد إغلاق الصنبور على حماية البيئة؟', ['لترشيد الماء', 'ليزداد الماء', 'لنكسره', 'ليصير بارداً'], 0, 'إغلاق الصنبور يمنع هدر الماء.'],
            ['ما دور شجرة الزيتون؟', ['تعطي الظل والفاكهة', 'تقلل الضوء', 'تجفف التراب', 'تصنع الكهرباء'], 0, 'الشجرة تفيد الكائنات بظلها وثمرها.']
          ],
          tr: {
            fr: {
              t: "L'environnement autour de nous",
              intro: "Regardons l'air, l'eau et les plantes autour de nous, et apprenons à les protéger.",
              sections: [
                ["La matière et l'objet", "Tout ce qui nous entoure est fait de matière. La matière peut être solide, liquide ou gazeuse. On la reconnaît à ses propriétés comme la couleur et l'odeur."],
                ["Les éléments de l'environnement", "L'environnement comprend l'air, l'eau, la terre, les plantes et les animaux. Chaque élément agit sur les autres. L'olivier donne de l'ombre et des fruits."],
                ["L'énergie et le changement", "L'énergie fait bouger ou changer les choses. Ses formes incluent la lumière du soleil, l'électricité et la chaleur. On observe ses effets dans notre vie."],
                ["Notre comportement envers l'environnement", "On jette les déchets à la poubelle et on ne coupe pas les arbres. On ferme le robinet après usage. Ces gestes simples protègent l'environnement."],
                ['Les étapes de l’expérience', 'Une expérience commence par une question. On formule ensuite une hypothèse, on expérimente et on observe. Enfin, on note le résultat et on le compare à la prévision.'],
                ["L'environnement et sa protection", "L'environnement est tout ce qui nous entoure : l'air, l'eau et les plantes. On le protège en n'abîmant pas les plantes et en économisant l'eau. Chaque être vivant a un rôle dans la nature."]
              ],
              vocab: [
                ['matière', "Tout ce qui occupe une place et a une masse."],
                ['solide', 'Une matière qui garde sa forme, comme la pierre.'],
                ['liquide', "Une matière qui prend la forme du récipient, comme l'eau."],
                ['énergie', 'Ce qui permet aux choses de bouger ou de changer.'],
                ['expérience', 'Une démarche organisée pour tester une idée.'],
                ['environnement', 'Tout ce qui entoure un être vivant.']
              ],
              examples: [
                ['Protéger un arbre', ["Ne casse pas ses branches.", 'Arrose-le en été.', "Assieds-toi à son ombre."], "L'arbre grandit et donne de l'ombre."],
                ["Économiser l'eau", ["Ouvre le robinet quand tu en as besoin.", "Ferme-le après t'être lavé les mains.", "Ne laisse pas l'eau couler."], "L'eau a été économisée."]
              ]
            },
            en: {
              t: 'The Environment Around Us',
              intro: "Let us look at the air, water, and plants around us, and learn to protect them.",
              sections: [
                ['Matter and Objects', 'Everything around us is made of matter. Matter can be solid, liquid, or gas. We recognize it by properties such as color and smell.'],
                ['Elements of the Environment', 'The environment includes air, water, soil, plants, and animals. Each element affects the others. The olive tree gives shade and fruit.'],
                ['Energy and Change', 'Energy makes things move or change. Its forms include sunlight, electricity, and heat. We observe its effects in our daily life.'],
                ['Our Behavior Toward the Environment', 'We throw rubbish in the bin and do not cut down trees. We turn off the tap after use. These simple actions protect the environment.'],
                ['Steps of an Experiment', 'An experiment starts with a question. Then we make a hypothesis, test it, and observe. Finally, we record the result and compare it with the prediction.'],
                ['The Environment and Its Protection', 'The environment is everything around us: air, water, and plants. We protect it by not damaging plants and by saving water. Every living thing has a role in nature.']
              ],
              vocab: [
                ['matter', 'Anything that takes up space and has mass.'],
                ['solid', 'Matter that keeps its shape, like a stone.'],
                ['liquid', 'Matter that takes the shape of its container, like water.'],
                ['energy', 'What makes things move or change.'],
                ['experiment', 'An organized procedure to test an idea.'],
                ['environment', 'Everything that surrounds a living thing.']
              ],
              examples: [
                ['Protect a tree', ['Do not break its branches.', 'Water it in summer.', 'Sit in its shade.'], 'The tree grows and gives shade.'],
                ['Save water', ['Open the tap when you need it.', 'Close it after washing your hands.', 'Do not let water run.'], 'Water was saved.']
              ]
            }
          }
        }
      ]
    },
    'cur_l_p4_sub_amz': {
      shared: {
        sections: [
          ['Le texte', "Un texte est un ensemble de phrases qui racontent ou expliquent quelque chose. On le lit d'abord en entier. Puis on revient sur les détails importants."],
          ['La compréhension', "Comprendre un texte demande de repérer les personnages, les lieux et les actions. On cherche les mots-clés. Les images peuvent aider à se représenter la scène."],
          ["L'expression", "Après la lecture, on exprime ce qu'on a compris avec ses propres mots. On écrit des phrases courtes et claires. On relit pour corriger."],
          ['La culture', "La culture amazighe est riche en histoires, en musique et en savoir-faire. On la découvre par les textes et les échanges. La respecter, c'est aussi la transmettre."]
        ],
        vocab: [
          ['texte', "Un ensemble de phrases écrites qui portent un sens."],
          ['personnage', 'Une personne ou un être qui agit dans un texte.'],
          ['mot-clé', 'Un mot important qui aide à comprendre le texte.'],
          ['compréhension', "Le fait de saisir le sens d'un texte."],
          ['expression', "Le fait de dire ou d'écrire ce que l'on pense."],
          ['culture', "Les traditions, les langues et les savoirs d'un peuple."]
        ],
        outcomes: [
          'Lire un court texte en français avec attention.',
          "Repérer les informations principales d'un texte.",
          "Écrire quelques phrases pour exprimer sa compréhension.",
          'Découvrir des éléments de la culture amazighe.'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'Lire un court texte',
          intro: "Nous lisons un petit texte sur la vie à l'école. Ensuite, nous en parlons ensemble.",
          sections: [
            ['Parcourir le texte', "On regarde d'abord le titre et les images. On lit le texte une première fois sans s'arrêter. On cherche ensuite le nom des personnages."],
            ['Les phrases du texte', 'Chaque phrase apporte une information. On s’arrête à la fin de chaque phrase pour réfléchir. Souligner les mots importants aide à retenir.']
          ],
          examples: [
            ['Lire une phrase', ["Lis : Azul, je m'appelle Yassine.", 'Cherche le nom du personnage.', 'Dis : Yassine.'], "Le personnage s'appelle Yassine."],
            ['Trouver le lieu', ["Lis : Nous sommes à l'école.", 'Cherche le mot qui indique le lieu.', "Dis : à l'école."], "Le lieu est l'école."]
          ],
          questions: [
            ["Qu'observe-t-on avant de lire un texte en français ?", ["On regarde le titre et les images", "On ferme le livre", "On écrit la fin", "On saute les phrases"], 0, 'Le titre et les images donnent une première idée du texte.'],
            ['Combien de fois lit-on un texte pour bien le comprendre ?', ['Plusieurs fois', 'Une seule fois', 'Jamais', 'Toujours vite'], 0, 'Une deuxième lecture permet de vérifier et de préciser le sens.'],
            ['Quel mot indique une personne dans un texte ?', ['Azul', 'Yassine', 'école', 'livre'], 0, 'Yassine est un nom de personne, contrairement aux autres mots.'],
            ['À quoi servent les mots importants ?', ["À retenir l'essentiel", "À allonger le texte", "À cacher le sens", 'À changer de langue'], 0, "Repérer les mots-clés aide à mémoriser l'information principale."]
          ]
        },
        {
          t: "Comprendre ce qu'on lit",
          intro: 'Après la lecture, nous vérifions que nous avons bien compris le texte.',
          sections: [
            ['Qui ? Où ? Quoi ?', "On se pose trois questions simples : qui agit, où se passe l'action, que se passe-t-il ? Les réponses se trouvent dans le texte. On les relit pour être sûr."],
            ['Chercher dans le texte', "On ne répond pas seulement avec sa mémoire. On retourne voir la phrase qui contient la réponse. Cela rend la réponse exacte."]
          ],
          examples: [
            ['Répondre avec le texte', ['Question : Où sont les élèves ?', 'Phrase : Les élèves sont dans la cour.', 'Réponse : Dans la cour.'], 'Les élèves sont dans la cour.'],
            ["Repérer l'action", ['Phrase : Yassine lit un livre.', 'Question : Que fait Yassine ?', 'Réponse : Il lit un livre.'], 'Il lit un livre.']
          ],
          questions: [
            ['Comment trouver une réponse sûre ?', ["En relisant la phrase du texte", 'En se fiant seulement à la mémoire', 'En devinant au hasard', 'En changeant de page'], 0, 'La réponse correcte se lit dans le texte lui-même.'],
            ['Dans la phrase Les élèves sont dans la cour, où sont-ils ?', ['Dans la cour', 'À la maison', 'Dans la classe', 'Au souk'], 0, "Le texte indique clairement le lieu : dans la cour."],
            ["Quelle question cherche l'action ?", ['Que fait-il ?', 'Qui est-il ?', 'Où est-il ?', 'Combien ?'], 0, 'La question « Que fait-il ? » porte sur l’action.'],
            ["Quand le texte ne donne pas la réponse ?", ["On le dit poliment", 'On invente une réponse', 'On rit', "On s'en va"], 0, "Reconnaître ce qu'on ne sait pas est une attitude honnête."]
          ]
        },
        {
          t: "S'exprimer après la lecture",
          intro: "Nous disons et écrivons ce que nous avons compris avec nos propres mots.",
          sections: [
            ['Dire avec ses mots', "On résume le texte en une ou deux phrases. On peut commencer par : Le texte parle de... Résumer montre qu'on a compris."],
            ['Écrire une réponse', "On écrit une phrase courte avec une majuscule et un point. On relit pour vérifier l'orthographe. Une phrase claire suffit."]
          ],
          examples: [
            ['Résumer en une phrase', ["Le texte parle d'un élève.", 'Il s’appelle Yassine.', 'Résumé : Le texte parle de Yassine, un élève.'], 'Le texte parle de Yassine, un élève.'],
            ['Corriger une phrase', ['Phrase : yassine lit un livre', 'Ajoute la majuscule et le point.', 'Écris : Yassine lit un livre.'], 'Yassine lit un livre.']
          ],
          questions: [
            ['Comment commencer un résumé ?', ['Le texte parle de...', 'Fin du texte', 'Point final', 'Une image'], 0, 'Cette formule introduit clairement le sujet du résumé.'],
            ["Que faut-il à la fin d'une phrase ?", ['Un point', 'Une virgule devant', 'Un tiret', 'Rien'], 0, 'La phrase française se termine par un point.'],
            ["Pourquoi relire ce qu'on a écrit ?", ['Pour corriger les erreurs', 'Pour ajouter des pages', 'Pour changer le titre', 'Pour effacer le texte'], 0, 'La relecture permet de repérer et corriger les erreurs.'],
            ["Qu'est-ce qu'un résumé ?", ['Une courte présentation de l’essentiel', 'Une copie longue du texte', 'Un dessin seul', 'Une question'], 0, 'Le résumé garde seulement les idées principales.']
          ]
        },
        {
          t: 'Découvrir la culture amazighe',
          intro: "La langue et les traditions amazighes font partie de la vie au Maroc. Nous les découvrons ensemble.",
          sections: [
            ['La tamazight au Maroc', "La tamazight est parlée dans plusieurs régions du Maroc. On l'écrit avec des signes appelés tifinagh. La carte du Maroc permet de situer les régions."],
            ['Les savoir-faire', "La culture amazighe comprend la musique, les contes et l'artisanat. Les tapis et les poteries racontent une histoire. Respecter ces savoirs, c'est aussi les garder vivants."]
          ],
          examples: [
            ['Situer sur la carte', ['Regarde la carte du Maroc.', 'Repère le pays dans son ensemble.', "Dis : c'est le Maroc."], "C'est le Maroc."],
            ['Découvrir un conte', ["Écoute le début d'un conte.", 'Retiens le personnage principal.', 'Raconte-le en une phrase.'], 'Le conte se transmet par la parole.']
          ],
          questions: [
            ['Comment écrit-on la tamazight ?', ['Avec des signes tifinagh', 'Avec des chiffres', 'Avec des images seules', 'Avec des notes de musique'], 0, "L'écriture tifinagh est utilisée pour la tamazight."],
            ['Quels savoirs font partie de la culture amazighe ?', ["Les contes et l'artisanat", 'Les seuls jeux vidéo', 'La météo', 'Les prix des magasins'], 0, 'Les contes, la musique et l’artisanat transmettent la culture.'],
            ['Que montre une carte du Maroc ?', ['La situation des régions', "Le nombre d'élèves", 'L’heure', 'Le prix du pain'], 0, 'Une carte permet de situer les régions d’un pays.'],
            ['Comment garder une culture vivante ?', ["En la connaissant et en la transmettant", 'En l’oubliant', 'En la cachant', 'En la remplaçant par une autre'], 0, 'Connaître et transmettre permet de préserver une culture.']
          ]
        }
      ]
    },
    'cur_l_p5_sub_ar': {
      shared: {
        sections: [
          ['النص الأدبي', 'النص الأدبي يستخدم لغة جميلة وصوراً فنية. نقرأه أكثر من مرة لنحس بإيقاعه. نلاحظ الأفكار الرئيسة وطريقة التعبير.'],
          ['التحليل والتفسير', 'التحليل يعني تفكيك النص إلى أجزاء لفهمه. نسأل عن المعنى والغرض من الكتابة. ثم نربط بين الأفكار ونفسر الاختيارات.'],
          ['التعبير الكتابي', 'الكتابة المنظمة تبدأ بفكرة واضحة. نرتب الأفكار في مقدمة وعرض وخاتمة. ثم نراجع الأسلوب واللغة.'],
          ['القواعد والاستخدام', 'القواعد تساعدنا على كتابة صحيحة. نتعلمها في سياق النص لا بشكل منفصل. تطبيق القاعدة في الكتابة يثبتها.']
        ],
        vocab: [
          ['نص', 'كتابة مترابطة تحمل فكرة أو قصة.'],
          ['فكرة رئيسة', 'المعنى الأساسي الذي يريد الكاتب إيصاله.'],
          ['صورة فنية', 'تشبيه أو استعارة تجمّل التعبير.'],
          ['تحليل', 'تفكيك النص لفهم أجزائه وعلاقاتها.'],
          ['أسلوب', 'طريقة الكاتب في اختيار الكلمات والجمل.'],
          ['مراجعة', 'إعادة النظر في الكتابة لتحسينها.']
        ],
        outcomes: [
          'يحدد الفكرة الرئيسة في نص أدبي.',
          'يحلل صورة فنية ويشرح دلالتها.',
          'يكتب فقرة منظمة بمقدمة وخاتمة.',
          'يطبق قاعدة نحوية في سياق كتابته.'
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'قراءة نص أدبي',
          intro: 'نقرأ نصاً أدبياً قصيراً ونستمتع بلغته وصوره.',
          sections: [
            ['الإيقاع والصور', 'النص الأدبي يحمل إيقاعاً في اختيار الكلمات. الصور الفنية مثل التشبيه تجعل المعنى حياً. نقرأ بصوت هادئ لنحس بجماله.'],
            ['الفكرة العامة', 'بعد القراءة نحدد ما يتحدث عنه النص. نبحث عن الجملة التي تلخص المعنى. الفكرة العامة تجمع التفاصيل في معنى واحد.']
          ],
          examples: [
            ['استخرج الفكرة', ['اقرأ: شجرة الزيتون تظل عطاء للأسرة.', 'اسأل: ما موضوع الجملة؟', 'الجواب: عطاء شجرة الزيتون.'], 'الفكرة: عطاء شجرة الزيتون'],
            ['لاحظ صورة فنية', ['الجملة: القمر وجهٌ يضحك.', 'الصورة تشبه القمر بوجه.', 'الدلالة: القمر يبدو جميلاً.'], 'تشبيه القمر بوجه يضحك']
          ],
          questions: [
            ['ما الذي يميز النص الأدبي؟', ['اللغة الجميلة والصور الفنية', 'خلوه من المعنى', 'قصره الشديد', 'كثرة الأرقام'], 0, 'النص الأدبي يعتمد على جمال التعبير والصور الفنية.'],
            ['كيف نجد الفكرة العامة؟', ['نلخص المعنى الذي يجمع الجمل', 'نعد الحروف', 'نقرأ آخر سطر فقط', 'نغير الكلمات'], 0, 'الفكرة العامة هي المعنى المشترك الذي يربط أجزاء النص.'],
            ['في جملة القمر وجهٌ يضحك، ما الصورة الفنية؟', ['تشبيه القمر بوجه', 'ذكر عدد النجوم', 'وصف لون السماء', 'ذكر وقت الليل'], 0, 'الجملة شبهت القمر بوجه يضحك، وهذا تشبيه.'],
            ['لماذا تعيد قراءة النص الأدبي لفهم إيقاعه؟', ['لفهم الأفكار والإحساس بالأسلوب', 'لحذف الصور', 'لتغيير الكاتب', 'لتقليل القراءة'], 0, 'إعادة القراءة تكشف طبقات المعنى وجمال الأسلوب.']
          ]
        },
        {
          t: 'تحليل النص وتفسيره',
          intro: 'نفكك النص إلى أفكار ونفسر اختيارات الكاتب.',
          sections: [
            ['من الفكرة إلى الدليل', 'كل فكرة في النص تحتاج إلى دليل من جمله. نضع تحته خطاً ثم نشرحه بكلماتنا. التحليل يجعل الفهم عميقاً.'],
            ['غرض الكاتب', 'نسأل: لماذا كتب الكاتب هذا النص؟ قد يريد إقناعنا أو تعليمنا أو إمتاعنا. معرفة الغرض تساعد على تفسير الاختيارات.']
          ],
          examples: [
            ['اربط الفكرة بالدليل', ['الفكرة: شجرة الزيتون عطاء.', 'الدليل: تعطي الزيت والظل.', 'نكتب: تدل على العطاء.'], 'الدليل يؤكد الفكرة'],
            ['حدّد الغرض', ['النص يشرح فوائد الشجرة.', 'السؤال: هل يريد تعليماً أم إمتاعاً؟', 'الجواب: يريد التعليم.'], 'غرض النص التعليم']
          ],
          questions: [
            ['ما التحليل؟', ['تفكيك النص لفهم أجزائه', 'كتابة نص جديد', 'حفظ النص', 'تغيير العنوان'], 0, 'التحليل يفكك النص إلى أفكار وأدلة لفهمه.'],
            ['كيف ندعم الفكرة؟', ['بدليل من النص', 'برأي شخصي فقط', 'بلون الورق', 'بعدد الأسطر'], 0, 'الدليل من النص يجعل التحليل صحيحاً ومقنعاً.'],
            ['لماذا نسأل عن غرض الكاتب؟', ['لفهم سبب الكتابة', 'لزيادة عدد الكلمات', 'لتغيير اللغة', 'لحذف الفكرة'], 0, 'معرفة الغرض تفسر لماذا اختار الكاتب أفكاره وأسلوبه.'],
            ['إذا شرح النص فوائد نبات، فغرضه غالباً:', ['التعليم', 'الترفيه فقط', 'البيع', 'الشكوى'], 0, 'شرح المعلومات يهدف إلى تعليم القارئ.']
          ]
        },
        {
          t: 'كتابة فقرة منظمة',
          intro: 'نكتب فقرة واضحة تبدأ بفكرة وتنتهي بخاتمة.',
          sections: [
            ['المقدمة والعرض', 'نبدأ بجملة تقدم الموضوع. ثم نكتب جملات تشرح الفكرة وتدعمها. كل جملة تؤدي إلى التي تليها.'],
            ['الخاتمة والترابط', 'نختم بجملة تلخص الرأي. نستخدم أدوات ربط مثل لأنّ ولهذا. الترابط يجعل الفقرة سهلة القراءة.']
          ],
          examples: [
            ['نظّم فقرة', ['المقدمة: شجرة الزيتون مفيدة.', 'العرض: تعطي الزيت والظل.', 'الخاتمة: لذلك نحترمها.'], 'فقرة كاملة مرتبة'],
            ['استخدم أداة ربط', ['لدينا: الشجرة تعطي ظلاً. نحبها.', 'نضيف: لذلك.', 'نكتب: الشجرة تعطي ظلاً، لذلك نحبها.'], 'الجملتان مرتبطتان']
          ],
          questions: [
            ['بماذا تبدأ الفقرة المنظمة؟', ['بمقدمة تعرف بالموضوع', 'بالخاتمة', 'بسؤال فقط', 'بفراغ'], 0, 'المقدمة تهيئ القارئ لفكرة الفقرة.'],
            ['ما أداة الربط في الجملة؟', ['لذلك', 'الشجرة', 'الظل', 'الزيت'], 0, 'لذلك أداة ربط تدل على نتيجة ما قبلها.'],
            ['ماذا تكتب في الخاتمة؟', ['خلاصة الرأي', 'عنواناً جديداً', 'سؤالاً غريباً', 'رقماً'], 0, 'الخاتمة تلخص الفكرة أو تعطي رأياً واضحاً.'],
            ['لماذا نرتب الجمل؟', ['ليسهل فهم الفقرة', 'لتطويلها', 'لتقليل الكلمات', 'لتغيير الموضوع'], 0, 'الترتيب المنطقي يقود القارئ من فكرة إلى أخرى.']
          ]
        },
        {
          t: 'قواعد نحوية في السياق',
          intro: 'نتعلم قاعدة نحوية ونطبقها في جمل من إنشائنا.',
          sections: [
            ['المبتدأ والخبر المرفوعان', 'الجملة الاسمية تحتاج إلى مبتدأ وخبر. كلاهما يرفع في الجملة الصحيحة. مثل: الشجرةُ مثمرةٌ.'],
            ['تطبيق القاعدة', 'نقرأ الجملة ثم نحدد المبتدأ والخبر. نضع علامة الرفع ونتحقق من صحتها. التطبيق في الكتابة يثبت القاعدة.']
          ],
          examples: [
            ['طبّق القاعدة', ['الجملة: الطالبُ مجتهدٌ.', 'المبتدأ: الطالبُ.', 'الخبر: مجتهدٌ.'], 'المبتدأ والخبر مرفوعان'],
            ['صحّح جملة', ['كتبنا: الطالبُ مجتهدَ.', 'الخبر يجب أن يكون مرفوعاً.', 'نكتب: الطالبُ مجتهدٌ.'], 'الجملة صحيحة']
          ],
          questions: [
            ['ما إعراب المبتدأ في الجملة الاسمية؟', ['مرفوع', 'منصوب', 'مجرور', 'مجزوم'], 0, 'المبتدأ دائماً مرفوع في الجملة الاسمية.'],
            ['ما الخبر في جملة الشجرةُ مثمرةٌ؟', ['مثمرةٌ', 'الشجرةُ', 'ال', 'ة'], 0, 'الخبر هو الكلمة التي تخبر عن المبتدأ، وهي مثمرةٌ.'],
            ['كيف نثبت القاعدة؟', ['بتطبيقها في جمل', 'بحفظها دون استخدام', 'بتجاهلها', 'بتغييرها'], 0, 'التطبيق العملي يجعل القاعدة مألوفة في الكتابة.'],
            ['لماذا نراجع الإعراب؟', ['لكتابة صحيحة', 'لتغيير المعنى', 'لزيادة الكلمات', 'لحذف الجملة'], 0, 'مراجعة الإعراب تمنع الأخطاء النحوية في الكتابة.']
          ]
        }
      ]
    },
    'cur_l_p5_sub_cul': {
      shared: {
        sections: [
          ['الثقافة في حياتنا', 'الثقافة هي ما ورثناه من عادات ولغة وفنون. نراها في البيت والمدرسة والسوق. الثقافة تعطينا هوية نعتز بها.'],
          ['التنوع والتكامل', 'المغرب بلد متعدد الثقافات واللغات. العربية والأمازيغية من لغات البلد. التنوع يثري الحياة ويجعلها جميلة.'],
          ['المشاركة في المجتمع', 'المواطن يشارك في خدمة مجتمعه. يحترم القوانين ويساعد المحتاج. المشاركة تجعل الحياة أفضل للجميع.'],
          ['المسؤولية اليومية', 'المسؤولية تبدأ بأفعال صغيرة مثل تنظيف الصف. نحافظ على الممتلكات العامة ونقول الصدق. كل فعل مسؤول يبني مجتمعاً قوياً.']
        ],
        vocab: [
          ['ثقافة', 'مجموعة العادات واللغة والفنون التي ورثناها.'],
          ['تراث', 'ما خلفه لنا الأجداد من عادات ومهارات.'],
          ['هوية', 'ما يميزنا كأفراد وكمجتمع.'],
          ['مواطنة', 'انتماء الإنسان إلى وطنه وحقوقه وواجباته.'],
          ['احترام', 'تقدير الآخرين وقواعد المجتمع.'],
          ['مشاركة', 'اشتراك الفرد في عمل يفيد الجماعة.']
        ],
        outcomes: [
          'يذكر أمثلة على مظاهر الثقافة المغربية.',
          'يميز بين عناصر التراث والفنون.',
          'يقدّر أهمية التنوع اللغوي والثقافي.',
          'يطبق سلوكاً يعبر عن مواطنة مسؤولة.'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'مظاهر الثقافة المغربية',
          intro: 'نكتشف عادات وتقاليد تميز مجتمعنا المغربي.',
          sections: [
            ['في البيت والسوق', 'نرى الثقافة في اللباس المغربي وفي الأطباق الشهية. في السوق نسمع العربية والأمازيغية. وعلى خريطة المغرب نجد مدناً مثل الرباط ومراكش وفاس.'],
            ['المناسبات والأعياد', 'في الأعياد يجتمع الأهل ويتبادلون الهدايا. نلبس الملابس الجميلة ونزور الأقارب. المناسبات تحفظ الروابط الأسرية.']
          ],
          examples: [
            ['صفّ عادة مغربية', ['اختر عادة: شرب الشاي.', 'قل متى نمارسها.', 'قل: نقدم الشاي للضيوف.'], 'تقديم الشاي للضيوف عادة كريمة'],
            ['اربط الفعل بالثقافة', ['الفعل: زيارة الأقارب في العيد.', 'الفائدة: تقوية الروابط.', 'النتيجة: أسرة متماسكة.'], 'الزيارة تقوي الروابط']
          ],
          questions: [
            ['ما الثقافة؟', ['العادات واللغة والفنون الموروثة', 'الطعام فقط', 'الملابس فقط', 'المدرسة فقط'], 0, 'الثقافة تشمل كل ما ورثناه من عادات ولغة وفنون.'],
            ['أين نرى الثقافة المغربية؟', ['في البيت والسوق والمناسبات', 'في الفضاء', 'في البحر فقط', 'في الكتب فقط'], 0, 'الثقافة تظهر في مواقف الحياة اليومية.'],
            ['ما فائدة زيارة الأقارب في الأعياد؟', ['تقوية الروابط الأسرية', 'زيادة التعب', 'تغيير الاسم', 'حذف العيد'], 0, 'الزيارة تقرب الأهل وتحفظ المحبة.'],
            ['لماذا نعتز بثقافتنا؟', ['لأنها هويتنا', 'لأنها قديمة فقط', 'لأنها سهلة', 'لأنها صغيرة'], 0, 'الثقافة تعبر عن هوية المجتمع وتاريخه.']
          ]
        },
        {
          t: 'الفنون والتراث المغربي',
          intro: 'نتعرف على فنون المغرب وحرفه التي خلفها الأجداد.',
          sections: [
            ['الصناعات التقليدية', 'الزليج والسجاد والفخار من الصناعات التقليدية. الحرفي يتقن مهنته بصبر وتركيز. هذه المهارات تنتقل من جيل إلى آخر.'],
            ['الموسيقى والحكايات', 'الموسيقى المغربية تستخدم آلات مثل العود والدف. الحكايات الشفوية تنقل القيم والأخلاق. الفن يجمع الناس في الأفراح والمجالس.']
          ],
          examples: [
            ['عرّف حرفة', ['اختر: صناعة السجاد.', 'قل: تُصنع يدوياً.', 'قل: تنتقل من الأجداد.'], 'السجاد حرفة موروثة'],
            ['احتفظ بالتراث', ['استمع إلى حكاية من جدك.', 'دوّنها في ورقة.', 'احكها لزميلك.'], 'تم نقل الحكاية']
          ],
          questions: [
            ['أي حرفة مغربية؟', ['صناعة السجاد', 'صناعة الطائرات', 'صناعة السيارات', 'صناعة الحاسوب'], 0, 'السجاد من الصناعات التقليدية المعروفة في المغرب.'],
            ['كيف يكتسب الحرفي مهنته؟', ['بالتدريب والصبر', 'بالصدفة', 'بالقراءة فقط', 'بالنوم'], 0, 'إتقان الحرفة يحتاج تدريباً طويلاً وصبراً.'],
            ['ماذا تنقل الحكايات؟', ['القيم والأخلاق', 'الأرقام فقط', 'الطقس', 'الأسعار'], 0, 'الحكايات تحمل دروساً ومعاني تربوية.'],
            ['لماذا نحافظ على التراث؟', ['لننقله للأجيال', 'لننساه', 'لنبيعه', 'لتغييره'], 0, 'المحافظة على التراث تحفظ هوية المجتمع وتاريخه.']
          ]
        },
        {
          t: 'الرياضة في حياتنا',
          intro: 'الرياضة جزء من حياتنا اليومية، في المدرسة وفي الحي.',
          sections: [
            ['ألعاب مشهورة', 'كرة القدم والجري من الرياضات المحبوبة. نلعبها في الملعب أو في الساحة. الرياضة تقوي الجسم وتعلمنا التعاون.'],
            ['الروح الرياضية', 'نحترم الحكم ونعترف بنتيجة المباراة. نهنئ الفائز ونواسي الخاسر. الروح الرياضية أهم من الفوز.']
          ],
          examples: [
            ['طبّق الروح الرياضية', ['خسر فريقك المباراة.', 'قل: أحسنتهم.', 'صافح الخصم.'], 'تصرفت بروح رياضية'],
            ['نظّم لعبة', ['اختر فريقين.', 'حدد وقتاً قصيراً.', 'ابدأ اللعب بعد التحية.'], 'اللعبة منظمة']
          ],
          questions: [
            ['ما فائدة ممارسة الرياضة في الملعب أو الساحة؟', ['تقوية الجسم والتعاون', 'إضعاف الجسم', 'الخلاف', 'الكسل'], 0, 'الرياضة تقوي الصحة وتنمي العمل الجماعي.'],
            ['كيف نتعامل مع الفريق الخاسر؟', ['نواسيه ونشجعه', 'نسخر منه', 'نتركه', 'نغضب'], 0, 'المواساة جزء من الروح الرياضية.'],
            ['ماذا يعني احترام الحكم؟', ['قبول قراراته', 'الاعتراض دائماً', 'تجاهله', 'تغييره'], 0, 'احترام الحكم يعني قبول قراراته بهدوء.'],
            ['لماذا نحدد وقتاً للعبة؟', ['لتنظيم اللعب', 'لإطالته', 'لإلغائه', 'لتغيير الفريق'], 0, 'تحديد الوقت يجعل اللعبة منظمة وعادلة.']
          ]
        },
        {
          t: 'مواطنة مسؤولة',
          intro: 'المواطن الصالح يحترم القواعد ويساعد مجتمعه.',
          sections: [
            ['الحقوق والواجبات', 'للمواطن حقوق مثل التعليم والأمان. وعليه واجبات مثل احترام القانون والمحافظة على المال العام. الحقوق والواجبات متلازمان.'],
            ['السلوك اليومي', 'نحافظ على نظافة الشارع ولا نكتب على الجدران. نقول الصدق ونؤدي الأمانة. الأفعال الصغيرة تصنع مجتمعاً أفضل.']
          ],
          examples: [
            ['قرار مسؤول', ['وجدت محفظة في الطريق.', 'سلمتها للجهة المختصة.', 'كنت أميناً.'], 'اخترت الأمانة'],
            ['حافظ على المال العام', ['رأيت شخصاً يكتب على الجدار.', 'نصحته بلطف.', 'الجدار بقي نظيفاً.'], 'حافظت على الممتلكات']
          ],
          questions: [
            ['ماذا يعني المال العام؟', ['مال يملكه جميع أفراد المجتمع', 'مال شخص واحد', 'مال المدرسة فقط', 'مال البنك فقط'], 0, 'المال العام مملوك للمجتمع كله ويجب حمايته.'],
            ['ماذا نفعل إذا وجدنا شيئاً ضائعاً؟', ['نسلمه للجهة المختصة', 'نأخذه', 'نرميه', 'نبيعه'], 0, 'تسليم المفقود عمل أمين يحمي صاحبه.'],
            ['كيف ننصح من يكتب على الجدار؟', ['بلطف واحترام', 'بالصراخ', 'بالدفع', 'بالصمت'], 0, 'النصيحة اللطيفة أقبل للإصلاح.'],
            ['لماذا نحترم القوانين؟', ['لتنظيم حياة المجتمع', 'لزيادة الفوضى', 'لتغييرها', 'لإلغائها'], 0, 'القوانين تحمي حقوق الجميع وتنظم التعايش.']
          ]
        }
      ]
    },
    'cur_l_p6_sub_isl': {
      shared: {
        sections: [
          ['العقيدة والعبادة', 'الإسلام دين التوحيد والعبادة. من العبادات الصلاة التي يؤديها المسلم في أوقاتها. العبادة تربي الإنسان على الانضباط والإخلاص.'],
          ['المعاملات', 'ينظم الإسلام البيع والشراء والصداقة. الصدق والعدل أساس المعاملات. الكذب والغش يفسدان الثقة بين الناس.'],
          ['الأخلاق', 'الأخلاق الحسنة مثل الرحمة والكرم والحياء. النبي محمد صلى الله عليه وسلم كان حسن الخلق. التخلق بالأخلاق يقرب الإنسان من الله.'],
          ['التاريخ والقدوة', 'تاريخ الإسلام يحمل دروساً من حياة النبي والصحابة. نقرأ السيرة لنتعلم الصبر والشجاعة. القدوة الحسنة توجه سلوكنا.']
        ],
        vocab: [
          ['فقه', 'علم بأحكام الشرع في العبادات والمعاملات.'],
          ['صدق', 'مطابقة القول للفعل والحق.'],
          ['أمانة', 'حفظ حقوق الآخرين دون خيانة.'],
          ['رحمة', 'الرفق بالناس والشفقة عليهم.'],
          ['تعاون', 'مساعدة الناس بعضهم بعضاً في الخير.'],
          ['سيرة', 'حياة النبي محمد صلى الله عليه وسلم وأخلاقه.']
        ],
        outcomes: [
          'يذكر أحكاماً بسيطة للبيع والشراء.',
          'يمثل سلوكاً أخلاقياً في موقف يومي.',
          'يبين فوائد التعاون في المجتمع.',
          'يستخلص درساً من حادثة من السيرة.'
        ],
        diagram: 'diagram-prayer.svg'
      },
      lessons: [
        {
          t: 'أحكام البيع والشراء',
          intro: 'البيع والشراء من المعاملات اليومية. نتعلم كيف نكون صادقين وأمناء.',
          sections: [
            ['الصدق في البيع', 'يقول البائع الحقيقة عن السلعة ولا يخفي عيبها. المشتري يسأل ويختار بوضوح. الصدق يبني الثقة بين الناس.'],
            ['العدل والرضا', 'يحدد الثمن باتفاق ورضا من الطرفين. لا يغبن أحد الآخر في الميزان. الوفاء بالعهد يحفظ الحقوق.']
          ],
          examples: [
            ['بائع صادق', ['عرض بائع تفاحاً فيه عيب.', 'أخبر المشتري بالعيب.', 'اشترى المشتري وهو راضٍ.'], 'الصدق أنجز البيع'],
            ['ميزان عادل', ['وزن البائع السلعة.', 'لم ينقص الوزن.', 'أخذ المشتري حقه كاملاً.'], 'العدل في الميزان']
          ],
          questions: [
            ['ما أساس المعاملات في الإسلام؟', ['الصدق والعدل', 'الخداع', 'السرعة فقط', 'الصمت'], 0, 'الصدق والعدل يحفظان الحقوق ويبنيان الثقة.'],
            ['ماذا يفعل البائع الصادق؟', ['يخبر عن عيب السلعة', 'يخفي العيب', 'يغالي في الثمن', 'يضغط على المشتري'], 0, 'إخبار المشتري بالعيب من الصدق الواجب.'],
            ['كيف يكون الثمن عادلاً؟', ['باتفاق ورضا الطرفين', 'بقوة البائع', 'بصمت المشتري', 'بزيادة عشوائية'], 0, 'العدل أن يرضى الطرفان بالثمن دون إكراه.'],
            ['لماذا نحفظ الأمانة في البيع؟', ['لنحافظ على الحقوق', 'لنزيد الربح فقط', 'لتغيير السلعة', 'لإنهاء الوقت'], 0, 'الأمانة تمنع أكل حق الآخرين بغير وجه حق.']
          ]
        },
        {
          t: 'الأخلاق الإسلامية',
          intro: 'الأخلاق الحسنة تزين المؤمن وتجعله محبوباً بين الناس.',
          sections: [
            ['الرحمة والرفق', 'الرحمة تجعلنا نعامل الناس بلطف. نرفق بالضعفاء ونعين المحتاج. الرفق يكسب القلوب ويخفف المشقة.'],
            ['الحياء والكرم', 'الحياء يمنع من القول القبيح. الكرم يدفعنا إلى العطاء والعفو. هذه الأخلاق كانت تظهر في حياة النبي.']
          ],
          examples: [
            ['موقف رحمة', ['رأيت طفلاً تعثر.', 'ساعدته وقلت له لا بأس.', 'شعر بالاطمئنان.'], 'رحمت الطفل'],
            ['موقف كرم', ['معك طعام وزميلك جائع.', 'شاركته إياه.', 'فرحا معاً.'], 'الكرم في المشاركة']
          ],
          questions: [
            ['ما الرحمة؟', ['الرفق بالناس والمشفقة عليهم', 'القسوة', 'الصمت الدائم', 'السرعة'], 0, 'الرحمة تعني التعامل بلطف والشفقة على الضعفاء.'],
            ['ما أثر الحياء؟', ['يمنع القول القبيح', 'يزيد الصخب', 'يخفي الحق', 'يقطع الصلة'], 0, 'الحياء يحفظ اللسان من الكلام السيئ.'],
            ['كيف نكون كرماء؟', ['نعطي ونعفو', 'نمنع ونبخل', 'نأخذ فقط', 'ننسى الآخرين'], 0, 'الكرم هو العطاء والعفو عند القدرة.'],
            ['لماذا نتخلق بالأخلاق؟', ['لنكون قدوة حسنة', 'لنُعرف فقط', 'لنكسب المال', 'لتقليل العمل'], 0, 'الأخلاق الحسنة تجعل الإنسان قدوة ومحبوباً.']
          ]
        },
        {
          t: 'التعاون والمساعدة',
          intro: 'التعاون من الأخلاق التي يحبها الله وينفع المجتمع.',
          sections: [
            ['التعاون على الخير', 'نتعاون مع أسرتنا وزملائنا في العمل الصالح. كل واحد يبذل ما يستطيع. الجماعة قوية بترابط أفرادها.'],
            ['إكرام الجار والضيف', 'الجار له حق على جاره. نحسن إلى الجار ونزور المريض. إكرام الضيف من مكارم الأخلاق.']
          ],
          examples: [
            ['ساعد جارك', ['رأيت جاراً يحمل أغراضاً.', 'ساعدته بيدك.', 'شكرتك.'], 'تم التعاون'],
            ['واسِ مريضاً', ['زرت زميلاً مريضاً.', 'سألت عنه.', 'دعوت له بالشفاء.'], 'الزيارة عمل محبب']
          ],
          questions: [
            ['كيف نفهم التعاون على الخير مع الأسرة والزملاء؟', ['مساعدة بعضنا بعضاً في الخير', 'العمل منفرداً دائماً', 'المنافسة فقط', 'النسيان'], 0, 'التعاون هو اشتراك الناس في عمل يفيد الجميع.'],
            ['ما حق الجار؟', ['الإحسان إليه', 'إهماله', 'إيذاؤه', 'نسيانه'], 0, 'الإحسان إلى الجار من الأخلاق التي حث عليها الإسلام.'],
            ['ماذا نقول للمريض؟', ['أدعو الله لك بالشفاء', 'لماذا أنت مريض؟', 'اترك العمل', 'لا أهتم'], 0, 'الدعاء والكلام الطيب يخفف على المريض.'],
            ['كيف تكون الجماعة قوية؟', ['بالترابط والتعاون', 'بالخلاف', 'بالوحدة', 'بالنسيان'], 0, 'ترابط الأفراد وتعاونهم يجعل الجماعة قوية.']
          ]
        },
        {
          t: 'دروس من التاريخ الإسلامي',
          intro: 'نقرأ حادثة من حياة النبي لنستخلص منها دروساً.',
          sections: [
            ['الصبر والثبات', 'صبر النبي على أذى قومه ولم يقابل الإساءة بالإساءة. الثبات على الحق يعطي الإنسان قوة داخلية. الصبر جميل إذا كان في طاعة الله.'],
            ['العدل والمساواة', 'كان النبي يقضي بالعدل بين الناس دون محاباة. لا فرق عنده بين غني وفقير في الحق. العدل أساس المجتمع المسلم.']
          ],
          examples: [
            ['استخرج درساً', ['حادثة: صبر النبي على الأذى.', 'السؤال: ماذا نتعلم؟', 'الجواب: نصبر على الشدائد.'], 'الدرس: الصبر'],
            ['طبّق العدل', ['اختلف زميلان في حق.', 'استمع للطرفين.', 'حكمت بالعدل.'], 'حكمت بينهما بالعدل']
          ],
          questions: [
            ['ما الدرس من صبر النبي؟', ['الصبر على الشدائد', 'الانتقام', 'الهروب', 'النسيان'], 0, 'صبره يعلمنا الثبات عند المصائب.'],
            ['كيف كان النبي يقضي بين الناس؟', ['بالعدل دون محاباة', 'بالعاطفة وحدها', 'بحسب المال', 'بسرعة بلا سماع'], 0, 'العدل كان أساس قضائه، لا يفرق بين غني وفقير.'],
            ['ماذا نفعل عند خلاف بين زميلين؟', ['نسمع الطرفين ثم نحكم بالعدل', 'نحكم فوراً', 'نتركهما', 'ننحاز لأحدهما'], 0, 'الاستماع للطرفين يؤدي إلى حكم عادل.'],
            ['لماذا ندرس السيرة؟', ['لنتعلم من قدوة النبي', 'لنحفظ التواريخ فقط', 'لنغيرها', 'لننساها'], 0, 'السيرة تعطينا قدوة عملية في الأخلاق والسلوك.']
          ]
        }
      ]
    }
  }
};
