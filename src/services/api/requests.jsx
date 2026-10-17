import { apiUrl } from "./config";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(apiUrl(endpoint), {
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      let message = "No se pudo completar la solicitud.";

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          if (typeof errorData.detail === "string") {
            message = errorData.detail;
          }
        } catch {
          // Ignorar errores de parseo
        }
      }

      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    if (error.status !== 401) console.error("Error de conexión:", error);
    throw error;
  }
}

async function fetchData(endpoint) {
  return request(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}

async function postData(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function postFormData(endpoint, formData) {
  return request(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
}

async function patchData(endpoint, body) {
  return request(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function putData(endpoint, body) {
  return request(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function deleteData(endpoint) {
  return request(endpoint, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
}

export { deleteData, fetchData, patchData, postData, postFormData, putData };
