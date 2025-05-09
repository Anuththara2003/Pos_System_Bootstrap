import {customer_db, item_db,} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
// import { setCustomerIds } from '../Controller/OrderController';


$('#save-customer').on("click", function () {
    let customer_id;

    // Generate new customer ID
    if (customer_db.length > 0) {
        const lastCustomer = customer_db[customer_db.length - 1].customer_id;
        customer_id = parseInt(lastCustomer.slice(1)) + 1;
        customer_id = "C" + customer_id.toString().padStart(3, '0');
    } else {
        customer_id = "C001";
    }

    // Get input values
    var name = $("#name").val().trim();
    var address = $("#addres").val().trim();
    var contact = $("#contct").val().trim();

    // Validation
    if (!name) {
        Swal.fire({
            title: 'Invalid Name',
            text: 'Please enter a valid name.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
        return;
    }

    if (!address) {
        Swal.fire({
            title: 'Invalid Address',
            text: 'Please enter a valid address.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
        return;
    }

    if (!contact) {
        Swal.fire({
            title: 'Invalid Contact',
            text: 'Please enter a valid contact.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
        return;
    }

    // Save data
    let Customer_data = new CustomerModel(
        customer_id,
        name,
        address,
        contact
    );
    customer_db.push(Customer_data);

    // Reload table
    loadTable();

    // Show success alert
    Swal.fire({
        title: 'Success!',
        text: 'Customer added successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Optional: clear inputs after saving
    $("#name").val('');
    $("#addres").val('');
    $("#contct").val('');
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

$("#customer_delete_btn").on("click", function () {
    let customer_id = $("#id").val().trim();

    const customerIndex = customer_db.findIndex((item) => item.customer_id === customer_id);

    if (customerIndex === -1) {
        Swal.fire({
            title: 'Customer Not Found',
            text: 'Customer not found in database.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Confirmation before deleting
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove customer from array
            customer_db.splice(customerIndex, 1);
            loadTable();

            Swal.fire({
                title: "Deleted!",
                text: "Customer has been deleted.",
                icon: "success"
            });

            // Optional: clear fields
            $("#id").val('');
            $("#name").val('');
            $("#addres").val('');
            $("#contct").val('');
        }
    });
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
