async function main(prompt) {
  try {
    const res = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from Gemini function");
    }

    const data = await res.json();

    // If your Netlify function returns structured data, you can extract text here
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(data, null, 2);

    console.log(text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export default main;
