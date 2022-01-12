$(document).ready(function () {
    console.log(window.innerWidth);

    if (window.innerWidth < 768) {
        $('#side-nav').addClass('hidden')
        $('#nav-btn').removeClass('hidden')
    }
    else {
        $('#side-nav').removeClass('hidden')
        $('#nav-btn').addClass('hidden')
    }
    $(window).resize(function () {
        if (window.innerWidth < 768) {
            $('#side-nav').addClass('hidden')
            $('#nav-btn').removeClass('hidden')
        }
        else {
            $('#side-nav').removeClass('hidden')
            $('#nav-btn').addClass('hidden')
        }

    })
})