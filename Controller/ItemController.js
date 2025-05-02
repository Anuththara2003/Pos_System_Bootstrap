import {customer_db, item_db,} from "../DB/Db.js";
import ItemModel from "../Model/ItemModel.js";


$('#save_item').on ("click",function() {
    let id;

    if (item_db.length > 0) {
        const lastItem = item_db[item_db.length - 1].id;
        console.log(lastItem);
        id = parseInt(lastItem.slice(1)) + 1;
        id = "I" + id.toString().padStart(3, '0');
    } else {
        id = "I001";
    }
    var name = $("#names").val();
    var price = $("#price").val();
    var quantity = $("#qty").val();

    let itemModel = new ItemModel(id, name, price, quantity);
    item_db.push(itemModel);
    loadTable();

});

$("#item-tbody").on('click', 'tr', function(){

    let idx = $(this).index();
    console.log(idx);
    let obj = item_db[idx];
    console.log(obj);

    let id = obj.id;
    let name = obj.name;
    let price = obj.price;
    let quantity = obj.quantity

    $('#item_id').val(id);
    $('#names').val(name);
    $('#qty').val(quantity);
    $('#price').val(price);


    console.log(id);

});


$('#item_update_button').on("click", function () {
    let id = $("#item_id").val().trim();
    console.log(id);
    let name = $("#names").val().trim();
    let price = $("#price").val().trim();
    let quantity = $("#qty").val().trim();

    if (!id) {
        Swal.fire({
            title: 'Invalid Id',
            text: 'Please Enter Valid Id',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else if (!name) {
        Swal.fire({
            title: 'Invalid Name',
            text: 'Please Enter Valid Name',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else if (!price) {
        Swal.fire({
            title: 'Invalid Price',
            text: 'Please Enter Valid Price',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else if (!quantity) {
        Swal.fire({
            title: 'Invalid Quantity',
            text: 'Please Enter Valid Quantity',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else {
        let item = item_db.find((item) => item.id === id);

        if (!item) {
            swal.fire({
                title: 'Not Found',
                text: 'Item not found in database.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        item.name = name;
        item.price = price;
        item.quantity = quantity;
        loadTable();

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Updated!",
                    text: "Your item has been updated.",
                    icon: "success"
                });
            }
        });
    }
});




function loadTable(){
    $('#item-tbody').empty();
    item_db.map((item, index) => {
        let id = item.id;
        let name = item.name;
        let price = item.price;
        let quantity = item.quantity;

        let  data  =`<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${quantity}</td>
        </tr>`

        $('#item-tbody').append(data);
    })
}