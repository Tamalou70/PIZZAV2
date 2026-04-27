let products=[];
let ingredients=[];
let recipes=[];
let cart=[];
let recipeBuilder=[];

async function login(){
document.getElementById("login").style.display="none";
document.getElementById("app").style.display="block";
await load();
}

async function load(){
let p=await db.from("products").select("*");
let i=await db.from("ingredients").select("*");
let r=await db.from("recipes").select("*");
products=p.data||[];
ingredients=i.data||[];
recipes=r.data||[];
render();
}

function render(){
document.getElementById("products").innerHTML=products.map(p=>`
<div class="pizza" onclick="addCart('${p.id}')">
<img src="${p.image_url||''}">
${p.name} - ${p.price}
</div>`).join("");

recipeIngredientSelect.innerHTML=ingredients.map(i=>`<option>${i.name}</option>`).join("");
}

function addRecipeLine(){
let ing=recipeIngredientSelect.value;
let qty=Number(recipeQuantityInput.value);
recipeBuilder.push({ingredient_name:ing,quantity:qty});
renderRecipe();
}

function renderRecipe(){
recipeBuilderList.innerHTML=recipeBuilder.map(r=>`${r.ingredient_name} x${r.quantity}`).join("<br>");
}

async function savePizza(){
let {data}=await db.from("products").insert({
name:pizzaName.value,
price:Number(pizzaPrice.value),
image_url:pizzaImageUrl.value
}).select().single();

let rows=recipeBuilder.map(r=>({
product_id:data.id,
ingredient_name:r.ingredient_name,
quantity:r.quantity
}));

await db.from("recipes").insert(rows);
recipeBuilder=[];
await load();
alert("OK");
}

function addCart(id){
let p=products.find(x=>x.id===id);
cart.push(p);
renderCart();
}

function renderCart(){
cart.innerHTML=cart.map(p=>p.name).join("<br>");
}
