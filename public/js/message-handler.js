(function($){
    handler = function(type,title, msg){
        'use strict';
        if(type == "notification"){
            swal({
                title:title,
                text: msg,
                icon: 'warning',
                showCancelButton:true,
                cancelButtonColor:'#fff00065',
                button: {
                    text: "Continue",
                    value: true,
                    visible: true,
                    className: "btn btn-primary"
                }
            });
        }else if(type == "success"){
            swal({
                title:title,
                text: msg,
                icon: 'success',
                showCancelButton:true,
                cancelButtonColor:'#fff00065',
                button:{
                    text:'Close',
                    className:'btn btn-danger',
                    value:true,
                    vsisbility:true,
                    closeModal:true
                }
            });
        }else if(type == "delete"){
            swal({
                title:title,
                text: msg,
                icon: 'success',
                showCancelButton:true,
                cancelButtonColor:'#fff00065',
                button:{
                    cancel:{
                        text:'Close',
                        className:'btn btn-danger',
                        value:null,
                        vsisbility:true,
                        closeModal:true
                    }
                }
            });
        }else if(type == "clear_transaction"){
            swal({
                title : title,
                text: msg,
                content: "input",
                button: {
                  text: "Search!",
                  closeModal: false,
                },
              })
              .then(transaction_code => {
                if (!transaction_code) throw null;
                $.getJSON(`/view-transaction/${transaction_code}`,(result)=>{
                    if(result.code ==100){
                        handler('clear_transaction','Invalid Transction', result.msg+". Please try again");
                    }else{
                        if(result.data.status =="complete"){
                            handler('notification','Warning', "Please not that the transaction is already completed!")
                        }else{
                            var myhtml = document.createElement("div");
                            myhtml.innerHTML = `<div style="border: solid 1px red;border-radius: 25px; margin: 5px">
                                                    <h4>Receiver Details</h4>
                                                    <p>Sender: ${result.data.senderName}</p>
                                                    <p>Sender ID: ${result.data.senderID}</p> 
                                                    <p>Sender: ${result.data.senderName}</p>
                                                    <p>Sender ID: ${result.data.senderID}</p> 
                                                    <p>Sender: ${result.data.senderName}</p>
                                                    <p>Sender ID: ${result.data.senderID}</p>
                                                </div> 
                                                <div style="border: solid 1px red;border-radius: 25px;margin: 5px">
                                                    <h4>Receiver Details</h4>
                                                    <p>Receiver: ${result.data.receiverName}</p>
                                                    <p>Receiver ID: ${result.data.receiverID}</p> 
                                                    <p>Receiver: ${result.data.receiverAddress}</p>
                                                    <p>Receiver ID: ${result.data.senderID}</p> 
                                                    <p>Receiver: ${result.data.senderName}</p>
                                                    <p>Receiver ID: ${result.data.senderID}</p>
                                                </div> 
                                                <input type="hidden" value="${result.data.transaction_code}">`;
                            swal({
                                title:'Clear Transaction',
                                text : "Ref No " + result.data.transaction_code,
                                content:myhtml,
                                showCancelButton:true,
                                cancelButtonColor:'#fff00065',
                                buttons: {
                                    clear:{
                                        text: "Clear Transaction",
                                        value: "clear",
                                        visible: true,
                                        className: "btn btn-primary",
                                    },
                                    cancel:{
                                        text: "Close",
                                        value: true,
                                        visible: true,
                                        className: "btn btn-primary",
                                    }
                                }
                            
                            }).then((value)=>{
                                switch (value) {
                                    case "clear":
                                        
                                        $.getJSON(`/clear-transaction/${result.data.transaction_code}`,(res)=>{
                                            console.log(result);
                                            if(res.code == 0){
                                                handler('success','Cleared', res.msg);
                                            }else{
                                                handler('notification','Error', 'An error occured when proccessing the transaction. Please try again');
                                            }
                                        });
                                        break;
                                
                                    default:
                                        break;
                                }
                            });
                        }
                    }
                });
               
                //return fetch(`/view-transaction/${transaction_code}`);
              });
              /*.then(results => {
                console.log(results);
                if (!results) {
                  return swal("No movie was found!");
                }
               
                const name = movie.trackName;
                const imageURL = movie.artworkUrl100;
               
                /*swal({
                  title: "Top result:",
                  text: name,
                  icon: imageURL,
                });
              })
              .catch(err => {
                if (err) {
                  swal("Oh noes!", "The AJAX request failed!", "error");
                } else {
                  swal.stopLoading();
                  swal.close();
                }
              });*/
        }else{
            swal({
                title:result.transaction_code,
                text: '<h1><b>Hello</b> </h1>',
                //icon: 'warning',
                showCancelButton:true,
                cancelButtonColor:'#fff00065',
                buttons:{
                    cancel:{
                        text:'Cancel',
                        className:'btn btn-danger',
                        value:null,
                        vsisbility:true,
                        closeModal:true
                    }
                }
            });
        }
    }

    transactionClear = function(transaction_code){
        if (!transaction_code) throw null;
        $.getJSON(`/view-transaction/${transaction_code}`,(result)=>{
            if(result.code ==100){
                handler('clear_transaction','Invalid Transction', result.msg+". Please try again");
            }else{
                if(result.data.status =="complete"){
                    handler('notification','Warning', "Please not that the transaction is already completed!")
                }else{
                    var myhtml = document.createElement("div");
                    myhtml.innerHTML = `<div style="border: solid 1px red;border-radius: 25px; margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p>
                                        </div> 
                                        <div style="border: solid 1px red;border-radius: 25px;margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Receiver: ${result.data.receiverName}</p>
                                            <p>Receiver ID: ${result.data.receiverID}</p> 
                                            <p>Receiver: ${result.data.receiverAddress}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p> 
                                            <p>Receiver: ${result.data.senderName}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p>
                                        </div> 
                                        <input type="hidden" value="${result.data.transaction_code}">`;
                    swal({
                        title:'Clear Transaction',
                        text : "Ref No " + result.data.transaction_code,
                        content:myhtml,
                        showCancelButton:true,
                        cancelButtonColor:'#fff00065',
                        buttons: {
                            clear:{
                                text: "Clear Transaction",
                                value: "clear",
                                visible: true,
                                className: "btn btn-primary",
                            },
                            cancel:{
                                text: "Close",
                                value: true,
                                visible: true,
                                className: "btn btn-primary",
                            }
                        }
                    
                    }).then((value)=>{
                        switch (value) {
                            case "clear":
                                
                                $.getJSON(`/clear-transaction/${result.data.transaction_code}`,(res)=>{
                                    console.log(result);
                                    if(res.code == 0){
                                        swal({
                                            title:'Successfully cleared',
                                            text: res.msg,
                                            icon: 'success',
                                            showCancelButton:true,
                                            cancelButtonColor:'#fff00065',
                                            button:{
                                                text:'Close',
                                                className:'btn btn-danger',
                                                value:true,
                                                vsisbility:true,
                                                closeModal:true
                                            }
                                        }).then(value=>{
                                            if(value){
                                                location.reload();
                                            }
                                        });
                                    }else{
                                        handler('notification','Error', 'An error occured when proccessing the transaction. Please try again');
                                    }
                                });
                                break;
                        
                            default:
                                break;
                        }
                    });
                }
            }
        });
    }

    handleDeletes = function(title, id,entity_type, msg){
        if(entity_type == "transaction"){
            $.getJSON(`/view-transaction/${id}`,(result)=>{
                if(result.data.status == "Pending"){
                    handler('notification','Error','Oooh you cannot delete an incomplete record. Please make sure the transectoin is copmlete');
                }else{
                    
                    swal({
                        title:title,
                        text: msg,
                        icon: 'warning',
                        showCancelButton:true,
                        cancelButtonColor:'#fff00065',
                        buttons: {
                            delete:{
                                text: "Yes(Delete)",
                                value: "delete",
                                visible: true,
                                className: "btn btn-primary",
                            },
                            cancel:{
                                text: "Cancel",
                                value: true,
                                visible: true,
                                className: "btn btn-primary",
                            }
                        }
                    }).then(value=>{
                        switch(value){
                            case "delete":
                                $.getJSON(`/delete-record/${id}/${entity_type}`,(res)=>{
                                    if(res.code == 500){
                                        location.reload();
                                        handler('warning','Error',res.msg);
                                    }else{
                                        swal({
                                            title:'Success',
                                            text: res.msg,
                                            icon: 'success',
                                            showCancelButton:true,
                                            cancelButtonColor:'#fff00065',
                                            button:{
                                                text:'Close',
                                                className:'btn btn-danger',
                                                value:true,
                                                vsisbility:true,
                                                closeModal:true
                                            }
                                        }).then(value=>{
                                            if(value){
                                                location.reload();
                                            }
                                        });
                                    }
                                    
                                });
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        }
    }

    transactionDetails = function(id){
        if (!id) throw null;
        $.getJSON(`/view-transaction/${id}`,(result)=>{
            if(result.code ==500){
                handler('warning','Error', "Error getting data. Please try again");
            }else{
                if(result.data.status =="complete"){
                    var myhtml = document.createElement("div");
                    myhtml.innerHTML = `<div style="border: solid 1px red;border-radius: 25px; margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p>
                                        </div> 
                                        <div style="border: solid 1px red;border-radius: 25px;margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Receiver: ${result.data.receiverName}</p>
                                            <p>Receiver ID: ${result.data.receiverID}</p> 
                                            <p>Receiver: ${result.data.receiverAddress}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p> 
                                            <p>Receiver: ${result.data.senderName}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p>
                                        </div> 
                                        <input type="hidden" value="${result.data.transaction_code}">`;
                    swal({
                        title:'Status: '+result.data.status,
                        text : "Ref No " + result.data.transaction_code,
                        content:myhtml,
                        showCancelButton:true,
                        cancelButtonColor:'#fff00065',
                        button: {
                            cancel:{
                                text: "Close",
                                value: true,
                                visible: true,
                                className: "btn btn-primary",
                            }
                        }
                    
                    });
                }else{
                    var myhtml = document.createElement("div");
                    myhtml.innerHTML = `<div style="border: solid 1px red;border-radius: 25px; margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p> 
                                            <p>Sender: ${result.data.senderName}</p>
                                            <p>Sender ID: ${result.data.senderID}</p>
                                        </div> 
                                        <div style="border: solid 1px red;border-radius: 25px;margin: 5px">
                                            <h4>Receiver Details</h4>
                                            <p>Receiver: ${result.data.receiverName}</p>
                                            <p>Receiver ID: ${result.data.receiverID}</p> 
                                            <p>Receiver: ${result.data.receiverAddress}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p> 
                                            <p>Receiver: ${result.data.senderName}</p>
                                            <p>Receiver ID: ${result.data.senderID}</p>
                                        </div> 
                                        <input type="hidden" value="${result.data.transaction_code}">`;
                    swal({
                        title:'Status: '+result.data.status,
                        text : "Ref No " + result.data.transaction_code,
                        content:myhtml,
                        showCancelButton:true,
                        cancelButtonColor:'#fff00065',
                        buttons: {
                            delete:{
                                text: "Yes(Delete)",
                                value: "delete",
                                visible: true,
                                className: "btn btn-primary",
                            },
                            cancel:{
                                text: "Close",
                                value: true,
                                visible: true,
                                className: "btn btn-primary",
                            }
                        }
                    
                    }).then((value)=>{
                        switch (value) {
                            case "clear":
                                
                                $.getJSON(`/clear-transaction/${result.data.transaction_code}`,(res)=>{
                                    console.log(result);
                                    if(res.code == 0){
                                        swal({
                                            title:'Successfully cleared',
                                            text: res.msg,
                                            icon: 'success',
                                            showCancelButton:true,
                                            cancelButtonColor:'#fff00065',
                                            button:{
                                                text:'Close',
                                                className:'btn btn-danger',
                                                value:true,
                                                vsisbility:true,
                                                closeModal:true
                                            }
                                        }).then(value=>{
                                            if(value){
                                                location.reload();
                                            }
                                        });
                                    }else{
                                        handler('notification','Error', 'An error occured when proccessing the transaction. Please try again');
                                    }
                                });
                                break;
                        
                            default:
                                break;
                        }
                    });
                }
            }
        });
    }
})(jQuery);
