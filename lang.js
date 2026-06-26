/**
 * Zenrise — language switcher + site-wide translation.
 *
 * Mark anything translatable in your HTML with one of:
 *   data-i18n="key"             — replaces textContent
 *   data-i18n-html="key"        — replaces innerHTML (for strings with markup)
 *   data-i18n-placeholder="key" — replaces an input's placeholder
 *   data-i18n-title="key"       — replaces document.title (on a meta element)
 *
 * Then add the matching key under each language in DICT below.
 *
 * Choice persists across pages via localStorage('zenrise-lang').
 */
(function () {
  var KEY = 'zenrise-lang';

  var DICT = {
    en: {
      // language switcher
      langLabel: 'english',
      english: 'English',
      japanese: '日本語',
      lang_menu_header: 'Language',

      // nav (shared)
      nav_home: 'home',
      nav_about: 'about us',
      nav_contact: 'contact',

      // footer (shared across pages)
      footer_tagline: 'Quiet, locally-led journeys through the lesser-known corners of Japan.',
      footer_visit: 'Office',
      footer_contact: 'Contact',
      footer_follow: 'Follow',
      footer_newsletter: 'Newsletter',
      footer_address: 'me-labo4, Sophiale Minamifujisawa #101<br/>10-11 Minamifujisawa, Fujisawa<br/>Kanagawa, 251-0055, Japan',
      footer_copyright: '© 2026 Intercommunicate K. K.',
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      footer_cookies: 'Cookies',
      footer_instagram: 'Instagram  →',
      footer_youtube: 'YouTube  →',
      footer_tiktok: 'TikTok  →',

      // home page
      home_title: 'Zenrise — Quiet journeys through Japan',
      home_hero_slide_1_meta: 'Meigetsuin, Hydrangea Season',
      home_hero_slide_2_meta: 'Kamakura, Coastline',
      home_hero_slide_3_meta: 'Coastal Railway, Dusk',
      home_hero_slide_4_meta: 'Tsurugaoka Hachimangu, Kamakura',
      home_hero_slide_5_meta: 'Great Buddha, Kamakura',
      home_hero_tag: 'Feature — 02',
      home_hero_num: '01',
      home_hero_title: 'Discover the<br/>hidden Japan.',
      home_hero_copy: 'From iconic highlights to the secret spots the guidebooks leave behind — personalized tours through local eyes, crafted just for you.',
      home_hero_more: 'Read more  →',
      home_find_title: 'Find your travel inspiration',
      home_dest_1_name: 'Shrines & Temples',
      home_dest_2_name: 'Cultural Experiences',
      home_dest_3_name: 'Local Food',
      home_dest_4_name: 'Hidden Views',
      home_dest_5_name: 'Everyday Local Life',
      home_dest_6_name: 'Get to Know Japan',
      home_dest_7_name: 'Travel Support',
      home_dest_8_name: 'Travel Concierge',

      // home — expanded category panels. Item lists are client content; leads on the
      // five list tiles (2,3,4,5,7) are drafted copy. Tile 8 is lead-only.
      home_dest_cta: 'Plan your journey&nbsp;&nbsp;→',
      home_dest_1_lead: 'Kamakura is home to over 100 temples and nearly 50 shrines. Many have stood here for more than 800 years, tracing back to the dawn of the Kamakura period.',
      home_dest_1_item_1: 'Tsurugaoka Hachimangu',
      home_dest_1_item_2: 'Hase-dera',
      home_dest_1_item_3: 'Kotoku-in (Great Buddha)',
      home_dest_1_item_4: 'Meigetsuin',
      home_dest_1_item_5: 'Enoshima Shrine',
      home_dest_2_lead: 'Step inside the rituals that shape daily life — slow, hands-on, and led by local practitioners.',
      home_dest_2_item_1: 'Zen Meditation',
      home_dest_2_item_2: 'Tea House',
      home_dest_2_item_3: 'Soba Making',
      home_dest_2_item_4: 'Pottery',
      home_dest_2_item_5: 'Sutra Copying',
      home_dest_3_lead: 'Eat the way locals do — from hand-cut noodles to the easy clatter of an evening izakaya.',
      home_dest_3_item_1: 'Soba',
      home_dest_3_item_2: 'Udon',
      home_dest_3_item_3: 'Ramen',
      home_dest_3_item_4: 'Izakaya',
      home_dest_3_item_5: 'Teishoku',
      home_dest_4_lead: 'Mountains, ocean, and the quiet corners worth the detour — the views the guidebooks skip.',
      home_dest_4_item_1: 'Mt. Fuji',
      home_dest_4_item_2: 'The Ocean',
      home_dest_4_item_3: 'Nature',
      home_dest_4_item_4: 'Photogenic Spots',
      home_dest_5_lead: 'Spend a few hours in the rhythm of the neighbourhood, where nothing is staged for visitors.',
      home_dest_5_item_1: 'Cafés',
      home_dest_5_item_2: 'Back Alleys',
      home_dest_5_item_3: 'Local Lifestyle',
      home_dest_5_item_4: 'Farmers Market',
      home_dest_5_item_5: 'Local Eats',
      home_dest_6_lead: 'The culture, customs, and daily rhythms that give Japan its depth.',
      home_dest_6_item_1: 'Culture',
      home_dest_6_item_2: 'Traditions',
      home_dest_6_item_3: 'Daily Life',
      home_dest_7_lead: 'The logistics handled quietly in the background, so the trip stays yours to enjoy.',
      home_dest_7_item_1: 'Transport',
      home_dest_7_item_2: 'Stays',
      home_dest_7_item_3: 'Tickets',
      home_dest_7_item_4: 'Wi-Fi & eSIM',
      home_dest_7_item_5: 'Luggage Storage',
      home_dest_8_lead: 'Feel free to ask us anything — no question is too small.',
      home_dest_8_item_1: 'Restaurant Reservations',
      home_dest_8_item_2: 'Personal Recommendations',
      home_dest_8_item_3: 'Special Requests',
      home_dest_8_item_4: 'On-Trip Support',

      // about page
      about_title: 'About — Zenrise',
      about_eyebrow: 'About us',
      about_h1: 'About<br/>Zenrise.',
      about_intro_1: 'We are a travel agency based in Kamakura, Fujisawa, and Yokohama. We design thoughtful, locally-led journeys through the lesser-known corners of the Kamakura area.',
      about_intro_2: 'Founded in 2024, we\'re on a journey to discover and share the hidden gems of Japan — the quiet, beautiful places that travellers usually miss.',
      about_hero_credit: 'Hase-dera Gate, Kamakura',
      about_hero_meta_left: 'Photograph — Akari Usuda, 2024',
      about_hero_meta_1: '35mm',
      about_hero_meta_2: 'Natural light',
      about_hero_meta_3: '06:42 JST',
      // company profile
      about_cp_label: 'Company Profile',
      about_cp_h2: 'Company Profile.',
      about_cp_name: 'Company Name',
      about_cp_name_v: 'Intercommunicate K. K.',
      about_cp_founded: 'Founded',
      about_cp_founded_v: 'April 2024',
      about_cp_reps: 'Representatives',
      about_cp_reps_v: 'Akari Usuda',
      about_cp_address: 'Address',
      about_cp_address_v: 'me-labo4, Sophiale Minamifujisawa #101<br/>10-11 Minamifujisawa, Fujisawa<br/>Kanagawa, 251-0055, Japan',
      about_cp_business: 'Business',
      about_cp_business_v: 'Curation &amp; operation of original tours across the Kamakura, Fujisawa &amp; Yokohama areas.<br/>Curation &amp; operation of bespoke, private tours.',
      about_cp_contact: 'Contact',
      about_cp_contact_v: 'hello@zenrise.jp',
      about_cp_license: 'Travel Agency License',
      about_cp_license_v: 'Registered Travel Agent, Kanagawa Prefecture No. 1314',
      about_cp_bank: 'Certified Domestic Travel Services Manager',
      about_cp_bank_v: 'Kentaro Usuda',

      // contact page
      contact_title: 'Contact — Zenrise',
      // letterhead hero
      contact_hero_eyebrow: 'Contact',
      contact_hero_no: '05',
      contact_hero_credit: 'Mt. Fuji, Shonan Coast',
      contact_hero_email: 'Email',
      contact_hero_visit: 'Office',
      contact_hero_visit_v: 'me-labo4, Sophiale Minamifujisawa #101<br/>10-11 Minamifujisawa, Fujisawa<br/>Kanagawa, 251-0055, Japan',
      // display hero (alt)
      // booking intro
      contact_bi_title: 'Plan<br/>your trip.',

      // booking flow — sidebar
      booking_progress_title: 'Booking',
      booking_step1_lbl: 'Where',
      booking_step2_lbl: 'How long',
      booking_step3_lbl: 'When &amp; who',
      booking_step4_lbl: 'About you',
      booking_step5_lbl: 'Review &amp; send',
      booking_quick_h: 'Or talk to us directly',
      booking_quick_p: 'Sometimes a form is too much. Email or call — we usually pick up.',
      booking_quick_email_l: 'Email',
      booking_quick_tel_l: 'Tel',
      booking_btn_back: 'Back',
      booking_btn_continue: 'Continue',
      booking_btn_send: 'Send to Zenrise',

      // booking step 1: region
      booking_s1_meta: 'Step 01 / 05',
      booking_s1_h: 'Where would you<br/>like to go?',
      booking_s1_lede: 'Pick one or more. We can string two towns together on a full-day route, or stay in one all morning.',
      booking_s1_kamakura_sub: 'Temples · Tea · Kilns',
      booking_s1_enoshima_sub: 'Coast · Caves · Seafood',
      booking_s1_fujisawa_sub: 'Tokyo · Mt. Fuji · Hakone',
      booking_s1_yokohama_sub: 'Port · Chinatown · Lights',
      booking_s1_count_suffix: 'selected',

      // booking step 2: length
      booking_s2_meta: 'Step 02 / 05',
      booking_s2_sub: 'Tour length',
      booking_s2_h: 'Half day or full?',
      booking_s2_lede: 'Half-days run roughly 09:00–13:00. Full-days end with a late lunch or a harbourside visit around 17:00.',
      booking_s2_half: 'Half day',
      booking_s2_full: 'Full day',
      booking_s2_half_p: 'One town, one neighbourhood. A long morning of exploring, one workshop or tea stop, and a quiet lunch.',
      booking_s2_full_p: 'Two towns linked by local train. A morning exploring, lunch with the day\u2019s host, an afternoon stop.',
      booking_s2_half_t: '≈ 4 hrs',
      booking_s2_full_t: '≈ 8 hrs',
      booking_s2_half_price: '¥18,000 / pers.',
      booking_s2_full_price: '¥32,000 / pers.',
      booking_s2_opt1: 'Option 01',
      booking_s2_opt2: 'Option 02',

      // booking step 3: when + who
      booking_s3_meta: 'Step 03 / 05',
      booking_s3_sub: 'Dates &amp; party',
      booking_s3_h: 'When, and how<br/>many of you?',
      booking_s3_lede: 'A rough window is fine — we\u2019ll come back with two or three open dates near it.',
      booking_s3_date_from: 'Earliest date',
      booking_s3_date_to: 'Latest date',
      booking_s3_party: 'Group size',
      booking_s3_party_unit: 'travelers',
      booking_s3_party_hint: 'We like to keep groups intimate. Most are two to four, and six at most.',
      booking_s3_exp: 'Is this your first visit to Japan?',
      booking_s3_exp_first: 'First time',
      booking_s3_exp_few: 'Been a few times',
      booking_s3_exp_many: 'Many times',
      booking_s3_exp_local: 'I live in Japan',

      // booking step 4: about you
      booking_s4_meta: 'Step 04 / 05',
      booking_s4_sub: 'Just the basics',
      booking_s4_h: 'And a little<br/>about you.',
      booking_s4_lede: 'Just enough so we can reply — and so we know how to plan around dietary needs or mobility.',
      booking_s4_name: 'Your name',
      booking_s4_name_p: 'First & last',
      booking_s4_email: 'Email',
      booking_s4_email_p: 'name@example.com',
      booking_s4_from: 'Where you\u2019re traveling from',
      booking_s4_from_p: 'City, country',
      booking_s4_interests: 'What pulls you in',
      booking_s4_int_tea: 'Tea ceremony',
      booking_s4_int_ceramics: 'Ceramics',
      booking_s4_int_food: 'Food',
      booking_s4_int_history: 'History',
      booking_s4_int_photo: 'Photography',
      booking_s4_int_coast: 'Coastline',
      booking_s4_int_temples: 'Quiet temples',
      booking_s4_int_crafts: 'Crafts',
      booking_s4_int_zen: 'Zen meditation',
      booking_s4_int_nature: 'Nature',
      booking_s4_int_local: 'Local life',
      booking_s4_int_cafes: 'Cafés',
      booking_s4_int_gardens: 'Gardens',
      booking_s4_int_markets: 'Markets',
      booking_s4_int_calligraphy: 'Calligraphy',
      booking_s4_notes: 'Anything else we should know?',
      booking_s4_notes_p: 'Dietary needs, mobility, a specific date or experience you have in mind, who you\u2019re traveling with…',

      // booking step 5: review
      booking_s5_meta: 'Step 05 / 05',
      booking_s5_sub: 'Last look',
      booking_s5_h: 'Sound right?',
      booking_s5_lede: 'A quick look over what you\u2019ll send us. You can still go back and change anything — or we\u2019ll figure it out in the reply.',
      booking_s5_consent: 'I\u2019m happy for Zenrise to email me about the trip and any follow-up — nothing else, no list, no marketing. <a href="#" style="text-decoration: underline">Privacy</a>.',
      booking_summary_town: 'Town(s)',
      booking_summary_length: 'Length',
      booking_summary_dates: 'Dates',
      booking_summary_party: 'Group size',
      booking_summary_exp: 'Japan',
      booking_summary_name: 'Name',
      booking_summary_email: 'Email',
      booking_summary_from: 'From',
      booking_summary_interests: 'Interests',
      booking_summary_notes: 'Notes',
      booking_summary_edit: 'edit',
      booking_summary_em: '—',
      booking_summary_traveler: 'traveler',
      booking_summary_travelers: 'travelers',
      booking_summary_dates_flex: 'Flexible — talk to us',

      // booking sent
      booking_sent_n: 'Sent — thank you',
      booking_sent_h: 'That\u2019s with us.',
      booking_sent_p1: 'One of us — usually whoever\u2019s not on a tour that morning — will write back within two working days with two or three itinerary sketches that fit your dates.',
      booking_sent_p2: 'If you don\u2019t hear from us by the third day, it almost certainly means an email got lost. Just call.',
      booking_sent_ref: 'Your reference',
      booking_sent_back_home: 'Back to homepage  →',
      booking_sent_back_about: 'Read more about us  →'
    },

    ja: {
      // language switcher
      langLabel: '日本語',
      english: 'English',
      japanese: '日本語',
      lang_menu_header: '言語',

      // nav
      nav_home: 'ホーム',
      nav_about: '私たちについて',
      nav_contact: 'お問い合わせ',

      // footer
      footer_tagline: '日本の知られざる場所を巡る、静かな旅',
      footer_visit: 'オフィス',
      footer_contact: '連絡先',
      footer_follow: 'フォロー',
      footer_newsletter: 'ニュースレター',
      footer_address: '〒251-0055<br/>神奈川県藤沢市南藤沢 10-11<br/>Sophiale Minamifujisawa #101 me-labo4',
      footer_copyright: '© 2026 株式会社インターコミュニケート',
      footer_privacy: 'プライバシー',
      footer_terms: '利用規約',
      footer_cookies: 'Cookie',
      footer_instagram: 'Instagram  →',
      footer_youtube: 'YouTube  →',
      footer_tiktok: 'TikTok  →',

      // home
      home_title: 'Zenrise — 日本の静かな旅',
      home_hero_slide_1_meta: '明月院、紫陽花の季節',
      home_hero_slide_2_meta: '鎌倉、海辺',
      home_hero_slide_3_meta: '海沿いの線路、夕暮れ',
      home_hero_slide_4_meta: '鶴岡八幡宮、鎌倉',
      home_hero_slide_5_meta: '鎌倉大仏',
      home_hero_tag: '特集 — 02',
      home_hero_num: '01',
      home_hero_title: '知られざる日本へ。',
      home_hero_copy: '人気の観光地から、ガイドブックには載っていない穴場まで。地元民の目線であなただけの特別な体験を。',
      home_hero_more: '続きを読む  →',
      home_find_title: '旅の目的を探す',
      home_dest_1_name: '神社仏閣',
      home_dest_2_name: '文化体験',
      home_dest_3_name: 'グルメ',
      home_dest_4_name: '絶景',
      home_dest_5_name: 'ローカルな日常',
      home_dest_6_name: '日本を知る',
      home_dest_7_name: '旅のサポート',
      home_dest_8_name: '旅の相談窓口',

      // home — expanded category panels. Item lists are client content; leads on the
      // five list tiles (2,3,4,5,7) are drafted copy. Tile 8 is lead-only.
      home_dest_cta: '旅を計画する&nbsp;&nbsp;→',
      home_dest_1_lead: '鎌倉には、100を超える寺院と、50近くの神社が息づいています。その多くは鎌倉時代の黎明期から、800年以上の時をこの地で静かに刻み続けています。',
      home_dest_1_item_1: '鶴岡八幡宮',
      home_dest_1_item_2: '長谷寺',
      home_dest_1_item_3: '高徳院（鎌倉大仏）',
      home_dest_1_item_4: '明月院',
      home_dest_1_item_5: '江島神社',
      home_dest_2_lead: '暮らしを形づくる作法の内側へ。地元の担い手が導く、ゆっくりとした手仕事の時間。',
      home_dest_2_item_1: '坐禅',
      home_dest_2_item_2: 'お茶屋',
      home_dest_2_item_3: '蕎麦打ち',
      home_dest_2_item_4: '陶芸',
      home_dest_2_item_5: '写経',
      home_dest_3_lead: '手打ちの麺から、夜の居酒屋のにぎわいまで。地元の人の食べ方で味わう。',
      home_dest_3_item_1: '蕎麦',
      home_dest_3_item_2: 'うどん',
      home_dest_3_item_3: 'ラーメン',
      home_dest_3_item_4: '居酒屋',
      home_dest_3_item_5: '定食',
      home_dest_4_lead: '山に海、そして寄り道する価値のある静かな場所。ガイドブックが飛ばしていく景色。',
      home_dest_4_item_1: '富士山',
      home_dest_4_item_2: '海',
      home_dest_4_item_3: '自然',
      home_dest_4_item_4: 'SNS映え',
      home_dest_5_lead: '訪問者のために用意されたものは何もない、街そのもののリズムの中で過ごす数時間。',
      home_dest_5_item_1: 'カフェ',
      home_dest_5_item_2: '裏路地',
      home_dest_5_item_3: '地元民の日常',
      home_dest_5_item_4: '朝市',
      home_dest_5_item_5: '地元の味',
      home_dest_6_lead: '日本に深みを与える、文化と習慣、そして日々の営み。',
      home_dest_6_item_1: '文化',
      home_dest_6_item_2: '習慣、伝統',
      home_dest_6_item_3: '生活',
      home_dest_7_lead: '段取りは静かに背景で。旅はそのまま、あなたが楽しむためのものに。',
      home_dest_7_item_1: '交通サポート',
      home_dest_7_item_2: '宿泊',
      home_dest_7_item_3: 'チケット',
      home_dest_7_item_4: 'Wi-Fi・eSIM',
      home_dest_7_item_5: '荷物預かり',
      home_dest_8_lead: 'どんな小さなことでも、どうぞお気軽にご相談ください。',
      home_dest_8_item_1: 'レストラン予約',
      home_dest_8_item_2: 'おすすめのご提案',
      home_dest_8_item_3: '特別なご要望',
      home_dest_8_item_4: '滞在中のサポート',

      // about page
      about_title: '私たちについて — Zenrise',
      about_eyebrow: '私たちについて',
      about_h1: 'Zenrise<br/>について。',
      about_intro_1: '鎌倉・藤沢・横浜を拠点とする旅行会社です。鎌倉エリアを中心に、地元目線であなただけの特別な体験を企画しています。',
      about_intro_2: '2024年設立。私たちは今、日本の隠れた名所を発見し、分かち合う旅の途中です — 旅人がいつも見逃してしまう、静かで美しい場所を。',
      about_hero_credit: '長谷寺 山門、鎌倉',
      about_hero_meta_left: '撮影 — 臼田　亜香麗、2024年',
      about_hero_meta_1: '35mm',
      about_hero_meta_2: '自然光',
      about_hero_meta_3: '06:42 JST',
      // company profile
      about_cp_label: '会社概要',
      about_cp_h2: '会社概要。',
      about_cp_name: '会社名',
      about_cp_name_v: '株式会社インターコミュニケート',
      about_cp_founded: '設立',
      about_cp_founded_v: '2024年4月',
      about_cp_reps: '代表者',
      about_cp_reps_v: '臼田　亜香麗',
      about_cp_address: '所在地',
      about_cp_address_v: '〒251-0055<br/>神奈川県藤沢市南藤沢 10-11<br/>Sophiale Minamifujisawa #101 me-labo4',
      about_cp_business: '事業内容',
      about_cp_business_v: '鎌倉・藤沢・横浜エリアにおける自社ツアーの企画・運営。<br/>オーダーメイドプライベートツアーの企画・運営。',
      about_cp_contact: '連絡先',
      about_cp_contact_v: 'hello@zenrise.jp',
      about_cp_license: '旅行業登録',
      about_cp_license_v: '神奈川県知事登録旅行業 地域-第1314号',
      about_cp_bank: '国内旅行業務取扱管理者',
      about_cp_bank_v: '臼田　健太郎',

      // contact page
      contact_title: 'お問い合わせ — Zenrise',
      contact_hero_eyebrow: 'お問い合わせ',
      contact_hero_no: '05',
      contact_hero_credit: '富士山、湘南海岸',
      contact_hero_email: 'メール',
      contact_hero_visit: 'オフィス',
      contact_hero_visit_v: '〒251-0055<br/>神奈川県藤沢市南藤沢 10-11<br/>Sophiale Minamifujisawa #101 me-labo4',
      contact_bi_title: '旅を<br/>計画する。',

      // booking flow — sidebar
      booking_progress_title: 'ご予約',
      booking_step1_lbl: '行き先',
      booking_step2_lbl: '所要時間',
      booking_step3_lbl: '日時と人数',
      booking_step4_lbl: 'お客様について',
      booking_step5_lbl: '確認 &amp; 送信',
      booking_quick_h: '直接ご連絡もどうぞ',
      booking_quick_p: 'フォームが煩わしいときは、メールかお電話を。だいたい出ます。',
      booking_quick_email_l: 'メール',
      booking_quick_tel_l: '電話',
      booking_btn_back: '戻る',
      booking_btn_continue: '次へ',
      booking_btn_send: 'Zenrise に送る',

      // booking step 1
      booking_s1_meta: 'ステップ 01 / 05',
      booking_s1_h: 'どこを訪れて<br/>みたいですか？',
      booking_s1_lede: '一つでも、複数でも構いません。一日のルートで二つの町をつなぐことも、一つの町で朝のあいだ過ごすこともできます。',
      booking_s1_kamakura_sub: '寺 · 茶 · 窯',
      booking_s1_enoshima_sub: '海岸 · 洞窟 · 海の幸',
      booking_s1_fujisawa_sub: '東京 · 富士山 · 箱根',
      booking_s1_yokohama_sub: '港 · 中華街 · 夜景',
      booking_s1_count_suffix: '選択中',

      // booking step 2
      booking_s2_meta: 'ステップ 02 / 05',
      booking_s2_sub: 'ツアーの長さ',
      booking_s2_h: '半日? 一日?',
      booking_s2_lede: '半日はおおむね 09:00〜13:00。一日は遅めの昼食または港への立ち寄りで、17:00 ごろに終わります。',
      booking_s2_half: '半日',
      booking_s2_full: '一日',
      booking_s2_half_p: '一つの町、一つの地区。ゆっくりとした朝のひととき、一つの工房または茶の時間、そして静かな昼食。',
      booking_s2_full_p: '二つの町を地元の電車でつなぎます。朝のひととき、その日の案内人との昼食、午後の立ち寄り先。',
      booking_s2_half_t: '約 4 時間',
      booking_s2_full_t: '約 8 時間',
      booking_s2_half_price: '¥18,000 / 人',
      booking_s2_full_price: '¥32,000 / 人',
      booking_s2_opt1: 'オプション 01',
      booking_s2_opt2: 'オプション 02',

      // booking step 3
      booking_s3_meta: 'ステップ 03 / 05',
      booking_s3_sub: '日時と人数',
      booking_s3_h: 'いつ、何人で<br/>来られますか?',
      booking_s3_lede: 'おおよその期間で構いません — その近辺で空いている候補日を二、三日お返しします。',
      booking_s3_date_from: '最も早い日',
      booking_s3_date_to: '最も遅い日',
      booking_s3_party: '人数',
      booking_s3_party_unit: '名',
      booking_s3_party_hint: '少人数を大切にしています。多くは二〜四名さま、最大でも六名さままで。',
      booking_s3_exp: '日本は初めてですか?',
      booking_s3_exp_first: '初めて',
      booking_s3_exp_few: '数回ある',
      booking_s3_exp_many: '何度もある',
      booking_s3_exp_local: '日本に住んでいる',

      // booking step 4
      booking_s4_meta: 'ステップ 04 / 05',
      booking_s4_sub: '基本情報',
      booking_s4_h: 'お客様のことを<br/>少し教えてください。',
      booking_s4_lede: 'お返事を差し上げるために、また食事制限や移動についてご相談するために必要なことだけ。',
      booking_s4_name: 'お名前',
      booking_s4_name_p: '姓 名',
      booking_s4_email: 'メール',
      booking_s4_email_p: 'name@example.com',
      booking_s4_from: 'どちらから来られますか',
      booking_s4_from_p: '都市、国',
      booking_s4_interests: '惹かれるものは',
      booking_s4_int_tea: '茶の湯',
      booking_s4_int_ceramics: '陶芸',
      booking_s4_int_food: '食',
      booking_s4_int_history: '歴史',
      booking_s4_int_photo: '写真',
      booking_s4_int_coast: '海沿い',
      booking_s4_int_temples: '静かな寺',
      booking_s4_int_crafts: '手仕事',
      booking_s4_int_zen: '坐禅',
      booking_s4_int_nature: '自然',
      booking_s4_int_local: '地元の暮らし',
      booking_s4_int_cafes: 'カフェ',
      booking_s4_int_gardens: '庭園',
      booking_s4_int_markets: '朝市',
      booking_s4_int_calligraphy: '書道',
      booking_s4_notes: 'その他、お知らせいただくことは?',
      booking_s4_notes_p: '食事制限、移動のご都合、特にご希望の日付や体験、ご同行者など…',

      // booking step 5
      booking_s5_meta: 'ステップ 05 / 05',
      booking_s5_sub: '最終確認',
      booking_s5_h: 'こちらでよろしいですか?',
      booking_s5_lede: '送信する内容を最後にご確認ください。戻って変更することもできますし、お返事の中で調整することもできます。',
      booking_s5_consent: 'Zenrise から旅行とその後のやり取りに関するメールを受け取ることに同意します — それ以外の販促や配信リストは一切ありません。<a href="#" style="text-decoration: underline">プライバシー</a>。',
      booking_summary_town: '町',
      booking_summary_length: '長さ',
      booking_summary_dates: '日付',
      booking_summary_party: '人数',
      booking_summary_exp: '日本での経験',
      booking_summary_name: 'お名前',
      booking_summary_email: 'メール',
      booking_summary_from: '出発地',
      booking_summary_interests: 'ご興味',
      booking_summary_notes: '備考',
      booking_summary_edit: '編集',
      booking_summary_em: '—',
      booking_summary_traveler: '名',
      booking_summary_travelers: '名',
      booking_summary_dates_flex: 'お任せ — ご相談ください',

      // booking sent
      booking_sent_n: '送信完了 — ありがとうございます',
      booking_sent_h: '承りました。',
      booking_sent_p1: '私たちのどちらか — その朝ツアーに出ていない方 — が、二営業日以内に、ご希望の日付に合う二、三の行程案をお送りします。',
      booking_sent_p2: '三日経ってもご連絡がない場合は、ほぼ間違いなくメールが届いていません。お電話ください。',
      booking_sent_ref: '受付番号',
      booking_sent_back_home: 'ホームへ戻る  →',
      booking_sent_back_about: '私たちについてもっと読む  →'
    }
  };

  // expose for use by page scripts (e.g. dynamically rendered text)
  window.ZenriseI18n = {
    get: function () { return getLang(); },
    t: function (key) {
      var d = DICT[getLang()] || DICT.en;
      return d[key] != null ? d[key] : (DICT.en[key] != null ? DICT.en[key] : key);
    },
    onChange: function (cb) { listeners.push(cb); }
  };

  var listeners = [];

  function getLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch (e) { return 'en'; }
  }
  function setLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply(l);
    listeners.forEach(function (cb) { try { cb(l); } catch (e) {} });
  }

  function apply(lang) {
    var d = DICT[lang] || DICT.en;
    var fb = DICT.en;

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var v = d[key] != null ? d[key] : fb[key];
      if (v != null) el.textContent = v;
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var v = d[key] != null ? d[key] : fb[key];
      if (v != null) el.innerHTML = v;
    });
    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var v = d[key] != null ? d[key] : fb[key];
      if (v != null) el.setAttribute('placeholder', v);
    });
    // title
    var t = document.querySelector('meta[data-i18n-title]');
    if (t) {
      var key = t.getAttribute('data-i18n-title');
      var v = d[key] != null ? d[key] : fb[key];
      if (v != null) document.title = v;
    }

    document.documentElement.setAttribute('lang', lang === 'ja' ? 'ja' : 'en');

    var trig = document.querySelector('[data-lang-trigger] .lbl');
    if (trig) trig.textContent = d.langLabel;
    document.querySelectorAll('[data-lang-option]').forEach(function (o) {
      o.classList.toggle('on', o.getAttribute('data-lang-option') === lang);
    });
  }

  function injectStyles() {
    if (document.getElementById('zenrise-lang-style')) return;
    var s = document.createElement('style');
    s.id = 'zenrise-lang-style';
    s.textContent = [
      // wrapper + trigger
      '.lang-switcher { position: relative; justify-self: end; }',
      '.lang-trigger { background: none; border: none; padding: 0; font: inherit; font-size: 22px; color: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; letter-spacing: 0.01em; }',
      '.lang-trigger:hover { opacity: 0.7; }',
      '.lang-trigger .arrow { display: inline-grid; place-items: center; width: 16px; height: 16px; font-size: 12px; transition: transform 220ms cubic-bezier(.2,.6,.2,1); color: rgba(41,65,56,0.55); }',
      '.lang-switcher.open .lang-trigger .arrow { transform: rotate(180deg); color: #294138; }',
      // menu panel — cream, sharp corners, hairline border
      '.lang-menu { position: absolute; right: 0; top: calc(100% + 14px); background: #F7F4EA; border: 1px solid rgba(41,65,56,0.14); min-width: 240px; padding: 0; box-shadow: 0 24px 48px -8px rgba(41,65,56,0.18), 0 2px 6px rgba(41,65,56,0.04); opacity: 0; transform: translateY(-6px); pointer-events: none; transition: opacity 220ms cubic-bezier(.2,.6,.2,1), transform 220ms cubic-bezier(.2,.6,.2,1); z-index: 1000; border-radius: 0; }',
      '.lang-switcher.open .lang-menu { opacity: 1; transform: none; pointer-events: auto; }',
      // small mono header inside menu
      '.lang-menu-h { display: block; padding: 16px 22px 12px; font-family: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(41,65,56,0.55); border-bottom: 1px solid rgba(41,65,56,0.08); }',
      // each language option — two-column: code + name
      '.lang-menu button { display: grid; grid-template-columns: 48px 1fr 18px; align-items: baseline; column-gap: 12px; width: 100%; text-align: left; background: none; border: none; padding: 18px 22px; cursor: pointer; border-bottom: 1px solid rgba(41,65,56,0.06); transition: background 160ms ease; border-radius: 0; }',
      '.lang-menu button:last-child { border-bottom: none; }',
      '.lang-menu button:hover { background: rgba(41,65,56,0.04); }',
      '.lang-menu .code { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(41,65,56,0.5); }',
      '.lang-menu .name { font-family: "Optima Nova LT Pro","Optima",serif; font-size: 24px; color: #294138; letter-spacing: -0.005em; line-height: 1; }',
      '.lang-menu button.on .code { color: rgba(41,65,56,0.85); }',
      '.lang-menu button.on::after { content: ""; width: 6px; height: 6px; background: #294138; align-self: center; justify-self: end; }',
      // ── mobile hamburger nav (shared, phone widths only) ──
      '.nav-burger, .mobile-nav { display: none; }',
      '@media (max-width: 599px) {',
      '  .nav { position: relative; }',
      '  .navlinks { display: none !important; }',
      '  .lang-switcher { display: none !important; }',
      '  .nav-burger { display: flex; flex-direction: column; justify-content: center; gap: 6px; position: absolute; right: 20px; top: 0; bottom: 0; margin: auto 0; width: 30px; height: 22px; background: none; border: none; padding: 0; cursor: pointer; z-index: 5; }',
      '  .nav-burger span { display: block; height: 2px; width: 100%; background: #294138; }',
      '  .mobile-nav { display: flex; flex-direction: column; position: fixed; inset: 0; z-index: 1200; background: #F7F4EA; padding: 20px 28px 40px; opacity: 0; pointer-events: none; transition: opacity 240ms ease; }',
      '  html.menu-open { overflow: hidden; }',
      '  html.menu-open .mobile-nav { opacity: 1; pointer-events: auto; }',
      '  .mobile-nav-close { align-self: flex-end; background: none; border: none; font-size: 26px; line-height: 1; color: #294138; cursor: pointer; padding: 4px; }',
      '  .mobile-nav-links { display: flex; flex-direction: column; gap: 6px; margin-top: 10vh; }',
      '  .mobile-nav-links a { font-family: "optima-nova-lt-pro","Optima",serif; font-size: 40px; line-height: 1.25; color: #294138; text-decoration: none; }',
      '  .mobile-nav-links a.active { opacity: 0.4; }',
      '  .mobile-nav-lang { margin-top: auto; border-top: 1px solid rgba(41,65,56,0.14); padding-top: 22px; }',
      '  .mobile-nav-lang .mnl-h { display: block; font-family: "JetBrains Mono",ui-monospace,monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(41,65,56,0.55); margin-bottom: 14px; }',
      '  .mobile-nav-lang button { display: inline-flex; align-items: baseline; gap: 10px; background: none; border: none; padding: 6px 0; margin-right: 32px; cursor: pointer; }',
      '  .mobile-nav-lang button .code { font-family: "JetBrains Mono",ui-monospace,monospace; font-size: 10px; letter-spacing: 0.24em; color: rgba(41,65,56,0.5); }',
      '  .mobile-nav-lang button .name { font-family: "optima-nova-lt-pro","Optima",serif; font-size: 22px; color: #294138; }',
      '  .mobile-nav-lang button.on .name { text-decoration: underline; text-underline-offset: 4px; }',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();

    var orig = document.querySelector('a.lang');
    if (orig) {
      var wrapper = document.createElement('div');
      wrapper.className = 'lang-switcher';
      wrapper.innerHTML =
        '<button class="lang-trigger" type="button" data-lang-trigger aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="lbl">english</span><span class="arrow">▾</span>' +
        '</button>' +
        '<div class="lang-menu" role="listbox">' +
          '<span class="lang-menu-h" data-i18n="lang_menu_header">Language</span>' +
          '<button type="button" data-lang-option="en">' +
            '<span class="code">EN</span>' +
            '<span class="name">English</span>' +
          '</button>' +
          '<button type="button" data-lang-option="ja">' +
            '<span class="code">JP</span>' +
            '<span class="name">日本語</span>' +
          '</button>' +
        '</div>';
      orig.parentNode.replaceChild(wrapper, orig);

      var trigger = wrapper.querySelector('[data-lang-trigger]');
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = wrapper.classList.toggle('open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      wrapper.querySelectorAll('[data-lang-option]').forEach(function (opt) {
        opt.addEventListener('click', function (e) {
          e.stopPropagation();
          setLang(opt.getAttribute('data-lang-option'));
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('click', function () {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // ── Mobile hamburger nav (shared across pages) ──
    var navEl = document.querySelector('.nav');
    var navLinksEl = navEl && navEl.querySelector('.navlinks');
    if (navEl && navLinksEl) {
      var burger = document.createElement('button');
      burger.className = 'nav-burger';
      burger.type = 'button';
      burger.setAttribute('aria-label', 'Open menu');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<span></span><span></span><span></span>';
      navEl.appendChild(burger);

      var menu = document.createElement('div');
      menu.className = 'mobile-nav';
      menu.innerHTML =
        '<button class="mobile-nav-close" type="button" aria-label="Close">✕</button>' +
        '<nav class="mobile-nav-links">' + navLinksEl.innerHTML + '</nav>' +
        '<div class="mobile-nav-lang">' +
          '<span class="mnl-h" data-i18n="lang_menu_header">Language</span>' +
          '<button type="button" data-lang-option="en"><span class="code">EN</span><span class="name">English</span></button>' +
          '<button type="button" data-lang-option="ja"><span class="code">JP</span><span class="name">日本語</span></button>' +
        '</div>';
      document.body.appendChild(menu);

      function closeMenu() {
        document.documentElement.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      }
      burger.addEventListener('click', function () {
        document.documentElement.classList.add('menu-open');
        burger.setAttribute('aria-expanded', 'true');
      });
      menu.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
      menu.querySelectorAll('.mobile-nav-links a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
      menu.querySelectorAll('[data-lang-option]').forEach(function (opt) {
        opt.addEventListener('click', function () {
          setLang(opt.getAttribute('data-lang-option'));
          closeMenu();
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }

    apply(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
