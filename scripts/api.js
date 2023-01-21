class Api {
  constructor(name) {
    this.url = "https://sb-cats.herokuapp.com/api/2/";
    this.name = name;
  }
  getCats() {
    return fetch(`${this.url}${this.name}/show`);
  }
  getCat(id) {
    return fetch(`${this.url}${this.name}/show/${id}`);
  }
  getIds() {
    return fetch(`${this.url}${this.name}/ids`);
  }
  addCat(body) {
    return fetch(`${this.url}${this.name}/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  updCat(id, body) {
    return fetch(`${this.url}${this.name}/update/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  delCat(id) {
    return fetch(`${this.url}${this.name}/delete/${id}`, {
      method: "DELETE",
    });
  }
}
