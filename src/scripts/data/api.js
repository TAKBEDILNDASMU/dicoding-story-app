import { ACCESS_TOKEN_KEY, BASE_URL } from '../config';

const ENDPOINTS = {
  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORY_CREATE: `${BASE_URL}/stories`,
};

export async function getDetailStory(storyId) {
  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(storyId), {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN_KEY}` },
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN_KEY}` },
  });

  const json = await fetchResponse.json(0);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory({ image, location, description }) {
  const formData = new FormData();
  formData.set('description', description);
  formData.set('photo', image);
  formData.set('lat', location.lat);
  formData.set('lon', location.lng);

  try {
    const fetchResponse = await fetch(ENDPOINTS.STORY_CREATE, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN_KEY}` },
      body: formData,
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
