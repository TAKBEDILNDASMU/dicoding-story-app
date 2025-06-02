import { BASE_URL } from '../config';
import { getAuthToken, storeAuthToken } from '../utils/localStorage';
import { arrayBufferToBase64 } from '../utils/urlParser';

const ENDPOINTS = {
  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORY_CREATE: `${BASE_URL}/stories`,
  LOGIN: `${BASE_URL}/login`,

  // Report Comment
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
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
  token = getAuthToken();

  if (!token) {
    token = await login();
    // save the token to local storage
    if (token) {
      storeAuthToken(token);
    }
  }
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

export async function pushNotification(subscription) {
  // Transform the subscription to match the API schema
  const subscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
    },
  };
  try {
    const response = await fetch(ENDPOINTS.NOTIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Subscription error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Subscription successful:', result);
    return result;
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    throw error;
  }
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
