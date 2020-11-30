
$(document).ready(function(){
    sessionStorage.firstl;
    sessionStorage.lastl;
    sessionStorage.passl1;
    sessionStorage.passl2;
    $('input.firstname').keyup(function(e){
        e.preventDefault();
        let val = $(this).val();
        var firstLetter=val.slice(0,1);
        var passletter1= $(this).val().slice(2,4);
        var lastLetter = $('input.lastname').val().slice(0,1);
        var passletter2= $('input.lastname').val().slice(2,4);
        agentCode(lastLetter,firstLetter);
        password(passletter1,passletter2);
    });
    $('input.lastname').keyup(function(e){
        e.preventDefault();
        let val = $(this).val();
        var lastLetter=val.slice(0,1);
        var passletter2 =$(this).val().slice(2,4);
        var firstLetter = $('input.firstname').val().slice(0,1);
        var passletter1= $('input.firstname').val().slice(2,4);
        agentCode(lastLetter,firstLetter);
        password(passletter1,passletter2);
        
    });
    
    
});

function agentCode(last, first){
    const now = new Date()
    const date =now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const hour = now.getHours();
    sessionStorage.firstl=first;
    sessionStorage.lastl= last;
    const initials = sessionStorage.lastl.toUpperCase() + sessionStorage.firstl.toUpperCase() +date+month+hour+year;
    $('input.agentCode').val(initials).text(initials);
}

function password(passletter1, passletter2){
    const now = new Date()
    const min =now.getSeconds();
    if(min<10){
        min='0'+min;
      }
    sessionStorage.passl1=passletter1;
    sessionStorage.passl2= passletter2;
    const password = sessionStorage.passl1.toUpperCase() + min + sessionStorage.passl2.toUpperCase();
    console.log(password);
    $('input.password').val(password).text(password);
}