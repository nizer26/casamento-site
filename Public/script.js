const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.querySelector("input[type='text']").value;
    const email = form.querySelector("input[type='email']").value;

    const response = await fetch("/confirmar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email })
    });

    const mensagem = await response.text();
    alert(mensagem);
    form.reset();
});