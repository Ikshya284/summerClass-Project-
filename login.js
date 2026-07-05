
const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password");


//move to dashboard


const loginForm = document.querySelector(".login_form");


//creates a function showError takes 2 parameters input => input field where error occured  and  message => error text to display
function showError(input, message) {
    let error = input.parentElement.querySelector(".error-message");


    //if not error msg in html create one
    if (!error) {
    error = document.createElement("small");
    error.classList.add("error-message");
    input.parentElement.appendChild(error);
}

    error.innerText = message;
    input.classList.add("input-error");

}

//to remove error
function removeError(input){

    const error = input.parentElement.querySelector(".error-message");

    if(error) {
        error.remove();
    }
    input.classList.remove("input-error");
}

//Validate Email when login button is clicked

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    let valid = true;


    //checks if email input is empty
    if(emailInput.value.trim() === ""){
        showError(emailInput,"Email is required");
        valid = false;
    }else{
        removeError(emailInput);
    }

     //checks if email input is empty
    if(passwordInput.value.trim() === ""){
        showError(passwordInput,"Password is required");
        valid = false;
    }else{
        removeError(passwordInput);
    }

    //if not empty and valid
    if(valid){
        window.location.href = "dashboard.html";
    }

});

//to move to sign up page when user clicks sign up text

const signUp  = document.querySelector(".signup-text a");

signUp.addEventListener("click", function(event){
    event.preventDefault;
    window.location.href = "signup.html"

});