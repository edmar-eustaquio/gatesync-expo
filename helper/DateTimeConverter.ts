export const DateTimeConverter = (datetime: any) => {
  if (!datetime) return null;
  try {
    const date = datetime.toDate();

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (e) {
    return null;
  }
};


export const timestampToDateStringConverter = (datetime:any) => {
  if (!datetime) return null;
  try {
    const date = datetime.toDate();
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  } catch (e) {
    return null;
  }
};
