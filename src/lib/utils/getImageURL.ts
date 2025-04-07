const getImageURL = (bucketName: string, path: string) => {
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
};

export default getImageURL;
