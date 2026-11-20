module.exports = {
  units: {
    'cur7': {
      shared: {
        sections: [
          ['Wörter sind klein, aber wichtig', 'Ein Wort kann man hören, sagen und schreiben. In der deutschen Sprache beginnt jedes Substantiv mit einem Großbuchstaben. Das hilft beim Lesen.'],
          ['Ich höre und spreche', 'Beim Sprechen hören wir zuerst zu. Dann wiederholen wir das Wort leise und danach laut. So lernt das Ohr die neue Sprache.'],
          ['Bilder helfen beim Lernen', 'Ein Bild zeigt uns, was ein Wort bedeutet. Wenn wir das Bild und das Wort zusammen sehen, bleiben beide im Gedächtnis.'],
          ['Ich übe jeden Tag', 'Kurze Übungen sind besser als lange Pausen. Drei Minuten am Tag reichen für den Anfang.']
        ],
        vocab: [
          ['Hallo', 'Ein freundliches Wort beim Treffen.'],
          ['Ich heiße ...', 'So sagt man seinen Namen.'],
          ['die Mutter', 'Die Frau, die ein Kind hat.'],
          ['der Vater', 'Der Mann, der ein Kind hat.'],
          ['rot', 'Die Farbe vom Apfel und vom Feuer.'],
          ['das Kind', 'Ein junger Mensch in der Familie.']
        ],
        outcomes: [
          'Die Lernenden begrüßen eine Person auf Deutsch mit einem passenden Satz.',
          'Die Lernenden nennen mindestens drei Familienmitglieder auf Deutsch.',
          'Die Lernenden erkennen zwei Grundfarben und benennen sie.',
          'Die Lernenden stellen sich in zwei kurzen Sätzen vor.'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'Hallo und mein Name',
          intro: 'Heute lernen wir, wie man sich auf Deutsch begrüßt und den Namen sagt. Das ist der erste Schritt im neuen Kurs.',
          sections: [
            ['Zwei Begrüßungen', 'Hallo sagt man Freunden und Kindern. Guten Tag klingt etwas förmlicher. Beide Wörter bedeuten, dass man die andere Person freundlich ansieht.'],
            ['Mein Name', 'Man sagt Ich heiße Sara oder Ich bin Sara. Nach dem Namen fragt man mit Wie heißt du? Die Antwort ist immer ein ganzer Satz.']
          ],
          examples: [
            ['Du triffst ein neues Kind im Schulhof. Wie begrüßt du es?', ['Zuerst schaust du freundlich hin.', 'Du sagst: Hallo!', 'Du fragst: Wie heißt du?'], 'Hallo! Wie heißt du?'],
            ['Dein Name ist Karim. Stelle dich vor.', ['Du nennst zuerst deinen Namen.', 'Du sagst Ich heiße Karim.', 'Du kannst noch Freut mich sagen.'], 'Ich heiße Karim. Freut mich!']
          ],
          questions: [
            ['Welches Wort passt beim Treffen mit einem Freund?', ['Hallo', 'Tisch', 'Langsam', 'Regen'], 0, 'Hallo ist eine Begrüßung; die anderen Wörter bezeichnen Dinge oder Arten und keine Begrüßung.'],
            ['Welche Frage fragt ein Kind nach deinem Namen?', ['Wie heißt du?', 'Wo wohnst du?', 'Wie geht es dem Hund?', 'Was machst du morgen?'], 0, 'Wie heißt du? erfragt den Namen; die anderen Fragen erfragen Ort, Befinden oder eine Handlung.'],
            ['Welcher Satz stellt Lina vor?', ['Ich heiße Lina.', 'Ich bin heiße Lina.', 'Heiße ich Lina.', 'Lina heiße ich bin.'], 0, 'Nach Ich heiße steht der Name direkt; die anderen Sätze haben die Wortstellung verwechselt.'],
            ['Du sagst Guten Tag. Wann passt das besonders gut?', ['Am Morgen in der Schule', 'Beim Schlafen', 'Im Stadion beim Rennen', 'Beim Schwimmen'], 0, 'Guten Tag ist eine Tagesbegrüßung und passt zu einem Schulmorgen, nicht zu diesen Tätigkeiten.']
          ]
        },
        {
          t: 'Meine Familie',
          intro: 'In dieser Stunde lernen wir die Wörter für die Menschen in unserer Familie. Wir üben, sie einfach auf Deutsch zu nennen.',
          sections: [
            ['Mutter und Vater', 'Die Mutter und der Vater sind die Eltern. Im Deutschen steht vor diesen Wörtern die oder der. Das nennt man den Artikel.'],
            ['Geschwister', 'Die Schwester und der Bruder sind Geschwister. Man kann sagen: Ich habe eine Schwester oder Ich habe zwei Brüder.']
          ],
          examples: [
            ['Du zeigst ein Bild von deiner Mutter. Was sagst du?', ['Du zeigst auf die Person.', 'Du sagst Das ist meine Mutter.', 'Du wiederholst das Wort Mutter leise.'], 'Das ist meine Mutter.'],
            ['Karim hat einen Bruder und eine Schwester. Wie sagt er das?', ['Er zählt zuerst die Personen.', 'Er benutzt ein und eine.', 'Er bildet einen Satz mit haben.'], 'Ich habe einen Bruder und eine Schwester.']
          ],
          questions: [
            ['Welches Wort bedeutet die Frau, die ein Kind hat?', ['die Mutter', 'der Bruder', 'das Kind', 'der Vater'], 0, 'Mutter bezeichnet den weiblichen Elternteil; die anderen Wörter bezeichnen andere Familienrollen.'],
            ['Welcher Artikel gehört zu Vater?', ['der', 'die', 'das', 'keiner'], 0, 'Im Deutschen ist Vater männlich und bekommt den Artikel der.'],
            ['Wie heißt ein junger Mensch in der Familie?', ['das Kind', 'die Mutter', 'der Vater', 'die Schwester'], 0, 'Kind bedeutet ein junger Mensch; die anderen Wörter benennen Erwachsene oder Geschwister.'],
            ['Welcher Satz passt zu einem Bild mit zwei Schwestern?', ['Ich habe zwei Schwestern.', 'Ich habe zwei Bruder.', 'Ich bin zwei Schwestern.', 'Zwei Schwestern ist mich.'], 0, 'Nach der Zahl zwei steht die Mehrzahl Schwestern mit dem Verb habe.']
          ]
        },
        {
          t: 'Farben und Dinge',
          intro: 'Wir schauen uns bunte Dinge im Klassenzimmer an und lernen ihre Farben auf Deutsch kennen.',
          sections: [
            ['rot und blau', 'Rot ist die Farbe vom Apfel. Blau ist die Farbe vom Himmel an einem klaren Tag. Die Wörter stehen klein, wenn sie kein Substantiv sind.'],
            ['Was ist das?', 'Mit Das ist ein ... benennen wir einen Gegenstand. Ein oder eine hängt vom Wort ab: ein Ball, aber eine Tasche.']
          ],
          examples: [
            ['Du siehst einen roten Ball. Beschreibe ihn.', ['Du nennst zuerst den Gegenstand.', 'Du nennst die Farbe.', 'Du sagst einen ganzen Satz.'], 'Das ist ein roter Ball.'],
            ['Deine Tasche ist blau. Wie sagst du das?', ['Du sagst Meine Tasche ...', 'Du wählst die Farbe blau.', 'Du schließt den Satz mit ist.'], 'Meine Tasche ist blau.']
          ],
          questions: [
            ['Welche Farbe hat ein reifer Apfel oft?', ['rot', 'blau', 'grau', 'schwarz'], 0, 'Ein reifer Apfel ist häufig rot; die anderen Farben passen hier nicht zur Erfahrung.'],
            ['Welches Wort passt: Das ist ... Ball?', ['ein roter', 'eine rote', 'ein roten', 'eine roten'], 0, 'Ball ist männlich, deshalb steht ein roter Ball; die anderen Formen vereinen Artikel und Endung falsch.'],
            ['Wie heißt die Farbe vom klaren Himmel?', ['blau', 'rot', 'gelb', 'braun'], 0, 'Der klare Himmel erscheint blau; die anderen Farben beschreiben andere Eindrücke.'],
            ['Welches Wort ist kein Gegenstand?', ['grün', 'Buch', 'Ball', 'Tasche'], 0, 'Grün ist eine Farbe, die anderen drei Wörter benennen Dinge.']
          ]
        },
        {
          t: 'Wiederholung: Ich stelle mich vor',
          intro: 'Jetzt wiederholen wir alle Wörter aus dieser Woche und benutzen sie in einem kurzen Gespräch.',
          sections: [
            ['Ein kurzes Gespräch', 'Ein Gespräch hat oft zwei Teile: eine Frage und eine Antwort. Man hört zu und antwortet mit einem ganzen Satz.'],
            ['Mein erster Satz', 'Du kannst sagen: Hallo, ich heiße Sara und das ist meine Mutter. So verbindest du zwei gelernte Wörter zu einem neuen Satz.']
          ],
          examples: [
            ['Setze die Wörter zusammen: Hallo / heiße / ich / Lina.', ['Du stellst die Begrüßung an den Anfang.', 'Dann folgt ich heiße.', 'Zum Schluss nennst du den Namen.'], 'Hallo, ich heiße Lina.'],
            ['Du zeigst deinen blauen Ball und sagst deinen Namen. Was sagst du?', ['Du nennst zuerst den Namen.', 'Du zeigst auf den Ball.', 'Du nennst Farbe und Gegenstand.'], 'Ich heiße Karim. Das ist ein blauer Ball.']
          ],
          questions: [
            ['Welche Antwort passt zu Wie heißt du??', ['Ich heiße Sara.', 'Ich habe eine Tasche.', 'Der Ball ist rot.', 'Guten Morgen.'], 0, 'Die Frage fragt nach dem Namen, deshalb passt nur ein Satz mit ich heiße.'],
            ['Welches Wort gehört nicht in die Familie?', ['die Mutter', 'der Vater', 'der Ball', 'die Schwester'], 0, 'Ball ist ein Gegenstand; die anderen Wörter bezeichnen Familienmitglieder.'],
            ['Welche Farbe passt: Das ist ein ... Ball im Bild mit gelbem Ball?', ['gelber', 'rote', 'blaue', 'grüne'], 0, 'Ball ist männlich, daher ein gelber Ball.'],
            ['Was macht ein gutes Gespräch am Anfang?', ['Man hört zu und grüßt.', 'Man schweigt die ganze Zeit.', 'Man nennt nur Zahlen.', 'Man schreibt ein langes Buch.'], 0, 'Zuhören und Grüßen eröffnen ein Gespräch; die anderen Alternativen passen nicht.']
          ]
        }
      ]
    },
    'cur15': {
      shared: {
        sections: [
          ['Ein Satz hat eine Ordnung', 'Im Deutschen steht das Verb oft an zweiter Stelle. Ich gehe zur Schule ist ein kurzer, richtiger Satz.'],
          ['Dinge benennen', 'Substantive haben im Deutschen einen Artikel: der, die oder das. Man lernt das Wort am besten zusammen mit dem Artikel.'],
          ['Zahlen im Alltag', 'Zahlen helfen beim Zählen, beim Preis und bei der Uhrzeit. Man sagt zuerst die Zahl und dann das Wort dazu.'],
          ['Fragen und Antworten', 'Eine Frage beginnt oft mit Was, Wie oder Wo. Die Antwort ist ein vollständiger Satz.']
        ],
        vocab: [
          ['der Ranzen', 'Die Tasche, in der Kinder ihre Bücher tragen.'],
          ['das Buch', 'Man liest darin Geschichten und lernt neue Wörter.'],
          ['der Stift', 'Damit schreibt man auf Papier.'],
          ['die Stunde', 'Eine Zeit im Stundenplan, in der man lernt.'],
          ['der Markt', 'Ein Ort, wo man Obst und Gemüse kauft.'],
          ['Wie viel?', 'So fragt man nach dem Preis.']
        ],
        outcomes: [
          'Die Lernenden benennen drei Schulgegenstände mit dem richtigen Artikel.',
          'Die Lernenden bilden Sätze mit dem Verb an zweiter Stelle.',
          'Die Lernenden fragen nach einem Preis und antworten mit einer Zahl.',
          'Die Lernenden ordnen drei Tätigkeiten eines Tages zeitlich ein.'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'Mein Schulranzen',
          intro: 'Wir schauen in den Schulranzen und lernen, wie man die Dinge darin auf Deutsch benennt.',
          sections: [
            ['Der Ranzen', 'Der Ranzen ist die Tasche für die Schule. Man sagt auch die Schultasche. Beide Wörter bezeichnen dasselbe.'],
            ['Bücher und Stifte', 'Das Buch ist ein Buch und der Stift ist ein Stift. Man kann sagen: In meinem Ranzen ist ein Buch.']
          ],
          examples: [
            ['Du hast drei Bücher und zwei Stifte. Wie sagst du das?', ['Du nennst zuerst den Ort.', 'Du zählst die Bücher.', 'Du zählst die Stifte.'], 'In meinem Ranzen sind drei Bücher und zwei Stifte.'],
            ['Dein Freund fragt: Was ist das? bei einem Stift. Antworte.', ['Du wiederholst die Frage nicht.', 'Du sagst den Artikel und das Wort.', 'Du bildest einen Satz mit ist.'], 'Das ist ein Stift.']
          ],
          questions: [
            ['Welches Wort passt: Ich nehme ... zur Schule?', ['den Ranzen', 'die Ranzen', 'das Ranzen', 'Ranzen'], 0, 'Ranzen ist männlich; nach nehme steht die Form den Ranzen.'],
            ['Welches Wort ist kein Schulgegenstand?', ['das Buch', 'der Stift', 'der Markt', 'der Ranzen'], 0, 'Markt ist ein Ort, die anderen Wörter benennen Dinge aus der Schule.'],
            ['Wie sagt man ein Buch mit Artikel?', ['das Buch', 'der Buch', 'die Buch', 'den Buch'], 0, 'Buch ist sächlich und bekommt den Artikel das.'],
            ['Welcher Satz steht in der richtigen Reihenfolge?', ['Ich gehe zur Schule.', 'Gehe ich zur Schule.', 'Ich zur Schule gehe.', 'Zur Schule ich gehe.'], 0, 'Das Verb gehe steht an zweiter Stelle nach dem Subjekt Ich.']
          ]
        },
        {
          t: 'Der Stundenplan',
          intro: 'Heute üben wir Wochentage und Fächer. So kannst du deinen Stundenplan auf Deutsch erklären.',
          sections: [
            ['Die Wochentage', 'Montag, Dienstag und Mittwoch sind die ersten Tage der Woche. Man sagt: Am Montag habe ich Deutsch.'],
            ['Meine Fächer', 'Mathematik, Deutsch und Sport sind Fächer. Mit Ich mag ... sagst du, was dir gefällt.']
          ],
          examples: [
            ['Am Dienstag hast du Sport. Wie sagst du das?', ['Du nennst den Tag mit Am.', 'Du nennst das Fach.', 'Du benutzt habe ich.'], 'Am Dienstag habe ich Sport.'],
            ['Du magst Mathematik nicht besonders. Sag einen höflichen Satz.', ['Du sagst erst Ich mag ...', 'Du nennst das Fach.', 'Du fügst nicht so sehr hinzu.'], 'Ich mag Mathematik nicht so sehr.']
          ],
          questions: [
            ['Welcher Tag kommt nach dem Montag?', ['Dienstag', 'Sonntag', 'Freitag', 'Samstag'], 0, 'In der Wochenfolge folgt auf den Montag der Dienstag.'],
            ['Wie sagt man den Satz richtig?', ['Am Mittwoch habe ich Deutsch.', 'Mittwoch ich habe Deutsch.', 'Am Mittwoch ich Deutsch habe.', 'Ich am Mittwoch habe Deutsch.'], 0, 'Am Mittwoch steht am Anfang, danach folgt habe ich.'],
            ['Welches Wort ist ein Fach?', ['Sport', 'Montag', 'Ranzen', 'Apfel'], 0, 'Sport ist ein Unterrichtsfach; die anderen Wörter bezeichnen Tag, Gegenstand oder Obst.'],
            ['Was bedeutet Ich mag Deutsch?', ['Deutsch gefällt mir.', 'Ich schreibe Deutsch falsch.', 'Ich habe kein Deutsch.', 'Ich höre kein Deutsch.'], 0, 'Mögen drückt hier eine Vorliebe aus, also gefällt dir das Fach.']
          ]
        },
        {
          t: 'Einkaufen auf dem Markt',
          intro: 'Wir üben Zahlen und Preise, wie man sie auf dem Markt in Marokko hört.',
          sections: [
            ['Wie viel kostet das?', 'Mit Wie viel kostet der Apfel? fragt man nach dem Preis. Die Antwort ist: Der Apfel kostet zwei Dirham.'],
            ['Obst und Gemüse', 'Die Tomate, der Apfel und die Banane liegen auf dem Markt. Man kann mehrere Dinge nennen: Ich kaufe Äpfel und Tomaten.']
          ],
          examples: [
            ['Eine Banane kostet drei Dirham. Frage nach dem Preis.', ['Du beginnst mit Wie viel.', 'Du nennst die Banane.', 'Du sagst kostet.'], 'Wie viel kostet die Banane?'],
            ['Du kaufst zwei Äpfel zu je zwei Dirham. Wie viel zahlst du?', ['Du nennst den Preis für einen Apfel.', 'Du rechnest zwei mal zwei.', 'Du sagst den Gesamtpreis.'], 'Zwei Äpfel kosten vier Dirham.']
          ],
          questions: [
            ['Wie fragt man nach dem Preis?', ['Wie viel kostet das?', 'Wie heißt du?', 'Wo ist die Schule?', 'Wann schläfst du?'], 0, 'Nur Wie viel kostet das? fragt nach Geld; die anderen Fragen zielen auf Name, Ort oder Zeit.'],
            ['Der Apfel kostet zwei Dirham, die Banane drei. Was kostet beides?', ['fünf Dirham', 'zwei Dirham', 'drei Dirham', 'sechs Dirham'], 0, 'Zwei plus drei ergibt fünf; die anderen Zahlen ignorieren eine der beiden Früchte.'],
            ['Welches Wort ist Obst?', ['die Banane', 'die Tasche', 'der Stift', 'der Montag'], 0, 'Banane ist eine Frucht, die anderen Wörter sind Gegenstand, Schreibzeug und Wochentag.'],
            ['Welcher Satz ist höflich beim Kauf?', ['Ich möchte bitte einen Apfel.', 'Gib mir Apfel sofort.', 'Apfel ich will.', 'Ich Apfel bitte.'], 0, 'Ich möchte bitte ... ist eine höfliche Bitte mit korrekter Wortstellung.']
          ]
        },
        {
          t: 'Wiederholung: Mein Tag',
          intro: 'Wir verbinden die Wörter aus dieser Woche zu einem kurzen Bericht über deinen Tag.',
          sections: [
            ['Von morgens bis abends', 'Am Morgen gehe ich zur Schule, am Nachmittag spiele ich. Mit zuerst und danach ordnest du die Tätigkeiten.'],
            ['Alles zusammen', 'Ein kurzer Text kann so klingen: Ich habe einen Ranzen. Am Montag habe ich Deutsch. Wiederhole die Sätze laut.']
          ],
          examples: [
            ['Ordne: Schule / aufstehen / spielen.', ['Du nennst zuerst die erste Handlung.', 'Dann folgt die Schule.', 'Zum Schluss kommt das Spielen.'], 'Zuerst stehe ich auf, dann gehe ich zur Schule und danach spiele ich.'],
            ['Sag, wie viel dein Heft kostet: drei Dirham.', ['Du nennst den Gegenstand.', 'Du sagst kostet.', 'Du nennst den Preis.'], 'Das Heft kostet drei Dirham.']
          ],
          questions: [
            ['Welches Wort zeigt die Reihenfolge?', ['zuerst', 'sehr', 'vielleicht', 'immer'], 0, 'Zuerst ordnet Handlungen zeitlich; die anderen Wörter beschreiben Grad, Möglichkeit oder Häufigkeit.'],
            ['Welcher Satz passt zum Morgen?', ['Ich gehe zur Schule.', 'Ich schlafe tief.', 'Ich kaufe einen Ranzen.', 'Ich schreibe ein Buch.'], 0, 'Zur Schulzeit am Morgen passt der Weg zur Schule; die anderen Tätigkeiten passen weniger.'],
            ['Welches Wort hat den richtigen Artikel?', ['der Apfel', 'die Apfel', 'das Apfel', 'den Apfel'], 0, 'Apfel ist männlich, daher der Apfel.'],
            ['Was ist das Ziel der Wiederholung?', ['Ich kann meine Wörter sicher benutzen.', 'Ich lerne gar nichts mehr.', 'Ich schreibe nur Zahlen.', 'Ich spreche nur Arabisch.'], 0, 'Wiederholen festigt die gelernten Wörter; die anderen Antworten beschreiben keine Übung.']
          ]
        }
      ]
    },
    'cur23': {
      shared: {
        sections: [
          ['Wetter und Jahreszeiten', 'Im Sommer ist es heiß und trocken, im Winter regnet es oft. Das Wetter ändert sich von Ort zu Ort.'],
          ['Vergleichen', 'Mit größer als und billiger als vergleichen wir zwei Dinge. Man stellt die Eigenschaft und als dazwischen.'],
          ['Den Weg finden', 'Man sagt gehe geradeaus, biege links ab oder rechts neben dem Markt. So beschreibt man eine Route.'],
          ['Einen Plan machen', 'Ein Plan hat Schritte: zuerst das Ziel, dann den Weg, dann die Zeit. Man prüft am Ende, ob alles passt.']
        ],
        vocab: [
          ['heiß', 'Sehr warm, wie an einem Sommertag.'],
          ['der Regen', 'Wasser, das aus den Wolken fällt.'],
          ['billiger', 'Ein niedrigerer Preis im Vergleich.'],
          ['geradeaus', 'In einer Richtung ohne Abbiegen.'],
          ['die Ecke', 'Der Punkt, wo zwei Straßen zusammentreffen.'],
          ['die Reise', 'Ein Weg zu einem anderen Ort.']
        ],
        outcomes: [
          'Die Lernenden beschreiben das Wetter mit mindestens zwei Adjektiven.',
          'Die Lernenden vergleichen zwei Preise mit einem Komparativ.',
          'Die Lernenden geben eine dreischrittige Wegbeschreibung.',
          'Die Lernenden planen eine kurze Reise mit Zeit und Route.'
        ],
        diagram: 'diagram-seasons.svg'
      },
      lessons: [
        {
          t: 'Das Wetter in Marokko',
          intro: 'Wir sprechen über Sommer, Winter und Regen. Dabei lernen wir, das Wetter genau zu beschreiben.',
          sections: [
            ['Sommer und Winter', 'Im Sommer ist es in Marokko oft heiß und sonnig. Im Winter ist es kühler, und in den Bergen kann es schneien.'],
            ['Wetter im Satz', 'Man sagt Es ist heiß oder Es regnet. Das Wort es steht am Anfang, auch wenn wir kein sichtbares Subjekt sehen.']
          ],
          examples: [
            ['Beschreibe einen Tag im August in Marrakesch.', ['Du nennst die Jahreszeit.', 'Du wählst ein Adjektiv.', 'Du bildest einen Satz mit Es ist.'], 'Im Sommer ist es in Marrakesch heiß und sonnig.'],
            ['Es regnet heute in Casablanca. Wie sagst du das?', ['Du sagst zuerst Heute.', 'Du benutzt es regnet.', 'Du nennst den Ort.'], 'Heute regnet es in Casablanca.']
          ],
          questions: [
            ['Welches Wetterwort passt zu einem Sommertag?', ['heiß', 'kalt', 'schneiend', 'neblig'], 0, 'Ein Sommertag ist in Marokko typischerweise heiß; die anderen Wörter beschreiben kühlere Wetterlagen.'],
            ['Welcher Satz beschreibt das Wetter an einem windigen Tag?', ['Es ist heute windig.', 'Heute ist windig es.', 'Ist es heute windig es.', 'Es heute windig ist.'], 0, 'Es ist heute windig hat die richtige Reihenfolge von Subjekt, Verb und Zeitangabe.'],
            ['Wo kann es im Winter schneien?', ['In den Bergen', 'Am Strand im Sommer', 'Im Souk mittags', 'Im Klassenzimmer'], 0, 'In höheren Lagen wie dem Atlas ist Schnee möglich, die anderen Orte sind dafür untypisch.'],
            ['Was bedeutet kühler?', ['Weniger warm', 'Sehr heiß', 'Sehr nass', 'Ganz still'], 0, 'Kühler ist der Vergleich von kühl und bedeutet weniger warm.']
          ]
        },
        {
          t: 'Im Souk: Preise vergleichen',
          intro: 'Im Souk kann man Preise vergleichen. Wir üben, einen Preis als günstiger oder teurer zu bezeichnen.',
          sections: [
            ['Zwei Preise', 'Ein Apfel kostet zwei Dirham, eine Orange drei. Man sagt: Der Apfel ist billiger als die Orange.'],
            ['Teuer und günstig', 'Teurer ist das Gegenteil von billiger. Mit am billigsten vergleichen wir drei oder mehr Dinge.']
          ],
          examples: [
            ['Tee kostet 10 Dirham, Kaffee 15. Vergleiche.', ['Du nennst beide Preise.', 'Du wählst das billigere Getränk.', 'Du sagst einen Vergleichssatz.'], 'Der Tee ist billiger als der Kaffee.'],
            ['Drei Läden verkaufen Brot für 5, 6 und 4 Dirham. Was ist am günstigsten?', ['Du liest alle drei Preise.', 'Du wählst den kleinsten.', 'Du sagst am billigsten.'], 'Das Brot für vier Dirham ist am billigsten.']
          ],
          questions: [
            ['Welches Wort passt: Der Tee ist ... als der Kaffee bei 10 zu 15?', ['billiger', 'teurer', 'größer', 'später'], 0, 'Zehn Dirham sind weniger als fünfzehn, also ist der Tee billiger.'],
            ['Was ist das Gegenteil von teuer?', ['billig', 'heiß', 'schnell', 'alt'], 0, 'Billig beschreibt einen niedrigen Preis; die anderen Wörter beschreiben Temperatur, Tempo oder Alter.'],
            ['Welcher Preis ist am höchsten?', ['20 Dirham', '5 Dirham', '12 Dirham', '8 Dirham'], 0, 'Zwanzig ist die größte Zahl in der Liste und damit der höchste Preis.'],
            ['Wie sagst du, dass zwei Dinge den gleichen Preis haben?', ['Sie kosten gleich viel.', 'Sie sind billiger.', 'Sie sind teurer.', 'Sie kosten zweimal.'], 0, 'Gleich viel drückt einen gleichen Preis aus; die anderen Sätze behaupten einen Unterschied.']
          ]
        },
        {
          t: 'Den Weg beschreiben',
          intro: 'Du zeigst einem Gast den Weg zum Markt. Wir üben klare Anweisungen Schritt für Schritt.',
          sections: [
            ['Geradeaus und abbiegen', 'Gehe geradeaus heißt, du bleibst in derselben Straße. Biege links ab heißt, du wechselst die Richtung.'],
            ['Orientierungspunkte', 'Man sagt neben der Moschee oder gegenüber dem Brunnen. Solche Punkte helfen beim Zurechtfinden.']
          ],
          examples: [
            ['Der Markt ist zwei Straßen weiter links. Gib die Anweisung.', ['Du sagst zuerst gehe geradeaus.', 'Du nennst die Zahl der Straßen.', 'Du sagst biege links ab.'], 'Gehe geradeaus, nach zwei Straßen biegst du links ab.'],
            ['Die Schule ist gegenüber dem Brunnen. Wie sagst du das?', ['Du nennst die Schule als Ziel.', 'Du nennst den Brunnen als Punkt.', 'Du sagst gegenüber.'], 'Die Schule ist gegenüber dem Brunnen.']
          ],
          questions: [
            ['Was bedeutet biege rechts ab?', ['Du wechselst nach rechts die Straße.', 'Du gehst immer weiter.', 'Du bleibst stehen.', 'Du gehst zurück.'], 0, 'Rechts abbiegen bedeutet eine Richtungsänderung nach rechts.'],
            ['Welches Wort ist ein Orientierungspunkt?', ['der Brunnen', 'der Montag', 'der Stift', 'der Sommer'], 0, 'Ein Brunnen ist ein Ort in der Umgebung; die anderen Wörter bezeichnen Zeit, Gegenstand oder Jahreszeit.'],
            ['Welche Anweisung ist klar?', ['Gehe geradeaus bis zur Ecke.', 'Gehe irgendwohin.', 'Mach das schnell.', 'Komm mal her.'], 0, 'Eine klare Anweisung nennt Richtung und Ziel; die anderen sind zu ungenau.'],
            ['Du stehst vor der Moschee, der Markt ist links. Was sagst du?', ['Der Markt ist links von der Moschee.', 'Der Markt ist in der Moschee.', 'Die Moschee ist links vom Markt.', 'Der Markt ist über der Moschee.'], 0, 'Die Lage wird relativ zur Moschee beschrieben; die anderen Sätze geben die Richtung falsch wieder.']
          ]
        },
        {
          t: 'Wiederholung: Eine Reise planen',
          intro: 'Jetzt planst du eine kleine Reise: Wetter, Preise und Weg gehören zusammen.',
          sections: [
            ['Schritt für Schritt', 'Zuerst wählst du das Ziel, dann prüfst du das Wetter. Danach planst du den Weg und die Kosten für Tee und Brot.'],
            ['Am Ende prüfen', 'Ein guter Plan ist kurz und klar. Du liest alle Schritte noch einmal und verbesserst einen Satz, wenn er unklar ist.']
          ],
          examples: [
            ['Du willst nach Marrakesch fahren. Plane drei Schritte.', ['Du nennst das Ziel.', 'Du sagst etwas zum Wetter.', 'Du nennst den Weg zum Souk.'], 'Ich fahre nach Marrakesch. Es ist heiß. Ich gehe geradeaus zum Souk.'],
            ['Du hast 20 Dirham. Tee kostet 10, Brot 5. Was bleibt übrig?', ['Du addierst die Kosten.', 'Du ziehst sie von 20 ab.', 'Du sagst den Rest.'], 'Es bleiben fünf Dirham.']
          ],
          questions: [
            ['Was kommt zuerst in einen Reiseplan?', ['Das Ziel', 'Der Preis vom Tee', 'Die Farbe vom Bus', 'Das Wetter von gestern'], 0, 'Ohne Ziel kann man den Rest nicht planen; die anderen Punkte kommen später oder sind unwichtig.'],
            ['Welcher Satz ist ein guter Plan?', ['Ich fahre um neun Uhr zum Markt.', 'Ich fahre mal.', 'Der Markt ist schön.', 'Vielleicht irgendwann.'], 0, 'Ein guter Plan nennt Zeit und Ziel; die anderen Sätze sind zu ungenau.'],
            ['Welche Rechnung ist richtig: 20 - 10 - 5?', ['5', '10', '15', '25'], 0, 'Zwanzig minus zehn ergibt zehn, minus fünf ergibt fünf.'],
            ['Warum prüft man einen Plan am Ende?', ['Um Fehler zu finden.', 'Um länger zu schreiben.', 'Um das Wetter zu ändern.', 'Um neue Wörter zu erfinden.'], 0, 'Die Kontrolle dient dazu, unklare oder falsche Schritte zu korrigieren.']
          ]
        }
      ]
    }
    ,
    'cur_l_pre_sub_isl': {
      shared: {
        sections: [
          ['السلام قول وسلوك', 'السلام كلمة طيبة نقولها عند اللقاء. نقولها بصوت واضح وننظر إلى وجه أخينا.'],
          ['النية الحسنة', 'كل عمل حسن يبدأ بنية طيبة. النية تجعل العمل الصغير عند الله كبيرا.'],
          ['الأدب مع الناس', 'الأدب في القول والفعل. نستأذن قبل الدخول ونشكر من يعطينا شيئا.'],
          ['التطبيق في يومنا', 'نتدرب على هذه القيم في البيت والمدرسة. كل موقف صغير فرصة لعمل حسن.']
        ],
        vocab: [
          ['السلام', 'كلمة أمان وطمأنينة نقولها عند التحية.'],
          ['المحبة', 'حب صادق يجعلنا نتمنى الخير لغيرنا.'],
          ['التعاون', 'أن يعمل اثنان معا من أجل عمل واحد.'],
          ['الدعاء', 'طلب الخير من الله بصدق ورجاء.'],
          ['الاحترام', 'تقدير الكبير والصغير بكلام لطيف.'],
          ['الشكر', 'كلمة طيبة نقولها لمن أحسن إلينا.']
        ],
        outcomes: [
          'يقول الطالب التحية الإسلامية بصوت واضح عند لقاء زميله.',
          'يذكر الطالب موقفا يوميا يدل على المحبة.',
          'يشارك الطالب في عمل جماعي داخل الفصل.',
          'يحفظ الطالب دعاء قصيرا ويقوله في وقته.'
        ],
        diagram: 'diagram-family.svg'
      },
      lessons: [
        {
          t: 'السلام عليكم',
          intro: 'نتعلم اليوم كيف نلقي التحية على إخواننا ونرد عليها بكلمة طيبة.',
          sections: [
            ['السلام عند اللقاء', 'نقول: السلام عليكم. وجوابه: وعليكم السلام. هذه التحية تملأ القلب طمأنينة.'],
            ['أدب التحية', 'نبدأ بالسلام قبل الكلام. نقوله ونحن مبتسمون، ونصغي إلى الرد.']
          ],
          examples: [
            ['دخلت الفصل ووجدت صديقك. ماذا تقول؟', ['تقترب منه بهدوء.', 'تقول: السلام عليكم.', 'تنتظر الرد ثم تبتسم.'], 'السلام عليكم.'],
            ['قال لك زميلك: السلام عليكم. ما جوابك؟', ['تسمع التحية.', 'ترد بصوت واضح.', 'تقول: وعليكم السلام.'], 'وعليكم السلام.']
          ],
          questions: [
            ['ما جواب السلام؟', ['وعليكم السلام', 'صباح الخير', 'شكرا', 'إلى اللقاء'], 0, 'الجواب المأثور للتحية هو وعليكم السلام؛ الباقي تحيات أو عبارات أخرى.'],
            ['متى نقول السلام؟', ['عند لقاء أخينا', 'عند النوم فقط', 'عند الأكل فقط', 'عند الخروج من المدرسة فقط'], 0, 'السلام سنة عند اللقاء، ولا يقتصر على وقت واحد من هذه الأوقات.'],
            ['أي سلوك يدل على أدب التحية؟', ['الابتسامة والرد الواضح', 'الصمت التام', 'الالتفات بلا كلام', 'الكلام قبل السلام'], 0, 'الأدب في التحية أن نبتسم ونرد بوضوح، لا أن نصمت أو نبدأ بالكلام.'],
            ['ما أثر السلام في القلب؟', ['يبعث الطمأنينة', 'يغضب الناس', 'يمنع الكلام', 'يؤخر العمل'], 0, 'السلام كلمة أمان تهدئ القلب وتقرب الناس، لا تفرقهم.']
          ]
        },
        {
          t: 'المحبة بيننا',
          intro: 'المحبة أن نحب إخواننا ونتمنى لهم الخير كما نتمناه لأنفسنا.',
          sections: [
            ['حب الخير', 'المؤمن يحب لأخيه ما يحب لنفسه، فيتمنى له الخير كما يتمناه لنفسه. نفرح لنجاح صديقنا ونشكره، ولا نحسده على ما أعطاه الله.'],
            ['محبة في المدرسة', 'نساعد زميلا تعثر، ونشجعه حين يقرأ. هذه الأعمال الصغيرة هي محبة عملية.']
          ],
          examples: [
            ['زميلك سقطت دفاتره. ماذا تفعل؟', ['تقترب منه.', 'تجمع الدفاتر.', 'تساعده بكلمة لطيفة.'], 'أجمع دفاترك وأساعدك.'],
            ['صديقك نجح في القراءة. ماذا تقول؟', ['تقف بجانبه.', 'تهنئه.', 'تقول له: أحسنت.'], 'أحسنت! أنا سعيد بنجاحك.']
          ],
          questions: [
            ['ما معنى المحبة؟', ['تمني الخير للغير', 'الاستحواذ على كل شيء', 'السخرية من الناس', 'الصمت الدائم'], 0, 'المحبة هي حب الخير للآخرين، عكس الأنانية أو السخرية.'],
            ['أي موقف يدل على المحبة؟', ['مساعدة زميل تعثر', 'أخذ مكانه في الصف', 'الضحك على خطئه', 'تجاهل تحيته'], 0, 'المساعدة عند الحاجة هي محبة عملية، بينما الباقي إيذاء أو إهمال.'],
            ['كيف نهنئ صديقا ناجحا؟', ['نقول أحسنت', 'نقول لا بأس', 'نصمت', 'نغير الموضوع'], 0, 'التهنئة بالنجاح كلمة طيبة، والصمت أو تغيير الموضوع لا يعبر عن فرح.'],
            ['أين نطبق المحبة؟', ['في البيت والمدرسة', 'في مكان واحد فقط', 'عند الأصدقاء فقط', 'لا مكان لذلك'], 0, 'المحبة سلوك يومي في كل مكان، لا يقتصر على مكان واحد.']
          ]
        },
        {
          t: 'نتعاون معا',
          intro: 'التعاون أن نعمل معا في عمل واحد حتى يصبح سهلا.',
          sections: [
            ['فريق صغير', 'إذا حمل كتابا ثقيلا اثنان، يصبح خفيفا. العمل معا يوفر الوقت والجهد.'],
            ['تقسيم العمل', 'في الفصل يرتب أحدهم الدفاتر وآخر يمسح السبورة. كل واحد يعمل جزءا ويحترم عمل غيره.']
          ],
          examples: [
            ['الفصل يحتاج إلى ترتيب الطاولات. كيف تتعاونون؟', ['تقسمون الطاولات.', 'كل واحد يرتب نصيبه.', 'تتحققون من النتيجة معا.'], 'أنا أرتب ثلاث طاولات، وأنت تصف الباقي.'],
            ['زميلك لا يعرف الإجابة. كيف تساعده؟', ['تصغي لسؤاله.', 'تشرح له ببساطة.', 'تتركه يجرب بنفسه.'], 'سأشرح لك الفكرة ثم تحل أنت.']
          ],
          questions: [
            ['ما فائدة التعاون؟', ['يخفف العمل', 'يزيد الفوضى', 'يمنع المشاركة', 'يؤخر الفريق'], 0, 'التعاون يوزع العمل فيصبح أسهل وأسرع للجميع.'],
            ['أي عمل يحتاج تعاونا؟', ['رفع قطعة خشب ثقيلة', 'قراءة كتاب وحدك', 'كتابة اسمك', 'غسل يديك'], 0, 'القطعة الثقيلة تحتاج أكثر من شخص، والباقي أعمال فردية.'],
            ['ماذا يفعل العضو الجيد في الفريق؟', ['يؤدي جزءه باحترام', 'ينتظر الآخرين فقط', 'يأمر الجميع', 'يرفض المساعدة'], 0, 'العضو الجيد ينجز نصيبه ويحترم الآخرين، لا يأمر ولا يمتنع.'],
            ['كيف نحترم عمل زميلنا؟', ['نشكره ولا نستهزئ به', 'نغيره بلا إذن', 'نتجاهله', 'نقول إنه سهل'], 0, 'الاحترام يكون بالشكر والتقدير، لا بالتجاهل أو الاستهزاء.']
          ]
        },
        {
          t: 'أدعية قصيرة',
          intro: 'نتعلم أدعية قصيرة نقولها في أوقات مختلفة بصدق وهدوء.',
          sections: [
            ['الدعاء بصدق', 'الدعاء طلب من الله. نرفع أيدينا ونقوله بصوت هادئ، ونؤمن أنه يستجيب بما يحب.'],
            ['أدعية يومية', 'عند الأكل نقول: بسم الله. وإذا نسينا نقول: بسم الله أوله وآخره. هذه أدعية سهلة الحفظ.']
          ],
          examples: [
            ['بدأت تأكل الفطور. ماذا تقول؟', ['تجلس بهدوء.', 'تذكر اسم الله.', 'تقول: بسم الله.'], 'بسم الله.'],
            ['نسيت أن أقول بسم الله قبل الأكل. ماذا أقول؟', ['أتوقف قليلا.', 'أقول العبارة المأثورة.', 'أكمل الأكل.'], 'بسم الله أوله وآخره.']
          ],
          questions: [
            ['ماذا نقول قبل الأكل؟', ['بسم الله', 'الحمد لله', 'السلام عليكم', 'إلى اللقاء'], 0, 'البدء باسم الله سنة عند الأكل؛ الحمد لله بعده والباقي تحيات.'],
            ['إذا نسيت البسملة فماذا تقول؟', ['بسم الله أوله وآخره', 'شكرا', 'صباح الخير', 'لا شيء'], 0, 'العبارة المأثورة عند النسيان هي بسم الله أوله وآخره.'],
            ['كيف ندعو الله؟', ['بصدق وهدوء', 'بصوت عال جدا', 'باستهزاء', 'بلا نية'], 0, 'الدعاء يكون بحضور قلب ونية صادقة، لا بصخب أو استهزاء.'],
            ['متى نقول الحمد لله؟', ['بعد أن نكمل الأكل', 'قبل الأكل فقط', 'عند النوم فقط', 'عند الغضب فقط'], 0, 'نحمد الله بعد تمام النعمة، والباقي أوقات أخرى ليست حصرا للحمد.']
          ]
        }
      ]
    },
    'cur_l_p1_sub_isl': {
      shared: {
        sections: [
          ['الصلاة ركن من الدين', 'الصلاة عبادة يتقرب بها العبد من ربه. يؤديها المسلم خمس مرات في اليوم.'],
          ['الصدق في القول', 'الصدق أن نقول الحقيقة ولا نكذب. الكذب يهدم الثقة بين الناس.'],
          ['احترام الكبير والصغير', 'نحترم الكبار بكلام لطيف، ونرحم الصغار ونلعب معهم برفق.'],
          ['العبرة من القصص', 'قصص الأنبياء تعلمنا الصبر والصدق. نقرأها لنتعلم منها عملا في يومنا.']
        ],
        vocab: [
          ['الصلاة', 'عبادة فيها ركوع وسجود وذكر لله.'],
          ['الصدق', 'مطابقة القول للفعل والحقيقة.'],
          ['الاحترام', 'تقدير الناس ومعاملتهم بلطف.'],
          ['النبي', 'رسول أرسله الله لهداية الناس.'],
          ['الصبر', 'التماسك عند الشدة وعدم الجزع.'],
          ['الطهارة', 'الوضوء ونظافة الجسم قبل الصلاة.']
        ],
        outcomes: [
          'يذكر الطالب أركان الصلاة الأساسية بترتيبها.',
          'يمثل الطالب موقفا صادقا في الفصل.',
          'يصرف الطالب سلوكا محترما مع كبير وصغير.',
          'يستخلص الطالب عبرة من قصة نبي.'
        ],
        diagram: 'diagram-prayer.svg'
      },
      lessons: [
        {
          t: 'كيف نُصلي؟',
          intro: 'نتعلم اليوم خطوات الصلاة وكيف نستعد لها بالوضوء.',
          sections: [
            ['الطهارة قبل الصلاة', 'يتوضأ المسلم قبل الصلاة فيغسل وجهه ويديه. الوضوء نظافة وطهارة يرضي الله.'],
            ['ركعات الصلاة', 'تبدأ الصلاة بالتكبير، ثم القراءة والركوع والسجود. تنتهي بالتسليم إلى اليمين ثم اليسار.']
          ],
          examples: [
            ['حان وقت الصلاة. ماذا تفعل أولا؟', ['أنوي الصلاة.', 'أتوضأ.', 'أقف مستقبلا القبلة.'], 'أتوضأ ثم أصلي.'],
            ['أتممت الركعة. ما آخر ما تقوله في الصلاة؟', ['أقرأ الفاتحة.', 'أركع.', 'أسلم إلى اليمين واليسار.'], 'السلام عليكم ورحمة الله.']
          ],
          questions: [
            ['ما أول خطوة قبل الصلاة؟', ['الوضوء', 'الأكل', 'النوم', 'اللعب'], 0, 'الطهارة شرط للصلاة، والباقي ليس من شروطها.'],
            ['كم مرة يصلي المسلم في اليوم؟', ['خمس', 'اثنتان', 'ثلاث', 'واحدة'], 0, 'فرض الله على المسلمين خمس صلوات في اليوم والليلة.'],
            ['ماذا يفعل المصلي بعد الركوع؟', ['يسجد', 'يغسل يديه', 'يأكل', 'يغادر فورا'], 0, 'بعد الركوع يعود المصلي إلى السجود، والباقي ليس من خطوات الصلاة.'],
            ['بماذا تنتهي الصلاة؟', ['التسليم', 'التكبير فقط', 'الدعاء وحده', 'القراءة وحدها'], 0, 'تُختتم الصلاة بالتسليم يمينا ويسارا.']
          ]
        },
        {
          t: 'الصدق في كلامنا',
          intro: 'الصدق خلق جميل يجعل الناس يثقون بنا. نتدرب اليوم على قول الحقيقة.',
          sections: [
            ['لا تكذب', 'إذا أخطأنا نقول: أخطأت. الكذب يهدم الثقة، والاعتراف بالخطأ يصلحها.'],
            ['الصدق في العمل', 'نؤدي الواجب بأنفسنا ولا ننسخ إجابة زميل. العمل الصادق يفرحنا ويرضي والدينا.']
          ],
          examples: [
            ['كسرت قلما وسألتك والدتك. ماذا تقول؟', ['تقول الحقيقة.', 'تعتذر.', 'تعد بإصلاح الخطأ.'], 'أنا كسرت القلم، آسف، سأشتري غيره.'],
            ['سألك المعلم هل حفظت الدرس ولم تحفظه. ماذا تقول؟', ['تقول بصدق.', 'تذكر أنك ستذاكر.', 'لا تنكر الحقيقة.'], 'لم أحفظه بعد، سأذاكر الليلة.']
          ],
          questions: [
            ['ماذا نفعل إذا أخطأنا؟', ['نعترف ونعتذر', 'ننكر', 'نلوم غيرنا', 'نصمت للأبد'], 0, 'الاعتراف والاعتذار يصلح الخطأ، والإنكار يزيده.'],
            ['أي سلوك صادق؟', ['أؤدي واجبي بنفسي', 'أنسخ من زميل', 'أقول إني حفظت وأنا لم أحفظ', 'أخفي الخطأ'], 0, 'العمل الذاتي هو الصدق، والباقي خداع أو كذب.'],
            ['ما نتيجة الكذب؟', ['فقدان الثقة', 'زيادة الأصدقاء', 'حب الناس', 'راحة دائمة'], 0, 'الكذب يهدم الثقة، والثقة لا تعود إلا بالصدق.'],
            ['كيف نقول الحقيقة بأدب؟', ['بهدوء واعتذار', 'بصوت عال', 'باستهزاء', 'غاضبين'], 0, 'الحقيقة مع الأدب تكون هادئة ومحترمة.']
          ]
        },
        {
          t: 'أحترم الكبير وأرحم الصغير',
          intro: 'نتعلم كيف نعامل الكبار باحترام والصغار برفق.',
          sections: [
            ['مع الكبار', 'نخاطب الجد والجدة بكلمة لطيفة، ونصغي إليهما. لا نرفع أصواتنا في وجههما.'],
            ['مع الصغار', 'الطفل الصغير يحتاج إلى لطف. نعطيه مكانا ونلعب معه بلطف ونحذر من إيذائه.']
          ],
          examples: [
            ['دخل جدك الغرفة. ماذا تقول؟', ['تقف له.', 'تقول مرحبا جدّي.', 'تصغي إليه.'], 'مرحبا جدّي، كيف حالك؟'],
            ['أخوك الصغير يريد الكتاب. ماذا تفعل؟', ['تعطيه بعد أن تقرأ.', 'تقول له بلطف.', 'تساعده في الإمساك به.'], 'خذ الكتاب بعدي، سأعطيه لك.']
          ],
          questions: [
            ['كيف نخاطب الجد؟', ['بكلمة لطيفة', 'بصوت مرتفع', 'بإشارة فقط', 'بلا تحية'], 0, 'الاحترام يظهر في الكلام اللطيف والإنصات.'],
            ['ماذا يستحق الطفل الصغير؟', ['الرفق واللطف', 'الإهمال', 'الضحك على أخطائه', 'الضغط'], 0, 'الصغير يحتاج رعاية ولطفا، لا إهمالا أو سخرية.'],
            ['أي سلوك محترم؟', ['الإنصات للمتحدث', 'مقاطعته', 'النظر بعيدا', 'الضحك بصوت عال'], 0, 'الإنصات علامة احترام، والمقاطعة والإهمال علامة عدم احترام.'],
            ['ماذا لو أخطأ كبير في الكلام؟', ['أنصت له بلطف', 'أوبخه', 'أضحك', 'أغادر بلا كلمة'], 0, 'الأدب يقتضي حسن الاستماع، والتوبيخ أو السخرية لا يليق.']
          ]
        },
        {
          t: 'من قصص الأنبياء',
          intro: 'نقرأ قصص الأنبياء لنأخذ منها دروسا في الصبر والصدق.',
          sections: [
            ['قصة يعقوب ويوسف', 'صبر يعقوب على فراق ابنه، وصبر يوسف على الغربة. الصبر جميل حين يتعاون مع الدعاء.'],
            ['العبرة العملية', 'نتعلم أن لا نيأس عند الشدة، وأن نقول الحقيقة حتى لو كان الأمر صعبا.']
          ],
          examples: [
            ['زميلك تأخر عنك في اللعب. كيف تصبر؟', ['لا تغضب.', 'تسأله بلطف.', 'تنتظره.'], 'سأنتظرك، لا بأس.'],
            ['سألت عن كتابك فلم تجده. كيف تتصرف؟', ['لا تتهم أحدا.', 'تبحث بهدوء.', 'تقول الحقيقة.'], 'لا أعرف مكانه، سأبحث عنه.']
          ],
          questions: [
            ['ماذا تعلمنا قصة يوسف؟', ['الصبر والدعاء', 'الهروب من المشكلات', 'الكذب', 'الأنانية'], 0, 'القصة تعلم الصبر على المحنة واللجوء إلى الله.'],
            ['كيف نصبر عند الشدة؟', ['ندعو الله ونتماسك', 'نصرخ', 'نلوم الجميع', 'نترك العمل'], 0, 'الصبر مع الدعاء هو السلوك الحسن، والباقي يزيد المشكلة.'],
            ['من أنبياء الله؟', ['يعقوب', 'أحمد', 'خالد', 'ليلى'], 0, 'يعقوب ويوسف من الأنبياء، والباقي أسماء أخرى ليست أنبياء في هذه القائمة.'],
            ['ما فائدة قراءة القصص؟', ['أخذ عبرة للعمل', 'النوم فقط', 'تغيير التاريخ', 'اللعب فقط'], 0, 'القصة الحسنة تعطينا درسا نطبقه، لا تغير التاريخ.']
          ]
        }
      ]
    }
    ,
    'cur_l_p2_sub_math': {
      shared: {
        sections: [
          ['العدد والقيمة', 'العدد يتكون من أرقام، وكل رقم له قيمة حسب مكانه. في العدد 345 ثلاثة مئات وأربعة عشرات وخمسة آحاد.'],
          ['الجمع والطرح', 'الجمع يزيد العدد والطرح ينقصه. نرتب الأعداد تحت بعضها حسب المنازل قبل الحساب.'],
          ['الضرب مجموع متكرر', 'الضرب اختصار لجمع العدد نفسه عدة مرات. 3 × 4 تعني أربعة مجمعات من ثلاثة، أي 12.'],
          ['القياس في حياتنا', 'نقيس الطول بالسنتيمتر والوزن بالكيلوغرام. اختيار الوحدة المناسبة يجعل الجواب واضحا.']
        ],
        vocab: [
          ['المنزلة', 'مكان الرقم في العدد مثل الآحاد أو العشرات أو المئات.'],
          ['الآحاد', 'المنزلة الأخيرة في العدد إلى اليمين.'],
          ['العشرات', 'المنزلة الثانية من اليمين.'],
          ['المئات', 'المنزلة الثالثة من اليمين.'],
          ['الضرب', 'عملية تكرار العدد نفسه عدة مرات.'],
          ['السنتيمتر', 'وحدة لقياس الطول أصغر من المتر.']
        ],
        outcomes: [
          'يقرأ الطالب أعدادا حتى 1000 ويكتبها بالرموز والكلمات.',
          'يحل الطالب مسائل جمع وطرح داخل 1000 مع إعادة تجميع.',
          'يحسب الطالب نواتج ضرب داخل جدول الضرب حتى 9 × 9.',
          'يختار الطالب وحدة القياس المناسبة وينسبها إلى الطول أو الوزن.'
        ],
        outcomeTr: {
          fr: [
            "L'apprenant lit des nombres jusqu'à 1000 et les écrit en chiffres et en lettres.",
            "L'apprenant résout des additions et des soustractions jusqu'à 1000 avec regroupement.",
            "L'apprenant calcule les produits de la table de multiplication jusqu'à 9 × 9.",
            "L'apprenant choisit l'unité de mesure adaptée et la relie à la longueur ou au poids."
          ],
          en: [
            'The learner reads numbers up to 1000 and writes them in digits and words.',
            'The learner solves addition and subtraction problems within 1000 with regrouping.',
            'The learner calculates products from the multiplication table up to 9 × 9.',
            'The learner chooses the appropriate unit of measurement and matches it to length or weight.'
          ]
        },
        diagram: 'diagram-place-value.svg'
      },
      lessons: [
        {
          t: 'الأعداد حتى 1000',
          intro: 'نتعلم قراءة الأعداد الكبيرة وكتابتها، ونميز قيمة كل رقم حسب مكانه.',
          sections: [
            ['منازل العدد', 'العدد 528 مكوّن من 5 مئات و2 عشرات و8 آحاد. نكتبه في جدول المنازل لنرى قيمة كل رقم بوضوح.'],
            ['العد بالعشرات والمئات', 'بعد 99 يأتي 100، وبعد 999 يأتي 1000. نعد بالعشرات ثم بالمئات لنتقدم بسرعة.']
          ],
          examples: [
            ['اكتب العدد: أربعة مئات وثلاثة عشرات وستة آحاد.', ['أكتب 4 في منزلة المئات.', 'أكتب 3 في منزلة العشرات.', 'أكتب 6 في منزلة الآحاد.'], '436'],
            ['اقرأ العدد 705.', ['الرقم 7 في المئات.', 'الرقم 0 في العشرات.', 'الرقم 5 في الآحاد.'], 'سبعمئة وخمسة']
          ],
          questions: [
            ['كم عشرة في العدد 340؟', ['34', '3', '4', '340'], 0, 'بقسمة 340 على 10 نحصل على 34 عشرة؛ الخيار 3 يعد المئات فقط.'],
            ['ما قيمة الرقم 7 في العدد 472؟', ['7 عشرات', '7 مئات', '7 آحاد', '7 ألوف'], 0, 'الرقم 7 في المنزلة الثانية من اليمين، أي العشرات.'],
            ['أي عدد من هذه الأعداد أكبر من 900؟', ['899', '989', '889', '798'], 0, '989 أكبر لأن منزلة مئاته 9 ثم عشراته 8.'],
            ['كيف نكتب ألف واحد؟', ['1000', '100', '10 000', '999'], 0, 'ألف واحد يُكتب 1000، وهو العدد الذي يلي 999.']
          ],
          tr: {
            fr: {
              t: "Les nombres jusqu'à 1000",
              intro: 'Nous apprenons à lire et à écrire les grands nombres, et à reconnaître la valeur de chaque chiffre.',
              sections: [
                ['Le nombre et sa valeur', "Un nombre est formé de chiffres, et chaque chiffre a une valeur selon sa place. Dans 345, il y a 3 centaines, 4 dizaines et 5 unités."],
                ['Les places du nombre', 'Dans 528, il y a 5 centaines, 2 dizaines et 8 unités. On écrit le nombre dans un tableau des places pour voir la valeur de chaque chiffre.'],
                ['Addition et soustraction', "L'addition augmente un nombre et la soustraction le diminue. On aligne les nombres selon les unités avant de calculer."],
                ['Compter par dizaines et centaines', 'Après 99 vient 100, et après 999 vient 1000. On compte par dizaines puis par centaines pour avancer vite.'],
                ['La multiplication est une addition répétée', "Multiplier, c'est additionner plusieurs fois le même nombre. 3 × 4 signifie quatre groupes de trois, soit 12."],
                ['Mesurer dans la vie', 'On mesure la longueur en centimètres et le poids en kilogrammes. Choisir la bonne unité rend la réponse claire.']
              ],
              vocab: [
                ['la place', "La position d'un chiffre dans le nombre, comme les unités, les dizaines ou les centaines."],
                ['les unités', 'La dernière position à droite dans un nombre.'],
                ['les dizaines', 'La deuxième position en partant de la droite.'],
                ['les centaines', 'La troisième position en partant de la droite.'],
                ['la multiplication', 'Une opération qui répète plusieurs fois le même nombre.'],
                ['le centimètre', 'Une unité de longueur plus petite que le mètre.']
              ],
              examples: [
                ['Écris le nombre : quatre centaines, trois dizaines et six unités.', ['Je mets 4 dans les centaines.', 'Je mets 3 dans les dizaines.', 'Je mets 6 dans les unités.'], '436'],
                ['Lis le nombre 705.', ['Le chiffre 7 est dans les centaines.', 'Le chiffre 0 est dans les dizaines.', 'Le chiffre 5 est dans les unités.'], 'Sept cent cinq']
              ]
            },
            en: {
              t: 'Numbers up to 1000',
              intro: 'We learn to read and write large numbers and to see the value of each digit.',
              sections: [
                ['The number and its value', 'A number is made of digits, and each digit has a value depending on its place. In 345 there are 3 hundreds, 4 tens and 5 ones.'],
                ['Places in a number', 'In 528 there are 5 hundreds, 2 tens and 8 ones. We write the number in a place-value chart to see the value of each digit.'],
                ['Addition and subtraction', 'Addition makes a number bigger and subtraction makes it smaller. We line up the numbers by place before calculating.'],
                ['Counting by tens and hundreds', 'After 99 comes 100, and after 999 comes 1000. Counting by tens and then by hundreds helps us move quickly.'],
                ['Multiplication is repeated addition', 'Multiplying means adding the same number several times. 3 × 4 means four groups of three, which is 12.'],
                ['Measuring in everyday life', 'We measure length in centimetres and weight in kilograms. Choosing the right unit makes the answer clear.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, such as ones, tens or hundreds.'],
                ['ones', 'The last position on the right of a number.'],
                ['tens', 'The second position from the right.'],
                ['hundreds', 'The third position from the right.'],
                ['multiplication', 'An operation that repeats the same number several times.'],
                ['centimetre', 'A unit of length smaller than a metre.']
              ],
              examples: [
                ['Write the number: four hundreds, three tens and six ones.', ['I put 4 in the hundreds.', 'I put 3 in the tens.', 'I put 6 in the ones.'], '436'],
                ['Read the number 705.', ['7 is in the hundreds.', '0 is in the tens.', '5 is in the ones.'], 'Seven hundred and five']
              ]
            }
          }
        },
        {
          t: 'الضرب داخل جدول الضرب',
          intro: 'الضرب طريقة سريعة لجمع العدد نفسه. نتدرب اليوم على جدول الضرب حتى 9 × 9.',
          sections: [
            ['من الجمع إلى الضرب', '3 × 4 تعني 4 + 4 + 4، أي 12. يمكن أيضا قراءتها 4 × 3، والنتيجة واحدة.'],
            ['ترتيب المسائل', 'نكتب المسألة عموديا عند الأعداد الكبيرة: آحاد تحت آحاد وعشرات تحت عشرات.']
          ],
          examples: [
            ['احسب 6 × 7.', ['أكرر 7 ست مرات.', 'أجمع 7 + 7 = 14.', 'أكمل الجمع حتى 42.'], '42'],
            ['سلة فيها 8 تفاحات. كم تفاحة في 4 سلال؟', ['أعدد التفاحات في سلة واحدة.', 'أضرب 8 في 4.', 'أكتب الجواب مع الوحدة.'], '32 تفاحة']
          ],
          questions: [
            ['ما ناتج 7 × 8؟', ['56', '54', '64', '49'], 0, 'ثمانية مجمعات من سبعة تعطي 56؛ 54 ناتج 6 × 9.'],
            ['ما الفرق بين 4 × 5 و5 × 4؟', ['لا فرق في النتيجة', 'الأول أكبر', 'الثاني أصغر', 'أحدهما خطأ'], 0, 'ضرب العددين يعطي نفس الناتج مهما كان الترتيب.'],
            ['إذا كان الثمن 3 دراهم فكم ثمن 6 دفاتر؟', ['18 درهما', '9 دراهم', '12 درهما', '21 درهما'], 0, 'نضرب 3 في 6 فنحصل على 18 درهما.'],
            ['أي مسألة تعني 5 + 5 + 5؟', ['5 × 3', '5 + 3', '5 − 3', '3 ÷ 5'], 0, 'تكرار العدد 5 ثلاث مرات يُكتب 5 × 3.']
          ],
          tr: {
            fr: {
              t: "La multiplication jusqu'à 9 × 9",
              intro: "La multiplication permet d'ajouter vite le même nombre. Nous nous entraînons avec la table jusqu'à 9 × 9.",
              sections: [
                ['Le nombre et sa valeur', "Un nombre est formé de chiffres, et chaque chiffre a une valeur selon sa place. Dans 345, il y a 3 centaines, 4 dizaines et 5 unités."],
                ["De l'addition à la multiplication", "3 × 4 veut dire 4 + 4 + 4, soit 12. On peut aussi lire 4 × 3, le résultat est le même."],
                ['Addition et soustraction', "L'addition augmente un nombre et la soustraction le diminue. On aligne les nombres selon les unités avant de calculer."],
                ['Ranger les opérations', "Pour les grands nombres, on écrit l'opération en colonnes : les unités sous les unités, les dizaines sous les dizaines."],
                ['La multiplication est une addition répétée', "Multiplier, c'est additionner plusieurs fois le même nombre. 3 × 4 signifie quatre groupes de trois, soit 12."],
                ['Mesurer dans la vie', 'On mesure la longueur en centimètres et le poids en kilogrammes. Choisir la bonne unité rend la réponse claire.']
              ],
              vocab: [
                ['la place', "La position d'un chiffre dans le nombre, comme les unités, les dizaines ou les centaines."],
                ['les unités', 'La dernière position à droite dans un nombre.'],
                ['les dizaines', 'La deuxième position en partant de la droite.'],
                ['les centaines', 'La troisième position en partant de la droite.'],
                ['la multiplication', 'Une opération qui répète plusieurs fois le même nombre.'],
                ['le centimètre', 'Une unité de longueur plus petite que le mètre.']
              ],
              examples: [
                ['Calcule 6 × 7.', ['Je répète 7 six fois.', 'Je fais 7 + 7 = 14.', "Je continue jusqu'à 42."], '42'],
                ['Un panier contient 8 pommes. Combien de pommes dans 4 paniers ?', ["Je compte les pommes d'un panier.", 'Je multiplie 8 par 4.', "J'écris la réponse avec l'unité."], '32 pommes']
              ]
            },
            en: {
              t: 'Multiplication tables up to 9 × 9',
              intro: 'Multiplication is a quick way to add the same number. Today we practise tables up to 9 × 9.',
              sections: [
                ['The number and its value', 'A number is made of digits, and each digit has a value depending on its place. In 345 there are 3 hundreds, 4 tens and 5 ones.'],
                ['From addition to multiplication', '3 × 4 means 4 + 4 + 4, which is 12. You can also read it as 4 × 3; the result is the same.'],
                ['Addition and subtraction', 'Addition makes a number bigger and subtraction makes it smaller. We line up the numbers by place before calculating.'],
                ['Setting out the operation', 'For larger numbers we write the operation in columns: ones under ones and tens under tens.'],
                ['Multiplication is repeated addition', 'Multiplying means adding the same number several times. 3 × 4 means four groups of three, which is 12.'],
                ['Measuring in everyday life', 'We measure length in centimetres and weight in kilograms. Choosing the right unit makes the answer clear.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, such as ones, tens or hundreds.'],
                ['ones', 'The last position on the right of a number.'],
                ['tens', 'The second position from the right.'],
                ['hundreds', 'The third position from the right.'],
                ['multiplication', 'An operation that repeats the same number several times.'],
                ['centimetre', 'A unit of length smaller than a metre.']
              ],
              examples: [
                ['Work out 6 × 7.', ['I repeat 7 six times.', 'I do 7 + 7 = 14.', 'I keep adding until I reach 42.'], '42'],
                ['A basket holds 8 apples. How many apples are in 4 baskets?', ['I count the apples in one basket.', 'I multiply 8 by 4.', 'I write the answer with the unit.'], '32 apples']
              ]
            }
          }
        },
        {
          t: 'حل مسائل من حياتنا',
          intro: 'نقرأ مسألة صغيرة ونختار العملية المناسبة ثم نحسب ونكتب الجواب.',
          sections: [
            ['افهم المسألة أولا', 'نقرأ السؤال مرتين ونحدد المعطيات. كلمة أصبح تشير إلى الجمع، وبقي قد تشير إلى الطرح.'],
            ['الجواب في جملة', 'بعد الحساب نكتب الجملة: معي 27 درهما. الجملة توضح معنى الرقم.']
          ],
          examples: [
            ['معك 45 درهما، صرفت 18. كم بقي؟', ['أحدد المعطيات.', 'أختار الطرح.', 'أحسب 45 − 18 = 27.'], '27 درهما'],
            ['في الصف 4 طاولات، كل طاولة فيها 6 كتب. كم كتابا؟', ['أعدد الطاولات.', 'أضرب 4 في 6.', 'أكتب الجواب.'], '24 كتابا']
          ],
          questions: [
            ['معك 30 درهما وأضفت 12. كم أصبح معك؟', ['42', '18', '360', '30'], 0, 'الإضافة تزيد المبلغ، و30 + 12 = 42.'],
            ['في السلة 24 تفاحة، أكلت 9. كم بقي؟', ['15', '33', '14', '24'], 0, 'الطرح يحسب المتبقي، و24 − 9 = 15.'],
            ['أي كلمة تدل على الجمع غالبا؟', ['أصبح', 'بقي', 'فرق', 'نقص'], 0, 'أصبح تعبر عن زيادة المجموع؛ الباقي يرتبط بالنقص أو الفرق.'],
            ['لماذا نكتب الجملة بعد الحساب؟', ['لتوضيح معنى الرقم', 'لإطالة الورقة', 'لإخفاء الجواب', 'لتغيير العملية'], 0, 'الجملة تربط الرقم بالسياق وتجعل الجواب مفهوما.']
          ],
          tr: {
            fr: {
              t: 'Résoudre des problèmes de la vie',
              intro: 'Nous lisons un petit problème, choisissons la bonne opération, puis calculons et écrivons la réponse.',
              sections: [
                ['Le nombre et sa valeur', "Un nombre est formé de chiffres, et chaque chiffre a une valeur selon sa place. Dans 345, il y a 3 centaines, 4 dizaines et 5 unités."],
                ["Comprendre l'énoncé", "On lit la question deux fois et on repère les données. Le mot « devient » indique souvent une addition, et « reste » peut indiquer une soustraction."],
                ['Addition et soustraction', "L'addition augmente un nombre et la soustraction le diminue. On aligne les nombres selon les unités avant de calculer."],
                ['La réponse en une phrase', "Après le calcul, on écrit : j'ai 27 dirhams. La phrase explique le sens du nombre."],
                ['La multiplication est une addition répétée', "Multiplier, c'est additionner plusieurs fois le même nombre. 3 × 4 signifie quatre groupes de trois, soit 12."],
                ['Mesurer dans la vie', 'On mesure la longueur en centimètres et le poids en kilogrammes. Choisir la bonne unité rend la réponse claire.']
              ],
              vocab: [
                ['la place', "La position d'un chiffre dans le nombre, comme les unités, les dizaines ou les centaines."],
                ['les unités', 'La dernière position à droite dans un nombre.'],
                ['les dizaines', 'La deuxième position en partant de la droite.'],
                ['les centaines', 'La troisième position en partant de la droite.'],
                ['la multiplication', 'Une opération qui répète plusieurs fois le même nombre.'],
                ['le centimètre', 'Une unité de longueur plus petite que le mètre.']
              ],
              examples: [
                ["J'ai 45 dirhams et j'en dépense 18. Combien reste-t-il ?", ['Je repère les données.', 'Je choisis la soustraction.', 'Je calcule 45 − 18 = 27.'], '27 dirhams'],
                ['La classe a 4 tables avec 6 cahiers sur chaque table. Combien de cahiers ?', ['Je compte les tables.', 'Je multiplie 4 par 6.', "J'écris la réponse."], '24 cahiers']
              ]
            },
            en: {
              t: 'Solving everyday problems',
              intro: 'We read a short problem, choose the right operation, calculate and then write the answer.',
              sections: [
                ['The number and its value', 'A number is made of digits, and each digit has a value depending on its place. In 345 there are 3 hundreds, 4 tens and 5 ones.'],
                ['Understand the problem', 'We read the question twice and identify the information. The word "now" often signals addition, while "left" can signal subtraction.'],
                ['Addition and subtraction', 'Addition makes a number bigger and subtraction makes it smaller. We line up the numbers by place before calculating.'],
                ['The answer in a sentence', 'After calculating, we write: I have 27 dirhams. The sentence explains what the number means.'],
                ['Multiplication is repeated addition', 'Multiplying means adding the same number several times. 3 × 4 means four groups of three, which is 12.'],
                ['Measuring in everyday life', 'We measure length in centimetres and weight in kilograms. Choosing the right unit makes the answer clear.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, such as ones, tens or hundreds.'],
                ['ones', 'The last position on the right of a number.'],
                ['tens', 'The second position from the right.'],
                ['hundreds', 'The third position from the right.'],
                ['multiplication', 'An operation that repeats the same number several times.'],
                ['centimetre', 'A unit of length smaller than a metre.']
              ],
              examples: [
                ['I have 45 dirhams and I spend 18. How much is left?', ['I identify the information.', 'I choose subtraction.', 'I work out 45 - 18 = 27.'], '27 dirhams'],
                ['The classroom has 4 tables with 6 notebooks on each. How many notebooks?', ['I count the tables.', 'I multiply 4 by 6.', 'I write the answer.'], '24 notebooks']
              ]
            }
          }
        },
        {
          t: 'الهندسة والقياس',
          intro: 'نتعرف أشكالا بسيطة ونتدرب على قياس الأطوال والأوزان.',
          sections: [
            ['أشكال من حولنا', 'المربع له أضلاع متساوية، والمستطيل له ضلعان طويلان وضلعان قصيران. الدائرة ليس لها زوايا.'],
            ['وحدات القياس', 'نقيس طول الكتاب بالسنتيمتر وطول الغرفة بالمتر. الوزن نقيسه بالكيلوغرام.']
          ],
          examples: [
            ['مستطيل طوله 8 سم وعرضه 3 سم. ما محيطه؟', ['أجمع الطول والعرض.', 'أضرب المجموع في 2.', 'أكتب الوحدة.'], '22 سم'],
            ['كيس أرز وزنه 2 كغ، وكيس آخر 3 كغ. كم الوزن معا؟', ['أقرأ الوزنين.', 'أجمعهما.', 'أضيف الوحدة.'], '5 كغ']
          ],
          questions: [
            ['كم ضلعا للمربع؟', ['4', '3', '2', '5'], 0, 'المربع شكل رباعي له أربعة أضلاع متساوية.'],
            ['أي وحدة لقياس طول قلم؟', ['السنتيمتر', 'الكيلوغرام', 'اللتر', 'الساعة'], 0, 'السنتيمتر وحدة طول مناسبة للقلم، والباقي وزن أو حجم أو وقت.'],
            ['محيط مربع ضلعه 5 سم يساوي:', ['20 سم', '10 سم', '25 سم', '15 سم'], 0, 'لمربع أربعة أضلاع متساوية، فالمحيط 4 × 5 = 20 سم.'],
            ['أي شكل ليس له زوايا؟', ['الدائرة', 'المربع', 'المستطيل', 'المثلث'], 0, 'الدائرة محنية بلا زوايا، بينما الأشكال الأخرى لها زوايا.']
          ],
          tr: {
            fr: {
              t: 'Géométrie et mesure',
              intro: 'Nous découvrons des formes simples et nous nous entraînons à mesurer les longueurs et les poids.',
              sections: [
                ['Le nombre et sa valeur', "Un nombre est formé de chiffres, et chaque chiffre a une valeur selon sa place. Dans 345, il y a 3 centaines, 4 dizaines et 5 unités."],
                ['Les formes autour de nous', "Le carré a quatre côtés égaux, et le rectangle a deux côtés longs et deux courts. Le cercle n'a pas de coins."],
                ['Addition et soustraction', "L'addition augmente un nombre et la soustraction le diminue. On aligne les nombres selon les unités avant de calculer."],
                ['Les unités de mesure', "On mesure la longueur d'un livre en centimètres et celle d'une salle en mètres. Le poids se mesure en kilogrammes."],
                ['La multiplication est une addition répétée', "Multiplier, c'est additionner plusieurs fois le même nombre. 3 × 4 signifie quatre groupes de trois, soit 12."],
                ['Mesurer dans la vie', 'On mesure la longueur en centimètres et le poids en kilogrammes. Choisir la bonne unité rend la réponse claire.']
              ],
              vocab: [
                ['la place', "La position d'un chiffre dans le nombre, comme les unités, les dizaines ou les centaines."],
                ['les unités', 'La dernière position à droite dans un nombre.'],
                ['les dizaines', 'La deuxième position en partant de la droite.'],
                ['les centaines', 'La troisième position en partant de la droite.'],
                ['la multiplication', 'Une opération qui répète plusieurs fois le même nombre.'],
                ['le centimètre', 'Une unité de longueur plus petite que le mètre.']
              ],
              examples: [
                ['Un rectangle mesure 8 cm de long et 3 cm de large. Quel est son périmètre ?', ["J'additionne la longueur et la largeur.", 'Je multiplie la somme par 2.', "J'écris l'unité."], '22 cm'],
                ['Un sac de riz pèse 2 kg et un autre 3 kg. Quel est le poids total ?', ['Je lis les deux poids.', 'Je les additionne.', "J'ajoute l'unité."], '5 kg']
              ]
            },
            en: {
              t: 'Geometry and measurement',
              intro: 'We explore simple shapes and practise measuring lengths and weights.',
              sections: [
                ['The number and its value', 'A number is made of digits, and each digit has a value depending on its place. In 345 there are 3 hundreds, 4 tens and 5 ones.'],
                ['Shapes around us', 'A square has four equal sides, and a rectangle has two long sides and two short sides. A circle has no corners.'],
                ['Addition and subtraction', 'Addition makes a number bigger and subtraction makes it smaller. We line up the numbers by place before calculating.'],
                ['Units of measurement', 'We measure a book in centimetres and a room in metres. Weight is measured in kilograms.'],
                ['Multiplication is repeated addition', 'Multiplying means adding the same number several times. 3 × 4 means four groups of three, which is 12.'],
                ['Measuring in everyday life', 'We measure length in centimetres and weight in kilograms. Choosing the right unit makes the answer clear.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, such as ones, tens or hundreds.'],
                ['ones', 'The last position on the right of a number.'],
                ['tens', 'The second position from the right.'],
                ['hundreds', 'The third position from the right.'],
                ['multiplication', 'An operation that repeats the same number several times.'],
                ['centimetre', 'A unit of length smaller than a metre.']
              ],
              examples: [
                ['A rectangle is 8 cm long and 3 cm wide. What is its perimeter?', ['I add the length and the width.', 'I multiply the sum by 2.', 'I write the unit.'], '22 cm'],
                ['One bag of rice weighs 2 kg and another weighs 3 kg. What is the total weight?', ['I read both weights.', 'I add them.', 'I add the unit.'], '5 kg']
              ]
            }
          }
        }
      ]
    }
    ,
    'cur_l_p3_sub_en': {
      shared: {
        sections: [
          ['Letters make words', 'The English alphabet has 26 letters. Each letter has a name and often a sound.'],
          ['Listen and repeat', 'First we listen to a new word. Then we say it slowly, and finally we say it in a sentence.'],
          ['Words around us', 'We learn words for things we see at school: a book, a pen, a desk and a chair.'],
          ['Practice every day', 'Three short sentences a day are enough at the beginning. Say them out loud and smile.']
        ],
        vocab: [
          ['letter', 'A sign of the alphabet, such as A, B or C.'],
          ['sound', 'What we hear when we say a letter or a word.'],
          ['hello', 'A friendly word when we meet someone.'],
          ['colour', 'Red, blue, green or yellow, for example.'],
          ['number', 'A word such as one, two or three.'],
          ['sentence', 'A group of words that gives a complete idea.']
        ],
        outcomes: [
          'Learners name at least eight letters of the English alphabet.',
          'Learners greet a classmate and answer with a short sentence.',
          'Learners match three colours and three numbers to pictures.',
          'Learners write two simple sentences with the verb to be.'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'The alphabet and its sounds',
          intro: 'Today we learn the first letters of the English alphabet and the sounds they make.',
          sections: [
            ['A, B, C', 'The first letters are A, B, C, D and E. We say them in order and listen to the sound of each one.'],
            ['Letter sounds', 'The letter B says /b/ as in ball. The letter S says /s/ as in sun.']
          ],
          examples: [
            ['Say the first five letters in order.', ['I start with A.', 'Then I say B, C, D.', 'I finish with E.'], 'A, B, C, D, E'],
            ['Which letter starts the word sun?', ['I listen to the first sound.', 'The sound is /s/.', 'The letter is S.'], 'S']
          ],
          questions: [
            ['Which letter comes after C?', ['D', 'B', 'F', 'A'], 0, 'In the alphabet, D follows C; the other letters are before or later.'],
            ['What sound does B make?', ['/b/', '/s/', '/m/', '/t/'], 0, 'B is pronounced with the /b/ sound, as in ball.'],
            ['Which word starts with S?', ['sun', 'ball', 'cat', 'dog'], 0, 'Sun begins with the /s/ sound; the others start with other sounds.'],
            ['How many letters are in the English alphabet?', ['26', '20', '30', '24'], 0, 'The English alphabet has 26 letters.']
          ]
        },
        {
          t: 'Hello! How are you?',
          intro: 'We learn how to greet a friend in English and how to answer politely.',
          sections: [
            ['Two greetings', 'We say Hello to a friend and Good morning to a teacher. Both are friendly ways to start.'],
            ['A short answer', 'When someone asks How are you?, we can say I am fine, thank you. We look at the person and smile.']
          ],
          examples: [
            ['Your friend says Hello!. What do you say?', ['I look at my friend.', 'I say hello back.', 'I add a friendly question.'], 'Hello! How are you?'],
            ['The teacher asks How are you?. Answer.', ['I stand or sit calmly.', 'I use I am fine.', 'I say thank you.'], 'I am fine, thank you.']
          ],
          questions: [
            ['Which is a greeting?', ['Hello', 'Book', 'Green', 'Seven'], 0, 'Hello is used to greet; the other words name a thing, a colour and a number.'],
            ['How do you answer How are you??', ['I am fine, thank you.', 'My name is pen.', 'It is a cat.', 'I have three.'], 0, 'This answer tells how you feel; the others answer different questions.'],
            ['Which greeting fits a morning at school?', ['In the morning', 'At night', 'Only at school', 'Never'], 0, 'Good morning is used in the morning, not only in one place.'],
            ['What makes a greeting friendly?', ['A smile and eye contact', 'Silence', 'Looking away', 'Running past'], 0, 'A smile and looking at the person show friendliness.']
          ]
        },
        {
          t: 'Colours and numbers',
          intro: 'We look at coloured pictures and count objects from one to ten in English.',
          sections: [
            ['Colours we see', 'The sky is blue and the sun is yellow. Leaves are green in spring.'],
            ['Counting to ten', 'We say one, two, three, four, five and then six to ten. We point at each object when we count.']
          ],
          examples: [
            ['You see three red apples. Say the sentence.', ['I count the apples.', 'I say the colour.', 'I make a sentence.'], 'I see three red apples.'],
            ['Count five pencils on the desk.', ['I touch each pencil.', 'I say the numbers in order.', 'I stop at five.'], 'One, two, three, four, five pencils.']
          ],
          questions: [
            ['What colour is the sky on a clear day?', ['blue', 'red', 'brown', 'black'], 0, 'A clear sky looks blue; the other colours do not describe it.'],
            ['Which number comes after four?', ['five', 'three', 'seven', 'ten'], 0, 'Five follows four in counting order.'],
            ['How do you say 3 in English?', ['three', 'tree', 'thin', 'six'], 0, 'The number 3 is three; the other words are different.'],
            ['Which sentence describes two green bags?', ['I see two green bags.', 'I see green two bags.', 'Two bags green I see.', 'I green see bags.'], 0, 'The number comes before the colour and the noun.']
          ]
        },
        {
          t: 'Simple words, simple sentences',
          intro: 'Now we put our words together to describe things in the classroom.',
          sections: [
            ['A and an', 'We say a book but an apple. We use an before a word that starts with a vowel sound.'],
            ['I am, I have', 'With I am we say a name or a feeling. With I have we say what we own.']
          ],
          examples: [
            ['You have a pen and an eraser. Say it.', ['I name the first thing.', 'I use a before pen.', 'I use an before eraser.'], 'I have a pen and an eraser.'],
            ['Introduce yourself in two sentences.', ['I say my name.', 'I use I am.', 'I add my age or feeling.'], 'I am Sara. I am happy.']
          ],
          questions: [
            ['Which is correct?', ['an apple', 'a apple', 'an book', 'a orange'], 0, 'Apple starts with a vowel sound, so we use an.'],
            ['Which sentence uses have correctly?', ['I have a bag.', 'I am a bag.', 'I have am bag.', 'Have I bag.'], 0, 'Have shows possession; am is used for identity or feelings.'],
            ['Which word is a thing at school?', ['desk', 'happy', 'blue', 'five'], 0, 'A desk is an object; the other words describe a feeling, a colour and a number.'],
            ['What is I am fine?', ['A way to say how you feel', 'A way to count', 'A way to name a colour', 'A way to ask the time'], 0, 'It answers how you feel, not number, colour or time.']
          ]
        }
      ]
    },
    'cur_l_p3_sub_sport': {
      shared: {
        sections: [
          ['الجسم يتحرك', 'الإنسان يستطيع المشي والجري والقفز. كل حركة تستخدم عضلا معينا.'],
          ['الإحماء قبل اللعب', 'نبدأ بتمارين خفيفة لتدفئة أجسامنا. الإحماء يحمينا من الإصابة.'],
          ['اللعب مع الآخرين', 'الرياضة الجماعية تتطلب الإنصات والدور. ننتظر دورنا ونشجع زملاءنا.'],
          ['الصحة والرياضة', 'الحركة اليومية تقوي القلب وتنشط الجسم. مع الماء والنوم نصبح أقوى.']
        ],
        vocab: [
          ['الجري', 'حركة سريعة للقدمين.'],
          ['القفز', 'حركة يرتفع فيها الجسم عن الأرض.'],
          ['الإحماء', 'تمارين خفيفة قبل المجهود.'],
          ['الفريق', 'مجموعة من اللاعبين تعمل معا.'],
          ['الدور', 'الوقت المخصص لكل لاعب.'],
          ['النشاط', 'حركة أو لعب يفعلاه الجسم.']
        ],
        outcomes: [
          'ينفذ الطالب ثلاث حركات أساسية بصورة صحيحة.',
          'يشارك الطالب في لعبة جماعية باتباع القواعد.',
          'يحترم الطالب دور زملائه ويشجعهم.',
          'يذكر الطالب عادتين صحيتين مرتبطتين بالرياضة.'
        ],
        diagram: 'diagram-body.svg'
      },
      lessons: [
        {
          t: 'حركات الجسم',
          intro: 'نتعرف اليوم على حركات بسيطة ونؤديها بصورة صحيحة.',
          sections: [
            ['المشي والجري', 'المشي خطوات هادئة، والجري خطوات سريعة. في الجري نثني الذراعين ونتنفس بانتظام.'],
            ['القفز والتمدد', 'القفز يبدأ بالركبتين وينتهي بالهبوط على القدمين. التمدد يفصل الأذرع والساقين بلطف.']
          ],
          examples: [
            ['قفز ثلاث قفزات صغيرة.', ['قف على قدميك.', 'اثنِ الركبتين.', 'انزل بهدوء.'], 'ثلاث قفزات آمنة'],
            ['امشِ عشر خطوات ثم اركض خمسا.', ['ابدأ بالمشي.', 'عد عشر خطوات.', 'سارع الخطوات خمس مرات.'], 'عشر خطوات ثم خمس خطوات جري']
          ],
          questions: [
            ['أي حركة تكون خطواتها سريعة؟', ['الجري', 'المشي', 'الوقوف', 'الجلوس'], 0, 'الجري أسرع من المشي؛ الوقوف والجلوس ليستا حركتي قدمين متتاليتين.'],
            ['ما أول خطوة للقفز الآمن؟', ['ثني الركبتين', 'إغلاق العينين', 'القفز بلا توقف', 'رفع اليدين فوق الرأس'], 0, 'ثني الركبتين يساعد على دفع الجسم والهبوط بأمان.'],
            ['أي جزء نستخدمه في التمدد؟', ['الذراعان والساقان', 'الأسنان', 'الأذنان', 'الشعر'], 0, 'التمدد يهدف إلى فصل العضلات في الذراعين والساقين.'],
            ['لماذا نتنفس بانتظام أثناء الجري؟', ['ليصل الأكسجين إلى العضلات', 'لنصمت', 'لنقف فورا', 'لنغضب'], 0, 'التنفس المنتظم يمد العضلات بالأكسجين ويساعد على الاستمرار.']
          ]
        },
        {
          t: 'ألعاب في الفناء',
          intro: 'نلعب ألعابا بسيطة في الفناء ونتعلم قواعدها.',
          sections: [
            ['لعبة الكرات', 'نرمي الكرة إلى زميل ونمسكها بكلتا اليدين. من يرمي ينظر إلى وجه زميله أولا.'],
            ['لعبة الحبال', 'نقفز فوق الحبل واحدا بعد آخر. لا نلمس الحبل بيدنا أثناء الدور.']
          ],
          examples: [
            ['ارمِ الكرة لصديقك بأمان.', ['انظر إلى صديقك.', 'ارفع الكرة صدرية.', 'ارمِها بهدوء.'], 'كرة آمنة إلى الصديق'],
            ['حان دورك في القفز على الحبل.', ['انتظر دورك.', 'ادخل من الجهة الصحيحة.', 'اقفز ثم اخرج.'], 'قفزة واحدة صحيحة']
          ],
          questions: [
            ['ما أول خطوة قبل رمي الكرة؟', ['النظر إلى الزميل', 'إغلاق العينين', 'الجري بعيدا', 'الصراخ'], 0, 'النظر يضمن أن الكرة ستصل إلى الزميل بأمان.'],
            ['متى نقفز فوق الحبل؟', ['عند دورنا', 'قبل الإحماء', 'معا دائما', 'بلا ترتيب'], 0, 'القفز يكون حسب الدور تنظيميا حتى لا يتعرض أحد للأذى.'],
            ['أي سلوك آمن؟', ['إمساك الكرة بيدين', 'رمي الكرة في الوجه', 'الجري داخل الحبل', 'دفع الزميل'], 0, 'الإمساك بكلتا اليدين آمن، والباقي قد يؤذي الزملاء.'],
            ['ماذا نفعل بعد اللعب؟', ['نهدأ ونشرب الماء', 'نركض أكثر بلا توقف', 'نرمي الكرة', 'ننسى القواعد'], 0, 'الهدوء والشرب يساعدان الجسم على التعافي.']
          ]
        },
        {
          t: 'نلعب كفريق',
          intro: 'الرياضة الجماعية تُعلّمنا التعاون والإنصات إلى زملائنا.',
          sections: [
            ['لكل واحد دور', 'في الفريق يحرس أحدهم الكرة ويمررها آخر. إذا عرف كل واحد دوره، صار اللعب أسهل.'],
            ['تشجيع الزملاء', 'نقول لأخينا: أحسنت، حاول مرة أخرى. الكلمة الطيبة ترفع الروح ولا تؤذي أحدا.']
          ],
          examples: [
            ['زميلك أخطأ التمريرة. ماذا تقول؟', ['لا تضحك.', 'قل كلمة تشجيع.', 'أعد التمريرة معه.'], 'لا بأس، حاول مرة أخرى.'],
            ['الفريق يحتاج إلى حارس وتمرير. كيف توزعون الأدوار؟', ['تسأل من يريد الحرس.', 'تختار الممرر.', 'تتفقون قبل اللعب.'], 'أنا أحرس وأنت تمرر الكرة.']
          ],
          questions: [
            ['ما فائدة معرفة الدور؟', ['ينظم اللعب', 'يمنع المشاركة', 'يؤخر الفريق', 'يغير القواعد'], 0, 'توزيع الأدوار يجعل العمل الجماعي واضحا ومنظما.'],
            ['كيف نشجع زميلا أخطأ؟', ['نقول له حاول مرة أخرى', 'نسخر منه', 'نصمت', 'نطرده'], 0, 'التشجيع بالكلمة الطيبة يساعد الزميل على المحاولة من جديد.'],
            ['أي سلوك ليس تعاونا؟', ['الاستئثار بالكرة', 'تمرير الكرة', 'انتظار الدور', 'الإنصات للزميل'], 0, 'الاستئثار بالكرة يمنع الآخرين من المشاركة.'],
            ['ماذا يفعل الفريق بعد الخطأ؟', ['يتكلم بهدوء ويحاول من جديد', 'يلوم بعضه', 'يتوقف للأبد', 'يغضب'], 0, 'الفريق الجيد يتعلم من الخطأ ويواصل بهدوء.']
          ]
        },
        {
          t: 'الرياضة والصحة',
          intro: 'نتعلم كيف تحمي الرياضة صحتنا مع الماء والنوم والغذاء.',
          sections: [
            ['فوائد الحركة', 'الحركة اليومية تقوي القلب والعضلات. كما تساعدنا على النوم بهدوء في المساء.'],
            ['الماء والراحة', 'نشرب الماء قبل اللعب وبعده. ونرتاح قليلا إذا تعبنا بدل أن نكمل بلا توقف.']
          ],
          examples: [
            ['انتهيت من اللعب والعرق يظهر. ماذا تفعل؟', ['تجلس قليلا.', 'تشرب الماء.', 'تنتظر حتى يهدأ الجسم.'], 'أرتاح وأشرب الماء.'],
            ['صديقك تعب أثناء الجري. كيف تساعده؟', ['تقول له توقف قليلا.', 'تجلسه في الظل.', 'وتعطيه ماء.'], 'توقف قليلا، خذ الماء واسترح.']
          ],
          questions: [
            ['أي شراب يعوّض السوائل بعد الجري؟', ['الماء', 'الشاي فقط', 'لا شيء', 'الحليب فقط'], 0, 'الماء يعوض السوائل التي فقدها الجسم أثناء الحركة.'],
            ['أي عادة صحية؟', ['النوم الكافي', 'اللعب بلا راحة', 'نسيان الماء', 'الجري في الشمس بلا توقف'], 0, 'النوم الكافي يساعد الجسم على التعافي، والباقي إرهاق.'],
            ['لماذا نرتاح عند التعب؟', ['ليستعيد الجسم طاقته', 'لإيقاف الرياضة للأبد', 'للنسيان', 'لإغضاب الفريق'], 0, 'الراحة القصيرة تعيد الطاقة وتحمي من الإرهاق.'],
            ['أي مكان أفضل للراحة بعد اللعب؟', ['الظل', 'تحت الشمس الحارقة', 'في الشارع المزدحم', 'فوق الأرض بلا ظل'], 0, 'الظل يساعد على تبريد الجسم بأمان.']
          ]
        }
      ]
    }
    ,
    'cur_l_p4_sub_histgeo': {
      shared: {
        sections: [
          ['أين أعيش', 'أعيش في المغرب، بلد له مدن وقرى وجبال وبحار. المحيط الذي يحيط بي هو المكان الذي أراه كل يوم.'],
          ['الزمن في حياتنا', 'نفرق بين الصباح والظهر والمساء. كما نفرق بين الأمس واليوم والغد.'],
          ['الخريطة تساعدنا', 'الخريطة رسم مصغر لمكان ما. نقرأ فيها الرموز والاتجاهات لنعرف أين نذهب.'],
          ['البيئة أمانة', 'النظافة مسؤولية الجميع. نرمي الورق في السلة ونحافظ على الماء والشجر.']
        ],
        vocab: [
          ['المحيط', 'المنطقة التي تحيط بالإنسان في حياته اليومية.'],
          ['الخريطة', 'رسم مصغر يوضح أماكن وطرقا.'],
          ['الاتجاه', 'جهة ننظر إليها مثل الشمال أو الجنوب.'],
          ['الزمن', 'الوقت الذي نعيش فيه ونقيسه.'],
          ['البيئة', 'كل ما يحيط بنا من هواء وماء وشجر.'],
          ['الأمانة', 'مسؤولية الحفاظ على شيء ثمين.']
        ],
        outcomes: [
          'يذكر الطالب ثلاثة عناصر من محيطه القريب.',
          'يرتب الطالب أحداثا بسيطة حسب الزمن.',
          'يقرأ الطالب رمزين من رموز الخريطة.',
          'يقترح الطالب سلوكا لحماية البيئة في مدرسته.'
        ],
        diagram: 'diagram-morocco-map.svg'
      },
      lessons: [
        {
          t: 'محيطي القريب',
          intro: 'نتعرف اليوم على الأماكن التي تحيط بنا في مدينتنا وقريتنا.',
          sections: [
            ['المدرسة والحي', 'محيطي يتكون من المدرسة والسوق والمسجد والحديقة. كل مكان له دور في حياتي اليومية.'],
            ['الطبيعة حولنا', 'الجبال والبحر والشجر جزء من هذا المحيط. في المغرب نرى الأطلس في الداخل والبحر على السواحل.']
          ],
          examples: [
            ['اذكر ثلاثة أماكن في محيطك.', ['أفكر في طريقي إلى المدرسة.', 'أذكر السوق.', 'أذكر الحديقة.'], 'المدرسة والسوق والحديقة.'],
            ['صف طريقك إلى المدرسة.', ['أبدأ من البيت.', 'أمرّ بالمسجد.', 'أصل إلى باب المدرسة.'], 'أخرج من البيت، أمرّ بالمسجد، ثم أصل إلى المدرسة.']
          ],
          questions: [
            ['أي مكان من محيطك؟', ['السوق', 'القمر', 'الشمس', 'النجوم'], 0, 'السوق مكان قريب نزوره، والباقي أجرام بعيدة ليست جزءا من المحيط اليومي.'],
            ['ما دور الحديقة؟', ['مكان للراحة واللعب', 'مكان لبيع الكتب فقط', 'مكان للنوم فقط', 'مكان بلا أشجار'], 0, 'الحديقة توفر ظلا ومكانا للعب، لا تقتصر على البيع أو النوم.'],
            ['أين نرى جبال الأطلس؟', ['في المغرب', 'في القمر', 'فوق البحر', 'في الصحراء وحدها'], 0, 'جبال الأطلس موجودة في المغرب، وليست في البحر أو القمر.'],
            ['كيف أصف طريقي؟', ['بترتيب الأماكن من البيت إلى المدرسة', 'بذكر اسم واحد فقط', 'بلا ترتيب', 'بذكر الزمن فقط'], 0, 'الوصف الواضح يرتب الأماكن حسب المسير.']
          ]
        },
        {
          t: 'اليوم والأمس والغد',
          intro: 'نتعلم ترتيب الأحداث في الزمن ونستخدم كلمات الصباح والمساء.',
          sections: [
            ['أجزاء اليوم', 'الصباح قبل الظهر، وبعده يأتي العصر ثم المغرب. في المساء نستعد للنوم.'],
            ['الأمس والغد', 'الأمس مضى واليوم نعيشه والغد لم يأتِ بعد. نقول: ذهبتُ أمس، وأذهب اليوم، وسأذهب غدا.']
          ],
          examples: [
            ['رتّب: استيقظت، ذهبت للمدرسة، نمت.', ['أبدأ بالاستيقاظ.', 'ثم المدرسة.', 'ثم النوم.'], 'استيقظت، ثم ذهبت إلى المدرسة، ثم نمت.'],
            ['ماذا ستفعل غدا؟', ['أذكر خطة بسيطة.', 'أستخدم سأـ للغد.', 'أذكر الوقت.'], 'سأقرأ الكتاب صباح الغد.']
          ],
          questions: [
            ['ماذا يأتي بعد الصباح؟', ['الظهر', 'المساء', 'الليل', 'الفجر'], 0, 'الظهر يلي الصباح في ترتيب اليوم.'],
            ['أي كلمة للوقت الماضي؟', ['أمس', 'اليوم', 'غدا', 'الآن'], 0, 'أمس يدل على ما مضى، والباقي للحاضر أو المستقبل.'],
            ['أي جملة عن الغد؟', ['سأذهب إلى المدرسة غدا.', 'ذهبت إلى المدرسة أمس.', 'أنا في المدرسة الآن.', 'كنت صغيرا.'], 0, 'الفعل مع غدا يدل على المستقبل، والباقي ماض أو حاضر.'],
            ['لماذا نرتب الأحداث؟', ['لنفهم تسلسلها', 'لنطيل الكلام', 'لنغير التاريخ', 'لننسى'], 0, 'الترتيب يساعد على فهم ما حدث أولا وما جاء بعده.']
          ]
        },
        {
          t: 'نقرأ الخريطة',
          intro: 'نتعلم قراءة خريطة بسيطة نرى فيها مدن المغرب والطرق بينها.',
          sections: [
            ['رموز الخريطة', 'الخريطة تستخدم رموزا صغيرة للمدن والطرق. ننظر إلى المفتاح في أسفل الخريطة لنعرف معنى كل رمز.'],
            ['الجهات الأربع', 'أعلى الخريطة جهة الشمال، وأسفلها الجنوب، ويمينها الشرق، ويسارها الغرب. هذه الجهات تساعدنا في التوجيه.']
          ],
          examples: [
            ['أين مدينة الرباط على خريطة المغرب؟', ['أنظر إلى مفتاح الخريطة.', 'أبحث عن نقطة الرباط.', 'أذكر جهتها تقريبا.'], 'الرباط مدينة في شمال غرب المغرب.'],
            ['مدينة مراكش جنوب الدار البيضاء. كيف أجدها؟', ['أحدد الدار البيضاء.', 'أنزل إلى الأسفل.', 'أقرأ اسم المدينة.'], 'أبحث أسفل الدار البيضاء على الخريطة.']
          ],
          questions: [
            ['ما الذي يساعدنا على فهم رموز الخريطة؟', ['مفتاح الخريطة', 'اللون وحده', 'الورق فقط', 'الاسم فقط'], 0, 'المفتاح يشرح معنى كل رمز، بينما اللون أو الاسم لا يكفي وحده.'],
            ['أي جهة في أعلى الخريطة؟', ['الشمال', 'الجنوب', 'الشرق', 'الغرب'], 0, 'الاصطلاح المعتاد أن أعلى الخريطة هو الشمال.'],
            ['ما فائدة الخريطة؟', ['توضح الأماكن والطرق', 'تخفي المدن', 'تغير الزمن', 'تزرع الشجر'], 0, 'الخريطة أداة لتحديد الأماكن والمسارات.'],
            ['كيف نصل إلى مدينة لا نعرفها؟', ['نقرأ الخريطة ونسأل شخصا', 'نغلق أعيننا', 'نمشي عشوائيا', 'ننتظر بلا سؤال'], 0, 'الخريطة والسؤال معا يساعدان على الوصول بأمان.']
          ]
        },
        {
          t: 'البيئة أمانة في أيدينا',
          intro: 'نتعلم سلوكات بسيطة تحافظ على نظافة مدرستنا وحيّنا.',
          sections: [
            ['النظافة اليومية', 'نرمي الورق في السلة ونغلق الصنبور بعد الاستعمال. هذه الأفعال الصغيرة تحمي الماء والهواء.'],
            ['الشجر والماء', 'الشجر يعطينا الظل والفاكهة، والماء يحتاجه كل كائن حي. لا نقطع الشجر ولا نلوث الماء.']
          ],
          examples: [
            ['وجدت ورقة على الأرض في الفصل. ماذا تفعل؟', ['تلتقط الورقة.', 'تضعها في السلة.', 'تذكر الآخرين بالنظافة.'], 'أضع الورقة في سلة المهملات.'],
            ['رأيت صديقا يترك الصنبور مفتوحا. ماذا تقول؟', ['تقترب بهدوء.', 'تقول له أغلق الصنبور.', 'تغلقه معه.'], 'من فضلك أغلق الصنبور، الماء أمانة.']
          ],
          questions: [
            ['أين نضع الورق المستعمل؟', ['في السلة', 'على الأرض', 'في الحقيبة فقط', 'تحت الطاولة'], 0, 'سلة المهملات هي المكان الصحيح، والباقي يلوث المكان.'],
            ['لماذا نغلق صنبور الماء في المدرسة؟', ['لحفظ الماء', 'لإضافة الماء', 'لإغلاق الباب', 'لإيقاف الضوء'], 0, 'إغلاق الصنبور يمنع هدر الماء.'],
            ['أي سلوك يحمي الشجر؟', ['عدم قطعه بلا سبب', 'حرق أوراقه', 'رمي الحجارة عليه', 'تجاهل الري'], 0, 'حماية الشجر تكون بعدم إيذائه والعناية به.'],
            ['من مسؤول عن نظافة المدرسة؟', ['الجميع', 'المدير وحده', 'العامل وحده', 'لا أحد'], 0, 'النظافة مسؤولية مشتركة بين كل من يستخدم المكان.']
          ]
        }
      ]
    }
    ,
    'cur_l_p5_sub_math': {
      shared: {
        sections: [
          ['الأعداد الكبيرة', 'الأعداد تتكون من منازل: آحاد وعشرات ومئات وآلاف. قيمة الرقم تتغير بتغيير منزلته.'],
          ['الكسور جزء من كل', 'الكسر يعبر عن جزء من شيء مقسوم إلى أجزاء متساوية. البسط يعد الأجزاء المأخوذة والمقام يعدد الأجزاء كلها.'],
          ['العمليات على الأعداد', 'الجمع والطرح والضرب والقسمة تستخدم في مواقف مختلفة. نختار العملية حسب معنى المسألة.'],
          ['القياس والهندسة', 'نحسب المحيط بجمع الأضلاع، ونحسب المساحة بضرب الطول في العرض للمستطيل.']
        ],
        vocab: [
          ['المنزلة', 'مكان الرقم في العدد تحديدا قيمته.'],
          ['البسط', 'الرقم أعلى الكسر، يعد الأجزاء المأخوذة.'],
          ['المقام', 'الرقم أسفل الكسر، يعدد الأجزاء المتساوية.'],
          ['النسبة', 'مقارنة بين كميتين بالقسمة.'],
          ['المحيط', 'المسافة حول شكل ما.'],
          ['المساحة', 'حجم السطح داخل شكل ما.']
        ],
        outcomes: [
          'يقرأ الطالب أعدادا تتجاوز 10000 ويقارنها.',
          'يحول الطالب كسرا بسيطا إلى كسر مكافئ ويجمعهما.',
          'يحل الطالب مسألة نسب بسيطة من سياق يومي.',
          'يحسب الطالب محيط مستطيل ومساحته بوحدات صحيحة.'
        ],
        outcomeTr: {
          fr: [
            "L'apprenant lit et compare des nombres supérieurs à 10 000.",
            "L'apprenant transforme une fraction simple en fraction équivalente et additionne les deux fractions.",
            "L'apprenant résout un problème de proportion simple issu d'une situation quotidienne.",
            "L'apprenant calcule le périmètre et l'aire d'un rectangle avec les unités correctes."
          ],
          en: [
            'The learner reads and compares numbers greater than 10,000.',
            'The learner converts a simple fraction to an equivalent fraction and adds the two fractions.',
            'The learner solves a simple ratio problem from an everyday situation.',
            'The learner calculates the perimeter and area of a rectangle using correct units.'
          ]
        },
        diagram: 'diagram-fractions.svg'
      },
      lessons: [
        {
          t: 'الأعداد الكبيرة ومنازلها',
          intro: 'نتعامل مع أعداد تتجاوز الآلاف، ونتعلم قراءتها ومقارنتها.',
          sections: [
            ['من الآلاف إلى الملايين', 'العدد 45 678 فيه 45 ألفا و678 وحدة. نضع فراغا بين الآلاف والوحدات ليسهل القراءة.'],
            ['المقارنة', 'نقارن الأعداد أولا من أكبر منزلة. إذا تساوت، ننتقل إلى المنزلة التي تليها.']
          ],
          examples: [
            ['اكتب العدد: اثنا عشر ألفا وثلاثمئة وخمسة.', ['أكتب 12 في منزلة الآلاف.', 'أكتب 305 في الوحدات.', 'أضع فراغا بينهما.'], '12 305'],
            ['قارن 56 789 و56 798.', ['أقارن الآلاف: متساوية.', 'أقارن المئات: متساوية.', 'أقارن العشرات: 9 أكبر.'], '56 798 أكبر']
          ],
          questions: [
            ['كم ألفا في العدد 37 000؟', ['37', '3', '7', '370'], 0, '37 000 يعني 37 ألفا؛ الخيارات الأخرى تخلط المنازل.'],
            ['أي عدد من هذه الآلاف يتجاوز 90 ألفا؟', ['91 200', '19 200', '12 900', '9 900'], 0, '91 200 أكبر لأن منزلة عشرات الآلاف فيه 9.'],
            ['ما قيمة الرقم 6 في 68 410؟', ['6 عشرات آلاف', '6 آلاف', '6 مئات', '6 عشرات'], 0, 'الرقم 6 في المنزلة الخامسة من اليمين، أي عشرات الآلاف.'],
            ['كيف نكتب ثمانية آلاف وسبعة؟', ['8 007', '8 070', '800 7', '87'], 0, 'لا توجد مئات أو عشرات، لذلك نكتب صفرين في المنزلتين الوسطى.']
          ],
          tr: {
            fr: {
              t: 'Les grands nombres et leurs positions',
              intro: 'Nous travaillons avec des nombres qui dépassent les milliers, et nous apprenons à les lire et à les comparer.',
              sections: [
                ['Les grands nombres', "Les nombres sont formés de positions : unités, dizaines, centaines et milliers. La valeur d'un chiffre change selon sa position."],
                ['Des milliers aux millions', 'Le nombre 45 678 contient 45 milliers et 678 unités. On met un espace entre les milliers et les unités pour lire plus facilement.'],
                ['Les opérations sur les nombres', "L'addition, la soustraction, la multiplication et la division servent dans des situations différentes. On choisit l'opération selon le sens du problème."],
                ['Comparer les nombres', "On compare d'abord la plus grande position. Si les chiffres sont égaux, on passe à la position suivante."],
                ['La fraction, une partie du tout', "Une fraction représente une partie d'un objet divisé en parts égales. Le numérateur compte les parts prises et le dénominateur indique toutes les parts."],
                ['Mesure et géométrie', "On calcule le périmètre en additionnant les côtés. Pour un rectangle, l'aire est la longueur multipliée par la largeur."]
              ],
              vocab: [
                ['la position', "La place d'un chiffre dans le nombre, qui détermine sa valeur."],
                ['le numérateur', 'Le chiffre au-dessus de la barre, qui compte les parts prises.'],
                ['le dénominateur', 'Le chiffre sous la barre, qui indique les parts égales.'],
                ['le rapport', 'Une comparaison entre deux quantités par la division.'],
                ['le périmètre', "La distance autour d'une forme."],
                ["l'aire", "La mesure de la surface à l'intérieur d'une forme."]
              ],
              examples: [
                ['Écris le nombre : douze mille trois cent cinq.', ['Je mets 12 dans les milliers.', 'Je mets 305 dans les unités.', 'Je sépare les deux par un espace.'], '12 305'],
                ['Compare 56 789 et 56 798.', ['Les milliers sont égaux.', 'Les centaines sont égales.', 'Les dizaines : 9 est plus grand.'], '56 798 est plus grand']
              ]
            },
            en: {
              t: 'Large numbers and their places',
              intro: 'We work with numbers bigger than thousands and learn to read and compare them.',
              sections: [
                ['Large numbers', 'Numbers are made of places: ones, tens, hundreds and thousands. A digit changes value when its place changes.'],
                ['From thousands to millions', 'The number 45,678 has 45 thousands and 678 ones. We leave a space between thousands and ones to read the number easily.'],
                ['Operations with numbers', 'Addition, subtraction, multiplication and division are used in different situations. We choose the operation from the meaning of the problem.'],
                ['Comparing numbers', 'We compare the largest place first. If the digits are equal, we move to the next place.'],
                ['A fraction is part of a whole', 'A fraction shows part of an object divided into equal parts. The numerator counts the parts taken and the denominator counts all the parts.'],
                ['Measurement and geometry', 'We find the perimeter by adding the sides. For a rectangle, the area is length multiplied by width.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, which fixes its value.'],
                ['numerator', 'The number above the fraction bar that counts the parts taken.'],
                ['denominator', 'The number below the bar that shows the equal parts.'],
                ['ratio', 'A comparison of two quantities by division.'],
                ['perimeter', 'The distance around a shape.'],
                ['area', 'The size of the surface inside a shape.']
              ],
              examples: [
                ['Write the number: twelve thousand three hundred and five.', ['I put 12 in the thousands.', 'I put 305 in the ones.', 'I separate them with a space.'], '12,305'],
                ['Compare 56,789 and 56,798.', ['The thousands are equal.', 'The hundreds are equal.', 'The tens: 9 is bigger.'], '56,798 is bigger']
              ]
            }
          }
        },
        {
          t: 'الكسور وعملياتها',
          intro: 'نتعلم كيف نقرأ الكسور ونجمعها عندما يكون المقام واحد.',
          sections: [
            ['بسط الكسر ومقامه', 'في الكسر 3/5، البسط 3 والمقام 5. المقام يخبرنا أن الشيء مقسوم إلى خمسة أجزاء متساوية.'],
            ['جمع الكسور', 'إذا كان المقامان متساويين، نجمع البسطين ونترك المقام كما هو: 2/7 + 3/7 = 5/7.']
          ],
          examples: [
            ['لونت 2 من 8 أجزاء. ما الكسر؟', ['أعد الأجزاء الملوونة.', 'أعدد كل الأجزاء.', 'أكتب البسط فوق المقام.'], '2/8'],
            ['احسب 3/10 + 4/10.', ['المقامان متساويان.', 'أجمع 3 + 4.', 'أكتب النتيجة على المقام 10.'], '7/10']
          ],
          questions: [
            ['ما مقام الكسر 4/9؟', ['9', '4', '13', '5'], 0, 'المقام هو الرقم الأسفل، وهو 9.'],
            ['ما ناتج 1/6 + 3/6؟', ['4/6', '4/12', '3/6', '1/6'], 0, 'نجمع البسطين ونحتفظ بالمقام 6.'],
            ['أي كسر يعني نصف التفاحة؟', ['1/2', '2/1', '1/3', '3/4'], 0, '1/2 يعني أخذ جزء من جزأين متساويين، أي النصف.'],
            ['لماذا لا نجمع المقامين؟', ['لأن المقام يعدد الأجزاء المتساوية', 'لأن البسط أكبر', 'لأن الكسر صغير', 'لأن الجمع يغير الشكل'], 0, 'المقام يحدد حجم الجزء، فيبقى ثابتا عند جمع أجزاء من نفس الحجم.']
          ],
          tr: {
            fr: {
              t: 'Les fractions et leurs opérations',
              intro: 'Nous apprenons à lire une fraction et à additionner deux fractions de même dénominateur.',
              sections: [
                ['Les grands nombres', "Les nombres sont formés de positions : unités, dizaines, centaines et milliers. La valeur d'un chiffre change selon sa position."],
                ['Numérateur et dénominateur', "Dans 3/5, le numérateur est 3 et le dénominateur est 5. Le dénominateur indique que l'objet est partagé en cinq parts égales."],
                ['Les opérations sur les nombres', "L'addition, la soustraction, la multiplication et la division servent dans des situations différentes. On choisit l'opération selon le sens du problème."],
                ['Additionner des fractions', 'Quand les dénominateurs sont égaux, on additionne les numérateurs et on garde le dénominateur : 2/7 + 3/7 = 5/7.'],
                ['La fraction, une partie du tout', "Une fraction représente une partie d'un objet divisé en parts égales. Le numérateur compte les parts prises et le dénominateur indique toutes les parts."],
                ['Mesure et géométrie', "On calcule le périmètre en additionnant les côtés. Pour un rectangle, l'aire est la longueur multipliée par la largeur."]
              ],
              vocab: [
                ['la position', "La place d'un chiffre dans le nombre, qui détermine sa valeur."],
                ['le numérateur', 'Le chiffre au-dessus de la barre, qui compte les parts prises.'],
                ['le dénominateur', 'Le chiffre sous la barre, qui indique les parts égales.'],
                ['le rapport', 'Une comparaison entre deux quantités par la division.'],
                ['le périmètre', "La distance autour d'une forme."],
                ["l'aire", "La mesure de la surface à l'intérieur d'une forme."]
              ],
              examples: [
                ["J'ai colorié 2 parts sur 8. Quelle fraction ?", ['Je compte les parts coloriées.', 'Je compte toutes les parts.', "J'écris le numérateur au-dessus."], '2/8'],
                ['Calcule 3/10 + 4/10.', ['Les dénominateurs sont égaux.', "J'additionne 3 et 4.", 'Je garde le dénominateur 10.'], '7/10']
              ]
            },
            en: {
              t: 'Fractions and their operations',
              intro: 'We learn to read a fraction and to add two fractions with the same denominator.',
              sections: [
                ['Large numbers', 'Numbers are made of places: ones, tens, hundreds and thousands. A digit changes value when its place changes.'],
                ['Numerator and denominator', 'In 3/5, the numerator is 3 and the denominator is 5. The denominator tells us the object is shared into five equal parts.'],
                ['Operations with numbers', 'Addition, subtraction, multiplication and division are used in different situations. We choose the operation from the meaning of the problem.'],
                ['Adding fractions', 'When the denominators are the same, we add the numerators and keep the denominator: 2/7 + 3/7 = 5/7.'],
                ['A fraction is part of a whole', 'A fraction shows part of an object divided into equal parts. The numerator counts the parts taken and the denominator counts all the parts.'],
                ['Measurement and geometry', 'We find the perimeter by adding the sides. For a rectangle, the area is length multiplied by width.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, which fixes its value.'],
                ['numerator', 'The number above the fraction bar that counts the parts taken.'],
                ['denominator', 'The number below the bar that shows the equal parts.'],
                ['ratio', 'A comparison of two quantities by division.'],
                ['perimeter', 'The distance around a shape.'],
                ['area', 'The size of the surface inside a shape.']
              ],
              examples: [
                ['I coloured 2 parts out of 8. What fraction is that?', ['I count the coloured parts.', 'I count all the parts.', 'I write the numerator on top.'], '2/8'],
                ['Work out 3/10 + 4/10.', ['The denominators are equal.', 'I add 3 and 4.', 'I keep the denominator 10.'], '7/10']
              ]
            }
          }
        },
        {
          t: 'النسب في حياتنا',
          intro: 'النسبة تقارن كميتين. نستخدمها في الأسعار والوصفات والمسافات.',
          sections: [
            ['معنى النسبة', 'إذا كان ثمن 3 دفاتر 12 درهما، فإن ثمن دفتر واحد 4 دراهم. النسبة هنا 12 إلى 3.'],
            ['تناسب مباشر', 'عندما يزداد عدد الدفاتر يزداد الثمن بنفس المقدار. 5 دفاتر تكلف 20 درهما إذا كان الواحد 4.']
          ],
          examples: [
            ['ثمن 4 أقلام 20 درهما. كم ثمن القلم الواحد؟', ['أقرأ الثمن الكلي.', 'أقسم على عدد الأقلام.', '20 ÷ 4 = 5.'], '5 دراهم'],
            ['كيلو تفاح بـ 8 دراهم. كم ثمن 3 كيلو؟', ['أحدد ثمن الكيلو.', 'أضرب في 3.', 'أكتب الوحدة.'], '24 درهما']
          ],
          questions: [
            ['ثمن 2 دفترين 10 دراهم. كم ثمن الواحد؟', ['5', '10', '20', '8'], 0, 'قسمة 10 على 2 تعطي 5 دراهم للدفتر.'],
            ['إذا كان 1 كيلو بـ 6 دراهم، فكم 4 كيلو؟', ['24', '10', '6', '30'], 0, 'نضرب 6 في 4 فنحصل على 24 درهما.'],
            ['أي موقف يستخدم النسبة؟', ['حساب ثمن عدة دفاتر', 'عدّ الأيام في الأسبوع', 'قراءة اسم المدينة', 'كتابة الحروف'], 0, 'النسبة تربط كميتين مثل العدد والثمن، لا تستخدم لتسمية أو عدّ بسيط.'],
            ['ماذا نفعل إذا زاد عدد الدفاتر؟', ['يزداد الثمن بنفس النسبة', 'ينقص الثمن', 'يبقى الثمن', 'يتغير اللون'], 0, 'في التناسب المباشر تزداد الكميتان معا بنفس المعدل.']
          ],
          tr: {
            fr: {
              t: 'Les rapports dans la vie',
              intro: "Un rapport compare deux quantités. Nous l'utilisons pour les prix et les recettes.",
              sections: [
                ['Les grands nombres', "Les nombres sont formés de positions : unités, dizaines, centaines et milliers. La valeur d'un chiffre change selon sa position."],
                ['Le sens du rapport', 'Si 3 cahiers coûtent 12 dirhams, un cahier coûte 4 dirhams. Le rapport est 12 pour 3.'],
                ['Les opérations sur les nombres', "L'addition, la soustraction, la multiplication et la division servent dans des situations différentes. On choisit l'opération selon le sens du problème."],
                ['La proportionnalité', "Quand le nombre de cahiers augmente, le prix augmente dans le même rapport. 5 cahiers coûtent 20 dirhams."],
                ['La fraction, une partie du tout', "Une fraction représente une partie d'un objet divisé en parts égales. Le numérateur compte les parts prises et le dénominateur indique toutes les parts."],
                ['Mesure et géométrie', "On calcule le périmètre en additionnant les côtés. Pour un rectangle, l'aire est la longueur multipliée par la largeur."]
              ],
              vocab: [
                ['la position', "La place d'un chiffre dans le nombre, qui détermine sa valeur."],
                ['le numérateur', 'Le chiffre au-dessus de la barre, qui compte les parts prises.'],
                ['le dénominateur', 'Le chiffre sous la barre, qui indique les parts égales.'],
                ['le rapport', 'Une comparaison entre deux quantités par la division.'],
                ['le périmètre', "La distance autour d'une forme."],
                ["l'aire", "La mesure de la surface à l'intérieur d'une forme."]
              ],
              examples: [
                ['4 stylos coûtent 20 dirhams. Combien coûte un stylo ?', ['Je lis le prix total.', 'Je divise par 4.', '20 ÷ 4 = 5.'], '5 dirhams'],
                ["Un kilo de pommes coûte 8 dirhams. Combien pour 3 kilos ?", ["Je prends le prix d'un kilo.", 'Je multiplie par 3.', "J'écris l'unité."], '24 dirhams']
              ]
            },
            en: {
              t: 'Ratios in everyday life',
              intro: 'A ratio compares two quantities. We use it for prices and recipes.',
              sections: [
                ['Large numbers', 'Numbers are made of places: ones, tens, hundreds and thousands. A digit changes value when its place changes.'],
                ['What a ratio means', 'If 3 notebooks cost 12 dirhams, one notebook costs 4 dirhams. The ratio is 12 to 3.'],
                ['Operations with numbers', 'Addition, subtraction, multiplication and division are used in different situations. We choose the operation from the meaning of the problem.'],
                ['Direct proportion', 'As the number of notebooks grows, the price grows in the same ratio. 5 notebooks cost 20 dirhams.'],
                ['A fraction is part of a whole', 'A fraction shows part of an object divided into equal parts. The numerator counts the parts taken and the denominator counts all the parts.'],
                ['Measurement and geometry', 'We find the perimeter by adding the sides. For a rectangle, the area is length multiplied by width.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, which fixes its value.'],
                ['numerator', 'The number above the fraction bar that counts the parts taken.'],
                ['denominator', 'The number below the bar that shows the equal parts.'],
                ['ratio', 'A comparison of two quantities by division.'],
                ['perimeter', 'The distance around a shape.'],
                ['area', 'The size of the surface inside a shape.']
              ],
              examples: [
                ['4 pens cost 20 dirhams. How much is one pen?', ['I read the total price.', 'I divide by 4.', '20 ÷ 4 = 5.'], '5 dirhams'],
                ['One kilo of apples costs 8 dirhams. How much for 3 kilos?', ['I take the price of one kilo.', 'I multiply by 3.', 'I write the unit.'], '24 dirhams']
              ]
            }
          }
        },
        {
          t: 'هندسة المحيط والمساحة',
          intro: 'نحسب محيط الأشكال ومساحتها، ونختار الوحدة المناسبة.',
          sections: [
            ['محيط المستطيل', 'محيط المستطيل يساوي 2 × (الطول + العرض). إذا كان الطول 6 سم والعرض 4 سم، فالمحيط 20 سم.'],
            ['المساحة', 'مساحة المستطيل = الطول × العرض. في المثال السابق المساحة 24 سم².']
          ],
          examples: [
            ['مربع ضلعه 7 سم. احسب محيطه.', ['المربع له 4 أضلاع متساوية.', 'أضرب 7 في 4.', 'أكتب الوحدة.'], '28 سم'],
            ['مستطيل طوله 9 سم وعرضه 5 سم. ما مساحته؟', ['أحدد الطول والعرض.', 'أضرب 9 في 5.', 'أكتب سم².'], '45 سم²']
          ],
          questions: [
            ['ما محيط مربع ضلعه 3 سم؟', ['12 سم', '9 سم', '6 سم', '3 سم'], 0, 'للمربع أربعة أضلاع متساوية، فالمحيط 4 × 3 = 12 سم.'],
            ['ما مساحة مستطيل 8 سم × 2 سم؟', ['16 سم²', '10 سم²', '20 سم²', '8 سم²'], 0, 'المساحة طول × عرض = 8 × 2 = 16 سم².'],
            ['أي وحدة للمساحة؟', ['سم²', 'سم', 'كغ', 'لتر'], 0, 'المساحة تقاس بوحدات مربعة مثل سم²، أما سم فوحدة طول.'],
            ['كيف نحسب محيط مستطيل؟', ['2 × (الطول + العرض)', 'الطول × العرض', 'الطول + العرض', 'الطول ÷ العرض'], 0, 'المحيط مجموع الأضلاع الأربعة، أي ضعف مجموع الطول والعرض.']
          ],
          tr: {
            fr: {
              t: 'Géométrie : périmètre et aire',
              intro: "Nous calculons le périmètre et l'aire des formes, avec les unités correctes.",
              sections: [
                ['Les grands nombres', "Les nombres sont formés de positions : unités, dizaines, centaines et milliers. La valeur d'un chiffre change selon sa position."],
                ['Le périmètre du rectangle', "Le périmètre d'un rectangle vaut 2 × (longueur + largeur). Avec 6 cm et 4 cm, on obtient 20 cm."],
                ['Les opérations sur les nombres', "L'addition, la soustraction, la multiplication et la division servent dans des situations différentes. On choisit l'opération selon le sens du problème."],
                ["L'aire", "L'aire d'un rectangle est la longueur multipliée par la largeur. Dans notre exemple, elle vaut 24 cm²."],
                ['La fraction, une partie du tout', "Une fraction représente une partie d'un objet divisé en parts égales. Le numérateur compte les parts prises et le dénominateur indique toutes les parts."],
                ['Mesure et géométrie', "On calcule le périmètre en additionnant les côtés. Pour un rectangle, l'aire est la longueur multipliée par la largeur."]
              ],
              vocab: [
                ['la position', "La place d'un chiffre dans le nombre, qui détermine sa valeur."],
                ['le numérateur', 'Le chiffre au-dessus de la barre, qui compte les parts prises.'],
                ['le dénominateur', 'Le chiffre sous la barre, qui indique les parts égales.'],
                ['le rapport', 'Une comparaison entre deux quantités par la division.'],
                ['le périmètre', "La distance autour d'une forme."],
                ["l'aire", "La mesure de la surface à l'intérieur d'une forme."]
              ],
              examples: [
                ['Un carré a un côté de 7 cm. Calcule son périmètre.', ['Le carré a 4 côtés égaux.', 'Je multiplie 7 par 4.', "J'écris l'unité."], '28 cm'],
                ['Un rectangle mesure 9 cm sur 5 cm. Quelle est son aire ?', ['Je prends la longueur et la largeur.', 'Je multiplie 9 par 5.', "J'écris cm²."], '45 cm²']
              ]
            },
            en: {
              t: 'Geometry: perimeter and area',
              intro: 'We calculate the perimeter and area of shapes using the correct units.',
              sections: [
                ['Large numbers', 'Numbers are made of places: ones, tens, hundreds and thousands. A digit changes value when its place changes.'],
                ['The perimeter of a rectangle', 'The perimeter of a rectangle is 2 × (length + width). With 6 cm and 4 cm we get 20 cm.'],
                ['Operations with numbers', 'Addition, subtraction, multiplication and division are used in different situations. We choose the operation from the meaning of the problem.'],
                ['Area', 'The area of a rectangle is length multiplied by width. In our example it is 24 cm².'],
                ['A fraction is part of a whole', 'A fraction shows part of an object divided into equal parts. The numerator counts the parts taken and the denominator counts all the parts.'],
                ['Measurement and geometry', 'We find the perimeter by adding the sides. For a rectangle, the area is length multiplied by width.']
              ],
              vocab: [
                ['place value', 'The position of a digit in a number, which fixes its value.'],
                ['numerator', 'The number above the fraction bar that counts the parts taken.'],
                ['denominator', 'The number below the bar that shows the equal parts.'],
                ['ratio', 'A comparison of two quantities by division.'],
                ['perimeter', 'The distance around a shape.'],
                ['area', 'The size of the surface inside a shape.']
              ],
              examples: [
                ['A square has a side of 7 cm. Find its perimeter.', ['A square has 4 equal sides.', 'I multiply 7 by 4.', 'I write the unit.'], '28 cm'],
                ['A rectangle is 9 cm by 5 cm. What is its area?', ['I take the length and the width.', 'I multiply 9 by 5.', 'I write cm².'], '45 cm²']
              ]
            }
          }
        }
      ]
    }
    ,
    'cur_l_p6_sub_fr': {
      shared: {
        sections: [
          ['Lire un texte', "Un texte littéraire raconte une histoire ou exprime un sentiment. On le lit d'abord silencieusement, puis à voix haute."],
          ['Le sens des mots', 'Un mot peut avoir un sens direct et un sens imagé. Le contexte aide à choisir le bon sens.'],
          ['Observer la forme', 'La ponctuation, les paragraphes et les rimes donnent un rythme au texte. Ils aident le lecteur à comprendre.'],
          ['Écrire à son tour', 'Pour écrire, on choisit un thème, on prépare quelques idées, puis on rédige des phrases simples.']
        ],
        vocab: [
          ['un récit', 'Un texte qui raconte des événements.'],
          ['un poème', 'Un texte court qui exprime des sentiments, souvent avec des rimes.'],
          ['une rime', 'Une ressemblance de son à la fin de deux vers.'],
          ['un personnage', 'Une personne ou un animal qui agit dans un récit.'],
          ['une phrase', 'Un ensemble de mots qui exprime une idée complète.'],
          ['un verbe', 'Un mot qui exprime une action ou un état.']
        ],
        outcomes: [
          "Les apprenants identifient le thème d'un court texte littéraire.",
          'Les apprenants repèrent deux rimes dans un poème simple.',
          'Les apprenants rédigent un paragraphe de quatre phrases cohérentes.',
          'Les apprenants conjuguent un verbe régulier au présent.'
        ],
        diagram: ''
      },
      lessons: [
        {
          t: 'Découvrir un court poème',
          intro: "Nous lisons un poème court et cherchons ce qu'il exprime.",
          sections: [
            ['Les vers et les rimes', 'Un poème est composé de vers. Quand deux vers finissent par le même son, ils forment une rime.'],
            ['Le sentiment', "Le poème peut parler de la mer, de l'école ou de la famille. On cherche le mot qui montre le sentiment du poète."]
          ],
          examples: [
            ['Lis ces deux vers : La mer est bleue, le ciel est bleu aussi. Quelle est la rime ?', ['Je regarde la fin des vers.', 'Les deux mots finissent par un son proche.', 'La rime est bleue / aussi.'], 'bleue / aussi'],
            ['Quel est le thème du poème sur la mer ?', ['Je lis le titre.', 'Je repère les mots mer et ciel.', 'Je nomme le thème.'], 'La mer et le ciel']
          ],
          questions: [
            ["Qu'est-ce qu'un vers ?", ['une ligne du poème', 'un chapitre', 'une rime', 'un personnage'], 0, 'Un vers est une ligne du poème; un chapitre appartient à un récit.'],
            ['Que sont bleue et aussi dans cet exemple ?', ['des rimes', 'des verbes', 'des personnages', 'des titres'], 0, 'Ces mots terminent les vers avec un son proche, ce sont des rimes.'],
            ['Quel mot montre un sentiment ?', ["j'aime", 'la table', 'le stylo', 'le mardi'], 0, "Le verbe aimer exprime un sentiment, contrairement aux noms d'objets ou de jour."],
            ['Comment lire un poème ?', ['à voix haute avec un rythme', 'en silence uniquement', 'très vite sans pause', 'en sautant les vers'], 0, 'La lecture à voix haute fait entendre le rythme et les rimes.']
          ]
        },
        {
          t: 'Analyser un récit court',
          intro: 'Nous lisons un petit récit pour repérer les personnages, le lieu et les actions.',
          sections: [
            ['Qui ? Où ? Quand ?', "Un récit présente des personnages dans un lieu. Il dit aussi quand l'action se passe."],
            ["Comprendre l'enchaînement", 'Les actions se suivent dans un ordre. Les mots puis et ensuite montrent cet ordre.']
          ],
          examples: [
            ['Dans le récit : Karim ouvre la porte puis il sort. Qui agit ?', ['Je cherche le nom avant le verbe.', 'Le nom est Karim.', 'Je réponds par une phrase.'], 'Karim'],
            ["Quel mot montre l'ordre des actions ?", ['Je relis les deux phrases.', 'Je cherche un mot de liaison.', 'Je trouve puis.'], 'puis']
          ],
          questions: [
            ['Qui est le personnage de la phrase Lina lit un livre ?', ['Lina', 'le livre', 'la phrase', "l'école"], 0, "Le personnage est celui qui fait l'action, ici Lina."],
            ['Quel mot indique la suite des actions ?', ['ensuite', 'mais', 'très', 'bleu'], 0, "Ensuite marque l'ordre; les autres mots marquent l'opposition, l'intensité ou la couleur."],
            ["Où se passe l'action si le texte dit dans la classe ?", ['dans la classe', 'sur la lune', "sous l'eau", 'dans le jardin'], 0, 'Le texte donne le lieu directement; il ne faut pas inventer un autre endroit.'],
            ['Que fait-on après la lecture ?', ['on cherche les idées principales', 'on efface le texte', 'on change le titre', 'on ne relit pas'], 0, "L'analyse cherche les idées essentielles et les détails du texte."]
          ]
        },
        {
          t: 'Écrire un petit paragraphe',
          intro: 'Nous préparons quelques idées puis nous écrivons un paragraphe sur notre école.',
          sections: [
            ['Préparer ses idées', "Avant d'écrire, on note trois mots : le lieu, les personnes et une action."],
            ['Rédiger et relire', 'On écrit quatre phrases courtes. Ensuite on relit pour vérifier les points et les accents.']
          ],
          examples: [
            ['Écris deux phrases sur la récréation.', ['Je choisis un lieu.', 'Je nomme une action.', "J'écris deux phrases."], 'Pendant la récréation, nous jouons dans la cour. Je joue avec Sara.'],
            ['Corrige : je vais a l ecole.', ['Je mets une majuscule.', "J'ajoute l'accent.", 'Je corrige la préposition.'], "Je vais à l'école."]
          ],
          questions: [
            ["Que note-t-on avant d'écrire le paragraphe ?", ['on note des idées', "on écrit sans penser", 'on efface tout', 'on dort'], 0, "Préparer ses idées rend l'écriture plus claire."],
            ['Combien de phrases pour un petit paragraphe ?', ['quatre', 'vingt', 'une seule', 'cent'], 0, 'Quatre phrases suffisent pour un paragraphe court et cohérent.'],
            ['Quel signe manque dans Tu vas bien ?', ['un point', 'une virgule', 'un point-virgule', 'un tiret'], 0, 'Une phrase se termine par un point.'],
            ["Pourquoi relire le paragraphe sur l'école ?", ['pour corriger les erreurs', 'pour le rendre plus long', 'pour changer de sujet', 'pour ne pas le montrer'], 0, 'La relecture permet de corriger la ponctuation et les accents.']
          ]
        },
        {
          t: 'Le présent des verbes réguliers',
          intro: "Nous étudions la conjugaison des verbes en -er au présent de l'indicatif.",
          sections: [
            ['La terminaison', 'Les verbes en -er prennent les terminaisons : -e, -es, -e, -ons, -ez, -ent.'],
            ['Le verbe parler', 'Je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent. La base reste parl-.']
          ],
          examples: [
            ['Conjugue manger avec nous.', ['Je trouve la base : mange-.', "J'ajoute la terminaison -ons.", "Je vérifie l'accord."], 'nous mangeons'],
            ['Complète : Ils ... dans la cour. avec jouer.', ['Je choisis le verbe jouer.', 'La base est jou-.', 'La terminaison est -ent.'], 'Ils jouent dans la cour.']
          ],
          questions: [
            ['Quelle terminaison pour nous ?', ['-ons', '-e', '-ent', '-ez'], 0, 'Au présent, nous parlons se termine par -ons.'],
            ["Comment écrit-on ils parler ?", ['ils parlent', 'ils parle', 'ils parlons', 'ils parlez'], 0, 'La terminaison de la troisième personne du pluriel est -ent.'],
            ['Quel est le verbe dans Lina chante ?', ['chante', 'Lina', 'le', 'une'], 0, "Chante est le verbe, il exprime l'action de Lina."],
            ['Pourquoi apprendre les terminaisons ?', ['pour bien accorder le verbe', 'pour écrire plus vite', 'pour changer le sens du mot', 'pour supprimer les noms'], 0, "Les terminaisons indiquent qui fait l'action."]
          ]
        }
      ]
    },
    'cur_l_p6_sub_art': {
      shared: {
        sections: [
          ['الفن تعبير', 'الفن وسيلة للتعبير عن الأفكار والمشاعر. نرى الجمال في الخط واللون والصوت.'],
          ['الملاحظة أولا', 'قبل الرسم ننظر إلى الشيء جيدا. نلاحظ شكله وألوانه وظلّه.'],
          ['الأدوات والترتيب', 'كل أداة لها دور: القلم للخط والفرشاة للون. نحفظ الأدوات نظيفة ومرتبة.'],
          ['العرض والاحترام', 'نعرض العمل بفخر، ونستمع إلى آراء الآخرين بأدب. لكل ذوق جميل.']
        ],
        vocab: [
          ['الرسم', 'عمل فني بالقلم أو الفرشاة على الورق.'],
          ['اللون', 'ما نراه في الأشياء مثل الأحمر والأزرق.'],
          ['الخط', 'أثر القلم على الورق.'],
          ['الإيقاع', 'نظام في الصوت والحركة.'],
          ['المسرح', 'مكان يؤدي فيه الممثلون دورا.'],
          ['التصميم', 'ترتيب العناصر في عمل فني.']
        ],
        outcomes: [
          'ينفذ الطالب رسما بسيطا باستخدام خطوط واضحة.',
          'يختار الطالب ألوانا متناسبة لعمله ويبرر اختياره.',
          'يقلد الطالب إيقاعا موسيقيا بسيطا بالتصفيق.',
          'يؤدي الطالب دورا قصيرا أمام زملائه بثقة.'
        ],
        diagram: 'diagram-colors.svg'
      },
      lessons: [
        {
          t: 'الرسم بالخطوط',
          intro: 'نتعلم اليوم كيف نرسم شكلا بسيطا بخطوط واضحة.',
          sections: [
            ['النظر قبل الرسم', 'ننظر إلى التفاحة أو إلى شجرة الزيتون. نحدد شكلها العام قبل أن نرسم التفاصيل.'],
            ['الخطوط المختلفة', 'الخط المستقيم يصل بين نقطتين، والخط المنحني يدور. نستخدمهما معا في رسم ورقة الشجر.']
          ],
          examples: [
            ['ارسم شجرة زيتون بثلاث خطوات.', ['ارسم جذعا مستقيما.', 'أضف أغصانا منحنية.', 'ضع دوائر صغيرة للأوراق.'], 'شجرة بجذع وأغصان وأوراق'],
            ['ارسم بيتا بخطوط بسيطة.', ['ارسم مربعا للجدار.', 'أضف مثلثا للسقف.', 'ضع بابا في الوسط.'], 'بيت بمربع ومثلث وباب']
          ],
          questions: [
            ['أي خط يصل بين نقطتين مباشرة؟', ['المستقيم', 'المنحني', 'الدائري', 'المكسور'], 0, 'الخط المستقيم هو أقصر طريق بين نقطتين.'],
            ['ما أول خطوة في الرسم؟', ['الملاحظة', 'التلوين', 'القص', 'اللصق'], 0, 'الملاحظة تساعد على معرفة الشكل قبل رسمه.'],
            ['أي شيء نرسمه بأغصان منحنية؟', ['شجرة زيتون', 'مكعب', 'مثلث', 'مستطيل'], 0, 'أغصان الشجر منحنية، بينما الأشكال الأخرى هندسية مستقيمة.'],
            ['لماذا نرسم التفاصيل أخيرا؟', ['لأن الشكل العام يأتي أولا', 'لأن التفاصيل صعبة', 'لأن القلم صغير', 'لأن الورق ملون'], 0, 'ترتيب العمل يبدأ بالكل ثم الجزء، فيصبح الرسم متناسقا.']
          ]
        },
        {
          t: 'التلوين المتناسق',
          intro: 'نتعلم اختيار الألوان وتلوين الأشكال بطريقة جميلة.',
          sections: [
            ['ألوان دافئة وباردة', 'الأحمر والأصفر دافئان، والأزرق والأخضر باردان. نختار ما يناسب الموضوع.'],
            ['التلوين داخل الحدود', 'نلون من الوسط إلى الحواف بحركات خفيفة. نترك الحدود واضحة حتى يبدو الشكل مرتبا.']
          ],
          examples: [
            ['لوّن سماء صافية.', ['اختر الأزرق.', 'ابدأ من أعلى الورقة.', 'لون بحركات خفيفة.'], 'سماء زرقاء'],
            ['لوّن تفاحة حمراء مع ورقة خضراء.', ['اختر الأحمر للتفاحة.', 'اختر الأخضر للورقة.', 'اترك المسافة بينهما بيضاء.'], 'تفاحة حمراء وورقة خضراء']
          ],
          questions: [
            ['أي لون دافئ؟', ['الأحمر', 'الأزرق', 'الأخضر', 'الرمادي'], 0, 'الأحمر من الألوان الدافئة، والباقي بارد أو محايد.'],
            ['كيف نلون تفاحة داخل حدودها؟', ['من الوسط إلى الحواف', 'من الخارج للداخل بسرعة', 'بضغط شديد', 'بعشوائية'], 0, 'التلوين من الوسط إلى الحواف يحفظ الحدود ويوزع اللون.'],
            ['لماذا نترك الحدود واضحة؟', ['ليبدو الشكل مرتبا', 'لأن اللون قليل', 'لأن الورقة صغيرة', 'لإخفاء الرسم'], 0, 'الحدود الواضحة تجعل العمل أنيقا ومفهوما.'],
            ['أي لون يناسب ورقة الشجر؟', ['الأخضر', 'الأزرق', 'الأسود', 'الوردي'], 0, 'أوراق الشجر غالبا خضراء، والباقي ألوان غير مألوفة لها.']
          ]
        },
        {
          t: 'الإيقاع والموسيقى',
          intro: 'نكتشف الإيقاع بالتصفيق ونقلد أنغاما بسيطة.',
          sections: [
            ['الإيقاع في الحياة', 'لقلب إيقاع، وللمشي إيقاع. نصفق على العدّ: واحد، اثنان، ثلاثة، أربعة.'],
            ['الصوت والهدوء', 'الموسيقى تحتاج إلى صوت وهدوء معا. إذا صفق الجميع في وقت واحد كان الإيقاع واضحا.']
          ],
          examples: [
            ['صفق إيقاعا من أربع دقات.', ['ابدأ بالعد واحد.', 'صفق مع كل عدد.', 'توقف عند أربعة.'], 'أربع دقات متتالية'],
            ['قلّد إيقاع: صفقة صفقة سكتة.', ['اسمع الإيقاع أولا.', 'صفق مرتين.', 'اسكت مرة.'], 'صفق، صفق، سكت']
          ],
          questions: [
            ['كيف نصف الإيقاع في الموسيقى؟', ['نظام في الصوت والحركة', 'لون الورق', 'شكل البيت', 'اسم المغني'], 0, 'الإيقاع نظام منتظم في الصوت أو الحركة، لا علاقة له بالألوان أو الأسماء.'],
            ['كم دقة في العد من واحد إلى أربعة؟', ['أربع', 'اثنتان', 'ثلاث', 'خمس'], 0, 'كل عدد يقابله دقة واحدة، والمجموع أربع.'],
            ['ما أهمية الاستماع قبل التقليد؟', ['لنسمع الترتيب بدقة', 'لنبتعد', 'لنغلق الباب', 'لنغني بصوت عال'], 0, 'الاستماع أولا يساعد على تقليد الإيقاع بترتيب صحيح.'],
            ['كيف نحافظ على إيقاع جماعي؟', ['نصفق معا في الوقت نفسه', 'كل واحد يصفق وحده', 'نتوقف فجأة', 'نصرخ'], 0, 'الاتفاق على الوقت يجعل الإيقاع واضحا وممتعا.']
          ]
        },
        {
          t: 'مسرح صغير في الفصل',
          intro: 'نؤدي دورا قصيرا أمام زملائنا ونتدرب على التعبير بالصوت والحركة.',
          sections: [
            ['اختيار الدور', 'نختار دور بائع الفواكه أو دور المشتري. كل دور له كلمات قليلة وحركة بسيطة.'],
            ['الأداء بثقة', 'نقف مستقيمين وننظر إلى الجمهور. نتكلم بصوت واضح ونستخدم إشارات صغيرة.']
          ],
          examples: [
            ['مثّل دور بائع التمر.', ['قف مستقيما.', 'قل: تمر طازج!', 'أشر إلى السلة.'], 'تمر طازج! تفضلوا.'],
            ['مثّل دور المشتري.', ['اقترب من البائع.', 'اسأل عن الثمن.', 'اشكره.'], 'كم ثمن الكيس؟ شكرا.']
          ],
          questions: [
            ['ما أول خطوة قبل التمثيل؟', ['اختيار الدور', 'الخروج من الفصل', 'إغلاق الكتاب', 'الصمت التام'], 0, 'تحديد الدور يساعد الممثل على معرفة ما يقوله ويفعله.'],
            ['كيف يؤدي الممثل دور المشتري على المسرح؟', ['بصوت واضح', 'بصوت خفيف جدا', 'بلا نظر للجمهور', 'بسرعة كبيرة'], 0, 'الوضوح يصل بالكلام إلى الجمهور.'],
            ['أي حركة مناسبة للممثل؟', ['إشارة صغيرة باليد', 'الجري حول المسرح', 'إغلاق العينين', 'الالتفات الدائم'], 0, 'الإشارة الصغيرة تدعم الكلام دون تشتيت.'],
            ['ماذا نفعل بعد الأداء؟', ['نشكر الممثلين ونصفق', 'نضحك على الأخطاء', 'نغادر بلا كلام', 'نغير الدور فورا'], 0, 'التصفيق والشكر احترام لجهد الممثلين.']
          ]
        }
      ]
    }
  }
};
