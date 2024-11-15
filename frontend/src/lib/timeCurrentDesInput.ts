export const formatTimeDifference = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const diffInMilliseconds = now.getTime() - createdDate.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const days = diffInDays;
  const hours = diffInHours % 24;
  const minutes = diffInMinutes % 60;
  const seconds = diffInSeconds % 60;

  let timeDiff = "";

  if (days > 0) {
    timeDiff += `${days} ngày, `;
  } else if (hours > 0) {
    timeDiff += `${hours} giờ, `;
  } else if (minutes > 0) {
    timeDiff += `${minutes} phút, `;
  } else {
    timeDiff += `${seconds} giây`;
  }

  // Remove trailing comma and space
  timeDiff = timeDiff.replace(/,\s$/, "");

  return `${timeDiff} trước`;
};
