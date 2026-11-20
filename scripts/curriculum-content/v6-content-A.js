module.exports = {
  units: {
    "cur1": {
      shared: {
        sections: [
          ["الجزء والكل", "إذا قسّمنا شيئا إلى أجزاء متساوية، فكل جزء يُسمّى كسرا من ذلك الشيء. نعدّ الأجزاء المتساوية لنعرف المقام، ونعدّ الأجزاء المأخوذة لنعرف البسط."],
          ["قراءة الكسر وكتابته", "نقرأ الكسر بذكر البسط ثم المقام، مثل 3/4 تُقرأ «ثلاثة أرباع». نكتب الكسر بخط أفقي بين البسط والمقام، والمقام لا يساوي صفرا."],
          ["الكسر في حياتنا اليومية", "نستخدم الكسور عند تقسيم الفاتورة بين الأصدقاء، أو عند وصف نصف الكوب من الماء. الكسر يساعدنا على وصف الأشياء بدقة بدل القول «قليل» أو «كثير»."],
          ["تذكير قبل الحل", "قبل أي عملية على الكسور، نتحقق من تساوي الأجزاء ونحدّد الكل المقصود. ثم نكتب الكسر بوضوح ونشرح معناه بجملة قصيرة."]
        ],
        vocab: [
          ["بسط", "الرقم فوق خط الكسر، ويُخبرنا بعدد الأجزاء المأخوذة."],
          ["مقام", "الرقم تحت خط الكسر، ويُخبرنا بعدد الأجزاء المتساوية في الكل."],
          ["نصف", "أحد جزأين متساويين من الشيء الواحد."],
          ["ربع", "أحد أربعة أجزاء متساوية من الشيء الواحد."],
          ["كسران متساويان", "كسران يدلّان على القيمة نفسها مثل 1/2 و 2/4."],
          ["مقام مشترك", "مقام واحد نكتب به كسرين لجمعهما أو مقارنتهما."]
        ],
        outcomes: [
          "يُعرّف الكسر ويحدّد بسطه ومقامه في صورة ورسمة.",
          "يقرأ الكسور البسيطة ويكتبها كتابة صحيحة.",
          "يقارن كسرين بالاستعانة بالرسوم أو بمقام مشترك.",
          "يجمع كسرين لهما نفس المقام ويبرّر نتيجته."
        ],
        outcomeTr: {
          fr: [
            "Définir une fraction et identifier son numérateur et son dénominateur dans une image et un dessin.",
            "Lire les fractions simples et les écrire correctement.",
            "Comparer deux fractions à l'aide de dessins ou d'un dénominateur commun.",
            "Additionner deux fractions ayant le même dénominateur et justifier le résultat."
          ],
          en: [
            "Define a fraction and identify its numerator and denominator in a picture and a drawing.",
            "Read simple fractions and write them correctly.",
            "Compare two fractions using drawings or a common denominator.",
            "Add two fractions with the same denominator and justify the result."
          ]
        },
        diagram: "diagram-fractions.svg"
      },
      lessons: [
        {
          t: "مفهوم الكسر",
          intro: "تخيّل أنك تقسّم قرص تمر مع أختك إلى جزأين متساويين. كل جزء يُسمّى نصفا، وهذا هو الكسر الذي سنتعلّمه اليوم.",
          sections: [
            ["نقسّم إلى أجزاء متساوية", "لا يكون الكسر صحيحا إلا إذا كانت الأجزاء متساوية. إذا كانت القطع مختلفة الحجم فلا نسمّيها أرباعا. في السوق نرى بائع الزيتون يقسّم الكيس إلى حصص متساوية."],
            ["البسط والمقام في صورة", "نكتب 3/5 عندما نأخذ ثلاثة أجزاء من خمسة أجزاء متساوية. الرقم 3 هو البسط والرقم 5 هو المقام، ونقول «ثلاثة أخماس»."]
          ],
          examples: [
            ["قسّم سيمون قرص خبز إلى 4 أجزاء متساوية وأكل جزءا واحدا. ما الكسر الذي يمثل ما أكله؟", ["أعدّ الأجزاء المتساوية: 4، إذن المقام 4.", "أعدّ الجزء المأخوذ: 1، إذن البسط 1.", "أكتب الكسر 1/4 وأقرأه «ربعا»."], "1/4"],
            ["في طبق فيه 8 حبات تمر، أخذت سلمى 3 حبات. عبّري عن نصيب سلمى بكسر.", ["الكل هو 8 حبات، إذن المقام 8.", "النصيب المأخوذ هو 3 حبات، إذن البسط 3.", "الناتج 3/8، أي ثلاثة أثمان الطبق."], "3/8"]
          ],
          questions: [
            ["إذا قُسّم شريط إلى 6 أجزاء متساوية، فما مقام الكسر الذي يمثل جزأين منه؟", ["2", "6", "3", "8"], 1, "المقام هو عدد كل الأجزاء المتساوية في الكل، وهو 6 هنا. أما الرقم 2 فهو البسط لأنه عدد الأجزاء المأخوذة."],
            ["أي كتابة تمثّل «ثلاثة أرباع»؟", ["4/3", "3/4", "3/3", "4/4"], 1, "نضع البسط 3 فوق والمقام 4 تحت، لأن الأجزاء المتساوية أربعة والمأخوذة ثلاثة."],
            ["لماذا لا نسمّي قطعتين مختلفتين الحجم «نصفين»؟", ["لأن النصفين يجب أن يكونا متساويين", "لأن القطعتين صغيرتان", "لأن العدد 2 من الأعداد الكبيرة", "لأن الكسر يحتاج إلى ثلاث قطع"], 0, "تعريف النصف يعتمد على تساوي الجزأين؛ وانعدام التساوي يمنع تسميتهما نصفين."],
            ["شرب أكرم نصف كوب الماء. ما البسط في الكسر 1/2؟", ["1", "2", "3", "0"], 0, "البسط هو الرقم الأعلى في الكسر، وهو 1؛ والمقام 2 يدلّ على عدد الأجزاء المتساوية."]
          ],
          tr: {
            fr: {
              t: "La notion de fraction",
              intro: "Imagine que tu partages une galette de dattes en deux parts égales avec ta sœur. Chaque part s'appelle une moitié : c'est une fraction.",
              sections: [
                ["La partie et le tout", "Si l'on divise une chose en parties égales, chaque partie est une fraction de cette chose. On compte les parties égales pour le dénominateur et les parties prises pour le numérateur."],
                ["Partager en parts égales", "Une fraction n'est juste que si les parts sont égales. Si les morceaux ont des tailles différentes, on ne peut pas les appeler des quarts. Au marché, le vendeur d'olives répartit le sac en parts égales."],
                ["Lire et écrire une fraction", "On lit une fraction en disant le numérateur puis le dénominateur : 3/4 se lit « trois quarts ». On écrit le numérateur au-dessus d'une barre et le dénominateur en dessous ; le dénominateur n'est jamais zéro."],
                ["Numérateur et dénominateur en image", "On écrit 3/5 quand on prend trois parties sur cinq parties égales. Le 3 est le numérateur et le 5 est le dénominateur. On dit « trois cinquièmes »."],
                ["La fraction dans la vie quotidienne", "On utilise les fractions pour partager une note entre amis ou pour dire qu'un verre est à moitié plein. La fraction décrit les choses avec précision au lieu de dire « un peu » ou « beaucoup »."],
                ["Rappel avant de résoudre", "Avant toute opération, on vérifie que les parties sont égales et on identifie le tout. Ensuite on écrit la fraction clairement et on explique son sens en une courte phrase."]
              ],
              vocab: [
                ["numérateur", "Le nombre au-dessus de la barre : il indique combien de parties sont prises."],
                ["dénominateur", "Le nombre sous la barre : il indique en combien de parties égales le tout est divisé."],
                ["moitié", "Une des deux parties égales d'une chose."],
                ["quart", "Une des quatre parties égales d'une chose."],
                ["fractions équivalentes", "Deux fractions qui désignent la même valeur, comme 1/2 et 2/4."],
                ["dénominateur commun", "Un dénominateur unique utilisé pour comparer ou additionner deux fractions."]
              ],
              examples: [
                ["Simon partage un pain en 4 parts égales et en mange une. Quelle fraction représente ce qu'il a mangé ?", ["Je compte les parts égales : il y en a 4, donc le dénominateur est 4.", "Je compte la part prise : il y en a 1, donc le numérateur est 1.", "J'écris 1/4 et je lis « un quart »."], "1/4"],
                ["Dans une assiette de 8 dattes, Salma en prend 3. Exprime sa part sous forme de fraction.", ["Le tout est 8 dattes, donc le dénominateur est 8.", "La part prise est 3 dattes, donc le numérateur est 3.", "La fraction est 3/8, soit trois huitièmes de l'assiette."], "3/8"]
              ]
            },
            en: {
              t: "Understanding Fractions",
              intro: "Imagine sharing a date pancake into two equal parts with your sister. Each part is called a half - and that is a fraction.",
              sections: [
                ["Parts and the whole", "When we divide something into equal parts, each part is a fraction of that thing. We count the equal parts for the denominator and the parts taken for the numerator."],
                ["Sharing into equal parts", "A fraction is only correct when the parts are equal. If the pieces have different sizes, we cannot call them quarters. At the market, the olive seller shares the bag into equal portions."],
                ["Reading and writing a fraction", "We read a fraction by saying the numerator first and then the denominator: 3/4 is read as 'three quarters'. We write the numerator above a bar and the denominator below; the denominator is never zero."],
                ["Numerator and denominator in a picture", "We write 3/5 when we take three parts out of five equal parts. The 3 is the numerator and the 5 is the denominator. We say 'three fifths'."],
                ["Fractions in everyday life", "We use fractions to split a bill between friends or to say that a glass is half full. A fraction describes things precisely instead of saying 'a little' or 'a lot'."],
                ["A reminder before solving", "Before any operation, check that the parts are equal and identify the whole. Then write the fraction clearly and explain its meaning in a short sentence."]
              ],
              vocab: [
                ["numerator", "The number above the bar; it tells how many parts are taken."],
                ["denominator", "The number below the bar; it tells into how many equal parts the whole is divided."],
                ["half", "One of two equal parts of something."],
                ["quarter", "One of four equal parts of something."],
                ["equivalent fractions", "Two fractions with the same value, such as 1/2 and 2/4."],
                ["common denominator", "One shared denominator used to compare or add two fractions."]
              ],
              examples: [
                ["Simon shares a loaf into 4 equal parts and eats one. Which fraction shows what he ate?", ["Count the equal parts: there are 4, so the denominator is 4.", "Count the part taken: there is 1, so the numerator is 1.", "Write 1/4 and read it as 'one quarter'."], "1/4"],
                ["There are 8 dates on a plate and Salma takes 3. Write her share as a fraction.", ["The whole is 8 dates, so the denominator is 8.", "The part taken is 3 dates, so the numerator is 3.", "The fraction is 3/8, or three eighths of the plate."], "3/8"]
              ]
            }
          }
        },
        {
          t: "مقارنة الكسور",
          intro: "أمامنا قطعتان من الحلوى، إحداهما نصف والأخرى ربع. أيّهما أكبر؟ سنتعلّم المقارنة بالرسم وبتوحيد المقام.",
          sections: [
            ["المقارنة بالرسم", "إذا كان للكسرين الكلّ نفسه، نقارنهما برسم شريطين متساويين وتقسيم كلّ منهما حسب مقامه. الجزء الذي يغطّي مساحة أكبر يدلّ على الكسر الأكبر. نستعمل هذا عند مقارنة نصيبين من قرص واحد."],
            ["توحيد المقام للمقارنة", "عند اختلاف المقامين نبحث عن مقام مشترك، ثم نضرب البسط والمقام في العدد نفسه. مثلا 1/2 = 2/4، وبذلك نقارن 2/4 بـ 3/4 فنجد أن 3/4 أكبر."]
          ],
          examples: [
            ["قارن 1/2 و 1/4 بالاستعانة برسم شريطين.", ["ارسم شريطين متساويين في الطول.", "قسّم الأول إلى جزأين والثاني إلى أربعة.", "النصف يغطّي مساحة أكبر من الربع، إذن 1/2 > 1/4."], "1/2 أكبر من 1/4"],
            ["قارن 2/3 و 3/5 بتوحيد المقام.", ["المقام المشترك 15 لأنه مضاعف 3 و5.", "2/3 = 10/15 و 3/5 = 9/15.", "بما أن 10 أكبر من 9، فـ 2/3 أكبر."], "2/3 > 3/5"]
          ],
          questions: [
            ["أي كسر أكبر: 3/4 أم 3/8؟", ["3/4", "3/8", "متساويان", "لا يمكن المقارنة"], 0, "نفس البسط يعني أن صاحب المقام الأصغر يأخذ جزءا أكبر؛ و4 أصغر من 8 إذن 3/4 أكبر."],
            ["ما المقام المشترك المناسب لمقارنة 1/3 و 1/4؟", ["7", "12", "3", "4"], 1, "المقام المشترك يجب أن يكون مضاعفا للعددين 3 و4، وأصغر مضاعف مشترك هو 12."],
            ["إذا كان 2/5 = 4/10، فأي كسر أكبر: 2/5 أم 3/10؟", ["2/5", "3/10", "متساويان", "لا نعرف"], 0, "نحوّل 2/5 إلى 4/10، ثم نقارن 4/10 بـ 3/10 فنجد أن 2/5 أكبر."],
            ["لماذا لا نقارن كسرين من كلّين مختلفين بالرسم مباشرة؟", ["لأن الرسم يحتاج إلى ألوان", "لأن مساحة الكلّين قد تختلف فتضلّ المقارنة", "لأن الكسور لا تُقارن أبدا", "لأن البسط دائما واحد"], 1, "المقارنة بالرسم تفترض تساوي الكلّين؛ إذا اختلفت مساحة الكل احتجنا إلى حساب القيمة بدل مساحة الرسم."]
          ],
          tr: {
            fr: {
              t: "Comparer des fractions",
              intro: "Nous avons deux morceaux de gâteau : une moitié et un quart. Lequel est le plus grand ? Apprenons à comparer avec un dessin ou un dénominateur commun.",
              sections: [
                ["La partie et le tout", "Si l'on divise une chose en parties égales, chaque partie est une fraction de cette chose. On compte les parties égales pour le dénominateur et les parties prises pour le numérateur."],
                ["Comparer avec un dessin", "Si les deux fractions ont le même tout, on dessine deux bandes égales et on divise chacune selon son dénominateur. La part qui couvre le plus de surface est la plus grande."],
                ["Lire et écrire une fraction", "On lit une fraction en disant le numérateur puis le dénominateur : 3/4 se lit « trois quarts ». On écrit le numérateur au-dessus d'une barre et le dénominateur en dessous ; le dénominateur n'est jamais zéro."],
                ["Un dénominateur commun pour comparer", "Quand les dénominateurs diffèrent, on cherche un dénominateur commun puis on multiplie le numérateur et le dénominateur par le même nombre. Ainsi 1/2 = 2/4, et 3/4 est plus grand que 2/4."],
                ["La fraction dans la vie quotidienne", "On utilise les fractions pour partager une note entre amis ou pour dire qu'un verre est à moitié plein. La fraction décrit les choses avec précision au lieu de dire « un peu » ou « beaucoup »."],
                ["Rappel avant de résoudre", "Avant toute opération, on vérifie que les parties sont égales et on identifie le tout. Ensuite on écrit la fraction clairement et on explique son sens en une courte phrase."]
              ],
              vocab: [
                ["numérateur", "Le nombre au-dessus de la barre : il indique combien de parties sont prises."],
                ["dénominateur", "Le nombre sous la barre : il indique en combien de parties égales le tout est divisé."],
                ["moitié", "Une des deux parties égales d'une chose."],
                ["quart", "Une des quatre parties égales d'une chose."],
                ["fractions équivalentes", "Deux fractions qui désignent la même valeur, comme 1/2 et 2/4."],
                ["dénominateur commun", "Un dénominateur unique utilisé pour comparer ou additionner deux fractions."]
              ],
              examples: [
                ["Compare 1/2 et 1/4 à l'aide de deux bandes dessinées.", ["Je dessine deux bandes de même longueur.", "Je divise la première en 2 et la seconde en 4.", "La moitié couvre plus de surface : 1/2 > 1/4."], "1/2 est plus grand que 1/4"],
                ["Compare 2/3 et 3/5 en utilisant un dénominateur commun.", ["Le dénominateur commun est 15, multiple de 3 et de 5.", "2/3 = 10/15 et 3/5 = 9/15.", "Comme 10 est plus grand que 9, 2/3 est le plus grand."], "2/3 > 3/5"]
              ]
            },
            en: {
              t: "Comparing Fractions",
              intro: "We have two pieces of cake: a half and a quarter. Which one is bigger? Let us compare using a drawing or a common denominator.",
              sections: [
                ["Parts and the whole", "When we divide something into equal parts, each part is a fraction of that thing. We count the equal parts for the denominator and the parts taken for the numerator."],
                ["Comparing with a drawing", "If both fractions have the same whole, we draw two equal strips and divide each by its denominator. The part covering more area is the larger fraction."],
                ["Reading and writing a fraction", "We read a fraction by saying the numerator first and then the denominator: 3/4 is read as 'three quarters'. We write the numerator above a bar and the denominator below; the denominator is never zero."],
                ["A common denominator for comparing", "When denominators differ, we find a common denominator and multiply the numerator and denominator by the same number. For example 1/2 = 2/4, and 3/4 is bigger than 2/4."],
                ["Fractions in everyday life", "We use fractions to split a bill between friends or to say that a glass is half full. A fraction describes things precisely instead of saying 'a little' or 'a lot'."],
                ["A reminder before solving", "Before any operation, check that the parts are equal and identify the whole. Then write the fraction clearly and explain its meaning in a short sentence."]
              ],
              vocab: [
                ["numerator", "The number above the bar; it tells how many parts are taken."],
                ["denominator", "The number below the bar; it tells into how many equal parts the whole is divided."],
                ["half", "One of two equal parts of something."],
                ["quarter", "One of four equal parts of something."],
                ["equivalent fractions", "Two fractions with the same value, such as 1/2 and 2/4."],
                ["common denominator", "One shared denominator used to compare or add two fractions."]
              ],
              examples: [
                ["Compare 1/2 and 1/4 using two drawn strips.", ["Draw two strips of the same length.", "Divide the first into 2 and the second into 4.", "The half covers more area, so 1/2 > 1/4."], "1/2 is bigger than 1/4"],
                ["Compare 2/3 and 3/5 using a common denominator.", ["The common denominator is 15, a multiple of 3 and 5.", "2/3 = 10/15 and 3/5 = 9/15.", "Since 10 is greater than 9, 2/3 is bigger."], "2/3 > 3/5"]
              ]
            }
          }
        },
        {
          t: "جمع الكسور",
          intro: "أكلتَ ربع القرص وأكلت أختك ربعا آخر. كم أكلتما معا؟ يصبح الجمع سهلا عندما يتساوى المقامان.",
          sections: [
            ["جمع كسرين متساويي المقام", "عندما يتساوى المقام نجمع البسطين ونترك المقام كما هو، لأن الأجزاء من الحجم نفسه. مثال: 1/5 + 2/5 = 3/5. لا نجمع المقامين أبدا."],
            ["جمع كسرين مختلفي المقام", "نحوّل الكسرين أولا إلى مقام مشترك، ثم نجمع البسطين. بعد الجمع نبسّط الناتج إذا أمكن. مثال: 1/2 + 1/4 = 2/4 + 1/4 = 3/4."]
          ],
          examples: [
            ["اجمع 2/7 + 3/7.", ["المقامان متساويان ويساويان 7.", "نجمع البسطين: 2 + 3 = 5.", "الناتج هو 5/7."], "5/7"],
            ["اجمع 1/3 + 1/6.", ["المقام المشترك 6 لأنه مضاعف 3.", "1/3 = 2/6.", "2/6 + 1/6 = 3/6 = 1/2 بعد التبسيط."], "3/6 = 1/2"]
          ],
          questions: [
            ["ما ناتج 3/8 + 2/8؟", ["5/8", "5/16", "6/8", "1/8"], 0, "نجمع البسطين 3 و2 فنحصل على 5، ويبقى المقام 8 لأن حجم الجزء لم يتغيّر."],
            ["ما الخطأ في القول إن 1/4 + 1/4 = 2/8؟", ["لا يوجد خطأ", "جمعوا المقامين بدل بقاء المقام 4", "البسط يجب أن يكون 1", "الناتج يجب أن يكون 2/4 فقط"], 1, "المقام يعني حجم الجزء، فيبقى 4؛ والصحيح 2/4 التي تُبسّط إلى 1/2."],
            ["اجمع 1/2 + 1/4.", ["2/6", "3/4", "1/6", "2/4"], 1, "نوحّد المقام: 1/2 = 2/4، ثم 2/4 + 1/4 = 3/4."],
            ["عبّر عن مجموع نصف كوب وربع كوب بالكسر المبسّط.", ["1/4", "2/4", "3/4", "4/3"], 2, "نصف الكوب 2/4 والربع 1/4، والمجموع 3/4 وهو مبسّط لأن 3 و4 لا مقاسم مشترك بينهما."]
          ],
          tr: {
            fr: {
              t: "Additionner des fractions",
              intro: "Tu as mangé un quart du gâteau et ta sœur un autre quart. Combien avez-vous mangé ensemble ? L'addition devient simple quand les dénominateurs sont égaux.",
              sections: [
                ["La partie et le tout", "Si l'on divise une chose en parties égales, chaque partie est une fraction de cette chose. On compte les parties égales pour le dénominateur et les parties prises pour le numérateur."],
                ["Additionner deux fractions de même dénominateur", "Quand les dénominateurs sont égaux, on additionne les numérateurs et on laisse le dénominateur inchangé. Les parts ont en effet la même taille. Par exemple 1/5 + 2/5 = 3/5 ; on n'additionne jamais les dénominateurs."],
                ["Lire et écrire une fraction", "On lit une fraction en disant le numérateur puis le dénominateur : 3/4 se lit « trois quarts ». On écrit le numérateur au-dessus d'une barre et le dénominateur en dessous ; le dénominateur n'est jamais zéro."],
                ["Additionner deux fractions de dénominateurs différents", "On transforme d'abord les deux fractions avec un dénominateur commun, puis on additionne les numérateurs. On simplifie le résultat si c'est possible. Par exemple 1/2 + 1/4 = 2/4 + 1/4 = 3/4."],
                ["La fraction dans la vie quotidienne", "On utilise les fractions pour partager une note entre amis ou pour dire qu'un verre est à moitié plein. La fraction décrit les choses avec précision au lieu de dire « un peu » ou « beaucoup »."],
                ["Rappel avant de résoudre", "Avant toute opération, on vérifie que les parties sont égales et on identifie le tout. Ensuite on écrit la fraction clairement et on explique son sens en une courte phrase."]
              ],
              vocab: [
                ["numérateur", "Le nombre au-dessus de la barre : il indique combien de parties sont prises."],
                ["dénominateur", "Le nombre sous la barre : il indique en combien de parties égales le tout est divisé."],
                ["moitié", "Une des deux parties égales d'une chose."],
                ["quart", "Une des quatre parties égales d'une chose."],
                ["fractions équivalentes", "Deux fractions qui désignent la même valeur, comme 1/2 et 2/4."],
                ["dénominateur commun", "Un dénominateur unique utilisé pour comparer ou additionner deux fractions."]
              ],
              examples: [
                ["Calcule 2/7 + 3/7.", ["Les dénominateurs sont égaux : 7.", "J'additionne les numérateurs : 2 + 3 = 5.", "Le résultat est 5/7."], "5/7"],
                ["Calcule 1/3 + 1/6.", ["Le dénominateur commun est 6, multiple de 3.", "1/3 = 2/6.", "2/6 + 1/6 = 3/6 = 1/2 après simplification."], "3/6 = 1/2"]
              ]
            },
            en: {
              t: "Adding Fractions",
              intro: "You ate a quarter of the pancake and your sister ate another quarter. How much did you eat together? Adding becomes easy when the denominators match.",
              sections: [
                ["Parts and the whole", "When we divide something into equal parts, each part is a fraction of that thing. We count the equal parts for the denominator and the parts taken for the numerator."],
                ["Adding fractions with the same denominator", "When denominators are equal, we add the numerators and keep the denominator unchanged, because the parts have the same size. For example 1/5 + 2/5 = 3/5. We never add the denominators."],
                ["Reading and writing a fraction", "We read a fraction by saying the numerator first and then the denominator: 3/4 is read as 'three quarters'. We write the numerator above a bar and the denominator below; the denominator is never zero."],
                ["Adding fractions with different denominators", "First we rewrite both fractions with a common denominator, then we add the numerators. We simplify the result if possible. For example 1/2 + 1/4 = 2/4 + 1/4 = 3/4."],
                ["Fractions in everyday life", "We use fractions to split a bill between friends or to say that a glass is half full. A fraction describes things precisely instead of saying 'a little' or 'a lot'."],
                ["A reminder before solving", "Before any operation, check that the parts are equal and identify the whole. Then write the fraction clearly and explain its meaning in a short sentence."]
              ],
              vocab: [
                ["numerator", "The number above the bar; it tells how many parts are taken."],
                ["denominator", "The number below the bar; it tells into how many equal parts the whole is divided."],
                ["half", "One of two equal parts of something."],
                ["quarter", "One of four equal parts of something."],
                ["equivalent fractions", "Two fractions with the same value, such as 1/2 and 2/4."],
                ["common denominator", "One shared denominator used to compare or add two fractions."]
              ],
              examples: [
                ["Work out 2/7 + 3/7.", ["The denominators are equal: 7.", "Add the numerators: 2 + 3 = 5.", "The result is 5/7."], "5/7"],
                ["Work out 1/3 + 1/6.", ["The common denominator is 6, a multiple of 3.", "1/3 = 2/6.", "2/6 + 1/6 = 3/6 = 1/2 after simplifying."], "3/6 = 1/2"]
              ]
            }
          }
        }
      ]
    },
    "cur9": {
      shared: {
        sections: [
          ["Words we use every day", "English words help us greet people, name colours and count things. We learn them with pictures, songs and games. Repeat each word aloud and use it in a short sentence."],
          ["Listening and saying", "Listen carefully to the sound of a new word and copy it. Say the word slowly, then a little faster. Speaking often helps your mouth remember the sounds."],
          ["Reading small words", "Look at the letters from left to right. Try to find a letter you already know inside a new word. Reading a word twice makes it easier to remember."],
          ["A short check", "At the end of a lesson, point to the picture and say the word without help. If you forget, look again and try once more. Mistakes help us learn."]
        ],
        vocab: [
          ["hello", "A word we say when we meet someone."],
          ["colour", "Red, blue, green and yellow are colours."],
          ["number", "One, two, three and so on are numbers."],
          ["family", "The people who live with us and care for us."],
          ["friend", "A person we like to play with."],
          ["please", "A polite word we use when we ask for something."]
        ],
        outcomes: [
          "Learners greet a classmate using a simple English phrase.",
          "Learners name at least five colours in English.",
          "Learners count objects from one to ten.",
          "Learners introduce a family member with a short sentence."
        ],
        diagram: "diagram-colors.svg"
      },
      lessons: [
        {
          t: "Hello and Greetings",
          intro: "Today we learn how to say hello in English. We will greet our friends with a smile and a simple phrase.",
          sections: [
            ["Saying hello", "We say 'Hello' at any time and 'Good morning' to our teacher at the start of the day. A greeting is a kind way to begin a talk. We can also wave our hand while we speak."],
            ["Asking how someone is", "We can ask 'How are you?' and answer 'I am fine, thank you.' These short lines show care and make our friends happy."]
          ],
          examples: [
            ["Your teacher enters the class. What do you say?", ["Look at the teacher and smile.", "Choose a greeting for the morning.", "Say it slowly and clearly: 'Good morning, teacher.'"], "Good morning, teacher."],
            ["A friend says 'Hello!' to you. What is a kind answer?", ["Listen to the greeting first.", "Answer with a greeting back.", "Add a question: 'Hello! How are you?'"], "Hello! How are you?"]
          ],
          questions: [
            ["Which word do we use to greet someone in the morning?", ["Good night", "Good morning", "Thank you", "Sorry"], 1, "'Good morning' is the greeting for the morning; the other words are used at different times."],
            ["What can you say after 'How are you?'", ["I am fine, thank you", "It is a pen", "Five apples", "My name is Sara"], 0, "That question asks about your condition, so an answer about how you feel fits best."],
            ["Which action often goes with a greeting in class?", ["Waving your hand", "Closing your eyes", "Hiding under the desk", "Turning your back"], 0, "A small wave is a friendly gesture that usually goes with saying hello."],
            ["Which line is a complete greeting?", ["Hello! How are you?", "Blue, red, green", "One, two, three", "Book and pencil"], 0, "A greeting has a hello phrase and a question about the other person."]
          ]
        },
        {
          t: "Colours Around Us",
          intro: "Look at the sky and the trees. The sky is blue and the leaves are green. Let us learn the names of these colours.",
          sections: [
            ["Naming colours", "We say 'red', 'blue', 'green' and 'yellow'. In Morocco we see green mint tea and orange oranges in the souk. Point to an object and say its colour out loud."],
            ["Colours in a sentence", "We can say 'The apple is red.' The word 'is' links the thing with its colour. Try the same pattern with a blue bag or a yellow flower."]
          ],
          examples: [
            ["You see a red tomato. Say a sentence about it.", ["Look at the tomato and name its colour.", "Put the word 'is' after 'The tomato'.", "Say: 'The tomato is red.'"], "The tomato is red."],
            ["Your friend has a green pencil. Ask about it.", ["Point to the pencil.", "Ask 'What colour is it?'", "Your friend answers: 'It is green.'"], "What colour is it?"]
          ],
          questions: [
            ["Which word names the colour of the sky on a clear day?", ["green", "blue", "red", "yellow"], 1, "A clear sky looks blue, so 'blue' is the matching colour word."],
            ["Which sentence has the right word order?", ["The flower is yellow", "The flower yellow is", "Yellow is the flower the", "The is yellow flower"], 0, "In English the colour comes after the linking word 'is'."],
            ["Which question asks about a colour?", ["How old are you?", "What colour is your bag?", "Where is your book?", "How many pens?"], 1, "The phrase 'What colour' asks for the name of a colour."],
            ["Mint tea in Morocco is often green. Which English word means that colour?", ["vert", "blue", "green", "rouge"], 2, "'Green' is the English word for that colour; the other options are words from other languages or different colours."]
          ]
        },
        {
          t: "Numbers One to Ten",
          intro: "We count dates, pencils and steps with numbers. Today we learn the English numbers from one to ten.",
          sections: [
            ["Counting objects", "We say 'one, two, three' as we touch each object. The last number we say tells how many objects there are. Count slowly so you do not skip one."],
            ["Numbers in a line", "Numbers have an order: four comes after three and before five. We can show numbers with fingers, dots or small drawings."]
          ],
          examples: [
            ["Count five dates on a plate. What do you say?", ["Touch each date one by one.", "Say the numbers: one, two, three, four, five.", "Say the last number again: 'There are five dates.'"], "There are five dates."],
            ["You have two books and your friend has three. How many books are there in all?", ["Count your books: two.", "Count your friend's books: three.", "Count on: three, four, five. The answer is five."], "Five books."]
          ],
          questions: [
            ["Which number comes after seven?", ["six", "eight", "nine", "ten"], 1, "Numbers go in order, so eight follows seven."],
            ["How do you write the number 3 in English?", ["three", "tree", "thre", "third"], 0, "The correct English word for 3 is 'three'."],
            ["You have one pencil and you find one more. How many now?", ["one", "two", "three", "four"], 1, "One plus one makes two, so you have two pencils."],
            ["Which group has exactly four dots?", ["•••", "••••", "••", "•••••"], 1, "Counting the dots in the second group gives four."]
          ]
        },
        {
          t: "My Family and Me",
          intro: "We finish this unit by talking about the people we love. We will use greetings, colours and numbers together.",
          sections: [
            ["People in my family", "We can say 'This is my mother' and 'This is my father.' A sister or a brother is also part of the family. Family words help us introduce people clearly."],
            ["Putting our words together", "Now we can say 'This is my sister. She has a blue bag.' One short phrase follows another. Speaking in small steps makes our English easy to follow."]
          ],
          examples: [
            ["Introduce your father to a friend.", ["Start with the phrase 'This is'.", "Add the family word 'my father'.", "Say: 'This is my father.'"], "This is my father."],
            ["Describe your friend's red pen using two ideas.", ["Name the object: 'This is my pen.'", "Add the colour: 'It is red.'", "Join them: 'This is my pen. It is red.'"], "This is my pen. It is red."]
          ],
          questions: [
            ["Which phrase introduces a person?", ["This is my mother", "It is blue", "One, two, three", "Thank you"], 0, "'This is' is the phrase we use to point out or introduce someone."],
            ["Which word names a person in your family?", ["mother", "yellow", "seven", "pencil"], 0, "'Mother' is a family word; the others name a colour, a number and an object."],
            ["Choose the best end: 'This is my brother. He has a ...'", ["green kite", "green is kite", "kite green a", "is green kite"], 0, "The colour comes before the object, so 'a green kite' is correct."],
            ["What is the best way to check what you learned today?", ["Say the words without looking and ask a friend to listen", "Never practise again", "Only read silently", "Skip the new words"], 0, "Active practice with a listener shows what we remember and what we should review."]
          ]
        }
      ]
    },
    "cur17": {
      shared: {
        sections: [
          ["القراءة الواضحة", "نقرأ النص بصوت مسموع وواضح، ونقف عند علامات الترقيم. القراءة الجيدة تساعدنا على فهم المعنى وتجعل الآخرين يستمتعون بما نقول."],
          ["الفكرة الرئيسية", "لكل نص فكرة أساسية يريد الكاتب إيصالها. نبحث عن الجملة التي تلخّص المعنى، ثم نربط بقية الجمل بها."],
          ["اختيار الكلمة المناسبة", "الكلمة الدالة تجعل الجملة أدقّ. نختار الاسم والفعل والصفة بما يناسب المقام، ونتجنّب التكرار المملّ."],
          ["الكتابة المنظّمة", "نكتب الفقرة بترتيب: جملة افتتاحية، ثم أفكار مؤيّدة، ثم خاتمة قصيرة. نراجع الإملاء والنقاط قبل التسليم."]
        ],
        vocab: [
          ["نص", "مجموعة جمل مترابطة تحمل معنى واحدا."],
          ["فكرة رئيسية", "المعنى الأساسي الذي يريد الكاتب إيصاله."],
          ["عنوان", "الكلمة أو الجملة التي تدلّ على موضوع النص."],
          ["مرادف", "كلمة لها معنى قريب من كلمة أخرى."],
          ["فقرة", "جزء من النص يضمّ أفكارا متعلّقة بموضوع واحد."],
          ["ترقيم", "علامات مثل النقطة والفاصلة تنظّم القراءة والمعنى."]
        ],
        outcomes: [
          "يقرأ نصا قصيرا قراءة واضحة مع مراعاة علامات الترقيم.",
          "يحدّد الفكرة الرئيسية في نص مبسّط.",
          "يكتب فقرة منظمة تضم جملا مترابطة.",
          "يستخدم كلمات مناسبة للتعبير عن رأيه باختصار."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "القراءة الجهرية المعبّرة",
          intro: "القراءة ليست مجرد تلفّظ الحروف، بل نقل المعنى بصوت واضح. اليوم نتدرّب على قراءة نص قصير عن حديقة المدرسة.",
          sections: [
            ["الوقف عند العلامات", "نقف قليلا عند النقطة، ونواصل عند الفاصلة بنبرة أهدأ. هذا الوقف يجعل المعنى أوضح للمستمع. نقرأ الجملة كاملة قبل الانتقال إلى التي تليها."],
            ["النبرة والمعنى", "نرفع الصوت قليلا في السؤال ونخفضه في الجملة الخبرية. إذا قرأنا بسرعة كبيرة ضاع المعنى. التمثيل الصوتي يساعدنا على فهم الشخصيات."]
          ],
          examples: [
            ["اقرأ الجملة: «هل ذهبتَ إلى حديقة المدرسة؟» وبيّن طريقة القراءة.", ["نلاحظ علامة الاستفهام في النهاية.", "نرفع النبرة في آخر الجملة.", "نقرأ الجملة بنبرة سؤال واضحة."], "قراءة سؤالية بنبرة مرتفعة في النهاية."],
            ["اقرأ: «الشجرة كبيرة. تحتها ظلّ وارف.»", ["نقرأ الجملة الأولى ثم نقف عند النقطة.", "نبدأ الجملة الثانية بعد وقفة قصيرة.", "نحافظ على وضوح الحروف في كلمتي «ظلّ وارف»."], "قراءة واضحة مع وقفة بين الجملتين."]
          ],
          questions: [
            ["ما علامة نهاية السؤال؟", ["النقطة", "علامة الاستفهام", "الفاصلة", "علامة التعجب"], 1, "علامة الاستفهام توضع في آخر جملة السؤال وتدلّ على نبرة مرتفعة."],
            ["لماذا نقف عند النقطة في القراءة؟", ["لأن النقطة تعني نهاية جملة", "لأن النقطة تعني بداية نص", "لأن النقطة تغير الحرف", "لأن النقطة علامة سؤال"], 0, "النقطة تفصل بين جملتين، والوقفة تساعد المستمع على استيعاب كل جملة على حدة."],
            ["أي قراءة أفضل لفهم النص؟", ["سريعة بلا وقوف", "واضحة مع وقوف مناسبة", "همسا بلا نبرة", "بترتيب عشوائي"], 1, "القراءة الواضحة بالوقوف المناسب تحفظ ترتيب الأفكار وتسهّل الفهم."],
            ["ما الفائدة من قراءة النص مرتين؟", ["تكرار بلا فائدة", "تثبيت المعنى وتصحيح الأخطاء", "تغيير كاتب النص", "إلغاء علامات الترقيم"], 1, "القراءة الثانية تتيح تصحيح اللفظ وتأكيد الفكرة العامة."]
          ]
        },
        {
          t: "استخراج الفكرة الرئيسية",
          intro: "قد يحتوي النص على عدة أفكار، لكن فكرة واحدة هي الأهم. نتعلّم اليوم كيف نجدها ونعبّر عنها بجملة قصيرة.",
          sections: [
            ["البحث عن الجملة الجامعة", "نقرأ النص مرتين، ثم نسأل: عن ماذا يتحدث؟ الجملة التي تجيب عن هذا السؤال هي الفكرة الرئيسية. بقية الجمل تأتي لتشرحها أو تدعمها."],
            ["التمييز بين الفكرة والتفصيل", "الفكرة الرئيسية عامة، والتفاصيل أمثلة وأرمقام وأوصاف. إذا حذفنا التفصيل يبقى المعنى، أما إذا حذفنا الفكرة يضيع النص."]
          ],
          examples: [
            ["نص: «النظافة تحمي الصحة. يغسل التلميذ يديه قبل الأكل. ينظّف الفصل كل صباح.» ما الفكرة الرئيسية؟", ["نسأل: ما الموضوع المشترك؟", "نجد أن الجمل الثلاث تتحدث عن النظافة.", "نكتب: النظافة تحمي الصحة."], "النظافة تحمي الصحة."],
            ["نص: «الشجرة تعطي الظل والفاكهة. يزرعها الفلاح في البستان. تحتاج الماء والشمس.» لخّص الفكرة.", ["نحدّد الموضوع: الشجرة.", "نلاحظ ما تقدّمه: الظل والفاكهة.", "نكتب: الشجرة نافعة للإنسان والبيئة."], "الشجرة نافعة للإنسان والبيئة."]
          ],
          questions: [
            ["ما السؤال الذي يساعد على إيجاد الفكرة الرئيسية؟", ["كم عدد حروف النص؟", "عن ماذا يتحدث النص؟", "من كتب النص؟", "متى كُتب النص؟"], 1, "سؤال «عن ماذا يتحدث النص؟» يوجّهنا إلى المعنى العام لا إلى التفاصيل الشكلية."],
            ["في النص: «المكتبة مكان مفيد. فيها مئات الكتب.» أي جملة هي الفكرة الرئيسية؟", ["فيها مئات الكتب", "المكتبة مكان مفيد", "مئات", "الكتب"], 1, "الجملة الأولى حكم عام، والثانية تفصيل يوضّح عدد الكتب."],
            ["إذا حذفنا التفصيل من النص، هل يبقى المعنى؟", ["لا، يضيع المعنى", "نعم، يبقى المعنى غالبا", "يتغيّر الكاتب", "تختفي علامات الترقيم"], 1, "التفاصيل تزيد الإيضاح لكن الفكرة تبقى قائمة بدونها."],
            ["كيف نكتب خلاصة الفكرة؟", ["بجملة طويلة فيها كل التفاصيل", "بجملة قصيرة تعبّر عن المعنى العام", "بقائمة من الأسماء فقط", "بعنوان من كلمة واحدة دائما"], 1, "الخلاصة الجيدة موجزة وتمنح المعنى الأساسي دون إغراق في التفاصيل."]
          ]
        },
        {
          t: "كتابة فقرة قصيرة",
          intro: "بعد أن فهمنا النص، نستطيع أن نكتب فقرة قصيرة عن فصلنا أو عن يومنا.",
          sections: [
            ["ترتيب الجمل", "تبدأ الفقرة بجملة تخبر عن الموضوع، ثم تأتي جمل تضيف معلومات، وتختم بجملة قصيرة. هذا الترتيب يجعل القارئ يتابع بسهولة."],
            ["الربط بين الجمل", "نستعمل أدوات مثل «ثم» و«أيضا» و«لذلك» لربط الأفكار. هذه الكلمات تجعل الفقرة متماسكة بدل أن تبدو جملا متفرقة."]
          ],
          examples: [
            ["اكتب فقرة قصيرة عن صباحك.", ["أبدأ: «أستيقظ صباحا مبكرا.»", "أضيف: «ثم أغسل يدي ووجهي وأذهب إلى المدرسة.»", "أختم: «أحب صباحي لأنه يبدأ بنشاط.»"], "أستيقظ صباحا مبكرا. ثم أغسل يدي ووجهي وأذهب إلى المدرسة. أحب صباحي لأنه يبدأ بنشاط."],
            ["اكتب فقرة عن شجرة في حديقة المدرسة.", ["أبدأ بوصف الشجرة: «في حديقتنا شجرة كبيرة.»", "أضيف فائدة: «تظلّلنا في الحرّ وتعطي ثمارا.»", "أختم برأي: «نعتني بها كل أسبوع.»"], "في حديقتنا شجرة كبيرة. تظلّلنا في الحرّ وتعطي ثمارا. نعتني بها كل أسبوع."]
          ],
          questions: [
            ["ما أول ما نكتبه في الفقرة المنظّمة؟", ["جملة ختامية", "جملة تخبر عن الموضوع", "سؤال فقط", "قائمة كلمات"], 1, "الجملة الافتتاحية تحدّد الموضوع وتجهّز القارئ لما يلي."],
            ["أي كلمة تربط بين جملتين؟", ["ثم", "لكنّ", "كبير", "أمس"], 0, "«ثم» أداة ربط تدلّ على الترتيب بين حدثين."],
            ["لماذا نراجع الفقرة بعد كتابتها؟", ["لتغيير الموضوع تماما", "لتصحيح الإملاء وترتيب الأفكار", "لحذف كل الجمل", "لإضافة رسوم فقط"], 1, "المراجعة تساعد على تصحيح الأخطاء وتأكيد تسلسل المعاني."],
            ["أي خاتمة مناسبة لفقرة عن المدرسة؟", ["والمدرسة مكان نتعلّم فيه", "والمدرسة حمراء جدا", "والمدرسة بعيدة القمر", "والمدرسة بلا أطفال"], 0, "الخاتمة يجب أن ترتبط بموضوع الفقرة وتلخّص معنى مناسبا."]
          ]
        },
        {
          t: "مراجعة وتقويم الذات",
          intro: "في هذا الدرس نجمع ما تعلّمناه: نقرأ، نفهم، ثم نكتب. سنتعرّف على نقاط قوّتنا وما نحتاج إلى مزيد من التدريب عليه.",
          sections: [
            ["خريطة ما تعلّمناه", "نلخّص في أربع خطوات: نقرأ بوضوح، نحدّد الفكرة، نختار الكلمات، نكتب منظّما. كل خطوة تبني على التي قبلها. نستعمل هذه الخريطة قبل أي قراءة جديدة."],
            ["أسئلة أطرحها على نفسي", "هل قرأتُ دون تسرّع؟ هل استطعتُ شرح الفكرة بجملتي؟ هل راجعتُ إملائي؟ هذه الأسئلة القصيرة تجعلني أجد ما أحتاج إلى تحسينه."]
          ],
          examples: [
            ["بعد قراءة نص قصير، ضع خطة للإجابة عن سؤال الفكرة الرئيسية.", ["أقرأ العنوان أولا لأتوقّع الموضوع.", "أقرأ النص وأشطب التفاصيل غير المهمّة.", "أكتب الفكرة في جملة واحدة ثم أتحقّق منها."], "الخطة: العنوان ← القراءة ← حذف التفاصيل ← جملة الفكرة."],
            ["راجع فقرة كتبتها وصيّغ خطأين محتملين.", ["أتحقّق من علامات الترقيم في آخر كل جملة.", "أقرأ بصوت خافت لأسمع الجمل المقطوعة.", "أصلح كلمة كُتبت بشكل خاطئ وأعيد القراءة."], "أصلح النقطة الناقصة والكلمة المكتوبة خطأ."]
          ],
          questions: [
            ["ما الترتيب الصحيح لخطوات العمل مع نص جديد؟", ["كتابة ← قراءة ← فهم", "قراءة ← فهم ← كتابة", "فهم ← كتابة ← قراءة", "كتابة ← فهم ← قراءة"], 1, "نقرأ أولا، ثم نفهم المعنى، ثم نكتب ما تعلّمناه."],
            ["أي سؤال يساعدني على تحسين قراءتي؟", ["هل قرأتُ بوضوح وبدون تسرّع؟", "كم صفحة في الكتاب؟", "من هو مدير المدرسة؟", "ما لون الغلاف؟"], 0, "السؤال عن وضوح القراءة وتسرّعها يقوّم أدائي مباشرة."],
            ["ما الفائدة من إعادة قراءة ما كتبتُه بصوت خافت؟", ["تغيير موضوع الفقرة", "سماع الجمل المقطوعة وتصحيحها", "حذف جميع الكلمات", "زيادة عدد الأسئلة"], 1, "الاستماع إلى قراءتي يكشف مواضع الضعف في الأسلوب والترتيب."],
            ["كيف أتعامل مع خطأ أثناء الكتابة؟", ["أتجاهله تماما", "أصلحه وأعيد قراءة الجملة", "أمحو الفقرة كلها", "أكتب جملة أخرى بلا ربط"], 1, "التصحيح وإعادة القراءة خطوة تعلّم، لا عيب، وتقوي النص."]
          ]
        }
      ]
    },
    "cur25": {
      shared: {
        sections: [
          ["Las palabras de cada día", "El español nos ayuda a saludar, a contar y a hablar de nuestra familia. Aprendemos las palabras con dibujos y con canciones. Repite cada palabra en voz alta."],
          ["Escuchar y repetir", "Escucha con atención el sonido de una palabra nueva y repítela despacio. Después, dila un poco más rápido. La práctica ayudará a tu memoria."],
          ["Leer frases cortas", "Mira las letras de izquierda a derecha. Busca una letra que ya conozcas dentro de la palabra nueva. Leer dos veces facilita el recuerdo."],
          ["Una comprobación breve", "Al final de la lección, señala el dibujo y di la palabra sin ayuda. Si olvidas algo, mira de nuevo e inténtalo otra vez. Los errores nos enseñan."]
        ],
        vocab: [
          ["hola", "Palabra que decimos cuando encontramos a alguien."],
          ["color", "Rojo, azul, verde y amarillo son colores."],
          ["número", "Uno, dos, tres... son números."],
          ["familia", "Las personas que viven con nosotros y nos cuidan."],
          ["amigo", "Una persona con la que nos gusta jugar."],
          ["gracias", "Palabra amable que decimos cuando alguien nos ayuda."]
        ],
        outcomes: [
          "Los alumnos saludan a un compañero con una frase sencilla en español.",
          "Los alumnos nombran al menos cinco colores en español.",
          "Los alumnos cuentan objetos del uno al diez.",
          "Los alumnos presentan a un miembro de su familia con una frase corta."
        ],
        diagram: "diagram-family.svg"
      },
      lessons: [
        {
          t: "Los saludos y la presentación",
          intro: "Hoy aprendemos a saludar en español. Usaremos una sonrisa y una frase corta con nuestros amigos.",
          sections: [
            ["Decir hola", "Decimos 'hola' en cualquier momento y 'buenos días' al entrar a clase. Un saludo es una forma amable de empezar una conversación. También podemos mover la mano mientras hablamos."],
            ["Preguntar cómo está alguien", "Podemos preguntar '¿cómo estás?' y responder 'estoy bien, gracias'. Estas frases cortas muestran cariño y hacen feliz a nuestro amigo."]
          ],
          examples: [
            ["Tu profesor entra en clase. ¿Qué dices?", ["Mira al profesor y sonríe.", "Elige un saludo de la mañana.", "Di despacio: 'Buenos días, profe.'"], "Buenos días, profe."],
            ["Un amigo te dice '¡Hola!'. ¿Cómo respondes?", ["Escucha el saludo primero.", "Responde con otro saludo.", "Añade una pregunta: '¡Hola! ¿Cómo estás?'"], "¡Hola! ¿Cómo estás?"]
          ],
          questions: [
            ["¿Qué palabra usamos para saludar por la mañana?", ["Buenas noches", "Buenos días", "Gracias", "Perdón"], 1, "'Buenos días' es el saludo de la mañana; las demás palabras sirven en otros momentos."],
            ["¿Qué puedes decir después de '¿Cómo estás?'", ["Estoy bien, gracias", "Es un lápiz", "Cinco manzanas", "Me llamo Sara"], 0, "La pregunta pregunta por tu estado, así que conviene hablar de cómo te encuentras."],
            ["¿Qué gesto acompaña a un saludo en clase?", ["Mover la mano", "Cerrar los ojos", "Esconderse debajo de la mesa", "Dar la espalda"], 0, "Un pequeño movimiento de mano es un gesto amable al saludar."],
            ["¿Cuál es una frase de saludo completa?", ["¡Hola! ¿Cómo estás?", "Rojo, azul, verde", "Uno, dos, tres", "Libro y lápiz"], 0, "Un saludo completo incluye un hola y una pregunta sobre la otra persona."]
          ]
        },
        {
          t: "Los colores y los números",
          intro: "Mira el cielo y los árboles. El cielo es azul y las hojas son verdes. Aprendamos los colores y los números.",
          sections: [
            ["Nombrar colores", "Decimos 'rojo', 'azul', 'verde' y 'amarillo'. En el mercado de Marruecos vemos el té verde y las naranjas de color naranja. Señala un objeto y di su color en voz alta."],
            ["Los números en orden", "Los números tienen un orden: el cuatro viene después del tres. Podemos mostrarlos con los dedos o con puntos. Cuenta despacio para no saltar ninguno."]
          ],
          examples: [
            ["Ves un tomate rojo. Di una frase.", ["Mira el tomate y nombra su color.", "Coloca 'es' después de 'El tomate'.", "Di: 'El tomate es rojo.'"], "El tomate es rojo."],
            ["Tienes dos lápices y tu amigo tiene tres. ¿Cuántos hay en total?", ["Cuenta tus lápices: dos.", "Cuenta los de tu amigo: tres.", "Cuenta seguido: tres, cuatro, cinco. La respuesta es cinco."], "Hay cinco lápices."]
          ],
          questions: [
            ["¿Cómo se dice el color del cielo despejado?", ["verde", "azul", "rojo", "amarillo"], 1, "Un cielo despejado se ve azul, así que esa es la palabra correcta."],
            ["¿Qué frase sobre el color amarillo está bien escrita?", ["La flor es amarilla", "La flor amarilla es", "Amarilla es la flor la", "La es amarilla flor"], 0, "En español el color va después de 'es' y concuerda con el sustantivo."],
            ["¿Qué número viene después del siete?", ["seis", "ocho", "nueve", "diez"], 1, "Los números siguen un orden, y el ocho va después del siete."],
            ["¿Cómo se escribe el número 3 en español?", ["tres", "tree", "trés", "tercero"], 0, "La palabra española correcta para 3 es 'tres'."]
          ]
        },
        {
          t: "Mi familia y mi escuela",
          intro: "Vamos a hablar de las personas que queremos y de nuestro cole. Usaremos frases cortas y claras.",
          sections: [
            ["Las personas de mi familia", "Decimos 'Esta es mi madre' y 'Este es mi padre'. Una hermana o un hermano también forman parte de la familia. Estas palabras nos sirven para presentar a alguien."],
            ["Mi escuela", "En el cole tenemos libros, mesas y amigos. Podemos decir 'Mi escuela es grande' o 'Tengo muchos amigos'. Cada frase añade una idea nueva."]
          ],
          examples: [
            ["Presenta a tu padre a un amigo.", ["Empieza con 'Este es'.", "Añade la palabra de familia 'mi padre'.", "Di: 'Este es mi padre.'"], "Este es mi padre."],
            ["Describe el bolso azul de tu amiga con dos ideas.", ["Nombra el objeto: 'Este es su bolso'.", "Añade el color: 'Es azul'.", "Une las frases: 'Este es su bolso. Es azul.'"], "Este es su bolso. Es azul."]
          ],
          questions: [
            ["¿Qué frase presenta a una persona?", ["Esta es mi madre", "Es azul", "Uno, dos, tres", "Gracias"], 0, "'Esta es' es la expresión que usamos para presentar a alguien."],
            ["¿Qué palabra nombra a una persona de tu familia?", ["madre", "amarillo", "siete", "lápiz"], 0, "'Madre' es una palabra de familia; las otras nombran un color, un número y un objeto."],
            ["Elige el final correcto: 'Este es mi hermano. Tiene un...'", ["cometa verde", "verde cometa", "cometa verde un", "es verde cometa"], 0, "En español el color va después del nombre: 'un cometa verde'."],
            ["¿Cómo comprobamos lo que aprendimos?", ["Repetir las palabras en voz alta con un amigo", "No practicar nunca", "Leer solo en silencio", "Saltarse las palabras nuevas"], 0, "La práctica activa en voz alta muestra lo que recordamos y lo que debemos repasar."]
          ]
        },
        {
          t: "Repaso general",
          intro: "Terminamos la unidad hablando de lo que aprendimos. Juntamos los saludos, los colores y los números en una sola conversación.",
          sections: [
            ["Lo que ya sé decir", "Ahora puedo saludar, nombrar colores, contar hasta diez y presentar a mi familia. Cada lección añadió una pieza nueva. Repasarlas juntas me ayuda a recordarlas."],
            ["Una conversación corta", "Podemos decir: 'Hola, soy Sara. Este es mi hermano. Su mochila es roja. Tengo tres lápices.' Varias frases cortas forman una conversación clara."]
          ],
          examples: [
            ["Escribe un saludo y una presentación usando tres ideas.", ["Empieza: 'Hola, soy Sara'.", "Añade: 'Este es mi amigo'.", "Termina: 'Su lápiz es azul'."], "Hola, soy Sara. Este es mi amigo. Su lápiz es azul."],
            ["Cuenta los objetos de tu mesa y di el total.", ["Señala cada objeto mientras cuentas.", "Di los números: uno, dos, tres, cuatro.", "Concluye: 'Hay cuatro objetos'."], "Hay cuatro objetos."]
          ],
          questions: [
            ["¿Cuál de estas frases es una presentación?", ["Soy Sara", "Azul", "Cuatro", "Gracias"], 0, "'Soy Sara' dice quién eres, por eso sirve para presentarte."],
            ["¿Qué palabra es un color?", ["rojo", "hola", "tres", "madre"], 0, "'Rojo' nombra un color; las demás son un saludo, un número y una palabra de familia."],
            ["Elige la frase bien ordenada: 'Mi amiga ...'", ["tiene una mochila verde", "tiene verde una mochila", "verde tiene una mochila", "una mochila verde tiene"], 0, "El orden natural es verbo, artículo, nombre y color: 'tiene una mochila verde'."],
            ["¿Qué hago si olvido una palabra durante la conversación?", ["Paro para siempre", "Pienso en el dibujo y la digo otra vez", "Cambio de idioma sin intentar", "Repito un sonido sin sentido"], 1, "Apoyarse en el dibujo y volver a intentarlo es una estrategia útil para recordar."]
          ]
        }
      ]
    },
    "cur_l_pre_sub_art": {
      shared: {
        sections: [
          ["الفن التعبيري", "الفن وسيلة يعبّر بها الطفل عن أفكاره ومشاعره بالخط واللون والصوت والحركة. لا يوجد عمل فني خاطئ إذا صدر عن ملاحظة صادقة. نشجّع كل طفل على التجربة."],
          ["الملاحظة قبل العمل", "ننظر إلى الأشياء من حولنا قبل أن نبدأ: شكل ورقة الشجرة، لون السماء، حركة الريح. الملاحظة الدقيقة تمنح العمل الفني معنى."],
          ["الأدوات والاستخدام الآمن", "نستعمل الأقلام والألوان والمقصّ بمساعدة الكبار. نضع الأدوات في مكانها بعد الانتهاء ونحافظ على نظافة الطاولة والملابس."],
          ["المشاركة والاستماع", "نعرض عملنا على الزملاء ونصغي إلى آرائهم باحترام. الحديث عن العمل يساعدنا على تنمية اللغة والثقة بالنفس."]
        ],
        vocab: [
          ["خط", "أثر يتركه القلم على الورقة، قد يكون مستقيما أو منحنيا."],
          ["لون", "ما نراه في الأشياء مثل الأحمر والأزرق والأخضر."],
          ["إيقاع", "انتظام في الصوت أو الحركة يمكن تكراره."],
          ["تعبير", "إظهار المعنى أو الشعور من خلال الفن."],
          ["خيال", "قدرة العقل على تخيّل صور وأفكار جديدة."],
          ["عرض", "تقديم العمل الفني للآخرين والتحدث عنه."]
        ],
        outcomes: [
          "يستخدم الخطوط والأشكال لتمثيل أشياء من محيطه.",
          "يميّز الألوان الأساسية ويستخدمها في عمله.",
          "يقلّد إيقاعا بسيطا بالتصفيق أو بالآلة.",
          "يعرض عمله ويعلّق عليه بجملة قصيرة."
        ],
        diagram: "diagram-colors.svg"
      },
      lessons: [
        {
          t: "الرسم بالقلم والورق",
          intro: "نبدأ رحلتنا الفنية بالقلم. سنرسم أشياء نراها كل يوم في البيت والحديقة.",
          sections: [
            ["الخطوط أولا", "نرسم خطوطا مستقيمة ومتنحنية ومنقطّة قبل رسم الشكل. الخط الأساس يصنع حدود الشيء الذي نريد تصويره. نكرّر الخط قليلا حتى يصبح ثابتا."],
            ["رسم ما نراه", "نختار تفاحة أو شجرة أو كوبا من على الطاولة. ننظر إليها جيدا ثم نرسم شكلها العام قبل التفاصيل الصغيرة. لا نحتاج إلى إتقان من أول محاولة."]
          ],
          examples: [
            ["ارسم شجرة في ورقتك.", ["ارسم خطا رأسيا للساق.", "أضف خطوطا متنحنية للأغصان.", "ارسم دائرة غير منتظمة للورق."], "شجرة بسيطة بساق وأغصان وأوراق."],
            ["ارسم كوب الشاي الذي تشربه في البيت.", ["ارسم شكلا يشبه المستطيل للكوب.", "أضف خطا منحنيا للمقبض.", "ضع دائرة صغيرة للشاي من الأعلى."], "كوب بمقبض ودائرة شاي."]
          ],
          questions: [
            ["بماذا نبدأ عادة قبل رسم شكل كامل؟", ["بالخطوط الأساسية", "بالألوان فقط", "بكتابة العنوان", "بقصّ الورقة"], 0, "الخطوط الأساسية تحدّد حدود الشكل، ثم تأتي التفاصيل والألوان لاحقا."],
            ["أي خط يشبه موجة الماء؟", ["الخط المستقيم", "الخط المنحني", "النقطة", "المثلث"], 1, "الخط المنحني يتعرّج مثل الموجة، بخلاف الخط المستقيم."],
            ["لماذا ننظر إلى الشيء قبل رسمه؟", ["لننسى شكله", "لنلاحظ شكله وتفاصيله", "لنغير لونه", "لنخفيه عن الزملاء"], 1, "الملاحظة تمدّ العقل بمعلومات عن الشكل والحجم قبل نقلها إلى الورق."],
            ["ماذا نفعل إذا لم يعجبنا الرسم من أول مرة؟", ["نمزّق الورقة غاضبين", "نحاول مرة أخرى بهدوء", "نتوقف عن الرسم للأبد", "نلوم الزملاء"], 1, "التكرار الهادئ هو طريقة التعلّم في الفن، ولا يوجد عمل مثالي من المحاولة الأولى."]
          ]
        },
        {
          t: "التلوين بالألوان الأساسية",
          intro: "بعد الرسم نضيف الحياة بالألوان. سنتعرّف على الأحمر والأصفر والأزرق وكيف نستعملها.",
          sections: [
            ["الألوان الأساسية", "الأحمر والأصفر والأزرق ألوان لا نستطيع تكوينها من غيرها. نجدها في العلم المغربي وفي الفواكه والزهور. نسمّي كل لون ونشير إلى شيء يحمله."],
            ["التلوين داخل الحدود", "نحرص على تلوين الشكل دون تجاوز خطوطه، ونترك مساحة بيضاء للتمييز بين الأجزاء. الضغط الخفيف بالقلم يعطي لونا متساويا ومريحا للنظر."]
          ],
          examples: [
            ["لوّن تفاحة حمراء وأوراقها خضراء.", ["اختر القلم الأحمر للتفاحة.", "لوّن داخل الحدود بحركات قصيرة.", "استبدل بالأخضر للأوراق واترك بقعة صغيرة بيضاء."], "تفاحة حمراء بأوراق خضراء."],
            ["كوّن اللون الأخضر من لونين أساسيين.", ["ضع مساحة صغيرة من الأصفر.", "أضف فوقها مساحة من الأزرق.", "امزج بلطف فتحصل على الأخضر."], "الأصفر + الأزرق = أخضر."]
          ],
          questions: [
            ["أي مجموعة ألوان أساسية؟", ["أحمر، أصفر، أزرق", "أخضر، برتقالي، بنفسجي", "أبيض، رمادي، أسود", "ذهبي، فضي، نحاسي"], 0, "الأحمر والأصفر والأزرق لا تُكوّن من مزج ألوان أخرى، بعكس باقي المجموعات."],
            ["ماذا ينتج من مزج الأصفر والأزرق؟", ["الأحمر", "الأخضر", "البرتقالي", "الأبيض"], 1, "مزج الأصفر والأزرق يعطي الأخضر المستخدم في أوراق الشجر."],
            ["لماذا نترك مساحة بيضاء بين جزأين ملوّنين؟", ["لأن الورق ناقص", "لتمييز الحدود بين الجزأين", "لأن الألوان فاسدة", "لزيادة وقت العمل"], 1, "المساحة البيضاء تعمل كفاصل بصري يجعل الشكل أوضح وأكثر تنظيما."],
            ["كيف نحصل على لون متساوٍ في التلوين؟", ["بضغط قوي في مكان واحد", "بحركات قصيرة متجاورة وضغط خفيف", "بلون واحد فقط دائما", "بإغلاق العينين"], 1, "الحركات القصيرة المتجاورة والضغط الخفيف توزّع اللون بالتساوي دون تكتّل."]
          ]
        },
        {
          t: "الموسيقى والإيقاع",
          intro: "الموسيقى تجعلنا نتحرك ونغنّي. اليوم نكتشف الإيقاع بالتصفيق والآلات البسيطة.",
          sections: [
            ["الإيقاع في حياتنا", "لإيقاع نظام في الصوت والحركة، نسمعه في دقات القلب وفي خطوات الجري وفي الطبول المغربية. نكرّر نمطا بسيطا مثل: صفقة، صفقة، سكتة."],
            ["الاستماع والأداء", "نصغي أولا إلى الإيقاع الذي يقدّمه معلّمنا، ثم نقلّده بالتصفيق أو بالطبل الصغير. نحافظ على نفس السرعة حتى يصبح الإيقاع واضحا."]
          ],
          examples: [
            ["كرّر إيقاعا من ثلاث صفقات وسكتة.", ["استمع إلى النمط مرتين.", "صفّق ثلاث مرات ببطء.", "احتفظ بالسكتة ثم أعد النمط."], "صفقة، صفقة، صفقة، سكتة."],
            ["اصنع إيقاعا باستخدام قلم وطاولة.", ["امسك القلم بأصابعك.", "اضرب الطاولة برفق مرتين.", "أضف ضربة ثالثة بعد قليل وكرّر."], "طق، طق ... طق، طق ..."]
          ],
          questions: [
            ["ماذا نسمّي تكرار الصفقة والسكتة في إيقاع الطبل؟", ["لون في الرسم", "نظام متكرر في الصوت أو الحركة", "نوع من الورق", "اسم آلة واحدة فقط"], 1, "الإيقاع هو تكرار منظّم للصوت أو الحركة، وليس لونا أو مادة."],
            ["أي آلة تستعمل لإنتاج إيقاع؟", ["الطبل", "الفرشاة", "الممحاة", "الدفتر"], 0, "الطبل آلة إيقاعية تُضرب لإنتاج الصوت، أما الباقي فأدوات رسم وكتابة."],
            ["لماذا نستمع قبل تقليد الإيقاع؟", ["لنغيّر اللحن تماما", "لنعرف ترتيب الأصوات وسرعتها", "لننسى النمط", "للتوقف عن التصفيق"], 1, "الاستماع يحدّد ترتيب الصفقات والسكتات ومقدار السرعة المطلوبة."],
            ["ماذا يحدث إذا تغيّرت سرعة الإيقاع كثيرا؟", ["يصبح مختلفا ويصعب تتبّعه", "يصبح لونا جديدا", "يختفي الصوت تماما", "يتغير اسم الآلة"], 0, "انتظام السرعة جزء من الإيقاع، وتغيّره المفاجئ يكسر النمط."]
          ]
        },
        {
          t: "المسرح والتمثيل",
          intro: "نختم وحدة الفن بالتمثيل. سنقوم بأدوار بسيطة ونعبّر بالجسد والصوت.",
          sections: [
            ["الدور والقصة القصيرة", "نختار قصة قصيرة عن بائع في السوق أو طفل يبحث عن كلبه. كل واحد يأخذ دورا ويقول جملة قصيرة. القصة البسيطة تكفي لتقديم عرض ممتع."],
            ["التعبير بالجسد والصوت", "نغيّر نبرة الصوت ونحركات الأيدي لنُظهر الفرح أو الدهشة أو التعب. الوقوف مستقيم والنظر إلى الجمهور يساعدان على إيصال المعنى."]
          ],
          examples: [
            ["مثّل مشهد شراء التفاح من السوق.", ["اختر دور البائع أو المشتري.", "قل جملة قصيرة: 'كم ثمن التفاح؟'", "أجب: 'خمسة دراهم، من فضلك.'"], "مشهد قصير بين البائع والمشتري."],
            ["عبّر عن دهشتك عندما تجد كلبك.", ["افتح عينيك وارفع حاجبيك.", "قل: 'ها هو كلبني!'", "تحرّك خطوة إلى الأمام بسرعة."], "دهشة واضحة بالوجه والصوت."]
          ],
          questions: [
            ["ما معنى الدور في المسرح؟", ["الشخصية التي يمثّلها اللاعب", "نوع الموسيقى", "لون الملابس فقط", "مكان العرض"], 0, "الدور هو الشخصية التي نتقمصها وننطق بلسانها أثناء العرض."],
            ["كيف نُظهر الفرح في التمثيل؟", ["بصوت هادئ ووجه مقطّب", "بابتسامة ونبرة مرتفعة", "بإغلاق العينين وحدهما", "بالصمت التام"], 1, "الابتسامة وارتفاع النبرة من علامات الفرح التي يفهمها المشاهد."],
            ["لماذا نتدرب على المشهد قبل عرضه؟", ["لحفظ ترتيب الجمل والحركات", "لإلغاء القصة", "لتغيير الأدوار دائما", "لتجنّب النظر للجمهور"], 0, "التدريب يثبّت ترتيب الكلام والحركة ويجعل العرض أكثر وضوحا."],
            ["ماذا نفعل بعد انتهاء العرض؟", ["نشكر الممثلين ونعلّق بكلمة لطيفة", "ننصرف بلا كلام", "نضحك من الأخطاء", "نكرّر نفس الدور بلا توقف"], 0, "الشكر والتعليق اللطيف يعزّز ثقة الممثلين ويحترم جهدهم."]
          ]
        }
      ]
    },
    "cur_l_p1_sub_cul": {
      shared: {
        sections: [
          ["الثقافة في حياتنا", "الثقافة هي ما نورثه من عادات ولغة وفنون وقيم. في المغرب نجدها في المطبخ والاحتفالات والحرف اليدوية. الثقافة تجمع الناس وتعرّفهم بأنفسهم."],
          ["الفن والحرف", "يصنع الحرفيون المغاربة الزليج والخوص والجلد بأيدٍ ماهرة. الفن يجمّل البيوت ويحكي قصصا عن المكان والناس. نحترم عمل الحرفي ونقدّره."],
          ["الرياضة واللعب", "اللعب جزء من حياة الطفل، يقوّي جسمه ويعلّمه التعاون. كرة القدم والقفز على الحبل من الألعاب المحبوبة في المدارس."],
          ["المجتمع والأسرة", "الأسرة هي النواة الأولى للمجتمع، تربّي الأطفال وتعلّمهم الاحترام. في الحي يتعاون الجيران في المناسبات ويتشاركون الفرح."]
        ],
        vocab: [
          ["ثقافة", "مجموعة العادات واللغة والفنون التي تميّز جماعة من الناس."],
          ["حرفة", "عمل يدوي متقن مثل صناعة الزليج أو الخوص."],
          ["تقاليد", "عادات متوارثة يمارسها الناس في المناسبات."],
          ["تعاون", "عمل الناس معا لتحقيق هدف مشترك."],
          ["احترام", "تقدير الآخرين ومعاملتهم بلطف."],
          ["هوية", "ما يميّز الفرد أو الجماعة من لغة وعادات وتاريخ."]
        ],
        outcomes: [
          "يذكر أمثلة من الثقافة المغربية في حياته اليومية.",
          "يميّز بعض الحرف اليدوية ويصف عمل الحرفي.",
          "يشرح فائدة اللعب والرياضة للصحة والصداقة.",
          "يعبّر عن أهمية التعاون داخل الأسرة والحي."
        ],
        diagram: "diagram-family.svg"
      },
      lessons: [
        {
          t: "ثقافتنا المغربية",
          intro: "لكل بلد ثقافته التي تميّزه. اليوم نكتشف مظاهر الثقافة المغربية التي نراها في بيتنا وشوارعنا.",
          sections: [
            ["ما هي الثقافة؟", "الثقافة تشمل اللغة والطعام والملابس والاحتفالات التي يتوارثها الناس. حين نتحدث العربية أو الأمازيغية فنحن نمارس ثقافتنا. الثقافة تجعلنا نعرف من نحن."],
            ["مظاهر الثقافة حولنا", "نرى الثقافة في كسكس الجمعة، وفي شاي النعناع، وفي زليج المسجد. كل هذه الأشياء تحكي تاريخا طويلا وتعبّر عن ذوق المغاربة."]
          ],
          examples: [
            ["اذكر ثلاثة مظاهر للثقافة المغربية.", ["أفكّر في الطعام: الكسكس.", "أفكّر في الشراب: شاي النعناع.", "أفكّر في الصنعة: الزليج."], "الكسكس وشاي النعناع والزليج."],
            ["كيف تعبّر اللغة عن ثقافتنا؟", ["نحدّد لغات البلد: العربية والأمازيغية.", "نلاحظ أن التحية تختلف بين السلام عليكم وأزول.", "نستنتج أن اللغة تحمل معاني الثقافة."], "اللغة تحمل تحياتنا وعاداتنا وتاريخنا."]
          ],
          questions: [
            ["أي مما يلي يُعدّ من مظاهر الثقافة المغربية؟", ["الزليج", "الثلاجة", "الهاتف", "المصعد"], 0, "الزليج صناعة يدوية مغربية قديمة، أما الباقي فأشياء حديثة لا تميّز ثقافة بعينها."],
            ["لماذا نقول إن اللغة جزء من الثقافة؟", ["لأنها تُكتب على الورق", "لأنها تحمل العادات والتحيات والتاريخ", "لأنها سهلة النطق", "لأنها تُستخدم في المتاجر"], 1, "اللغة ليست أداة كتابة فقط، بل خزنة لمعاني الجماعة وتقاليدها."],
            ["ما الفائدة من معرفة ثقافة بلدك؟", ["الاعتزاز بها والإحاطة بها", "نسيان تاريخك", "تغيير اسمك", "الابتعاد عن الأسرة"], 0, "معرفة الثقافة تعزّز الهوية والفخر بالانتماء دون تنقص من الآخرين."],
            ["أي جملة تحترم ثقافة الآخرين؟", ["عاداتنا أفضل دائما", "لكل جماعة عاداتها التي نحترمها", "لا ثقافة لغيرنا", "العادات لا تهم"], 1, "الاحترام يعني تقدير خصوصية كل جماعة والاعتراف بأن لكل منها عاداتها."]
          ]
        },
        {
          t: "الفن والحرف المغربية",
          intro: "الحرفي المغربي يصنع أشياء جميلة بيديه. سنتعرّف على أشهر الحرف وكيف نقدّرها.",
          sections: [
            ["الزليج والخوص", "الزليج قطع صغيرة ملوّنة تُركّب على الجدران والأرضيات، والخوص يُنسج من سعف النخيل لصنع السلال والكراسي. كل حرفة تحتاج صبرا ومهارة."],
            ["تقدير عمل الحرفي", "حين نشتري تحفة حرفية فنحن ندعم الحرفي ونساعد على بقاء مهنته. نتعامل معها بلطف لأنها أخذت وقتا وجهدا كبيرين."]
          ],
          examples: [
            ["كيف يصنع الحرفي الزليج؟", ["يختار قطعا صغيرة من البلاط الملوّن.", "يرتّبها بحسب رسمة محددة.", "يثبّتها معا لتكوين لوحة زليج."], "يرتّب قطعا ملوّنة ويثبّتها في رسمة."],
            ["لماذا نعتني بسلة الخوص؟", ["لأنها صُنعت من سعف النخيل بجهد.", "لأنها قد تتكسر إذا ضغطنا عليها.", "لأن العناية بها تحافظ على الحرفة."], "العناية بها تحفظ جهد الحرفي وتطيل عمرها."]
          ],
          questions: [
            ["ماذا يُصنع الزليج؟", ["من قطع بلاط ملوّنة", "من الخشب فقط", "من الحديد", "من الورق"], 0, "الزليج لوحة من قطع صغيرة ملوّنة تُركّب جنبا إلى جنب."],
            ["ما مادة صنع الخوص؟", ["سعف النخيل", "الزجاج", "البلاستيك", "القطن"], 0, "الخوص يُنسج من سعف النخيل، وهي مادة طبيعية من البيئة المغربية."],
            ["كيف ندعم الحرفي؟", ["بقراءة اسمه فقط", "بشراء عمله والعناية به", "بإتلاف التحفة", "بنسيان مهنته"], 1, "الشراء والاستخدام الجيد يمنحان الحرفي عملا ويحافظان على حرفته."],
            ["أي صفة تساعد الحرفي في عمله؟", ["الصبر", "السرعة وحدها", "الإهمال", "النسيان"], 0, "الأعمال الحرفية تحتاج صبرا وتركيزا لتركيب القطع بدقة."]
          ]
        },
        {
          t: "الرياضة واللعب",
          intro: "اللعب ليس مجرد تسلية، بل يساعدنا على النمو. اليوم نتحدث عن الرياضة وفوائدها.",
          sections: [
            ["فوائد اللعب", "الجري والقفز يقوّيان العضلات وينشّطان الجسم. اللعب مع الأصدقاء يعلّمنا الانتظار والعدل. بعد اللعب نشعر بالنشاط والسعادة."],
            ["قواعد اللعب", "لكل لعبة قواعد تحمي اللاعبين وتجعل النزاهة أساس الفوز. نحترم الحكم ونصفّق للفريق الآخر. الخسارة فرصة لتحسين الأداء لا سبب للغضب."]
          ],
          examples: [
            ["لماذا نلعب كرة القدم مع الأصدقاء؟", ["لأن الجري يقوّي الجسم.", "لأننا نتعلّم التعاون.", "لأننا نكتسب أصدقاء جدد."], "لأنها تقوّي الجسم وتعلّم التعاون."],
            ["خسر فريقك المباراة. ماذا تفعل؟", ["أهدّئ نفسي بعد الخسارة.", "أهنّئ الفريق الفائز بكلمات لطيفة.", "أقرّر التدريب أكثر للمرة القادمة."], "أهنّئ الفريق الفائز وأستعد للمرة القادمة."]
          ],
          questions: [
            ["أي فائدة للعب صحيحة؟", ["تقوية الجسم", "إتلاف الألعاب", "النوم طوال اليوم", "نسيان الأصدقاء"], 0, "الحركة في اللعب تنمّي العضلات وتحسّن صحة الجسم."],
            ["في لعبة كرة القدم مع الأصدقاء، لماذا نحتاج إلى قواعد؟", ["لإطالة وقت اللعب", "لحماية اللاعبين وضمان العدل", "لجعل الفوز مستحيلا", "لتغيير اسم اللعبة"], 1, "القواعد تنظّم التصرفات وتحافظ على سلامة الجميع وحقوقهم."],
            ["بعد خسارة فريقك للمباراة، كيف تتصرّف مع الفريق الفائز؟", ["نشتم الفريق الآخر", "نهنّئه ونحاول مجددا", "نكسر الكرة", "نلوم الحكم"], 1, "الروح الرياضية تعني احترام الفائز والتعلّم من الخسارة."],
            ["أي لعبة تنمّي التعاون بين أفراد الفريق؟", ["كرة القدم", "الشطرنج وحدك", "الألعاب الإلكترونية المنفردة", "القراءة الصامتة"], 0, "كرة القدم تتطلب تمرير الكرة وتنسيق الجهود بين أفراد الفريق."]
          ]
        },
        {
          t: "المجتمع والأسرة",
          intro: "نعيش في أسرة وحيّ يجمعهما التعاون. سنتعلم كيف نكون أفرادا مفيدين في مجتمعنا.",
          sections: [
            ["دور الأسرة", "الأهل يربّون الأطفال ويعلّمونهم القراءة والاحترام. الأبناء يساعدون في أعمال البيت البسيطة مثل ترتيب الغرف. كل فرد له دور مهم."],
            ["التعاون في الحي", "يتشارك الجيران في المناسبات ويساعدون المحتاج منهم. حين نحترم الجار ونخفّف أذاه نبني حياة أفضل للجميع."]
          ],
          examples: [
            ["كيف تساعد أسرتك في البيت؟", ["أرتّب كتبي وحقيبتي.", "أضع الأطباق في مكانها.", "أساعد في سقي النباتات."], "أساعد بترتيب الكتب والأطباق وسقي النباتات."],
            ["جارك يحتاج مساعدة في حمل حقيبة. ماذا تفعل؟", ["أتأكد من أن المساعدة آمنة.", "أستأذن أهلي قبل التحرّك.", "أساعد الجار بلطف وأضع الحقيبة حيث يريد."], "أساعده بكل لطف بعد استئذان أهلي."]
          ],
          questions: [
            ["ما دور الأبناء في الأسرة؟", ["أمر الجميع", "مساعدة في أعمال البيت البسيطة", "اللعب طوال اليوم", "شراء كل شيء"], 1, "كل فرد يساهم حسب قدرته، والطفل يستطيع ترتيب أغراضه ومساعدة أهله."],
            ["ماذا يعني التعاون مع الجيران؟", ["مشاركتهم المناسبات ومساعدتهم", "إزعاجهم دائما", "تجنّبهم تماما", "أخذ أشيائهم"], 0, "التعاون يعني التشارك والمساعدة بروح الاحترام."],
            ["لماذا نستأذن أهلي قبل مساعدة جار؟", ["لأن المساعدة ممنوعة", "لأن السلامة والتنظيم من مسؤولية الأهل", "لأن الجار لا يحتاج مساعدة", "لأن الوقت قصير"], 1, "استئذان الأهل يحفظ سلامتنا وينظّم تصرفاتنا."],
            ["أي تصرف يبني مجتمعا أفضل؟", ["احترام الآخرين والتعاون", "الصراخ في الشارع", "تجاهل الجيران", "كسر أشياء الحيّ"], 0, "الاحترام والتعاون هما أساس الحياة المشتركة السليمة."]
          ]
        }
      ]
    },
    "cur_l_p2_sub_sci": {
      shared: {
        sections: [
          ["الملاحظة أولا", "العالم من حولنا فيه نباتات وحيوانات وأشياء كثيرة. نلاحظ بالعين والأذن واليد لنعرف خصائصها. الملاحظة الدقيقة هي بداية كل بحث علمي."],
          ["تصنيف الأشياء", "نجمع الأشياء المتشابهة في مجموعة واحدة، مثل النباتات معا والحيوانات معا. التصنيف يساعدنا على فهم التنوّع في الطبيعة. نستعمل جداول بسيطة لتسجيل ملاحظاتنا."],
          ["البيئة التي نعيش فيها", "الهواء والماء والتربة والشمس عناصر تحيط بنا وتحتاجها الكائنات الحية. إذا اعتنينا بالبيئة عاشت الكائنات بصحة أفضل. نحافظ على النظافة في الفصل والحديقة."],
          ["التجربة والتأكد", "التجربة اختبار نجريه لنعرف شيئا لا نعرفه. نغيّر عاملا واحدا ونراقب ما يحدث، ثم نسجّل النتيجة. النتيجة تخبرنا هل كانت فكرتنا صحيحة أم لا."]
        ],
        vocab: [
          ["ملاحظة", "النظر أو الإصغاء إلى شيء لجمع معلومات عنه."],
          ["تصنيف", "وضع الأشياء المتشابهة في مجموعة واحدة."],
          ["بيئة", "كل ما يحيط بالكائن الحي من هواء وماء وتربة."],
          ["تجربة", "اختبار منظّم لمعرفة نتيجة تغيير عامل ما."],
          ["نبات", "كائن حي ينمو في التربة ويحتاج الماء والضوء."],
          ["صحة", "حالة الجسم السليمة التي تسمح له بالنمو والنشاط."]
        ],
        outcomes: [
          "يلاحظ خصائص نباتات وحيوانات مألوفة ويصفها.",
          "يصنّف كائنات بسيطة حسب أوجه الشبه.",
          "يصف خطوات تجربة بسيطة ويسجّل نتيجتها.",
          "يربط بين النظافة والصحة في حياته اليومية."
        ],
        outcomeTr: {
          fr: [
            "Observer et décrire les caractéristiques de plantes et d'animaux familiers.",
            "Classer des êtres vivants simples selon leurs ressemblances.",
            "Décrire les étapes d'une expérience simple et en noter le résultat.",
            "Établir un lien entre l'hygiène et la santé dans la vie quotidienne."
          ],
          en: [
            "Observe and describe the characteristics of familiar plants and animals.",
            "Classify simple living things by their similarities.",
            "Describe the steps of a simple experiment and record its result.",
            "Connect cleanliness and health in everyday life."
          ]
        },
        diagram: "diagram-animals.svg"
      },
      lessons: [
        {
          t: "النباتات في حياتنا",
          intro: "الشجرة في حديقتنا نبتة تعطينا الظل والفاكهة. اليوم نكتشف كيف تنمو النباتات وماذا تحتاج.",
          sections: [
            ["أجزاء النبتة", "للنبتة جذر يمتص الماء، وساق يحمل الأوراق، وأوراق تصنع الغذاء بالضوء. الزهرة تتحوّل إلى ثمرة فيها بذور. كل جزء له وظيفة مهمة."],
            ["ماذا تحتاج النبتة؟", "تحتاج النبتة إلى الماء والهواء والضوء والتربة الجيدة. إذا منعنا عنها الماء ذبلت، وإذا أعطيناها القدر المناسب نمت. نعتني بنباتات الفصل بانتظام."]
          ],
          examples: [
            ["لماذا نضع النبتة قرب النافذة؟", ["النبتة تحتاج إلى ضوء الشمس.", "النافذة تدخل الضوء إلى الفصل.", "الضوء يساعد الأوراق على صنع الغذاء."], "لأنها تحتاج الضوء لتصنيع غذائها."],
            ["ماذا يحدث إذا لم نسقِ النبتة أياما؟", ["التربة تجفّ.", "الجذر لا يجد ماءً يمتصه.", "تذبل الأوراق وتضعف النبتة."], "تذبل النبتة لقلة الماء."]
          ],
          questions: [
            ["أي جزء في النبتة يمتص الماء؟", ["الجذر", "الورقة", "الزهرة", "الثمرة"], 0, "الجذر مدفون في التربة ومهمته امتصاص الماء والأملاح."],
            ["ماذا تصنع الأوراق؟", ["الغذاء بمساعدة الضوء", "الماء من التربة", "البذور", "الظل فقط"], 0, "الأوراق تستقبل الضوء وتصنع غذاء النبتة، والجذر هو من يمتص الماء."],
            ["أي ظرف يساعد النبتة على النمو؟", ["الظلام التام", "ماء معتدل وضوء", "التربة الجافة دائما", "البرودة الشديدة"], 1, "النبتة تحتاج إلى ماء كافٍ وضوء مناسب، لا إلى ظلام أو جفاف."],
            ["لماذا نعتني بنباتات المدرسة؟", ["لأنها تجمّل المكان وتنقّي الهواء", "لأنها لا تحتاج عناية", "لأنها تنمو بلا ماء", "لأنها تمنع المطر"], 0, "النباتات تجمّل المحيط وتساعد في تنقية الهواء، فتحتاج إلى عنايتنا."]
          ],
          tr: {
            fr: {
              t: "Les plantes dans notre vie",
              intro: "L'arbre de notre jardin est une plante qui nous donne de l'ombre et des fruits. Découvrons comment les plantes poussent et ce dont elles ont besoin.",
              sections: [
                ["Observer d'abord", "Le monde qui nous entoure contient des plantes, des animaux et bien d'autres choses. Nous observons avec les yeux, les oreilles et les mains pour connaître leurs propriétés. L'observation attentive est le début de toute recherche."],
                ["Les parties d'une plante", "La plante a une racine qui absorbe l'eau, une tige qui porte les feuilles et des feuilles qui fabriquent la nourriture à la lumière. La fleur devient un fruit qui contient des graines. Chaque partie a un rôle important."],
                ["Classer les choses", "On regroupe les choses semblables dans un même ensemble, par exemple les plantes ensemble et les animaux ensemble. Classer aide à comprendre la diversité de la nature. On utilise un tableau simple pour noter nos observations."],
                ["Ce dont la plante a besoin", "La plante a besoin d'eau, d'air, de lumière et d'une bonne terre. Si l'on ne l'arrose pas, elle fanera ; avec la bonne quantité, elle grandira. Nous prenons soin des plantes de la classe régulièrement."],
                ["L'environnement qui nous entoure", "L'air, l'eau, la terre et le soleil nous entourent et sont nécessaires aux êtres vivants. Si nous prenons soin de l'environnement, les êtres vivants se portent mieux. Nous gardons la classe et le jardin propres."],
                ["L'expérience et la vérification", "Une expérience est un test que nous réalisons pour connaître quelque chose que nous ignorons. Nous changeons un seul facteur, nous observons ce qui se passe, puis nous notons le résultat. Le résultat nous dit si notre idée était juste."]
              ],
              vocab: [
                ["observation", "Regarder ou écouter une chose pour recueillir des informations."],
                ["classification", "Regrouper les choses semblables dans une même catégorie."],
                ["environnement", "Tout ce qui entoure un être vivant : air, eau, terre."],
                ["expérience", "Un test organisé pour connaître le résultat d'un changement."],
                ["plante", "Un être vivant qui pousse dans la terre et a besoin d'eau et de lumière."],
                ["santé", "L'état d'un corps sain qui lui permet de grandir et d'agir."]
              ],
              examples: [
                ["Pourquoi place-t-on la plante près de la fenêtre ?", ["La plante a besoin de lumière solaire.", "La fenêtre laisse entrer la lumière dans la classe.", "La lumière aide les feuilles à fabriquer leur nourriture."], "Parce qu'il lui faut de la lumière pour fabriquer sa nourriture."],
                ["Que se passe-t-il si l'on n'arrose pas la plante pendant plusieurs jours ?", ["La terre devient sèche.", "La racine ne trouve plus d'eau à absorber.", "Les feuilles fanent et la plante faiblit."], "La plante fane par manque d'eau."]
              ]
            },
            en: {
              t: "Plants in Our Life",
              intro: "The tree in our garden is a plant that gives us shade and fruit. Today we discover how plants grow and what they need.",
              sections: [
                ["Observing first", "The world around us has plants, animals and many other things. We use our eyes, ears and hands to learn their features. Careful observation is the start of every scientific search."],
                ["The parts of a plant", "A plant has a root that absorbs water, a stem that holds the leaves, and leaves that make food using light. The flower turns into a fruit that contains seeds. Every part has an important job."],
                ["Classifying things", "We put similar things in one group, for example plants together and animals together. Classifying helps us understand the variety in nature. We use a simple table to record our observations."],
                ["What a plant needs", "A plant needs water, air, light and good soil. If we do not water it, it wilts; with the right amount, it grows. We look after the classroom plants regularly."],
                ["The environment around us", "Air, water, soil and sunlight surround us and are needed by living things. If we care for the environment, living things are healthier. We keep the classroom and the garden clean."],
                ["Experiment and check", "An experiment is a test we do to learn something we do not know. We change one factor, watch what happens, then record the result. The result tells us whether our idea was right."]
              ],
              vocab: [
                ["observation", "Looking or listening to something to gather information about it."],
                ["classification", "Putting similar things into the same group."],
                ["environment", "Everything around a living thing, such as air, water and soil."],
                ["experiment", "An organised test to find out what happens when one thing changes."],
                ["plant", "A living thing that grows in soil and needs water and light."],
                ["health", "The state of a healthy body that lets it grow and stay active."]
              ],
              examples: [
                ["Why do we put the plant near the window?", ["The plant needs sunlight.", "The window lets light into the classroom.", "Light helps the leaves make their food."], "Because it needs light to make its food."],
                ["What happens if we do not water the plant for days?", ["The soil becomes dry.", "The root cannot find water to absorb.", "The leaves wilt and the plant gets weak."], "The plant wilts because of a lack of water."]
              ]
            }
          }
        },
        {
          t: "الحيوانات في المحيط",
          intro: "في الحديقة والبحر والمزرعة حيوانات كثيرة مختلفة. سنتعلم كيف نلاحظها ونصنّفها.",
          sections: [
            ["أين تعيش الحيوانات؟", "بعض الحيوانات يعيش في الماء مثل السمك، وبعضها على اليابسة مثل الأرنب والجمل. لكل حيوان مكان يناسبه؛ فالسمك يتنفس بالخياشيم والجمل يتحمل الحرّ والقحط."],
            ["كيف نصنّفها؟", "نصنّف الحيوانات حسب مكان عيشها أو حسب غطائها: ذوات الفراء وذوات الريش والأسماك. التصنيف ليس للترتيب فقط، بل يساعدنا على فهم احتياجات كل حيوان."]
          ],
          examples: [
            ["صنّف هذه الحيوانات: سمك، عصفور، أرنب.", ["السمك يعيش في الماء.", "العصفور له ريش ويطير.", "الأرنب له فراء ويعيش على اليابسة."], "سمك مائي، عصفور ذو ريش، أرنب ذو فراء."],
            ["لماذا لا نضع السمك في حوض بلا ماء؟", ["السمك يتنفس بالخياشيم.", "الخياشيم تحتاج الماء لاستخراج الأكسجين.", "بدون ماء لا يستطيع السمك البقاء حيا."], "لأن السمك يحتاج الماء ليتنفس."]
          ],
          questions: [
            ["أي حيوان يعيش في الماء ويتنفس بالخياشيم؟", ["السمك", "الأرنب", "العصفور", "الجمل"], 0, "الخياشيم عضو تنفسي مائي، لذلك يعيش السمك في الماء."],
            ["ما الذي يميّز العصفور؟", ["الريش والمنقار", "الخياشيم", "الفراء الكثيف", "غياب العينين"], 0, "الريش والمنقار من خصائص الطيور التي تساعدها على الطيران والأكل."],
            ["لماذا نضع الحيوانات في مجموعات؟", ["لفهم احتياجاتها وخصائصها", "لزيادة عددها", "لتغيير أسمائها", "لإخفائها"], 0, "التصنيف يكشف أوجه الشبه والاختلاف ويساعدنا على رعاية كل مجموعة."],
            ["أي مكان يناسب الجمل في المغرب؟", ["المناطق الصحراوية الجافة", "قاع المحيط", "الثلوج القطبية", "البركان النشط"], 0, "الجمل متكيّف مع الحرّ والقحط، فيعيش في المناطق الصحراوية."]
          ],
          tr: {
            fr: {
              t: "Les animaux dans notre environnement",
              intro: "Dans le jardin, la mer et la ferme vivent de nombreux animaux différents. Apprenons à les observer et à les classer.",
              sections: [
                ["Observer d'abord", "Le monde qui nous entoure contient des plantes, des animaux et bien d'autres choses. Nous observons avec les yeux, les oreilles et les mains pour connaître leurs propriétés. L'observation attentive est le début de toute recherche."],
                ["Où vivent les animaux ?", "Certains animaux vivent dans l'eau comme le poisson, d'autres sur la terre comme le lapin et le chameau. Chaque animal a un milieu qui lui convient : le poisson respire avec des ouïes et le chameau supporte la chaleur et la sécheresse."],
                ["Classer les choses", "On regroupe les choses semblables dans un même ensemble, par exemple les plantes ensemble et les animaux ensemble. Classer aide à comprendre la diversité de la nature. On utilise un tableau simple pour noter nos observations."],
                ["Comment les classer ?", "On classe les animaux selon leur milieu ou leur couverture : les mammifères à fourrure, les oiseaux à plumes et les poissons. Classer ne sert pas seulement à ordonner, mais aussi à comprendre les besoins de chaque animal."],
                ["L'environnement qui nous entoure", "L'air, l'eau, la terre et le soleil nous entourent et sont nécessaires aux êtres vivants. Si nous prenons soin de l'environnement, les êtres vivants se portent mieux. Nous gardons la classe et le jardin propres."],
                ["L'expérience et la vérification", "Une expérience est un test que nous réalisons pour connaître quelque chose que nous ignorons. Nous changeons un seul facteur, nous observons ce qui se passe, puis nous notons le résultat. Le résultat nous dit si notre idée était juste."]
              ],
              vocab: [
                ["observation", "Regarder ou écouter une chose pour recueillir des informations."],
                ["classification", "Regrouper les choses semblables dans une même catégorie."],
                ["environnement", "Tout ce qui entoure un être vivant : air, eau, terre."],
                ["expérience", "Un test organisé pour connaître le résultat d'un changement."],
                ["plante", "Un être vivant qui pousse dans la terre et a besoin d'eau et de lumière."],
                ["santé", "L'état d'un corps sain qui lui permet de grandir et d'agir."]
              ],
              examples: [
                ["Classe ces animaux : poisson, oiseau, lapin.", ["Le poisson vit dans l'eau.", "L'oiseau a des plumes et il vole.", "Le lapin a une fourrure et vit sur la terre."], "Poisson aquatique, oiseau à plumes, lapin à fourrure."],
                ["Pourquoi ne met-on pas un poisson dans un bac sans eau ?", ["Le poisson respire avec des ouïes.", "Les ouïes ont besoin d'eau pour prendre l'oxygène.", "Sans eau, le poisson ne peut pas survivre."], "Parce que le poisson a besoin d'eau pour respirer."]
              ]
            },
            en: {
              t: "Animals in Our Environment",
              intro: "In the garden, the sea and the farm live many different animals. Let us learn to observe and classify them.",
              sections: [
                ["Observing first", "The world around us has plants, animals and many other things. We use our eyes, ears and hands to learn their features. Careful observation is the start of every scientific search."],
                ["Where do animals live?", "Some animals live in water, like fish, while others live on land, like rabbits and camels. Each animal has a suitable home: fish breathe with gills and camels tolerate heat and drought."],
                ["Classifying things", "We put similar things in one group, for example plants together and animals together. Classifying helps us understand the variety in nature. We use a simple table to record our observations."],
                ["How to classify them", "We group animals by their home or their covering: furry mammals, feathered birds and fish. Classifying is not only for ordering, but also for understanding what each animal needs."],
                ["The environment around us", "Air, water, soil and sunlight surround us and are needed by living things. If we care for the environment, living things are healthier. We keep the classroom and the garden clean."],
                ["Experiment and check", "An experiment is a test we do to learn something we do not know. We change one factor, watch what happens, then record the result. The result tells us whether our idea was right."]
              ],
              vocab: [
                ["observation", "Looking or listening to something to gather information about it."],
                ["classification", "Putting similar things into the same group."],
                ["environment", "Everything around a living thing, such as air, water and soil."],
                ["experiment", "An organised test to find out what happens when one thing changes."],
                ["plant", "A living thing that grows in soil and needs water and light."],
                ["health", "The state of a healthy body that lets it grow and stay active."]
              ],
              examples: [
                ["Classify these animals: fish, bird, rabbit.", ["The fish lives in water.", "The bird has feathers and can fly.", "The rabbit has fur and lives on land."], "Water fish, feathered bird, furry rabbit."],
                ["Why not put a fish in a tank without water?", ["A fish breathes with gills.", "Gills need water to take in oxygen.", "Without water the fish cannot stay alive."], "Because a fish needs water to breathe."]
              ]
            }
          }
        },
        {
          t: "نجرّب ونلاحظ",
          intro: "هل تسقط الورقة مثل الحجر؟ بدل التخمين، نجري تجربة صغيرة ونلاحظ بأنفسنا.",
          sections: [
            ["خطوات التجربة", "نطرح سؤالا، ثم نتخيّن إجابة، ثم نجرّب. نغيّر شيئا واحدا فقط ونترك الباقي كما هو. بعد ذلك نسجّل ما رأيناه في جدول بسيط."],
            ["النتيجة والفكرة", "إذا جاءت النتيجة مختلفة عن تخميننا فلا مشكلة؛ نعدّل فكرتنا ونتعلّم. التجربة الجيدة تتكرر أكثر من مرة للتأكد. نكتب النتيجة بجملة واضحة."]
          ],
          examples: [
            ["جرّب: أيهما يسقط أسرع، ورقة مسطحة أم ورقة مطويّة؟", ["أسقط الورقتين من نفس الارتفاع.", "ألاحظ أن المطويّة تصل أولا.", "أستنتج أن الشكل يؤثّر في سقوط الورق."], "الورقة المطويّة تسقط أسرع."],
            ["اختبر هل يحتاج النبات إلى الضوء.", ["أضع نبتتين متشابهتين.", "أضع واحدة قرب النافذة والأخرى في الظلام.", "أسقيهما بالمقدار نفسه وألاحظ الفرق بعد أيام."], "النبتة القريبة من الضوء تنمو أفضل."]
          ],
          questions: [
            ["ما أول خطوة في التجربة العلمية؟", ["طرح سؤال", "كتابة النتيجة", "رسم الحيوان", "ترتيب الأقلام"], 0, "التجربة تبدأ بسؤال واضح نريد الإجابة عنه بالملاحظة."],
            ["في تجربة الورقة المسطحة والمطويّة، لماذا نغيّر عاملا واحدا فقط؟", ["لأن ذلك أسهل في الرسم", "لنعرف أي عامل سبّب التغيّر", "لأن العوامل قليلة", "لأن التجربة قصيرة"], 1, "تغيير عامل واحد يجعل النتيجة منسوبة إلى سبب معروف."],
            ["ماذا نفعل إذا اختلفت النتيجة عن تخميننا؟", ["نخفي النتيجة", "نعدّل فكرتنا ونتعلّم", "نكرّر التخمين فقط", "نتوقف عن التجربة"], 1, "الاختلاف فرصة لتصحيح الفهم، وهو جزء طبيعي من العمل العلمي."],
            ["أي أداة تساعد على تسجيل الملاحظات؟", ["الجدول", "اللون وحده", "الصوت فقط", "الريح"], 0, "الجدول ينظّم ما رأيناه ويجعل مقارنة النتائج سهلة."]
          ],
          tr: {
            fr: {
              t: "Nous expérimentons et observons",
              intro: "Une feuille de papier tombe-t-elle comme une pierre ? Au lieu de deviner, faisons une petite expérience et observons nous-mêmes.",
              sections: [
                ["Observer d'abord", "Le monde qui nous entoure contient des plantes, des animaux et bien d'autres choses. Nous observons avec les yeux, les oreilles et les mains pour connaître leurs propriétés. L'observation attentive est le début de toute recherche."],
                ["Les étapes d'une expérience", "Nous posons une question, nous imaginons une réponse, puis nous expérimentons. Nous changeons une seule chose et nous laissons le reste identique. Ensuite nous notons ce que nous avons vu dans un tableau simple."],
                ["Classer les choses", "On regroupe les choses semblables dans un même ensemble, par exemple les plantes ensemble et les animaux ensemble. Classer aide à comprendre la diversité de la nature. On utilise un tableau simple pour noter nos observations."],
                ["Le résultat et l'idée", "Si le résultat diffère de notre supposition, ce n'est pas un problème : nous corrigeons notre idée et nous apprenons. Une bonne expérience se répète plusieurs fois pour être sûre. Nous écrivons le résultat en une phrase claire."],
                ["L'environnement qui nous entoure", "L'air, l'eau, la terre et le soleil nous entourent et sont nécessaires aux êtres vivants. Si nous prenons soin de l'environnement, les êtres vivants se portent mieux. Nous gardons la classe et le jardin propres."],
                ["L'expérience et la vérification", "Une expérience est un test que nous réalisons pour connaître quelque chose que nous ignorons. Nous changeons un seul facteur, nous observons ce qui se passe, puis nous notons le résultat. Le résultat nous dit si notre idée était juste."]
              ],
              vocab: [
                ["observation", "Regarder ou écouter une chose pour recueillir des informations."],
                ["classification", "Regrouper les choses semblables dans une même catégorie."],
                ["environnement", "Tout ce qui entoure un être vivant : air, eau, terre."],
                ["expérience", "Un test organisé pour connaître le résultat d'un changement."],
                ["plante", "Un être vivant qui pousse dans la terre et a besoin d'eau et de lumière."],
                ["santé", "L'état d'un corps sain qui lui permet de grandir et d'agir."]
              ],
              examples: [
                ["Expérience : qu'est-ce qui tombe le plus vite, une feuille plate ou une feuille pliée ?", ["Je laisse tomber les deux feuilles de la même hauteur.", "J'observe que la feuille pliée arrive la première.", "J'en déduis que la forme influence la chute."], "La feuille pliée tombe plus vite."],
                ["Teste si une plante a besoin de lumière.", ["Je prends deux plantes semblables.", "J'en place une près de la fenêtre et l'autre dans l'obscurité.", "Je les arrose autant et j'observe la différence après quelques jours."], "La plante exposée à la lumière pousse mieux."]
              ]
            },
            en: {
              t: "We Experiment and Observe",
              intro: "Does a sheet of paper fall like a stone? Instead of guessing, let us do a small experiment and observe for ourselves.",
              sections: [
                ["Observing first", "The world around us has plants, animals and many other things. We use our eyes, ears and hands to learn their features. Careful observation is the start of every scientific search."],
                ["The steps of an experiment", "We ask a question, imagine an answer and then run the test. We change just one thing and keep everything else the same. Then we record what we saw in a simple table."],
                ["Classifying things", "We put similar things in one group, for example plants together and animals together. Classifying helps us understand the variety in nature. We use a simple table to record our observations."],
                ["The result and the idea", "If the result differs from our guess, that is fine: we adjust our idea and learn. A good experiment is repeated to be sure. We write the result in one clear sentence."],
                ["The environment around us", "Air, water, soil and sunlight surround us and are needed by living things. If we care for the environment, living things are healthier. We keep the classroom and the garden clean."],
                ["Experiment and check", "An experiment is a test we do to learn something we do not know. We change one factor, watch what happens, then record the result. The result tells us whether our idea was right."]
              ],
              vocab: [
                ["observation", "Looking or listening to something to gather information about it."],
                ["classification", "Putting similar things into the same group."],
                ["environment", "Everything around a living thing, such as air, water and soil."],
                ["experiment", "An organised test to find out what happens when one thing changes."],
                ["plant", "A living thing that grows in soil and needs water and light."],
                ["health", "The state of a healthy body that lets it grow and stay active."]
              ],
              examples: [
                ["Experiment: which falls faster, a flat sheet or a folded sheet?", ["Drop both sheets from the same height.", "Notice that the folded one arrives first.", "Conclude that shape affects how paper falls."], "The folded sheet falls faster."],
                ["Test whether a plant needs light.", ["Take two similar plants.", "Put one near the window and the other in the dark.", "Water both equally and observe the difference after a few days."], "The plant near the light grows better."]
              ]
            }
          }
        },
        {
          t: "الصحة والنظافة",
          intro: "الصحة نعمة نحافظ عليها بعادات بسيطة كل يوم. لنر كيف ترتبط النظافة بصحتنا.",
          sections: [
            ["عادات يومية للصحة", "نغسل اليدين قبل الأكل وبعد اللعب، وننظّف الأسنان صباحا ومساء. النوم الكافي والحركة اليومية يجعلان الجسم قويا. هذه العادات تحمينا من الأمراض."],
            ["النظافة في المدرسة", "نرمي القمامة في السلة ونحافظ على نظافة الطاولة والفصل. إذا مرض أحد الزملاء نخبر المعلّم بلطف دون مزاح. البيئة النظيفة تحمي الجميع."]
          ],
          examples: [
            ["لماذا نغسل اليدين قبل الأكل؟", ["الأيدي تلمس أشياء كثيرة خلال اليوم.", "قد تحمل الأيدي جراثيم غير مرئية.", "الغسل بالماء والصابون يزيل الجراثيم قبل دخول الطعام."], "لأن الغسل يمنع انتقال الجراثيم إلى الطعام."],
            ["صديقك سعل في الفصل. ما التصرف المناسب؟", ["ألاحظ أن صديقي يحتاج إلى راحة.", "أخبر المعلّم بهدوء دون مزاح.", "أحافظ على مسافة مناسبة وأواصل عملي."], "أخبر المعلّم بلطف وأحافظ على مسافة مناسبة."]
          ],
          questions: [
            ["متى نغسل اليدين؟", ["قبل الأكل وبعد اللعب", "قبل النوم فقط", "عند المطر فقط", "لا نغسلها أبدا"], 0, "الأيدي تلمس أشياء كثيرة، فغسلها قبل الأكل وبعد اللعب يحمي الجسم."],
            ["أي عادة تحمي الأسنان؟", ["تنظيفها صباحا ومساء", "شرب الماء البارد فقط", "أكل الحلوى دون شرب", "تركها بلا تنظيف"], 0, "تنظيف الأسنان مرتين يوميا يزيل بقايا الطعام ويحفظها سليمة."],
            ["لماذا نرمي القمامة في السلة؟", ["لأنها تجمّل الفصل وتمنع الجراثيم", "لأنها تجذب الحيوانات", "لأنها تزيد العمل", "لأن السلة صغيرة"], 0, "وضع القمامة في مكانها يحافظ على نظافة المكان ويقلّل انتشار الجراثيم."],
            ["كيف نتعامل مع زميل مريض؟", ["نسخر منه", "نخبر المعلّم بلطف ونساعده", "نتركه بلا مساعدة", "نقول إنه لا يعرف شيئا"], 1, "إخبار المعلّم والمساعدة الهادئة من التصرفات التي تحمي الجميع."]
          ],
          tr: {
            fr: {
              t: "La santé et l'hygiène",
              intro: "La santé est une richesse que nous protégeons par de petites habitudes chaque jour. Voyons comment la propreté protège notre corps.",
              sections: [
                ["Observer d'abord", "Le monde qui nous entoure contient des plantes, des animaux et bien d'autres choses. Nous observons avec les yeux, les oreilles et les mains pour connaître leurs propriétés. L'observation attentive est le début de toute recherche."],
                ["Des habitudes quotidiennes pour la santé", "Nous nous lavons les mains avant de manger et après avoir joué, et nous nous brossons les dents matin et soir. Un sommeil suffisant et un peu d'exercice rendent le corps solide. Ces habitudes nous protègent des maladies."],
                ["Classer les choses", "On regroupe les choses semblables dans un même ensemble, par exemple les plantes ensemble et les animaux ensemble. Classer aide à comprendre la diversité de la nature. On utilise un tableau simple pour noter nos observations."],
                ["La propreté à l'école", "Nous jetons les déchets dans la poubelle et nous gardons la table et la classe propres. Si un camarade est malade, nous prévenons le maître gentiment sans nous moquer. Un environnement propre protège tout le monde."],
                ["L'environnement qui nous entoure", "L'air, l'eau, la terre et le soleil nous entourent et sont nécessaires aux êtres vivants. Si nous prenons soin de l'environnement, les êtres vivants se portent mieux. Nous gardons la classe et le jardin propres."],
                ["L'expérience et la vérification", "Une expérience est un test que nous réalisons pour connaître quelque chose que nous ignorons. Nous changeons un seul facteur, nous observons ce qui se passe, puis nous notons le résultat. Le résultat nous dit si notre idée était juste."]
              ],
              vocab: [
                ["observation", "Regarder ou écouter une chose pour recueillir des informations."],
                ["classification", "Regrouper les choses semblables dans une même catégorie."],
                ["environnement", "Tout ce qui entoure un être vivant : air, eau, terre."],
                ["expérience", "Un test organisé pour connaître le résultat d'un changement."],
                ["plante", "Un être vivant qui pousse dans la terre et a besoin d'eau et de lumière."],
                ["santé", "L'état d'un corps sain qui lui permet de grandir et d'agir."]
              ],
              examples: [
                ["Pourquoi nous lavons-nous les mains avant de manger ?", ["Nos mains touchent beaucoup de choses dans la journée.", "Elles peuvent porter des germes invisibles.", "Le lavage avec de l'eau et du savon enlève ces germes avant le repas."], "Parce que le lavage empêche les germes d'entrer dans la nourriture."],
                ["Un camarade tousse en classe. Que faire ?", ["Je remarque que mon camarade a besoin de repos.", "Je préviens le maître calmement, sans me moquer.", "Je garde une distance raisonnable et je continue mon travail."], "Je préviens le maître gentiment et je garde une distance raisonnable."]
              ]
            },
            en: {
              t: "Health and Cleanliness",
              intro: "Health is something we protect with simple habits every day. Let us see how cleanliness keeps our bodies well.",
              sections: [
                ["Observing first", "The world around us has plants, animals and many other things. We use our eyes, ears and hands to learn their features. Careful observation is the start of every scientific search."],
                ["Daily habits for health", "We wash our hands before eating and after playing, and we brush our teeth morning and evening. Enough sleep and daily movement make the body strong. These habits protect us from illness."],
                ["Classifying things", "We put similar things in one group, for example plants together and animals together. Classifying helps us understand the variety in nature. We use a simple table to record our observations."],
                ["Cleanliness at school", "We throw rubbish in the bin and keep the desk and classroom clean. If a classmate is ill, we tell the teacher kindly without teasing. A clean environment protects everyone."],
                ["The environment around us", "Air, water, soil and sunlight surround us and are needed by living things. If we care for the environment, living things are healthier. We keep the classroom and the garden clean."],
                ["Experiment and check", "An experiment is a test we do to learn something we do not know. We change one factor, watch what happens, then record the result. The result tells us whether our idea was right."]
              ],
              vocab: [
                ["observation", "Looking or listening to something to gather information about it."],
                ["classification", "Putting similar things into the same group."],
                ["environment", "Everything around a living thing, such as air, water and soil."],
                ["experiment", "An organised test to find out what happens when one thing changes."],
                ["plant", "A living thing that grows in soil and needs water and light."],
                ["health", "The state of a healthy body that lets it grow and stay active."]
              ],
              examples: [
                ["Why do we wash our hands before eating?", ["Our hands touch many things during the day.", "They may carry invisible germs.", "Washing with water and soap removes germs before we eat."], "Because washing stops germs from reaching our food."],
                ["A classmate coughs in class. What should we do?", ["Notice that your classmate needs rest.", "Tell the teacher calmly, without teasing.", "Keep a sensible distance and carry on with your work."], "Tell the teacher kindly and keep a sensible distance."]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p3_sub_math": {
      shared: {
        sections: [
          ["الأعداد من حولنا", "نستعمل الأعداد في السوق لحساب الدراهم، وفي المدرسة لتعداد التلاميذ، وفي البيت لقياس الأشياء. كل عدد له قيمة ومكان في الترتيب. فهم الأعداد يساعدنا على التخطيط اليومي."],
          ["العمليات الأربع", "الجمع يزيد الكمية، والطرح ينقصها، والضرب يكرّر المجموعة، والقسمة توزّعها بالتساوي. نختار العملية حسب السؤال لا حسب الأرمقام وحدها. نتحقق من الإجابة دائما."],
          ["الأشكال والقياس", "نرى المثلث والمربع والدائرة في الأبواب والنوافذ والأطباق. لكل شكل خصائص تميّزه مثل عدد الأضلاع والزوايا. القياس يساعدنا على معرفة الأطوال والمساحات."],
          ["التحقق من الحل", "بعد حل المسألة نعيد قراءة السؤال ونتأكد من وحدة الجواب. نجرّب إعادة الحل بطريقة أخرى إذا أمكن. الخطأ فرصة لفهم العملية بشكل أفضل."]
        ],
        vocab: [
          ["عدد", "رمز يُستخدم لتعداد الأشياء أو قياسها."],
          ["قيمة مكانية", "قيمة الرقم بحسب مكانه في العدد مثل الآحاد والعشرات."],
          ["قسمة", "عملية توزيع كمية على مجموعات متساوية."],
          ["بسط", "الرقم فوق خط الكسر، ويدل على الأجزاء المأخوذة."],
          ["ضلع", "الخط المستقيم الذي يحدّد جانب الشكل."],
          ["محيط", "المسافة حول خارج الشكل، وهي مجموع أضلاعه."]
        ],
        outcomes: [
          "يقرأ أعدادا كبيرة ويكتبها ويحدّد قيمة كل رقم.",
          "يحل مسائل قسمة بسيطة بتوزيع متساوٍ.",
          "يقرأ كسورا بسيطة ويمثّلها بصورة.",
          "يسمّي أشكالا هندسية ويحسب محيطها."
        ],
        outcomeTr: {
          fr: [
            "Lire et écrire des grands nombres et déterminer la valeur de chaque chiffre.",
            "Résoudre des problèmes de division simple par une répartition égale.",
            "Lire des fractions simples et les représenter par un dessin.",
            "Nommer des formes géométriques et calculer leur périmètre."
          ],
          en: [
            "Read and write large numbers and determine the value of each digit.",
            "Solve simple division problems by sharing equally.",
            "Read simple fractions and represent them with a picture.",
            "Name geometric shapes and calculate their perimeter."
          ]
        },
        diagram: "diagram-place-value.svg"
      },
      lessons: [
        {
          t: "قراءة الأعداد الكبيرة وكتابتها",
          intro: "في السوق قد يشتري التاجر مئات الأرغفة دفعة واحدة. لنعرف كيف نقرأ هذه الأعداد الكبيرة ونكتبها.",
          sections: [
            ["القيمة المكانية", "في العدد 345، الرقم 5 في خانة الآحاد و4 في خانة العشرات و3 في خانة المئات. كل خانة تساوي عشر التي تليها من اليمين. ترتيب الخانات يعطي العدد قيمته."],
            ["من اللفظ إلى الرقم", "نكتب «ثلاثمئة وخمسة وأربعين» هكذا: 345. نبدأ من المئات ثم العشرات ثم الآحاد. إذا غابت خانة نضع صفرا مكانها كما في 407."]
          ],
          examples: [
            ["اكتب العدد: أربعمئة واثنان وسبعون.", ["أحدّد المئات: 4.", "أحدّد العشرات: 7، والآحاد: 2.", "أكتب العدد 472."], "472"],
            ["ما قيمة الرقم 6 في العدد 563؟", ["أحدّد مكان 6: هو في خانة العشرات.", "خانة العشرات تعني عشرات الوحدات.", "إذن قيمته 60."], "60"]
          ],
          questions: [
            ["كم تساوي قيمة الرقم 3 في العدد 435؟", ["3", "30", "300", "3000"], 2, "الرقم 3 في خانة المئات، فيساوي ثلاث مئة لا ثلاثة ولا ثلاثين."],
            ["أي كتابة صحيحة للعدد «مئتان وثمانية»؟", ["208", "280", "2008", "28"], 0, "مئتان تعني 200، وثمانية تعني 8، ولا توجد عشرات فنكتب صفرا: 208."],
            ["كم عدد الخانات في العدد 1000؟", ["2", "3", "4", "5"], 2, "العدد 1000 مكوّن من أربع خانات: الوحدة والعشرة والمئة والألف."],
            ["لماذا نضع صفرا في العدد 506؟", ["لأن العشرات غائبة", "لأن الآحاد غائبة", "لأن المئات غائبة", "لأن الصفر يزيد العدد"], 0, "الصفر يحفظ مكان الخانة الخالية، فيبقى الرقم 5 في المئات و6 في الآحاد."]
          ],
          tr: {
            fr: {
              t: "Lire et écrire les grands nombres",
              intro: "Au marché, un commerçant peut acheter des centaines de pains d'un coup. Apprenons à lire et à écrire ces grands nombres.",
              sections: [
                ["Les nombres autour de nous", "Nous utilisons les nombres au marché pour compter les dirhams, à l'école pour compter les élèves et à la maison pour mesurer des objets. Chaque nombre a une valeur et une place dans l'ordre. Comprendre les nombres aide à organiser la journée."],
                ["La valeur de position", "Dans le nombre 345, le chiffre 5 est aux unités, le 4 aux dizaines et le 3 aux centaines. Chaque position vaut dix fois celle qui est à sa droite. L'ordre des positions donne au nombre sa valeur."],
                ["Les quatre opérations", "L'addition augmente une quantité, la soustraction la diminue, la multiplication répète un groupe et la division le répartit également. On choisit l'opération selon la question et non selon les seuls chiffres. On vérifie toujours la réponse."],
                ["De l'énoncé au chiffre", "On écrit « trois cent quarante-cinq » ainsi : 345. On commence par les centaines, puis les dizaines et enfin les unités. Si une position manque, on met un zéro, comme dans 407."],
                ["Les formes et la mesure", "Nous voyons le triangle, le carré et le cercle dans les portes, les fenêtres et les assiettes. Chaque forme a des propriétés qui la distinguent, comme le nombre de côtés et d'angles. Mesurer aide à connaître les longueurs et les surfaces."],
                ["Vérifier la solution", "Après avoir résolu un problème, nous relisons la question et nous vérifions l'unité de la réponse. Si possible, nous refaisons le calcul autrement. L'erreur est une occasion de mieux comprendre l'opération."]
              ],
              vocab: [
                ["nombre", "Un symbole utilisé pour compter des objets ou mesurer quelque chose."],
                ["valeur de position", "La valeur d'un chiffre selon sa place dans le nombre, comme les unités ou les dizaines."],
                ["division", "Une opération qui répartit une quantité en groupes égaux."],
                ["numérateur", "Le chiffre au-dessus de la barre de fraction ; il indique les parties prises."],
                ["côté", "La ligne droite qui forme un bord de la figure."],
                ["périmètre", "La distance autour d'une figure, égale à la somme de ses côtés."]
              ],
              examples: [
                ["Écris le nombre : quatre cent soixante-douze.", ["Je repère les centaines : 4.", "Je repère les dizaines : 7 et les unités : 2.", "J'écris 472."], "472"],
                ["Quelle est la valeur du chiffre 6 dans le nombre 563 ?", ["Je repère la place du 6 : il est aux dizaines.", "La place des dizaines vaut des groupes de dix.", "Sa valeur est donc 60."], "60"]
              ]
            },
            en: {
              t: "Reading and Writing Large Numbers",
              intro: "At the market a seller may buy hundreds of loaves at once. Let us learn to read and write these large numbers.",
              sections: [
                ["Numbers around us", "We use numbers at the market to count dirhams, at school to count pupils and at home to measure things. Every number has a value and a place in order. Understanding numbers helps us plan the day."],
                ["Place value", "In 345, the digit 5 is in the units place, 4 in the tens and 3 in the hundreds. Each place is worth ten times the one to its right. The order of the places gives the number its value."],
                ["The four operations", "Addition increases a quantity, subtraction decreases it, multiplication repeats a group and division shares it equally. We choose the operation from the question, not from the digits alone. We always check the answer."],
                ["From words to digits", "We write 'three hundred and forty-five' as 345. We start with the hundreds, then the tens and finally the units. If a place is missing we write a zero, as in 407."],
                ["Shapes and measurement", "We see triangles, squares and circles in doors, windows and plates. Each shape has features that identify it, such as the number of sides and angles. Measuring helps us find lengths and areas."],
                ["Checking the solution", "After solving a problem we reread the question and check the unit of the answer. If possible we work it out another way. A mistake is a chance to understand the operation better."]
              ],
              vocab: [
                ["number", "A symbol used for counting objects or measuring things."],
                ["place value", "The value of a digit according to its place in a number, such as units or tens."],
                ["division", "An operation that shares a quantity into equal groups."],
                ["numerator", "The number above the fraction bar; it shows the parts taken."],
                ["side", "The straight line that forms an edge of a shape."],
                ["perimeter", "The distance around a shape, equal to the sum of its sides."]
              ],
              examples: [
                ["Write the number: four hundred and seventy-two.", ["Identify the hundreds: 4.", "Identify the tens: 7 and the units: 2.", "Write 472."], "472"],
                ["What is the value of the digit 6 in 563?", ["Find the place of 6: it is in the tens.", "The tens place means groups of ten.", "So its value is 60."], "60"]
              ]
            }
          }
        },
        {
          t: "القسمة وتوزيع الأشياء بالتساوي",
          intro: "عندنا 12 حبة تمر ونريد توزيعها على 4 أصدقاء بالعدل. هذه هي القسمة، وسنتعلم كيف نحسبها.",
          sections: [
            ["معنى القسمة", "القسمة تعني تقسيم كمية إلى مجموعات متساوية أو معرفة عدد المجموعات. في 12 ÷ 4، المقسوم 12 والمقسوم عليه 4 والناتج 3. نتحقق بضرب 3 في 4 فنحصل على 12."],
            ["القسمة في السوق", "إذا كان ثمن الكيسة 5 دراهم، فكم كيسة نشتري بـ 20 درهما؟ نحسب 20 ÷ 5 = 4. القسمة تساعدنا على معرفة العدد أو الثمن لكل واحد."]
          ],
          examples: [
            ["وزّع 15 قلما على 3 صناديق بالتساوي.", ["المقسوم 15 والمقسوم عليه 3.", "نحسب 15 ÷ 3 = 5.", "نضع 5 أقلام في كل صندوق."], "5 أقلام في كل صندوق"],
            ["ثمن أربعة دفاتر 24 درهما. كم ثمن الدفتر الواحد؟", ["المبلغ الكلي 24.", "عدد الدفاتر 4.", "24 ÷ 4 = 6 دراهم للدفتر."], "6 دراهم"]
          ],
          questions: [
            ["ما ناتج 18 ÷ 3؟", ["4", "5", "6", "9"], 2, "لأن 6 مضروبا في 3 يعطي 18، فالناتج هو 6."],
            ["ما المقسوم عليه في العملية 20 ÷ 5 = 4؟", ["20", "5", "4", "100"], 1, "المقسوم عليه هو العدد الذي نقسم به، وهو 5؛ أما 20 فالمقسوم و4 الناتج."],
            ["إذا وزّعنا 10 تفاحات على 5 أطفال، كم يأخذ كل طفل؟", ["1", "2", "5", "10"], 1, "10 ÷ 5 = 2، ويمكن التحقق بضرب 2 في 5."],
            ["كيف نتأكد من صحة ناتج القسمة؟", ["نجمع الناتج والمقسوم عليه", "نضرب الناتج في المقسوم عليه", "نطرح المقسوم من الناتج", "نكتب صفرا بعد الناتج"], 1, "الضرب هو العملية المعاكسة للقسمة، فيعيدنا إلى المقسوم الأصلي."]
          ],
          tr: {
            fr: {
              t: "La division et le partage égal",
              intro: "Nous avons 12 dattes à partager également entre 4 amis. C'est la division ; apprenons à la calculer.",
              sections: [
                ["Les nombres autour de nous", "Nous utilisons les nombres au marché pour compter les dirhams, à l'école pour compter les élèves et à la maison pour mesurer des objets. Chaque nombre a une valeur et une place dans l'ordre. Comprendre les nombres aide à organiser la journée."],
                ["Le sens de la division", "Diviser, c'est répartir une quantité en groupes égaux ou trouver le nombre de groupes. Dans 12 ÷ 4, le dividende est 12, le diviseur est 4 et le quotient est 3. On vérifie en multipliant 3 par 4 pour retrouver 12."],
                ["Les quatre opérations", "L'addition augmente une quantité, la soustraction la diminue, la multiplication répète un groupe et la division le répartit également. On choisit l'opération selon la question et non selon les seuls chiffres. On vérifie toujours la réponse."],
                ["La division au marché", "Si un sachet coûte 5 dirhams, combien de sachets achetons-nous avec 20 dirhams ? On calcule 20 ÷ 5 = 4. La division aide à trouver le nombre ou le prix de chaque élément."],
                ["Les formes et la mesure", "Nous voyons le triangle, le carré et le cercle dans les portes, les fenêtres et les assiettes. Chaque forme a des propriétés qui la distinguent, comme le nombre de côtés et d'angles. Mesurer aide à connaître les longueurs et les surfaces."],
                ["Vérifier la solution", "Après avoir résolu un problème, nous relisons la question et nous vérifions l'unité de la réponse. Si possible, nous refaisons le calcul autrement. L'erreur est une occasion de mieux comprendre l'opération."]
              ],
              vocab: [
                ["nombre", "Un symbole utilisé pour compter des objets ou mesurer quelque chose."],
                ["valeur de position", "La valeur d'un chiffre selon sa place dans le nombre, comme les unités ou les dizaines."],
                ["division", "Une opération qui répartit une quantité en groupes égaux."],
                ["numérateur", "Le chiffre au-dessus de la barre de fraction ; il indique les parties prises."],
                ["côté", "La ligne droite qui forme un bord de la figure."],
                ["périmètre", "La distance autour d'une figure, égale à la somme de ses côtés."]
              ],
              examples: [
                ["Partage 15 crayons dans 3 boîtes de façon égale.", ["Le dividende est 15 et le diviseur est 3.", "On calcule 15 ÷ 3 = 5.", "On met 5 crayons dans chaque boîte."], "5 crayons par boîte"],
                ["Quatre cahiers coûtent 24 dirhams. Quel est le prix d'un cahier ?", ["La somme totale est 24.", "Le nombre de cahiers est 4.", "24 ÷ 4 = 6 dirhams par cahier."], "6 dirhams"]
              ]
            },
            en: {
              t: "Division and Equal Sharing",
              intro: "We have 12 dates to share equally among 4 friends. This is division; let us learn how to work it out.",
              sections: [
                ["Numbers around us", "We use numbers at the market to count dirhams, at school to count pupils and at home to measure things. Every number has a value and a place in order. Understanding numbers helps us plan the day."],
                ["The meaning of division", "Dividing means splitting a quantity into equal groups or finding the number of groups. In 12 ÷ 4, the dividend is 12, the divisor is 4 and the quotient is 3. We check by multiplying 3 by 4 to get back to 12."],
                ["The four operations", "Addition increases a quantity, subtraction decreases it, multiplication repeats a group and division shares it equally. We choose the operation from the question, not from the digits alone. We always check the answer."],
                ["Division at the market", "If one bag costs 5 dirhams, how many bags can we buy with 20 dirhams? We work out 20 ÷ 5 = 4. Division helps us find the number or the price of each item."],
                ["Shapes and measurement", "We see triangles, squares and circles in doors, windows and plates. Each shape has features that identify it, such as the number of sides and angles. Measuring helps us find lengths and areas."],
                ["Checking the solution", "After solving a problem we reread the question and check the unit of the answer. If possible we work it out another way. A mistake is a chance to understand the operation better."]
              ],
              vocab: [
                ["number", "A symbol used for counting objects or measuring things."],
                ["place value", "The value of a digit according to its place in a number, such as units or tens."],
                ["division", "An operation that shares a quantity into equal groups."],
                ["numerator", "The number above the fraction bar; it shows the parts taken."],
                ["side", "The straight line that forms an edge of a shape."],
                ["perimeter", "The distance around a shape, equal to the sum of its sides."]
              ],
              examples: [
                ["Share 15 pencils equally among 3 boxes.", ["The dividend is 15 and the divisor is 3.", "Work out 15 ÷ 3 = 5.", "Put 5 pencils in each box."], "5 pencils in each box"],
                ["Four notebooks cost 24 dirhams. What is the price of one notebook?", ["The total amount is 24.", "The number of notebooks is 4.", "24 ÷ 4 = 6 dirhams per notebook."], "6 dirhams"]
              ]
            }
          }
        },
        {
          t: "الكسر: جزء من كل",
          intro: "حين نأخذ قطعة من قرص التمر نأخذ جزءا من الكل. هذا الجزء يسمّى كسرا، وسنتعلم قراءته.",
          sections: [
            ["كيف نكتب الكسر؟", "إذا قسّمنا قرصا إلى 4 أجزاء متساوية وأكلنا جزءا، نكتب 1/4. البسط يدلّ على الجزء المأخوذ، والمقام على عدد الأجزاء المتساوية. نقرأ الكسر «واحدا من أربعة»."],
            ["أشكال وأجزاء", "نستطيع تمثيل الكسر بدائرة أو مستطيل مقسّم إلى أجزاء متساوية. المهم أن تكون الأجزاء متساوية حتى يكون التمثيل صحيحا. نلوّن عدد الأجزاء المطلوبة."]
          ],
          examples: [
            ["مثّل الكسر 3/4 برسم دائرة.", ["قسّم الدائرة إلى 4 أجزاء متساوية.", "لوّن 3 أجزاء منها.", "الجزء الملون يمثل 3/4."], "دائرة من أربعة أجزاء، ثلاثة منها ملوّنة."],
            ["في صندوق فيه 6 أقلام، أخذتَ قلمين. ما الكسر؟", ["الكل 6 أقلام، فالمقام 6.", "المأخوذ قلمان، فالبسط 2.", "الكسر 2/6."], "2/6"]
          ],
          questions: [
            ["ما مقام الكسر 3/5؟", ["3", "5", "8", "2"], 1, "المقام هو الرقم تحت الخط، وهو 5، ويدل على عدد الأجزاء المتساوية."],
            ["أي رسم لقرص التمر يمثل الكسر 1/2؟", ["دائرة مقسومة جزأين متساويين ولوّن واحد", "دائرة مقسومة 4 ولوّن 3", "مستطيل مقسوم 3 ولوّن 1", "مربع غير مقسوم"], 0, "النصف يعني جزءا واحدا من جزأين متساويين."],
            ["لماذا يجب أن تكون أجزاء الكسر متساوية؟", ["لأن الشكل أجمل", "لأن الكسر يعني أجزاء متساوية من الكل", "لأن اللون يختلف", "لأن العدد صغير"], 1, "تعريف الكسر مبني على تقسيم الكل إلى أجزاء متساوية، وإلا فلا معنى للبسط والمقام."],
            ["ما الكسر الذي يمثل جزأين من 8؟", ["8/2", "2/8", "2/6", "8/10"], 1, "البسط هو الجزء المأخوذ 2 والمقام هو عدد الأجزاء 8."]
          ],
          tr: {
            fr: {
              t: "La fraction : une partie d'un tout",
              intro: "Quand nous prenons un morceau d'une galette de dattes, nous prenons une partie du tout. Cette partie s'appelle une fraction.",
              sections: [
                ["Les nombres autour de nous", "Nous utilisons les nombres au marché pour compter les dirhams, à l'école pour compter les élèves et à la maison pour mesurer des objets. Chaque nombre a une valeur et une place dans l'ordre. Comprendre les nombres aide à organiser la journée."],
                ["Comment écrire une fraction", "Si l'on partage une galette en 4 parts égales et que l'on en mange une, on écrit 1/4. Le numérateur désigne la part prise et le dénominateur le nombre de parts égales. On lit « un quart »."],
                ["Les quatre opérations", "L'addition augmente une quantité, la soustraction la diminue, la multiplication répète un groupe et la division le répartit également. On choisit l'opération selon la question et non selon les seuls chiffres. On vérifie toujours la réponse."],
                ["Formes et parties", "On peut représenter une fraction avec un cercle ou un rectangle divisé en parties égales. Il faut que les parties soient égales pour que la représentation soit juste. On colorie le nombre de parties demandé."],
                ["Les formes et la mesure", "Nous voyons le triangle, le carré et le cercle dans les portes, les fenêtres et les assiettes. Chaque forme a des propriétés qui la distinguent, comme le nombre de côtés et d'angles. Mesurer aide à connaître les longueurs et les surfaces."],
                ["Vérifier la solution", "Après avoir résolu un problème, nous relisons la question et nous vérifions l'unité de la réponse. Si possible, nous refaisons le calcul autrement. L'erreur est une occasion de mieux comprendre l'opération."]
              ],
              vocab: [
                ["nombre", "Un symbole utilisé pour compter des objets ou mesurer quelque chose."],
                ["valeur de position", "La valeur d'un chiffre selon sa place dans le nombre, comme les unités ou les dizaines."],
                ["division", "Une opération qui répartit une quantité en groupes égaux."],
                ["numérateur", "Le chiffre au-dessus de la barre de fraction ; il indique les parties prises."],
                ["côté", "La ligne droite qui forme un bord de la figure."],
                ["périmètre", "La distance autour d'une figure, égale à la somme de ses côtés."]
              ],
              examples: [
                ["Représente 3/4 en dessinant un cercle.", ["Je divise le cercle en 4 parties égales.", "Je colorie 3 de ces parties.", "La partie coloriée représente 3/4."], "Un cercle en quatre parts dont trois sont coloriées."],
                ["Dans une boîte de 6 crayons, tu en prends 2. Quelle fraction ?", ["Le tout est 6 crayons, donc le dénominateur est 6.", "La part prise est 2 crayons, donc le numérateur est 2.", "La fraction est 2/6."], "2/6"]
              ]
            },
            en: {
              t: "Fractions: A Part of a Whole",
              intro: "When we take a piece of a date pancake we take part of the whole. That part is called a fraction, and we will learn to read it.",
              sections: [
                ["Numbers around us", "We use numbers at the market to count dirhams, at school to count pupils and at home to measure things. Every number has a value and a place in order. Understanding numbers helps us plan the day."],
                ["How to write a fraction", "If we split a pancake into 4 equal parts and eat one, we write 1/4. The numerator shows the part taken and the denominator the number of equal parts. We read it as 'one quarter'."],
                ["The four operations", "Addition increases a quantity, subtraction decreases it, multiplication repeats a group and division shares it equally. We choose the operation from the question, not from the digits alone. We always check the answer."],
                ["Shapes and parts", "We can show a fraction with a circle or a rectangle divided into equal parts. The parts must be equal for the picture to be correct. We colour the number of parts required."],
                ["Shapes and measurement", "We see triangles, squares and circles in doors, windows and plates. Each shape has features that identify it, such as the number of sides and angles. Measuring helps us find lengths and areas."],
                ["Checking the solution", "After solving a problem we reread the question and check the unit of the answer. If possible we work it out another way. A mistake is a chance to understand the operation better."]
              ],
              vocab: [
                ["number", "A symbol used for counting objects or measuring things."],
                ["place value", "The value of a digit according to its place in a number, such as units or tens."],
                ["division", "An operation that shares a quantity into equal groups."],
                ["numerator", "The number above the fraction bar; it shows the parts taken."],
                ["side", "The straight line that forms an edge of a shape."],
                ["perimeter", "The distance around a shape, equal to the sum of its sides."]
              ],
              examples: [
                ["Show 3/4 by drawing a circle.", ["Divide the circle into 4 equal parts.", "Colour 3 of those parts.", "The coloured part shows 3/4."], "A circle in four parts with three coloured."],
                ["In a box of 6 pencils you take 2. What fraction is that?", ["The whole is 6 pencils, so the denominator is 6.", "The part taken is 2 pencils, so the numerator is 2.", "The fraction is 2/6."], "2/6"]
              ]
            }
          }
        },
        {
          t: "الأشكال والهندسة في حياتنا",
          intro: "الأبواب مستطيلة والنوافذ مربعة والساعة دائرية. لنكتشف عالم الأشكال من حولنا.",
          sections: [
            ["أسماء الأشكال", "للمربع أربعة أضلاع متساوية، وللمستطيل أربعة أضلاع متقابلة متساوية، وللمثلث ثلاثة أضلاع. الدائرة ليس لها أضلاع مستقيمة بل محيط منحني. نميّز الشكل بعدّ أضلاعه."],
            ["حساب المحيط", "محيط الشكل هو المسافة حوله، ونحسبه بجمع أضلاعه. مربع ضلعه 3 سم محيطه 3 + 3 + 3 + 3 = 12 سم. نكتب الوحدة دائما في الجواب."]
          ],
          examples: [
            ["احسب محيط مستطيل طوله 5 سم وعرضه 2 سم.", ["للمستطيل ضلعان طولهما 5 وضلعان طولهما 2.", "نجمع: 5 + 2 + 5 + 2.", "المحيط 14 سم."], "14 سم"],
            ["كم ضلعا للمثلث؟ وما محيطه إذا كان كل ضلع 4 سم؟", ["المثلث له 3 أضلاع.", "نجمع الأضلاع: 4 + 4 + 4.", "المحيط 12 سم."], "3 أضلاع، والمحيط 12 سم."]
          ],
          questions: [
            ["أي شكل له ثلاثة أضلاع؟", ["المربع", "المثلث", "الدائرة", "المستطيل"], 1, "المثلث هو الشكل المكوّن من ثلاثة أضلاع وثلاث زوايا."],
            ["ما محيط مربع ضلعه 6 سم؟", ["6 سم", "12 سم", "24 سم", "36 سم"], 2, "للمربع أربعة أضلاع متساوية، فالمحيط 6 × 4 = 24 سم."],
            ["أي شكل ليس له أضلاع مستقيمة؟", ["المثلث", "المستطيل", "الدائرة", "المربع"], 2, "حدّ الدائرة منحنٍ وليس خطوطا مستقيمة، بخلاف الأشكال الأخرى."],
            ["لماذا نكتب الوحدة في جواب المحيط؟", ["لزيادة عدد الأرمقام", "لأن المحيط طول ويحتاج وحدة قياس", "لأن الوحدة تغير الشكل", "لأن المعلّم يحب الكتابة"], 1, "المحيط كمية طولية، فتكتب قيمته مع السنتيمتر أو غيره من وحدات الطول."]
          ],
          tr: {
            fr: {
              t: "Les formes et la géométrie autour de nous",
              intro: "Les portes sont rectangulaires, les fenêtres sont carrées et la montre est ronde. Découvrons les formes qui nous entourent.",
              sections: [
                ["Les nombres autour de nous", "Nous utilisons les nombres au marché pour compter les dirhams, à l'école pour compter les élèves et à la maison pour mesurer des objets. Chaque nombre a une valeur et une place dans l'ordre. Comprendre les nombres aide à organiser la journée."],
                ["Les noms des formes", "Le carré a quatre côtés égaux, le rectangle a quatre côtés opposés égaux et le triangle en a trois. Le cercle n'a pas de côtés droits mais un pourtour courbe. On reconnaît une forme en comptant ses côtés."],
                ["Les quatre opérations", "L'addition augmente une quantité, la soustraction la diminue, la multiplication répète un groupe et la division le répartit également. On choisit l'opération selon la question et non selon les seuls chiffres. On vérifie toujours la réponse."],
                ["Calculer le périmètre", "Le périmètre est la distance tout autour d'une forme ; on le calcule en additionnant les côtés. Un carré de côté 3 cm a pour périmètre 3 + 3 + 3 + 3 = 12 cm. On écrit toujours l'unité dans la réponse."],
                ["Les formes et la mesure", "Nous voyons le triangle, le carré et le cercle dans les portes, les fenêtres et les assiettes. Chaque forme a des propriétés qui la distinguent, comme le nombre de côtés et d'angles. Mesurer aide à connaître les longueurs et les surfaces."],
                ["Vérifier la solution", "Après avoir résolu un problème, nous relisons la question et nous vérifions l'unité de la réponse. Si possible, nous refaisons le calcul autrement. L'erreur est une occasion de mieux comprendre l'opération."]
              ],
              vocab: [
                ["nombre", "Un symbole utilisé pour compter des objets ou mesurer quelque chose."],
                ["valeur de position", "La valeur d'un chiffre selon sa place dans le nombre, comme les unités ou les dizaines."],
                ["division", "Une opération qui répartit une quantité en groupes égaux."],
                ["numérateur", "Le chiffre au-dessus de la barre de fraction ; il indique les parties prises."],
                ["côté", "La ligne droite qui forme un bord de la figure."],
                ["périmètre", "La distance autour d'une figure, égale à la somme de ses côtés."]
              ],
              examples: [
                ["Calcule le périmètre d'un rectangle de 5 cm de long et 2 cm de large.", ["Le rectangle a deux côtés de 5 cm et deux côtés de 2 cm.", "J'additionne : 5 + 2 + 5 + 2.", "Le périmètre est 14 cm."], "14 cm"],
                ["Combien un triangle a-t-il de côtés, et quel est son périmètre si chaque côté mesure 4 cm ?", ["Le triangle a 3 côtés.", "J'additionne les côtés : 4 + 4 + 4.", "Le périmètre est 12 cm."], "3 côtés et un périmètre de 12 cm."]
              ]
            },
            en: {
              t: "Shapes and Geometry Around Us",
              intro: "Doors are rectangles, windows are squares and a watch is round. Let us discover the shapes around us.",
              sections: [
                ["Numbers around us", "We use numbers at the market to count dirhams, at school to count pupils and at home to measure things. Every number has a value and a place in order. Understanding numbers helps us plan the day."],
                ["Names of shapes", "A square has four equal sides, a rectangle has four opposite equal sides and a triangle has three. A circle has no straight sides but a curved edge. We identify a shape by counting its sides."],
                ["The four operations", "Addition increases a quantity, subtraction decreases it, multiplication repeats a group and division shares it equally. We choose the operation from the question, not from the digits alone. We always check the answer."],
                ["Finding the perimeter", "The perimeter is the distance all around a shape; we find it by adding the sides. A square with a side of 3 cm has a perimeter of 3 + 3 + 3 + 3 = 12 cm. We always write the unit in the answer."],
                ["Shapes and measurement", "We see triangles, squares and circles in doors, windows and plates. Each shape has features that identify it, such as the number of sides and angles. Measuring helps us find lengths and areas."],
                ["Checking the solution", "After solving a problem we reread the question and check the unit of the answer. If possible we work it out another way. A mistake is a chance to understand the operation better."]
              ],
              vocab: [
                ["number", "A symbol used for counting objects or measuring things."],
                ["place value", "The value of a digit according to its place in a number, such as units or tens."],
                ["division", "An operation that shares a quantity into equal groups."],
                ["numerator", "The number above the fraction bar; it shows the parts taken."],
                ["side", "The straight line that forms an edge of a shape."],
                ["perimeter", "The distance around a shape, equal to the sum of its sides."]
              ],
              examples: [
                ["Find the perimeter of a rectangle 5 cm long and 2 cm wide.", ["The rectangle has two sides of 5 cm and two of 2 cm.", "Add them: 5 + 2 + 5 + 2.", "The perimeter is 14 cm."], "14 cm"],
                ["How many sides has a triangle, and what is its perimeter if each side is 4 cm?", ["A triangle has 3 sides.", "Add the sides: 4 + 4 + 4.", "The perimeter is 12 cm."], "3 sides and a perimeter of 12 cm."]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p4_sub_fr": {
      shared: {
        sections: [
          ["Lire un texte", "Un texte est un ensemble de phrases qui racontent quelque chose ou expliquent une idée. Nous lisons lentement en respectant la ponctuation. Une bonne lecture aide à comprendre le sens."],
          ["Chercher l'information", "Pour répondre à une question, nous revenons au texte et nous cherchons la phrase qui contient la réponse. Nous soulignons les mots importants. Nous distinguons ce qui est écrit de ce que nous devinons."],
          ["Écrire une phrase", "Une phrase commence par une majuscule et se termine par un point. Elle contient généralement un sujet et un verbe. Les mots sont séparés par des espaces."],
          ["Vérifier son travail", "Après avoir écrit, nous relisons à voix basse. Nous vérifions les accents, la ponctuation et l'ordre des mots. Une relecture améliore toujours le texte."]
        ],
        vocab: [
          ["texte", "Un ensemble de phrases qui forment un sens complet."],
          ["phrase", "Un ensemble de mots qui exprime une idée et se termine par un point."],
          ["sujet", "La personne ou la chose dont parle la phrase."],
          ["verbe", "Le mot qui exprime l'action ou l'état."],
          ["ponctuation", "Les signes comme le point et la virgule qui organisent la lecture."],
          ["majuscule", "Une grande lettre utilisée au début d'une phrase."]
        ],
        outcomes: [
          "Les élèves lisent un court texte avec une prononciation claire.",
          "Les élèves repèrent une information explicite dans un texte.",
          "Les élèves écrivent une phrase correcte avec une majuscule et un point.",
          "Les élèves relisent leur production et corrigent une erreur simple."
        ],
        diagram: "diagram-french-alphabet.svg"
      },
      lessons: [
        {
          t: "Lire un court texte",
          intro: "Aujourd'hui, nous lisons un petit texte sur une sortie à la plage. Nous allons préparer notre voix avant de commencer.",
          sections: [
            ["Préparer la lecture", "Avant de lire, nous regardons le titre et les images. Nous repérons les mots difficiles et nous les prononçons deux fois. Lire d'abord avec les yeux puis avec la voix rend la lecture plus sûre."],
            ["Respecter la ponctuation", "Nous marquons une courte pause à la virgule et une pause plus longue au point. Le point d'interrogation demande une voix qui monte. Ces signes guident le lecteur."]
          ],
          examples: [
            ["Lis : « Karim va au marché avec sa mère. »", ["Regarde le titre et les mots connus.", "Prononce chaque mot clairement.", "Fais une pause au point final."], "Karim va au marché avec sa mère."],
            ["Lis : « Est-ce que tu aimes les dattes ? »", ["Repère le point d'interrogation.", "Commence par « Est-ce que ».", "Monte légèrement la voix à la fin."], "Est-ce que tu aimes les dattes ?"]
          ],
          questions: [
            ["Que faut-il faire avant de lire un texte ?", ["Regarder le titre et les images", "Fermer les yeux", "Écrire un autre texte", "Compter les pages"], 0, "Le titre et les images préparent l'esprit au sujet et rendent la lecture plus facile."],
            ["Quand faisons-nous une pause plus longue ?", ["À la virgule", "Au point", "Après chaque mot", "Au début"], 1, "Le point marque la fin d'une phrase, donc la pause est plus longue qu'à la virgule."],
            ["Comment se lit une question ?", ["Avec une voix qui monte à la fin", "Très vite sans pause", "Toujours à voix basse", "Sans regarder le texte"], 0, "La voix qui monte à la fin indique que la phrase demande une réponse."],
            ["Quel signe termine une phrase qui raconte ?", ["Le point d'interrogation", "Le point", "La virgule", "Le deux-points"], 1, "Une phrase déclarative se termine par un point."]
          ]
        },
        {
          t: "Comprendre ce que l'on lit",
          intro: "Lire, ce n'est pas seulement prononcer des mots. Il faut aussi comprendre ce que l'auteur veut dire.",
          sections: [
            ["Répondre avec le texte", "Quand une question porte sur un détail, nous cherchons le mot ou la phrase exacte dans le texte. Nous copions la réponse avec soin. Nous n'inventons pas ce qui n'est pas écrit."],
            ["Dire l'idée principale", "Après la lecture, nous expliquons en une phrase de quoi parle le texte. Cette phrase est l'idée principale. Les autres phrases donnent des exemples ou des précisions."]
          ],
          examples: [
            ["Texte : « Salma porte un sac bleu. Elle va à l'école. » De quelle couleur est le sac ?", ["Je cherche le mot qui parle du sac.", "Je trouve « un sac bleu ».", "Je réponds : le sac est bleu."], "Le sac est bleu."],
            ["Quelle est l'idée principale de ce texte ?", ["Je me demande qui est concerné.", "Les deux phrases parlent de Salma.", "Je résume : Salma va à l'école avec son sac."], "Salma va à l'école avec son sac bleu."]
          ],
          questions: [
            ["Où chercher la réponse à une question sur le texte ?", ["Dans le texte lui-même", "Dans un autre livre", "Dans la mémoire seulement", "Dans le titre seul"], 0, "Une réponse fidèle vient des mots du texte, pas d'une supposition."],
            ["Qu'est-ce que l'idée principale ?", ["Un mot difficile", "La phrase qui résume le sujet", "Le dernier mot du texte", "Le nom de l'auteur"], 1, "L'idée principale dit en peu de mots de quoi parle tout le texte."],
            ["Dans « Karim mange une pomme rouge », que mange Karim ?", ["Une pomme", "Rouge", "Karim", "Une école"], 0, "Le complément de l'action est « une pomme » ; « rouge » est seulement une description."],
            ["Faut-il inventer une réponse si le texte ne la donne pas ?", ["Oui, toujours", "Non, il faut chercher ou dire qu'on ne sait pas", "Oui, pour être original", "Non, il faut fermer le livre"], 1, "Rester fidèle au texte est une règle de compréhension ; on peut aussi dire que l'information manque."]
          ]
        },
        {
          t: "S'exprimer à l'écrit",
          intro: "Nous allons écrire quelques phrases sur notre famille. Nous apprendrons à les ordonner et à les relier.",
          sections: [
            ["Construire une phrase", "Une phrase comprend un sujet qui fait l'action et un verbe qui dit l'action. Nous ajoutons un complément pour donner plus d'information. Nous commençons par une majuscule et finissons par un point."],
            ["Relier deux phrases", "Les mots « et », « puis » et « mais » relient les phrases. Ils montrent l'ordre des actions ou une opposition. Une petite phrase claire vaut mieux qu'une longue phrase confuse."]
          ],
          examples: [
            ["Écris une phrase sur ton père.", ["Choisis le sujet : « Mon père ».", "Ajoute le verbe : « travaille ».", "Complète : « Mon père travaille au marché. »"], "Mon père travaille au marché."],
            ["Relie ces deux idées : « Je lis. Je joue. »", ["Garde la première phrase.", "Ajoute le mot de liaison « puis ».", "Écris : « Je lis, puis je joue. »"], "Je lis, puis je joue."]
          ],
          questions: [
            ["Quel signe commence une phrase ?", ["Une majuscule", "Une minuscule", "Un point", "Une virgule"], 0, "En français, la première lettre d'une phrase est une majuscule."],
            ["Quel mot relie deux actions qui se suivent ?", ["puis", "mais", "parce que", "sans"], 0, "« Puis » indique une action qui vient après une autre."],
            ["Que manque-t-il dans « le chat dort » ?", ["La majuscule au début", "Un verbe", "Un complément obligatoire", "Une virgule"], 0, "La phrase a déjà un sujet et un verbe, mais elle doit commencer par une majuscule et finir par un point."],
            ["Pourquoi écrire des phrases courtes ?", ["Pour être plus clair", "Pour éviter les majuscules", "Pour ne pas mettre de point", "Pour écrire moins de mots intéressants"], 0, "Les phrases courtes rendent l'idée plus claire et plus facile à lire."]
          ]
        },
        {
          t: "La grammaire au service de la phrase",
          intro: "La grammaire explique comment les mots fonctionnent ensemble. Elle nous aide à écrire des phrases correctes.",
          sections: [
            ["Le nom et l'article", "Le nom désigne une personne, un lieu ou une chose : école, crayon, Karim. L'article « le », « la » ou « un » accompagne le nom. On dit « un crayon » et « la maison »."],
            ["Le verbe et l'accord", "Le verbe indique l'action : manger, courir, écrire. Il change selon la personne : « je mange » et « il mange ». Vérifier l'accord rend la phrase plus correcte."]
          ],
          examples: [
            ["Choisis le bon article : « ... école est grande. »", ["Le nom est « école ».", "« École » est un nom féminin.", "On écrit : « L'école est grande. »"], "L'école est grande."],
            ["Accorde le verbe : « Nous ... au jardin. »", ["Le sujet est « nous ».", "Le verbe est « aller ».", "On écrit : « Nous allons au jardin. »"], "Nous allons au jardin."]
          ],
          questions: [
            ["Quel est un nom dans cette liste ?", ["crayon", "vite", "bleu", "puis"], 0, "« Crayon » désigne un objet, donc c'est un nom ; les autres sont des mots de liaison ou des adjectifs."],
            ["Quel mot accompagne le nom « maison » ?", ["la", "je", "très", "hier"], 0, "« La » est un article qui convient au nom féminin « maison »."],
            ["Quel est le verbe dans « Salma lit un livre » ?", ["lit", "Salma", "livre", "un"], 0, "« Lit » exprime l'action faite par Salma, donc c'est le verbe."],
            ["Pourquoi vérifier l'accord du verbe ?", ["Pour que la phrase soit correcte", "Pour ajouter une image", "Pour changer le sujet", "Pour raccourcir le texte"], 0, "L'accord entre le sujet et le verbe est une règle qui rend la phrase correcte en français."]
          ]
        }
      ]
    },
    "cur_l_p4_sub_art": {
      shared: {
        sections: [
          ["الفن في حياتنا", "الفن وسيلة للتعبير عن الأفكار والمشاعر بالرسم واللون والصوت والحركة. يساعدنا على ملاحظة العالم بعين جديدة. لكل فنان أسلوبه الخاص."],
          ["الملاحظة والتصميم", "نبدأ بملاحظة التفاصيل: الضوء والظل والشكل والحركة. ثم نختار ما نبرزه في العمل. التصميم الجيد يوصل الفكرة بوضوح."],
          ["المواد والتقنيات", "نستعمل الأقلام والفرشاة والصلصال والآلات الموسيقية حسب نوع العمل. لكل مادة طريقة استخدام تناسبها. نحافظ على الأدوات ونرتّبها بعد العمل."],
          ["التذوّق والنقد اللطيف", "ننظر إلى عملنا وعمل غيرنا ونذكر ما أعجبنا وسبب إعجابنا. النقد اللطيف يساعد صاحبه على التطور. لا يوجد عمل فني بلا قيمة إذا بُني على ملاحظة صادقة."]
        ],
        vocab: [
          ["تصميم", "ترتيب عناصر العمل الفني بطريقة تعبّر عن فكرة."],
          ["تدرّج لوني", "انتقال تدريجي من لون فاتح إلى لون داكن."],
          ["تناسب", "علاقة متوازنة بين أجزاء العمل الفني."],
          ["أداء", "تقديم عرض مسرحي أو موسيقي أمام الجمهور."],
          ["تذوّق", "النظر إلى عمل فني وفهم ما يحمله من معنى."],
          ["فرشاة", "أداة ذات شعر تُستخدم للتلوين."]
        ],
        outcomes: [
          "يصمّم عملا فنيا يعبّر عن فكرة بسيطة.",
          "يستخدم تدرّجا لونيا في تلوين شكل.",
          "يؤدّي إيقاعا أو مشهدا قصيرا بثقة.",
          "يعلّق على عمل فني بجملة تذكر سببا."
        ],
        diagram: "diagram-colors.svg"
      },
      lessons: [
        {
          t: "الرسم وتصوير المحيط",
          intro: "الرسم الفني ليس نسخا فقط، بل اختيار ما نريد إبرازه من المشهد. لنرسم سوقا صغيرا من ذاكرتنا.",
          sections: [
            ["اختيار المشهد", "نختار زاوية من السوق: بائع التفاح، أو باب المدرسة، أو شجرة الحديقة. نقرّر ما هو الأهم في المشهد ونبدأ به. بقية التفاصيل تأتي بعد ذلك."],
            ["الضوء والظل", "نلاحظ من أين يأتي الضوء فنضع الظل في الجهة المقابلة. الظل يعطي الشكل عمقا ويجعله أقرب إلى الواقع. نستخدم خطوطا خفيفة للظل أولا."]
          ],
          examples: [
            ["ارسم بائع تفاح في السوق.", ["ارسم طاولة صغيرة في الوسط.", "أضف أشكال التفاح فوقها.", "ارسم البائع خلف الطاولة وظلّه خلفه."], "بائع خلف طاولة عليها تفاح وظل خلفه."],
            ["أظهر الضوء في رسم كوب.", ["حدّد جهة الضوء من اليسار.", "اترك الجانب الأيسر فاتحا.", "لوّن الجانب الأيمن بلون أغمق قليلا."], "جانب فاتح وجانب أغمق يدلّان على الضوء."]
          ],
          questions: [
            ["ماذا يعني اختيار المشهد في الرسم؟", ["رسم كل شيء دون تفريق", "تحديد الجزء الأهم لنبرزه", "استخدام لون واحد", "حذف كل التفاصيل"], 1, "الفنان يختار ما يخدم فكرته، وليس عليه تصوير كل ما يراه."],
            ["كيف نجعل الشكل ثلاثي الأبعاد؟", ["بإضافة ظل مناسب", "بكتابة اسمه", "برسم خطوط متقاطعة فقط", "بتكرار نفس اللون"], 0, "الظل يوحي بالعمق ويجعل الشكل يبدو مجسّما."],
            ["من أين يأتي الظل في الرسم؟", ["من جهة الضوء", "من الجهة المعاكسة للضوء", "من تحت الورقة فقط", "من لون القلم"], 1, "الظل يقع في الجهة التي لا يصلها الضوء."],
            ["لماذا نرسم خطوط الظل خفيفة أولا؟", ["لأنها غير مهمة", "لأننا نحتاج تعديلها بسهولة", "لأنها تختفي وحدها", "لأن القلم كبير"], 1, "الخط الخفيف يسمح بتصحيحه أو تعميقه بعد أن يتضح الرسم."]
          ]
        },
        {
          t: "التلوين وتناسق الألوان",
          intro: "الألوان المتناسقة تجعل العمل مريحا للعين. سنتعلم كيف نختار الألوان وندرّجها.",
          sections: [
            ["الألوان المتناسقة", "نختار ألوانا متقاربة أو متكاملة بحسب المعنى الذي نريده. الأخضر مع الأصفر يوحي بالطبيعة، والأزرق مع الأبيض يوحي بالسماء. كثرة الألوان دون ترتيب تشتّت النظر."],
            ["التدرّج اللوني", "التدرّج هو انتقال من اللون الفاتح إلى الداكن تدريجيا. نحصل عليه بزيادة كمية اللون أو مزجه بخطوات متقاربة. التدرّج يعطي العمل مظهرا غنيا."]
          ],
          examples: [
            ["لوّن سماء تبدأ بالأزرق الفاتح وتنتهي بالأزرق الداكن.", ["ابدأ بالأزرق الفاتح فوق.", "أضف درجة أغمق في الوسط.", "أنه بالأزرق الداكن أسفل."], "تدرّج من الأزرق الفاتح إلى الداكن."],
            ["اختر ألوانا لرسم بستان في الربيع.", ["الأخضر للأعشاب والأوراق.", "الأصفر والوردي للزهور.", "الأزرق الفاتح للسماء."], "أخضر وأصفر ووردي وأزرق فاتح."]
          ],
          questions: [
            ["ما التدرّج اللوني؟", ["لون واحد فقط", "انتقال تدريجي بين درجات لون", "خلط كل الألوان معا", "رسم بلا ألوان"], 1, "التدرّج يعني المرور من درجة فاتحة إلى أغمق بخطوات متقاربة."],
            ["أي مجموعة ألوان توحي بالطبيعة؟", ["أخضر وأصفر", "أحمر وأسود فقط", "رمادي وأبيض فقط", "بنفسجي وبرتقالي"], 0, "الأخضر والأصفر يذكران بالأوراق والشمس في البستان."],
            ["لماذا لا نكثر الألوان بلا ترتيب؟", ["لأنها ممنوعة", "لأنها تشتّت نظر المشاهد", "لأنها تكلف أكثر", "لأن الورق صغير"], 1, "ترتيب الألوان يساعد العين على قراءة العمل، وكثرتها عشوائيا تربكها."],
            ["كيف نحصل على درجة أغمق؟", ["بزيادة كمية اللون أو مزجه تدريجيا", "بإضافة الماء دائما", "بمسح الورق", "بتغيير الشكل"], 0, "تكثيف اللون أو مزجه بخطوات قليلة يعطي درجات أغمق."]
          ]
        },
        {
          t: "الموسيقى والإيقاع المغربي",
          intro: "للموسيقى المغربية إيقاعات مميزة نسمعها في الأعراس والاحتفالات. سنتعرف عليها ونقلّدها.",
          sections: [
            ["إيقاعات من بلدنا", "نسمع في المغرب إيقاع الدف والطبل والتار، ولكل واحد طابعه. الإيقاع المتكرر يساعد الراقصين على التنسيق. نستمع إلى مقطع قصير ونحاول وصفه."],
            ["العزف الجماعي", "في العزف الجماعي يستمع كل عازف إلى الآخرين حتى يبقى الإيقاع موحّدا. البداية الهادئة ثم التدرّج في القوة تجعل الأداء جميلا. نحترم دور كل عازف."]
          ],
          examples: [
            ["قلّد إيقاعا مكوّنا من ضربتين خفيفتين وواحدة قوية.", ["استمع إلى النمط مرتين.", "صفّق مرتين بخفوت.", "أضف صفقة قوية وكرّر النمط."], "خفيفة، خفيفة، قوية."],
            ["اصنع آلة بسيطة من كوب وأرز.", ["ضع كمية صغيرة من الأرز في الكوب.", "أغلق الكوب وأمسكه جيدا.", "هزّه بلطف لتسمع صوتا إيقاعيا."], "الكوب والأرز آلة إيقاع بسيطة."]
          ],
          questions: [
            ["ما أهم شرط في العزف الجماعي؟", ["الاستماع إلى الآخرين", "العزف بصوت عال دائما", "تجاهل الإيقاع", "تغيير الآلة باستمرار"], 0, "الاستماع المتبادل يحافظ على وحدة الإيقاع بين العازفين."],
            ["كيف نجعل الأداء متدرّجا في القوة؟", ["نبدأ هادئين ثم نزيد القوة", "نبدأ بأعلى صوت", "نوقف الصوت فجأة", "نعزف بسرعات مختلفة بلا نظام"], 0, "الزيادة التدريجية تعطي الأداء شكلا جميلا ومنظّما."],
            ["أي آلة مغربية تُستعمل في الإيقاع؟", ["الطبل", "الفرشاة", "الممحاة", "الدفتر"], 0, "الطبل من الآلات الإيقاعية المعروفة في المغرب."],
            ["ماذا يفيد تكرار الإيقاع؟", ["يساعد الراقصين على التنسيق", "يمنع الموسيقى", "يغيّر اسم الآلة", "يوقف العزف"], 0, "التكرار المنتظم يعطي إشارة واضحة للراقصين وللعازفين."]
          ]
        },
        {
          t: "المسرح والتعبير بالجسد",
          intro: "في المسرح نروي قصة بالكلام والحركة. سنتدرب على أداء مشهد قصير أمام الفصل.",
          sections: [
            ["بناء الشخصية", "نختار شخصية بسيطة ونقرّر كيف تتكلم وتمشي وتردّ. صوت هادئ أو سريع يعطي انطباعا مختلفا. الحركات الصغيرة مثل رفع الحاجب تعبّر عن المشاعر."],
            ["أداء المشهد", "نقف مستقيمين وننظر إلى الجمهور ونقول الجمل بوضوح. إذا نسينا كلمة نستمر بهدوء بدل التوقف. في النهاية ننحني قليلا ونشكر المشاهدين."]
          ],
          examples: [
            ["أدّ مشهد طفل يبحث عن كلبه.", ["ابدأ بنداء: « يا كلب، أين أنت؟ »", "تحرّك بين الأشياء وأنت تنظر.", "أظهر الفرح حين تجده بابتسامة."], "مشهد بحث ينتهي بالفرح."],
            ["عبّر عن الغضب دون صراخ.", ["اجمع حاجبيك.", "اجعل صوتك منخفضا وحازما.", "اشدّ يديك بلطف ثم أرخهما."], "غضب هادئ واضح في الوجه والصوت."]
          ],
          questions: [
            ["كيف نبني شخصية مسرحية؟", ["نحدّد طريقة كلامها وحركاتها", "نختار الملابس فقط", "ننسى النص", "نقف بلا حركة"], 0, "الشخصية تتحدد بأسلوب كلامها وحركاتها لا بمظهرها فقط."],
            ["ماذا نفعل إذا نسينا كلمة أثناء العرض؟", ["نتوقف تماما", "نستمر بهدوء ونكمل المعنى", "نضحك بصوت عال", "نلوم الجمهور"], 1, "الاستمرار الهادئ يحفظ إيقاع المشهد ويخفّف التوتر."],
            ["لماذا ننظر إلى الجمهور؟", ["لإيصال المعنى وبناء التواصل", "لأن المكان مظلم", "لأن النص قصير", "لأن الجمهور يكتب"], 0, "النظر إلى الجمهور يجعل الأداء موجّها إليه ويزيد وضوح الرسالة."],
            ["أي حركة تعبّر عن الفرح؟", ["الابتسامة ورفع الكفّين", "خفض الرأس ببطء", "إغلاق العينين فقط", "الوقوف بلا تعبير"], 0, "الابتسامة ورفع الكفّين من العلامات البسيطة للفرح على المسرح."]
          ]
        }
      ]
    },
    "cur_l_p5_sub_sci": {
      shared: {
        sections: [
          ["العلم وطريقته", "العلم دراسة منظّمة للطبيعة تعتمد على الملاحظة والتجربة والدليل. لا نكتفي بالرأي، بل نطلب الدليل الذي يدعمه. المعرفة العلمية تتطوّر باكتشافات جديدة."],
          ["القياس والأدوات", "نستعمل أدوات مثل المسطرة والميزان والترمومتر لقياس الطول والكتلة والحرارة. القياس يجعل وصف الأشياء دقيقا ومقارنتها ممكنة. لكل أداة وحدة قياس مناسبة."],
          ["تفسير الظواهر", "الظاهرة هي ما يحدث حولنا مثل ذوبان الثلج أو نمو النبتة. نفسّرها بالبحث عن الأسباب والشروط التي تجعلها تحدث. التفسير الجيد يمكن اختباره."],
          ["الأمان في المختبر", "نرتدي النظارات الواقية ونضع المواد في أماكنها ونشمّ الروائح بحذر. لا نذوق أي مادة في المختبر. ننظّف الأدوات ونغسل اليدين بعد التجربة."]
        ],
        vocab: [
          ["ظاهرة", "حدث يمكن ملاحظته وقياسه في الطبيعة."],
          ["قياس", "تحديد كمية شيء بوحدة مناسبة وأداة مناسبة."],
          ["مادة", "كل ما يشغل حيزا وله كتلة، مثل الماء والهواء والحديد."],
          ["تغيّر", "انتقال مادة من حالة إلى أخرى أو تحوّلها إلى مادة جديدة."],
          ["دليل", "ملاحظة أو نتيجة تجربة تدعم فكرة أو تفسيرا."],
          ["كائن حي", "مادة تنمو وتتكاثر وتستجيب لمحيطها."]
        ],
        outcomes: [
          "يميّز حالات المادة ويصف خصائصها.",
          "يفرق بين التغيّر الفيزيائي والتغيّر الكيميائي بأمثلة.",
          "يصف وظائف الأعضاء الأساسية في الكائنات الحية.",
          "يطبّق خطوات المنهج العلمي في تجربة بسيطة."
        ],
        outcomeTr: {
          fr: [
            "Distinguer les états de la matière et décrire leurs propriétés.",
            "Distinguer les changements physiques des changements chimiques à l'aide d'exemples.",
            "Décrire les fonctions des organes essentiels chez les êtres vivants.",
            "Appliquer les étapes de la méthode scientifique lors d'une expérience simple."
          ],
          en: [
            "Distinguish the states of matter and describe their properties.",
            "Differentiate between physical and chemical changes using examples.",
            "Describe the functions of basic organs in living things.",
            "Apply the steps of the scientific method in a simple experiment."
          ]
        },
        diagram: "diagram-states-of-matter.svg"
      },
      lessons: [
        {
          t: "الفيزياء: المادة وحالاتها",
          intro: "الماء نراه سائلا، وإذا برّدناه صار ثلجا، وإذا سخّناه صار بخارا. هذه حالات المادة.",
          sections: [
            ["حالات المادة الثلاث", "المادة الصلبة تحتفظ بشكلها وحجمها مثل الحجر، والسائلة تأخذ شكل الإناء وحجما ثابتا، والغازية تنتشر وتأخذ شكل الإناء وحجمه. نلاحظ ذلك في الماء والهواء."],
            ["الحرارة وتغيّر الحالة", "عند تسخين الثلج يذوب فيصير ماءً سائلا، وعند غليان الماء يتصاعد بخارا. التبريد يعيد البخار إلى سائل والسائل إلى صلب. الحرارة هي التي تسبّب هذه التغيّرات."]
          ],
          examples: [
            ["صنّف: حجر، ماء، هواء بحسب حالة المادة.", ["الحجر صلب لأنه يحتفظ بشكله.", "الماء سائل لأنه يأخذ شكل الإناء.", "الهواء غاز لأنه ينتشر في المكان."], "حجر صلب، ماء سائل، هواء غاز."],
            ["ماذا يحدث للثلج إذا تركته في الشمس؟", ["تصل حرارة الشمس إلى الثلج.", "ترتفع درجة حرارته.", "يذوب ويتحوّل إلى ماء سائل."], "يذوب الثلج ويتحوّل إلى ماء."]
          ],
          questions: [
            ["أي مادة تحتفظ بشكلها وحجمها؟", ["الماء", "الهواء", "الحجر", "البخار"], 2, "المادة الصلبة مثل الحجر تحتفظ بشكلها وحجمها، بخلاف السوائل والغازات."],
            ["ما الذي يسبّب ذوبان الثلج؟", ["البرودة", "الحرارة", "الظلام", "الضغط فقط"], 1, "امتصاص الثلج للحرارة يرفع درجة حرارته فيذوب."],
            ["أي وصف للغاز صحيح؟", ["له شكل ثابت", "يأخذ شكل الإناء وحجمه", "لا يشغل حيزا", "لا يمكن رؤيته أبدا"], 1, "الغاز ينتشر فيمتلئ الإناء الذي يحويه، فيأخذ شكله وحجمه."],
            ["ما أداة قياس حرارة الماء؟", ["المسطرة", "الميزان", "الترمومتر", "الساعة"], 2, "الترمومتر مخصّص لقياس درجة الحرارة، أما المسطرة فللطول والميزان للكتلة."]
          ],
          tr: {
            fr: {
              t: "La physique : la matière et ses états",
              intro: "L'eau est liquide, mais si nous la refroidissons elle devient glace et si nous la chauffons elle devient vapeur. Voici les états de la matière.",
              sections: [
                ["La science et sa méthode", "La science est l'étude organisée de la nature : elle repose sur l'observation, l'expérience et la preuve. Une opinion ne suffit pas ; nous demandons la preuve qui la soutient. Le savoir scientifique évolue grâce à de nouvelles découvertes."],
                ["Les trois états de la matière", "La matière solide garde sa forme et son volume comme la pierre ; la matière liquide prend la forme du récipient avec un volume fixe ; la matière gazeuse se répand et occupe tout l'espace. Nous l'observons avec l'eau et l'air."],
                ["Mesurer et utiliser des outils", "Nous utilisons des outils comme la règle, la balance et le thermomètre pour mesurer la longueur, la masse et la chaleur. Mesurer rend la description précise et la comparaison possible. Chaque outil a une unité de mesure adaptée."],
                ["La chaleur et le changement d'état", "En chauffant la glace, elle fond et devient de l'eau liquide ; en faisant bouillir l'eau, elle se transforme en vapeur. Le refroidissement ramène la vapeur à l'état liquide puis le liquide à l'état solide. La chaleur provoque ces changements."],
                ["Expliquer les phénomènes", "Un phénomène est ce qui se produit autour de nous, comme la fonte de la glace ou la croissance d'une plante. Nous l'expliquons en cherchant les causes et les conditions qui le produisent. Une bonne explication peut être testée."],
                ["La sécurité au laboratoire", "Nous portons des lunettes de protection, nous rangeons les produits et nous sentons les odeurs avec prudence. Nous ne goûtons jamais une substance au laboratoire. Après l'expérience, nous nettoyons le matériel et nous nous lavons les mains."]
              ],
              vocab: [
                ["phénomène", "Un événement que l'on peut observer et mesurer dans la nature."],
                ["mesure", "Déterminer la quantité d'une chose avec une unité et un outil adaptés."],
                ["matière", "Tout ce qui occupe un espace et a une masse, comme l'eau, l'air et le fer."],
                ["changement", "Le passage d'une matière d'un état à un autre ou sa transformation en une matière nouvelle."],
                ["preuve", "Une observation ou un résultat d'expérience qui soutient une idée ou une explication."],
                ["être vivant", "Une matière qui grandit, se reproduit et réagit à son environnement."]
              ],
              examples: [
                ["Classe : pierre, eau, air selon l'état de la matière.", ["La pierre est solide car elle garde sa forme.", "L'eau est liquide car elle prend la forme du récipient.", "L'air est gazeux car il se répand dans l'espace."], "Pierre solide, eau liquide, air gazeux."],
                ["Que se passe-t-il si l'on laisse de la glace au soleil ?", ["La chaleur du soleil atteint la glace.", "Sa température augmente.", "Elle fond et devient de l'eau liquide."], "La glace fond et se change en eau."]
              ]
            },
            en: {
              t: "Physics: Matter and Its States",
              intro: "Water is liquid, but when we cool it it becomes ice and when we heat it it becomes steam. These are the states of matter.",
              sections: [
                ["Science and its method", "Science is the organised study of nature: it relies on observation, experiment and evidence. An opinion is not enough; we ask for evidence to support it. Scientific knowledge grows through new discoveries."],
                ["The three states of matter", "Solid matter keeps its shape and volume like a stone; liquid matter takes the shape of its container with a fixed volume; gaseous matter spreads out and takes both the shape and volume of the container. We see this with water and air."],
                ["Measuring and using tools", "We use tools such as a ruler, a balance and a thermometer to measure length, mass and heat. Measuring makes descriptions precise and comparisons possible. Each tool has a suitable unit."],
                ["Heat and change of state", "When ice is heated it melts into liquid water, and when water boils it turns to steam. Cooling brings steam back to liquid and liquid back to solid. Heat causes these changes."],
                ["Explaining phenomena", "A phenomenon is something that happens around us, such as ice melting or a plant growing. We explain it by looking for the causes and conditions that produce it. A good explanation can be tested."],
                ["Safety in the laboratory", "We wear safety glasses, keep materials in their places and smell odours carefully. We never taste any substance in the laboratory. After the experiment we clean the equipment and wash our hands."]
              ],
              vocab: [
                ["phenomenon", "An event that can be observed and measured in nature."],
                ["measurement", "Finding the quantity of something using a suitable unit and tool."],
                ["matter", "Anything that takes up space and has mass, such as water, air and iron."],
                ["change", "The move of matter from one state to another or its transformation into a new substance."],
                ["evidence", "An observation or experiment result that supports an idea or explanation."],
                ["living thing", "Matter that grows, reproduces and responds to its surroundings."]
              ],
              examples: [
                ["Classify stone, water and air by state of matter.", ["Stone is solid because it keeps its shape.", "Water is liquid because it takes the shape of the container.", "Air is gaseous because it spreads through the space."], "Stone solid, water liquid, air gaseous."],
                ["What happens if you leave ice in the sun?", ["The sun's heat reaches the ice.", "Its temperature rises.", "It melts and turns into liquid water."], "The ice melts and becomes water."]
              ]
            }
          }
        },
        {
          t: "الكيمياء: التغيّرات في المواد",
          intro: "حين يحترق الخشب يتحوّل إلى رماد ودخان. هذا تغيّر كيميائي، وسنتعلم التمييز بين أنواع التغيّر.",
          sections: [
            ["تغيّر في الشكل فقط", "إذا كسرنا زجاجة أو ذوّبنا السكر في الماء، تتغيّر الهيئة لكن المادة تبقى هي هي. نسمّي هذا تغيّرا فيزيائيا. يمكن غالبا استرجاع الحالة الأصلية."],
            ["تغيّر في المادة نفسها", "احتراق الورق أو صدأ الحديد ينتج مادة جديدة لا تشبه الأصلية. هذا تغيّر كيميائي يرافقه غالبا تغيّر في اللون أو الرائحة أو الحرارة. لا نستطيع استرجاع المادة الأصلية بسهولة."]
          ],
          examples: [
            ["صنّف: تقطيع التفاحة، احتراقها.", ["تقطيع التفاحة يغيّر الشكل فقط.", "القطع تبقى تفاحة يمكن أكلها.", "الاحتراق ينتج رمادا ودخانا ومادة جديدة."], "التقطيع تغيّر فيزيائي، والاحتراق تغيّر كيميائي."],
            ["لماذا يعدّ صدأ الحديد تغيّرا كيميائيا؟", ["يتغيّر لون الحديد إلى بني.", "تظهر مادة الصدأ الجديدة.", "لا يعود الحديد كما كان دون معالجة."], "لأنه ينتج مادة جديدة مختلفة عن الحديد الأصلي."]
          ],
          questions: [
            ["أي تغيّر يعطي مادة جديدة؟", ["ذوبان الملح في الماء", "كسر قلم", "احتراق الخشب", "تسخين الماء"], 2, "الاحتراق ينتج رمادا وغازات، أي مواد جديدة، بخلاف باقي الأمثلة."],
            ["ما الفرق بين التغيّرين الفيزيائي والكيميائي؟", ["الأول يغيّر الشكل والثاني ينتج مادة جديدة", "كلاهما ينتج مادة جديدة", "لا فرق بينهما", "الأول ينتج مادة والثاني يغيّر الشكل"], 0, "المعيار هو ظهور مادة جديدة من عدمه."],
            ["أي علامة قد تدل على تغيّر كيميائي؟", ["تغيّر في الرائحة", "تغيّر في طول الشيء فقط", "تغيّر مكانه فقط", "زيادة عدد القطع"], 0, "تغيّر الرائحة أو اللون أو الحرارة من علامات التغيّر الكيميائي."],
            ["هل يمكن استرجاع السكر بعد ذوبانه في الماء؟", ["لا أبدا", "نعم غالبا بتبخير الماء", "فقط بالحرق", "بإضافة الملح"], 1, "الذوبان تغيّر فيزيائي، وتبخير الماء يترك السكر كما كان."]
          ],
          tr: {
            fr: {
              t: "La chimie : les changements de la matière",
              intro: "Quand le bois brûle, il devient cendre et fumée. C'est un changement chimique ; apprenons à distinguer les types de changements.",
              sections: [
                ["La science et sa méthode", "La science est l'étude organisée de la nature : elle repose sur l'observation, l'expérience et la preuve. Une opinion ne suffit pas ; nous demandons la preuve qui la soutient. Le savoir scientifique évolue grâce à de nouvelles découvertes."],
                ["Un changement de forme seulement", "Si nous cassons une bouteille ou dissolvons du sucre dans l'eau, l'apparence change mais la matière reste la même. On appelle cela un changement physique. On peut souvent retrouver l'état initial."],
                ["Mesurer et utiliser des outils", "Nous utilisons des outils comme la règle, la balance et le thermomètre pour mesurer la longueur, la masse et la chaleur. Mesurer rend la description précise et la comparaison possible. Chaque outil a une unité de mesure adaptée."],
                ["Un changement de la matière elle-même", "La combustion du papier ou la rouille du fer produit une matière nouvelle qui ne ressemble pas à l'originale. C'est un changement chimique, souvent accompagné d'un changement de couleur, d'odeur ou de température. On ne retrouve pas facilement la matière de départ."],
                ["Expliquer les phénomènes", "Un phénomène est ce qui se produit autour de nous, comme la fonte de la glace ou la croissance d'une plante. Nous l'expliquons en cherchant les causes et les conditions qui le produisent. Une bonne explication peut être testée."],
                ["La sécurité au laboratoire", "Nous portons des lunettes de protection, nous rangeons les produits et nous sentons les odeurs avec prudence. Nous ne goûtons jamais une substance au laboratoire. Après l'expérience, nous nettoyons le matériel et nous nous lavons les mains."]
              ],
              vocab: [
                ["phénomène", "Un événement que l'on peut observer et mesurer dans la nature."],
                ["mesure", "Déterminer la quantité d'une chose avec une unité et un outil adaptés."],
                ["matière", "Tout ce qui occupe un espace et a une masse, comme l'eau, l'air et le fer."],
                ["changement", "Le passage d'une matière d'un état à un autre ou sa transformation en une matière nouvelle."],
                ["preuve", "Une observation ou un résultat d'expérience qui soutient une idée ou une explication."],
                ["être vivant", "Une matière qui grandit, se reproduit et réagit à son environnement."]
              ],
              examples: [
                ["Classe : couper une pomme, la brûler.", ["Couper la pomme ne change que sa forme.", "Les morceaux restent de la pomme comestible.", "La combustion donne des cendres, de la fumée et une matière nouvelle."], "Couper est un changement physique, brûler est un changement chimique."],
                ["Pourquoi la rouille du fer est-elle un changement chimique ?", ["Le fer change de couleur et devient brun.", "Une nouvelle matière, la rouille, apparaît.", "Le fer ne revient pas à son état initial sans traitement."], "Parce qu'une matière nouvelle, différente du fer, se forme."]
              ]
            },
            en: {
              t: "Chemistry: Changes in Materials",
              intro: "When wood burns it turns into ash and smoke. That is a chemical change; let us learn to tell the kinds of change apart.",
              sections: [
                ["Science and its method", "Science is the organised study of nature: it relies on observation, experiment and evidence. An opinion is not enough; we ask for evidence to support it. Scientific knowledge grows through new discoveries."],
                ["A change of shape only", "If we break a bottle or dissolve sugar in water, the appearance changes but the material stays the same. We call this a physical change. The original state can often be recovered."],
                ["Measuring and using tools", "We use tools such as a ruler, a balance and a thermometer to measure length, mass and heat. Measuring makes descriptions precise and comparisons possible. Each tool has a suitable unit."],
                ["A change in the material itself", "Burning paper or rusting iron produces a new material unlike the original. This is a chemical change, often accompanied by a change in colour, smell or temperature. The starting material cannot easily be recovered."],
                ["Explaining phenomena", "A phenomenon is something that happens around us, such as ice melting or a plant growing. We explain it by looking for the causes and conditions that produce it. A good explanation can be tested."],
                ["Safety in the laboratory", "We wear safety glasses, keep materials in their places and smell odours carefully. We never taste any substance in the laboratory. After the experiment we clean the equipment and wash our hands."]
              ],
              vocab: [
                ["phenomenon", "An event that can be observed and measured in nature."],
                ["measurement", "Finding the quantity of something using a suitable unit and tool."],
                ["matter", "Anything that takes up space and has mass, such as water, air and iron."],
                ["change", "The move of matter from one state to another or its transformation into a new substance."],
                ["evidence", "An observation or experiment result that supports an idea or explanation."],
                ["living thing", "Matter that grows, reproduces and responds to its surroundings."]
              ],
              examples: [
                ["Classify: cutting an apple, burning it.", ["Cutting only changes the apple's shape.", "The pieces are still edible apple.", "Burning produces ash, smoke and a new material."], "Cutting is physical, burning is chemical."],
                ["Why is rusting iron a chemical change?", ["The iron changes colour and turns brown.", "A new substance, rust, appears.", "The iron does not return to its original state without treatment."], "Because a new material different from iron is formed."]
              ]
            }
          }
        },
        {
          t: "الأحياء: الكائنات الحية",
          intro: "النبات والحيوان والإنسان كائنات حية. ما الذي يجعلها حية؟ سنتعرف على حاجاتها وأعضائها.",
          sections: [
            ["حاجات الكائنات الحية", "تحتاج الكائنات الحية إلى الماء والهواء والغذاء والحرارة المناسبة. النبات يصنع غذاءه بالضوء، والحيوان يأكل نباتات أو حيوانات أخرى. إذا غابت الحاجات ضعف الكائن."],
            ["الأعضاء ووظائفها", "للإنسان قلب يضخّ الدم، ورئتان تدخلان الهواء، ومعدة تهضم الطعام، وعينان يرى بهما. كل عضو يقوم بوظيفة تساعد الجسم على العيش."]
          ],
          examples: [
            ["اربط بين العضو ووظيفته: القلب، الرئتان.", ["القلب يضخّ الدم إلى كل الجسم.", "الرئتان تأخذان الأكسجين وتخرجان غاز ثاني أكسيد الكربون.", "كل عضو له دور مختلف."], "القلب للدم والرئتان للتنفس."],
            ["لماذا يحتاج النبات إلى الضوء؟", ["الضوء يدخل إلى الأوراق.", "الأوراق تصنع غذاء النبتة.", "بدون غذاء لا تنمو النبتة."], "لأن أوراقه تصنع الغذاء بمساعدة الضوء."]
          ],
          questions: [
            ["أي عضو يضخّ الدم؟", ["القلب", "المعدة", "العين", "الأذن"], 0, "وظيفة القلب ضخّ الدم عبر الأوعية إلى جميع أجزاء الجسم."],
            ["ما وظيفة الرئتين؟", ["هضم الطعام", "تنظيم الحركة", "أخذ الأكسجين", "إنتاج الضوء"], 2, "الرئتان تتبادلان الغازات، فتأخذان الأكسجين اللازم للجسم."],
            ["أي مجموعة تحتاجها كل الكائنات الحية؟", ["الماء والهواء والغذاء", "الذهب والفضة", "الكتب والأقلام", "الظلام التام"], 0, "الماء والهواء والغذاء من الحاجات الأساسية لكل كائن حي."],
            ["كيف يصنع النبات غذاءه؟", ["بالضوء والماء والهواء", "بالحجارة", "بالظلام فقط", "بالحركة"], 0, "الأوراق تستخدم الضوء والماء وغاز ثاني أكسيد الكربون لتصنيع الغذاء."]
          ],
          tr: {
            fr: {
              t: "La biologie : les êtres vivants",
              intro: "La plante, l'animal et l'être humain sont des êtres vivants. Qu'est-ce qui les rend vivants ? Découvrons leurs besoins et leurs organes.",
              sections: [
                ["La science et sa méthode", "La science est l'étude organisée de la nature : elle repose sur l'observation, l'expérience et la preuve. Une opinion ne suffit pas ; nous demandons la preuve qui la soutient. Le savoir scientifique évolue grâce à de nouvelles découvertes."],
                ["Les besoins des êtres vivants", "Les êtres vivants ont besoin d'eau, d'air, de nourriture et d'une chaleur adaptée. La plante fabrique sa nourriture grâce à la lumière, tandis que l'animal mange des plantes ou d'autres animaux. Si ces besoins manquent, l'être vivant s'affaiblit."],
                ["Mesurer et utiliser des outils", "Nous utilisons des outils comme la règle, la balance et le thermomètre pour mesurer la longueur, la masse et la chaleur. Mesurer rend la description précise et la comparaison possible. Chaque outil a une unité de mesure adaptée."],
                ["Les organes et leurs fonctions", "Le cœur pompe le sang, les poumons font entrer l'air, l'estomac digère la nourriture et les yeux permettent de voir. Chaque organe remplit une fonction qui aide le corps à vivre."],
                ["Expliquer les phénomènes", "Un phénomène est ce qui se produit autour de nous, comme la fonte de la glace ou la croissance d'une plante. Nous l'expliquons en cherchant les causes et les conditions qui le produisent. Une bonne explication peut être testée."],
                ["La sécurité au laboratoire", "Nous portons des lunettes de protection, nous rangeons les produits et nous sentons les odeurs avec prudence. Nous ne goûtons jamais une substance au laboratoire. Après l'expérience, nous nettoyons le matériel et nous nous lavons les mains."]
              ],
              vocab: [
                ["phénomène", "Un événement que l'on peut observer et mesurer dans la nature."],
                ["mesure", "Déterminer la quantité d'une chose avec une unité et un outil adaptés."],
                ["matière", "Tout ce qui occupe un espace et a une masse, comme l'eau, l'air et le fer."],
                ["changement", "Le passage d'une matière d'un état à un autre ou sa transformation en une matière nouvelle."],
                ["preuve", "Une observation ou un résultat d'expérience qui soutient une idée ou une explication."],
                ["être vivant", "Une matière qui grandit, se reproduit et réagit à son environnement."]
              ],
              examples: [
                ["Relie l'organe à sa fonction : le cœur, les poumons.", ["Le cœur pompe le sang dans tout le corps.", "Les poumons prennent l'oxygène et rejettent le dioxyde de carbone.", "Chaque organe a un rôle différent."], "Le cœur pour le sang et les poumons pour la respiration."],
                ["Pourquoi la plante a-t-elle besoin de lumière ?", ["La lumière entre dans les feuilles.", "Les feuilles fabriquent la nourriture de la plante.", "Sans nourriture, la plante ne grandit pas."], "Parce que ses feuilles fabriquent la nourriture grâce à la lumière."]
              ]
            },
            en: {
              t: "Biology: Living Things",
              intro: "Plants, animals and humans are living things. What makes them alive? Let us learn about their needs and their organs.",
              sections: [
                ["Science and its method", "Science is the organised study of nature: it relies on observation, experiment and evidence. An opinion is not enough; we ask for evidence to support it. Scientific knowledge grows through new discoveries."],
                ["The needs of living things", "Living things need water, air, food and suitable warmth. A plant makes its food using light, while an animal eats plants or other animals. If these needs are missing, the living thing becomes weak."],
                ["Measuring and using tools", "We use tools such as a ruler, a balance and a thermometer to measure length, mass and heat. Measuring makes descriptions precise and comparisons possible. Each tool has a suitable unit."],
                ["Organs and their functions", "The heart pumps blood, the lungs take in air, the stomach digests food and the eyes let us see. Each organ does a job that helps the body live."],
                ["Explaining phenomena", "A phenomenon is something that happens around us, such as ice melting or a plant growing. We explain it by looking for the causes and conditions that produce it. A good explanation can be tested."],
                ["Safety in the laboratory", "We wear safety glasses, keep materials in their places and smell odours carefully. We never taste any substance in the laboratory. After the experiment we clean the equipment and wash our hands."]
              ],
              vocab: [
                ["phenomenon", "An event that can be observed and measured in nature."],
                ["measurement", "Finding the quantity of something using a suitable unit and tool."],
                ["matter", "Anything that takes up space and has mass, such as water, air and iron."],
                ["change", "The move of matter from one state to another or its transformation into a new substance."],
                ["evidence", "An observation or experiment result that supports an idea or explanation."],
                ["living thing", "Matter that grows, reproduces and responds to its surroundings."]
              ],
              examples: [
                ["Match the organ to its job: heart, lungs.", ["The heart pumps blood around the whole body.", "The lungs take in oxygen and release carbon dioxide.", "Each organ has a different role."], "The heart for blood and the lungs for breathing."],
                ["Why does a plant need light?", ["Light reaches the leaves.", "The leaves make the plant's food.", "Without food the plant cannot grow."], "Because its leaves make food with the help of light."]
              ]
            }
          }
        },
        {
          t: "المنهج العلمي: ملاحظة وتجربة",
          intro: "العالم لا يكتفي بالتخمين، بل يسير في خطوات منظّمة. سنتعلم هذه الخطوات ونطبّقها.",
          sections: [
            ["من السؤال إلى الفرضية", "نبدأ بسؤال واضح مثل: هل يذوب السكر أسرع في الماء الساخن؟ ثم نقترح إجابة مؤقتة تسمّى الفرضية. الفرضية ليست يقينا، بل رأي نختبره."],
            ["التجربة والاستنتاج", "نجرّب في ظرفين متشابهين لا يختلفان إلا في عامل واحد، ثم نسجّل النتائج في جدول. نقارن الأرمقام ونقرر هل تدعم الفرضية أم لا. نكتب الاستنتاج بجملة موجزة."]
          ],
          examples: [
            ["اختبر: هل يذوب السكر أسرع في الماء الساخن؟", ["ضع ملعقة سكر في كوب ماء ساخن وأخرى في كوب ماء بارد.", "اجعل كمية الماء والسكر متساوية.", "لاحظ أي الكوبين يذوب فيه السكر أولا."], "نقارن زمن الذوبان في الكوبين."],
            ["صغ استنتاجا بعد تجربة النبات والضوء.", ["النبتة القريبة من الضوء نمت أكثر.", "الأخرى في الظلام ضعفت.", "إذن الضوء يساعد على نمو النبات."], "الضوء عامل مهم لنمو النبات."]
          ],
          questions: [
            ["في تجربة ذوبان السكر في الماء الساخن، ما الفرضية؟", ["إجابة مؤقتة نختبرها", "نتيجة نهائية", "أداة قياس", "سؤال بلا جواب"], 0, "الفرضية تخمين منظّم نختبره بالتجربة قبل الحكم عليه."],
            ["لماذا نجعل الظرفين متشابهين؟", ["لأن التجربة قصيرة", "لعزل العامل المراد دراسته", "لأن الماء ساخن", "لأن السكر كثير"], 1, "تشابه كل العوامل إلا واحدا يجعل النتيجة منسوبة إلى هذا العامل."],
            ["كيف نسجّل نتائج التجربة؟", ["في جدول منظّم", "في الشارع", "بلا كتابة", "بذكر أسماء الزملاء"], 0, "الجدول يساعد على مقارنة النتائج بدقة."],
            ["ماذا نكتب في الاستنتاج؟", ["ما تدعمه النتائج بجملة موجزة", "كل ما نتمناه", "رأي دون دليل", "أسماء الأدوات فقط"], 0, "الاستنتاج يجب أن ينبع من النتائج المسجّلة ويكون موجزا وواضحا."]
          ],
          tr: {
            fr: {
              t: "La méthode scientifique : observer et expérimenter",
              intro: "Le scientifique ne se contente pas de deviner : il suit des étapes organisées. Apprenons ces étapes et appliquons-les.",
              sections: [
                ["La science et sa méthode", "La science est l'étude organisée de la nature : elle repose sur l'observation, l'expérience et la preuve. Une opinion ne suffit pas ; nous demandons la preuve qui la soutient. Le savoir scientifique évolue grâce à de nouvelles découvertes."],
                ["De la question à l'hypothèse", "Nous commençons par une question claire, par exemple : le sucre se dissout-il plus vite dans l'eau chaude ? Nous proposons ensuite une réponse provisoire appelée hypothèse. L'hypothèse n'est pas une certitude, c'est une idée que nous allons tester."],
                ["Mesurer et utiliser des outils", "Nous utilisons des outils comme la règle, la balance et le thermomètre pour mesurer la longueur, la masse et la chaleur. Mesurer rend la description précise et la comparaison possible. Chaque outil a une unité de mesure adaptée."],
                ["L'expérience et la conclusion", "Nous expérimentons dans deux situations semblables qui ne diffèrent que par un seul facteur, puis nous notons les résultats dans un tableau. Nous comparons les valeurs et nous décidons si l'hypothèse est soutenue. Nous écrivons la conclusion en une phrase courte."],
                ["Expliquer les phénomènes", "Un phénomène est ce qui se produit autour de nous, comme la fonte de la glace ou la croissance d'une plante. Nous l'expliquons en cherchant les causes et les conditions qui le produisent. Une bonne explication peut être testée."],
                ["La sécurité au laboratoire", "Nous portons des lunettes de protection, nous rangeons les produits et nous sentons les odeurs avec prudence. Nous ne goûtons jamais une substance au laboratoire. Après l'expérience, nous nettoyons le matériel et nous nous lavons les mains."]
              ],
              vocab: [
                ["phénomène", "Un événement que l'on peut observer et mesurer dans la nature."],
                ["mesure", "Déterminer la quantité d'une chose avec une unité et un outil adaptés."],
                ["matière", "Tout ce qui occupe un espace et a une masse, comme l'eau, l'air et le fer."],
                ["changement", "Le passage d'une matière d'un état à un autre ou sa transformation en une matière nouvelle."],
                ["preuve", "Une observation ou un résultat d'expérience qui soutient une idée ou une explication."],
                ["être vivant", "Une matière qui grandit, se reproduit et réagit à son environnement."]
              ],
              examples: [
                ["Teste : le sucre se dissout-il plus vite dans l'eau chaude ?", ["Mets une cuillère de sucre dans un verre d'eau chaude et une autre dans un verre d'eau froide.", "Garde la même quantité d'eau et de sucre.", "Observe dans quel verre le sucre disparaît le premier."], "Nous comparons le temps de dissolution dans les deux verres."],
                ["Rédige une conclusion après l'expérience sur la plante et la lumière.", ["La plante près de la lumière a mieux poussé.", "Celle qui était dans l'obscurité a dépéri.", "Donc la lumière aide la plante à pousser."], "La lumière est un facteur important de la croissance."]
              ]
            },
            en: {
              t: "The Scientific Method: Observing and Testing",
              intro: "Scientists do not just guess: they follow organised steps. Let us learn those steps and apply them.",
              sections: [
                ["Science and its method", "Science is the organised study of nature: it relies on observation, experiment and evidence. An opinion is not enough; we ask for evidence to support it. Scientific knowledge grows through new discoveries."],
                ["From question to hypothesis", "We begin with a clear question, for example: does sugar dissolve faster in hot water? We then suggest a temporary answer called a hypothesis. A hypothesis is not a certainty; it is an idea we will test."],
                ["Measuring and using tools", "We use tools such as a ruler, a balance and a thermometer to measure length, mass and heat. Measuring makes descriptions precise and comparisons possible. Each tool has a suitable unit."],
                ["The experiment and the conclusion", "We test two similar situations that differ in only one factor, then record the results in a table. We compare the values and decide whether the hypothesis is supported. We write the conclusion in one short sentence."],
                ["Explaining phenomena", "A phenomenon is something that happens around us, such as ice melting or a plant growing. We explain it by looking for the causes and conditions that produce it. A good explanation can be tested."],
                ["Safety in the laboratory", "We wear safety glasses, keep materials in their places and smell odours carefully. We never taste any substance in the laboratory. After the experiment we clean the equipment and wash our hands."]
              ],
              vocab: [
                ["phenomenon", "An event that can be observed and measured in nature."],
                ["measurement", "Finding the quantity of something using a suitable unit and tool."],
                ["matter", "Anything that takes up space and has mass, such as water, air and iron."],
                ["change", "The move of matter from one state to another or its transformation into a new substance."],
                ["evidence", "An observation or experiment result that supports an idea or explanation."],
                ["living thing", "Matter that grows, reproduces and responds to its surroundings."]
              ],
              examples: [
                ["Test: does sugar dissolve faster in hot water?", ["Put a spoon of sugar in a glass of hot water and another in a glass of cold water.", "Keep the amount of water and sugar the same.", "Notice in which glass the sugar disappears first."], "We compare the dissolving time in the two glasses."],
                ["Write a conclusion after the plant and light experiment.", ["The plant near the light grew better.", "The one in the dark became weak.", "So light helps the plant grow."], "Light is an important factor in plant growth."]
              ]
            }
          }
        }
      ]
    },
    "cur_l_p6_sub_amz": {
      shared: {
        sections: [
          ["Le texte littéraire", "Un texte littéraire raconte une histoire, décrit un paysage ou exprime un sentiment. Il utilise des images et des mots choisis pour toucher le lecteur. La littérature garde la mémoire d'un peuple."],
          ["Lire entre les lignes", "Au-delà des mots, nous cherchons ce que l'auteur veut suggérer. Les personnages, le lieu et le temps aident à construire le sens. Une lecture attentive relève les détails qui comptent."],
          ["Écrire pour exprimer", "Pour écrire un texte, nous choisissons un sujet, nous ordonnons les idées, puis nous rédigeons des phrases liées. Les connecteurs comme « puis » et « pourtant » donnent du rythme. Nous relisons pour corriger."],
          ["La culture amazighe", "La culture amazighe s'exprime à travers la langue, la poésie, la musique et le tissage. L'écriture tifinagh est utilisée pour transcrire cette langue. Les contes transmettent les valeurs de la communauté."]
        ],
        vocab: [
          ["récit", "Un texte qui raconte des événements vécus ou imaginés."],
          ["personnage", "Une personne ou un être qui agit dans une histoire."],
          ["image", "Une expression qui donne une comparaison ou une sensation."],
          ["tifinagh", "L'alphabet utilisé pour écrire la langue amazighe."],
          ["azul", "Un mot de salutation en amazigh, qui signifie « bonjour »."],
          ["conte", "Une histoire traditionnelle transmise oralement ou par écrit."]
        ],
        outcomes: [
          "Les élèves identifient le thème et les personnages d'un récit court.",
          "Les élèves expliquent le sens d'une image simple.",
          "Les élèves rédigent un court texte personnel organisé.",
          "Les élèves citent des éléments de la culture amazighe avec respect."
        ],
        diagram: ""
      },
      lessons: [
        {
          t: "Le texte littéraire amazigh",
          intro: "Les contes amazighs se racontent depuis très longtemps. Nous allons lire un court récit et découvrir comment il est construit.",
          sections: [
            ["Le récit et ses étapes", "Un récit comporte un début qui présente les personnages, un milieu où se passe l'action et une fin qui la conclut. Les événements se suivent dans un ordre clair. Les mots de liaison aident à repérer ces étapes."],
            ["Les mots de la langue", "Dans un texte amazigh, on rencontre des mots comme « azul » pour saluer ou « tifinagh » pour l'écriture. Ces mots portent une identité et une histoire. Les respecter, c'est respecter la culture qu'ils expriment."]
          ],
          examples: [
            ["Repère les étapes d'un conte court.", ["Lis le début : qui est le personnage ?", "Repère l'événement principal au milieu.", "Relève la dernière phrase qui conclut l'histoire."], "Découpage : présentation, action, conclusion."],
            ["Explique le mot « azul » dans une phrase.", ["Observe que c'est un mot de salutation.", "Il équivaut approximativement à « bonjour ».", "On peut dire : « Azul, mon ami. »"], "Azul est un salut en amazigh."]
          ],
          questions: [
            ["Que contient le début d'un récit ?", ["La conclusion", "La présentation des personnages", "La fin de l'action", "La liste des mots"], 1, "Le début situe l'histoire et présente les personnages avant que l'action commence."],
            ["Que signifie « azul » ?", ["Un bonjour", "Un merci", "Un au revoir en français", "Un nom de ville"], 0, "Azul est une salutation amazighe qui correspond à peu près à bonjour."],
            ["À quoi servent les mots de liaison dans un récit ?", ["À montrer l'ordre des événements", "À supprimer les personnages", "À changer le titre", "À écrire plus vite"], 0, "Les connecteurs comme puis et ensuite montrent comment les événements s'enchaînent."],
            ["Comment nomme-t-on l'alphabet de la langue amazighe ?", ["Le latin", "Le tifinagh", "Le grec", "L'arabe"], 1, "Le tifinagh est le système d'écriture utilisé pour transcrire l'amazigh."]
          ]
        },
        {
          t: "Analyser un texte court",
          intro: "Analyser, c'est observer comment le texte est fait et ce qu'il veut dire. Nous allons examiner un extrait ensemble.",
          sections: [
            ["Le thème et les personnages", "Le thème est le sujet principal du texte : l'amitié, la famille ou la nature. Les personnages sont ceux qui vivent l'action. Pour les trouver, nous posons : de qui parle-t-on et que fait-on ?"],
            ["Les images et le sens", "Une image compare deux choses ou donne une sensation, comme « le vent chante ». Elle rend la phrase plus vivante. Nous expliquons l'image avec nos propres mots pour montrer que nous l'avons comprise."]
          ],
          examples: [
            ["Dans « la mer est un grand miroir », quelle est l'image ?", ["Je repère la comparaison.", "La mer est comparée à un miroir.", "L'image suggère une surface calme et brillante."], "La mer est comparée à un miroir."],
            ["Quel est le thème d'un texte sur une grand-mère qui raconte des contes ?", ["Je cherche de qui l'on parle.", "Le texte parle de la grand-mère et de ses histoires.", "Le thème est la transmission des contes."], "La transmission des contes familiaux."]
          ],
          questions: [
            ["Comment trouver le thème d'un texte ?", ["En lisant le titre et en cherchant le sujet principal", "En comptant les pages", "En regardant la couverture seulement", "En devinant sans lire"], 0, "Le titre et la répétition des idées indiquent le sujet principal du texte."],
            ["Que sont les personnages ?", ["Les êtres qui agissent dans l'histoire", "Les mots difficiles", "Les illustrations seules", "Les titres des chapitres"], 0, "Les personnages sont ceux qui parlent et agissent dans le récit."],
            ["Que veut dire l'image « le vent chante » ?", ["Le vent fait un bruit agréable comme un chant", "Le vent écrit une chanson", "Le vent est un oiseau", "Le vent se tait"], 0, "C'est une comparaison imagée : le bruit du vent est présenté comme un chant."],
            ["Pourquoi expliquer une image avec ses mots ?", ["Pour montrer qu'on l'a comprise", "Pour la rendre plus courte", "Pour changer le personnage", "Pour effacer le texte"], 0, "Reformuler une image prouve que le lecteur en a saisi le sens."]
          ]
        },
        {
          t: "Produire un écrit simple",
          intro: "Nous allons écrire quelques lignes sur un souvenir de famille. Le but est d'être clair et sincère.",
          sections: [
            ["Préparer ses idées", "Avant d'écrire, nous notons trois idées : le lieu, les personnes et ce qui s'est passé. Nous choisissons l'ordre qui rend l'histoire facile à suivre. Une courte liste suffit pour commencer."],
            ["Rédiger et relire", "Nous écrivons une phrase par idée, puis nous les relions avec des mots comme « et » ou « puis ». Nous vérifions la ponctuation et l'accord des mots. La relecture permet de corriger une phrase peu claire."]
          ],
          examples: [
            ["Écris trois phrases sur un repas de famille.", ["Première idée : « Le dimanche, nous mangeons ensemble. »", "Deuxième idée : « Ma grand-mère prépare le couscous. »", "Troisième idée : « Nous parlons et nous rions. »"], "Le dimanche, nous mangeons ensemble. Ma grand-mère prépare le couscous. Nous parlons et nous rions."],
            ["Améliore la phrase « je vais marché avec frère ».", ["Ajoute les articles : « au marché » et « mon frère ».", "Commence par une majuscule.", "Termine par un point."], "Je vais au marché avec mon frère."]
          ],
          questions: [
            ["Que faut-il faire avant de rédiger ?", ["Noter quelques idées et les ordonner", "Écrire sans réfléchir", "Attendre le lendemain", "Copier un long texte"], 0, "Une petite liste d'idées et un ordre clair facilitent la rédaction."],
            ["Quel mot relie deux idées qui se suivent ?", ["puis", "mais", "sans", "vers"], 0, "« Puis » marque une suite chronologique entre deux actions."],
            ["Que vérifier lors de la relecture ?", ["La ponctuation et la clarté", "Le nombre de pages seulement", "La couleur du cahier", "Le prix du livre"], 0, "La relecture vise à corriger les erreurs et à rendre les phrases claires."],
            ["Pourquoi écrire des phrases simples ?", ["Pour être compris facilement", "Pour écrire moins vite", "Pour éviter les points", "Pour ne pas utiliser de mots"], 0, "Une phrase simple et correcte transmet l'idée plus sûrement qu'une phrase confuse."]
          ]
        },
        {
          t: "La culture amazighe et l'écriture tifinagh",
          intro: "La langue amazighe est parlée au Maroc depuis très longtemps. Découvrons son écriture et sa place dans la vie quotidienne.",
          sections: [
            ["L'écriture tifinagh", "Le tifinagh est un alphabet ancien composé de signes clairs. On le voit sur des panneaux, dans des livres et sur des objets artisanaux. Chaque signe correspond à un son de la langue."],
            ["Transmettre la culture", "Les contes, la musique et le tissage transmettent les valeurs amazighes. Apprendre quelques mots comme « azul » ou « tifinagh » montre du respect pour ce patrimoine. Les élèves peuvent demander à leur famille des mots et des histoires."]
          ],
          examples: [
            ["Où peut-on voir l'écriture tifinagh ?", ["Sur des panneaux de rue.", "Dans des livres et des cahiers.", "Sur des objets fabriqués par les artisans."], "Sur les panneaux, dans les livres et sur l'artisanat."],
            ["Comment apprendre des mots amazighs ?", ["Demander à un parent ou à un grand-parent.", "Écouter une chanson en amazigh.", "Noter le mot et son sens dans un cahier."], "En écoutant la famille et en notant les mots."]
          ],
          questions: [
            ["Dans la leçon de sixième sur la culture amazighe, qu'est-ce que le tifinagh ?", ["Un alphabet amazigh", "Un instrument de musique", "Un plat traditionnel", "Une ville"], 0, "Le tifinagh est le système d'écriture utilisé pour la langue amazighe."],
            ["Que signifie le mot « azul » ?", ["Bonjour", "Merci", "Au revoir", "Pain"], 0, "Azul est une salutation courante en amazigh."],
            ["Comment se transmet la culture amazighe ?", ["Par les contes, la musique et le tissage", "Par les seuls livres étrangers", "Par le silence", "Par l'oubli des mots"], 0, "Les récits, les chants et les savoir-faire sont des moyens de transmission."],
            ["Quelle attitude est respectueuse envers une langue ?", ["Apprendre quelques mots et les utiliser correctement", "Se moquer des mots inconnus", "Dire qu'elle n'existe pas", "La remplacer partout"], 0, "Apprendre et utiliser des mots avec soin témoigne du respect pour la langue et ses locuteurs."]
          ]
        }
      ]
    }
  }
};
