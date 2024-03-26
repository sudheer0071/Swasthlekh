import { atom } from "recoil";

export const navState = atom({
  key:"navState",
  default:true
})

export const load = atom({
  key:"laod",
  default:''
})

export const backendDown = atom({
  key:"backendDown",
  default:false
})