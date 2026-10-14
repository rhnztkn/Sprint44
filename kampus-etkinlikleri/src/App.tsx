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
        <button style={{ background: 'none', border: 'none', color: '#1a933d', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Detayları gör</button>
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
                <input type="date" style={inputStyle} />
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