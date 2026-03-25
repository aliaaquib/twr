const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getApiUrl = () => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing. Add it to frontend/.env.local.");
  }

  return API_URL.replace(/\/$/, "");
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "Request failed.";
    throw new Error(message);
  }

  return data;
};

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/posts`, {
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch {
    return [];
  }
};

export const fetchFeaturedPost = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/posts/featured`, {
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch {
    return null;
  }
};

export const fetchHotItems = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/hot`, {
      cache: "no-store",
    });

    return await parseResponse(response);
  } catch {
    return [];
  }
};

export const fetchPost = async (id) => {
  const response = await fetch(`${getApiUrl()}/posts/${id}`, {
    cache: "no-store",
  });

  return parseResponse(response);
};
