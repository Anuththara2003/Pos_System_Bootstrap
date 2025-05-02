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