import { LoginPage, IndexPage, ViewCartPage } from "../pages"

export interface IViewCartPages {
    loginPage : LoginPage,
    indexPage : IndexPage,
    viewCartPage : ViewCartPage
}

export interface ICartItem {
    title : string,
    description : string,
    price : string
}