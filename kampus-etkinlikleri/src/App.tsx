import { useState, useEffect } from 'react';

// --- VERİ TİPLERİ ---
interface Etkinlik {
  id: number;
  baslik: string;
  kategori: string;
  tarih: string;
  saat: string;
  yer: string;
  kontenjan: number;
  aciklama: string;
}

export default function App() {
  const [aktifSayfa, setAktifSayfa] = useState<string>('anasayfa');
  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [seciliKategori, setSeciliKategori] = useState<string>('Tümü');
  
  // Detay sayfası için seçilen etkinliği tutan state
  const [seciliEtkinlik, setSeciliEtkinlik] = useState<Etkinlik | null>(null);

  // Ekran görüntüsündeki birebir veriler
  useEffect(() => {
    setEtkinlikler([
      { id: 1, baslik: "Kariyer Günleri 2026", kategori: "Seminer", tarih: "12 Ekim 2026", saat: "14:00", yer: "A Blok Konferans Salonu", kontenjan: 100, aciklama: "Mezunlarla kariyer söyleşileri ve şirket standları." },
      { id: 2, baslik: "Robotik Atölyesi", kategori: "Atölye", tarih: "20 Ekim 2026", saat: "10:00", yer: "Bilgisayar Laboratuvarı 2", kontenjan: 20, aciklama: "Arduino ile çizgi izleyen robot yapımı, başlangıç seviyesi." },
      { id: 3, baslik: "Web Tasarım Atölyesi", kategori: "Atölye", tarih: "3 Kasım 2026", saat: "15:00", yer: "Bilgisayar Laboratuvarı 1", kontenjan: 30, aciklama: "HTML ve CSS ile ilk kişisel sayfanı yap." }
    ]);
  }, []);

  const sayfayaGit = (hedef: string) => {
    setAktifSayfa(hedef);
    setAramaMetni('');
    setSeciliKategori('Tümü');
  };

  // Detay sayfasına geçiş fonksiyonu
  const detaylaraGit = (etkinlik: Etkinlik) => {
    setSeciliEtkinlik(etkinlik);
    setAktifSayfa('detay');
  };

  // Güncelleme İşlemi
  const etkinligiGuncelle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!seciliEtkinlik) return;

    const formData = new FormData(e.currentTarget);
    const guncellenmisEtkinlik: Etkinlik = {
      ...seciliEtkinlik,
      baslik: formData.get('baslik') as string,
      kategori: formData.get('kategori') as string,
      tarih: formData.get('tarih') as string,
      saat: formData.get('saat') as string,
      yer: formData.get('yer') as string,
      kontenjan: Number(formData.get('kontenjan')),
      aciklama: formData.get('aciklama') as string,
    };

    // Etkinlik listesini güncelle
    setEtkinlikler(etkinlikler.map(etk => etk.id === guncellenmisEtkinlik.id ? guncellenmisEtkinlik : etk));
    // Detay sayfasındaki veriyi güncelle
    setSeciliEtkinlik(guncellenmisEtkinlik);
    // Detay sayfasına geri dön
    setAktifSayfa('detay');
  };

  // Filtreleme Mantığı (Hem arama hem kategori seçimi)
  const filtrelenmisEtkinlikler = etkinlikler.filter(e => {
    const metinUygun = e.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) || e.aciklama.toLowerCase().includes(aramaMetni.toLowerCase());
    const kategoriUygun = seciliKategori === 'Tümü' || e.kategori === seciliKategori;
    return metinUygun && kategoriUygun;
  });

  // --- ORTAK BİLEŞENLER ---
  // Ekran görüntüsündeki yeşil kart tasarımı
  const EtkinlikKarti = ({ e }: { e: Etkinlik }) => (
    <div style={{ border: '1px solid #ddd', borderTop: '4px solid #1a933d', borderRadius: '4px', padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>{e.baslik}</h3>
      <div><span style={{ color: '#1a933d', background: '#e8f5e9', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{e.kategori}</span></div>
      <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Tarih: {e.tarih}, {e.saat}</p>
      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Yer: {e.yer}</p>
      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Kontenjan: {e.kontenjan} kişi</p>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>{e.aciklama}</p>
      <div style={{ marginTop: 'auto' }}>
        <button onClick={() => detaylaraGit(e)} style={{ background: 'none', border: 'none', color: '#1a933d', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Detayları gör</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f5f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- DİNAMİK YEŞİL ÜST KISIM (HEADER) --- */}
      <header style={{ background: '#1a933d', color: 'white', padding: '40px 40px 0 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {aktifSayfa === 'anasayfa' && (
            <>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Kampüs Etkinlikleri</h1>
              <p style={{ margin: '0 0 30px 0', fontSize: '16px' }}>Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.</p>
            </>
          )}
          {aktifSayfa === 'etkinlikler' && (
            <>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Tüm Etkinlikler</h1>
              <p style={{ margin: '0 0 30px 0', fontSize: '16px' }}>Ekim ayında kampüste düzenlenen etkinlikler.</p>
            </>
          )}
          {aktifSayfa === 'ekle' && (
            <h1 style={{ margin: '0 0 30px 0', fontSize: '32px' }}>Etkinlik Ekle</h1>
          )}
          {aktifSayfa === 'detay' && (
            <h1 style={{ margin: '0 0 30px 0', fontSize: '32px' }}>Etkinlik Detayı</h1>
          )}
          {aktifSayfa === 'guncelle' && (
            <h1 style={{ margin: '0 0 30px 0', fontSize: '32px' }}>Etkinliği Güncelle</h1>
          )}

          {/* Sekmeler (Tablar) */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => sayfayaGit('anasayfa')} style={sekmeStili(aktifSayfa === 'anasayfa')}>Ana Sayfa</button>
            <button onClick={() => sayfayaGit('etkinlikler')} style={sekmeStili(aktifSayfa === 'etkinlikler')}>Etkinlikler</button>
            <button onClick={() => sayfayaGit('ekle')} style={sekmeStili(aktifSayfa === 'ekle')}>Ekle</button>
          </div>
        </div>
      </header>

      {/* --- İÇERİK ALANI --- */}
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* 1. ANA SAYFA */}
        {aktifSayfa === 'anasayfa' && (
          <div>
            <h2 style={{ color: '#333', fontSize: '22px', marginBottom: '20px' }}>Yaklaşan 2 Etkinlik</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {etkinlikler.slice(0, 2).map(e => <EtkinlikKarti key={e.id} e={e} />)}
            </div>
            <button onClick={() => sayfayaGit('etkinlikler')} style={{ background: '#1a933d', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Tüm etkinlikleri gör
            </button>
          </div>
        )}

        {/* 2. ETKİNLİKLER LİSTESİ */}
        {aktifSayfa === 'etkinlikler' && (
          <div>
            {/* Filtre Alanı */}
            <div style={{ display: 'flex', gap: '20px', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Etkinlik ara</label>
                <input type="text" placeholder="Örn. atölye, kariyer" value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Kategori</label>
                <select value={seciliKategori} onChange={(e) => setSeciliKategori(e.target.value)} style={inputStyle}>
                  <option value="Tümü">Tümü</option>
                  <option value="Seminer">Seminer</option>
                  <option value="Atölye">Atölye</option>
                </select>
              </div>
            </div>
            
            <p style={{ color: '#1a933d', fontWeight: 'bold', marginBottom: '20px' }}>{filtrelenmisEtkinlikler.length} etkinlik listeleniyor.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {filtrelenmisEtkinlikler.map(e => <EtkinlikKarti key={e.id} e={e} />)}
            </div>
          </div>
        )}

        {/* 3. ETKİNLİK EKLE */}
        {aktifSayfa === 'ekle' && (
          <div style={{ maxWidth: '600px' }}>
            <p style={{ color: '#555', marginBottom: '30px' }}>Bu sprintte form sadece görünüm; kayıt yapılmaz.</p>
            
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Etkinlik Adı</label>
                <input type="text" placeholder="Örn. Kariyer Günleri 2026" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select style={inputStyle}>
                  <option>Seçiniz</option>
                  <option>Seminer</option>
                  <option>Atölye</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tarih</label>
                <input type="text" placeholder="Örn. 12 Ekim 2026" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Saat</label>
                <input type="time" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Yer</label>
                <input type="text" placeholder="Örn. A Blok Konferans Salonu" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kontenjan</label>
                <input type="number" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Açıklama</label>
                <textarea rows={4} style={inputStyle}></textarea>
              </div>
              <button 
                type="submit" 
                style={{ background: '#1a933d', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Kaydet
              </button>
            </form>
          </div>
        )}

        {/* 4. ETKİNLİK DETAY SAYFASI */}
        {aktifSayfa === 'detay' && seciliEtkinlik && (
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            
            <button 
              onClick={() => sayfayaGit('etkinlikler')} 
              style={{ background: 'none', border: 'none', color: '#1a933d', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ← Geri Dön
            </button>

            <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '10px', marginTop: 0 }}>{seciliEtkinlik.baslik}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#1a933d', background: '#e8f5e9', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                {seciliEtkinlik.kategori}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px', color: '#555', marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}><strong>📅 Tarih ve Saat:</strong> {seciliEtkinlik.tarih}, {seciliEtkinlik.saat}</p>
              <p style={{ margin: 0 }}><strong>📍 Yer:</strong> {seciliEtkinlik.yer}</p>
              <p style={{ margin: 0 }}><strong>👥 Kontenjan:</strong> {seciliEtkinlik.kontenjan} kişi</p>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>Etkinlik Hakkında</h3>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', margin: 0 }}>{seciliEtkinlik.aciklama}</p>
            </div>

            {/* Sadece Güncelle Butonu Kaldı */}
            <div style={{ marginTop: '30px' }}>
              <button 
                onClick={() => setAktifSayfa('guncelle')}
                style={{ width: '100%', background: '#f39c12', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                Etkinliği Güncelle
              </button>
            </div>
            
          </div>
        )}

        {/* 5. ETKİNLİK GÜNCELLEME SAYFASI */}
        {aktifSayfa === 'guncelle' && seciliEtkinlik && (
          <div style={{ maxWidth: '600px' }}>
            
            <button 
              onClick={() => setAktifSayfa('detay')} 
              style={{ background: 'none', border: 'none', color: '#1a933d', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ← Detaylara Dön
            </button>

            <form onSubmit={etkinligiGuncelle} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Etkinlik Adı</label>
                <input name="baslik" type="text" defaultValue={seciliEtkinlik.baslik} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select name="kategori" defaultValue={seciliEtkinlik.kategori} style={inputStyle}>
                  <option>Seminer</option>
                  <option>Atölye</option>
                  <option>Söyleşi</option>
                  <option>Diğer</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tarih</label>
                <input name="tarih" type="text" defaultValue={seciliEtkinlik.tarih} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Saat</label>
                <input name="saat" type="time" defaultValue={seciliEtkinlik.saat} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Yer</label>
                <input name="yer" type="text" defaultValue={seciliEtkinlik.yer} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Kontenjan</label>
                <input name="kontenjan" type="number" defaultValue={seciliEtkinlik.kontenjan} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Açıklama</label>
                <textarea name="aciklama" rows={4} defaultValue={seciliEtkinlik.aciklama} style={inputStyle} required></textarea>
              </div>
              <button 
                type="submit" 
                style={{ background: '#1a933d', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Değişiklikleri Kaydet
              </button>
            </form>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer style={{ textAlign: 'center', padding: '30px', color: '#777', fontSize: '12px', marginTop: 'auto' }}>
        Orhan Öztekin - 2416501017 - 2026
      </footer>

    </div>
  );
}

// Tasarım Yardımcıları (Stiller)
const sekmeStili = (aktif: boolean) => ({
  background: aktif ? 'white' : 'transparent',
  color: aktif ? '#1a933d' : 'white',
  border: 'none',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  cursor: 'pointer'
});

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box' as const,
  fontSize: '14px'
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '8px',
  fontSize: '14px'
};
