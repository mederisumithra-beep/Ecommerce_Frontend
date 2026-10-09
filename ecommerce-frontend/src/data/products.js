import iphone from "../images/iPhone15.jpg";
import samsung from "../images/Samsung S24 ultra.jpg";
import sony from "../images/sony headphones.jpg";
import dell from "../images/dell laptop.jpg";
import appleWatch from "../images/Apple watch.jpg";


const products = [
    {
        id : 1,
        name:"iPhone 15",
        price:59999,
        category : "mobiles",
        image : iphone,
        description:
            "iPhone 15 with a powerful processor, advanced camera system, and a bright display."
    },
    {
        id : 2,
        name:"Samsung S24 ultra",
        price:74999,
        category :"mobiles",
        image : samsung,
        description:
          "Sony headphones designed to provide clear sound and a comfortable listening experience."

    },
    {
        id : 3,
        name : "sony headphones",
        price : 8999,
        category : "Headphones",
        image : sony ,
        description:
          "Dell laptop suitable for everyday computing, work, study, and entertainment."
    },
    {
        id : 4,
        name : "dell laptop",
        price:89999,
        category :"Laptop",
        image : dell,
        description:
          "Dell laptop suitable for everyday computing, work, study, and entertainment."
  

    },
    {
        id: 5,
        name :"Apple watch",
        price:39999,
        category : "smart watch ",
        image : appleWatch,
        description:
        "Apple Watch with useful smart features, fitness tracking, and convenient notifications."
    }


];

export default products;