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

Patela
Face articular
Ápice
Base

Tíbia
Maléolo medial
Tuberosidade da tíbia
Corpo da tíbia

Fíbula
Maléolo lateral
Corpo da fíbula
Cabeça da fíbula

Ossos do Pé
Calcâneo
Tálus
Navicular
Cuneiforme medial
Cuneiforme intermédio
Cuneiforme lateral
Cubóide
Metatarso I
Metatarso II
Metatarso III
Metatarso IV
Metatarso V
Falange proximal
Falange média
Falange distal
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
Vértebras Cervicais
Corpo da vértebra
Canal vertebral
Processo articular
Processo transverso
Processo espinhoso

Atlas (C I)
Arco anterior
Arco posterior
Massas laterais

Áxis (C II)
Dente do áxis
Corpo da vértebra
Canal vertebral
Processo articular
Processo transverso
Processo espinhoso

Vértebra Proeminente (C VII)
Corpo da vértebra
Canal vertebral
Processo articular
Processo transverso
Processo espinhoso

Vértebras Torácicas
Corpo da vértebra
Canal vertebral
Processo articular
Processo transverso
Processo espinhoso
Fóveas costais
Fóvea costal do processo transverso

Vértebras Lombares
Corpo da vértebra
Canal vertebral
Processo articular
Processo transverso
Processo espinhoso

Sacro
Promontório
Asa sacral
Crista sacral
`
}

/* ============================
   BANCO INDEXEDDB
============================ */

let db

function iniciarDB(){

const req = indexedDB.open("atlas_anatomia",1)

req.onupgradeneeded = e =>{

db = e.target.result

if(!db.objectStoreNames.contains("fotos")){

let store = db.createObjectStore("fotos",{keyPath:"id",autoIncrement:true})

store.createIndex("osso","osso",{unique:false})

}

}

req.onsuccess = e =>{
db = e.target.result
}

req.onerror = e =>{
console.error("Erro ao abrir IndexedDB", e)
}

}

iniciarDB()

const ossosPrincipais = [
"Escápula","Clavícula","Úmero","Rádio","Ulna","Ossos Carpais",
"Osso do Quadril","Ílio","Ísquio","Púbis","Fêmur","Patela","Tíbia","Fíbula","Ossos do Pé",
"Neurocrânio","Viscerocrânio",
"Vértebras Cervicais","Atlas (C I)","Áxis (C II)","Vértebra Proeminente (C VII)","Vértebras Torácicas","Vértebras Lombares","Sacro"
]

const tabs = document.getElementById("tabs")

Object.keys(roteiro).forEach(regiao=>{

let t = document.createElement("div")
t.className = "tab"
t.innerText = regiao

t.onclick = ()=>{
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
.replace(/[()]/g,"")
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

  <button onclick="audio('${nome.replace(/'/g,"\\'")}')">🔊 áudio</button>

  <br><br>

  <label>
    📷 Tirar foto
    <input type="file"
      accept="image/*"
      capture="environment"
      multiple
      onchange="foto(event,'${id}')">
  </label>

  <label>
    📂 Importar imagem
    <input type="file"
      accept="image/*"
      multiple
      onchange="foto(event,'${id}')">
  </label>

  <button onclick="limparFotos('${id}')">🧹 Limpar fotos</button>

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

if(linha === "") return

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
msg.lang = "pt-BR"

speechSynthesis.cancel()
speechSynthesis.speak(msg)

}

/* ============================
   SALVAR FOTO
============================ */

function foto(e,id){

if(!db){
alert("Banco de dados ainda não carregou. Tente novamente em alguns segundos.")
return
}

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

e.target.value = ""

}

/* ============================
   CARREGAR FOTOS
============================ */

function carregarFotos(id){

if(!db) return

let galeria = document.getElementById("galeria-"+id)
if(!galeria) return

galeria.innerHTML = ""

let tx = db.transaction("fotos","readonly")
let store = tx.objectStore("fotos")
let index = store.index("osso")
let req = index.getAll(id)

req.onsuccess = ()=>{

req.result.forEach(item=>{

let img = document.createElement("img")
img.src = item.imagem
img.style.width = "120px"
img.style.margin = "5px"
img.style.borderRadius = "8px"
img.style.objectFit = "cover"

galeria.appendChild(img)

})

}

}

/* ============================
   LIMPAR FOTOS
============================ */

function limparFotos(id){

if(!db) return

if(!confirm("Apagar todas as fotos deste osso?")) return

let tx = db.transaction("fotos","readwrite")
let store = tx.objectStore("fotos")
let index = store.index("osso")
let req = index.getAll(id)

req.onsuccess = ()=>{

req.result.forEach(item=>{
store.delete(item.id)
})

tx.oncomplete = ()=>{
carregarFotos(id)
}

}

}

/* ============================
   GERAR PDF
============================ */

function gerarPDF(){

if(!db){
alert("Banco de dados ainda não carregou. Tente novamente em alguns segundos.")
return
}

const { jsPDF } = window.jspdf
const pdf = new jsPDF()

let y = 20

pdf.setFontSize(18)
pdf.text("Roteiro Prático do Sistema Esquelético",10,y)
y += 10

Object.keys(roteiro).forEach(regiao=>{

if(y > 260){
pdf.addPage()
y = 20
}

pdf.setFontSize(16)
pdf.text(regiao,10,y)
y += 8

let linhas = roteiro[regiao].split("\n")
pdf.setFontSize(12)

linhas.forEach(l=>{

l = l.trim()
if(l === "") return

if(y > 260){
pdf.addPage()
y = 20
}

pdf.text("- " + l,12,y)
y += 6

})

y += 5

})

let tx = db.transaction("fotos","readonly")
let store = tx.objectStore("fotos")

store.getAll().onsuccess = e =>{

let dados = e.target.result

dados.forEach(item=>{

let nome = item.osso.replace(/_/g," ")

if(y > 220){
pdf.addPage()
y = 20
}

pdf.setFontSize(14)
pdf.text(nome,10,y)
y += 8

pdf.addImage(item.imagem,"JPEG",10,y,90,65)
y += 70

})

pdf.save("roteiro_pratico_sistema_esqueletico.pdf")

}

}
