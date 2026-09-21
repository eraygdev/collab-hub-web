import React from 'react';

function App() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* ARKADA KOCAMAN KALP VE ŞEVVAL MİRAY YAZISI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-25">
        <div className="text-[14rem] sm:text-[20rem] animate-pulse">
          ❤️
        </div>
        <h1 className="absolute text-4xl sm:text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-center drop-shadow-[0_10px_20px_rgba(236,72,153,0.5)]">
          ŞEVVAL & MİRAY
        </h1>
      </div>

      {/* MOBİL GÖRÜNÜM KUTUSU (ORTADAKİ KART) */}
      <div className="relative z-10 w-full max-w-sm p-8 mx-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl text-center">
        <div className="text-4xl mb-4">💖</div>
        <h2 className="text-2xl font-bold text-white mb-2">Collab Hub</h2>
        <p className="text-slate-400 text-sm mb-6">
          Şevval ve Miray için özel olarak tasarlandı.
        </p>
        
        <button 
          onClick={() => alert('Kalpler sizinle! ❤️')}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95"
        >
          Kalbe Dokun
        </button>
      </div>

    </div>
  );
}

export default App;