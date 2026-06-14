import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaCommentDots, FaTimes, FaPaperPlane, FaCut } from "react-icons/fa";

// Anda bisa mengganti URL logo ini dengan logo ikon gunting/barbershop Anda nanti
const AI_LOGO_URL = "https://i.ibb.co.com/TxSKgNWK/Logo-SAHAJA-AI.png";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true); // State untuk mendeteksi posisi Hero Section
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Welcome to HairCut. Ada yang bisa saya bantu terkait reservasi atau layanan grooming hari ini?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efek untuk mendeteksi Scroll (Apakah sedang di Hero Section atau bukan)
  useEffect(() => {
    const handleScroll = () => {
      // Mengubah warna ketika di-scroll lewat dari setengah layar (keluar dari Hero Section)
      if (window.scrollY < window.innerHeight * 0.5) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Panggil sekali saat pertama kali render
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = {
        role: "system",
        content: "Kamu adalah asisten virtual untuk barbershop premium bernama 'HairCut'. Jawablah dengan gaya bahasa yang profesional, maskulin, sopan, clean, dan edgy tanpa terkesan norak (tacky). Kamu harus menguasai layanan yang kami miliki: 1) HairCut Signature (Rp 75.000) - Potongan rambut presisi dengan pencucian, pijat kepala ringan, dan styling premium. 2) Classic Shave (Rp 35.000) - Cukur kumis dan jenggot tradisional menggunakan handuk hangat dan krim khusus. 3) Hair Coloring (Rp 150.000) - Pewarnaan rambut profesional, pilihan warna natural hingga kekinian. 4) Gentleman Facial (Rp 50.000) - Perawatan kulit wajah pria untuk membersihkan komedo dan menyegarkan kulit. Jika pengguna ingin melakukan reservasi atau potong rambut, arahkan mereka untuk menekan tombol 'Booking Sekarang' yang ada di website."
      };

      const apiUrl = import.meta.env.VITE_CEREBRAS_API_URL;
      const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;

      const response = await axios.post(
        apiUrl,
        {
          // Ubah bagian ini ke nama model API Anda yang sebenarnya
          model: "zai-glm-4.7", 
          messages: [systemPrompt, ...messages, userMessage],
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage = { role: "assistant", content: response.data.choices[0].message.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, sistem kami sedang sibuk. Silakan klik tombol 'Booking Sekarang' di halaman utama." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-zinc-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] rounded-2xl w-[350px] h-[500px] flex flex-col overflow-hidden mb-4 transition-all duration-300 transform origin-bottom-left">
          
          {/* Header - Tema Premium Hitam */}
          <div className="bg-black p-4 flex justify-between items-center text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-2">
                 <FaCut className="text-black text-xl" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-widest uppercase">HairCut AI</h3>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1 font-bold tracking-widest uppercase mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors duration-200">
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCut className="text-white text-[10px]" />
                    </div>
                  )}
                  <div className={`p-3 text-sm shadow-sm font-medium ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-2xl rounded-tr-sm" 
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-2xl rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCut className="text-white text-[10px]" />
                  </div>
                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-zinc-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya seputar layanan..."
              className="flex-1 bg-zinc-100 border border-transparent rounded-full px-4 py-2 text-sm outline-none focus:border-black focus:bg-white transition-all duration-200"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FaPaperPlane className="text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button - Dynamic Color */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } absolute bottom-0 left-0 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-500 z-50 ${
          isAtTop 
            ? "bg-white text-black hover:bg-zinc-200" 
            : "bg-[#09090b] text-white hover:bg-zinc-800 border border-zinc-800"
        }`}
      >
        <FaCommentDots className="text-xl" />
      </button>
    </div>
  );
}