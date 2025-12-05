import React, { useState } from 'react';
import './App.css';

// QR Code Generator Component (simplified SVG-based)
const QRCode = ({ value, size = 120 }) => {
  const generatePattern = (text) => {
    const hash = text.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const pattern = [];
    for (let i = 0; i < 25; i++) {
      pattern.push((hash >> (i % 32)) & 1 || (i * hash) % 3 === 0);
    }
    return pattern;
  };
  
  const pattern = generatePattern(value);
  
  return (
    <svg width={size} height={size} viewBox="0 0 7 7" className="qr-code">
      <rect width="7" height="7" fill="white" rx="0.3" />
      {/* Corner patterns */}
      <rect x="0" y="0" width="2" height="2" fill="#1a1a2e" rx="0.2" />
      <rect x="5" y="0" width="2" height="2" fill="#1a1a2e" rx="0.2" />
      <rect x="0" y="5" width="2" height="2" fill="#1a1a2e" rx="0.2" />
      <rect x="0.3" y="0.3" width="1.4" height="1.4" fill="white" rx="0.1" />
      <rect x="5.3" y="0.3" width="1.4" height="1.4" fill="white" rx="0.1" />
      <rect x="0.3" y="5.3" width="1.4" height="1.4" fill="white" rx="0.1" />
      <rect x="0.5" y="0.5" width="1" height="1" fill="#1a1a2e" rx="0.1" />
      <rect x="5.5" y="0.5" width="1" height="1" fill="#1a1a2e" rx="0.1" />
      <rect x="0.5" y="5.5" width="1" height="1" fill="#1a1a2e" rx="0.1" />
      {/* Data pattern */}
      {pattern.slice(0, 9).map((filled, i) => 
        filled && (
          <rect 
            key={i} 
            x={2.5 + (i % 3) * 0.6} 
            y={2.5 + Math.floor(i / 3) * 0.6} 
            width="0.5" 
            height="0.5" 
            fill="#1a1a2e" 
            rx="0.05"
          />
        )
      )}
    </svg>
  );
};

// Card Templates
const cardTemplates = {
  birthday: {
    emoji: '🎂',
    title: 'Doğum Günü',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#667eea'
  },
  valentine: {
    emoji: '💕',
    title: 'Sevgililer Günü',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#f5576c'
  },
  anniversary: {
    emoji: '💍',
    title: 'Yıldönümü',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accent: '#4facfe'
  },
  newyear: {
    emoji: '🎊',
    title: 'Yılbaşı',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    accent: '#fa709a'
  }
};

// Bouquet Options
const bouquets = [
  { id: 1, name: 'Kırmızı Güller', emoji: '🌹', color: '#dc2626' },
  { id: 2, name: 'Beyaz Laleler', emoji: '🌷', color: '#ec4899' },
  { id: 3, name: 'Ayçiçekleri', emoji: '🌻', color: '#eab308' },
  { id: 4, name: 'Lavanta', emoji: '💜', color: '#8b5cf6' },
  { id: 5, name: 'Papatyalar', emoji: '🌼', color: '#fbbf24' },
  { id: 6, name: 'Orkideler', emoji: '🪻', color: '#a855f7' }
];

// AI Generated Content Templates
const generatePoem = (name, occasion) => {
  const poems = {
    birthday: `Bugün doğduğun gün ${name},\nYıldızlar bile kıskanır seni,\nHer anın mutlulukla dolsun,\nNice yıllara, sevgilim benim.`,
    valentine: `Kalbimin tek sahibi ${name},\nSensiz geçen anlar boşluk,\nSeninle her gün bayram,\nAşkımız sonsuza dek sürsün.`,
    anniversary: `${name}, seninle geçen her yıl,\nBir ömre bedel güzellikte,\nElele yürüdüğümüz bu yolda,\nSonsuza dek seninleyim.`,
    newyear: `Yeni yılda ${name} seninle,\nHer gün yeni bir başlangıç,\nUmutlarla dolu yarınlar,\nMutluluklar dilerim sana.`
  };
  return poems[occasion] || poems.birthday;
};

const generateMessage = (name, occasion) => {
  const messages = {
    birthday: `Sevgili ${name}, doğum günün kutlu olsun! 🎂 Hayatıma kattığın her an için teşekkür ederim. Bu özel günde tüm dileklerin gerçek olsun. Seni çok seviyorum! ❤️`,
    valentine: `Canım ${name}, sevgililer günümüz kutlu olsun! 💕 Seninle geçirdiğim her an paha biçilemez. Kalbim sonsuza dek senin. Seni dünden çok, yarından az seviyorum! 💖`,
    anniversary: `Değerli ${name}, yıldönümümüz kutlu olsun! 💍 Seninle geçirdiğimiz her yıl, hayatımın en güzel hediyesi. Nice mutlu yıllara birlikte! 🥂`,
    newyear: `Sevgili ${name}, yeni yılın kutlu olsun! 🎊 Bu yıl da seninle olmak en büyük şansım. Yeni yıl sana sağlık, mutluluk ve başarı getirsin! ✨`
  };
  return messages[occasion] || messages.birthday;
};

const generateSong = (name, occasion) => {
  const songs = {
    birthday: `🎵 "${name} İçin Doğum Günü Şarkısı"\n\nNakarat:\nBugün senin günün ${name},\nMutluluklar dilerim sana,\nNice yıllara sevgilim,\nHep seninle olmak isterim.\n\n(Bu şarkıyı senin için yazdım) 🎶`,
    valentine: `🎵 "${name}'a Aşk Şarkısı"\n\nNakarat:\nSeninle her şey güzel ${name},\nKalbim seninle çarpıyor,\nSonsuza dek seninleyim,\nAşkımız hiç bitmeyecek.\n\n(Kalbimden kalbine) 💕`,
    anniversary: `🎵 "Yıldönümü Şarkımız"\n\nNakarat:\nSeninle geçen yıllar ${name},\nHayatımın en güzel yanı,\nElele nice yıllara,\nHep seninle olacağım.\n\n(Bizim şarkımız) 💍`,
    newyear: `🎵 "Yeni Yıl Dileklerim"\n\nNakarat:\nYeni yılda ${name} seninle,\nHer şey daha güzel olacak,\nUmutlarla dolu yarınlar,\nBirlikte karşılayacağız.\n\n(Yeni yıla beraber) 🎊`
  };
  return songs[occasion] || songs.birthday;
};

function App() {
  const [step, setStep] = useState('home');
  const [cardType, setCardType] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [selectedBouquet, setSelectedBouquet] = useState(null);
  const [contentType, setContentType] = useState('message');
  const [customMessage, setCustomMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [cardSent, setCardSent] = useState(false);
  const [cardId, setCardId] = useState('');

  // Generate AI Content
  const handleGenerate = () => {
    if (!recipientName) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      let content = '';
      switch (contentType) {
        case 'poem':
          content = generatePoem(recipientName, cardType);
          break;
        case 'song':
          content = generateSong(recipientName, cardType);
          break;
        default:
          content = generateMessage(recipientName, cardType);
      }
      setCustomMessage(content);
      setIsGenerating(false);
    }, 1500);
  };

  // Send Card
  const handleSendCard = () => {
    if (!isPro && freeUsed) {
      setShowProModal(true);
      return;
    }
    
    const newCardId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCardId(newCardId);
    setCardSent(true);
    if (!isPro) setFreeUsed(true);
  };

  // Reset
  const handleNewCard = () => {
    if (!isPro && freeUsed) {
      setShowProModal(true);
      return;
    }
    setStep('home');
    setCardType(null);
    setRecipientName('');
    setSenderName('');
    setSelectedBouquet(null);
    setContentType('message');
    setCustomMessage('');
    setCardSent(false);
    setCardId('');
  };

  // Copy link
  const copyLink = () => {
    const cardUrl = `${window.location.origin}${window.location.pathname}?card=${cardId}`;
    navigator.clipboard.writeText(cardUrl);
    alert('Link kopyalandı!');
  };

  // Share WhatsApp
  const shareWhatsApp = () => {
    const cardUrl = `${window.location.origin}${window.location.pathname}?card=${cardId}`;
    const text = `💕 ${recipientName} için özel bir kart hazırladım!\n\n${cardTemplates[cardType]?.emoji} ${cardTemplates[cardType]?.title} Kartı\n\n${customMessage.substring(0, 100)}${customMessage.length > 100 ? '...' : ''}\n\nSevgiyle, ${senderName} 💕`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="app">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">LoveCards</h1>
          <p className="tagline">DİJİTAL SEVGİ KARTLARI</p>
          {isPro ? (
            <div className="pro-badge">✨ PRO Üye</div>
          ) : (
            <div className="pro-badge" onClick={() => setShowProModal(true)}>
              👑 Pro'ya Yükselt
              <span className={`free-badge ${freeUsed ? 'used' : ''}`}>
                {freeUsed ? 'Ücretsiz hak kullanıldı' : '1 Ücretsiz Gönderim'}
              </span>
            </div>
          )}
        </header>

        {/* Home - Card Type Selection */}
        {step === 'home' && (
          <>
            <h2 className="section-title">✨ Kart Türü Seçin</h2>
            <div className="card-types">
              {Object.entries(cardTemplates).map(([key, template]) => (
                <div
                  key={key}
                  className={`card-type ${cardType === key ? 'selected' : ''}`}
                  onClick={() => setCardType(key)}
                >
                  <span className="card-type-emoji">{template.emoji}</span>
                  <span className="card-type-title">{template.title}</span>
                </div>
              ))}
            </div>

            <button
              className="primary-btn"
              disabled={!cardType}
              onClick={() => setStep('create')}
            >
              Kartımı Oluştur →
            </button>
          </>
        )}

        {/* Create Card */}
        {step === 'create' && !cardSent && (
          <>
            <button className="back-btn" onClick={() => setStep('home')}>
              ← Geri
            </button>

            <div className="form-section">
              <h2 className="section-title">
                {cardTemplates[cardType]?.emoji} {cardTemplates[cardType]?.title} Kartı
              </h2>

              <div className="input-group">
                <label className="input-label">Kime gönderiyorsun? 💝</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Sevgilinin adı..."
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Senin adın 💫</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Adını yaz..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">💐 Buket Seç</h2>
              <div className="bouquet-grid">
                {bouquets.map((bouquet) => (
                  <div
                    key={bouquet.id}
                    className={`bouquet-item ${selectedBouquet === bouquet.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBouquet(bouquet.id)}
                  >
                    <span className="bouquet-emoji">{bouquet.emoji}</span>
                    <span className="bouquet-name">{bouquet.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">✍️ İçerik Oluştur</h2>
              
              <div className="content-tabs">
                <div
                  className={`content-tab ${contentType === 'message' ? 'active' : ''}`}
                  onClick={() => setContentType('message')}
                >
                  <span className="content-tab-icon">💌</span>
                  Mesaj
                </div>
                <div
                  className={`content-tab ${contentType === 'poem' ? 'active' : ''}`}
                  onClick={() => setContentType('poem')}
                >
                  <span className="content-tab-icon">📝</span>
                  Şiir
                </div>
                <div
                  className={`content-tab ${contentType === 'song' ? 'active' : ''}`}
                  onClick={() => setContentType('song')}
                >
                  <span className="content-tab-icon">🎵</span>
                  Şarkı
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={!recipientName || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner" />
                    AI ile oluşturuluyor...
                  </>
                ) : (
                  <>
                    <span className="sparkle">✨</span>
                    AI ile {contentType === 'message' ? 'Mesaj' : contentType === 'poem' ? 'Şiir' : 'Şarkı'} Oluştur
                  </>
                )}
              </button>

              <textarea
                className="input-field"
                placeholder={`${recipientName || 'Sevgilin'} için ${contentType === 'message' ? 'mesajını' : contentType === 'poem' ? 'şiirini' : 'şarkını'} yaz veya AI ile oluştur...`}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            {/* Preview */}
            {(recipientName || customMessage) && (
              <div className="preview-card">
                <div className="preview-header">
                  <span className="preview-emoji">{cardTemplates[cardType]?.emoji}</span>
                  <h3 className="preview-title">{cardTemplates[cardType]?.title} Kartı</h3>
                  <p className="preview-subtitle">Sevgili {recipientName || '...'} için</p>
                </div>

                {selectedBouquet && (
                  <div className="preview-bouquet">
                    {bouquets.find(b => b.id === selectedBouquet)?.emoji}
                  </div>
                )}

                {customMessage && (
                  <div className="preview-content">
                    {customMessage}
                  </div>
                )}

                <div className="preview-footer">
                  <p className="preview-from">Sevgiyle, {senderName || '...'} 💕</p>
                </div>
              </div>
            )}

            <button
              className="primary-btn"
              disabled={!recipientName || !customMessage}
              onClick={handleSendCard}
            >
              {freeUsed && !isPro ? '👑 Pro ile Gönder' : '🚀 Kartı Gönder'}
            </button>
          </>
        )}

        {/* Card Sent Success */}
        {cardSent && (
          <>
            <div className="form-section" style={{ textAlign: 'center', paddingTop: '20px' }}>
              <div className="success-check">✓</div>
              <h2 className="section-title" style={{ justifyContent: 'center' }}>
                Kartın Hazır! 🎉
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                {recipientName} için hazırladığın kart paylaşıma hazır!
              </p>
            </div>

            {/* Final Card Preview */}
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-emoji">{cardTemplates[cardType]?.emoji}</span>
                <h3 className="preview-title">{cardTemplates[cardType]?.title}</h3>
                <p className="preview-subtitle">Sevgili {recipientName} için</p>
              </div>

              {selectedBouquet && (
                <div className="preview-bouquet">
                  {bouquets.find(b => b.id === selectedBouquet)?.emoji}
                </div>
              )}

              <div className="preview-content">
                {customMessage}
              </div>

              <div className="preview-footer">
                <p className="preview-from">Sevgiyle, {senderName} 💕</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-section">
              <p className="qr-title">QR Kod ile Paylaş</p>
              <QRCode value={`lovecards.app/c/${cardId}`} size={140} />
              <div className="card-link">
                lovecards.app/c/{cardId}
              </div>
              
              <div className="share-buttons">
                <button className="share-btn whatsapp" onClick={shareWhatsApp}>
                  📱 WhatsApp
                </button>
                <button className="share-btn" onClick={copyLink}>
                  📋 Linki Kopyala
                </button>
              </div>
            </div>

            <button className="primary-btn" onClick={handleNewCard}>
              {freeUsed && !isPro ? '👑 Pro ile Yeni Kart' : '✨ Yeni Kart Oluştur'}
            </button>
            
            <button className="secondary-btn" onClick={() => {
              setCardSent(false);
              setStep('home');
              setCardType(null);
              setRecipientName('');
              setSenderName('');
              setSelectedBouquet(null);
              setCustomMessage('');
            }}>
              Ana Sayfaya Dön
            </button>
          </>
        )}
      </div>

      {/* Pro Modal */}
      {showProModal && (
        <div className="modal-overlay" onClick={() => setShowProModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="modal-icon">👑</span>
            <h3 className="modal-title">Pro'ya Yükselt</h3>
            <p className="modal-text">
              Sınırsız kart oluştur ve sevdiklerine sınırsız sevgi gönder!
            </p>
            
            <div className="pro-features">
              <div className="pro-feature">✅ Sınırsız kart gönderimi</div>
              <div className="pro-feature">✅ Özel tasarım şablonları</div>
              <div className="pro-feature">✅ Gelişmiş AI içerik oluşturma</div>
              <div className="pro-feature">✅ Reklamsız deneyim</div>
              <div className="pro-feature">✅ Öncelikli destek</div>
            </div>

            <div className="pro-price">
              ₺49.99 <span>/ ay</span>
            </div>

            <button 
              className="primary-btn" 
              style={{ marginTop: 0 }}
              onClick={() => {
                setIsPro(true);
                setShowProModal(false);
              }}
            >
              Pro Üye Ol 🚀
            </button>
            
            <button 
              className="secondary-btn"
              onClick={() => setShowProModal(false)}
            >
              Daha Sonra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
