const baseURL = "http://localhost:8081/"

const token = localStorage.getItem("accessToken");

async function checkResponse(response) {
    if (!response.ok) {
        // Đọc body json hoặc text 1 lần
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
            const text = await response.text();
            if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
    }

    // Nếu ok thì cũng đọc json 1 lần
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return null;
}


export async function post(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}

export async function get(url) {
    const response = await fetch(baseURL + url
        // , {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`, // Gửi token trong header
        //     },
        // }
    );
    return checkResponse(response);
}

export async function del(url) {
    const response = await fetch(baseURL + url, { method: 'DELETE' });
    return checkResponse(response);
}

export async function patch(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}

export async function put(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}