import React, { useState } from 'react';

function App() {
  const [hearts, setHearts] = useState([]);

  // Kalp fırlatma fonksiyonu
  const handleHeartExplosion = () => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 280 - 140, // Rastgele X yönü
      y: Math.random() * -250 - 50, // Yukarı doğru rastgele uçuş
      scale: Math.random() * 1.5 + 0.5,
      rotate: Math.random() * 360,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // 1 saniye sonra ekrandan silinsin ki şişme yapmasın
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1000);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950 font-sans select-none">
      
      {/* ARKADA KOCAMAN KALPLER VE ŞEVVAL MİRAYYYYY YAZISI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-20">
        <div className="text-[14rem] sm:text-[22rem] animate-pulse">
          💖
        </div>
        <h1 className="absolute text-3xl sm:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-500 to-purple-500 text-center px-4">
          ŞEVVAL MİRAYYYYY
        </h1>
      </div>

      {/* MOBİL GÖRÜNÜM KUTUSU (TELEFON EKRANI HİSSİ) */}
      <div className="relative z-10 w-full max-w-sm p-8 mx-4 bg-slate-900/85 backdrop-blur-xl border border-pink-500/30 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.2)] text-center">
        
        <div className="text-5xl mb-3 animate-bounce cursor-pointer" onClick={handleHeartExplosion}>
          ❤️
        </div>
        
        <h2 className="text-3xl font-extrabold text-white mb-1 tracking-wide">
          Şevval Mirayyyyy
        </h2>
        <p className="text-pink-400 text-xs tracking-widest uppercase mb-8 font-medium">
          Sonsuza Kadar Kalplerde ✨
        </p>
        
        {/* KALPLER FIRLATMA BUTONU */}
        <div className="relative">
          <button 
            onClick={handleHeartExplosion}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 transition-all duration-300 transform active:scale-95 text-lg"
          >
            Kalpleri Fırlat! 💘
          </button>

          {/* UÇUŞAN KALPLER ANİMASYONU */}
          {hearts.map((heart) => (
            <span
              key={heart.id}
              className="absolute left-1/2 top-1/2 text-2xl pointer-events-none animate-ping"
              style={{
                transform: `translate(${heart.x}px, ${heart.y}px) scale(${heart.scale}) rotate(${heart.rotate}deg)`,
                transition: 'all 0.8s ease-out',
              }}
            >
              💖
            </span>
          ))}
        </div>

      </div>

    </div>
  );
}

export default App;