// ===============================
// Formulário de confirmação
// ===============================
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.querySelector("input[type='text']").value;
    const email = form.querySelector("input[type='email']").value;

    try {
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
    } catch (err) {
        console.error(err);
        alert("Ocorreu um erro ao confirmar a presença.");
    }
});

// ===============================
// Carrossel de fotos
// ===============================
const slides = document.querySelectorAll('.slides img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let current = 0;

function showSlide(index) {
    slides.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

next.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
});

prev.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
});

// Alternar automaticamente a cada 5 segundos (opcional)
// setInterval(() => {
//     current = (current + 1) % slides.length;
//     showSlide(current);
// }, 5000);

// ===============================
// Lista de presentes
// ===============================
const escolherLinks = document.querySelectorAll('#lista-presentes a.escolher');
const mensagemPresente = document.getElementById('mensagem-presente');

escolherLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();

        const li = link.parentElement;

        // Se já foi selecionado, não faz nada
        if(li.classList.contains('selecionado')) return;

        const presenteId = li.getAttribute('data-id');

        try {
            const response = await fetch('/escolher-presente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presenteId })
            });

            const result = await response.text();

            if(result === 'ok') {
                li.classList.add('selecionado');
                // Remove o link “Escolher” do item
                link.remove();
                mensagemPresente.textContent = 'Presente escolhido com sucesso!';
            } else {
                li.classList.add('selecionado');
                link.remove(); // também remove o link se já estiver escolhido
                mensagemPresente.textContent = 'Ops! Este presente já foi escolhido.';
            }
        } catch(err) {
            console.error(err);
            mensagemPresente.textContent = 'Erro ao escolher presente.';
        }
    });
});