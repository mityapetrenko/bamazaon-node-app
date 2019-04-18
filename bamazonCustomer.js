var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon Store\n");
    console.log("Please take a look at our inventory!");
    console.log("***************************************************************");
    displayProducts();

});
function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: " + res[i].price + "|| Quantity: " + res[i].stock_quantity);
        }
        console.log("*************************************************************");
        console.log("\n");
        placeOrder();
    });
}
function placeOrder() {
    inquirer
        .prompt([{
            name: "product",
            type: "input",
            message: "Which product would you like to order (type ID number please)?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to order?"

        }])
        .then(function (answer) {
            var product = answer.product;
            var quantity = answer.quantity;
            console.log("\n");
            console.log("******************************************************************");
            console.log("You picked item number: " + product + " with a quantity of : " + quantity);

            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.product }, function (err, res) {

                var updatedQuantity = res[0].stock_quantity - quantity;

                var selectItem = res[0].product_name;
                console.log("Your item is: " + selectItem);
                console.log("*********************************");
                if (quantity < res[0].stock_quantity) {
                    console.log("Your product is in stock, your order will be placed.");
                    console.log("********************************************************");
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: res[0].stock_quantity - quantity
                            },
                            {
                                item_id: answer.product
                            }
                        ], function (err, res) {
                            console.log("Only " + updatedQuantity + " " + selectItem + " left.\nCome and get them");
                            console.log("\nThank you for shopping our Bamazon store.\nWe look forward to seeing you soon");
                        })
                    console.log("Your total is $ " + res[0].price * quantity);
                    console.log("************************");
                } else {

                    console.log("Your item is out of stock, please pick something else");
                    console.log("\n");
                    displayProducts();

                }
            })
        })
};
