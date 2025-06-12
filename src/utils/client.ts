const endpoint = "https://www.tansongchen.workers.dev";

export async function get(
  route: string,
  query: Record<string, string>
): Promise<any | void> {
  try {
    const url = `${endpoint}${route}?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {}
}

export async function put(route: string, data: any): Promise<any | void> {
  try {
    const response = await fetch(endpoint + route, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    });
    window.alert("提交成功！");
    return response.json();
  } catch (error) {
    window.alert("提交失败！");
  }
}
