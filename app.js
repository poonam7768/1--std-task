const cl = console.log;

const stdform = document.getElementById('stdform')
const stdfName = document.getElementById('stdfName')
const stdlName = document.getElementById('stdlName')
const stdqualification = document.getElementById('stdqualification')
const stdphone = document.getElementById('stdphone')
const stdemail = document.getElementById('stdemail')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')
const stdcontainer = document.getElementById('stdcontainer')
const spinner = document.getElementById('spinner')


const Base_url = `https://crud-dfd04-default-rtdb.firebaseio.com/`
const Student_url = `${Base_url}students.json`

const state = {
     studentArr :[],
     editstd_id :null,
}

function objToArr(obj){
    for(const key in obj){
        obj[key].id = key;
        state.studentArr.unshift(obj[key])
    }
}

function handleSpinner(flag){
    if(flag){
        spinner.classList.remove('d-none')
    }else{
        spinner.classList.add('d-none')
    }
}

function snackBar(msg,icon){
    Swal.fire({
        title:msg,
        timer:3000,
        icon:icon,
    })
}

function makeApiCall(url,methodName,body=null){
    return fetch(url,{
        method:methodName,
        headers:{
            "Content-Type":"application/json",
            "auth":"JWT token"
        },
        body:body ? JSON.stringify(body) : null
    })
    .then(res=>{
        if(!res.ok){
            throw new Error ()
        }
        return res.json()
    })
}

//read....!


function oncreate(){
    handleSpinner(true)
    makeApiCall(Student_url,"GET")
     .then(data =>{
        cl(data)
        objToArr(data)
        templiting(state.studentArr)
     })
     .catch(err=>{
        snackBar("something went wrong !!!" , "error")
     })
     .finally(()=>{
        handleSpinner()
     })
}
oncreate()

function templiting(arr){
    let result = ``
    arr.forEach((std,i)=>{
        result += `
                <tr id="${std.id}">
                    <td>${i+1}</td>
                    <td>${std.First_Name}</td>
                    <td>${std.Last_Name}</td>
                    <td>${std.Qualification}</td>
                    <td>${std.phone}</td>
                    <td>${std.email}</td>
                    <td><button onclick="onedit(this)" class="btn btn-secondary">Edit</button></td>
                    <td><button onclick="ondelete(this)" class="btn btn-danger">Delete</button></td>
                </tr>`
    })
    stdcontainer.innerHTML = result;
}


//create....!

function onAddstd(eve){
     eve.preventDefault();
     let newstdObj = {
       First_Name:stdfName.value,
        Last_Name:stdlName.value,
        Qualification:stdqualification.value,
        phone:stdphone.value,
        email:stdemail.value
     }
     handleSpinner(true)
     makeApiCall(Student_url,"POST",newstdObj)
     .then(res=>{
        cl(res)
        newstdObj.id = res.name
        state.studentArr.unshift(newstdObj)
        templiting(state.studentArr)
        snackBar('new student data added successfully !','success')
        stdform.reset()
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
}

//edit..!

function onedit(ele){
    let editId = ele.closest('tr').id
    state.editstd_id = editId
    let editObj = state.studentArr.find(m=>m.id=== editId)

    stdfName.value = editObj.First_Name,
    stdlName.value = editObj.Last_Name,
    stdqualification.value = editObj.Qualification,
    stdemail.value = editObj.email,
    stdphone.value = editObj.phone,

    addbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')

}

function onupdatestd(eve){
    let updateId = state.editstd_id;
    let updateUrl = `${Base_url}students/${updateId}.json`
    let old_obj = state.studentArr.find(s=>s.id === state.editstd_id)
    let updatedObj = {
        First_Name : stdfName.value,
        Last_Name : stdlName.value,
        Qualification : stdqualification.value,
        email : stdemail.value,
        phone : stdphone.value,
        id: updateId
    }
    handleSpinner(true)
    makeApiCall(updateUrl,"PATCH",updatedObj)
     .then(res=>{
        let getIndex = state.studentArr.findIndex(s=> s.id === updateId)
        state.editstd_id = null;
        state.studentArr[getIndex] = updatedObj;

        templiting(state.studentArr)

        updatebtn.classList.add('d-none')
        addbtn.classList.remove('d-none')
        stdform.reset()

        snackBar('updated successfully !','success')

     })
     .catch(err=>{
        snackBar(err,"error")
     })
     .finally(()=>{
        handleSpinner()
     })
}
//delete....!

function ondelete(ele){
    let removeId = ele.closest('tr').id

     Swal.fire({
  title: "Are you sure?",
  icon: "warning",
  showCancelButton: true,
  
  confirmButtonText: "Yes, Remove it!"
}).then((result) => {
  if (result.isConfirmed) {
    handleSpinner(true)
    let removeUrl= `${Base_url}students/${removeId}.json`
    makeApiCall(removeUrl,"DELETE")
     .then(res =>{
        let getIndex = state.studentArr.findIndex(t=> t.id === removeId)
        state.studentArr.splice(getIndex,1)
        ele.closest('tr').remove()

        let td = [...document.querySelectorAll("#stdcontainer tr td:first-child")];
                       td.forEach((td,i)=>{
                        td.innerHTML = i+1
                       })
        snackBar(`the data removed successfully !!!`,'success')
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
  }
  })
}

stdform.addEventListener("submit",onAddstd)
updatebtn.addEventListener("click",onupdatestd)