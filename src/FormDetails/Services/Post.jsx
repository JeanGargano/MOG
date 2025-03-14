//Servicio de Post para subir respuestas
import axios from "axios";

export const Post = async (formId, formTitle, responses) => {
    try {
        const responsesWithTitle = {
            formId, 
            formTitle,  
            ...responses
        };

        const response = await axios.post(
            "https://script.google.com/macros/s/AKfycbzMXmW-XbpWcFJ5MEOTwP6nVdNEYjFFk1cV2XcnvG0XKZYLoKFNkTF7uQ2mQQKLUyy0fA/exec",
            responsesWithTitle
        );

        alert("Respuestas enviadas correctamente");
        return response.data;
    } catch (error) {
        console.error("Error al enviar las respuestas:", error);
        alert(`No se pudo enviar la respuesta: ${error.response?.data?.error || error.message}`);
    }
};
