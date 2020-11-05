let backToTopBtn = document.querySelector('.back-to-top');

window.onscroll = function () {
    scrollFunction();
};

const scrollFunction = () => {
    if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
    ) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.classList.add('animate__backInUp');
    } else {
        backToTopBtn.style.display = 'none';
        backToTopBtn.classList.remove('animate__backInUp');
    }
};

const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

const sortByPrice = arr => {
    arr.sort((a, b) => {
        return parseFloat(a.price) - parseFloat(b.price);
    });
};
const sortByReview = arr => {
    arr.sort((a, b) => {
        return parseFloat(a.reviews) - parseFloat(b.reviews);
    });
};
const sortByName = arr => {
    arr.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
};

const sortBySaving = arr => {
    arr.sort((a, b) => {
        return parseFloat(b.price) - parseFloat(a.was_price);
    });
};

const handleSortByClick = (className, eventType, functionName) => {
    let button = document.querySelector(className);
    button.addEventListener(eventType, functionName);
};

const priceFormat = num => {
    return num.toString().replace(/\B(?=(\d{2})+(?!\d))/g, '.');
};

const htmlOutput = (name, price, was_price, reviews, img) => {
    let reviewString = reviews
        ? `<p style=" justify-self: flex-end; color: green;text-align: center; font-size: 22px;" >${reviews}% Review Score</p>`
        : '';
    let wasPrice = was_price
        ? `<p style="margin: 0; color: red;text-align: center; font-size: 22px;" >Was £<s>${was_price}</s></p>`
        : '';

    return `
                <div 
                    class="card border-secondary mb-3 animate__animated animate__fadeIn" 
                    style="
                        display: flex;
                        justify-content: center;
                        
                    ">
                    <div 
                        class="card-body" 
                        style="
                            text-align: center; 
                            display: flex;
                            flex-direction: column;">
                        <img src="img/${img}.jpg" style="width: 100%; height: auto;" />
                        <h4 class="card-title" style="font-weight: bold; margin-top: 10px;" >${name}</h4>
                    </div>
                    <div>
                        <p style="margin: 0; text-align: center; font-size: 22px;">£${priceFormat(
                            price
                        )}</p>
                        <p>${priceFormat(wasPrice)}</p>
                    </div>
                    <div style="
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    ">
                        ${reviewString}
                        <button 
                            type="button" 
                            class="btn btn-primary"
                            style="
                                padding: 15px;
                                font-size: 22px;
                                margin: 15px;"
                        >Add To Basket</button>
                    </div>
                </div>
            `;
};

const SORT_BY_PRICE = 'SORT_BY_PRICE';
const SORT_BY_REVIEW = 'SORT_BY_REVIEW';
const SORT_BY_NAME = 'SORT_BY_NAME';
const SORT_BY_SAVING = 'SORT_BY_SAVING';

const loadProducts = (method, file, bool, filterType) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, file, bool);
    xhr.onload = function () {
        if (this.status == 200) {
            let productList = JSON.parse(this.responseText);
            let productArr = productList.product_arr;
            switch (filterType) {
                case SORT_BY_PRICE:
                    sortByPrice(productArr);
                    break;
                case SORT_BY_REVIEW:
                    sortByReview(productArr);
                    break;
                case SORT_BY_NAME:
                    sortByName(productArr);
                    break;
                case SORT_BY_SAVING:
                    sortBySaving(productArr);
                    break;
                default:
                    productArr;
                    break;
            }
            let productItem = productArr
                .map(product => {
                    const { name, price, was_price, reviews, img } = product;

                    return htmlOutput(name, price, was_price, reviews, img);
                })
                .join('');
            document.querySelector(
                '.product_container'
            ).innerHTML = productItem;
        }
    };
    xhr.send();
};

loadProducts('GET', 'data/product.json', true);
handleSortByClick('.price_button', 'click', () =>
    loadProducts('GET', 'data/product.json', true, SORT_BY_PRICE)
);
handleSortByClick('.review_button', 'click', () =>
    loadProducts('GET', 'data/product.json', true, SORT_BY_REVIEW)
);
handleSortByClick('.name_button', 'click', () =>
    loadProducts('GET', 'data/product.json', true, SORT_BY_NAME)
);
handleSortByClick('.saving_button', 'click', () =>
    loadProducts('GET', 'data/product.json', true, SORT_BY_SAVING)
);
