const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
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

export async function createProduct(productData) {
  return fetchAPI("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function getOrders(userId) {
  return fetchAPI(`/orders?userId=${userId}`);
}
