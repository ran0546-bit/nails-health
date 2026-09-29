# 全齡護甲中心 & 美甲 官方網站

Next.js 16 + Supabase。前台為一頁式首頁＋衛教專區，後台可編輯首頁內容、服務、人員、地點與衛教文章。

```
網站
├─ 首頁（一頁式）         app/(site)/page.tsx
│   主視覺＋預約按鈕 → 品牌簡介 → 服務項目 → 服務團隊 → 服務地點 → 精選衛教 → 聯絡預約
├─ 衛教專區               app/(site)/articles/
│   ├─ 文章列表／分類      /articles?category=居家保養
│   └─ 文章內頁            /articles/[網址代稱]
└─ 管理後台（需登入）     app/admin/
    ├─ 首頁內容與圖片      /admin/home
    ├─ 服務／人員／地點    /admin/services、/admin/team、/admin/locations
    └─ 衛教文章            /admin/posts（草稿 → 預覽 → 發布）
```

尚未連接 Supabase 時，網站會使用 `lib/seed.ts` 的內建內容顯示，後台則顯示設定說明。

---

## 一、在自己電腦上預覽

需要先安裝 [Node.js](https://nodejs.org)（20 版以上）。

```bash
npm install
npm run dev
```

打開 http://localhost:3000

---

## 二、連接 Supabase（啟用後台）

1. 到 https://supabase.com 註冊並建立新專案（Region 建議選 **Northeast Asia (Tokyo)**）。
2. 左側 **SQL Editor** → New query → 貼上 `supabase/schema.sql` 全部內容 → **Run**。
3. 左側 **Project Settings → API**，複製 `Project URL` 與 `anon / publishable key`。
4. 在專案資料夾把 `.env.example` 複製成 `.env.local`，填入上一步的兩個值。
5. 建立管理員帳號：
   - 左側 **Authentication → Users → Add user → Create new user**，輸入 Email 與密碼（勾選 Auto Confirm User）。
   - 回到 **SQL Editor** 執行（Email 換成你的）：
     ```sql
     insert into public.admins (user_id, email)
     select id, email from auth.users where email = 'you@example.com';
     ```
6. **關閉公開註冊**：Authentication → Sign In / Providers → 關閉「Allow new users to sign up」。
7. 重新執行 `npm run dev`，到 http://localhost:3000/admin 登入，按 **「匯入初始內容」**。

---

## 三、上線（Vercel，免費）

1. 把這個資料夾上傳到 GitHub（私人 repository 即可）。
2. 到 https://vercel.com 用 GitHub 登入 → **Add New → Project** → 選這個 repository。
3. 在 **Environment Variables** 加入：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`（先填 Vercel 給的網址，例如 `https://nails-health.vercel.app`）
4. 按 **Deploy**。之後買了網域，在 Vercel → Settings → Domains 綁定，並更新 `NEXT_PUBLIC_SITE_URL`。
5. 回到 Supabase → Authentication → URL Configuration，把 **Site URL** 改成正式網址。

---

## 四、後台使用重點

- **儲存後約 1 分鐘內**會更新到網站。
- 文章流程：**儲存草稿 → 預覽網站頁面 → 發布文章**。草稿訪客看不到。
- **網址代稱**決定文章網址（`/articles/baby-nail-care`），只能用小寫英文、數字、連字號，發布後盡量不要改。
- 勾選 **精選文章** 會出現在首頁（最多 3 篇；沒有精選時顯示最新 3 篇）。
- 每個編輯頁右側都有 **醫療廣告用字檢查**，會即時提醒「治療、矯正、灰指甲、甲床擴充、保證」等違規字眼並提供替換建議（規則在 `lib/compliance.ts`）。
- 注意：Before／After 對比照若呈現發炎、嚴重變色等醫療情境，即使文字合規也可能被認定為宣稱療效，上傳前請留意。

---

## 五、待補充的資料

- [ ] Instagram／Facebook 網址（後台 → 首頁內容）
- [ ] 各服務的價格與服務時間（後台 → 服務項目）
- [ ] 營業時間、交通方式（後台 → 服務地點；目前交通寫「鄰近捷運劍潭站」，請確認）
- [ ] 店內環境照、主視覺照片、老師大頭照
- [ ] LOGO 向量檔（目前的圖示是依名片重繪的近似版，在 `public/logo-mark.svg` 與 `components/site/Logo.tsx`）
