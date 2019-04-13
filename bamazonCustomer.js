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

connection.connect(function(err) {
  if (err) throw err;
  displayProducts();

});
function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " +res[i].item_id+ "|| Product: "+ res[i].product_name+ "|| Price: "+ res[i].price+ "|| Quantity: "+ res[i].stock_quantity);
      }
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
        name:"quantity",
        type:"input",
        message:"How many units would you like to order?"
    
      }])
      .then(function(answer) {
          var product= answer.product;
          var quantity=answer.quantity;
        console.log( "You picked item: "+product+  " with a quantity of : "+ quantity);
        
        connection.query("SELECT * FROM products WHERE ?",{item_id: answer.product}, function(err,res){
            console.log("Your product details: "+ res[0].product_name);
            if (quantity< res[0].stock_quantity) {
                console.log("Your product is in stock, your order will be placed.");
                console.log("Your total is $ "+ res[0].price* quantity);
            }else{
                console.log("Your item is out of stock, please pick something else");
                placeOrder();
            }
            
        })
    
        // connection.query("UPDATE products SET stock_quantity = '(res[0].stock_quantity - quantity)' + WHERE 'item_id: answer.product' ", function(err,results){
        //     displayProducts(results);
        // });
        displayProductsUp();
        connection.end();
      });
  }
  
function displayProductsUp() {
    var query = "UPDATE products SET stock_quantity = '(res[0].stock_quantity - quantity)' + WHERE 'item_id: answer.product' ";
    connection.query(query, function(err, res) {
      for (var a = 0; a < res.length; a++) {
        console.log("Item ID: " +res[a].item_id+ "|| Product: "+ res[a].product_name+ "|| Price: "+ res[a].price+ "|| Quantity: "+ res[a].stock_quantity);
      }
      placeOrder();
    });
  }