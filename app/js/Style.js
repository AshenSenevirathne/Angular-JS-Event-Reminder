document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.datepicker');
    let instances = M.Datepicker.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.timepicker');
    let instances = M.Timepicker.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.tooltipped');
    let instances = M.Tooltip.init(elems, {});
});

