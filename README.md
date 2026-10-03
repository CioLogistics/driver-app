# Cio Driver

Բեռնատարի վարորդների հավելված (iPhone + Android)։ Expo (React Native) + Supabase։

## Ինչ կա v0.1-ում (փուլ 1)

- Մուտք էլ. փոստով՝ 6-նիշանոց կոդով
- **Իմ մեքենան**՝ համարանիշ, մակնիշ, կցորդ, տեխզննման / ապահովագրության / TIR Carnet ժամկետներ
- **Վարորդ**՝ անուն, հեռախոս, վարորդականի և անձնագրի ժամկետներ
- Փաստաթղթեր՝ տեխանձնագիր (2 կողմ), TIR, CMR, ապահովագրություն, անձնագիր, վարորդական (լուսանկար կամ պատկերասրահից)
- **Ուղարկել լոգիստին WhatsApp-ով**՝ փաստաթղթերի 7-օրյա հղումներով
- **Գործարքներ**՝ ընթացիկ / ավարտված, նոր գործարք, զանգ լոգիստին
- Գլխավոր էջ՝ մեքենա, վարորդ, ժամկետներ (կարմիր / նարնջագույն / կանաչ)
- Լեզուներ՝ հայերեն, русский, English · լուսավոր և մուգ թեմա

Քարտեզ, զրույցներ, սահմաններ, տուգանքներ, դիզելի գներ՝ հաջորդ փուլերում։

## Մեկանգամյա կարգավորում

### 1. Supabase
1. **SQL Editor → New query** → տեղադրիր `supabase/migrations/0001_init.sql`-ի ամբողջ պարունակությունը → **Run**
2. **Authentication → Emails → Magic Link** ձևանմուշում ավելացրու կոդը, օրինակ՝
   `Ձեր մուտքի կոդը՝ {{ .Token }}`
3. **Project Settings → API**-ից պատճենիր **Project URL** և **anon / publishable** բանալին → `src/config.ts`
   (⚠️ `service_role / secret` բանալին երբեք չի դրվում հավելվածում)

### 2. Android APK կառուցում (առանց համակարգչի)
1. expo.dev → **Account settings → Access tokens** → Create token
2. GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**
   Name՝ `EXPO_TOKEN`, Value՝ token-ը
3. GitHub → **Actions → CI → Run workflow**
4. Մոտ 15 րոպեից APK-ի հղումը կհայտնվի expo.dev → Builds բաժնում. բացիր հեռախոսով և տեղադրիր

## Ծրագրավորողի համար

```bash
npm install
npx expo start
```

Կառուցվածք՝ `app/` էկրաններ (expo-router), `src/lib/` տվյալներ / թարգմանություններ / թեմա,
`src/components/` UI, `supabase/migrations/` բազայի սխեմա (RLS՝ ամեն վարորդ տեսնում է միայն իրենը)։
