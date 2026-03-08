export class KaneoClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
  }

  private headers(withBody = false): Record<string, string> {
    const h: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
    };
    if (withBody) {
      h["Content-Type"] = "application/json";
    }
    return h;
  }

  private async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: this.headers(!!body),
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        `Kaneo API error ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
      );
    }

    return data;
  }

  async get(path: string): Promise<unknown> {
    return this.request("GET", path);
  }

  async post(path: string, body?: unknown): Promise<unknown> {
    return this.request("POST", path, body);
  }

  async put(path: string, body?: unknown): Promise<unknown> {
    return this.request("PUT", path, body);
  }

  async patch(path: string, body?: unknown): Promise<unknown> {
    return this.request("PATCH", path, body);
  }

  async delete(path: string, body?: unknown): Promise<unknown> {
    return this.request("DELETE", path, body);
  }
}
