import { tenantBrandIdentity } from "@/tenant/brand";
import type { WelcomeContent, WelcomeLocale } from "./types";
const guest="{{guest}}";
const base=(headline:string,body:string):WelcomeContent=>({headline,body,signature:tenantBrandIdentity.propertyName});
export const DEFAULT_WELCOME_CONTENT: Record<WelcomeLocale, WelcomeContent> = {
  id:base(`Selamat datang, ${guest}.`,"Semoga waktu Anda di sini berjalan sedikit lebih pelan. Beristirahatlah, nikmati ruangnya, dan hubungi host kapan pun Anda membutuhkan bantuan."),
  en:base(`Welcome, ${guest}.`,"May your time here move a little more slowly. Settle in, enjoy the space, and reach your host whenever you need a hand."),
  ar:base(`مرحبًا، ${guest}.`,"نتمنى أن يمضي وقتكم هنا بهدوء أكبر. استريحوا واستمتعوا بالمكان، وتواصلوا مع المضيف متى احتجتم إلى المساعدة."),
  ja:base(`ようこそ、${guest}。`,"ここでの時間が少しゆっくり流れますように。くつろいで空間を楽しみ、必要なときはホストへご連絡ください。"),
  "zh-CN":base(`欢迎，${guest}。`,"愿您在这里的时光慢一些。请安心休息、享受空间；需要帮助时，随时联系房东。"),
  ko:base(`환영합니다, ${guest}.`,"이곳에서의 시간이 조금 더 천천히 흐르기를 바랍니다. 편히 쉬며 공간을 즐기시고, 도움이 필요할 때 호스트에게 연락해 주세요."),
  es:base(`Bienvenido, ${guest}.`,"Que tu tiempo aquí transcurra un poco más despacio. Descansa, disfruta del espacio y contacta a tu anfitrión cuando necesites ayuda."),
  fr:base(`Bienvenue, ${guest}.`,"Que le temps passe ici un peu plus doucement. Installez-vous, profitez des lieux et contactez votre hôte si vous avez besoin d'aide."),
  de:base(`Willkommen, ${guest}.`,"Möge Ihre Zeit hier etwas langsamer vergehen. Kommen Sie zur Ruhe, genießen Sie den Raum und melden Sie sich bei Ihrem Gastgeber, wenn Sie Hilfe brauchen."),
  pt:base(`Boas-vindas, ${guest}.`,"Que o seu tempo aqui passe um pouco mais devagar. Acomode-se, aproveite o espaço e fale com o anfitrião quando precisar de ajuda."),
  it:base(`Benvenuto, ${guest}.`,"Che il tempo qui scorra un po' più lentamente. Rilassati, goditi lo spazio e contatta l'host quando hai bisogno di aiuto."),
  nl:base(`Welkom, ${guest}.`,"Moge uw tijd hier wat langzamer verlopen. Kom tot rust, geniet van de ruimte en neem contact op met uw host als u hulp nodig hebt."),
  ru:base(`Добро пожаловать, ${guest}.`,"Пусть время здесь течёт немного медленнее. Отдохните, насладитесь пространством и свяжитесь с хозяином, если понадобится помощь."),
  tr:base(`Hoş geldiniz, ${guest}.`,"Buradaki zamanınız biraz daha yavaş aksın. Yerleşin, alanın keyfini çıkarın ve yardıma ihtiyaç duyduğunuzda ev sahibine ulaşın."),
  th:base(`ยินดีต้อนรับ ${guest}`,"ขอให้เวลาของคุณที่นี่เดินช้าลงอีกนิด พักผ่อน เพลิดเพลินกับพื้นที่ และติดต่อเจ้าของที่พักได้เมื่อคุณต้องการความช่วยเหลือ"),
  vi:base(`Chào mừng, ${guest}.`,"Mong thời gian của bạn ở đây trôi chậm hơn một chút. Hãy nghỉ ngơi, tận hưởng không gian và liên hệ chủ nhà khi bạn cần hỗ trợ."),
  hi:base(`स्वागत है, ${guest}।`,"यहाँ आपका समय थोड़ा धीमे बीते। आराम कीजिए, इस स्थान का आनंद लीजिए और सहायता चाहिए तो मेज़बान से संपर्क कीजिए।"),
  ms:base(`Selamat datang, ${guest}.`,"Semoga masa anda di sini bergerak sedikit lebih perlahan. Berehatlah, nikmati ruang ini, dan hubungi hos apabila anda memerlukan bantuan."),
  fil:base(`Maligayang pagdating, ${guest}.`,"Nawa'y maging mas mabagal at payapa ang oras mo rito. Magpahinga, tamasahin ang lugar, at makipag-ugnayan sa host kapag kailangan mo ng tulong."),
  la:base(`Salve, ${guest}.`,"Utinam tempus tuum hic paulo lenius fluat. Requiesce, fruere spatio, et hospitem tuum tange quandocumque auxilio eges."),
};
export function defaultWelcomeContent(locale:WelcomeLocale, propertyName:string=tenantBrandIdentity.propertyName):WelcomeContent{return {...DEFAULT_WELCOME_CONTENT[locale],signature:propertyName};}
