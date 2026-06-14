export const getImageUrl = (rawPath: string | null | undefined) => {
  if (!rawPath || rawPath === 'null' || rawPath === 'undefined' || rawPath.trim() === '') return null;
  
  const imagePath = rawPath.replace(/\\/g, '/');
  if (imagePath.startsWith('blob:')) return imagePath;

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const isDev = import.meta.env.DEV;

  if (imagePath.startsWith('http')) {
    try {
      const url = new URL(imagePath);
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      const isApiHost = baseUrl && url.hostname === new URL(baseUrl).hostname;
      const isKnownIP = url.hostname === '163.245.192.54';
      
      if (isLocalhost || isApiHost || isKnownIP) {
        return isDev ? `/api-proxy${url.pathname}` : `${baseUrl}${url.pathname}`;
      }
      return imagePath;
    } catch (e) {
      return imagePath;
    }
  }
  
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return isDev ? `/api-proxy${path}` : `${baseUrl}${path}`;
};
