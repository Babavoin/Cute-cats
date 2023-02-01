let main = document.querySelector("main");
const api = new Api("natalia_biryukova"); // мое уникальное имя!! Использовать свое!
let cat = {};
let changeCat = false;
const openCat = document.querySelector(".open_cat");

const updCards = function (data) {
  main.innerHTML = "";
  data.forEach(function (cat, i) {
    if (cat.id) {
      let card = `<div  class="${
        cat.favourite ? "card like" : "card "
      }" id="cat${cat.id}" style="background-image:
    url(${cat.img_link || "images/cat.jpg"}); ${
        i === 8 ? "background-position: top" : ""
      }">
    <span class="cat_name">${cat.name}</span>
    </div>`;
      main.innerHTML += card;
    }
  });

  const cards = document.getElementsByClassName("card");
  if (getCookie("login")) {
    document.getElementById("user-name").innerHTML = getCookie("login");
    Array.from(cards).forEach((card) => {
      card.addEventListener("mouseover", () => {
        card.className = card.className.replace("card", "cardd");
      });
      card.addEventListener(
        "mouseout",
        () => (card.className = card.className.replace("cardd", "card"))
      );
      card.addEventListener("click", (event) => {
        cat = data.filter((e) => e.id == event.target.id.replace("cat", ""))[0];
        openCatInnerHTML();
      });
    });
  }

  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";
  }
};

const openCatInnerHTML = () => {
  openCat.innerHTML = `<div class="open" style="background: 
url(${cat.img_link || "images/cat.jpg"}) center/contain no-repeat;" >
<div id="info">${
    changeCat
      ? ` 
Имя<input class="changeInps" id="name" placeholder="${cat.name}" /> 
Возраст<input class="changeInps" id="age" placeholder="${cat.age}" />  
Рейтинг <input class="changeInps" id="rate" placeholder="${cat.rate}" />
<i id="check" class="fa-solid fa-check"></i>`
      : `id${cat.id}
Имя ${cat.name},  Возраст ${cat.age},  Рейтинг ${cat.rate} 
<br>${cat.description ? `Описание: ${cat.description}` : ""} 
${cat.favourite ? `<div style="color:red">❤</div>` : ""}`
  }
<div style="cursor: pointer">
<i id="change" class="fa-solid fa-pen"></i>
<i id="delete" class="fa-solid fa-trash"></i>
<i id="close" class="fa-solid fa-circle-xmark"></i></div>
</div>
</div>`;
  openCat.style.display = "flex";
  document.getElementById("close").addEventListener("click", () => {
    changeCat = false;
    openCat.style.display = "none";
  });
  document.getElementById("delete").addEventListener("click", del);
  document.getElementById("change").addEventListener("click", change);
  document.getElementById("check").addEventListener("click", () => {
    ["name", "age", "rate"].forEach((e) => {
      const inputCat = document.getElementById(e).value;
      cat[e] = inputCat;
    });
    catsData.forEach((e, i) => {
      e.id === cat.id ? (catsData[i] = cat) : null;
    });
    api.updCat(cat.id, cat);
    localStorage.setItem("cats", JSON.stringify(catsData));
    updCards(catsData);
    change();
  });
};
const change = () => {
  changeCat = !changeCat;
  openCatInnerHTML();
};
const del = () => {
  document.querySelector(".del_warning").style.display = "flex";
  document.getElementById("no").addEventListener("click", () => {
    document.querySelector(".del_warning").style.display = "none";
  });
  document.getElementById("yes").addEventListener("click", (e) => {
    const newCatsData = catsData.filter((e) => e.id !== cat.id);
    api.delCat(cat.id);
    localStorage.setItem("cats", JSON.stringify(newCatsData));
    updCards(newCatsData);
    openCat.style.display = "none";
    document.querySelector(".del_warning").style.display = "none";
    changeCat = false;
  });
};

let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getCats = function (api, store) {
  if (!store.length) {
    api
      .getCats()
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
        }
      });
  } else {
    updCards(store);
  }
};
getCats(api, catsData);

let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
if (!getCookie("login")) {
  addBtn.style.display = "none";
}
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
});
closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
});

let form = document.forms[0];
form.img_link.addEventListener("change", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});
form.img_link.addEventListener("input", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let body = {};
  for (let i = 0; i < form.elements.length; i++) {
    let inp = form.elements[i];
    if (inp.type === "checkbox") {
      body[inp.name] = inp.checked;
    } else if (inp.name && inp.value) {
      if (inp.type === "number") {
        body[inp.name] = +inp.value;
      } else {
        body[inp.name] = inp.value;
      }
    }
  }

  api
    .addCat(body)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "ok") {
        form.reset();
        closePopupForm.click();
        api
          .getCat(body.id)
          .then((res) => res.json())
          .then((cat) => {
            if (cat.message === "ok") {
              catsData.push(cat.data);
              localStorage.setItem("cats", JSON.stringify(catsData));

              getCats(api, catsData);
            } else {
              console.log(cat);
            }
          });
      } else {
        console.log(data);
        api
          .getIds()
          .then((r) => r.json())
          .then((d) => console.log(d));
      }
    });
});

function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const enterBtn = document.querySelector("#enterBtn");
const pwl = document.querySelector(".popup-wrapper-login");

const submitBtn = document.querySelector(".submitBtn");
submitBtn.addEventListener("click", () => {
  const inps = document.querySelector("#login").value;
  setCookie("login", inps);

  location.reload();
});

const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", () => {
  pwl.style.display = "none";
});
enterBtn.addEventListener("click", () => {
  pwl.style.display = "flex";
});
