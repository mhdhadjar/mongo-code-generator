/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { ipcRenderer } = require("electron");

let currentCollection = "";

const hostInput = document.querySelector("#hostInput");
const portInput = document.querySelector("#portInput");
const connectButton = document.querySelector("#connectButton");
const disconnectButton = document.querySelector("#disconnectButton");
const databasesSelect = document.querySelector("#databasesSelect");
const collectionSelect = document.querySelector("#collectionSelect");
const codeBlock = document.querySelector(".code-wrapper pre code");
const codeTypeSelect = document.querySelector("#codeTypeSelect");

codeTypeSelect.addEventListener("change", () => {
    generateCode();
});

function setAsConnecting() {
    hostInput.disabled = true;
    portInput.disabled = true;
    connectButton.disabled = true;
    connectButton.innerHTML = "Connecting..."
    collectionSelect.innerHTML = ""
}

function setAsConnected() {
    databasesSelect.disabled = false;
    collectionSelect.innerHTML = "";
    databasesSelect.innerHTML = "";
    connectButton.innerHTML = "Connect";
    disconnectButton.style.display = "inline-block";
    connectButton.style.display = "none";
}

function setAsDisconnected() {
    hostInput.disabled = false;
    portInput.disabled = false;
    connectButton.disabled = false;
    connectButton.innerHTML = "Connect";
    connectButton.style.display = "inline-block";
    disconnectButton.style.display = "none";
    collectionSelect.innerHTML = "";
    databasesSelect.innerHTML = "";
}

connectButton.addEventListener("click", () => {
    ipcRenderer.send("connect-button-clicked", { host: hostInput.value || "localhost", port: portInput.value || "27017" });
    setAsConnecting();
});

disconnectButton.addEventListener("click", () => {
    setAsDisconnected();
});

function databaseSelectChanged(databaseName) {

    ipcRenderer.send("databases-select-changed", databaseName);
}

// function loadDatabases() {
//   ipcRenderer.send("request-databases", { database });
// }

ipcRenderer.on("system-settings-received", (e, data) => {
    hostInput.value = !data.host || data.host === "localhost" ? "" : data.host;
    portInput.value = !data.port || data.port === 27017 ? "" : data.port;
});

ipcRenderer.on("collections-received", (e, collectionsArray) => {
    if (!collectionsArray || collectionsArray.length === 0) {
        alert("No collections");
        return;
    }
    fillCollectionSelect(collectionSelect, collectionsArray);
});


ipcRenderer.on("code-received", (e, data) => {
    codeBlock.innerHTML = data.code || "";
});

ipcRenderer.on("error-in-getting-collections", (e, message) => {
    fillCollectionSelect(collectionSelect, [])
    alert(message);
});

function fillSelectFields(field, items) {
    field.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        var option = document.createElement("option");
        option.text = element;
        field.appendChild(option);
    }
}

function generateCode() {
    ipcRenderer.send("generate-code", {
        database: databasesSelect.value,
        collection: currentCollection,
        codeType: codeTypeSelect.value
    });
}

function fillCollectionSelect(field, items) {
    field.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        const collectionName = items[i];
        var option = document.createElement("a");
        option.text = collectionName;
        option.addEventListener("click", (e) => {
            currentCollection = collectionName;
            for (let i = 0; i < field.childNodes.length; i++)
                field.childNodes[i].classList.remove("current-collection");

            e.target.classList.add("current-collection");

            generateCode();
        });
        field.appendChild(option);
    }
}

ipcRenderer.on("schema-received", (e, schemaText) => {
    alert(schemaText);
});

ipcRenderer.on("databases-received", (e, databasesArray) => {
    if (databasesArray.length === 0) {
        alert("Unable to connect!");
        return;
    }
    setAsConnected();
    fillSelectFields(databasesSelect, databasesArray);
    databaseSelectChanged(databasesArray[0]);
    databasesSelect.addEventListener("change", (e) => {
        databaseSelectChanged(e.target.value);
    });
});

ipcRenderer.on("connection-failed", (e, message) => {
    setAsDisconnected();
    alert(message);
});


ipcRenderer.on("show-alert", (e, message) => {
    alert(message);
});

