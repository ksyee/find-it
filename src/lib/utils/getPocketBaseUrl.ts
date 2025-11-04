const ensureHttpsUrl = (url: string) => {
  if (!url) {
    return url;
  }

  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://')
  ) {
    return `https://${url.slice('http://'.length)}`;
  }

  return url;
};

export const getPocketBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_PB_API_URL ?? '';

  return ensureHttpsUrl(rawUrl);
};
