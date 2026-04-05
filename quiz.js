function quiz(){

let perguntas=[

["Qual osso possui acrômio?","Escápula"],
["Qual osso possui trocânter maior?","Fêmur"],
["Qual osso possui olécrano?","Ulna"]

]

let p=perguntas[Math.floor(Math.random()*perguntas.length)]

let r=prompt(p[0])

if(r && r.toLowerCase()==p[1].toLowerCase()){

alert("Correto")

}else{

alert("Resposta: "+p[1])

}

}
