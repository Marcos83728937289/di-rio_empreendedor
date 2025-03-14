document.addEventListener("DOMContentLoaded", () => {
    const enviarBtn = document.getElementById("enviar");
    const registroInput = document.getElementById("registro");
    const feedback = document.getElementById("feedback");
    const historicoLista = document.getElementById("historico");

    const airtableApiKey = "patQeBm4gkHlKs3qL.32e8a4fc31793b125804049e60f346c67d8daca0147130a886a5e4985bce5688"; // Substitua pela sua chave de API
    const baseId = "app8N61FB3kz14zWV";
    const tableName = "tblDJHNCjI06KzOik";

    function carregarHistorico() {
        fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?sort%5B0%5D%5Bfield%5D=data_hora&sort%5B0%5D%5Bdirection%5D=desc`, {
            headers: { "Authorization": `Bearer ${airtableApiKey}` }
        })
        .then(response => response.json())
        .then(data => {
            historicoLista.innerHTML = "";
            data.records.forEach(record => {
                const dataFormatada = new Date(record.fields.data_hora).toLocaleDateString("pt-BR");
                const li = document.createElement("li");
                li.textContent = `${dataFormatada}: ${record.fields.registro}`;
                historicoLista.appendChild(li);
            });
        });
    }

    enviarBtn.addEventListener("click", () => {
        const registroTexto = registroInput.value.trim();
        if (!registroTexto) return;

        feedback.classList.remove("hidden");
        const dataAtual = new Date().toISOString();

        fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${airtableApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fields: { data_hora: dataAtual, registro: registroTexto }
            })
        }).then(() => {
            feedback.classList.add("hidden");
            registroInput.value = "";
            carregarHistorico();
        });
    });

    carregarHistorico();
});
