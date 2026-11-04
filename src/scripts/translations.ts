import type { FormStatus, Language, TextKey } from './values'

// Plain data with no DOM access, so vite.config.js can import it too (see the
// i18n-reserve plugin there).
//
// The English strings must match the text in index.html exactly (a test checks
// this), so keep each translated element's text on a single line there.
// Technology and company names stay out of the translations: they live in the
// HTML as plain text and read the same in every language.

// TODO: Make it JSON? Load those texts on click? If English is default language, what's the point of having ru and sr in the memory because not everyone will click to switch language
export const translations: Record<Language, Record<TextKey, string>> = {
    en: {
        pageTitle: 'Maksim Kalinin — Frontend-Focused Fullstack Developer',
        skipLink: 'Skip to content',

        navHome: 'Home',
        navAbout: 'About',
        navExperience: 'Experience',
        navSkills: 'Skills',
        navProjects: 'Projects',
        navContact: 'Contact me',
        navMenu: 'Menu',
        langLabel: 'Language:',

        heroEyebrow: 'Frontend-focused fullstack developer · Belgrade',
        heroSubtitle:
            'I build data-dense, real-time interfaces in React, Vue and TypeScript, and the APIs and data contracts behind them.',
        heroCv: 'Download CV',
        heroEmail: 'Email',

        aboutHeading: 'About',
        aboutP1:
            'I’m a frontend-focused fullstack developer with 7+ years of experience building production web apps for gaming, fintech and edtech. My core is React (Next.js), Vue (Nuxt) and TypeScript: data-dense and real-time UIs, animation, i18n (up to 29 languages, incl. RTL), accessibility and Core Web Vitals performance.',
        aboutP2:
            'On the backend I build APIs and data contracts in Node.js (Express, NestJS), Python (Django) and PHP (Laravel). I own features end to end, from the data model to the interface, and ship high-traffic features to fixed deadlines. That’s how I worked at Wargaming on the World of Tanks 2.0 Hangar and its live-ops events.',
        aboutP3:
            'I care about the parts users feel but rarely notice: accessibility, localization (16 languages and RTL at Libertex, 29 at Wargaming) and motion. I live in Belgrade and speak English, Russian and Serbian, the same three languages this site is in.',

        expHeading: 'Experience',
        expPresent: 'present',
        expIndRole: 'Independent developer',
        expIndText:
            'Building my own products, WizardTuner and JobScraper. More about them under Projects.',
        expWgRole: 'Frontend-focused fullstack developer',
        expWg1: 'Rebuilt the World of Tanks 2.0 Hangar, the game’s main navigation screen (main page, vehicle carousel, central vehicle button), used by 5,800+ concurrent players (10,000+ at peak) in 29 languages.',
        expWg2: 'Built in-game event UI for live-ops and clan features shipped to fixed launch dates (Pet System, Holiday Ops 24/25 and 25/26, Strongholds Event, Clan Supply, Tournaments, Clan Winter Event): real-time notifications, live timers and progress bars, leaderboard tables with filtering, pagination, virtualization and expandable rows, animations and mini-games. Worked with game designers, UX/UI, backend and QA on each launch.',
        expWg3: 'Built Django endpoints with data-aggregation logic and defined the backend–frontend data contracts around the game client’s UI constraints; the changes went through the backend team’s code review.',
        expWg4: 'Reviewed pull requests for a team of 5 frontend and fullstack developers.',
        expLxRole: 'Frontend developer',
        expLx1: 'Built a real-time trading table streaming prices for 15–20 instruments (stocks, crypto and more) at ~1-second intervals without render slowdowns, embedded as widgets in the existing CMS.',
        expLx2: 'Led motion and interaction work on the trading UI and wrote the animation guidelines the other 4 frontend developers followed.',
        expLx3: 'Implemented support for 16 languages, including a full right-to-left layout for Arabic, with per-locale URLs, hreflang and localized meta. Took part in the migration from Drupal to headless Drupal + Nuxt: URLs were kept or 301-redirected, the site stayed fully indexed and key landing pages passed Core Web Vitals.',
        expFlRole: 'Freelance frontend / fullstack developer',
        expFl1: 'Completed 28 Upwork projects with a 4.9/5 rating and 100% Job Success: responsive sites from designs, animation work, a browser lottery game with a backend, and a Flash-to-JavaScript migration.',
        expFl2: 'Integrated real-time feeds from multiple exchange APIs into a crypto exchange aggregator.',
        expEdRole: 'Fullstack engineer',
        expEd1: 'Owned the custom graphing engine of an assessment platform used by school districts across Alaska, from client-side rendering to the data contracts behind real-time auto-grading, and kept it stable under continuous input during live tests.',
        expEd2: 'Built interactive geometry modules (trigonometry, coordinate geometry) for student assessments.',
        expEarlyRole: 'Earlier',
        expEarly1:
            'Lloyd Hardy Enterprises: built and maintained a proprietary CMS end to end in Laravel and MySQL (backend logic, REST API, admin features and client-facing pages), plus interactive, responsive frontend modules.',
        expEarly2:
            'Tribefire: built the core interface of a streamer platform in Vue, with reactive components for live-data broadcasting, a Stripe donation checkout and real-time donation alerts.',

        skillsHeading: 'Skills',
        skillsFrontend: 'Frontend',
        skillsBackend: 'Backend & data',
        skillsTooling: 'Tooling & testing',
        skillsPractices: 'Practices',
        skillsA11y: 'Accessibility (WCAG)',
        skillsI18n: 'Internationalization, incl. RTL',
        skillsPerf: 'Performance (Core Web Vitals)',
        skillsDesignSystems: 'Design systems & tokens',
        skillsArchitecture: 'Frontend architecture',
        skillsReview: 'Code review & mentoring',
        skillsAi: 'Agentic AI development (Claude Code)',
        skillsSecurity: 'Security (CSP, OAuth2, JWT)',

        projectsHeading: 'Projects',
        projWtStatus: 'In progress',
        projWtText:
            'A PWA for musicians: tuner, metronome, beat machine and ear-training games. Low-latency audio runs on a dedicated audio thread.',
        projJsStatus: 'In progress',
        projJsText: 'A job-aggregation tool that collects listings from multiple international and Serbian job boards, with keyword, location and work-type filters.',

        contactTitle: 'Contact me',
        contactClose: 'Close',
        contactText: 'Or reach me directly:',
        contactEmail: 'Email',
        contactFormRequired: 'All fields are required.',
        contactFormName: 'Your name',
        contactFormEmail: 'Your email',
        contactFormMessage: 'Message',
        contactFormSend: 'Send',
        footerCv: 'CV (PDF)',
    },
    ru: {
        pageTitle: 'Максим Калинин — fullstack-разработчик с фокусом на фронтенд',
        skipLink: 'Перейти к содержанию',

        navHome: 'Главная',
        navAbout: 'Обо мне',
        navExperience: 'Опыт',
        navSkills: 'Навыки',
        navProjects: 'Проекты',
        navContact: 'Связаться со мной',
        navMenu: 'Меню',
        langLabel: 'Язык:',

        heroEyebrow: 'Fullstack-разработчик с фокусом на фронтенд · Белград',
        heroSubtitle:
            'Создаю интерфейсы с большим объёмом данных и обновлениями в реальном времени на React, Vue и TypeScript, а также API и контракты данных за ними.',
        heroCv: 'Скачать CV (EN)',
        heroEmail: 'Почта',

        aboutHeading: 'Обо мне',
        aboutP1:
            'Я fullstack-разработчик с фокусом на фронтенд и опытом более 7 лет: делаю продакшен веб-приложения для геймдева, финтеха и edtech. Моя основа — React (Next.js), Vue (Nuxt) и TypeScript: интерфейсы с большим объёмом данных и данными в реальном времени, анимация, i18n (до 29 языков, включая RTL), доступность и производительность по Core Web Vitals.',
        aboutP2:
            'На бэкенде пишу API и контракты данных на Node.js (Express, NestJS), Python (Django) и PHP (Laravel). Веду фичи целиком, от модели данных до интерфейса, и выпускаю высоконагруженные фичи к фиксированным срокам. Так я работал в Wargaming над Ангаром World of Tanks 2.0 и его live-ops событиями.',
        aboutP3:
            'Мне важны вещи, которые пользователь чувствует, но редко замечает: доступность, локализация (16 языков и RTL в Libertex, 29 в Wargaming) и анимация. Живу в Белграде и говорю на английском, русском и сербском — на тех же трёх языках, что и этот сайт.',

        expHeading: 'Опыт',
        expPresent: 'н. в.',
        expIndRole: 'Независимый разработчик',
        expIndText:
            'Разрабатываю собственные продукты — WizardTuner и JobScraper. Подробнее о них в разделе «Проекты».',
        expWgRole: 'Fullstack-разработчик с фокусом на фронтенд',
        expWg1: 'Переписал Ангар World of Tanks 2.0, главный навигационный экран игры (главная страница, карусель техники, центральная кнопка техники): 5 800+ игроков онлайн одновременно (10 000+ в пике), 29 языков.',
        expWg2: 'Делал внутриигровой UI для live-ops и клановых событий к фиксированным датам запуска (Pet System, Holiday Ops 24/25 и 25/26, Strongholds Event, Clan Supply, турниры, Clan Winter Event): уведомления в реальном времени, живые таймеры и прогресс-бары, таблицы лидеров с фильтрацией, пагинацией, виртуализацией и раскрывающимися строками, анимации и мини-игры. Над каждым запуском работал с геймдизайнерами, UX/UI, бэкендом и QA.',
        expWg3: 'Писал эндпоинты на Django с логикой агрегации данных и проектировал контракты данных между бэкендом и фронтендом с учётом ограничений UI игрового клиента; изменения проходили код-ревью бэкенд-команды.',
        expWg4: 'Проводил код-ревью для команды из 5 фронтенд- и fullstack-разработчиков.',
        expLxRole: 'Фронтенд-разработчик',
        expLx1: 'Сделал торговую таблицу реального времени: цены 15–20 инструментов (акции, криптовалюта и др.) обновляются примерно каждую секунду без просадок рендеринга; таблица встроена виджетами в существующую CMS.',
        expLx2: 'Руководил анимациями и интерактивом в торговом интерфейсе и написал гайдлайны по анимации, которым следовали ещё 4 фронтенд-разработчика.',
        expLx3: 'Реализовал поддержку 16 языков, включая полную RTL-вёрстку для арабского, с отдельными URL для каждой локали, hreflang и локализованными мета-тегами. Участвовал в миграции с Drupal на headless Drupal + Nuxt: URL сохранили или перевели на 301-редиректы, сайт остался полностью проиндексирован, а ключевые лендинги прошли Core Web Vitals.',
        expFlRole: 'Фронтенд/fullstack-разработчик на фрилансе',
        expFl1: 'Выполнил 28 проектов на Upwork с рейтингом 4.9/5 и 100% Job Success: адаптивные сайты по макетам, анимации, браузерная лотерея с бэкендом и перенос с Flash на JavaScript.',
        expFl2: 'Подключил потоки данных в реальном времени от API нескольких бирж к агрегатору криптобирж.',
        expEdRole: 'Fullstack-инженер',
        expEd1: 'Отвечал за собственный движок построения графиков на платформе тестирования, которой пользуются школьные округа Аляски, — от рендеринга на клиенте до контрактов данных для автопроверки в реальном времени. Движок стабильно работал при непрерывном вводе во время живых тестов.',
        expEd2: 'Сделал интерактивные модули по геометрии (тригонометрия, координатная геометрия) для тестирования учеников.',
        expEarlyRole: 'Ранее',
        expEarly1:
            'Lloyd Hardy Enterprises: разработал и поддерживал собственную CMS на Laravel и MySQL (бэкенд, REST API, админка и клиентские страницы), а также интерактивные адаптивные фронтенд-модули.',
        expEarly2:
            'Tribefire: сделал основной интерфейс стриминговой платформы на Vue: реактивные компоненты для трансляций с живыми данными, оплату донатов через Stripe и уведомления о донатах в реальном времени.',

        skillsHeading: 'Навыки',
        skillsFrontend: 'Фронтенд',
        skillsBackend: 'Бэкенд и данные',
        skillsTooling: 'Инструменты и тестирование',
        skillsPractices: 'Подходы',
        skillsA11y: 'Доступность (WCAG)',
        skillsI18n: 'Интернационализация, включая RTL',
        skillsPerf: 'Производительность (Core Web Vitals)',
        skillsDesignSystems: 'Дизайн-системы и токены',
        skillsArchitecture: 'Архитектура фронтенда',
        skillsReview: 'Код-ревью и менторство',
        skillsAi: 'Разработка с ИИ-агентами (Claude Code)',
        skillsSecurity: 'Безопасность (CSP, OAuth2, JWT)',

        projectsHeading: 'Проекты',
        projWtStatus: 'В разработке',
        projWtText:
            'PWA для музыкантов: тюнер, метроном, драм-машина и игры для тренировки слуха. Звук с низкой задержкой обрабатывается в отдельном аудиопотоке.',
        projJsStatus: 'В разработке',
        projJsText: 'Агрегатор вакансий: собирает объявления с нескольких международных и сербских сайтов о работе, с фильтрами по ключевым словам, локации и формату работы.',

        contactTitle: 'Связаться со мной',
        contactClose: 'Закрыть',
        contactText: 'Или свяжитесь со мной напрямую:',
        contactEmail: 'Почта',
        contactFormRequired: 'Все поля обязательны.',
        contactFormName: 'Ваше имя',
        contactFormEmail: 'Ваш email',
        contactFormMessage: 'Сообщение',
        contactFormSend: 'Отправить',
        footerCv: 'CV (PDF, англ.)',
    },
    sr: {
        pageTitle: 'Maksim Kalinin — fullstack programer sa fokusom na frontend',
        skipLink: 'Preskoči na sadržaj',

        navHome: 'Početna',
        navAbout: 'O meni',
        navExperience: 'Iskustvo',
        navSkills: 'Veštine',
        navProjects: 'Projekti',
        navContact: 'Kontaktirajte me',
        navMenu: 'Meni',
        langLabel: 'Jezik:',

        heroEyebrow: 'Fullstack programer sa fokusom na frontend · Beograd',
        heroSubtitle:
            'Pravim interfejse sa mnogo podataka u realnom vremenu u React-u, Vue-u i TypeScript-u, kao i API-je i ugovore podataka iza njih.',
        heroCv: 'Preuzmi CV (EN)',
        heroEmail: 'Imejl',

        aboutHeading: 'O meni',
        aboutP1:
            'Ja sam fullstack programer sa fokusom na frontend i više od 7 godina iskustva u izradi produkcijskih veb-aplikacija za gejming, fintech i edtech. Moja osnova su React (Next.js), Vue (Nuxt) i TypeScript: interfejsi sa mnogo podataka i podacima u realnom vremenu, animacije, i18n (do 29 jezika, uključujući RTL), pristupačnost i performanse po Core Web Vitals metrikama.',
        aboutP2:
            'Na bekendu pravim API-je i ugovore podataka u Node.js-u (Express, NestJS), Python-u (Django) i PHP-u (Laravel). Funkcionalnosti vodim od početka do kraja, od modela podataka do interfejsa, i isporučujem ih za proizvode sa velikim saobraćajem u fiksnim rokovima. Tako sam u Wargaming-u radio na Hangaru u World of Tanks 2.0 i njegovim live-ops događajima.',
        aboutP3:
            'Stalo mi je do stvari koje korisnici osete, a retko primete: pristupačnost, lokalizacija (16 jezika i RTL u Libertex-u, 29 u Wargaming-u) i animacije. Živim u Beogradu i govorim engleski, ruski i srpski, upravo jezike na kojima je i ovaj sajt.',

        expHeading: 'Iskustvo',
        expPresent: 'danas',
        expIndRole: 'Samostalni programer',
        expIndText:
            'Razvijam sopstvene proizvode, WizardTuner i JobScraper. Više o njima u odeljku „Projekti“.',
        expWgRole: 'Fullstack programer sa fokusom na frontend',
        expWg1: 'Ponovo sam napravio Hangar u World of Tanks 2.0, glavni navigacioni ekran igre (glavna stranica, karusel vozila, centralno dugme vozila), koji koristi 5.800+ igrača istovremeno (10.000+ u vršnim trenucima) na 29 jezika.',
        expWg2: 'Pravio sam UI za događaje u igri za live-ops i klanske funkcionalnosti isporučene za fiksne datume lansiranja (Pet System, Holiday Ops 24/25 i 25/26, Strongholds Event, Clan Supply, turniri, Clan Winter Event): obaveštenja u realnom vremenu, tajmeri i trake napretka uživo, rang-liste sa filtriranjem, paginacijom, virtualizacijom i redovima koji se proširuju, animacije i mini-igre. Na svakom lansiranju radio sam sa gejm dizajnerima, UX/UI, bekend i QA timom.',
        expWg3: 'Pisao sam Django endpointe sa logikom agregacije podataka i definisao ugovore podataka između bekenda i frontenda u skladu sa ograničenjima UI-ja klijenta igre; izmene su prolazile code review bekend tima.',
        expWg4: 'Radio sam code review za tim od 5 frontend i fullstack programera.',
        expLxRole: 'Frontend programer',
        expLx1: 'Napravio sam trgovačku tabelu u realnom vremenu koja otprilike svake sekunde prikazuje cene 15–20 instrumenata (akcije, kriptovalute i drugo) bez usporavanja renderovanja, ugrađenu kao vidžeti u postojeći CMS.',
        expLx2: 'Vodio sam animacije i interakcije u trgovačkom interfejsu i napisao smernice za animaciju koje su pratila još 4 frontend programera.',
        expLx3: 'Implementirao sam podršku za 16 jezika, uključujući kompletan raspored zdesna nalevo za arapski, sa posebnim URL-ovima po lokalu, hreflang oznakama i lokalizovanim meta podacima. Učestvovao sam u migraciji sa Drupal-a na headless Drupal + Nuxt: URL-ovi su zadržani ili preusmereni sa 301, sajt je ostao potpuno indeksiran, a ključne odredišne stranice su prošle Core Web Vitals.',
        expFlRole: 'Frontend / fullstack programer, frilens',
        expFl1: 'Završio sam 28 projekata na Upwork-u sa ocenom 4,9/5 i 100% Job Success: responzivni sajtovi po dizajnu, animacije, lutrijska igra u pregledaču sa bekendom i migracija sa Flash-a na JavaScript.',
        expFl2: 'Integrisao sam podatke u realnom vremenu sa API-ja više berzi u agregator kripto berzi.',
        expEdRole: 'Fullstack inženjer',
        expEd1: 'Bio sam zadužen za sopstveni mehanizam za crtanje grafika na platformi za testiranje koju koriste školski okruzi širom Aljaske, od renderovanja na klijentu do ugovora podataka za automatsko ocenjivanje u realnom vremenu, i održavao ga stabilnim pod neprekidnim unosom tokom testova uživo.',
        expEd2: 'Napravio sam interaktivne module iz geometrije (trigonometrija, analitička geometrija) za testiranje učenika.',
        expEarlyRole: 'Ranije',
        expEarly1:
            'Lloyd Hardy Enterprises: razvio sam i održavao sopstveni CMS u Laravel-u i MySQL-u (bekend, REST API, administracija i stranice za klijente), kao i interaktivne, responzivne frontend module.',
        expEarly2:
            'Tribefire: napravio sam glavni interfejs platforme za striming u Vue-u, sa reaktivnim komponentama za prenos podataka uživo, plaćanjem donacija preko Stripe-a i obaveštenjima o donacijama u realnom vremenu.',

        skillsHeading: 'Veštine',
        skillsFrontend: 'Frontend',
        skillsBackend: 'Bekend i podaci',
        skillsTooling: 'Alati i testiranje',
        skillsPractices: 'Prakse',
        skillsA11y: 'Pristupačnost (WCAG)',
        skillsI18n: 'Internacionalizacija, uključujući RTL',
        skillsPerf: 'Performanse (Core Web Vitals)',
        skillsDesignSystems: 'Dizajn sistemi i tokeni',
        skillsArchitecture: 'Arhitektura frontenda',
        skillsReview: 'Code review i mentorstvo',
        skillsAi: 'Razvoj uz AI agente (Claude Code)',
        skillsSecurity: 'Bezbednost (CSP, OAuth2, JWT)',

        projectsHeading: 'Projekti',
        projWtStatus: 'U izradi',
        projWtText:
            'PWA za muzičare: štimer, metronom, ritam mašina i igre za vežbanje sluha. Zvuk sa malim kašnjenjem radi na posebnoj audio niti.',
        projJsStatus: 'U izradi',
        projJsText: 'Alat za agregaciju oglasa za posao koji prikuplja oglase sa više međunarodnih i srpskih sajtova za zapošljavanje, sa filterima po ključnim rečima, lokaciji i načinu rada.',

        contactTitle: 'Kontaktirajte me',
        contactClose: 'Zatvori',
        contactText: 'Ili me kontaktirajte direktno:',
        contactEmail: 'Imejl',
        contactFormRequired: 'Sva polja su obavezna.',
        contactFormName: 'Vaše ime',
        contactFormEmail: 'Vaš imejl',
        contactFormMessage: 'Poruka',
        contactFormSend: 'Pošalji',
        footerCv: 'CV (PDF, engl.)',
    },
}

/** Value for `<html lang>` and `hreflang`. The Serbian copy is written in Latin script. */
export const HTML_LANG: Record<Language, string> = { en: 'en', ru: 'ru', sr: 'sr-Latn' }

/** `og:locale` for link previews. */
export const OG_LOCALE: Record<Language, string> = { en: 'en_US', ru: 'ru_RU', sr: 'sr_RS' }

/** `<meta name="description">` and `og:description`. Head-only, so outside TEXT_KEYS. */
export const metaDescriptions: Record<Language, string> = {
    en: 'Frontend-focused fullstack developer with 7+ years building data-dense, real-time web apps in React, Vue and TypeScript for gaming, fintech and edtech, and the APIs behind them.',
    ru: 'Fullstack-разработчик с фокусом на фронтенд и опытом 7+ лет: веб-приложения с большим объёмом данных и данными в реальном времени на React, Vue и TypeScript для геймдева, финтеха и edtech, а также API для них.',
    sr: 'Fullstack programer sa fokusom na frontend i 7+ godina iskustva u izradi veb-aplikacija sa mnogo podataka u realnom vremenu u React-u, Vue-u i TypeScript-u za gejming, fintech i edtech, kao i API-ja iza njih.',
}

/** Contact form status messages, set at runtime by contactForm.ts. */
export const formStatusTexts: Record<Language, Record<FormStatus, string>> = {
    en: {
        sending: 'Sending…',
        success: 'Thanks! Your message has been sent.',
        error: 'Something went wrong. Please try again or email me directly.',
    },
    ru: {
        sending: 'Отправка…',
        success: 'Спасибо! Сообщение отправлено.',
        error: 'Что-то пошло не так. Попробуйте ещё раз или напишите мне на почту.',
    },
    sr: {
        sending: 'Slanje…',
        success: 'Hvala! Poruka je poslata.',
        error: 'Nešto nije u redu. Pokušajte ponovo ili mi pišite na imejl.',
    },
}
