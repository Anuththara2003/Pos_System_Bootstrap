import {order_db, customer_db, item_db, order_details_db} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
import OrderModel from "../Model/OrderModel.js";
 import Order_Details_Model from "../Model/Order_Details_Model.js";


if (localStorage.getItem("Order_details")) {
    let raw = JSON.parse(localStorage.getItem("Order_details"));

    let loaded = raw.map(o => new Order_Details_Model(o.oId, o.cId, o.order_data, o.date));
    order_details_db.length = 0;
    order_details_db.push(...loaded);
}



$(document).ready(function() {
    $("#OrderId").val(nextId());
    setCustomerIds();
    setItemIds();
    loadTable();
});

function nextId(){
    let id;

    if (order_db.length > 0) {
        const lastId = order_db[order_db.length - 1].id;
        id = parseInt(lastId.slice(1)) + 1;
        id = 'O' + id.toString().padStart(3, '0');
    } else {
        id = 'O001';
    }
    console.log(id);
    return id;
}





export function setCustomerIds(){
    const customerIds = customer_db.map(customer => customer.customer_id);
    const dropdown = document.getElementById("dropdownList");
    const input = document.getElementById("inputCustomerId");

    dropdown.innerHTML = "";

    customerIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = this.textContent;
            $('#inputCustomerName').val(getCustomerByUd(this.textContent).name );
            $('#inputCustomerAddress').val(getCustomerByUd(this.textContent).address );
        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });}



export function setItemIds(){
    const itemIds = item_db.map(item => item.id);
    const dropdown = document.getElementById("Item_dropdownList");
    const input = document.getElementById("inputItemId");

    dropdown.innerHTML = "";

    itemIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = this.textContent;
            $('#inputItemName').val(getItemByUd(this.textContent).name);
            $('#inputItemPrice').val(getItemByUd(this.textContent).price );
            $('#inputItemQty').val(getItemByUd(this.textContent).quantity );

        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });}


function getCustomerByUd(id) {
    console.log(customer_db.find(item => item.customer_id === id));
    return customer_db.find(item => item.customer_id === id);

}

function getItemByUd(id) {
    return item_db.find(item => item.id === id);
}




$('#save-Order').on("click", function () {


    let itemId = $('#inputItemId').val();
    console.log(itemId);
    let itemName = $('#inputItemName').val();
    let qty = $('#inputItemQty').val();
    let price = $('#inputItemPrice').val();

    let order_data = new OrderModel(itemId, itemName, price, qty);
    order_db.push(order_data)
    loadOrder();
    loadTable();
    reset();


});

function reset(){
    $('#inputCustomerId').val('');
    $('#date').val('');
    $('#inputCustomerName').val('');

    $('#inputItemId').val('');
    $('#inputItemName').val('');
    $('#inputItemQty').val('');
    $('#inputItemPrice').val('');
}



function  loadOrder(){
    $('#Add_Item_T_Body').empty();
    order_db.map((item, index) => {
        let id = item.id;
        let name = item.name;
        let price = item.price;
        let qty = item.qty;

        let  data  =`<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${qty}</td>
            <td>${price*qty}</td>
        </tr>`
        $('#Add_Item_T_Body').append(data);

    })


}

$('#place_order').on("click", function () {
        let orderId = $('#OrderId').val();
        let cusId = $('#inputCustomerId').val();
        let date = $('#date').val();
        let cusName = $('#inputCustomerName').val();
        let address = $('#inputCustomerAddress').val();

        let Order_details = new Order_Details_Model(orderId, cusId, [...order_db],date);

    order_details_db.push(Order_details);
    localStorage.setItem("Order_details", JSON.stringify(order_details_db));
    console.log(order_details_db);

    });


function  loadTable(){
    $('#order-history-body').empty();
    order_details_db.map((item, index) => {
        let OrderId = item.oId;
        let CustomerId = item.cId;
        let Date = item.date;
        let Item_code = item.order_data.length;
        let totalPrice = 0;

        item.order_data.forEach((i, index) => {
            let price = parseFloat(i.price) || 0;
            totalPrice += price;
        });

        let  data  =`<tr>
            <td>${OrderId}</td>
            <td>${Date}</td>
            <td>${CustomerId}</td>
            <td>${Item_code}</td>
            <td>${totalPrice}</td>
         
          
        </tr>`
        console.log(data);
        $('#order-history-body').append(data);
    })

}

$("#order-history-body").on('click', 'tr', function(){
    let index = $(this).index();
    let data = order_details_db[index];
    console.log(data);



    data.order_data.map((item, index) => {
        let id = item.id;
        let name = item.name;
        let quantity = item.qty;
        let price = item.price;

        let  data  =`<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${quantity}</td>
            <td>${price}</td>
           
        </tr>`
        console.log(data);
        $('#order-item-body').append(data);
    });
});