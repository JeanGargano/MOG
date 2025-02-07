export const Post = async (responses) => {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwAAXCYWJwH6ykZPWMhXhFT_soenJc0o2yBUpnfxOHjlY9XztB0Dqi3dfAJR0jp06-KTw/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responses),
        });

        if (response.ok) {
            alert("Respuestas enviadas correctamente");
        } else {
            alert("Error al enviar respuestas");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo enviar la respuesta");
    }
};
