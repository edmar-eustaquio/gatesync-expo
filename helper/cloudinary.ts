import axios from "axios";

const uploadImage = async (file:any, filename:string | undefined) => {
  const formData = new FormData();
  const imageExtension = file.fileName.substring(
    file.fileName.lastIndexOf(".")
  );

  formData.append("file", {
    uri: file.uri,
    type: "image/jpeg",
    name: filename + imageExtension,
  } as any);
  formData.append("upload_preset", "upload_file");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/diwwrxy8b/image/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.secure_url;
};

export { uploadImage };
