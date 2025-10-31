
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // account for sticky header
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100); 
    }
  }, [hash]);

  return null;
}
