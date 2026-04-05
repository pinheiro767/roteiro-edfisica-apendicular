const DB="anatomiaDB"

let db

const req=indexedDB.open(DB,1)

req.onupgradeneeded=e=>{

db=e.target.result

db.createObjectStore("fotos",{keyPath:"id",autoIncrement:true})

}

req.onsuccess=e=>{

db=e.target.result

}
