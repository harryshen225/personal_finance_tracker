// import { json } from "sequelize/types";

$('.ui.radio.checkbox').checkbox();
$('.ui.selection.dropdown').dropdown();
$('.ui.accordion')
    .accordion();

const categories = {
    income: 0,
    homeUtil: 0,
    groceries: 0,
    transport: 0,
    entEatout: 0
}

const entities = ['salary', 'rental','otherIncome','gasElecWater','phoneInt','huOther','food','groceriesOther','publicTrans','fuelParkings','eatout','ent'];

function updateCategoryTotal(amountField, targetDom,income=false){
    const subTotal = $(amountField).toArray().map(inc=>inc.value).reduce((inc1,inc2) => parseInt(inc1)+parseInt(inc2),0);
    if(income){
        $(targetDom).text(`$${subTotal}`);
        return subTotal;
    }else{
        $(targetDom).text(`$${subTotal*(-1)}`);
        return subTotal*(-1);
    }
}

// function updateCategoryTotal2(amountField, targetDom, categoryName,income=false){
//     const subTotal = $(amountField).toArray().map(inc=>parseInt(inc.value)*parseInt($(`#${categoryName}-cadence`).dropdown("get value"))/52).reduce((inc1,inc2) => inc1+inc2),0);
//     if(income){
//         $(targetDom).text(`$${subTotal}`);
//         return subTotal;
//     }else{
//         $(targetDom).text(`$${subTotal*(-1)}`);
//         return subTotal*(-1);
//     }
// }

$(document).ready(function getBudgetDetails(){
    $('.ui.dropdown').dropdown();
    $('.sidebar-menu-toggler').on('click', function () {
        var target = $(this).data('target');
        $(target)
            .sidebar({
                dinPage: true,
                transition: 'overlay',
                mobileTransition: 'overlay'
            })
            .sidebar('toggle');
    });
    $.get("api/getBudget",function(res){
        res.forEach(data => categories[data.category] = data.amount);
        $('#budget-total-income').text(`$${categories.income}`);
        $('#budget-total-home-utilities').text(`$${categories.homeUtil}`);
        $('#budget-total-groceries').text(`$${categories.groceries}`);
        $('#budget-total-transport').text(`$${categories.transport}`);
        $('#budget-total-ent-eatout').text(`$${categories.entEatout}`);
        updateGrandTotal();
    });


    $.get("api/getBudgetDetails",function(res){
        res.forEach(data => {
            $(`#${data.name}-amount`).val(data.amount);
            $(`#${data.name}-cadence`).dropdown('set selected',parseInt(data.cadence));
        });
    });
});


function updateGrandTotal(){
    const grandTotal = Object.values(categories).reduce((inc1,inc2) => inc1+inc2,0);
    $("#budget-total").text(`$${grandTotal}`);
}

$(`#incomes-accordion`).on(`input`,function(event){
    categories["income"] = updateCategoryTotal(`.amount.income`,`#budget-total-income`,true);
    updateGrandTotal();
})


$(`#home-utilities-accordion`).on(`input`,function(event){
    categories["homeUtil"] = updateCategoryTotal(`.amount.home.utilities`,`#budget-total-home-utilities`);
    // categories["homeUtil"] = updateCategoryTotal2(`.amount.home.utilities`,`#budget-total-home-utilities`,``);
    updateGrandTotal();
})

$(`#groceries-accordion`).on(`input`,function(event){
    categories["groceries"] = updateCategoryTotal(`.amount.groceries`,`#budget-total-groceries`);
    updateGrandTotal();
})

$(`#transport-accordion`).on(`input`,function(event){
    categories["transport"] = updateCategoryTotal(`.amount.transport`,`#budget-total-transport`);
    updateGrandTotal();
})

$(`#ent-eatout-accordion`).on(`input`,function(event){
    categories["entEatout"] = updateCategoryTotal(`.amount.ent.eatout`,`#budget-total-ent-eatout`);
    updateGrandTotal();
})

$('#submit-budget').on('click',async function(event){
    const data = {};
    entities.forEach(ele=>{
        data[ele]={
            amount: $(`#${ele}-amount`).val(),
            cadence: $(`#${ele}-cadence`).dropdown('get value')
        }
    })

    console.log(data);
    $.ajax("/api/updateBudgetDetails",{
        type: "PUT",
        data:data
    }).then(function(){
        $.ajax("/api/updateBudget",{
            type: "PUT",
            data:categories
        }).then(function(){
            location.reload();
        })
    })
})

$('#discard-budget').on('click',async function(event){ location.reload()})


