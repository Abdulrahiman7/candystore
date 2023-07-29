const container=document.getElementById('container');
const candy=document.getElementById('candy');
const description=document.getElementById('description');
const price=document.getElementById('price');
const quantity=document.getElementById('quantity');
let ul=document.createElement('ul');
let totalItems=0;
let totalprice=0;
const containerCart=document.getElementById('containerCart');
let carttext=document.createTextNode('');

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
    axios.post('https://crudcrud.com/api/008a4f48c99740b0934b2629ba6a4123/new',newitem)
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
    submit.textContent= 'Add to cart';
    li.appendChild(submit);
    ul.appendChild(li);

    submit.addEventListener('click',function(e){
        e.preventDefault();
        const par=this.parentElement;
        const value = select.value;
        const did=par.id;
        let quantityLeft;
        
        axios.get(`https://crudcrud.com/api/008a4f48c99740b0934b2629ba6a4123/new/${did}`)
        .then((res)=>{
            let qu=res.data.quantity;
            quantityLeft=qu-value;
           
            
            if((quantityLeft)>=0){
                let boughtCandy={
                    'candy':res.data.candy,
                'description':res.data.description,
                'price':res.data.price,
                'quantity':quantityLeft
                }
                totalItems+=parseInt(value);
                totalprice+=value*res.data.price;
                console.log(totalItems)
                console.log(totalprice)
                carttext.nodeValue='Total Items in Cart='+totalItems+'              '+'Total Price='+totalprice;
                containerCart.appendChild(carttext);
                console.log(par.innerHTML)
                const textn=document.createTextNode(res.data.candy+"  "+res.data.description+"  "+res.data.price+"  "+quantityLeft);
                par.textContent='';
                par.appendChild(textn);
                par.appendChild(select);
                par.appendChild(submit);
                axios.put(`https://crudcrud.com/api/008a4f48c99740b0934b2629ba6a4123/new/${did}`,boughtCandy)
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem('totalItems',totalItems);
                    localStorage.setItem('totalprice',totalprice);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
            }else {
                console.error('Not enough Candy');
                par.innerHTML=par.innerHTML+'......................................Sold Out';
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    })
}
window.addEventListener('DOMContentLoaded',()=>{
    axios.get('https://crudcrud.com/api/008a4f48c99740b0934b2629ba6a4123/new')
    .then((res)=>{
        for(let i=0;i<res.data.length;i++){
            display(res.data[i].candy,res.data[i].description,res.data[i].price,res.data[i].quantity,res.data[i]._id);
            console.log(res.data[i]);
            const a=localStorage.getItem('totalItems');
            const b=localStorage.getItem('totalprice');
            carttext.nodeValue='Total Items in Cart='+a+'              '+'Total Price='+b;
                containerCart.appendChild(carttext);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})
container.appendChild(ul);
