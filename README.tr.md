# CurryShot Dashboard

**Atış verisini taktik oyun planlarına çeviren, yapay zekâ koç asistanlı interaktif NBA şut haritası.**

🇬🇧 [English README](README.md)

<!-- TODO(izzet): ekran görüntüsü/GIF ve canlı demo bağlantısı ekle. -->

## Neden bu proje?

Şut haritaları bir oyuncunun *nereden* sayı attığını gösterir; koçların ise *ne yapacağını* bilmesi gerekir: hangi setler oynanmalı, oyuncu nasıl savunulmalı, bu akşamki rakibe karşı geçmişte nasıl oynamış. CurryShot her NBA takımından bir öne çıkan oyuncu için filtrelenebilir bir şut haritasını, ekrandaki filtrelenmiş sayıları okuyup koç diliyle yanıt veren bir yapay zekâ asistanıyla birleştirir.

## Özellikler

- 30 NBA takımı, takım renklerine göre tema
- Sonuç, atış türü, bölge, mesafe, sezon ve rakip filtreli interaktif yarı saha şut haritası
- Canlı metrikler: deneme, FG%, 3P%, ortalama mesafe, bölge dağılımı
- İki takımın ilk beşini yan yana karşılaştırma
- **Yapay zekâ koç** (Claude API): taktik içgörüler, serbest sohbet, savunma planı, rakip bazlı performans ve scouting raporu
- API anahtarı yoksa veya API hata verirse yerel kural tabanlı motorla çalışmaya devam eder

## Kurulum

```bash
npm install
cp .env.example .env.local   # isteğe bağlı: canlı koç için ANTHROPIC_API_KEY
npm run dev
```

## Testler

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Veri hattı, mimari ve sınırlamalar için [İngilizce README](README.md)'ye bakın.

## Lisans

[MIT](LICENSE)
