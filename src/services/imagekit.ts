import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export const uploadToImageKit = async (file: Buffer, fileName: string) => {
  const response = await imagekit.upload({
    file,
    fileName,
  });
  return response;
};
