let button = document.getElementById('button')
button.addEventListener('click',function(e){
    e.preventDefault()
    let id = document.getElementById('button').value
    console.log('dfdf',id)
    $.ajax({
        url: '/company/job-post-mode/' + id,
        method: 'POST', //or type
        success: (response) => {
            console.log(response)
            document.getElementById('button').style.backgroundColor = 'red'
            document.getElementById('button').value = 'enable'
        }
    })
})