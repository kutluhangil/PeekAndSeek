# Google Cloud Console Setup Guide (Türkçe / Turkish)

## Adım 1: API'leri Etkinleştir

Google Cloud Console'da sol taraftaki menüden **"APIs & Services"** → **"Library"** seçeceğiz.

### 1.1 Maps JavaScript API Etkinleştir
- Search box'a "Maps JavaScript API" yaz
- Bulduğun API'ye tıkla
- **ENABLE** butonuna tıkla
- Bekle, sayfa yenilenecek

### 1.2 Street View Static API Etkinleştir
- Tekrar Library'ye geri git (arama sayfasından çık)
- Search box'a "Street View Static API" yaz
- Bulduğun API'ye tıkla
- **ENABLE** butonuna tıkla

### 1.3 Geocoding API Etkinleştir
- Tekrar Library'ye geri git
- Search box'a "Geocoding API" yaz
- Bulduğun API'ye tıkla
- **ENABLE** butonuna tıkla

**Kontrol:** Sol menüde "APIs & Services" → "Enabled APIs & services" seçince üç API'nin de listede görünmesi gerekiyor.

---

## Adım 2: API Key Oluştur

Sol menüde **"APIs & Services"** → **"Credentials"** seçeceğiz.

### 2.1 Yeni Credential Oluştur
- **"+ CREATE CREDENTIALS"** butonuna tıkla
- Dropdown'tan **"API Key"** seçeceğiz
- Bir modal açılacak, içinde API key gösterilecek
- **COPY** butonuyla kopyala (bu sırada Console tarafında **RESTRICT KEY** butonunu görme, onu hemen sonra yapacağız)

### 2.2 Key'i Kopyala
Açılır penceredeki key'i tamamen kopyala. Şu formatta olmalı:
```
AIzaSy... (çok uzun bir string)
```

**NOT:** Bu key'i sakla! Dosya yolları vs açık tutma. Şimdi biz bu key'e kısıtlamalar ekleyeceğiz.

---

## Adım 3: API Key'e Referrer Kısıtlaması Ekle

### 3.1 Credentials Sayfasında Key'i Bul
- Sol menüde **"APIs & Services"** → **"Credentials"** 
- "API Keys" sektion'ında az önce oluşturduğun key'i bul (en yenisi olmalı)
- Key'in adına tıkla (pencere açılacak)

### 3.2 Referrer Kısıtlaması Ayarla
- **"Application restrictions"** bölümünde:
  - **"HTTP referrers (web sites)"** seçeceğiz
  - Text box'a şu yazıyorsun: `http://localhost:3000/*`
  - Bunu ekle (Enter ya da + butonuyla)

### 3.3 API Kısıtlaması Ayarla
- **"API restrictions"** bölümüne scrollla
- **"Restrict key"** seç (Unrestricted ise)
- Bu üçü seçeceğiz:
  - ☑ Maps JavaScript API
  - ☑ Street View Static API
  - ☑ Geocoding API
- **SAVE** butonuyla kaydet

---

## Adım 4: Key'i Uygulamaya Ekle

Kopyaladığın API key'i şuraya yapıştırıyorsun (proje klasörü altında):

**File:** `.env`
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...burasınapastla...
```

Eğer dosya yoksa, yeni bir dosya oluştur.

---

## Adım 5: Billing Doğrula

### 5.1 Billing Account Bağla
- Sol menüde **"Billing"** seç
- Eğer "Project not linked to billing account" mesajı varsa:
  - **"LINK A BILLING ACCOUNT"** butonuna tıkla
  - Var olan bir billing account seçeceğiz (varsa) ya da yenisini oluşturacağız
  - Kredi kartı bilgisi gerekebilir (Google ilk 3 ay free tier verir, sonra ücreti pay-as-you-go)

### 5.2 Quota Kontrol
- Sol menüde **"APIs & Services"** → **"Quotas"**
- Her üç API'nin (Maps JS, Street View, Geocoding) günlük limit'inin yüksek olduğunu görmeli
- Development için genelde free tier yeterli

---

## Adım 6: Uygulamayı Test Et

### 6.1 Dev Server'ı Başlat
Terminal'de proje klasörü altında:
```bash
npm run dev
```

### 6.2 Tarayıcıda Test Et
- `http://localhost:3000` aç
- Landing sayfasında "System Boot" görmelisin
- **"Commence Search"** butonuna tıkla
- Harita ekranına geçmelisin
- Sol tarafta ipuçları (Intel Report) görmelisin
- Sağ tarafta Harita görmelisin
- **Map should render** (harita çizimleri görülmeli, uyarı yok ya da sadece marker uyarıları olabilir)

### 6.3 Console Hata Kontrol
- F12 tuşuna bas → **Console** tab'ı aç
- Eğer görürsen:
  - ✅ `"Head South-East. Approximately X km away"` - YEŞİL, çalışıyor
  - ✅ Street View feed görmeli (resim vs)
  - ❌ Hâlâ `AuthFailure` varsa = aşamaları tekrar kontrol et
  - ❌ `ApiNotActivatedMapError` varsa = API'ler enable olmamış, Adım 1'e dön

---

## Sorun Giderme

### "Maps JavaScript API is not enabled"
- Adım 1.1'i tekrar yap. API'nin enabled olmadığını check et.

### "Street View Static API is not enabled"
- Adım 1.2'yi tekrar yap.

### "Invalid API key" ya da "403 Forbidden"
- Adım 3'ü kontrol et. Referrer kısıtlaması eksikse `http://localhost:3000/*` ekle.
- Key'i `.env` dosyasında doğru yazmışsın mı check et (copy/paste hatası olmasın).

### "Map shows but no styling / looks broken"
- Bu normaldir. Kod tarafında kustom styling yapılıyor. Harita çalışıyorsa sorun yok.

### Hâlâ çalışmıyorsa:
- `.env` dosyasını kaydet
- Dev server'ı kapatıp restart et (`Ctrl+C` sonra `npm run dev` tekrar)
- Tarayıcıda hard refresh yap (`Cmd+Shift+R` Mac, `Ctrl+Shift+F5` Windows)

---

## Özet

| Adım | Ne Yapacaksın | Kontrol Noktası |
|------|---|---|
| 1 | 3 API'yi etkinleştir | Console → "Enabled APIs" 3 API görünmeli |
| 2 | API Key oluştur | Key kopyalandı mı? |
| 3 | Key'e kısıtlamalar ekle | Referrer: localhost:3000/* |
| 4 | `.env` dosyasına key yapıştır | File kaydedildi mi? |
| 5 | Billing bağla (optional ama önerilir) | Free tier vs Paid account |
| 6 | Test et | Harita ve Street View görünüyor mu? |

---

**Başarı!** 🎉 Eğer harita görünüyorsa, setup tamam demek. "Commence Search" butonuna tıkla, harita ekranına geç ve oyunu oyna!
