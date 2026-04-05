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
Corpo
Canal vertebral
Processo transverso
Processo espinhoso
`
}

let db

function iniciarDB(){

const req = indexedDB.open("atlas_anatomia",1)

req.onupgradeneeded = e =>{

db = e.target.result

let store = db.createObjectStore("fotos",{keyPath:"id",autoIncrement:true})

store.createIndex("osso","osso",{unique:false})

}

req.onsuccess = e =>{
db = e.target.result
}

}

iniciarDB()

const ossosPrincipais = [
"Escápula","Clavícula","Úmero","Rádio","Ulna","Ossos Carpais",
"Osso do Quadril","Ílio","Ísquio","Púbis","Fêmur",
"Neurocrânio","Viscerocrânio"
]

const tabs = document.getElementById("tabs")

Object.keys(roteiro).forEach(regiao=>{

let t = document.createElement("div")
t.className="tab"
t.innerText = regiao

t.onclick=()=>{
abrir(regiao)

document.querySelectorAll(".tab").forEach(el=>el.classList.remove("ativo"))
t.classList.add("ativo")
}

tabs.appendChild(t)

})

function limparID(texto){

return texto
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.replace(/\s+/g,"_")
.toLowerCase()

}

function montarOsso(nome, acidentes){

let id = limparID(nome)

let lista = acidentes.map(a=>`<li>${a}</li>`).join("")

return `

<div class="osso">

<h3>${nome}</h3>

<ul>${lista}</ul>

<button onclick="audio('${nome}')">🔊 áudio</button>

<label class="fotoBtn">
📷 foto
<input type="file"
accept="image/*"
capture="environment"
multiple
onchange="foto(event,'${id}')">
</label>

<div id="galeria-${id}" class="galeria"></div>

</div>

`

}

function abrir(regiao){

let linhas = roteiro[regiao].split("\n")

let html = `<div class="card"><h2>${regiao}</h2>`

let ossoAtual = null
let acidentes = []

linhas.forEach(linha=>{

linha = linha.trim()

if(linha==="") return

if(ossosPrincipais.includes(linha)){

if(ossoAtual){

html += montarOsso(ossoAtual,acidentes)

}

ossoAtual = linha
acidentes = []

}else{

acidentes.push(linha)

}

})

if(ossoAtual){

html += montarOsso(ossoAtual,acidentes)

}

html += `</div>`

document.getElementById("conteudo").innerHTML = html

setTimeout(()=>{

document.querySelectorAll(".osso").forEach(el=>{

let id = limparID(el.querySelector("h3").innerText)

carregarFotos(id)

})

},200)

}

function audio(texto){

let msg = new SpeechSynthesisUtterance(texto)
msg.lang="pt-BR"

speechSynthesis.cancel()
speechSynthesis.speak(msg)

}

function foto(e,id){

for(let file of e.target.files){

let reader = new FileReader()

reader.onload = event =>{

let tx = db.transaction("fotos","readwrite")

let store = tx.objectStore("fotos")

store.add({
osso:id,
imagem:event.target.result
})

tx.oncomplete = ()=>{
carregarFotos(id)
}

}

reader.readAsDataURL(file)

}

}

function carregarFotos(id){

let galeria = document.getElementById("galeria-"+id)

if(!galeria) return

galeria.innerHTML=""

let tx = db.transaction("fotos","readonly")

let store = tx.objectStore("fotos")

let index = store.index("osso")

let req = index.getAll(id)

req.onsuccess = ()=>{

req.result.forEach(item=>{

let img = document.createElement("img")
img.src = item.imagem

galeria.appendChild(img)

})

}

}

function gerarPDF(){

const { jsPDF } = window.jspdf

const pdf = new jsPDF()

let y = 20

pdf.setFontSize(18)
pdf.text("Roteiro Prático do Sistema Esquelético",10,y)

y+=10

Object.keys(roteiro).forEach(regiao=>{

if(y>260){
pdf.addPage()
y=20
}

pdf.setFontSize(16)
pdf.text(regiao,10,y)

y+=8

let linhas = roteiro[regiao].split("\n")

pdf.setFontSize(12)

linhas.forEach(l=>{

l=l.trim()

if(l==="") return

if(y>260){
pdf.addPage()
y=20
}

pdf.text("- "+l,12,y)
y+=6

})

y+=5

})

let tx = db.transaction("fotos","readonly")

let store = tx.objectStore("fotos")

store.getAll().onsuccess = e =>{

let dados = e.target.result

dados.forEach(item=>{

let nome = item.osso.replace(/_/g," ")

if(y>220){
pdf.addPage()
y=20
}

pdf.setFontSize(14)
pdf.text(nome,10,y)

y+=8

pdf.addImage(item.imagem,"JPEG",10,y,90,65)

y+=70

})

pdf.save("roteiro_pratico_sistema_esqueletico.pdf")

}

}
