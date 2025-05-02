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

$('#customer_update_btn').on("click", function () {
    let customer_id = $("#id").val().trim();
    let name = $("#name").val().trim();
    let address = $("#addres").val().trim();
    let contact = $("#contct").val().trim();

    if (!customer_id) {
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
    } else if (!address) {
        Swal.fire({
            title: 'Invalid Address',
            text: 'Please Enter Valid Address',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else if (!contact) {
        Swal.fire({
            title: 'Invalid Contact',
            text: 'Please Enter Valid Contact',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
    } else {
        let customer = customer_db.find((item) => item.customer_id === customer_id);

        if (!customer) {
            Swal.fire({
                title: 'Not Found',
                text: 'Customer not found in database.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        customer.name = name;
        customer.address = address;
        customer.contact = contact;
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
                    text: "Customer has been updated.",
                    icon: "success"
                });
            }
        });
    }
});



$("#customer-tbody").on('click', 'tr', function(){

    let idx = $(this).index();
    console.log(idx);
    let obj = customer_db[idx];
    console.log(obj);

    let id = obj.customer_id;
    let name = obj.name;
    let address = obj.address;
    let contact = obj.contact


    $('#name').val(name);
    $('#addres').val(address);
    $('#contct').val(contact);
    $('#id').val(id);

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
