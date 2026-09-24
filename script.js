// Henter elementene vi trenger fra HTML-en
const skjema = document.getElementById("transactionForm");
const transaksjonsListe = document.getElementById("transactionList");

const inntektVisning = document.getElementById("income");
const utgifterVisning = document.getElementById("expenses");
const saldoVisning = document.getElementById("balance");

const type = document.getElementById("type");
const kategori = document.getElementById("category");

// Henter elementene som brukes i grafen
const inntektGraf = document.getElementById("inntektGraf");
const utgiftGraf = document.getElementById("utgiftGraf");
const inntektGrafBeløp = document.getElementById("inntektGrafBeløp");
const utgiftGrafBeløp = document.getElementById("utgiftGrafBeløp");

let transaksjoner = [];

// Endrer tilgjengelige kategorier basert på om det er inntekt eller utgift
function oppdaterKategorier() {

    if (type.value === "income") {

        kategori.innerHTML = `
            <option value="Lønn">Lønn</option>
            <option value="Stipend">Stipend</option>
            <option value="Lånekassen">Lånekassen</option>
            <option value="Salg">Salg</option>
            <option value="Annet">Annet</option>
        `;

    } else {

        kategori.innerHTML = `
            <option value="Mat">Mat</option>
            <option value="Transport">Transport</option>
            <option value="Bolig">Bolig</option>
            <option value="Klær og utstyr">Klær og utstyr</option>
            <option value="Helse og velvære">Helse og velvære</option>
            <option value="Hobby">Hobby</option>
            <option value="Underholdning">Underholdning</option>
            <option value="Annet">Annet</option>
        `;

    }
}

// Oppdaterer kategoriene når brukeren bytter mellom inntekt og utgift
type.addEventListener("change", oppdaterKategorier);

// Håndterer innsending av skjemaet og oppretter en ny transaksjon
skjema.addEventListener("submit", function(event) {

    event.preventDefault();

    const beskrivelse = document.getElementById("description").value.trim();
    const beløp = Number(document.getElementById("amount").value);
    const transaksjonstype = type.value;
    const valgtKategori = kategori.value;

    const transaksjon = {
        id: Date.now(),
        beskrivelse: beskrivelse,
        beløp: beløp,
        type: transaksjonstype,
        kategori: valgtKategori
    };

    transaksjoner.push(transaksjon);

    skjema.reset();

    // Setter kategoriene tilbake til utgiftskategorier etter innsending
    oppdaterKategorier();

    oppdaterVisning();
});

// Beregner inntekter, utgifter og saldo
function oppdaterVisning() {

    let inntekt = 0;
    let utgifter = 0;

    transaksjoner.forEach(function(transaksjon) {

        if (transaksjon.type === "income") {
            inntekt += transaksjon.beløp;
        } else {
            utgifter += transaksjon.beløp;
        }

    });

    const saldo = inntekt - utgifter;

    // Oppdaterer inntekter, utgifter og saldo
    inntektVisning.textContent = formaterValuta(inntekt);
    utgifterVisning.textContent = formaterValuta(utgifter);
    saldoVisning.textContent = formaterValuta(saldo);

    // Oppdaterer grafen
    const størsteVerdi = Math.max(inntekt, utgifter, 1);

    inntektGraf.style.width = `${(inntekt / størsteVerdi) * 100}%`;
    utgiftGraf.style.width = `${(utgifter / størsteVerdi) * 100}%`;

    inntektGrafBeløp.textContent = formaterValuta(inntekt);
    utgiftGrafBeløp.textContent = formaterValuta(utgifter);

    visTransaksjoner();
}

// Formaterer beløp i norske kroner
function formaterValuta(beløp) {

    return beløp.toLocaleString("nb-NO") + " kr";

}

// Viser alle transaksjonene
function visTransaksjoner() {

    transaksjonsListe.innerHTML = "";

    if (transaksjoner.length === 0) {

        transaksjonsListe.innerHTML =
            '<p class="empty-message">Ingen transaksjoner ennå.</p>';

        return;
    }

    transaksjoner.forEach(function(transaksjon) {

        const transaksjonElement = document.createElement("div");

        transaksjonElement.classList.add("transaction");

        const fortegn = transaksjon.type === "income" ? "+" : "-";
        const typeKlasse = transaksjon.type;

        transaksjonElement.innerHTML = `
            <div class="transaction-info">
                <strong>${transaksjon.beskrivelse}</strong>
                <span>${transaksjon.kategori}</span>
            </div>

            <div class="${typeKlasse}">
                ${fortegn}${formaterValuta(transaksjon.beløp)}
            </div>

            <button class="delete-button" type="button" data-id="${transaksjon.id}">
                Slett
            </button>
        `;

        transaksjonsListe.appendChild(transaksjonElement);

    });
}

// Sletter en transaksjon
transaksjonsListe.addEventListener("click", function(event) {

    if (!event.target.classList.contains("delete-button")) {
        return;
    }

    const id = Number(event.target.dataset.id);

    transaksjoner = transaksjoner.filter(function(transaksjon) {
        return transaksjon.id !== id;
    });

    oppdaterVisning();
}); 