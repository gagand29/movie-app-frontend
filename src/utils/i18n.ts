export async function getTranslator(locale: string) {
    try {
      const response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) throw new Error("Failed to load translations");
  
      const messages = await response.json();
      return (key: string) => messages[key] || key; // Return a function
    } catch (error) {
      console.error("Translation Error:", error);
      return (key: string) => key; // Fallback function
    }
  }
  