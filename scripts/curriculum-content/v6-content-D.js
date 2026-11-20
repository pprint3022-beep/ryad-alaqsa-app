module.exports = {
  units: {
    'cur4': {
      shared: {
        sections: [
          ['العالم من حولنا', 'في الفصل والبيت والساحة نجد أشياء كثيرة: نباتات وحيوانات وألوانا وأصواتا. نسمّي كل ما يحيط بنا المحيط. نبدأ بتسمية ما نراه ثم نصفه.'],
          ['الملاحظة الدقيقة', 'ننظر بتمعن إلى الشكل واللون والحجم والرائحة. لا نلمس الأشياء الخطرة مثل النار أو الأسلاك الكهربائية. نسأل المعلمة إذا لم نفهم شيئا.'],
          ['التصنيف', 'نضع الأشياء المتشابهة في مجموعة واحدة. النباتات معا، والحيوانات معا، والألوان معا. التصنيف يساعدنا على الفهم والترتيب.'],
          ['المشاركة والرعاية', 'نخبر زملاءنا بما اكتشفناه بجمل قصيرة. نعتني بالنباتات والحيوانات ولا نؤذيها. المحافظة على المحيط واجبنا جميعا.']
        ],
        vocab: [
          ['المحيط', 'كل ما يحيط بنا في البيت والمدرسة والطبيعة.'],
          ['الملاحظة', 'النظر والأصغاء والتشمم لمعرفة الشيء.'],
          ['الحواس', 'أدوات الجسم التي تساعدنا على المعرفة: العين والأذن والأنف واللسان والجلد.'],
          ['النبات', 'كائن حي ينمو في التراب ويحتاج الماء والضوء.'],
          ['الحيوان', 'كائن حي يتحرك ويأكل ويتنفس.'],
          ['التصنيف', 'وضع الأشياء المتشابهة في مجموعة واحدة.']
        ],
        outcomes: [
          'يسمّي الطالب ثلاثة أشياء في محيطه القريب.',
          'يستخدم الطالب حواسه لوصف جسم واحد وصفا صحيحا.',
          'يميّز الطالب بين النبات والحيوان في صور مألوفة.',
          'يعبّر الطالب عن اكتشافه بجملة قصيرة أمام زملائه.'
        ],
        outcomeTr: {
          fr: [
            "L'élève nomme trois objets de son environnement proche.",
            "L'élève utilise ses sens pour décrire correctement un objet.",
            "L'élève distingue les plantes des animaux dans des images familières.",
            "L'élève exprime sa découverte en une courte phrase devant ses camarades."
          ],
          en: [
            'The learner names three objects in the immediate surroundings.',
            'The learner uses the senses to describe one object accurately.',
            'The learner tells plants apart from animals in familiar pictures.',
            'The learner shares one discovery in a short sentence with classmates.'
          ]
        },
        diagram: 'diagram-five-senses.svg'
      },
      lessons: [
        {
          t: 'الحواس الخمس',
          intro: 'نعرف الأشياء من حولنا بحواسنا الخمس. اليوم نتعرف إلى كل حاسة وماذا تساعدنا على معرفته.',
          sections: [
            ['العين ترى الألوان', 'نرى بالعين شكل التفاحة ولونها الأحمر. نرى أيضا حجم الكتاب وعدد الأقلام على الطاولة. نقول: هذا قلم أخضر، وهذا تفاح أحمر.'],
            ['الأذن والأنف واللسان والجلد', 'نسمع بالأذن صوت الجرس، ونشم بالأنف رائحة الورد. نذوق باللسان طعم التمر، ونلمس بالجلد سطح الحجر الأملس. كل حاسة تعطينا معلومة مختلفة.']
          ],
          examples: [
            ['كيف نعرف أن الورد معطر؟', ['نقترب من الوردة بهدوء.', 'نشمّها بأنفنا دون لمس الأشواك.', 'نقول: الوردة ذات رائحة عطرة.'], 'نعرف ذلك بحاسة الشم.'],
            ['لماذا نقول إن الثلج بارد؟', ['نضع قطعة ثلج في كف اليد.', 'نحسّ بالبرودة في جلدنا.', 'نقول: الثلج بارد عند اللمس.'], 'لأن حاسة اللمس في الجلد أحسّت بالبرودة.']
          ],
          questions: [
            ['بأي حاسة نعرف لون السماء؟', ['بالعين', 'بالأذن', 'بالأنف', 'بالجلد'], 0, 'اللون يُرى بالعين، أما الأذن فتسمع والأنف يشمّ والجلد يلمس.'],
            ['أيّ هذه الأشياء نعرفه بالذوق؟', ['رائحة العطر', 'صوت العصفور', 'طعم التمر', 'شكل الكرة'], 2, 'اللسان هو حاسة الذوق، لذلك نعرف طعم التمر به لا بالأذن أو العين.'],
            ['لماذا لا نلمس الأسلاك الكهربائية؟', ['لأنها لامعة', 'لأنها خطيرة على جسمنا', 'لأنها صغيرة', 'لأنها باردة'], 1, 'الأسلاك المكشوفة قد تؤذي الجسم، لذلك نكتفي بالنظر ونستدعي المعلمة.'],
            ['أكمل: نسمع صوت المطر بـ...', ['العين', 'الأنف', 'الجلد', 'الأذن'], 3, 'الصوت يُسمع بالأذن؛ العين ترى والأنف يشمّ والجلد يحسّ باللمس.']
          ],
          tr: {
            fr: {
              t: 'Les cinq sens',
              intro: "Nous connaissons les objets autour de nous grâce à nos cinq sens. Aujourd'hui, nous découvrons chaque sens et ce qu'il nous apprend.",
              sections: [
                ['Le monde autour de nous', 'Dans la classe, à la maison et dans la cour, nous trouvons beaucoup de choses : des plantes, des animaux, des couleurs et des bruits. Nous appelons cela notre environnement. Nous commençons par nommer ce que nous voyons, puis nous le décrivons.'],
                ["L'oeil voit les couleurs", "Avec l'oeil, nous voyons la forme et la couleur de la pomme. Nous voyons aussi la taille du livre et le nombre de crayons sur la table. Nous disons : ceci est un crayon vert, ceci est une pomme rouge."],
                ['Observer avec attention', "Nous regardons bien la forme, la couleur, la taille et l'odeur. Nous ne touchons pas les choses dangereuses comme le feu ou les fils électriques. Nous demandons à la maîtresse quand nous ne comprenons pas."],
                ["L'oreille, le nez, la langue et la peau", "Avec l'oreille, nous entendons la sonnerie ; avec le nez, nous sentons le parfum de la rose. La langue goûte la datte et la peau touche la pierre lisse. Chaque sens nous donne une information différente."],
                ['Classer', 'Nous mettons ensemble les choses qui se ressemblent. Les plantes ensemble, les animaux ensemble, les couleurs ensemble. Classer nous aide à comprendre et à ranger.'],
                ['Partager et respecter', "Nous racontons nos découvertes aux camarades avec une courte phrase. Nous prenons soin des plantes et des animaux sans les abîmer. Respecter notre environnement est l'affaire de tous."]
              ],
              vocab: [
                ['environnement', "Tout ce qui nous entoure à la maison, à l'école et dans la nature."],
                ['observation', 'Regarder, écouter et sentir pour connaître une chose.'],
                ['les sens', "Les organes du corps qui nous aident à connaître : l'oeil, l'oreille, le nez, la langue et la peau."],
                ['plante', "Un être vivant qui pousse dans la terre et qui a besoin d'eau et de lumière."],
                ['animal', 'Un être vivant qui bouge, qui mange et qui respire.'],
                ['classer', 'Mettre ensemble les choses qui se ressemblent.']
              ],
              examples: [
                ['Comment savons-nous que la rose est parfumée ?', ['Nous nous approchons doucement de la rose.', 'Nous la sentons avec le nez sans toucher les épines.', 'Nous disons : la rose a un parfum agréable.'], "Nous le savons grâce au sens de l'odorat."],
                ['Pourquoi disons-nous que la glace est froide ?', ['Nous posons un morceau de glace dans la paume de la main.', 'Nous sentons le froid sur notre peau.', 'Nous disons : la glace est froide au toucher.'], 'Parce que le sens du toucher de la peau a senti le froid.']
              ]
            },
            en: {
              t: 'The five senses',
              intro: 'We know the things around us through our five senses. Today we learn what each sense tells us.',
              sections: [
                ['The world around us', 'In the classroom, at home and in the playground we find many things: plants, animals, colours and sounds. We call all of this our environment. We start by naming what we see, then we describe it.'],
                ['The eye sees colours', 'With our eyes we see the shape and the red colour of the apple. We also see the size of the book and the number of pencils on the table. We say: this is a green pencil, this is a red apple.'],
                ['Looking carefully', 'We look closely at the shape, colour, size and smell. We do not touch dangerous things such as fire or electrical wires. We ask the teacher when we do not understand something.'],
                ['Ears, nose, tongue and skin', 'With our ears we hear the bell, and with our nose we smell the rose. Our tongue tastes the date and our skin feels the smooth stone. Each sense gives us a different piece of information.'],
                ['Sorting', 'We put similar things together. Plants together, animals together, colours together. Sorting helps us understand and organise.'],
                ['Sharing and caring', "We tell our classmates what we discovered in a short sentence. We look after plants and animals without hurting them. Caring for our environment is everyone's job."]
              ],
              vocab: [
                ['environment', 'Everything around us at home, at school and in nature.'],
                ['observation', 'Looking, listening and smelling to learn about something.'],
                ['senses', 'The parts of the body that help us learn: eyes, ears, nose, tongue and skin.'],
                ['plant', 'A living thing that grows in soil and needs water and light.'],
                ['animal', 'A living thing that moves, eats and breathes.'],
                ['sorting', 'Putting similar things together in one group.']
              ],
              examples: [
                ['How do we know that the rose smells sweet?', ['We move gently towards the rose.', 'We smell it with our nose without touching the thorns.', 'We say: the rose has a pleasant smell.'], 'We know this through the sense of smell.'],
                ['Why do we say that ice is cold?', ['We put a piece of ice in the palm of our hand.', 'We feel the cold on our skin.', 'We say: ice is cold to the touch.'], 'Because the sense of touch in our skin felt the cold.']
              ]
            }
          }
        },
        {
          t: 'النباتات وأجزاؤها',
          intro: 'تنمو النباتات حولنا في الحديقة والساحة. نتعرف اليوم إلى أجزائها وما تحتاجه لتكبر.',
          sections: [
            ['أجزاء النبات', 'للنبات جذر وساق وأوراق وأزهار. الجذر يثبته في التراب ويشرب الماء، والساق تحمل الأوراق. الورقة تصنع الغذاء بفضل ضوء الشمس.'],
            ['ماذا يحتاج النبات؟', 'يحتاج النبات إلى الماء والهواء والضوء والتراب. في المغرب نرى شجرة الزيتون تنمو في البساتين وتعطينا الزيتون. إذا انقطع الماء ذبلت الأوراق.']
          ],
          examples: [
            ['لماذا تذبل شجرة في الصيف؟', ['ننظر إلى أوراقها فنجدها مائلة للاصفرار.', 'نتحقق من التراب: هل هو جاف؟', 'نقول: الشجرة تحتاج إلى الماء.'], 'لأن الجفاف يمنع الجذر من شرب الماء.'],
            ['كيف نزرع بذرة في الأصيص؟', ['نضع التراب في الأصيص ونغرس البذرة قليلا.', 'نرشّها بالماء ونضعها قرب النافذة.', 'ننتظر الأيام ونراقب النمو.'], 'للبذرة ماء وضوء فتنبت وتكبر.']
          ],
          questions: [
            ['أيّ جزء في النبات يشرب الماء؟', ['الورقة', 'الجذر', 'الزهرة', 'الساق'], 1, 'الجذر مدفون في التراب ويمتص الماء، ثم يصعد الماء إلى الساق والأوراق.'],
            ['ما الذي لا يحتاجه النبات لينمو؟', ['الضوء', 'الماء', 'صوت المذياع', 'الهواء'], 2, 'النبات يحتاج الماء والضوء والهواء، أما صوت المذياع فلا يغذّيه.'],
            ['لماذا نضع الأصيص قرب النافذة؟', ['لأن النافذة باردة', 'لأن الضوء يصل إلى النبات', 'لأن التراب هناك أثقل', 'لأن النافذة قريبة من الباب'], 1, 'الضوء ضروري لتصنيع الغذاء في الأوراق، والنافذة توفّره.'],
            ['رأيت أوراقا صفراء في الحديقة. ما أول سؤال يسأله العالم الصغير؟', ['هل النبات يحتاج ماء؟', 'هل النبات يلعب؟', 'هل النبات يكتب؟', 'هل النبات يغني؟'], 0, 'السؤال العلمي يبدأ بملاحظة واقعية؛ الأصفرار يدل على نقص الماء أو الضوء.']
          ],
          tr: {
            fr: {
              t: 'Les plantes et leurs parties',
              intro: "Les plantes poussent autour de nous, dans le jardin et dans la cour. Nous découvrons leurs parties et ce qu'il leur faut pour grandir.",
              sections: [
                ['Le monde autour de nous', 'Dans la classe, à la maison et dans la cour, nous trouvons beaucoup de choses : des plantes, des animaux, des couleurs et des bruits. Nous appelons cela notre environnement. Nous commençons par nommer ce que nous voyons, puis nous le décrivons.'],
                ['Les parties de la plante', "Une plante a une racine, une tige, des feuilles et des fleurs. La racine la fixe dans la terre et boit l'eau, et la tige porte les feuilles. La feuille fabrique la nourriture grâce à la lumière du soleil."],
                ['Observer avec attention', "Nous regardons bien la forme, la couleur, la taille et l'odeur. Nous ne touchons pas les choses dangereuses comme le feu ou les fils électriques. Nous demandons à la maîtresse quand nous ne comprenons pas."],
                ['Ce dont la plante a besoin', "La plante a besoin d'eau, d'air, de lumière et de terre. Au Maroc, l'olivier pousse dans les vergers et nous donne des olives. Si l'eau manque, les feuilles fanent."],
                ['Classer', 'Nous mettons ensemble les choses qui se ressemblent. Les plantes ensemble, les animaux ensemble, les couleurs ensemble. Classer nous aide à comprendre et à ranger.'],
                ['Partager et respecter', "Nous racontons nos découvertes aux camarades avec une courte phrase. Nous prenons soin des plantes et des animaux sans les abîmer. Respecter notre environnement est l'affaire de tous."]
              ],
              vocab: [
                ['environnement', "Tout ce qui nous entoure à la maison, à l'école et dans la nature."],
                ['observation', 'Regarder, écouter et sentir pour connaître une chose.'],
                ['les sens', "Les organes du corps qui nous aident à connaître : l'oeil, l'oreille, le nez, la langue et la peau."],
                ['plante', "Un être vivant qui pousse dans la terre et qui a besoin d'eau et de lumière."],
                ['animal', 'Un être vivant qui bouge, qui mange et qui respire.'],
                ['classer', 'Mettre ensemble les choses qui se ressemblent.']
              ],
              examples: [
                ['Pourquoi un arbre fane-t-il en été ?', ['Nous regardons ses feuilles qui jaunissent.', 'Nous vérifions la terre : est-elle sèche ?', "Nous disons : l'arbre a besoin d'eau."], 'Parce que la sécheresse empêche la racine de boire.'],
                ['Comment planter une graine dans un pot ?', ['Nous mettons de la terre dans le pot et nous enfouissons la graine.', 'Nous l arrosons et la plaçons près de la fenêtre.', 'Nous attendons et observons la pousse.'], "La graine a de l'eau et de la lumière, alors elle germe et grandit."]
              ]
            },
            en: {
              t: 'Plants and their parts',
              intro: 'Plants grow around us in the garden and in the playground. Today we learn their parts and what they need to grow.',
              sections: [
                ['The world around us', 'In the classroom, at home and in the playground we find many things: plants, animals, colours and sounds. We call all of this our environment. We start by naming what we see, then we describe it.'],
                ['The parts of a plant', 'A plant has a root, a stem, leaves and flowers. The root holds it in the soil and drinks water, and the stem carries the leaves. The leaf makes food thanks to sunlight.'],
                ['Looking carefully', 'We look closely at the shape, colour, size and smell. We do not touch dangerous things such as fire or electrical wires. We ask the teacher when we do not understand something.'],
                ['What a plant needs', 'A plant needs water, air, light and soil. In Morocco the olive tree grows in orchards and gives us olives. When water is cut off, the leaves wilt.'],
                ['Sorting', 'We put similar things together. Plants together, animals together, colours together. Sorting helps us understand and organise.'],
                ['Sharing and caring', "We tell our classmates what we discovered in a short sentence. We look after plants and animals without hurting them. Caring for our environment is everyone's job."]
              ],
              vocab: [
                ['environment', 'Everything around us at home, at school and in nature.'],
                ['observation', 'Looking, listening and smelling to learn about something.'],
                ['senses', 'The parts of the body that help us learn: eyes, ears, nose, tongue and skin.'],
                ['plant', 'A living thing that grows in soil and needs water and light.'],
                ['animal', 'A living thing that moves, eats and breathes.'],
                ['sorting', 'Putting similar things together in one group.']
              ],
              examples: [
                ['Why does a tree wilt in summer?', ['We look at its yellowing leaves.', 'We check the soil: is it dry?', 'We say: the tree needs water.'], 'Because dryness stops the root from drinking water.'],
                ['How do we plant a seed in a pot?', ['We put soil in the pot and bury the seed slightly.', 'We sprinkle water and place it near the window.', 'We wait and watch it grow.'], 'The seed has water and light, so it sprouts and grows.']
              ]
            }
          }
        },
        {
          t: 'الحيوانات من حولنا',
          intro: 'الحيوانات كائنات حية نراها في المزرعة والغابة والبحر. نتعرف إلى صفاتها وكيف نراعيها.',
          sections: [
            ['كيف نعرف الحيوان؟', 'الحيوان يتحرك ويأكل ويتنفس ويكبر. الدجاج يأكل الحبّ، والقطة تشرب الحليب، والسمك يتنفس في الماء. كل حيوان جسمه مناسب لبيئته.'],
            ['أنماط مختلفة', 'بعض الحيوانات تعيش عند الإنسان مثل الكلب والغنم، وبعضها بري مثل الأسد والغزال. في المغرب نجد الإبل في الصحراء والطيور في البساتين. لا نقترب من الحيوانات البرية.']
          ],
          examples: [
            ['لماذا للسمك زعانف؟', ['ننظر إلى جسم السمكة في الصورة.', 'نلاحظ أنها تعيش في الماء.', 'نقول: الزعانف تساعدها على السباحة.'], 'لأن الزعانف تساعد السمكة على التحرك في الماء.'],
            ['كيف نعتني بالقط؟', ['نضع له ماء نظيفا وطعاما مناسبا.', 'ننظّف مكانه ونتركه ينام بهدوء.', 'لا نسحب ذيله ولا نزعجه.'], 'الرفق بالحيوان يعني توفير مائه وطعامه وعدم إيذائه.']
          ],
          questions: [
            ['أيّ حيوان يتنفس في الماء؟', ['الدجاج', 'القطة', 'السمك', 'الغزال'], 2, 'السمك له خياشيم تأخذ الأكسجين من الماء، بخلاف الدجاج والقطة.'],
            ['ما صفة تشترك فيها الحيوانات كلها؟', ['تطير', 'تأكل وتكبر', 'تعيش في الماء', 'لها أجنحة'], 1, 'كل الحيوانات تأكل وتكبر وتتنفس، أما الطيران أو العيش في الماء فخاص ببعضها.'],
            ['لماذا لا نقترب من الأسد في الحديقة؟', ['لأنه حيوان مفترس قد يؤذينا', 'لأنه صغير جدا', 'لأنه لا يأكل', 'لأنه ينام دائما'], 0, 'الحيوانات البرية قد تكون خطيرة، والمسافة الآمنة تحمينا وتحميها.'],
            ['أيّ سلوك يدلّ على الرفق بالحيوان؟', ['سحب أذن الأرنب', 'ترك الطعام على الأرض', 'وضع ماء نظيف للقط', 'إغلاق القفص بعنف'], 2, 'توفير الماء النظيف من أساسيات الرعاية، وبقية الخيارات تؤذي الحيوان.']
          ],
          tr: {
            fr: {
              t: 'Les animaux autour de nous',
              intro: 'Les animaux sont des êtres vivants que nous voyons à la ferme, dans la forêt et dans la mer. Nous découvrons leurs caractères et comment en prendre soin.',
              sections: [
                ['Le monde autour de nous', 'Dans la classe, à la maison et dans la cour, nous trouvons beaucoup de choses : des plantes, des animaux, des couleurs et des bruits. Nous appelons cela notre environnement. Nous commençons par nommer ce que nous voyons, puis nous le décrivons.'],
                ['Comment reconnaître un animal ?', "Un animal bouge, mange, respire et grandit. La poule mange du grain, le chat boit du lait et le poisson respire dans l'eau. Chaque animal a un corps adapté à son milieu."],
                ['Observer avec attention', "Nous regardons bien la forme, la couleur, la taille et l'odeur. Nous ne touchons pas les choses dangereuses comme le feu ou les fils électriques. Nous demandons à la maîtresse quand nous ne comprenons pas."],
                ['Des manières de vivre différentes', "Certains animaux vivent avec l'homme, comme le chien et le mouton, et d'autres sont sauvages, comme le lion et la gazelle. Au Maroc, nous voyons des chameaux dans le désert et des oiseaux dans les vergers. Nous ne nous approchons pas des animaux sauvages."],
                ['Classer', 'Nous mettons ensemble les choses qui se ressemblent. Les plantes ensemble, les animaux ensemble, les couleurs ensemble. Classer nous aide à comprendre et à ranger.'],
                ['Partager et respecter', "Nous racontons nos découvertes aux camarades avec une courte phrase. Nous prenons soin des plantes et des animaux sans les abîmer. Respecter notre environnement est l'affaire de tous."]
              ],
              vocab: [
                ['environnement', "Tout ce qui nous entoure à la maison, à l'école et dans la nature."],
                ['observation', 'Regarder, écouter et sentir pour connaître une chose.'],
                ['les sens', "Les organes du corps qui nous aident à connaître : l'oeil, l'oreille, le nez, la langue et la peau."],
                ['plante', "Un être vivant qui pousse dans la terre et qui a besoin d'eau et de lumière."],
                ['animal', 'Un être vivant qui bouge, qui mange et qui respire.'],
                ['classer', 'Mettre ensemble les choses qui se ressemblent.']
              ],
              examples: [
                ['Pourquoi le poisson a-t-il des nageoires ?', ["Nous regardons le corps du poisson sur l'image.", "Nous observons qu'il vit dans l'eau.", 'Nous disons : les nageoires l aident à nager.'], "Les nageoires aident le poisson à se déplacer dans l'eau."],
                ['Comment prendre soin du chat ?', ["Nous lui donnons de l'eau propre et de la nourriture.", 'Nous nettoyons sa place et le laissons dormir.', 'Nous ne tirons pas sa queue.'], "Bien traiter un animal, c'est lui donner de l'eau et de la nourriture sans le blesser."]
              ]
            },
            en: {
              t: 'Animals around us',
              intro: 'Animals are living things we see on the farm, in the forest and in the sea. We learn their features and how to care for them.',
              sections: [
                ['The world around us', 'In the classroom, at home and in the playground we find many things: plants, animals, colours and sounds. We call all of this our environment. We start by naming what we see, then we describe it.'],
                ['How do we recognise an animal?', 'An animal moves, eats, breathes and grows. The hen eats grain, the cat drinks milk and the fish breathes in water. Every animal has a body suited to its habitat.'],
                ['Looking carefully', 'We look closely at the shape, colour, size and smell. We do not touch dangerous things such as fire or electrical wires. We ask the teacher when we do not understand something.'],
                ['Different ways of living', 'Some animals live with people, such as the dog and the sheep, and others are wild, such as the lion and the gazelle. In Morocco we find camels in the desert and birds in the orchards. We do not go near wild animals.'],
                ['Sorting', 'We put similar things together. Plants together, animals together, colours together. Sorting helps us understand and organise.'],
                ['Sharing and caring', "We tell our classmates what we discovered in a short sentence. We look after plants and animals without hurting them. Caring for our environment is everyone's job."]
              ],
              vocab: [
                ['environment', 'Everything around us at home, at school and in nature.'],
                ['observation', 'Looking, listening and smelling to learn about something.'],
                ['senses', 'The parts of the body that help us learn: eyes, ears, nose, tongue and skin.'],
                ['plant', 'A living thing that grows in soil and needs water and light.'],
                ['animal', 'A living thing that moves, eats and breathes.'],
                ['sorting', 'Putting similar things together in one group.']
              ],
              examples: [
                ['Why does a fish have fins?', ['We look at the fish in the picture.', 'We notice that it lives in water.', 'We say: the fins help it swim.'], 'Fins help the fish move through the water.'],
                ['How do we look after a cat?', ['We give it clean water and suitable food.', 'We clean its place and let it sleep quietly.', 'We do not pull its tail.'], 'Kindness means giving an animal water and food without hurting it.']
              ]
            }
          }
        }
      ]
    },
    'cur12': {
      shared: {
        sections: [
          ['Écouter et répéter', "Écoute bien le mot de la maîtresse, puis répète-le à voix haute. Le français a des sons qui ressemblent à ceux de l'arabe et d'autres qui sont nouveaux. Répéter aide à bien prononcer."],
          ['Lire les mots', 'Regarde les lettres une par une, puis lis le mot entier. En français, certaines lettres se prononcent ensemble, comme « ch » ou « ou ». Lis lentement avant d accélérer.'],
          ['Écrire avec soin', 'Écris les lettres dans le bon ordre et laisse un espace entre les mots. Commence par une majuscule au début de la phrase. Relis ton écriture pour vérifier.'],
          ['Utiliser en classe', "Dis une phrase courte à ton camarade et écoute sa réponse. Utilise « bonjour », « merci » et « s'il vous plaît » dans la vie de tous les jours. Parler souvent rend la langue plus facile."]
        ],
        vocab: [
          ['une couleur', 'Le rouge, le bleu, le vert : ce qui donne de la vie aux dessins.'],
          ['une forme', "Le carré, le cercle, le triangle : la forme d'un objet."],
          ['la famille', 'Les personnes qui vivent avec nous : le père, la mère, les frères et les sœurs.'],
          ['le marché', "L'endroit où l'on achète des fruits, des légumes et du pain."],
          ['un mot', 'Une petite unité de langue qui porte un sens.'],
          ['une phrase', 'Plusieurs mots qui forment une idée complète.']
        ],
        outcomes: [
          "L'élève nomme cinq couleurs en français.",
          "L'élève présente sa famille avec trois phrases simples.",
          "L'élève achète un objet au marché avec une phrase polie.",
          "L'élève relit sa production et corrige deux erreurs visibles."
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'Les couleurs et les formes',
          intro: "Aujourd'hui, nous nommons les couleurs et les formes que nous voyons dans la classe.",
          sections: [
            ['Les couleurs de la classe', "Regarde le tableau et les cahiers. Le ciel est bleu, la pomme est rouge et l'arbre est vert. Dis : « Je vois un crayon jaune. »"],
            ['Les formes autour de moi', "La porte est un rectangle, l'horloge est un cercle et le drapeau peut être un triangle. Toucher la forme avec le doigt aide à la reconnaître."]
          ],
          examples: [
            ['Nomme la couleur du drapeau marocain.', ['Je regarde le drapeau.', "Je vois la couleur rouge et l'étoile verte.", 'Je dis : le drapeau est rouge et vert.'], 'Le drapeau est rouge et vert.'],
            ['Quelle forme a une pièce de un dirham ?', ['Je prends la pièce dans ma main.', 'Je regarde son contour.', 'Je dis : elle est ronde.'], 'La pièce est un cercle.']
          ],
          questions: [
            ['Quelle couleur a la mer par une belle journée ?', ['Rouge', 'Bleue', 'Jaune', 'Violette'], 1, 'La mer apparaît bleue quand le ciel est dégagé ; les autres couleurs ne conviennent pas ici.'],
            ['Quelle forme a un ballon de football ?', ['Un carré', 'Un triangle', 'Un cercle', 'Un rectangle'], 2, 'Le ballon est rond : sa forme est un cercle, pas un carré ni un triangle.'],
            ["Comment dire poliment que l'on veut un crayon ?", ['Je veux un crayon.', "Je voudrais un crayon, s'il vous plaît.", 'Donne-moi le crayon.', 'Le crayon est là.'], 1, "« Je voudrais ... s'il vous plaît » est une formule polie ; les autres sont des ordres ou des constats."],
            ['Combien de couleurs peux-tu nommer ?', ['Une seule', 'Deux seulement', 'Cinq couleurs : rouge, bleu, vert, jaune, noir', 'Aucune'], 2, 'Nommer cinq couleurs montre que tu connais le vocabulaire de la leçon.']
          ]
        },
        {
          t: 'La famille et les amis',
          intro: 'Nous présentons les personnes que nous aimons : la famille et les camarades de classe.',
          sections: [
            ['Les membres de la famille', "Mon père s'appelle Karim et ma mère s'appelle Fatima. J'ai une sœur et un frère. En français, on dit « ma sœur » et « mon frère »."],
            ['Parler de soi', "Je dis mon prénom, mon âge et le nom de mon école. Je peux ajouter : « J'habite à Casablanca. » Une phrase courte suffit pour se présenter."]
          ],
          examples: [
            ['Présente ton frère en deux phrases.', ["Je dis son prénom : il s'appelle Youssef.", 'Je dis son âge : il a huit ans.', 'Je dis : « Il va à la même école que moi. »'], "Mon frère s'appelle Youssef, il a huit ans et il va à la même école que moi."],
            ['Comment remercier un camarade ?', ['Je regarde mon camarade.', 'Je dis : « Merci beaucoup. »', 'Je souris et je range mon cahier.'], 'On remercie avec « merci beaucoup » en regardant la personne.']
          ],
          questions: [
            ['Qui est « ma sœur » ?', ['Le frère de mon père', 'La fille de mes parents', 'La mère de ma mère', 'Mon camarade de classe'], 1, 'La sœur est la fille des mêmes parents ; les autres liens sont différents.'],
            ['Quelle phrase présente bien une personne ?', ['Lui est mon frère.', "Je m'appelle Sofia et j'ai sept ans.", "Elle aller à l'école.", 'Mon prénom quoi ?'], 1, "« Je m'appelle ... et j'ai ... ans » est une présentation claire et complète."],
            ["Que dis-tu quand quelqu'un t'aide ?", ['Merci beaucoup.', 'Tant pis.', 'Bonne nuit.', 'Au revoir.'], 0, '« Merci beaucoup » exprime la reconnaissance ; les autres expressions ont un autre sens.'],
            ["Quel mot complète : « J'... à Rabat. » ?", ['suis', 'habite', 'a', 'sont'], 1, 'Le verbe « habiter » convient avec « à » pour indiquer le lieu ; « suis » irait avec un nom ou un adjectif.']
          ]
        },
        {
          t: 'Au marché de Marrakech',
          intro: 'Nous allons au marché pour acheter des fruits. Nous apprenons à demander et à compter en dirhams.',
          sections: [
            ['Les fruits et les légumes', "Au marché, je vois des oranges, des dattes, des tomates et du pain. Je dis : « Je voudrais un kilo d'oranges, s'il vous plaît. » Le vendeur répond avec un sourire."],
            ['Demander et payer', 'Je demande le prix : « Combien coûte ce pain ? » Je donne cinq dirhams et je reçois la monnaie. Je vérifie mon achat avant de partir.']
          ],
          examples: [
            ['Achète un kilo de pommes.', ["Je m'approche du vendeur et je dis bonjour.", "Je dis : « Je voudrais un kilo de pommes, s'il vous plaît. »", 'Je paie et je dis merci.'], 'Une phrase polie et un paiement correct suffisent pour acheter.'],
            ['Combien coûtent deux pains à trois dirhams ?', ['Un pain coûte trois dirhams.', "J'ajoute : trois plus trois.", 'Je trouve six dirhams.'], 'Deux pains coûtent six dirhams.']
          ],
          questions: [
            ['Quel mot est poli au marché ?', ['Je veux ce pain.', "Je voudrais ce pain, s'il vous plaît.", 'Donne le pain.', 'Pain !'], 1, "« Je voudrais ... s'il vous plaît » est une demande polie, pas un ordre."],
            ['Tu as dix dirhams et tu achètes pour six dirhams. Combien reste-t-il ?', ['Deux dirhams', 'Quatre dirhams', 'Six dirhams', 'Seize dirhams'], 1, 'Dix moins six égale quatre ; il reste donc quatre dirhams.'],
            ['Quel mot désigne la monnaie du Maroc ?', ['Le dollar', 'Le dirham', "L'euro", 'La livre'], 1, "Le dirham est la monnaie du Maroc ; l'euro et le dollar sont d'autres monnaies."],
            ['Que fais-tu après avoir payé ?', ['Je pars sans rien dire', 'Je vérifie mon achat et je dis merci', 'Je rends les fruits', 'Je repousse le vendeur'], 1, 'Vérifier son achat et remercier montre de la politesse et évite les erreurs.']
          ]
        },
        {
          t: 'Révision : ce que je sais faire',
          intro: 'Nous révisons les mots et les phrases de la leçon. Ensuite, nous vérifions ce que nous savons faire.',
          sections: [
            ['Relire pour corriger', "Je relis ma phrase et je cherche les erreurs : une majuscule au début, un point à la fin, un espace entre les mots. Je corrige au crayon puis j'écris proprement."],
            ['Mon petit carnet de réussite', "Je coche ce que je sais faire : nommer cinq couleurs, présenter ma famille, acheter au marché. Si une case reste vide, je demanderai de l'aide à la maîtresse. Je m'entraîne encore avec plaisir."]
          ],
          examples: [
            ['Corrige : « je voudrais une pomme ».', ['Je regarde le début de la phrase.', 'Je mets une majuscule : « Je ».', 'J ajoute un point à la fin.'], 'Je voudrais une pomme.'],
            ['Fiche de révision : trouve trois mots de la famille.', ['Je cherche dans mon cahier.', 'J écris : père, mère, sœur.', 'Je lis les trois mots à voix haute.'], 'Père, mère et sœur sont trois mots de la famille.']
          ],
          questions: [
            ['Quelle phrase est bien écrite ?', ['je voudrais un pain', 'Je voudrais un pain.', 'je Voudrais un pain.', 'Je voudrais un pain point'], 1, 'La phrase commence par une majuscule et se termine par un point.'],
            ['Quel mot est un fruit ?', ['Une table', 'Une datte', 'Un crayon', 'Une porte'], 1, 'La datte est un fruit ; les autres mots désignent des objets.'],
            ['Quand dit-on « au revoir » ?', ['En arrivant', 'En partant', 'En mangeant', 'En dormant'], 1, "« Au revoir » est la formule utilisée au moment de quitter quelqu'un."],
            ['Que faire si je ne comprends pas un mot ?', ['Je devine sans rien dire', 'Je demande à la maîtresse', 'Je ferme le livre', 'Je change de page'], 1, 'Demander une explication aide à comprendre ; deviner sans vérifier laisse une erreur.']
          ]
        }
      ]
    },
    'cur20': {
      shared: {
        sections: [
          ['Escucha y repite', 'Escucha la palabra del profesor y repítela en voz alta. El español tiene sonidos parecidos a los del árabe y a los del francés. Repetir cada día ayuda a pronunciar mejor.'],
          ['Lee las palabras', 'Mira cada letra despacio y luego lee la palabra completa. En español, la h es muda y la ñ suena como « ni » en « niño ». Lee primero despacio y después más rápido.'],
          ['Escribe con cuidado', 'Escribe las letras en orden y deja un espacio entre las palabras. Las palabras empiezan con mayúscula al comienzo de la frase. Vuelve a leer lo que has escrito.'],
          ['Usa la lengua en clase', 'Di una frase corta a tu compañero y escucha su respuesta. Saluda con « hola » y da las gracias con « gracias ». Hablar seguido hace que la lengua sea más fácil.']
        ],
        vocab: [
          ['el color', 'Rojo, azul, verde: lo que da vida a los dibujos.'],
          ['la ropa', 'Camisa, pantalón, vestido: lo que llevamos puesto.'],
          ['la familia', 'Las personas que viven con nosotros: padre, madre, hermanos.'],
          ['el mercado', 'El lugar donde compramos fruta, verdura y pan.'],
          ['el dirham', 'La moneda de Marruecos.'],
          ['una frase', 'Varias palabras que forman una idea completa.']
        ],
        outcomes: [
          'El alumno nombra cinco colores en español.',
          'El alumno presenta a su familia con tres frases sencillas.',
          'El alumno pide un producto en el mercado con una frase corta.',
          'El alumno corrige dos errores visibles en su escritura.'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'Los colores y la ropa',
          intro: 'Hoy nombramos los colores y la ropa que llevamos a la escuela.',
          sections: [
            ['Los colores del aula', 'El cielo es azul, la manzana es roja y el árbol es verde. Mi cuaderno es amarillo. Digo: « Tengo una camisa blanca. »'],
            ['La ropa de cada día', 'Llevo pantalón, camisa y zapatos. Cuando llueve, uso un impermeable. En invierno me pongo un abrigo porque hace frío.']
          ],
          examples: [
            ['Di el color de la bandera de Marruecos.', ['Miro la bandera con atención.', 'Veo el rojo y la estrella verde.', 'Digo: « La bandera es roja y verde. »'], 'La bandera es roja y verde.'],
            ['Describe tu camisa.', ['Miro mi camisa.', 'Veo su color y su forma.', 'Digo: « Es una camisa azul. »'], 'Mi camisa es azul.']
          ],
          questions: [
            ['¿De qué color es el cielo despejado?', ['Rojo', 'Azul', 'Verde', 'Negro'], 1, 'El cielo despejado se ve azul; los demás colores no describen esa situación.'],
            ['¿Qué prenda se lleva en las piernas?', ['La camisa', 'El pantalón', 'El sombrero', 'El abrigo'], 1, 'El pantalón cubre las piernas, mientras que la camisa cubre el cuerpo.'],
            ['Completa: « Tengo ... camisa blanca. »', ['un', 'una', 'los', 'las'], 1, 'Camisa es femenino singular, por eso se usa el artículo « una ».'],
            ['¿Qué llevas cuando llueve?', ['Un abrigo', 'Un impermeable', 'Un sombrero de sol', 'Unas gafas'], 1, 'El impermeable protege de la lluvia; el abrigo protege del frío.']
          ]
        },
        {
          t: 'La familia y los amigos',
          intro: 'Presentamos a las personas que queremos: la familia y los compañeros de clase.',
          sections: [
            ['Mi familia', 'Mi padre se llama Karim y mi madre se llama Fatima. Tengo una hermana y un hermano. En español decimos « mi hermana » y « mi hermano ».'],
            ['Mis amigos', 'Mi amigo Ahmed es alto y simpático. Jugamos al fútbol en el patio. Compartimos los lápices y decimos « gracias » cuando alguien nos ayuda.']
          ],
          examples: [
            ['Presenta a tu hermana en dos frases.', ['Digo su nombre: « Se llama Sara. »', 'Digo su edad: « Tiene nueve años. »', 'Añado: « Va a mi escuela. »'], 'Mi hermana se llama Sara, tiene nueve años y va a mi escuela.'],
            ['Saluda a un amigo.', ['Me acerco y miro a mi amigo.', 'Digo: « Hola, buenos días. »', 'Pregunto: « ¿ Cómo estás ? »'], 'Un saludo amable incluye « hola » y una pregunta sencilla.']
          ],
          questions: [
            ['¿Quién es « mi hermana »?', ['La madre de mi madre', 'La hija de mis padres', 'Mi compañero de mesa', 'El hijo de mi tío'], 1, 'La hermana es la hija de los mismos padres; los demás parentescos son distintos.'],
            ['Completa: « Mi padre ... Karim. »', ['se llama', 'llama', 'se llaman', 'llamamos'], 0, 'Con « mi padre » (singular) se usa « se llama »; « se llaman » es para varias personas.'],
            ['¿Qué dices cuando alguien te ayuda?', ['Gracias', 'Buenas noches', 'Hasta luego', 'Perdón'], 0, '« Gracias » expresa agradecimiento; las otras expresiones sirven para despedirse o pedir perdón.'],
            ['¿Cómo es tu amigo si siempre comparte?', ['Generoso', 'Tímido', 'Lento', 'Serio'], 0, 'Compartir muestra generosidad; las otras palabras no describen esa acción.']
          ]
        },
        {
          t: 'En el mercado de Marruecos',
          intro: 'Vamos al mercado a comprar fruta. Aprendemos a pedir y a contar en dirhams.',
          sections: [
            ['La fruta del mercado', 'En el mercado veo naranjas, dátiles, tomates y pan. Digo: « Quiero un kilo de naranjas, por favor. » El vendedor sonríe y me atiende.'],
            ['Preguntar y pagar', 'Pregunto: « ¿ Cuánto cuesta este pan ? » Pago cinco dirhams y recibo el cambio. Compruebo mi compra antes de irme.']
          ],
          examples: [
            ['Compra un kilo de manzanas.', ['Me acerco al vendedor y digo hola.', 'Digo: « Quiero un kilo de manzanas, por favor. »', 'Pago y digo gracias.'], 'Con una frase corta y educada puedo comprar en el mercado.'],
            ['Dos panes cuestan tres dirhams cada uno. ¿ Cuánto es en total?', ['Un pan cuesta tres dirhams.', 'Sumo tres y tres.', 'Obtengo seis dirhams.'], 'Los dos panes cuestan seis dirhams.']
          ],
          questions: [
            ['¿Cuál es la moneda de Marruecos?', ['El euro', 'El dólar', 'El dirham', 'La libra'], 2, 'El dirham es la moneda marroquí; el euro y el dólar son de otros países.'],
            ['Tienes diez dirhams y gastas seis. ¿ Cuánto te queda?', ['Dos dirhams', 'Cuatro dirhams', 'Seis dirhams', 'Dieciséis dirhams'], 1, 'Diez menos seis son cuatro; por eso quedan cuatro dirhams.'],
            ['¿Qué frase es más educada?', ['Dame el pan.', 'Quiero el pan ya.', 'Quiero un pan, por favor.', 'El pan.'], 2, '« Por favor » convierte la petición en una frase educada.'],
            ['¿Qué hago después de pagar?', ['Me voy sin mirar', 'Compruebo la compra y doy las gracias', 'Devuelvo la fruta', 'Empujo al vendedor'], 1, 'Comprobar la compra y agradecer evita errores y muestra buenos modales.']
          ]
        },
        {
          t: 'Repaso: lo que sé hacer',
          intro: 'Repasamos las palabras de la unidad y comprobamos lo que sabemos hacer.',
          sections: [
            ['Releer para corregir', 'Leo mi frase y busco errores: mayúscula al principio, punto al final y espacio entre palabras. Corrijo con lápiz y luego escribo con cuidado en el cuaderno.'],
            ['Mi cuaderno de logros', 'Marco lo que ya sé: nombrar cinco colores, presentar a mi familia y comprar en el mercado. Si me falta algo, pido ayuda al profesor y practico otro día.']
          ],
          examples: [
            ['Corrige: « quiero un dátil ».', ['Miro el principio de la frase.', 'Pongo mayúscula: « Quiero ».', 'Añado un punto al final.'], 'Quiero un dátil.'],
            ['Encuentra tres palabras de la familia.', ['Busco en mi cuaderno.', 'Escribo: padre, madre, hermana.', 'Leo las tres palabras en voz alta.'], 'Padre, madre y hermana son tres palabras de la familia.']
          ],
          questions: [
            ['En la ficha de repaso, ¿qué frase está bien escrita?', ['quiero un pan', 'Quiero un pan.', 'quiero Un pan', 'Quiero un pan punto'], 1, 'La frase empieza con mayúscula y termina con un punto.'],
            ['¿Cuál de estas palabras es una fruta?', ['Una mesa', 'Un dátil', 'Un lápiz', 'Una puerta'], 1, 'El dátil es una fruta; las demás palabras son objetos.'],
            ['¿Cuándo decimos « adiós »?', ['Al llegar', 'Al irnos', 'Al comer', 'Al dormir'], 1, '« Adiós » es la palabra para despedirse al irse de un lugar.'],
            ['¿Qué hago si no entiendo una palabra?', ['Adivino sin preguntar', 'Pregunto al profesor', 'Cierro el libro', 'Cambio de página'], 1, 'Preguntar ayuda a comprender; adivinar sin comprobar deja un error.']
          ]
        }
      ]
    },
    'cur_l_pre_sub_fr': {
      shared: {
        sections: [
          ['Écouter avant de parler', 'Assieds-toi bien et écoute la maîtresse. Chaque mot français a un son particulier. Ferme les yeux et écoute encore une fois avant de répéter.'],
          ['Répéter avec la voix', "Répète le son lentement, puis plus vite. Clappe des mains en rythme avec les syllabes. Ta voix s'habitue aux nouveaux sons."],
          ['Regarder et montrer', "Regarde la lettre ou l'image, puis montre-la du doigt. Dis ce que tu vois avec un mot simple. Montrer aide à se souvenir."],
          ['Jouer ensemble', 'Joue avec tes camarades en disant les mots à tour de rôle. Une chanson ou un petit jeu rend la langue vivante. Amuse-toi sans faire de bruit.']
        ],
        vocab: [
          ['une lettre', "Un signe comme a, b, c que l'on écrit."],
          ['un son', "Ce que l'on entend quand on prononce une lettre ou un mot."],
          ['un mot', 'Une petite unité de langue qui a un sens.'],
          ['une chanson', "Un petit texte que l'on chante avec une mélodie."],
          ['une image', 'Un dessin qui montre une personne ou un objet.'],
          ['répéter', "Dire encore la même chose pour l'apprendre."]
        ],
        outcomes: [
          "L'élève reconnaît trois sons français à l'oreille.",
          "L'élève prononce cinq mots simples avec l'aide de la maîtresse.",
          "L'élève associe un mot à une image.",
          "L'élève chante une courte chanson en respectant le rythme."
        ],
        diagram: 'diagram-french-alphabet.svg'
      },
      lessons: [
        {
          t: 'Sons et lettres',
          intro: "Aujourd'hui, nous écoutons les sons du français et nous découvrons leurs lettres.",
          sections: [
            ["Les sons que j'entends", "J'écoute : a, o, i. Le son « a » est ouvert, le son « o » est rond. Je répète chaque son trois fois en clappant des mains."],
            ['Les lettres de mon prénom', 'Je regarde mon prénom écrit au tableau. La première lettre est une majuscule. Je montre la lettre « m » dans mon prénom et je dis son son.']
          ],
          examples: [
            ['Comment trouver le son de la lettre « s » ?', ["J'écoute la maîtresse dire « sss ».", 'Je place ma langue derrière mes dents.', 'Je répète : s, s, s.'], 'Le son de « s » est un souffle doux comme le serpent.'],
            ['Quelle lettre commence le mot « papa » ?', ['Je dis le mot lentement : p-a-p-a.', "J'écoute le premier son.", "Je vois que c'est la lettre p."], "C'est la lettre p."]
          ],
          questions: [
            ['Quel son entends-tu au début de « maman » ?', ['Le son a', 'Le son m', 'Le son o', 'Le son i'], 1, 'Le premier son de maman est bien le son m, quand les lèvres se ferment.'],
            ['Comment faut-il répéter un nouveau son ?', ['Très vite une fois', 'Lentement puis plus vite', 'En silence', 'En criant'], 1, 'Répéter lentement puis plus vite aide la bouche à bien placer le son.'],
            ['Que fait-on avec les mains pendant la chanson ?', ['On tape des mains en rythme', 'On cache ses oreilles', 'On écrit au tableau', 'On lève les pieds'], 0, 'Taper des mains en rythme aide à entendre les syllabes et le rythme.'],
            ['Quelle lettre est une majuscule ?', ['a', 'M', 'e', 'i'], 1, 'M est une grande lettre, donc une majuscule ; les autres sont en minuscule.']
          ]
        },
        {
          t: 'Mots simples',
          intro: 'Nous assemblons des sons pour dire des mots courts : papa, maman, bonjour.',
          sections: [
            ['Des mots de la vie quotidienne', "Je dis « papa », « maman », « bonjour », « merci ». Ces mots sont courts et je les entends souvent à la maison et à l'école."],
            ['Couper les mots en morceaux', "Je dis « bon-jour » en deux morceaux. Chaque morceau est une syllabe. Couper le mot aide à le lire et à l'écrire sans erreur."]
          ],
          examples: [
            ['Comment lire le mot « bonjour » ?', ['Je regarde les lettres une par une.', 'Je dis deux morceaux : bon et jour.', 'Je réunis : bonjour.'], 'On lit bonjour en deux syllabes : bon-jour.'],
            ['Quel mot dis-tu pour remercier ?', ["Je pense à la personne qui m'aide.", 'Je regarde cette personne.', 'Je dis : merci.'], 'Le mot pour remercier est merci.']
          ],
          questions: [
            ['Quel mot est un salut ?', ['Merci', 'Bonjour', 'Livre', 'Table'], 1, 'Bonjour sert à saluer ; merci sert à remercier, les deux autres sont des objets.'],
            ['Combien de syllabes dans « maman » ?', ['Une', 'Deux', 'Trois', 'Quatre'], 1, 'On coupe en ma-man : ce sont deux syllabes.'],
            ['Quel mot désigne une personne de la famille ?', ['Papa', 'Crayon', 'Fenêtre', 'Chien'], 0, 'Papa est un membre de la famille ; les autres mots désignent des objets ou un animal.'],
            ['Que faire après avoir entendu un nouveau mot ?', ['Le répéter à voix haute', 'Le cacher', 'Changer de place', 'Fermer les yeux'], 0, 'Répéter le mot le fixe dans la mémoire et entraîne la prononciation.']
          ]
        },
        {
          t: 'Chansons',
          intro: 'Les chansons aident à mémoriser les mots. Nous chantons une courte rime en respectant le rythme.',
          sections: [
            ['La rime des mots', 'Dans une chanson, certains mots se ressemblent à la fin : « loup » et « tout ». Ce sont des rimes. Elles aident à retenir le texte.'],
            ['Chanter en groupe', "Je chante avec mes camarades, ni trop vite ni trop fort. J'écoute le début et la fin de chaque phrase. Chanter ensemble donne confiance."]
          ],
          examples: [
            ['Trouver une rime avec « chat ».', ['Je dis le mot chat.', 'Je cherche un mot qui sonne pareil à la fin.', 'Je trouve : rat ou mat.'], 'Les mots rat et mat riment avec chat.'],
            ["Battre le rythme d'une chanson.", ["J'écoute la mélodie.", 'Je tape une fois par syllabe.', 'Je chante en suivant mes tapes.'], 'Les tapes aident à garder le rythme régulier.']
          ],
          questions: [
            ['Quel mot rime avec « loup » ?', ['Tout', 'Lait', 'Pain', 'Rose'], 0, 'Loup et tout se prononcent de la même façon à la fin.'],
            ['Pourquoi chanter en classe ?', ['Pour faire du bruit', 'Pour retenir les mots avec plaisir', 'Pour dormir', 'Pour écrire au tableau'], 1, 'La chanson associe les mots à une mélodie, ce qui aide la mémoire.'],
            ['Comment chanter avec les autres ?', ['Très fort pour être entendu', 'En suivant le même rythme', 'Sans écouter', 'Très vite'], 1, 'Suivre le même rythme permet au groupe de chanter ensemble.'],
            ['Quel est le contraire de « vite » dans une chanson ?', ['Lentement', 'Fort', 'Haut', 'Longtemps'], 0, 'Vite et lentement sont des contraires ; les autres mots parlent du volume ou du temps.']
          ]
        },
        {
          t: 'Images',
          intro: 'Nous regardons des images et nous nommons ce que nous voyons avec un mot ou une phrase courte.',
          sections: [
            ['Nommer ce que je vois', "Je regarde l'image d'un arbre. Je dis : « C'est un arbre. » Je peux ajouter : « Il est vert. » Une image aide à trouver le mot."],
            ['Associer mot et image', "La maîtresse montre trois images : un chat, un pain, une fleur. Je lève la main quand j'entends le mot « fleur ». Je vérifie avec le doigt."]
          ],
          examples: [
            ["Quel mot convient pour cette image d'une pomme ?", ['Je regarde la forme ronde et la couleur.', 'Je pense au mot que je connais.', "Je dis : c'est une pomme."], 'Le mot pomme désigne ce fruit.'],
            ["Comment montrer que tu as reconnu l'image ?", ['Je lève la main sans crier.', 'Je dis le mot : « chat ».', "Je montre l'image du doigt."], 'Lever la main et dire le mot suffisent.']
          ],
          questions: [
            ['Quel mot désigne cet animal qui miaule ?', ['Un chien', 'Un chat', 'Un oiseau', 'Un poisson'], 1, "Le chat est l'animal qui miaule ; les autres animaux ont des voix différentes."],
            ["Quel mot complète : « C'est ... arbre. » ?", ['un', 'une', 'le', 'des'], 0, "Arbre est masculin singulier, donc on dit « c'est un arbre »."],
            ["Que faire si tu ne connais pas le mot de l'image ?", ['Demander à la maîtresse', 'Fermer les yeux', 'Rire', 'Tourner la page'], 0, 'Demander aide à apprendre le nouveau mot sans rester dans le doute.'],
            ['Quelle phrase décrit bien une fleur ?', ['Elle est verte et elle court.', 'Elle est belle et elle sent bon.', 'Elle mange du pain.', 'Elle écrit un mot.'], 1, 'Une fleur est belle et parfumée ; les autres phrases ne lui conviennent pas.']
          ]
        }
      ]
    },
    'cur_l_p1_sub_fr': {
      shared: {
        sections: [
          ['Observer la forme des lettres', 'Regarde la lettre imprimée, puis la lettre manuscrite. Certaines lettres se ressemblent, comme b et d. Compare-les avant de les écrire.'],
          ['Écouter le son des lettres', 'Chaque lettre a un nom et un son. Le nom de a est « a » et son son est aussi « a ». Écoute bien avant de répéter.'],
          ['Lire à voix haute', 'Lis lentement en montrant chaque mot du doigt. La voix aide à entendre les sons et à reconnaître les mots. Ne te presse pas.'],
          ['Réutiliser les mots', 'Dis les mots appris dans une nouvelle phrase. Parle de ton sac, de ta maison ou de ton repas. Réutiliser rend le vocabulaire solide.']
        ],
        vocab: [
          ["l'alphabet", 'Les lettres qui servent à écrire le français, de a à z.'],
          ['une lettre', 'Un signe comme a, b ou z.'],
          ['un mot', 'Un ensemble de lettres qui a un sens.'],
          ['une phrase', 'Des mots qui forment une idée complète.'],
          ['une image', 'Un dessin qui représente un objet ou une personne.'],
          ['écouter', 'Faire attention aux sons avec les oreilles.']
        ],
        outcomes: [
          "L'élève reconnaît les lettres de son prénom.",
          "L'élève associe cinq mots à des images.",
          "L'élève écrit une phrase simple avec une majuscule et un point.",
          "L'élève répond à une courte consigne orale."
        ],
        diagram: 'diagram-french-alphabet.svg'
      },
      lessons: [
        {
          t: 'Alphabet',
          intro: "Nous découvrons les lettres de l'alphabet français et leur son.",
          sections: [
            ['De A comme Allemagne à Z', "L'alphabet français compte vingt-six lettres. Je connais déjà les lettres de mon prénom. Je repère A, M et Z sur l'affiche du mur."],
            ['Les lettres qui se ressemblent', 'Les lettres b et d ne sont pas pareilles : le b a le ventre à droite, le d à gauche. Je les écris lentement et je les compare.']
          ],
          examples: [
            ['Trouve les lettres de ton prénom.', ['Je dis mon prénom : Sofia.', "Je cherche S, o, f, i, a sur l'affiche.", 'Je les écris dans mon cahier.'], 'Les lettres S, o, f, i, a composent le prénom Sofia.'],
            ['Distingue b et d.', ['Je regarde le b : son ventre est à droite.', 'Je regarde le d : son ventre est à gauche.', "J'écris : b, d, b, d."], 'Le sens du ventre permet de ne pas confondre b et d.']
          ],
          questions: [
            ["De A à Z, combien de lettres compte l'alphabet que nous étudions ?", ['Vingt', 'Vingt-quatre', 'Vingt-six', 'Trente'], 2, "L'alphabet français va de a à z, soit vingt-six lettres."],
            ['Quelle lettre commence le mot « école » ?', ['E', 'A', 'O', 'I'], 0, 'Le mot école commence par la lettre e, avec un accent aigu.'],
            ['Comment distinguer b et d ?', ['Elles sont identiques', 'Par le côté du ventre', 'Par leur couleur', 'Par leur taille toujours'], 1, 'Le ventre du b est à droite et celui du d à gauche.'],
            ['Que faire pour apprendre une lettre ?', ["La regarder, l'écrire et la dire", 'La cacher', 'La colorier sans la lire', 'Ne pas la regarder'], 0, 'Voir, écrire et prononcer la lettre la fixe mieux dans la mémoire.']
          ]
        },
        {
          t: 'Mots et images',
          intro: 'Nous associons des mots simples à des images pour mieux les retenir.',
          sections: [
            ['Le mot et le dessin', 'Une image de pomme me rappelle le mot « pomme ». Je regarde le dessin, je dis le mot, puis je le lis. Les trois étapes vont ensemble.'],
            ['Classer les images', "Je range les images des fruits d'un côté et celles des animaux de l'autre. Ce rangement m'aide à retrouver les mots plus vite."]
          ],
          examples: [
            ['Associe le mot « chat » à la bonne image.', ['Je lis le mot chat.', 'Je regarde les trois images.', 'Je montre celle du chat qui miaule.'], 'La bonne image est celle du chat.'],
            ["Écris le mot sous l'image d'une fleur.", ["Je regarde l'image et je dis fleur.", "J'écoute les sons : f-l-e-u-r.", "J'écris le mot au crayon."], "Le mot fleur est écrit sous l'image."]
          ],
          questions: [
            ["Quel mot correspond à l'image d'un chien ?", ['Chat', 'Chien', 'Oiseau', 'Livre'], 1, "L'image montre un chien ; les autres mots désignent un autre animal ou un objet."],
            ["Que faire avant d'écrire un mot ?", ['Le dire à voix haute', "L'effacer", 'Le cacher', 'Changer de cahier'], 0, "Dire le mot permet d'entendre ses sons et de mieux les écrire."],
            ['Où range-t-on les images de fruits ?', ['Avec les animaux', 'Dans un groupe de fruits', 'Sous la table', "Dans le sac de l'ami"], 1, 'Classer par groupe rassemble les mots qui vont ensemble.'],
            ['Combien de mots peux-tu lire dans « papa mange » ?', ['Un', 'Deux', 'Trois', 'Quatre'], 1, 'Il y a deux mots : papa et mange.']
          ]
        },
        {
          t: 'Phrases simples',
          intro: 'Nous mettons des mots ensemble pour écrire une phrase courte et correcte.',
          sections: [
            ['La majuscule et le point', "Une phrase commence par une grande lettre et se termine par un point. J'écris : « Le chat dort. » La majuscule est sur Le et le point est après dort."],
            ['Les mots dans le bon ordre', "Je dis qui fait l'action, puis l'action. « Maman lit » est clair. Si je mélange les mots, la phrase devient difficile à comprendre."]
          ],
          examples: [
            ['Écris une phrase avec « papa » et « pain ».', ['Je choisis un verbe : mange.', 'Je mets une majuscule au début.', "J'ajoute un point à la fin."], 'Papa mange du pain.'],
            ['Corrige : « le chien court ».', ['Je regarde la première lettre.', 'Je remplace l par L.', 'Je mets un point.'], 'Le chien court.']
          ],
          questions: [
            ["Dans une phrase simple, qu'est-ce qui vient en premier ?", ['Une minuscule', 'Une majuscule', 'Un point', 'Une virgule'], 1, "La première lettre d'une phrase est toujours une majuscule."],
            ['Dans la leçon « Phrases simples », quelle phrase est correcte ?', ['le chat dort', 'Le chat dort.', 'Le Chat dort', 'chat le dort point'], 1, 'Elle a une majuscule au début et un point à la fin.'],
            ['Quel mot complète : « Je ... une pomme. » ?', ['mange', 'manges', 'mangent', 'manger'], 0, 'Avec « je », on écrit « mange ». Les autres formes vont avec tu, il/elle ou eux.'],
            ["Que faut-il ajouter à la fin d'une phrase ?", ['Un point', 'Une majuscule', 'Un espace', 'Une image'], 0, 'Le point marque la fin de la phrase et aide à la lire.']
          ]
        },
        {
          t: 'Compréhension orale',
          intro: 'Nous écoutons une courte phrase, puis nous montrons ou nous répétons ce que nous avons compris.',
          sections: [
            ["Écouter jusqu'au bout", "Quand la maîtresse parle, je ne coupe pas la phrase. J'écoute le début, le milieu et la fin. Ensuite seulement je réponds."],
            ['Montrer sans parler', 'Si je ne trouve pas encore les mots, je peux montrer la bonne image du doigt. Comprendre avec les yeux est une première étape. Après, je dirai le mot.']
          ],
          examples: [
            ['Consigne : « Montre la porte. »', ["J'écoute toute la consigne.", 'Je regarde les images de la classe.', 'Je montre la porte du doigt.'], "J'ai montré la porte, donc j'ai compris la consigne."],
            ['Consigne : « Donne-moi le livre. »', ["J'écoute le mot livre.", 'Je prends le livre sur la table.', 'Je le donne à la maîtresse.'], 'Donner le livre montre que la consigne est comprise.']
          ],
          questions: [
            ['Que fait-on quand la maîtresse donne une consigne ?', ["On écoute jusqu'au bout", 'On parle en même temps', 'On regarde par la fenêtre', 'On sort de la classe'], 0, 'Écouter toute la consigne évite de faire une erreur.'],
            ['Si tu ne connais pas le mot, que peux-tu faire ?', ['Montrer la bonne image', 'Fermer les oreilles', "Dire n'importe quoi", 'Partir'], 0, "Montrer l'image est une bonne façon de prouver que l'on a compris."],
            ['Quel mot entends-tu dans « Le chat boit du lait » ?', ['Un chien', 'Un chat', 'Un oiseau', 'Un poisson'], 1, 'La phrase parle bien du chat qui boit du lait.'],
            ['Comment vérifier que tu as compris ?', ["En refaisant l'action demandée", 'En riant', 'En écrivant au tableau', 'En courant'], 0, "Faire l'action demandée montre directement que la consigne est comprise."]
          ]
        }
      ]
    },
    'cur_l_p2_sub_ar': {
      shared: {
        sections: [
          ['القراءة بتمعن', 'نقرأ النص مرة بهدوء ومرة أخرى بصوت عالٍ. نلاحظ الكلمات الجديدة ونسأل عن معناها. القراءة الجيدة تبدأ بالفهم لا بالسرعة.'],
          ['الفكرة الرئيسة', 'كل نص يحمل فكرة أساسية يبني عليها بقية الجمل. نسأل: عن ماذا يتحدث النص؟ إذا أجبنا بجملة قصيرة فقد وجدنا الفكرة الرئيسة.'],
          ['التفاصيل الداعمة', 'بعد الفكرة نبحث عن التفاصيل: أسماء الأشخاص، والأماكن، والأحداث. كل تفصيل يزيد فهمنا وضوحا ويساعدنا على الإجابة.'],
          ['الإجابة بوضوح', 'نجيب بجملة كاملة تدل على الفهم، لا بكلمة مبهمة. نعود إلى النص إذا احتجنا إلى دليل. الإجابة الصادقة تعتمد على ما ورد في النص.']
        ],
        vocab: [
          ['النص', 'مجموعة جمل مترابطة تحمل معنى.'],
          ['الفكرة الرئيسة', 'المعنى الأساسي الذي يدور حوله النص.'],
          ['التفصيل', 'معلومة صغيرة توضح الفكرة وتدعمها.'],
          ['الجملة', 'كلمات مترابطة تعني معنى تاما.'],
          ['الإملاء', 'كتابة الكلمات كتابة صحيحة بالشكل والهمزة والتنوين.'],
          ['علامة الترقيم', 'علامة مثل النقطة والفاصلة التي تنظم القراءة.']
        ],
        outcomes: [
          'يقرأ الطالب نصا قصيرا بصوت واضح دون تكرار كثير.',
          'يحدد الطالب الفكرة الرئيسة في جملة واحدة.',
          'يستخرج الطالب تفصيلين من النص.',
          'يكتب الطالب جملا سليمة مع مراعاة الإملاء.'
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'نص: حديقة جدّي',
          intro: 'نقرأ اليوم نصا قصيرا عن حديقة جدّي في البستان، ثم نجيب عن أسئلة بسيطة.',
          sections: [
            ['النص: في البستان', 'في الصباح ذهبتُ مع جدّي إلى البستان. رأيتُ شجرة زيتون كبيرة وتحتها ظلّ وارٍ. سقيتُ النباتات بالماء وجمعتُ الأوراق في سلة صغيرة.'],
            ['معنى الكلمات الجديدة', 'كلمة « بستان » تعني حديقة فيها أشجار مثمرة. وكلمة « وارٍ » تعني ظلّا يقي من الشمس. نفهم الكلمة من الجملة التي جاءت فيها.']
          ],
          examples: [
            ['أين ذهب الطفل في الصباح؟', ['أقرأ الجملة الأولى: ذهبتُ مع جدّي.', 'أحدد المكان بعد كلمة « إلى ».', 'أكتب: ذهب إلى البستان.'], 'ذهب الطفل إلى البستان مع جدّي.'],
            ['ماذا فعل الطفل مع الأوراق؟', ['أبحث عن كلمة « الأوراق » في النص.', 'أقرأ ما بعدها: جمعتُها في سلة.', 'أجيب بجملة كاملة.'], 'جمع الأوراق في سلة صغيرة.']
          ],
          questions: [
            ['من ذهب مع الطفل إلى البستان؟', ['أخوه', 'جدّه', 'صديقه', 'المعلّمة'], 1, 'النص يقول: ذهبتُ مع جدّي، إذن المرافق هو الجدّ.'],
            ['ماذا رأى الطفل تحت شجرة الزيتون؟', ['ظلّا واريا', 'قطا صغيرا', 'دراجة', 'مطرا'], 0, 'الجملة تقول: وتحتها ظلّ وارٍ، أي مكان مظلل يقي من الشمس.'],
            ['ماذا سقى الطفل؟', ['القط', 'النباتات', 'الحصان', 'الطيور'], 1, 'يقول النص: سقيتُ النباتات بالماء، والباقي غير مذكور.'],
            ['أي جملة تلخّص النص؟', ['الطفل يلعب بالكرة.', 'الطفل يساعد جدّه في البستان.', 'الطفل يشتري حلوى.', 'الطفل يركب الحافلة.'], 1, 'النص يجمع العمل مع الجدّ وسقي النباتات، وهذا هو ملخّصه.']
          ]
        },
        {
          t: 'الفكرة الرئيسة والتفاصيل',
          intro: 'بعد القراءة نبحث عن الفكرة الأساسية ثم عن التفاصيل التي تدعمها.',
          sections: [
            ['السؤال عن الفكرة', 'نسأل أنفسنا: ما الذي يريد الكاتب أن يقوله؟ نختار جملة واحدة موجزة. إذا لم نجدها مباشرة نستنتجها من مجموع الجمل.'],
            ['تمييز التفصيل من الفكرة', 'الفكرة عامة مثل: الربيع جميل. والتفصيل خاص مثل: تزهر الورود في الربيع. التفصيل يأتي بعد الفكرة ليشرحها.']
          ],
          examples: [
            ['استخرج الفكرة من فقرة عن النظافة.', ['أقرأ الفقرة مرتين.', 'ألاحظ تكرار كلمة النظافة.', 'أكتب: النظافة تحمي صحتنا.'], 'الفكرة الرئيسة: النظافة تحمي صحتنا.'],
            ['ميّز التفصيل في النص السابق.', ['أقرأ الجملة: غسلنا اليدين قبل الأكل.', 'أسأل: هل هذه فكرة عامة أم مثال؟', 'أقول: هي تفصيل يوضّح النظافة.'], 'غسل اليدين تفصيل يدعم فكرة النظافة.']
          ],
          questions: [
            ['ما الفكرة الرئيسة في نص يتكرر فيه ذكر الماء والزرع؟', ['أهمية الماء للزراعة', 'لون السماء', 'شراء الحلوى', 'ركوب الدراجة'], 0, 'تكرار الماء والزرع يدل على أن الكاتب يريد بيان أهمية الماء للنبات.'],
            ['أي جملة تفصيل؟', ['الربيع فصل جميل.', 'تزهر الورود في الربيع.', 'أحب الفصول.', 'الوقت يمضي.'], 1, 'الجملة الثانية تعطي مثالا محددا، بينما البقية أفكار عامة.'],
            ['كيف نصل إلى الفكرة إذا لم تكن مكتوبة؟', ['نستنتجها من مجموع الجمل', 'نختار أول كلمة فقط', 'نعدّ النقاط', 'نقرأ العنوان ونتوقف'], 0, 'مجموع الجمل يدل على المعنى العام حتى لو لم يصرّح به الكاتب.'],
            ['لماذا نحتاج التفاصيل؟', ['لتوضيح الفكرة وإثباتها', 'لزيادة عدد الكلمات فقط', 'لتغيير العنوان', 'لتجنب القراءة'], 0, 'التفاصيل تعطي أمثلة وأدلة تجعل الفكرة مفهومة ومقنعة.']
          ]
        },
        {
          t: 'أكتب جملا واضحة',
          intro: 'نتدرب على كتابة جمل قصيرة صحيحة التركيب، ثم نرتبها في فقرة.',
          sections: [
            ['ركائز الجملة', 'الجملة المفيدة تحتاج إلى فاعل وفعل. تقول: الطفلُ يقرأُ. إذا قلت: يقرأُ، فالكلام ناقص. نحرص على ترتيب الكلمات ترتيبا يعقل.'],
            ['ربط الجمل', 'نربط الجمل ببعضها باستخدام « ثم » و« و ». نقول: ذهبتُ إلى السوق، ثم اشتريتُ تمرا. الربط يجعل الكلام سهلا ومتصلا.']
          ],
          examples: [
            ['اكتب جملة عن المطر.', ['أختار الفاعل: المطرُ.', 'أختار الفعل: يهطلُ.', 'أكتب: المطرُ يهطلُ على الأشجار.'], 'المطرُ يهطلُ على الأشجار.'],
            ['اربط جملتين بالواو.', ['أكتب: فتحتُ الباب.', 'أضيف: دخلتُ الغرفة.', 'أربط: فتحتُ البابَ ودخلتُ الغرفةَ.'], 'فتحتُ البابَ ودخلتُ الغرفةَ.']
          ],
          questions: [
            ['أي جملة كاملة؟', ['الولدُ', 'يكتبُ', 'الولدُ يكتبُ', 'في الدفتر'], 2, 'الجملة الكاملة تحتاج فاعلا وفعلا، و« الولدُ يكتبُ » تتحقق فيهما.'],
            ['ما أثر كلمة « ثم » في الكلام؟', ['تدل على ترتيب الأحداث', 'تدل على التعجب', 'تدل على السؤال', 'تلغي الجملة'], 0, '« ثم » تفيد تعاقب الأحداث وتنظيمها زمنيا.'],
            ['اختر الجملة الأوضح.', ['كتب الولد في دفتره وقرأ.', 'دفتره كتب الولد وقرأ.', 'الولد كتب دفتره في.', 'في كتب الولد دفتره.'], 0, 'الترتيب الطبيعي: فاعل ثم فعل ثم مفعول، مع وصل واضح.'],
            ['كيف نجعل كتابتنا أفضل؟', ['نقرأ ما كتبنا ونصلحه', 'نكتب بسرعة دون نظر', 'نحذف كل الأفعال', 'نكرر الكلمة نفسها'], 0, 'إعادة القراءة تكشف النقص والإملاء الخاطئ فتصححه.']
          ]
        },
        {
          t: 'الإملاء الصحيح',
          intro: 'نتدرب على كتابة الهمزة والتنوين وعلامات الترقيم كتابة صحيحة.',
          sections: [
            ['همزة القطع والوصل', 'نكتب « أسد » بهمزة قطع في البداية، و« الولد » بألف وصل. نتعرفهما من النطق ومن حركتها. الإملاء الصحيح يجعل القراءة أسهل.'],
            ['علامات الترقيم', 'نضع نقطة في نهاية الجملة، وفاصلة بين أفكار متصلة. علامة الاستفهام تأتي بعد سؤال. الترقيم ينظّم المعنى ويوقف القارئ في موضعه.']
          ],
          examples: [
            ['اكتب كلمة « أسد » إملاء صحيحا.', ['أسمع الهمزة في البداية.', 'أكتب ألفا فوقها همزة.', 'أكمل: س، د.'], 'أسد.'],
            ['ضع علامة الترقيم المناسبة.', ['أقرأ: هل ذهبت إلى المدرسة', 'ألاحظ أنها جملة استفهام.', 'أضع علامة الاستفهام في النهاية.'], 'هل ذهبت إلى المدرسة؟']
          ],
          questions: [
            ['كيف نكتب « أسد » في البداية؟', ['بألف وصل', 'بهمزة قطع', 'بواو', 'بياء'], 1, 'تُكتب بهمزة قطع لأن الهمزة تُنطق في الابتداء.'],
            ['ما علامة نهاية الجملة الخبرية؟', ['علامة الاستفهام', 'النقطة', 'الفاصلة', 'النقطتان'], 1, 'الجملة الخبرية تُختم بنقطة، أما الاستفهام فعلامته الخاصة.'],
            ['أي كلمة فيها تنوين بالفتح؟', ['كتابٌ', 'كتابًا', 'كتابِ', 'الكتاب'], 1, 'التنوين بالفتح يُكتب على شكل ألف فوقها علامة، كما في كتابًا.'],
            ['لماذا نهتم بالإملاء؟', ['ليقرأ الآخرون كلامنا بوضوح', 'لنزيد عدد الكلمات', 'لنغير المعنى قصدا', 'لنتجنب القراءة'], 0, 'الإملاء الصحيح يمنع اللبس ويجعل النص مقروءا ومفهوما.']
          ]
        }
      ]
    },
    'cur_l_p2_sub_sport': {
      shared: {
        sections: [
          ['الجسم في حركة', 'جسمنا يتحرك بعضلات ومفاصل. نمشي ونجري ونقفز، وكل حركة تستخدم جزءا من الجسم. نبدأ بالإحماء قبل كل نشاط.'],
          ['الإحماء والتهدئة', 'نبدأ بتمارين خفيفة للذراعين والساقين، ثم ننتهي بتمارين تهدئة. الإحماء يهيّئ الجسم ويقلل التعب. نتنفس بعمق أثناء التهدئة.'],
          ['قواعد اللعب', 'لكل لعبة قواعد تحمي اللاعبين وتجعل اللعب عادلا. نستمع إلى المعلّم ونحترم دور الجميع. الفريق ينجح عندما يلتزم أفراده بالقواعد.'],
          ['الصحة والأمان', 'نشرب الماء بعد الجري، ونرتدي ملابس مريحة وحذاء مناسبا. إذا ألمنا موضعا نخبر المعلّم فورا. الرياضة تجعلنا أقوياء عندما نمارسها بأمان.']
        ],
        vocab: [
          ['الإحماء', 'تمارين خفيفة نبدأ بها قبل النشاط الرياضي.'],
          ['المفصل', 'الموضع الذي يلتقي فيه عظمان ويسمح بالحركة.'],
          ['العضلة', 'جزء في الجسم يساعدنا على الحركة.'],
          ['الفريق', 'مجموعة لاعبين يعملون معا لتحقيق هدف.'],
          ['القاعدة', 'تعليمات ملزمة تنظّم اللعب وتحمي اللاعبين.'],
          ['التهدئة', 'تمارين هادئة نختم بها النشاط.']
        ],
        outcomes: [
          'يؤدي الطالب خمس حركات أساسية بصورة صحيحة.',
          'يشرح الطالب قاعدة لعبة جماعية.',
          'يتعاون الطالب مع فريقه أثناء اللعب.',
          'يطبّق الطالب قواعد الأمان والصحة بعد النشاط.'
        ],
        diagram: 'diagram-body.svg'
      },
      lessons: [
        {
          t: 'حركات الجسم الأساسية',
          intro: 'نتعرف إلى حركات الجسم الأساسية ونتدرب عليها في الساحة.',
          sections: [
            ['حركات الأطراف', 'نرفع الذراعين إلى الأعلى، ثم نمدّهما إلى الجانبين. نركل الكرة بالقدم، ونقفز على قدم واحدة ثم على القدمين. كل حركة تمرّن عضلة مختلفة.'],
            ['المشي والجري والقفز', 'المشي خطوات هادئة، والجري خطوات سريعة. عند القفز نثني الركبتين قبل النزول حتى لا نؤذي أنفسنا. نحافظ على مسافة بيننا وبين زملائنا.']
          ],
          examples: [
            ['أدّ تمرين الإحماء للذراعين.', ['أقف منتصبا والقدمان متباعدتان.', 'أدير الذراعين أمامي عشر مرات.', 'أمدّ الذراعين جانبا وأخفضهما ببطء.'], 'أحمّيت الذراعين دون إجهاد.'],
            ['كيف أقفز بأمان؟', ['أنظر إلى المكان الذي سأنزل فيه.', 'أثني ركبتيّ قبل القفز.', 'أنزل على قدميّ معا وأثني الركبتين.'], 'الهبوط على القدمين مع ثني الركبتين يحمي المفاصل.']
          ],
          questions: [
            ['ما الفرق بين المشي والجري؟', ['المشي أسرع', 'الجري خطواته أسرع', 'لا فرق بينهما', 'المشي فيه قفز'], 1, 'الجري يزيد سرعة الخطوات، أما المشي فهدوءه أكبر.'],
            ['لماذا نثني الركبتين عند النزول من القفز؟', ['لنبدو أطول', 'لتخفيف الضغط على المفاصل', 'لنركض أسرع', 'لأن المعلمة تأمر بذلك'], 1, 'ثني الركبتين يمتصّ الصدمة ويحمي مفصل الركبة.'],
            ['أي جزء الجسم نستخدمه لرفع الذراعين؟', ['القدم', 'العضلات في الكتف والذراع', 'الرأس', 'البطن فقط'], 1, 'رفع الذراع يتم بعضلات الكتف والذراع حول المفصل.'],
            ['متى نؤدي الإحماء؟', ['بعد النشاط فقط', 'قبل النشاط', 'أثناء النوم', 'عند الأكل'], 1, 'الإحماء قبل النشاط يهيّئ العضلات ويقلّل الإصابات.']
          ]
        },
        {
          t: 'ألعاب الساحة والفريق',
          intro: 'نتعرف إلى ألعاب جماعية بسيطة ونتدرب على قواعدها.',
          sections: [
            ['كرة القدم الصغيرة', 'نقسم إلى فريقين، وكل فريق يحاول إدخال الكرة في الهدف. نلمس الكرة بالقدم، ولا نستخدم اليد داخل منطقة اللعب. لا يتحقق الفوز إلا بتمرير الكرة إلى الزملاء.'],
            ['لعبة الحجل والقفز', 'نرسم دوائر على الأرض بالطباشير، ونقفز من دائرة إلى أخرى على قدم واحدة. من يخرج من الدائرة يعيد المحاولة بهدوء. اللعبة تنمّي التوازن والتركيز.']
          ],
          examples: [
            ['اشرح قاعدة لمس الكرة.', ['أقول: نلمس الكرة بالقدم داخل الملعب.', 'أضيف: لا نلمسها باليد.', 'أذكر: من يخالف يعيد الكرة للفريق الآخر.'], 'القاعدة: استخدام القدم فقط داخل الملعب.'],
            ['كيف نلعب لعبة الحجل؟', ['نرسم دوائر متتالية.', 'نقفز في كل دائرة على قدم واحدة.', 'نصل إلى الآخر ثم نبدأ من جديد.'], 'اللعبة تعتمد على القفز المتوازن بين الدوائر.']
          ],
          questions: [
            ['أي سلوك مخالف لقواعد كرة القدم؟', ['تمرير الكرة للزميل', 'لمس الكرة باليد في الملعب', 'الركض خلف الكرة', 'التمريرة القصيرة'], 1, 'قاعدة اللعبة تمنع لمس الكرة باليد داخل الملعب لغير حارس المرمى.'],
            ['ما الذي تنمّيه لعبة الحجل؟', ['التوازن والتركيز', 'النوم', 'الكتابة', 'الرسم'], 0, 'القفز على قدم واحدة بين الدوائر يدرّب التوازن والانتباه.'],
            ['لماذا نحتاج إلى قواعد في كرة القدم ولعبة الحجل؟', ['لجعل اللعب عادلا وآمنا', 'لزيادة عدد اللاعبين', 'لتقليل الوقت', 'لتغيير الملعب'], 0, 'القواعد تمنع الفوضى وتحمي اللاعبين وتحافظ على العدل.'],
            ['ماذا نفعل إذا سقط زميل أثناء اللعب؟', ['نواصل اللعب', 'نساعده وننادي المعلّم', 'نضحك', 'ندفعه للنهوض بعنف'], 1, 'مساعدة الزميل وإعلام المعلّم أولوية قبل متابعة اللعب.']
          ]
        },
        {
          t: 'العمل الجماعي في الرياضة',
          intro: 'الرياضة الجماعية تتطلب التعاون والاحترام بين أعضاء الفريق.',
          sections: [
            ['كل لاعب له دور', 'في الفريق حارس ومهاجم ومدافع. كل دور مهم، ولا ينجح الفريق إلا إذا أدى الجميع دوره. نشجّع الزميل إذا أخطأ بدل لومه.'],
            ['الإنصات والقرار', 'نستمع إلى إشارة المعلّم وإلى زملائنا قبل التحرك. نقرر معا متى نمرّر الكرة ومتى نتحرك. القرار الجماعي أفضل من القرار الفردي.']
          ],
          examples: [
            ['كيف نتعاون في تمرير الكرة؟', ['أنظر إلى زملائي في المواقع المختلفة.', 'أختار الزميل الأقرب إلى الهدف.', 'أمرّر الكرة إليه وأتحرك لاستعادتها.'], 'التمرير مع الحركة يعزز تعاون الفريق.'],
            ['ماذا نقول لزميل أخطأ؟', ['أقترب منه بهدوء.', 'أقول: لا بأس، حاول مرة أخرى.', 'أعود إلى مكاني مستعدا.'], 'التشجيع يرفع معنويات الفريق ويحافظ على جو اللعب.']
          ],
          questions: [
            ['ما أهمية تعدد الأدوار في الفريق؟', ['كل دور يكمل الآخر', 'الأدوار تقلل عدد اللاعبين', 'الأدوار تمنع اللعب', 'الأدوار كلها متشابهة'], 0, 'اختلاف الأدوار يغطي احتياجات الفريق ويجعل العمل الجماعي ناجحا.'],
            ['كيف نتعامل مع خطأ زميل؟', ['نوبّخه', 'نشجّعه ونواصله', 'نترك الفريق', 'نضحك عليه'], 1, 'التشجيع يحافظ على ثقة الزميل ويبقي الفريق متعاونا.'],
            ['ما معنى الإنصات في الفريق؟', ['الاستماع للتعليمات قبل التحرك', 'الصمت الدائم', 'الركض بلا توقف', 'تجاهل المعلّم'], 0, 'الإنصات يعني فهم الإشارة والتعليمات قبل اتخاذ الحركة.'],
            ['أي تصرف يدل على روح الفريق؟', ['اللعب منفردا دائما', 'حجز الكرة لنفسه', 'تمرير الكرة للزميل الأفضل موقعا', 'الانسحاب عند التعب'], 2, 'اختيار الزميل الأفضل موقعا يخدم مصلحة الفريق لا مصلحة فرد.']
          ]
        },
        {
          t: 'الصحة والأمان في الرياضة',
          intro: 'الرياضة مفيدة إذا مارسناها بطريقة صحيحة وآمنة.',
          sections: [
            ['الماء والملابس المناسبة', 'نشرب الماء قبل النشاط وبعده بكميات صغيرة. نرتدي قميصا مريحا وحذاء يثبت القدم. في الشمس نضع قبعة ونبحث عن الظلّ.'],
            ['الإصابات البسيطة', 'إذا سقطنا ننظر إلى مكان الألم ولا نتحرك بسرعة. نخبر المعلّم أو أحد الكبار فورا. لا نضغط على المكان المصاب بأنفسنا.']
          ],
          examples: [
            ['ماذا تفعل بعد الجري في الساحة؟', ['أبطئ خطواتي وأتنفس بعمق.', 'أشرب رشفة ماء.', 'أجلس قليلا قبل العودة للفصل.'], 'التهدئة والماء يساعدان الجسم على التعافي.'],
            ['زميلك تعثر في الملعب، ماذا تفعل؟', ['أتوقف عن الجري فورا.', 'أنادي المعلّم وأسأل الزميل عن ألمه.', 'لا أحركه إن كان الألم شديدا.'], 'إعلام الكبار وعدم تحريك المصاب من أولويات الأمان.']
          ],
          questions: [
            ['لماذا نشرب الماء بعد الجري؟', ['لأن الجسم فقد سوائل', 'لأننا نريد اللعب أكثر', 'لأن القميص متسخ', 'لأن المعلّم يشرب'], 0, 'الجري يفقد الجسم ماءً، وتعويضه يحافظ على نشاطه وصحته.'],
            ['ما الملابس المناسبة للرياضة؟', ['حذاء ثابت وقميص مريح', 'حذاء ضيق جدا', 'ملابس طويلة تعيق الحركة', 'قبعة ثقيلة'], 0, 'الملابس المريحة والحذاء الثابت يسمحان بالحركة ويقللان الإصابة.'],
            ['ماذا نفعل عند ألم شديد بعد السقوط؟', ['نواصل اللعب', 'نخبر المعلّم ولا نحرك المصاب', 'ندلك المكان بقوة', 'نضحك'], 1, 'تحريك المصاب قد يزيد الضرر، وإعلام الكبار هو التصرف الصحيح.'],
            ['أي وقت أفضل للتهدئة؟', ['قبل الإحماء', 'بعد النشاط الرياضي', 'أثناء الجري', 'قبل دخول الساحة'], 1, 'التهدئة تأتي في نهاية النشاط لإعادة الجسم إلى حالته الهادئة.']
          ]
        }
      ]
    },
    'cur_l_p3_sub_histgeo': {
      shared: {
        sections: [
          ['المكان والزمان', 'نعيش في مكان محدد وفي زمن يتغير. نسمّي المكان الذي نعيش فيه محيطنا، ونسمّي تعاقب الأيام والفصول الزمن. التاريخ والجغرافيا يدرسان هذين الجانبين.'],
          ['الملاحظة في المحيط', 'نلاحظ شارع المدرسة والسوق والبساتين القريبة. نسجّل ما نراه بأسمائه الصحيحة. الملاحظة المنظّمة تجعل حديثنا عن المكان دقيقا.'],
          ['الخريطة والرموز', 'الخريطة رسم مصغّر لمكان ما. نستخدم رموزا مثل النقطة للمدينة والخط للطريق. نقرأ العنوان ودليل الرموز قبل أن نحدد اتجاهنا.'],
          ['الزمن في حياتنا', 'نرتّب أحداث يومنا: الاستيقاظ، والمدرسة، واللعب، والنوم. نستخدم أولا ثم ثم وأخيرا. هذا الترتيب يساعدنا على فهم التاريخ.']
        ],
        vocab: [
          ['المحيط', 'المكان والبيئة التي تحيط بالإنسان.'],
          ['الزمن', 'ما يمضي من وقت ويقاس بالساعات والأيام والسنوات.'],
          ['الخريطة', 'رسم مصغّر يدل على معالم مكان ما.'],
          ['الرمز', 'شكل صغير يدل على شيء في الخريطة.'],
          ['الفصل', 'قسم من السنة يتميز بجو وطقس معين.'],
          ['البيئة', 'كل ما يحيط بنا من هواء وماء ونباتات وحيوانات.']
        ],
        outcomes: [
          'يسمّي الطالب ثلاثة معالم في محيطه.',
          'يرتّب الطالب أحداث يومه تسلسليا.',
          'يقرأ الطالب رموزا بسيطة في خريطة.',
          'يقترح الطالب سلوكا يحمي البيئة المحيطة.'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'محيطي القريب',
          intro: 'نتعرف إلى المكان الذي نعيش فيه: الحيّ والشارع والمدرسة.',
          sections: [
            ['من البيت إلى المدرسة', 'أخرج من بيت فأشاهد الطريق والدكان والحديقة الصغيرة. أعرف معالم طريقي: مسجد الحي، ومحطة الحافلة، وباب المدرسة. هذه المعالم تساعدني على ألا أضيع.'],
            ['محيط متنوع', 'في مدينتي أسواق ومساجد وحدائق، وفي ضواحيها بساتين وحقول. يختلف المحيط بين المدينة والقرية، لكن كلاهما يحتاج إلى النظافة والعناية.']
          ],
          examples: [
            ['صف طريقك إلى المدرسة.', ['أبدأ من باب البيت.', 'أذكر ثلاثة معالم أمرّ بها.', 'أختم بباب المدرسة.'], 'أذكر المعالم بالترتيب: الدكان، المسجد، ثم المدرسة.'],
            ['كيف لا أضيع في الحي؟', ['أحفظ اسم شارعي ورقم الدار.', 'أتعرف إلى معالم قريبة مني.', 'أسأل أحد الكبار عند الحاجة.'], 'المعالم والأسماء تساعدني على معرفة طريقي بثقة.']
          ],
          questions: [
            ['ما المعلم الذي يدل على مكان العبادة في الحي؟', ['الدكان', 'المسجد', 'المحطة', 'الحديقة'], 1, 'المسجد مكان العبادة، أما الدكان للتسوق والمحطة للنقل.'],
            ['لماذا نحفظ معالم الطريق؟', ['للعب أكثر', 'لألا نضيع ونصل بسهولة', 'لتغيير اسم الشارع', 'لشراء حلوى'], 1, 'المعالم علامات واضحة تدلنا على الاتجاه الصحيح.'],
            ['أي مكان يوجد عادة في القرية؟', ['البساتين والحقول', 'المجمع التجاري الكبير', 'محطة القطار', 'المسرح الكبير'], 0, 'القرية يتميز عادة بالبساتين والحقول والطبيعة القريبة.'],
            ['ما الذي يختلف بين المدينة والقرية؟', ['عدد المعالم ونوع النشاط', 'وجود الهواء', 'مرور الزمن', 'أسماء الأيام'], 0, 'المدينة والقرية تختلفان في المعالم ونوع العمل، لا في الزمن أو الهواء.']
          ]
        },
        {
          t: 'ترتيب الزمن في يومنا',
          intro: 'نتعلم ترتيب الأحداث عبر اليوم والفصول، ونستخدم كلمات تدل على التسلسل.',
          sections: [
            ['صباحا ثم مساء', 'أستيقظ صباحا، وأذهب إلى المدرسة، ثم ألعب بعد الظهر، وأنام مساء. الكلمات صباحا وظهرا ومساء ترتّب يومي. أستخدم أولا ثم ثم وأخيرا.'],
            ['الفصول الأربعة', 'السنة أربعة فصول: الربيع والصيف والخريف والشتاء. في الربيع تزهر الأشجار، وفي الصيف يشتدّ الحرّ. نعرف الفصل من الطقس والنباتات.']
          ],
          examples: [
            ['رتّب أحداث يومك.', ['أولاً: أستيقظ وأغسل يدي.', 'ثم: أذهب إلى المدرسة.', 'أخيراً: أقرأ قصة قبل النوم.'], 'الترتيب: الاستيقاظ، المدرسة، ثم القراءة قبل النوم.'],
            ['كيف أعرف أن فصل الخريف بدأ؟', ['ألاحظ تغير لون الأوراق.', 'أحسّ باعتدال الجو.', 'أرى ثمارا جديدة في السوق.'], 'تغير الأوراق والجو يدل على بداية الخريف.']
          ],
          questions: [
            ['أي كلمة تدل على التسلسل؟', ['ثم', 'لكن', 'ربما', 'ربما أيضا'], 0, '« ثم » تفيد تعاقب الأحداث، بينما البقية لا تفيد الترتيب الزمني.'],
            ['ماذا يحدث في فصل الربيع؟', ['تزهر الأشجار', 'يشتد البرد', 'تسقط الثلوج', 'يقلّ المطر دائما'], 0, 'الربيع موسم الازدهار والاعتدال، لا الثلوج والبرد الشديد.'],
            ['أيّها يأتي أولا في يومك؟', ['النوم', 'الاستيقاظ', 'اللعب', 'العشاء'], 1, 'الاستيقاظ يفتح اليوم، ثم تأتي بقية الأحداث.'],
            ['كم فصلا في السنة؟', ['اثنان', 'ثلاثة', 'أربعة', 'خمسة'], 2, 'السنة تنقسم إلى أربعة فصول متعاقبة.']
          ]
        },
        {
          t: 'قراءة الخريطة',
          intro: 'نتعرف إلى الخريطة ورموزها، ونستخدمها لتحديد المعالم.',
          sections: [
            ['ما الخريطة؟', 'الخريطة رسم صغير لمكان أكبر. تمثّل المدن والطرق والأنهار برموز سهلة. ننظر أولا إلى العنوان الذي يقول لنا ما الذي تمثله الخريطة.'],
            ['دليل الرموز', 'في دليل الخريطة نجد معنى كل رمز: نقطة للمدينة، وخط للطريق، ولون للأخضر. نقرأ الدليل قبل أن نحدد مكان المدرسة أو السوق.']
          ],
          examples: [
            ['أجد المدرسة على الخريطة.', ['أقرأ عنوان الخريطة لأعرف الحي.', 'أبحث عن رمز المدرسة في الدليل.', 'أشير إلى المكان المناسب بإصبعي.'], 'أحدد المدرسة بمطابقة الرمز مع الدليل.'],
            ['ما الفرق بين النقطة والخط في الخريطة؟', ['النقطة تدل على مدينة أو معلم.', 'الخط يدل على طريق يربط أماكن.', 'أقرأ الدليل لأتأكد.'], 'النقطة معلم، والخط طريق يصل بين المعالم.']
          ],
          questions: [
            ['ما أول شيء ننظر إليه في الخريطة؟', ['العنوان', 'لون الورق', 'عدد النقاط فقط', 'حجم الخريطة'], 0, 'العنوان يخبرنا ما الذي تمثله الخريطة قبل قراءة الرموز.'],
            ['ماذا يدل الخط في الخريطة غالبا؟', ['طريقا', 'مدينة', 'شجرة', 'بيتا'], 0, 'الخطوط تمثل الطرق التي تربط المعالم بعضها ببعض.'],
            ['لماذا نحتاج دليل الرموز؟', ['لفهم معنى كل شكل', 'لزيادة حجم الخريطة', 'لتحويلها إلى صورة', 'لتغيير العنوان'], 0, 'الدليل يشرح الرموز حتى نقرأ الخريطة بشكل صحيح.'],
            ['ما الذي تمثله الخريطة المصغّرة؟', ['مكانا أكبر بصورة أصغر', 'الزمن فقط', 'صوتا', 'طعاما'], 0, 'الخريطة اختزال لمكان حقيقي في رسم صغير يسهل قراءته.']
          ]
        },
        {
          t: 'بيئتنا نظيفة وجميلة',
          intro: 'ننظر إلى البيئة من حولنا ونتعرف إلى طرق حمايتها.',
          sections: [
            ['عناصر البيئة', 'البيئة تشمل الهواء والماء والتراب والنباتات والحيوانات. في حديقة المدرسة نرى أشجارا وعصافير وزهورا. كل عنصر يؤثر في غيره، فالشجرة تعطي الظلّ والهواء النقي.'],
            ['سلوكنا تجاه البيئة', 'نرمي الورق في السلة، ولا نقطع الأغصان، ونحافظ على الماء. نزرع شتلة في الأصيص ونسقيها. سلوك بسيط منا يجعل المكان أجمل.']
          ],
          examples: [
            ['كيف تحافظ على نظافة الساحة؟', ['أجمع الأوراق التي سقطت.', 'أضعها في سلة النفايات.', 'أخبر زملائي كي يفعلوا مثلي.'], 'النظافة تبدأ من سلوك فردي يتحول إلى عادة جماعية.'],
            ['لماذا لا نقطع غصن الشجرة؟', ['الغصن جزء من الشجرة.', 'الشجرة تعطي الظل والهواء.', 'قطعه يضعفها ويؤذي الطيور.'], 'حماية الشجرة تحافظ على الظل والهواء وموطن الطيور.']
          ],
          questions: [
            ['في درس البيئة، أي سلوك يحمي حديقة المدرسة؟', ['رمي الورق في السلة', 'قطع الأغصان', 'إهدار الماء', 'إزعاج الطيور'], 0, 'وضع النفايات في مكانها يحافظ على نظافة المكان وصحته.'],
            ['ما الذي توفره الشجرة؟', ['الظل والهواء النقي', 'الضجيج فقط', 'الظلام دائما', 'الماء المالح'], 0, 'الشجرة تظلل وتنقي الهواء وتكون موطنا للطيور.'],
            ['ماذا يحدث إذا أهدرنا الماء؟', ['يقلّ الماء المتاح للناس والنباتات', 'يزيد الماء', 'لا يحدث شيء', 'تكبر الأشجار أكثر'], 0, 'الإسراف يقلل الكمية المتاحة للشرب والزراعة.'],
            ['كيف نجعل المدرسة أجمل؟', ['بالعناية بالحديقة وترتيب الساحة', 'بزيادة النفايات', 'بإغلاق النوافذ دائما', 'بقطع الزهور'], 0, 'العناية بالنبات وترتيب المكان سلوك إيجابي يغير المحيط.']
          ]
        }
      ]
    },
    'cur_l_p4_sub_math': {
      shared: {
        sections: [
          ['ما الكسر؟', 'الكسر جزء من كلّ مقسوم إلى أجزاء متساوية. نكتب الكسر برقمين: البسط فوق والمقام تحت. المقام يخبرنا عدد الأجزاء المتساوية، والبسط يخبرنا عدد الأجزاء المأخوذة.'],
          ['تمثيل الكسر', 'نمثّل الكسر برسم دائرة أو مستطيل مقسوم إلى أجزاء متساوية. نلوّن عددا من الأجزاء يساوي البسط. الرسم يساعدنا على فهم حجم الكسر قبل حسابه.'],
          ['الكسور المتكافئة', 'الكسور المختلفة قد تمثّل القدر نفسه، مثل 1/2 و2/4. إذا ضربنا البسط والمقام في العدد نفسه لا يتغير الكسر. نستخدم ذلك في المقارنة والجمع.'],
          ['الكسر في حياتنا', 'نستخدم الكسور في تقسيم التمر بين الإخوة، وفي نصف الكوب من الماء، وفي ربع الساعة. الكسر لغة لوصف الأجزاء بدقة.']
        ],
        vocab: [
          ['الكسر', 'عدد يدل على جزء من كلّ مقسوم إلى أجزاء متساوية.'],
          ['البسط', 'الرقم فوق خط الكسر، ويدل على عدد الأجزاء المأخوذة.'],
          ['المقام', 'الرقم تحت خط الكسر، ويدل على عدد الأجزاء المتساوية.'],
          ['كسر متكافئ', 'كسران يمثّلان القدر نفسه رغم اختلاف رقميهما.'],
          ['مقام مشترك', 'مقام موحد نستخدمه لجمع كسرين أو مقارنتهما.'],
          ['نصف', 'كسر مقامه 2، أي جزء من جزأين متساويين.']
        ],
        outcomes: [
          'يمثّل الطالب كسرا بسيطا برسم مقسوم إلى أجزاء متساوية.',
          'يقارن الطالب كسرين باستخدام الرسم أو المقام المشترك.',
          'يجمع الطالب كسرين لهما المقام نفسه.',
          'يحلّ الطالب مسألة من الحياة اليومية تتطلب كسرا.'
        ],
        outcomeTr: {
          fr: [
            "L'élève représente une fraction simple par un dessin partagé en parts égales.",
            "L'élève compare deux fractions à l'aide d'un dessin ou d'un dénominateur commun.",
            "L'élève additionne deux fractions de même dénominateur.",
            "L'élève résout un problème de la vie courante qui demande une fraction."
          ],
          en: [
            'The learner represents a simple fraction with a drawing split into equal parts.',
            'The learner compares two fractions using a drawing or a common denominator.',
            'The learner adds two fractions with the same denominator.',
            'The learner solves an everyday problem that requires a fraction.'
          ]
        },
        diagram: 'diagram-fractions.svg'
      },
      lessons: [
        {
          t: 'التعرف إلى الكسور',
          intro: 'نتعرف إلى الكسر كجزء من كلّ، ونكتبه ونمثّله في أشكال بسيطة.',
          sections: [
            ['أجزاء متساوية', 'إذا قسّمنا قرص التمر إلى أربعة أجزاء متساوية، فكل جزء هو ربع القرص. نكتبه 1/4. شرط الكسر أن تكون الأجزاء متساوية، وإلا فليس كسرا صحيحا.'],
            ['البسط والمقام', 'في الكسر 3/5 الرقم 3 هو البسط والرقم 5 هو المقام. المقام يقول: قسّمنا الكل إلى خمسة أجزاء. والبسط يقول: أخذنا ثلاثة منها.']
          ],
          examples: [
            ['مثّل الكسر 2/3 برسم.', ['أرسم مستطيلا.', 'أقسّمه إلى ثلاثة أجزاء متساوية.', 'ألوّن جزأين منه.'], 'الجزآن الملوّنان يمثّلان 2/3.'],
            ['ما الكسر الذي يمثّل نصف التفاحة؟', ['أقسّم التفاحة إلى جزأين متساويين.', 'آخذ جزءا واحدا.', 'أكتب البسط 1 والمقام 2.'], 'النصف يُكتب 1/2.']
          ],
          questions: [
            ['ماذا يدل المقام في الكسر 4/7؟', ['عدد الأجزاء المأخوذة', 'عدد الأجزاء المتساوية في الكل', 'لون الشكل', 'حجم الورقة'], 1, 'المقام هو الرقم تحت الخط ويخبرنا إلى كم جزء متساوٍ قُسّم الكل.'],
            ['في تمثيل الكسور، أي رسم يدل على 1/2؟', ['دائرة مقسومة إلى جزأين متساويين يُلوّن أحدهما', 'دائرة مقسومة إلى ثلاثة أجزاء يُلوّن اثنان', 'مربع غير مقسوم', 'خط واحد'], 0, 'النصف يعني جزءا من جزأين متساويين، وهذا هو الرسم الأول.'],
            ['ما شرط الأجزاء في الكسر؟', ['أن تكون متساوية', 'أن تكون كبيرة', 'أن تكون ملوّنة', 'أن تكون مستديرة'], 0, 'الكسر يعني أجزاء متساوية من كل واحد؛ أجزاء غير متساوية لا تمثل كسرا.'],
            ['كم يساوي البسط في الكسر 3/8؟', ['8', '3', '5', '11'], 1, 'البسط هو الرقم فوق الخط، وفي 3/8 يساوي 3.']
          ],
          tr: {
            fr: {
              t: 'Découvrir les fractions',
              intro: "Nous découvrons la fraction comme partie d'un tout, puis nous l'écrivons et la dessinons.",
              sections: [
                ["Qu'est-ce qu'une fraction ?", "Une fraction est une partie d'un tout partagé en parts égales. Nous écrivons deux nombres : le numérateur au-dessus et le dénominateur au-dessous. Le dénominateur indique le nombre de parts égales, le numérateur le nombre de parts prises."],
                ['Des parts égales', "Si nous partageons une boîte de dattes en quatre parts égales, chaque part est un quart, noté 1/4. Pour être une fraction, les parts doivent être égales. Sinon, ce n'est pas une fraction correcte."],
                ['Représenter la fraction', 'Nous dessinons un cercle ou un rectangle partagé en parts égales, puis nous colorions autant de parts que le numérateur. Le dessin aide à comprendre la taille de la fraction avant de calculer.'],
                ['Numérateur et dénominateur', 'Dans 3/5, le 3 est le numérateur et le 5 est le dénominateur. Le dénominateur dit : nous avons partagé le tout en cinq parts. Le numérateur dit : nous en avons pris trois.'],
                ['Les fractions équivalentes', '1/2 et 2/4 représentent la même quantité. Si nous multiplions le numérateur et le dénominateur par le même nombre, la fraction ne change pas. Nous utilisons cela pour comparer et additionner.'],
                ['La fraction dans la vie', "Nous utilisons les fractions pour partager les dattes entre frères, pour un demi-verre d'eau ou pour un quart d'heure. La fraction décrit les parties avec précision."]
              ],
              vocab: [
                ['une fraction', "Un nombre qui désigne une partie d'un tout partagé en parts égales."],
                ['le numérateur', 'Le nombre au-dessus de la barre : il indique le nombre de parts prises.'],
                ['le dénominateur', 'Le nombre sous la barre : il indique le nombre de parts égales.'],
                ['fractions équivalentes', 'Deux fractions qui représentent la même quantité.'],
                ['un dénominateur commun', 'Un dénominateur identique utilisé pour additionner ou comparer deux fractions.'],
                ['un demi', 'La fraction de dénominateur 2, une part sur deux égales.']
              ],
              examples: [
                ['Représente la fraction 2/3 par un dessin.', ['Je dessine un rectangle.', 'Je le partage en trois parts égales.', 'Je colorie deux parts.'], 'Les deux parts coloriées représentent 2/3.'],
                ["Quelle fraction représente la moitié d'une pomme ?", ['Je partage la pomme en deux parts égales.', 'Je prends une part.', "J'écris le numérateur 1 et le dénominateur 2."], "La moitié s'écrit 1/2."]
              ]
            },
            en: {
              t: 'Learning about fractions',
              intro: 'We learn that a fraction is part of a whole, then we write it and draw it.',
              sections: [
                ['What is a fraction?', 'A fraction is part of a whole split into equal parts. We write two numbers: the numerator above the line and the denominator below it. The denominator tells how many equal parts there are, and the numerator tells how many parts we take.'],
                ['Equal parts', 'If we share a box of dates into four equal parts, each part is one quarter, written 1/4. For a fraction, the parts must be equal. Otherwise it is not a correct fraction.'],
                ['Drawing a fraction', 'We draw a circle or a rectangle split into equal parts, then we colour as many parts as the numerator. The drawing helps us understand the size of the fraction before calculating.'],
                ['Numerator and denominator', 'In 3/5, 3 is the numerator and 5 is the denominator. The denominator says: the whole was split into five parts. The numerator says: we took three of them.'],
                ['Equivalent fractions', '1/2 and 2/4 show the same amount. If we multiply the numerator and the denominator by the same number, the fraction does not change. We use this to compare and add fractions.'],
                ['Fractions in daily life', 'We use fractions to share dates among brothers, to describe half a glass of water or a quarter of an hour. Fractions describe parts precisely.']
              ],
              vocab: [
                ['fraction', 'A number that shows part of a whole split into equal parts.'],
                ['numerator', 'The number above the line: it shows how many parts are taken.'],
                ['denominator', 'The number below the line: it shows how many equal parts there are.'],
                ['equivalent fractions', 'Two fractions that show the same amount.'],
                ['common denominator', 'A shared denominator used to add or compare two fractions.'],
                ['half', 'The fraction with denominator 2, one part out of two equal parts.']
              ],
              examples: [
                ['Draw the fraction 2/3.', ['I draw a rectangle.', 'I split it into three equal parts.', 'I colour two parts.'], 'The two coloured parts show 2/3.'],
                ['Which fraction shows half of an apple?', ['I split the apple into two equal parts.', 'I take one part.', 'I write numerator 1 and denominator 2.'], 'One half is written 1/2.']
              ]
            }
          }
        },
        {
          t: 'مقارنة الكسور',
          intro: 'نقارن كسرين لنعرف أيّهما أكبر، ونستخدم الرسم أحيانا والمقام المشترك أحيانا أخرى.',
          sections: [
            ['المقام نفسه', 'إذا كان المقام متسابيا نقارن البسطين فقط. ففي 3/8 و5/8 نجد أن 5 أكبر من 3، إذن 5/8 أكبر. الأجزاء متساوية الحجم، فمن أخذ خمسة أجزاء أخذ أكثر.'],
            ['مقامان مختلفان', 'إذا اختلف المقامان نبحث عن مقام مشترك. نقارن 1/2 و1/4 فنحوّل 1/2 إلى 2/4، ثم نجد أن 2/4 أكبر من 1/4. الرسم يساعد على تخيّل الفرق.']
          ],
          examples: [
            ['قارن 2/6 و5/6.', ['المقامان متساويان ويساويان 6.', 'نقارن البسطين: 2 و5.', 'لأن 5 أكبر فـ 5/6 أكبر.'], '5/6 أكبر من 2/6.'],
            ['أيهما أكبر: 1/3 أم 1/2؟', ['نحوّل إلى مقام مشترك هو 6.', '1/3 يساوي 2/6، و1/2 يساوي 3/6.', 'نقارن: 3 أكبر من 2.'], '1/2 أكبر من 1/3.']
          ],
          questions: [
            ['أيّ كسر أكبر: 4/9 أم 7/9؟', ['4/9', '7/9', 'متساويان', 'لا يمكن المقارنة'], 1, 'المقام متساو، فمن كان بسطه أكبر كان كسره أكبر.'],
            ['ما المقام المشترك لمقارنة 1/2 و1/3؟', ['2', '3', '6', '5'], 2, 'أصغر مضاعف مشترك للعددين 2 و3 هو 6.'],
            ['لماذا 1/2 أكبر من 1/4؟', ['لأن البسطين متساويان', 'لأن الجزء من جزأين أكبر من الجزء من أربعة', 'لأن 4 أكبر من 2', 'لأن الكسرين متكافئان'], 1, 'عند تقسيم الكل إلى جزأين يكون كل جزء أكبر من جزء من أربعة أجزاء.'],
            ['كيف نقارن كسرين لهما المقام نفسه؟', ['نقارن البسطين', 'نقارن المقامين', 'نجمع البسطين', 'نضرب المقامين'], 0, 'المقام المتساوي يعني أجزاء متساوية، فيكفي النظر إلى عدد الأجزاء المأخوذة.']
          ],
          tr: {
            fr: {
              t: 'Comparer les fractions',
              intro: 'Nous comparons deux fractions pour savoir laquelle est la plus grande, avec un dessin ou un dénominateur commun.',
              sections: [
                ["Qu'est-ce qu'une fraction ?", "Une fraction est une partie d'un tout partagé en parts égales. Nous écrivons deux nombres : le numérateur au-dessus et le dénominateur au-dessous. Le dénominateur indique le nombre de parts égales, le numérateur le nombre de parts prises."],
                ['Même dénominateur', 'Quand le dénominateur est le même, nous comparons seulement les numérateurs. Dans 3/8 et 5/8, 5 est plus grand que 3, donc 5/8 est plus grand. Les parts ont la même taille : celui qui en prend cinq en prend davantage.'],
                ['Représenter la fraction', 'Nous dessinons un cercle ou un rectangle partagé en parts égales, puis nous colorions autant de parts que le numérateur. Le dessin aide à comprendre la taille de la fraction avant de calculer.'],
                ['Dénominateurs différents', 'Si les dénominateurs sont différents, nous cherchons un dénominateur commun. Pour comparer 1/2 et 1/4, nous changeons 1/2 en 2/4, puis nous voyons que 2/4 est plus grand que 1/4. Le dessin aide à imaginer la différence.'],
                ['Les fractions équivalentes', '1/2 et 2/4 représentent la même quantité. Si nous multiplions le numérateur et le dénominateur par le même nombre, la fraction ne change pas. Nous utilisons cela pour comparer et additionner.'],
                ['La fraction dans la vie', "Nous utilisons les fractions pour partager les dattes entre frères, pour un demi-verre d'eau ou pour un quart d'heure. La fraction décrit les parties avec précision."]
              ],
              vocab: [
                ['une fraction', "Un nombre qui désigne une partie d'un tout partagé en parts égales."],
                ['le numérateur', 'Le nombre au-dessus de la barre : il indique le nombre de parts prises.'],
                ['le dénominateur', 'Le nombre sous la barre : il indique le nombre de parts égales.'],
                ['fractions équivalentes', 'Deux fractions qui représentent la même quantité.'],
                ['un dénominateur commun', 'Un dénominateur identique utilisé pour additionner ou comparer deux fractions.'],
                ['un demi', 'La fraction de dénominateur 2, une part sur deux égales.']
              ],
              examples: [
                ['Compare 2/6 et 5/6.', ['Les deux dénominateurs valent 6.', 'Nous comparons les numérateurs : 2 et 5.', 'Comme 5 est plus grand, 5/6 est plus grand.'], '5/6 est plus grand que 2/6.'],
                ['Lequel est le plus grand : 1/3 ou 1/2 ?', ['Nous prenons le dénominateur commun 6.', '1/3 vaut 2/6 et 1/2 vaut 3/6.', 'Nous comparons : 3 est plus grand que 2.'], '1/2 est plus grand que 1/3.']
              ]
            },
            en: {
              t: 'Comparing fractions',
              intro: 'We compare two fractions to find the larger one, using a drawing or a common denominator.',
              sections: [
                ['What is a fraction?', 'A fraction is part of a whole split into equal parts. We write two numbers: the numerator above the line and the denominator below it. The denominator tells how many equal parts there are, and the numerator tells how many parts we take.'],
                ['Same denominator', 'When the denominators are the same, we only compare the numerators. In 3/8 and 5/8, 5 is greater than 3, so 5/8 is greater. The parts are the same size, so taking five parts means taking more.'],
                ['Drawing a fraction', 'We draw a circle or a rectangle split into equal parts, then we colour as many parts as the numerator. The drawing helps us understand the size of the fraction before calculating.'],
                ['Different denominators', 'If the denominators are different, we look for a common denominator. To compare 1/2 and 1/4, we change 1/2 into 2/4 and then see that 2/4 is greater than 1/4. The drawing helps us picture the difference.'],
                ['Equivalent fractions', '1/2 and 2/4 show the same amount. If we multiply the numerator and the denominator by the same number, the fraction does not change. We use this to compare and add fractions.'],
                ['Fractions in daily life', 'We use fractions to share dates among brothers, to describe half a glass of water or a quarter of an hour. Fractions describe parts precisely.']
              ],
              vocab: [
                ['fraction', 'A number that shows part of a whole split into equal parts.'],
                ['numerator', 'The number above the line: it shows how many parts are taken.'],
                ['denominator', 'The number below the line: it shows how many equal parts there are.'],
                ['equivalent fractions', 'Two fractions that show the same amount.'],
                ['common denominator', 'A shared denominator used to add or compare two fractions.'],
                ['half', 'The fraction with denominator 2, one part out of two equal parts.']
              ],
              examples: [
                ['Compare 2/6 and 5/6.', ['Both denominators are 6.', 'We compare the numerators: 2 and 5.', 'Since 5 is greater, 5/6 is greater.'], '5/6 is greater than 2/6.'],
                ['Which is greater: 1/3 or 1/2?', ['We use the common denominator 6.', '1/3 equals 2/6 and 1/2 equals 3/6.', 'We compare: 3 is greater than 2.'], '1/2 is greater than 1/3.']
              ]
            }
          }
        },
        {
          t: 'جمع الكسور',
          intro: 'نتعلم جمع كسرين لهما المقام نفسه، ثم نكتب الناتج تبسيطا بسيطا.',
          sections: [
            ['جمع مقام مشترك', 'إذا كان المقام متسابيا نجمع البسطين ونترك المقام كما هو. مثال: 2/7 + 3/7 = 5/7. نقول: أخذنا جزأين ثم ثلاثة أجزاء من أصل مقسوم إلى سبعة، فالمجموع خمسة أجزاء.'],
            ['تبسيط الناتج', 'أحيانا يمكن كتابة الكسر بصورة أبسط. فـ 2/4 يساوي 1/2 لأننا قسّمنا البسط والمقام على 2. لا نغيّر قيمة الكسر حين نبسّطه، بل نكتبه بطريقة أوضح.']
          ],
          examples: [
            ['احسب 1/5 + 2/5.', ['المقامان متساويان ويساويان 5.', 'نجمع البسطين: 1 + 2 = 3.', 'نكتب الناتج 3/5.'], '1/5 + 2/5 = 3/5.'],
            ['احسب 1/4 + 1/4 وبسّط.', ['نجمع البسطين: 1 + 1 = 2.', 'نكتب 2/4.', 'نقسم على 2 فنحصل على 1/2.'], '1/4 + 1/4 = 2/4 = 1/2.']
          ],
          questions: [
            ['كم يساوي 3/8 + 2/8؟', ['5/8', '5/16', '6/8', '1/8'], 0, 'المقام متساوٍ، فنجمع البسطين 3 و2 فنحصل على 5 مع بقاء المقام 8.'],
            ['ما قيمة 1/6 + 4/6؟', ['5/6', '5/12', '4/6', '6/6'], 0, 'جمع البسطين 1 و4 يعطي 5، والمقام يبقى 6.'],
            ['كيف نبسّط الكسر 2/4؟', ['نضرب البسط والمقام في 2', 'نقسم البسط والمقام على 2', 'نزيد المقام 2', 'نحذف البسط'], 1, 'قسمة البسط والمقام على العدد نفسه لا تغيّر قيمته، فتصبح 1/2.'],
            ['لماذا لا نجمع المقامين عند الجمع؟', ['لأن المقام يدل على حجم الجزء وهو ثابت', 'لأن المقام أصغر', 'لأن البسط أكبر', 'لأن الجمع ممنوع'], 0, 'المقام يخبرنا عدد الأجزاء المتساوية في الكل، وهذا لا يتغير بإضافة أجزاء منه.']
          ],
          tr: {
            fr: {
              t: 'Additionner les fractions',
              intro: "Nous apprenons à additionner deux fractions de même dénominateur, puis à simplifier le résultat quand c'est possible.",
              sections: [
                ["Qu'est-ce qu'une fraction ?", "Une fraction est une partie d'un tout partagé en parts égales. Nous écrivons deux nombres : le numérateur au-dessus et le dénominateur au-dessous. Le dénominateur indique le nombre de parts égales, le numérateur le nombre de parts prises."],
                ['Même dénominateur', "Quand le dénominateur est le même, nous additionnons les numérateurs et nous gardons le dénominateur. Par exemple : 2/7 + 3/7 = 5/7. Nous avons pris deux parts puis trois parts d'un tout partagé en sept, soit cinq parts au total."],
                ['Représenter la fraction', 'Nous dessinons un cercle ou un rectangle partagé en parts égales, puis nous colorions autant de parts que le numérateur. Le dessin aide à comprendre la taille de la fraction avant de calculer.'],
                ['Simplifier le résultat', 'Parfois, nous écrivons la fraction sous une forme plus simple. Ainsi 2/4 égale 1/2, car nous avons divisé le numérateur et le dénominateur par 2. Simplifier ne change pas la valeur de la fraction, cela la rend plus claire.'],
                ['Les fractions équivalentes', '1/2 et 2/4 représentent la même quantité. Si nous multiplions le numérateur et le dénominateur par le même nombre, la fraction ne change pas. Nous utilisons cela pour comparer et additionner.'],
                ['La fraction dans la vie', "Nous utilisons les fractions pour partager les dattes entre frères, pour un demi-verre d'eau ou pour un quart d'heure. La fraction décrit les parties avec précision."]
              ],
              vocab: [
                ['une fraction', "Un nombre qui désigne une partie d'un tout partagé en parts égales."],
                ['le numérateur', 'Le nombre au-dessus de la barre : il indique le nombre de parts prises.'],
                ['le dénominateur', 'Le nombre sous la barre : il indique le nombre de parts égales.'],
                ['fractions équivalentes', 'Deux fractions qui représentent la même quantité.'],
                ['un dénominateur commun', 'Un dénominateur identique utilisé pour additionner ou comparer deux fractions.'],
                ['un demi', 'La fraction de dénominateur 2, une part sur deux égales.']
              ],
              examples: [
                ['Calcule 1/5 + 2/5.', ['Les dénominateurs valent 5.', 'Nous additionnons les numérateurs : 1 + 2 = 3.', 'Nous écrivons 3/5.'], '1/5 + 2/5 = 3/5.'],
                ['Calcule 1/4 + 1/4 et simplifie.', ['Nous additionnons les numérateurs : 1 + 1 = 2.', 'Nous écrivons 2/4.', 'Nous divisons par 2 pour obtenir 1/2.'], '1/4 + 1/4 = 2/4 = 1/2.']
              ]
            },
            en: {
              t: 'Adding fractions',
              intro: 'We learn to add two fractions with the same denominator, then we simplify the result when possible.',
              sections: [
                ['What is a fraction?', 'A fraction is part of a whole split into equal parts. We write two numbers: the numerator above the line and the denominator below it. The denominator tells how many equal parts there are, and the numerator tells how many parts we take.'],
                ['Same denominator', 'When the denominators are the same, we add the numerators and keep the denominator. For example: 2/7 + 3/7 = 5/7. We took two parts and then three parts of a whole split into seven, so five parts in total.'],
                ['Drawing a fraction', 'We draw a circle or a rectangle split into equal parts, then we colour as many parts as the numerator. The drawing helps us understand the size of the fraction before calculating.'],
                ['Simplifying the result', 'Sometimes we write the fraction in a simpler form. For example, 2/4 equals 1/2 because we divided the numerator and the denominator by 2. Simplifying does not change the value; it makes the fraction clearer.'],
                ['Equivalent fractions', '1/2 and 2/4 show the same amount. If we multiply the numerator and the denominator by the same number, the fraction does not change. We use this to compare and add fractions.'],
                ['Fractions in daily life', 'We use fractions to share dates among brothers, to describe half a glass of water or a quarter of an hour. Fractions describe parts precisely.']
              ],
              vocab: [
                ['fraction', 'A number that shows part of a whole split into equal parts.'],
                ['numerator', 'The number above the line: it shows how many parts are taken.'],
                ['denominator', 'The number below the line: it shows how many equal parts there are.'],
                ['equivalent fractions', 'Two fractions that show the same amount.'],
                ['common denominator', 'A shared denominator used to add or compare two fractions.'],
                ['half', 'The fraction with denominator 2, one part out of two equal parts.']
              ],
              examples: [
                ['Work out 1/5 + 2/5.', ['Both denominators are 5.', 'We add the numerators: 1 + 2 = 3.', 'We write 3/5.'], '1/5 + 2/5 = 3/5.'],
                ['Work out 1/4 + 1/4 and simplify.', ['We add the numerators: 1 + 1 = 2.', 'We write 2/4.', 'We divide by 2 to get 1/2.'], '1/4 + 1/4 = 2/4 = 1/2.']
              ]
            }
          }
        },
        {
          t: 'مسائل الكسور في حياتنا',
          intro: 'نحلّ مسائل من السوق والبيت نحتاج فيها إلى تمثيل الكسر أو جمعه أو مقارنته.',
          sections: [
            ['خطوات حل المسألة', 'نقرأ المسألة مرتين، ثم نحدّد الكل والمجزّأ. نكتب الكسر المناسب، ونختار العملية: جمع أو مقارنة. أخيرا نتحقق من أن الجواب منطقي بالنسبة إلى حجم الكل.'],
            ['مسائل متعددة الخطوات', 'بعض المسائل تحتاج خطوتين: نحوّل الكسرين إلى مقام مشترك ثم نجمعهما. نكتب كل خطوة وحدها حتى لا نخلط بين البسط والمقام. الرسم يبقي الصورة واضحة.']
          ],
          examples: [
            ['قسّمت أمينة رغيفا إلى 8 أجزاء فأكلت 3 وأخوها 2. كم أكلَا؟', ['الكل مقسوم إلى 8 أجزاء متساوية.', 'الأكل: 3/8 + 2/8.', 'نجمع البسطين فنحصل على 5/8.'], 'أكلَا 5/8 من الرغيف.'],
            ['شرب خالد 1/2 كوب وشربت سارة 1/4 الكوب. من شرب أكثر؟', ['نحوّل 1/2 إلى 2/4.', 'نقارن 2/4 و1/4.', '2 أكبر من 1.'], 'خالد شرب أكثر؛ لأن 1/2 أكبر من 1/4.']
          ],
          questions: [
            ['لديك 6 تمرات، أعطيت ثلثها لأخيك. كم تمرة أعطيت؟', ['تمر واحدة', 'تمران', 'ثلاث تمرات', 'ست تمرات'], 1, 'ثلث 6 يعني قسمة 6 على 3، والناتج تمران.'],
            ['قطع عمر تفاحة إلى 4 أجزاء وأكل جزأين. أي كسر يمثل ما أكل؟', ['1/4', '2/4', '4/2', '3/4'], 1, 'أكل جزأين من أربعة، فيكون الكسر 2/4 وهو يساوي 1/2.'],
            ['في مسألة تحتاج إلى خطوتين، ما أول ما نفعله؟', ['نكتب الجواب فورا', 'نحدّد الكل والأجزاء ثم نكتب الكسور', 'نحذف الأرقام', 'نرسم بدون قراءة'], 1, 'فهم المعطيات أولا يحدد العملية الصحيحة قبل الحساب.'],
            ['كيف نتأكد من جواب المسألة؟', ['نتحقق أنه منطقي مقارنة بالكل', 'نغيّر الأرقام', 'نكرر السؤال فقط', 'نclosre الكراسة'], 0, 'إذا كان الجواب أكبر من الكل أو سالبا في سياق الأجزاء، ففيه خطأ يجب مراجعته.']
          ],
          tr: {
            fr: {
              t: 'Résoudre des problèmes de fractions',
              intro: "Nous résolvons des problèmes de la vie quotidienne qui demandent de représenter, d'additionner ou de comparer des fractions.",
              sections: [
                ["Qu'est-ce qu'une fraction ?", "Une fraction est une partie d'un tout partagé en parts égales. Nous écrivons deux nombres : le numérateur au-dessus et le dénominateur au-dessous. Le dénominateur indique le nombre de parts égales, le numérateur le nombre de parts prises."],
                ['Les étapes de la résolution', 'Nous lisons le problème deux fois, puis nous cherchons le tout et les parties. Nous écrivons la fraction qui convient et nous choisissons l opération : addition ou comparaison. Enfin, nous vérifions que la réponse est logique par rapport à la taille du tout.'],
                ['Représenter la fraction', 'Nous dessinons un cercle ou un rectangle partagé en parts égales, puis nous colorions autant de parts que le numérateur. Le dessin aide à comprendre la taille de la fraction avant de calculer.'],
                ['Problèmes en deux étapes', 'Certains problèmes demandent deux étapes : nous changeons les fractions en un dénominateur commun, puis nous les additionnons. Nous écrivons chaque étape séparément pour ne pas mélanger numérateur et dénominateur. Le dessin garde la situation claire.'],
                ['Les fractions équivalentes', '1/2 et 2/4 représentent la même quantité. Si nous multiplions le numérateur et le dénominateur par le même nombre, la fraction ne change pas. Nous utilisons cela pour comparer et additionner.'],
                ['La fraction dans la vie', "Nous utilisons les fractions pour partager les dattes entre frères, pour un demi-verre d'eau ou pour un quart d'heure. La fraction décrit les parties avec précision."]
              ],
              vocab: [
                ['une fraction', "Un nombre qui désigne une partie d'un tout partagé en parts égales."],
                ['le numérateur', 'Le nombre au-dessus de la barre : il indique le nombre de parts prises.'],
                ['le dénominateur', 'Le nombre sous la barre : il indique le nombre de parts égales.'],
                ['fractions équivalentes', 'Deux fractions qui représentent la même quantité.'],
                ['un dénominateur commun', 'Un dénominateur identique utilisé pour additionner ou comparer deux fractions.'],
                ['un demi', 'La fraction de dénominateur 2, une part sur deux égales.']
              ],
              examples: [
                ['Amina partage un pain en 8 parts ; elle en mange 3 et son frère 2. Combien ont-ils mangé ?', ['Le tout est partagé en 8 parts égales.', 'Nous calculons 3/8 + 2/8.', 'Nous additionnons les numérateurs : 5/8.'], 'Ils ont mangé 5/8 du pain.'],
                ['Khalid boit 1/2 verre et Sara boit 1/4 verre. Qui boit le plus ?', ['Nous changeons 1/2 en 2/4.', 'Nous comparons 2/4 et 1/4.', '2 est plus grand que 1.'], 'Khalid boit davantage, car 1/2 est plus grand que 1/4.']
              ]
            },
            en: {
              t: 'Solving fraction problems',
              intro: 'We solve everyday problems that need us to show, add or compare fractions.',
              sections: [
                ['What is a fraction?', 'A fraction is part of a whole split into equal parts. We write two numbers: the numerator above the line and the denominator below it. The denominator tells how many equal parts there are, and the numerator tells how many parts we take.'],
                ['Steps for solving a problem', 'We read the problem twice, then we identify the whole and the parts. We write the matching fraction and choose the operation: addition or comparison. Finally we check that the answer makes sense compared with the size of the whole.'],
                ['Drawing a fraction', 'We draw a circle or a rectangle split into equal parts, then we colour as many parts as the numerator. The drawing helps us understand the size of the fraction before calculating.'],
                ['Two-step problems', 'Some problems need two steps: we change the fractions to a common denominator and then add them. We write each step separately so we do not mix up numerator and denominator. A drawing keeps the situation clear.'],
                ['Equivalent fractions', '1/2 and 2/4 show the same amount. If we multiply the numerator and the denominator by the same number, the fraction does not change. We use this to compare and add fractions.'],
                ['Fractions in daily life', 'We use fractions to share dates among brothers, to describe half a glass of water or a quarter of an hour. Fractions describe parts precisely.']
              ],
              vocab: [
                ['fraction', 'A number that shows part of a whole split into equal parts.'],
                ['numerator', 'The number above the line: it shows how many parts are taken.'],
                ['denominator', 'The number below the line: it shows how many equal parts there are.'],
                ['equivalent fractions', 'Two fractions that show the same amount.'],
                ['common denominator', 'A shared denominator used to add or compare two fractions.'],
                ['half', 'The fraction with denominator 2, one part out of two equal parts.']
              ],
              examples: [
                ['Amina shares a loaf into 8 parts; she eats 3 and her brother eats 2. How much did they eat?', ['The whole is split into 8 equal parts.', 'We work out 3/8 + 2/8.', 'We add the numerators: 5/8.'], 'They ate 5/8 of the loaf.'],
                ['Khalid drinks 1/2 a glass and Sara drinks 1/4 of a glass. Who drinks more?', ['We change 1/2 into 2/4.', 'We compare 2/4 and 1/4.', '2 is greater than 1.'], 'Khalid drinks more because 1/2 is greater than 1/4.']
              ]
            }
          }
        }
      ]
    },
    'cur_l_p5_sub_fr': {
      shared: {
        sections: [
          ['Lire un texte littéraire', "Un texte littéraire raconte une histoire ou décrit un paysage avec des mots choisis. Lis d'abord le titre, puis le texte entier. Repère les personnages et le lieu avant de chercher les détails."],
          ['Comprendre le sens', "Cherche le sens des mots inconnus dans la phrase qui les entoure. Demande le dictionnaire si le sens reste flou. Une bonne compréhension s'appuie sur des preuves prises dans le texte."],
          ['Analyser la forme', "Observe qui parle, comment les phrases sont construites et quels mots reviennent. Les répétitions et les images attirent l'attention du lecteur. Note une citation courte pour appuyer ton idée."],
          ['Écrire à son tour', "Avant d'écrire, prépare un plan en trois parties : début, milieu, fin. Utilise des connecteurs comme « d'abord », « puis » et « enfin ». Relis ton texte pour corriger les accords et la ponctuation."]
        ],
        vocab: [
          ['un récit', 'Un texte qui raconte des événements dans un certain ordre.'],
          ['un personnage', "La personne ou l'animal qui agit dans l'histoire."],
          ['une citation', 'Une phrase courte copiée exactement dans le texte.'],
          ['un connecteur', 'Un mot qui relie les idées, comme « puis » ou « mais ».'],
          ['une image poétique', "Une comparaison qui donne une image dans l'esprit du lecteur."],
          ['une production écrite', "Un texte que l'élève rédige lui-même."]
        ],
        outcomes: [
          "L'élève identifie les personnages et le lieu d'un récit court.",
          "L'élève justifie une interprétation avec une citation du texte.",
          "L'élève rédige un paragraphe structuré de cinq phrases.",
          "L'élève corrige les accords et la ponctuation de sa production."
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'Texte littéraire',
          intro: "Nous lisons un court récit et nous repérons les éléments qui construisent l'histoire.",
          sections: [
            ['Le début du récit', 'Le texte commence par une phrase qui présente le lieu et le personnage : « Dans le jardin de la maison, Layla porte un panier de dattes. » Cette ouverture donne envie de savoir la suite.'],
            ['Le déroulement', "Ensuite, le récit enchaîne les actions : Layla marche, s'arrête et écoute un oiseau. Chaque action ajoute une information. Les verbes au passé montrent que les événements sont déjà arrivés."]
          ],
          examples: [
            ['Repère les personnages du récit.', ['Je lis la première phrase.', 'Je cherche les noms de personnes.', "Je relève : Layla et l'oiseau."], "Les personnages sont Layla et l'oiseau."],
            ["Trouve le lieu de l'action.", ['Je cherche les mots qui indiquent un endroit.', 'Je lis : « dans le jardin de la maison ».', 'Je réponds avec une citation.'], 'L action se passe dans le jardin de la maison.']
          ],
          questions: [
            ['Que faut-il lire en premier dans un texte ?', ['La dernière phrase', 'Le titre', 'Le dictionnaire', 'La conclusion'], 1, 'Le titre annonce le sujet et prépare la lecture de tout le texte.'],
            ['Combien de phrases compte le paragraphe de la leçon ?', ['Une', 'Deux', 'Quatre', 'Dix'], 2, 'Le paragraphe contient quatre phrases : deux dans chaque section.'],
            ['Quel temps est utilisé pour raconter les actions passées ?', ['Le présent', 'Le passé', 'Le futur', "L'impératif"], 1, "Le passé situe les événements avant le moment où l'on lit."],
            ['Quelle phrase est une citation ?', ['Je crois que Layla est contente.', 'Layla porte un panier de dattes.', "Peut-être qu'elle court.", 'L histoire est longue.'], 1, 'Une citation reprend exactement les mots du texte, sans les changer.']
          ]
        },
        {
          t: 'Analyse',
          intro: 'Nous analysons les mots et les phrases pour comprendre comment le texte produit son effet.',
          sections: [
            ['Les mots répétés', "Quand un mot revient plusieurs fois, il attire l'attention. Dans notre récit, le mot « dattes » revient souvent et rappelle le cadre marocain. Les répétitions donnent un rythme à la lecture."],
            ['Les images et les comparaisons', "Dire « le soleil comme une pièce d'or » est une comparaison. Elle transforme une lumière ordinaire en image forte. L'analyse consiste à expliquer pourquoi l'écrivain a choisi cette image."]
          ],
          examples: [
            ['Explique la comparaison « vif comme un oiseau ».', ['Je repère le mot de comparaison : « comme ».', 'Je cherche la qualité commune : la rapidité.', "J'explique : le personnage se déplace très vite."], 'La comparaison montre la rapidité du personnage.'],
            ['Pourquoi le mot « dattes » revient-il ?', ['Je compte ses apparitions dans le texte.', "Je regarde le lieu de l'action.", 'Je relie le mot au cadre marocain.'], 'La répétition souligne le lien avec le marché et la culture locale.']
          ],
          questions: [
            ['Quel mot introduit une comparaison ?', ['Mais', 'Comme', 'Donc', 'Puis'], 1, 'Le mot « comme » relie deux éléments pour montrer une ressemblance.'],
            ['Que fait un lecteur qui analyse un texte ?', ['Il devine la fin sans lire', "Il explique les choix de l'écrivain", 'Il efface les phrases', 'Il change le titre'], 1, "Analyser, c'est expliquer comment les mots et les phrases construisent le sens."],
            ["Quel effet crée la répétition d'un mot ?", ['Elle rend le texte plus clair sur ce qui compte', 'Elle supprime le sens', 'Elle change la langue', 'Elle efface les personnages'], 0, 'Répéter un mot met en avant un thème important et donne un rythme.'],
            ['Sur quoi appuyer une interprétation ?', ['Sur une citation précise du texte', 'Sur une opinion sans preuve', 'Sur le nombre de pages', 'Sur la couverture du cahier'], 0, 'Une citation est une preuve vérifiable qui convainc le lecteur.']
          ]
        },
        {
          t: 'Production écrite',
          intro: 'Nous écrivons un petit texte racontant une scène de la vie quotidienne au Maroc.',
          sections: [
            ['Préparer le plan', "Je choisis une scène simple : une visite au souk avec ma tante. Je note trois étapes : l'arrivée, la rencontre avec le vendeur, le retour. Ce plan évite les phrases sans ordre."],
            ['Rédiger le paragraphe', "J écris cinq phrases : une pour situer, trois pour raconter, une pour terminer. J'utilise « d'abord », « puis » et « enfin ». Je vérifie que chaque phrase apporte une idée nouvelle."]
          ],
          examples: [
            ['Écris le début de ton texte.', ['Je situe le lieu : au souk de la ville.', 'Je présente la personne : ma tante.', "J'écris : « D'abord, nous arrivons au souk avec ma tante. »"], "Le début situe l'action et présente les personnages."],
            ['Ajoute une fin au récit.', ['Je dis ce qui change à la fin.', 'Je choisis un verbe de retour.', "J'écris : « Enfin, nous rentrons avec un panier de dattes. »"], 'La fin ferme la scène et rappelle le thème.']
          ],
          questions: [
            ["Pourquoi préparer un plan avant d'écrire ?", ['Pour ordonner les idées', 'Pour écrire moins de mots', 'Pour éviter la lecture', 'Pour changer de sujet'], 0, 'Le plan donne un ordre clair au récit et évite les répétitions.'],
            ['Quel connecteur annonce la dernière étape ?', ['D abord', 'Puis', 'Enfin', 'Aussi'], 2, "« Enfin » marque la dernière partie d'une suite d actions."],
            ['Combien de phrases contient le paragraphe demandé ?', ['Trois', 'Cinq', 'Dix', 'Vingt'], 1, 'La consigne demande cinq phrases : une situation, trois actions et une conclusion.'],
            ['Dans ma production écrite sur le souk, que dois-je vérifier ?', ['Les accords et la ponctuation', 'Le nombre de mots seulement', 'La couleur du stylo', 'Le titre du cahier'], 0, 'La relecture corrige les erreurs visibles et rend le texte plus facile à lire.']
          ]
        },
        {
          t: 'Grammaire avancée',
          intro: 'Nous revisitons les accords et les temps pour rendre nos phrases plus précises.',
          sections: [
            ['L accord du verbe', "Le verbe s'accorde avec son sujet. « Les enfants jouent » prend un s parce que le sujet est pluriel. Dans un récit, vérifier l'accord évite les phrases boiteuses."],
            ['Les temps du récit', "Le passé composé raconte une action terminée, et l'imparfait décrit une habitude ou un décor. On peut écrire : « Le soleil brillait quand nous sommes partis. » Les deux temps se complètent."]
          ],
          examples: [
            ['Corrige : « Les fille marchent ».', ['Je cherche le sujet : « Les filles ».', 'Le sujet est pluriel et féminin.', "J'écris : « Les filles marchent »."], 'Il faut écrire « Les filles marchent » avec un s à filles.'],
            ['Choisis le temps qui convient.', ['Le décor : « il faisait beau ».', 'L action : « nous sommes sortis ».', 'J assemble les deux idées.'], 'Il faisait beau quand nous sommes sortis.']
          ],
          questions: [
            ['Quel est le pluriel de « la datte » ?', ['Les datte', 'Les dattes', 'La dattes', 'Des datte'], 1, 'Le nom féminin prend un s au pluriel : les dattes.'],
            ['Quel temps décrit une habitude dans le passé ?', ['Le présent', "L'imparfait", 'Le futur', "L'impératif"], 1, "L'imparfait sert aux descriptions et aux actions répétées dans le passé."],
            ['Quel mot accorder dans « Les oiseaux chante... » ?', ['Le verbe', 'La préposition', 'La conjonction', 'Le article'], 0, "Le verbe s'accorde avec le sujet pluriel : les oiseaux chantent."],
            ['Pourquoi relire une phrase après correction ?', ['Pour vérifier que le sens reste clair', 'Pour la rendre plus courte', 'Pour changer le sujet', 'Pour ajouter des fautes'], 0, 'Une correction doit améliorer la phrase sans en détruire le sens.']
          ]
        }
      ]
    },
    'cur_l_p5_sub_art': {
      shared: {
        sections: [
          ['Observer avant de créer', 'L artiste regarde longtemps avant de commencer. Il remarque les formes, les couleurs et la lumière. Une observation attentive donne des idées pour le dessin ou la peinture.'],
          ["Les éléments de l'oeuvre", 'Une oeuvre peut montrer des lignes, des formes, des couleurs et des textures. Les lignes guident le regard, et les couleurs créent une atmosphère. Chaque choix exprime une intention.'],
          ['Les outils et les gestes', 'Le pinceau, le crayon et les doigts ne produisent pas les mêmes traces. Le geste rapide donne du mouvement, et le geste lent donne de la précision. L artiste choisit l outil qui sert son idée.'],
          ['Partager et respecter', 'Nous présentons notre travail en expliquant notre choix en une phrase. Nous écoutons les commentaires des autres sans nous moquer. Chaque oeuvre mérite du respect, même si elle est différente.']
        ],
        vocab: [
          ['التشكيل', 'إعطاء شكل معني للخطوط والمساحات في العمل الفني.'],
          ['اللون', 'ما نراه في الأشياء مثل الأحمر والأزرق والأخضر.'],
          ['الخط', 'أثر رفيع يرسمه القلم أو الفرشاة على الورق.'],
          ['التوازن', 'تناسب أجزاء العمل بحيث يبدو مريحا للعين.'],
          ['النغم', 'درجة صوتية متناغمة في الموسيقى.'],
          ['العرض', 'تقديم العمل أمام الجمهور وشرح الفكرة منه.']
        ],
        outcomes: [
          'يصف الطالب عناصر عمل فني بلغة بسيطة.',
          'يستخدم الطالب خطوطا وألوانا متنوعة في عمله.',
          'يعبّر الطالب عن فكرة بسيطة من خلال الرسم أو الموسيقى.',
          'يقدّم الطالب عمله ويشرح اختياره في جملة.'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'فن الرسم',
          intro: 'نتعرف إلى خطوات الرسم ونرسم مشهدا بسيطا من محيطنا.',
          sections: [
            ['الملاحظة ثم الرسم', 'ننظر أولا إلى شجرة الزيتون في الساحة: جذعها و أغصانها وأوراقها. نرسم الخطوط العامة خفيفة، ثم نضيف التفاصيل. الرسم الجيد يبدأ بملاحظة هادئة.'],
            ['الخطوط والفراغ', 'الخطوط القوية تظهر الأشكال، والخطوط الخفيفة تظهر الظلّ. نترك فراغا بين الأجزاء حتى لا يبدو الرسم مزدحما. التوازن بين الخط والفراغ يجعل الصورة أوضح.']
          ],
          examples: [
            ['ارسم شجرة في ثلاث خطوات.', ['أرسم الخط الأفقي للأرض.', 'أرسم الجذع ثم الأغصان.', 'أضيف الأوراق بلمسات خفيفة.'], 'الرسم يبدأ بالأرض، ثم الجذع، ثم الأوراق.'],
            ['كيف أظهر الظلّ؟', ['أختار لونا أغمق من لون الأوراق.', 'أضعه جهة واحدة من الجذع.', 'أخفّف الضغط بالقلم للتدريج.'], 'اللون الأغمق في جهة واحدة يوحي بالظلّ.']
          ],
          questions: [
            ['ما أول خطوة في رسم مشهد؟', ['تلوين الورقة كلها', 'ملاحظة الشكل بتمعن', 'رسم التفاصيل فورا', 'قص الورقة'], 1, 'الملاحظة تحدد الخطوط الأساسية قبل إضافة التفاصيل واللون.'],
            ['ما أثر الخطوط الخفيفة؟', ['تجعل الرسم مزدحما', 'تساعد على إظهار الظل والتدريج', 'تمحو الرسم', 'تغير الورقة'], 1, 'الضغط الخفيف ينتج خطا باهتا يصلح للظل والتدرّج.'],
            ['لماذا نترك فراغا في الرسم؟', ['لجعل الشكل أوضح ومريحا للعين', 'لعدم استخدام الألوان', 'لزيادة عدد الخطوط', 'لتغيير الورقة'], 0, 'الفراغ يوازن المساحات ويمنع ازدحام العناصر.'],
            ['أي أداة تعطي خطا رفيعا دقيقا؟', ['القلم الرصاص', 'الفرشاة العريضة', 'الإسفنجة', 'اليد مفتوحة'], 0, 'القلم الرصاص يسمح بخطوط رفيعة دقيقة، بخلاف الأدوات العريضة.']
          ]
        },
        {
          t: 'فن التلوين',
          intro: 'نتعرف إلى الألوان وكيف نمزجها ونوزّعها في عمل فني.',
          sections: [
            ['الألوان الأساسية', 'الأحمر والأزرق والأصفر ألوان أساسية لا نحصل عليها بالمزج. إذا مزجنا الأزرق والأصفر حصلنا على الأخضر، وهو لون مركّب. نجرّب المزج على ورقة منفصلة قبل التلوين.'],
            ['توزيع الألوان', 'الألوان الدافئة مثل الأحمر والبرتقالي تعطي إحساسا بالدفء، والألوان الباردة مثل الأزرق تعطي إحساسا بالهدوء. نختار الألوان حسب المعنى الذي نريد إيصاله.']
          ],
          examples: [
            ['كيف نحصل على اللون الأخضر؟', ['نضع قليلا من الأزرق على اللوح.', 'نضيف قليلا من الأصفر.', 'نمزج حتى يصبح اللون أخضر.'], 'الأزرق مع الأصفر يعطيان الأخضر.'],
            ['لوّن مشهدا صباحيا.', ['أختار الأصفر للشمس.', 'أختار الأزرق الفاتح للسماء.', 'أختار الأخضر للأشجار.'], 'مجموع الألوان الفاتحة يعطي إحساس الصباح.']
          ],
          questions: [
            ['أي لونين نمزجهما لنحصل على الأخضر؟', ['الأحمر والأصفر', 'الأزرق والأصفر', 'الأحمر والأزرق', 'الأبيض والأسود'], 1, 'مزج الأزرق والأصفر ينتج الأخضر.'],
            ['ما اللون المركّب؟', ['لون لا يتغير بالمزج', 'لون نحصل عليه من مزج لونين', 'لون أساسي فقط', 'لون الورقة'], 1, 'اللون المركّب ينتج من مزج لونين أساسيين.'],
            ['أي لون يعطي إحساسا بالهدوء غالبا؟', ['الأحمر', 'البرتقالي', 'الأزرق', 'الأصفر'], 2, 'الأزرق من الألوان الباردة التي توحي بالهدوء والسماء.'],
            ['لماذا نجرّب المزج على ورقة منفصلة؟', ['لنتجنب إفساد العمل النهائي', 'لأن التلوين ممنوع', 'لأن الورقة أكبر', 'لتغيير الفرشاة'], 0, 'التجربة على ورقة أخرى تسمح بتعديل النسبة قبل التلوين النهائي.']
          ]
        },
        {
          t: 'الموسيقى والإيقاع',
          intro: 'نكتشف النغم والإيقاع وننتج إيقاعا بسيطا بأصوات من محيطنا.',
          sections: [
            ['النغم والصوت', 'الصوت قد يكون حادّا أو غليظا. النغم درجة صوتية نستطيع تمييزها بالأذن. إذا غنّينا « دو ري مي » ننتقل بين درجات متتابعة.'],
            ['الإيقاع والآلات', 'الإيقاع هو تكرار أصوات في زمن منتظم. نستطيع صنع إيقاع بالتصفيق أو بطرق خفيف على الطاولة. الآلات مثل الدفّ والعود تعطي ألوانا صوتية مختلفة.']
          ],
          examples: [
            ['كوّن إيقاعا من أربع نبضات.', ['صفّق مرتين متتاليتين.', 'اسكت نبضة واحدة.', 'صفّق مرة أخيرة.'], 'الإيقاع: صفق، صفق، سكوت، صفق.'],
            ['ميّز بين صوت حاد وغليظ.', ['استمع إلى صوت الطفل.', 'استمع إلى صوت الرجل.', 'قارن بينهما.'], 'صوت الطفل حاد، وصوت الرجل غليظ.']
          ],
          questions: [
            ['ما المقصود بالإيقاع في درس الموسيقى؟', ['تكرار أصوات بانتظام', 'لون الطلاء', 'شكل الورقة', 'رائحة الورد'], 0, 'الإيقاع نظام من النبضات الصوتية المتكررة في الزمن.'],
            ['أيّ صوت حادّ؟', ['صوت الطفل الصغير', 'صوت الطبل الكبير', 'صوت الرعد', 'صوت الباب الثقيل'], 0, 'الأصوات الحادة تكون أعلى درجة، وصوت الطفل مثال قريب منها.'],
            ['كيف نصنع إيقاعا بسيطا؟', [' بالتصفيق المنتظم', 'بالكتابة فقط', 'بالنظر للون', 'بإغلاق العينين'], 0, 'التصفيق في نبضات منتظمة ينتج إيقاعا يمكن تكراره.'],
            ['ما اسم الآلة التي تعطي لونا صوتيا مختلفا؟', ['الدفّ', 'الورقة', 'القلم', 'المقعد'], 0, 'الدفّ آلة موسيقية تنتج صوتا إيقاعيا، بخلاف الأشياء الأخرى.']
          ]
        },
        {
          t: 'المسرح والتعبير',
          intro: 'نجرّب التعبير بالجسد والصوت في عرض مسرحي قصير.',
          sections: [
            ['الجسد يعبّر', 'الوقوف منتصبا يدل على الثقة، والانحناء يدل على التعب أو الحزن. نستطيع تمثيل شجرة بأذرع ممدودة. الحركة البسيطة توصل المعنى دون كلام كثير.'],
            ['الصوت في المسرح', 'نغيّر نبرة الصوت حسب الشخصية: صوت هادئ للجدّ وصوت سريع للطفل. نتحكم في مستوى الصوت حتى يسمع الجمهور دون صراخ. التمثيل الجماعي يحتاج إلى إنصات كل ممثل للآخر.']
          ],
          examples: [
            ['مثّل ريحا قوية.', ['أمدّ ذراعي جانبا.', 'أحرك الجسم ببطء ثم بسرعة.', 'أقلّد صوت الريح بهدوء.'], 'الحركة والصوت معا يعطيان فكرة الريح.'],
            ['قدّم مشهدا قصيرا في السوق.', ['أختار دور البائع.', 'يختار زميلي دور المشتري.', 'نتبادل جملا قصيرة: كم الثمن؟'], 'التبادل البسيط يصنع مشهدا مسرحيا واضحا.']
          ],
          questions: [
            ['كيف نعبّر عن الثقة بالجسد؟', ['بالوقوف منتصبا', 'بالانحناء الشديد', 'بالجلوس مغطى الوجه', 'بالصمت التام'], 0, 'الوقوف منتصبا يوحي بالثقة، بينما الانحناء يوحي بأحاسيس أخرى.'],
            ['لماذا نغيّر نبرة الصوت في المسرح؟', ['لنميّز الشخصيات', 'لنزيد عدد الممثلين', 'لنغير المكان', 'لتجنب الحركة'], 0, 'تغيير النبرة يساعد الجمهور على تمييز الشخصيات بعضها من بعض.'],
            ['ما أول شرط للعمل في فريق مسرحي؟', ['الإنصات للآخرين', 'الصراخ دائما', 'القيام وحده بكل الأدوار', 'تجاهل النص'], 0, 'الإنصات يضمن دخول كل ممثل في وقته المناسب.'],
            ['أيّ عرض يحترم الجمهور؟', ['عرض يبدأ بعد أن يهدأ الجميع', 'عرض بصوت عال جدا', 'عرض يسخر من زميل', 'عرض بلا ترتيب'], 0, 'البدء بهدوء واحترام الزملاء يجعل العرض ممتعا للجميع.']
          ]
        }
      ]
    },
    'cur_l_p6_sub_sci': {
      shared: {
        sections: [
          ['الملاحظة والسؤال', 'يبدأ العمل العلمي بملاحظة دقيقة وسؤال واضح. نلاحظ ما يحدث حولنا ثم نسأل: لماذا يحدث هذا؟ السؤال الجيد يساعدنا على اختيار التجربة المناسبة.'],
          ['الفرضية والتجربة', 'الفرضية تخمين مبني على ما نعرفه. نختبرها بتجربة نغيّر فيها عاملا واحدا فقط ونراقب النتيجة. تسجيل الملاحظات أثناء التجربة ضروري.'],
          ['النتائج والتحليل', 'نقارن ما لاحظناه بما توقّعناه. إذا اختلفت النتيجة عن الفرضية فلا نعتبر ذلك فشلا، بل معلومة جديدة. نكتب النتيجة بجملة واضحة تدل على ما حدث فعلا.'],
          ['الاستنتاج والمشاركة', 'نستخلص حكما عاما من تجارب متكررة، ثم نشاركه مع زملائنا. نذكر الأدلة التي تدعم استنتاجنا. العلم عمل جماعي يتطلب الصدق والدقة.']
        ],
        vocab: [
          ['الفرضية', 'تخمين مبني على ملاحظة يمكن اختباره بالتجربة.'],
          ['التجربة', 'عملية منظّمة نختبر فيها فكرة ونراقب النتيجة.'],
          ['الطاقة', 'ما يجعل الأشياء تتحرك أو تتغير أو تصدر ضوءا وحرارة.'],
          ['المادة', 'كل ما يشغل حيزا وله كتلة، مثل الماء والهواء والحديد.'],
          ['الخلية', 'وحدة بناء الكائنات الحية.'],
          ['الاستنتاج', 'حكم عام نصل إليه بعد تحليل النتائج وتكرار التجربة.']
        ],
        outcomes: [
          'يصيغ الطالب فرضية قابلة للاختبار من ملاحظة بسيطة.',
          'يشرح الطالب تحوّلا فيزيائيا أو كيميائيا بمثال مألوف.',
          'يحدّد الطالب وظيفة خلية أو عضو في كائن حي.',
          'يسجّل الطالب خطوات التجربة ونتائجها بترتيب.'
        ],
        outcomeTr: {
          fr: [
            "L'élève formule une hypothèse testable à partir d'une observation simple.",
            "L'élève explique un changement physique ou chimique avec un exemple familier.",
            "L'élève identifie la fonction d'une cellule ou d'un organe chez un être vivant.",
            "L'élève consigne dans l'ordre les étapes et les résultats d'une expérience."
          ],
          en: [
            'The learner states a testable hypothesis from a simple observation.',
            'The learner explains a physical or chemical change with a familiar example.',
            'The learner identifies the function of a cell or an organ in a living thing.',
            'The learner records the steps and results of an experiment in order.'
          ]
        },
        diagram: 'diagram-states-of-matter.svg'
      },
      lessons: [
        {
          t: 'الفيزياء: المادة وحالاتها',
          intro: 'ندرس المادة من حولنا ونلاحظ كيف تتغير حالتها بالحرارة والبرودة.',
          sections: [
            ['حالات المادة', 'المادة ثلاث حالات: صلبة وسائلة وغازية. الحجر صلب يحتفظ بشكله، والماء سائل يأخذ شكل الإناء، والهواء غاز يملأ الفراغ. نرى ذلك في الثلج والماء والبخار.'],
            ['الحرارة وتغيّر الحالة', 'عند تسخين الثلج يذوب فيصبح ماءً، وعند غلي الماء يتحول إلى بخار. إذا برّدنا البخار عاد ماءً. الحرارة تزيد حركة الجسيمات، فتتغير الحالة دون أن يتغير نوع المادة.']
          ],
          examples: [
            ['ماذا يحدث لقطعة ثلج في كوب دافئ؟', ['نضع قطعة ثلج في الكوب.', 'نلاحظ أنها تصبح ماءً.', 'نقول: الثلج ذاب بسبب الحرارة.'], 'الثلج تحوّل من الصلب إلى السائل.'],
            ['لماذا يظهر بخار فوق قدر الغلي؟', ['نسخّن الماء حتى يغلي.', 'نرى فقاعات ثم بخارا فوقه.', 'نستنتج أن الماء تحوّل إلى غاز.'], 'البخار هو الماء في حالته الغازية.']
          ],
          questions: [
            ['أيّ مادة تأخذ شكل الإناء؟', ['الحجر', 'الماء', 'الخشب', 'الحديد'], 1, 'السائل ليس له شكل ثابت، فيأخذ شكل الإناء الذي يوضع فيه.'],
            ['ماذا يحدث للماء عند تبريده بشدة؟', ['يصبح بخارا', 'يتجمد ثلجا', 'يختفي', 'يتغير لونه'], 1, 'عند انخفاض الحرارة يتجمد الماء ويتحول إلى ثلج صلب.'],
            ['ما الذي يسبب ذوبان الثلج؟', ['البرودة', 'الحرارة', 'الضوء فقط', 'الصمت'], 1, 'امتصاص الحرارة يزيد حركة الجسيمات فيذوب الثلج.'],
            ['أيّ تغيّر لا يغيّر نوع المادة؟', ['احتراق الورق', 'ذوبان الثلج', 'صدأ الحديد', 'تحلل الطعام'], 1, 'ذوبان الثلج تغيّر في الحالة فقط، وتبقى مادة الماء نفسها.']
          ],
          tr: {
            fr: {
              t: 'La physique : les états de la matière',
              intro: 'Nous étudions la matière autour de nous et observons comment son état change avec la chaleur et le froid.',
              sections: [
                ['Observer et questionner', "Le travail scientifique commence par une observation précise et une question claire. Nous observons ce qui se passe autour de nous, puis nous demandons : pourquoi cela arrive-t-il ? Une bonne question nous aide à choisir l'expérience adaptée."],
                ['Les états de la matière', "La matière a trois états : solide, liquide et gazeux. Une pierre est solide et garde sa forme, l'eau est liquide et prend la forme du récipient, et l'air est gazeux et occupe tout l espace. Nous voyons cela avec la glace, l'eau et la vapeur."],
                ['Hypothèse et expérience', "Une hypothèse est une supposition fondée sur ce que nous savons. Nous la testons avec une expérience où nous ne changeons qu un seul facteur et nous observons le résultat. Noter les observations pendant l'expérience est indispensable."],
                ['La chaleur et le changement d état', "Quand nous chauffons la glace, elle fond et devient de l'eau ; quand nous faisons bouillir l'eau, elle devient vapeur. Si nous refroidissons la vapeur, elle redevient eau. La chaleur augmente le mouvement des particules, et l'état change sans que la substance change."],
                ['Résultats et analyse', "Nous comparons ce que nous avons observé avec ce que nous attendions. Si le résultat diffère de l'hypothèse, ce n'est pas un échec mais une information nouvelle. Nous écrivons le résultat dans une phrase claire qui dit ce qui s'est vraiment passé."],
                ['Conclusion et partage', 'Nous tirons une règle générale de plusieurs expériences, puis nous la partageons avec les camarades. Nous citons les preuves qui appuient notre conclusion. La science est un travail collectif qui demande honnêteté et précision.']
              ],
              vocab: [
                ['une hypothèse', "Une supposition fondée sur une observation et que l'on peut tester."],
                ['une expérience', 'Une opération organisée pour tester une idée et observer le résultat.'],
                ['l énergie', 'Ce qui permet aux objets de bouger, de changer ou de produire lumière et chaleur.'],
                ['la matière', "Tout ce qui occupe une place et a une masse, comme l'eau, l'air et le fer."],
                ['la cellule', 'L unité de base des êtres vivants.'],
                ['une conclusion', "Une idée générale obtenue après l'analyse des résultats."]
              ],
              examples: [
                ['Que se passe-t-il avec un glaçon dans un verre tiède ?', ['Nous posons un glaçon dans le verre.', "Nous observons qu'il devient de l'eau.", 'Nous disons : le glaçon a fondu à cause de la chaleur.'], "Le glaçon est passé de l'état solide à l'état liquide."],
                ["Pourquoi voit-on de la vapeur au-dessus d'une casserole ?", ["Nous chauffons l'eau jusqu'à l'ébullition.", 'Nous voyons des bulles puis de la vapeur.', "Nous en déduisons que l'eau est devenue gazeuse."], "La vapeur est l'eau à l'état gazeux."]
              ]
            },
            en: {
              t: 'Physics: matter and its states',
              intro: 'We study matter around us and observe how its state changes with heat and cold.',
              sections: [
                ['Observing and questioning', 'Scientific work starts with a careful observation and a clear question. We watch what happens around us and then ask: why does this happen? A good question helps us choose the right experiment.'],
                ['The states of matter', 'Matter has three states: solid, liquid and gas. A stone is solid and keeps its shape, water is liquid and takes the shape of its container, and air is gas and fills all space. We see this with ice, water and steam.'],
                ['Hypothesis and experiment', 'A hypothesis is a guess based on what we know. We test it with an experiment where we change only one factor and observe the result. Writing down observations during the experiment is essential.'],
                ['Heat and change of state', 'When we heat ice, it melts into water; when we boil water, it turns into steam. If we cool the steam, it becomes water again. Heat increases the movement of particles, so the state changes while the substance stays the same.'],
                ['Results and analysis', 'We compare what we observed with what we expected. If the result differs from the hypothesis, this is not failure but new information. We write the result in a clear sentence that says what really happened.'],
                ['Conclusion and sharing', 'We draw a general rule from several experiments and share it with classmates. We give the evidence that supports our conclusion. Science is a team effort that requires honesty and accuracy.']
              ],
              vocab: [
                ['hypothesis', 'A guess based on an observation that can be tested.'],
                ['experiment', 'An organised activity used to test an idea and observe the result.'],
                ['energy', 'What makes objects move, change or produce light and heat.'],
                ['matter', 'Anything that takes up space and has mass, such as water, air and iron.'],
                ['cell', 'The basic unit of living things.'],
                ['conclusion', 'A general idea reached after analysing the results.']
              ],
              examples: [
                ['What happens to an ice cube in a warm glass?', ['We put an ice cube in the glass.', 'We see it turn into water.', 'We say: the ice melted because of the heat.'], 'The ice changed from solid to liquid.'],
                ['Why do we see steam above a boiling pot?', ['We heat the water until it boils.', 'We see bubbles and then steam.', 'We conclude that the water became a gas.'], 'Steam is water in its gaseous state.']
              ]
            }
          }
        },
        {
          t: 'الكيمياء: التغيّرات في المادة',
          intro: 'نميّز بين التغيّر الفيزيائي والتغيّر الكيميائي بأمثلة من المطبخ والبيت.',
          sections: [
            ['تغيّر في الشكل فقط', 'إذا كسرنا قطعة طباشير تغيّر شكلها ولكنها بقيت طباشير. وإذا ذوّبنا السكر في الماء اختفى لكن طعمه بقي. هذه تغيّرات فيزيائية لا تنتج مادة جديدة.'],
            ['تغيّر ينتج مادة جديدة', 'عند احتراق الخشب ينتج رماد ودخان، ولا يمكن استعادة الخشب بسهولة. وعند صدأ الحديد يتكوّن سطح بني جديد. هذه تغيّرات كيميائية لأن هوية المادة تغيرت.']
          ],
          examples: [
            ['هل تقطيع الورق تغيّر كيميائي؟', ['ننظر إلى القطع الصغيرة.', 'اللون والرائحة لم يتغيرا.', 'الورق بقي ورقا.'], 'لا، إنه تغيّر فيزيائي لأن المادة لم تتبدل.'],
            ['لماذا يعدّ خبز العجين تغيّرا كيميائيا؟', ['العجين قبل الخبز لين.', 'الحرارة تنتج رائحة ولونا جديدين.', 'لا نستطيع إعادة الخبز إلى عجين.'], 'لأن الحرارة كوّنت مادة جديدة ذات رائحة وطعم مختلفين.']
          ],
          questions: [
            ['أي تغيّر كيميائي؟', ['ذوبان الملح', 'احتراق الورق', 'كسر القلم', 'تقطيع التفاحة'], 1, 'الاحتراق ينتج رمادا وغازات، أي مادة جديدة، بخلاف التقطيع أو الذوبان.'],
            ['كيف نعرف أن تغيّرا كيميائيا حدث؟', ['يتغير الشكل فقط', 'تظهر مادة جديدة برائحة أو لون مختلف', 'يزداد الحجم فقط', 'يبقى كل شيء كما كان'], 1, 'ظهور رائحة أو لون أو غاز جديد يدل على تكوّن مادة مختلفة.'],
            ['ما اسم التغيّر الذي يبقي المادة نفسها؟', ['كيميائي', 'فيزيائي', 'حيوي', 'اجتماعي'], 1, 'التغيّر الفيزيائي يغيّر الشكل أو الحالة دون تغيير هوية المادة.'],
            ['ماذا ينتج عن صدأ الحديد؟', ['حديد أنظف', 'مادة بنية جديدة', 'ماء صاف', 'ضوء'], 1, 'الصدأ مادة جديدة تتكوّن على سطح الحديد بفعل الهواء والرطوبة.']
          ],
          tr: {
            fr: {
              t: 'La chimie : les changements de la matière',
              intro: "Nous distinguons un changement physique d'un changement chimique avec des exemples de la cuisine et de la maison.",
              sections: [
                ['Observer et questionner', "Le travail scientifique commence par une observation précise et une question claire. Nous observons ce qui se passe autour de nous, puis nous demandons : pourquoi cela arrive-t-il ? Une bonne question nous aide à choisir l'expérience adaptée."],
                ['Un changement de forme seulement', "Si nous cassons un morceau de craie, sa forme change mais c'est toujours de la craie. Si nous dissolvons du sucre dans l'eau, il disparaît à la vue mais son goût reste. Ce sont des changements physiques : aucune nouvelle substance ne se forme."],
                ['Hypothèse et expérience', "Une hypothèse est une supposition fondée sur ce que nous savons. Nous la testons avec une expérience où nous ne changeons qu un seul facteur et nous observons le résultat. Noter les observations pendant l'expérience est indispensable."],
                ['Un changement qui crée une substance', 'Quand le bois brûle, il donne des cendres et de la fumée, et nous ne pouvons pas facilement retrouver le bois. Quand le fer rouille, une nouvelle surface brune apparaît. Ce sont des changements chimiques, car l identité de la matière a changé.'],
                ['Résultats et analyse', "Nous comparons ce que nous avons observé avec ce que nous attendions. Si le résultat diffère de l'hypothèse, ce n'est pas un échec mais une information nouvelle. Nous écrivons le résultat dans une phrase claire qui dit ce qui s'est vraiment passé."],
                ['Conclusion et partage', 'Nous tirons une règle générale de plusieurs expériences, puis nous la partageons avec les camarades. Nous citons les preuves qui appuient notre conclusion. La science est un travail collectif qui demande honnêteté et précision.']
              ],
              vocab: [
                ['une hypothèse', "Une supposition fondée sur une observation et que l'on peut tester."],
                ['une expérience', 'Une opération organisée pour tester une idée et observer le résultat.'],
                ['l énergie', 'Ce qui permet aux objets de bouger, de changer ou de produire lumière et chaleur.'],
                ['la matière', "Tout ce qui occupe une place et a une masse, comme l'eau, l'air et le fer."],
                ['la cellule', 'L unité de base des êtres vivants.'],
                ['une conclusion', "Une idée générale obtenue après l'analyse des résultats."]
              ],
              examples: [
                ['Découper du papier est-il un changement chimique ?', ['Nous regardons les petits morceaux.', "La couleur et l'odeur n'ont pas changé.", 'Le papier reste du papier.'], "Non, c'est un changement physique, car la matière est restée la même."],
                ['Pourquoi cuire une pâte est-il un changement chimique ?', ['La pâte est molle avant la cuisson.', 'La chaleur crée une nouvelle odeur et une nouvelle couleur.', 'Nous ne pouvons pas rendre au pain sa forme de pâte.'], 'Parce que la chaleur a formé une nouvelle matière au goût différent.']
              ]
            },
            en: {
              t: 'Chemistry: changes in matter',
              intro: 'We tell a physical change from a chemical change using examples from the kitchen and the home.',
              sections: [
                ['Observing and questioning', 'Scientific work starts with a careful observation and a clear question. We watch what happens around us and then ask: why does this happen? A good question helps us choose the right experiment.'],
                ['A change of shape only', 'If we break a piece of chalk, its shape changes but it is still chalk. If we dissolve sugar in water, it disappears from sight but its taste remains. These are physical changes: no new substance is formed.'],
                ['Hypothesis and experiment', 'A hypothesis is a guess based on what we know. We test it with an experiment where we change only one factor and observe the result. Writing down observations during the experiment is essential.'],
                ['A change that makes a new substance', 'When wood burns it produces ash and smoke, and we cannot easily get the wood back. When iron rusts, a new brown surface appears. These are chemical changes because the identity of the matter has changed.'],
                ['Results and analysis', 'We compare what we observed with what we expected. If the result differs from the hypothesis, this is not failure but new information. We write the result in a clear sentence that says what really happened.'],
                ['Conclusion and sharing', 'We draw a general rule from several experiments and share it with classmates. We give the evidence that supports our conclusion. Science is a team effort that requires honesty and accuracy.']
              ],
              vocab: [
                ['hypothesis', 'A guess based on an observation that can be tested.'],
                ['experiment', 'An organised activity used to test an idea and observe the result.'],
                ['energy', 'What makes objects move, change or produce light and heat.'],
                ['matter', 'Anything that takes up space and has mass, such as water, air and iron.'],
                ['cell', 'The basic unit of living things.'],
                ['conclusion', 'A general idea reached after analysing the results.']
              ],
              examples: [
                ['Is cutting paper a chemical change?', ['We look at the small pieces.', 'The colour and smell have not changed.', 'The paper is still paper.'], 'No, it is a physical change because the matter stayed the same.'],
                ['Why is baking dough a chemical change?', ['The dough is soft before baking.', 'Heat creates a new smell and colour.', 'We cannot turn bread back into dough.'], 'Because heat formed a new substance with a different taste.']
              ]
            }
          }
        },
        {
          t: 'الأحياء: الخلية والكائنات',
          intro: 'نتعرف إلى الخلية كوحدة بناء الكائنات الحية ونقارن بين النبات والحيوان.',
          sections: [
            ['وحدة البناء', 'كل كائن حي يتكوّن من خلايا. الخلية صغيرة جدا لا تُرى بالعين المجردة، ولكننا نرى أثرها في النمو. النبات والحيوان كلاهما يتكوّن من خلايا، ولهما حاجة إلى الماء والغذاء.'],
            ['الفرق بين النبات والحيوان', 'النبات يصنع غذاءه بنفسه بفضل الضوء، أما الحيوان فيأكل نباتات أو حيوانات أخرى. خلية النبات لها جدار ثابت، وخلية الحيوان ليس لها جدار. النبات يبقى في مكانه والحيوان يتحرك غالبا.']
          ],
          examples: [
            ['لماذا نقول إن النبات كائن حي؟', ['النبات ينمو ويتكاثر.', 'يحتاج الماء والضوء.', 'يتكوّن من خلايا.'], 'لأنه يقوم بوظائف الحياة كلها.'],
            ['كيف نفهم أن الخلية صغيرة؟', ['ننظر إلى ورقة شجرة.', 'الورقة مكوّنة من ملايين الخلايا.', 'لا نرى الخلية الواحدة إلا بمساعدة المجهر.'], 'حجم الخلية صغير جدا، لذلك نحتاج إلى المجهر لرؤيتها.']
          ],
          questions: [
            ['ما وحدة بناء الكائنات الحية؟', ['الخلية', 'الحجر', 'الماء', 'الهواء'], 0, 'كل كائن حي يتكوّن من خلايا، وهي أصغر وحدة حية.'],
            ['كيف يحصل النبات على غذائه؟', ['يأكل حيوانات', 'يصنعه بفضل الضوء', 'يشرب الحليب', 'يشتريه من السوق'], 1, 'النبات يصنع غذاءه في أوراقه باستخدام ضوء الشمس والماء.'],
            ['أي فرق بين خلية النبات وخلية الحيوان؟', ['للنبات جدار ثابت', 'للحيوان أوراق', 'النبات بلا خلايا', 'الحيوان بلا ماء'], 0, 'خلية النبات تتميز بجدار ثابت يساعد النبات على الوقوف.'],
            ['لماذا نستخدم المجهر؟', ['لرؤية أشياء صغيرة جدا', 'لتسخين الماء', 'لقياس الطول', ' لسماع الصوت'], 0, 'المجهر يكبّر الأشياء الدقيقة مثل الخلية حتى نستطيع رؤيتها.']
          ],
          tr: {
            fr: {
              t: 'Les êtres vivants : la cellule',
              intro: "Nous découvrons la cellule comme unité de base des êtres vivants et nous comparons la plante et l'animal.",
              sections: [
                ['Observer et questionner', "Le travail scientifique commence par une observation précise et une question claire. Nous observons ce qui se passe autour de nous, puis nous demandons : pourquoi cela arrive-t-il ? Une bonne question nous aide à choisir l'expérience adaptée."],
                ['L unité de base', "Tout être vivant est fait de cellules. La cellule est si petite qu'on ne la voit pas à l oeil nu, mais nous observons son effet dans la croissance. La plante et l'animal sont faits de cellules et ont besoin d'eau et de nourriture."],
                ['Hypothèse et expérience', "Une hypothèse est une supposition fondée sur ce que nous savons. Nous la testons avec une expérience où nous ne changeons qu un seul facteur et nous observons le résultat. Noter les observations pendant l'expérience est indispensable."],
                ["La plante et l'animal", "La plante fabrique elle-même sa nourriture grâce à la lumière, tandis que l'animal mange des plantes ou d'autres animaux. La cellule végétale a une paroi fixe, celle de l'animal n en a pas. La plante reste en place et l'animal se déplace généralement."],
                ['Résultats et analyse', "Nous comparons ce que nous avons observé avec ce que nous attendions. Si le résultat diffère de l'hypothèse, ce n'est pas un échec mais une information nouvelle. Nous écrivons le résultat dans une phrase claire qui dit ce qui s'est vraiment passé."],
                ['Conclusion et partage', 'Nous tirons une règle générale de plusieurs expériences, puis nous la partageons avec les camarades. Nous citons les preuves qui appuient notre conclusion. La science est un travail collectif qui demande honnêteté et précision.']
              ],
              vocab: [
                ['une hypothèse', "Une supposition fondée sur une observation et que l'on peut tester."],
                ['une expérience', 'Une opération organisée pour tester une idée et observer le résultat.'],
                ['l énergie', 'Ce qui permet aux objets de bouger, de changer ou de produire lumière et chaleur.'],
                ['la matière', "Tout ce qui occupe une place et a une masse, comme l'eau, l'air et le fer."],
                ['la cellule', 'L unité de base des êtres vivants.'],
                ['une conclusion', "Une idée générale obtenue après l'analyse des résultats."]
              ],
              examples: [
                ['Pourquoi la plante est-elle un être vivant ?', ['La plante grandit et se reproduit.', "Elle a besoin d'eau et de lumière.", 'Elle est faite de cellules.'], "Parce qu'elle accomplit toutes les fonctions de la vie."],
                ['Comment comprendre que la cellule est petite ?', ['Nous regardons une feuille.', 'La feuille contient des millions de cellules.', 'Nous ne voyons pas une seule cellule sans microscope.'], "La cellule est si petite qu'il faut un microscope pour la voir."]
              ]
            },
            en: {
              t: 'Living things: the cell',
              intro: 'We learn that the cell is the basic unit of living things and compare plants and animals.',
              sections: [
                ['Observing and questioning', 'Scientific work starts with a careful observation and a clear question. We watch what happens around us and then ask: why does this happen? A good question helps us choose the right experiment.'],
                ['The basic unit', 'Every living thing is made of cells. A cell is so small that we cannot see it with the naked eye, but we notice its effect in growth. Plants and animals are both made of cells and need water and food.'],
                ['Hypothesis and experiment', 'A hypothesis is a guess based on what we know. We test it with an experiment where we change only one factor and observe the result. Writing down observations during the experiment is essential.'],
                ['Plants and animals', 'A plant makes its own food thanks to light, while an animal eats plants or other animals. A plant cell has a fixed wall, while an animal cell does not. A plant stays in place and an animal usually moves.'],
                ['Results and analysis', 'We compare what we observed with what we expected. If the result differs from the hypothesis, this is not failure but new information. We write the result in a clear sentence that says what really happened.'],
                ['Conclusion and sharing', 'We draw a general rule from several experiments and share it with classmates. We give the evidence that supports our conclusion. Science is a team effort that requires honesty and accuracy.']
              ],
              vocab: [
                ['hypothesis', 'A guess based on an observation that can be tested.'],
                ['experiment', 'An organised activity used to test an idea and observe the result.'],
                ['energy', 'What makes objects move, change or produce light and heat.'],
                ['matter', 'Anything that takes up space and has mass, such as water, air and iron.'],
                ['cell', 'The basic unit of living things.'],
                ['conclusion', 'A general idea reached after analysing the results.']
              ],
              examples: [
                ['Why is a plant a living thing?', ['A plant grows and reproduces.', 'It needs water and light.', 'It is made of cells.'], 'Because it carries out all the functions of life.'],
                ['How do we know a cell is tiny?', ['We look at a leaf.', 'The leaf contains millions of cells.', 'We cannot see one cell without a microscope.'], 'A cell is so small that we need a microscope to see it.']
              ]
            }
          }
        },
        {
          t: 'المنهج العلمي من الملاحظة إلى الاستنتاج',
          intro: 'نتدرب على خطوات البحث العلمي في تجربة بسيطة حول سرعة ذوبان السكر.',
          sections: [
            ['ترتيب الخطوات', 'المنهج العلمي يمرّ بمراحل: الملاحظة، والسؤال، والفرضية، والتجربة، وتسجيل النتائج، ثم الاستنتاج. نكتب كل مرحلة في جدول حتى لا ننسى جزءا. الترتيب يجعل العمل موثوقا.'],
            ['ضبط التجربة', 'نغيّر عاملا واحدا فقط في كل مرة، مثل حرارة الماء، ونثبّت بقية العوامل مثل كمية السكر وحجم الكوب. إذا غيّرنا أكثر من عامل لم نعرف أيّها سبّب النتيجة. نعيد التجربة للتأكد.']
          ],
          examples: [
            ['صغ فرضية عن ذوبان السكر.', ['ألاحظ أن السكر يذوب أسرع في الماء الدافئ.', 'أسأل: هل الحرارة تسرّع الذوبان؟', 'أكتب: إذا سخّنت الماء فسيدوب السكر أسرع.'], 'الفرضية: الحرارة تزيد سرعة ذوبان السكر.'],
            ['سجّل نتائج تجربة.', ['أكتب عدد ملاعق السكر.', 'أكتب زمن الذوبان في كل كوب.', 'أقارن الأرقام وأكتب الاستنتاج.'], 'التسجيل المنظّم يجعل المقارنة ممكنة.']
          ],
          questions: [
            ['ما أول خطوة في المنهج العلمي؟', ['الاستنتاج', 'الملاحظة', 'نشر النتيجة', 'تغيير العوامل'], 1, 'كل بحث يبدأ بملاحظة تدفعنا إلى طرح سؤال واضح.'],
            ['لماذا نغيّر عاملا واحدا فقط في تجربة ذوبان السكر؟', ['لنعرف سبب النتيجة بدقة', 'لأن التجربة قصيرة', 'لأن العوامل متشابهة', 'لتقليل الكتابة'], 0, 'تثبيت بقية العوامل يجعل العلاقة بين السبب والنتيجة واضحة.'],
            ['ماذا نفعل إذا لم تطابق النتيجة فرضيتنا؟', ['نعدّل الفرضية بعد فهم النتيجة', 'نحذف النتيجة', 'نغيّر السؤال فورا', 'نتوقف عن العمل'], 0, 'اختلاف النتيجة معلومة مفيدة تدفعنا إلى مراجعة الفرضية وتحسينها.'],
            ['لماذا نعيد التجربة عدة مرات؟', ['للتأكد من تكرار النتيجة', 'لزيادة عدد الأدوات', 'لتغيير الموضوع', 'لتجنب الكتابة'], 0, 'التكرار يقلّل أثر الصدفة ويزيد الثقة في النتيجة.']
          ],
          tr: {
            fr: {
              t: 'La démarche scientifique : de l observation à la conclusion',
              intro: 'Nous entraînons aux étapes de la recherche scientifique avec une expérience simple sur la dissolution du sucre.',
              sections: [
                ['Observer et questionner', "Le travail scientifique commence par une observation précise et une question claire. Nous observons ce qui se passe autour de nous, puis nous demandons : pourquoi cela arrive-t-il ? Une bonne question nous aide à choisir l'expérience adaptée."],
                ['Ordonner les étapes', 'La démarche scientifique suit plusieurs étapes : observation, question, hypothèse, expérience, enregistrement des résultats, puis conclusion. Nous écrivons chaque étape dans un tableau pour n en oublier aucune. Cet ordre rend le travail fiable.'],
                ['Hypothèse et expérience', "Une hypothèse est une supposition fondée sur ce que nous savons. Nous la testons avec une expérience où nous ne changeons qu un seul facteur et nous observons le résultat. Noter les observations pendant l'expérience est indispensable."],
                ["Contrôler l'expérience", "Nous ne changeons qu un seul facteur à la fois, par exemple la température de l'eau, et nous gardons les autres constants comme la quantité de sucre et la taille du verre. Si nous changeons plusieurs facteurs, nous ne savons pas lequel a causé le résultat. Nous recommençons pour vérifier."],
                ['Résultats et analyse', "Nous comparons ce que nous avons observé avec ce que nous attendions. Si le résultat diffère de l'hypothèse, ce n'est pas un échec mais une information nouvelle. Nous écrivons le résultat dans une phrase claire qui dit ce qui s'est vraiment passé."],
                ['Conclusion et partage', 'Nous tirons une règle générale de plusieurs expériences, puis nous la partageons avec les camarades. Nous citons les preuves qui appuient notre conclusion. La science est un travail collectif qui demande honnêteté et précision.']
              ],
              vocab: [
                ['une hypothèse', "Une supposition fondée sur une observation et que l'on peut tester."],
                ['une expérience', 'Une opération organisée pour tester une idée et observer le résultat.'],
                ['l énergie', 'Ce qui permet aux objets de bouger, de changer ou de produire lumière et chaleur.'],
                ['la matière', "Tout ce qui occupe une place et a une masse, comme l'eau, l'air et le fer."],
                ['la cellule', 'L unité de base des êtres vivants.'],
                ['une conclusion', "Une idée générale obtenue après l'analyse des résultats."]
              ],
              examples: [
                ['Formule une hypothèse sur la dissolution du sucre.', ["J observe que le sucre fond plus vite dans l'eau chaude.", 'Je me demande : la chaleur accélère-t-elle la dissolution ?', "J'écris : si je chauffe l'eau, le sucre fondra plus vite."], 'Hypothèse : la chaleur augmente la vitesse de dissolution du sucre.'],
                ["Enregistre les résultats de l'expérience.", ["J'écris le nombre de cuillères de sucre.", "J'écris le temps de dissolution dans chaque verre.", "Je compare les nombres et j'écris la conclusion."], 'Un enregistrement clair rend la comparaison possible.']
              ]
            },
            en: {
              t: 'The scientific method: from observation to conclusion',
              intro: 'We practise the steps of scientific research with a simple experiment about sugar dissolving.',
              sections: [
                ['Observing and questioning', 'Scientific work starts with a careful observation and a clear question. We watch what happens around us and then ask: why does this happen? A good question helps us choose the right experiment.'],
                ['Ordering the steps', 'The scientific method follows several steps: observation, question, hypothesis, experiment, recording results and then a conclusion. We write each step in a table so we do not forget any. This order makes the work reliable.'],
                ['Hypothesis and experiment', 'A hypothesis is a guess based on what we know. We test it with an experiment where we change only one factor and observe the result. Writing down observations during the experiment is essential.'],
                ['Controlling the experiment', 'We change only one factor at a time, such as the temperature of the water, and keep the others the same, such as the amount of sugar and the size of the cup. If we change several factors, we cannot tell which one caused the result. We repeat the experiment to check.'],
                ['Results and analysis', 'We compare what we observed with what we expected. If the result differs from the hypothesis, this is not failure but new information. We write the result in a clear sentence that says what really happened.'],
                ['Conclusion and sharing', 'We draw a general rule from several experiments and share it with classmates. We give the evidence that supports our conclusion. Science is a team effort that requires honesty and accuracy.']
              ],
              vocab: [
                ['hypothesis', 'A guess based on an observation that can be tested.'],
                ['experiment', 'An organised activity used to test an idea and observe the result.'],
                ['energy', 'What makes objects move, change or produce light and heat.'],
                ['matter', 'Anything that takes up space and has mass, such as water, air and iron.'],
                ['cell', 'The basic unit of living things.'],
                ['conclusion', 'A general idea reached after analysing the results.']
              ],
              examples: [
                ['Make a hypothesis about sugar dissolving.', ['I notice that sugar dissolves faster in warm water.', 'I ask: does heat speed up dissolving?', 'I write: if I heat the water, the sugar will dissolve faster.'], 'Hypothesis: heat increases the speed at which sugar dissolves.'],
                ['Record the results of the experiment.', ['I write the number of spoons of sugar.', 'I write the dissolving time in each cup.', 'I compare the numbers and write the conclusion.'], 'Clear recording makes comparison possible.']
              ]
            }
          }
        }
      ]
    }
  }
};
