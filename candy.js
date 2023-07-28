const container=document.getElementById('container');
const candy=document.getElementById('candy');
const description=document.getElementById('description');
const price=document.getElementById('price');
const quantity=document.getElementById('quantity');
let ul=document.createElement('ul');

const newcandy=document.getElementById('submit');
newcandy.addEventListener('click',newcand);

function newcand(e){
    e.preventDefault();
    const can=candy.value;
    const des=description.value;
    const pri=price.value;
    const qua= quantity.value;
    let newitem={
        'candy':can,
        'description':des,
        'price':pri,
        'quantity':qua
    }
    axios.post('https://crudcrud.com/api/502b69fe536447a285dc1dae92a59c44/new',newitem)
    .then((res)=>{
        console.log(res)
        const dataId=res.data._id;
        display(can,des,pri,qua,dataId)
    })
    .catch((err)=>{
        console.log(err)
    })
    
}
function display(c,d,p,q,id){
    const li=document.createElement('li');
    li.setAttribute('id',id);
    li.setAttribute('quantity',q);
    const text=document.createTextNode(c+"  "+d+"  "+p+"  "+q);
    const select=document.createElement('select');
    select.id='selectid';
    for(let i=1;i<=10;i++){
        let option=document.createElement('option');
        option.textContent= i;
        option.value= i;
        select.add(option);
    }
    li.appendChild(text);
    li.appendChild(select);
    
    const submit=document.createElement('button');
    submit.id='buy';
    submit.textContent= 'Buy';
    li.appendChild(submit);
    ul.appendChild(li);

    submit.addEventListener('click',function(e){
        e.preventDefault();
        const par=this.parentElement;
        const value = select.value;
        const did=par.id;
        let isTrue=true;
        let quantityLeft;
        axios.get(`https://crudcrud.com/api/502b69fe536447a285dc1dae92a59c44/new/${did}`)
        .then((res)=>{
            let qu=res.data.quantity;
            
            quantityLeft=qu-value;
            
            if((quantityLeft)>=0){
                let boughtCandy={
                    'candy':res.data.candy,
                'description':res.data.candy,
                'price':res.data.candy,
                'quantity':quantityLeft
                }
                axios.put(`https://crudcrud.com/api/502b69fe536447a285dc1dae92a59c44/new/${did}`,boughtCandy)
                .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
            }else console.error('Not enough Candy');
        })
        .catch((err)=>{
            console.log(err);
        })

    })
}
window.addEventListener('DOMContentLoaded',()=>{
    axios.get('https://crudcrud.com/api/502b69fe536447a285dc1dae92a59c44/new')
    .then((res)=>{
        for(let i=0;i<res.data.length;i++){
            display(res.data[i].candy,res.data[i].description,res.data[i].price,res.data[i].quantity,res.data[i]._id);
            console.log(res.data[i]);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})
container.appendChild(ul);