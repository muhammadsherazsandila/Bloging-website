export const convertImageToBase64 = (buffer, mimeType) => {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;
  return dataUri;
};

export const formatDate = (date) => {
  if (!(date instanceof Date)) return null;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
