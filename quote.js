//Creates Array of all building types: ['.residential', '.commercial', '.corporate', '.hybrid']
const BUILDING_TYPE = $("#building-type option").map(function() {return "." + $(this).val(); }).get().slice(1);

//Dictionary to get unit prices and percentages needed for CALCULATIONS
const PRICE = {
  "standard": [7565, 0.10],
  "premium": [12345, 0.13],
  "excelium": [15400, 0.16]
};

//...u know this one
$('document').ready(function() {
  hideAll();
});

//Converts any number into USD notation with a comma "," every three digits
function toDollar(n) {return n.toLocaleString('en-US', {style:'currency', currency: 'USD'});}

//Updates read only inputs with CALCULATIONS
function updateData() {
  //Gets current state of "#building-type" <select> and calls function of the same name to get array
  let fn = window[$("#building-type").val()];
  if (typeof fn === "function") {
    let arr = fn();
    //Loops through all read only "#answers" inputs and updates them
    $("#answers :input[type=text]").each(function(i) {
      if(i == 0) $(this).val(arr[i]);
      else if (i == 1 && arr[0] == 0) $(this).val(toDollar(arr[i+1]));
      else $(this).val(toDollar(arr[i]));
    });
  }
}

//Checks if all elements in an array are empty. If they are, clear all read only "#answers" inputs 
function ifEmpty(arr = []) {
  if (arr.every(i => i === "")) {
    $("#answers :input[type=text]").each(function(i) {
      if(i == 0) $(this).val("0");
      else $(this).val("$0.00");
    });
  }
}

//Hides all elements of the form except for the dropdown and header
function hideAll(n = 0) {
  for(let i = 0; i < BUILDING_TYPE.length; i++) $(BUILDING_TYPE[i]).hide(n);
  $("#answers").hide(n);
}

//Shows fields of a specific class
function showFields(type) {
  if (type != "select") {
    hideAll();
    $("." + type).show(500);
    $("#answers").show(500);
  }
  else {
    hideAll(500);
  }
}

//Clears all inputs and calls showFields with argument being the current state of the "#building-type" <select>
$("#building-type").change(function() {
  $(".quote-input :input").val('');
  showFields($(this).val());
  ifEmpty();
});

//Calls updateData() whenever inputs are changed
$('.quote-input :input').change(updateData);
//Calls updateData() whenever radio buttons are changed
$('input:radio[name="price"]').change(function() {updateData(); ifEmpty($(".quote-input :input").map(function() {return $(this).val(); }).get());});

//--------------------CALCULATIONS/-----------------------------------
//Calculations for residential form
function residential() {
  //Gets all inputs under the .resident class
  let arr = $(".residential :input").map(function() {if (!$(this).val()) return 0; return $(this).val(); }).get();
  let appartments = parseInt(arr[0]);
  let floors = parseInt(arr[1]);
  let appPerFloor = Math.ceil(appartments / floors);
  let collumns = (Math.ceil(floors / 20));
  let elevators = (Math.ceil(appPerFloor / 6)) * collumns;
  if (!isFinite(elevators) || elevators < 1) elevators = 0;
  //Checks current state of "price" radio and gets the array associated with that key in PRICE dict
  let [unit, fee] = PRICE[$("input[name='price']:checked").val()];
  let totalEl = unit * elevators;
  let totalFee = unit * elevators * fee;
  let total = (unit * elevators) + unit * elevators * fee;
  //Outputs everything as an array
  console.log([elevators, unit, totalEl, totalFee, total])
  return [elevators, unit, totalEl, totalFee, total];
}

//Calculations for commercial form
function commercial() {
  //Gets all inputs under the .commercial class
  let arr = $(".commercial :input").map(function() {if (!$(this).val()) return 0; return $(this).val(); }).get();
  let elevators = parseInt(arr[4]);
  if (!isFinite(elevators) || elevators < 1) elevators = 0;
  //Checks current state of "price" radio and gets the array associated with that key in PRICE dict
  let [unit, fee] = PRICE[$("input[name='price']:checked").val()];
  let totalEl = unit * elevators;
  let totalFee = unit * elevators * fee;
  let total = (unit * elevators) + unit * elevators * fee;
  //Outputs everything as an array
  console.log([elevators, unit, totalEl, totalFee, total])
  return [elevators, unit, totalEl, totalFee, total];
}

//Calculations for corporate/hybrid form
function corpoHybrid() {
  //Gets all inputs under the class that matches current state of "#building-type" <select>
  let arr = $("." + $("#building-type").val() + " :input").map(function() {if (!$(this).val()) return 0; return $(this).val(); }).get();
  let floors = parseInt(arr[1]) + parseInt(arr[2]);
  let occupants = parseInt(arr[4]) * floors;
  let elevators = Math.floor(occupants/1000);
  let collumns = Math.ceil(floors/20);
  let elPerCol = Math.ceil(elevators / collumns);
  if (!isFinite(elevators) || elevators < 1) elevators = 0;
  else elevators = collumns * elPerCol;
  //Checks current state of "price" radio and gets the array associated with that key in PRICE dict
  let [unit, fee] = PRICE[$("input[name='price']:checked").val()];
  let totalEl = unit * elevators;
  let totalFee = unit * elevators * fee;
  let total = (unit * elevators) + unit * elevators * fee;
  //Outputs everything as an array
  console.log([elevators, unit, totalEl, totalFee, total])
  return [elevators, unit, totalEl, totalFee, total];
}
//Creates functions aliases used for updateData()
var corporate = corpoHybrid;
var hybrid = corpoHybrid;
//--------------------/CALCULATIONS-----------------------------------