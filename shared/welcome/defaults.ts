import type { WelcomeContent, WelcomeLocale } from "./types";

const guest = "{{guest}}";
const signature = "Ruma Kamyna · return to stillness.";

export const DEFAULT_WELCOME_CONTENT: Record<WelcomeLocale, WelcomeContent> = {
  id: { headline: `Selamat datang, ${guest}.`, body: "Semoga waktu Anda di sini berjalan sedikit lebih pelan. Beristirahatlah, nikmati ruangnya, dan hubungi kami kapan pun Anda membutuhkan bantuan.", signature },
  en: { headline: `Welcome, ${guest}.`, body: "May your time here move a little more slowly. Settle in, enjoy the space, and reach us whenever you need a hand.", signature },
  ar: { headline: `مرحبًا، ${guest}.`, body: "نتمنى أن يمضي وقتكم هنا بهدوء أكبر. استريحوا واستمتعوا بالمكان، وتواصلوا معنا متى احتجتم إلى المساعدة.", signature },
  ja: { headline: `ようこそ、${guest}。`, body: "ここでの時間が、いつもより少しゆっくり流れますように。くつろいで空間を楽しみ、必要なときはいつでもご連絡ください。", signature },
  "zh-CN": { headline: `欢迎，${guest}。`, body: "愿您在这里的时光慢一些。请安心休息、享受空间；需要帮助时，随时联系我们。", signature },
  ko: { headline: `환영합니다, ${guest}.`, body: "이곳에서의 시간이 조금 더 천천히 흐르기를 바랍니다. 편히 쉬며 공간을 즐기시고, 도움이 필요할 때 언제든 연락해 주세요.", signature },
  es: { headline: `Bienvenido, ${guest}.`, body: "Que tu tiempo aquí transcurra un poco más despacio. Descansa, disfruta del espacio y contáctanos cuando necesites ayuda.", signature },
  fr: { headline: `Bienvenue, ${guest}.`, body: "Que le temps passe ici un peu plus doucement. Installez-vous, profitez des lieux et contactez-nous dès que vous avez besoin d'aide.", signature },
  de: { headline: `Willkommen, ${guest}.`, body: "Möge Ihre Zeit hier etwas langsamer vergehen. Kommen Sie zur Ruhe, genießen Sie den Raum und melden Sie sich, wenn Sie Hilfe brauchen.", signature },
  pt: { headline: `Boas-vindas, ${guest}.`, body: "Que o seu tempo aqui passe um pouco mais devagar. Acomode-se, aproveite o espaço e fale conosco sempre que precisar de ajuda.", signature },
  it: { headline: `Benvenuto, ${guest}.`, body: "Che il tempo qui scorra un po' più lentamente. Rilassati, goditi lo spazio e contattaci ogni volta che hai bisogno di aiuto.", signature },
  nl: { headline: `Welkom, ${guest}.`, body: "Moge uw tijd hier wat langzamer verlopen. Kom tot rust, geniet van de ruimte en neem contact met ons op wanneer u hulp nodig hebt.", signature },
  ru: { headline: `Добро пожаловать, ${guest}.`, body: "Пусть время здесь течёт немного медленнее. Отдохните, насладитесь пространством и свяжитесь с нами, если понадобится помощь.", signature },
  tr: { headline: `Hoş geldiniz, ${guest}.`, body: "Buradaki zamanınız biraz daha yavaş aksın. Yerleşin, alanın keyfini çıkarın ve yardıma ihtiyaç duyduğunuzda bize ulaşın.", signature },
  th: { headline: `ยินดีต้อนรับ ${guest}`, body: "ขอให้เวลาของคุณที่นี่เดินช้าลงอีกนิด พักผ่อน เพลิดเพลินกับพื้นที่ และติดต่อเราได้ทุกเมื่อที่ต้องการความช่วยเหลือ", signature },
  vi: { headline: `Chào mừng, ${guest}.`, body: "Mong thời gian của bạn ở đây trôi chậm hơn một chút. Hãy nghỉ ngơi, tận hưởng không gian và liên hệ với chúng tôi bất cứ khi nào bạn cần hỗ trợ.", signature },
  hi: { headline: `स्वागत है, ${guest}।`, body: "यहाँ आपका समय थोड़ा धीमे बीते। आराम कीजिए, इस स्थान का आनंद लीजिए और सहायता चाहिए तो कभी भी हमसे संपर्क कीजिए।", signature },
  ms: { headline: `Selamat datang, ${guest}.`, body: "Semoga masa anda di sini bergerak sedikit lebih perlahan. Berehatlah, nikmati ruang ini, dan hubungi kami apabila anda memerlukan bantuan.", signature },
  fil: { headline: `Maligayang pagdating, ${guest}.`, body: "Nawa'y maging mas mabagal at payapa ang oras mo rito. Magpahinga, tamasahin ang lugar, at makipag-ugnayan sa amin kapag kailangan mo ng tulong.", signature },
  la: { headline: `Salve, ${guest}.`, body: "Utinam tempus tuum hic paulo lenius fluat. Requiesce, fruere spatio, et nos tange quandocumque auxilio eges.", signature },
};

export function defaultWelcomeContent(locale: WelcomeLocale, propertyName = "Ruma Kamyna"): WelcomeContent {
  const source = DEFAULT_WELCOME_CONTENT[locale];
  if (propertyName === "Ruma Kamyna") return source;
  return {
    headline: source.headline.replaceAll("Ruma Kamyna", propertyName),
    body: source.body.replaceAll("Ruma Kamyna", propertyName),
    signature: source.signature.replaceAll("Ruma Kamyna", propertyName),
  };
}
