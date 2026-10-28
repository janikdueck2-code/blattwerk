exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  if (!process.env.PLANTNET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "API-Key fehlt" }) };
  }
  try {
    const { image, organ } = JSON.parse(event.body);
    const buf = Buffer.from(image, "base64");

    const form = new FormData();
    form.append("images", new Blob([buf], { type: "image/jpeg" }), "foto.jpg");
    form.append("organs", organ || "auto");

    const url =
      "https://my-api.plantnet.org/v2/identify/all" +
      "?lang=de&nb-results=3&api-key=" + process.env.PLANTNET_KEY;

    const res = await fetch(url, { method: "POST", body: form });
    const data = await res.json();

    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
