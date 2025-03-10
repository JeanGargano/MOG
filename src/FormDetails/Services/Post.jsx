export const Post = async (formTitle, responses) => {
    try {
        const responsesWithTitle = {
            formTitle,  
            ...responses
        };

        const response = await fetch("https://script.google.com/macros/s/AKfycbzeP2NhZHafitFk6EZZvya-MpsJIca_eL0RjJ44UWEOMc1N7OwthKd9uTk_57OFw9XKAg/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responsesWithTitle),
            mode: "cors", // Se asegura de permitir solicitudes entre dominios
        });

        const data = await response.json();

        if (response.ok) {
            alert("Respuestas enviadas correctamente");
        } else {
            alert(`Error: ${data.error || "No se pudo enviar la respuesta"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo enviar la respuesta");
    }
};
