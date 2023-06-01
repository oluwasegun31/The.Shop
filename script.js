const navItem = document.getElementById("nav-item");
const closeBtn = document.getElementById("close-btn");
const cartContainer = document.getElementsByTagName("aside")[0]; 
const productContainer = document.getElementById("product-content");
const btn = document.querySelectorAll(".btn");
const cartContent = document.querySelector('.cart-content');
const notification = document.querySelector(".notif");
const totalElement = document.querySelector(".total");
const alertBox = document.querySelector(".alert");
const closeAlert = document.querySelector('.close');
const buyBtn = document.querySelector('.buy-btn');
const successContainer = document.querySelector('.sucess-box');
const successMessage = document.querySelector('.success-msg');
const loader = document.querySelector("#wifi-loader");
import { products } from "./product.js";

// toogle cart button
navItem.addEventListener('click', ()=> {
    closeBtn.classList.toggle("active");
    cartContainer.classList.toggle('active')
});

// to map the product to the product-content box
var categories = [...new Set(products.map(item=> {return item}))];
let i = 0
productContainer.innerHTML = categories.map(item=> {
    var {image, productTitle, price, filterType} = item;
    
    return (
        `<div class="product-box ${filterType}">
            <img src=${image} alt="product-image" class="product-img">
            <p class="product-title">${productTitle}</p>
            <p class="product-price">₦ ${price}</p>
            <i class="bx bx-cart-add" onclick= 'addToCart(${i++})'></i>
        </div>`
    )
    
}).join('');


//filter product
btn.forEach(button=>{
    button.addEventListener('click', (e)=>{
        e.preventDefault()
        ///to add a class to the selected btn
        btn.forEach(button=>{
            button.classList.remove('picked')
        })
        button.classList.add('picked')

        var filter = e.target.dataset.filter
        const productBox = document.querySelectorAll('.product-box');
        productBox.forEach(item=>{
            if(filter === 'all'){
                item.style.display = 'block'
            }else if(item.classList.contains(filter)){
                item.style.display = 'block'
            }else{
                item.style.display = 'none'
            }
        })
    })
});

// add and remove to cart 
var cart = [];

/// using the 'window.addToCart' instead of 'function addToCart(a)' was because of using the import statement and using type= "module" which means functions not declared cannot work...  same goes for the 'removeCart(a)'
window.addToCart = function(a){
    for(var u = 0; u < cart.length; u++){
        if(categories[a].id === cart[u].id){
            alertBox.classList.add('show')
            setTimeout(()=>{
                alertBox.classList.remove('show')
            }, 3000)
            removeCart(u)
        }
    }
    cart.push({...categories[a]})
    displayCart()
    
}
closeAlert.addEventListener('click',()=>{
    alertBox.classList.remove('show')
})
window.removeCart = function(a){
    cart.splice(a, 1)
    displayCart()
}
//display cart

function displayCart(a){
    let j = 0,total = 0, k = 0
    var quantity = 1

    if(cart.length === 0){
        ///to show empty text if cart is empty
        cartContent.innerHTML = `<p class='empty-cart'>YOUR CART IS EMPTY</p>`;
        ///to remove a red notification when the cart is empty
        notification.classList.remove("active");
        /// to show a total of zero for total price when cart is empty
        totalElement.innerText = `₦ ${0}`;
        // to add a class to the buy button to prevent it from clicking when cart is empty
        buyBtn.classList.add('hide');
    }else{
        /// to remove the class that prevent the btn from clicking now that the cart is not empty
        buyBtn.classList.remove('hide');

        /// to map the cart content present in the cart array when something is added to cart
        cartContent.innerHTML = cart.map(item=>{
            var {image, productTitle, price} = item;
            /// to add all thr price together
            total = total + price
            
            return(
                `<div class="cart-box">
                    <img src='${image}' alt="cart-img">
                    <div>
                        <p class="cart-title">${productTitle}</p>
                        <p class="cart-quantity">Quantity: <span>1</span></p>
                        <p class="cart-price">₦ ${price}</p>
                    </div>
                    <i class="bx bx-x cart-remove" onclick= 'removeCart(${j++})'></i>
                </div>`
            )
        }).join('');

        /// to add a red notification if the cart is not empty
        notification.classList.add('active');
        // to get the total price
        totalElement.innerText = `₦ ${total}`;
    }
}
displayCart()

/// buy button to bring a pop up and empty the cart
buyBtn.addEventListener('click', ()=> {
    successContainer.style.display = 'flex';

    /// a timer for the order container to display the message for 3.5s
    setTimeout(()=>{
        loader.style.display= 'none'
        successMessage.style.display ='flex';
        successContainer.style.backgroundColor = '#85d685';
        successContainer.style.transition = '0.2s'
    }, 3500)

    /// a timer to show th order container for 5s in total
    setTimeout(()=> {
        successContainer.style.display= 'none';
        successContainer.style.backgroundColor = '#bbbaba'
        successMessage.style.display = 'none';
        loader.style.display = 'flex';
    }, 5000);
    
    //to remove all the items in cart
    cart.splice(0, cart.length);
    //to close both the close button and the cart container
    closeBtn.classList.remove("active");
    cartContainer.classList.remove('active');
    //to display the already empty cart
    displayCart()
})
