import {customer_db, item_db,} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
// import { setCustomerIds } from '../Controller/OrderController';



$('#save-customer').on ("click",function() {
    let customer_id;

    if (customer_db.length > 0) {
        const lastCustomer = customer_db[customer_db.length - 1].customer_id;
        console.log(lastCustomer);
        customer_id = parseInt(lastCustomer.slice(1)) + 1;
        customer_id = "C" + customer_id.toString().padStart(3, '0');
    } else {
        customer_id = "C001";
    }
    var name = $("#name").val();
    var address = $("#addres").val();
    var contact = $("#contct").val();

    let Customer_data = new CustomerModel(customer_id, name, address, contact);
    console.log(Customer_data);
    customer_db.push(Customer_data);

    loadTable();

});

function  loadTable(){
    $('#customer-tbody').empty();
    customer_db.map((item, index) => {
        let id = item.customer_id;
        let name = item.name;
        let address = item.address;
        let contact = item.contact;

      let  data  =`<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${address}</td>
            <td>${contact}</td>
        </tr>`
        $('#customer-tbody').append(data);

    })
}
