import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'hy' | 'ru' | 'en';

const dict = {
  appName: { hy: 'Cio Driver', ru: 'Cio Driver', en: 'Cio Driver' },
  // Մուտք
  loginTitle: { hy: 'Մուտք', ru: 'Вход', en: 'Sign in' },
  loginSub: {
    hy: 'Մուտքագրեք էլ. փոստը, կուղարկենք 6-նիշանոց կոդ',
    ru: 'Введите e-mail, мы отправим 6-значный код',
    en: 'Enter your e-mail and we will send a 6-digit code',
  },
  email: { hy: 'Էլ. փոստ', ru: 'E-mail', en: 'E-mail' },
  sendCode: { hy: 'Ուղարկել կոդը', ru: 'Отправить код', en: 'Send code' },
  code: { hy: 'Կոդ', ru: 'Код', en: 'Code' },
  codeSent: { hy: 'Կոդն ուղարկված է՝ ', ru: 'Код отправлен на ', en: 'Code sent to ' },
  verify: { hy: 'Մուտք գործել', ru: 'Войти', en: 'Sign in' },
  changeEmail: { hy: 'Փոխել էլ. փոստը', ru: 'Изменить e-mail', en: 'Change e-mail' },
  notConfigured: {
    hy: 'Supabase-ի բանալիները դեռ տեղադրված չեն (src/config.ts)',
    ru: 'Ключи Supabase ещё не указаны (src/config.ts)',
    en: 'Supabase keys are not set yet (src/config.ts)',
  },
  // Ներդիրներ
  tabHome: { hy: 'Գլխավոր', ru: 'Главная', en: 'Home' },
  tabDeals: { hy: 'Գործարքներ', ru: 'Сделки', en: 'Deals' },
  tabMap: { hy: 'Քարտեզ', ru: 'Карта', en: 'Map' },
  tabChats: { hy: 'Զրույցներ', ru: 'Чаты', en: 'Chats' },
  tabMe: { hy: 'Ես', ru: 'Я', en: 'Me' },
  soon: { hy: 'Շուտով', ru: 'Скоро', en: 'Coming soon' },
  soonText: {
    hy: 'Այս բաժինը կավելանա հաջորդ թարմացումներում',
    ru: 'Этот раздел появится в следующих обновлениях',
    en: 'This section arrives in a future update',
  },
  // Գլխավոր
  hello: { hy: 'Բարև', ru: 'Привет', en: 'Hello' },
  myVehicle: { hy: 'Իմ մեքենան', ru: 'Моя машина', en: 'My truck' },
  driver: { hy: 'Վարորդ', ru: 'Водитель', en: 'Driver' },
  addVehicle: { hy: 'Ավելացնել մեքենա', ru: 'Добавить машину', en: 'Add truck' },
  noVehicle: {
    hy: 'Դեռ մեքենա չկա։ Ավելացրեք՝ ժամկետները հետևելու համար',
    ru: 'Машины пока нет. Добавьте, чтобы следить за сроками',
    en: 'No truck yet. Add one to track expiry dates',
  },
  deadlines: { hy: 'Ժամկետներ', ru: 'Сроки', en: 'Deadlines' },
  activeDeals: { hy: 'Ընթացիկ գործարքներ', ru: 'Сделки в работе', en: 'Active deals' },
  // Մեքենա
  plate: { hy: 'Պետհամարանիշ', ru: 'Госномер', en: 'Plate' },
  brand: { hy: 'Մակնիշ', ru: 'Марка', en: 'Make' },
  model: { hy: 'Մոդել', ru: 'Модель', en: 'Model' },
  year: { hy: 'Տարեթիվ', ru: 'Год', en: 'Year' },
  trailer: { hy: 'Կցորդի համարանիշ', ru: 'Номер прицепа', en: 'Trailer plate' },
  insurance: { hy: 'Ապահովագրություն', ru: 'Страховка', en: 'Insurance' },
  inspection: { hy: 'Տեխզննում', ru: 'Техосмотр', en: 'Inspection' },
  tirCarnet: { hy: 'TIR Carnet', ru: 'TIR Carnet', en: 'TIR Carnet' },
  tirNo: { hy: 'TIR Carnet համար', ru: 'Номер TIR Carnet', en: 'TIR Carnet no.' },
  validUntil: { hy: 'վավեր է մինչև', ru: 'действует до', en: 'valid until' },
  dateHint: { hy: 'ՏՏՏՏ-ԱԱ-ՕՕ', ru: 'ГГГГ-ММ-ДД', en: 'YYYY-MM-DD' },
  // Վարորդ
  fullName: { hy: 'Անուն ազգանուն', ru: 'Имя и фамилия', en: 'Full name' },
  phone: { hy: 'Հեռախոս', ru: 'Телефон', en: 'Phone' },
  whatsapp: { hy: 'WhatsApp', ru: 'WhatsApp', en: 'WhatsApp' },
  licenseNo: { hy: 'Վարորդական իրավունք №', ru: 'Водительское удостоверение №', en: 'Driving licence no.' },
  licenseExpiry: { hy: 'Վարորդականի ժամկետ', ru: 'Срок прав', en: 'Licence expiry' },
  passportExpiry: { hy: 'Անձնագրի ժամկետ', ru: 'Срок паспорта', en: 'Passport expiry' },
  // Փաստաթղթեր
  documents: { hy: 'Փաստաթղթեր', ru: 'Документы', en: 'Documents' },
  doc_passport: { hy: 'Անձնագիր', ru: 'Паспорт', en: 'Passport' },
  doc_license: { hy: 'Վարորդական', ru: 'Права', en: 'Licence' },
  doc_tech_front: { hy: 'Տեխանձնագիր · առջև', ru: 'Техпаспорт · лицевая', en: 'Registration · front' },
  doc_tech_back: { hy: 'Տեխանձնագիր · հետև', ru: 'Техпаспорт · оборот', en: 'Registration · back' },
  doc_tir: { hy: 'TIR փաստաթղթեր', ru: 'Документы TIR', en: 'TIR papers' },
  doc_cmr: { hy: 'CMR', ru: 'CMR', en: 'CMR' },
  doc_insurance: { hy: 'Ապահովագրություն', ru: 'Страховка', en: 'Insurance' },
  doc_other: { hy: 'Այլ', ru: 'Другое', en: 'Other' },
  upload: { hy: 'Վերբեռնել', ru: 'Загрузить', en: 'Upload' },
  takePhoto: { hy: 'Լուսանկարել', ru: 'Сфотографировать', en: 'Take photo' },
  fromGallery: { hy: 'Պատկերասրահից', ru: 'Из галереи', en: 'From gallery' },
  replace: { hy: 'Փոխել', ru: 'Заменить', en: 'Replace' },
  uploaded: { hy: 'Վերբեռնված է', ru: 'Загружено', en: 'Uploaded' },
  notUploaded: { hy: 'Վերբեռնված չէ', ru: 'Не загружено', en: 'Not uploaded' },
  sendToLogist: { hy: 'Ուղարկել լոգիստին WhatsApp-ով', ru: 'Отправить логисту в WhatsApp', en: 'Send to logistician via WhatsApp' },
  waText: {
    hy: 'Բարև, ուղարկում եմ փաստաթղթերը (հղումները վավեր են 7 օր)',
    ru: 'Здравствуйте, отправляю документы (ссылки действуют 7 дней)',
    en: 'Hello, here are my documents (links valid for 7 days)',
  },
  noDocs: { hy: 'Նախ վերբեռնեք գոնե մեկ փաստաթուղթ', ru: 'Сначала загрузите хотя бы один документ', en: 'Upload at least one document first' },
  noWhatsapp: { hy: 'WhatsApp-ը չի բացվում', ru: 'Не удалось открыть WhatsApp', en: 'Could not open WhatsApp' },
  // Գործարքներ
  newDeal: { hy: 'Նոր գործարք', ru: 'Новая сделка', en: 'New deal' },
  active: { hy: 'Ընթացիկ', ru: 'В работе', en: 'Active' },
  done: { hy: 'Ավարտված', ru: 'Завершённые', en: 'Completed' },
  from: { hy: 'Որտեղից', ru: 'Откуда', en: 'From' },
  to: { hy: 'Ուր', ru: 'Куда', en: 'To' },
  cargo: { hy: 'Բեռ', ru: 'Груз', en: 'Cargo' },
  client: { hy: 'Պատվիրատու', ru: 'Заказчик', en: 'Client' },
  logistPhone: { hy: 'Լոգիստի հեռախոս', ru: 'Телефон логиста', en: 'Logistician phone' },
  fare: { hy: 'Գործարքի վարձ', ru: 'Оплата за сделку', en: 'Deal fare' },
  dealCode: { hy: 'Գործարքի համար', ru: 'Номер сделки', en: 'Deal no.' },
  startDate: { hy: 'Մեկնման օր', ru: 'Дата выезда', en: 'Start date' },
  markDone: { hy: 'Նշել ավարտված', ru: 'Отметить завершённой', en: 'Mark completed' },
  reopen: { hy: 'Վերաբացել', ru: 'Вернуть в работу', en: 'Reopen' },
  noDeals: { hy: 'Գործարքներ դեռ չկան', ru: 'Сделок пока нет', en: 'No deals yet' },
  callLogist: { hy: 'Զանգել լոգիստին', ru: 'Позвонить логисту', en: 'Call logistician' },
  // Ընդհանուր
  save: { hy: 'Պահպանել', ru: 'Сохранить', en: 'Save' },
  saved: { hy: 'Պահպանված է', ru: 'Сохранено', en: 'Saved' },
  cancel: { hy: 'Չեղարկել', ru: 'Отмена', en: 'Cancel' },
  delete: { hy: 'Ջնջել', ru: 'Удалить', en: 'Delete' },
  edit: { hy: 'Խմբագրել', ru: 'Изменить', en: 'Edit' },
  error: { hy: 'Սխալ', ru: 'Ошибка', en: 'Error' },
  required: { hy: 'Պարտադիր դաշտ', ru: 'Обязательное поле', en: 'Required field' },
  badDate: { hy: 'Ամսաթիվը՝ ՏՏՏՏ-ԱԱ-ՕՕ ձևաչափով', ru: 'Дата в формате ГГГГ-ММ-ДД', en: 'Date as YYYY-MM-DD' },
  language: { hy: 'Լեզու', ru: 'Язык', en: 'Language' },
  signOut: { hy: 'Դուրս գալ', ru: 'Выйти', en: 'Sign out' },
  expired: { hy: 'ժամկետանց', ru: 'просрочено', en: 'expired' },
  daysLeft: { hy: 'օր', ru: 'дн.', en: 'days' },
  notSet: { hy: 'նշված չէ', ru: 'не указано', en: 'not set' },
} as const;

export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const I18nContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'lang';

function deviceLang(): Lang {
  const code = getLocales()[0]?.languageCode;
  if (code === 'ru') return 'ru';
  if (code === 'en') return 'en';
  return 'hy';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(deviceLang());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'hy' || v === 'ru' || v === 'en') setLangState(v);
      })
      .catch(() => {});
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
      },
      t: (k) => dict[k][lang],
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n outside I18nProvider');
  return ctx;
}
