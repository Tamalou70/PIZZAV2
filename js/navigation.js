function showPage(id){["cashierPage","adminPage","stockPage","staffPage","comptaPage"].forEach(page=>{document.getElementById(page).classList.toggle("hidden",page!==id);});renderAll();}
