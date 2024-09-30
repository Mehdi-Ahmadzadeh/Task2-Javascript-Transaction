

const upload__btn = document.querySelector(".content button")
const transactions = document.querySelector(".transaction__list")
const table = document.querySelector(".table")
const chevron = document.querySelector(".price__chevron")
const dateChevron = document.querySelector(".date__chevron")
const searchInput = document.querySelector(".search__input")
const searchForm = document.querySelector(".search__transactions")

let allData = [];
let sortPriceValue = "asc";
let sortDateValue = "asc";
let priceChevronStatus = "up";
let dateChevronStatus = "up";

searchInput.addEventListener("input",filterData)

async function filterData(e){
  const id = e.target.value;
  try{
    const res = await axios.get(
      `http://localhost:3000/transactions?refId_like=${id}`
    );
    const filteredData = res.data;
    createDataTable(filteredData)
  }catch(err){
    console.log(err);
  }
}


async function getData(){
    try{
        const res = await axios.get("http://localhost:3000/transactions");
        allData = res.data;
        createDataTable(allData)
    }catch(e){
        console.log(e);
    }
  }
  
upload__btn.addEventListener("click",()=>{
    upload__btn.classList.add("hidden")
    transactions.classList.remove("hidden")
    searchForm.classList.remove("hidden")
    getData();
})


function createDataTable(data){
    let result = `<tr>
                <th>ردیف</th>
                <th>نوع تراکنش</th>
                <th class="price__col">
                  <p>مبلغ</p>
                  <div class="price__chevron">
                  <i class="fa fa-chevron-${priceChevronStatus} chevron" aria-hidden="true"></i>
                  </div>
                </th>
                <th>شماره پیگیری</th>
                <th class="date__col">
                  <p>تاریخ تراکنش</p>
                  <div class="date__chevron">
                  <i class="fa fa-chevron-${dateChevronStatus} date-chevron" aria-hidden="true"></i>
                  </div>
                </th>
              </tr>`;
    data.forEach((item) => {
        result += `<tr>
                <td>${item.id}</td>
                <td class="${
                   item.type === "افزایش اعتبار"
                     ? "green_text"
                     : item.type === "برداشت از حساب"
                     ? "red_text"
                     : ""
                 }">${item.type}</td>
                <td>${item.price}</td>
                <td>${item.refId}</td>
                <td>${new Date(item.date).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })} ساعت ${new Date(item.date).toLocaleTimeString("fa-IR", {
       hour: "2-digit",
       minute: "2-digit",
     })}</td>
              </tr>`
    });
    table.innerHTML = result;

    const sortPrice = document.querySelector(".chevron")
    sortPrice.addEventListener("click",()=>{
      if(priceChevronStatus === "up"){
        priceChevronStatus = "down"
      }else priceChevronStatus = "up";
      sortByPrice()
    })

    const sortDate = document.querySelector(".date-chevron")
    sortDate.addEventListener("click",()=>{
      if(dateChevronStatus === "up"){
        dateChevronStatus = "down"
      }else dateChevronStatus = "up";
      sortByDate()
    })
}

async function sortByDate(){
  try{
    const res = await axios.get("http://localhost:3000/transactions")
    const data = res.data
    let sortedData = [];

    if(sortDateValue === "asc"){
      sortedData = data.sort((a, b)=> b.date - a.date)
      sortDateValue = "dec";
    }else {
      sortedData = data.sort((a, b)=> a.date - b.date)
      sortDateValue = "asc";
    }
    
    createDataTable(sortedData)

}catch(err){
    console.log(err);
}
}


async function sortByPrice(){
    try{
        const res = await axios.get("http://localhost:3000/transactions")
        const data = res.data
        let sortedData = [];

        if(sortPriceValue === "asc"){
          sortedData = data.sort((a, b)=> b.price - a.price)
          sortPriceValue = "dec";
        }else {
          sortedData = data.sort((a, b)=> a.price - b.price)
          sortPriceValue = "asc";
        }
        
        createDataTable(sortedData)

    }catch(err){
        console.log(err);
    }
}