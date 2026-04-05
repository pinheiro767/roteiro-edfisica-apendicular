const roteiro = {

"Membro Superior":`
Escápula
Espinha da escápula
Acrômio
Processo coracóide
Fossa supraespinal
Fossa infraespinal
Margem medial
Margem lateral
Incisura da escápula

Clavícula
Extremidade esternal
Corpo da clavícula
Extremidade acromial
Tubérculo conoide

Úmero
Cabeça do úmero
Tubérculo maior
Tubérculo menor
Sulco intertubercular
Corpo do úmero
Tróclea
Capítulo
Fossa coronóide
Fossa do olecrano
Sulco do nervo radial

Rádio
Cabeça do rádio
Corpo do rádio
Tuberosidade do rádio
Processo estilóide do rádio

Ulna
Olécrano
Processo coronóide
Incisura radial
Incisura troclear
Corpo da ulna
Cabeça da ulna
Tuberosidade da ulna

Ossos Carpais
Escafóide
Semilunar
Piramidal
Pisiforme
Trapézio
Trapezóide
Capitato
Hamato
`,

"Membro Inferior":`
Osso do Quadril
Acetábulo
Fossa do acetábulo

Ílio
Crista ilíaca
Espinha ilíaca antero-superior
Espinha ilíaca antero-inferior
Espinha ilíaca postero-superior
Espinha ilíaca postero-inferior
Face auricular

Ísquio
Túber isquiático
Espinha isquiática
Ramo do ísquio
Corpo de ísquio

Púbis
Corpo do púbis
Face sinfisial

Fêmur
Cabeça do fêmur
Colo do fêmur
Trocânter maior
Trocânter menor
`,

"Crânio":`
Neurocrânio
Frontal
Parietais
Temporais
Occipital
Esfenoide
Etmoide

Viscerocrânio
Nasais
Maxilas
Zigomáticos
Lacrimais
Palatinos
Vômer
Mandíbula
`,

"Coluna Vertebral":`
Regiões
Cervical
Torácica
Lombar
Sacral

Lordose cervical e lombar
Cifose torácica e sacral

Estruturas
corpo
canal vertebral
processo transverso
processo espinhoso
`

}

let fotos={}

const tabs=document.getElementById("tabs")

Object.keys(roteiro).forEach(r=>{

let t=document.createElement("div")

t.className="tab"
t.innerText=r

t.onclick=()=>abrir(r)

tabs.appendChild(t)

})

function abrir(regiao){

let texto = roteiro[regiao].split("\n")

let html = `<div class="card"><h2>${regiao}</h2>`

texto.forEach(osso =>{

if(osso.trim()==="") return

html += `

<div class="osso">

<h3>${osso}</h3>

<button onclick="audio('${osso}')">
🔊 áudio
</button>

<label class="fotoBtn">

📷 foto

<input type="file"
accept="image/*"
capture="environment"
multiple
onchange="foto(event,'${osso}')">

</label>

<label class="arquivoBtn">

📂 arquivo

<input type="file"
multiple
onchange="arquivo(event,'${osso}')">

</label>

<div id="galeria-${osso}" class="galeria"></div>

</div>

`

})

html += `</div>`

document.getElementById("conteudo").innerHTML = html

}
function audio(r){

let msg=new SpeechSynthesisUtterance(roteiro[r])

msg.lang="pt-BR"

speechSynthesis.speak(msg)

}

function foto(e,osso){

let galeria = document.getElementById("galeria-"+osso)

for(let f of e.target.files){

let img = URL.createObjectURL(f)

galeria.innerHTML += `<img src="${img}">`

}

}
function gerarPDF(){

const {jsPDF} = window.jspdf
const pdf = new jsPDF()

let y = 20

Object.keys(roteiro).forEach(regiao => {

if(y>260){
pdf.addPage()
y=20
}

pdf.setFontSize(18)
pdf.text(regiao,10,y)
y+=10

const linhas = pdf.splitTextToSize(roteiro[regiao],180)

pdf.setFontSize(12)

linhas.forEach(l =>{

if(y>260){
pdf.addPage()
y=20
}

pdf.text(l,10,y)
y+=7

})

y+=5

})

pdf.save("roteiro_pratico_sistema_esqueletico.pdf")

}
