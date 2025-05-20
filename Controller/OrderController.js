import {order_db, customer_db, item_db, order_details_db} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
import OrderModel from "../Model/OrderModel.js";
import Order_Details_Model from "../Model/Order_Details_Model.js";
import {loadTable} from "./ItemController.js";


if (localStorage.getItem("Order_details")) {
    let raw = JSON.parse(localStorage.getItem("Order_details"));

    let loaded = raw.map(o => new Order_Details_Model(o.oId, o.cId, o.order_data, o.date));
    order_details_db.length = 0;
    order_details_db.push(...loaded);
}


$(document).ready(function () {
    $("#OrderId").val(nextId());
    setCustomerIds();
    setItemIds();
    loadOrderHistory();
});

function nextId() {
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


export function setCustomerIds() {
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
            $('#inputCustomerName').val(getCustomerByUd(this.textContent).name);
            $('#inputCustomerAddress').val(getCustomerByUd(this.textContent).address);
        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });
}


export function setItemIds() {
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
            $('#inputItemPrice').val(getItemByUd(this.textContent).price);
            $('#inputItemQty').val(getItemByUd(this.textContent).quantity);

        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });
}


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
    let qty = $('#orderQty').val();
    let price = $('#inputItemPrice').val();

    let qtyAmount = parseInt(qty);


    let itemIndex = item_db.findIndex(item => item.id === itemId);

    console.log(`order quantity ${qtyAmount}`);
    console.log(`item index ${itemIndex}`);
    console.log(`array quantity ${item_db[itemIndex].quantity}`);

    if (itemIndex !== -1 && item_db[itemIndex].quantity >= qtyAmount) {
        item_db[itemIndex].quantity -= qtyAmount;
        console.log(`new array quantity ${item_db[itemIndex].quantity}`);
    } else {
        alert("Insufficient stock or item not found!");
        return;
    }


    let order_data = new OrderModel(itemId, itemName, price, qty);
    order_db.push(order_data)
    loadOrder();
    loadOrderHistory();
    reset();
    updateTotals();

});

function updateTotals() {
    let total = 0;


    $('#Add_Item_T_Body tr').each(function () {
        const rowTotal = parseFloat($(this).find('td:nth-child(5)').text()) || 0;
        total += rowTotal;
    });


    $('#subTotalPriceDiv').text(total.toFixed(2));
}


function applyDiscount() {
    const discountInput = $('#discount').val().trim();
    let discountAmount = 0;

    discountAmount = parseFloat(discountInput) || 0;

    let subTotal = parseFloat($('#subTotalPriceDiv').text() || 0);

    let total = subTotal - discountAmount;

    $('#totalPriceDiv').text(total.toFixed(2));
}

$('#discount').on('input', function () {
    applyDiscount();
});


function balanceCalculate() {
    const cashInput = $('#cash').val().trim();
    const totalInput = $('#totalPriceDiv').text().trim() || 0;

    let cashAmount = 0;
    let total = parseFloat(totalInput) || 0;

    cashAmount = parseFloat(cashInput) || 0;

    let balance = cashAmount - total;

    $('#balance').val(balance.toFixed(2));

}

$('#cash').on('input', function () {
    balanceCalculate();
});


function reset() {
    // $('#inputCustomerId').val('');
    // $('#date').val('');
    // $('#inputCustomerName').val('');

    $('#inputItemId').val('');
    $('#inputItemName').val('');
    $('#inputItemQty').val('');
    $('#inputItemPrice').val('');
}


function loadOrder() {
    $('#Add_Item_T_Body').empty();
    order_db.map((item, index) => {
        let id = item.id;
        let name = item.name;
        let price = item.price;
        let qty = item.qty;

        let data = `<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${qty}</td>
            <td>${price * qty}</td>
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

    console.log(`cust id ${cusId}`);
    console.log(`date ${date}`);

    let Order_details = new Order_Details_Model(orderId, cusId, [...order_db], date);

    console.log(Order_details)

    order_details_db.push(Order_details);
    localStorage.setItem("Order_details", JSON.stringify(order_details_db));
    console.log(order_details_db);

    $('#Add_Item_T_Body').empty();

    Swal.fire({
        title: 'Success!',
        text: 'Order saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    loadOrderHistory();
    loadTable();

});


function loadOrderHistory() {
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

        let data = `<tr>
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

$("#order-history-body").on('click', 'tr', function () {
    let index = $(this).index();
    let data = order_details_db[index];
    console.log(data);

    // order_details_db.splice(index, 1);
    // localStorage.setItem("Order_details", JSON.stringify(order_details_db));


    $('#order-item-body').empty();

    data.order_data.map((item, index) => {
        let id = item.id;
        let name = item.name;
        let quantity = item.qty;
        let price = item.price;

        let data = `<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${quantity}</td>
            <td>${price}</td>

        </tr>`
        console.log(data);
        $('#order-item-body').append(data);
    });


});