import type { Location, Post, Service, SiteSettings, TeamMember } from "./types";

// 初始內容：網站尚未連接資料庫時使用，也可在後台一鍵匯入資料庫。
// 文案已依衛福部醫療廣告用字規範撰寫，修改時請留意後台的用字提醒。

export const seedSettings: SiteSettings = {
  hero_eyebrow: "全齡護甲中心 & 美甲｜Nails & Health",
  hero_title: "從寶寶到長輩，\n每一片指甲都值得被好好照顧",
  hero_subtitle:
    "德國與日本技術認證護甲師，依年齡與生活習慣量身規劃護甲服務，讓指甲維持乾爽潔淨、自然好看。",
  hero_image: "",
  about_title: "以指甲照護為核心的專門店",
  about_body: `全齡護甲中心 & 美甲（Nails & Health）是一間以**指甲與足趾日常照護**為核心的專門店。我們相信，一片健康好看的指甲，是從正確的修剪與日常保養開始。

主理人 Penny 老師投入手足保養領域超過 14 年，取得日本 JNA 足部保養檢定與多項德國足趾照護技術認證。從寶寶、學生、上班族到長輩，我們依不同年齡與生活習慣，提供量身規劃的護甲服務與居家保養建議。

我們在意細節與美感，也在意你是否安心——若指甲出現發紅、腫脹或明顯變色等情況，我們會建議先尋求皮膚科醫師協助，再一起規劃後續的日常照護。`,
  about_image: "",
  phone: "02-2885-9159",
  mobile: "0976-903-693",
  line_id: "@zbu6602s",
  line_url: "https://line.me/R/ti/p/@zbu6602s",
  instagram_url: "",
  facebook_url: "",
  booking_note: "採預約制，歡迎透過 LINE 或電話預約，我們會依你的需求安排合適的服務與時段。",
  disclaimer:
    "本店提供指甲與足部之美容保養服務，非醫療行為。若指甲有發紅、流膿、嚴重變色或增厚等情況，請先尋求皮膚科醫師診治。",
};

export const seedServices: Service[] = [
  {
    id: "seed-s1",
    category: "護甲",
    name: "足趾甲基礎整護",
    description: "正確修剪趾甲長度與形狀、清潔甲緣周圍、整理多餘角質，讓雙腳保持乾爽潔淨。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 10,
    is_published: true,
  },
  {
    id: "seed-s2",
    category: "護甲",
    name: "甲片弧度塑型護理",
    description: "針對甲片弧度明顯、邊緣容易卡鞋的趾甲，以德國技術進行甲片塑型與修飾，並提供居家保養建議。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 20,
    is_published: true,
  },
  {
    id: "seed-s3",
    category: "護甲",
    name: "甲面整理與拋光",
    description: "整理較厚或表面凹凸的甲面，撫平甲面紋路、強化指甲韌度，讓指甲看起來清爽有光澤。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 30,
    is_published: true,
  },
  {
    id: "seed-s4",
    category: "護甲",
    name: "足底角質護理",
    description: "腳跟與足底角質整理，搭配滋潤保養，讓雙腳觸感柔軟舒適。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 40,
    is_published: true,
  },
  {
    id: "seed-s5",
    category: "分齡照護",
    name: "兒童指甲照護",
    description: "為寶寶與孩童修剪指甲，並一對一教爸媽正確的居家修剪方式與頻率。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 50,
    is_published: true,
  },
  {
    id: "seed-s6",
    category: "分齡照護",
    name: "長輩足趾照護",
    description: "行動或視力較不便、自己不方便修剪趾甲的長輩，由護甲師協助修剪與清潔。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 60,
    is_published: true,
  },
  {
    id: "seed-s7",
    category: "分齡照護",
    name: "咬甲習慣輔助",
    description: "修飾甲型並搭配指甲防護，輔助戒除咬甲習慣，養成好看的甲型比例。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 70,
    is_published: true,
  },
  {
    id: "seed-s8",
    category: "美甲",
    name: "日式凝膠美甲",
    description: "由 20 年資歷的日本認證講師提供，兼顧風格、精緻度與指甲的日常狀態。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 80,
    is_published: true,
  },
  {
    id: "seed-s9",
    category: "課程與講座",
    name: "護甲講座與培訓課程",
    description: "親子、長照機構與企業講座，以及護甲師專業培訓課程，歡迎洽詢合作。",
    price: "請洽詢",
    duration: "",
    image_url: "",
    sort_order: 90,
    is_published: true,
  },
];

export const seedTeam: TeamMember[] = [
  {
    id: "seed-t1",
    name: "Penny 老師",
    role: "主理人・全齡護甲講師",
    bio: "投入手足保養領域超過 14 年。當年因美甲後指甲變得又薄又脆，開始鑽研日本美甲系統；之後為了家人與朋友的足趾困擾，再遠赴學習德國足趾照護技術。她相信護甲就像量身訂製的指甲教練，依每個人的狀況調整照護方式，陪你找回乾淨自然的指甲狀態。",
    credentials: [
      "日本 JNA 足部保養檢定",
      "日本 JNA 衛生管理師",
      "台灣 TFEA 手足保健協會高階認證",
      "德國 B/S 技術認證",
      "德國 3TO 技術認證",
      "德國反引力塑型技術認證",
    ],
    photo_url: "",
    sort_order: 10,
  },
  {
    id: "seed-t2",
    name: "Ariel 老師",
    role: "美甲講師",
    bio: "20 年美甲資歷，日本在台認證講師與評審。作品以風格與精緻感著稱，重視美甲之餘也兼顧指甲的日常狀態。",
    credentials: [
      "日本 Presto 台灣區認證講師",
      "日本 JNA 國際美甲技能檢定 2 級試驗官",
      "日本仲宗根指甲研究所高階講師",
      "日本 JNA 足部保養檢定",
    ],
    photo_url: "",
    sort_order: 20,
  },
];

export const seedLocations: Location[] = [
  {
    id: "seed-l1",
    name: "士林店",
    address: "台北市士林區劍潭路10號",
    hours: "採預約制，營業時間請透過 LINE 洽詢",
    transit: "鄰近捷運劍潭站，建議搭乘大眾運輸前往。",
    phone: "02-2885-9159",
    sort_order: 10,
  },
];

const now = "2026-09-29T08:00:00.000Z";

export const seedPosts: Post[] = [
  {
    id: "seed-p1",
    slug: "how-to-trim-toenails",
    title: "趾甲怎麼剪才對？護甲師教你正確修剪步驟",
    excerpt: "很多人習慣把趾甲剪得又短又圓，其實剪太短、兩側剪太深，反而容易讓甲緣卡進皮膚。跟著護甲師的步驟，在家也能剪得乾淨又舒服。",
    category: "居家保養",
    cover_url: "",
    status: "published",
    is_featured: true,
    published_at: "2026-09-20T08:00:00.000Z",
    created_at: now,
    updated_at: now,
    content: `很多人習慣把趾甲剪得又短又圓，覺得這樣比較乾淨。但其實**剪太短、把兩側剪得太深**，反而容易讓甲緣卡進皮膚，走路時感到不舒服。

## 修剪前的準備

- **一人一套工具**：手、腳的工具也分開使用，不與家人共用。
- **洗完澡後再剪**：此時指甲較軟、比較好修剪，剪完記得用面紙把甲面壓乾。
- **選擇平口剪**：比起彎口指甲剪，平口剪更容易剪出平直的前緣。

## 正確修剪三步驟

1. **從側邊慢慢剪進去**：不要一刀剪到底，分幾次小段修剪。
2. **前緣剪成平直**：長度大約與趾尖齊平，不要剪得比趾尖還短。
3. **兩側尖角稍微磨鈍**：用磨板輕輕修飾，不要往甲溝內挖深。

## 什麼時候該找專業協助？

如果自己修剪時感到疼痛、甲緣已經卡進皮膚，或周圍出現發紅、腫脹，請不要自己硬剪。建議先尋求皮膚科醫師協助，再與護甲師討論後續的日常照護。`,
  },
  {
    id: "seed-p2",
    slug: "baby-nail-care",
    title: "寶寶指甲怎麼剪？不同月齡的修剪頻率整理",
    excerpt: "寶寶的指甲又薄又軟，長得也快。整理 0–6 個月、爬行期到 1 歲以後的修剪頻率，以及讓修剪更順利的小技巧。",
    category: "分齡照護",
    cover_url: "",
    status: "published",
    is_featured: true,
    published_at: "2026-09-15T08:00:00.000Z",
    created_at: now,
    updated_at: now,
    content: `寶寶的趾（指）甲非常薄軟，長得也快，很多新手爸媽都不知道多久該剪一次。以下是護甲師整理的參考頻率：

| 月齡 | 建議頻率 |
| --- | --- |
| 0–6 個月 | 約兩週修剪一次 |
| 7 個月（準備爬行） | 每週檢查一次 |
| 1 歲以後 | 約三週修剪一次 |

## 讓修剪更順利的小技巧

- **使用寶寶專用的小剪刀**，刀口較小、較好控制。
- **選在寶寶清醒、心情好的時候**：Penny 老師建議不要趁寶寶睡覺時修剪。
- **轉移注意力**：準備玩具、唱首歌，或請另一位大人陪寶寶玩。
- **一樣剪成平直**：前緣不要剪得太短，兩側不要往內剪深。

如果寶寶的指甲周圍出現紅腫，請先帶寶寶給小兒科或皮膚科醫師看看喔。`,
  },
  {
    id: "seed-p3",
    slug: "daily-nail-care-habits",
    title: "日常護甲 4 個好習慣，讓指甲維持乾爽潔淨",
    excerpt: "指甲保養不只靠定期整理，每天的小習慣更重要。從洗澡後壓乾、用品不共用到保養滴劑的正確用法，一次整理給你。",
    category: "居家保養",
    cover_url: "",
    status: "published",
    is_featured: true,
    published_at: "2026-09-10T08:00:00.000Z",
    created_at: now,
    updated_at: now,
    content: `指甲保養不只靠定期到店整理，每天的小習慣更重要。

## 1. 洗完澡用面紙把指甲壓乾

甲面與甲緣長時間潮濕，容易讓指甲變軟、不好整理。洗完澡後用面紙輕壓，保持乾爽。

## 2. 手足用品分開，不與他人共用

指甲剪、磨板、毛巾等用品，建議一人一套、手腳分開使用。

## 3. 保養滴劑早晚使用

如果有使用護甲保養滴劑，建議早晚各使用一次，並且**先將甲面吹乾或壓乾**再使用。

## 4. 定期請護甲師整理

一般建議約 1–2 個月請護甲師整理一次；趾甲大約三週自行修剪一次。

---

平時也可以多觀察指甲的顏色與厚度，若出現明顯變化，建議先尋求皮膚科醫師協助。`,
  },
  {
    id: "seed-p4",
    slug: "nail-anatomy",
    title: "認識指甲構造：甲母、甲床與自由緣是什麼？",
    excerpt: "一片指甲其實由好多部位組成。了解甲母、甲上皮、指甲床、自由緣等構造，就知道為什麼修剪時要留一點長度。",
    category: "指甲小知識",
    cover_url: "/images/nail-anatomy-front.jpg",
    status: "published",
    is_featured: false,
    published_at: "2026-09-05T08:00:00.000Z",
    created_at: now,
    updated_at: now,
    content: `一片指甲看起來簡單，其實由好多部位組成。上方的封面是指甲正面圖，下方則是斷面圖。

## 主要部位

- **甲母**：位在甲根下方，是指甲開始生長的地方。
- **甲上皮**：俗稱「甘皮」，覆蓋在指甲根部的皮膚。
- **甲上皮角質**：附著在甲面上的薄薄角質，是護甲時需要清潔整理的部分。
- **指甲弧（甲半月）**：指甲根部白色半月形的區域。
- **指甲床**：指甲下方、呈現粉紅色的部分。
- **側甲廓**：指甲兩側的皮膚。
- **黃線**：指甲床與自由緣之間的分界線。
- **自由緣**：超出指尖、沒有貼附在皮膚上的指甲前緣。
- **甲下皮**：自由緣下方的皮膚。

![指甲斷面圖](/images/nail-anatomy-side.jpg)

## 為什麼修剪時要留一點長度？

自由緣就像指尖的小屋簷，保留適當長度可以保護下方的甲下皮。修剪時前緣剪平直、長度與指尖齊平，就是最剛好的狀態。`,
  },
];
