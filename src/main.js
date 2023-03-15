/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import { createApp } from "vue";
import { Directus } from "@directus/sdk";
import App from "./App.vue";

var dataF;
var directus = null;
var username = null;
var passwordU = null;
var ipDirectus = null;
// CREATE VUE APP
const app = createApp(App);
// CONFIG OF DIRECTUS CONNECTION
const config = {
  auth: {
    mode: "json",
    autoRefresh: true,
    msRefreshBeforeExpires: 30000,
  },
  storage: {
    prefix: "",
    mode: "LocalStorage",
  },
  transport: {
    params: {},
    headers: {
      // set the Authorization header with the token value
      Authorization: `Bearer ${localStorage.getItem("directus_token")}`,
      refresh_token: localStorage.getItem("directus_refresh_token"),
    },
    onUploadProgress: (ProgressEvent) => {},
    maxBodyLength: null,
    maxContentLength: null,
  },
};

function login(ip, usr, pass) {

  username = usr;
  passwordU = pass;
  ipDirectus = ip;


  directus = new Directus("http://" + ipDirectus + "/", config);

}

async function authentication() {
  let authenticated = false;
  try {
    // Try to authenticate with token if exists
    await directus.auth.refresh();
    authenticated = true;
  } catch (error) {
    console.log("Error refreshing authentication token",error);
  }

  // Let's login in case we don't have token or it is invalid / expired
  try{
    const email = username;
    const password = passwordU;
  
    await directus.auth.login({ email, password });
    authenticated = true;
  }catch(error){
    alert("invalid data")
  }
 
}
// RETURN THE DATA INSIDE THE COLLECTION
async function getDataTable(table) {
  await authentication();

  const privateDataFoto = await directus
    .items(table)
    .readByQuery({ sort: ["id"] });
  dataF = privateDataFoto;

  return dataF;
}
// TAKES THE NAME OF EACH COLLECTION
async function getCollectionNames() {
  await authentication();

  const collectionNames = await directus.collections.readAll();

  return collectionNames.data;
}

export { getDataTable, getCollectionNames, login };

app.mount("#app");
