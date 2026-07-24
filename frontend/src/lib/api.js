const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const { headers: customHeaders, ...fetchOptions } = options;
  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/products${query ? `?${query}` : ""}`);
}

export async function getProduct(slug) {
  return fetchAPI(`/products/${slug}`);
}

export async function getCategories() {
  return fetchAPI("/categories");
}

export async function getCategory(slug) {
  return fetchAPI(`/categories/${slug}`);
}

export async function getBrands() {
  return fetchAPI("/brands");
}

export async function getTestimonials() {
  return fetchAPI("/testimonials");
}

export async function getFeatures() {
  return fetchAPI("/features");
}

export async function getFlashDeals() {
  return fetchAPI("/products?deals=true");
}

export async function createOrder(orderData) {
  return fetchAPI("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrders(userId) {
  return fetchAPI(`/orders?userId=${userId}`);
}

export async function getCart(userId) {
  return fetchAPI(`/cart/${userId}`);
}

export async function updateCart(userId, items) {
  return fetchAPI(`/cart/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
}

export async function getWishlist(userId) {
  return fetchAPI(`/wishlist/${userId}`);
}

export async function updateWishlist(userId, items) {
  return fetchAPI(`/wishlist/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
}
