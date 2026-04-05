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

let fotos = {}

const tabs = document.getElementById("tabs")

Object.keys(roteiro).forEach(regiao=>{

let t = document.createElement("div")
t.className="tab"
t.innerText = regiao
t.onclick=()=>abrir(regiao)

tabs.appendChild(t)

})

function limparID(texto){

return texto.replace(/\s+/g,"_")

}

function abrir(regiao){

let linhas = roteiro[regiao].split("\n")

let html = `<div class="card"><h2>${regiao}</h2>`

linhas.forEach(osso=>{

if(osso.trim()==="") return

let id = limparID(osso)

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
onchange="foto(event,'${id}')">

</label>

<label class="arquivoBtn">

📂 arquivo

<input type="file"
multiple>

</label>

<div id="galeria-${id}" class="galeria"></div>

</div>

`

})

html += `</div>`

document.getElementById("conteudo").innerHTML = html

}

function audio(texto){

let msg = new SpeechSynthesisUtterance(texto)

msg.lang="pt-BR"

speechSynthesis.speak(msg)

}

function foto(e,id){

if(!fotos[id]){
fotos[id]=[]
}

for(let file of e.target.files){

let reader = new FileReader()

reader.onload=function(event){

fotos[id].push(event.target.result)

mostrarFotos(id)

}

reader.readAsDataURL(file)

}

}

function mostrarFotos(id){

let galeria = document.getElementById("galeria-"+id)

galeria.innerHTML=""

fotos[id].forEach(img=>{

galeria.innerHTML += `<img src="${img}">`

})

}

function gerarPDF(){

const {jsPDF} = window.jspdf

const pdf = new jsPDF()

let y=20

Object.keys(roteiro).forEach(regiao=>{

pdf.setFontSize(18)
pdf.text(regiao,10,y)

y+=10

let linhas = pdf.splitTextToSize(roteiro[regiao],180)

pdf.setFontSize(12)

linhas.forEach(l=>{

if(y>260){
pdf.addPage()
y=20
}

pdf.text(l,10,y)
y+=7

})

y+=10

})

Object.keys(fotos).forEach(osso=>{

fotos[osso].forEach(img=>{

if(y>220){
pdf.addPage()
y=20
}

pdf.text(osso.replace(/_/g," "),10,y)
y+=5

pdf.addImage(img,"JPEG",10,y,80,60)

y+=70

})

})

pdf.save("roteiro_pratico_sistema_esqueletico.pdf")

}
