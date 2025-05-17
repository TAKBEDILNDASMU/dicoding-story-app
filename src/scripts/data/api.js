import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORY_CREATE: `${BASE_URL}/stories`,
  LOGIN: `${BASE_URL}/login`,
};

let token;

// Login function that saves token upon successful login
export async function login(email, password) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'patrickstar@bikinibottom.com',
        password: password || 'patrick123',
      }),
    });

    const { loginResult } = await fetchResponse.json();

    return loginResult.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Function to check if token exists and is valid on page load
export async function initializeAuth() {
  token = await login();
}

export async function getDetailStory(storyId) {
  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(storyId), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
    headers: { Authorization: `Bearer ${token}` },
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
      headers: { Authorization: `Bearer ${token}` },
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
