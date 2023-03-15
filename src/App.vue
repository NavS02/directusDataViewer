<template>
  <section>
    <!-- LOGIN FORM -->
    <div class="topnav">
      <div class="login-container">
        <!-- ADD SOME ALERT IF DIRECTUS IP/USR/PSW IS NOT CORRECT -->
        <h2>Directus data Viewer</h2>
        <input type="text" placeholder="IP:PORT" id="ip"/>
        <input type="text" placeholder="Username" id="usr"/>
        <input type="password" placeholder="Password" id="psw"/>
        <button @click="loginUser">Login</button>
      </div>
    </div>
    <!-- SIDEBAR WITH ALL COLLECTIONS -->
    <div style="margin-top: 150px">
      <div class="sidebar">
        <ul>
          <li
            v-for="(tableList, index) in tablesList"
            :key="index"
            @click="getData(tableList)"
            id="tableList"
          >
            <a>{{ tableList }}</a>
          </li>
        </ul>
      </div>
      <!-- TABLE WITH ALL DATA -->
      <div v-if="tableName.length > 0">
        <h1>Table: {{ tableName }}</h1>
        <input
          id="filterBar"
          v-on:keyup="filterTable()"
          type="text"
          class="filterBar"
          placeholder="Filter"
        />&#128270;

        <p id="showData"></p>
      </div>
    </div>
  </section>
</template>

<script>
import { getDataTable, getCollectionNames, login } from "./main";
var filter = "";
export default {
  data() {
    return {
      tableName: "",
      tablesList: [],
    };
  },
  methods: {
    // TAKES THE VALUE OF LOGIN FORM
    loginUser() {
      let usr = document.getElementById("usr").value;
      let ip = document.getElementById("ip").value;
      let psw = document.getElementById("psw").value;
      login(ip, usr, psw);
      this.getCollections();
      return { ip, usr, psw };
    },
    // TAKES THE NAME OF EACH COLLECTION
    getCollections() {
      this.tablesList = [];

      getCollectionNames().then((result) => {
        for (let i = 0; i < result.length; i++) {
          this.tablesList.push(result[i].collection);
        }

        return result;
      });
    },
    // TAKES THE DATA OF COLLECTION AND CREATES TABLE
    getData(table) {
      this.tableName = table.toUpperCase();

      getDataTable(table).then((result) => {
        let jsonData = JSON.stringify(result.data);

        // Convert JSON string to object.
        let data = JSON.parse(jsonData);

        let col = [];
        for (let i = 0; i < data.length; i++) {
          for (let key in data[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }

        // Create table.
        const table = document.createElement("table");
        table.setAttribute("id", "myTable");

        // Create table header row using the extracted headers above.
        let tr = table.insertRow(-1); // table row.
        tr.setAttribute("id", "tableHeader"); // add id to header row

        for (let i = 0; i < col.length; i++) {
          let th = document.createElement("th"); // table header.
          th.innerHTML = col[i];
          tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (let i = 0; i < data.length; i++) {
          tr = table.insertRow(-1);

          for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
          }
        }

        // Now, add the newly created table with json data, to a container.
        const divShowData = document.getElementById("showData");
        divShowData.innerHTML = "";
        divShowData.appendChild(table);

        return result;
      });
    },
    filterTable() {
      var input, found, table, tr, td, i, j;
      input = document.getElementById("filterBar");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
          if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
            found = true;

            td[j].style.backgroundColor = "yellow"; //  HIGHLIGHT MATCH
          } else {
            td[j].style.backgroundColor = ""; // QUIT HIGLIGHT
          }
          if (filter.length == 0) {
            td[j].style.backgroundColor = ""; // IF THERE IS NO FILTER,NO HIGHLIGHT
          }
        }
        if (found) {
          tr[i].style.display = "";
          found = false;
        } else {
          tr[i].style.display = "none";
        }
      }
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  font-family: "Jost", sans-serif;
}
body {
  margin: 0;
}
header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 3rem auto;
  border-radius: 10px;
  padding: 1rem;
  background-color: #58004d;
  color: white;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}
#app ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
#app li {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}
#app h1 {
  font-size: 2rem;
  border-bottom: 4px solid #ccc;
  color: #58004d;
  margin-left: 400px;
}

#showData {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-left: 400px;
}

#showData td,
#showData th {
  border: 1px solid #ddd;
  padding: 8px;
}

#showData tr:nth-child(even) {
  background-color: #f2f2f2;
}

#showData tr:hover {
  background-color: #ddd;
}

#showData th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04aa6d;
  color: white;
}

.sidebar {
  background-color: #e9e9e9;
  height: 100%;
  position: fixed;
  margin-top: 105px;
  left: 0;
  top: 0;
  overflow-x: hidden;
  padding-top: 20px;
}

.sidebar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  margin-bottom: 8px;
}

.sidebar li a {
  display: block;
  color: #000;
  padding: 8px 16px;
  text-decoration: none;
}

.sidebar li:hover {
  background-color: #e1f0d3;
  color: #fff;
}

* {
  box-sizing: border-box;
}

/* Style the navbar */
.topnav {
  overflow: hidden;
  background-color: #e9e9e9;
  position: fixed; /* Set the navbar to fixed position */
  width: 100%;
  margin-top: -150px;
}

/* Navbar links */
.topnav a {
  float: left;
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

/* Navbar links on mouse-over */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

/* Active/current link */
.topnav a.active {
  background-color: #2196f3;
  color: white;
}

/* Style the input container */
.topnav .login-container {
  float: right;
}

/* Style the input field inside the navbar */
.topnav input {
  padding: 6px;
  margin-top: 8px;
  font-size: 17px;
  border: none;
  width: 150px; /* adjust as needed (as long as it doesn't break the topnav) */
}

/* Style the button inside the input container */
.topnav .login-container button {
  float: right;
  padding: 6px;
  margin-top: 8px;
  margin-right: 16px;
  background: #ddd;
  font-size: 17px;
  border: none;
  cursor: pointer;
}

.topnav .login-container button:hover {
  background: #ccc;
}

/* Add responsiveness - On small screens, display the navbar vertically instead of horizontally */
@media screen and (max-width: 600px) {
  .topnav .login-container {
    float: none;
  }
  .topnav a,
  .topnav input,
  .topnav .login-container button {
    float: none;
    display: block;
    text-align: left;
    width: 100%;
    margin: 0;
    padding: 14px;
  }
  .topnav input {
    border: 1px solid #ccc;
  }
}
.filterBar {
  margin-left: 400px;
}
</style>