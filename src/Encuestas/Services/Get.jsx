export const fetchForms = async () => {
  const callbackName = "handleJsonpResponse"; // Nombre de la función de callback
  const script = document.createElement("script");

  return new Promise((resolve, reject) => {
    // Definir la función de callback global
    window[callbackName] = (data) => {
      // Limpiar el script y la función de callback
      document.body.removeChild(script);
      delete window[callbackName];

      // Guardar en caché y resolver la promesa
      localStorage.setItem("cachedForms", JSON.stringify(data));
      resolve(data);
    };

    // Manejar errores
    script.onerror = () => {
      document.body.removeChild(script);
      delete window[callbackName];

      // Intentar usar datos en caché
      const cachedData = localStorage.getItem("cachedForms");
      if (cachedData) {
        console.warn("Modo offline: usando datos guardados.");
        resolve(JSON.parse(cachedData));
      } else {
        reject(new Error("No se pudieron obtener los formularios y no hay datos en caché."));
      }
    };

    // Configurar el script para hacer la solicitud JSONP
    script.src = `https://script.google.com/macros/s/AKfycbwho6oeZEaKXqFLZ0eTGqm9AruQCrxvYno_t4M-cgMc7qT-K0H9QP7i9n3KipeYJ8LmiA/exec?callback=${callbackName}`;
    document.body.appendChild(script);

  });

};

