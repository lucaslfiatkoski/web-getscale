import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Obtém o objeto de localização (rota atual)
  const { pathname } = useLocation();

  // Executa o efeito sempre que o 'pathname' (a rota) mudar
  useEffect(() => {
    // Rola a janela para o topo (posição 0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // <-- O efeito roda sempre que o pathname (caminho da URL) muda

  // Este componente não renderiza nada, apenas lida com o efeito colateral
  return null;
}

export default ScrollToTop;