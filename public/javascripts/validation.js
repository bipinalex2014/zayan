$.validator.addMethod("email", function (value, element) {
    return this.optional(element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}, "Enter email address like yourname@example.com");
jQuery.validator.addMethod("lettersonly", function(value, element) 
{
return this.optional(element) || /^[a-z," "]+$/i.test(value);
}, "Letters and spaces only please"); 
$("#customerForm").validate({
    errorPlacement: (error, element) => {
        error.addClass('invalid-feedback')
        error.appendTo(element.parent('div'))
    },
    highlight: function (element) {
        $(element).addClass('is-invalid').removeClass('is-valid')
    },
    unhighlight: function (element) {
        $(element).removeClass('is-invalid').addClass('is-valid')
    },
    rules: {
		name:{
            required: true,

        }, 
        address:{
            required:true,
            lettersonly: true,
            // pattern: "^[a-zA-Z_]*$",
        },
        date:{
            required:true
        },
        // email:{
        //     required: true,
        // },
        email: {
            required:  true,
            email: true
        },
        mobile:{
            required: true,
            number: true,
            minlength:10,
            maxlength:10
        },
        
        // description:{
        //     required:true,
            
        // },
        // skills:{
        //     required:true,
            
        // },
        // qualification:{
        //     required:true,
            
        // }

        // age:{
        //     required: true,
        //     minlength: 3
        // }
        
        
    },
    // messages:{
    //     // email:'please enter a valid email'
    //     // fname:'please enter your first name'
    //     // number:'please enter 10 digit number',
    //     // // cpwd:'password not matching',
        
    //     // pwd: {
    //     //     minlength: "Password must have atleast 8 charecters"
    //     // },
    //     // cpwd: {
    //     //     equalTo: "Passwords not matching"
    //     // },
    // },

});

