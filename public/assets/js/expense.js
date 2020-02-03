$('.ui.radio.checkbox').checkbox();
$('.ui.selection.dropdown').dropdown();

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


$('input[name="datepicker"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: moment().year() - 1,
    maxYear: moment().year() + 1,
    locale: {
        format: 'YYYY-MM-DD'
    }
})

const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');

const newTr = `
<tr class="hide">
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half" contenteditable="true">Example</td>
  <td class="pt-3-half">
    <span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-long-arrow-alt-up" aria-hidden="true"></i></a></span>
    <span class="table-down"><a href="#!" class="indigo-text"><i class="fas fa-long-arrow-alt-down" aria-hidden="true"></i></a></span>
  </td>
  <td>
    <span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light">Remove</button></span>
  </td>
</tr>`;

const tableRow = `<tr>
<td class="title" contenteditable="true"></td>
<td class="amount" contenteditable="true"></td>
<td class="date" contenteditable="true">
    <div class="ui calendar" id="example2">
        <div class="ui input left icon">
            <i class="calendar icon"></i>
            <input type="text" placeholder="Date">
        </div>
    </div>
</td>
<td class="category">
    <div class="ui selection fluid dropdown">
        <div class="default text">Please Select</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="expense-category">
        <div class="menu">
            <div class="item" data-value="homeUtil">Home and Utilities</div>
            <div class="item" data-value="groceries">Groceries</div>
            <div class="item" data-value="transport">Transport</div>
            <div class="item" data-value="entEatout">Entertainment and Eat-out</div>
        </div>
    </div>
</td>
<td class="operations">
    <div class="ui small fluid basic icon buttons">
    <button class="ui table-submit new-record disabled save button"><i class="green save icon"></i></button>
    <button class="ui table-remove button"><i class="red minus circle icon"></i></button>
    </div>
</td>
</tr>`

$(document).ready(function () {
    updateTrIndex();
})

$('.table-add').on('click', 'i', () => {
    const $clone = $tableID.find('tbody tr').first().clone(true).removeClass('hide table-line');
    $('tbody').prepend($clone);
    $('.ui.dropdown').dropdown();

    // if ($tableID.find('tbody tr').length === 0) {

    //     $('tbody').append(newTr);
    // }
    // $tableID.find('table').append($clone);
    updateTrIndex();

});

$tableID.on('click', '.table-remove', function () {
    $(this).parents('tr').detach();

    if ($(this).parents('tr').attr("record-id")) {
        $.ajax("api/deleteexpense/" + $(this).parents('tr').attr("record-id"), {
            type: "DELETE",
        })
    }

});

$tableID.on('click', '.table-submit', function () {
    // console.log($(this).parents('tr').children());
    const data = {};

    $(this).parents('tr').children().each(function () {
        // console.log($(this).attr("class"));
        switch ($(this).attr("class")) {
            case "title":
                data["title"] = $(this).text();
                break;
            case "amount":
                data["amount"] = $(this).text();
                break;
            case "date":
                // moment($(this).find('input[name="datepicker"]').val(), 'DD/MM/YYYY').format("YYYY-MM-DD");
                data["date"] = $(this).find('input[name="datepicker"]').val();
                break;
            case "category":
                data["category"] = $(this).find($(".dropdown")).dropdown('get value')[0];
                break;
            case "sentiment":
                data["sentiment"] = $(this).find($(".dropdown")).dropdown('get value')[0];
                break;
        }
    });
    if ($(this).hasClass("new-record")) {
        $.ajax("api/newexpense", {
            type: "POST",
            data: data
        }).then(() => {
            // location.reload();
            $(this).addClass("disabled")

        })
    } else {
        data["id"] = $(this).parents('tr').attr("record-id");
        $.ajax("api/updateexpense", {
            type: "PUT",
            data: data
        }).then(() => {
            // location.reload();
            $(this).addClass("disabled")
        })

    }
});

// $tableID.on('click', '.table-up', function () {

//     const $row = $(this).parents('tr');

//     if ($row.index() === 1) {
//         return;
//     }

//     $row.prev().before($row.get(0));
// });

// $tableID.on('click', '.table-down', function () {

//     const $row = $(this).parents('tr');
//     $row.next().after($row.get(0));
// });

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$("table tbody").on("input change", "tr", function (event) {
    const rowid = this.getAttribute("data-rowid");
    $(`[data-rowid=${rowid}] .ui.save.button`).removeClass("disabled")
})


function updateTrIndex() {
    $("table tbody tr").each(function (index) {
        $(this).attr("data-rowid", index + 1);
        $(this).attr("data-rowid", index + 1);
    })
}

// $(".ui.save.button").on("click",function(event){
//     console.log($(this).parents("tr"));
// })



// $('#example2').calendar({
//     type: 'date'
//   });


