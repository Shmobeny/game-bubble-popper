export default {
  fonts: {
    eng: "'Bebas Neue', cursive",
    ua: "'Oswald', sans-serif",
    ru: "'Oswald', sans-serif"
  },
  menu: {
    start: {
      eng: "Start",
      ua: "Почати",
      ru: "Начать"
    },
    options: {
      eng: "Options",
      ua: "Налаштування",
      ru: "Настройки"
    },
    rules: {
      eng: "How to Play",
      ua: "Як грати",
      ru: "Как играть"
    }
  },
  options: {
    header: {
      eng: "Opti⬤ns",
      ua: "⬤пції",
      ru: "⬤пции"
    },
    language: {
      eng: "Language",
      ua: "Мова",
      ru: "Язык"
    },
    theme: {
      label: {
        eng: "Theme",
        ua: "Тема",
        ru: "Тема"
      },
      value: {
        eng: ["Dark", "White"],
        ua: ["Темна", "Біла"],
        ru: ["Темная", "Белая"]
      }
    },
    difficulty: {
      label: {
        eng: "Difficulty",
        ua: "Складність",
        ru: "Сложность"
      },
      value: {
        eng: ["Easy", "Normal", "Hard", "Custom"],
        ua: ["Легко", "Нормально", "Важко", "Під себе"],
        ru: ["Легко", "Нормально", "Тяжело", "Под себя"]
      }
    },
    initialVelocity: {
      eng: "Tick length",
      ua: "Довжина такту",
      ru: "Длина такта"
    },
    maxVelocity: {
      eng: "Min Tick length",
      ua: "Мінімальна довжина такту",
      ru: "Минимальная длина такта"
    },
    initialPause: {
      eng: "Initial Pause",
      ua: "Початкова затримка",
      ru: "Начальная задержка"
    },
    minPause: {
      eng: "Min Pause",
      ua: "Мінімальна затримка",
      ru: "Минимальная задержка"
    },
    bubbleLimit: {
      eng: "Bubble Limit",
      ua: "Бульбашковий ліміт",
      ru: "Лимит пузырьков"
    },
    randomExhibitor: {
      eng: "Random Exhibitor",
      ua: "Випадкова прогресія",
      ru: "Случайная прогрессия"
    },
    exhibitorIntensivity: {
      eng: "Exhibitor Intensivity",
      ua: "Інтенсивність прогресії",
      ru: "Интенсивность прогрессии"
    },
    button: {
      eng: "To Main Menu",
      ua: "До Головного Меню",
      ru: "К Главному Меню"
    },
    annotations: {
      difficulty: {
        eng: "You can change values below only at 'Custom' difficulty.",
        ua: "Значення нижче можна змінювати лише на складності 'Під себе'.",
        ru: "Значения ниже можно меня только на сложности 'Под себя'."
      },
      velocity: {
        eng: "Tick in milliseconds determines how quickly bubble will change his state: scale and position. Lower value - faster transitions.",
        ua: "Такт у мілісекундах визначає як швидко бульбашка змінює свій стан: розмір та позицію. Менші значення - швидкі переходи.",
        ru: "Такт в миллисекундах определяет как быстро шарик меняет свое состояние: размер и позицию. Меньшие значения – быстрые переходы."
      },
      pause: {
        eng: "Pause in milliseconds between 'ticks', when bubble increases.",
        ua: "Затримка у мілісекундах між 'тактами', коли бульбашка збільшуеться.",
        ru: "Задержка в миллисекундах между 'тактами', когда пузырь увеличивается."
      },
      bubbleLimit: {
        eng: "Maximum quantity of bubbles on game field at the same time.",
        ua: "Максимальна кількість бульбашок на ігровому полі.",
        ru: "Максимальное количество пузырьков на игровом поле."
      },
      randomExhibitor: {
        eng: "Exhibitor shows how fast game transit from early to late values (from initial to min tick length, for example). If Exhibitor is random, game will choose any value between early to late states randomly each time, when new bubble apperas.",
        ua: "Прогресія показує, як швидко гра переходить від ранніх до пізніх значень (наприклад, від початкової до мінімальной довжини такту). Якщо прогресія випадкова, гра вибиратиме будь-яке значення між раннім і пізнім станами кожного разу, коли з’являтиметься нова бульбашка.",
        ru: "Прогрессия показывает, как быстро игра переходит от ранних значений к поздним (например, от начальной длины такта к минимальной). Если прогрессия является случайной, игра будет выбирать любое значение между ранним и поздним состояниями каждый раз, когда появляется новый пузырь."
      },
      exhibitorIntensivity: {
        eng: "Higher value - slower transit from early to late game values (Tick length, Pause) and contrariwise.",
        ua: "Чим більше значення, тим повільнише гра переходить від ранніх до пізніх значень (Довжина такту, Затримка) і навпаки.",
        ru: "Чем больше значение, тем медленнее игра переходит от ранних к поздним значениям (Длина такта, Задержка) и наоборот."
      }
    }
  },
  rules: {
    header: {
      eng: "H⬤w to Play",
      ua: "Що до ч⬤го?",
      ru: "Чт⬤ к чему?"
    },
    mainText: {
      eng: "Main goal in this game - its to pop bubbles. To do so, you need to touch the bubble when its value (number inside) will be equal to the multiplier value (number on top side of the game field).",
      ua: "Головна мета в цій грі - лопати бульбашки. Для цього вам потрібно торкнутися бульбашки, коли її значення (число всередині) буде дорівнювати значенню множника (число у верхній частині ігрового поля).",
      ru: "Основная цель в этой игре - лопать пузыри. Для этого нужно коснуться пузыря, когда его значение (число внутри) сравняется со значением множителя (число в верхней части игрового поля)."
    },
    bubble: {
      header: {
        eng: "Bubble ⚪",
        ua: "Бульбашка ⚪",
        ru: "Пузырёк ⚪"
      },
      text: {
        eng: "Bubble behavior is simple: it decreases, after touching, and it increases next, if value was higher then 0 after decreasing. Also, each touch creates another bubble, if the limit has not been exceeded. Max bubbles on game field depends on game difficulty.",
        ua: "Поведінка бульбашки проста: вона зменшується після дотику, а потім збільшується, якщо значення було вище 0 після зменшення. Також кожен дотик створює ще одну бульбашку, якщо ліміт дозволяє. Максимальна кількість бульбашок на ігровому полі залежить від складності гри.",
        ru: "Поведение пузырька простое: он уменьшается после прикосновения, а затем увеличивается, если значение было выше 0 после уменьшения. Также каждое прикосновение создает еще один пузырь, если лимит позволяет. Максимальное количество пузырьков на игровом поле зависит от сложности игры."
      }
    },
    multiplier: {
      header: {
        eng: "Multiplier 🎲",
        ua: "Множник 🎲",
        ru: "Множитель 🎲"
      },
      text: {
        eng: "Multiplier defines how many points bubbles lose after touching. Multiplier is not constatable - its value depends on how many bubbles the game field contains at this time. Value of multiplier calculated by formula: '0.5 * bubbles count'.",
        ua: "Множник визначає, скільки балів бульбашка втрачає після дотику. Множник постійно змінюється - його значення залежить від того, скільки бульбашок містить ігрове поле в цей момент. Значення множника обчислюється за формулою: «0,5 * кількість бульбашок».",
        ru: "Множитель определяет, сколько очков пузырек теряет после касания. Множитель не является постоянным - его значение зависит от того, сколько пузырей находится на игровом поле в данный момент. Значение множителя рассчитывается по формуле: «0,5 * количество пузырей»."
      }
    },
    score: {
      header: {
        eng: "Score 🏆",
        ua: "Рахунок 🏆",
        ru: "Счёт 🏆"
      },
      text: {
        eng: "Each popped bubble increases score by one. Score shown on bottom side of the game field.",
        ua: "Кожна лопнута бульбашка збільшує рахунок на одиницю. Рахунок відображається в нижній частині ігрового поля.",
        ru: "Каждый лопнувший пузырек увеличивает счет на единицу. Счет отображается в нижней части игрового поля."
      }
    },
    difficulty: {
      header: {
        eng: "Difficulty 💪",
        ua: "Складність 💪",
        ru: "Сложность 💪"
      },
      text: {
        eng: "You can choose between 3 difficulty presets, or customize the game to fit your pacing. Difficulty has an impact on bubbles speed, bubbles limit and other values. Visit the 'Options' section to learn more and adjust settings.",
        ua: "Ви можете вибрати між 3 попередньо встановленими рівнями складності, або налаштувати гру відповідно до свого темпу. Складність впливає на швидкість бульбашок, ліміт бульбашок та інші значення. Відвідайте розділ «Параметри», щоб дізнатися більше та налаштувати параметри.",
        ru: "Вы можете выбрать один из 3 предустановленных уровней сложности, или настроить игру в соответствии со своим темпом. Сложность влияет на скорость пузырей, лимит пузырей и другие параметры. Посетите раздел «Параметры», чтобы узнать больше и настроить параметры."
      }
    },
    endgame: {
      header: {
        eng: "Endgame ♻️",
        ua: "Єндшпіль ♻️",
        ru: "Эндшпиль ♻️"
      },
      text: {
        eng: "Game is endless. If all bubbles are popped, the game just generates a new bubble and the game continues. Pop bubbles, rise score, until you lose. Game have two lose conditions: some bubble increased his value to 3, or bubble decreased to negative value (less the 0).",
        ua: "Гра нескінченна. Якщо всі бульбашки лопнуть, гра просто генерує нову бульбашку і продовжується. Лопайте бульбашки та збільшуйте рахунок поки не програєте. У грі є дві умови програшу: одна з бульбашок збільшує своє значення до 3, або зменшується до від’ємного значення (менше 0).",
        ru: "Игра бесконечна. Если все пузырьки лопнут, игра просто генерирует новый пузырь и продолжается. Лопайте пузыри и увеличивайте счет пока не проиграете. В игре есть два условия проигрыша: один из пузырьков увеличивает свое значение до 3, или уменьшается до отрицательного значения (меньше 0)."
      }
    },
    button: {
      eng: "To Main Menu",
      ua: "До Головного Меню",
      ru: "К Главному Меню"
    },
  },
  game: {
    pause: {
      eng: ["Game...", "...paused"],
      ua: ["На...", "...паузі"],
      ru: ["На...", "...паузе"]
    },
    resume: {
      eng: "Resuming in...",
      ua: "Початок через...",
      ru: "Начало через..."
    },
    lose: {
      eng: ["You", "Lose!"],
      ua: ["Грі", "Кінець!"],
      ru: ["Игре", "Конец!"]
    },
    labels: {
      multiplier: {
        eng: "Multiplier",
        ua: "Множник",
        ru: "Множитель"
      },
      score: {
        eng: "Score",
        ua: "Рахунок",
        ru: "Счёт"
      }
    }
  }
}